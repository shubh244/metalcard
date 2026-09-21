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
import { getCardFace } from "@/lib/cardFace";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";

type CardPick = Pick<
  CreditCard,
  | "name"
  | "bankName"
  | "network"
  | "metalTone"
  | "variant"
  | "bankId"
  | "slug"
  | "category"
  | "premiumLevel"
  | "coBrand"
>;

type Props = {
  card: CardPick;
  size?: "hero" | "md" | "sm";
  interactive?: boolean;
  className?: string;
  float?: boolean;
};

function NetworkMark({
  network,
  color,
}: {
  network: CreditCard["network"];
  color: string;
}) {
  if (network === "Visa") {
    return (
      <span
        className="font-display text-[13px] font-bold italic tracking-tight sm:text-[15px]"
        style={{ color, textShadow: "0 1px 0 rgba(0,0,0,0.45)" }}
      >
        VISA
      </span>
    );
  }
  if (network === "Mastercard") {
    return (
      <div className="flex items-center" aria-label="Mastercard">
        <span className="h-5 w-5 rounded-full bg-[#eb001b]/90 sm:h-6 sm:w-6" />
        <span className="-ml-2.5 h-5 w-5 rounded-full bg-[#f79e1b]/85 sm:h-6 sm:w-6" />
      </div>
    );
  }
  if (network === "RuPay") {
    return (
      <span
        className="text-[10px] font-bold tracking-[0.12em] sm:text-[11px]"
        style={{ color, textShadow: "0 1px 0 rgba(0,0,0,0.45)" }}
      >
        RuPay
      </span>
    );
  }
  return (
    <span
      className="text-[9px] font-bold tracking-[0.18em] sm:text-[10px]"
      style={{ color, textShadow: "0 1px 0 rgba(0,0,0,0.45)" }}
    >
      AMEX
    </span>
  );
}

function FacePattern({
  pattern,
  accent,
}: {
  pattern: ReturnType<typeof getCardFace>["pattern"];
  accent: string;
}) {
  if (pattern === "diagonal") {
    return (
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: `repeating-linear-gradient(135deg, transparent, transparent 10px, ${accent}22 10px, ${accent}22 11px)`,
        }}
      />
    );
  }
  if (pattern === "mesh") {
    return (
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage: `
            linear-gradient(${accent}18 1px, transparent 1px),
            linear-gradient(90deg, ${accent}18 1px, transparent 1px)
          `,
          backgroundSize: "18px 18px",
        }}
      />
    );
  }
  if (pattern === "waves") {
    return (
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.28]"
        style={{
          background: `
            radial-gradient(ellipse 80% 40% at 20% 120%, ${accent}55, transparent 55%),
            radial-gradient(ellipse 70% 35% at 90% -10%, ${accent}40, transparent 50%)
          `,
        }}
      />
    );
  }
  if (pattern === "aurora") {
    return (
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          background: `
            radial-gradient(circle at 15% 20%, ${accent}66, transparent 40%),
            radial-gradient(circle at 85% 75%, ${accent}44, transparent 45%)
          `,
        }}
      />
    );
  }
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.2] mix-blend-overlay"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.04) 1px, rgba(255,255,255,0.04) 2px)",
      }}
    />
  );
}

/**
 * Catalog-style product card face (original CardForge art).
 * Looks like a physical card photo — palette syncs with the detail page theme.
 */
