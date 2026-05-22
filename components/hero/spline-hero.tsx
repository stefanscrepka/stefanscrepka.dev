'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// Spline scene CC0 — Glass Materials asset (Stefan dropou .spline local em
// public/hero/). @splinetool/react-spline aceita URL relativa pra arquivo
// binario Spline servido como static.
// Override via env: NEXT_PUBLIC_SPLINE_HERO_URL=https://prod.spline.design/...
const SPLINE_SCENE_URL = process.env.NEXT_PUBLIC_SPLINE_HERO_URL ?? '/hero/glass_materials.spline';

// Dynamic import client-only — react-spline NAO suporta SSR direto (Three.js).
// Loader fica leve (~3KB), spline runtime entra apos paint principal.
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <SplinePlaceholder />,
});

interface SplineHeroProps {
  className?: string;
}

export function SplineHero({ className }: SplineHeroProps) {
  const reduced = useReducedMotionSafe();
  const [supportsWebGL, setSupportsWebGL] = useState<boolean | null>(null);

  // Detect WebGL support before mounting Spline (evita falhas em mobile antigo).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      setSupportsWebGL(!!gl);
    } catch {
      setSupportsWebGL(false);
    }
  }, []);

  // Reduced-motion ou sem WebGL → placeholder estático sutil
  if (reduced || supportsWebGL === false) {
    return (
      <div className={cn('relative w-full', className)} aria-hidden="true">
        <SplinePlaceholder />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        'aspect-square max-w-[520px]',
        'pointer-events-auto',
        className
      )}
      aria-hidden="true"
      data-slot="spline-hero"
    >
      <Suspense fallback={<SplinePlaceholder />}>
        <Spline
          scene={SPLINE_SCENE_URL}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </Suspense>
    </div>
  );
}

/* Placeholder = aspect-square + atmosfera lime mais discreta.
   Mostrado antes do Spline carregar OU em reduced-motion OU sem WebGL.
   Sem ruído visual decorativo: o asset 3D é o protagonista, placeholder é mera presença. */
function SplinePlaceholder() {
  return (
    <div
      className={cn(
        'relative aspect-square w-full max-w-[520px] overflow-hidden rounded-2xl',
        'bg-(--color-surface)/40'
      )}
      style={{
        background:
          'radial-gradient(circle at 50% 50%, color-mix(in oklch, var(--color-accent) 6%, transparent) 0%, transparent 65%)',
      }}
    />
  );
}
