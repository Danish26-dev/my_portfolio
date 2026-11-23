"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/ui/Reveal";
import { pathState } from "@/lib/utils";
import { hobbies } from "@/lib/data/profile";
import { BlockLabel } from "./BlockLabel";

/** A planted tank: swaying stems, a little hardscape, bubbles. Water-blue, like the rest of the site. */
function Aquascape() {
  const reduce = useReducedMotion();
  const stems = Array.from({ length: 17 }, (_, i) => ({
    x: 40 + i * 20,
    h: 52 + ((i * 29) % 78),
    gold: i % 6 === 2,
    d: 3 + (i % 4) * 0.7,
  }));
  return (
    <svg viewBox="0 0 400 230" className="h-auto w-full" role="img" aria-label="Illustration of a planted aquarium">
      <defs>
        <linearGradient id="tank" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#1546D9" stopOpacity="0.06" />
          <stop offset="1" stopColor="#1546D9" stopOpacity="0.28" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="380" height="210" rx="6" fill="url(#tank)" stroke="#111827" strokeOpacity="0.5" />
      <path d="M10 206h380v14a6 6 0 0 1-6 0H16a6 6 0 0 1-6 0z" fill="#111827" fillOpacity="0.2" />
      <path d="M10 196c60-6 120 4 190-2s130 4 190 0v26H10z" fill="#E2E1D8" />
      {/* hardscape */}
      <path d="M232 198l24-42 22 12 18-28 20 40 8 18z" fill="#111827" fillOpacity="0.78" />
      <path d="M66 198l18-26 22 8 12-14 16 32z" fill="#111827" fillOpacity="0.62" />
      {stems.map((s, i) => (
        <motion.path
          key={i}
          d={`M${s.x} 198 C${s.x - 7} ${198 - s.h * 0.4} ${s.x + 8} ${198 - s.h * 0.7} ${s.x + 2} ${198 - s.h}`}
          fill="none"
          stroke={s.gold ? "#F9B318" : "#1546D9"}
          strokeOpacity={s.gold ? 0.95 : 0.7}
          strokeWidth="2.4"
          strokeLinecap="round"
          style={{ originX: 0.5, originY: 1 }}
          animate={reduce ? undefined : { rotate: [-3.5, 3.5, -3.5] }}
          transition={{ duration: s.d + 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
        />
      ))}
      {!reduce &&
        [90, 150, 214, 290, 340].map((x, i) => (
          <motion.circle
            key={x}
            cx={x}
            r={2 + (i % 3)}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            initial={{ cy: 190, opacity: 0 }}
            animate={{ cy: [190, 24], opacity: [0, 0.9, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: i * 1.3, ease: "easeIn" }}
          />
        ))}
    </svg>
  );
}

/** A knight's route across the board: the L-shaped move is the whole idea of the game in one line. */
function Board() {
  const reduce = useReducedMotion();
  const sq = 28;
  const c = (col: number, row: number) => [col * sq + sq / 2 + 8, row * sq + sq / 2 + 8] as const;
  const route = [c(1, 7), c(2, 5), c(4, 4), c(5, 2), c(7, 1)];
  const d = route.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join("");
  return (
    <svg viewBox="0 0 240 240" className="mx-auto h-auto w-full max-w-[260px]" role="img" aria-label="Chessboard with a knight's route">
      {Array.from({ length: 64 }, (_, i) => {
        const col = i % 8;
        const row = Math.floor(i / 8);
        return <rect key={i} x={col * sq + 8} y={row * sq + 8} width={sq} height={sq} fill={(col + row) % 2 ? "#1546D9" : "#FFFFFF"} fillOpacity={(col + row) % 2 ? 0.78 : 0.7} />;
      })}
      <rect x="8" y="8" width={sq * 8} height={sq * 8} fill="none" stroke="#111827" strokeOpacity="0.6" />
      <motion.path
        d={d}
        fill="none"
        stroke="#F9B318"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={pathState(reduce ? 1 : 0)}
        whileInView={pathState(1)}
        viewport={{ once: true }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
      />
      {route.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 0 ? 6 : 4} fill={i === route.length - 1 ? "#F9B318" : "#111827"} stroke="#FFFFFF" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

export function InterestsBlock() {
  return (
    <div id="beyond" className="scroll-mt-28">
      <BlockLabel n="D" title="Away from the keyboard" note="Two hobbies that train the same habits as the work: patience with systems, and thinking a few moves ahead." />
      <div className="grid gap-5 md:grid-cols-5">
        <Reveal className="md:col-span-3">
          <article className="glass h-full p-6 sm:p-9">
            <Aquascape />
            <h4 className="mt-6 font-display text-3xl font-semibold uppercase tracking-tight sm:text-4xl">{hobbies[0].title}</h4>
            <p className="mt-3 max-w-md text-ink/85">{hobbies[0].body}</p>
          </article>
        </Reveal>
        <Reveal delay={0.12} className="md:col-span-2">
          <article className="glass h-full p-6 sm:p-9">
            <Board />
            <h4 className="mt-6 font-display text-3xl font-semibold uppercase tracking-tight sm:text-4xl">{hobbies[1].title}</h4>
            <p className="mt-3 text-ink/85">{hobbies[1].body}</p>
          </article>
        </Reveal>
      </div>
    </div>
  );
}
