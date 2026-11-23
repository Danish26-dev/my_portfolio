"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";

const chapters = [
  { id: "home", n: "01", label: "Introduction" },
  { id: "about", n: "02", label: "The engineer" },
  { id: "projects", n: "03", label: "Built & shipped" },
  { id: "achievements", n: "04", label: "Recognition" },
  { id: "expertise", n: "05", label: "Technologies" },
  { id: "research", n: "06", label: "Beyond the projects" },
  { id: "contact", n: "07", label: "Next build" },
];
const watch = [...chapters.map((c) => c.id), "outro"];

/** Fixed chapter index with a scroll-progress spine. Wide screens only. */
export function ChapterRail() {
  const raw = useActiveSection(watch);
  const active = raw === "outro" ? "contact" : raw;
  const activeIdx = Math.max(0, chapters.findIndex((c) => c.id === active));
  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.3 });

  return (
    <nav aria-label="Story chapters" className="pointer-events-none fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 min-[1400px]:block">
      <div className="relative">
        <span className="absolute bottom-2 right-[5px] top-2 w-px bg-ink/15" />
        <motion.span
          className="absolute right-[5px] top-2 w-px origin-top bg-primary"
          style={{ scaleY: fill, bottom: 8 }}
        />
        <ol className="pointer-events-auto relative space-y-[18px]">
          {chapters.map((c, i) => {
            const on = i === activeIdx;
            return (
              <li key={c.id}>
                <a href={`#${c.id}`} className="group flex items-center justify-end gap-3" aria-current={on ? "true" : undefined}>
                  <span
                    className={cn(
                      "font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-500",
                      "translate-x-2 text-primary opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                    )}
                  >
                    {c.n} · {c.label}
                  </span>
                  <span
                    className={cn(
                      "block h-[11px] w-[11px] rotate-45 border transition-all duration-500",
                      on ? "scale-125 border-accent bg-accent" : i < activeIdx ? "border-primary bg-primary" : "border-ink/30 bg-paper"
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
