'use client';

import { AnimatePresence, m } from 'motion/react';
import { type ReactNode, useRef, useState } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// Pattern Aceternity: detecta direção de entrada/saída do mouse (top/right/bottom/left)
// via atan2 dos coords relativos ao centro do card, e anima overlay vindo daquela direção.
// Lime overlay reveal anti-slop (não scale 1.05 genérico).
// Reduced-motion: opacity-only fade (sem translate direcional).

type Direction = 'top' | 'right' | 'bottom' | 'left';

interface DirectionAwareHoverProps {
  children: ReactNode;
  /** Conteúdo do overlay revelado on hover (badge, CTA, etc). */
  overlay?: ReactNode;
  className?: string;
  /** Tom do overlay glow */
  tone?: 'lime' | 'amber';
}

function getDirection(ev: React.MouseEvent<HTMLElement>, el: HTMLElement): Direction {
  const rect = el.getBoundingClientRect();
  const x = ev.clientX - rect.left - rect.width / 2;
  const y = ev.clientY - rect.top - rect.height / 2;
  // atan2 / (π/2) maps quadrants to 0..3. +4.5 then %4 gives stable ordering.
  const idx = (Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4) as 0 | 1 | 2 | 3;
  // 0=right, 1=bottom, 2=left, 3=top
  return (['right', 'bottom', 'left', 'top'] as const)[idx];
}

const VARIANTS = {
  initial: { x: 0, y: 0, opacity: 0 },
  top: { x: 0, y: '-100%', opacity: 0 },
  bottom: { x: 0, y: '100%', opacity: 0 },
  left: { x: '-100%', y: 0, opacity: 0 },
  right: { x: '100%', y: 0, opacity: 0 },
  enter: { x: 0, y: 0, opacity: 1 },
};

const TONE_GLOW = {
  lime: 'var(--color-accent-glow)',
  amber: 'oklch(82% 0.18 75 / 0.15)',
} as const;

export function DirectionAwareHover({
  children,
  overlay,
  className,
  tone = 'lime',
}: DirectionAwareHoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<Direction | null>(null);
  const reduced = useReducedMotionSafe();

  const handleEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    setDirection(getDirection(e, ref.current));
  };

  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    // On exit, set direction so the overlay slides OUT that way.
    setDirection(getDirection(e, ref.current));
    setTimeout(() => setDirection(null), 0);
  };

  // Reduced-motion: simple fade-only via opacity
  const initialState = reduced
    ? { opacity: 0 }
    : direction
      ? VARIANTS[direction]
      : VARIANTS.initial;
  const animateState = direction ? VARIANTS.enter : reduced ? { opacity: 0 } : VARIANTS.initial;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: container reage a mouse pra direção; conteúdo interno permanece focável
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={() => setDirection('top')}
      onBlur={() => setDirection(null)}
      data-slot="direction-aware-hover"
      data-tone={tone}
      className={cn(
        'group/daw relative overflow-hidden rounded-xl',
        'border border-(--color-hairline)',
        'bg-(--color-surface)',
        'transition-[border-color,box-shadow] duration-(--motion-fast) ease-(--ease-standard)',
        'focus-within:border-(--color-accent)',
        className
      )}
      style={{
        boxShadow: direction !== null && !reduced ? `0 0 32px ${TONE_GLOW[tone]}` : undefined,
      }}
    >
      {children}

      <AnimatePresence mode="wait">
        {direction !== null && overlay ? (
          <m.div
            key={direction}
            initial={initialState}
            animate={animateState}
            exit={initialState}
            transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
            className={cn(
              'pointer-events-none absolute inset-0 flex items-end justify-start p-6',
              'bg-gradient-to-tr from-(--color-accent)/15 via-transparent to-transparent',
              tone === 'amber' &&
                'bg-gradient-to-tr from-[oklch(82%_0.18_75_/_0.18)] via-transparent to-transparent'
            )}
          >
            {overlay}
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
