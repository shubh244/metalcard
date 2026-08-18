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
import { HeroMetalCanvas } from "./HeroMetalCanvas";
import { RevealText } from "./RevealText";
import type { Pointer } from "./HeroMetalCanvas";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useHasMounted } from "@/hooks/useHasMounted";

const cardShellClass =
  "absolute bottom-[10%] right-[3%] h-[300px] w-[min(400px,84%)] sm:bottom-[14%] sm:right-[6%] sm:h-[340px] sm:w-[440px] lg:right-[8%] lg:h-[360px] lg:w-[460px]";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const mounted = useHasMounted();
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const canParallax = mounted && !reduced && !mobile;
  const canAnimate = mounted && !reduced;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 48, damping: 18, mass: 0.55 });
  const sy = useSpring(my, { stiffness: 48, damping: 18, mass: 0.55 });

  const glowX = useTransform(sx, [-0.5, 0.5], [38, 62]);
  const glowY = useTransform(sy, [-0.5, 0.5], [28, 52]);
  const ambient = useMotionTemplate`radial-gradient(ellipse 58% 48% at ${glowX}% ${glowY}%, rgba(200,205,212,0.16), transparent 62%)`;

  const layerFarX = useTransform(sx, [-0.5, 0.5], [-8, 8]);
  const layerFarY = useTransform(sy, [-0.5, 0.5], [-6, 6]);
  const layerNearX = useTransform(sx, [-0.5, 0.5], [12, -12]);
  const layerNearY = useTransform(sy, [-0.5, 0.5], [8, -8]);

  function onMove(e: MouseEvent) {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    pointer.current = { x: nx, y: ny };
    if (!canParallax) return;
    mx.set(nx);
    my.set(ny);
  }

  function onLeave() {
    pointer.current = { x: 0, y: 0 };
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
              "linear-gradient(160deg, #1a1e24 0%, #0b0d10 40%, #12151a 70%, #0b0d10 100%)",
          }}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 75% 70% at 50% 45%, transparent 40%, rgba(11,13,16,0.55) 100%)",
          }}
        />

        <div
          className="absolute -right-[10%] top-[10%] h-[70%] w-[70%] opacity-90"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(200,205,212,0.15), transparent 60%)",
          }}
        />
        {canParallax && (
          <motion.div
            className="absolute inset-0 opacity-90"
            style={{ background: ambient }}
          />
        )}

        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-[6%] top-[26%] h-44 w-44 rounded-full opacity-35 blur-3xl sm:h-60 sm:w-60"
          style={{
            background:
              "radial-gradient(circle, rgba(184,160,106,0.32), transparent 70%)",
            x: canParallax ? layerFarX : 0,
            y: canParallax ? layerFarY : 0,
          }}
          animate={canAnimate ? { opacity: [0.22, 0.4, 0.22] } : undefined}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          aria-hidden
          className="pointer-events-none absolute bottom-[20%] left-[32%] h-36 w-36 rounded-full opacity-25 blur-2xl sm:h-48 sm:w-48"
          style={{
            background:
              "radial-gradient(circle, rgba(232,236,241,0.22), transparent 70%)",
            x: canParallax ? layerNearX : 0,
            y: canParallax ? layerNearY : 0,
          }}
        />

        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-[10%] top-[60%] hidden h-[4.5rem] w-28 rounded-2xl border border-white/[0.09] bg-white/[0.03] shadow-metal-sm backdrop-blur-md md:block"
          style={{
            rotate: -14,
            x: canParallax ? layerFarX : 0,
            y: canParallax ? layerFarY : 0,
          }}
          animate={canAnimate ? { y: [0, -9, 0] } : undefined}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-[40%] top-[20%] hidden h-14 w-24 rounded-xl border border-white/[0.07] bg-steel/30 backdrop-blur-lg lg:block"
          style={{
            rotate: 10,
            x: canParallax ? layerNearX : 0,
            y: canParallax ? layerNearY : 0,
          }}
          animate={canAnimate ? { y: [0, 7, 0] } : undefined}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6,
          }}
        />

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className={cardShellClass}
        >
          <HeroMetalCanvas pointer={pointer} className="h-full w-full" />
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
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-graphite via-graphite/80 to-transparent"
      />
    </section>
  );
}
