"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CREATORS } from "./microworks-data";

export function MicroworksSkills() {
  const [activeView, setActiveView] = useState<"teaching" | "algorithm">("teaching");
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="my-10 md:my-20 border-x border-stone-200">
      {/* Section Header with View Mode Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-12 border-t border-b gap-4 border-stone-200 px-4 md:px-6 py-6 bg-stone-0">
        <div className="md:col-span-7 flex flex-col gap-2 md:gap-3">
          <p className="text-blue-600 font-medium text-sm font-sans uppercase leading-4">
            #02 - Protocol &amp; Task Designer Playbooks
          </p>
          <h2 className="font-sans text-[32px] md:text-[40px] leading-120 text-stone-900 font-normal">
            Built by elite AI &amp; protocol architects.
          </h2>
          <p className="text-stone-500 font-normal text-sm sm:text-base leading-relaxed max-w-xl">
            We codified the consensus frameworks, anti-sybil filters, and human-in-the-loop workflows of world-class AI labs directly into our autonomous execution engine.
          </p>
        </div>

        {/* Interactive View Toggle */}
        <div className="md:col-span-5 flex md:justify-end items-center">
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveView("teaching")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-sans uppercase font-semibold transition-all cursor-pointer ${
                activeView === "teaching"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Task Philosophy
            </button>
            <button
              type="button"
              onClick={() => setActiveView("algorithm")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-sans uppercase font-semibold transition-all cursor-pointer ${
                activeView === "algorithm"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Escrow Filter
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: Creators 1 & 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-stone-200 bg-stone-0">
        {CREATORS.slice(0, 2).map((creator) => {
          const hasError = imgErrors[creator.id];
          const imgSrc = hasError ? creator.fallbackPhoto : creator.photo;

          return (
            <div
              key={creator.id}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 sm:p-8 hover:bg-stone-50/50 transition-colors"
            >
              {/* Creator Photo */}
              <div className="relative size-36 sm:size-44 md:size-48 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 group">
                <img
                  src={imgSrc}
                  alt={creator.name}
                  onError={() => handleImageError(creator.id)}
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-900/85 text-white backdrop-blur-xs">
                    {creator.badge}
                  </span>
                </div>
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-white/95 text-stone-900 border border-stone-200 text-[10px] font-mono font-semibold shadow-xs">
                  <span className="size-1.5 rounded-full bg-blue-600" />
                  <span>On-Chain Verified</span>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col justify-between flex-1 min-w-0 gap-3 w-full">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-stone-900 font-bold text-lg font-sans uppercase tracking-tight">
                        {creator.name}
                      </h3>
                      <Link
                        href={creator.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-stone-500 font-mono text-xs mt-0.5 hover:text-blue-600 transition-colors underline underline-offset-2 decoration-stone-300 hover:decoration-blue-600"
                      >
                        {creator.affiliation}
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" className="shrink-0">
                          <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </div>
                    <span className="font-mono text-xs font-bold text-blue-600 bg-stone-100 px-2.5 py-1 rounded border border-stone-200 shrink-0">
                      {creator.metricLift}
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <span className="inline-block text-xs font-mono font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                      Framework: {creator.courseName}
                    </span>
                  </div>
                </div>

                {activeView === "teaching" ? (
                  <div className="pt-3 border-t border-stone-100 flex flex-col gap-1.5">
                    <p className="text-stone-800 font-normal text-sm sm:text-[15px] font-cooper leading-relaxed italic">
                      &ldquo;{creator.courseQuote}&rdquo;
                    </p>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
                    <div className="p-2.5 rounded-lg bg-stone-100 font-mono text-[11px] text-stone-800 break-all">
                      <span className="text-stone-400 select-none">FILTER: </span>
                      {creator.gscFilter}
                    </div>
                    <p className="text-stone-600 text-xs font-sans leading-relaxed">
                      <span className="font-semibold text-stone-800">EXECUTES: </span>
                      {creator.copilotPatch}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Row Divider */}
      <div className="border-t border-stone-200" />

      {/* Row 2: Creators 3 & 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-stone-200 bg-stone-0">
        {CREATORS.slice(2, 4).map((creator) => {
          const hasError = imgErrors[creator.id];
          const imgSrc = hasError ? creator.fallbackPhoto : creator.photo;

          return (
            <div
              key={creator.id}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 sm:p-8 hover:bg-stone-50/50 transition-colors"
            >
              {/* Creator Photo */}
              <div className="relative size-36 sm:size-44 md:size-48 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 group">
                <img
                  src={imgSrc}
                  alt={creator.name}
                  onError={() => handleImageError(creator.id)}
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-900/85 text-white backdrop-blur-xs">
                    {creator.badge}
                  </span>
                </div>
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-white/95 text-stone-900 border border-stone-200 text-[10px] font-mono font-semibold shadow-xs">
                  <span className="size-1.5 rounded-full bg-blue-600" />
                  <span>On-Chain Verified</span>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col justify-between flex-1 min-w-0 gap-3 w-full">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-stone-900 font-bold text-lg font-sans uppercase tracking-tight">
                        {creator.name}
                      </h3>
                      <Link
                        href={creator.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-stone-500 font-mono text-xs mt-0.5 hover:text-blue-600 transition-colors underline underline-offset-2 decoration-stone-300 hover:decoration-blue-600"
                      >
                        {creator.affiliation}
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" className="shrink-0">
                          <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </div>
                    <span className="font-mono text-xs font-bold text-blue-600 bg-stone-100 px-2.5 py-1 rounded border border-stone-200 shrink-0">
                      {creator.metricLift}
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <span className="inline-block text-xs font-mono font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                      Framework: {creator.courseName}
                    </span>
                  </div>
                </div>

                {activeView === "teaching" ? (
                  <div className="pt-3 border-t border-stone-100 flex flex-col gap-1.5">
                    <p className="text-stone-800 font-normal text-sm sm:text-[15px] font-cooper leading-relaxed italic">
                      &ldquo;{creator.courseQuote}&rdquo;
                    </p>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
                    <div className="p-2.5 rounded-lg bg-stone-100 font-mono text-[11px] text-stone-800 break-all">
                      <span className="text-stone-400 select-none">FILTER: </span>
                      {creator.gscFilter}
                    </div>
                    <p className="text-stone-600 text-xs font-sans leading-relaxed">
                      <span className="font-semibold text-stone-800">EXECUTES: </span>
                      {creator.copilotPatch}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Footer Link */}
      <Link
        className="flex items-center text-stone-800 justify-between gap-4 p-6 bg-stone-0 hover:bg-stone-100 transition-colors duration-100 ease border-t border-b border-stone-200"
        href="/app"
      >
        <p className="font-medium text-sm font-sans uppercase leading-4">
          Deploy tasks on Monad using these frameworks
        </p>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M6.84444 17.4476L17.1564 7.13566M17.1564 7.13566V17.0352M17.1564 7.13566H7.25692" stroke="currentColor" strokeWidth="2.571" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </section>
  );
}
