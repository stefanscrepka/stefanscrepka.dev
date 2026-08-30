'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CONTENT_ENGINE_SQUADS } from '@/lib/work/data';

// Status line dos squads do Content Engine — pulsa cada step em sequencia
// (S0 → S1 → S2 → S3 → S4 → E-0 HITL) em loop. Vive embaixo dos highlights
// no HeroTile pra dar camada de "produto vivo" sem aumentar layout.
//
// Estilo: mono uppercase tracking-widest text-2xs + lime glow no step ativo.
// 750ms cada step, total loop ~5s. Reduced-motion: snap, todos lime sutil.

// F4: os 5 squads vêm da fonte única em lib/work/data.ts; E-0 é o passo de
// saída do pipeline (aprovação humana), não um squad — por isso fica aqui.
const STEPS = [
  ...CONTENT_ENGINE_SQUADS.map((s) => ({ id: s.id, label: `${s.code} ${s.name}` })),
  { id: 'e0', label: 'E-0 HITL Telegram' },
];

const STEP_DURATION_MS = 750;

interface SquadsStatusLineProps {
  className?: string;
}

export function SquadsStatusLine({ className }: SquadsStatusLineProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setEnabled(!mq.matches);
    const handler = (e: MediaQueryListEvent) => setEnabled(!e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % STEPS.length);
    }, STEP_DURATION_MS);
    return () => clearInterval(interval);
  }, [enabled]);

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-2 gap-y-1',
        'font-mono text-2xs uppercase tracking-widest text-(--color-text-3)',
        className
      )}
      data-slot="squads-status-line"
      aria-hidden="true"
    >
      {STEPS.map((step, idx) => {
        const active = enabled ? idx === activeIdx : true;
        return (
          <span key={step.id} className="inline-flex items-center gap-2">
            <span
              className={cn(
                'inline-block size-1.5 rounded-full transition-[background-color,box-shadow]',
                'duration-(--motion-fast) ease-(--ease-snappy)',
                active
                  ? 'bg-(--color-accent) shadow-[0_0_8px_var(--color-accent-emissive)]'
                  : 'bg-(--color-hairline-strong)'
              )}
            />
            <span
              className={cn(
                'transition-colors duration-(--motion-fast)',
                active ? 'text-(--color-accent)' : 'text-(--color-text-3)'
              )}
            >
              {step.label}
            </span>
            {idx < STEPS.length - 1 ? (
              <span className="text-(--color-hairline-strong)">→</span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
