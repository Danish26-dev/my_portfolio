"use client";

import dynamic from "next/dynamic";
import type { MotionValue } from "framer-motion";
import { useCapabilities } from "@/hooks/useCapabilities";
import { usePointer } from "@/hooks/usePointer";
import { SceneBoundary } from "./SceneBoundary";
import { HeroBackdrop, PhoenixFallback } from "./StaticHero";

// Heavy 3D code is split out of the initial bundle and never runs on the server.
const PhoenixCanvas = dynamic(() => import("./PhoenixCanvas"), {
  ssr: false,
  loading: () => <Fallback />,
});

function Fallback() {
  return (
    <PhoenixFallback className="absolute right-[-4%] top-[8%] h-auto w-[min(62vw,700px)] opacity-70 max-lg:left-1/2 max-lg:right-auto max-lg:top-[8%] max-lg:w-[min(86vw,420px)] max-lg:-translate-x-1/2 max-lg:opacity-60" />
  );
}

export function HeroBackground({ progress }: { progress: MotionValue<number> }) {
  const caps = useCapabilities();
  const pointer = usePointer();
  const canRender3D = caps.ready && caps.webgl;

  return (
    <div className="absolute inset-0 z-0 bg-paper">
      <HeroBackdrop />
      {caps.ready && !caps.webgl && <Fallback />}
      {canRender3D && (
        <SceneBoundary fallback={<Fallback />}>
          <PhoenixCanvas mode="hero" progress={progress} pointer={pointer} tier={caps.tier} reduced={caps.reducedMotion} />
        </SceneBoundary>
      )}
    </div>
  );
}
