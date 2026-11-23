"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Check, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Mode = "share" | "prove";

const FIELDS = [
  ["Name", "Sample Holder"],
  ["Date of birth", "14 Mar 1999"],
  ["Address", "12 Sample Street"],
];

/** One DID anchors several credentials. Compare handing over a document with proving a claim. */
export function IdentipiViz() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>("prove");

  return (
    <div className="grid items-center gap-8 md:grid-cols-2">
      {/* DID + orbiting credentials */}
      <div className="relative mx-auto aspect-square w-full max-w-[280px]" aria-hidden="true">
        <div className="absolute inset-[14%] rounded-full border border-dashed border-primary/30" />
        <div className="absolute inset-[34%] rounded-full border border-primary/20" />
        <motion.div className="absolute inset-0" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 42, repeat: Infinity, ease: "linear" }}>
          {[0, 120, 240].map((deg, i) => (
            <div key={deg} className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transform: `rotate(${deg}deg) translateY(-112px)` }}>
              <motion.div
                className="-ml-[34px] -mt-[18px] grid h-9 w-[68px] place-items-center border border-primary/50 bg-white/85 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-primary"
                animate={reduce ? undefined : { rotate: [-deg, -deg - 360] }}
                style={{ rotate: -deg }}
                transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
              >
                VC 0{i + 1}
              </motion.div>
            </div>
          ))}
        </motion.div>
        <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center bg-primary font-display text-xl font-semibold text-paper [clip-path:polygon(25%_6%,75%_6%,100%_50%,75%_94%,25%_94%,0_50%)]">
          DID
        </div>
      </div>

      {/* verifier panel */}
      <div>
        <div className="mb-3 flex gap-1" role="tablist" aria-label="Verification style">
          {([
            ["share", "Share document"],
            ["prove", "Prove claim"],
          ] as [Mode, string][]).map(([m, label]) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={cn("relative whitespace-nowrap px-3.5 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] transition-colors", mode === m ? "text-paper" : "text-muted hover:text-ink")}
            >
              {mode === m && <motion.span layoutId="idp-mode" className="absolute inset-0 -z-10 bg-primary" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              {label}
            </button>
          ))}
        </div>

        <div className="border hairline bg-white/60 p-5 backdrop-blur-sm" aria-live="polite">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Verifier receives</p>
          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
              <ul className="mt-3 space-y-2.5">
                {FIELDS.map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted">{k}</span>
                    {mode === "share" ? <span className="text-ink">{v}</span> : <span className="h-2.5 w-24 rounded-full bg-ink/20" aria-label="hidden" />}
                  </li>
                ))}
              </ul>
              <div className={cn("mt-4 flex items-center gap-2.5 border px-3 py-2.5 text-sm", mode === "prove" ? "border-accent bg-accent/25 text-ink" : "border-ink/15 text-muted")}>
                {mode === "prove" ? <ShieldCheck size={17} /> : <EyeOff size={17} />}
                {mode === "prove" ? (
                  <span className="flex items-center gap-2">
                    Claim verified: holder is over 18 <Check size={15} />
                  </span>
                ) : (
                  <span>Everything is exposed, even though one fact was needed.</span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="mt-3 text-[0.8rem] text-muted">Illustrative example with sample data. The real flow verifies claims with Zero-Knowledge Proofs.</p>
      </div>
    </div>
  );
}
