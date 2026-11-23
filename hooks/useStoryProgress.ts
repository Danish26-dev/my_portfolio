"use client";

import { useMotionValue, type MotionValue } from "framer-motion";
import { useEffect, type RefObject } from "react";

/**
 * 0 -> 1 progress of a tall section while it scrolls past.
 *  - pinned: the section is `position: sticky` inside, so progress runs over (height - viewport).
 *  - otherwise: progress runs while the section leaves the top of the viewport.
 * Written as a plain scroll listener so the 3D loop can read `.get()` every frame.
 */
export function useStoryProgress(
  ref: RefObject<HTMLElement>,
  pinned: boolean | "lg" = true
): MotionValue<number> {
  const progress = useMotionValue(0);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const isPinned = pinned === "lg" ? window.matchMedia("(min-width: 1024px)").matches : pinned;
      const range = Math.max(1, isPinned ? r.height - vh : r.height);
      progress.set(Math.min(1, Math.max(0, -r.top / range)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, pinned, progress]);

  return progress;
}
