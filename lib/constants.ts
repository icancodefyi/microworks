export const CONTRACT_ADDRESS =
  "0x0000000000000000000000000000000000000000" as `0x${string}`;

export const FEE_BPS = 200n; // 2% protocol fee

export const EXPLORER = "https://testnet.monadexplorer.com";

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

export type MicroTask = {
  id: bigint;
  creator: `0x${string}`;
  title: string;
  description: string;
  category: string;
  reward: bigint;
  bounty: bigint;
  completed: bigint;
  rejected: bigint;
  pending: bigint;
  frameCount: bigint;
  active: boolean;
};

export function taskTupleToObject(t: readonly unknown[]): MicroTask {
  return {
    id: t[0] as bigint,
    creator: t[1] as `0x${string}`,
    title: t[2] as string,
    description: t[3] as string,
    category: t[4] as string,
    reward: t[5] as bigint,
    bounty: t[6] as bigint,
    completed: t[7] as bigint,
    rejected: t[8] as bigint,
    pending: t[9] as bigint,
    frameCount: t[10] as bigint,
    active: t[11] as boolean,
  };
}