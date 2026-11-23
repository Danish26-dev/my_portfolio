"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useId } from "react";
import type { VisualKind } from "@/lib/data/projects";

/**
 * Original generative thumbnails. Each is an abstract diagram of the project's
 * core idea, not an illustration. 400x300 viewBox, scales to its container.
 */
export function ProjectVisual({ kind, label }: { kind: VisualKind; label: string }) {
  const reduce = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const loop = (duration: number, delay = 0) =>
    reduce ? {} : { duration, delay, repeat: Infinity, ease: "easeInOut" as const };

  const defs = (
    <defs>
      <linearGradient id={`a${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#F9B318" />
        <stop offset="1" stopColor="#1546D9" />
      </linearGradient>
      <radialGradient id={`b${id}`} cx="50%" cy="50%" r="60%">
        <stop stopColor="#1546D9" stopOpacity="0.10" />
        <stop offset="1" stopColor="#EDECE6" stopOpacity="0" />
      </radialGradient>
    </defs>
  );

  let art: React.ReactNode;

  if (kind === "frab") {
    const agents = [0, 1, 2, 3, 4].map((i) => {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      return { x: 200 + Math.cos(a) * 92, y: 150 + Math.sin(a) * 92 };
    });
    art = (
      <>
        {[40, 70, 100, 130].map((r) => (
          <circle key={r} cx="200" cy="150" r={r} fill="none" stroke="#1546D9" strokeOpacity="0.14" />
        ))}
        {agents.map((n, i) => (
          <line key={i} x1="200" y1="150" x2={n.x} y2={n.y} stroke={`url(#a${id})`} strokeOpacity="0.5" />
        ))}
        <motion.path
          d="M200 150 L200 20 A130 130 0 0 1 292 58 Z"
          fill="#1546D9"
          fillOpacity="0.1"
          style={{ transformOrigin: "200px 150px" }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        />
        {agents.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x}
            cy={n.y}
            r="7"
            fill="#FFFFFF"
            stroke="#F9B318"
            strokeWidth="1.5"
            animate={reduce ? undefined : { scale: [1, 1.35, 1] }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            transition={loop(2.4, i * 0.35)}
          />
        ))}
        <circle cx="200" cy="150" r="14" fill={`url(#a${id})`} />
      </>
    );
  } else if (kind === "inklink") {
    art = (
      <>
        {[0, 1, 2].map((i) => (
          <motion.g
            key={i}
            animate={reduce ? undefined : { y: [0, -6, 0] }}
            transition={loop(3.2, i * 0.4)}
          >
            <path
              d={`M120 ${190 - i * 34} L250 ${160 - i * 34} L310 ${185 - i * 34} L180 ${215 - i * 34} Z`}
              fill="#FFFFFF"
              stroke={`url(#a${id})`}
              strokeOpacity={0.9 - i * 0.2}
            />
            {[0, 1, 2].map((l) => (
              <line
                key={l}
                x1={165 + l * 10}
                y1={192 - i * 34 - l * 8}
                x2={235 + l * 8}
                y2={178 - i * 34 - l * 8}
                stroke="#111827"
                strokeOpacity="0.35"
              />
            ))}
          </motion.g>
        ))}
        {[[70, 90], [330, 80], [340, 220], [60, 230]].map(([x, y], i) => (
          <g key={i}>
            <line x1={x} y1={y} x2="215" y2="150" stroke="#1546D9" strokeOpacity="0.25" strokeDasharray="3 5" />
            <polygon
              points={`${x},${y - 9} ${x + 8},${y - 4.5} ${x + 8},${y + 4.5} ${x},${y + 9} ${x - 8},${y + 4.5} ${x - 8},${y - 4.5}`}
              fill="#FFFFFF"
              stroke="#F9B318"
            />
          </g>
        ))}
      </>
    );
  } else if (kind === "automaton") {
    const bars = Array.from({ length: 27 }, (_, i) => i);
    art = (
      <>
        {bars.map((i) => {
          const base = Math.round(18 + Math.abs(Math.sin(i * 0.55)) * 70 + (i % 3) * 8);
          return (
            <motion.rect
              key={i}
              x={48 + i * 11.5}
              width="6"
              rx="3"
              fill={`url(#a${id})`}
              fillOpacity={0.35 + (base / 110) * 0.6}
              initial={{ y: 150 - base / 2, height: base }}
              animate={
                reduce
                  ? undefined
                  : { y: [150 - base / 2, 150 - base * 0.9, 150 - base / 2], height: [base, base * 1.8, base] }
              }
              transition={loop(1.6 + (i % 5) * 0.2, i * 0.05)}
            />
          );
        })}
        <line x1="40" y1="150" x2="360" y2="150" stroke="#1546D9" strokeOpacity="0.2" />
      </>
    );
  } else if (kind === "identipi") {
    const hex = (cx: number, cy: number, r: number) =>
      Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      }).join(" ");
    const outer = [
      [200, 62], [276, 106], [276, 194], [200, 238], [124, 194], [124, 106],
    ];
    art = (
      <>
        <polygon points={hex(200, 150, 88)} fill="none" stroke="#1546D9" strokeOpacity="0.25" />
        {outer.map(([x, y], i) => (
          <g key={i}>
            <line x1="200" y1="150" x2={x} y2={y} stroke="#F9B318" strokeOpacity="0.3" />
            <motion.polygon
              points={hex(x, y, 15)}
              fill="#FFFFFF"
              stroke="#1546D9"
              style={{ transformOrigin: `${x}px ${y}px` }}
              animate={reduce ? undefined : { scale: [1, 1.18, 1] }}
              transition={loop(3, i * 0.3)}
            />
          </g>
        ))}
        <polygon points={hex(200, 150, 28)} fill={`url(#a${id})`} fillOpacity="0.9" />
        <circle cx="200" cy="146" r="6" fill="#111827" />
        <rect x="197" y="150" width="6" height="14" fill="#111827" />
      </>
    );
  } else {
    // Generic monogram for projects without a bespoke visual yet.
    const letter = label.charAt(0).toUpperCase();
    art = (
      <>
        {[48, 78, 108].map((r, i) => (
          <motion.circle
            key={r}
            cx="200"
            cy="150"
            r={r}
            fill="none"
            stroke="#1546D9"
            strokeOpacity={0.3 - i * 0.07}
            strokeDasharray={i === 1 ? "4 8" : undefined}
            style={{ transformOrigin: "200px 150px" }}
            animate={reduce ? undefined : { rotate: i % 2 ? -360 : 360 }}
            transition={{ duration: 40 + i * 12, repeat: Infinity, ease: "linear" }}
          />
        ))}
        <text
          x="200"
          y="176"
          textAnchor="middle"
          fontSize="76"
          fontWeight="700"
          fill={`url(#a${id})`}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {letter}
        </text>
      </>
    );
  }

  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label={`${label} visual`}>
      {defs}
      <rect width="400" height="300" fill={`url(#b${id})`} />
      {art}
    </svg>
  );
}
