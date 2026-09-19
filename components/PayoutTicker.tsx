"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useWatchContractEvent, useAccount } from "wagmi";
import { formatUnits } from "viem";
import { CONTRACT_ABI } from "@/lib/abi";
import { useNetwork } from "@/lib/network";
import { IconExternalLink, IconFlame, IconRadio } from "@tabler/icons-react";

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

const MAX_ITEMS = 35;

export default function PayoutTicker() {
  const { address } = useAccount();
  const { network } = useNetwork();
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
    address: network.contractAddress,
    chainId: network.chainId,
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
    address: network.contractAddress,
    chainId: network.chainId,
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
    address: network.contractAddress,
    chainId: network.chainId,
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
    address: network.contractAddress,
    chainId: network.chainId,
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
      setFeed((prev) => prev.filter((e) => Date.now() - e.ts < 120_000));
    }, 15_000);
    return () => clearInterval(t);
  }, []);

  const filteredFeed = useMemo(() => {
    if (filterMode === "mine") return feed.filter((e) => e.me);
    if (filterMode === "accepted") return feed.filter((e) => e.kind === "accepted");
    return feed;
  }, [feed, filterMode]);

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-xs">
      {/* Window Chrome Header */}
      <div className="flex items-center justify-between border-b border-stone-200/80 bg-stone-50/80 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
          <span className="ml-2 font-mono text-[11px] font-medium text-stone-500">
            microworks://settlement-stream.live
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>1.2s Finality</span>
        </div>
      </div>

      {/* Stream Title Bar */}
      <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100 border border-stone-200 text-stone-700">
            <IconRadio size={14} className="text-[#2977ff]" />
          </span>
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-stone-900 leading-tight">
              Live Settlement Stream
            </h3>
            <p className="text-[10px] font-mono text-stone-400">
              Sub-second on-chain payouts
            </p>
          </div>
        </div>

        <span className="font-mono text-[10px] text-stone-400">
          {feed.length} logged
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-3 border-b border-stone-200 bg-stone-100/50 text-[11px] font-mono">
        <button
          type="button"
          onClick={() => setFilterMode("all")}
          className={`py-2 text-center cursor-pointer transition-colors border-r border-stone-200 ${
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
          className={`py-2 text-center cursor-pointer transition-colors border-r border-stone-200 ${
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
          className={`py-2 text-center cursor-pointer transition-colors ${
            filterMode === "mine"
              ? "bg-white font-bold text-stone-900 border-b-2 border-b-[#2977ff]"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          My Actions
        </button>
      </div>

      {/* Feed List */}
      <div className="max-h-[460px] overflow-y-auto divide-y divide-stone-100">
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
                className={`flex items-start gap-2.5 px-4 py-3 text-xs transition-colors ${
                  e.me ? "bg-blue-50/60 border-l-2 border-l-[#2977ff]" : "hover:bg-stone-50/70"
                }`}
              >
                {/* Status indicator icon */}
                <span
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md text-[10px] font-mono font-bold ${
                    accepted
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : rejected
                      ? "bg-rose-100 text-rose-800 border border-rose-300"
                      : task
                      ? "bg-blue-100 text-blue-800 border border-blue-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {accepted ? "✓" : rejected ? "✕" : task ? "+" : "…"}
                </span>

                {/* Details */}
                <div className="min-w-0 flex-1 font-mono">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-bold text-stone-900 truncate text-[11px]">
                      {task ? `Quest #Q${e.taskId} Deployed` : `Quest #Q${e.taskId} · Frame ${e.frameId}`}
                    </p>
                    {accepted && (
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="rounded bg-blue-100/80 px-1 py-0.2 text-[9px] font-bold text-[#2977ff]">
                          +100 XP
                        </span>
                        <span className="font-bold text-emerald-700 text-xs">
                          +{amount} MON
                        </span>
                      </div>
                    )}
                  </div>

                  <p
                    className={`truncate text-[11px] mt-0.5 ${
                      accepted
                        ? "text-stone-600"
                        : rejected
                        ? "text-rose-600 font-semibold"
                        : "text-stone-400"
                    }`}
                  >
                    {task
                      ? "Escrow funded on Monad"
                      : accepted
                      ? `Settled to ${e.shortWorker}${e.me ? " (YOU!)" : ""}`
                      : rejected
                      ? `Key mismatch · Streak reset · ${e.shortWorker}`
                      : `Evaluating · ${e.shortWorker}`}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Explorer Footer */}
      <a
        href={network.explorer}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-1.5 border-t border-stone-200 bg-stone-50/90 px-4 py-2.5 text-xs font-mono font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors"
      >
        <span>View Monad Explorer</span>
        <IconExternalLink size={13} />
      </a>
    </div>
  );
}