/**
 * GLSL for the water phoenix. Everything is drawn with ordinary alpha blending,
 * because additive glow disappears on a warm-beige page.
 * Palette: cobalt #1546D9, sun yellow #F9B318.
 */

const common = /* glsl */ `
uniform float uTime;
uniform float uSpread;   // 0 folded/raised -> 1 wings swept open and down
uniform float uFlap;     // flap strength
uniform float uForm;     // 0 scattered droplets -> 1 formed bird
uniform float uDisperse; // 0 intact -> 1 dissolved into falling water
uniform float uOpacity;
uniform vec2  uPointer;  // pointer in the bird's local space
uniform float uPointerOn;

mat2 rot2(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }

vec3 wingXf(vec3 p, float side, float arm){
  if (abs(side) < 0.5) return p;
  vec2 S = vec2(0.30 * side, 0.95);
  float ph = uTime * 0.9;
  float flap = sin(ph) * uFlap;
  float a = side * (flap * (0.04 + 0.22 * arm) - uSpread * (0.10 + 0.70 * arm));
  p.xy = S + rot2(a) * (p.xy - S);
  // the tips lag behind the shoulder, like a wave travelling outward
  p.y += sin(ph - arm * 2.6) * 0.12 * arm * uFlap;
  p.z += cos(ph - arm * 2.2) * 0.30 * arm * uFlap;
  p.x += side * uSpread * 0.45 * arm;
  return p;
}

vec3 flowXf(vec3 p, float group, float u, float seed){
  if (group > 2.5 && group < 4.5) {
    float k = group < 3.5 ? 0.32 : 0.16;
    p.x += sin(uTime * 0.8 + u * 3.2 + seed * 6.2831) * k * u * u;
    p.z += cos(uTime * 0.7 + u * 2.6 + seed * 6.2831) * 0.14 * u;
  }
  return p;
}
`;

const palette = /* glsl */ `
const vec3 DEEP   = vec3(0.035, 0.150, 0.600);
const vec3 COBALT = vec3(0.082, 0.275, 0.851);
const vec3 LIGHT  = vec3(0.360, 0.560, 1.000);
const vec3 GOLD   = vec3(0.976, 0.702, 0.094);
`;

/* ------------------------------ feathers ------------------------------ */

