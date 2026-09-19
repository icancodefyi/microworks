"use client";

import React from "react";
import Link from "next/link";

const FEATURES = [
  {
    title: "Golden-Key Contract Judging",
    body: "When a task is created, its creator stores an answer key in the contract. Every submission is graded on-chain against that key — a match pays instantly, a mismatch is rejected. No middlemen, no disputes.",
    ctaLabel: "Create a task",
    href: "/app",
  },
  {
    title: "Sub-Second Monad Settlement",
    body: "Monad's parallel EVM delivers sub-second finality and near-zero gas, so even a 0.01 MON payout is worth settling on-chain. Tasks, answers, and payouts all land directly on the testnet.",
    ctaLabel: "View on Explorer",
    href: "https://testnet.monadexplorer.com",
    external: true,
  },
  {
    title: "Non-Custodial Escrow",
    body: "Bounties sit locked in the contract until a correct answer lands — workers never wait on approvals and funds never sit in a platform wallet. A flat 2% protocol fee keeps it running.",
    ctaLabel: "Browse tasks",
    href: "/app",
  },
];

const REAL_STATS = [
  { value: "2%", label: "Protocol fee — that's it" },
  { value: "<2s", label: "Settlement on Monad testnet" },
  { value: "0", label: "Minimum payout threshold" },
  { value: "100%", label: "On-chain & verifiable" },
];

export function MicroworksFeatures() {
  return (
    <section id="features">
      <div className="mb-10 md:mb-20 border-x border-stone-200">
        <ul className="grid grid-cols-1 sm:grid-cols-3 border-t border-stone-200">
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="flex flex-col border-b border-stone-200 sm:border-b-0 [&:not(:last-child)]:sm:border-r"
            >
              <div className="flex flex-col gap-2 px-4 sm:px-6 py-6 flex-1 bg-stone-0">
                <p className="text-stone-800 font-medium text-base font-sans">{feature.title}</p>
                <p className="text-stone-500 dark:text-stone-600 font-normal text-base leading-22">
                  {feature.body}
                </p>
              </div>
              <div className="border-t border-stone-200">
                {feature.external ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-stone-500 justify-between gap-4 px-6 py-3 hover:bg-stone-100 transition-colors duration-100 ease"
                    href={feature.href}
                  >
                    <p className="text-stone-800 font-medium text-xs font-sans uppercase">{feature.ctaLabel}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M6.84444 17.4476L17.1564 7.13566M17.1564 7.13566V17.0352M17.1564 7.13566H7.25692" stroke="currentColor" strokeWidth="2.571" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                ) : (
                  <Link
                    className="flex items-center text-stone-500 justify-between gap-4 px-6 py-3 hover:bg-stone-100 transition-colors duration-100 ease"
                    href={feature.href}
                  >
                    <p className="text-stone-800 font-medium text-xs font-sans uppercase">{feature.ctaLabel}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M6.84444 17.4476L17.1564 7.13566M17.1564 7.13566V17.0352M17.1564 7.13566H7.25692" stroke="currentColor" strokeWidth="2.571" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Real, honest metrics */}
      <div className="my-10 md:my-20 border-x border-stone-200">
        <div className="md:border-b border-t border-b-0 border-stone-200">
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-stone-200">
            {REAL_STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col justify-center gap-2 px-4 sm:px-6 py-6 border-stone-200 odd:border-r [&:nth-child(-n+2)]:border-b md:[&:nth-child(-n+2)]:border-b-0 md:[&:nth-child(-n+3)]:border-r"
              >
                <p className="text-stone-800 font-normal text-2xl font-datatype text-center">
                  {stat.value}
                </p>
                <p className="text-stone-500 dark:text-stone-600 font-normal text-sm leading-5 text-center">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-3 p-6 bg-stone-0 border-b border-stone-200">
            <p className="text-stone-800 font-medium text-sm font-sans uppercase leading-5 text-center">
              Grab testnet MON and try it yourself
            </p>
            <div className="flex items-center gap-2">
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer box-border flex items-center justify-center font-semibold font-sans uppercase border transition-all ease-in duration-75 whitespace-nowrap text-center select-none gap-x-2 text-xs leading-4 rounded-lg px-3 py-1.5 h-7 text-white bg-gradient-to-b from-stone-800 to-stone-950 border-stone-700/90 hover:from-stone-700 hover:to-stone-900 active:scale-95"
                href="https://faucet.monad.xyz"
              >
                Faucet
              </a>
              <Link
                className="cursor-pointer box-border flex items-center justify-center font-semibold font-sans uppercase border transition-all ease-in duration-75 whitespace-nowrap text-center select-none gap-x-2 text-xs leading-4 rounded-lg px-3 py-1.5 h-7 text-stone-900 bg-gradient-to-b from-white to-stone-100 border-stone-300 hover:bg-stone-50 active:scale-95"
                href="/app"
              >
                Open App
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}