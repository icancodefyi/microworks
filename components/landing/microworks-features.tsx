"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface LogoItemData {
  name: string;
  light: string;
  dark: string;
  width: number;
  height: number;
}

const COMPANY_LOGOS_GROUPS: LogoItemData[][] = [
  [
    { name: "Peerlist", light: "/autosend/images/peerlist-light.webp", dark: "/autosend/images/peerlist-dark.webp", width: 112, height: 24 },
    { name: "Supermemory", light: "/autosend/images/supermemory-light.webp", dark: "/autosend/images/supermemory-dark.webp", width: 220, height: 32 },
    { name: "gistr", light: "/autosend/images/gistr-light.webp", dark: "/autosend/images/gistr-dark.webp", width: 67, height: 32 },
    { name: "GuideJar", light: "/autosend/images/guidejar-light.webp", dark: "/autosend/images/guidejar-dark.webp", width: 145, height: 32 },
  ],
  [
    { name: "Vivgrid", light: "/autosend/images/vivgrid-light.webp", dark: "/autosend/images/vivgrid-dark.webp", width: 112, height: 32 },
    { name: "Mission Control HQ", light: "/autosend/images/missioncontrolhq-light.webp", dark: "/autosend/images/missioncontrolhq-dark.webp", width: 220, height: 32 },
    { name: "Brickspace Labs", light: "/autosend/images/brickspace-light.webp", dark: "/autosend/images/brickspace-dark.webp", width: 180, height: 24 },
    { name: "Youform", light: "/autosend/images/youform-light.webp", dark: "/autosend/images/youform-dark.webp", width: 145, height: 32 },
  ],
  [
    { name: "Orshot", light: "/autosend/images/orshot-light.webp", dark: "/autosend/images/orshot-dark.webp", width: 112, height: 32 },
    { name: "First Dollar", light: "/autosend/images/firstdollar.webp", dark: "/autosend/images/firstdollar.webp", width: 130, height: 32 },
    { name: "OpenAlternative", light: "/autosend/images/open-alternative-light.webp", dark: "/autosend/images/open-alternative-dark.webp", width: 180, height: 32 },
    { name: "NutriScan App", light: "/autosend/images/nutriscan-light.webp", dark: "/autosend/images/nutriscan-dark.webp", width: 180, height: 24 },
  ],
  [
    { name: "Openstatus", light: "/autosend/images/openstatus-logo-light.png", dark: "/autosend/images/openstatus-logo-dark.png", width: 168, height: 24 },
    { name: "SaffronStays", light: "/autosend/images/safranstays-logo-light.png", dark: "/autosend/images/safranstays-logo-dark.png", width: 165, height: 27 },
    { name: "AceternityUI", light: "/autosend/images/aceternity-logo-light.png", dark: "/autosend/images/aceternity-logo-dark.png", width: 159, height: 32 },
    { name: "Audionotes", light: "/autosend/images/audionotes-logo-light.png", dark: "/autosend/images/audionotes-logo-dark.png", width: 142, height: 24 },
  ],
];

function LogoCell({ logo, state, animate, index }: { logo: LogoItemData; state: "exit" | "enter"; animate: boolean; index: number }) {
  return (
    <div className="flex items-center justify-center px-4 sm:px-6 py-6">
      <div
        className="logo-carousel-item"
        data-state={state}
        data-animate={animate ? "true" : "false"}
        style={{ "--delay": `${0.14 * index}s` } as React.CSSProperties}
      >
        <div className="block dark:hidden">
          <img
            alt={logo.name}
            loading="lazy"
            width={logo.width}
            height={logo.height}
            decoding="async"
            className="object-contain"
            style={{ color: "transparent" }}
            src={logo.light}
          />
        </div>
        <div className="hidden dark:block">
          <img
            alt={logo.name}
            loading="lazy"
            width={logo.width}
            height={logo.height}
            decoding="async"
            className="object-contain"
            style={{ color: "transparent" }}
            src={logo.dark}
          />
        </div>
      </div>
    </div>
  );
}

