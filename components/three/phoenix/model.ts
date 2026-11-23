/**
 * Procedural water-phoenix model (pure TypeScript, no three.js).
 * Shared by the WebGL scene and the static SVG fallback, so both show the same bird.
 *
 * Local space: x right, y up, z toward the viewer. The bird faces left (beak at -x).
 *   crest top ~ y +3.5   | wing tips ~ x +-3.8   | tail streams down to ~ y -3.9
 */

export interface FeatherSpec {
  root: [number, number, number];
  /** direction of the feather's axis, radians (0 = +x, PI/2 = +y) */
  ang: number;
  len: number;
  width: number;
  /** lateral bend controls as a fraction of length (S-curve) */
  c1: number;
  c2: number;
  /** -1 left wing, +1 right wing, 0 = not attached to a wing (tail, crest) */
  side: number;
  /** 0 primary, 1 secondary, 2 covert, 3 tail, 4 crest */
  group: number;
  seed: number;
}

export const SHOULDER_X = 0.3;
export const SHOULDER_Y = 0.95;
/** distance used to normalise "how far along the wing" a point is */
export const REACH = 4.3;

const deg = (d: number) => (d * Math.PI) / 180;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createRng(seed: number) {
  return rng(seed);
}

let cache: FeatherSpec[] | null = null;

export function buildFeatherSpecs(): FeatherSpec[] {
  if (cache) return cache;
  const r = rng(2026);
  const out: FeatherSpec[] = [];

  /** Adds a right-wing feather and its mirror image on the left. */
  const wing = (s: Omit<FeatherSpec, "seed" | "side">) => {
    out.push({ ...s, side: 1, seed: r() });
    out.push({
      ...s,
      root: [-s.root[0], s.root[1], s.root[2]],
      ang: Math.PI - s.ang,
      c1: -s.c1,
      c2: -s.c2,
      side: -1,
      seed: r(),
    });
  };

  const S = [SHOULDER_X, SHOULDER_Y];
  const W = [1.25, 1.7]; // wrist

  // Leading-edge coverts: small feathers along the arm, pointing up and out.
  for (let k = 0; k < 6; k++) {
    const t = k / 5;
    wing({
      root: [lerp(S[0], W[0], 0.12 + 0.82 * t), lerp(S[1], W[1], 0.12 + 0.82 * t) + 0.03, 0.14],
      ang: deg(lerp(56, 68, t)),
      len: lerp(0.7, 0.95, t),
      width: 0.26,
      c1: 0.04,
      c2: 0.1,
      group: 2,
    });
  }

  // Primaries: the long fan that defines the wing outline.
  const nP = 11;
  const prim: { root: [number, number, number]; ang: number; len: number }[] = [];
  for (let k = 0; k < nP; k++) {
    const t = k / (nP - 1);
    const ang = deg(lerp(64, -30, t));
    const len = 2.9 - 1.2 * Math.pow(Math.abs(t - 0.3) / 0.7, 1.1);
    const root: [number, number, number] = [W[0] - 0.33 * t, W[1] - 0.45 * t, t * 0.012];
    prim.push({ root, ang, len });
    wing({ root, ang, len, width: 0.52 - 0.12 * t, c1: -0.04, c2: 0.1 - 0.04 * t, group: 0 });
  }

  // Secondaries: shorter feathers hanging from the forearm toward the body.
  const nS = 9;
  const sec: { root: [number, number, number]; ang: number }[] = [];
  for (let k = 0; k < nS; k++) {
    const t = k / (nS - 1);
    const f = 0.08 + 0.84 * t;
    const root: [number, number, number] = [lerp(W[0], S[0], f), lerp(W[1], S[1], f), 0.04];
    const ang = deg(lerp(-22, -82, t));
    sec.push({ root, ang });
    wing({ root, ang, len: lerp(2.1, 1.15, t), width: 0.48, c1: 0.02, c2: -0.05, group: 1 });
  }

  // Covert rows overlap the bases of the long feathers.
  prim.forEach((p, k) => {
    if (k % 1 !== 0) return;
    const d = [Math.cos(p.ang), Math.sin(p.ang)];
    wing({
      root: [p.root[0] + d[0] * 0.34, p.root[1] + d[1] * 0.34, 0.12],
      ang: p.ang - 0.02,
      len: 0.55 + 0.32 * (p.len / 2.9),
      width: 0.34,
      c1: -0.03,
      c2: 0.08,
      group: 2,
    });
  });
  sec.forEach((p, k) => {
    if (k % 2 === 1) return;
    const d = [Math.cos(p.ang), Math.sin(p.ang)];
    wing({
      root: [p.root[0] + d[0] * 0.28, p.root[1] + d[1] * 0.28, 0.1],
      ang: p.ang,
      len: 0.8,
      width: 0.3,
      c1: 0.02,
      c2: -0.04,
      group: 2,
    });
  });

  // Tail: seven flowing plumes plus two thin water streamers.
  for (let k = -3; k <= 3; k++) {
    out.push({
      root: [k * 0.035, -0.8, -0.05],
      ang: deg(-90 + k * 10),
      len: 3.0 - 0.34 * Math.abs(k),
      width: 0.4,
      c1: k * 0.018,
      c2: Math.sin(k * 1.7) * 0.12,
      side: 0,
      group: 3,
      seed: r(),
    });
  }
  [-1, 1].forEach((s) =>
    out.push({
      root: [s * 0.03, -0.8, -0.08],
      ang: deg(-90 + s * 7),
      len: 3.5,
      width: 0.16,
      c1: s * 0.05,
      c2: -s * 0.2,
      side: 0,
      group: 3,
      seed: r(),
    })
  );

  // Crest: plumes sweeping back from the head.
  [35, 52, 68, 85].forEach((a, i) =>
    out.push({
      root: [0.02, 2.8, 0.02 * i],
      ang: deg(a),
      len: [0.95, 1.15, 1.0, 0.8][i],
      width: 0.17,
      c1: 0.08,
      c2: 0.16,
      side: 0,
      group: 4,
      seed: r(),
    })
  );

  cache = out;
  return out;
}

