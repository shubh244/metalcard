"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useHasMounted } from "@/hooks/useHasMounted";

/** Soft ambient light that follows the cursor — Apple product-page feel */
export function CursorLight({ children }: { children: ReactNode }) {
  const mounted = useHasMounted();
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const enabled = mounted && !reduced && !mobile;
  const x = useMotionValue(-999);
  const y = useMotionValue(-999);
  const sx = useSpring(x, { stiffness: 50, damping: 20, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 50, damping: 20, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled, x, y]);

  return (
    <div className="relative">
      {enabled && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed z-[45] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
          style={{
            left: sx,
            top: sy,
            background:
              "radial-gradient(circle, rgba(184,160,106,0.09) 0%, rgba(200,205,212,0.04) 35%, transparent 68%)",
          }}
        />
      )}
      {children}
    </div>
  );
}
