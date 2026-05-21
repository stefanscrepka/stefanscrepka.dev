'use client';

import { m } from 'motion/react';
import { type ReactNode, useState } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// Animate UI FlipCard pattern — 3D rotateY (default) ou rotateX.
// Spring tight (stiffness 280 damping 20). Backface-hidden faces.
// A11y: <button> wrapper aria-pressed. Enter/Space toggle.
// Reduced-motion: crossfade opacity entre faces sem rotation.
// Mobile: click ou tap (hover-only seria broken).

type FlipAxis = 'y' | 'x';
type TriggerMode = 'hover' | 'click';

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  axis?: FlipAxis;
  trigger?: TriggerMode;
  /** Tom do glow halo no card */
  tone?: 'lime' | 'amber';
  className?: string;
  ariaLabel?: string;
}

const TONE_GLOW = {
  lime: 'var(--color-accent-glow)',
  amber: 'oklch(82% 0.18 75 / 0.15)',
} as const;

export function FlipCard({
  front,
  back,
  axis = 'y',
  trigger = 'hover',
  tone = 'lime',
  className,
  ariaLabel = 'Virar card',
}: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const reduced = useReducedMotionSafe();

  const toggle = () => setFlipped((prev) => !prev);

  const rotation = flipped ? 180 : 0;
  const rotateAxis = axis === 'y' ? { rotateY: rotation } : { rotateX: rotation };

  // Reduced-motion: simple opacity crossfade
  if (reduced) {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={flipped}
        aria-label={ariaLabel}
        data-slot="flip-card"
        data-tone={tone}
        className={cn(
          'group/flip relative isolate block w-full rounded-2xl text-left',
          'border border-(--color-hairline-strong) bg-(--color-surface)',
          'transition-shadow duration-(--motion-fast)',
          'hover:shadow-(--shadow-lg) focus-visible:shadow-(--shadow-lg)',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)',
          className
        )}
        style={{ boxShadow: `0 0 32px ${TONE_GLOW[tone]}` }}
      >
        <div className={cn('relative', flipped ? 'sr-only' : '')} aria-hidden={flipped}>
          {front}
        </div>
        <div className={cn('relative', flipped ? '' : 'sr-only')} aria-hidden={!flipped}>
          {back}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={trigger === 'click' ? toggle : undefined}
      onMouseEnter={trigger === 'hover' ? () => setFlipped(true) : undefined}
      onMouseLeave={trigger === 'hover' ? () => setFlipped(false) : undefined}
      onFocus={() => setFlipped(true)}
      onBlur={() => setFlipped(false)}
      aria-pressed={flipped}
      aria-label={ariaLabel}
      data-slot="flip-card"
      data-tone={tone}
      className={cn(
        'group/flip relative isolate block w-full rounded-2xl text-left',
        '[perspective:1200px]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)',
        className
      )}
    >
      <m.div
        animate={rotateAxis}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front face */}
        <div
          className={cn(
            'relative rounded-2xl',
            'border border-(--color-hairline-strong) bg-(--color-surface)',
            'shadow-(--shadow-md)'
          )}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            boxShadow: `var(--shadow-md), 0 0 32px ${TONE_GLOW[tone]}`,
          }}
          aria-hidden={flipped}
        >
          {front}
        </div>

        {/* Back face — rotated 180° to be flush with front */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl',
            'border border-(--color-hairline-strong) bg-(--color-surface-elevated)',
            'shadow-(--shadow-md)'
          )}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: axis === 'y' ? 'rotateY(180deg)' : 'rotateX(180deg)',
            boxShadow: `var(--shadow-md), 0 0 32px ${TONE_GLOW[tone]}`,
          }}
          aria-hidden={!flipped}
        >
          {back}
        </div>
      </m.div>
    </button>
  );
}
