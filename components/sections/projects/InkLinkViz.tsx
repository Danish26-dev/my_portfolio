"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Mode = "documents" | "payments";

const CUST = [70, 190, 310].map((y) => ({ x: 56, y }));
const HUB = { x: 232, y: 190 };
const SHOP = [70, 190, 310].map((y) => ({ x: 404, y }));
const ESP = { x: 530, y: 190 };

/** Sample a quadratic Bezier so Framer can animate along it with plain keyframes. */
function bez(p0: { x: number; y: number }, c: { x: number; y: number }, p1: { x: number; y: number }, n = 14) {
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const m = 1 - t;
    xs.push(m * m * p0.x + 2 * m * t * c.x + t * t * p1.x);
    ys.push(m * m * p0.y + 2 * m * t * c.y + t * t * p1.y);
  }
  return { xs, ys };
}

const NOTE: Record<Mode, string> = {
  documents: "A customer's document goes to a local AI agent, is processed privately on 0G Private Computer, and reaches a print shop without being exposed along the way.",
  payments: "Each job is paid per use over Hedera x402. The payment settles autonomously between the customer and the print provider.",
};

/** Decentralized printing network: toggle between the document flow and the payment flow. */
export function InkLinkViz() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>("documents");
  const [focus, setFocus] = useState<number | null>(null);
  const dim = (i: number) => (focus === null || focus === i ? 1 : 0.28);

  return (
    <div>
      <div className="mb-3 flex gap-1" role="tablist" aria-label="Flow">
        {(["documents", "payments"] as Mode[]).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={cn("relative px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.16em] transition-colors", mode === m ? "text-paper" : "text-muted hover:text-ink")}
          >
            {mode === m && <motion.span layoutId="ink-mode" className="absolute inset-0 -z-10 bg-primary" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
            {m === "documents" ? "Documents" : "Payments · x402"}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 580 380" className="isolate h-auto w-full" role="img" aria-label="Network of customers, local AI agents and print shops">
        {/* base edges */}
        {CUST.map((c, i) => (
          <line key={`a${i}`} x1={c.x + 30} y1={c.y} x2={HUB.x - 54} y2={HUB.y} stroke="#1546D9" strokeOpacity="0.22" />
        ))}
        {SHOP.map((s, i) => (
          <line key={`b${i}`} x1={HUB.x + 54} y1={HUB.y} x2={s.x - 44} y2={s.y} stroke="#1546D9" strokeOpacity={0.22 * dim(i) + 0.05} strokeWidth={focus === i ? 2 : 1} />
        ))}
        <line x1={SHOP[1].x + 44} y1={SHOP[1].y} x2={ESP.x - 30} y2={ESP.y} stroke="#111827" strokeOpacity="0.4" strokeDasharray="4 4" />

        {/* moving packets */}
        {!reduce && mode === "documents" && (
          <>
            {CUST.map((c, i) => (
              <motion.rect key={`pd${i}`} width="8" height="8" rx="1.5" fill="#1546D9" initial={{ opacity: 0 }} animate={{ x: [c.x + 26, HUB.x - 58], y: [c.y - 4, HUB.y - 4], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5, ease: "linear" }} />
            ))}
            {SHOP.map((s, i) => (
              <motion.rect key={`ps${i}`} width="8" height="8" rx="1.5" fill="#1546D9" initial={{ opacity: 0 }} animate={{ x: [HUB.x + 50, s.x - 48], y: [HUB.y - 4, s.y - 4], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.9 + i * 0.5, ease: "linear" }} />
            ))}
            <motion.rect width="8" height="8" rx="1.5" fill="#F9B318" initial={{ opacity: 0 }} animate={{ x: [SHOP[1].x + 40, ESP.x - 34], y: [ESP.y - 4, ESP.y - 4], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 1.6, ease: "linear" }} />
          </>
        )}
        {!reduce && mode === "payments" &&
          CUST.map((c, i) => {
            const target = SHOP[i];
            const { xs, ys } = bez({ x: c.x + 30, y: c.y }, { x: (c.x + target.x) / 2, y: i === 1 ? 190 - 90 : (c.y + target.y) / 2 + (i === 0 ? -50 : 50) }, { x: target.x - 44, y: target.y });
            return (
              <g key={`pay${i}`}>
                <path d={`M${xs[0]} ${ys[0]} Q${(c.x + target.x) / 2} ${i === 1 ? 100 : (c.y + target.y) / 2 + (i === 0 ? -50 : 50)} ${xs[xs.length - 1]} ${ys[ys.length - 1]}`} fill="none" stroke="#F9B318" strokeOpacity="0.55" strokeDasharray="3 5" />
                <motion.circle r="5" fill="#F9B318" stroke="#111827" strokeWidth="0.8" style={{ opacity: dim(i) }} initial={{ cx: xs[0], cy: ys[0] }} animate={{ cx: xs, cy: ys }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.7, ease: "linear" }} />
              </g>
            );
          })}

        {/* nodes */}
        {CUST.map((c, i) => (
          <g key={`c${i}`}>
            <circle cx={c.x} cy={c.y} r="26" fill="#FFFFFF" fillOpacity="0.85" stroke="#111827" strokeOpacity="0.55" />
            <text x={c.x} y={c.y + 4} textAnchor="middle" fontSize="11" fill="#111827" style={{ fontFamily: "var(--font-mono)" }}>
              USER
            </text>
          </g>
        ))}
        <rect x={HUB.x - 54} y={HUB.y - 50} width="108" height="100" fill="#1546D9" fillOpacity="0.12" stroke="#1546D9" strokeWidth="1.6" />
        <text x={HUB.x} y={HUB.y - 6} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#111827" style={{ fontFamily: "var(--font-body)" }}>
          Local AI
        </text>
        <text x={HUB.x} y={HUB.y + 10} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#111827" style={{ fontFamily: "var(--font-body)" }}>
          agents
        </text>
        <text x={HUB.x} y={HUB.y + 32} textAnchor="middle" fontSize="8.5" fill="#586274" style={{ fontFamily: "var(--font-mono)" }}>
          0G · PRIVATE
        </text>
        {SHOP.map((s, i) => (
          <g
            key={`s${i}`}
            role="button"
            tabIndex={0}
            aria-label={`Print shop ${i + 1}`}
            data-cursor
            className="cursor-pointer outline-none"
            onMouseEnter={() => setFocus(i)}
            onMouseLeave={() => setFocus(null)}
            onFocus={() => setFocus(i)}
            onBlur={() => setFocus(null)}
            opacity={dim(i)}
          >
            <rect x={s.x - 44} y={s.y - 26} width="88" height="52" fill="#FFFFFF" fillOpacity="0.9" stroke="#1546D9" strokeWidth={focus === i ? 2.4 : 1.2} />
            <text x={s.x} y={s.y + 4} textAnchor="middle" fontSize="12" fontWeight="600" fill="#111827" style={{ fontFamily: "var(--font-body)" }}>
              Print shop
            </text>
          </g>
        ))}
        <rect x={ESP.x - 30} y={ESP.y - 22} width="60" height="44" fill="#F9B318" fillOpacity="0.35" stroke="#111827" />
        <text x={ESP.x} y={ESP.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#111827" style={{ fontFamily: "var(--font-mono)" }}>
          ESP32
        </text>
      </svg>

      <AnimatePresence mode="wait">
        <motion.p key={mode} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="mt-2 max-w-lg border-t hairline pt-4 text-[0.95rem] leading-relaxed text-ink/85" aria-live="polite">
          {NOTE[mode]} The ESP32 on the right is the physical end of the pipeline: it executes the print job.
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
