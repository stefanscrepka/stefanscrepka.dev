'use client';

import { useState } from 'react';
import { useMounted } from '@/hooks/use-mounted';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// Spline scene CC0 — Glass Materials embedded via iframe oficial.
// `my.spline.design/[SLUG]/` e a URL publica de compartilhamento que o Spline
// gera para qualquer projeto exportado. O scene .splinecode tem CORS bloqueado
// pra @splinetool/react-spline em cross-origin, mas iframe e a forma oficial
// de embed e funciona sem auth nem build/bundle pesado.
//
// Override via env: NEXT_PUBLIC_SPLINE_HERO_URL=https://my.spline.design/...
const SPLINE_EMBED_URL =
  process.env.NEXT_PUBLIC_SPLINE_HERO_URL ??
  'https://my.spline.design/glassmaterials-eBnWeckUI283to0CikuXZltb/';

interface SplineHeroProps {
  className?: string;
}

export function SplineHero({ className }: SplineHeroProps) {
  const reduced = useReducedMotionSafe();
  const mounted = useMounted();
  const [loaded, setLoaded] = useState(false);

  // Reduced-motion → placeholder estatico (Spline asset rotaciona/anima sozinho).
  // SSR → placeholder ate hidratar (evita FOUC + permite controle de load).
  if (reduced || !mounted) {
    return (
      <div className={cn('relative w-full', className)} aria-hidden="true">
        <SplinePlaceholder />
      </div>
    );
  }

  return (
    <div
      className={cn('relative w-full overflow-hidden', 'aspect-square max-w-[520px]', className)}
      aria-hidden="true"
      data-slot="spline-hero"
    >
      {/* Placeholder sob iframe pra cover o periodo de carregamento (~2-4s).
          Fade out depois do iframe disparar onLoad. */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-(--motion-page) ease-(--ease-smooth)',
          loaded ? 'pointer-events-none opacity-0' : 'opacity-100'
        )}
      >
        <SplinePlaceholder />
      </div>
      {/* Iframe Spline. mix-blend-mode nao funciona em iframe (stacking context
          isolado). Solucao: radial mask sobre o iframe que fade do branco do
          Spline pro dark do site nos cantos — asset central permanece visivel,
          bordas fundem com a atmosfera lime do hero. Stefan: exportar com
          background transparente no Spline editor (File > Settings > Scene >
          Background alpha 0) deixa essa mascara ainda mais limpa. */}
      <iframe
        src={SPLINE_EMBED_URL}
        title="Glass Materials — cena 3D decorativa"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className="absolute inset-0 h-full w-full border-0"
        style={{ background: 'transparent' }}
        allow="autoplay; xr-spatial-tracking"
      />
      {/* Radial fade overlay — branco do iframe vira dark base nos cantos.
          Asset 3D no center fica nitido, cantos fundem com a section. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 30%, var(--color-base) 85%)',
        }}
      />
      {/* Watermark "Built with Spline" sumido — canto inferior direito coberto
          por bg-base solido (free tier mostra watermark mesmo CC0). */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 h-10 w-32 bg-(--color-base)"
      />
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
