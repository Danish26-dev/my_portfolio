"use client";

import { useEffect, useState } from "react";

/** Tracks which section crosses the middle of the viewport. */
export function useActiveSection(ids: readonly string[], enabled = true) {
  const [active, setActive] = useState<string>(ids[0]);

  useEffect(() => {
    if (!enabled) return;
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids, enabled]);

  return active;
}
