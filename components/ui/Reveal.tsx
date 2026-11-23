"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { easeOutExpo } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "p";
}

/** Scroll-triggered reveal. Collapses to a plain fade for reduced motion. */
export function Reveal({ children, delay = 0, y = 28, className, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduce ? 0.2 : 0.9, delay, ease: easeOutExpo }}
    >
      {children}
    </MotionTag>
  );
}

/** Masked line-by-line headline reveal. */
export function LineReveal({
  lines,
  className,
  lineClassName,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <span className={className}>
      {lines.map((line, i) => (
        // The observed wrapper never moves, so in-view detection isn't hidden by the mask.
        <motion.span
          key={i}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className={`block overflow-hidden pb-[0.08em] ${lineClassName ?? ""}`}
        >
          <motion.span
            className="block"
            variants={{
              hidden: { y: reduce ? 0 : "110%", opacity: reduce ? 0 : 1 },
              show: {
                y: 0,
                opacity: 1,
                transition: { duration: reduce ? 0.2 : 1, delay: i * 0.1, ease: easeOutExpo },
              },
            }}
          >
            {line}
          </motion.span>
        </motion.span>
      ))}
    </span>
  );
}
