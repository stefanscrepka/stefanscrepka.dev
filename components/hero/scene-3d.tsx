'use client';

import { Environment, Float } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';

// ============================================================
// HeroScene3D — cinema theatre (Nextronium beam + NEONE arc, lime variant)
//
// Cena teatral escura:
//   - 3 placas glass refractive flutuando em V (L recuada -8°, R recuada +8°, C frontmost)
//   - Placa central com lime emissive border via wireframe outline
//   - MeshPhysicalMaterial transmission 0.95, ior 1.45, roughness 0.1
//   - Volumetric lime beam vertical saindo do bottom (Cone + shader gradient, additive)
//   - Postprocessing Bloom (0.4 intensity, threshold 0.85)
//   - Studio HDR environment (drei preset)
//   - Mouse parallax 12-16° rotation Y, lerp suave
//   - Idle drift sine wave 20s loop
//   - Fog dark sutil pra profundidade atmosférica
//
// Lazy importado via dynamic({ ssr: false }) — esse arquivo NÃO renderiza no server.
// Fallback enquanto carrega: <HeroPoster /> (via consumer).
//
// Perf:
//   - PLATE_GEOM module-scope (1 alocação por module load)
//   - BEAM_GEOM module-scope
//   - dpr={[1, 2]} retina-friendly mas capped
//   - useFrame gate em reduced-motion (defesa em profundidade)
// ============================================================

// Cores OKLCH convertidas pra THREE.Color (r3f não consome --color-* vars direto).
// Lime A do design system: oklch(94% 0.22 124) ≈ #D2FF00
const LIME = new THREE.Color('#d2ff00');
const LIME_DIM = new THREE.Color('#7a9300');
const GLASS_TINT = new THREE.Color('#1a1f17');
const FOG_BASE = new THREE.Color('#080a07');

// Module-scope geometries — 1 alocação por module load (não por render).
const PLATE_GEOMETRY = new THREE.BoxGeometry(1.55, 2.3, 0.06);
// Cone invertido (large radius bottom, small top) pra beam volumétrico
const BEAM_GEOMETRY = new THREE.ConeGeometry(1.4, 6, 32, 1, true);

// Module-scope gl config — referência estável evita re-init do WebGLRenderer
// em re-renders, que era a causa do bug "Cannot read properties of null (reading 'alpha')"
// quando o renderer anterior era disposed mas r3f ainda tentava ler attributes dele.
const CANVAS_GL = {
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance' as const,
};

const CANVAS_DPR: [number, number] = [1, 2];
const CANVAS_CAMERA = { position: [0, 0, 5] as [number, number, number], fov: 35 };
const CANVAS_STYLE = { background: 'transparent', width: '100%', height: '100%' } as const;

interface HeroScene3DProps {
  className?: string | undefined;
}

