"use client";

import { formatUnits } from "viem";
import type { MicroTask } from "@/lib/constants";
import { IconArrowRight, IconCoins } from "@tabler/icons-react";

const CATEGORY_TAG: Record<string, { label: string; bg: string; text: string }> = {
  label: { label: "Labeling", bg: "bg-blue-50 border-blue-200", text: "text-blue-700" },
  poll: { label: "Consensus Poll", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
  caption: { label: "Captioning", bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
  verify: { label: "Verification", bg: "bg-purple-50 border-purple-200", text: "text-purple-700" },
  transcribe: { label: "Transcription", bg: "bg-teal-50 border-teal-200", text: "text-teal-700" },
  qa: { label: "Quality Audit", bg: "bg-rose-50 border-rose-200", text: "text-rose-700" },
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

  const percentComplete = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
  const tag = CATEGORY_TAG[task.category] || {
    label: task.category,
    bg: "bg-stone-100 border-stone-200",
    text: "text-stone-700",
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5 shadow-xs hover:border-stone-300 transition-all">
      {/* Top Meta Line */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${tag.bg} ${tag.text}`}
            >
              {tag.label}
            </span>
            <span className="text-[11px] font-mono text-stone-400">
              task #{task.id.toString()}
            </span>
            {task.active ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-700 border border-emerald-200/60">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            ) : (
              <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-stone-500 border border-stone-200">
                Closed
              </span>
            )}
          </div>

          <h3 className="mt-2 font-sans font-semibold text-base text-stone-900 leading-snug">
            {task.title}
          </h3>
          <p className="mt-1 line-clamp-2 max-w-xl text-xs text-stone-600 font-sans leading-relaxed">
            {task.description}
          </p>
        </div>

        {/* Reward Callout */}
        <div className="shrink-0 text-right">
          <div className="inline-flex items-center gap-1 font-mono font-bold text-stone-950 text-base sm:text-lg">
            <IconCoins size={16} className="text-[#2977ff] shrink-0" />
            <span>+{reward.toFixed(reward < 0.01 ? 4 : 2)}</span>
            <span className="text-xs font-semibold text-stone-500">MON</span>
          </div>
          <p className="text-[11px] font-mono text-stone-400 mt-0.5">per micro-task</p>
        </div>
      </div>

      {/* Stats and Action Bar */}
      <div className="mt-4 pt-3.5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
        {/* Progress & Metrics */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-500">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Frames:</span>
            <span className="font-semibold text-stone-800">
              {done}/{total}
            </span>
            <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200/80">
              <div
                className="h-full bg-[#2977ff] rounded-full transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>

          <div>
            <span className="text-stone-400">Vault: </span>
            <span className="font-semibold text-stone-800">{bounty.toFixed(2)} MON</span>
          </div>

          {pending > 0 && (
            <div className="text-amber-600 font-medium">
              <span>{pending} pending</span>
            </div>
          )}

          {rejected > 0 && (
            <div className="text-stone-400">
              <span>{rejected} rejected</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => onDoTask(task)}
          disabled={!task.active}
          className="cursor-pointer box-border flex items-center justify-center gap-1.5 font-semibold font-sans uppercase border transition-all ease-in duration-75 whitespace-nowrap text-center select-none text-xs rounded-xl px-4 py-2 text-white bg-gradient-to-b from-stone-800 to-stone-950 border-stone-700/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.15)] hover:from-stone-700 hover:to-stone-900 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Do a micro-task</span>
          <IconArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}