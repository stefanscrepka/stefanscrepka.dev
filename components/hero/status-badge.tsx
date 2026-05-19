'use client';

import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// Status badge — green dot pulsing + label "disponível pra projetos".
// Pattern Portfolo Framer template + Linear "online" indicator. Mostra que
// não é portfolio congelado; tem availability real.
// Reduced-motion: dot estático sem pulse.

interface StatusBadgeProps {
  label?: string;
  /** Tom semântico — default success (lime). */
  tone?: 'success' | 'accent';
  className?: string | undefined;
}

export function StatusBadge({
  label = 'disponível pra projetos',
  tone = 'accent',
  className,
}: StatusBadgeProps) {
  const reduced = useReducedMotionSafe();
  const dotColor = tone === 'success' ? 'var(--color-success)' : 'var(--color-accent)';

  return (
    <div
      data-slot="status-badge"
      className={cn(
        'inline-flex items-center gap-2.5 rounded-pill',
        'border border-(--color-hairline-strong) bg-(--color-surface)/60',
        'px-3 py-1.5 shadow-(--shadow-sm) backdrop-blur-sm',
        className
      )}
    >
      <span className="relative flex size-2 items-center justify-center">
        {/* Outer pulse halo */}
        {!reduced ? (
          <span
            aria-hidden="true"
            className="absolute inline-flex size-full animate-ping rounded-full opacity-60"
            style={{ background: dotColor }}
          />
        ) : null}
        {/* Inner solid dot */}
        <span
          aria-hidden="true"
          className="relative inline-flex size-2 rounded-full"
          style={{ background: dotColor, boxShadow: `0 0 8px ${dotColor}` }}
        />
      </span>
      <span className="font-mono text-[11px] uppercase tracking-widest text-(--color-text-1)">
        {label}
      </span>
    </div>
  );
}
