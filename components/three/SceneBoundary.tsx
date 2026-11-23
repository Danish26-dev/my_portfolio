"use client";

import { Component, type ReactNode } from "react";

/** Falls back to a static visual if the WebGL scene throws (context loss, driver bugs). */
export class SceneBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") console.warn("3D scene disabled:", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
