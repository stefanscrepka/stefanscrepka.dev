'use client';

import { m, useInView } from 'motion/react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { CircuitVisual, SquadsVisual, StackVisual } from './what-i-build';

// Cards "O que eu construo" — 3 blocos VERTICAIS 85dvh cada (não grid 3-col).
// Number "01/02/03" GIGANTE 240px lime opacity 8% atrás do conteúdo (não top-right pequeno).
// Diagrams sangram outline 60% do bloco (não thumbnail num card).
// Layout próprio por bloco: 01 diagonal sweep, 02 grid invertido, 03 centralizado.

export interface WhatIBuildCardData {
  eyebrow: string;
  title: string;
  body: string;
  visual: 'squads' | 'stack' | 'circuit';
  pillars: string[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.165, 0.84, 0.44, 1] as const },
  },
};

const VISUAL_MAP = {
  squads: SquadsVisual,
  stack: StackVisual,
  circuit: CircuitVisual,
} as const;

interface WhatIBuildGridProps {
  cards: WhatIBuildCardData[];
  className?: string | undefined;
}

export function WhatIBuildGrid({ cards, className }: WhatIBuildGridProps) {
  return (
    <ol className={cn('flex flex-col', className)}>
      {cards.map((card, idx) => (
        <ModeBlock key={card.title} card={card} index={idx} />
      ))}
    </ol>
  );
}

function ModeBlock({ card, index }: { card: WhatIBuildCardData; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -120px 0px' });
  const VisualComponent = VISUAL_MAP[card.visual];
  const isReversed = index === 1; // bloco 02 grid invertido (text-LEFT visual-RIGHT)

  return (
    <m.li
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={itemVariants}
      data-slot="mode-block"
      data-visual={card.visual}
      data-index={index}
      className={cn(
        'group/block relative isolate flex min-h-[85dvh] flex-col justify-center overflow-hidden',
        index > 0 && 'border-t border-(--color-hairline)'
      )}
    >
      {/* Number GIGANTE 240px lime opacity 8% atrás de tudo */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute select-none font-mono font-bold leading-none tabular-nums',
          'text-[160px] sm:text-[220px] lg:text-[280px]',
          isReversed ? 'right-[-2vw]' : 'left-[-2vw]',
          'top-1/2 -translate-y-1/2'
        )}
        style={{
          color: 'var(--color-accent)',
          opacity: 0.06,
          letterSpacing: '-0.04em',
        }}
      >
        {card.eyebrow}
      </span>

      <div className="container-max relative z-10 grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
        {/* Visual side */}
        <div className={cn('relative h-64 sm:h-80 lg:h-[60vh]', isReversed && 'lg:order-2')}>
          <VisualComponent />
        </div>

        {/* Text side */}
        <div className={cn('flex flex-col gap-5', isReversed && 'lg:order-1')}>
          <p className="font-mono text-xs uppercase tracking-widest text-(--color-accent)">
            <span className="tabular-nums">{card.eyebrow}</span>
            <span className="mx-2 text-(--color-text-3)">/</span>
            <span className="text-(--color-text-3)">03</span>
          </p>

          <h3 className="text-3xl font-bold leading-[0.95] tracking-tight text-(--color-text-1) sm:text-4xl lg:text-5xl">
            {card.title}
          </h3>

          <p className="text-base leading-relaxed text-(--color-text-2)">{card.body}</p>

          <ul className="mt-2 flex flex-wrap gap-1.5">
            {card.pillars.map((pillar) => (
              <li
                key={pillar}
                className="rounded-md border border-(--color-hairline-strong) bg-(--color-surface-elevated) px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-(--color-text-3)"
              >
                {pillar}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </m.li>
  );
}