export const featherVertex = /* glsl */ `
${common}
attribute vec2 aFuv;
attribute vec4 aInfo; // side, arm, group, seed
varying vec2 vFuv;
varying vec4 vInfo;
void main(){
  vec3 p = wingXf(position, aInfo.x, aInfo.y);
  p = flowXf(p, aInfo.z, aFuv.x, aInfo.w);
  vFuv = aFuv;
  vInfo = aInfo;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

export const featherFragment = /* glsl */ `
precision highp float;
${common}
${palette}
varying vec2 vFuv;
varying vec4 vInfo;
void main(){
  float u = vFuv.x;
  float v = vFuv.y;
  float seed = vInfo.w;
  float group = vInfo.z;

  // grows outward from the root while the bird forms
  float reveal = smoothstep(0.0, 0.3, uForm * 1.6 - u * 0.75 - seed * 0.3);
  // tips dissolve first as the bird disperses
  float keep = smoothstep(0.0, 0.25, (1.0 - u) + 0.3 - uDisperse * 1.5 + seed * 0.1);

  float edge = smoothstep(1.0, 0.45, abs(v));
  float barbs = 0.5 + 0.5 * sin((u * 34.0 - abs(v) * 12.0) + seed * 6.0);
  float rachis = smoothstep(0.14, 0.0, abs(v));
  float flowT = 0.5 + 0.5 * sin(u * 12.0 - uTime * 1.5 + seed * 6.2831 + v * 2.0);

  vec3 col = mix(DEEP, COBALT, smoothstep(0.0, 0.5, u));
  col = mix(col, LIGHT, flowT * 0.40 * (0.3 + u) + rachis * 0.35);

  // sunlight catching the tips
  float tipGold = smoothstep(0.80, 1.0, u) * (0.45 + 0.55 * sin(uTime * 1.2 + seed * 30.0));
  col = mix(col, GOLD, clamp(tipGold, 0.0, 1.0) * 0.9);
  float glint = pow(flowT, 8.0) * smoothstep(0.1, 0.6, u);
  col = mix(col, vec3(1.0), glint * 0.5);

  float cov = (group > 1.5 && group < 2.5) ? 1.0 : 0.0;
  float a = edge * (0.22 + 0.34 * barbs + 0.30 * rachis + 0.12 * cov);
  a *= (1.0 - 0.35 * u);
  a = max(a, tipGold * edge * 0.5);
  a *= reveal * keep * uOpacity;
  gl_FragColor = vec4(col, a);
}
`;

/* -------------------------- body, head and beak -------------------------- */

export const bodyVertex = /* glsl */ `
attribute float aT;
varying vec3 vN;
varying float vT;
void main(){
  vN = normalize(normalMatrix * normal);
  vT = aT;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const bodyFragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uForm;
uniform float uDisperse;
uniform float uOpacity;
uniform float uGold;
${palette}
varying vec3 vN;
varying float vT;
void main(){
  vec3 n = normalize(vN);
  float fres = pow(1.0 - abs(n.z), 2.2);
  float bands = 0.5 + 0.5 * sin(vT * 46.0 - uTime * 1.6 + n.x * 4.0);
  vec3 col = mix(COBALT, DEEP, 0.5 * (1.0 - fres));
  col = mix(col, LIGHT, fres * 0.55 + bands * 0.18);
  float sun = pow(max(dot(n, normalize(vec3(-0.5, 0.65, 0.6))), 0.0), 10.0);
  col = mix(col, GOLD, sun * 0.75);
  col = mix(col, GOLD, uGold);
  float reveal = smoothstep(0.0, 0.3, uForm * 1.5 - abs(vT - 0.45) * 0.6);
  float keep = 1.0 - smoothstep(0.5, 1.0, uDisperse * 1.25);
  float a = (0.40 + 0.45 * fres + sun * 0.2 + uGold * 0.45) * reveal * keep * uOpacity;
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
  float f = fract(vT * 5.0 - uTime * 0.35);
  float band = smoothstep(0.0, 0.1, f) * smoothstep(0.55, 0.2, f);
  vec3 col = mix(COBALT, LIGHT, band);
  col = mix(col, GOLD, step(0.965, fract(vT * 3.0 - uTime * 0.2)) * 0.7);
  float reveal = smoothstep(0.35, 0.9, uForm * 1.3 - vT * 0.2);
  float keep = 1.0 - smoothstep(0.2, 0.8, uDisperse * 1.2);
  float a = (0.10 + 0.42 * band) * smoothstep(1.0, 0.25, abs(vS)) * reveal * keep * uOpacity;
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

  // droplets break off the feathers and fall away, like spray
  float emitter = step(aSeed.y, 0.38);
  float life = fract(uTime * (0.06 + aSeed.z * 0.08) + aSeed.w);
  vec3 dir = normalize(vec3(sin(aSeed.x * 40.0) * 0.7 + 0.15, -0.35 - aSeed.z * 0.9, cos(aSeed.y * 33.0) * 0.6));
  p += dir * (life * life) * (0.9 + aSeed.z * 1.6) * emitter;

  // gather: streams arc up from the pool and settle onto the bird
  float e = clamp(uForm * 1.45 - u * 0.35 - aSeed.x * 0.35, 0.0, 1.0);
  e = e * e * (3.0 - 2.0 * e);
  vec3 q = mix(aScatter, p, e);
  float arc = sin(e * 3.14159);
  q.x += arc * sin(aSeed.x * 6.2831) * 1.4;
  q.z += arc * cos(aSeed.y * 6.2831) * 0.8;
  p = q;

  // disperse: the bird turns back into water and streams downward
  float dd = pow(uDisperse, 1.2);
  p += vec3(0.4 + aSeed.z * 1.2, -3.0 - aSeed.x * 4.0, (aSeed.y - 0.5) * 2.0) * dd * (0.6 + aSeed.w);
  p.x += sin(uTime * 0.8 + p.y * 1.4 + aSeed.x * 10.0) * 0.4 * dd;

  // pointer pushes nearby droplets away
  vec2 d = p.xy - uPointer;
  float f = smoothstep(1.7, 0.0, length(d)) * uPointerOn;
  p.xy += normalize(d + vec2(1e-4)) * f * 0.55;
  p.z += f * 0.3;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.55 + aSeed.z * 0.9) * (10.0 / -mv.z);

  float twinkle = 0.65 + 0.35 * sin(uTime * 1.7 + aSeed.x * 30.0);
  float fadeLife = emitter > 0.5 ? (1.0 - life) * smoothstep(0.0, 0.1, life) : 1.0;
  vA = e * fadeLife * twinkle * (1.0 - smoothstep(0.7, 1.0, uDisperse)) * uOpacity * (0.55 + 0.45 * aSeed.z);

  vec3 blue = mix(vec3(0.082, 0.275, 0.851), vec3(0.36, 0.56, 1.0), aSeed.z);
  vCol = mix(blue, vec3(0.976, 0.702, 0.094), step(0.93, aSeed.y));
}
`;

export const particleFragment = /* glsl */ `
precision highp float;
varying float vA;
varying vec3 vCol;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = pow(smoothstep(0.5, 0.0, d), 1.4);
  vec3 col = mix(vCol, vec3(1.0), smoothstep(0.22, 0.0, d) * 0.45); // glint at the centre
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

export const waterFragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uWater;
${palette}
varying vec2 vUv;
void main(){
  float x = vUv.x * 14.0;
  float h = 0.62 + 0.05 * sin(x * 1.1 + uTime * 0.7) + 0.03 * sin(x * 2.6 - uTime * 1.1) + 0.015 * sin(x * 5.3 + uTime * 1.7);
  float below = smoothstep(h + 0.01, h - 0.02, vUv.y);
  float crest = smoothstep(0.035, 0.0, abs(vUv.y - h));
  float depth = h - vUv.y;
  vec3 col = mix(LIGHT, COBALT, smoothstep(0.0, 0.6, depth));
  float lines = smoothstep(0.92, 1.0, sin(depth * 60.0 - uTime * 0.8 + x * 0.8) * 0.5 + 0.5);
  col = mix(col, vec3(1.0), lines * 0.25);
  col = mix(col, GOLD, crest * 0.6);
  float a = below * (0.12 + 0.24 * smoothstep(0.0, 0.6, depth)) + crest * 0.5;
  a *= uWater * smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x);
  gl_FragColor = vec4(col, a);
}
`;
