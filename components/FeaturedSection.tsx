"use client";

import { motion } from "framer-motion";
import type { CreditCard } from "@/types/card";
import { CardTile } from "./CardTile";
import { MagneticButton } from "./MagneticButton";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = {
  featured: CreditCard[];
};

export function FeaturedSection({ featured }: Props) {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="relative mx-auto max-w-6xl px-5 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-16 h-72 w-[min(920px,95%)] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(184,160,106,0.07), transparent 70%)",
        }}
      />

      <motion.div
        className="relative max-w-lg"
        initial={reduced ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="section-label">Featured metal</p>
        <h2 className="mt-2 font-display text-3xl text-ice sm:text-4xl">
          Cards worth forging next
        </h2>
        <p className="mt-3 text-silver/60">
          High-scoring offers across travel, cashback and lifestyle — open a
          card to see fees, lounges and eligibility.
        </p>
      </motion.div>

      <div className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 [perspective:1400px]">
        {featured.map((card, i) => (
          <CardTile key={card.id} card={card} index={i} />
        ))}
      </div>

      <motion.div
        className="relative mt-12 flex flex-wrap gap-3"
        initial={reduced ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        <MagneticButton href="/cards" className="btn-secondary btn-lift">
          View all cards
        </MagneticButton>
        <MagneticButton href="/quiz" className="btn-primary btn-lift">
          Find my card
        </MagneticButton>
      </motion.div>
    </section>
  );
}
