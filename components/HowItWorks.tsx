"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useHasMounted } from "@/hooks/useHasMounted";

const steps = [
  {
    n: "01",
    title: "Tell us how you spend",
    body: "Share income, categories and what you value — cashback, travel or lounges.",
    href: "/quiz",
    cta: "Start quiz",
  },
  {
    n: "02",
    title: "Compare side by side",
    body: "Line up fees, rewards and lounge access across India’s premium cards.",
    href: "/compare",
    cta: "Compare cards",
  },
  {
    n: "03",
    title: "Estimate real value",
    body: "Model your monthly spend and see estimated annual benefit after fees.",
    href: "/calculator",
    cta: "Open calculator",
  },
  {
    n: "04",
    title: "Apply with confidence",
    body: "Open the official bank page when you’re ready — we keep data illustrative.",
    href: "/cards",
    cta: "Browse cards",
  },
];

export function HowItWorks() {
  const mounted = useHasMounted();
  const reduced = usePrefersReducedMotion();
  const animate = mounted && !reduced;

  return (
    <section className="relative border-t border-white/5 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <motion.div
          className="max-w-lg"
          initial={animate ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-label">How it works</p>
          <h2 className="mt-2 font-display text-3xl text-ice sm:text-4xl">
            Four clear steps to the right metal
          </h2>
          <p className="mt-3 text-silver/60">
            A simple path from your spend profile to a card that fits — without
            the noise.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.article
              key={step.n}
              initial={animate ? { opacity: 0, y: 18 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.55,
                delay: Math.min(i * 0.08, 0.3),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="metal-panel group flex flex-col rounded-lg p-5"
            >
              <span className="font-display text-2xl text-brass/80">{step.n}</span>
              <h3 className="mt-3 font-display text-xl text-ice">{step.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-silver/60">
                {step.body}
              </p>
              <Link
                href={step.href}
                className="mt-5 text-sm text-brass transition group-hover:text-ice"
              >
                {step.cta} →
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
