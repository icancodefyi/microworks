"use client";

import { createContext, useContext, useCallback, useEffect, useState, useMemo } from "react";
import type { ReactNode } from "react";
import type { Chain } from "viem";
import { useSwitchChain } from "wagmi";
import { monadTestnet, monadMainnet } from "@/lib/monad";

export type NetworkId = "testnet" | "mainnet";

export type NetworkInfo = {
  id: NetworkId;
  label: string;
  shortLabel: string;
  chain: Chain;
  chainId: number;
  contractAddress: `0x${string}`;
  explorer: string;
  testnet: boolean;
};

export const NETWORKS: Record<NetworkId, NetworkInfo> = {
  testnet: {
    id: "testnet",
    label: "Monad Testnet",
    shortLabel: "TESTNET",
    chain: monadTestnet,
    chainId: monadTestnet.id,
    contractAddress: "0x26e67271c65ac40d419dffe8d6ad7ffcb2755237",
    explorer: "https://testnet.monadexplorer.com",
    testnet: true,
  },
  mainnet: {
    id: "mainnet",
    label: "Monad Mainnet",
    shortLabel: "MAINNET",
    chain: monadMainnet,
    chainId: monadMainnet.id,
    contractAddress: "0x61ab6619031b483139ada409955c2dcd01579ed7",
    explorer: "https://monadscan.com",
    testnet: false,
  },
};

const STORAGE_KEY = "mw-network";

type NetworkContextValue = {
  network: NetworkInfo;
  setNetwork: (id: NetworkId) => void;
};

const NetworkContext = createContext<NetworkContextValue>({
  network: NETWORKS.testnet,
  setNetwork: () => {},
});

export function NetworkProvider({ children }: { children: ReactNode }) {
  const { switchChain } = useSwitchChain();
  const [networkId, setNetworkId] = useState<NetworkId>("testnet");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (saved === "testnet" || saved === "mainnet") {
      const id = saved;
      setTimeout(() => setNetworkId(id), 0);
    }
  }, []);

  const setNetwork = useCallback(
    (id: NetworkId) => {
      setNetworkId(id);
      try {
        window.localStorage.setItem(STORAGE_KEY, id);
      } catch {
        /* ignore */
      }
      try {
        switchChain({ chainId: NETWORKS[id].chainId });
      } catch {
        /* wallet not connected / rejected — reads still target the chain explicitly */
      }
    },
    [switchChain],
  );

  const value = useMemo(
    () => ({ network: NETWORKS[networkId], setNetwork }),
    [networkId, setNetwork],
  );

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useNetwork() {
  return useContext(NetworkContext);
}