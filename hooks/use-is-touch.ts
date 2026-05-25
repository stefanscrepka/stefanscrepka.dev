'use client';

import { useEffect, useState } from 'react';

// Detecta touch device via media query CSS — mais confiável que ontouchstart
// (Chrome desktop com DevTools mobile emulation passa ambos). Match true em
// iPhone/iPad/Android, false em desktop (mouse). null durante SSR pra evitar
// hydration mismatch (mesmo pattern de useReducedMotionSafe).

const TOUCH_QUERY = '(hover: none) and (pointer: coarse)';

export function useIsTouch(): boolean | null {
  const [isTouch, setIsTouch] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(TOUCH_QUERY);
    setIsTouch(mql.matches);

    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return isTouch;
}
