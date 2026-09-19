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
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  if (!open) return null;

  const autoGenerate = () => {
    const golden = new Map<number, number>();
    for (let i = 0; i < frameCount; i++) golden.set(i, Math.floor(Math.random() * OPTION_LABELS.length));
    setAnswers(
      Array.from(golden.entries())
        .map(([f, o]) => `${f}:${o}`)
        .join("\n"),
    );
  };

  const parseAnswers = (): { rer: Map<number, number>; ok: boolean; msg: string } => {
    const golden = new Map<number, number>();
    if (!answers.trim()) {
      return { rer: golden, ok: false, msg: "Generate or paste the correct answer key." };
    }
    for (const line of answers.split(/[\n,]/)) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const match = trimmed.match(/^(\d+)\s*[:=]\s*(\d+)$/);
      if (!match) return { rer: golden, ok: false, msg: `Bad line: "${line}" — use frameIdx:option` };
      const f = Number(match[1]);
      const o = Number(match[2]);
      if (f >= frameCount) return { rer: golden, ok: false, msg: `Frame ${f} out of range (0..${frameCount - 1})` };
      if (o >= OPTION_LABELS.length) return { rer: golden, ok: false, msg: `Option ${o} invalid` };
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
        setError("Reward must be greater than 0.");
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
      setError(e instanceof Error ? e.message : "Invalid input");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create a micro-task</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-zinc-500">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-violet-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-violet-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-zinc-500">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-violet-400"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500">Reward / task (MON)</label>
              <input
                type="number"
                min="0"
                step="0.001"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-violet-400"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500">Number of frames</label>
            <input
              type="number"
              min="1"
              max="500"
              value={frameCount}
              onChange={(e) => setFrameCount(Math.max(1, Number(e.target.value)))}
              className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-violet-400"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-500">
                Answer key (the contract judges against this)
              </label>
              <button
                onClick={autoGenerate}
                className="text-xs font-medium text-violet-600 hover:text-violet-700"
              >
                Auto-generate
              </button>
            </div>
            <textarea
              value={answers}
              onChange={(e) => setAnswers(e.target.value)}
              rows={4}
              placeholder={"0:0\n1:2\n2:1\n…  (one frameIdx:option per line)"}
              className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 font-mono text-sm outline-none focus:border-violet-400"
            />
            <p className="mt-1 text-[11px] text-zinc-400">
              Options: {OPTION_LABELS.map((l, i) => `${i}=${l}`).join(" · ")}. Every keyed frame is judged by the
              contract and pays instantly when correct.
            </p>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          {isSuccess ? (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Task deployed! View it in the list below.
            </p>
          ) : (
            <button
              onClick={submit}
              disabled={isPending}
              className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
            >
              {isPending ? "Confirming in wallet…" : "Deploy task & fund bounty"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}