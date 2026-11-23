export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

/**
 * Typed escape hatch for animating SVG `pathLength`. The current @types/react +
 * framer-motion combination rejects numeric pathLength on motion.path/line even
 * though it works at runtime.
 */
export const pathState = (pathLength: number, extra: Record<string, number> = {}) =>
  ({ pathLength, ...extra }) as never;
