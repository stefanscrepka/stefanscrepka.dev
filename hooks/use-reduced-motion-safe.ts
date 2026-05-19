'use client';

import { useReducedMotion } from 'motion/react';
import { useMounted } from './use-mounted';

// Gotcha #9: useReducedMotion retorna false no server e true/false no client
// dependendo de prefers-reduced-motion. Wrap em useMounted pra evitar
// hydration mismatch — sempre retorna null antes de mount.

export function useReducedMotionSafe(): boolean | null {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  return mounted ? Boolean(reduced) : null;
}