export default function HeroScene3D({ className }: HeroScene3DProps) {
  return (
    <div
      className={className}
      style={{ width: '100%', height: '100%', backgroundColor: '#080a07' }}
    >
      <Canvas
        dpr={CANVAS_DPR}
        camera={CANVAS_CAMERA}
        gl={CANVAS_GL}
        style={CANVAS_STYLE}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}

function SceneContent() {
  const { scene } = useThree();
  // Fog atmosférico — fade pra escuro nos cantos, reforça palco
  useMemo(() => {
    scene.fog = new THREE.Fog(FOG_BASE, 4.5, 11);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  return (
    <>
      {/* Lighting design — key + rim + fill, todos focados no centro */}
      <ambientLight intensity={0.15} />
      {/* Key light: top-left, branco quente */}
      <directionalLight position={[-3, 4, 3]} intensity={1.4} color="#ffffff" />
      {/* Rim light: trás, lime saturado pra silhuetar as placas */}
      <pointLight position={[0, 1, -3]} intensity={2.2} color={LIME} distance={8} />
      {/* Fill: bottom, lime sutil reforçando beam */}
      <pointLight position={[0, -2, 2]} intensity={0.8} color={LIME_DIM} distance={6} />

      {/* Studio HDR — provê reflexões realistas nas placas glass */}
      <Environment preset="studio" environmentIntensity={0.45} background={false} />

      {/* Volumetric lime beam (vertical, saindo do bottom) */}
      <VolumetricBeam />

      {/* Group placas — mouse parallax + idle drift */}
      <PlatesGroup />

      {/* Postprocessing — bloom dramático nos highlights lime */}
      <EffectComposer enableNormalPass={false}>
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.85}
          luminanceSmoothing={0.2}
          mipmapBlur
          radius={0.7}
        />
      </EffectComposer>
    </>
  );
}

// ============================================================
// Volumetric Beam — cone invertido com shader gradient additive
// Lime forte no bottom, fade pra transparente no top
// ============================================================

function VolumetricBeam() {
  const meshRef = useRef<THREE.Mesh>(null);
  const reduced = useReducedMotionSafe();

  // Custom shader material — gradient vertical lime → transparente
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: {
        uColor: { value: new THREE.Color('#d2ff00') },
        uIntensity: { value: 0.65 },
        uTime: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform vec3 uColor;
        uniform float uIntensity;
        uniform float uTime;

        void main() {
          // Vertical gradient — bottom intenso, top fade
          // vUv.y vai 0 (base do cone, topo do mundo) → 1 (ponta do cone, fundo)
          // Como giramos π no eixo X, invertemos: base do mundo = vUv.y high
          float vertical = smoothstep(0.0, 0.95, vUv.y);
          float fadeBottom = smoothstep(1.0, 0.0, vUv.y);

          // Radial soft fade dos lados (suaviza beam edges)
          float radial = 1.0 - smoothstep(0.0, 0.5, abs(vUv.x - 0.5) * 2.0);

          // Subtle breathing pulse (sutil, não pisca)
          float pulse = 0.92 + 0.08 * sin(uTime * 0.4);

          float alpha = fadeBottom * radial * uIntensity * pulse;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });
  }, []);

  useFrame((state) => {
    if (reduced !== false) return;
    const uTime = material.uniforms.uTime;
    if (uTime) uTime.value = state.clock.getElapsedTime();
  });

  return (
    <mesh
      ref={meshRef}
      geometry={BEAM_GEOMETRY}
      material={material}
      // Inverter Y: cone aponta pra baixo originalmente → rotação π pra apontar pra cima
      // Posicionar: base do cone bem no bottom da viewport (y = -3), ponta vai pra cima
      position={[0, -1, -0.2]}
      rotation={[Math.PI, 0, 0]}
    />
  );
}

// ============================================================
// Plates group — mouse parallax + idle sine drift
// ============================================================

function PlatesGroup() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const reduced = useReducedMotionSafe();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (reduced !== false) return;

    const t = state.clock.getElapsedTime();

    // Idle drift — período longo (~20s loop), sine inOut desalinhado X/Y
    // pra não criar pattern repetitivo perceptível (Lissajous-ish)
    const idleY = Math.sin(t * (Math.PI / 10)) * 0.05; // 20s loop, ±2.8°
    const idleX = Math.cos(t * (Math.PI / 14)) * 0.03; // 28s loop, ±1.7°

    // Mouse parallax — 12-16° rotation Y (0.22 rad ≈ 12.6°)
    const targetRotY = pointer.x * 0.24 + idleY;
    const targetRotX = -pointer.y * 0.14 + idleX;

    // Lerp suave (≈ spring stiffness 80, damping 25 vibe)
    const k = Math.min(1, delta * 3.2);
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * k;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * k;
  });

  return (
    <group ref={groupRef}>
      {/* V-shape composition — central frontmost, laterais recuadas em Z */}

      {/* Plate L — esquerda, rotated -8°, recuada Z */}
      <Float
        speed={0.8}
        rotationIntensity={0.15}
        floatIntensity={0.2}
        floatingRange={[-0.05, 0.05]}
      >
        <Plate position={[-1.55, 0.15, -1.0]} rotation={[0, -0.14, 0.025]} />
      </Float>

      {/* Plate R — direita, rotated +8°, recuada Z */}
      <Float
        speed={0.7}
        rotationIntensity={0.15}
        floatIntensity={0.25}
        floatingRange={[-0.05, 0.05]}
      >
        <Plate position={[1.55, -0.1, -1.0]} rotation={[0, 0.14, -0.025]} />
      </Float>

      {/* Plate C — frontmost, lime emissive border */}
      <Float
        speed={0.6}
        rotationIntensity={0.08}
        floatIntensity={0.15}
        floatingRange={[-0.04, 0.04]}
      >
        <Plate position={[0, 0, 0.95]} rotation={[0, 0, 0]} emissive />
      </Float>
    </group>
  );
}

