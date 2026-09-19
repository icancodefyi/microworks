"use client";

import { useEffect, useMemo, useState } from "react";
import { useReadContracts, useReadContract } from "wagmi";
import { CONTRACT_ABI } from "@/lib/abi";
import { CONTRACT_ADDRESS, taskTupleToObject, type MicroTask } from "@/lib/constants";
import TaskCard from "./TaskCard";
import { IconSearch, IconFilter, IconSparkles } from "@tabler/icons-react";

const FILTER_CATEGORIES = [
  { key: "all", label: "All Tasks" },
  { key: "label", label: "Labeling" },
  { key: "poll", label: "Polls" },
  { key: "verify", label: "Verification" },
  { key: "caption", label: "Captioning" },
  { key: "transcribe", label: "Transcription" },
  { key: "qa", label: "QA Audit" },
];

export default function TaskList({
  onDoTask,
  creating,
}: {
  onDoTask: (task: MicroTask) => void;
  creating: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  const allTasks: MicroTask[] = useMemo(
    () =>
      (tasksData ?? [])
        .map((d) => (d.status === "success" ? taskTupleToObject(d.result as readonly unknown[]) : null))
        .filter((t): t is MicroTask => t !== null)
        .sort((a, b) => (a.id > b.id ? -1 : 1)),
    [tasksData],
  );

  const filteredTasks = useMemo(() => {
    return allTasks.filter((t) => {
      const matchCat = selectedCategory === "all" || t.category.toLowerCase() === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allTasks, selectedCategory, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search & Category Filter Pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <IconSearch size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search open micro-tasks..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50/50 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#2977ff] focus:outline-none transition-all"
          />
        </div>

        {/* Categories Scroller */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin py-0.5">
          {FILTER_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-stone-900 text-white font-bold shadow-xs"
                    : "bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Header with Count */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="font-sans font-bold text-stone-900 text-lg tracking-tight">
            Open micro-tasks
          </h2>
          <span className="rounded-full bg-stone-100 border border-stone-200 px-2.5 py-0.5 text-xs font-mono font-semibold text-stone-700">
            {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>

        <div className="text-xs font-mono text-stone-500">
          <span>Auto-syncs every 5s</span>
        </div>
      </div>

      {/* Deploying Notification */}
      {creating && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-4 text-xs font-mono text-blue-900 flex items-center gap-3">
          <div className="size-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
          <div>
            <p className="font-bold">Deploying micro-task to Monad...</p>
            <p className="text-blue-700 mt-0.5">
              Confirm in your wallet. The task will appear here once confirmed in the block.
            </p>
          </div>
        </div>
      )}

      {/* Empty States */}
      {!creating && filteredTasks.length === 0 && (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white/70 p-12 text-center flex flex-col items-center justify-center">
          <div className="size-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 mb-3">
            <IconSparkles size={20} />
          </div>
          <p className="text-sm font-semibold text-stone-800 font-sans">
            {allTasks.length === 0 ? "No micro-tasks deployed yet" : "No matching tasks found"}
          </p>
          <p className="mt-1 text-xs text-stone-500 font-sans max-w-sm leading-relaxed">
            {allTasks.length === 0
              ? "Be the first to create a micro-task and fund the escrow bounty on Monad."
              : "Try switching category filters or clearing your search term."}
          </p>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((t) => (
          <TaskCard key={t.id.toString()} task={t} onDoTask={onDoTask} />
        ))}
      </div>
    </div>
  );
}