'use client';

import { m } from 'motion/react';
import { useRef } from 'react';
import { usePausedOffscreen } from '@/hooks/use-paused-offscreen';
import { EASES } from '@/lib/animation/eases';

// Ilhas client do Footer (RSC) — duas responsabilidades pequenas:
//
// 1. FooterBreathingHairline — F3.5 (2026-06-11): a hairline lime que
//    "respira" (hairline-breathe 4s infinite) agora pausa fora da viewport
//    via IntersectionObserver. O footer só é visto no fim da página; o loop
//    rodava o tempo inteiro em toda rota.
//
// 2. FooterClosing — F3.9 (2026-06-11): a frase peak-end ("Se não funciona
//    24/7, não conta.") ganha um beat próprio — fade + rise discreto quando
//    entra na viewport, com o "— stefan" assentando levemente depois.
//    Sem scale, sem glow novo: calmo, uma vez só (once), ease do sistema.
//    Reduced-motion: MotionConfig reducedMotion="user" global remove o
//    transform e preserva o conteúdo.

export function FooterBreathingHairline() {
  const ref = useRef<HTMLDivElement>(null);
  usePausedOffscreen(ref);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-px motion-safe:[animation:hairline-breathe_4s_ease-in-out_infinite]"
      style={{
        background:
          'linear-gradient(to right, transparent 0%, var(--color-accent) 50%, transparent 100%)',
        opacity: 0.4,
      }}
    />
  );
}

export function FooterClosing() {
  return (
    <m.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: EASES.outQuint }}
      className="max-w-2xl text-base leading-snug text-(--color-text-1) sm:text-lg"
      style={{ letterSpacing: '-0.015em' }}
    >
      Se não funciona 24/7, não conta.{' '}
      <m.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.45, ease: EASES.standard }}
        className="text-(--color-text-3)"
      >
        — stefan
      </m.span>
    </m.p>
  );
}