// ============================================================
// Plate — refractive glass + outline wireframe
// ============================================================

interface PlateProps {
  position: [number, number, number];
  rotation: [number, number, number];
  emissive?: boolean;
}

function Plate({ position, rotation, emissive = false }: PlateProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main refractive plate */}
      <mesh geometry={PLATE_GEOMETRY} castShadow={false} receiveShadow={false}>
        <meshPhysicalMaterial
          color={GLASS_TINT}
          transmission={0.95}
          thickness={0.3}
          ior={1.45}
          roughness={0.1}
          metalness={0}
          clearcoat={0.5}
          clearcoatRoughness={0.15}
          envMapIntensity={1.2}
          attenuationColor={LIME_DIM}
          attenuationDistance={3.0}
          transparent
          opacity={0.94}
        />
      </mesh>

      {/* Emissive border — placa central recebe outline lime via wireframe geo */}
      {emissive ? <EmissiveBorder /> : <SubtleBorder />}
    </group>
  );
}

// Lime emissive border — geometry slightly larger, wireframe with bloom-bait material
function EmissiveBorder() {
  // Frame slightly forward (z+) pra evitar z-fighting com placa
  return (
    <>
      {/* Top edge */}
      <mesh position={[0, 1.15, 0.035]}>
        <boxGeometry args={[1.56, 0.012, 0.012]} />
        <meshBasicMaterial color={LIME} toneMapped={false} />
      </mesh>
      {/* Bottom edge */}
      <mesh position={[0, -1.15, 0.035]}>
        <boxGeometry args={[1.56, 0.012, 0.012]} />
        <meshBasicMaterial color={LIME} toneMapped={false} />
      </mesh>
      {/* Left edge */}
      <mesh position={[-0.775, 0, 0.035]}>
        <boxGeometry args={[0.012, 2.3, 0.012]} />
        <meshBasicMaterial color={LIME} toneMapped={false} />
      </mesh>
      {/* Right edge */}
      <mesh position={[0.775, 0, 0.035]}>
        <boxGeometry args={[0.012, 2.3, 0.012]} />
        <meshBasicMaterial color={LIME} toneMapped={false} />
      </mesh>
    </>
  );
}

// Subtle dark border pra placas laterais — definir silhueta sem competir com emissive
function SubtleBorder() {
  const borderColor = new THREE.Color('#3a4035');
  return (
    <>
      <mesh position={[0, 1.15, 0.035]}>
        <boxGeometry args={[1.56, 0.008, 0.008]} />
        <meshBasicMaterial color={borderColor} />
      </mesh>
      <mesh position={[0, -1.15, 0.035]}>
        <boxGeometry args={[1.56, 0.008, 0.008]} />
        <meshBasicMaterial color={borderColor} />
      </mesh>
      <mesh position={[-0.775, 0, 0.035]}>
        <boxGeometry args={[0.008, 2.3, 0.008]} />
        <meshBasicMaterial color={borderColor} />
      </mesh>
      <mesh position={[0.775, 0, 0.035]}>
        <boxGeometry args={[0.008, 2.3, 0.008]} />
        <meshBasicMaterial color={borderColor} />
      </mesh>
    </>
  );
}
