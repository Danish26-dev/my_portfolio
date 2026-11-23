/**
 * GLSL for the phoenix. The bird is strictly monochrome cobalt: every colour below is a tint
 * or shade of #1546D9. Alpha blending only (additive glow vanishes on a warm-beige page).
 * The one non-blue colour in this file, GOLD, belongs to the waterline, not the bird.
 */

const common = /* glsl */ `
uniform float uTime;
uniform float uSpread;   // 0 raised -> 1 wings swept open and down
uniform float uBeat;     // wingbeat speed, rad/s
uniform float uFlap;     // flap strength
uniform float uForm;     // 0 scattered droplets -> 1 formed bird
uniform float uDisperse; // 0 intact -> 1 dissolved into falling water
uniform float uOpacity;
uniform vec2  uPointer;  // pointer in the bird's local space
uniform float uPointerOn;

mat2 rot2(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }

vec3 wingXf(vec3 p, float side, float arm){
  if (abs(side) < 0.5) return p;
  vec2 S = vec2(0.28 * side, 1.15);
  float ph = uTime * uBeat;
  float flap = sin(ph) * uFlap;
  float a = side * (flap * (0.04 + 0.20 * arm) - uSpread * (0.10 + 0.66 * arm));
  p.xy = S + rot2(a) * (p.xy - S);
  // the tips lag behind the shoulder, like a wave travelling outward
  p.y += sin(ph - arm * 2.6) * 0.12 * arm * uFlap;
  p.z += cos(ph - arm * 2.2) * 0.30 * arm * uFlap;
  p.x += side * uSpread * 0.45 * arm;
  return p;
}

vec3 flowXf(vec3 p, float group, float u, float seed){
  if (group > 2.5 && group < 4.5) {
    float k = group < 3.5 ? 0.34 : 0.22;
    p.x += sin(uTime * 0.8 + u * 3.2 + seed * 6.2831) * k * u * u;
    p.z += cos(uTime * 0.7 + u * 2.6 + seed * 6.2831) * 0.14 * u;
  }
  return p;
}
`;

const palette = /* glsl */ `
const vec3 DEEP   = vec3(0.030, 0.125, 0.520);
const vec3 COBALT = vec3(0.082, 0.275, 0.851);
const vec3 LIGHT  = vec3(0.380, 0.580, 1.000);
const vec3 PALE   = vec3(0.740, 0.830, 1.000);
`;

/* ------------------------------ feathers ------------------------------ */

