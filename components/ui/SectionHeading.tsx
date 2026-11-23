"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useRef, type ReactNode } from "react";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";

/**
 * Chapter opener: a parallax outlined numeral, a chapter label, and a character-split headline.
 * Headline markup: *serif italic cobalt*   _cobalt_
 */
export function SectionHeading({
  index,
  eyebrow,
  lines,
  children,
  id,
}: {
  index: string;
  eyebrow: string;
  lines: string[];
  children?: ReactNode;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const numY = useTransform(scrollYProgress, [0, 1], [70, -90]);

  return (
    <header ref={ref} className="relative mb-14 sm:mb-20">
      <motion.span
        aria-hidden="true"
        style={reduce ? undefined : { y: numY }}
        className="text-outline pointer-events-none absolute -top-8 right-0 hidden select-none font-display text-[clamp(8rem,19vw,17rem)] font-semibold leading-none opacity-40 md:block"
      >
        {index}
      </motion.span>
      <Reveal>
        <p className="eyebrow flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-muted">Chapter {index}</span>
          <span className="h-px w-10 bg-primary/50" />
          {eyebrow}
        </p>
      </Reveal>
      <SplitText as="h2" lines={lines} className="h-section relative mt-6 block max-w-5xl" />
      {id && <span id={id} className="sr-only" />}
      {children && (
        <Reveal delay={0.2} className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
          {children}
        </Reveal>
      )}
    </header>
  );
}
