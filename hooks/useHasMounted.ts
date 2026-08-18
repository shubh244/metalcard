"use client";

import { useEffect, useState } from "react";

/** False on server + first client paint; true after mount — safe for hydration. */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
