'use client';

import { m, useInView } from 'motion/react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { CircuitVisual, SquadsVisual, StackVisual } from './what-i-build';

// Cards "O que eu construo" — cada um tem um VISUAL BACKGROUND único
// (squads diagram, tech logos cluster, ou circuit pattern). Quebra a
// uniformidade do "ícone genérico no top".
// Reveal stagger 120ms on view. Hover: scale + border emissive lime.

export interface WhatIBuildCardData {
  eyebrow: string;
  title: string;
  body: string;
  visual: 'squads' | 'stack' | 'circuit';
  pillars: string[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.165, 0.84, 0.44, 1] as const },
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
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -120px 0px' });

  return (
    <m.ul
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
      }}
      className={cn('grid gap-5 sm:gap-6 md:grid-cols-3', className)}
    >
      {cards.map((card) => (
        <m.li key={card.title} variants={itemVariants}>
          <ModeCard card={card} />
        </m.li>
      ))}
    </m.ul>
  );
}

function ModeCard({ card }: { card: WhatIBuildCardData }) {
  const VisualComponent = VISUAL_MAP[card.visual];

  return (
    <article
      data-slot="mode-card"
      data-visual={card.visual}
      className={cn(
        'group/mode relative isolate flex h-full min-h-[28rem] flex-col overflow-hidden rounded-2xl',
        'border border-(--color-hairline) bg-(--color-surface)',
        'transition-[border-color,transform,box-shadow] duration-(--motion-fast) ease-(--ease-standard)',
        'hover:-translate-y-1 hover:border-(--color-accent) hover:shadow-(--shadow-glow-lime-sm)',
        'focus-within:border-(--color-accent)'
      )}
    >
      {/* Visual top — 50% altura, distinto por card */}
      <div className="relative h-44 overflow-hidden border-b border-(--color-hairline) bg-(--color-base) p-3 sm:h-48">
        <VisualComponent />

        {/* Number indicator — top-right large */}
        <span
          aria-hidden="true"
          className="absolute right-4 top-3 font-mono text-4xl font-bold leading-none text-(--color-accent-subtle) tabular-nums"
        >
          {card.eyebrow}
        </span>
      </div>

      {/* Text content */}
      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
        <h3 className="text-lg font-semibold leading-tight tracking-tight text-(--color-text-1) sm:text-xl">
          {card.title}
        </h3>
        <p className="text-sm leading-relaxed text-(--color-text-2)">{card.body}</p>

        {/* Pillars chip list */}
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {card.pillars.map((pillar) => (
            <li
              key={pillar}
              className="rounded-md border border-(--color-hairline-strong) bg-(--color-surface-elevated) px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-(--color-text-3)"
            >
              {pillar}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
