import type { CSSProperties } from "react";
import type { CreditCard } from "@/types/card";
import { getCardFace } from "@/lib/cardFace";

export type CardTheme = {
  accent: string;
  accentSoft: string;
  glow: string;
  panel: string;
  label: string;
  pageTint: string;
  from: string;
  via: string;
  to: string;
};

/** Page theme is derived from the same face palette as the product card art. */
export function getCardTheme(
  card: Pick<
    CreditCard,
    "bankId" | "metalTone" | "slug" | "category" | "premiumLevel"
  >
): CardTheme {
  const f = getCardFace(card);
  return {
    accent: f.accent,
    accentSoft: f.glow.includes("rgba")
      ? f.glow.replace(/,\s*[\d.]+\)$/, ",0.14)")
      : f.glow,
    glow: f.glow,
    panel: f.panel,
    label: f.label,
    pageTint: f.pageTint,
    from: f.from,
    via: f.via,
    to: f.to,
  };
}

export function themeStyle(
  card: Pick<
    CreditCard,
    "bankId" | "metalTone" | "slug" | "category" | "premiumLevel"
  >
): CSSProperties {
  const t = getCardTheme(card);
  return {
    ["--card-accent" as string]: t.accent,
    ["--card-accent-soft" as string]: t.accentSoft,
    ["--card-glow" as string]: t.glow,
    ["--card-panel" as string]: t.panel,
    ["--card-label" as string]: t.label,
    ["--card-from" as string]: t.from,
    ["--card-via" as string]: t.via,
    ["--card-to" as string]: t.to,
  };
}
