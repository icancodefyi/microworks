"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useWatchContractEvent, useAccount } from "wagmi";
import { formatUnits } from "viem";
import { CONTRACT_ABI } from "@/lib/abi";
import { CONTRACT_ADDRESS, EXPLORER } from "@/lib/constants";
import { IconExternalLink, IconFlame } from "@tabler/icons-react";

type FeedEvent = {
  key: string;
  kind: "accepted" | "rejected" | "pending" | "task";
  taskId: string;
  frameId: string;
  worker?: string;
  amount?: bigint;
  shortWorker: string;
  me: boolean;
  ts: number;
};

const MAX_ITEMS = 30;

export default function PayoutTicker() {
  const { address } = useAccount();
  const [feed, setFeed] = useState<FeedEvent[]>([]);
  const [filterMode, setFilterMode] = useState<"all" | "mine" | "accepted">("all");
  const me = address?.toLowerCase();

  const push = useRef((e: Omit<FeedEvent, "key" | "ts" | "me" | "shortWorker"> & { worker?: string }) => {
    setFeed((prev) => {
      const item: FeedEvent = {
        ...e,
        key: `${e.kind}-${e.taskId}-${e.frameId}-${Date.now()}-${Math.random()}`,
        me: e.worker ? e.worker.toLowerCase() === me : false,
        shortWorker: e.worker ? `${e.worker.slice(0, 6)}…${e.worker.slice(-4)}` : "",
        ts: Date.now(),
      };
      return [item, ...prev].slice(0, MAX_ITEMS);
    });
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: "AnswerAccepted",
    onLogs: (logs) =>
      logs.forEach((log) =>
        push.current({
          kind: "accepted",
          taskId: log.args.taskId?.toString() ?? "?",
          frameId: log.args.frameId?.toString() ?? "?",
          worker: log.args.worker,
          amount: log.args.amount,
        }),
      ),
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: "AnswerRejected",
    onLogs: (logs) =>
      logs.forEach((log) =>
        push.current({
          kind: "rejected",
          taskId: log.args.taskId?.toString() ?? "?",
          frameId: log.args.frameId?.toString() ?? "?",
          worker: log.args.worker,
        }),
      ),
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: "AnswerPending",
    onLogs: (logs) =>
      logs.forEach((log) =>
        push.current({
          kind: "pending",
          taskId: log.args.taskId?.toString() ?? "?",
          frameId: log.args.frameId?.toString() ?? "?",
          worker: log.args.worker,
        }),
      ),
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: "TaskCreated",
    onLogs: (logs) =>
      logs.forEach((log) =>
        push.current({
          kind: "task",
          taskId: log.args.id?.toString() ?? "?",
          frameId: "—",
        }),
      ),
  });

  // Periodically prune older entries so feed stays lively
  useEffect(() => {
    const t = setInterval(() => {
      setFeed((prev) => prev.filter((e) => Date.now() - e.ts < 60_000));
    }, 10_000);
    return () => clearInterval(t);
  }, []);

  const filteredFeed = useMemo(() => {
    if (filterMode === "mine") return feed.filter((e) => e.me);
    if (filterMode === "accepted") return feed.filter((e) => e.kind === "accepted");
    return feed;
  }, [feed, filterMode]);

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-xs overflow-hidden">
      {/* Header */}
      <div className="border-b border-stone-200 bg-stone-50/80 px-4 py-3 flex items-center justify-between">
        <div>
          <h3 className="font-sans font-bold text-sm text-stone-900 leading-tight">
            Live Settlement Stream
          </h3>
          <p className="text-[11px] font-mono text-stone-500 mt-0.5">
            Real-time Monad state transitions
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>1.2s Finality</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-3 border-b border-stone-200 bg-stone-100/50 text-[11px] font-mono">
        <button
          type="button"
          onClick={() => setFilterMode("all")}
          className={`py-1.5 text-center cursor-pointer transition-colors border-r border-stone-200 ${
            filterMode === "all"
              ? "bg-white font-bold text-stone-900 border-b-2 border-b-[#2977ff]"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          All Events
        </button>
        <button
          type="button"
          onClick={() => setFilterMode("accepted")}
          className={`py-1.5 text-center cursor-pointer transition-colors border-r border-stone-200 ${
            filterMode === "accepted"
              ? "bg-white font-bold text-stone-900 border-b-2 border-b-[#2977ff]"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          Payouts
        </button>
        <button
          type="button"
          onClick={() => setFilterMode("mine")}
          className={`py-1.5 text-center cursor-pointer transition-colors ${
            filterMode === "mine"
              ? "bg-white font-bold text-stone-900 border-b-2 border-b-[#2977ff]"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          My Actions
        </button>
      </div>

      {/* Feed List */}
      <div className="max-h-[440px] overflow-y-auto divide-y divide-stone-100">
        {filteredFeed.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-stone-400">
            <div className="size-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 mx-auto mb-2">
              <IconFlame size={16} />
            </div>
            <span>Waiting for on-chain events...</span>
            <p className="mt-1 text-[11px] text-stone-500">
              Submit a micro-task answer to watch instant Monad settlement.
            </p>
          </div>
        ) : (
          filteredFeed.map((e) => {
            const accepted = e.kind === "accepted";
            const rejected = e.kind === "rejected";
            const task = e.kind === "task";
            const amount =
              e.amount !== undefined ? Number(formatUnits(e.amount, 18)).toFixed(4) : "0";

            return (
              <div
                key={e.key}
                className={`flex items-start gap-2.5 px-3.5 py-2.5 text-xs transition-colors ${
                  e.me ? "bg-blue-50/50" : "hover:bg-stone-50/60"
                }`}
              >
                {/* Status indicator icon */}
                <span
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-mono font-bold ${
                    accepted
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : rejected
                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                      : task
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  {accepted ? "✓" : rejected ? "✕" : task ? "+" : "…"}
                </span>

                {/* Details */}
                <div className="min-w-0 flex-1 font-mono">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-semibold text-stone-800 truncate text-[11px]">
                      {task ? `Task #${e.taskId} Deployed` : `Task #${e.taskId} · Frame #${e.frameId}`}
                    </p>
                    {accepted && (
                      <span className="font-bold text-emerald-700 text-xs shrink-0">
                        +{amount} MON
                      </span>
                    )}
                  </div>

                  <p
                    className={`truncate text-[11px] mt-0.5 ${
                      accepted
                        ? "text-stone-600"
                        : rejected
                        ? "text-rose-600"
                        : "text-stone-400"
                    }`}
                  >
                    {task
                      ? "Escrow funded on Monad"
                      : accepted
                      ? `Paid to ${e.shortWorker}${e.me ? " (you!)" : ""}`
                      : rejected
                      ? `Failed consensus · ${e.shortWorker}`
                      : `Awaiting quorum · ${e.shortWorker}`}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Explorer Footer */}
      <a
        href={EXPLORER}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-1.5 border-t border-stone-200 bg-stone-50 px-4 py-2.5 text-xs font-mono font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors"
      >
        <span>View on Monad Explorer</span>
        <IconExternalLink size={13} />
      </a>
    </div>
  );
}