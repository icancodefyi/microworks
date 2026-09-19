"use client";

import { useEffect, useState } from "react";
import { formatEther, decodeEventLog, getEventSelector } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ABI } from "@/lib/abi";
import { CONTRACT_ADDRESS, OPTION_LABELS, EXPLORER, type MicroTask } from "@/lib/constants";

const ACCEPTED_TOPIC = getEventSelector("AnswerAccepted(uint256,uint256,address,uint256)");
const REJECTED_TOPIC = getEventSelector("AnswerRejected(uint256,uint256,address,uint8)");

type Outcome = "checking" | "accepted" | "rejected" | "pending" | null;

export default function DoTask({
  task,
  onClose,
}: {
  task: MicroTask;
  onClose: () => void;
}) {
  const [frameId, setFrameId] = useState(0);
  const [submitError, setSubmitError] = useState("");
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [lastPayout, setLastPayout] = useState("");

  const { data: hash, writeContract, isPending, reset } = useWriteContract();
  const { data: receipt, isSuccess, isLoading: isWaiting } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (!receipt || !hash) return;
    for (const log of receipt.logs) {
      if (log.address?.toLowerCase() !== CONTRACT_ADDRESS.toLowerCase()) continue;
      const topic = log.topics?.[0]?.toLowerCase();
      if (topic !== ACCEPTED_TOPIC && topic !== REJECTED_TOPIC) continue;
      try {
        const ev = decodeEventLog({
          abi: CONTRACT_ABI,
          data: log.data,
          topics: log.topics as never,
        });
        if (ev.eventName === "AnswerAccepted") {
          const { amount } = ev.args as { amount: bigint };
          setLastPayout(formatEther(amount));
          setOutcome("accepted");
        } else {
          setOutcome("rejected");
        }
        return;
      } catch {
        /* skip malformed log */
      }
    }
    setOutcome("pending");
  }, [receipt, hash]);

  const maxFrame = Math.max(0, Number(task.frameCount) - 1);

  const submit = (option: number) => {
    setSubmitError("");
    setOutcome(null);
    setLastPayout("");
    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "submitAnswer",
        args: [task.id, BigInt(frameId), option],
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit transaction");
    }
  };

  const handleNextFrame = () => {
    reset();
    setOutcome(null);
    setLastPayout("");
    setFrameId((prev) => Math.min(maxFrame, prev + 1));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Window Chrome Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50/90 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-stone-300 transition-colors hover:bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-stone-300 transition-colors hover:bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-stone-300 transition-colors hover:bg-emerald-400" />
            <span className="ml-2 font-mono text-[11px] font-medium text-stone-500">
              microworks://solve?id=#{task.id.toString()}&frame={frameId}
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

        {/* Task Header & Prompt */}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md border border-stone-200 bg-stone-100 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-stone-700">
                  {task.category || "General"}
                </span>
                <span className="text-xs font-mono text-stone-400">
                  Task #{task.id.toString()}
                </span>
              </div>
              <h2 className="mt-1.5 text-lg font-bold text-stone-900 leading-snug">
                {task.title}
              </h2>
            </div>
            <div className="shrink-0 text-right">
              <span className="inline-block rounded-xl border border-[#2977ff]/20 bg-[#2977ff]/10 px-2.5 py-1 font-mono text-xs font-bold text-[#2977ff]">
                +{formatEther(task.reward)} MON
              </span>
              <p className="mt-1 font-mono text-[10px] text-stone-400">per correct frame</p>
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3.5 text-xs text-stone-600 leading-relaxed">
            {task.description}
          </div>

          {/* Frame Visual */}
          {(() => {
            const sampleLabels = ["empty", "person", "vehicle"] as const;
            const sample = sampleLabels[frameId % sampleLabels.length];
            return (
              <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/frames/${sample}.svg`}
                  alt={`Sample frame ${frameId + 1}`}
                  className="w-full aspect-video object-cover"
                />
                <div className="flex items-center justify-between gap-2 px-3 py-2">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-stone-300">
                    Shown: {sample}
                  </span>
                  <span className="font-mono text-[10px] text-stone-400">
                    frame {frameId + 1}/{task.frameCount.toString()} · sample visual
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Frame Index Stepper */}
          <div className="rounded-xl border border-stone-200 bg-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-stone-600">Target Frame:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setFrameId((p) => Math.max(0, p - 1))}
                  disabled={frameId <= 0}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 text-xs font-bold text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition cursor-pointer"
                >
                  −
                </button>
                <input
                  type="number"
                  min={0}
                  max={maxFrame}
                  value={frameId}
                  onChange={(e) =>
                    setFrameId(Math.min(maxFrame, Math.max(0, Number(e.target.value))))
                  }
                  className="h-7 w-14 rounded-lg border border-stone-200 bg-stone-50 text-center font-mono text-xs font-semibold text-stone-900 focus:bg-white focus:border-[#2977ff] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setFrameId((p) => Math.min(maxFrame, p + 1))}
                  disabled={frameId >= maxFrame}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 text-xs font-bold text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-right font-mono text-[11px] text-stone-500">
              Frame <span className="font-semibold text-stone-800">{frameId + 1}</span> of {task.frameCount.toString()}
            </div>
          </div>

          {/* Answer Choice Cards */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-stone-600">
                Select Classification
              </span>
              <span className="text-[11px] font-mono text-stone-400">Instant on-chain verification</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {OPTION_LABELS.map((label, idx) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => submit(idx)}
                  disabled={isPending || isWaiting}
                  className="group relative flex flex-col items-center justify-center gap-1 rounded-xl border border-stone-200 bg-stone-50/70 p-3.5 transition-all hover:bg-white hover:border-[#2977ff] hover:shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer text-center"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-200/80 font-mono text-[10px] font-semibold text-stone-600 group-hover:bg-[#2977ff]/10 group-hover:text-[#2977ff] transition-colors">
                    {idx}
                  </span>
                  <span className="text-xs font-bold text-stone-900 group-hover:text-[#2977ff] transition-colors">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback & Transaction Status */}
          {submitError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
              {submitError}
            </div>
          )}

          {(isPending || isWaiting) && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 flex items-center gap-3">
              <svg className="w-4 h-4 text-[#2977ff] animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <div className="text-xs text-[#2065dc]">
                <p className="font-semibold">Confirming on Monad testnet…</p>
                <p className="text-[11px] text-blue-600/80">Parallel execution running (~1.2s settlement)</p>
              </div>
            </div>
          )}

          {isSuccess && outcome === "accepted" && (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[11px] text-white">✓</span>
                  Correct!
                  <span className="font-mono text-xs text-emerald-700">+{lastPayout} MON</span>
                </div>
                {hash && (
                  <a
                    href={`${EXPLORER}/tx/${hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] text-[#2977ff] underline hover:no-underline"
                  >
                    View Tx ↗
                  </a>
                )}
              </div>
              <p className="text-xs text-emerald-700">
                Payout credited to your wallet instantly — on-chain, no review needed.
              </p>
              {frameId < maxFrame && (
                <button
                  type="button"
                  onClick={handleNextFrame}
                  className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition cursor-pointer"
                >
                  Advance to Frame {frameId + 2} →
                </button>
              )}
            </div>
          )}

          {isSuccess && outcome === "rejected" && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-rose-800">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[11px] text-white">✗</span>
                  Incorrect — no payout
                </div>
                {hash && (
                  <a
                    href={`${EXPLORER}/tx/${hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] text-[#2977ff] underline hover:no-underline"
                  >
                    View Tx ↗
                  </a>
                )}
              </div>
              <p className="text-xs text-rose-700">
                The contract rejected this label. Try the next frame.
              </p>
              {frameId < maxFrame && (
                <button
                  type="button"
                  onClick={handleNextFrame}
                  className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition cursor-pointer"
                >
                  Advance to Frame {frameId + 2} →
                </button>
              )}
            </div>
          )}

          {isSuccess && outcome !== "accepted" && outcome !== "rejected" && (
            <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 flex items-center gap-3">
              <svg className="w-4 h-4 text-stone-400 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-xs text-stone-500">
                {outcome === "pending"
                  ? "Submitted on-chain — no payout event on this transaction."
                  : "Submitted on-chain · checking result…"}
              </p>
              {hash && (
                <a
                  href={`${EXPLORER}/tx/${hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto font-mono text-[11px] text-[#2977ff] underline hover:no-underline"
                >
                  View Tx ↗
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 bg-stone-50/80 px-6 py-3 flex items-center justify-between text-xs text-stone-500">
          <span className="font-mono text-[11px]">Monad Testnet · 10,000 TPS</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}