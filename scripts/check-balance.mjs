import { createPublicClient, http, formatEther } from "viem";

const TEAM_WALLET = "0x225BAa4D33dD7c5b745085095Aa758bb6A958474";

const chains = [
  {
    name: "Monad Testnet",
    id: 10143,
    rpc: "https://testnet-rpc.monad.xyz",
  },
  {
    name: "Monad Mainnet",
    id: 143,
    rpc: "https://rpc.monad.xyz",
  },
];

const checkWithTimeout = (promise, ms = 15000) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`timed out after ${ms}ms`)), ms)
    ),
  ]);

for (const chain of chains) {
  try {
    const client = createPublicClient({
      chain: { id: chain.id, name: chain.name },
      transport: http(chain.rpc),
    });
    const balance = await checkWithTimeout(
      client.getBalance({ address: TEAM_WALLET })
    );
    console.log(
      `${chain.name.padEnd(14)} (${chain.id}): ${formatEther(balance)} MON`
    );
  } catch (err) {
    console.log(`${chain.name.padEnd(14)} (${chain.id}): ERROR — ${err.message}`);
  }
}