/** Lancet profile: pointed at the root and the tip, fullest about 40% along. */
export function featherProfile(u: number) {
  return Math.pow(Math.sin(Math.PI * Math.pow(Math.min(Math.max(u, 0), 1), 0.72)), 0.75) * (1 - 0.15 * u);
}

/** Position on a feather. u: 0 root -> 1 tip. v: -1 -> +1 across the vane. */
export function featherPoint(s: FeatherSpec, u: number, v: number): [number, number, number] {
  const dx = Math.cos(s.ang);
  const dy = Math.sin(s.ang);
  const px = -dy;
  const py = dx;
  const L = s.len;
  const a1 = L * 0.33;
  const a2 = L * 0.66;
  const a3 = L;
  const b1 = s.c1 * L;
  const b2 = s.c2 * L;
  const b3 = s.c2 * L * 0.6;
  const mt = 1 - u;
  const A = 3 * mt * mt * u * a1 + 3 * mt * u * u * a2 + u * u * u * a3;
  const B = 3 * mt * mt * u * b1 + 3 * mt * u * u * b2 + u * u * u * b3;
  const dA = 3 * mt * mt * a1 + 6 * mt * u * (a2 - a1) + 3 * u * u * (a3 - a2);
  const dB = 3 * mt * mt * b1 + 6 * mt * u * (b2 - b1) + 3 * u * u * (b3 - b2);
  const tl = Math.hypot(dA, dB) || 1;
  const nA = -dB / tl;
  const nB = dA / tl;
  const prof = featherProfile(u);
  const hw = 0.5 * s.width * prof * v;
  const fa = A + nA * hw;
  const fb = B + nB * hw;
  return [
    s.root[0] + dx * fa + px * fb,
    s.root[1] + dy * fa + py * fb,
    s.root[2] + (1 - v * v) * 0.1 * s.width * prof - u * 0.02,
  ];
}

export function wingArm(x: number, y: number, side: number) {
  if (side === 0) return 0;
  return Math.min(1, Math.max(0, Math.hypot(x - SHOULDER_X * side, y - SHOULDER_Y) / REACH));
}

/** Body spine, head (top) to tail root (bottom). */
export const SPINE: [number, number, number][] = [
  [-0.05, 2.9, 0],
  [-0.1, 2.55, 0],
  [0.1, 2.15, 0.02],
  [0.08, 1.7, 0],
  [-0.02, 1.2, 0],
  [0, 0.5, 0],
  [0, -0.3, 0],
  [0, -0.85, 0],
];

/** Lightweight spine sample (no three.js) for the SVG fallback. */
export function spinePoint(t: number): [number, number] {
  const n = SPINE.length - 1;
  const f = Math.min(Math.max(t, 0), 1) * n;
  const i = Math.min(n - 1, Math.floor(f));
  const k = f - i;
  const e = k * k * (3 - 2 * k);
  return [lerp(SPINE[i][0], SPINE[i + 1][0], e), lerp(SPINE[i][1], SPINE[i + 1][1], e)];
}

/** [t along the spine, radius] */
const RADII: [number, number][] = [
  [0, 0.03],
  [0.05, 0.2],
  [0.11, 0.31],
  [0.17, 0.22],
  [0.28, 0.17],
  [0.4, 0.28],
  [0.55, 0.5],
  [0.75, 0.44],
  [0.92, 0.2],
  [1, 0.05],
];

export function bodyRadius(t: number) {
  for (let i = 0; i < RADII.length - 1; i++) {
    const [t0, r0] = RADII[i];
    const [t1, r1] = RADII[i + 1];
    if (t <= t1) {
      const x = (t - t0) / (t1 - t0);
      const e = x * x * (3 - 2 * x);
      return lerp(r0, r1, e);
    }
  }
  return RADII[RADII.length - 1][1];
}

/** Closed outline of a feather, used by the SVG fallback. */
export function featherOutline(s: FeatherSpec, steps = 10): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const p = featherPoint(s, i / steps, -1);
    pts.push([p[0], p[1]]);
  }
  for (let i = steps; i >= 0; i--) {
    const p = featherPoint(s, i / steps, 1);
    pts.push([p[0], p[1]]);
  }
  return pts;
}
