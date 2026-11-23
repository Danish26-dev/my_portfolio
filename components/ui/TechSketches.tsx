"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ReactNode } from "react";

/** Hand-drawn style technical illustrations used as floating margin notes. */
const stroke = { stroke: "#1546D9", strokeWidth: 1.2, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function AgentGraphSketch() {
  return (
    <svg viewBox="0 0 160 130" className="h-full w-full" aria-hidden="true">
      <g {...stroke}>
        <circle cx="80" cy="65" r="13" fill="#F9B318" fillOpacity="0.35" />
        {[
          [26, 24],
          [134, 24],
          [26, 106],
          [134, 106],
        ].map(([x, y], i) => (
          <g key={i}>
            <line x1="80" y1="65" x2={x} y2={y} strokeDasharray="3 4" />
            <rect x={x - 9} y={y - 9} width="18" height="18" rx="2" fill="#FFFFFF" fillOpacity="0.6" />
          </g>
        ))}
        <path d="M40 24h80M26 38v54M134 38v54M40 106h80" strokeOpacity="0.25" />
      </g>
      <text x="80" y="69" textAnchor="middle" fontSize="8" fill="#111827" style={{ fontFamily: "var(--font-mono)" }}>
        SUP
      </text>
    </svg>
  );
}

export function CredentialSketch() {
  return (
    <svg viewBox="0 0 160 110" className="h-full w-full" aria-hidden="true">
      <g {...stroke}>
        <rect x="14" y="14" width="110" height="70" rx="5" fill="#FFFFFF" fillOpacity="0.6" />
        <circle cx="40" cy="42" r="12" />
        <path d="M62 34h46M62 46h36M30 68h78" />
        <rect x="98" y="46" width="52" height="46" rx="5" fill="#EDECE6" />
        <path d="M112 70l9 9 17-20" stroke="#F9B318" strokeWidth="2.4" />
      </g>
    </svg>
  );
}

export function PacketFlowSketch() {
  return (
    <svg viewBox="0 0 170 90" className="h-full w-full" aria-hidden="true">
      <g {...stroke}>
        <rect x="6" y="28" width="30" height="34" rx="3" fill="#FFFFFF" fillOpacity="0.6" />
        <rect x="132" y="28" width="30" height="34" rx="3" fill="#FFFFFF" fillOpacity="0.6" />
        <path d="M36 45h96" strokeDasharray="4 4" />
        <path d="M122 39l10 6-10 6" />
        <rect x="64" y="35" width="22" height="20" rx="2" fill="#F9B318" fillOpacity="0.4" />
        <path d="M70 35v-5a5 5 0 0 1 10 0v5" />
      </g>
    </svg>
  );
}

/** Moves a child at a different rate than the page to give depth. */
export function Float({
  progress,
  from,
  to,
  className,
  children,
}: {
  progress: MotionValue<number>;
  from: number;
  to: number;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const y = useTransform(progress, [0, 1], [from, to]);
  return (
    <motion.div style={reduce ? undefined : { y }} className={className} aria-hidden="true">
      {children}
    </motion.div>
  );
}
