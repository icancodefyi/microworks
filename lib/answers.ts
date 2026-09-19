import { keccak256, toBytes } from "viem";

export function optionAnswerHash(option: number): `0x${string}` {
  return keccak256(new Uint8Array([option]));
}

export function textAnswerHash(text: string): `0x${string}` {
  const normalized = text.trim().toLowerCase().replace(/\s+/g, " ");
  return keccak256(toBytes(normalized));
}