"use client";

import dynamic from "next/dynamic";
import { useCapabilities } from "@/hooks/useCapabilities";
import { usePointer } from "@/hooks/usePointer";
import { SceneBoundary } from "./SceneBoundary";
import { HeroBackdrop, StaticArt } from "./StaticHero";

// Heavy 3D code is split out of the initial bundle and never runs on the server.
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <StaticArt />,
});

export function HeroBackground() {
  const caps = useCapabilities();
  const pointer = usePointer();
  const canRender3D = caps.ready && caps.webgl;

  return (
    <div className="absolute inset-0 z-0 bg-paper">
      <HeroBackdrop />
      {!canRender3D && caps.ready && <StaticArt />}
      {canRender3D && (
        // On phones the object sits behind the copy, so it is toned down to keep text crisp.
        <div className="absolute inset-0 max-md:opacity-60">
          <SceneBoundary fallback={<StaticArt />}>
            <HeroScene pointer={pointer} tier={caps.tier} reduced={caps.reducedMotion} />
          </SceneBoundary>
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper" />
    </div>
  );
}
