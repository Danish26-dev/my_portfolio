/**
 * Procedural phoenix model (pure TypeScript, no three.js).
 * Shared by the WebGL scene and the static SVG fallback, so both show the same bird.
 *
 * Local space: x right, y up, z toward the viewer. The bird looks left.
 *   crest top ~ y +4.4 | wing tips ~ x +-5.1 | tail streams down to ~ y -4.7
 *
 * Anatomy, back to front:
 *   wings   primaries -> secondaries -> tertials -> greater / median / lesser coverts -> leading edge
 *   tail    nine plumes + two streamers + short coverts
 *   body    one lofted form: beak, head, long S-curved neck, chest, belly (a single surface, no seams)
 *   plumage shingled contour feathers over the neck and chest
 *   crest   six long plumes sweeping back from the crown
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
  /** -1 left wing, +1 right wing, 0 = not attached to a wing */
  side: number;
  /** 0 primary, 1 secondary/tertial, 2 covert, 3 tail, 4 crest, 5 body plumage */
  group: number;
  seed: number;
  /** 0 = deepest layer ... 1 = outermost layer: drives tonal separation between rows */
  tone: number;
  /** 0 pointed, 1 blunt, 2 rounded */
  shape: number;
  /** 0 drawn behind the body, 1 in front of it */
  pass: number;
}

export const SHOULDER_X = 0.28;
export const SHOULDER_Y = 1.15;
/** distance used to normalise "how far along the wing" a point is */
export const REACH = 5.7;

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

/* ---------------------------------- body ---------------------------------- */

/** Beak tip -> head -> neck -> chest -> tail root. The beak is the first segment of the same loft. */
export const SPINE: [number, number, number][] = [
  [-1.02, 2.84, 0],
  [-0.72, 2.98, 0],
  [-0.42, 3.08, 0],
  [-0.14, 3.0, 0],
  [0.06, 2.68, 0.01],
  [0.2, 2.15, 0.02],
  [0.16, 1.6, 0.01],
  [0.04, 1.0, 0],
  [0, 0.2, 0],
  [0, -0.55, 0],
  [0, -1.05, 0],
];

/** In-plane radius at each spine point: needle beak, small refined head, slender neck, full chest. */
const POINT_R = [0.012, 0.055, 0.12, 0.185, 0.13, 0.125, 0.18, 0.31, 0.4, 0.2, 0.05];

const CUM: number[] = [0];
for (let i = 1; i < SPINE.length; i++) {
  CUM.push(CUM[i - 1] + Math.hypot(SPINE[i][0] - SPINE[i - 1][0], SPINE[i][1] - SPINE[i - 1][1]));
}
const TOTAL = CUM[CUM.length - 1];

function seg(t: number) {
  const d = Math.min(Math.max(t, 0), 1) * TOTAL;
  let i = 0;
  while (i < CUM.length - 2 && d > CUM[i + 1]) i++;
  const k = (d - CUM[i]) / (CUM[i + 1] - CUM[i]);
  return { i, k };
}

export function bodyRadius(t: number) {
  const { i, k } = seg(t);
  const e = k * k * (3 - 2 * k);
  return lerp(POINT_R[i], POINT_R[i + 1], e);
}

/** Lightweight spine sample (no three.js) for the SVG fallback and plumage placement. */
export function spinePoint(t: number): [number, number] {
  const { i, k } = seg(t);
  return [lerp(SPINE[i][0], SPINE[i + 1][0], k), lerp(SPINE[i][1], SPINE[i + 1][1], k)];
}

/** Centre line x and radius of the neck/chest at a given height. */
function bodyAtY(y: number): { x: number; r: number } {
  for (let i = 3; i < SPINE.length - 1; i++) {
    const y0 = SPINE[i][1];
    const y1 = SPINE[i + 1][1];
    if (y <= y0 && y >= y1) {
      const k = (y0 - y) / (y0 - y1);
      const e = k * k * (3 - 2 * k);
      return { x: lerp(SPINE[i][0], SPINE[i + 1][0], k), r: lerp(POINT_R[i], POINT_R[i + 1], e) };
    }
  }
  return { x: 0, r: 0.1 };
}

/* --------------------------------- feathers -------------------------------- */

let cache: FeatherSpec[] | null = null;

