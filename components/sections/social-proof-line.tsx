'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { m, useInView } from 'motion/react';
import { useRef } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// Section 2 — Social proof reescrita com tipografia editorial dramática.
// "Em produção:" prefixo serif italic · "3" GIGANTE tabular-nums lime count-up
// · resto da linha mono pequeno · 3 produtos label hairline mono à direita.
// Pattern: line de assinatura tipográfica, não linha plana de microcopy.

interface SocialProofLineProps {
  className?: string | undefined;
}

const PRODUCTS = ['Content Engine', 'NexaCore', 'STJ App'] as const;

export function SocialProofLine({ className }: SocialProofLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });
  const reduced = useReducedMotionSafe();

  // Count-up "3" via GSAP imperativo (sem React commits 60fps).
  useGSAP(
    () => {
      if (!countRef.current || reduced === null || !inView) return;
      if (reduced) {
        countRef.current.textContent = '3';
        return;
      }
      const obj = { n: 0 };
      const tween = gsap.to(obj, {
        n: 3,
        duration: 0.6,
        ease: 'expo.out',
        onUpdate: () => {
          if (countRef.current) countRef.current.textContent = String(Math.round(obj.n));
        },
      });
      return () => tween.kill();
    },
    { dependencies: [inView, reduced] }
  );

  return (
    <div
      ref={ref}
      className={cn('hairline-top hairline-bottom relative py-10 sm:py-12', className)}
      data-slot="social-proof-line"
    >
      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
        className="container-max flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4"
      >
        {/* Esquerda: tipografia editorial dramática */}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span
            className="font-[var(--font-editorial)] text-base italic text-(--color-text-3) sm:text-lg"
            style={{ fontFamily: 'var(--font-editorial)' }}
          >
            Em produção:
          </span>
          <span
            ref={countRef}
            className="mono-stats text-5xl font-bold leading-none text-(--color-accent) tabular-nums sm:text-6xl"
            aria-hidden="true"
          >
            0
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-(--color-text-2) sm:text-sm">
            produtos rodando 24/7
          </span>
        </div>

        {/* Direita: 3 product labels hairline-outline */}
        <ul className="flex flex-wrap items-center gap-2">
          {PRODUCTS.map((name) => (
            <li
              key={name}
              className={cn(
                'rounded-md border border-(--color-hairline-strong) bg-(--color-surface)/40',
                'px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest',
                'text-(--color-text-3)'
              )}
            >
              {name}
            </li>
          ))}
        </ul>
      </m.div>

      {/* Screen reader text */}
      <span className="sr-only">Três produtos rodando 24 por 7: {PRODUCTS.join(', ')}.</span>
    </div>
  );
}
