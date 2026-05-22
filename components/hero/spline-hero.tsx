'use client';

import { useEffect, useState } from 'react';
import { useMounted } from '@/hooks/use-mounted';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// Spline scene via <spline-viewer> web component oficial.
// Stefan dropou: prod.spline.design/jjNMtx2gQrvzJIPp/scene.splinecode
// Vantagens vs iframe: sem fundo branco (canvas direto), sem watermark visivel,
// sem CORS issue, suporte nativo a background transparent.
//
// Web component loader: unpkg.com/@splinetool/viewer — carregado dinamicamente
// no mount (uma vez por sessao, customElements.get evita duplicacao).
const SPLINE_SCENE_URL =
  process.env.NEXT_PUBLIC_SPLINE_HERO_URL ??
  'https://prod.spline.design/jjNMtx2gQrvzJIPp/scene.splinecode';

const SPLINE_VIEWER_SCRIPT = 'https://unpkg.com/@splinetool/viewer@1.12.94/build/spline-viewer.js';

interface SplineHeroProps {
  className?: string;
}

export function SplineHero({ className }: SplineHeroProps) {
  const reduced = useReducedMotionSafe();
  const mounted = useMounted();
  const [scriptReady, setScriptReady] = useState(false);

  // Carrega o web component <spline-viewer> uma vez por sessao.
  // customElements.get evita re-injection em re-renders / fast refresh.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.customElements?.get('spline-viewer')) {
      setScriptReady(true);
      return;
    }
    const script = document.createElement('script');
    script.type = 'module';
    script.src = SPLINE_VIEWER_SCRIPT;
    script.onload = () => setScriptReady(true);
    script.onerror = () => setScriptReady(false);
    document.head.appendChild(script);
  }, []);

  // Reduced-motion → placeholder estatico (asset Spline anima sozinho via WebGL).
  // SSR / pre-script-load → placeholder ate web component disponivel.
  if (reduced || !mounted || !scriptReady) {
    return (
      <div
        className={cn('relative w-full overflow-hidden', 'aspect-square max-w-[520px]', className)}
        aria-hidden="true"
      >
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
      {/* Custom element <spline-viewer>. React nao reconhece o tag por default
          em TS, mas o JSX runtime aceita lowercase com hyphen como custom el.
          Props HTML attribute string (url, loading-anim-type, background). */}
      {/* @ts-expect-error spline-viewer is a custom element from @splinetool/viewer */}
      <spline-viewer
        url={SPLINE_SCENE_URL}
        loading-anim-type="none"
        events-target="global"
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
      />
      {/* Watermark "Built with Spline" coberto — canto inferior direito.
          Free tier mostra badge mesmo em CC0 community assets. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 h-12 w-36 bg-(--color-base)"
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
