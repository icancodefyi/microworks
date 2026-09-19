"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ABI } from "@/lib/abi";
import { useNetwork } from "@/lib/network";
import { badgesFor, levelForXp } from "@/lib/constants";
import { IconCrown, IconFlame, IconTrophy, IconMedal, IconArrowUpRight } from "@tabler/icons-react";

type Row = { addr: `0x${string}`; xp: number; win: number; day: number };

export default function Leaderboard() {
  const { address } = useAccount();
  const { network } = useNetwork();
  const { data } = useReadContract({
    address: network.contractAddress,
    abi: CONTRACT_ABI,
    chainId: network.chainId,
    functionName: "getLeaderboard",
    args: [20n],
    query: { refetchInterval: 4000 },
  });

  const rows: Row[] = (() => {
    if (!data) return [];
    const [addrs, pts, wins, days] = data as [
      `0x${string}`[],
      bigint[],
      number[],
      number[],
    ];
    return addrs
      .map((addr, i) => ({
        addr,
        xp: Number(pts[i]),
        win: Number(wins[i]),
        day: Number(days[i]),
      }))
      .filter((r) => r.addr !== "0x0000000000000000000000000000000000000000")
      .sort((a, b) => b.xp - a.xp);
  })().slice(0, 8);

  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <section id="leaderboard" className="card-arcade overflow-hidden">
      {/* Arcade Header Bar */}
      <div className="flex items-center justify-between border-b border-stone-200/80 bg-stone-100/70 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-400 text-amber-950 font-black text-xs shadow-2xs">
            🏆
          </span>
          <span className="font-mono text-xs font-black text-stone-800 uppercase tracking-wider">
            TOP RUN · HALL OF FAME
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          MONAD {network.shortLabel} RANKINGS
        </span>
      </div>

      {/* Main Content */}
      <div className="p-5 sm:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-700 shadow-2xs">
              <IconTrophy size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
                Hall of Fame & Leaderboard
              </h2>
              <p className="text-xs text-stone-500 font-mono">
                Top workers ranked by verified on-chain XP
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block font-mono text-xs text-stone-400">
            +100 XP / correct frame
          </span>
        </div>

        {rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50/50 px-5 py-12 text-center text-xs text-stone-400 font-mono">
            No workers recorded yet. Solve a frame to claim #1 on the leaderboard!
          </div>
        ) : (
          <div className="space-y-5">
            {/* Top-3 Podium Display (when 2 or more players exist) */}
            {top3.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {top3.map((podiumRow, idx) => {
                  const isFirst = idx === 0;
                  const isSecond = idx === 1;
                  const isThird = idx === 2;
                  const isMe = address?.toLowerCase() === podiumRow.addr.toLowerCase();
                  const badges = badgesFor(podiumRow.win, podiumRow.day, podiumRow.xp);

                  return (
                    <div
                      key={podiumRow.addr}
                      className={`relative rounded-xl border p-4 flex flex-col justify-between transition-all ${
                        isFirst
                          ? "bg-amber-50/40 border-amber-200/90 shadow-2xs"
                          : isSecond
                          ? "bg-stone-50/70 border-stone-200"
                          : "bg-orange-50/30 border-orange-200/80"
                      } ${isMe ? "ring-2 ring-[#2977ff]/30" : ""}`}
                    >
                      {/* Rank & Crown Badge */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                            isFirst
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : isSecond
                              ? "bg-stone-200/70 text-stone-700 border border-stone-300"
                              : "bg-orange-100 text-orange-800 border border-orange-300"
                          }`}
                        >
                          {isFirst ? (
                            <>
                              <IconCrown size={12} />
                              #1 CHAMPION
                            </>
                          ) : isSecond ? (
                            <>
                              <IconMedal size={12} />
                              #2 RUNNER UP
                            </>
                          ) : (
                            <>
                              <IconMedal size={12} />
                              #3 BRONZE
                            </>
                          )}
                        </span>

                        {isMe && (
                          <span className="rounded bg-[#2977ff] px-1.5 py-0.5 text-[9px] font-mono font-bold text-white">
                            YOU
                          </span>
                        )}
                      </div>

                      {/* Worker Address & Level */}
                      <div className="my-3 space-y-1">
                        <a
                          href={`${network.explorer}/address/${podiumRow.addr}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-xs font-bold text-stone-900 hover:text-[#2977ff] transition-colors"
                        >
                          <span>{podiumRow.addr.slice(0, 6)}…{podiumRow.addr.slice(-4)}</span>
                          <IconArrowUpRight size={12} className="text-stone-400" />
                        </a>
                        <p className="font-mono text-[11px] text-stone-500">
                          {levelForXp(podiumRow.xp)} · {badges[0] || "Rookie"}
                        </p>
                      </div>

                      {/* Score & Streaks */}
                      <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between font-mono text-xs">
                        <div className="flex items-center gap-1">
                          {podiumRow.win >= 2 && (
                            <span className="text-rose-600 font-bold flex items-center gap-0.5">
                              <IconFlame size={12} />
                              {podiumRow.win}
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-stone-900 text-sm">
                          {podiumRow.xp} <span className="text-[10px] text-stone-400 font-normal">XP</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Remaining Rankings (Positions #4 to #8) */}
            {rest.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-stone-200">
                <div className="bg-stone-50 px-4 py-2 border-b border-stone-200 flex items-center justify-between font-mono text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                  <span>Rank & Worker</span>
                  <span>Streaks & Experience</span>
                </div>
                <ul className="divide-y divide-stone-100 bg-white">
                  {rest.map((row, idx) => {
                    const rank = idx + 4;
                    const isMe = address?.toLowerCase() === row.addr.toLowerCase();
                    const badges = badgesFor(row.win, row.day, row.xp);

                    return (
                      <li
                        key={row.addr}
                        className={`flex items-center justify-between px-4 py-3 text-xs ${
                          isMe ? "bg-[#2977ff]/5" : "hover:bg-stone-50/50"
                        } transition-colors`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-stone-100 font-mono text-[11px] font-bold text-stone-600">
                            {rank}
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`${network.explorer}/address/${row.addr}`}
                                target="_blank"
                                rel="noreferrer"
                                className="font-mono font-bold text-stone-900 hover:text-[#2977ff] transition-colors"
                              >
                                {row.addr.slice(0, 6)}…{row.addr.slice(-4)}
                              </a>
                              {isMe && (
                                <span className="rounded bg-[#2977ff] px-1 py-0.5 text-[9px] font-mono font-bold text-white">
                                  YOU
                                </span>
                              )}
                            </div>
                            <p className="font-mono text-[10px] text-stone-400">
                              {levelForXp(row.xp)} · {badges.slice(0, 2).join(" · ")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 font-mono">
                          {row.win >= 2 && (
                            <span className="inline-flex items-center gap-0.5 rounded bg-rose-50 border border-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">
                              <IconFlame size={11} />
                              {row.win}🔥
                            </span>
                          )}
                          <span className="font-bold text-stone-900 text-xs">
                            {row.xp} <span className="text-[10px] text-stone-400 font-normal">XP</span>
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-stone-200/80 bg-stone-50/80 px-5 py-2.5 font-mono text-[11px] text-stone-500 flex items-center justify-between">
        <span>Settled directly on Monad consensus</span>
        <span>Automatic golden key grading</span>
      </div>
    </section>
  );
}