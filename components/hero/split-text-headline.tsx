'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { type ReactNode, useRef } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

gsap.registerPlugin(SplitText, useGSAP);

// Layer 1 do 8-layer choreography: split-text word-by-word headline reveal.
// type='words' preserva children HTML (e.g., <EditorialAccent> não vira chars).
// Animação: yPercent -20→0 + opacity 0→1, stagger 50ms, 600ms ease-dramatic.
// Reduced-motion: skip split + snap final state.

interface SplitTextHeadlineProps {
  children: ReactNode;
  className?: string;
  /** Trigger animation on view ao invés de onload. Default false (onload). */
  onView?: boolean;
}

export function SplitTextHeadline({ children, className, onView = false }: SplitTextHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotionSafe();

  useGSAP(
    () => {
      if (!ref.current) return;
      // Aguarda mount + reduced state resolver. null = não mounted ainda.
      if (reduced === null) return;
      if (reduced) return; // snap final state — não anima

      const split = new SplitText(ref.current, {
        type: 'words',
        wordsClass: 'split-word inline-block',
      });

      const animation = gsap.from(split.words, {
        yPercent: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'expo.out',
        ...(onView
          ? {
              scrollTrigger: {
                trigger: ref.current,
                start: 'top 80%',
                once: true,
              },
            }
          : {}),
      });

      return () => {
        animation.kill();
        split.revert();
      };
    },
    { dependencies: [reduced, onView], scope: ref }
  );

  return (
    <h1 ref={ref} className={cn('headline-display text-balance', className)}>
      {children}
    </h1>
  );
}