export function ProductCard({
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
  const face = getCardFace(card);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 180, damping: 18, mass: 0.35 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const lift = useTransform(sy, [-0.5, 0.5], [8, 16]);
  const glareX = useTransform(sx, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(sy, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.32) 0%, transparent 42%)`;
  const shadow = useMotionTemplate`0 ${lift}px 44px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.16)`;
  const contentX = useTransform(sx, [-0.5, 0.5], [-5, 5]);
  const contentY = useTransform(sy, [-0.5, 0.5], [-3, 3]);

  const dims =
    size === "hero"
      ? "w-full max-w-[440px] aspect-[1.586/1]"
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

  const shortName =
    card.name.length > 28 ? `${card.name.slice(0, 26)}…` : card.name;

  return (
    <div
      ref={ref}
      className={`${dims} relative [perspective:1200px] ${className}`}
    >
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        animate={float && !reduced ? { y: [0, -8, 0] } : undefined}
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
            : {
                transformStyle: "preserve-3d",
                boxShadow:
                  "0 28px 50px -12px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.16)",
              }
        }
        className="absolute inset-0 overflow-hidden rounded-[14px] will-change-transform"
      >
        {/* Thickness rim */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-[2px] -z-10 rounded-[16px]"
          style={{
            background: `linear-gradient(145deg, ${face.from}, ${face.to})`,
            transform: "translateZ(-8px) scale(1.01)",
          }}
        />

        {/* Base face */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(148deg, ${face.from} 0%, ${face.via} 48%, ${face.to} 100%)`,
          }}
        />
        <FacePattern pattern={face.pattern} accent={face.accent} />

        {/* Specular sheen bar */}
        <div
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{
            background: `linear-gradient(112deg, transparent 12%, ${face.sheen} 40%, rgba(255,255,255,0.05) 52%, transparent 70%)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1/3 opacity-45"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.14), transparent)",
          }}
        />

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
              ? { x: contentX, y: contentY, transform: "translateZ(24px)" }
              : undefined
          }
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p
                className="truncate text-[8px] font-semibold uppercase tracking-[0.28em] sm:text-[9px]"
                style={{
                  color: face.accent,
                  textShadow: "0 1px 0 rgba(0,0,0,0.5)",
                }}
              >
                {card.bankName}
              </p>
              {card.coBrand && (
                <p
                  className="mt-0.5 truncate text-[7px] uppercase tracking-[0.16em] opacity-70 sm:text-[8px]"
                  style={{ color: face.ink }}
                >
                  {card.coBrand}
                </p>
              )}
            </div>
            <span
              className="shrink-0 rounded-sm px-1.5 py-0.5 text-[7px] font-medium uppercase tracking-wider sm:text-[8px]"
              style={{
                color: face.ink,
                background: "rgba(0,0,0,0.25)",
                border: `1px solid ${face.accent}44`,
              }}
            >
              {card.variant}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2.5 sm:mt-4">
            <div
              className="relative h-7 w-9 shrink-0 overflow-hidden rounded-[4px] shadow-sm ring-1 ring-black/35 sm:h-8 sm:w-10"
              style={{
                background: `linear-gradient(145deg, ${face.chip}, #7a5c22)`,
                transform: "translateZ(12px)",
              }}
            >
              <div className="absolute inset-[3px] grid grid-cols-3 grid-rows-2 gap-px opacity-50">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span
                    key={i}
                    className="rounded-[1px] border border-[#4a320c]/55"
                  />
                ))}
              </div>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="opacity-60"
              aria-hidden
            >
              <path
                d="M8 15a6 6 0 0 1 0-6M11 17a9 9 0 0 1 0-10M14 19a12 12 0 0 1 0-14"
                stroke={face.accent}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <p
            className="mt-auto font-mono text-[12px] font-medium tracking-[0.22em] sm:text-[14px]"
            style={{
              color: face.ink,
              textShadow: "0 1px 0 rgba(0,0,0,0.55)",
              opacity: 0.92,
            }}
          >
            ••••&nbsp;&nbsp;••••&nbsp;&nbsp;••••&nbsp;&nbsp;4821
          </p>

          <div className="mt-2.5 flex items-end justify-between gap-2 sm:mt-3">
            <div className="min-w-0">
              <p
                className="text-[6px] uppercase tracking-wider opacity-45 sm:text-[7px]"
                style={{ color: face.ink }}
              >
                Card
              </p>
              <p
                className="truncate text-[9px] font-semibold uppercase tracking-[0.1em] sm:text-[10px]"
                style={{
                  color: face.ink,
                  textShadow: "0 1px 0 rgba(0,0,0,0.45)",
                }}
              >
                {shortName}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <NetworkMark network={card.network} color={face.ink} />
            </div>
          </div>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 rounded-[14px] ring-1 ring-inset ring-white/12" />
      </motion.div>
    </div>
  );
}