export function buildFeatherSpecs(): FeatherSpec[] {
  if (cache) return cache;
  const r = rng(2026);
  const list: FeatherSpec[] = [];
  type Draft = Omit<FeatherSpec, "seed" | "side" | "pass" | "group"> & { group: number; pass?: number };

  /** Adds a right-wing feather and its mirror image on the left. */
  const wing = (s: Draft) => {
    list.push({ ...s, side: 1, seed: r(), pass: s.pass ?? 0 });
    list.push({
      ...s,
      root: [-s.root[0], s.root[1], s.root[2]],
      ang: Math.PI - s.ang,
      c1: -s.c1,
      c2: -s.c2,
      side: -1,
      seed: r(),
      pass: s.pass ?? 0,
    });
  };
  const free = (s: Draft) => list.push({ ...s, side: 0, seed: r(), pass: s.pass ?? 0 });

  const S: [number, number] = [SHOULDER_X, SHOULDER_Y];
  const W: [number, number] = [1.55, 1.95]; // wrist

  /* ---- primaries: the long fan that defines the wing outline ---- */
  const primLens = [2.55, 2.9, 3.25, 3.55, 3.75, 3.85, 3.8, 3.65, 3.4, 3.1, 2.75, 2.35];
  const prim = primLens.map((len, k) => {
    const t = k / (primLens.length - 1);
    const ang = deg(lerp(64, -22, t));
    const root: [number, number, number] = [W[0] - 0.45 * t, W[1] - 0.55 * t, t * 0.01];
    return { len, ang, root, t, width: 0.66 - 0.1 * t };
  });
  prim.forEach((p) =>
    wing({ root: p.root, ang: p.ang, len: p.len, width: p.width, c1: -0.03, c2: 0.12 - 0.05 * p.t, group: 0, tone: 0.14 + 0.1 * p.t, shape: 1 })
  );

  /* ---- secondaries: along the forearm, hanging toward the body ---- */
  const nS = 10;
  const sec = Array.from({ length: nS }, (_, k) => {
    const t = k / (nS - 1);
    const f = 0.05 + 0.88 * t;
    return {
      t,
      root: [lerp(W[0], S[0], f), lerp(W[1], S[1], f), 0.03 + t * 0.005] as [number, number, number],
      ang: deg(lerp(-8, -84, t)),
      len: lerp(2.9, 1.55, t),
    };
  });
  sec.forEach((s) =>
    wing({ root: s.root, ang: s.ang, len: s.len, width: 0.64, c1: 0.0, c2: 0.05, group: 1, tone: 0.28 + 0.1 * s.t, shape: 1 })
  );

  /* ---- tertials: long feathers at the shoulder that fall along the flank ---- */
  for (let i = 0; i < 4; i++) {
    wing({
      root: [S[0] - 0.04 + 0.08 * i, S[1] - 0.1 - 0.12 * i, 0.04],
      ang: deg(-98 - 6 * i),
      len: 2.7 - 0.15 * i,
      width: 0.55,
      c1: 0.0,
      c2: 0.04,
      group: 1,
      tone: 0.42,
      shape: 1,
    });
  }

  /* ---- coverts: three overlapping rows that grade from long to small ---- */
  prim.forEach((p) => {
    const d = [Math.cos(p.ang), Math.sin(p.ang)];
    wing({ root: [p.root[0] + d[0] * 0.5, p.root[1] + d[1] * 0.5, 0.1], ang: p.ang, len: 1.15 + 0.4 * (p.len / 3.85), width: p.width * 0.78, c1: -0.02, c2: 0.08, group: 2, tone: 0.55, shape: 2 });
  });
  sec.forEach((s) => {
    const d = [Math.cos(s.ang), Math.sin(s.ang)];
    wing({ root: [s.root[0] + d[0] * 0.4, s.root[1] + d[1] * 0.4, 0.1], ang: s.ang, len: 1.0, width: 0.5, c1: 0.0, c2: 0.04, group: 2, tone: 0.6, shape: 2 });
  });
  prim.forEach((p) => {
    const d = [Math.cos(p.ang), Math.sin(p.ang)];
    wing({ root: [p.root[0] + d[0] * 1.05, p.root[1] + d[1] * 1.05, 0.16], ang: p.ang, len: 0.85, width: p.width * 0.62, c1: 0.0, c2: 0.06, group: 2, tone: 0.72, shape: 2 });
  });
  sec.forEach((s) => {
    const d = [Math.cos(s.ang), Math.sin(s.ang)];
    wing({ root: [s.root[0] + d[0] * 0.75, s.root[1] + d[1] * 0.75, 0.16], ang: s.ang, len: 0.7, width: 0.38, c1: 0.0, c2: 0.03, group: 2, tone: 0.76, shape: 2 });
  });
  prim.forEach((p, k) => {
    if (k > 9) return;
    const d = [Math.cos(p.ang), Math.sin(p.ang)];
    wing({ root: [p.root[0] + d[0] * 1.55, p.root[1] + d[1] * 1.55, 0.22], ang: p.ang, len: 0.55, width: 0.3, c1: 0.0, c2: 0.04, group: 2, tone: 0.88, shape: 2 });
  });

  /* ---- leading edge: small rounded feathers along the arm ---- */
  for (let k = 0; k < 8; k++) {
    const t = k / 7;
    wing({
      root: [lerp(S[0], W[0], 0.1 + 0.85 * t), lerp(S[1], W[1], 0.1 + 0.85 * t) + 0.04, 0.26],
      ang: deg(lerp(52, 68, t)),
      len: lerp(0.8, 1.0, t),
      width: 0.3,
      c1: 0.03,
      c2: 0.08,
      group: 2,
      tone: 0.9,
      shape: 2,
    });
  }

  /* ---- tail: nine plumes (centre drawn last) and two long streamers ---- */
  const order = [-4, 4, -3, 3, -2, 2, -1, 1, 0];
  order.forEach((k) => {
    free({
      root: [k * 0.03, -1.0, -0.06 + 0.002 * (4 - Math.abs(k))],
      ang: deg(-90 + k * 7.5),
      len: 3.3 - 0.22 * Math.abs(k),
      width: 0.5 - 0.016 * Math.abs(k),
      c1: k * 0.012,
      c2: Math.sin(k * 1.4 + 0.5) * 0.1,
      group: 3,
      tone: 0.2 + 0.04 * (4 - Math.abs(k)),
      shape: 0,
    });
  });
  [-1, 1].forEach((s) =>
    free({ root: [s * 0.03, -1.0, -0.1], ang: deg(-90 + s * 5), len: 3.8, width: 0.15, c1: s * 0.05, c2: -s * 0.22, group: 3, tone: 0.3, shape: 0 })
  );
  [-2, -1, 0, 1, 2].forEach((k) =>
    free({ root: [k * 0.08, -0.85, 0.0], ang: deg(-90 + k * 14), len: 1.25, width: 0.46, c1: 0, c2: 0.03 * k, group: 3, tone: 0.55, shape: 2 })
  );

  /* ---- plumage: shingled contour feathers over the neck and chest (front pass) ---- */
  let row = 0;
  for (let y = 0.0; y <= 2.5; y += 0.14) {
    const { x, r: rad } = bodyAtY(y);
    const len = 0.3 + 1.0 * rad;
    const width = 0.14 + 0.5 * rad;
    const stag = row++ % 2 === 0 ? [-0.55, 0, 0.55] : [-0.28, 0.28];
    stag.forEach((o) =>
      free({
        root: [x + o * rad, y, 0.3 + y * 0.01],
        ang: deg(-90 + o * 14),
        len,
        width,
        c1: 0,
        c2: -o * 0.05,
        group: 5,
        tone: 0.62 + 0.3 * (y / 2.5),
        shape: 2,
        pass: 1,
      })
    );
  }

  /* ---- crest: six long plumes streaming back from the crown (front pass) ---- */
  [
    [48, 1.9],
    [60, 2.2],
    [72, 2.1],
    [84, 1.8],
    [96, 1.4],
    [108, 1.0],
  ].forEach(([a, len], i) =>
    free({
      root: [-0.1 + i * 0.025, 3.04, 0.32 + i * 0.01],
      ang: deg(a),
      len,
      width: 0.27 - i * 0.012,
      c1: 0.05,
      c2: -0.24,
      group: 4,
      tone: 0.7 + i * 0.04,
      shape: 1,
      pass: 1,
    })
  );

  cache = list;
  return list;
}

/** Feather outline profile. 0 pointed lancet, 1 blunt, 2 rounded. */
export function featherProfile(u: number, shape = 0) {
  const x = Math.min(Math.max(u, 0), 1);
  const a = shape === 0 ? 0.72 : shape === 1 ? 0.62 : 0.52;
  const b = shape === 0 ? 0.75 : shape === 1 ? 0.6 : 0.45;
  return Math.pow(Math.sin(Math.PI * Math.pow(x, a)), b) * (1 - 0.12 * x);
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
  const prof = featherProfile(u, s.shape);
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
