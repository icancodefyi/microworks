"use client";

import { useEffect, useState } from "react";
import { formatEther, decodeEventLog, getEventSelector } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ABI } from "@/lib/abi";
import { useNetwork } from "@/lib/network";
import {
  OPTION_LABELS,
  KIND_OPTIONS,
  KIND_YESNO,
  KIND_RATING,
  KIND_TEXT,
  type MicroTask,
} from "@/lib/constants";
import { optionAnswerHash, textAnswerHash } from "@/lib/answers";
import { sounds } from "@/lib/sounds";
import {
  IconFlame,
  IconCoins,
  IconBolt,
  IconPlayerPlay,
  IconArrowRight,
  IconDeviceGamepad2,
  IconStar,
  IconVolume,
  IconVolumeOff,
} from "@tabler/icons-react";

const ACCEPTED_TOPIC = getEventSelector("AnswerAccepted(uint256,uint256,address,uint256)");
const REJECTED_TOPIC = getEventSelector("AnswerRejected(uint256,uint256,address,uint8)");
const XP_TOPIC = getEventSelector("XpEarned(address,uint256,uint32,uint32)");

type Outcome = "checking" | "accepted" | "rejected" | "pending" | null;

export default function DoTask({
  task,
  onClose,
}: {
  task: MicroTask;
  onClose: () => void;
}) {
  const [frameId, setFrameId] = useState(0);
  const [submitError, setSubmitError] = useState("");
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [lastPayout, setLastPayout] = useState("");
  const [xpGain, setXpGain] = useState(0);
  const [winStreak, setWinStreak] = useState(0);
  const [dayStreak, setDayStreak] = useState(0);
  const [textAnswer, setTextAnswer] = useState("");
  const [soundOn, setSoundOn] = useState(true);

  const { data: hash, writeContract, isPending, reset } = useWriteContract();
  const { network } = useNetwork();
  const { data: receipt, isSuccess, isLoading: isWaiting } = useWaitForTransactionReceipt({
    hash,
    chainId: network.chainId,
  });

  const toggleSound = () => {
    sounds.enabled = !soundOn;
    setSoundOn(!soundOn);
  };

  useEffect(() => {
    if (!receipt || !hash) return;
    let sawAccepted = false;
    let sawRejected = false;
    let streakCount = 0;
    for (const log of receipt.logs) {
      if (log.address?.toLowerCase() !== network.contractAddress.toLowerCase()) continue;
      const topic = log.topics?.[0]?.toLowerCase();
      try {
        const ev = decodeEventLog({
          abi: CONTRACT_ABI,
          data: log.data,
          topics: log.topics as never,
        });
        if (ev.eventName === "AnswerAccepted") {
          const { amount } = ev.args as { amount: bigint };
          setLastPayout(formatEther(amount));
          sawAccepted = true;
        } else if (ev.eventName === "AnswerRejected") {
          sawRejected = true;
        } else if (ev.eventName === "XpEarned") {
          const { points, winStreak: w, dayStreak: d } = ev.args as {
            points: bigint;
            winStreak: number;
            dayStreak: number;
          };
          setXpGain(Number(points));
          streakCount = Number(w);
          setWinStreak(streakCount);
          setDayStreak(Number(d));
        }
        if (topic === ACCEPTED_TOPIC) sawAccepted = true;
        if (topic === REJECTED_TOPIC) sawRejected = true;
      } catch {
        /* skip malformed log */
      }
    }
    if (sawAccepted) {
      setOutcome("accepted");
      if (streakCount > 1) {
        sounds.playCombo();
      } else {
        sounds.playCoin();
      }
    } else if (sawRejected) {
      setOutcome("rejected");
      sounds.playMiss();
    } else {
      setOutcome("pending");
    }
  }, [receipt, hash, network.contractAddress]);

  const maxFrame = Math.max(0, Number(task.frameCount) - 1);

  const submit = (answer: number | string) => {
    sounds.playTap();
    setSubmitError("");
    setOutcome(null);
    setLastPayout("");
    setXpGain(0);
    setWinStreak(0);
    setDayStreak(0);
    try {
      const answerHash =
        task.kind === KIND_TEXT ? textAnswerHash(String(answer)) : optionAnswerHash(Number(answer));
      writeContract({
        address: network.contractAddress,
        abi: CONTRACT_ABI,
        chainId: network.chainId,
        functionName: "submitAnswer",
        args: [task.id, BigInt(frameId), answerHash],
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit transaction");
    }
  };

  const handleNextFrame = () => {
    sounds.playTap();
    reset();
    setOutcome(null);
    setLastPayout("");
    setXpGain(0);
    setWinStreak(0);
    setDayStreak(0);
    setTextAnswer("");
    setFrameId((prev) => Math.min(maxFrame, prev + 1));
  };

  const kindPill =
    task.kind === KIND_YESNO
      ? "Binary Verify"
      : task.kind === KIND_RATING
        ? "Rate 1-5"
        : task.kind === KIND_TEXT
          ? "Free Text"
          : "Multi-Choice";

  const options = task.options.length > 0 ? task.options : [...OPTION_LABELS];
  const demoSample =
    task.kind === KIND_YESNO
      ? frameId % 2 === 0 ? "YES" : "NO"
      : task.kind === KIND_RATING
        ? `${(frameId % 5) + 1} ★`
        : task.kind === KIND_TEXT
          ? "clear text response"
          : options[frameId % options.length];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg my-auto overflow-hidden rounded-3xl border-2 border-stone-300 bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Arcade Stage Header Bar */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-stone-100/90 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#2977ff] text-white shadow-2xs">
              <IconDeviceGamepad2 size={15} />
            </span>
            <span className="font-mono text-xs font-black text-stone-900 uppercase tracking-wider">
              STAGE {frameId + 1} OF {task.frameCount.toString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2 py-0.5 font-mono text-[11px] font-black text-amber-900">
              🪙 +{formatEther(task.reward)} MON
            </span>
            <button
              type="button"
              onClick={toggleSound}
              className={`flex h-7 w-7 items-center justify-center rounded-xl border transition cursor-pointer text-xs font-bold ${
                soundOn
                  ? "border-stone-300 bg-white text-stone-700 hover:bg-stone-100 shadow-2xs"
                  : "border-stone-200 bg-stone-100 text-stone-400"
              }`}
              title={soundOn ? "Mute arcade audio" : "Enable arcade audio"}
            >
              {soundOn ? <IconVolume size={14} /> : <IconVolumeOff size={14} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-xl border border-stone-300 bg-white text-stone-600 hover:bg-stone-200 transition cursor-pointer text-xs font-bold"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Stage Content */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Mission Meta & Prompt */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 font-mono text-[10px] font-bold text-[#2977ff] uppercase">
                {kindPill}
              </span>
              <span className="font-mono text-xs text-stone-400 font-bold">
                QUEST #Q{task.id.toString()}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-stone-900 leading-tight">
              {task.title}
            </h2>
            <p className="text-xs text-stone-600 font-sans leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* Arcade Frame Viewport / Monitor (CRT Bezel) */}
          <div className="overflow-hidden rounded-2xl border-2 border-stone-800 bg-stone-950 shadow-inner">
            <div className="relative aspect-video w-full bg-stone-900 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/frames/${["empty", "person", "vehicle"][frameId % 3]}.svg`}
                alt={`Stage visual ${frameId + 1}`}
                className="w-full h-full object-contain"
              />
              <div className="absolute top-2 left-2 rounded-lg bg-black/75 px-2 py-0.5 font-mono text-[10px] font-bold text-white backdrop-blur">
                FRAME #{frameId + 1}
              </div>
            </div>
            <div className="bg-stone-900 px-3 py-1.5 flex items-center justify-between border-t border-stone-800">
              <span className="font-mono text-[11px] font-bold text-stone-300">
                Looks like: <span className="text-amber-400 font-black">{demoSample}</span>
              </span>
              <span className="font-mono text-[10px] text-stone-500 font-semibold">
                Golden Key Check
              </span>
            </div>
          </div>

          {/* Frame Stepper Track (Thumb-friendly) */}
          <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">
            <button
              type="button"
              onClick={() => setFrameId((p) => Math.max(0, p - 1))}
              disabled={frameId <= 0}
              className="btn-arcade-white px-3 py-1 text-xs font-black rounded-lg disabled:opacity-40"
            >
              ◀ PREV
            </button>
            <div className="font-mono text-xs font-bold text-stone-700">
              FRAME {frameId + 1} <span className="text-stone-400 font-normal">/ {task.frameCount.toString()}</span>
            </div>
            <button
              type="button"
              onClick={() => setFrameId((p) => Math.min(maxFrame, p + 1))}
              disabled={frameId >= maxFrame}
              className="btn-arcade-white px-3 py-1 text-xs font-black rounded-lg disabled:opacity-40"
            >
              NEXT ▶
            </button>
          </div>

          {/* Giant Pushable Game Pads (Subway Surfers Style) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black uppercase tracking-wider text-stone-700">
                Tap Your Answer
              </span>
              <span className="text-[10px] font-mono text-[#2977ff] font-bold">
                +100 XP on hit
              </span>
            </div>

            {task.kind === KIND_TEXT ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (textAnswer.trim()) submit(textAnswer.trim());
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  disabled={isPending || isWaiting}
                  placeholder="Type what you see..."
                  className="flex-1 rounded-2xl border-2 border-stone-300 bg-stone-50 px-4 py-3 text-sm font-sans font-bold text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#2977ff] outline-none transition"
                />
                <button
                  type="submit"
                  disabled={isPending || isWaiting || !textAnswer.trim()}
                  className="btn-arcade-blue rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-wider"
                >
                  Submit
                </button>
              </form>
            ) : task.kind === KIND_YESNO ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => submit(0)}
                  disabled={isPending || isWaiting}
                  className="btn-arcade-green py-4 rounded-2xl text-base sm:text-lg font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  <span>YES ✓</span>
                </button>
                <button
                  type="button"
                  onClick={() => submit(1)}
                  disabled={isPending || isWaiting}
                  className="bg-rose-500 text-white border-b-4 border-rose-700 active:border-b-0 active:translate-y-1 hover:brightness-105 transition-all py-4 rounded-2xl text-base sm:text-lg font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  <span>NO ✕</span>
                </button>
              </div>
            ) : task.kind === KIND_RATING ? (
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((stars) => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => submit(stars - 1)}
                    disabled={isPending || isWaiting}
                    className="btn-arcade-white py-3.5 rounded-2xl flex flex-col items-center justify-center gap-0.5 disabled:opacity-50"
                  >
                    <span className="font-mono text-sm font-black text-amber-500">★</span>
                    <span className="font-mono text-xs font-black text-stone-900">{stars}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5">
                {options.map((label, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => submit(idx)}
                    disabled={isPending || isWaiting}
                    className="btn-arcade-white py-3.5 px-2 rounded-2xl flex flex-col items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-200 font-mono text-[10px] font-black text-stone-700">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-black text-stone-900 text-center truncate w-full">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Submission Feedback & Subway Surfers Celebratory Splash */}
          {submitError && (
            <div className="rounded-2xl border-2 border-rose-300 bg-rose-50 p-3.5 text-xs font-bold text-rose-800">
              {submitError}
            </div>
          )}

          {(isPending || isWaiting) && (
            <div className="rounded-2xl border-2 border-blue-300 bg-blue-50 p-4 flex items-center gap-3">
              <div className="size-5 rounded-full border-2 border-[#2977ff] border-t-transparent animate-spin shrink-0" />
              <div className="text-xs font-mono">
                <p className="font-bold text-[#1456d7]">Evaluating on Monad consensus…</p>
                <p className="text-blue-600 text-[11px]">Sub-second finality (~1.2s)</p>
              </div>
            </div>
          )}

          {/* Triumphant Subway Surfers Style Win Banner */}
          {isSuccess && outcome === "accepted" && (
            <div className="rounded-2xl border-2 border-emerald-400 bg-gradient-to-b from-emerald-50 to-emerald-100/60 p-4 space-y-3 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⭐</span>
                  <span className="font-black text-emerald-900 text-base uppercase tracking-tight">
                    PERFECT HIT! +100 XP
                  </span>
                </div>
                {hash && (
                  <a
                    href={`${network.explorer}/tx/${hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] font-bold text-[#2977ff] underline"
                  >
                    Tx ↗
                  </a>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="rounded-lg bg-emerald-200/70 px-2 py-1 font-black text-emerald-900">
                  🪙 +{lastPayout} MON CREDITED
                </span>
                {winStreak > 1 && (
                  <span className="rounded-lg bg-rose-200/80 px-2 py-1 font-black text-rose-900 flex items-center gap-0.5">
                    <IconFlame size={13} /> {winStreak}x COMBO!
                  </span>
                )}
              </div>

              {frameId < maxFrame ? (
                <button
                  type="button"
                  onClick={handleNextFrame}
                  className="btn-arcade-green w-full py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>NEXT STAGE (FRAME {frameId + 2})</span>
                  <IconArrowRight size={16} />
                </button>
              ) : (
                <p className="text-xs font-bold text-emerald-800 text-center">
                  🎉 Quest fully completed! Great run!
                </p>
              )}
            </div>
          )}

          {/* Ouch / Miss Banner */}
          {isSuccess && outcome === "rejected" && (
            <div className="rounded-2xl border-2 border-rose-300 bg-rose-50 p-4 space-y-3 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-rose-900 text-sm uppercase">
                  <span>💥</span>
                  <span>OUCH! WRONG ANSWER</span>
                </div>
                {hash && (
                  <a
                    href={`${network.explorer}/tx/${hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] font-bold text-[#2977ff] underline"
                  >
                    Tx ↗
                  </a>
                )}
              </div>
              <p className="text-xs text-rose-700 font-medium">
                Golden key mismatch. Win streak has been reset to 0. Keep running!
              </p>
              {frameId < maxFrame && (
                <button
                  type="button"
                  onClick={handleNextFrame}
                  className="btn-arcade-white w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider"
                >
                  Try Frame {frameId + 2} ▶
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 bg-stone-100/70 px-4 py-2.5 flex items-center justify-between text-xs text-stone-500 font-mono">
          <span>MONAD PARALLEL RUN</span>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-600 font-bold hover:text-stone-900"
          >
            Exit Run
          </button>
        </div>
      </div>
    </div>
  );
}