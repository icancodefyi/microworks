"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ABI } from "@/lib/abi";
import { CONTRACT_ADDRESS, OPTION_LABELS, type MicroTask } from "@/lib/constants";

const OPTION_STYLE = [
  "bg-sky-100 text-sky-700 hover:bg-sky-200",
  "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
  "bg-amber-100 text-amber-700 hover:bg-amber-200",
];

export default function DoTask({
  task,
  onClose,
}: {
  task: MicroTask;
  onClose: () => void;
}) {
  const [frameId, setFrameId] = useState(0);
  const [submitError, setSubmitError] = useState("");

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const maxFrame = Number(task.frameCount) - 1;

  const submit = (option: number) => {
    setSubmitError("");
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "submitAnswer",
      args: [task.id, BigInt(frameId), option],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold leading-tight">{task.title}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            ✕
          </button>
        </div>
        <p className="mt-1 text-sm text-zinc-500">{task.description}</p>

        <div className="mt-4 flex items-center gap-3">
          <label className="text-xs font-medium text-zinc-500">Frame</label>
          <input
            type="number"
            min={0}
            max={maxFrame}
            value={frameId}
            onChange={(e) => setFrameId(Math.min(maxFrame, Math.max(0, Number(e.target.value))))}
            className="w-28 rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-violet-400"
          />
          <span className="text-xs text-zinc-400">/ {maxFrame}</span>
        </div>

        <p className="mt-4 text-xs font-medium text-zinc-500">Your answer</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {OPTION_LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => submit(i)}
              disabled={isPending || isSuccess}
              className={`rounded-xl px-3 py-3 text-sm font-semibold transition disabled:opacity-40 ${OPTION_STYLE[i]}`}
            >
              {label}
            </button>
          ))}
        </div>

        {submitError && <p className="mt-3 text-xs text-red-500">{submitError}</p>}

        <div className="mt-4 text-center text-xs">
          {isPending && <p className="text-zinc-500">Confirm in your wallet…</p>}
          {isSuccess && (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 font-medium text-emerald-700">
              Submitted! Watch the live feed — correct = instant payout, wrong = rejected on-chain.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}