"use client";

import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Fragment, type ElementType } from "react";
import { easeOutExpo } from "@/lib/utils";

/**
 * Character-level headline reveal.
 * Markup inside a line:  *serif italic cobalt*   _cobalt_
 * Words never break mid-word; every character is masked by its line.
 */
type Seg = { text: string; kind: "plain" | "serif" | "blue" };

function parse(line: string): Seg[] {
  const out: Seg[] = [];
  const re = /(\*[^*]+\*|_[^_]+_)/g;
  let last = 0;
  for (const m of line.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ text: line.slice(last, i), kind: "plain" });
    const tok = m[0];
    out.push({ text: tok.slice(1, -1), kind: tok[0] === "*" ? "serif" : "blue" });
    last = i + tok.length;
  }
  if (last < line.length) out.push({ text: line.slice(last), kind: "plain" });
  return out;
}

export const plainText = (lines: string[]) => lines.map((l) => l.replace(/[*_]/g, "")).join(" ");

interface Props {
  lines: string[];
  className?: string;
  /** Pass a boolean to drive the animation from the parent (hero). Omit to play when scrolled into view. */
  play?: boolean;
  delay?: number;
  stagger?: number;
  as?: ElementType;
}

export function SplitText({ lines, className, play, delay = 0, stagger = 0.02, as: Tag = "span" }: Props) {
  const reduce = useReducedMotion();
  let n = 0;

  const char: Variants = {
    hidden: { y: reduce ? 0 : "118%", rotate: reduce ? 0 : 5, opacity: reduce ? 0 : 1 },
    show: (i: number) => ({
      y: 0,
      rotate: 0,
      opacity: 1,
      transition: { duration: reduce ? 0.25 : 0.95, delay: reduce ? 0 : delay + i * stagger, ease: easeOutExpo },
    }),
  };

  const trigger =
    play === undefined
      ? { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-70px" } }
      : { initial: "hidden", animate: play ? "show" : "hidden" };

  return (
    <Tag className={className}>
      <span className="sr-only">{plainText(lines)}</span>
      <motion.span aria-hidden="true" className="block" {...trigger}>
        {lines.map((line, li) => (
          <span key={li} className="block overflow-hidden pb-[0.12em] pt-[0.02em]">
            {parse(line).map((seg, si) => {
              const cls = seg.kind === "serif" ? "em-serif" : seg.kind === "blue" ? "em-blue" : "";
              const words = seg.text.split(/(\s+)/);
              return (
                <span key={si} className={cls}>
                  {words.map((w, wi) =>
                    /^\s+$/.test(w) || w === "" ? (
                      <Fragment key={wi}>{w === "" ? "" : " "}</Fragment>
                    ) : (
                      <span key={wi} className="inline-block whitespace-nowrap">
                        {Array.from(w).map((c, ci) => (
                          <motion.span key={ci} custom={n++} variants={char} className="inline-block will-change-transform">
                            {c}
                          </motion.span>
                        ))}
                      </span>
                    )
                  )}
                </span>
              );
            })}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
