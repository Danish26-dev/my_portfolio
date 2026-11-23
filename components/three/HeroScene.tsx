"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, MeshDistortMaterial, PerformanceMonitor } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { MutableRefObject, ReactNode } from "react";
import type { PointerState } from "@/hooks/usePointer";

const BLUE = "#1546D9";
const BLUE_DEEP = "#0F34A8";
const AMBER = "#F9B318";
const INK = "#1E293B";
const PAPER = "#EDECE6";

interface SceneProps {
  pointer: MutableRefObject<PointerState>;
  tier: "low" | "high";
  reduced: boolean;
}

/**
 * The "agent core": a liquid blue sphere (the system) wrapped by orbiting rings
 * (workflows) that carry small beads (agents / nodes). Built only from primitives,
 * no external models or textures, so nothing is fetched at runtime.
 */
function Core({ detail, reduced }: { detail: number; reduced: boolean }) {
  return (
    <mesh>
      <icosahedronGeometry args={[1.3, detail]} />
      <MeshDistortMaterial
        color={BLUE}
        distort={reduced ? 0.16 : 0.3}
        speed={reduced ? 0 : 1.4}
        roughness={0.16}
        metalness={0.2}
        envMapIntensity={1.15}
      />
    </mesh>
  );
}

function Ring({
  radius,
  tube,
  color,
  metalness,
  roughness,
  tilt,
  speed,
  beads,
  beadColor,
  reduced,
  segments,
}: {
  radius: number;
  tube: number;
  color: string;
  metalness: number;
  roughness: number;
  tilt: [number, number, number];
  speed: number;
  beads: number[];
  beadColor: string;
  reduced: boolean;
  segments: number;
}) {
  const spin = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (spin.current && !reduced) spin.current.rotation.z += Math.min(delta, 0.05) * speed;
  });
  return (
    <group rotation={tilt}>
      <group ref={spin}>
        <mesh>
          <torusGeometry args={[radius, tube, 20, segments]} />
          <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} envMapIntensity={1.2} />
        </mesh>
        {beads.map((a) => (
          <mesh key={a} position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}>
            <sphereGeometry args={[tube * 2.8, 24, 24]} />
            <meshStandardMaterial color={beadColor} metalness={0.3} roughness={0.2} envMapIntensity={1.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Satellites({ reduced, low }: { reduced: boolean; low: boolean }) {
  const s = reduced ? 0 : 1;
  return (
    <>
      <Float speed={1.6 * s} rotationIntensity={1.3 * s} floatIntensity={0.9 * s}>
        <mesh position={[2.2, 1.55, 0.6]} rotation={[0.5, 0.4, 0]}>
          <boxGeometry args={[0.42, 0.42, 0.42]} />
          <meshStandardMaterial color={AMBER} metalness={0.45} roughness={0.22} envMapIntensity={1.3} />
        </mesh>
      </Float>
      <Float speed={1.2 * s} rotationIntensity={1.1 * s} floatIntensity={1.1 * s}>
        <mesh position={[-1.75, -2.0, 0.9]}>
          <octahedronGeometry args={[0.32, 0]} />
          <meshStandardMaterial color={PAPER} metalness={0.1} roughness={0.35} />
        </mesh>
      </Float>
      <Float speed={1.9 * s} rotationIntensity={0.8 * s} floatIntensity={1.2 * s}>
        <mesh position={[-1.7, 1.9, -0.6]}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial color={INK} metalness={0.5} roughness={0.25} envMapIntensity={1.2} />
        </mesh>
      </Float>
      {!low && (
        <Float speed={1.4 * s} rotationIntensity={1.4 * s} floatIntensity={0.7 * s}>
          <mesh position={[1.9, -1.8, 0.2]} rotation={[0.2, 0.6, 0.3]}>
            <icosahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial color={BLUE_DEEP} metalness={0.4} roughness={0.2} wireframe />
          </mesh>
        </Float>
      )}
    </>
  );
}

/** Places the object right of the headline on desktop and top-right on phones. Adds pointer parallax. */
function Rig({
  pointer,
  reduced,
  children,
}: {
  pointer: MutableRefObject<PointerState>;
  reduced: boolean;
  children: ReactNode;
}) {
  const outer = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const narrow = viewport.width < 6;
  const scale = narrow ? 0.42 : Math.min(0.88, Math.max(0.6, viewport.height / 7.6));
  const targetX = narrow ? viewport.width * 0.2 : viewport.width * 0.23;
  const targetY = narrow ? viewport.height * 0.3 : 0;

  useFrame((_, delta) => {
    if (!outer.current || !tilt.current) return;
    const k = reduced ? 1 : 1 - Math.pow(0.0015, Math.min(delta, 0.05));
    outer.current.position.x += (targetX - outer.current.position.x) * k;
    outer.current.position.y += (targetY - outer.current.position.y) * k;
    const ry = reduced ? 0 : pointer.current.x * 0.4;
    const rx = reduced ? 0 : -pointer.current.y * 0.25;
    tilt.current.rotation.y += (ry - tilt.current.rotation.y) * k * 0.6;
    tilt.current.rotation.x += (rx - tilt.current.rotation.x) * k * 0.6;
  });

  return (
    <group ref={outer} scale={scale} position={[targetX, targetY, 0]}>
      <group ref={tilt} rotation={[0.18, -0.35, 0]}>
        {children}
      </group>
    </group>
  );
}

function Scene({ pointer, tier, reduced }: SceneProps) {
  const low = tier === "low";
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={2.4} />
      <directionalLight position={[-5, -2, -3]} intensity={1} color={AMBER} />

      {/* Custom reflection rig. Rendered once; no HDR download. */}
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3.2} position={[0, 5, 2]} scale={[12, 3, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.4} position={[-6, 1, 1]} scale={[3, 7, 1]} color={AMBER} />
        <Lightformer form="rect" intensity={2} position={[6, -1, 2]} scale={[3, 6, 1]} color="#9db8ff" />
        <Lightformer form="circle" intensity={1.4} position={[0, -4, 3]} scale={6} color={PAPER} />
      </Environment>

      <Rig pointer={pointer} reduced={reduced}>
        <Core detail={low ? 12 : 22} reduced={reduced} />
        <Ring
          radius={2.05}
          tube={0.045}
          color={AMBER}
          metalness={0.75}
          roughness={0.2}
          tilt={[1.15, 0.2, 0]}
          speed={0.32}
          beads={[0.4, 3.5]}
          beadColor={AMBER}
          reduced={reduced}
          segments={low ? 72 : 128}
        />
        <Ring
          radius={2.45}
          tube={0.026}
          color={INK}
          metalness={0.6}
          roughness={0.3}
          tilt={[0.55, -0.55, 0.3]}
          speed={-0.22}
          beads={[1.7, 4.6]}
          beadColor={INK}
          reduced={reduced}
          segments={low ? 72 : 128}
        />
        <Ring
          radius={1.72}
          tube={0.03}
          color="#ffffff"
          metalness={0.2}
          roughness={0.25}
          tilt={[-0.4, 0.8, 0.7]}
          speed={0.45}
          beads={[2.6]}
          beadColor="#ffffff"
          reduced={reduced}
          segments={low ? 64 : 96}
        />
        <Satellites reduced={reduced} low={low} />
      </Rig>
    </>
  );
}

export default function HeroScene({ pointer, tier, reduced }: SceneProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const base = tier === "low" ? 1 : 1.75;
  const [dpr, setDpr] = useState<number>(base);
  const camera = useMemo(() => ({ position: [0, 0, 9] as [number, number, number], fov: 40 }), []);

  // Pause rendering when the hero is off-screen or the tab is hidden.
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
          <Scene pointer={pointer} tier={tier} reduced={reduced} />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
