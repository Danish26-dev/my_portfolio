"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { projects } from "@/lib/data/projects";
import { skillCategories } from "@/lib/data/skills";
import { cn, easeOutExpo, pathState } from "@/lib/utils";

export function Expertise() {
  const [catId, setCatId] = useState(skillCategories[0].id);
  const [skillId, setSkillId] = useState<string | null>(null);
  const wide = useMediaQuery("(min-width: 768px)");
  const reduce = useReducedMotion();

  const cat = skillCategories.find((c) => c.id === catId)!;
  const selected = cat.skills.find((s) => s.id === skillId) ?? null;
  const usedBy = useMemo(
    () => (selected ? projects.filter((p) => p.featured && p.skills.includes(selected.id)) : []),
    [selected]
  );

  const n = cat.skills.length;
  const pts = cat.skills.map((_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: 50 + Math.cos(a) * 37, y: 50 + Math.sin(a) * 37 };
  });

  return (
    <section id="expertise" aria-labelledby="exp-title" className="section">
      <div className="container-page">
        <SectionHeading
          index="05"
          eyebrow="The technologies I work with"
          lines={["My tools are different.", "The engineering *mindset* is the same."]}
          id="exp-title"
        >
          Pick a category, then a technology, to see which featured projects use it. There are no percentages or star
          ratings here, only where each tool has actually shipped.
        </SectionHeading>

        <div className="grid gap-10 lg:grid-cols-12">
          <div role="tablist" aria-label="Skill categories" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 lg:col-span-4 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
            {skillCategories.map((c, i) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={c.id === catId}
                onClick={() => {
                  setCatId(c.id);
                  setSkillId(null);
                }}
                className={cn(
                  "relative shrink-0 border-b hairline px-4 py-4 text-left transition-colors lg:py-5",
                  c.id === catId ? "text-ink" : "text-muted hover:text-ink"
                )}
              >
                {c.id === catId && (
                  <motion.span layoutId="cat-bar" className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-primary to-accent" />
                )}
                <span className="font-mono text-[11px] text-primary">0{i + 1}</span>
                <span className="mt-1 block whitespace-nowrap font-display text-lg font-semibold uppercase tracking-tight lg:whitespace-normal lg:text-xl">
                  {c.label}
                </span>
                <span className="mt-1 hidden text-sm text-muted lg:block">{c.blurb}</span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8">
            <div className="glass relative overflow-hidden p-4 sm:p-8">
              <div className="bg-grid absolute inset-0 opacity-50" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  role="tabpanel"
                  className="relative"
                >
                  {wide ? (
                    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
                      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
                        <circle cx="50" cy="50" r="37" fill="none" stroke="#1546D9" strokeOpacity="0.2" strokeDasharray="0.6 1.4" />
                        {pts.map((p, i) => (
                          <motion.line
                            key={cat.skills[i].id}
                            x1="50"
                            y1="50"
                            x2={p.x}
                            y2={p.y}
                            stroke={cat.skills[i].id === skillId ? "#F9B318" : "#1546D9"}
                            strokeOpacity={cat.skills[i].id === skillId ? 1 : 0.3}
                            strokeWidth="0.25"
                            initial={pathState(0)}
                            animate={pathState(1)}
                            transition={{ duration: 0.8, delay: i * 0.05 }}
                          />
                        ))}
                      </svg>
                      <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-primary/30 bg-paper/80 p-3 text-center font-mono text-[9.5px] uppercase leading-tight tracking-[0.12em] text-primary sm:h-28 sm:w-28">
                        {cat.label}
                      </div>
                      {cat.skills.map((s, i) => (
                        <motion.button
                          key={s.id}
                          type="button"
                          aria-pressed={s.id === skillId}
                          onClick={() => setSkillId(s.id === skillId ? null : s.id)}
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1, y: reduce ? 0 : [0, -5, 0] }}
                          transition={{
                            opacity: { delay: 0.1 + i * 0.05 },
                            scale: { delay: 0.1 + i * 0.05, ease: easeOutExpo, duration: 0.6 },
                            y: { duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.3, ease: "easeInOut" },
                          }}
                          className={cn(
                            "absolute max-w-[9.5rem] -translate-x-1/2 -translate-y-1/2 border px-3 py-2 text-center text-[13px] leading-tight backdrop-blur-sm transition-colors",
                            s.id === skillId
                              ? "border-accent bg-accent/15 text-ink"
                              : "border-primary/25 bg-paper/80 text-ink/85 hover:border-primary hover:text-ink"
                          )}
                          style={{ left: `${pts[i].x}%`, top: `${pts[i].y}%` }}
                        >
                          {s.name}
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <ul className="flex flex-wrap gap-2.5">
                      {cat.skills.map((s) => (
                        <li key={s.id}>
                          <button
                            type="button"
                            aria-pressed={s.id === skillId}
                            onClick={() => setSkillId(s.id === skillId ? null : s.id)}
                            className={cn(
                              "border px-3.5 py-2.5 text-sm transition-colors",
                              s.id === skillId
                                ? "border-accent bg-accent/15 text-ink"
                                : "border-primary/25 bg-paper/60 text-ink/85"
                            )}
                          >
                            {s.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4 min-h-[110px] border hairline p-5 sm:p-6" aria-live="polite">
              {selected ? (
                <>
                  <p className="eyebrow">{selected.name}</p>
                  {usedBy.length ? (
                    <>
                      <p className="mt-3 text-sm text-muted">Used in:</p>
                      <ul className="mt-3 flex flex-wrap gap-3">
                        {usedBy.map((p) => (
                          <li key={p.slug}>
                            <Link
                              href={p.caseStudy ? `/projects/${p.slug}` : "/#projects"}
                              className="inline-flex items-center gap-1.5 border border-primary/40 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-primary transition-colors hover:bg-primary/10"
                            >
                              {p.name} <ArrowUpRight size={13} />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="mt-3 text-sm text-muted">
                      Part of the day-to-day toolkit, but not tied to one of the four featured case studies.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted">Select a technology to see where it has been used.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
