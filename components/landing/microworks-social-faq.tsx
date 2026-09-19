"use client";
import React, { useState } from "react";
import Link from "next/link";
import { AgentBrandIcon } from "@/components/brand/client-logos";
import { FAQS } from "./microworks-data";

export function MicroworksSocialFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* Testimonials */}
      <div className="my-10 md:my-20 border-x border-stone-200">
        <div className="grid grid-cols-1 sm:divide-x divide-stone-200 lg:grid-cols-3 border-t border-stone-200">
          {/* Card 1 */}
          <div className="flex flex-col">
            <div className="flex-1 px-4 md:px-6 py-6 flex flex-col gap-4 bg-stone-0">
              <p className="text-stone-800 font-normal text-lg font-cooper leading-6 italic">
                Microworks completely revolutionized our RLHF pipeline. Getting 5,000 human preference pairs validated and settled on Monad in under 2 minutes is impossible anywhere else.
              </p>
            </div>
            <div className="flex items-center justify-between gap-2 px-4 py-6 sm:px-6 border-t border-b border-stone-200">
              <div className="flex items-center gap-2">
                <img alt="Pratyush Rungta" loading="lazy" width="40" height="40" decoding="async" className="object-cover shrink-0 rounded-full" src="/autosend/images/pratyush-firstdollar.webp" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-stone-800 font-medium text-base font-sans uppercase">Pratyush Rungta</p>
                  <p className="text-stone-500 dark:text-stone-600 font-normal text-xs leading-4">First Dollar Labs</p>
                </div>
              </div>
              <div className="block">
                <img alt="First Dollar" loading="lazy" width="96" height="32" decoding="async" className="object-contain shrink-0" src="/autosend/images/firstdollar.webp" />
              </div>
            </div>
          </div>

          <div className="sm:hidden h-10 w-full border-b border-stone-200" />

          {/* Card 2 */}
          <div className="flex flex-col">
            <div className="flex-1 px-4 md:px-6 py-6 flex flex-col gap-4 bg-stone-0">
              <p className="text-stone-800 font-normal text-lg font-cooper leading-6 italic">
                Switching to Microworks was frictionless. Instant on-chain payouts mean our distributed workers never churn, and data turnaround went from days to seconds.
              </p>
              <p className="text-stone-800 font-normal text-lg font-cooper leading-6 italic">
                The HTTP 402 integration with our agent swarms worked out of the box.
              </p>
            </div>
            <div className="flex items-center justify-between gap-2 px-4 py-6 sm:px-6 border-t border-b border-stone-200">
              <div className="flex items-center gap-2">
                <img alt="Arun Anthony" loading="lazy" width="40" height="40" decoding="async" className="object-cover shrink-0 rounded-full" src="/autosend/images/arun-gistr.webp" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-stone-800 font-medium text-base font-sans uppercase">Arun Anthony</p>
                  <p className="text-stone-500 dark:text-stone-600 font-normal text-xs leading-4">Founder, Gistr</p>
                </div>
              </div>
              <div className="block dark:hidden">
                <img alt="Gistr" loading="lazy" width="67" height="32" decoding="async" className="object-contain shrink-0" src="/autosend/images/gistr-light.webp" />
              </div>
              <div className="hidden dark:block">
                <img alt="Gistr" loading="lazy" width="67" height="32" decoding="async" className="object-contain shrink-0" src="/autosend/images/gistr-dark.webp" />
              </div>
            </div>
          </div>

          <div className="sm:hidden h-10 w-full border-b border-stone-200" />

          {/* Card 3 */}
          <div className="flex flex-col">
            <div className="flex-1 px-4 md:px-6 py-6 flex flex-col gap-4 bg-stone-0">
              <p className="text-stone-800 font-normal text-lg font-cooper leading-6 italic">
                We chose Microworks because AI agents can trigger tasks directly and stream sub-cent payments with 1.2s finality on Monad. No banking gatekeepers, no minimum withdrawals.
              </p>
            </div>
            <div className="flex items-center justify-between gap-2 px-4 py-6 sm:px-6 border-t border-b border-stone-200">
              <div className="flex items-center gap-2">
                <img alt="C.C. Fan" loading="lazy" width="40" height="40" decoding="async" className="object-cover shrink-0 rounded-full" src="/autosend/images/ccfan-vivgrid.webp" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-stone-800 font-medium text-base font-sans uppercase">C.C. Fan</p>
                  <p className="text-stone-500 dark:text-stone-600 font-normal text-xs leading-4">CEO Vivgrid</p>
                </div>
              </div>
              <div className="block dark:hidden">
                <img alt="Vivgrid" loading="lazy" width="107" height="36" decoding="async" className="object-contain shrink-0" src="/autosend/images/vivgrid-light.webp" />
              </div>
              <div className="hidden dark:block">
                <img alt="Vivgrid" loading="lazy" width="107" height="36" decoding="async" className="object-contain shrink-0" src="/autosend/images/vivgrid-dark.webp" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ask LLMs Section */}
      <div className="mt-10 md:mt-20 border-x border-stone-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 border-y border-stone-200">
          <div className="flex flex-col justify-center gap-2 md:gap-4 px-4 md:px-6 py-6 lg:border-r border-stone-200">
            <p className="text-[32px] md:text-[40px] leading-120 text-stone-900 font-normal">Still wondering?</p>
            <p className="text-base text-stone-500 md:text-xl leading-22 md:leading-7.5">
              See what your favorite LLM has to say about Microworks, <br className="hidden lg:inline" />
              then make an informed decision.
            </p>
          </div>
          <div className="border-t border-stone-200 lg:border-t-0">
            <div className="grid grid-cols-2">
              {/* ChatGPT */}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 group gap-4 hover:bg-stone-100 transition-colors ease duration-100 border-stone-200 odd:border-r [&:nth-child(-n+2)]:border-b"
                href="https://chat.openai.com/?q=how%20is%20microworks%20better%20than%20traditional%20crowd-working%20platforms%20like%20Amazon%20MTurk%20for%20AI%20agents%20and%20instant%20payouts%3F"
              >
                <span className="flex items-center gap-3">
                  <AgentBrandIcon client="chatgpt" size={24} className="shrink-0 text-stone-900 dark:text-white" />
                  <p className="text-stone-800 font-medium text-sm font-sans uppercase">Ask ChatGPT</p>
                </span>
                <span className="hidden md:inline text-stone-400 group-hover:text-stone-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6.84444 17.4476L17.1564 7.13566M17.1564 7.13566V17.0352M17.1564 7.13566H7.25692" stroke="currentColor" strokeWidth="2.571" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>

              {/* Gemini */}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 group gap-4 hover:bg-stone-100 transition-colors ease duration-100 border-stone-200 odd:border-r [&:nth-child(-n+2)]:border-b"
                href="https://gemini.google.com/app?q=how%20is%20microworks%20faster%20than%20traditional%20data%20labeling%20platforms%3F"
              >
                <span className="flex items-center gap-3">
                  <AgentBrandIcon client="gemini" size={24} className="shrink-0" />
                  <p className="text-stone-800 font-medium text-sm font-sans uppercase">Ask Gemini</p>
                </span>
                <span className="hidden md:inline text-stone-400 group-hover:text-stone-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6.84444 17.4476L17.1564 7.13566M17.1564 7.13566V17.0352M17.1564 7.13566H7.25692" stroke="currentColor" strokeWidth="2.571" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>

              {/* Claude */}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 group gap-4 hover:bg-stone-100 transition-colors ease duration-100 border-stone-200 odd:border-r [&:nth-child(-n+2)]:border-b"
                href="https://claude.ai/new?q=how%20does%20microworks%20use%20Monad%20and%20HTTP%20402%20for%20instant%20micro-task%20settlement%3F"
              >
                <span className="flex items-center gap-3">
                  <AgentBrandIcon client="claude" size={24} className="shrink-0 text-[#D97757]" />
                  <p className="text-stone-800 font-medium text-sm font-sans uppercase">Ask Claude</p>
                </span>
                <span className="hidden md:inline text-stone-400 group-hover:text-stone-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6.84444 17.4476L17.1564 7.13566M17.1564 7.13566V17.0352M17.1564 7.13566H7.25692" stroke="currentColor" strokeWidth="2.571" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>

              {/* Perplexity */}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 group gap-4 hover:bg-stone-100 transition-colors ease duration-100 border-stone-200 odd:border-r [&:nth-child(-n+2)]:border-b"
                href="https://www.perplexity.ai/search?q=how%20does%20microworks%20enable%20autonomous%20AI%20agents%20to%20hire%20human%20workers%20on%20Monad%3F"
              >
                <span className="flex items-center gap-3">
                  <AgentBrandIcon client="perplexity" size={24} className="shrink-0 text-[#22B8CD]" />
                  <p className="text-stone-800 font-medium text-sm font-sans uppercase">Ask Perplexity</p>
                </span>
                <span className="hidden md:inline text-stone-400 group-hover:text-stone-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6.84444 17.4476L17.1564 7.13566M17.1564 7.13566V17.0352M17.1564 7.13566H7.25692" stroke="currentColor" strokeWidth="2.571" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
            </div>
            <Link
              className="text-stone-800 font-medium text-sm font-sans uppercase flex items-center justify-between p-6 group gap-6 bg-stone-0 hover:bg-stone-100 transition-colors ease duration-100 border-t border-stone-200"
              href="/app"
            >
              Explore Live Micro-Tasks
              <span className="text-stone-500 group-hover:text-stone-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19.5833M19.5833 12L12.5833 5M19.5833 12L12.5833 19" stroke="currentColor" strokeWidth="2.571" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
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
