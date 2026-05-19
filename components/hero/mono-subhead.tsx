'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { type ReactNode, useRef } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// Layer 3 do 8-layer choreography: subhead mono fade-up 300ms ease-standard,
// delay 0.4s (após início do split-text headline).

interface MonoSubheadProps {
  children: ReactNode;
  className?: string;
}

export function MonoSubhead({ children, className }: MonoSubheadProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotionSafe();

  useGSAP(
    () => {
      if (!ref.current || reduced === null || reduced) return;

      const tween = gsap.from(ref.current, {
        y: 12,
        opacity: 0,
        duration: 0.3,
        delay: 0.4,
        ease: 'cubic-bezier(0.2, 0, 0, 1)',
      });

      return () => {
        tween.kill();
      };
    },
    { dependencies: [reduced] }
  );

  return (
    <p
      ref={ref}
      className={cn('max-w-prose font-mono text-sm text-(--color-text-2) sm:text-base', className)}
    >
      {children}
    </p>
  );
}
