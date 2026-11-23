"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Link from "next/link";
import { ArrowUpRight, Camera, FileBadge, ImageIcon } from "lucide-react";
import { useId, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { achievements, podiumCount, type Achievement } from "@/lib/data/achievements";
import { cn, easeOutExpo } from "@/lib/utils";

const tiers = {
  gold: { a: "#FFF1B8", b: "#D9A93A", c: "#7A5A12", glow: "rgba(255,200,80,0.35)" },
  silver: { a: "#FFFFFF", b: "#B6C6D6", c: "#5B6E80", glow: "rgba(190,215,240,0.35)" },
  bronze: { a: "#FFD7B0", b: "#C98150", c: "#6B3A1B", glow: "rgba(220,140,90,0.35)" },
  finalist: { a: "#DCE6FF", b: "#4C74F0", c: "#1546D9", glow: "rgba(21,70,217,0.35)" },
} as const;

function Medal({ a }: { a: Achievement }) {
  const t = tiers[a.tier];
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto aspect-square w-48 sm:w-56" style={{ filter: `drop-shadow(0 0 40px ${t.glow})` }}>
      <svg viewBox="0 0 200 220" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={`m${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor={t.a} />
            <stop offset="0.5" stopColor={t.b} />
            <stop offset="1" stopColor={t.c} />
          </linearGradient>
          <linearGradient id={`r${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#1546D9" />
            <stop offset="1" stopColor="#0F34A8" />
          </linearGradient>
          <clipPath id={`c${id}`}>
            <circle cx="100" cy="125" r="62" />
          </clipPath>
        </defs>
        <path d="M62 8 L100 78 L88 90 L46 14 Z" fill={`url(#r${id})`} />
        <path d="M138 8 L100 78 L112 90 L154 14 Z" fill={`url(#r${id})`} opacity="0.85" />
        <circle cx="100" cy="125" r="68" fill={`url(#m${id})`} />
        <circle cx="100" cy="125" r="56" fill="#111827" fillOpacity="0.96" />
        <circle cx="100" cy="125" r="56" fill="none" stroke={t.a} strokeOpacity="0.6" />
        <g clipPath={`url(#c${id})`}>
          <motion.rect
            x="-40"
            y="40"
            width="40"
            height="170"
            fill="white"
            opacity="0.18"
            transform="rotate(20 100 125)"
            animate={reduce ? { x: 100 } : { x: [-40, 240] }}
            transition={{ duration: 3.4, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
          />
        </g>
        <text
          x="100"
          y={a.placement.length > 4 ? 132 : 140}
          textAnchor="middle"
          fontSize={a.placement.length > 4 ? 26 : 44}
          fontWeight="700"
          fill={t.a}
          style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" }}
        >
          {a.placement}
        </text>
      </svg>
    </div>
  );
}

function Slot({ icon, label, src, hint }: { icon: React.ReactNode; label: string; src?: string; hint: string }) {
  return (
    <div className="flex items-center gap-3 border border-dashed border-muted/40 p-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center bg-ink/5 text-muted">{icon}</span>
      <div className="min-w-0">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">{label}</p>
        {src ? (
          <a href={src} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline-offset-4 hover:underline">
            View
          </a>
        ) : (
          <p className="truncate text-xs text-muted">{hint}</p>
        )}
      </div>
    </div>
  );
}

export function Achievements() {
  const [active, setActive] = useState(0);
  const a = achievements[active];
  const t = tiers[a.tier];
  const reduce = useReducedMotion();

  return (
    <section id="achievements" aria-labelledby="ach-title" className="section overflow-hidden bg-gradient-to-b from-transparent via-paper2/60 to-transparent">
      <div className="container-page">
        <SectionHeading
          index="04"
          eyebrow="Recognition"
          lines={["Built under pressure.", "Recognized by the *results.*"]}
          id="ach-title"
        >
          Five hackathon results across 2025 and 2026. Select one to see the event, the project behind it and the prize.
        </SectionHeading>

        <Reveal>
          <dl className="mb-14 grid max-w-2xl grid-cols-3 border-y hairline">
            {[
              { n: achievements.length, l: "Recognitions" },
              { n: podiumCount, l: "Podium finishes" },
              {
                n: new Set(achievements.filter((x) => x.tier !== "finalist").map((x) => x.project)).size,
                l: "Awarded projects",
              },
            ].map((s) => (
              <div key={s.l} className="flex flex-col-reverse border-r hairline px-4 py-5 last:border-r-0 sm:px-6">
                <dt className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{s.l}</dt>
                <dd className="font-display text-4xl font-semibold text-primary sm:text-5xl">
                  <Counter to={s.n} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* selector */}
          <div
            role="tablist"
            aria-label="Achievements"
            aria-orientation="vertical"
            className="no-scrollbar -mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 lg:col-span-5 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {achievements.map((item, i) => (
              <button
                key={item.id}
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={i === active}
                aria-controls="ach-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "ArrowRight") setActive((i + 1) % achievements.length);
                  if (e.key === "ArrowUp" || e.key === "ArrowLeft") setActive((i - 1 + achievements.length) % achievements.length);
                }}
                className={cn(
                  "group relative flex min-w-[240px] items-start gap-4 border border-transparent px-4 py-4 text-left transition-colors lg:min-w-0 lg:border-x-0 lg:border-t-0 lg:border-b-ink/10 lg:py-5",
                  i === active ? "bg-primary/[0.06]" : "hover:bg-ink/[0.03]"
                )}
              >
                {i === active && (
                  <motion.span layoutId="ach-bar" className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-primary to-accent" />
                )}
                <span className={cn("font-mono text-xs", i === active ? "text-primary" : "text-muted")}>{item.index}</span>
                <span>
                  <span className={cn("block font-display text-lg font-semibold uppercase leading-tight tracking-tight sm:text-xl", i === active ? "text-ink" : "text-ink/70")}>
                    {item.event}
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    {item.title}
                    {item.prize ? ` · ${item.prize}` : ""}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* display */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={a.id}
                role="tabpanel"
                id="ach-panel"
                aria-labelledby={`tab-${a.id}`}
                initial={{ opacity: 0, y: reduce ? 0 : 24, rotateX: reduce ? 0 : 6 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -16 }}
                transition={{ duration: 0.6, ease: easeOutExpo }}
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
                className="has-sheen glass noise relative overflow-hidden p-6 sm:p-10"
                style={{ boxShadow: `0 40px 120px -60px ${t.glow}` }}
              >
                <div className="sheen" />
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full blur-3xl"
                  style={{ background: t.glow, opacity: 0.35 }}
                />
                <div className="relative grid items-center gap-8 sm:grid-cols-[auto_1fr]">
                  <Medal a={a} />
                  <div>
                    <p className="eyebrow">{a.index} / 0{achievements.length}</p>
                    <h3 className="mt-3 font-display text-3xl font-semibold uppercase leading-[1.02] tracking-tight sm:text-[2.35rem]">
                      {a.event}
                    </h3>
                    <p className="mt-3 text-lg font-medium text-ink/85">{a.title}</p>
                    <dl className="mt-6 grid grid-cols-2 gap-4 border-t hairline pt-5">
                      <div>
                        <dt className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">Project</dt>
                        <dd className="mt-1">
                          <Link href={`/projects/${a.projectSlug}`} className="inline-flex items-center gap-1 text-primary hover:underline">
                            {a.project} <ArrowUpRight size={14} />
                          </Link>
                        </dd>
                      </div>
                      {a.prize && (
                        <div>
                          <dt className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">Prize</dt>
                          <dd className="mt-1 font-display text-2xl font-semibold" style={{ color: t.c }}>
                            {a.prize}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>

                <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
                  <Slot
                    icon={<ImageIcon size={18} />}
                    label="Event logo"
                    src={a.logo}
                    hint="Official logo goes in public/logos"
                  />
                  <Slot
                    icon={<FileBadge size={18} />}
                    label="Certificate"
                    src={a.certificate}
                    hint="Certificate goes in public/certificates"
                  />
                  <Slot
                    icon={<Camera size={18} />}
                    label="Photograph"
                    src={a.photo}
                    hint="Event photo goes in public/photos"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
