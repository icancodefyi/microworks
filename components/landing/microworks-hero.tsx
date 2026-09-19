"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { IconChartBar, IconTerminal2, IconSearch, IconFileText } from "@tabler/icons-react";

const SAMPLE_DOMAINS = ["linear.app", "supabase.com", "stripe.com", "resend.com"];

const BENCHMARK_CTR: Record<number, number> = {
  1: 28.5,
  2: 15.7,
  3: 11.0,
  4: 6.8,
  5: 4.8,
  6: 3.5,
  7: 2.5,
  8: 1.8,
  9: 1.4,
  10: 1.1,
};

type HeroMode = "input" | "analyzing" | "results";
type ResultStep = "revenue" | "agent-prompt" | "health-audit" | "email-report";

export function MicroworksHero() {
  // Input & Audit state
  const [domainInput, setDomainInput] = useState("");
  const [mode, setMode] = useState<HeroMode>("input");
  const [resultStep, setResultStep] = useState<ResultStep>("revenue");
  const [analyzingProgress, setAnalyzingProgress] = useState(0);
  const [analyzingMessage, setAnalyzingMessage] = useState("Connecting to Monad Consensus...");
  const [faviconError, setFaviconError] = useState(false);

  // Calculation parameters
  const [targetRank, setTargetRank] = useState<1 | 3>(1);
  const [currentRank, setCurrentRank] = useState<number>(7);
  const [impressions, setImpressions] = useState<number>(45000);
  const [dealValue, setDealValue] = useState<number>(120);
  const [convRate, setConvRate] = useState<number>(2.5);

  // Actions state
  const [promptCopied, setPromptCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Clean domain computation
  const cleanDomain = useMemo(() => {
    let d = domainInput.trim().toLowerCase();
    d = d.replace(/^https?:\/\//, "");
    d = d.replace(/^www\./, "");
    d = d.split("/")[0];
    d = d.split("?")[0];
    return d || "linear.app";
  }, [domainInput]);

  const capitalizedBrand = useMemo(() => {
    const raw = cleanDomain.split(".")[0] || "Company";
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [cleanDomain]);

  // Favicon URL via Google S2 API
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=64`;

  // Dynamic calculations
  const targetCtr = BENCHMARK_CTR[targetRank] || 28.5;
  const currentCtr = BENCHMARK_CTR[currentRank] || 2.5;
  const headroomCtr = Math.max(0, targetCtr - currentCtr);

  const currentClicks = Math.round(impressions * (currentCtr / 100));
  const targetClicks = Math.round(impressions * (targetCtr / 100));
  const netNewClicks = Math.max(0, targetClicks - currentClicks);

  const netNewDeals = netNewClicks * (convRate / 100);
  const monthlyRevenueLift = Math.round(netNewDeals * dealValue);
  const annualRevenueLift = monthlyRevenueLift * 12;

  // Start analysis trigger
  const handleStartAudit = (domainToAudit?: string) => {
    const selected = domainToAudit || domainInput.trim() || "linear.app";
    setDomainInput(selected);
    if (typeof window !== "undefined") {
      localStorage.setItem("microworks_pending_domain", selected);
    }
    setFaviconError(false);
    setMode("analyzing");
    setAnalyzingProgress(20);
    setAnalyzingMessage(`Fetching DNS & task escrow profile for ${selected.replace(/^https?:\/\//, "")}...`);

    setTimeout(() => {
      setAnalyzingProgress(60);
      setAnalyzingMessage(`Auditing sub-2-second settlement throughput & quorum consensus...`);
    }, 300);

    setTimeout(() => {
      setAnalyzingProgress(95);
      setAnalyzingMessage(`Synthesizing Cursor / Claude agent dispatch prompt via HTTP 402...`);
    }, 600);

    setTimeout(() => {
      setAnalyzingProgress(100);
      setMode("results");
      setResultStep("revenue");
    }, 900);
  };

  const handleReset = () => {
    setMode("input");
    setResultStep("revenue");
    setEmailSubmitted(false);
    setEmail("");
  };

  // Tailored Agent Prompt
  const agentFixPrompt = useMemo(() => {
    return `You are an autonomous AI agent hiring human-in-the-loop workers via https://${cleanDomain} and Microworks.

Objective: Dispatch real-time verification tasks settled on Monad under 2 seconds (+${headroomCtr.toFixed(1)}% consensus headroom, projected +$${monthlyRevenueLift.toLocaleString()}/mo productivity lift).

Please apply the following Next.js HTTP 402 dispatch code directly:

1. Task Creation & Escrow (src/lib/microworks.ts):
   import { MicroworksClient } from "@x402/microworks";

   export const microworks = new MicroworksClient({
     apiKey: process.env.MICROWORKS_API_KEY,
     network: "monad-testnet",
     rpcUrl: "https://testnet-rpc.monad.xyz",
   });

   export async function requestHumanVerification(prompt: string) {
     return await microworks.tasks.create({
       domain: "${cleanDomain}",
       type: "rlhf-preference",
       prompt,
       quorum: ${targetRank === 1 ? 5 : 3},
       bountyMon: "0.08",
       timeoutSec: 30,
     });
   }

2. HTTP 402 Payment Required Handler (app/api/verify/route.ts):
   - Returns native 402 header for autonomous agents to stream sub-cent gas bounties.

3. Sub-Second Monad Finality:
   - Settle instantly with non-custodial smart escrow to verified workers.`;
  }, [cleanDomain, targetRank, headroomCtr, monthlyRevenueLift]);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(agentFixPrompt);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    } catch {
      window.prompt("Copy prompt:", agentFixPrompt);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setEmailSubmitted(true);
  };

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
              <span className="hidden md:inline font-sans">Live Monad Sync:</span> Autonomous micro-tasks &amp; sub-2-second settlement engine.
            </p>
          </div>
        </Link>

        {/* Hero Headings */}
        <div className="flex flex-col gap-4 items-center text-center mx-auto">
          <h1 className="font-sans font-medium text-[36px] sm:text-[54px] lg:text-[72px] leading-[1.08] tracking-tight text-center max-w-4xl mx-auto">
            Micro-work for <em>teams</em><br />
            who ship with <em>agents</em>
          </h1>
          <h2 className="text-stone-500 font-sans text-sm sm:text-base md:text-[17px] max-w-4xl leading-relaxed mx-auto text-center">
            Kill dead time. Settle micro-wins in under 2 seconds.<br className="hidden sm:inline" />
            Any company drops a micro-task — label, vote, verify, caption. Settled instantly on Monad.
          </h2>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <Link
            className="cursor-pointer box-border flex items-center justify-center font-semibold font-sans uppercase border transition-all ease-in duration-75 whitespace-nowrap text-center select-none disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed gap-x-2 text-sm leading-5 rounded-xl px-4 py-1.5 h-8 bg-gradient-to-b from-white to-stone-100 text-stone-900 border-stone-300 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_3px_rgba(0,0,0,0.06)] hover:bg-stone-50 active:scale-95"
            href="#features"
          >
            <div className="flex items-center gap-x-2">Protocol Specs</div>
          </Link>
          <Link
            className="cursor-pointer box-border flex items-center justify-center font-semibold font-sans uppercase border transition-all ease-in duration-75 whitespace-nowrap text-center select-none disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed gap-x-2 text-sm leading-5 rounded-xl px-4 py-1.5 h-8 text-white bg-gradient-to-b from-stone-800 to-stone-950 border-stone-700/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_6px_rgba(0,0,0,0.25)] hover:from-stone-700 hover:to-stone-900 active:scale-95"
            href="/app"
          >
            <div className="flex items-center gap-x-2">Open App</div>
          </Link>
        </div>
      </div>

      {/* Hero Interactive Prompt Widget Window */}
      <div className="relative w-full min-h-[440px] md:min-h-[520px] flex items-center justify-center overflow-hidden py-6">
        <img
          alt="animated input background"
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
          {/* 1. INPUT MODE: Clean Website/Task Input Taker */}
          {mode === "input" && (
            <div className="relative w-full px-4 pt-4 pb-3 flex flex-col gap-3 border-2 border-[#2977ff] rounded-2xl bg-stone-0 shadow-xl transition-all">
              {/* Input Area */}
              <div className="relative z-10 min-h-16 md:min-h-14 flex items-center gap-3 w-full">
                {/* Dynamic favicon or search icon */}
                <div className="size-7 shrink-0 rounded-lg bg-stone-100 flex items-center justify-center overflow-hidden border border-stone-200">
                  {domainInput.trim() ? (
                    !faviconError ? (
                      <img
                        src={faviconUrl}
                        alt={cleanDomain}
                        className="size-4 object-contain"
                        onError={() => setFaviconError(true)}
                      />
                    ) : (
                      <svg className="size-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    )
                  ) : (
                    <svg className="size-4 text-[#2977ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <span className="text-stone-400 font-sans text-sm sm:text-base select-none">https://</span>
                  <input
                    type="text"
                    value={domainInput}
                    onChange={(e) => {
                      setDomainInput(e.target.value);
                      setFaviconError(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleStartAudit();
                    }}
                    placeholder="yourwebsite.com or campaign (e.g. linear.app, stripe.com)"
                    className="w-full text-stone-800 font-normal text-sm sm:text-base leading-6 font-sans bg-transparent outline-none placeholder:text-stone-400"
                    autoFocus
                  />
                </div>
              </div>

              {/* Bottom Row: Quick presets & Submit Button */}
              <div className="relative z-10 flex items-center justify-between pt-2 border-t border-stone-100">
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-sans">
                  <span className="text-stone-400 uppercase text-[10px] hidden xs:inline">Presets:</span>
                  {SAMPLE_DOMAINS.map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => handleStartAudit(sample)}
                      className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer text-[11px] font-sans"
                    >
                      {sample}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleStartAudit()}
                  className="!bg-[#2977ff] hover:!bg-[#1967ef] !text-white !border-[#2977ff] cursor-pointer box-border justify-center shrink-0 flex items-center font-semibold font-sans uppercase border transition-all ease-in duration-75 whitespace-nowrap text-center select-none active:scale-95 text-sm leading-5 rounded-xl w-8 py-1.5 h-8"
                  title="Audit task yield &amp; simulate Monad throughput"
                >
                  <div className="flex items-center gap-x-2">
                    <span className="text-white">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 19.5833V5M12 5L19 12M12 5L5 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* 2. ANALYZING / SCANNING MODE (600ms high-tech scan) */}
          {mode === "analyzing" && (
            <div className="relative w-full px-5 py-6 flex flex-col gap-4 border-2 border-[#2977ff] rounded-2xl bg-stone-0 shadow-xl text-left">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-stone-100 flex items-center justify-center border border-stone-200 overflow-hidden shrink-0">
                  <img src={faviconUrl} alt="" className="size-5 object-contain" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <span className="text-xs font-sans text-stone-500 block uppercase">Auditing Target:</span>
                  <span className="text-sm font-sans font-bold text-stone-900 truncate block">https://{cleanDomain}</span>
                </div>
                <div className="text-xs font-sans font-semibold text-[#2977ff]">{analyzingProgress}%</div>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
                <div
                  className="bg-[#2977ff] h-full transition-all duration-300 ease-out"
                  style={{ width: `${analyzingProgress}%` }}
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-sans text-stone-600">
                <span className="size-2 rounded-full bg-blue-600 animate-ping" />
                <span>{analyzingMessage}</span>
              </div>
            </div>
          )}

          {/* 3. RESULTS STEP-BY-STEP MODE */}
          {mode === "results" && (
            <div className="relative w-full flex flex-col border-2 border-[#2977ff] rounded-2xl bg-stone-0 shadow-xl overflow-hidden text-left">
              {/* Results Window Header */}
              <div className="p-3 sm:p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="size-6 shrink-0 rounded bg-stone-0 flex items-center justify-center overflow-hidden border border-stone-200">
                    <img src={faviconUrl} alt="" className="size-4 object-contain" />
                  </div>
                  <span className="text-xs font-sans font-bold text-stone-900 truncate">
                    {cleanDomain}
                  </span>
                  <span className="text-[10px] font-sans font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    +${monthlyRevenueLift.toLocaleString()}/mo Yield
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] font-sans text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1"
                  title="Test another website"
                >
                  <span>✕ Change Site</span>
                </button>
              </div>

              {/* Step Navigation Pills */}
              <div className="grid grid-cols-4 border-b border-stone-200 bg-stone-100 text-[11px] font-sans">
                <button
                  type="button"
                  onClick={() => setResultStep("revenue")}
                  className={`py-2 px-1 text-center transition-colors cursor-pointer border-r border-stone-200 ${
                    resultStep === "revenue"
                      ? "bg-stone-0 font-bold text-stone-900 border-b-2 border-b-[#2977ff]"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  <span className="inline-flex items-center gap-1 justify-center">
                    <IconChartBar size={13} stroke={2} />
                    <span className="hidden sm:inline">1. </span>Yield
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setResultStep("agent-prompt")}
                  className={`py-2 px-1 text-center transition-colors cursor-pointer border-r border-stone-200 ${
                    resultStep === "agent-prompt"
                      ? "bg-stone-0 font-bold text-stone-900 border-b-2 border-b-[#2977ff]"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  <span className="inline-flex items-center gap-1 justify-center">
                    <IconTerminal2 size={13} stroke={2} />
                    <span className="hidden sm:inline">2. </span>Agent SDK
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setResultStep("health-audit")}
                  className={`py-2 px-1 text-center transition-colors cursor-pointer border-r border-stone-200 ${
                    resultStep === "health-audit"
                      ? "bg-stone-0 font-bold text-stone-900 border-b-2 border-b-[#2977ff]"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  <span className="inline-flex items-center gap-1 justify-center">
                    <IconSearch size={13} stroke={2} />
                    <span className="hidden sm:inline">3. </span>Consensus
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setResultStep("email-report")}
                  className={`py-2 px-1 text-center transition-colors cursor-pointer ${
                    resultStep === "email-report"
                      ? "bg-stone-0 font-bold text-stone-900 border-b-2 border-b-[#2977ff]"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  <span className="inline-flex items-center gap-1 justify-center">
                    <IconFileText size={13} stroke={2} />
                    <span className="hidden sm:inline">4. </span>Summary
                  </span>
                </button>
              </div>

              {/* STEP 1: REVENUE / YIELD LIFT */}
              {resultStep === "revenue" && (
                <div className="p-4 sm:p-5 flex flex-col gap-3.5">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                      <span className="text-[10px] font-sans text-stone-500 uppercase block">Consensus Lift</span>
                      <div className="text-sm sm:text-base font-sans font-bold text-stone-900 mt-0.5">
                        +{headroomCtr.toFixed(1)}% <span className="text-[10px] font-normal text-emerald-600 font-sans">Accuracy</span>
                      </div>
                    </div>
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                      <span className="text-[10px] font-sans text-stone-500 uppercase block">Tasks Settled</span>
                      <div className="text-sm sm:text-base font-sans font-bold text-stone-900 mt-0.5">
                        +{netNewClicks.toLocaleString()}<span className="text-[10px] font-normal text-stone-500">/mo</span>
                      </div>
                    </div>
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="text-[10px] font-sans text-emerald-700 uppercase font-semibold block">Monthly Payout</span>
                      <div className="text-sm sm:text-base font-sans font-bold text-emerald-800 mt-0.5">
                        +${monthlyRevenueLift.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200">
                      <span className="text-[10px] font-sans text-blue-700 uppercase font-semibold block">Annual Pipeline</span>
                      <div className="text-sm sm:text-base font-sans font-bold text-blue-800 mt-0.5">
                        +${annualRevenueLift.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Target Controls & Sliders */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5 text-xs font-sans">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-stone-600 font-medium">Consensus Quorum Target:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setTargetRank(1)}
                          className={`px-2.5 py-1 rounded text-[11px] font-sans cursor-pointer transition-colors ${
                            targetRank === 1
                              ? "bg-[#2977ff] text-white font-semibold shadow-xs"
                              : "bg-stone-0 border border-stone-200 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          🏆 5-Worker Quorum (99.8% Agreement)
                        </button>
                        <button
                          type="button"
                          onClick={() => setTargetRank(3)}
                          className={`px-2.5 py-1 rounded text-[11px] font-sans cursor-pointer transition-colors ${
                            targetRank === 3
                              ? "bg-[#2977ff] text-white font-semibold shadow-xs"
                              : "bg-stone-0 border border-stone-200 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          🥉 3-Worker Quorum (Fast 1.2s Finality)
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-200">
                      <div>
                        <div className="flex justify-between text-[11px] text-stone-600 mb-1">
                          <span>Monthly Task Volume:</span>
                          <span className="font-semibold text-stone-900">{impressions.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="5000"
                          max="200000"
                          step="5000"
                          value={impressions}
                          onChange={(e) => setImpressions(Number(e.target.value))}
                          className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#2977ff]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] text-stone-600 mb-1">
                          <span>Bounty Tier:</span>
                          <span className="font-semibold text-stone-900">Tier #{currentRank} ({currentCtr}% pool)</span>
                        </div>
                        <input
                          type="range"
                          min="4"
                          max="10"
                          step="1"
                          value={currentRank}
                          onChange={(e) => setCurrentRank(Number(e.target.value))}
                          className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#2977ff]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 1 Footer Action */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-stone-500 font-sans">
                      Settled on Monad · Sub-cent gas ($0.0001)
                    </span>
                    <button
                      type="button"
                      onClick={() => setResultStep("agent-prompt")}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-sans font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Next: Agent SDK Prompt</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: AGENT PROMPT CODE */}
              {resultStep === "agent-prompt" && (
                <div className="p-4 sm:p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-sans font-bold text-stone-900">
                        Autonomous Agent Dispatch Protocol
                      </h3>
                      <p className="text-[11px] font-sans text-stone-500">
                        Copy into Cursor, Claude, or autonomous agent loop to dispatch tasks directly via HTTP 402.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyPrompt}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-900 text-xs font-sans font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
                    >
                      {promptCopied ? (
                        <>
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                          </svg>
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="relative rounded-xl border border-stone-200 bg-stone-900 text-stone-100 p-3 max-h-56 overflow-y-auto font-mono text-[11px] leading-relaxed scrollbar-thin">
                    <pre className="whitespace-pre-wrap select-all">
                      <code>{agentFixPrompt}</code>
                    </pre>
                  </div>

                  {/* Step 2 Footer Navigation */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setResultStep("revenue")}
                      className="text-xs font-sans text-stone-600 hover:text-stone-900 cursor-pointer"
                    >
                      ← Back to Yield
                    </button>
                    <button
                      type="button"
                      onClick={() => setResultStep("health-audit")}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-sans font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Next: Protocol Audit</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: HEALTH & CONSENSUS AUDIT */}
              {resultStep === "health-audit" && (
                <div className="p-4 sm:p-5 flex flex-col gap-2.5 text-xs font-sans">
                  <div className="flex items-center justify-between pb-1 border-b border-stone-100">
                    <span className="font-bold text-stone-900">Live Consensus &amp; Protocol Verification</span>
                    <span className="text-[11px] font-mono text-stone-500">Monad Parallel State</span>
                  </div>

                  <div className="p-2 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <div>
                        <span className="font-semibold text-stone-900 block">Dual-Signature Quorum Consensus</span>
                        <span className="text-[11px] text-stone-500">Requires 3 independent workers matching cryptographic agreement</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      PASS
                    </span>
                  </div>

                  <div className="p-2 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">⚡</span>
                      <div>
                        <span className="font-semibold text-stone-900 block">Sub-Second Monad Finality</span>
                        <span className="text-[11px] text-stone-500">10,000 TPS parallel EVM pipeline validated</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                      1.18s
                    </span>
                  </div>

                  <div className="p-2 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <div>
                        <span className="font-semibold text-stone-900 block">Non-Custodial Smart Escrow</span>
                        <span className="text-[11px] text-stone-500">Bounties locked in smart contract, zero centralized custody</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      PASS
                    </span>
                  </div>

                  <div className="p-2 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <div>
                        <span className="font-semibold text-stone-900 block">HTTP 402 Protocol Specification</span>
                        <span className="text-[11px] text-stone-500">Native machine-to-human micropayments supported</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      PASS
                    </span>
                  </div>

                  {/* Step 3 Footer Navigation */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setResultStep("agent-prompt")}
                      className="text-xs font-sans text-stone-600 hover:text-stone-900 cursor-pointer"
                    >
                      ← Back to Prompt
                    </button>
                    <button
                      type="button"
                      onClick={() => setResultStep("email-report")}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-sans font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Next: Executive Summary</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: EMAIL REPORT & TESTNET DISPATCH */}
              {resultStep === "email-report" && (
                <div className="p-4 sm:p-5 flex flex-col gap-3">
                  {!emailSubmitted ? (
                    <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
                      <div>
                        <h3 className="text-xs font-sans font-bold text-stone-900">
                          Receive Full Executive Audit &amp; Protocol Dispatch Specs
                        </h3>
                        <p className="text-[11px] font-sans text-stone-500 mt-1">
                          Includes complete consensus maps, 50-task throughput matrix, Monad contract ABIs, and code diffs for {cleanDomain}.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={`founder@${cleanDomain}`}
                          required
                          className="flex-1 text-xs font-sans px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 outline-none focus:border-stone-800"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#2977ff] hover:bg-[#1967ef] text-white rounded-xl text-xs font-sans font-semibold transition-colors cursor-pointer shrink-0 shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <span>Email Full PDF</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="size-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                          ✓
                        </span>
                        <p className="text-xs font-sans text-emerald-900">
                          Protocol audit dispatched to <strong className="font-semibold">{email}</strong>!
                        </p>
                      </div>
                      <p className="text-[11px] font-sans text-emerald-800">
                        Ready to start earning micro-wins or drop live micro-tasks on Monad? Launch the dapp in 5 seconds.
                      </p>
                      <div>
                        <Link
                          href="/app"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-sans font-semibold transition-colors cursor-pointer"
                        >
                          <span>Open Live Task Board →</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Step 4 Footer Navigation */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-[11px] font-sans">
                    <button
                      type="button"
                      onClick={() => setResultStep("health-audit")}
                      className="text-stone-600 hover:text-stone-900 cursor-pointer"
                    >
                      ← Back to Audit
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-[#2977ff] hover:underline cursor-pointer font-semibold"
                    >
                      Audit Another Website
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
