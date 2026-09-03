"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useHasMounted } from "@/hooks/useHasMounted";

type IconSpec = {
  id: string;
  x: string;
  y: string;
  size: number;
  delay: number;
  duration: number;
  blur: number;
  opacity: number;
  depth: "far" | "mid" | "near";
  path: string;
};

/** Minimal line icons — payments / commerce / banking */
const ICONS: IconSpec[] = [
  {
    id: "wallet",
    x: "68%",
    y: "16%",
    size: 32,
    delay: 0,
    duration: 9,
    blur: 0.8,
    opacity: 0.42,
    depth: "mid",
    path: "M3 8h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8zm0 0V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2M15 14h2",
  },
  {
    id: "card",
    x: "86%",
    y: "36%",
    size: 30,
    delay: 0.8,
    duration: 10,
    blur: 1,
    opacity: 0.38,
    depth: "far",
    path: "M2 7h20v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7zm0 0l2-3h16l2 3M2 11h20",
  },
  {
    id: "cart",
    x: "76%",
    y: "66%",
    size: 28,
    delay: 1.2,
    duration: 8.5,
    blur: 0.6,
    opacity: 0.4,
    depth: "mid",
    path: "M3 4h2l2.5 11h9.5l2-7H7M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  },
  {
    id: "store",
    x: "56%",
    y: "14%",
    size: 26,
    delay: 0.4,
    duration: 11,
    blur: 1.2,
    opacity: 0.32,
    depth: "far",
    path: "M4 9l1-5h14l1 5M4 9v10h16V9M9 19v-6h6v6",
  },
  {
    id: "transfer",
    x: "90%",
    y: "56%",
    size: 26,
    delay: 1.6,
    duration: 9.5,
    blur: 0.8,
    opacity: 0.36,
    depth: "mid",
    path: "M7 10h12l-3-3M17 14H5l3 3",
  },
  {
    id: "shield",
    x: "62%",
    y: "76%",
    size: 28,
    delay: 0.6,
    duration: 10.5,
    blur: 1,
    opacity: 0.34,
    depth: "far",
    path: "M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z",
  },
  {
    id: "phone",
    x: "50%",
    y: "28%",
    size: 24,
    delay: 1.4,
    duration: 8,
    blur: 1.2,
    opacity: 0.28,
    depth: "far",
    path: "M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm4 16h.01",
  },
  {
    id: "chart",
    x: "82%",
    y: "20%",
    size: 26,
    delay: 2,
    duration: 9,
    blur: 0.5,
    opacity: 0.4,
    depth: "near",
    path: "M4 19V9m6 10V5m6 14v-7m4 7H3",
  },
  {
    id: "bag",
    x: "70%",
    y: "46%",
    size: 24,
    delay: 0.2,
    duration: 12,
    blur: 1.4,
    opacity: 0.28,
    depth: "far",
    path: "M6 8h12l1 13H5L6 8zm3 0V6a3 3 0 0 1 6 0v2",
  },
  {
    id: "globe",
    x: "54%",
    y: "52%",
    size: 30,
    delay: 1.1,
    duration: 11.5,
    blur: 1.5,
    opacity: 0.26,
    depth: "far",
    path: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0 0c2.5 0 4.5-4 4.5-9S14.5 3 12 3 7.5 7 7.5 12s2 9 4.5 9zM3 12h18",
  },
  {
    id: "receipt",
    x: "93%",
    y: "74%",
    size: 24,
    delay: 1.8,
    duration: 8.8,
    blur: 0.7,
    opacity: 0.35,
    depth: "mid",
    path: "M6 3h12v18l-2-1-2 1-2-1-2 1-2-1-2 1V3zm4 5h4M8 11h8M8 15h6",
  },
  {
    id: "coin",
    x: "44%",
    y: "70%",
    size: 22,
    delay: 0.9,
    duration: 10,
    blur: 1.2,
    opacity: 0.3,
    depth: "far",
    path: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm-2-6h3a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h3M12 5v2m0 10v2",
  },
];

export function FintechIconField() {
  const mounted = useHasMounted();
  const reduced = usePrefersReducedMotion();
  const animate = mounted && !reduced;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {ICONS.map((icon) => (
        <motion.div
          key={icon.id}
          className="absolute"
          style={{
            left: icon.x,
            top: icon.y,
            width: icon.size,
            height: icon.size,
            opacity: icon.opacity,
            filter: `blur(${icon.blur}px)`,
            zIndex: icon.depth === "near" ? 2 : icon.depth === "mid" ? 1 : 0,
          }}
          animate={
            animate
              ? {
                  y: [0, icon.depth === "near" ? -14 : -10, 0],
                  x: [0, icon.depth === "far" ? 6 : -5, 0],
                  rotate: [0, icon.depth === "mid" ? 8 : -6, 0],
                }
              : undefined
          }
          transition={{
            duration: icon.duration,
            delay: icon.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-full w-full text-silver/80"
          >
            <path d={icon.path} />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
