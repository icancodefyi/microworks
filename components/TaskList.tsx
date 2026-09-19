"use client";

import { useEffect, useMemo } from "react";
import { useReadContracts, useReadContract } from "wagmi";
import { CONTRACT_ABI } from "@/lib/abi";
import { CONTRACT_ADDRESS, taskTupleToObject, type MicroTask } from "@/lib/constants";
import TaskCard from "./TaskCard";

export default function TaskList({
  onDoTask,
  creating,
}: {
  onDoTask: (task: MicroTask) => void;
  creating: boolean;
}) {
  const { data: countData, refetch: refetchCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "taskCount",
  });

  const count = Number(countData ?? 0n);

  const contracts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "tasks" as const,
        args: [BigInt(i)] as const,
      })),
    [count],
  );

  const { data: tasksData, refetch } = useReadContracts({
    contracts,
  });

  useEffect(() => {
    const t = setInterval(() => {
      refetch();
      refetchCount();
    }, 5000);
    return () => clearInterval(t);
  }, [refetch, refetchCount]);

  const tasks: MicroTask[] = useMemo(
    () =>
      (tasksData ?? [])
        .map((d) => (d.status === "success" ? taskTupleToObject(d.result as readonly unknown[]) : null))
        .filter((t): t is MicroTask => t !== null)
        .sort((a, b) => (a.id > b.id ? -1 : 1)),
    [tasksData],
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">
          Open micro-tasks
          <span className="ml-2 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
            {count} live
          </span>
        </h2>
      </div>

      {creating && (
        <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-6 text-sm text-violet-700">
          <p className="font-medium">Deploying your task…</p>
          <p className="text-xs text-violet-600">
            Confirm in your wallet. It will appear here once it lands on-chain.
          </p>
        </div>
      )}

      {!creating && tasks.length === 0 && (
        <div className="rounded-2xl border border-dashed border-black/15 bg-white/50 px-4 py-12 text-center">
          <p className="text-sm font-medium text-zinc-600">No tasks yet</p>
          <p className="mt-1 text-xs text-zinc-400">
            Be the first — create a micro-task and let the room earn micro-wins.
          </p>
        </div>
      )}

      {tasks.map((t) => (
        <TaskCard key={t.id.toString()} task={t} onDoTask={onDoTask} />
      ))}
    </div>
  );
}