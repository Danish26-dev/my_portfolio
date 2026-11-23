"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

type Pt = { x: number; y: number };
type Node = { id: string; label: string; w: number; kind: "io" | "core" | "agent"; note: string; wide: Pt; tall: Pt };

const NODES: Node[] = [
  { id: "alert", label: "Suspicious activity", w: 132, kind: "io", wide: { x: 78, y: 190 }, tall: { x: 180, y: 46 }, note: "An alert or a piece of suspicious activity enters the system. FRAB investigates it proactively instead of waiting for manual triage." },
  { id: "supervisor", label: "Supervisor", w: 104, kind: "core", wide: { x: 226, y: 190 }, tall: { x: 180, y: 150 }, note: "Coordinates the multi-agent workflow and hands each stage to the right agent." },
  { id: "watchman", label: "Watchman", w: 100, kind: "agent", wide: { x: 372, y: 64 }, tall: { x: 64, y: 262 }, note: "Detection. The first stage of the workflow, where suspicious activity is picked up." },
  { id: "detective", label: "Detective", w: 100, kind: "agent", wide: { x: 372, y: 190 }, tall: { x: 180, y: 262 }, note: "Investigation. Evidence is gathered here, so every later conclusion has something to point back to." },
  { id: "jurist", label: "Jurist", w: 100, kind: "agent", wide: { x: 372, y: 316 }, tall: { x: 296, y: 262 }, note: "Compliance analysis. The case is checked against compliance concerns before anything is recommended." },
  { id: "scribe", label: "Scribe", w: 92, kind: "agent", wide: { x: 506, y: 190 }, tall: { x: 180, y: 390 }, note: "Reporting. Turns the investigation into evidence, risk analysis and explainable recommendations." },
];
const EDGES: [string, string][] = [
  ["alert", "supervisor"],
  ["supervisor", "watchman"],
  ["supervisor", "detective"],
  ["supervisor", "jurist"],
  ["watchman", "scribe"],
  ["detective", "scribe"],
  ["jurist", "scribe"],
];
const ORDER = ["alert", "supervisor", "watchman", "detective", "jurist", "scribe"];
const by = (id: string) => NODES.find((n) => n.id === id)!;
const H = 48;

/**
 * Interactive five-agent architecture. It tours itself; click any agent to take over.
 * Wide screens read left to right; phones get a top-to-bottom layout so the text stays readable.
 */
export function FrabViz() {
  const reduce = useReducedMotion();
  const wide = useMediaQuery("(min-width: 640px)", true);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const active = by(ORDER[step]);
  const pos = (n: Node) => (wide ? n.wide : n.tall);

  useEffect(() => {
    if (!auto || reduce) return;
    const t = setInterval(() => setStep((s) => (s + 1) % ORDER.length), 2600);
    return () => clearInterval(t);
  }, [auto, reduce]);

  const select = (id: string) => {
    setStep(ORDER.indexOf(id));
    setAuto(false);
  };

  return (
    <div>
      <svg
        viewBox={wide ? "0 0 580 380" : "0 0 360 440"}
        className="h-auto w-full"
        role="group"
        aria-label="FRAB multi-agent architecture. Select an agent to read its role."
      >
        {EDGES.map(([a, b], i) => {
          const A = by(a);
          const B = by(b);
          const pa = pos(A);
          const pb = pos(B);
          const x1 = wide ? pa.x + A.w / 2 : pa.x;
          const y1 = wide ? pa.y : pa.y + H / 2;
          const x2 = wide ? pb.x - B.w / 2 : pb.x;
          const y2 = wide ? pb.y : pb.y - H / 2;
          const live = ORDER[step] === a || ORDER[step] === b;
          return (
            <g key={`${i}-${wide}`}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1546D9" strokeOpacity={live ? 0.9 : 0.25} strokeWidth={live ? 1.8 : 1.1} />
              {!reduce && (
                <motion.circle
                  r="3.6"
                  fill="#F9B318"
                  initial={{ cx: x1, cy: y1, opacity: 0 }}
                  animate={{ cx: [x1, x2], cy: [y1, y2], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "linear", delay: (i % 4) * 0.45 }}
                />
              )}
            </g>
          );
        })}
        {NODES.map((n) => {
          const on = n.id === active.id;
          const p = pos(n);
          return (
            <g
              key={n.id}
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={n.label}
              data-cursor
              className="cursor-pointer outline-none"
              onClick={() => select(n.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  select(n.id);
                }
              }}
            >
              <rect
                x={p.x - n.w / 2}
                y={p.y - H / 2}
                width={n.w}
                height={H}
                fill={on ? "#F9B318" : "#FFFFFF"}
                fillOpacity={on ? 0.35 : 0.85}
                stroke={n.kind === "core" ? "#111827" : "#1546D9"}
                strokeWidth={on ? 2.4 : 1.2}
              />
              {on && <rect x={p.x - n.w / 2 - 5} y={p.y - H / 2 - 5} width={n.w + 10} height={H + 10} fill="none" stroke="#F9B318" strokeDasharray="4 4" />}
              <text x={p.x} y={p.y + 4.5} textAnchor="middle" fontSize="13" fontWeight="600" fill="#111827" style={{ fontFamily: "var(--font-body)", pointerEvents: "none" }}>
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-2 flex items-start justify-between gap-4 border-t hairline pt-4" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={active.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <p className="eyebrow">{active.label}</p>
            <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-ink/85">{active.note}</p>
          </motion.div>
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setAuto((a) => !a)}
          aria-label={auto ? "Pause the tour" : "Play the tour"}
          className={cn("grid h-11 w-11 shrink-0 place-items-center border transition-colors", auto ? "border-primary text-primary" : "border-ink/20 text-muted hover:border-primary hover:text-primary")}
        >
          {auto ? <Pause size={15} /> : <Play size={15} />}
        </button>
      </div>
      <p className="mt-3 font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.14em] text-muted">
        Private inference · 0G Private Computer (TEE) · GCP Confidential VM
      </p>
    </div>
  );
}
