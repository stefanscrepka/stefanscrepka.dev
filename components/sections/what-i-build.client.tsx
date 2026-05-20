'use client';

import { m, useInView } from 'motion/react';
import { useRef } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';
import { CircuitVisual, SquadsVisual, StackVisual } from './what-i-build';

// Cards "O que eu construo" — 3 blocos VERTICAIS 85dvh cada (não grid 3-col).
// Number "01/02/03" GIGANTE atrás (lime 6% opacity).
// VISUAL é um FRAME cinematográfico (aspect 4/3) com hairline outline +
// inset highlight + 3-layer shadow — não SVG flutuando sem container.
// Hover: lift -2px + lime border glow expand 600ms ease-smooth.

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

const CAPTION_BY_VISUAL: Record<WhatIBuildCardData['visual'], string> = {
  squads: '5 squads · 22 agents · HITL central',
  stack: 'frontend · backend · data',
  circuit: 'queue · job · breaker · retry',
};

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
  const reduced = useReducedMotionSafe();
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
      {/* Number GIGANTE 240px lime opacity 6% atrás de tudo */}
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
        {/* Visual side — FRAME cinematográfico */}
        <div className={cn('relative', isReversed && 'lg:order-2')}>
          <m.div
            data-slot="visual-frame"
            className={cn(
              'relative isolate w-full overflow-hidden rounded-2xl',
              'shadow-(--shadow-cinema)',
              'transition-shadow duration-(--motion-modal) ease-(--ease-smooth)',
              'group-hover/block:shadow-[var(--shadow-cinema),0_0_64px_var(--color-accent-emissive)]'
            )}
            style={{
              aspectRatio: '4 / 3',
              backgroundColor: 'var(--color-base)',
              border: '1px solid var(--color-hairline-strong)',
            }}
            {...(reduced
              ? {}
              : {
                  whileHover: {
                    y: -2,
                    transition: { duration: 0.3, ease: [0.2, 0, 0, 1] as const },
                  },
                })}
          >
            <VisualComponent />
            {/* Inset highlight Vercel/Linear signature */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{ boxShadow: 'inset 0 1px 0 oklch(100% 0 0 / 0.06)' }}
            />
            {/* Bottom caption — micro-label do visual */}
            <div
              aria-hidden="true"
              className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-2"
            >
              <span
                className="font-mono text-[9px] uppercase tracking-widest text-(--color-text-3)"
                style={{ letterSpacing: '0.18em' }}
              >
                {CAPTION_BY_VISUAL[card.visual]}
              </span>
              <span
                aria-hidden="true"
                className="font-mono text-[9px] tabular-nums text-(--color-text-3)"
              >
                {card.eyebrow}/03
              </span>
            </div>
          </m.div>
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

          <p className="text-reading text-(--color-text-2)">{card.body}</p>

          <ul className="mt-2 flex flex-wrap gap-1.5">
            {card.pillars.map((pillar) => (
              <li
                key={pillar}
                className={cn(
                  'rounded-md border border-(--color-hairline-strong)',
                  'bg-transparent px-2.5 py-1',
                  'font-mono text-[11px] uppercase tracking-wider text-(--color-text-3)',
                  'transition-colors duration-(--motion-fast)',
                  'group-hover/block:border-(--color-accent-emissive)',
                  'group-hover/block:text-(--color-text-2)'
                )}
                style={{ boxShadow: 'inset 0 1px 0 oklch(100% 0 0 / 0.04)' }}
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
