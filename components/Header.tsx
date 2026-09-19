"use client";

import Link from "next/link";
import { useAccount, useConnect, useDisconnect, useReadContract } from "wagmi";
import { MicroworksLogo } from "@/components/brand/microworks-logo";
import {
  IconArrowLeft,
  IconWallet,
  IconFlame,
  IconBolt,
} from "@tabler/icons-react";
import { CONTRACT_ABI } from "@/lib/abi";
import { CONTRACT_ADDRESS, EXPLORER } from "@/lib/constants";

export default function Header() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const connector = connectors[0];

  const { data: pointsData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "points",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 4000 },
  });

  const { data: winData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "winStreak",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 4000 },
  });

  const xp = Number(pointsData ?? 0n);
  const winStreak = Number(winData ?? 0);

  const shortAddress = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : "";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/90 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3.5 py-2.5 sm:px-6">
        {/* Left: Brand & Return link */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/"
            aria-label="Microworks Home"
            className="flex items-center hover:opacity-85 transition-opacity"
          >
            <MicroworksLogo markSize={24} textClassName="text-stone-900" />
          </Link>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1 pl-3 border-l border-stone-200 text-xs font-mono text-stone-500 hover:text-stone-900 transition-colors uppercase tracking-wider"
          >
            <IconArrowLeft size={13} />
            <span>Landing</span>
          </Link>
        </div>

        {/* Center: Live Arcade HUD Pills (XP & Streak) */}
        {isConnected && address ? (
          <div className="flex items-center gap-2">
            {/* XP Pill */}
            <div className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50/80 px-2.5 py-1 font-mono text-xs shadow-2xs">
              <span className="flex h-4 w-4 items-center justify-center rounded-md bg-[#2977ff]/15 text-[#2977ff]">
                <IconBolt size={11} />
              </span>
              <span className="font-bold text-stone-900">{xp}</span>
              <span className="text-[10px] text-stone-400 font-semibold">XP</span>
            </div>

            {/* Streak Combo Pill */}
            {winStreak > 0 && (
              <div className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1 font-mono text-xs text-rose-700 shadow-2xs">
                <IconFlame size={13} className="text-rose-600 animate-pulse" />
                <span className="font-bold">x{winStreak}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-stone-200 bg-stone-50 text-stone-700 text-xs font-mono">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-semibold text-stone-800">Monad Testnet</span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-500">1.2s Finality</span>
          </div>
        )}

        {/* Right: Wallet Connect / Worker Profile */}
        <div className="flex items-center gap-2.5">
          {isConnected && address ? (
            <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-stone-700">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="font-mono text-xs font-bold">{shortAddress}</span>
              <button
                type="button"
                onClick={() => disconnect()}
                className="text-[10px] font-mono text-stone-400 hover:text-stone-700 transition-colors uppercase ml-1 cursor-pointer"
                title="Disconnect"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => connector && connect({ connector })}
              className="btn-arcade-blue inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wider"
            >
              <IconWallet size={14} />
              <span>Connect</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}