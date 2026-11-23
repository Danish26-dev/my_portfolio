"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

type Mode = "documents" | "payments";
type Pt = { x: number; y: number };

/** Sample a quadratic Bezier so Framer can animate along it with plain keyframes. */
function bez(p0: Pt, c: Pt, p1: Pt, n = 14) {
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

/** Geometry for both layouts: left to right on wide screens, top to bottom on phones. */
function layout(wide: boolean) {
  if (wide) {
    const cust = [70, 190, 310].map((y) => ({ x: 56, y }));
    const hub = { x: 232, y: 190, w: 108, h: 100 };
    const shop = [70, 190, 310].map((y) => ({ x: 404, y }));
    const esp = { x: 530, y: 190, w: 60, h: 44 };
    return {
      vb: "0 0 580 380",
      cust,
      hub,
      shop,
      esp,
      shopW: 88,
      shopH: 52,
      cOut: (i: number): Pt => ({ x: cust[i].x + 30, y: cust[i].y }),
      hubIn: (): Pt => ({ x: hub.x - hub.w / 2, y: hub.y }),
      hubOut: (): Pt => ({ x: hub.x + hub.w / 2, y: hub.y }),
      sIn: (j: number): Pt => ({ x: shop[j].x - 44, y: shop[j].y }),
      sOut: (): Pt => ({ x: shop[1].x + 44, y: shop[1].y }),
      eIn: (): Pt => ({ x: esp.x - esp.w / 2, y: esp.y }),
      payCtrl: (i: number): Pt => ({ x: (cust[i].x + shop[i].x) / 2, y: i === 1 ? 100 : (cust[i].y + shop[i].y) / 2 + (i === 0 ? -50 : 50) }),
    };
  }
  const cust = [60, 180, 300].map((x) => ({ x, y: 50 }));
  const hub = { x: 180, y: 200, w: 170, h: 88 };
  const shop = [60, 180, 300].map((x) => ({ x, y: 360 }));
  const esp = { x: 180, y: 492, w: 92, h: 46 };
  return {
    vb: "0 0 360 560",
    cust,
    hub,
    shop,
    esp,
    shopW: 96,
    shopH: 52,
    cOut: (i: number): Pt => ({ x: cust[i].x, y: cust[i].y + 26 }),
    hubIn: (i: number): Pt => ({ x: hub.x + (cust[i].x - 180) * 0.45, y: hub.y - hub.h / 2 }),
    hubOut: (j: number): Pt => ({ x: hub.x + (shop[j].x - 180) * 0.45, y: hub.y + hub.h / 2 }),
    sIn: (j: number): Pt => ({ x: shop[j].x, y: shop[j].y - 26 }),
    sOut: (): Pt => ({ x: shop[1].x, y: shop[1].y + 26 }),
    eIn: (): Pt => ({ x: esp.x, y: esp.y - esp.h / 2 }),
    payCtrl: (i: number): Pt => ({ x: cust[i].x + (i === 0 ? -64 : 78), y: (cust[i].y + shop[i].y) / 2 }),
  };
}

const NOTE: Record<Mode, string> = {
  documents: "A customer's document goes to a local AI agent, is processed privately on 0G Private Computer, and reaches a print shop without being exposed along the way.",
  payments: "Each job is paid per use over Hedera x402. The payment settles autonomously between the customer and the print provider.",
};

/** Decentralized printing network: toggle between the document flow and the payment flow. */
export function InkLinkViz() {
  const reduce = useReducedMotion();
  const wide = useMediaQuery("(min-width: 640px)", true);
  const L = layout(wide);
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
            className={cn("relative min-h-11 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.16em] transition-colors", mode === m ? "text-paper" : "text-muted hover:text-ink")}
          >
            {mode === m && <motion.span layoutId="ink-mode" className="absolute inset-0 -z-10 bg-primary" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
            {m === "documents" ? "Documents" : "Payments · x402"}
          </button>
        ))}
      </div>

      <svg key={String(wide)} viewBox={L.vb} className="isolate h-auto w-full" role="img" aria-label="Network of customers, local AI agents and print shops">
        {/* base edges */}
        {L.cust.map((_, i) => (
          <line key={`a${i}`} x1={L.cOut(i).x} y1={L.cOut(i).y} x2={L.hubIn(i).x} y2={L.hubIn(i).y} stroke="#1546D9" strokeOpacity="0.22" />
        ))}
        {L.shop.map((_, i) => (
          <line key={`b${i}`} x1={L.hubOut(i).x} y1={L.hubOut(i).y} x2={L.sIn(i).x} y2={L.sIn(i).y} stroke="#1546D9" strokeOpacity={0.22 * dim(i) + 0.05} strokeWidth={focus === i ? 2 : 1} />
        ))}
        <line x1={L.sOut().x} y1={L.sOut().y} x2={L.eIn().x} y2={L.eIn().y} stroke="#111827" strokeOpacity="0.4" strokeDasharray="4 4" />

        {/* moving packets */}
        {!reduce && mode === "documents" && (
          <>
            {L.cust.map((_, i) => (
              <motion.rect key={`pd${i}`} width="8" height="8" rx="1.5" fill="#1546D9" initial={{ opacity: 0 }} animate={{ x: [L.cOut(i).x - 4, L.hubIn(i).x - 4], y: [L.cOut(i).y - 4, L.hubIn(i).y - 4], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5, ease: "linear" }} />
            ))}
            {L.shop.map((_, i) => (
              <motion.rect key={`ps${i}`} width="8" height="8" rx="1.5" fill="#1546D9" initial={{ opacity: 0 }} animate={{ x: [L.hubOut(i).x - 4, L.sIn(i).x - 4], y: [L.hubOut(i).y - 4, L.sIn(i).y - 4], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.9 + i * 0.5, ease: "linear" }} />
            ))}
            <motion.rect width="8" height="8" rx="1.5" fill="#F9B318" initial={{ opacity: 0 }} animate={{ x: [L.sOut().x - 4, L.eIn().x - 4], y: [L.sOut().y - 4, L.eIn().y - 4], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 1.6, ease: "linear" }} />
          </>
        )}
        {!reduce && mode === "payments" &&
          L.cust.map((_, i) => {
            const a = L.cOut(i);
            const b = L.sIn(i);
            const c = L.payCtrl(i);
            const { xs, ys } = bez(a, c, b);
            return (
              <g key={`pay${i}`}>
                <path d={`M${a.x} ${a.y} Q${c.x} ${c.y} ${b.x} ${b.y}`} fill="none" stroke="#F9B318" strokeOpacity="0.6" strokeDasharray="3 5" />
                <motion.circle r="5" fill="#F9B318" stroke="#111827" strokeWidth="0.8" style={{ opacity: dim(i) }} initial={{ cx: xs[0], cy: ys[0] }} animate={{ cx: xs, cy: ys }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.7, ease: "linear" }} />
              </g>
            );
          })}

        {/* nodes */}
        {L.cust.map((c, i) => (
          <g key={`c${i}`}>
            <circle cx={c.x} cy={c.y} r="26" fill="#FFFFFF" fillOpacity="0.85" stroke="#111827" strokeOpacity="0.55" />
            <text x={c.x} y={c.y + 4} textAnchor="middle" fontSize="11" fill="#111827" style={{ fontFamily: "var(--font-mono)" }}>
              USER
            </text>
          </g>
        ))}
        <rect x={L.hub.x - L.hub.w / 2} y={L.hub.y - L.hub.h / 2} width={L.hub.w} height={L.hub.h} fill="#1546D9" fillOpacity="0.12" stroke="#1546D9" strokeWidth="1.6" />
        <text x={L.hub.x} y={L.hub.y - 6} textAnchor="middle" fontSize="13" fontWeight="600" fill="#111827" style={{ fontFamily: "var(--font-body)" }}>
          Local AI
        </text>
        <text x={L.hub.x} y={L.hub.y + 11} textAnchor="middle" fontSize="13" fontWeight="600" fill="#111827" style={{ fontFamily: "var(--font-body)" }}>
          agents
        </text>
        <text x={L.hub.x} y={L.hub.y + 32} textAnchor="middle" fontSize="9" fill="#586274" style={{ fontFamily: "var(--font-mono)" }}>
          0G · PRIVATE
        </text>
        {L.shop.map((s, i) => (
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
            onClick={() => setFocus((f) => (f === i ? null : i))}
            opacity={dim(i)}
          >
            <rect x={s.x - L.shopW / 2} y={s.y - L.shopH / 2} width={L.shopW} height={L.shopH} fill="#FFFFFF" fillOpacity="0.9" stroke="#1546D9" strokeWidth={focus === i ? 2.4 : 1.2} />
            <text x={s.x} y={s.y + 4.5} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#111827" style={{ fontFamily: "var(--font-body)", pointerEvents: "none" }}>
              Print shop
            </text>
          </g>
        ))}
        <rect x={L.esp.x - L.esp.w / 2} y={L.esp.y - L.esp.h / 2} width={L.esp.w} height={L.esp.h} fill="#F9B318" fillOpacity="0.35" stroke="#111827" />
        <text x={L.esp.x} y={L.esp.y + 4.5} textAnchor="middle" fontSize="12" fontWeight="700" fill="#111827" style={{ fontFamily: "var(--font-mono)" }}>
          ESP32
        </text>
      </svg>

      <AnimatePresence mode="wait">
        <motion.p key={mode} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="mt-2 max-w-lg border-t hairline pt-4 text-[0.95rem] leading-relaxed text-ink/85" aria-live="polite">
          {NOTE[mode]} The ESP32 is the physical end of the pipeline: it executes the print job.
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
