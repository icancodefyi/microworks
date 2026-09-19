"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ABI } from "@/lib/abi";
import { CATEGORIES, CONTRACT_ADDRESS, OPTION_LABELS } from "@/lib/constants";

export default function CreateTask({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("Label 30 dashboard frames");
  const [description, setDescription] = useState(
    "Label each frame as Person, Vehicle or Empty. Correct = instant payout.",
  );
  const [category, setCategory] = useState<string>("label");
  const [reward, setReward] = useState("0.05");
  const [frameCount, setFrameCount] = useState(30);
  const [answers, setAnswers] = useState("");
  const [error, setError] = useState("");

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isSuccess, isLoading: isWaiting } = useWaitForTransactionReceipt({ hash });

  if (!open) return null;

  const autoGenerate = () => {
    const golden = new Map<number, number>();
    for (let i = 0; i < frameCount; i++) {
      golden.set(i, Math.floor(Math.random() * OPTION_LABELS.length));
    }
    setAnswers(
      Array.from(golden.entries())
        .map(([f, o]) => `${f}:${o}`)
        .join("\n"),
    );
  };

  const parseAnswers = (): { rer: Map<number, number>; ok: boolean; msg: string } => {
    const golden = new Map<number, number>();
    if (!answers.trim()) {
      return { rer: golden, ok: false, msg: "Please generate or enter the correct answer key." };
    }
    for (const line of answers.split(/[\n,]/)) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const match = trimmed.match(/^(\d+)\s*[:=]\s*(\d+)$/);
      if (!match) return { rer: golden, ok: false, msg: `Bad line: "${line}" — format as frameIdx:option` };
      const f = Number(match[1]);
      const o = Number(match[2]);
      if (f >= frameCount) return { rer: golden, ok: false, msg: `Frame ${f} out of range (0..${frameCount - 1})` };
      if (o >= OPTION_LABELS.length) return { rer: golden, ok: false, msg: `Option ${o} is invalid` };
      golden.set(f, o);
    }
    if (golden.size === 0) return { rer: golden, ok: false, msg: "Answer key is empty." };
    return { rer: golden, ok: true, msg: "" };
  };

  const submit = () => {
    setError("");
    try {
      const parsed = parseAnswers();
      if (!parsed.ok) {
        setError(parsed.msg);
        return;
      }
      const rewardWei = parseEther(reward);
      if (rewardWei <= 0n) {
        setError("Reward must be greater than 0 MON.");
        return;
      }
      const indices = Array.from(parsed.rer.keys()).map(BigInt);
      const options = Array.from(parsed.rer.values());
      const goldenCount = BigInt(indices.length);
      const value = rewardWei * goldenCount;
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "createTask",
        args: [title, description, category, rewardWei, BigInt(frameCount), indices, options],
        value,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid input parameters");
    }
  };

  const totalBounty = (() => {
    try {
      const r = parseFloat(reward) || 0;
      const lines = answers.trim() ? answers.trim().split(/[\n,]/).filter(Boolean).length : frameCount;
      return (r * lines).toFixed(3);
    } catch {
      return "0.000";
    }
  })();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-xl overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Window Chrome Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50/90 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-stone-300 transition-colors hover:bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-stone-300 transition-colors hover:bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-stone-300 transition-colors hover:bg-emerald-400" />
            <span className="ml-2 font-mono text-[11px] font-medium text-stone-500">
              microworks://deploy-task
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-200/60 transition cursor-pointer text-xs"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-stone-900">
              Deploy Micro-Task & Bounty Vault
            </h2>
            <p className="mt-1 text-xs text-stone-500">
              Contract verifies golden frames on Monad testnet with sub-second finality.
            </p>
          </div>

          <div className="space-y-4 pt-1">
            {/* Title */}
            <div>
              <label className="block text-xs font-mono font-medium uppercase tracking-wider text-stone-600">
                Task Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#2977ff] focus:ring-2 focus:ring-[#2977ff]/15 outline-none transition"
                placeholder="e.g. Label 30 dashcam frames"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono font-medium uppercase tracking-wider text-stone-600">
                Worker Prompt / Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#2977ff] focus:ring-2 focus:ring-[#2977ff]/15 outline-none transition"
                placeholder="Clear instructions for workers completing each frame..."
              />
            </div>

            {/* Category & Reward Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono font-medium uppercase tracking-wider text-stone-600">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-[#2977ff] focus:ring-2 focus:ring-[#2977ff]/15 outline-none transition capitalize cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium uppercase tracking-wider text-stone-600">
                  Reward Per Frame (MON)
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="number"
                    min="0"
                    step="0.001"
                    value={reward}
                    onChange={(e) => setReward(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2.5 pr-14 text-sm font-mono text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#2977ff] focus:ring-2 focus:ring-[#2977ff]/15 outline-none transition"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-[#2977ff]">
                    MON
                  </span>
                </div>
              </div>
            </div>

            {/* Frame Count */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-medium uppercase tracking-wider text-stone-600">
                  Total Frames
                </label>
                <span className="text-[11px] text-stone-400">Max 500 frames per task</span>
              </div>
              <input
                type="number"
                min="1"
                max="500"
                value={frameCount}
                onChange={(e) => setFrameCount(Math.max(1, Number(e.target.value)))}
                className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2.5 text-sm font-mono text-stone-900 focus:bg-white focus:border-[#2977ff] focus:ring-2 focus:ring-[#2977ff]/15 outline-none transition"
              />
            </div>

            {/* Answer Key Editor */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-medium uppercase tracking-wider text-stone-600">
                  Golden Verification Key
                </label>
                <button
                  type="button"
                  onClick={autoGenerate}
                  className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-stone-100 px-2 py-1 text-[11px] font-mono font-medium text-[#2977ff] hover:bg-stone-200 transition cursor-pointer"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Auto-generate {frameCount} keys
                </button>
              </div>

              <textarea
                value={answers}
                onChange={(e) => setAnswers(e.target.value)}
                rows={4}
                placeholder={"0:0\n1:2\n2:1\n…  (format: frameIndex:optionNumber)"}
                className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2.5 font-mono text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#2977ff] focus:ring-2 focus:ring-[#2977ff]/15 outline-none transition leading-relaxed"
              />

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-mono text-stone-400">Options:</span>
                {OPTION_LABELS.map((lbl, idx) => (
                  <span
                    key={lbl}
                    className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-stone-100 px-1.5 py-0.5 font-mono text-[10px] text-stone-600"
                  >
                    <span className="font-semibold text-stone-900">{idx}</span> = {lbl}
                  </span>
                ))}
              </div>
            </div>

            {/* Escrow & Latency Breakdown */}
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 font-mono">Estimated Bounty Vault:</span>
                <span className="font-mono font-bold text-stone-900">~{totalBounty} MON</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-stone-400">
                <span>Settlement Speed</span>
                <span className="text-emerald-600 font-mono font-medium">1.2s parallel finality</span>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
                {error}
              </div>
            )}

            {isSuccess && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-700 flex items-center justify-between">
                <span>✓ Task deployed successfully on Monad testnet!</span>
                <button
                  type="button"
                  onClick={onClose}
                  className="font-medium text-emerald-800 underline hover:no-underline"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-stone-200 bg-stone-50/80 px-6 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition cursor-pointer"
          >
            Cancel
          </button>

          {!isSuccess ? (
            <button
              type="button"
              onClick={submit}
              disabled={isPending || isWaiting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-stone-800 to-stone-950 px-5 py-2.5 text-xs font-semibold text-white border border-stone-700/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.15)] hover:from-stone-700 hover:to-stone-900 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
            >
              {isPending || isWaiting ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Confirming on Monad…
                </>
              ) : (
                <>Deploy Task & Escrow Bounty</>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#2977ff] px-5 py-2 text-xs font-semibold text-white hover:bg-[#2065dc] transition cursor-pointer"
            >
              Close Window
            </button>
          )}
        </div>
      </div>
    </div>
  );
}