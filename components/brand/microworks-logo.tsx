import React from "react";

export interface MicroworksMarkProps {
  size?: number;
  className?: string;
}

export function MicroworksMark({
  size = 24,
  className = "text-stone-900",
}: MicroworksMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Faceted geometric micro-work / µ mark */}
      <path
        d="M5 4.5V14C5 16.2091 6.79086 18 9 18C11.2091 18 13 16.2091 13 14V4.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 10V14C13 16.2091 14.7909 18 17 18C19.2091 18 21 16.2091 21 14V8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.75"
      />
      <path
        d="M5 13.5V19.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="17" cy="4.5" r="1.75" fill="currentColor" />
    </svg>
  );
}

export interface MicroworksLogoProps {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  markSize?: number;
  variant?: "lowercase" | "titlecase" | "uppercase";
  showWordmark?: boolean;
}

export function MicroworksLogo({
  className = "",
  markClassName = "text-stone-900",
  textClassName = "text-stone-900",
  markSize = 24,
  variant = "lowercase",
  showWordmark = true,
}: MicroworksLogoProps) {
  const word =
    variant === "uppercase"
      ? "MICROWORKS"
      : variant === "titlecase"
      ? "Microworks"
      : "microworks";

  return (
    <span
      className={`inline-flex items-center gap-2.5 select-none leading-none ${className}`}
    >
      <MicroworksMark size={markSize} className={`shrink-0 ${markClassName}`} />
      {showWordmark && (
        <span
          className={`font-sans font-bold text-[19px] tracking-[-0.035em] ${textClassName}`}
        >
          {word}
        </span>
      )}
    </span>
  );
}
