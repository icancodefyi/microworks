process.loadEnvFile("contracts/.env");
import { createPublicClient, http, defineChain } from "viem";
import { readFileSync } from "node:fs";

const chain = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: { default: { http: ["https://testnet-rpc.monad.xyz"] } },
  testnet: true,
});
const pc = createPublicClient({ chain, transport: http() });
const abi = JSON.parse(
  readFileSync("contracts/out/MicroTask.sol/MicroTask.json", "utf8"),
).abi;
const addr = process.env.CONTRACT_ADDRESS;
const [addrs, pts, wins, days] = await pc.readContract({
  address: addr,
  abi,
  functionName: "getLeaderboard",
  args: [20n],
});
console.log("rows:", addrs.length);
addrs.forEach((a, i) =>
  console.log(`${i + 1}. ${a.slice(0, 6)}…${a.slice(-4)}  XP=${pts[i]}  win=${wins[i]}  day=${days[i]}`),
);