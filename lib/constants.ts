export const CONTRACT_ADDRESS =
  "0x26e67271c65ac40d419dffe8d6ad7ffcb2755237" as `0x${string}`;

export const FEE_BPS = 200n; // 2% protocol fee

export const EXPLORER = "https://testnet.monadexplorer.com";

export const TEAM_WALLET = "0x225BAa4D33dD7c5b745085095Aa758bb6A958474" as `0x${string}`;

export const CATEGORIES = [
  "label",
  "poll",
  "caption",
  "verify",
  "transcribe",
  "qa",
] as const;

export type TaskCategory = (typeof CATEGORIES)[number];

export const OPTION_LABELS = ["Person", "Vehicle", "Empty"] as const;

// --- Task kinds (must match the contract) ---
export const KIND_OPTIONS = 0;
export const KIND_YESNO = 1;
export const KIND_RATING = 2;
export const KIND_TEXT = 3;

export const KIND_LABELS = [
  { value: KIND_OPTIONS, label: "Label / Multi-choice" },
  { value: KIND_YESNO, label: "Verify (Yes / No)" },
  { value: KIND_RATING, label: "Rate 1-5" },
  { value: KIND_TEXT, label: "Free text" },
] as const;

export const XpLevels = [
  { min: 0, title: "Rookie" },
  { min: 500, title: "Helper" },
  { min: 1500, title: "Contributor" },
  { min: 3000, title: "Expert" },
  { min: 6000, title: "Grandmaster" },
] as const;

export function levelForXp(xp: number): string {
  let title: string = XpLevels[0].title;
  for (const lvl of XpLevels) if (xp >= lvl.min) title = lvl.title;
  return title;
}

export function badgesFor(winStreak: number, dayStreak: number, xp: number): string[] {
  const badges: string[] = [];
  if (winStreak >= 3) badges.push("On Fire");
  if (winStreak >= 5) badges.push("Sharpshooter");
  if (winStreak >= 10) badges.push("Unstoppable");
  if (dayStreak >= 2) badges.push("Day Streak");
  if (dayStreak >= 5) badges.push("Weekly Warrior");
  if (xp >= 500) badges.push("Rising Star");
  if (xp >= 1500) badges.push("Veteran");
  if (xp >= 3000) badges.push("Grandmaster");
  if (badges.length === 0) badges.push("Rookie");
  return badges.slice(0, 3);
}

export type MicroTask = {
  id: bigint;
  creator: `0x${string}`;
  title: string;
  description: string;
  category: string;
  kind: number;
  optionCount: number;
  options: string[];
  reward: bigint;
  bounty: bigint;
  completed: bigint;
  rejected: bigint;
  frameCount: bigint;
  active: boolean;
};

export type TaskOutput = {
  id: bigint;
  creator: `0x${string}`;
  title: string;
  description: string;
  category: string;
  kind: number;
  optionCount: number;
  options: string[];
  reward: bigint;
  bounty: bigint;
  completed: bigint;
  rejected: bigint;
  frameCount: bigint;
  active: boolean;
};

// getTask() returns a full named struct object (includes options).
// NOTE: the auto-generated public mapping getter `tasks(uint256)` drops the
// dynamic `options` field and returns only 13 values — do NOT use it.
export function taskObjectToMicroTask(t: TaskOutput): MicroTask {
  return { ...t, kind: Number(t.kind), optionCount: Number(t.optionCount) };
}