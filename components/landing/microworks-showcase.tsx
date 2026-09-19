"use client";

import React from "react";
import Link from "next/link";

const STEPS = [
  {
    badgeNumber: "#01",
    badgeText: "Post a micro-task",
    headline: "Set a bounty, store the answer key.",
    body: "Name the task, pick a type, set a bounty in MON, and give the contract a golden answer key. Your MON is locked in escrow the moment the task goes live — a 2% fee funds the protocol.",
    mock: {
      rows: [
        ["task", "pick the more accurate response"],
        ["reward_mon", "0.01"],
        ["golden_key", "A"] as [string, string],
        ["status", "escrow locked"] as [string, string],
      ],
    },
  },
  {
    badgeNumber: "#02",
    badgeText: "Workers submit",
    headline: "Any wallet can hustle for micro-wins.",
    body: "Workers browse the live task board, grab a task, and submit an answer straight from their wallet. Each submission is a signed transaction — visible on-chain the moment it lands.",
    mock: {
      rows: [
        ["worker", "0x3Fc...92A"] as [string, string],
        ["answer", "A"] as [string, string],
        ["status", "submitted · pending"] as [string, string],
      ],
    },
  },
  {
    badgeNumber: "#03",
    badgeText: "Contract settles",
    headline: "Correct answer in, payout out.",
    body: "The contract compares the answer against the stored key. A match pays the worker the bounty instantly; a wrong answer is rejected on-chain. Everything is verifiable on the Monad explorer.",
    mock: {
      rows: [
        ["match", "golden_key === answer"] as [string, string],
        ["payout", "0.01 MON sent"] as [string, string],
        ["status", "✓ settled"] as [string, string],
      ],
    },
  },
];

export function MicroworksShowcase() {
  return (
    <div id="showcase" className="flex my-10 md:my-20 flex-col gap-20">
      {STEPS.map((step) => (
        <div key={step.badgeNumber} className="flex flex-col border-x border-t border-b md:border-b border-stone-200 scroll-mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 border-b gap-4 border-stone-200 px-4 md:px-6 py-6">
            <div className="flex flex-col gap-2 md:gap-4">
              <p className="text-blue-600 font-medium text-sm font-mono uppercase leading-4">
                {step.badgeNumber} - {step.badgeText}
              </p>
              <h2 className="font-sans text-[32px] md:text-[40px] leading-120 lg:whitespace-pre-line text-stone-900 font-normal">
                {step.headline}
              </h2>
              <p className="text-stone-500 font-normal text-base md:text-lg leading-7 max-w-xl">{step.body}</p>
            </div>
          </div>

          {/* Mock contract window */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="hidden md:flex md:border-r border-stone-200" />
            <div className="border-t md:border-t-0 md:border-l border-stone-200 bg-stone-50 p-4 sm:p-6">
              <div className="bg-stone-0 rounded-lg border border-stone-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2.5 bg-stone-100 border-b border-stone-200">
                  <div className="flex items-center gap-1.5">
                    <span className="size-3 rounded-full bg-stone-200" />
                    <span className="size-3 rounded-full bg-stone-200" />
                    <span className="size-3 rounded-full bg-stone-200" />
                  </div>
                  <span className="text-[11px] font-mono text-stone-500 capitalize">
                    MicroTask.sol · {step.badgeText}
                  </span>
                </div>
                <div className="p-4 font-mono text-xs space-y-2">
                  {step.mock.rows.map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-4">
                      <span className="text-stone-500">{k}</span>
                      <span className="text-stone-900 font-medium truncate">{v}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-stone-100 text-stone-400 text-[11px]">
                    automated on-chain · no middlemen
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link
            className="flex items-center text-stone-800 justify-between gap-4 p-6 bg-stone-0 hover:bg-stone-100 transition-colors duration-100 ease border-t border-stone-200"
            href="/app"
          >
            <p className="font-medium text-sm font-mono uppercase leading-4">Try it live in the app</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6.84444 17.4476L17.1564 7.13566M17.1564 7.13566V17.0352M17.1564 7.13566H7.25692" stroke="currentColor" strokeWidth="2.571" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      ))}
    </div>
  );
}