'use client';

import { type RefObject, useEffect } from 'react';

// F3.5 (2026-06-11): pausa animações CSS infinitas quando o elemento sai da
// viewport (hairline-breathe do footer, manifesto-beam-drift). Animações de
// atmosfera rodavam 100% do tempo mesmo fora da tela — custo de compositing
// contínuo em low-end. IntersectionObserver alterna animation-play-state.
//
// Não se aplica ao GrainOverlay: position fixed inset-0 = sempre
// intersectando por definição (documentado no ROADMAP F3.5).
//
// Pausar/retomar um loop ease-in-out infinito no meio do ciclo não salta —
// o keyframe continua de onde parou.

export function usePausedOffscreen<T extends HTMLElement | null>(ref: RefObject<T>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => {
      el.style.animationPlayState = entry?.isIntersecting ? 'running' : 'paused';
    });
    io.observe(el);
    return () => {
      io.disconnect();
      el.style.animationPlayState = '';
    };
  }, [ref]);
}
