"use client";

import React from "react";
import {
  logos,
  AI_PROVIDER_LOGOS,
  getAiProviderLogo,
  type LogoItem,
} from "@/public/ai-providers-logos/logos";

export { logos, AI_PROVIDER_LOGOS, getAiProviderLogo };
export type { LogoItem };

export function AgentBrandIcon({
  client,
  size = 18,
  className = "",
}: {
  client: string;
  size?: number;
  className?: string;
  showTooltip?: boolean;
  side?: "top" | "right" | "bottom" | "left";
}) {
  const brand = getAiProviderLogo(client);

  return (
    <span
      title={brand.label}
      aria-label={brand.label}
      className={`inline-flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:shrink-0 ${brand.textColor || ""} ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: brand.svg }}
    />
  );
}
