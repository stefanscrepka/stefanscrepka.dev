'use client';

import dynamic from 'next/dynamic';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';
import { HeroPoster } from './hero-poster';

// Client wrapper: lazy-imports HeroScene3D via dynamic({ ssr: false }) — evita
// SSR Canvas hydration mismatch (gotcha #4) e o bundle three.js (~245KB) só
// carrega quando reduced-motion=false. Em reduced-motion, sempre renderiza
// HeroPoster SVG (zero JS).
//
// Fix do retângulo branco bug:
//   - Sempre renderizar wrapper div com className aplicada (className do
//     consumer NUNCA é perdida em nenhuma branch)
//   - Wrapper sempre tem bg-(--color-base) + inline style fallback (caso
//     OKLCH não compute)
//   - HeroPoster e HeroScene3D internos preenchem 100% do wrapper

const HeroScene3DLazy = dynamic(() => import('./scene-3d').then((m) => ({ default: m.default })), {
  ssr: false,
  loading: () => <HeroPoster alt="" />,
});

interface HeroSceneClientProps {
  className?: string | undefined;
}

export function HeroSceneClient({ className }: HeroSceneClientProps) {
  const reduced = useReducedMotionSafe();
  const useFallback = reduced !== false;

  return (
    <div
      data-slot="hero-scene-wrapper"
      data-reduced={String(useFallback)}
      className={cn('relative overflow-hidden bg-(--color-base)', className)}
      style={{ backgroundColor: '#080A07' }}
    >
      {useFallback ? (
        <HeroPoster
          className="absolute inset-0 h-full w-full"
          alt="Três placas de vidro refractive representando os 3 produtos em produção: NexaCore, Content Engine, STJ App"
        />
      ) : (
        <HeroScene3DLazy className="absolute inset-0 h-full w-full" />
      )}
    </div>
  );
}
