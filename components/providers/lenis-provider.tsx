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

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
