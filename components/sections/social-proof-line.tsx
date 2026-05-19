'use client';

import { m, useInView } from 'motion/react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

// Section 2 — Social proof micro-moment. 1 linha mono entre hero e first case.
// Fade opacity + translateY 8→0, 400ms ease-standard, on view.
// Reduced-motion: snap on view (via global CSS + motion respect).

interface SocialProofLineProps {
  className?: string;
}

export function SocialProofLine({ className }: SocialProofLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });

  return (
    <div
      ref={ref}
      className={cn('hairline-top hairline-bottom py-8', className)}
      data-slot="social-proof-line"
    >
      <m.p
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
        className={cn(
          'container-max text-center font-mono text-sm text-(--color-text-2)',
          'leading-relaxed'
        )}
      >
        Em produção: três produtos rodando 24/7 · clínicas BR via NexaCore · founders intl via
        Content Engine.
      </m.p>
    </div>
  );
}
