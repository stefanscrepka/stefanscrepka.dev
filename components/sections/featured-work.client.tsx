'use client';

import { m, useInView } from 'motion/react';
import { Children, isValidElement, type ReactNode, useRef } from 'react';
import { EASES } from '@/lib/animation/eases';

// Pattern A — Stagger Featured Work.
// W-motion #2: ANTES todos os children entravam x:-24 (esquerda → direita).
// Em half-tiles ESPELHADOS (NexaCore text-left, STJ text-right), a entrada
// uniforme violava Disney Staging — direção precisa espelhar layout.
// AGORA: HeroTile entra y:24 (de baixo, vertical statement). Os 2 children
// seguintes (que viram half-tiles row) entram x:-24 e x:+24 — alinha com
// espelhamento layout. Disney Arc + Secondary Action.
//
// Container faz reveal global uma vez (useInView once: true), filhos animam
// em sequencia 80ms stagger ease-dramatic.

interface FeaturedWorkRevealProps {
  children: ReactNode;
}

const FALLBACK_VARIANT = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};
const VARIANTS_BY_INDEX = [
  // Idx 0 = HeroTile (full-width Content Engine). Entrada vertical statement.
  FALLBACK_VARIANT,
  // Idx 1 = half-tiles row container — entra de baixo também (linha visual
  // unitária, half-tiles individualmente espelham só visualmente, não em motion).
  FALLBACK_VARIANT,
];

export function FeaturedWorkReveal({ children }: FeaturedWorkRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -120px 0px' });

  return (
    <m.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
      }}
    >
      {Children.map(children, (child, idx) => {
        if (!isValidElement(child)) return child;
        const variant = VARIANTS_BY_INDEX[idx] ?? FALLBACK_VARIANT;
        return (
          <m.div
            // biome-ignore lint/suspicious/noArrayIndexKey: children sao 2 nodes estaveis (HeroTile + half-tiles row)
            key={`stagger-${idx}`}
            variants={variant}
            transition={{ duration: 0.6, ease: EASES.dramatic }}
          >
            {child}
          </m.div>
        );
      })}
    </m.div>
  );
}
