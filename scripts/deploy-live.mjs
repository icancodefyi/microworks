// deploy-live.mjs — Deploy MicroTask to Monad testnet from the key in contracts/.env,
// then wire the deployed address into the app (lib/constants.ts).
//
// Requires contracts/.env: PRIVATE_KEY (funded with testnet MON).
// Run: node scripts/deploy-live.mjs

import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  createPublicClient,
  createWalletClient,
  http,
  formatEther,
  defineChain,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ENV_PATH = resolve(ROOT, "contracts/.env");
const ARTIFACT_PATH = resolve(ROOT, "contracts/out/MicroTask.sol/MicroTask.json");
const CONSTANTS_PATH = resolve(ROOT, "lib/constants.ts");

if (existsSync(ENV_PATH)) process.loadEnvFile(ENV_PATH);

const RPC = process.env.RPC_URL ?? "https://testnet-rpc.monad.xyz";
const EXPLORER = "https://testnet.monadexplorer.com";
const MONAD = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: { default: { http: [RPC] } },
  testnet: true,
});

const PRIVATE_KEY = (process.env.PRIVATE_KEY ?? "").replace(/^0x/i, "");
const minGas = 50_000_000_000_000_000n; // 0.05 MON floor for deploy gas

if (!PRIVATE_KEY) {
  console.error("Missing PRIVATE_KEY in contracts/.env");
  process.exit(1);
}

const { abi, bytecode } = JSON.parse(readFileSync(ARTIFACT_PATH, "utf8"));

const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);
const publicClient = createPublicClient({ chain: MONAD, transport: http(RPC, { timeout: 20000 }) });
const walletClient = createWalletClient({ account, chain: MONAD, transport: http(RPC, { timeout: 20000 }) });

async function main() {
  console.log(`Deployer: ${account.address}`);
  const bal = await publicClient.getBalance({ address: account.address });
  console.log(`Balance : ${formatEther(bal)} MON`);
  if (bal < minGas) {
    console.error(`\nNOT READY — need >= ${formatEther(minGas)} MON for gas.`);
    console.error(`Fund the wallet above with >= 1 MON from MetaMask (Send → address → confirm).`);
    process.exit(2);
  }

  console.log("\nDeploying MicroTask...");
  const hash = await walletClient.deployContract({
    abi,
    bytecode: bytecode.object ?? bytecode,
  });
  console.log(`Tx: ${hash}`);

  const receipt = await publicClient.waitForTransactionReceipt({ hash, timeout: 60000 });
  if (receipt.status !== "success") {
    console.error("Deploy transaction reverted");
    process.exit(1);
  }
  const address = receipt.contractAddress;
  console.log(`\nCONTRACT ADDRESS: ${address}`);
  console.log(`Explorer: ${EXPLORER}/address/${address}`);

  const constants = readFileSync(CONSTANTS_PATH, "utf8");
  const updated = constants.replace(
    /(CONTRACT_ADDRESS\s*=\s*\n?\s*")0x[0-9a-fA-F]{40}(")/,
    (_match, before, after) => before + address + after,
  );
  if (updated === constants) {
    console.warn("\nCould not auto-update lib/constants.ts (address line changed). Update manually.");
  } else {
    writeFileSync(CONSTANTS_PATH, updated);
    console.log("\nUpdated lib/constants.ts CONTRACT_ADDRESS.");
  }

  console.log(`\nDone. App is now live against the real contract.`);
  console.log(`Seed a demo task next with: node scripts/demo.mjs`);
}

main().catch((e) => {
  console.error("\nDeploy error:", e?.shortMessage ?? e.message ?? e);
  process.exit(1);
});