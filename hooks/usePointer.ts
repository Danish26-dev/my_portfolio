"use client";

import { useEffect, useRef } from "react";

export interface PointerState {
  /** normalised -1..1, y up */
  x: number;
  y: number;
}

/** Window-level pointer tracking that doesn't depend on canvas events. */
export function usePointer() {
  const ref = useRef<PointerState>({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ref.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return ref;
}
