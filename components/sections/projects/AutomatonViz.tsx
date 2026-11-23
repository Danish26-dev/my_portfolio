"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const BARS = 56;
const amp = (i: number, who: "customer" | "agent") => {
  const base = who === "customer" ? Math.abs(Math.sin(i * 0.62) * Math.cos(i * 0.21)) : Math.abs(Math.sin(i * 0.37 + 1.2));
  return 0.18 + 0.82 * base;
};

const STAGES = ["Rule-based logic", "AI inference", "Order confirmation"];

/** Voice waveform plus the decision pipeline behind it. Designed for the cobalt band. */
export function AutomatonViz() {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setTick((n) => n + 1), 1300);
    return () => clearInterval(t);
  }, [reduce]);

  const who = tick % 6 < 3 ? "customer" : "agent";
  const stage = tick % 3;

  return (
    <div>
      <div className="flex items-center justify-between font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">
        <span className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", who === "agent" ? "bg-accent" : "bg-white")} />
          {who === "customer" ? "Customer speaking" : "Agent responding"}
        </span>
        <span>Multilingual</span>
      </div>

      <div className="mt-5 flex h-36 items-center gap-[3px] sm:h-44" aria-hidden="true">
        {Array.from({ length: BARS }, (_, i) => {
          const a = amp(i, who);
          return (
            <motion.span
              key={`${who}-${i}`}
              className={cn("block h-full flex-1 rounded-full", who === "agent" ? "bg-accent" : "bg-white")}
              initial={{ scaleY: 0.08 }}
              animate={reduce ? { scaleY: a * 0.7 } : { scaleY: [a * 0.25, a, a * 0.4, a * 0.85, a * 0.25] }}
              transition={{ duration: 1.6 + (i % 7) * 0.12, repeat: Infinity, ease: "easeInOut", delay: (i % 9) * 0.05 }}
            />
          );
        })}
      </div>

      <ol className="mt-6 flex flex-wrap items-center gap-2" aria-label="Decision pipeline">
        {STAGES.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span
              className={cn(
                "border px-3.5 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-500",
                stage === i ? "border-accent bg-accent text-ink" : "border-white/35 text-white/85"
              )}
            >
              {s}
            </span>
            {i < STAGES.length - 1 && <span className="text-white/50">→</span>}
          </li>
        ))}
      </ol>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">
        Predictable turns follow rules and stay fast. Open-ended turns go to AI inference. Together they form the low-latency decision pipeline behind each call.
      </p>
    </div>
  );
}
