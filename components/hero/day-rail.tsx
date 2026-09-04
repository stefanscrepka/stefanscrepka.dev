import { FooterClock } from '@/components/sections/footer-clock.client';
import { cn } from '@/lib/utils';
import { CONTENT_ENGINE_DAILY_CRON } from '@/lib/work/data';

// O turno de hoje — o contrapeso do H1 no hero (F8, 2026-09-05).
//
// O hero tinha um único foco (a manchete) e, embaixo dela, quatro faixas de
// texto pequeno com o mesmo peso (subhead, CTAs, stats, marquee). Este trilho
// dá à metade direita um segundo bloco que se lê: o dia de trabalho do
// Content Engine como o cron o executa (apps/runtime/src/env.ts, fuso de São
// Paulo). Não é telemetria simulada, é horário; horário não se falsifica sem
// mentir por escrito. O único acento: a linha das 07h30, o momento em que o
// humano entra. O relógio é a hora de verdade (mesma ilha do rodapé).
// RSC; zero JS além do relógio.

const PLAIN: Record<string, string> = {
  'daily-intel': 'a inteligência acorda e lê o mercado',
  'daily-strategy': 'a estratégia decide o que sai hoje',
  'daily-creation': 'a criação escreve, desenha e edita',
  'daily-review': 'a revisão reprova o que soa a máquina',
  'daily-editor': 'o Editor-Chefe monta o pacote e te chama',
  publicação: 'publica, se você aprovou',
};

interface DayRailProps {
  className?: string | undefined;
}

export function DayRail({ className }: DayRailProps) {
  return (
    <aside
      aria-labelledby="hero-turno"
      data-slot="day-rail"
      className={cn(
        'relative flex flex-col gap-4 border-t border-(--color-hairline) pt-6',
        'lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8',
        className
      )}
    >
      <p
        id="hero-turno"
        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-2xs uppercase tracking-widest text-(--color-text-3)"
      >
        <span>O turno de hoje</span>
        <span>
          agora <FooterClock className="text-(--color-text-2)" />
        </span>
      </p>

      <ol className="font-mono text-[13px] leading-snug sm:text-sm">
        {CONTENT_ENGINE_DAILY_CRON.map((row, i) => {
          const lit = row.job === 'daily-editor';
          return (
            <li
              key={row.job}
              className={cn(
                'grid grid-cols-[3.25rem_minmax(0,1fr)] items-baseline gap-4 py-2.5',
                'border-t border-(--color-hairline)',
                i === 0 && 'border-t-0'
              )}
            >
              <time
                dateTime={row.at}
                className={cn(
                  'tabular-nums',
                  lit ? 'text-(--color-accent)' : 'text-(--color-text-1)'
                )}
              >
                {row.at}
              </time>
              <span className={lit ? 'text-(--color-text-1)' : 'text-(--color-text-2)'}>
                {PLAIN[row.job] ?? row.job}
                {lit ? (
                  <span
                    aria-hidden="true"
                    className="ml-2 inline-block size-1.5 translate-y-[-1px] bg-(--color-accent)"
                  />
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
        19 agentes · 5 squads · fuso America/Sao_Paulo
      </p>
    </aside>
  );
}
