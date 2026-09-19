// seed-demo.mjs — Plant one demo task of each kind on Monad testnet.
//
//   Kind OPTIONS (30 frames, keyed to the /frames images shown in the UI)
//   Kind YESNO   (6 frames)
//   Kind RATING  (6 frames)
//   Kind TEXT    (8 frames)
//
// Run: node scripts/seed-demo.mjs

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
  keccak256,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

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

if (!PRIVATE_KEY || !CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
  console.error("Missing PRIVATE_KEY / CONTRACT_ADDRESS in contracts/.env");
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
const creatorClient = createWalletClient({ account: creator, chain: MONAD_TESTNET, transport: http(RPC) });

const optionHash = (opt) => keccak256(new Uint8Array([opt]));
const textHash = (s) => keccak256(new Uint8Array(new TextEncoder().encode(s.trim().toLowerCase())));

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function createTask({ title, description, category, kind, optionCount = 0, options = [], rewardPerFrame, frameCount, golden }) {
  const escrow = rewardPerFrame * BigInt(frameCount);
  const hash = await creatorClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "createTask",
    args: [title, description, category, kind, optionCount, options, rewardPerFrame, BigInt(frameCount), golden],
    value: escrow,
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (receipt.status !== "success") throw new Error(`createTask reverted: ${hash}`);
  const taskId = Number(
    await publicClient.readContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: "taskCount" }),
  ) - 1;
  console.log(`  #${taskId}: ${title}  escrow=${formatEther(escrow)} MON  tx=${hash.slice(0, 12)}…`);
  await delay(600);
  return taskId;
}

async function main() {
  console.log(`Creator: ${creator.address}`);
  console.log(`MicroTask: ${CONTRACT_ADDRESS}\n`);

  const reward = parseEther("0.01");

  // 1) OPTIONS — keys match the /frames images: frame % 3 => empty(2) person(0) vehicle(1)
  {
    const labels = ["Person", "Vehicle", "Empty"];
    const framePics = ["empty", "person", "vehicle"];
    const golden = [];
    for (let f = 0; f < 30; f++) {
      const pic = framePics[f % 3];
      const key = pic === "person" ? 0 : pic === "vehicle" ? 1 : 2;
      golden.push(optionHash(key));
    }
    await createTask({
      title: "Label 30 dashcam frames",
      description: "Label each frame as Person, Vehicle or Empty. The frame picture matches the correct answer — good luck!",
      category: "label",
      kind: 0,
      optionCount: labels.length,
      options: labels,
      rewardPerFrame: reward,
      frameCount: 30,
      golden,
    });
  }

  // 2) YESNO
  {
    const golden = [];
    for (let f = 0; f < 6; f++) golden.push(optionHash(Math.random() < 0.5 ? 0 : 1));
    await createTask({
      title: "Is this intersection safe?",
      description: "Yes or No — does this frame show a safe street intersection?",
      category: "verify",
      kind: 1,
      rewardPerFrame: reward,
      frameCount: 6,
      golden,
    });
  }

  // 3) RATING
  {
    const golden = [];
    for (let f = 0; f < 6; f++) golden.push(optionHash(Math.floor(Math.random() * 5)));
    await createTask({
      title: "Rate video quality 1-5",
      description: "How clear is this frame? 1 = unusable, 5 = perfect.",
      category: "qa",
      kind: 2,
      rewardPerFrame: reward,
      frameCount: 6,
      golden,
    });
  }

  // 4) TEXT
  {
    const pool = ["clear", "blocked", "vehicle", "pedestrian"];
    const golden = [];
    for (let f = 0; f < 8; f++) golden.push(textHash(pool[f % pool.length]));
    await createTask({
      title: "Describe the scene in a word",
      description: "Type the word that best describes the scene in each frame. One word answers.",
      category: "caption",
      kind: 3,
      rewardPerFrame: reward,
      frameCount: 8,
      golden,
    });
  }

  const taskCount = await publicClient.readContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: "taskCount" });
  console.log(`\nDone. ${String(taskCount)} tasks seeded on ${CONTRACT_ADDRESS}`);
}

main().catch((e) => {
  console.error("\nSeed error:", e?.shortMessage ?? e.message ?? e);
  process.exit(1);
});