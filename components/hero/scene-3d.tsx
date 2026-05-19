'use client';

import { Environment } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useRef } from 'react';
import * as THREE from 'three';

// HeroScene3D — 3 placas glass refractive r3f custom (anti-Spline, anti-slop).
// Layout: L -8° / C frontmost (lime emissive border) / R +8°. Mouse parallax via
// useThree pointer + lerp em useFrame. Idle drift sine sutil. Bloom postprocessing.
//
// Lazy importado via dynamic({ ssr: false }) — esse arquivo NÃO renderiza no server.
// Fallback enquanto carrega: <HeroPoster /> (SVG-based, do consumer).

// Cores OKLCH convertidas pra THREE.Color (r3f não consome --color-* vars direto).
const LIME = new THREE.Color('#D2FF00');
const GLASS_FILL = new THREE.Color('#1a1f17');
const ENV_BG = new THREE.Color('#080A07');

interface HeroScene3DProps {
  className?: string;
}

export default function HeroScene3D({ className }: HeroScene3DProps) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 5], fov: 32 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}

function SceneContent() {
  return (
    <>
      <color attach="background" args={[ENV_BG.r, ENV_BG.g, ENV_BG.b]} />
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

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Idle drift sutil (sine inOut 20s ciclo) + mouse parallax
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
      {/* Plate L — left, rotated -8° */}
      <Plate position={[-1.55, 0.15, -0.4]} rotation={[0, -0.14, 0.02]} />

      {/* Plate R — right, rotated +8° */}
      <Plate position={[1.55, -0.05, -0.25]} rotation={[0, 0.14, -0.02]} />

      {/* Plate C — centro, frontmost com emissive lime edges */}
      <Plate position={[0, 0, 0.45]} rotation={[0, 0, 0]} emissive />
    </group>
  );
}

interface PlateProps {
  position: [number, number, number];
  rotation: [number, number, number];
  emissive?: boolean;
}

function Plate({ position, rotation, emissive = false }: PlateProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} castShadow={false}>
      <boxGeometry args={[1.65, 2.35, 0.07]} />
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
      {emissive ? <EmissiveEdges /> : <SubtleEdges />}
    </mesh>
  );
}

function EmissiveEdges() {
  return (
    <lineSegments>
      <edgesGeometry args={[new THREE.BoxGeometry(1.65, 2.35, 0.07)]} />
      <lineBasicMaterial color={LIME} linewidth={2} transparent opacity={0.85} />
    </lineSegments>
  );
}

function SubtleEdges() {
  return (
    <lineSegments>
      <edgesGeometry args={[new THREE.BoxGeometry(1.65, 2.35, 0.07)]} />
      <lineBasicMaterial color="#3a4035" transparent opacity={0.35} />
    </lineSegments>
  );
}
