import { defineChain, http } from "viem";
import { createConfig, injected } from "wagmi";

export const monadTestnet = defineChain({
  id: 10_143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "Monad Testnet Explorer",
      url: "https://testnet.monadexplorer.com",
    },
  },
  testnet: true,
});

export const monadMainnet = defineChain({
  id: 143,
  name: "Monad Mainnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: { name: "MonadScan", url: "https://monadscan.com" },
  },
  testnet: false,
});

export function getConfig() {
  return createConfig({
    chains: [monadTestnet, monadMainnet],
    transports: {
      [monadTestnet.id]: http(),
      [monadMainnet.id]: http(),
    },
    connectors: [injected()],
    ssr: true,
  });
}