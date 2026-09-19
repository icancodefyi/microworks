"use client";
import React from "react";
import Link from "next/link";

const CONTRACT_SURFACE: [string, string][] = [
  ["createTask(...)", "lock bounty + golden key, start task"],
  ["submitAnswer(...)", "workers answer from any wallet"],
  ["closeTask(...)", "pay out correct answers, refund remainder"],
  ["withdrawFees(...)", "claim 2% protocol fee"],
];

export function MicroworksMultiCampaign() {
  return (
    <div id="monad" className="my-10 md:my-20 border border-stone-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-stone-200">
        {/* Text Column */}
        <div className="bg-stone-50 flex flex-col justify-between px-4 gap-6 py-6 md:px-6">
          <p className="text-blue-600 font-medium text-sm font-sans uppercase leading-4">Built on Monad</p>
          <div className="flex flex-col gap-4 md:gap-6">
            <h2 className="font-sans text-[32px] md:text-[40px] leading-120 -tracking-[2%]">
              One contract. Every task, answer and payout on-chain.
            </h2>
            <p className="text-stone-500 text-base md:text-xl leading-7">
              Microworks is a single EVM contract on the Monad testnet. Because Monad is
              almost-free and fast, even sub-cent micro-payouts make sense on-chain — no
              custody, no chargebacks, no withdrawal queues.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              className="cursor-pointer box-border flex items-center justify-center font-semibold font-sans uppercase border transition-all ease-in duration-75 whitespace-nowrap text-center select-none gap-x-2 text-xs leading-4 rounded-lg px-3 py-1.5 h-7 text-white bg-gradient-to-b from-stone-800 to-stone-950 border-stone-700/90 hover:from-stone-700 hover:to-stone-900 active:scale-95"
              href="/app"
            >
              Launch App
            </Link>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer box-border flex items-center justify-center font-semibold font-sans uppercase border transition-all ease-in duration-75 whitespace-nowrap text-center select-none gap-x-2 text-xs leading-4 rounded-lg px-3 py-1.5 h-7 text-stone-900 bg-gradient-to-b from-white to-stone-100 border-stone-300 hover:bg-stone-50 active:scale-95"
              href="https://testnet.monadexplorer.com"
            >
              Explore Testnet
            </a>
          </div>
        </div>

        {/* Contract Surface Card */}
        <div className="relative w-full h-full bg-stone-100 p-6 flex items-center justify-center">
          <div className="bg-stone-950 rounded-xl border border-stone-800 shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-stone-900/60 border-b border-stone-800">
              <span className="text-xs font-mono text-stone-200 font-semibold">MicroTask.sol</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-900/40 text-emerald-300">
                EVM · Monad testnet
              </span>
            </div>
            <div className="p-4 font-mono text-[12px] space-y-2.5">
              {CONTRACT_SURFACE.map(([fn, desc]) => (
                <div key={fn} className="flex items-center justify-between gap-4 border-b border-stone-800/60 pb-2.5 last:border-0 last:pb-0">
                  <span className="text-emerald-300 whitespace-nowrap">{fn}</span>
                  <span className="text-stone-400 text-right text-[11px] leading-4">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}