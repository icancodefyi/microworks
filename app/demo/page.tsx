"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { MicroworksLogo } from "@/components/brand/microworks-logo";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconVolume,
  IconVolumeOff,
  IconDownload,
  IconArrowLeft,
  IconExternalLink,
  IconSparkles,
  IconDeviceGamepad2,
  IconFlame,
  IconBolt,
  IconTrophy,
} from "@tabler/icons-react";
import { useNetwork } from "@/lib/network";

const SCENES = [
  { time: 0, title: "1.2s Parallel Finality", icon: "⚡", desc: "Monad throughput & parallel consensus" },
  { time: 6, title: "Creator Escrow Vault", icon: "💼", desc: "Lock 10 MON & golden key hash" },
  { time: 12, title: "Subway Surfers Runner", icon: "🎮", desc: "Mobile thumb pads & instant 1.2s payout" },
  { time: 20, title: "7-Day Streak & Leaderboard", icon: "🔥", desc: "Daily grind calendar & Hall of Fame" },
  { time: 25, title: "Decentralised & On-Chain", icon: "👑", desc: "Live on Monad Blitz testnet" },
];

export default function DemoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeScene, setActiveScene] = useState(0);
  const { network } = useNetwork();

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const jumpToScene = (timeSec: number, index: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = timeSec;
    videoRef.current.play();
    setIsPlaying(true);
    setActiveScene(index);
  };

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900 antialiased selection:bg-stone-900 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/app"
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-mono font-bold text-stone-700 hover:bg-stone-100 transition shadow-2xs"
            >
              <IconArrowLeft size={15} />
              <span>Back to App</span>
            </Link>
            <div className="h-4 w-px bg-stone-200 hidden sm:block" />
            <Link href="/" className="flex items-center gap-2">
              <MicroworksLogo markSize={24} />
              <span className="font-mono text-sm font-black text-stone-900">Microworks</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 font-mono text-[11px] font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              1.2s Monad Finality
            </span>
            <Link
              href="/app"
              className="btn-arcade-green inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider text-white"
            >
              <IconDeviceGamepad2 size={16} />
              <span>Launch App ▶</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 space-y-8">
        {/* Title Marquee */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2977ff]/30 bg-[#2977ff]/10 px-3 py-1 text-xs font-mono font-bold text-[#2977ff] uppercase tracking-wider">
            <span>⚡ MONAD BLITZ SHOWCASE</span>
            <span>·</span>
            <span>28s ANIMATED DEMO VIDEO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-stone-900">
            Micro-tasks. Instant payouts. <em>On-chain.</em>
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto font-sans leading-relaxed">
            Watch the animated demo with synced voiceover, arcade sound effects, and Subway Surfers mobile game mechanics running on Monad parallel execution.
          </p>
        </div>

        {/* Video Player Card */}
        <div className="card-arcade overflow-hidden bg-stone-950 p-2 sm:p-4 rounded-3xl border-2 border-stone-800 shadow-2xl">
          {/* Video Container */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              src="/microworks-demo.mp4"
              playsInline
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-contain"
            />

            {/* Big Play Overlay (when paused) */}
            {!isPlaying && (
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/25 transition cursor-pointer group"
                aria-label="Play demo video"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#2977ff] text-white shadow-2xl group-hover:scale-105 active:scale-95 transition-all">
                  <IconPlayerPlay size={36} className="ml-1" />
                </div>
              </button>
            )}
          </div>

          {/* Player Action Bar */}
          <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-1 text-xs font-mono text-stone-300">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="btn-arcade-dark inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase text-white"
              >
                {isPlaying ? <IconPlayerPause size={14} /> : <IconPlayerPlay size={14} />}
                <span>{isPlaying ? "Pause" : "Play Video"}</span>
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="btn-arcade-white inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold uppercase text-stone-800"
              >
                {isMuted ? <IconVolumeOff size={14} /> : <IconVolume size={14} />}
                <span>{isMuted ? "Unmute" : "Mute"}</span>
              </button>
              <span className="text-stone-400 font-bold ml-2">28 SEC · 1080P HD</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/microworks-demo.mp4"
                download="microworks-monad-demo.mp4"
                className="btn-arcade-green inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white"
              >
                <IconDownload size={15} />
                <span>Download MP4 Video (1.4 MB)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Scene Selector Strip */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-black uppercase tracking-wider text-stone-700">
              Jump To Scene
            </h2>
            <span className="text-xs font-mono text-stone-400">Click to seek video</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {SCENES.map((scene, idx) => {
              const isCurrent = activeScene === idx;
              return (
                <button
                  key={scene.time}
                  type="button"
                  onClick={() => jumpToScene(scene.time, idx)}
                  className={`card-arcade p-3 rounded-2xl text-left transition cursor-pointer ${
                    isCurrent
                      ? "border-2 border-[#2977ff] bg-blue-50/50 shadow-md ring-2 ring-[#2977ff]/20"
                      : "bg-white hover:bg-stone-50 border border-stone-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{scene.icon}</span>
                    <span className="font-mono text-[10px] font-black uppercase text-[#2977ff]">
                      0:{scene.time < 10 ? `0${scene.time}` : scene.time}
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-sans text-xs font-black text-stone-900 truncate">
                    {scene.title}
                  </h3>
                  <p className="mt-0.5 text-[10px] font-sans text-stone-500 line-clamp-1">
                    {scene.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Mechanics Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="card-arcade p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 border border-blue-200 text-[#2977ff]">
              <IconBolt size={18} />
            </div>
            <h3 className="font-sans font-bold text-stone-900 text-sm">
              1.2s Parallel Consensus
            </h3>
            <p className="font-sans text-xs text-stone-600 leading-relaxed">
              Monad parallel execution enables instant smart contract verification. Workers receive rewards in their wallet before they can blink.
            </p>
          </div>

          <div className="card-arcade p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
              <IconDeviceGamepad2 size={18} />
            </div>
            <h3 className="font-sans font-bold text-stone-900 text-sm">
              Subway Surfers Game UI
            </h3>
            <p className="font-sans text-xs text-stone-600 leading-relaxed">
              Tactile 3D pushable buttons, combo streaks, and sound synthesizers turn repetitive labeling into an addictive daily arcade game.
            </p>
          </div>

          <div className="card-arcade p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
              <IconFlame size={18} />
            </div>
            <h3 className="font-sans font-bold text-stone-900 text-sm">
              Daily Grind & Retention
            </h3>
            <p className="font-sans text-xs text-stone-600 leading-relaxed">
              7-Day streak tracking, Day 7 Mystery Vaults, and live on-chain leaderboards keep users returning every 24 hours.
            </p>
          </div>
        </div>

        {/* Action Bar Call to Action */}
        <div className="card-arcade overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="font-mono text-xs font-bold uppercase text-[#2977ff]">
              READY TO RUN?
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Start earning MON or deploy your first micro-task.
            </h2>
            <p className="text-xs text-stone-400 font-sans max-w-lg">
              Contract deployed at {network.contractAddress.slice(0, 10)}…{network.contractAddress.slice(-6)} on {network.label}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/app"
              className="btn-arcade-green inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-md"
            >
              <span>Launch Arcade App ▶</span>
            </Link>

            <a
              href={`${network.explorer}/address/${network.contractAddress}`}
              target="_blank"
              rel="noreferrer"
              className="btn-arcade-white inline-flex items-center gap-1.5 rounded-2xl px-5 py-3.5 text-xs font-bold uppercase text-stone-800"
            >
              <span>Explorer</span>
              <IconExternalLink size={13} className="text-stone-400" />
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 text-xs text-stone-500 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-stone-800">Microworks</span>
            <span>·</span>
            <span>Monad Blitz Hackathon Demo</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <Link href="/" className="hover:text-stone-900 transition">
              Home
            </Link>
            <Link href="/app" className="hover:text-stone-900 transition">
              Launch App
            </Link>
            <a
              href={`${network.explorer}/address/${network.contractAddress}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-stone-900 transition"
            >
              Contract Explorer
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
