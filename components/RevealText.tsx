"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useHasMounted } from "@/hooks/useHasMounted";

type Props = {
  text: string;
  className?: string;
  delay?: number;
};

/** Letter stagger — restrained brand entrance (hydration-safe) */
export function RevealText({ text, className = "", delay = 0 }: Props) {
  const mounted = useHasMounted();
  const reduced = usePrefersReducedMotion();
  const animate = mounted && !reduced;
  const letters = text.split("");

  if (!animate) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={`inline-block ${className}`} aria-label={text}>
      {letters.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : undefined }}
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.7,
            delay: delay + i * 0.035,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
