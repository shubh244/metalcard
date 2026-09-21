"use client";

import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type MouseEvent } from "react";
import type { CreditCard } from "@/types/card";
import { formatINR } from "@/lib/format";
import { ProductCard } from "./ProductCard";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";

type Props = {
  card: CreditCard;
  selected?: boolean;
  onToggleCompare?: (id: string) => void;
  index?: number;
};

export function CardTile({ card, selected, onToggleCompare, index = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const canTilt = !reduced && !mobile;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 200, damping: 20, mass: 0.35 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const lift = useSpring(0, { stiffness: 260, damping: 22 });
  const glowX = useTransform(sx, [-0.5, 0.5], [20, 80]);
  const glowY = useTransform(sy, [-0.5, 0.5], [15, 85]);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${glowX}% ${glowY}%, rgba(184,160,106,0.12), transparent 55%)`;
  const shadow = useMotionTemplate`0 ${lift}px 36px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)`;

  const innerX = useTransform(sx, [-0.5, 0.5], [-4, 4]);
  const innerY = useTransform(sy, [-0.5, 0.5], [-3, 3]);

  function onMove(e: MouseEvent) {
    if (!canTilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onEnter() {
    if (canTilt) lift.set(14);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
    lift.set(0);
  }

  return (
    <motion.article
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay: Math.min(index * 0.08, 0.32),
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={
        canTilt
          ? {
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              boxShadow: shadow,
            }
          : undefined
      }
      className="metal-panel group relative flex flex-col overflow-hidden rounded-lg will-change-transform [perspective:1000px]"
    >
      {canTilt && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glow }}
        />
      )}

      <Link
        href={`/cards/${card.slug}`}
        className="relative z-[1] block p-4 pb-2"
        style={{ transform: "translateZ(20px)" }}
      >
        <ProductCard card={card} size="sm" interactive={false} />
      </Link>
      <motion.div
        className="relative z-[1] flex flex-1 flex-col gap-3 p-4 pt-2"
        style={canTilt ? { x: innerX, y: innerY, transform: "translateZ(28px)" } : undefined}
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-silver/50">
            {card.bankName}
          </p>
          <Link
            href={`/cards/${card.slug}`}
            className="mt-0.5 block font-display text-xl text-ice transition group-hover:text-white"
          >
            {card.name}
          </Link>
          <p className="mt-1 text-sm text-silver/60">{card.bestFor}</p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-white/5 pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-silver/40">
              Joining
            </p>
            <p className="text-sm text-ice">{formatINR(card.fees.joiningFee)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-silver/40">
              Score
            </p>
            <p className="text-sm text-brass">{card.scores.overall}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/cards/${card.slug}`}
            className="btn-secondary flex-1 !px-3 !py-2 text-xs"
          >
            Details
          </Link>
          {onToggleCompare && (
            <button
              type="button"
              onClick={() => onToggleCompare(card.id)}
              className={`flex-1 rounded-sm border px-3 py-2 text-xs transition duration-300 ${
                selected
                  ? "border-brass bg-brass/15 text-brass"
                  : "border-white/15 text-silver hover:border-silver/40 hover:bg-white/[0.03]"
              }`}
            >
              {selected ? "Selected" : "Compare"}
            </button>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
}
