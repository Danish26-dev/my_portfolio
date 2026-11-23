"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const N = 8;

/** 8x8 chessboard as a single InstancedMesh, rippled like a water surface. */
function Board({ reduced }: { reduced: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colors = useMemo(() => {
    const light = new THREE.Color("#F7F6F1");
    const dark = new THREE.Color("#1546D9");
    return Array.from({ length: N * N }, (_, i) => {
      const x = i % N;
      const y = Math.floor(i / N);
      return (x + y) % 2 === 0 ? light : dark;
    });
  }, []);

  useEffect(() => {
    if (!mesh.current) return;
    colors.forEach((c, i) => mesh.current!.setColorAt(i, c));
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  }, [colors]);

  const t = useRef(reduced ? 3 : 0);
  useFrame((_, d) => {
    if (!mesh.current) return;
    if (!reduced) t.current += Math.min(d, 0.05);
    for (let i = 0; i < N * N; i++) {
      const x = i % N;
      const y = Math.floor(i / N);
      const h = 0.25 + (Math.sin(t.current * 0.9 + x * 0.7 + y * 0.5) + 1) * 0.12;
      dummy.position.set(x - (N - 1) / 2, h / 2, y - (N - 1) / 2);
      dummy.scale.set(0.94, h, 0.94);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, N * N]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.35} metalness={0.5} />
    </instancedMesh>
  );
}

function Bubbles({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 12,
        z: (Math.random() - 0.5) * 8,
        y: Math.random() * 8,
        s: 0.04 + Math.random() * 0.09,
        v: 0.15 + Math.random() * 0.35,
      })),
    [count]
  );
  useFrame((_, d) => {
    if (!ref.current) return;
    data.forEach((b, i) => {
      b.y += b.v * Math.min(d, 0.05);
      if (b.y > 7) b.y = -1;
      dummy.position.set(b.x + Math.sin(b.y * 1.5 + i) * 0.15, b.y, b.z);
      dummy.scale.setScalar(b.s);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshBasicMaterial color="#F9B318" transparent opacity={0.6} />
    </instancedMesh>
  );
}

export default function BeyondScene({
  reduced,
  low,
}: {
  reduced: boolean;
  low: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={reduced ? "demand" : visible ? "always" : "never"}
        dpr={low ? 1 : [1, 1.5]}
        camera={{ position: [0, 5.2, 7.5], fov: 42 }}
        flat gl={{ antialias: !low, alpha: true }}
        aria-hidden="true"
      >
        <ambientLight intensity={1.1} />
        <pointLight position={[3, 6, 3]} intensity={70} color="#ffffff" />
        <pointLight position={[-4, 3, -2]} intensity={40} color="#F9B318" />
        <Float speed={reduced ? 0 : 1} rotationIntensity={0.15} floatIntensity={0.3}>
          <group rotation={[0, 0.5, 0]} position={[2.2, -0.5, 0]}>
            <Board reduced={reduced} />
          </group>
        </Float>
        <Bubbles count={low ? 18 : 40} />
      </Canvas>
    </div>
  );
}
