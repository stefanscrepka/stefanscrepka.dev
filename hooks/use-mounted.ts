'use client';

import { useEffect, useState } from 'react';

// Gotcha #9: SSR-safe mounted flag, usado pra evitar hydration mismatch
// em hooks que dependem de browser APIs (matchMedia, window, etc.).

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
