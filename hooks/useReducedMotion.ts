"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Hydration-safe version of Framer Motion's hook.
 * The server can't know the visitor's preference, so the first client render must match it (false);
 * the real value is applied right after mount. Without this, reduced-motion users get hydration errors.
 */
export function useReducedMotion(): boolean {
  const pref = useFramerReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? !!pref : false;
}
