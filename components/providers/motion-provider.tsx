'use client';

import { domAnimation, LazyMotion, MotionConfig } from 'motion/react';
import { type ReactNode, useEffect } from 'react';

// LazyMotion strict: força uso de <m.X> em vez de <motion.X>.
// W-perf #7: features=domAnimation (default global) cobre animations + variants
// + exit + gestures. Carrega ~5KB gz a MENOS que domMax. PlaygroundPage faz
// override local com LazyMotion features={domMax} pra suportar layout/popLayout
// usado pelo parens-viz (rota separada — não impacta home).
//
// MotionConfig reducedMotion="user" propaga preferência do SO pra todo Motion
// downstream — componentes individuais ainda podem usar useReducedMotionSafe
// pra decisões finas (ex: GSAP tween, classe CSS), mas Motion <m.*> default
// já respeita o user.
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
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
