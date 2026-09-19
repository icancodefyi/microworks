"use client";

import { formatUnits } from "viem";
import type { MicroTask } from "@/lib/constants";

const CATEGORY_STYLE: Record<string, string> = {
  label: "bg-sky-100 text-sky-700",
  poll: "bg-emerald-100 text-emerald-700",
  caption: "bg-pink-100 text-pink-700",
  verify: "bg-amber-100 text-amber-700",
  transcribe: "bg-teal-100 text-teal-700",
  qa: "bg-indigo-100 text-indigo-700",
};

export default function TaskCard({
  task,
  onDoTask,
}: {
  task: MicroTask;
  onDoTask: (t: MicroTask) => void;
}) {
  const reward = Number(formatUnits(task.reward, 18));
  const bounty = Number(formatUnits(task.bounty, 18));
  const total = Number(task.frameCount);
  const done = Number(task.completed);
  const rejected = Number(task.rejected);
  const pending = Number(task.pending);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                CATEGORY_STYLE[task.category] ?? "bg-zinc-100 text-zinc-600"
              }`}
            >
              {task.category}
            </span>
            <span className="text-[11px] text-zinc-400">task #{task.id.toString()}</span>
            {!task.active && (
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-500">
                closed
              </span>
            )}
          </div>
          <h3 className="mt-1.5 font-semibold leading-tight">{task.title}</h3>
          <p className="mt-0.5 line-clamp-2 max-w-xl text-sm text-zinc-500">
            {task.description}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg font-bold text-violet-600">
            {reward.toFixed(reward < 1 ? 4 : 2)} <span className="text-xs font-medium text-violet-400">MON</span>
          </p>
          <p className="text-[11px] text-zinc-400">per micro-task</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span>
            bounty <b className="text-zinc-700">{bounty.toFixed(2)} MON</b>
          </span>
          <span>
            done <b className="text-emerald-600">{done}</b>
          </span>
          <span>
            rejected <b className="text-red-500">{rejected}</b>
          </span>
          <span>
            pending <b className="text-amber-600">{pending}</b>
          </span>
          <span>
            frames <b className="text-zinc-700">{total}</b>
          </span>
        </div>
        <button
          onClick={() => onDoTask(task)}
          disabled={!task.active}
          className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Do a micro-task
        </button>
      </div>
    </div>
  );
}