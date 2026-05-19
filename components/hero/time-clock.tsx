'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// HUD timezone clock — pattern IT Empire / Argus prints (instrument cluster vibe).
// Mostra hora atual em São Paulo timezone + label cidade. Atualiza a cada 30s.
// SSR-safe: renderiza fallback `--:--` antes de hydrate pra evitar mismatch.

const TIMEZONE = 'America/Sao_Paulo';
const LOCALE = 'pt-BR';

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

interface TimeClockProps {
  className?: string | undefined;
}

export function TimeClock({ className }: TimeClockProps) {
  const [time, setTime] = useState<string>('--:--');

  useEffect(() => {
    const tick = () => setTime(formatTime(new Date()));
    tick();
    const interval = setInterval(tick, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      data-slot="time-clock"
      className={cn(
        'inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest',
        'text-(--color-text-3)',
        className
      )}
    >
      <span aria-hidden="true" className="text-(--color-accent)">
        ◇
      </span>
      <span className="tabular-nums text-(--color-text-1)">{time}</span>
      <span aria-hidden="true">·</span>
      <span>BRT · PONTA GROSSA</span>
    </div>
  );
}
