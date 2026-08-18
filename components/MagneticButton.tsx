"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  strength?: number;
};

export function MagneticButton({
  href,
  children,
  className = "",
  strength = 0.28,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 280, damping: 22, mass: 0.4 });

  function onMove(e: MouseEvent) {
    if (reduced || mobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div style={{ x: sx, y: sy }} className="inline-flex">
      <Link
        ref={ref}
        href={href}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={className}
      >
        {children}
      </Link>
    </motion.div>
  );
}

type NativeProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
  strength?: number;
};

export function MagneticNativeButton({
  children,
  className = "",
  strength = 0.28,
  ...rest
}: NativeProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 280, damping: 22, mass: 0.4 });

  function onMove(e: MouseEvent) {
    if (reduced || mobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
