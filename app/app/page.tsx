"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import PlayerHQ from "@/components/PlayerHQ";
import TaskList from "@/components/TaskList";
import CreateTask from "@/components/CreateTask";
import DoTask from "@/components/DoTask";
import PayoutTicker from "@/components/PayoutTicker";
import Leaderboard from "@/components/Leaderboard";
import { useNetwork } from "@/lib/network";
import { type MicroTask } from "@/lib/constants";
import {
  IconSparkles,
  IconExternalLink,
  IconDeviceGamepad2,
  IconUserCheck,
  IconTrophy,
  IconPlus,
} from "@tabler/icons-react";

export default function AppPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<MicroTask | null>(null);
  const { network } = useNetwork();

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-stone-50 text-stone-900 antialiased selection:bg-stone-900 selection:text-white">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-3.5 pt-4 pb-28 sm:px-6 sm:py-6 sm:pb-8 space-y-5">
        {/* Arcade Top Workspace Marquee */}
        <section className="card-arcade overflow-hidden">
          {/* Window Chrome Bar */}
          <div className="flex items-center justify-between border-b border-stone-200/80 bg-stone-100/70 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#2977ff] text-white font-black text-[10px]">
                ⚡
              </span>
              <span className="ml-1 font-mono text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                MONAD ARCADE · v2.0
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                1.2s Finality · 10,000 TPS
              </span>
            </div>
          </div>

          {/* Hero Content & Action Bar */}
          <div className="p-5 sm:p-7 bg-gradient-to-b from-white to-stone-50/40">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-md border border-[#2977ff]/30 bg-[#2977ff]/10 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[#2977ff]">
                    ACTIVE BOUNTY VAULTS
                  </span>
                  <span className="text-xs font-mono text-stone-400 font-semibold">
                    100 XP / Frame · Instant Payouts
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-stone-900">
                  Micro-tasks. Instant payouts. <em>On-chain.</em>
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl font-sans">
                  Knock out micro-tasks in seconds — label, verify, or rate frames. When your answer matches the on-chain golden key, your reward is credited instantly to your wallet.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setCreateOpen(true)}
                  className="btn-arcade-dark inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-wider"
                >
                  <IconSparkles size={15} />
                  <span>Deploy Micro-Task</span>
                </button>

                <Link
                  href="/demo"
                  className="btn-arcade-blue inline-flex items-center justify-center gap-1.5 rounded-2xl px-4 py-3 text-xs font-black uppercase text-white"
                >
                  <span>▶ Watch Demo</span>
                </Link>

                <a
                  href={`${network.explorer}/address/${network.contractAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-arcade-white inline-flex items-center justify-center gap-1.5 rounded-2xl px-4 py-3 text-xs font-bold font-sans uppercase text-stone-800"
                >
                  <span>Contract</span>
                  <IconExternalLink size={13} className="text-stone-400" />
                </a>
              </div>
            </div>

            {/* Editorial Metrics Strip */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-stone-200/80 pt-5">
              <div className="rounded-xl border border-stone-200 bg-white p-3 space-y-1 shadow-2xs">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Block Finality
                </span>
                <p className="font-mono text-base sm:text-lg font-black text-stone-900 flex items-center gap-1.5">
                  1.2s
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                    parallel
                  </span>
                </p>
              </div>

              <div className="rounded-xl border border-stone-200 bg-white p-3 space-y-1 shadow-2xs">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Throughput
                </span>
                <p className="font-mono text-base sm:text-lg font-black text-stone-900">
                  10,000 TPS
                </p>
              </div>

              <div className="rounded-xl border border-stone-200 bg-white p-3 space-y-1 shadow-2xs">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Protocol Fee
                </span>
                <p className="font-mono text-base sm:text-lg font-black text-stone-900">
                  2.0%
                </p>
              </div>

              <div className="rounded-xl border border-stone-200 bg-white p-3 space-y-1 shadow-2xs">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Verification
                </span>
                <p className="font-mono text-base sm:text-lg font-black text-stone-900">
                  Golden Key
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Player HQ Profile / Standby Card */}
        <PlayerHQ
          onDeployClick={() => setCreateOpen(true)}
          onQuickPlay={() => {
            document.getElementById("tasks")?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Task Grid & Live Feed Layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr_380px] items-start">
          <section id="tasks" className="min-w-0 space-y-6">
            <TaskList onDoTask={setActiveTask} creating={false} />
            <Leaderboard />
          </section>
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <PayoutTicker />
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 text-xs text-stone-500 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-stone-800">Microworks</span>
            <span>·</span>
            <span>Monad Blitz Hackathon</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <a
              href={`${network.explorer}/address/${network.contractAddress}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-stone-900 transition underline underline-offset-2"
            >
              Contract Explorer
            </a>
            <a
              href="https://docs.monad.xyz"
              target="_blank"
              rel="noreferrer"
              className="hover:text-stone-900 transition underline underline-offset-2"
            >
              Monad Docs
            </a>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Arcade Dock (Subway Surfers Thumb Controls) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 sm:hidden border-t-2 border-stone-300/90 bg-white/95 backdrop-blur-md px-3 py-2 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around">
          <button
            type="button"
            onClick={() => {
              document.getElementById("tasks")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex flex-col items-center gap-0.5 text-stone-600 active:text-[#2977ff] active:scale-95 transition"
          >
            <IconDeviceGamepad2 size={20} />
            <span className="font-mono text-[10px] font-black uppercase tracking-wider">Quests</span>
          </button>

          <button
            type="button"
            onClick={() => {
              document.getElementById("player-hq")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex flex-col items-center gap-0.5 text-stone-600 active:text-[#2977ff] active:scale-95 transition"
          >
            <IconUserCheck size={20} />
            <span className="font-mono text-[10px] font-black uppercase tracking-wider">My HQ</span>
          </button>

          {/* Big Elevated Floating Quick Run Thumb Button */}
          <button
            type="button"
            onClick={() => {
              document.getElementById("tasks")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-arcade-green -mt-6 flex h-13 w-13 items-center justify-center rounded-2xl shadow-lg active:translate-y-1 transition text-white"
            title="Quick Play Run"
          >
            <span className="text-xl">▶</span>
          </button>

          <button
            type="button"
            onClick={() => {
              document.getElementById("leaderboard")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex flex-col items-center gap-0.5 text-stone-600 active:text-[#2977ff] active:scale-95 transition"
          >
            <IconTrophy size={20} />
            <span className="font-mono text-[10px] font-black uppercase tracking-wider">Top Run</span>
          </button>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex flex-col items-center gap-0.5 text-stone-600 active:text-[#2977ff] active:scale-95 transition"
          >
            <IconPlus size={20} />
            <span className="font-mono text-[10px] font-black uppercase tracking-wider">Deploy</span>
          </button>
        </div>
      </nav>

      {/* Interactive Modals */}
      <CreateTask open={createOpen} onClose={() => setCreateOpen(false)} />
      {activeTask && <DoTask task={activeTask} onClose={() => setActiveTask(null)} />}
    </div>
  );
}

