"use client";

import dynamic from "next/dynamic";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useCapabilities } from "@/hooks/useCapabilities";
import { SceneBoundary } from "./SceneBoundary";

const BeyondScene = dynamic(() => import("./BeyondScene"), { ssr: false });

/** Below-the-fold scene: the chunk is only requested when the section nears the viewport. */
export function LazyBeyondScene() {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: "400px 0px" });
  const caps = useCapabilities();

  return (
    <div ref={ref} className="absolute inset-0">
      {near && caps.ready && caps.webgl && (
        <SceneBoundary fallback={null}>
          <BeyondScene reduced={caps.reducedMotion} low={caps.tier === "low"} />
        </SceneBoundary>
      )}
    </div>
  );
}
