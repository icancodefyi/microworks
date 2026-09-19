"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ABI } from "@/lib/abi";
import {
  CATEGORIES,
  CONTRACT_ADDRESS,
  OPTION_LABELS,
  KIND_OPTIONS,
  KIND_YESNO,
  KIND_RATING,
  KIND_TEXT,
  KIND_LABELS,
} from "@/lib/constants";
import { optionAnswerHash, textAnswerHash } from "@/lib/answers";

const KIND_HINTS: Record<number, string> = {
  [KIND_OPTIONS]: "Worker picks one of your options per frame.",
  [KIND_YESNO]: "Worker answers Yes or No per frame.",
  [KIND_RATING]: "Worker rates each frame 1–5.",
  [KIND_TEXT]: "Worker types a short free-text answer.",
};

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
  const [kind, setKind] = useState<number>(KIND_OPTIONS);
  const [optionLabels, setOptionLabels] = useState(OPTION_LABELS.join(", "));
  const [reward, setReward] = useState("0.05");
  const [frameCount, setFrameCount] = useState(30);
  const [answers, setAnswers] = useState("");
  const [error, setError] = useState("");

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isSuccess, isLoading: isWaiting } = useWaitForTransactionReceipt({ hash });

  if (!open) return null;

  const optionsArr = optionLabels
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const autoGenerate = () => {
    const lines: string[] = [];
    for (let i = 0; i < frameCount; i++) {
      if (kind === KIND_TEXT) {
        const pool = ["clear", "blocked", "vehicle", "pedestrian"];
        lines.push(`${i}:${pool[i % pool.length]}`);
      } else if (kind === KIND_YESNO) {
        lines.push(`${i}:${Math.random() < 0.5 ? "yes" : "no"}`);
      } else if (kind === KIND_RATING) {
        lines.push(`${i}:${1 + Math.floor(Math.random() * 5)}`);
      } else {
        lines.push(`${i}:${Math.floor(Math.random() * Math.max(2, optionsArr.length))}`);
      }
    }
    setAnswers(lines.join("\n"));
  };

  const parseAnswerValue = (v: string): { ok: boolean; msg: string } => {
    const val = v.trim().toLowerCase();
    if (kind === KIND_TEXT) {
      if (!val) return { ok: false, msg: "Empty answer" };
      return { ok: true, msg: "" };
    }
    if (kind === KIND_YESNO) {
      if (val === "yes" || val === "no" || val === "0" || val === "1") return { ok: true, msg: "" };
      return { ok: false, msg: `"${v}" must be yes/no` };
    }
    if (kind === KIND_RATING) {
      const n = Number(val);
      if (n >= 1 && n <= 5) return { ok: true, msg: "" };
      return { ok: false, msg: `"${v}" must be 1-5` };
    }
    const n = Number(val);
    if (Number.isInteger(n) && n >= 0 && n < optionsArr.length) return { ok: true, msg: "" };
    return { ok: false, msg: `"${v}" must be 0..${Math.max(0, optionsArr.length - 1)}` };
  };

  const buildGolden = (): { ok: boolean; msg: string; answers: `0x${string}`[] } => {
    const map = new Map<number, string>();
    if (answers.trim()) {
      for (const line of answers.split(/[\n,]/)) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const match = trimmed.match(/^(\d+)\s*[:=]\s*(.+)$/);
        if (!match) return { ok: false, msg: `Bad line: "${line}" — format as frame:answer`, answers: [] };
        const f = Number(match[1]);
        if (f >= frameCount) return { ok: false, msg: `Frame ${f} out of range (0..${frameCount - 1})`, answers: [] };
        const check = parseAnswerValue(match[2]);
        if (!check.ok) return { ok: false, msg: `Frame ${f}: ${check.msg}`, answers: [] };
        map.set(f, match[2].trim().toLowerCase());
      }
    }
    const golden: `0x${string}`[] = [];
    for (let f = 0; f < frameCount; f++) {
      let raw = map.get(f);
      if (raw === undefined) {
        // auto-fill missing frames so the key always covers every frame
        if (kind === KIND_TEXT) raw = "clear";
        else if (kind === KIND_YESNO) raw = Math.random() < 0.5 ? "yes" : "no";
        else if (kind === KIND_RATING) raw = `${1 + Math.floor(Math.random() * 5)}`;
        else raw = String(Math.floor(Math.random() * Math.max(2, optionsArr.length)));
      }
      golden.push(
        kind === KIND_TEXT
          ? textAnswerHash(raw)
          : kind === KIND_YESNO
            ? optionAnswerHash(raw === "yes" ? 0 : raw === "no" ? 1 : Number(raw))
            : kind === KIND_RATING
              ? optionAnswerHash(Number(raw) - 1)
              : optionAnswerHash(Number(raw)),
      );
    }
    return { ok: true, msg: "", answers: golden };
  };

  const submit = () => {
    setError("");
    try {
      const rewardWei = parseEther(reward);
      if (rewardWei <= 0n) {
        setError("Reward must be greater than 0 MON.");
        return;
      }
      const golden = buildGolden();
      if (!golden.ok) {
        setError(golden.msg);
        return;
      }
      const escrow = rewardWei * BigInt(frameCount);
      const optionCount = kind === KIND_OPTIONS ? optionsArr.length : kind === KIND_YESNO ? 2 : kind === KIND_RATING ? 5 : 0;
      const options = kind === KIND_OPTIONS ? optionsArr : [];
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "createTask",
        args: [
          title,
          description,
          category,
          kind,
          optionCount,
          options,
          rewardWei,
          BigInt(frameCount),
          golden.answers,
        ],
        value: escrow,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid input parameters");
    }
  };

  const totalBounty = (() => {
    try {
      const r = parseFloat(reward) || 0;
      return (r * frameCount).toFixed(3);
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
              Contract verifies golden answers on Monad testnet with sub-second finality. Every correct answer pays instantly.
            </p>
          </div>

          <div className="space-y-4 pt-1">
            {/* Task Type */}
            <div>
              <label className="block text-xs font-mono font-medium uppercase tracking-wider text-stone-600">
                Task Type
              </label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {KIND_LABELS.map((k) => (
                  <button
                    key={k.value}
                    type="button"
                    onClick={() => setKind(k.value)}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold transition cursor-pointer ${
                      kind === k.value
                        ? "border-[#2977ff] bg-[#2977ff]/10 text-[#2977ff]"
                        : "border-stone-200 bg-stone-50/60 text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    {k.label}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-[11px] text-stone-400">{KIND_HINTS[kind]}</p>
            </div>

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

            {kind === KIND_OPTIONS && (
              <div>
                <label className="block text-xs font-mono font-medium uppercase tracking-wider text-stone-600">
                  Options (comma separated)
                </label>
                <input
                  type="text"
                  value={optionLabels}
                  onChange={(e) => setOptionLabels(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2.5 text-sm text-stone-900 focus:bg-white focus:border-[#2977ff] focus:ring-2 focus:ring-[#2977ff]/15 outline-none transition"
                  placeholder="Person, Vehicle, Empty"
                />
              </div>
            )}

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
                placeholder={
                  kind === KIND_TEXT
                    ? "0:clear\n1:blocked\n…  (format: frameIndex:answerText)"
                    : kind === KIND_YESNO
                      ? "0:yes\n1:no\n…  (format: frameIndex:yes|no)"
                      : kind === KIND_RATING
                        ? "0:4\n1:2\n…  (format: frameIndex:1..5)"
                        : "0:0\n1:2\n…  (format: frameIndex:optionNumber)"
                }
                className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2.5 font-mono text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#2977ff] focus:ring-2 focus:ring-[#2977ff]/15 outline-none transition leading-relaxed"
              />

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-mono text-stone-400">
                  {kind === KIND_OPTIONS
                    ? "Options:"
                    : kind === KIND_YESNO
                      ? "Accept:"
                      : kind === KIND_RATING
                        ? "Scale:"
                        : "Hint:"}
                </span>
                {kind === KIND_OPTIONS &&
                  optionsArr.map((lbl, idx) => (
                    <span
                      key={`${lbl}-${idx}`}
                      className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-stone-100 px-1.5 py-0.5 font-mono text-[10px] text-stone-600"
                    >
                      <span className="font-semibold text-stone-900">{idx}</span> = {lbl}
                    </span>
                  ))}
                {kind === KIND_YESNO && (
                  <span className="text-[11px] text-stone-400">yes = 0, no = 1</span>
                )}
                {kind === KIND_RATING && (
                  <span className="text-[11px] text-stone-400">1 (worst) … 5 (best)</span>
                )}
                {kind === KIND_TEXT && (
                  <span className="text-[11px] text-stone-400">answers are hashed on-chain</span>
                )}
              </div>
            </div>

            {/* Escrow & Latency Breakdown */}
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 font-mono">Estimated Bounty Vault:</span>
                <span className="font-mono font-bold text-stone-900">~{totalBounty} MON</span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1 text-[11px] text-stone-400">
                <span>Settlement Speed</span>
                <span className="text-emerald-600 font-mono font-medium">1.2s parallel finality</span>
                <span className="ml-auto text-stone-400">Workers earn +100 XP per correct answer</span>
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
            className="btn-arcade-white rounded-xl px-4 py-2 text-xs font-bold font-sans uppercase text-stone-700"
          >
            Cancel
          </button>

          {!isSuccess ? (
            <button
              type="button"
              onClick={submit}
              disabled={isPending || isWaiting}
              className="btn-arcade-dark inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white disabled:opacity-50"
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
              className="btn-arcade-blue rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white"
            >
              Close Window
            </button>
          )}
        </div>
      </div>
    </div>
  );
}