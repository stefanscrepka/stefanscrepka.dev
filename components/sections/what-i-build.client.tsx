'use client';

import { m, useInView } from 'motion/react';
import { type ReactNode, useRef } from 'react';
import { DirectionAwareHover } from '@/components/ui-effects/direction-aware-hover';
import { cn } from '@/lib/utils';

// Reveal stagger on view dos 3 cards do WhatIBuildSection.
// scale 0.95→1 + opacity 0→1 + translateY 20→0, 400ms ease-snappy, stagger 120ms.
// Motion 12 useReducedMotion respeitado nativamente (sem animação se reduced).

export interface WhatIBuildCardData {
  eyebrow: string;
  title: string;
  body: string;
  icon: ReactNode;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] as const },
  },
};

interface WhatIBuildGridProps {
  cards: WhatIBuildCardData[];
  className?: string;
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
          <DirectionAwareHover
            tone="lime"
            overlay={
              <span className="font-mono text-xs uppercase tracking-wider text-(--color-accent)">
                {card.title}
              </span>
            }
            className="h-full"
          >
            <div className="flex h-full min-h-[18rem] flex-col gap-5 p-6 sm:p-7">
              <div className="grid size-12 place-items-center rounded-lg border border-(--color-hairline-strong) bg-(--color-surface-elevated) text-(--color-accent)">
                {card.icon}
              </div>
              <div className="flex flex-col gap-3">
                <p className="font-mono text-[11px] uppercase tracking-widest text-(--color-text-3)">
                  {card.eyebrow}
                </p>
                <h3 className="text-lg font-semibold leading-tight text-(--color-text-1) sm:text-xl">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-(--color-text-2)">{card.body}</p>
              </div>
            </div>
          </DirectionAwareHover>
        </m.li>
      ))}
    </m.ul>
  );
}
