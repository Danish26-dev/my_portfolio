"use client";

import dynamic from "next/dynamic";
import type { MotionValue } from "framer-motion";
import { useCapabilities } from "@/hooks/useCapabilities";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePointer } from "@/hooks/usePointer";
import { SceneBoundary } from "./SceneBoundary";
import { PhoenixFallback } from "./StaticHero";

// Heavy 3D code is split out of the initial bundle and never runs on the server.
const PhoenixCanvas = dynamic(() => import("./PhoenixCanvas"), {
  ssr: false,
  loading: () => <Fallback />,
});

function Fallback() {
  return (
    <PhoenixFallback className="absolute right-[-4%] top-[8%] h-auto w-[min(62vw,700px)] opacity-70 max-lg:inset-x-0 max-lg:right-auto max-lg:mx-auto max-lg:top-0 max-lg:h-full max-lg:w-auto max-lg:opacity-80" />
  );
}

/**
 * The 3D phoenix. It fills whatever box it is placed in: the whole pinned hero on desktop,
 * and a dedicated stage above the copy on phones and tablets (where it also flies).
 */
export function HeroBackground({ progress }: { progress: MotionValue<number> }) {
  const caps = useCapabilities();
  const pointer = usePointer();
  const stage = useMediaQuery("(max-width: 1023px)");
  const canRender3D = caps.ready && caps.webgl;

  return (
    <div className="absolute inset-0 z-0">
      {caps.ready && !caps.webgl && <Fallback />}
      {canRender3D && (
        <SceneBoundary fallback={<Fallback />}>
          <PhoenixCanvas
            mode="hero"
            progress={progress}
            pointer={pointer}
            tier={caps.tier}
            reduced={caps.reducedMotion}
            stage={stage}
          />
        </SceneBoundary>
      )}
    </div>
  );
}