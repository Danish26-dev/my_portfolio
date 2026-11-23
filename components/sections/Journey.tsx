"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { journey } from "@/lib/data/profile";
import { cn, easeOutExpo } from "@/lib/utils";

/** Vertical timeline whose spine fills as the section scrolls into view. */
export function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="mt-28">
      <p className="eyebrow">Development journey</p>
      <div ref={ref} className="relative mt-10">
        <div className="absolute bottom-0 left-[7px] top-0 w-px bg-ink/10 md:left-1/2" />
        <motion.div
          className="absolute left-[7px] top-0 w-px bg-gradient-to-b from-primary to-accent md:left-1/2"
          style={{ height: reduce ? "100%" : fill }}
        />
        <ol className="space-y-12">
          {journey.map((e, i) => {
            const right = i % 2 === 1;
            return (
              <motion.li
                key={e.title}
                initial={{ opacity: 0, y: reduce ? 0 : 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, ease: easeOutExpo }}
                className="relative grid gap-3 pl-9 md:grid-cols-2 md:gap-16 md:pl-0"
              >
                <span
                  className={cn(
                    "absolute left-0 top-1.5 h-[15px] w-[15px] rotate-45 border md:left-1/2 md:-ml-[7px]",
                    e.kind === "pending"
                      ? "border-dashed border-muted bg-paper"
                      : "border-primary bg-paper"
                  )}
                />
                <div className={cn(right ? "md:order-2 md:text-left" : "md:text-right")}>
                  <p className={cn("font-mono text-[12px] uppercase tracking-[0.2em]", e.kind === "pending" ? "text-muted/75" : "text-primary")}>
                    {e.when}
                  </p>
                </div>
                <div className={cn(right ? "md:order-1 md:text-right" : "")}>
                  <h3 className="font-display text-xl font-semibold uppercase leading-tight tracking-tight">
                    {e.title}
                  </h3>
                  <p className="mt-2 text-muted/75">{e.body}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
