'use client';

import { domMax, LazyMotion } from 'motion/react';
import { type ReactNode, useEffect } from 'react';

// LazyMotion strict: força uso de <m.X> em vez de <motion.X>.
// features=domMax cobre animations + variants + exit + gestures + layout + popLayout
// + drag — necessário pra <AnimatePresence mode="popLayout"> + <m.div layout> do
// parens-viz no playground (domAnimation antes quebrava silenciosamente o overshoot).
// Custo: ~+5KB gzip vs domAnimation (aceitável dado feature unlock).
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
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  );
}
