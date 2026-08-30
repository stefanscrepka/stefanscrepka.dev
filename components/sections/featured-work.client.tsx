'use client';

import { m, useInView } from 'motion/react';
import { Children, isValidElement, type ReactNode, useRef } from 'react';
import { EASES } from '@/lib/animation/eases';

// Pattern A — Stagger Featured Work.
// W-audit (2026-06-10): comentário corrigido pra refletir o que EXISTE —
// ambos os children (HeroTile e a row de half-tiles) entram y:24 como
// statement vertical em linha única (decisão W-motion #2 final); o
// espelhamento dos half-tiles é só de layout, não de motion.
//
// Container faz reveal global uma vez (useInView once: true), filhos animam
// em sequencia 80ms stagger ease-dramatic.

interface FeaturedWorkRevealProps {
  children: ReactNode;
  /** Classes de layout do container (flex/gap) — aplicadas no m.div raiz.
      W-audit (2026-06-10): antes o layout vivia num <div> intermediário que
      virava FILHO ÚNICO deste reveal — o stagger de 80ms nunca existiu na
      tela (tiles entravam em bloco monolítico). Agora os tiles são children
      diretos e o container recebe o layout via esta prop. */
  className?: string;
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

export function FeaturedWorkReveal({ children, className }: FeaturedWorkRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -120px 0px' });

  return (
    <m.div
      ref={ref}
      className={className}
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
