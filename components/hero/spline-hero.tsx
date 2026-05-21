'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// Spline scene CC0 — community asset gratuito.
// Stefan: substituir URL abaixo quando exportar Glass Materials do community
// (https://app.spline.design/community/file/1813aafd-d1e9-4df6-8f5f-cc8c89d52255)
// 1. Open community link → Remix → File → Export → Code Export → copy URL .splinecode
// 2. Paste URL aqui em SPLINE_SCENE_URL
// Por padrão usa um asset demo público enquanto Stefan nao exporta o final.
const SPLINE_SCENE_URL =
  process.env.NEXT_PUBLIC_SPLINE_HERO_URL ??
  'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode';

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
