process.loadEnvFile("contracts/.env");
import { createPublicClient, http, defineChain, formatEther } from "viem";
import { readFileSync } from "node:fs";

const chain = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: { default: { http: ["https://testnet-rpc.monad.xyz"] } },
  testnet: true,
});
const pc = createPublicClient({ chain, transport: http() });
const { abi } = JSON.parse(readFileSync("contracts/out/MicroTask.sol/MicroTask.json", "utf8"));
const addr = process.env.CONTRACT_ADDRESS;

const KINDS = ["options", "yesno", "rating", "text"];

async function readTask(id) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await pc.readContract({
        address: addr,
        abi,
        functionName: "getTask",
        args: [BigInt(id)],
      });
    } catch (e) {
      if (attempt > 4) throw e;
      await new Promise((r) => setTimeout(r, 800));
    }
  }
}

const count = Number(await pc.readContract({ address: addr, abi, functionName: "taskCount" }));
console.log(`Contract: ${addr}\nTotal tasks: ${count}\n`);
for (let i = 0; i < count; i++) {
  const t = await readTask(i);
  const kind = KINDS[Number(t.kind)] ?? "?";
  const remaining = Number(t.frameCount) - Number(t.completed);
  console.log(
    `#${i}  [${kind}]  ${t.active ? "LIVE " : "CLOSED"}  completed ${String(t.completed)}/${String(t.frameCount)} (${remaining} left, ${String(t.rejected)} rejected)  +${formatEther(t.reward)} MON  "${t.title}"`,
  );
}