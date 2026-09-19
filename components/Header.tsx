"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-lg font-bold text-white">
            µ
          </div>
          <div className="leading-tight">
            <p className="text-base font-semibold tracking-tight">Microworks</p>
            <p className="text-xs text-zinc-500">
              Micro-tasks, micro-wins · Monad
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ConnectButton showBalance={false} />
        </div>
      </div>
    </header>
  );
}