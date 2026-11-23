"use client";

import { useEffect, useState } from "react";

export interface Capabilities {
  ready: boolean;
  webgl: boolean;
  /** "low" = phones / constrained devices. Reduces particles, DPR and effects. */
  tier: "low" | "high";
  reducedMotion: boolean;
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** One-time device capability probe. Runs on the client after mount. */
export function useCapabilities(): Capabilities {
  const [caps, setCaps] = useState<Capabilities>({
    ready: false,
    webgl: false,
    tier: "low",
    reducedMotion: false,
  });

  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const small = window.matchMedia("(max-width: 820px)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const weak =
      (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setCaps({
      ready: true,
      webgl: hasWebGL(),
      tier: small || coarse || weak ? "low" : "high",
      reducedMotion,
    });
  }, []);

  return caps;
}
