import * as THREE from "three";
import {
  SPINE,
  bodyRadius,
  buildFeatherSpecs,
  createRng,
  featherPoint,
  wingArm,
  type FeatherSpec,
} from "./model";

/** Segments along / across each feather strip. */
const NU = 14;
const NV = 4;

export const bodyCurve = new THREE.CatmullRomCurve3(
  SPINE.map((p) => new THREE.Vector3(...p)),
  false,
  "catmullrom",
  0.5
);

/** One merged geometry holding every feather as a curved, tapered strip. */
export function buildFeatherGeometry() {
  const specs = buildFeatherSpecs();
  const per = (NU + 1) * (NV + 1);
  const pos = new Float32Array(specs.length * per * 3);
  const fuv = new Float32Array(specs.length * per * 2);
  const info = new Float32Array(specs.length * per * 4);
  const index: number[] = [];

  specs.forEach((s, si) => {
    for (let iu = 0; iu <= NU; iu++) {
      for (let iv = 0; iv <= NV; iv++) {
        const u = iu / NU;
        const v = (iv / NV) * 2 - 1;
        const p = featherPoint(s, u, v);
        const k = si * per + iu * (NV + 1) + iv;
        pos.set(p, k * 3);
        fuv[k * 2] = u;
        fuv[k * 2 + 1] = v;
        info[k * 4] = s.side;
        info[k * 4 + 1] = wingArm(p[0], p[1], s.side);
        info[k * 4 + 2] = s.group;
        info[k * 4 + 3] = s.seed;
      }
    }
    for (let iu = 0; iu < NU; iu++) {
      for (let iv = 0; iv < NV; iv++) {
        const a = si * per + iu * (NV + 1) + iv;
        const b = a + 1;
        const c = a + (NV + 1);
        const d = c + 1;
        index.push(a, b, c, b, d, c);
      }
    }
  });

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aFuv", new THREE.BufferAttribute(fuv, 2));
  g.setAttribute("aInfo", new THREE.BufferAttribute(info, 4));
  g.setIndex(index);
  return g;
}

