"use client";

import { useAccount, useConnect, useReadContract } from "wagmi";
import { CONTRACT_ABI } from "@/lib/abi";
import { useNetwork } from "@/lib/network";
import {
  levelForXp,
  badgesFor,
  XpLevels,
} from "@/lib/constants";
import {
  IconFlame,
  IconTrophy,
  IconWallet,
  IconSparkles,
  IconShieldCheck,
  IconBolt,
  IconArrowUpRight,
  IconDeviceGamepad2,
  IconPlayerPlay,
} from "@tabler/icons-react";

export default function PlayerHQ({
  onDeployClick,
  onQuickPlay,
}: {
  onDeployClick?: () => void;
  onQuickPlay?: () => void;
}) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const connector = connectors[0];
  const { network } = useNetwork();

  const { data: pointsData } = useReadContract({
    address: network.contractAddress,
    abi: CONTRACT_ABI,
    chainId: network.chainId,
    functionName: "points",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 4000 },
  });

  const { data: winData } = useReadContract({
    address: network.contractAddress,
    abi: CONTRACT_ABI,
    chainId: network.chainId,
    functionName: "winStreak",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 4000 },
  });

  const { data: dayData } = useReadContract({
    address: network.contractAddress,
    abi: CONTRACT_ABI,
    chainId: network.chainId,
    functionName: "dayStreak",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 4000 },
  });

  const xp = Number(pointsData ?? 0n);
  const winStreak = Number(winData ?? 0);
  const dayStreak = Number(dayData ?? 0);
  const levelTitle = levelForXp(xp);
  const badges = badgesFor(winStreak, dayStreak, xp);

  // Compute next tier progress
  const currentTierIndex = XpLevels.findIndex((l) => l.title === levelTitle);
  const currentTier = XpLevels[currentTierIndex] || XpLevels[0];
  const nextTier = XpLevels[currentTierIndex + 1];

  const progressPercent = nextTier
    ? Math.min(
        100,
        Math.max(
          0,
          Math.round(
            ((xp - currentTier.min) / (nextTier.min - currentTier.min)) * 100,
          ),
        ),
      )
    : 100;

  const xpNeeded = nextTier ? nextTier.min - xp : 0;

  if (!isConnected || !address) {
    return (
      <div id="player-hq" className="card-arcade overflow-hidden">
        {/* Arcade Title Strip */}
        <div className="flex items-center justify-between border-b border-stone-200/80 bg-stone-100/70 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#2977ff] text-white">
              <IconDeviceGamepad2 size={13} />
            </span>
            <span className="font-mono text-xs font-bold text-stone-800 uppercase tracking-wider">
              PLAYER 1 · ARCADE MODE
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            READY TO RUN
          </span>
        </div>

        {/* Guest Arcade Card */}
        <div className="p-5 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-b from-white to-stone-50/50">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#2977ff] uppercase tracking-wider">
              <span>DAILY MONAD RUN</span>
              <span>·</span>
              <span className="text-stone-700 font-semibold">+100 XP PER FRAME</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900">
              Ready to rack up micro-wins?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              Knock out frames in seconds on your phone or laptop. Grade answers against on-chain golden keys, trigger instant payouts, and climb the Top Run leaderboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => connector && connect({ connector })}
              className="btn-arcade-green inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-black uppercase tracking-wider shadow-md active:translate-y-1"
            >
              <IconWallet size={18} />
              <span>Connect MetaMask</span>
            </button>
            {onDeployClick && (
              <button
                type="button"
                onClick={onDeployClick}
                className="btn-arcade-white inline-flex items-center justify-center font-bold font-sans uppercase rounded-2xl px-5 py-3.5 text-xs text-stone-800"
              >
                <span>Deploy Quest</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="player-hq" className="card-arcade overflow-hidden">
      {/* Top Window Header */}
      <div className="flex items-center justify-between border-b border-stone-200/80 bg-stone-100/70 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#2977ff] text-white">
            <IconDeviceGamepad2 size={13} />
          </span>
          <span className="font-mono text-xs font-bold text-stone-800 uppercase tracking-wider">
            WORKER HQ · {levelTitle.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            LIVE ON MONAD
          </span>
        </div>
      </div>

      {/* Main Player Profile Grid */}
      <div className="p-5 sm:p-6 space-y-5 bg-gradient-to-b from-white to-stone-50/40">
        {/* Top Profile Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Rank Avatar Shield with 3D Bevel */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-stone-300 bg-gradient-to-b from-stone-100 to-stone-200 text-stone-800 shadow-[0_3px_0_#d6d3d1]">
              <IconTrophy size={28} className="text-[#2977ff]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm sm:text-base font-bold text-stone-900">
                  {address.slice(0, 6)}…{address.slice(-4)}
                </span>
                <a
                  href={`${network.explorer}/address/${address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-stone-400 hover:text-[#2977ff] transition-colors"
                  title="View on Monad Explorer"
                >
                  <IconArrowUpRight size={15} />
                </a>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 rounded-lg border border-[#2977ff]/30 bg-[#2977ff]/10 px-2.5 py-0.5 font-mono text-[11px] font-black uppercase tracking-wider text-[#2977ff]">
                  ⭐ RANK: {levelTitle}
                </span>
                <span className="font-mono text-xs text-stone-500 font-semibold">
                  Tier {currentTierIndex + 1} of {XpLevels.length}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Thumb-Friendly on mobile) */}
          <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
            {onDeployClick && (
              <button
                type="button"
                onClick={onDeployClick}
                className="btn-arcade-dark flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider"
              >
                <IconSparkles size={14} />
                <span>+ Deploy Quest</span>
              </button>
            )}
          </div>
        </div>

        {/* Player Stats Marquee: 3D Pushable Arcade Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* XP & Rank Meter */}
          <div className="rounded-2xl border border-stone-200 bg-white p-3.5 shadow-[0_3px_0_#e7e5e4] space-y-2 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-stone-500 font-bold uppercase">TOTAL SCORE</span>
              <span className="font-black text-stone-900 text-sm">{xp} XP</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-stone-100 border border-stone-200 overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#2977ff] to-blue-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 font-semibold">
              <span>{levelTitle}</span>
              <span>
                {nextTier ? `${xpNeeded} XP to ${nextTier.title}` : "MAX RANK"}
              </span>
            </div>
          </div>

          {/* Win Streak Combo */}
          <div className="rounded-2xl border border-stone-200 bg-white p-3.5 shadow-[0_3px_0_#e7e5e4] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-stone-500 uppercase">
                COMBO
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-100 text-rose-600 shadow-2xs">
                <IconFlame size={15} />
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-2xl font-black text-stone-900">
                x{winStreak}
              </span>
              <span className="font-mono text-xs text-rose-600 font-bold">
                {winStreak >= 3 ? "🔥 ON FIRE" : "streak"}
              </span>
            </div>
            <p className="font-mono text-[10px] text-stone-400 font-medium">
              +100 XP each hit
            </p>
          </div>

          {/* Daily Grind Streak */}
          <div className="rounded-2xl border border-stone-200 bg-white p-3.5 shadow-[0_3px_0_#e7e5e4] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-stone-500 uppercase">
                DAILY RUN
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100 text-amber-700 shadow-2xs">
                <IconBolt size={15} />
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-2xl font-black text-stone-900">
                {dayStreak}
              </span>
              <span className="font-mono text-xs text-amber-700 font-bold">
                {dayStreak === 1 ? "day streak" : "days streak"}
              </span>
            </div>
            <p className="font-mono text-[10px] text-stone-400 font-medium">
              Daily grind active
            </p>
          </div>

          {/* Active Badges */}
          <div className="rounded-2xl border border-stone-200 bg-white p-3.5 shadow-[0_3px_0_#e7e5e4] flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-stone-500 uppercase">
                BADGE PINS
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#2977ff]/10 text-[#2977ff] shadow-2xs">
                <IconShieldCheck size={15} />
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {badges.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 font-mono text-[10px] font-bold text-stone-800 shadow-2xs"
                >
                  {b}
                </span>
              ))}
            </div>
            <p className="mt-1 font-mono text-[10px] text-stone-400 font-medium">
              Unlocked achievements
            </p>
          </div>
        </div>

        {/* 7-Day Subway Surfers Style Streak Calendar (Mobile Daily Retention) */}
        <div className="rounded-2xl border border-stone-200 bg-stone-100/70 p-4 space-y-3 shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-400 text-amber-950 font-black text-xs shadow-2xs">
                🔥
              </span>
              <div>
                <h3 className="font-mono text-xs font-black text-stone-900 uppercase tracking-wider">
                  7-Day Monad Streak Calendar
                </h3>
                <p className="text-[11px] text-stone-500 font-sans">
                  Play daily on your phone to stack XP bonuses and unlock the Day 7 Mystery Vault.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-900">
                {dayStreak > 0 ? `🔥 Day ${dayStreak} Active` : "⚡ Day 1 Ready"}
              </span>
            </div>
          </div>

          {/* 7 Days Strip */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {[
              { day: 1, xp: 50, label: "Day 1" },
              { day: 2, xp: 75, label: "Day 2" },
              { day: 3, xp: 100, label: "Day 3" },
              { day: 4, xp: 125, label: "Day 4" },
              { day: 5, xp: 150, label: "Day 5" },
              { day: 6, xp: 200, label: "Day 6" },
              { day: 7, xp: 500, label: "Day 7", isVault: true },
            ].map((slot) => {
              const currentCycleDay = dayStreak > 0 ? ((dayStreak - 1) % 7) + 1 : 1;
              const isDone = dayStreak > 0 && slot.day < currentCycleDay;
              const isCurrent = slot.day === currentCycleDay;
              const isLocked = slot.day > currentCycleDay;

              return (
                <div
                  key={slot.day}
                  className={`relative flex flex-col items-center justify-between rounded-xl p-2.5 transition-all text-center ${
                    slot.isVault
                      ? "col-span-2 sm:col-span-1 bg-gradient-to-b from-amber-100 to-amber-200 border-2 border-amber-400 shadow-sm"
                      : isCurrent
                        ? "bg-white border-2 border-[#2977ff] shadow-md ring-2 ring-[#2977ff]/20"
                        : isDone
                          ? "bg-emerald-50 border border-emerald-200"
                          : "bg-white/80 border border-stone-200 opacity-75"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-[10px] font-black uppercase text-stone-500">
                      {slot.label}
                    </span>
                    {slot.isVault && (
                      <span className="text-[10px] font-black text-amber-800">🎁 VAULT</span>
                    )}
                  </div>

                  <div className="my-1 text-base">
                    {slot.isVault ? (
                      "👑"
                    ) : isDone ? (
                      "✅"
                    ) : isCurrent ? (
                      "🔥"
                    ) : (
                      "🪙"
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <span
                      className={`font-mono text-[11px] font-black ${
                        isCurrent
                          ? "text-[#2977ff]"
                          : isDone
                            ? "text-emerald-700"
                            : slot.isVault
                              ? "text-amber-900"
                              : "text-stone-700"
                      }`}
                    >
                      +{slot.xp} XP
                    </span>
                    <p className="text-[9px] font-mono font-bold text-stone-400 uppercase">
                      {isDone ? "Done" : isCurrent ? "Active" : isLocked ? "Locked" : "Ready"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily Missions Quick Checklist */}
          <div className="pt-2 border-t border-stone-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="font-mono text-[11px] font-bold text-stone-700 uppercase">
                Daily Objectives:
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                ✓ 1. Login to Monad (+25 XP)
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-stone-700 bg-white border border-stone-200 px-2 py-0.5 rounded-md">
                ⚡ 2. Complete 1 Frame (+100 XP)
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-stone-700 bg-white border border-stone-200 px-2 py-0.5 rounded-md">
                🔥 3. Reach 2x Combo (+50 XP)
              </span>
            </div>

            {onQuickPlay && (
              <button
                type="button"
                onClick={onQuickPlay}
                className="btn-arcade-blue shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                <span>Quick Play ▶</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
