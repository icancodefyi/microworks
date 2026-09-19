"use client";
import React, { useState } from "react";
import Link from "next/link";
import { TRANSACTIONAL_SNIPPETS } from "./microworks-data";

// Code Snippets for Section 1 Language Switcher
const CODE_SNIPPETS: Record<string, { label: string; icon: string; code: string }> = {
  curl: {
    label: "cURL",
    icon: "/autosend/images/bash.svg",
    code: TRANSACTIONAL_SNIPPETS.bash,
  },
  nodejs: {
    label: "NodeJS",
    icon: "/autosend/images/nodejs.svg",
    code: TRANSACTIONAL_SNIPPETS.nodejs,
  },
  python: {
    label: "Python",
    icon: "/autosend/images/python.svg",
    code: TRANSACTIONAL_SNIPPETS.python,
  },
  rust: {
    label: "Rust",
    icon: "/autosend/images/rust.svg",
    code: TRANSACTIONAL_SNIPPETS.rust,
  },
  go: {
    label: "Go",
    icon: "/autosend/images/go.svg",
    code: TRANSACTIONAL_SNIPPETS.go,
  },
};

interface TabItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  renderPreview: () => React.ReactNode;
}

function ShowcaseSectionWrapper({
  id,
  badgeNumber,
  badgeText,
  badgeColorClass,
  headline,
  backgroundImage,
  tabs,
  ctaText,
  ctaLink,
  heightClass = "md:h-[580px]",
}: {
  id?: string;
  badgeNumber: string;
  badgeText: string;
  badgeColorClass: string;
  headline: string;
  backgroundImage: string;
  tabs: TabItem[];
  ctaText: string;
  ctaLink: string;
  heightClass?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [cycleKey, setCycleKey] = useState(0);
  const [mobileOpen, setMobileOpen] = useState<number | null>(0);

  const handleCycleNext = () => {
    setActiveIndex((prev) => (prev + 1) % tabs.length);
    setCycleKey((prev) => prev + 1);
  };

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    setCycleKey((prev) => prev + 1);
  };

  return (
    <div id={id} className="flex flex-col border-x border-t border-b-0 md:border-b border-stone-200 scroll-mt-24">
      {/* Section Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b gap-4 border-stone-200 px-4 md:px-6 py-6">
        <div className="flex flex-col gap-2 md:gap-4">
          <p className={`${badgeColorClass} font-medium text-sm font-mono uppercase leading-4`}>
            {badgeNumber} - {badgeText}
          </p>
          <h2 className="font-sans text-[32px] md:text-[40px] leading-120 lg:whitespace-pre-line text-stone-900 font-normal">
            {headline}
          </h2>
        </div>
      </div>

      {/* Mobile Accordion */}
      <div className="block md:hidden">
        <div className="flex flex-col w-full">
          {tabs.map((tab, idx) => {
            const isOpen = mobileOpen === idx;
            return (
              <div key={tab.id} className="flex flex-col">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setMobileOpen(isOpen ? null : idx)}
                  className={`flex items-center gap-2 p-4 border-b border-stone-200 transition-colors duration-200 ease ${
                    isOpen ? "bg-stone-0" : "bg-stone-50"
                  }`}
                >
                  <span className="text-stone-800 shrink-0">{tab.icon}</span>
                  <p className="text-stone-800 font-medium text-base flex-1 text-left font-mono uppercase leading-4">
                    {tab.label}
                  </p>
                  <span
                    className={`text-stone-800 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="overflow-hidden bg-stone-0 border-b border-stone-200">
                    <div className="flex flex-col h-min">
                      <div className="p-4">
                        <p className="text-stone-800 font-normal text-base">{tab.description}</p>
                      </div>
                      <div className="relative overflow-hidden min-h-[460px]">
                        <img src={backgroundImage} alt="" className="w-full h-full object-cover absolute inset-0" />
                        <div className="relative z-10 p-2 sm:p-4 flex items-center justify-center">
                          {tab.renderPreview()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Tabs Layout with In-Place Progress Bar */}
      <div
        className={`hidden md:grid md:grid-cols-2 ${heightClass} md:overflow-hidden`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left column tabs */}
        <div className="md:border-r border-stone-200 flex flex-col">
          <div className="flex divide-y divide-stone-200 flex-col h-full">
            {tabs.map((tab, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelect(idx)}
                  className={`relative isolate flex items-center gap-4 p-6 text-left cursor-pointer flex-grow transition-colors duration-150 ${
                    isActive ? "bg-stone-0" : "hover:bg-stone-50"
                  }`}
                >
                  <div className="flex gap-4 w-full">
                    {isActive && (
                      <>
                        <div className="absolute left-0 inset-y-0 w-1 overflow-hidden">
                          <div
                            key={cycleKey}
                            className="showcase-tab-progress-bar absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-stone-0)_0%,var(--color-stone-0)_40%,#2977ff_100%)]"
                            style={{
                              willChange: "transform",
                              animation: "showcase-tab-progress 6s linear forwards",
                              animationPlayState: isHovered ? "paused" : "running",
                            }}
                            onAnimationEnd={handleCycleNext}
                          />
                        </div>
                        <div className="absolute inset-0 -z-10 bg-stone-0" />
                      </>
                    )}
                    <span className="shrink-0 text-stone-800">{tab.icon}</span>
                    <div className="flex flex-col gap-2">
                      <p className="text-stone-800 font-medium text-base font-mono uppercase leading-4">
                        {tab.label}
                      </p>
                      <p className="text-stone-500 font-normal text-base">{tab.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column preview */}
        <div className="overflow-hidden relative bg-stone-100">
          <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
          {tabs.map((tab, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div
                key={tab.id}
                className="absolute inset-0 transition-all duration-300 ease-out"
                style={{
                  willChange: "opacity, transform",
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateY(0)" : "translateY(10px)",
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                {tab.renderPreview()}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Footer Link */}
      <Link
        className="flex items-center text-stone-800 justify-between gap-4 p-6 bg-stone-0 hover:bg-stone-100 transition-colors duration-100 ease border-t border-stone-200"
        href={ctaLink}
      >
        <p className="font-medium text-sm font-mono uppercase leading-4">{ctaText}</p>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M6.84444 17.4476L17.1564 7.13566M17.1564 7.13566V17.0352M17.1564 7.13566H7.25692" stroke="currentColor" strokeWidth="2.571" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}

export function MicroworksShowcase() {
  const [activeLang, setActiveLang] = useState<string>("curl");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = CODE_SNIPPETS[activeLang]?.code || "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Section 1 Tabs
  const section1Tabs: TabItem[] = [
    {
      id: "http-402",
      label: "HTTP 402 Task Dispatch",
      description: "Trigger human verification bounties programmatically with instant payment escrow headers.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="1.8" d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12Z" />
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 13.5 7.5 9l1.875 4.5M6 13.5 5.5 15m.5-1.5h3.375m0 0L10 15M12.5 12V9.7c0-.186 0-.28.024-.355a.5.5 0 0 1 .322-.32C12.92 9 13.013 9 13.2 9h1.3a1.5 1.5 0 0 1 0 3zm0 0v3M18.5 9v6" />
        </svg>
      ),
      renderPreview: () => (
        <div className="absolute inset-0 flex justify-center p-6 items-start">
          <div className="bg-stone-0 rounded-lg shadow-xl overflow-hidden w-full h-full flex flex-col">
            <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-2.5 border-b border-stone-200">
              <span className="size-3 rounded-full bg-stone-200" />
              <span className="size-3 rounded-full bg-stone-200" />
              <span className="size-3 rounded-full bg-stone-200" />
              <span className="text-[11px] font-mono text-stone-500 ml-2">microworks-x402-v1</span>
            </div>
            <div className="flex flex-1 min-h-0">
              <div className="flex flex-col border-r border-stone-200 bg-stone-100 shrink-0 overflow-y-auto w-28">
                {Object.entries(CODE_SNIPPETS).map(([key, item]) => {
                  const isSelected = activeLang === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveLang(key)}
                      className={`flex items-center gap-2 px-3 h-10 text-xs font-mono font-medium border-b border-stone-200 cursor-pointer whitespace-nowrap transition-colors ${
                        isSelected ? "bg-stone-0 text-stone-900 font-semibold" : "bg-stone-100 text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      <img src={item.icon} alt={item.label} className="h-3.5 w-3.5 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex-1 flex flex-col min-w-0 bg-stone-950 text-stone-100">
                <div className="flex items-center justify-between px-4 py-2 border-b border-stone-800 bg-stone-900/50">
                  <span className="text-xs font-mono text-stone-400">sdk-dispatch.{activeLang}</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-xs font-mono text-stone-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono overflow-auto flex-1 leading-relaxed text-stone-300">
                  <code>{CODE_SNIPPETS[activeLang]?.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "agent-loop",
      label: "Agentic Human-in-the-Loop",
      description: "When model confidence drops below 0.85, automatically hire 3 workers for real-time arbitration.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="1.8" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinejoin="round" />
        </svg>
      ),
      renderPreview: () => (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <img src="/autosend/images/domain-warmup-landing-page-light.webp" alt="Agent Loop" className="object-contain w-full h-full rounded-lg shadow-xl" />
        </div>
      ),
    },
    {
      id: "monad-throughput",
      label: "Parallel State Pipeline",
      description: "Settle 10,000 tasks per second concurrently with zero transaction queue contention.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="1.8" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinejoin="round" />
        </svg>
      ),
      renderPreview: () => (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <img src="/autosend/images/email-api-landing-page-light.webp" alt="Monad Throughput" className="object-contain w-full h-full rounded-lg shadow-xl" />
        </div>
      ),
    },
  ];

  // Section 2 Tabs
  const section2Tabs: TabItem[] = [
    {
      id: "quorum-consensus",
      label: "Multi-Worker Quorum",
      description: "3 to 5 independent workers solve each verification challenge in blind parallel sessions.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      renderPreview: () => (
        <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-5">
          <div className="bg-stone-0 rounded-xl border border-stone-200 shadow-xl overflow-hidden w-full max-w-lg flex flex-col font-mono text-xs">
            <div className="flex items-center justify-between px-4 py-2.5 bg-stone-100 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <svg className="size-3.5 text-stone-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
                <span className="font-semibold text-stone-900">Task #891: RLHF Quality Preference</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                QUORUM REACHED
              </span>
            </div>
            <div className="p-4 bg-stone-900 text-stone-200 space-y-2 text-[11px] leading-relaxed">
              <div className="text-stone-400">Worker 1 (0x49a...): Selected Option A (Confidence 0.98)</div>
              <div className="text-stone-400">Worker 2 (0x17c...): Selected Option A (Confidence 0.95)</div>
              <div className="text-stone-400">Worker 3 (0xb32...): Selected Option A (Confidence 0.99)</div>
              <div className="text-emerald-400 mt-2 font-bold">+ Consensus: 100% Agreement (3/3)</div>
              <div className="text-emerald-400">+ Payout: 0.15 MON released from smart contract escrow</div>
            </div>
            <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[11px]">
              <span className="text-stone-500 font-medium">Finality: 1.18s on Monad</span>
              <span className="text-emerald-700 font-semibold">✓ Non-Custodial Settled</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "anti-sybil",
      label: "Reputation & Staking Weights",
      description: "Workers stake small security bonds to unlock high-yield bounties, eliminating bot networks.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      renderPreview: () => (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <img src="/autosend/images/segment-landing-page-light.webp" alt="Anti Sybil" className="object-contain w-full h-full rounded-lg shadow-xl" />
        </div>
      ),
    },
    {
      id: "slashing",
      label: "Automated Fraud Slashing",
      description: "Outliers who submit random answers fail consensus validation and have bonds slashed.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="1.8" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      renderPreview: () => (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <img src="/autosend/images/smart-triggers-landing-page.webp" alt="Slashing" className="object-contain w-full h-full rounded-lg shadow-xl" />
        </div>
      ),
    },
  ];

  // Section 3 Tabs
  const section3Tabs: TabItem[] = [
    {
      id: "instant-payouts",
      label: "Sub-2-Second Monad Settlement",
      description: "Workers receive non-custodial payouts instantly to their wallet as soon as tasks pass quorum.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinejoin="round" />
        </svg>
      ),
      renderPreview: () => (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <img src="/autosend/images/campaign-landing-page-light.webp" alt="Instant Settlement" className="object-contain w-full h-full rounded-lg shadow-xl" />
        </div>
      ),
    },
    {
      id: "zero-threshold",
      label: "Zero Minimum Withdrawal",
      description: "Withdraw 5 cents or 50 dollars. With $0.0001 gas fees, every micro-win is deposited immediately.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="1.8" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      renderPreview: () => (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <img src="/autosend/images/email-builder-landing-page-light.webp" alt="Zero Minimum" className="object-contain w-full h-full rounded-lg shadow-xl" />
        </div>
      ),
    },
    {
      id: "analytics",
      label: "Real-Time Payout Analytics",
      description: "Monitor global worker throughput, task completion velocities, and consensus lift in real time.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="1.8" d="M3 3v18h18M7 16l4-4 4 4 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      renderPreview: () => (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <img src="/autosend/images/automation-analytics-landing-page-light.webp" alt="Analytics" className="object-contain w-full h-full rounded-lg shadow-xl" />
        </div>
      ),
    },
  ];

  return (
    <div id="showcase" className="flex my-10 md:my-20 flex-col gap-20">
      {/* Section #01 */}
      <ShowcaseSectionWrapper
        badgeNumber="#01"
        badgeText="HTTP 402 & Agent SDK"
        badgeColorClass="text-blue-600 dark:text-blue-400"
        headline="Connect Claude, Cursor & AI agents to on-chain human workers."
        backgroundImage="/autosend/images/green-mountains.webp"
        tabs={section1Tabs}
        ctaText="Explore HTTP 402 Protocol"
        ctaLink="/app"
      />

      {/* Section #02 */}
      <ShowcaseSectionWrapper
        badgeNumber="#02"
        badgeText="Consensus & Anti-Sybil"
        badgeColorClass="text-indigo-600"
        headline="Cryptographic quorum verification and automated fraud slashing."
        backgroundImage="/autosend/images/lake-beach.png"
        tabs={section2Tabs}
        ctaText="Explore Quorum Architecture"
        ctaLink="/app"
      />

      {/* Section #03 */}
      <ShowcaseSectionWrapper
        badgeNumber="#03"
        badgeText="Sub-Second Monad Payouts"
        badgeColorClass="text-emerald-600 dark:text-emerald-400"
        headline="Sub-2-second settlement straight to non-custodial wallets."
        backgroundImage="/autosend/images/green-hills.png"
        tabs={section3Tabs}
        ctaText="View Live Payout Ticker"
        ctaLink="/app"
      />
    </div>
  );
}
