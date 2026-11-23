"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import type { PointerState } from "@/hooks/usePointer";
import {
  buildBodyGeometry,
  buildFeatherGeometry,
  buildParticleGeometry,
  buildRibbonGeometry,
} from "./phoenix/geometry";
import {
  bodyFragment,
  bodyVertex,
  featherFragment,
  featherVertex,
  particleFragment,
  particleVertex,
  ribbonFragment,
  ribbonVertex,
  waterFragment,
  waterVertex,
} from "./phoenix/shaders";

export type PhoenixMode = "hero" | "outro";

interface Props {
  mode: PhoenixMode;
  /** 0 -> 1 story progress for this scene, written by a scroll listener */
  progress: MotionValue<number>;
  pointer: MutableRefObject<PointerState>;
  tier: "low" | "high";
  reduced: boolean;
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function World({ mode, progress, pointer, tier, reduced }: Props) {
  const { viewport, gl, size } = useThree();
  const low = tier === "low";
  const group = useRef<THREE.Group>(null);
  const clock = useRef(reduced ? 14 : 0);
  const placed = useRef(false);
  const ptr = useRef({ x: 0, y: 0 });

  /** One uniform bag shared by every material, so a single update drives all layers. */
  const U = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpread: { value: 0 },
      uFlap: { value: reduced ? 0.5 : 1 },
      uForm: { value: reduced ? 1 : 0 },
      uDisperse: { value: 0 },
      uOpacity: { value: 1 },
      uPointer: { value: new THREE.Vector2(99, 99) },
      uPointerOn: { value: 0 },
      uSize: { value: low ? 2.9 : 2.3 },
      uPixelRatio: { value: 1 },
      uWater: { value: 1 },
    }),
    [reduced, low]
  );

  const featherU = useMemo(
    () => ({
      uTime: U.uTime,
      uSpread: U.uSpread,
      uFlap: U.uFlap,
      uForm: U.uForm,
      uDisperse: U.uDisperse,
      uOpacity: U.uOpacity,
      uPointer: U.uPointer,
      uPointerOn: U.uPointerOn,
    }),
    [U]
  );
  const particleU = useMemo(() => ({ ...featherU, uSize: U.uSize, uPixelRatio: U.uPixelRatio }), [featherU, U]);
  const bodyU = useMemo(
    () => ({ uTime: U.uTime, uForm: U.uForm, uDisperse: U.uDisperse, uOpacity: U.uOpacity }),
    [U]
  );
  const ribbonU = useMemo(
    () => ({ uTime: U.uTime, uForm: U.uForm, uDisperse: U.uDisperse, uOpacity: U.uOpacity }),
    [U]
  );
  const waterU = useMemo(() => ({ uTime: U.uTime, uWater: U.uWater }), [U]);

  const geo = useMemo(
    () => ({
      back: buildFeatherGeometry(0),
      front: buildFeatherGeometry(1),
      body: buildBodyGeometry(),
      ribbons: [0, 1].map((i) => buildRibbonGeometry(i)),
      particles: buildParticleGeometry(low ? 2200 : 5400),
    }),
    [low]
  );
  useEffect(
    () => () => {
      geo.back.dispose();
      geo.front.dispose();
      geo.body.dispose();
      geo.ribbons.forEach((g) => g.dispose());
      geo.particles.dispose();
    },
    [geo]
  );

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const d = Math.min(delta, 0.05);
    if (!reduced) clock.current += d;
    const time = clock.current;
    const p = reduced ? 0 : progress.get();

    // ---- story state ----
    let form = 1;
    let spread = 0;
    let disperse = 0;
    let water = 1;
    if (mode === "hero") {
      if (!reduced) {
        const k = clamp01((time - 1.3) / 5.2);
        form = k * k * (3 - 2 * k);
      }
      spread = smooth(0, 0.75, p);
      disperse = smooth(0.42, 1, p);
      water = 1 - smooth(0.55, 0.95, p);
    } else if (!reduced) {
      form = smooth(0.0, 0.5, p);
      spread = 0.12 + 0.5 * smooth(0.45, 0.95, p);
      disperse = smooth(0.58, 1, p);
      water = smooth(0, 0.25, p) * (1 - smooth(0.75, 1, p));
    } else {
      spread = 0.1;
      water = 0.8;
    }
    U.uTime.value = time;
    U.uForm.value = form;
    U.uSpread.value = spread;
    U.uDisperse.value = disperse;
    U.uWater.value = water;
    U.uFlap.value = (reduced ? 0.5 : 1) * (1 - disperse * 0.5);
    U.uPixelRatio.value = gl.getPixelRatio();

    // ---- placement ----
    const vw = viewport.width;
    const vh = viewport.height;
    const narrow = vw < 7;
    let s: number;
    let x: number;
    let y: number;
    if (mode === "hero") {
      if (narrow) {
        // Sized in screen pixels so it stays above the copy even when the mobile hero is taller than the screen.
        const wpp = vh / size.height; // world units per pixel
        s = Math.min((vw * 0.95) / 10, (330 * wpp) / 9.2);
        x = 0;
        y = vh / 2 - 205 * wpp;
      } else {
        s = Math.min((vw * 0.44) / 10, (vh * 0.88) / 9.2, 0.9);
        x = vw * 0.232;
        y = -0.1;
      }
      y += p * 0.6;
      s *= 1 + p * 0.08;
    } else if (narrow) {
      s = Math.min((vw * 0.92) / 10, (vh * 0.6) / 9.2);
      x = 0;
      y = 0.2;
    } else {
      s = Math.min((vw * 0.5) / 10, (vh * 0.88) / 9.2, 0.95);
      x = 0;
      y = 0.1;
    }
    y += Math.sin(time * 0.6) * 0.08;

    const k = placed.current ? 1 - Math.exp(-d * 6) : 1;
    placed.current = true;
    g.position.x += (x - g.position.x) * k;
    g.position.y += (y - g.position.y) * k;
    const cs = g.scale.x + (s - g.scale.x) * k;
    g.scale.setScalar(cs);

    // ---- pointer: parallax tilt + droplets pushed aside ----
    const pt = pointer.current;
    const tx = reduced || !pt.active ? 0 : pt.x;
    const ty = reduced || !pt.active ? 0 : pt.y;
    ptr.current.x += (tx - ptr.current.x) * 0.06;
    ptr.current.y += (ty - ptr.current.y) * 0.06;
    g.rotation.y = ptr.current.x * 0.26;
    g.rotation.x = -ptr.current.y * 0.09;
    const wx = pt.x * (vw / 2);
    const wy = pt.y * (vh / 2);
    U.uPointer.value.set((wx - g.position.x) / cs, (wy - g.position.y) / cs);
    U.uPointerOn.value = reduced || !pt.active ? 0 : 1;
  });

  return (
    <>
      {/* waterline: the bird rises out of it and dissolves back into it */}
      <mesh position={[0, -viewport.height / 2 + 0.74, -1.5]} renderOrder={0} frustumCulled={false}>
        <planeGeometry args={[viewport.width * 1.6, 3.4]} />
        <shaderMaterial
          vertexShader={waterVertex}
          fragmentShader={waterFragment}
          uniforms={waterU}
          transparent
          depthTest={false}
          depthWrite={false}
        />
      </mesh>

      <group ref={group}>
        {geo.ribbons.map((g, i) => (
          <mesh key={i} geometry={g} renderOrder={1} frustumCulled={false}>
            <shaderMaterial
              vertexShader={ribbonVertex}
              fragmentShader={ribbonFragment}
              uniforms={ribbonU}
              transparent
              depthTest={false}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
        {/* behind the body: wings and tail */}
        <mesh geometry={geo.back} renderOrder={2} frustumCulled={false}>
          <shaderMaterial
            vertexShader={featherVertex}
            fragmentShader={featherFragment}
            uniforms={featherU}
            transparent
            depthTest={false}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* one lofted form: beak, head, neck, chest */}
        <mesh geometry={geo.body} renderOrder={3} frustumCulled={false}>
          <shaderMaterial
            vertexShader={bodyVertex}
            fragmentShader={bodyFragment}
            uniforms={bodyU}
            transparent
            depthTest
            depthWrite
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* in front of the body: breast and neck plumage, crest */}
        <mesh geometry={geo.front} renderOrder={4} frustumCulled={false}>
          <shaderMaterial
            vertexShader={featherVertex}
            fragmentShader={featherFragment}
            uniforms={featherU}
            transparent
            depthTest={false}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <points geometry={geo.particles} renderOrder={5} frustumCulled={false}>
          <shaderMaterial
            vertexShader={particleVertex}
            fragmentShader={particleFragment}
            uniforms={particleU}
            transparent
            depthTest={false}
            depthWrite={false}
          />
        </points>      </group>
    </>
  );
}

export default function PhoenixCanvas(props: Props) {
  const { tier, reduced } = props;
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(props.mode === "hero");
  const [tabVisible, setTabVisible] = useState(true);
  const base = tier === "low" ? 1 : 1.75;
  const [dpr, setDpr] = useState<number>(base);
  const camera = useMemo(() => ({ position: [0, 0, 11] as [number, number, number], fov: 38 }), []);

  // Stop rendering when this scene is off-screen or the tab is hidden.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const frameloop = reduced ? "demand" : visible && tabVisible ? "always" : "never";

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        flat
        frameloop={frameloop}
        dpr={dpr}
        camera={camera}
        gl={{ antialias: tier === "high", alpha: true, powerPreference: "high-performance" }}
        aria-hidden="true"
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(base)}>
          <World {...props} />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
