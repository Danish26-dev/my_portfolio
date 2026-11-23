"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PhoenixMark } from "@/components/ui/Logo";
import { easeOutExpo } from "@/lib/utils";

const KEY = "wp-preloaded";

export function Preloader() {
  const [show, setShow] = useState(true);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem(KEY);
    const total = seen || reduce ? 350 : 1900;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / total);
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        sessionStorage.setItem(KEY, "1");
        setShow(false);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-paper"
          role="status"
          aria-label="Loading"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: easeOutExpo }}
        >
          <div className="flex flex-col items-center gap-6">
            <PhoenixMark size={96} draw />
            <div className="w-48">
              <div className="h-px w-full bg-ink/10">
                <div
                  className="h-px bg-gradient-to-r from-primary to-accent"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted/75">
                <span>Diving in</span>
                <span>{String(pct).padStart(3, "0")}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
