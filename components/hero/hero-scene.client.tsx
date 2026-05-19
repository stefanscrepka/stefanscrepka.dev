'use client';

import dynamic from 'next/dynamic';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { HeroPoster } from './hero-poster';

// Client wrapper: lazy-imports HeroScene3D via dynamic({ ssr: false }) — evita
// SSR Canvas hydration mismatch (gotcha #4) e o bundle three.js (~245KB) só
// carrega quando reduced-motion=false. Em reduced-motion, sempre renderiza
// HeroPoster SVG (zero JS).

const HeroScene3DLazy = dynamic(() => import('./scene-3d'), {
  ssr: false,
  loading: () => <HeroPoster />,
});

interface HeroSceneClientProps {
  className?: string;
}

export function HeroSceneClient({ className }: HeroSceneClientProps) {
  const reduced = useReducedMotionSafe();

  // null = não mounted ainda → renderiza poster (RSC-safe).
  // true = reduced-motion → poster permanente, nunca chama scene-3d.
  // false = motion OK → carrega lazy chunk r3f.
  if (reduced !== false) {
    return (
      <HeroPoster
        className={className}
        alt="Três placas de vidro refractive representando os 3 produtos em produção: NexaCore, Content Engine, STJ App"
      />
    );
  }

  return <HeroScene3DLazy />;
}
