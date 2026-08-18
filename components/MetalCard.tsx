"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type MouseEvent } from "react";
import type { CreditCard } from "@/types/card";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";

export const metalTones: Record<
  CreditCard["metalTone"],
  { from: string; via: string; to: string; accent: string }
> = {
  graphite: {
    from: "#2a2e36",
    via: "#16191f",
    to: "#0c0e12",
    accent: "#c8cdd4",
  },
  gold: {
    from: "#3d3424",
    via: "#1f1a12",
    to: "#12100c",
    accent: "#b8a06a",
  },
  silver: {
    from: "#4a5160",
    via: "#22262e",
    to: "#12151a",
    accent: "#e8ecf1",
  },
  obsidian: {
    from: "#3a3d44",
    via: "#1c1f26",
    to: "#101218",
    accent: "#c8cdd4",
  },
  rose: {
    from: "#3a2a2e",
    via: "#1a1214",
    to: "#0e0a0b",
    accent: "#c4a0a8",
  },
  blue: {
    from: "#243044",
    via: "#121820",
    to: "#0a0e14",
    accent: "#8fa8c4",
  },
};

type Props = {
  card?: Pick<
    CreditCard,
    "name" | "bankName" | "network" | "metalTone" | "variant"
  >;
  size?: "hero" | "md" | "sm";
  interactive?: boolean;
  className?: string;
  float?: boolean;
};

export function MetalCard({
  card,
  size = "md",
  interactive = true,
  className = "",
  float = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const canTilt = interactive && !reduced && !mobile;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 180, damping: 18, mass: 0.35 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const lift = useTransform(sy, [-0.5, 0.5], [6, 14]);
  const glareX = useTransform(sx, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(sy, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.28) 0%, transparent 45%)`;
  const shadow = useMotionTemplate`0 ${lift}px 40px -8px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.14)`;

  const contentX = useTransform(sx, [-0.5, 0.5], [-6, 6]);
  const contentY = useTransform(sy, [-0.5, 0.5], [-4, 4]);

  const tone = metalTones[card?.metalTone ?? "obsidian"];
  const dims =
    size === "hero"
      ? "w-full max-w-[420px] aspect-[1.586/1]"
      : "w-full aspect-[1.586/1]";

  function onMove(e: MouseEvent) {
    if (!canTilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      ref={ref}
      className={`${dims} relative [perspective:1200px] ${className}`}
    >
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        animate={
          float && !reduced
            ? { y: [0, -8, 0] }
            : undefined
        }
        transition={
          float
            ? { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
        style={
          canTilt
            ? {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                boxShadow: shadow,
              }
            : { transformStyle: "preserve-3d" }
        }
        className="absolute inset-0 overflow-hidden rounded-xl shadow-metal will-change-transform"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(145deg, ${tone.from} 0%, ${tone.via} 45%, ${tone.to} 100%)`,
          }}
        />
        {/* Brushed metal grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)",
          }}
        />
        {/* Static sheen */}
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "linear-gradient(110deg, transparent 15%, rgba(255,255,255,0.18) 42%, rgba(255,255,255,0.04) 55%, transparent 72%)",
          }}
        />
        {/* Soft top edge light */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1/3 opacity-40"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.12), transparent)",
          }}
        />
        {/* Cursor specular */}
        {canTilt && (
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-90 mix-blend-soft-light"
            style={{ background: glare }}
          />
        )}
        <motion.div
          className="absolute inset-0 flex flex-col p-4 sm:p-5"
          style={
            canTilt
              ? {
                  x: contentX,
                  y: contentY,
                  transform: "translateZ(24px)",
                }
              : undefined
          }
        >
          {/* Issuer */}
          <p
            className="text-[8px] font-bold uppercase tracking-[0.28em] sm:text-[9px]"
            style={{
              color: tone.accent,
              textShadow:
                "0 1px 0 rgba(0,0,0,0.65), 0 -0.5px 0 rgba(255,255,255,0.28)",
            }}
          >
            {card?.bankName ?? "CardForge"}
          </p>

          {/* Chip row */}
          <div className="mt-3 flex items-center gap-2.5 sm:mt-4">
            <div
              className="relative h-7 w-9 shrink-0 overflow-hidden rounded-[4px] bg-gradient-to-br from-[#f8ecc0] via-[#d4af37] to-[#7a5a1c] shadow-sm ring-1 ring-black/40 sm:h-8 sm:w-11"
              style={{ transform: "translateZ(12px)" }}
            >
              <div className="absolute inset-[3px] grid grid-cols-3 grid-rows-2 gap-px opacity-50">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={i} className="rounded-[1px] border border-[#4a320c]/60" />
                ))}
              </div>
            </div>
            {/* Contactless arcs */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="opacity-60"
              aria-hidden
            >
              <path
                d="M8 15a6 6 0 0 1 0-6M11 17a9 9 0 0 1 0-10M14 19a12 12 0 0 1 0-14"
                stroke={tone.accent}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Embossed PAN */}
          <p
            className="mt-auto font-mono text-[11px] font-semibold tracking-[0.2em] text-ice sm:text-[13px]"
            style={{
              textShadow:
                "0 1.5px 0 rgba(0,0,0,0.7), 0 -0.5px 0 rgba(255,255,255,0.3)",
            }}
          >
            {size === "sm" ? "••••  ••••  ••••  7741" : "5412  8834  0192  7741"}
          </p>

          {/* Footer: name + thru + network */}
          <div className="mt-2 flex items-end justify-between gap-2 sm:mt-3">
            <div className="min-w-0">
              <p className="text-[6px] uppercase tracking-wider text-silver/45 sm:text-[7px]">
                Valid thru
              </p>
              <p
                className="font-mono text-[10px] text-ice/90 sm:text-[11px]"
                style={{
                  textShadow:
                    "0 1px 0 rgba(0,0,0,0.55), 0 -0.5px 0 rgba(255,255,255,0.22)",
                }}
              >
                12/29
              </p>
              <p
                className="mt-1 truncate text-[9px] font-bold uppercase tracking-[0.12em] text-ice/90 sm:text-[10px]"
                style={{
                  textShadow:
                    "0 1px 0 rgba(0,0,0,0.55), 0 -0.5px 0 rgba(255,255,255,0.22)",
                }}
              >
                {(card?.name ?? "Metal Edition")
                  .replace(/^HDFC\s+/i, "")
                  .toUpperCase()}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p
                className="text-[11px] font-black italic tracking-wide text-ice sm:text-xs"
                style={{
                  textShadow:
                    "0 1px 0 rgba(0,0,0,0.6), 0 -0.5px 0 rgba(255,255,255,0.28)",
                }}
              >
                {(card?.network ?? "Visa").toUpperCase()}
              </p>
              <div className="ml-auto mt-0.5 h-[3px] w-10 rounded-sm bg-gradient-to-r from-[#1a1f71] via-[#f7b600] to-[#1a1f71]" />
            </div>
          </div>
        </motion.div>
        {/* Edge highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
      </motion.div>
    </div>
  );
}
