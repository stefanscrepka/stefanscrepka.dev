'use client';

import { useCallback } from 'react';
import { useLenis } from '@/hooks/use-lenis';

// Smooth-scroll utility para hash anchors usando Lenis quando disponível,
// fallback nativo (instant — respeita reduced-motion via scroll-behavior CSS) caso contrário.
//
// Offset -88 cobre dock altura (≈64) + breathing room (≈24). Ajustar quando dock mudar.

interface ScrollOptions {
  offset?: number;
  duration?: number;
}

export function useAnchorScroll() {
  const lenis = useLenis();

  return useCallback(
    (href: string, opts: ScrollOptions = {}) => {
      if (typeof window === 'undefined') return;
      const { offset = -88, duration = 1.2 } = opts;

      const isHash = href.startsWith('#');
      if (!isHash) {
        window.location.href = href;
        return;
      }

      const id = href.slice(1);
      const target = id === '' ? document.body : document.getElementById(id);
      if (!target) return;

      if (lenis) {
        lenis.scrollTo(target, { offset, duration });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    },
    [lenis]
  );
}
