// deploy-mainnet.mjs — Deploy MicroTask to Monad MAINNET (chain id 143).
// Does NOT touch lib/constants.ts: the live demo keeps pointing at the testnet
// contract so judges can play with free faucet MON. This is the "deployed on
// Monad Mainnet" artifact.
//
// Requires contracts/.env: PRIVATE_KEY (funded with real mainnet MON).
// Run: node scripts/deploy-mainnet.mjs

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createPublicClient, createWalletClient, http, formatEther, defineChain } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ENV_PATH = resolve(ROOT, "contracts/.env");
const ARTIFACT_PATH = resolve(ROOT, "contracts/out/MicroTask.sol/MicroTask.json");

if (existsSync(ENV_PATH)) process.loadEnvFile(ENV_PATH);

const RPC = process.env.MAINNET_RPC_URL ?? "https://rpc.monad.xyz";
const EXPLORER = "https://monadscan.com";
const MAINNET = defineChain({
  id: 143,
  name: "Monad Mainnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: { default: { http: [RPC] } },
  testnet: false,
  blockExplorers: { default: { name: "MonadScan", url: EXPLORER } },
});

const PRIVATE_KEY = (process.env.PRIVATE_KEY ?? "").replace(/^0x/i, "");
const minGas = 50_000_000_000_000_000n; // 0.05 MON floor for deploy gas

if (!PRIVATE_KEY) {
  console.error("Missing PRIVATE_KEY in contracts/.env");
  process.exit(1);
}

const { abi, bytecode } = JSON.parse(readFileSync(ARTIFACT_PATH, "utf8"));

const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);
const publicClient = createPublicClient({ chain: MAINNET, transport: http(RPC, { timeout: 20000 }) });
const walletClient = createWalletClient({ account, chain: MAINNET, transport: http(RPC, { timeout: 20000 }) });

async function main() {
  console.log("=== MicroTask - Monad MAINNET deploy ===\n");
  console.log(`Deployer: ${account.address}`);
  const bal = await publicClient.getBalance({ address: account.address });
  console.log(`Balance : ${formatEther(bal)} MON (mainnet, real funds)`);
  if (bal < minGas) {
    console.error(`\nNOT READY - need >= ${formatEther(minGas)} MON for gas.`);
    console.error(`Fund ${account.address} with real MON, then run this again.`);
    process.exit(2);
  }

  console.log("\nDeploying MicroTask on mainnet...");
  const hash = await walletClient.deployContract({ abi, bytecode: bytecode.object ?? bytecode });
  console.log(`Tx: ${hash}`);

  const receipt = await publicClient.waitForTransactionReceipt({ hash, timeout: 120000 });
  if (receipt.status !== "success") {
    console.error("Deploy transaction reverted");
    process.exit(1);
  }
  const address = receipt.contractAddress;
  console.log(`\nCONTRACT ADDRESS: ${address}`);
  console.log(`Explorer: ${EXPLORER}/address/${address}`);
  console.log(`\nThe demo app stays on testnet (free to play).`);
  console.log(`Next: publish the source on MonadScan -> Verify, solc 0.8.24, no constructor args, single file.`);
}

main().catch((e) => {
  console.error("\nDeploy error:", e?.shortMessage ?? e.message ?? e);
  process.exit(1);
});