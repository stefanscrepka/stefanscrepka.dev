'use client';

import { Edges, Environment } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';

// HeroScene3D — 3 placas glass refractive r3f custom (anti-Spline, anti-slop).
// Layout: L -8° / C frontmost (lime emissive border via drei <Edges> world-unit width) / R +8°.
// Mouse parallax via useThree pointer + lerp em useFrame. Idle drift sine sutil.
// Bloom postprocessing.
//
// Lazy importado via dynamic({ ssr: false }) — esse arquivo NÃO renderiza no server.
// Fallback enquanto carrega: <HeroPoster /> (SVG-based, do consumer).
//
// Patches FASE 4 prep:
// - drei <Edges> em vez de <lineSegments> + lineBasicMaterial (WebGL clamps linewidth=1).
// - PLATE_GEOM module-scope (evita memory leak por re-render).
// - Canvas alpha:true sem <color background> (deixa page bg bleed through).
// - useFrame gate em useReducedMotionSafe (defesa em profundidade — HeroSceneClient
//   já não monta este file em reduced=true, mas se preferência mudar live, idle para).

// Cores OKLCH convertidas pra THREE.Color (r3f não consome --color-* vars direto).
const LIME = new THREE.Color('#D2FF00');
const GLASS_FILL = new THREE.Color('#1a1f17');

// Geometry hoist: 1 alocação por module load (não por render).
const PLATE_GEOMETRY = new THREE.BoxGeometry(1.65, 2.35, 0.07);

interface HeroScene3DProps {
  className?: string | undefined;
}

export default function HeroScene3D({ className }: HeroScene3DProps) {
  return (
    <div
      className={className}
      style={{ width: '100%', height: '100%', backgroundColor: '#080A07' }}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 5], fov: 32 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[-4, 5, 4]} intensity={1.6} color="#ffffff" />
      <pointLight position={[0, 0, 2]} intensity={0.4} color={LIME} distance={6} />
      <Environment preset="studio" environmentIntensity={0.6} background={false} />

      <PlatesGroup />

      <EffectComposer enableNormalPass={false}>
        <Bloom intensity={0.45} luminanceThreshold={0.78} luminanceSmoothing={0.18} mipmapBlur />
      </EffectComposer>
    </>
  );
}

function PlatesGroup() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const reduced = useReducedMotionSafe();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Reduced-motion ou pre-mount: freeze posição base, sem drift nem parallax.
    if (reduced !== false) return;

    const t = state.clock.getElapsedTime();
    // Idle drift sutil (sine inOut periods desalinhados pra Lissajous não-repetitivo)
    const idleY = Math.sin(t * 0.31) * 0.04;
    const idleX = Math.cos(t * 0.27) * 0.025;

    const targetRotY = pointer.x * 0.22 + idleY;
    const targetRotX = -pointer.y * 0.14 + idleX;

    // Lerp toward target (≈ spring stiffness 80 damping 25 vibe)
    const k = Math.min(1, delta * 3.2);
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * k;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * k;
  });

  return (
    <group ref={groupRef}>
      {/* V-shape composition — center plate dramatically forward, laterals recuadas (Nextronium pattern) */}

      {/* Plate L — left, rotated -10° (mais agressivo), recuado em Z */}
      <Plate position={[-1.6, 0.18, -0.9]} rotation={[0, -0.18, 0.03]} />

      {/* Plate R — right, rotated +10°, recuado em Z */}
      <Plate position={[1.6, -0.08, -0.9]} rotation={[0, 0.18, -0.03]} />

      {/* Plate C — frontmost, +1.1 Z (era 0.45 → empurrado 0.65 forward) */}
      <Plate position={[0, 0, 1.1]} rotation={[0, 0, 0]} emissive />
    </group>
  );
}

interface PlateProps {
  position: [number, number, number];
  rotation: [number, number, number];
  emissive?: boolean;
}

function Plate({ position, rotation, emissive = false }: PlateProps) {
  return (
    <mesh geometry={PLATE_GEOMETRY} position={position} rotation={rotation} castShadow={false}>
      <meshPhysicalMaterial
        color={GLASS_FILL}
        transmission={0.95}
        thickness={0.5}
        ior={1.45}
        roughness={0.1}
        metalness={0}
        clearcoat={0.4}
        clearcoatRoughness={0.2}
        envMapIntensity={1.1}
        transparent
        opacity={0.92}
      />
      {emissive ? (
        <Edges threshold={15} color={LIME} lineWidth={2.5} />
      ) : (
        <Edges threshold={15} color="#3a4035" lineWidth={1} />
      )}
    </mesh>
  );
}
