'use client';

import { useCallback } from 'react';
import { useLenis } from '@/hooks/use-lenis';

// Smooth-scroll utility para hash anchors usando Lenis quando disponível,
// fallback nativo (instant — respeita reduced-motion via scroll-behavior CSS) caso contrário.
//
// Offset default = -(--scroll-anchor-offset) CSS var (single source of truth com :target).
// Lê em runtime; falha graceful pra -96 (=6rem).

interface ScrollOptions {
  offset?: number;
  duration?: number;
}

function getDefaultOffset(): number {
  if (typeof window === 'undefined') return -96;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--scroll-anchor-offset')
    .trim();
  if (!raw) return -96;
  const num = Number.parseFloat(raw);
  if (Number.isNaN(num)) return -96;
  const rootSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return raw.endsWith('rem') ? -(num * rootSize) : -num;
}

export function useAnchorScroll() {
  const lenis = useLenis();

  return useCallback(
    (href: string, opts: ScrollOptions = {}) => {
      if (typeof window === 'undefined') return;
      const { offset = getDefaultOffset(), duration = 1.2 } = opts;

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
