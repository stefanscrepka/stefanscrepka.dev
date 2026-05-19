'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// Defensive registerPlugin (não depender de side-effect transitivo).
gsap.registerPlugin(ScrollTrigger);

// Layer 7 do 8-layer choreography: stats row tabular-nums count-up 0→target.
// 1500ms ease-dramatic, trigger via IntersectionObserver (on view).
// Honesty (HANDOFF §3): 22 agentes (não 25), 27 tabelas, 100+ vitest tests
// (não 1203 — esse number agrega pytest etc).
// Reduced-motion: snap target values direto.

interface StatItem {
  value?: number;
  suffix?: string;
  label: string;
}

const HERO_STATS: StatItem[] = [
  { value: 22, label: 'agentes Claude' },
  { value: 27, label: 'tabelas Drizzle' },
  { value: 100, suffix: '+', label: 'vitest tests' },
  { label: 'prompt cache 2 camadas' },
  { label: 'stack local GPU' },
  { label: 'LGPD compliance' },
];

interface StatsRowProps {
  stats?: StatItem[];
  className?: string;
}

export function StatsRow({ stats = HERO_STATS, className }: StatsRowProps) {
  return (
    <dl
      className={cn(
        'mono-stats stats-row flex flex-wrap items-baseline',
        'gap-x-6 gap-y-2 text-xs sm:text-sm',
        'text-(--color-text-3)',
        className
      )}
    >
      {stats.map((stat, idx) => (
        <StatEntry key={stat.label} stat={stat} index={idx} />
      ))}
    </dl>
  );
}

function StatEntry({ stat, index }: { stat: StatItem; index: number }) {
  return (
    <div className="flex items-baseline gap-1.5">
      {index > 0 ? (
        <span aria-hidden="true" className="text-(--color-hairline-strong)">
          ·
        </span>
      ) : null}
      <dt className="sr-only">{stat.label}</dt>
      <dd>
        {stat.value !== undefined ? (
          <>
            <CountUp target={stat.value} />
            {stat.suffix ?? ''} <span className="text-(--color-text-2)">{stat.label}</span>
          </>
        ) : (
          <span className="text-(--color-text-2)">{stat.label}</span>
        )}
      </dd>
    </div>
  );
}

function CountUp({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotionSafe();

  useGSAP(
    () => {
      if (!ref.current || reduced === null) return;

      // Reduced-motion: snap target instantly via DOM mutation (sem React commit).
      if (reduced) {
        ref.current.textContent = String(target);
        return;
      }

      const node = ref.current;
      const obj = { n: 0 };
      const tween = gsap.to(obj, {
        n: target,
        duration: 1.5,
        ease: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
        scrollTrigger: {
          trigger: node,
          start: 'top 90%',
          once: true,
        },
        // Imperative DOM update — evita ~90 React commits/s × 3 stats em paralelo.
        onUpdate: () => {
          node.textContent = String(Math.round(obj.n));
        },
      });

      return () => {
        tween.kill();
      };
    },
    { dependencies: [target, reduced] }
  );

  return (
    <span ref={ref} className="font-semibold text-(--color-text-1)">
      0
    </span>
  );
}
