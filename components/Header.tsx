"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MicroworksLogo } from "@/components/brand/microworks-logo";
import { IconArrowLeft, IconExternalLink } from "@tabler/icons-react";
import { EXPLORER } from "@/lib/constants";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-stone-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Left: Brand & Return link */}
        <div className="flex items-center gap-5">
          <Link href="/" aria-label="Microworks Home" className="flex items-center hover:opacity-85 transition-opacity">
            <MicroworksLogo markSize={22} textClassName="text-stone-900" />
          </Link>

          <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-stone-200 text-xs font-mono text-stone-500">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-900 transition-colors uppercase tracking-wider"
            >
              <IconArrowLeft size={13} />
              <span>Landing</span>
            </Link>

            <span className="text-stone-300">·</span>

            <a
              href={EXPLORER}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-900 transition-colors uppercase tracking-wider"
            >
              <span>Explorer</span>
              <IconExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Center: Network Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-stone-200 bg-stone-50 text-stone-700 text-xs font-mono">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-semibold text-stone-800">Monad Testnet</span>
          <span className="text-stone-400">·</span>
          <span className="text-stone-500">1.2s Finality</span>
        </div>

        {/* Right: Wallet Connect */}
        <div className="flex items-center gap-3">
          <ConnectButton
            showBalance={false}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </div>
      </div>
    </header>
  );
}