'use client';

import type Lenis from 'lenis';
import { useEffect, useState } from 'react';
import { useIsTouch } from '@/hooks/use-is-touch';
import { LenisContext } from '@/hooks/use-lenis';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';

interface LenisProviderProps {
  children: React.ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const reduced = useReducedMotionSafe();
  const isTouch = useIsTouch();

  useEffect(() => {
    // W-perf #2: GSAP + Lenis (40 KB gz) carregados via dynamic import APÓS
    // o bail-out de reduced/touch. Antes static import vazava o bundle pra
    // toda rota — mobile/touch (que NUNCA inicializa Lenis) pagava o custo.
    if (reduced !== false || isTouch !== false) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const { initSmoothScroll, destroySmoothScroll } = await import(
        '@/lib/animation/gsap-lenis-sync'
      );
      if (cancelled) return;

      const instance = initSmoothScroll({ duration: 1.2, smoothWheel: true });
      setLenis(instance);

      cleanup = () => {
        destroySmoothScroll();
        setLenis(null);
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [reduced, isTouch]);

  // Pause Lenis quando Radix Dialog abre (seta body[data-scroll-locked]).
  // Sem isso, scroll vaza atrás do modal em mobile (syncTouch:true especialmente).
  useEffect(() => {
    if (!lenis || typeof window === 'undefined') return;
    const body = document.body;
    const checkAndApply = () => {
      const locked = body.hasAttribute('data-scroll-locked');
      if (locked) lenis.stop();
      else lenis.start();
    };
    // Verifica estado atual on mount (caso modal já esteja aberto)
    checkAndApply();
    const observer = new MutationObserver(checkAndApply);
    observer.observe(body, { attributes: true, attributeFilter: ['data-scroll-locked'] });
    return () => observer.disconnect();
  }, [lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
