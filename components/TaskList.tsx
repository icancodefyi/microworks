"use client";

import { useEffect, useMemo, useState } from "react";
import { formatEther } from "viem";
import { useReadContracts, useReadContract } from "wagmi";
import { CONTRACT_ABI } from "@/lib/abi";
import { useNetwork } from "@/lib/network";
import {
  taskObjectToMicroTask,
  type MicroTask,
  KIND_OPTIONS,
  KIND_YESNO,
  KIND_RATING,
  KIND_TEXT,
  type TaskOutput,
} from "@/lib/constants";
import TaskCard from "./TaskCard";
import { IconSearch, IconSparkles, IconDeviceGamepad2, IconX } from "@tabler/icons-react";

const FILTER_CATEGORIES = [
  { key: "all", label: "All Categories" },
  { key: "label", label: "Labeling" },
  { key: "poll", label: "Polls" },
  { key: "verify", label: "Verification" },
  { key: "caption", label: "Captioning" },
  { key: "transcribe", label: "Transcription" },
  { key: "qa", label: "QA Audit" },
];

const FILTER_CLASSES = [
  { key: "all", label: "All Classes" },
  { key: String(KIND_OPTIONS), label: "Class 0 · Choice" },
  { key: String(KIND_YESNO), label: "Class 1 · Yes/No" },
  { key: String(KIND_RATING), label: "Class 2 · Rating" },
  { key: String(KIND_TEXT), label: "Class 3 · Text" },
];

export default function TaskList({
  onDoTask,
  creating,
}: {
  onDoTask: (task: MicroTask) => void;
  creating: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { network } = useNetwork();

  const { data: countData, refetch: refetchCount } = useReadContract({
    address: network.contractAddress,
    abi: CONTRACT_ABI,
    chainId: network.chainId,
    functionName: "taskCount",
  });

  const count = Number(countData ?? 0n);

  const contracts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        address: network.contractAddress,
        abi: CONTRACT_ABI,
        chainId: network.chainId,
        functionName: "getTask" as const,
        args: [BigInt(i)] as const,
      })),
    [count, network.contractAddress, network.chainId],
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
        .map((d) => (d.status === "success" ? taskObjectToMicroTask(d.result as TaskOutput) : null))
        .filter((t): t is MicroTask => t !== null)
        .sort((a, b) => (a.id > b.id ? -1 : 1)),
    [tasksData],
  );

  const filteredTasks = useMemo(() => {
    return allTasks.filter((t) => {
      const matchCat = selectedCategory === "all" || t.category.toLowerCase() === selectedCategory;
      const matchClass = selectedClass === "all" || t.kind === Number(selectedClass);
      const matchSearch =
        !searchQuery.trim() ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchClass && matchSearch;
    });
  }, [allTasks, selectedCategory, selectedClass, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search & Dual Filter Rows */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <IconSearch size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search active quests by title, prompt, or keywords..."
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-stone-200 bg-stone-50/60 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#2977ff] focus:ring-2 focus:ring-[#2977ff]/10 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700"
            >
              <IconX size={14} />
            </button>
          )}
        </div>

        {/* Filter Rows: Class & Category */}
        <div className="space-y-2 pt-1">
          {/* Class Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-0.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 shrink-0 mr-1">
              Class:
            </span>
            {FILTER_CLASSES.map((cls) => {
              const isActive = selectedClass === cls.key;
              return (
                <button
                  key={cls.key}
                  type="button"
                  onClick={() => setSelectedClass(cls.key)}
                  className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-stone-900 text-white font-bold shadow-xs"
                      : "bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200"
                  }`}
                >
                  {cls.label}
                </button>
              );
            })}
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-0.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 shrink-0 mr-1">
              Type:
            </span>
            {FILTER_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#2977ff] text-white font-bold shadow-xs"
                      : "bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Header with Count & Live Sync Indicator */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100 border border-stone-200 text-stone-800">
            <IconDeviceGamepad2 size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-sans font-bold text-stone-900 text-base sm:text-lg tracking-tight">
                Arcade Quest Board
              </h2>
              <span className="rounded-full bg-stone-100 border border-stone-200 px-2 py-0.5 text-[11px] font-mono font-semibold text-stone-700">
                {filteredTasks.length} {filteredTasks.length === 1 ? "quest" : "quests"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-stone-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Polling 5s</span>
        </div>
      </div>

      {/* Deploying Notification */}
      {creating && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-4 text-xs font-mono text-blue-900 flex items-center gap-3">
          <div className="size-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
          <div>
            <p className="font-bold">Deploying micro-task quest to Monad...</p>
            <p className="text-blue-700 mt-0.5">
              Confirm in your wallet. The quest will appear on this board once confirmed on-chain.
            </p>
          </div>
        </div>
      )}

      {/* Empty States */}
      {!creating && filteredTasks.length === 0 && (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white/70 p-12 text-center flex flex-col items-center justify-center">
          <div className="size-11 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 mb-3">
            <IconSparkles size={22} />
          </div>
          <p className="text-sm font-bold text-stone-800 font-sans">
            {allTasks.length === 0 ? "No active quests yet" : "No matching quests found"}
          </p>
          <p className="mt-1 text-xs text-stone-500 font-sans max-w-sm leading-relaxed">
            {allTasks.length === 0
              ? "Be the first to create a micro-task and fund the escrow bounty on Monad."
              : "Try switching category or class filters, or clear your search query."}
          </p>
          {(selectedCategory !== "all" || selectedClass !== "all" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedClass("all");
                setSearchQuery("");
              }}
              className="mt-3 text-xs font-mono font-medium text-[#2977ff] hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      )}

      {/* Featured Daily Sprint Card (Subway Surfers Daily Word/Run Style) */}
      {!creating && filteredTasks.length > 0 && (
        <div className="card-arcade overflow-hidden bg-gradient-to-r from-blue-50/50 via-white to-amber-50/40 border-2 border-[#2977ff]/30 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-[#2977ff] text-white px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider">
                  ⚡ FEATURED RUN
                </span>
                <span className="font-mono text-[11px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
                  +{formatEther(filteredTasks[0].reward)} MON · +100 XP
                </span>
              </div>
              <h3 className="font-sans font-black text-stone-900 text-base leading-snug">
                {filteredTasks[0].title}
              </h3>
              <p className="font-sans text-xs text-stone-600 line-clamp-1 max-w-lg">
                {filteredTasks[0].description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onDoTask(filteredTasks[0])}
              className="btn-arcade-green shrink-0 inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-wider shadow-md active:translate-y-1 cursor-pointer"
            >
              <span>Play Run ▶</span>
            </button>
          </div>
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