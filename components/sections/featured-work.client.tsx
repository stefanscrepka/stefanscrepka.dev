'use client';

import { m, useInView } from 'motion/react';
import { Children, isValidElement, type ReactNode, useRef } from 'react';
import { EASES } from '@/lib/animation/eases';

// Pattern A — Stagger horizontal (Featured Work).
// Cards entram esquerda -> direita (x: -24 -> 0), stagger 80ms, ease-dramatic.
// Disney overlapping action: ritmo tic-tac-tic. Casa com sequencia narrativa
// 01/02/03 dos 3 produtos (jornada/pipeline visual).
//
// Cada child direto e tratado como item do stagger. Container faz reveal global
// uma vez (useInView once: true), filhos animam em sequencia.

interface FeaturedWorkRevealProps {
  children: ReactNode;
}

const itemVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0 },
};

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
        return (
          <m.div
            // biome-ignore lint/suspicious/noArrayIndexKey: children sao 2 nodes estaveis (HeroTile + half-tiles row)
            key={`stagger-${idx}`}
            variants={itemVariants}
            transition={{ duration: 0.6, ease: EASES.dramatic }}
          >
            {child}
          </m.div>
        );
      })}
    </m.div>
  );
}
