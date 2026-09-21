import type { CreditCard } from "@/types/card";

/** Original CardForge face art — not bank marketing assets. */
export type CardFace = {
  from: string;
  via: string;
  to: string;
  accent: string;
  ink: string;
  sheen: string;
  chip: string;
  pattern: "brushed" | "diagonal" | "mesh" | "waves" | "aurora";
  /** Soft page atmosphere derived from the face */
  glow: string;
  panel: string;
  label: string;
  pageTint: string;
};

type BankBrand = { primary: string; deep: string; accent: string };

const BANK: Record<string, BankBrand> = {
  HDFC: { primary: "#0a3d6e", deep: "#061828", accent: "#e31c23" },
  SBI: { primary: "#1e3a8a", deep: "#0c1635", accent: "#c4a35a" },
  ICICI: { primary: "#b45309", deep: "#1c1008", accent: "#f97316" },
  AXIS: { primary: "#6b1238", deep: "#1a0810", accent: "#e8b4c4" },
  IDFC: { primary: "#9f1239", deep: "#1a0810", accent: "#fb7185" },
  HSBC: { primary: "#8b0000", deep: "#1a0505", accent: "#f87171" },
  FEDERAL: { primary: "#0c4a6e", deep: "#061018", accent: "#38bdf8" },
  YES: { primary: "#0369a1", deep: "#061525", accent: "#7dd3fc" },
  RBL: { primary: "#1e3a5f", deep: "#0a121c", accent: "#d4af37" },
  INDUSIND: { primary: "#5b21b6", deep: "#12081f", accent: "#c4b5fd" },
  KOTAK: { primary: "#b91c1c", deep: "#1a0808", accent: "#fca5a5" },
  AU: { primary: "#c2410c", deep: "#1a0c06", accent: "#fdba74" },
  BOB: { primary: "#ea580c", deep: "#1a0c06", accent: "#fdba74" },
  SC: { primary: "#0369a1", deep: "#061525", accent: "#38bdf8" },
  AMEX: { primary: "#1d4ed8", deep: "#0a1628", accent: "#93c5fd" },
  CANARA: { primary: "#1e40af", deep: "#0a1228", accent: "#facc15" },
  PNB: { primary: "#b91c1c", deep: "#1a0808", accent: "#fde68a" },
  ONECARD: { primary: "#171717", deep: "#050505", accent: "#e5e5e5" },
};

const TONE_MIX: Record<
  CreditCard["metalTone"],
  { lift: string; metal: string; ink: string }
> = {
  graphite: { lift: "#3a404c", metal: "#c8cdd4", ink: "#e8ecf1" },
  gold: { lift: "#5c4a28", metal: "#d4b87a", ink: "#f5ecd8" },
  silver: { lift: "#5a6270", metal: "#e8ecf1", ink: "#f8fafc" },
  obsidian: { lift: "#2e323a", metal: "#a8b0ba", ink: "#e2e8f0" },
  rose: { lift: "#4a3038", metal: "#d4a8b0", ink: "#fce7f3" },
  blue: { lift: "#2a3c54", metal: "#9eb4cc", ink: "#e0f2fe" },
};

const PATTERNS: CardFace["pattern"][] = [
  "brushed",
  "diagonal",
  "mesh",
  "waves",
  "aurora",
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgba(hex: string, a: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

function mixHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `#${[r, g, bl].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Unique original face for each card. Palette drives both the product art
 * and the detail-page theme so they stay in sync.
 */
export function getCardFace(
  card: Pick<CreditCard, "bankId" | "metalTone" | "slug" | "category" | "premiumLevel">
): CardFace {
  const brand = BANK[card.bankId] ?? {
    primary: "#2a2e36",
    deep: "#0c0e12",
    accent: "#c8cdd4",
  };
  const tone = TONE_MIX[card.metalTone];
  const n = hash(card.slug);
  const pattern = PATTERNS[n % PATTERNS.length];

  const premiumBoost =
    card.premiumLevel === "Super Premium"
      ? 0.35
      : card.premiumLevel === "Premium"
        ? 0.22
        : 0.1;

  const from = mixHex(brand.primary, tone.lift, 0.35 + premiumBoost * 0.2);
  const via = mixHex(brand.deep, tone.lift, 0.15);
  const to = mixHex(brand.deep, "#050608", 0.4);
  const accent =
    card.category === "Travel"
      ? mixHex(brand.accent, tone.metal, 0.35)
      : card.category === "Cashback"
        ? mixHex(brand.accent, "#86efac", 0.25)
        : mixHex(brand.accent, tone.metal, 0.2);

  return {
    from,
    via,
    to,
    accent,
    ink: tone.ink,
    sheen: rgba("#ffffff", 0.16 + (n % 5) * 0.02),
    chip: card.premiumLevel === "Super Premium" || card.premiumLevel === "Premium"
      ? "#e8c86a"
      : "#c9a24a",
    pattern,
    glow: rgba(accent, 0.22),
    panel: rgba(via, 0.82),
    label: mixHex(accent, "#ffffff", 0.25),
    pageTint: rgba(brand.primary, 0.18),
  };
}
