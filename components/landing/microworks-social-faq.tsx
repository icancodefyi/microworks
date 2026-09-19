"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FAQS } from "./microworks-data";

const ROLE_CARDS = [
  {
    kicker: "For workers",
    body: "Connect any wallet, top up from the testnet faucet, and bank micro-wins between meetings. Payouts hit your wallet as soon as the contract verifies your answer — no minimums, no approvals.",
  },
  {
    kicker: "For teams & builders",
    body: "Drop labeling, moderation, or verification tasks without spinning up a crowd-work platform. The golden-key contract grades answers and pays workers automatically.",
  },
  {
    kicker: "Radically transparent",
    body: "Every task, submission, and settlement is a transaction you can open on the Monad explorer. The contract and app are open source so anyone can audit the rules.",
  },
];

export function MicroworksSocialFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* Who it's for */}
      <div className="my-10 md:my-20 border-x border-stone-200">
        <div className="grid grid-cols-1 sm:divide-x divide-stone-200 lg:grid-cols-3 border-t border-stone-200">
          {ROLE_CARDS.map((card) => (
            <div key={card.kicker} className="flex flex-col">
              <div className="flex-1 px-4 md:px-6 py-6 flex flex-col gap-4 bg-stone-0">
                <p className="text-stone-800 font-medium text-xs font-sans uppercase tracking-widest text-blue-600">
                  {card.kicker}
                </p>
                <p className="text-stone-800 font-normal text-lg font-cooper leading-6">
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Get started CTA */}
      <div className="mt-10 md:mt-20 border-x border-stone-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 border-y border-stone-200">
          <div className="flex flex-col justify-center gap-2 md:gap-4 px-4 md:px-6 py-6 lg:border-r border-stone-200">
            <p className="text-[32px] md:text-[40px] leading-120 text-stone-900 font-normal">
              Ready to earn or post?
            </p>
            <p className="text-base text-stone-500 md:text-xl leading-22 md:leading-7.5">
              Grab testnet MON, open the app, and watch a micro-task settle in seconds.
            </p>
          </div>
          <div className="border-t border-stone-200 lg:border-t-0">
            <Link
              className="text-stone-800 font-medium text-sm font-sans uppercase flex items-center justify-between p-6 group gap-6 bg-stone-0 hover:bg-stone-100 transition-colors ease duration-100 border-b border-stone-200"
              href="/app"
            >
              Open the Live App
              <span className="text-stone-500 group-hover:text-stone-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19.5833M19.5833 12L12.5833 5M19.5833 12L12.5833 19" stroke="currentColor" strokeWidth="2.571" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-800 font-medium text-sm font-sans uppercase flex items-center justify-between p-6 group gap-6 bg-stone-0 hover:bg-stone-100 transition-colors ease duration-100"
              href="https://github.com/icancodefyi/microworks"
            >
              Read the Source on GitHub
              <span className="text-stone-500 group-hover:text-stone-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19.5833M19.5833 12L12.5833 5M19.5833 12L12.5833 19" stroke="currentColor" strokeWidth="2.571" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Accordion FAQ Section */}
      <div id="faq" className="mt-10 md:mt-20 border-x border-stone-200">
        <div className="border-t border-b border-stone-200 p-6 md:p-8 bg-stone-0">
          <div className="max-w-2xl">
            <p className="text-blue-600 font-medium text-sm font-mono uppercase leading-4">
              Frequently Asked Questions
            </p>
            <h2 className="font-sans text-3xl md:text-4xl text-stone-900 mt-2 font-normal">
              Everything you need to know about Microworks.
            </h2>
          </div>
        </div>

        <div className="divide-y divide-stone-200 border-b border-stone-200 bg-white">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={faq.question} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex items-center justify-between p-6 text-left hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <span className="font-sans font-semibold text-base md:text-lg text-stone-900 pr-4">
                    {faq.question}
                  </span>
                  <span
                    className={`text-stone-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-stone-600 text-sm sm:text-base leading-relaxed font-sans bg-stone-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-12 w-full border-x border-stone-200" />
    </>
  );
}