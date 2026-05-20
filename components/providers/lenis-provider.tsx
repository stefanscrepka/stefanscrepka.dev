'use client';

import type Lenis from 'lenis';
import { useEffect, useState } from 'react';
import { LenisContext } from '@/hooks/use-lenis';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { destroySmoothScroll, initSmoothScroll } from '@/lib/animation/gsap-lenis-sync';

interface LenisProviderProps {
  children: React.ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    // Não inicia Lenis se prefers-reduced-motion ou ainda não mounted (null)
    if (reduced !== false) return;

    const instance = initSmoothScroll({
      duration: 1.2,
      smoothWheel: true,
      syncTouch: true,
    });
    setLenis(instance);

    return () => {
      destroySmoothScroll();
      setLenis(null);
    };
  }, [reduced]);

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
