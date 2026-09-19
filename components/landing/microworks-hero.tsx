"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface SampleTask {
  title: string;
  bountyMon: string;
  type: string;
}

const SAMPLE_TASKS: SampleTask[] = [
  { title: "Which response is more accurate?", bountyMon: "0.01", type: "binary-rating" },
  { title: "Is this summary faithful to the source?", bountyMon: "0.02", type: "verification" },
  { title: "Pick the best caption for this image", bountyMon: "0.01", type: "curation" },
  { title: "Does this product description mislead?", bountyMon: "0.02", type: "moderation" },
];

const FLOW_STAGES = [
  "Task created · escrow locked",
  "Workers submit answers",
  "Contract checks golden key",
  "Payout settled · 2% fee kept",
];

const STAGE_MS = 1500;

export function MicroworksHero() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), STAGE_MS);
    return () => clearInterval(id);
  }, []);

  const cycle = Math.floor(tick / FLOW_STAGES.length);
  const step = tick % FLOW_STAGES.length;
  const task = SAMPLE_TASKS[cycle % SAMPLE_TASKS.length];
  const settled = step === FLOW_STAGES.length - 1;
  const progress = ((step + 1) / FLOW_STAGES.length) * 100;

  return (
    <>
      <div className="flex flex-col items-center gap-10 pt-30 pb-10 md:pb-24 text-center">
        {/* Top New Pill */}
        <Link className="flex bg-stone-0 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors" href="/app">
          <p className="text-stone-50 font-medium text-xs font-sans flex items-center justify-center px-4 py-2 rounded-bl-lg rounded-tl-lg bg-stone-800 uppercase leading-4">
            New
          </p>
          <div className="flex items-center rounded-br-lg rounded-tr-lg border border-stone-800">
            <p className="text-stone-800 font-medium text-sm font-sans pl-4 pr-3 leading-5">
              <span className="hidden md:inline font-sans">Live on Monad Testnet:</span> post a micro-task, earn money in seconds.
            </p>
          </div>
        </Link>

        {/* Hero Headings */}
        <div className="flex flex-col gap-4 items-center text-center mx-auto">
          <h1 className="font-sans font-medium text-[36px] sm:text-[54px] lg:text-[72px] leading-[1.08] tracking-tight text-center max-w-4xl mx-auto">
            Micro-tasks. Instant payouts. <em>On-chain.</em>
          </h1>
          <h2 className="text-stone-500 font-sans text-sm sm:text-base md:text-[17px] max-w-4xl leading-relaxed mx-auto text-center">
            Teams drop a micro-task — label, vote, verify, caption — and workers earn
            an instant payout the second a correct answer lands.<br className="hidden sm:inline" />
            No middlemen, no minimums, settled on Monad.
          </h2>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <Link
            className="cursor-pointer box-border flex items-center justify-center font-semibold font-sans uppercase border transition-all ease-in duration-75 whitespace-nowrap text-center select-none disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed gap-x-2 text-sm leading-5 rounded-xl px-4 py-1.5 h-8 bg-gradient-to-b from-white to-stone-100 text-stone-900 border-stone-300 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_3px_rgba(0,0,0,0.06)] hover:bg-stone-50 active:scale-95"
            href="#showcase"
          >
            <div className="flex items-center gap-x-2">How It Works</div>
          </Link>
          <Link
            className="cursor-pointer box-border flex items-center justify-center font-semibold font-sans uppercase border transition-all ease-in duration-75 whitespace-nowrap text-center select-none disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed gap-x-2 text-sm leading-5 rounded-xl px-4 py-1.5 h-8 text-white bg-gradient-to-b from-stone-800 to-stone-950 border-stone-700/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_6px_rgba(0,0,0,0.25)] hover:from-stone-700 hover:to-stone-900 active:scale-95"
            href="/app"
          >
            <div className="flex items-center gap-x-2">Open App</div>
          </Link>
        </div>
      </div>

      {/* Hero Interactive Live Task Demo Widget */}
      <div className="relative w-full min-h-[440px] md:min-h-[520px] flex items-center justify-center overflow-hidden py-6">
        <img
          alt="decorative mountain backdrop"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            color: "transparent",
          } as React.CSSProperties}
          src="/autosend/images/pixel-mountain-lake.png"
        />

        <div className="relative z-10 flex flex-col items-center w-full max-w-80 sm:max-w-xl md:max-w-2xl px-3 sm:px-4">
          <div className="relative w-full px-5 py-5 flex flex-col gap-4 rounded-2xl bg-stone-0 shadow-xl overflow-hidden text-left border border-stone-200">
            {/* Widget Top Bar */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-stone-200" />
                <span className="size-3 rounded-full bg-stone-200" />
                <span className="size-3 rounded-full bg-stone-200" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wide text-stone-500">
                microworks · live task demo · Monad testnet
              </span>
            </div>

            {/* Current Task */}
            <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/60">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-semibold uppercase font-mono text-stone-500">
                    {task.type}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-stone-900 text-white text-xs font-semibold font-mono capitalize">
                  {task.bountyMon} MON bounty
                </span>
              </div>
              <p key={task.title} className="mt-3 text-stone-900 font-sans font-medium text-base sm:text-lg">
                {task.title}
              </p>
            </div>

            {/* Settlement Flow */}
            <div className="flex flex-col gap-2">
              {FLOW_STAGES.map((stage, idx) => {
                const isDone = idx < step;
                const isActive = idx === step;
                return (
                  <div
                    key={stage}
                    className={`flex items-center gap-2.5 text-xs font-sans transition-colors ${
                      isDone || settled
                        ? "text-emerald-700"
                        : isActive
                        ? "text-stone-900"
                        : "text-stone-400"
                    }`}
                  >
                    <span
                      className={`size-4 shrink-0 rounded-full border flex items-center justify-center ${
                        isDone || settled
                          ? "bg-emerald-500 border-emerald-600 text-white"
                          : isActive
                          ? "border-[#2977ff] text-[#2977ff]"
                          : "border-stone-300"
                      }`}
                    >
                      {isDone || settled ? (
                        <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M4 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span className={isActive ? "animate-ping" : ""} />
                      )}
                    </span>
                    <span>{stage}</span>
                  </div>
                );
              })}

              {/* Progress Bar */}
              <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden mt-1">
                <div
                  className="bg-[#2977ff] h-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Settlement Confirmation */}
            {settled && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center justify-between gap-3">
                <p className="text-xs font-sans text-emerald-900 font-medium">
                  ✓ Payout sent — {task.bountyMon} MON to the winning wallet. 2% fee kept· example demo.
                </p>
                <Link href="/app" className="shrink-0 text-[11px] font-semibold uppercase font-sans text-[#2977ff] hover:underline">
                  Earn →
                </Link>
              </div>
            )}

            <p className="text-[11px] font-sans text-stone-400">
              Illustration of the real contract flow (escrow → verify → pay). Try it live with testnet MON.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}