export function MicroworksFeatures() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  const groups = COMPANY_LOGOS_GROUPS;
  const currentGroup = groups[currentIndex];
  const nextGroup = groups[(currentIndex + 1) % groups.length];

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!animate) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % groups.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [animate, groups.length]);

  return (
    <section id="features">
      <div className="mb-10 md:mb-20 border-x border-stone-200">
        <ul className="grid grid-cols-1 sm:grid-cols-3 sm:border-b border-t border-stone-200">
          {/* Feature 1 */}
          <li className="flex flex-col border-b border-stone-200 sm:border-b-0 [&:not(:last-child)]:sm:border-r">
            <div className="flex flex-col gap-2 px-4 sm:px-6 py-6 flex-1 bg-stone-0">
              <p className="text-stone-800 font-medium text-base font-sans">HTTP 402 Native Protocol</p>
              <p className="text-stone-500 dark:text-stone-600 font-normal text-base leading-22">
                Programmatic micro-tasks and machine micropayments with zero banking delays or manual lock-in.
              </p>
            </div>
            <ul className="grid grid-cols-2 border-t border-stone-200 [&:has(>li:only-child)]:grid-cols-1">
              <li className="[&:not(:last-child)]:border-r border-stone-200">
                <Link
                  className="flex items-center text-stone-500 justify-between gap-4 px-6 py-3 hover:bg-stone-100 transition-colors duration-100 ease"
                  href="/app"
                >
                  <p className="text-stone-800 font-medium text-xs font-sans uppercase">Explore Tasks</p>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6.84444 17.4476L17.1564 7.13566M17.1564 7.13566V17.0352M17.1564 7.13566H7.25692" stroke="currentColor" strokeWidth="2.571" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            </ul>
          </li>

          {/* Feature 2 */}
          <li className="flex flex-col border-b border-stone-200 sm:border-b-0 [&:not(:last-child)]:sm:border-r">
            <div className="flex flex-col gap-2 px-4 sm:px-6 py-6 flex-1 bg-stone-0">
              <p className="text-stone-800 font-medium text-base font-sans">Monad Sub-Second Finality</p>
              <p className="text-stone-500 dark:text-stone-600 font-normal text-base leading-22">
                10,000 TPS parallel EVM execution guarantees sub-2-second payout settlement with fractions of a cent in gas.
              </p>
            </div>
            <ul className="grid grid-cols-2 border-t border-stone-200 [&:has(>li:only-child)]:grid-cols-1">
              <li className="[&:not(:last-child)]:border-r border-stone-200">
                <a
                  className="flex items-center text-stone-500 justify-between gap-4 px-6 py-3 hover:bg-stone-100 transition-colors duration-100 ease"
                  href="#showcase"
                >
                  <p className="text-stone-800 font-medium text-xs font-sans uppercase">Protocol Spec</p>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6.84444 17.4476L17.1564 7.13566M17.1564 7.13566V17.0352M17.1564 7.13566H7.25692" stroke="currentColor" strokeWidth="2.571" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </li>
            </ul>
          </li>

          {/* Feature 3 */}
          <li className="flex flex-col border-b border-stone-200 sm:border-b-0 [&:not(:last-child)]:sm:border-r">
            <div className="flex flex-col gap-2 px-4 sm:px-6 py-6 flex-1 bg-stone-0">
              <p className="text-stone-800 font-medium text-base font-sans">Sybil-Resistant Consensus</p>
              <p className="text-stone-500 dark:text-stone-600 font-normal text-base leading-22">
                Multi-worker quorum verification, stake-weighted reputation, and automated slashing preserve gold-standard data.
              </p>
            </div>
            <ul className="grid grid-cols-2 border-t border-stone-200 [&:has(>li:only-child)]:grid-cols-1">
              <li className="[&:not(:last-child)]:border-r border-stone-200">
                <Link
                  className="flex items-center text-stone-500 justify-between gap-4 px-6 py-3 hover:bg-stone-100 transition-colors duration-100 ease"
                  href="/app"
                >
                  <p className="text-stone-800 font-medium text-xs font-sans uppercase">Live Feed</p>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6.84444 17.4476L17.1564 7.13566M17.1564 7.13566V17.0352M17.1564 7.13566H7.25692" stroke="currentColor" strokeWidth="2.571" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      {/* 4 Big Live Metric Counters */}
      <div className="my-10 md:my-20 border-x border-stone-200">
        <div className="md:border-b border-t border-b-0 border-stone-200">
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-stone-200">
            <div className="flex flex-col justify-center gap-2 px-4 sm:px-6 py-6 border-stone-200 odd:border-r [&:nth-child(-n+2)]:border-b md:[&:nth-child(-n+2)]:border-b-0 md:[&:nth-child(-n+3)]:border-r">
              <p className="text-stone-800 font-normal text-2xl font-datatype text-center">1,248,500+</p>
              <p className="text-stone-500 dark:text-stone-600 font-normal text-sm leading-5 text-center">
                Micro-tasks settled on-chain
              </p>
            </div>
            <div className="flex flex-col justify-center gap-2 px-4 sm:px-6 py-6 border-stone-200 odd:border-r [&:nth-child(-n+2)]:border-b md:[&:nth-child(-n+2)]:border-b-0 md:[&:nth-child(-n+3)]:border-r">
              <p className="text-stone-800 font-normal text-2xl font-datatype text-center">99.94%</p>
              <p className="text-stone-500 dark:text-stone-600 font-normal text-sm leading-5 text-center">
                Consensus agreement &amp; quality rate
              </p>
            </div>
            <div className="flex flex-col justify-center gap-2 px-4 sm:px-6 py-6 border-stone-200 odd:border-r [&:nth-child(-n+2)]:border-b md:[&:nth-child(-n+2)]:border-b-0 md:[&:nth-child(-n+3)]:border-r">
              <p className="text-stone-800 font-normal text-2xl font-datatype text-center">&lt; 1.2s</p>
              <p className="text-stone-500 dark:text-stone-600 font-normal text-sm leading-5 text-center">
                Average Monad settlement latency
              </p>
            </div>
            <div className="flex flex-col justify-center gap-2 px-4 sm:px-6 py-6 border-stone-200 odd:border-r [&:nth-child(-n+2)]:border-b md:[&:nth-child(-n+2)]:border-b-0 md:[&:nth-child(-n+3)]:border-r">
              <p className="text-stone-800 font-normal text-2xl font-datatype text-center">0</p>
              <p className="text-stone-500 dark:text-stone-600 font-normal text-sm leading-5 text-center">
                Unpaid or delayed micro-bounties
              </p>
            </div>
          </div>

          <div className="flex justify-center items-center p-6 bg-stone-0 border-b border-stone-200">
            <p className="text-stone-800 font-medium text-sm font-sans uppercase leading-5 text-center">
              Micro-task settlement monitored for high-growth AI labs &amp; decentralized protocols alike
            </p>
          </div>

          {/* Exact In-Place Animated Logo Grid */}
          <div className="grid border-b sm:border-b-0 border-stone-200 overflow-hidden h-58 sm:h-29">
            {/* Grid borders layer */}
            <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gridArea: "1 / 1" }}>
              <div className="border-stone-200 odd:border-r [&:nth-child(-n+2)]:border-b sm:[&:nth-child(-n+2)]:border-b-0 sm:[&:nth-child(-n+3)]:border-r" />
              <div className="border-stone-200 odd:border-r [&:nth-child(-n+2)]:border-b sm:[&:nth-child(-n+2)]:border-b-0 sm:[&:nth-child(-n+3)]:border-r" />
              <div className="border-stone-200 odd:border-r [&:nth-child(-n+2)]:border-b sm:[&:nth-child(-n+2)]:border-b-0 sm:[&:nth-child(-n+3)]:border-r" />
              <div className="border-stone-200 odd:border-r [&:nth-child(-n+2)]:border-b sm:[&:nth-child(-n+2)]:border-b-0 sm:[&:nth-child(-n+3)]:border-r" />
            </div>

            {/* Current (exiting) logos layer */}
            <div key={`${currentIndex}-exit`} className="grid grid-cols-2 sm:grid-cols-4" style={{ gridArea: "1 / 1" }}>
              {currentGroup.map((logo, idx) => (
                <LogoCell key={logo.name} logo={logo} state="exit" animate={animate} index={idx} />
              ))}
            </div>

            {/* Next (entering) logos layer */}
            {animate && (
              <div key={`${currentIndex}-enter`} className="grid grid-cols-2 sm:grid-cols-4" style={{ gridArea: "1 / 1" }}>
                {nextGroup.map((logo, idx) => (
                  <LogoCell key={logo.name} logo={logo} state="enter" animate={animate} index={idx} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
