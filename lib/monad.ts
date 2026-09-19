import { defineChain, http } from "viem";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

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

const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ??
  "demo-placeholder-project-id";

export function getConfig() {
  return getDefaultConfig({
    appName: "Microworks",
    projectId: WALLETCONNECT_PROJECT_ID,
    chains: [monadTestnet, monadMainnet],
    transports: {
      [monadTestnet.id]: http(),
      [monadMainnet.id]: http(),
    },
  });
}