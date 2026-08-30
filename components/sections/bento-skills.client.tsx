'use client';

import { m, useInView } from 'motion/react';
import { type ReactNode, useRef } from 'react';
import { EASES } from '@/lib/animation/eases';

// F3.2 (2026-06-11) — dieta de hidratação: esta ilha encolheu pra SÓ o reveal
// com stagger (useInView + m.ul/m.li). Tudo que era estado React no card
// (hover do PerimeterTrace, gates de reduced-motion no ping/progress) virou
// CSS puro e mora no BentoCell, que voltou a ser Server Component em
// bento-skills.tsx — o HTML dos 5 cards chega pronto do servidor e não
// hidrata mais. Os children entram aqui como slots RSC serializados.

// Pattern B — Scale entry (Bento Skills).
// W-motion #3: era EASES.snappy (overshoot back-out). Em grid de 6 cells com
// stagger 50ms, micro-overshoots somavam-se em jiggle coletivo. Apple HIG /
// Material recomendam easeOut PURO para grid reveals. EASES.outQuint dá curva
// dramática sem rebound — mais cinematic, sem ruído visual.
const itemVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASES.outQuint },
  },
};

export interface BentoRevealItem {
  key: string;
  /** Classes de span/altura do grid — calculadas no servidor por tamanho. */
  className: string;
  /** O BentoCell server-rendered. */
  children: ReactNode;
}

interface BentoRevealGridProps {
  items: BentoRevealItem[];
}

export function BentoRevealGrid({ items }: BentoRevealGridProps) {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -120px 0px' });

  return (
    <m.ul
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        // Disney overlapping action: 50ms stagger (era 100ms). Bento grid celula
        // reveal mais cinematográfico, sem sensação de cascade lento.
        visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
      }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-6 sm:gap-5"
    >
      {items.map((item) => (
        <m.li key={item.key} variants={itemVariants} className={item.className}>
          {item.children}
        </m.li>
      ))}
    </m.ul>
  );
}
