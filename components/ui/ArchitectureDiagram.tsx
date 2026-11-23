"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMemo, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { pathState } from "@/lib/utils";
import type { DiagramEdge, DiagramNode } from "@/lib/data/projects";

const KIND_STYLE: Record<NonNullable<DiagramNode["kind"]>, { stroke: string; fill: string }> = {
  core: { stroke: "#1546D9", fill: "rgba(21,70,217,0.16)" },
  agent: { stroke: "#1546D9", fill: "rgba(21,70,217,0.06)" },
  service: { stroke: "#D99A0B", fill: "rgba(249,179,24,0.18)" },
  io: { stroke: "#111827", fill: "rgba(17,24,39,0.05)" },
};

function wrap(label: string, max: number) {
  const words = label.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

/**
 * Interactive, responsive SVG architecture diagram.
 * Desktop uses the node grid as authored; mobile transposes it (cols <-> rows)
 * so text stays readable without horizontal scrolling.
 */
export function ArchitectureDiagram({
  nodes,
  edges,
  note,
}: {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  note: string;
}) {
  const wide = useMediaQuery("(min-width: 700px)", true);
  const reduce = useReducedMotion();
  const [selectedId, setSelectedId] = useState(nodes[0].id);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const layout = useMemo(() => {
    const cols = Math.max(...nodes.map((n) => n.col)) + 1;
    const rows = Math.max(...nodes.map((n) => n.row)) + 1;
    const W = wide ? 900 : 360;
    const cw = wide ? W / cols : W / rows;
    const ch = wide ? 120 : 100;
    const H = wide ? rows * ch + 20 : cols * ch + 20;
    const nw = wide ? Math.min(cw - 40, 170) : cw - 14;
    const nh = wide ? 62 : 64;
    const pos = new Map<string, { x: number; y: number }>();
    nodes.forEach((n) => {
      const c = wide ? n.col : n.row;
      const r = wide ? n.row : n.col;
      pos.set(n.id, { x: c * cw + cw / 2, y: r * ch + ch / 2 + 10 });
    });
    return { W, H, nw, nh, pos, chars: wide ? 18 : 12, font: wide ? 14 : 12.5 };
  }, [nodes, wide]);

  const selected = nodes.find((n) => n.id === selectedId) ?? nodes[0];
  const focus = hoverId ?? selectedId;
  const connected = (e: DiagramEdge) => e.from === focus || e.to === focus;

  return (
    <div>
      <div className="glass relative overflow-hidden p-2 sm:p-4">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <svg
          viewBox={`0 0 ${layout.W} ${layout.H}`}
          className="relative h-auto w-full"
          role="group"
          aria-label="System architecture diagram. Select a component to read its description."
        >
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="#1546D9" />
            </marker>
          </defs>

          {edges.map((e, i) => {
            const a = layout.pos.get(e.from)!;
            const b = layout.pos.get(e.to)!;
            const active = connected(e);
            // shorten the line so the arrowhead lands on the node edge
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const len = Math.hypot(dx, dy) || 1;
            const hx = layout.nw / 2 + 4;
            const hy = layout.nh / 2 + 4;
            const t = Math.min(hx / (Math.abs(dx / len) || 1e-6), hy / (Math.abs(dy / len) || 1e-6));
            const x2 = b.x - (dx / len) * t;
            const y2 = b.y - (dy / len) * t;
            const x1 = a.x + (dx / len) * t;
            const y1 = a.y + (dy / len) * t;
            return (
              <g key={i}>
                <motion.line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#1546D9"
                  strokeOpacity={active ? 0.9 : 0.25}
                  strokeWidth={active ? 1.6 : 1}
                  className={active ? "flow-line" : undefined}
                  markerEnd="url(#arrow)"
                  initial={pathState(reduce ? 1 : 0)}
                  whileInView={pathState(1)}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.07 }}
                />
                {e.label && wide && (
                  <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2 - 7}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#111827"
                    style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}
                  >
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}

          {nodes.map((n, i) => {
            const p = layout.pos.get(n.id)!;
            const s = KIND_STYLE[n.kind ?? "agent"];
            const isSel = n.id === selectedId;
            const lines = wrap(n.label, layout.chars);
            const lh = layout.font + 2;
            return (
              <motion.g
                key={n.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSel}
                aria-label={n.label}
                data-cursor
                style={{ cursor: "pointer", outline: "none" }}
                onClick={() => setSelectedId(n.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedId(n.id);
                  }
                }}
                onMouseEnter={() => setHoverId(n.id)}
                onMouseLeave={() => setHoverId(null)}
                onFocus={() => setHoverId(n.id)}
                onBlur={() => setHoverId(null)}
                initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
              >
                <rect
                  x={p.x - layout.nw / 2}
                  y={p.y - layout.nh / 2}
                  width={layout.nw}
                  height={layout.nh}
                  fill="#FFFFFF"
                  stroke={s.stroke}
                  strokeWidth={isSel || hoverId === n.id ? 2 : 1}
                />
                <rect
                  x={p.x - layout.nw / 2}
                  y={p.y - layout.nh / 2}
                  width={layout.nw}
                  height={layout.nh}
                  fill={s.fill}
                />
                {isSel && (
                  <rect
                    x={p.x - layout.nw / 2 - 4}
                    y={p.y - layout.nh / 2 - 4}
                    width={layout.nw + 8}
                    height={layout.nh + 8}
                    fill="none"
                    stroke={s.stroke}
                    strokeOpacity="0.4"
                    strokeDasharray="4 4"
                  />
                )}
                <text
                  x={p.x}
                  y={p.y - ((lines.length - 1) * lh) / 2 + layout.font * 0.35}
                  textAnchor="middle"
                  fontSize={layout.font}
                  fontWeight={600}
                  fill="#111827"
                  style={{ fontFamily: "var(--font-body)", pointerEvents: "none" }}
                >
                  {lines.map((l, k) => (
                    <tspan key={k} x={p.x} dy={k === 0 ? 0 : lh}>
                      {l}
                    </tspan>
                  ))}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 border hairline p-5 sm:p-6" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="eyebrow">{selected.label}</p>
            <p className="mt-2 max-w-2xl leading-relaxed text-ink/85">{selected.detail}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">{note}</p>
    </div>
  );
}
