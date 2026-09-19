// seed-extras.mjs — Plant MORE fresh, un-answered demo tasks of each kind.
// Golden keys are matched to the /frames images so a human can actually win.
//
// Run: node scripts/seed-extras.mjs

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

// /frames SVGs cycle in this order by frameId % 3
const PICS = ["empty", "person", "vehicle"];

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

const picAt = (f) => PICS[f % PICS.length];
// map picture word -> option index for a given options list
const picToOptions = (labels) => ({
  person: Math.max(0, labels.findIndex((l) => /person|human|pedestrian/i.test(l))),
  vehicle: Math.max(0, labels.findIndex((l) => /veh|car|motor|truck/i.test(l))),
  empty: Math.max(0, labels.findIndex((l) => /empty|none|clear|road/i.test(l))),
});

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
  console.log(`  #${taskId}: ${title}   frames=${frameCount}  escrow=${formatEther(escrow)} MON  ${hash.slice(0, 12)}…`);
  await delay(500);
  return taskId;
}

async function main() {
  console.log(`MicroTask: ${CONTRACT_ADDRESS}\n`);
  const reward = parseEther("0.01");

  // ── OPTIONS tasks (golden keys match the images) ─────────────────────────
  {
    const labels = ["Pedestrian", "Vehicle", "Empty"];
    const map = picToOptions(labels); // person->0, vehicle->1, empty->2
    const golden = PICS.map(() => null); // placeholder length
    const g = [];
    for (let f = 0; f < 20; f++) g.push(optionHash(map[picAt(f)]));
    await createTask({
      title: "Detect pedestrians on the road",
      description: "For each dashcam frame: is there a Pedestrian, a Vehicle, or is it Empty? The picture matches the correct answer.",
      category: "label",
      kind: 0,
      optionCount: labels.length,
      options: labels,
      rewardPerFrame: reward,
      frameCount: 20,
      golden: g,
    });
  }

  {
    const labels = ["Human", "Motor", "None"];
    const map = picToOptions(labels);
    const g = [];
    for (let f = 0; f < 20; f++) g.push(optionHash(map[picAt(f)]));
    await createTask({
      title: "Audit sensor footage",
      description: "Classify each sensor frame: Human, Motor (vehicle), or None. Pick the answer that matches the picture.",
      category: "qa",
      kind: 0,
      optionCount: labels.length,
      options: labels,
      rewardPerFrame: reward,
      frameCount: 20,
      golden: g,
    });
  }

  {
    const labels = ["Person", "Vehicle", "Empty"];
    const map = picToOptions(labels);
    const g = [];
    for (let f = 0; f < 60; f++) g.push(optionHash(map[picAt(f)]));
    await createTask({
      title: "Label 60 dashcam frames",
      description: "Big batch: label every frame as Person, Vehicle or Empty. Correct answers pay instantly — the picture matches!",
      category: "label",
      kind: 0,
      optionCount: labels.length,
      options: labels,
      rewardPerFrame: reward,
      frameCount: 60,
      golden: g,
    });
  }

  // ── YESNO task ────────────────────────────────────────────────────────────
  {
    const g = [];
    for (let f = 0; f < 10; f++) {
      const yes = picAt(f) === "vehicle";
      g.push(optionHash(yes ? 0 : 1));
    }
    await createTask({
      title: "Hazard check: does a vehicle appear?",
      description: "Yes / No — does this frame contain a vehicle (motorised road traffic)?",
      category: "verify",
      kind: 1,
      rewardPerFrame: reward,
      frameCount: 10,
      golden: g,
    });
  }

  // ── RATING task ───────────────────────────────────────────────────────────
  {
    const g = [];
    for (let f = 0; f < 10; f++) g.push(optionHash(f % 5));
    await createTask({
      title: "Road visibility score 1-5",
      description: "Rate how clearly visible this frame is: 1 = unusable, 5 = perfect telemetry.",
      category: "qa",
      kind: 2,
      rewardPerFrame: reward,
      frameCount: 10,
      golden: g,
    });
  }

  // ── TEXT task (golden word matches the image) ─────────────────────────────
  {
    const g = [];
    for (let f = 0; f < 12; f++) g.push(textHash(picAt(f)));
    await createTask({
      title: "Describe the frame in one word",
      description: "One word only: what is in this frame? Answer with: empty, person, or vehicle.",
      category: "transcribe",
      kind: 3,
      rewardPerFrame: reward,
      frameCount: 12,
      golden: g,
    });
  }

  // ── verify all are fresh (0 completed) ────────────────────────────────────
  const count = Number(
    await publicClient.readContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: "taskCount" }),
  );
  console.log(`\nTask audit (every task on ${CONTRACT_ADDRESS}):`);
  for (let i = 0; i < count; i++) {
    const t = await publicClient.readContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: "getTask", args: [BigInt(i)] });
    console.log(
      `  #${i}  kind=${t.kind}  completed=${String(t.completed)}/${String(t.frameCount)}  rejected=${String(t.rejected)}  active=${t.active}  "${t.title}"`,
    );
  }
}

main().catch((e) => {
  console.error("\nSeed error:", e?.shortMessage ?? e.message ?? e);
  process.exit(1);
});