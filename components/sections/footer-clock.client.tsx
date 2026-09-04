'use client';

import { useEffect, useState } from 'react';

// F5 (2026-09-02): relógio local de Ponta Grossa no footer.
// A linha "Ponta Grossa, Paraná · disponível" era um rótulo; com a hora local
// ela vira um instrumento — o site sinaliza que está sendo lido em tempo real
// num lugar concreto (padrão set.space / griffin.com, R4 §1.14). É dado real,
// não telemetria simulada: a hora é a hora.
//
// SSR renderiza um placeholder da MESMA largura (5ch, tabular-nums) → zero
// CLS na hidratação. Atualiza a cada 15s (minuto de precisão; nada de rAF).
// America/Sao_Paulo é UTC−3 o ano todo desde 2019 (sem horário de verão).

interface FooterClockProps {
  className?: string;
}

const formatter =
  typeof Intl !== 'undefined'
    ? new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Sao_Paulo',
      })
    : null;

export function FooterClock({ className }: FooterClockProps) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    if (!formatter) return;
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time
      className={className}
      // O valor muda no cliente; o placeholder do servidor tem a mesma largura.
      suppressHydrationWarning
      dateTime={time ?? undefined}
    >
      <span className="inline-block min-w-[5ch] tabular-nums">{time ?? '––:––'}</span> GMT-3
    </time>
  );
}
