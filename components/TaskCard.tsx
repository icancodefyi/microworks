"use client";

import { formatUnits } from "viem";
import type { MicroTask } from "@/lib/constants";
import {
  KIND_OPTIONS,
  KIND_YESNO,
  KIND_RATING,
  KIND_TEXT,
} from "@/lib/constants";
import {
  IconArrowRight,
  IconCoins,
  IconChecklist,
  IconScale,
  IconStar,
  IconFileText,
  IconBolt,
  IconPlayerPlay,
} from "@tabler/icons-react";

const CATEGORY_TAG: Record<string, { label: string; bg: string; text: string }> = {
  label: { label: "Labeling", bg: "bg-blue-50 border-blue-200", text: "text-blue-700" },
  poll: { label: "Consensus Poll", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
  caption: { label: "Captioning", bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
  verify: { label: "Verification", bg: "bg-purple-50 border-purple-200", text: "text-purple-700" },
  transcribe: { label: "Transcription", bg: "bg-teal-50 border-teal-200", text: "text-teal-700" },
  qa: { label: "Quality Audit", bg: "bg-rose-50 border-rose-200", text: "text-rose-700" },
};

function getKindMeta(kind: number) {
  switch (kind) {
    case KIND_YESNO:
      return {
        label: "Binary Verify",
        code: "CLASS 1",
        icon: IconScale,
        bg: "bg-amber-100/70 border-amber-300 text-amber-900",
      };
    case KIND_RATING:
      return {
        label: "Rating 1-5",
        code: "CLASS 2",
        icon: IconStar,
        bg: "bg-purple-100/70 border-purple-300 text-purple-900",
      };
    case KIND_TEXT:
      return {
        label: "Free Text",
        code: "CLASS 3",
        icon: IconFileText,
        bg: "bg-teal-100/70 border-teal-300 text-teal-900",
      };
    case KIND_OPTIONS:
    default:
      return {
        label: "Multi-Choice",
        code: "CLASS 0",
        icon: IconChecklist,
        bg: "bg-blue-100/70 border-blue-300 text-blue-900",
      };
  }
}

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

  const percentComplete = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
  const isFinished = total > 0 && done >= total;

  const tag = CATEGORY_TAG[task.category] || {
    label: task.category,
    bg: "bg-stone-100 border-stone-200",
    text: "text-stone-700",
  };

  const kindMeta = getKindMeta(task.kind);
  const KindIcon = kindMeta.icon;

  return (
    <div className="card-arcade p-4 sm:p-5 hover:border-stone-400/80 transition-all flex flex-col justify-between gap-4">
      {/* Top Meta Line: Class badge, Category, Quest ID, Status */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Kind Class Pill */}
            <span
              className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${kindMeta.bg}`}
            >
              <KindIcon size={12} />
              <span>{kindMeta.code} · {kindMeta.label}</span>
            </span>

            {/* Category Tag */}
            <span
              className={`rounded-lg border px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${tag.bg} ${tag.text}`}
            >
              {tag.label}
            </span>

            {/* Quest Number */}
            <span className="text-[11px] font-mono text-stone-400 font-bold">
              #Q{task.id.toString()}
            </span>
          </div>

          {/* Live / Closed / Finished status */}
          <div>
            {isFinished ? (
              <span className="rounded-lg bg-stone-100 border border-stone-200 px-2 py-0.5 text-[10px] font-mono font-bold text-stone-600">
                COMPLETED ✓
              </span>
            ) : task.active ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ACTIVE RUN
              </span>
            ) : (
              <span className="rounded-lg bg-stone-100 px-2 py-0.5 text-[10px] font-mono font-bold text-stone-500 border border-stone-200">
                CLOSED
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1 max-w-xl">
            <h3 className="font-sans font-black text-base sm:text-lg text-stone-900 leading-snug">
              {task.title}
            </h3>
            <p className="line-clamp-2 text-xs text-stone-600 font-sans leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* Rewards Badge (Subway Surfers Style Coin & XP Chip) */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1.5 shrink-0 bg-stone-50 sm:bg-transparent p-2 sm:p-0 rounded-xl border sm:border-0 border-stone-200">
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-2.5 py-1 font-mono font-black text-stone-900 text-sm sm:text-base shadow-2xs">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-amber-950 text-xs shadow-2xs">
                🪙
              </span>
              <span>+{reward.toFixed(reward < 0.01 ? 4 : 2)}</span>
              <span className="text-xs text-amber-800 font-bold">MON</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="inline-flex items-center gap-1 rounded-md bg-[#2977ff]/10 border border-[#2977ff]/30 px-2 py-0.5 font-mono text-[10px] font-black text-[#2977ff]">
                <IconBolt size={11} />
                +100 XP / FRAME
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Frame Progress Track & Play Button */}
      <div className="pt-3 border-t border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Frame Progress Bar & Vault Remaining */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-600">
          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-bold uppercase text-[11px]">Frames:</span>
            <span className="font-black text-stone-900">
              {done}/{total}
            </span>
            <div className="w-24 h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-300 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#2977ff] to-blue-400 rounded-full transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-stone-500">{percentComplete}%</span>
          </div>

          <div className="text-stone-500">
            <span className="text-stone-400 font-bold uppercase text-[11px]">Vault: </span>
            <span className="font-bold text-stone-800">{bounty.toFixed(2)} MON</span>
          </div>

          {rejected > 0 && (
            <div className="text-rose-600 font-semibold text-[11px]">
              <span>{rejected} missed</span>
            </div>
          )}
        </div>

        {/* 3D Pushable Subway Surfers "PLAY" Button (Mobile-friendly thumb button) */}
        <button
          type="button"
          onClick={() => onDoTask(task)}
          disabled={!task.active || isFinished}
          className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-black uppercase tracking-wider ${
            isFinished
              ? "btn-arcade-white opacity-60 cursor-not-allowed"
              : "btn-arcade-blue"
          }`}
        >
          <IconPlayerPlay size={14} className="fill-current" />
          <span>{isFinished ? "Completed" : "Play Mission"}</span>
        </button>
      </div>
    </div>
  );
}