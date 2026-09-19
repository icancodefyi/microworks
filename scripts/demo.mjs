// demo.mjs — Deploy a live demo task on Monad testnet and simulate workers.
//
// Requires contracts/.env (or shell env):
//   PRIVATE_KEY  — funded wallet that creates the task (has the MON)
//   CONTRACT_ADDRESS — deployed MicroTask address (set after deploy)
//
// The ABI is read straight from the forge build artifact so it can
// never drift from the deployed bytecode.
//
// Run: node scripts/demo.mjs

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
  formatEther,
  defineChain,
} from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";

const ENV_PATH = resolve(dirname(fileURLToPath(import.meta.url)), "../contracts/.env");
if (existsSync(ENV_PATH)) process.loadEnvFile(ENV_PATH);

const MONAD_TESTNET = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: { default: { http: ["https://testnet-rpc.monad.xyz"] } },
  testnet: true,
  blockExplorers: {
    default: { name: "Monad Explorer", url: "https://testnet.monadexplorer.com" },
  },
});

const RPC = process.env.RPC_URL ?? "https://testnet-rpc.monad.xyz";
const PRIVATE_KEY = process.env.PRIVATE_KEY?.replace(/^0x/i, "") ?? "";
const CONTRACT_ADDRESS = (process.env.CONTRACT_ADDRESS ?? "").toLowerCase();

const [
  ,
  ,
  taskArg,
] = process.argv;

if (!PRIVATE_KEY) {
  console.error("Missing PRIVATE_KEY in contracts/.env");
  process.exit(1);
}
if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
  console.error("Set CONTRACT_ADDRESS in contracts/.env (deploy first)");
  process.exit(1);
}

const artifact = JSON.parse(
  readFileSync(
    resolve(dirname(fileURLToPath(import.meta.url)), "../contracts/out/MicroTask.sol/MicroTask.json"),
    "utf8",
  ),
);
const ABI = artifact.abi;

const creator = privateKeyToAccount(`0x${PRIVATE_KEY}`);
const publicClient = createPublicClient({ chain: MONAD_TESTNET, transport: http(RPC) });
const creatorClient = createWalletClient({
  account: creator,
  chain: MONAD_TESTNET,
  transport: http(RPC),
});

const OPTION_LABELS = ["Person", "Vehicle", "Empty"];
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function rand(max) {
  return Math.floor(Math.random() * max);
}

async function main() {
  console.log(`Creator:          ${creator.address}`);
  console.log(`MicroTask:        ${CONTRACT_ADDRESS}`);
  const creatorBal = await publicClient.getBalance({ address: creator.address });
  console.log(`Creator balance:  ${formatEther(creatorBal)} MON`);
  const taskCount = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "taskCount",
  });
  console.log(`Existing taskCount: ${String(taskCount)}\n`);

  const title = "Label 30 dashcam frames";
  const description = "Label each frame: Person, Vehicle or Empty. Correct answers pay instantly on chain.";
  const category = "label";
  const rewardWei = parseEther("0.01");
  const frameCount = 30;

  const golden = new Map();
  for (let f = 0; f < frameCount; f++) golden.set(f, rand(OPTION_LABELS.length));

  const indices = [...golden.keys()].map(BigInt);
  const options = [...golden.values()];
  const escrow = rewardWei * BigInt(golden.size);

  console.log(`>> Creating task: "${title}"`);
  console.log(`   reward=${formatEther(rewardWei)} MON/frame  escrow=${formatEther(escrow)} MON  frames=${frameCount}`);

  const createHash = await creatorClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "createTask",
    args: [title, description, category, rewardWei, BigInt(frameCount), indices, options],
    value: escrow,
  });
  console.log(`   tx: ${createHash}`);
  const createReceipt = await publicClient.waitForTransactionReceipt({ hash: createHash });
  if (createReceipt.status !== "success") {
    console.error("  createTask reverted");
    process.exit(1);
  }

  const taskId = Number(
    await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "taskCount",
    }),
  ) - 1;
  console.log(`   taskId = ${taskId}\n`);

  const t = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "tasks",
    args: [BigInt(taskId)],
  });
  console.log(`Contract task #${taskId} -> reward=${formatEther(t[5])} MON bounty=${formatEther(t[6])} MON`);

  console.log(">> Funding 3 worker addresses...");
  const workers = [];
  for (let i = 0; i < 3; i++) {
    workers.push(privateKeyToAccount(generatePrivateKey()));
  }
  for (const w of workers) {
    const fundHash = await creatorClient.sendTransaction({ to: w.address, value: parseEther("0.05") });
    await publicClient.waitForTransactionReceipt({ hash: fundHash });
    console.log(`  funded ${w.address} (${fundHash.slice(0, 10)}…)`);
  }

  console.log("\n>> Submitting answers (80% correct, 20% wrong)...");
  let accepted = 0;
  let rejected = 0;
  let acceptedHash = "";
  let rejectedHash = "";

  for (let f = 0; f < frameCount; f++) {
    const worker = workers[f % workers.length];
    const correct = golden.get(f);
    const submit = Math.random() < 0.8 ? correct : (correct + 1 + rand(OPTION_LABELS.length - 1)) % OPTION_LABELS.length;
    const wc = createWalletClient({ account: worker, chain: MONAD_TESTNET, transport: http(RPC) });

    const hash = await wc.writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "submitAnswer",
      args: [BigInt(taskId), BigInt(f), submit],
    });
    await publicClient.waitForTransactionReceipt({ hash });

    if (submit === correct) {
      accepted++;
      acceptedHash = hash;
      console.log(`   #${String(f).padStart(2, "0")} ${submit === correct ? "ACCEPT" : "reject"} (${hash.slice(0, 10)}…)   ${OPTION_LABELS[submit]}`);
    } else {
      rejected++;
      rejectedHash = hash;
      console.log(`   #${String(f).padStart(2, "0")} REJECT (${hash.slice(0, 10)}…)  expected=${OPTION_LABELS[correct]} got=${OPTION_LABELS[submit]}`);
    }
    await delay(250);
  }

  console.log(`\n${"=".repeat(56)}`);
  console.log(`accepted=${accepted}  rejected=${rejected}`);
  console.log(`sample accept tx : ${acceptedHash}`);
  console.log(`sample reject tx: ${rejectedHash}`);

  const creatorAfter = await publicClient.getBalance({ address: creator.address });
  console.log(`creator balance  : ${formatEther(creatorAfter)} MON (was ${formatEther(creatorBal)} MON)`);

  const fees = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "accumulatedFees",
  });
  console.log(`protocol fees    : ${formatEther(fees)} MON`);

  const ticket = taskArg?.length ? taskArg : "—";
  console.log(`\nBuild-in-public tweet:\nhttps://x.com/intent/post?text=${encodeURIComponent(
    `microworks blitz demo — ${accepted} frames labeled, ${formatEther(fees)} MON in protocol fees 🎯 payouts landed sub-second. task=${taskId}`,
  )}`);
}
 
main().catch((e) => {
  console.error("\nDemo error:", e?.shortMessage ?? e.message ?? e);
  process.exit(1);
});