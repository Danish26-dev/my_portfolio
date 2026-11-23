"use client";

import dynamic from "next/dynamic";
import { motion, useInView, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ArrowUp } from "lucide-react";
import { useRef } from "react";
import { SceneBoundary } from "@/components/three/SceneBoundary";
import { HeroBackdrop, PhoenixFallback } from "@/components/three/StaticHero";
import { useCapabilities } from "@/hooks/useCapabilities";
import { usePointer } from "@/hooks/usePointer";
import { useStoryProgress } from "@/hooks/useStoryProgress";

const PhoenixCanvas = dynamic(() => import("@/components/three/PhoenixCanvas"), { ssr: false });

/**
 * Epilogue. The phoenix re-forms from water, opens its wings and disperses back into it
 * while the visitor scrolls: the site ends on evolution rather than on a footer.
 */
export function Outro() {
  const ref = useRef<HTMLElement>(null);
  const progress = useStoryProgress(ref, true);
  const reduce = useReducedMotion();
  const caps = useCapabilities();
  const pointer = usePointer();
  // Only start downloading the 3D chunk when the epilogue is about to be reached.
  const near = useInView(ref, { margin: "600px 0px" });
  const lineOpacity = useTransform(progress, [0.66, 0.88], [0, 1]);
  const lineY = useTransform(progress, [0.66, 0.88], [24, 0]);
  const ready = caps.ready && caps.webgl && near;

  return (
    <section id="outro" ref={ref} aria-label="Epilogue" className="relative h-[190svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <HeroBackdrop sun="50% 40%" />
        {caps.ready && !caps.webgl && (
          <PhoenixFallback className="absolute left-1/2 top-[6%] h-auto w-[min(90vw,640px)] -translate-x-1/2 opacity-60" />
        )}
        {ready && (
          <SceneBoundary fallback={<PhoenixFallback className="absolute left-1/2 top-[6%] h-auto w-[min(90vw,640px)] -translate-x-1/2 opacity-60" />}>
            <PhoenixCanvas mode="outro" progress={progress} pointer={pointer} tier={caps.tier} reduced={caps.reducedMotion} />
          </SceneBoundary>
        )}

        <motion.div
          style={reduce ? undefined : { opacity: lineOpacity, y: lineY }}
          className="absolute inset-x-0 bottom-[11svh] z-10 px-6 text-center"
        >
          <p className="font-display text-[clamp(2.2rem,6vw,4.6rem)] font-semibold uppercase leading-none tracking-tightest text-ink">
            Still <span className="em-serif">building.</span>
          </p>
          <p className="mx-auto mt-4 max-w-sm text-muted">The water moves on, and so does the work. The next build is whatever you bring me.</p>
          <a href="#contact" className="btn-ghost mt-6">
            <ArrowUp size={15} /> Back to contact
          </a>
        </motion.div>
      </div>
    </section>
  );
}