/** Lathe-style body: head, S-curved neck, chest, belly. Offsets stay in the x/z plane. */
export function buildBodyGeometry() {
  const segs = 72;
  const ring = 22;
  const pos: number[] = [];
  const at: number[] = [];
  const index: number[] = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const c = bodyCurve.getPointAt(t);
    const r = bodyRadius(t);
    for (let j = 0; j <= ring; j++) {
      const a = (j / ring) * Math.PI * 2;
      pos.push(c.x + Math.cos(a) * r, c.y, c.z + Math.sin(a) * r * 0.82);
      at.push(t);
    }
  }
  for (let i = 0; i < segs; i++) {
    for (let j = 0; j < ring; j++) {
      const a = i * (ring + 1) + j;
      const b = a + 1;
      const c = a + (ring + 1);
      const d = c + 1;
      index.push(a, c, b, b, c, d);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("aT", new THREE.Float32BufferAttribute(at, 1));
  g.setIndex(index);
  g.computeVertexNormals();
  return g;
}

/** Hooked beak: a tapered tube from the face, pointing left and slightly down. */
export function buildBeakGeometry() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.28, 2.6, 0),
    new THREE.Vector3(-0.58, 2.53, 0),
    new THREE.Vector3(-0.86, 2.4, 0),
    new THREE.Vector3(-1.0, 2.22, 0),
  ]);
  const segs = 28;
  const ring = 14;
  const pos: number[] = [];
  const at: number[] = [];
  const index: number[] = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const c = curve.getPointAt(t);
    const T = curve.getTangentAt(t);
    const n = new THREE.Vector3(-T.y, T.x, 0).normalize();
    const r = 0.14 * Math.pow(1 - t, 0.9) + 0.004;
    for (let j = 0; j <= ring; j++) {
      const a = (j / ring) * Math.PI * 2;
      const ca = Math.cos(a) * r * 0.78;
      pos.push(c.x + n.x * ca, c.y + n.y * ca, c.z + Math.sin(a) * r);
      at.push(t);
    }
  }
  for (let i = 0; i < segs; i++) {
    for (let j = 0; j < ring; j++) {
      const a = i * (ring + 1) + j;
      const b = a + 1;
      const c = a + (ring + 1);
      const d = c + 1;
      index.push(a, c, b, b, c, d);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("aT", new THREE.Float32BufferAttribute(at, 1));
  g.setIndex(index);
  g.computeVertexNormals();
  return g;
}

/** Flat water ribbons that spiral up around the body. */
export function buildRibbonGeometry(i: number) {
  const N = 110;
  const pos: number[] = [];
  const at: number[] = [];
  const side: number[] = [];
  const index: number[] = [];
  const phi0 = i * 2.1;
  const P = (t: number) => {
    const y = -3.1 + t * 5.4;
    const ang = phi0 + t * Math.PI * 2 * 1.35;
    const rad = 0.72 + 0.6 * Math.sin(Math.PI * t) + i * 0.11;
    return new THREE.Vector3(Math.cos(ang) * rad, y, Math.sin(ang) * rad * 0.8);
  };
  for (let k = 0; k < N; k++) {
    const t = k / (N - 1);
    const p = P(t);
    const q = P(Math.min(1, t + 0.01));
    const tan = q.clone().sub(p).normalize();
    const radial = new THREE.Vector3(p.x, 0, p.z).normalize();
    const w = new THREE.Vector3().crossVectors(tan, radial).normalize();
    const half = 0.09 * Math.pow(Math.sin(Math.PI * t), 0.6) + 0.004;
    for (const s of [-1, 1]) {
      pos.push(p.x + w.x * half * s, p.y + w.y * half * s, p.z + w.z * half * s);
      at.push(t);
      side.push(s);
    }
  }
  for (let k = 0; k < N - 1; k++) {
    const a = k * 2;
    index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("aT", new THREE.Float32BufferAttribute(at, 1));
  g.setAttribute("aSide", new THREE.Float32BufferAttribute(side, 1));
  g.setIndex(index);
  return g;
}

/**
 * Water droplets. Each one sits on a feather or the body so it follows the wing motion,
 * and carries random seeds that drive drifting, gathering and dispersal in the shader.
 */
export function buildParticleGeometry(count: number) {
  const specs = buildFeatherSpecs();
  const r = createRng(909);
  const weights = specs.map((s: FeatherSpec) => s.len * s.width);
  const total = weights.reduce((a, b) => a + b, 0);
  const cum: number[] = [];
  weights.reduce((acc, w, i) => (cum[i] = acc + w), 0);

  const pos = new Float32Array(count * 3);
  const info = new Float32Array(count * 4); // side, arm, group, u
  const seed = new Float32Array(count * 4);
  const scatter = new Float32Array(count * 3);
  const bodyShare = 0.16;

  for (let i = 0; i < count; i++) {
    let x: number, y: number, z: number, side = 0, arm = 0, group = 5, u = 0.5;
    if (r() < bodyShare) {
      const t = Math.pow(r(), 0.9);
      const c = bodyCurve.getPointAt(t);
      const a = r() * Math.PI * 2;
      const rad = bodyRadius(t) * (0.55 + 0.45 * r());
      x = c.x + Math.cos(a) * rad;
      y = c.y;
      z = c.z + Math.sin(a) * rad * 0.82;
      u = t * 0.3;
    } else {
      const pick = r() * total;
      let si = cum.findIndex((c) => c >= pick);
      if (si < 0) si = specs.length - 1;
      const s = specs[si];
      u = Math.pow(r(), 0.85);
      const v = (r() < 0.25 ? 0 : (r() * 2 - 1)) * 0.92;
      const p = featherPoint(s, u, v);
      x = p[0];
      y = p[1];
      z = p[2] + (r() - 0.5) * 0.06;
      side = s.side;
      group = s.group;
      arm = wingArm(x, y, side);
    }
    pos.set([x, y, z], i * 3);
    info.set([side, arm, group, u], i * 4);
    seed.set([r(), r(), r(), r()], i * 4);
    // Start from a pool of water below the bird.
    scatter.set([(r() - 0.5) * 11, -3.6 - r() * 1.6, (r() - 0.5) * 4], i * 3);
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aInfo", new THREE.BufferAttribute(info, 4));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 4));
  g.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
  return g;
}
