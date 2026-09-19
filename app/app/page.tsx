"use client";

import { useState } from "react";
import Header from "@/components/Header";
import TaskList from "@/components/TaskList";
import CreateTask from "@/components/CreateTask";
import DoTask from "@/components/DoTask";
import PayoutTicker from "@/components/PayoutTicker";
import { CONTRACT_ADDRESS, EXPLORER, type MicroTask } from "@/lib/constants";

export default function AppPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<MicroTask | null>(null);

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-stone-50 text-stone-900 antialiased selection:bg-stone-900 selection:text-white">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 space-y-6">
        {/* Editorial Top Workspace Section */}
        <section className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          {/* Window Chrome Bar */}
          <div className="flex items-center justify-between border-b border-stone-200/80 bg-stone-50/80 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
              <span className="ml-2 font-mono text-[11px] font-medium text-stone-500">
                microworks://terminal.monad-testnet
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                1.2s Finality
              </span>
            </div>
          </div>

          {/* Hero Content & Action Bar */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-md border border-stone-200 bg-stone-100 px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider text-stone-600">
                    Live Bounties
                  </span>
                  <span className="text-xs font-mono text-stone-400">
                    Monad Parallel EVM
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-stone-900">
                  Micro-tasks. Instant payouts. <em>On-chain.</em>
                </h1>
                <p className="text-sm text-stone-500 leading-relaxed max-w-xl">
                  Knock out micro-tasks in seconds — label, verify, or transcribe frames. When your answer matches the on-chain golden key, your reward is settled in ~1.2 seconds.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setCreateOpen(true)}
                  className="cursor-pointer box-border inline-flex items-center justify-center font-semibold font-sans uppercase border transition-all ease-in duration-75 whitespace-nowrap text-center select-none gap-x-2 text-xs leading-5 rounded-xl px-4 py-2 text-white bg-gradient-to-b from-stone-800 to-stone-950 border-stone-700/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_6px_rgba(0,0,0,0.2)] hover:from-stone-700 hover:to-stone-900 active:scale-95"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Deploy Micro-Task
                </button>

                <a
                  href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer box-border inline-flex items-center justify-center font-semibold font-sans uppercase border transition-all ease-in duration-75 whitespace-nowrap text-center select-none gap-x-1.5 text-xs leading-5 rounded-xl px-4 py-2 bg-gradient-to-b from-white to-stone-100 text-stone-800 border-stone-300 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_3px_rgba(0,0,0,0.06)] hover:bg-stone-50 active:scale-95"
                >
                  Contract
                  <svg className="w-3 h-3 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Editorial Metrics Strip */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-stone-200/80 pt-6">
              <div className="space-y-1">
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-stone-600">
                  Block Finality
                </span>
                <p className="font-mono text-lg font-bold text-stone-900 flex items-center gap-1.5">
                  1.2s
                  <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                    parallel
                  </span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-stone-600">
                  Throughput
                </span>
                <p className="font-mono text-lg font-bold text-stone-900">
                  10,000 TPS
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-stone-600">
                  Protocol Fee
                </span>
                <p className="font-mono text-lg font-bold text-stone-900">
                  2.0%
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-stone-600">
                  Verification
                </span>
                <p className="font-mono text-lg font-bold text-stone-900">
                  Golden Key
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Task Grid & Live Feed Layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr_380px] items-start">
          <section id="tasks" className="min-w-0">
            <TaskList onDoTask={setActiveTask} creating={false} />
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
              href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
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

      {/* Interactive Modals */}
      <CreateTask open={createOpen} onClose={() => setCreateOpen(false)} />
      {activeTask && <DoTask task={activeTask} onClose={() => setActiveTask(null)} />}
    </div>
  );
}

