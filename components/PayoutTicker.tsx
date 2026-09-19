"use client";

import { useEffect, useRef, useState } from "react";
import { useWatchContractEvent, useAccount } from "wagmi";
import { formatUnits } from "viem";
import { CONTRACT_ABI } from "@/lib/abi";
import { CONTRACT_ADDRESS, EXPLORER } from "@/lib/constants";

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

const MAX_ITEMS = 24;

export default function PayoutTicker() {
  const { address } = useAccount();
  const [feed, setFeed] = useState<FeedEvent[]>([]);
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

  // prune stale entries periodically (keep the feed alive, not frozen)
  useEffect(() => {
    const t = setInterval(
      () =>
        setFeed((prev) =>
          prev.filter((e) => Date.now() - e.ts < 30_000),
        ),
      10_000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-black/10 bg-zinc-50 px-4 py-2.5">
        <p className="text-sm font-semibold tracking-tight">
          Live micro-win feed
        </p>
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          on-chain
        </span>
      </div>
      <div className="max-h-[420px] overflow-y-auto">
        {feed.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-zinc-400">
            Waiting for on-chain action…
            <br />
            <span className="text-xs">
              Create a task and complete it to see micro-wins stream in.
            </span>
          </div>
        ) : (
          feed.map((e) => {
            const accepted = e.kind === "accepted";
            const rejected = e.kind === "rejected";
            const task = e.kind === "task";
            const amount =
              e.amount !== undefined
                ? Number(formatUnits(e.amount, 18)).toFixed(4)
                : "0";

            return (
              <div
                key={e.key}
                className={`animate-in flex items-start gap-3 border-b border-black/5 px-4 py-2.5 text-xs ${
                  e.me ? "bg-violet-50" : ""
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    accepted
                      ? "bg-emerald-100 text-emerald-700"
                      : rejected
                        ? "bg-red-100 text-red-600"
                        : task
                          ? "bg-violet-100 text-violet-700"
                          : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {accepted ? "✓" : rejected ? "✗" : task ? "+" : "…"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {task
                      ? `New task #${e.taskId} created`
                      : `frame #${e.frameId} · task #${e.taskId}`}
                  </p>
                  <p
                    className={`truncate ${
                      accepted
                        ? "text-emerald-600"
                        : rejected
                          ? "text-red-500"
                          : "text-zinc-400"
                    }`}
                  >
                    {task
                      ? "jump in and complete it"
                      : accepted
                        ? `+${amount} MON paid to ${e.shortWorker}${e.me ? " (you!)" : ""}`
                        : rejected
                          ? `rejected — no payout · ${e.shortWorker}`
                          : `awaiting consensus · ${e.shortWorker}`}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
      <a
        href={EXPLORER}
        target="_blank"
        rel="noreferrer"
        className="block border-t border-black/10 bg-zinc-50 px-4 py-2 text-center text-xs font-medium text-violet-600 hover:bg-zinc-100"
      >
        Open in Monad explorer
      </a>
    </div>
  );
}