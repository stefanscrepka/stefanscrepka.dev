'use client';

import { domAnimation, LazyMotion } from 'motion/react';
import { type ReactNode, useEffect } from 'react';

// LazyMotion strict: força uso de <m.X> em vez de <motion.X> (~4-6KB savings
// tree-shaking inicial). features=domAnimation cobre animations + variants +
// exit + hover/tap/focus gestures usados no FloatingDock. Hooks (useMotionValue,
// useSpring, useTransform, useReducedMotion) funcionam normalmente.
//
// Também responsável por liberar o gate FOUC `data-pre-hydration` no <html>
// após mount client (set inline em app/layout.tsx <head> script).

interface MotionProviderProps {
  children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  useEffect(() => {
    // Remove o gate FOUC após primeiro mount client.
    // GSAP-based reveals já registraram seus tweens via useGSAP até aqui;
    // o frame seguinte revela elementos com `anim-pre-hidden` via animação.
    delete document.documentElement.dataset.preHydration;
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