export const featherVertex = /* glsl */ `
${common}
attribute vec2 aFuv;
attribute vec4 aInfo; // side, arm, group, seed
attribute float aTone;
varying vec2 vFuv;
varying vec4 vInfo;
varying float vTone;
void main(){
  vec3 p = wingXf(position, aInfo.x, aInfo.y);
  p = flowXf(p, aInfo.z, aFuv.x, aInfo.w);
  vFuv = aFuv;
  vInfo = aInfo;
  vTone = aTone;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

export const featherFragment = /* glsl */ `
precision highp float;
${common}
${palette}
varying vec2 vFuv;
varying vec4 vInfo;
varying float vTone;
void main(){
  float u = vFuv.x;
  float v = vFuv.y;
  float av = abs(v);
  float seed = vInfo.w;
  float tone = vTone;

  // grows outward from the root while the bird forms; tips dissolve first when it disperses
  float reveal = smoothstep(0.0, 0.3, uForm * 1.6 - u * 0.75 - seed * 0.3);
  float keep = smoothstep(0.0, 0.25, (1.0 - u) + 0.3 - uDisperse * 1.5 + seed * 0.1);

  // vane edge, finely serrated toward the tip like separating barbs
  float serr = sin(u * 90.0 + seed * 20.0) * 0.045 * smoothstep(0.25, 0.95, u);
  float edge = 1.0 - smoothstep(0.84 + serr, 1.0, av);
  float rootFade = smoothstep(0.0, 0.07, u);       // roots tuck under the row above

  float barbs = 0.5 + 0.5 * sin(u * 105.0 - av * 22.0 + seed * 6.0);
  float rachis = smoothstep(0.07, 0.0, av) * smoothstep(0.02, 0.2, u);
  float rim = smoothstep(0.80, 0.99, av);

  vec3 col = mix(DEEP, COBALT, smoothstep(0.0, 0.5, u));
  col = mix(col, LIGHT, smoothstep(0.5, 1.0, u) * 0.62);
  col = mix(col, LIGHT, tone * 0.38);              // outer rows read lighter
  col = mix(col, DEEP, (1.0 - tone) * 0.22);       // deeper rows read darker
  col *= 0.95 + 0.10 * barbs;
  col += (1.0 - av) * 0.05;                        // gentle volume across the vane
  col = mix(col, PALE, rachis * 0.6);
  col = mix(col, DEEP, rim * 0.5);                 // a fine contour separates the layers
  float sh = pow(0.5 + 0.5 * sin(u * 9.0 - uTime * 1.1 + seed * 6.2831), 6.0);
  col = mix(col, PALE, sh * 0.22 * smoothstep(0.2, 0.9, u));

  float a = edge * rootFade * (0.88 + 0.08 * rachis);
  a *= mix(1.0, 0.72, smoothstep(0.88, 1.0, u));   // tips feather out
  a *= reveal * keep * uOpacity;
  gl_FragColor = vec4(col, a);
}
`;

/* ------------------- body: beak, head, neck, chest, belly ------------------- */

export const bodyVertex = /* glsl */ `
attribute float aT;
attribute float aA;
varying vec3 vN;
varying float vT;
varying float vA;
void main(){
  vN = normalize(normalMatrix * normal);
  vT = aT;
  vA = aA;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const bodyFragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uForm;
uniform float uDisperse;
uniform float uOpacity;
${palette}
varying vec3 vN;
varying float vT;
varying float vA;
void main(){
  vec3 n = normalize(vN);
  float fres = pow(1.0 - abs(n.z), 2.0);

  // overlapping scale-feather texture, staggered row by row
  float rr = vT * 90.0;
  float ri = floor(rr);
  vec2 f = vec2(fract(vA * 18.0 + mod(ri, 2.0) * 0.5), fract(rr));
  float d = length((f - vec2(0.5, 0.30)) * vec2(1.0, 1.35));
  float sc = smoothstep(0.62, 0.30, d);
  float lip = smoothstep(0.55, 1.0, f.y);

  vec3 col = mix(COBALT, DEEP, 0.45 * (1.0 - fres));
  col = mix(col, LIGHT, fres * 0.5);
  col *= 0.90 + 0.18 * sc - 0.10 * lip;
  float sun = pow(max(dot(n, normalize(vec3(-0.5, 0.65, 0.6))), 0.0), 8.0);
  col = mix(col, PALE, sun * 0.55);
  float flow = 0.5 + 0.5 * sin(vT * 40.0 - uTime * 1.4 + n.x * 3.0);
  col = mix(col, LIGHT, flow * 0.10);
  col = mix(col, LIGHT, smoothstep(0.26, 0.04, vT) * 0.28);   // head and beak a touch lighter

  float reveal = smoothstep(0.0, 0.3, uForm * 1.5 - abs(vT - 0.45) * 0.6);
  float keep = 1.0 - smoothstep(0.5, 1.0, uDisperse * 1.25);
  float a = (0.90 + 0.08 * fres) * reveal * keep * uOpacity;
  gl_FragColor = vec4(col, a);
}
`;

/* --------------------------------- ribbons -------------------------------- */

export const ribbonVertex = /* glsl */ `
attribute float aT;
attribute float aSide;
varying float vT;
varying float vS;
void main(){
  vT = aT;
  vS = aSide;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const ribbonFragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uForm;
uniform float uDisperse;
uniform float uOpacity;
${palette}
varying float vT;
varying float vS;
void main(){
  float f = fract(vT * 5.0 - uTime * 0.30);
  float band = smoothstep(0.0, 0.1, f) * smoothstep(0.55, 0.2, f);
  vec3 col = mix(COBALT, LIGHT, band);
  float reveal = smoothstep(0.35, 0.9, uForm * 1.3 - vT * 0.2);
  float keep = 1.0 - smoothstep(0.2, 0.8, uDisperse * 1.2);
  float a = (0.05 + 0.26 * band) * smoothstep(1.0, 0.25, abs(vS)) * reveal * keep * uOpacity;
  gl_FragColor = vec4(col, a);
}
`;

/* -------------------------------- particles -------------------------------- */

export const particleVertex = /* glsl */ `
${common}
uniform float uSize;
uniform float uPixelRatio;
attribute vec4 aInfo; // side, arm, group, u
attribute vec4 aSeed;
attribute vec3 aScatter;
varying float vA;
varying vec3 vCol;
void main(){
  float u = aInfo.w;
  vec3 p = wingXf(position, aInfo.x, aInfo.y);
  p = flowXf(p, aInfo.z, u, aSeed.x);

  // ambient droplets (28%) drift slowly off the feather tips
  float amb = step(aSeed.y, 0.28);
  float life = fract(uTime * (0.05 + aSeed.z * 0.06) + aSeed.w);
  vec3 dir = normalize(vec3(sin(aSeed.x * 40.0) * 0.7 + 0.15, -0.30 - aSeed.z * 0.8, cos(aSeed.y * 33.0) * 0.6));
  p += dir * (life * life) * (0.6 + aSeed.z * 1.1) * amb;

  // gather: streams arc up from the pool and settle onto the bird
  float e = clamp(uForm * 1.45 - u * 0.35 - aSeed.x * 0.35, 0.0, 1.0);
  e = e * e * (3.0 - 2.0 * e);
  vec3 q = mix(aScatter, p, e);
  float arc = sin(e * 3.14159);
  q.x += arc * sin(aSeed.x * 6.2831) * 1.6;
  q.z += arc * cos(aSeed.y * 6.2831) * 0.8;
  p = q;

  // disperse: the bird turns back into water and streams downward
  float dd = pow(uDisperse, 1.2);
  p += vec3(0.4 + aSeed.z * 1.2, -3.4 - aSeed.x * 4.4, (aSeed.y - 0.5) * 2.0) * dd * (0.6 + aSeed.w);
  p.x += sin(uTime * 0.8 + p.y * 1.4 + aSeed.x * 10.0) * 0.4 * dd;

  // pointer pushes nearby droplets aside
  vec2 d = p.xy - uPointer;
  float f = smoothstep(1.7, 0.0, length(d)) * uPointerOn;
  p.xy += normalize(d + vec2(1e-4)) * f * 0.5;
  p.z += f * 0.3;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.55 + aSeed.z * 0.8) * (10.0 / -mv.z);

  float twinkle = 0.7 + 0.3 * sin(uTime * 1.6 + aSeed.x * 30.0);
  float fadeLife = amb > 0.5 ? (1.0 - life) * smoothstep(0.0, 0.12, life) : 1.0;
  // the larger "transition" group only shows while the bird forms or dissolves
  float vis = mix(max(1.0 - smoothstep(0.55, 0.95, uForm), smoothstep(0.0, 0.3, uDisperse)), 1.0, amb);
  float base = mix(0.55, 0.30, amb);
  vA = e * fadeLife * twinkle * vis * (1.0 - smoothstep(0.7, 1.0, uDisperse)) * uOpacity * base * (0.6 + 0.4 * aSeed.z);

  vCol = mix(vec3(0.082, 0.275, 0.851), vec3(0.38, 0.58, 1.0), aSeed.z);
}
`;

export const particleFragment = /* glsl */ `
precision highp float;
varying float vA;
varying vec3 vCol;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = pow(smoothstep(0.5, 0.0, d), 1.5);
  vec3 col = mix(vCol, vec3(0.78, 0.86, 1.0), smoothstep(0.2, 0.0, d) * 0.5);
  gl_FragColor = vec4(col, a * vA);
}
`;

/* --------------------------------- waterline -------------------------------- */

export const waterVertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const waterPalette = /* glsl */ `
const vec3 W_COBALT = vec3(0.082, 0.275, 0.851);
const vec3 W_LIGHT  = vec3(0.360, 0.560, 1.000);
const vec3 W_GOLD   = vec3(0.976, 0.702, 0.094);
`;

export const waterFragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uWater;
${waterPalette}
varying vec2 vUv;
void main(){
  float x = vUv.x * 14.0;
  float h = 0.62 + 0.05 * sin(x * 1.1 + uTime * 0.7) + 0.03 * sin(x * 2.6 - uTime * 1.1) + 0.015 * sin(x * 5.3 + uTime * 1.7);
  float below = smoothstep(h + 0.01, h - 0.02, vUv.y);
  float crest = smoothstep(0.035, 0.0, abs(vUv.y - h));
  float depth = h - vUv.y;
  vec3 col = mix(W_LIGHT, W_COBALT, smoothstep(0.0, 0.6, depth));
  float lines = smoothstep(0.92, 1.0, sin(depth * 60.0 - uTime * 0.8 + x * 0.8) * 0.5 + 0.5);
  col = mix(col, vec3(1.0), lines * 0.25);
  col = mix(col, W_GOLD, crest * 0.6);
  float a = below * (0.12 + 0.24 * smoothstep(0.0, 0.6, depth)) + crest * 0.5;
  a *= uWater * smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x);
  gl_FragColor = vec4(col, a);
}
`;
