'use client';

import { domAnimation, LazyMotion } from 'motion/react';
import type { ReactNode } from 'react';

// LazyMotion strict: força uso de <m.X> em vez de <motion.X> (~4-6KB savings
// tree-shaking inicial). features=domAnimation cobre animations + variants +
// exit + hover/tap/focus gestures usados no FloatingDock. Hooks (useMotionValue,
// useSpring, useTransform, useReducedMotion) funcionam normalmente.

interface MotionProviderProps {
  children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
