'use client';

import { Bounds, OrbitControls, useBounds, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

// Visualizador de um mesh real (GLB exportado do 3MF/STL que vai pro
// fatiador; decimado no Blender, sem Draco porque a CSP do site não permite
// WASM). Cada malha recebe um MeshStandardMaterial "PLA" com a COR que veio
// no arquivo: no LEVITA são as cores reais dos filamentos do 3MF (#101010,
// #F2F2F2, #0056B8); na peça de CAD, o cinza neutro do prep.
//
// Só roda enquanto está na tela (frameloop "never" fora dela) e só gira
// sozinho quando o usuário não pediu menos movimento. Arrastar gira; zoom e
// pan desligados: é uma peça na mão, não um CAD.

interface ModelViewerCanvasProps {
  src: string;
  active: boolean;
  autoRotate: boolean;
}

function PrintedPart({ src }: { src: string }) {
  // useDraco=false E useMeshopt=false: os GLBs não são comprimidos e a CSP do
  // site bloqueia WASM. O F8 desligou só o Draco; o terceiro parâmetro do drei
  // (meshopt) fica ligado por padrão e instanciava o MeshoptDecoder em WASM —
  // CompileError no console da home em toda visita (medido em F9).
  const { scene } = useGLTF(src, false, false);
  const bounds = useBounds();
  const materials = useMemo(() => [] as THREE.MeshStandardMaterial[], []);

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const src = mesh.material as THREE.Material & { color?: THREE.Color };
      const color = src?.color ? src.color.clone() : new THREE.Color('#e9e6df');
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0.02 });
      materials.push(mat);
      mesh.material = mat;
    });
    return () => {
      for (const m of materials.splice(0)) m.dispose();
    };
  }, [scene, materials]);

  // Enquadra DEPOIS do mesh existir (e de novo a cada troca de peça).
  useEffect(() => {
    // biome-ignore lint/suspicious/noFocusedTests: API do Bounds do drei, não é teste
    const id = requestAnimationFrame(() => bounds.refresh(scene).clip().fit());
    return () => cancelAnimationFrame(id);
  }, [scene, bounds]);

  return <primitive object={scene} />;
}

export function ModelViewerCanvas({ src, active, autoRotate }: ModelViewerCanvasProps) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ fov: 32, near: 0.1, far: 200, position: [0, 0, 8] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      style={{ touchAction: 'pan-y' }}
    >
      <hemisphereLight intensity={0.85} color="#ffffff" groundColor="#1a1a18" />
      <directionalLight position={[4, 6, 5]} intensity={1.5} />
      <directionalLight position={[-5, 2, -4]} intensity={0.45} />
      <Bounds fit clip observe margin={0.92}>
        {/* +Y do glTF (a face da peça, Z-up no Blender) de frente pra câmera,
            com uma inclinação curta pra ler a profundidade. Sem giro em Z: a
            peça fica no prumo (o F7 tinha PI/8 e o Stefan achou "torta"). */}
        <group rotation={[Math.PI / 2.35, 0, 0]}>
          <PrintedPart src={src} />
        </group>
      </Bounds>
      <OrbitControls
        makeDefault
        enableZoom={false}
        enablePan={false}
        autoRotate={autoRotate && active}
        autoRotateSpeed={0.8}
        rotateSpeed={0.7}
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
