'use client';

import dynamic from 'next/dynamic';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';
import { HeroPoster } from './hero-poster';

// ============================================================
// HeroSceneClient — client wrapper que escolhe entre canvas r3f vs poster 2D.
//
// Lazy-import HeroScene3D via dynamic({ ssr: false }):
//   - Evita SSR Canvas hydration mismatch (gotcha #4 do Next 16)
//   - Bundle three.js (~245KB) só carrega quando reduced-motion=false
//   - Em reduced-motion, sempre renderiza HeroPoster SVG (zero JS)
//
// Wrapper sempre tem:
//   - className do consumer aplicado (nunca perdida em branch)
//   - bg-(--color-base) + inline style fallback (caso OKLCH não compute)
//   - HeroPoster e HeroScene3D internos preenchem 100% via absolute inset-0
//
// Anti-rectangle-bug:
//   Em nenhum momento renderizamos um div vazio com bg branco. O wrapper
//   é dark desde o primeiro paint; o HeroPoster preenche imediatamente.
// ============================================================

const HeroScene3DLazy = dynamic(() => import('./scene-3d').then((m) => ({ default: m.default })), {
  ssr: false,
  // Loading state = HeroPoster (mesmo visual final, sem flash branco)
  loading: () => <HeroPoster alt="" />,
});

interface HeroSceneClientProps {
  className?: string | undefined;
}

// TEMP (2026-05-20): r3f Canvas tem bug "Cannot read properties of null (reading 'alpha')"
// no Next 16.2.6 + @react-three/fiber 9.x — provavelmente EffectComposer/Environment HDR
// ou MeshPhysicalMaterial transmission. HeroPoster (SVG/CSS) já entrega o mesmo conceito
// cinematográfico (dark + lime beam + 3 placas perspective). Force fallback até debugar
// o canvas isoladamente. Toda a infra de loading/reduced-motion permanece intacta.
const FORCE_POSTER = true;

export function HeroSceneClient({ className }: HeroSceneClientProps) {
  const reduced = useReducedMotionSafe();
  // reduced === null durante pre-mount → tratar como fallback (poster) até confirmar
  const useFallback = FORCE_POSTER || reduced !== false;

  return (
    <div
      data-slot="hero-scene-wrapper"
      data-reduced={String(useFallback)}
      className={cn('relative overflow-hidden bg-(--color-base)', className)}
    >
      {useFallback ? (
        <HeroPoster
          className="absolute inset-0 h-full w-full"
          alt="Palco cinematográfico escuro com três placas de vidro flutuando — esquerda recuada, central frontmost com borda lime emissive, direita recuada. Feixe de luz lime vertical saindo do bottom representando a luz volumétrica do palco."
        />
      ) : (
        <HeroScene3DLazy className="absolute inset-0 h-full w-full" />
      )}
    </div>
  );
}
