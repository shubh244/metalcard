"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type MouseEvent } from "react";
import { MagneticButton } from "./MagneticButton";
import { MetalCard } from "./MetalCard";
import { FintechIconField } from "./FintechIconField";
import { RevealText } from "./RevealText";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useHasMounted } from "@/hooks/useHasMounted";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mounted = useHasMounted();
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const canParallax = mounted && !reduced && !mobile;
  const canAnimate = mounted && !reduced;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 48, damping: 18, mass: 0.55 });
  const sy = useSpring(my, { stiffness: 48, damping: 18, mass: 0.55 });

  const glowX = useTransform(sx, [-0.5, 0.5], [40, 62]);
  const glowY = useTransform(sy, [-0.5, 0.5], [30, 52]);
  const ambient = useMotionTemplate`radial-gradient(ellipse 55% 48% at ${glowX}% ${glowY}%, rgba(200,205,212,0.14), transparent 62%)`;

  const cardX = useTransform(sx, [-0.5, 0.5], [10, -10]);
  const cardY = useTransform(sy, [-0.5, 0.5], [6, -6]);
  const cardRot = useTransform(sx, [-0.5, 0.5], [2, -4]);

  function onMove(e: MouseEvent) {
    if (!canParallax || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative min-h-[100svh] overflow-hidden"
    >
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(155deg, #15181e 0%, #0b0d10 42%, #10141a 72%, #0b0d10 100%)",
          }}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 65% at 58% 42%, transparent 35%, rgba(11,13,16,0.55) 100%)",
          }}
        />

        <div
          className="absolute right-[5%] top-[15%] h-[55%] w-[50%] opacity-80"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(200,205,212,0.12), transparent 65%)",
          }}
        />
        {canParallax && (
          <motion.div
            className="absolute inset-0 opacity-80"
            style={{ background: ambient }}
          />
        )}

        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-[18%] top-[30%] h-56 w-56 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(184,160,106,0.2), transparent 70%)",
          }}
          animate={canAnimate ? { opacity: [0.18, 0.3, 0.18] } : undefined}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <FintechIconField />

        {/* Simple professional card — no WebGL */}
        <motion.div
          className="absolute bottom-[12%] right-[4%] z-[3] w-[min(360px,82%)] sm:bottom-[16%] sm:right-[8%] sm:w-[400px] lg:right-[10%] lg:w-[420px]"
          style={{
            x: canParallax ? cardX : 0,
            y: canParallax ? cardY : 0,
            rotate: canParallax ? cardRot : -6,
          }}
          initial={false}
        >
          <div style={{ transform: "rotate(-6deg)" }}>
            <MetalCard
              card={{
                name: "Cardholder Name",
                bankName: "CardForge",
                network: "Visa",
                metalTone: "obsidian",
                variant: "Metal",
              }}
              size="hero"
              interactive={!mobile && !reduced}
              float={!reduced}
              className="!max-w-none shadow-metal"
            />
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-24 pt-20">
        <div className="max-w-xl">
          <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight text-ice sm:text-7xl">
            <RevealText text="CardForge" delay={0.12} />
          </h1>

          <motion.p
            className="mt-5 max-w-md text-base leading-relaxed text-silver/75 sm:text-lg"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.85,
              delay: canAnimate ? 0.5 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Forge the right metal — compare India&apos;s premium credit cards by
            rewards, lounges and real annual value.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: canAnimate ? 0.65 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <MagneticButton href="/quiz" className="btn-primary btn-lift">
              Find my card
            </MagneticButton>
            <MagneticButton href="/cards" className="btn-secondary btn-lift">
              Browse cards
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-28 bg-gradient-to-t from-graphite via-graphite/80 to-transparent"
      />
    </section>
  );
}
