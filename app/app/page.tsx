"use client";

import { useState } from "react";
import Header from "@/components/Header";
import TaskList from "@/components/TaskList";
import CreateTask from "@/components/CreateTask";
import DoTask from "@/components/DoTask";
import PayoutTicker from "@/components/PayoutTicker";
import type { MicroTask } from "@/lib/constants";

export default function AppPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<MicroTask | null>(null);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-stone-50 text-stone-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <section className="mb-6 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 px-6 py-8 text-white sm:px-10 sm:py-10 border border-stone-800 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 font-mono">
            On-chain micro-work · Monad
          </p>
          <h1 className="mt-2 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Kill dead time. Win micro-wins.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-stone-300 sm:text-base">
            Any company drops a micro-task — label, vote, verify, caption. You knock it
            out in seconds and earn an instant on-chain payout. Settled in under 2 seconds.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setCreateOpen(true)}
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-stone-900 shadow transition hover:bg-stone-100 cursor-pointer"
            >
              Create a micro-task
            </button>
            <a
              href="#tasks"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#tasks")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Earn micro-wins
            </a>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section id="tasks">
            <TaskList onDoTask={setActiveTask} creating={false} />
          </section>
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <PayoutTicker />
          </aside>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-5">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-stone-500 sm:px-6">
          Microworks · built at Monad Blitz · micro-tasks, micro-wins, macro settlement
        </div>
      </footer>

      <CreateTask open={createOpen} onClose={() => setCreateOpen(false)} />
      {activeTask && <DoTask task={activeTask} onClose={() => setActiveTask(null)} />}
    </div>
  );
}
