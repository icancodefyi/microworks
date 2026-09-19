"use client";

import React from "react";
import Link from "next/link";
import { MicroworksLogo } from "@/components/brand/microworks-logo";
import { IconArrowRight, IconLayoutDashboard } from "@tabler/icons-react";

export function MicroworksNav() {
  return (
    <div className="sticky top-0 w-full backdrop-blur-lg z-50 flex justify-center bg-white/80 border-b border-stone-200/60">
      <div className="max-w-6xl w-full">
        <div className="lg:grid gap-4 flex items-center lg:grid-cols-3 h-14 w-full py-1 px-4 lg:px-6">
          {/* Brand Logo */}
          <Link
            aria-label="Microworks Home"
            className="w-fit hover:opacity-85 py-2 m-0 flex items-center transition-opacity duration-150"
            href="/"
          >
            <MicroworksLogo markSize={24} textClassName="text-stone-900" />
          </Link>

          {/* Navigation Links */}
          <div className="w-full hidden lg:flex items-center justify-center">
            <div className="lg:flex gap-1 justify-center items-center hidden">
              <Link
                className="flex font-sans px-2.5 py-1 items-center uppercase text-xs font-semibold select-none cursor-pointer rounded-lg hover:bg-stone-100 transition-colors duration-200 text-stone-700 hover:text-blue-600"
                href="/app"
              >
                Tasks
              </Link>
              <a
                className="flex font-sans px-2.5 py-1 items-center uppercase text-xs font-semibold select-none cursor-pointer rounded-lg hover:bg-stone-100 transition-colors duration-200 text-stone-700 hover:text-blue-600"
                href="#features"
              >
                Features
              </a>
              <a
                className="flex font-sans px-2.5 py-1 items-center uppercase text-xs font-semibold select-none cursor-pointer rounded-lg hover:bg-stone-100 transition-colors duration-200 text-stone-700 hover:text-blue-600"
                href="#showcase"
              >
                Protocol
              </a>
              <a
                className="flex font-sans px-2.5 py-1 items-center uppercase text-xs font-semibold select-none cursor-pointer rounded-lg hover:bg-stone-100 transition-colors duration-200 text-stone-700 hover:text-blue-600"
                href="#integrations"
              >
                Integrations
              </a>
              <a
                className="flex font-sans px-2.5 py-1 items-center uppercase text-xs font-semibold select-none cursor-pointer rounded-lg hover:bg-stone-100 transition-colors duration-200 text-stone-700 hover:text-blue-600"
                href="#faq"
              >
                FAQ
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 lg:gap-3 justify-end w-full">
            <div className="flex gap-2 lg:gap-3 justify-end w-max">
              <Link
                className="cursor-pointer box-border flex items-center justify-center font-semibold font-sans uppercase border transition-all ease-in duration-75 whitespace-nowrap text-center select-none text-xs lg:text-sm rounded-lg lg:rounded-xl px-3 lg:px-4 py-1 lg:py-1.5 h-7 lg:h-8 bg-gradient-to-b from-white to-stone-100 text-stone-900 border border-stone-300 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_3px_rgba(0,0,0,0.06)] hover:bg-stone-50 active:scale-[0.98]"
                href="/app"
              >
                Browse Tasks
              </Link>
              <Link
                className="cursor-pointer box-border flex items-center justify-center gap-1.5 font-semibold font-sans uppercase border transition-all ease-in duration-75 whitespace-nowrap text-center select-none text-xs lg:text-sm rounded-lg lg:rounded-xl px-3 lg:px-4 py-1 lg:py-1.5 h-7 lg:h-8 text-white bg-gradient-to-b from-stone-800 to-stone-950 border border-stone-700/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_6px_rgba(0,0,0,0.25)] hover:from-stone-700 hover:to-stone-900 active:scale-[0.98]"
                href="/app"
              >
                <IconLayoutDashboard size={14} className="hidden sm:inline" />
                <span>Launch App</span>
                <IconArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
