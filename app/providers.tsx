"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { getConfig } from "@/lib/monad";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={getConfig()}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}