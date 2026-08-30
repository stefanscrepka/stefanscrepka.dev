'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { EASES, toCss } from '@/lib/animation/eases';
import { cn } from '@/lib/utils';

// Layer 7 do 8-layer choreography: stats row tabular-nums count-up 0→target.
// 1500ms ease-dramatic, trigger via IntersectionObserver (on view).
// Honesty (HANDOFF §3): 22 agentes (não 25), 27 tabelas, 100+ vitest tests
// (não 1203 — esse number agrega pytest etc).
// Reduced-motion: snap target values direto.
//
// W-perf (2026-05-25): GSAP + ScrollTrigger carregados via dynamic import
// dentro do useEffect. Static imports vazavam 70 KB uncompressed pro
// first-load de toda rota (StatsRow vive dentro do Hero, que é eager).

interface StatItem {
  value?: number;
  suffix?: string;
  label: string;
}

const HERO_STATS: StatItem[] = [
  { value: 22, label: 'agentes Claude' },
  { value: 27, label: 'tabelas Postgres' },
  { value: 100, suffix: '+', label: 'testes runtime' },
  { label: 'prompt cache 2 camadas' },
  { label: 'GPU local pro inference' },
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
        <StatEntry key={stat.label} stat={stat} isLast={idx === stats.length - 1} />
      ))}
    </dl>
  );
}

function StatEntry({ stat, isLast }: { stat: StatItem; isLast: boolean }) {
  return (
    <div className="flex items-baseline gap-1.5">
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
      {/* F4 (2026-08-29): o separador era LÍDER (`index > 0`, antes do <dt>).
          Como o container é `flex flex-wrap`, o item que quebrava pra próxima
          linha levava o `·` junto — e a linha começava com um separador solto
          ("· 100+ testes runtime", visível no hero mobile a 390px).
          Agora é TRAILING: nenhuma linha começa com separador; no máximo uma
          termina com ele, o que se lê como marca de continuação. */}
      {!isLast ? (
        <span aria-hidden="true" className="text-(--color-hairline-strong)">
          ·
        </span>
      ) : null}
    </div>
  );
}

function CountUp({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    if (!ref.current || reduced === null) return;

    // Reduced-motion: snap target instantly via DOM mutation (sem React commit).
    if (reduced) {
      ref.current.textContent = String(target);
      return;
    }

    let cancelled = false;
    let tween: { kill(): void } | null = null;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled || !ref.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const node = ref.current;
      const obj = { n: 0 };
      // W-motion #9: duration constante 1.5s sentia diferente para targets
      // diferentes (22 vs 100 = mesmo tempo, mas 100 conta ~4.5× mais rápido).
      // D'Silva motion principle: perceived speed ≠ duration. Log scaling
      // mantém velocidade perceptual aproximadamente constante.
      const duration = 0.6 + Math.log10(Math.max(target, 1)) * 0.4;
      tween = gsap.to(obj, {
        n: target,
        duration,
        ease: toCss(EASES.dramatic),
        scrollTrigger: {
          trigger: node,
          // 'top bottom' = dispara quando topo do stat chega no bottom do viewport
          // (i.e., elemento entra no viewport pela primeira vez). Substitui 'top 90%'
          // que falhava quando hero tinha altura > viewport (stats no fim da section).
          start: 'top bottom',
          once: true,
        },
        // Imperative DOM update — evita ~90 React commits/s × 3 stats em paralelo.
        onUpdate: () => {
          node.textContent = String(Math.round(obj.n));
        },
      });
    })();

    return () => {
      cancelled = true;
      tween?.kill();
    };
  }, [target, reduced]);

  return (
    <span ref={ref} className="font-semibold text-(--color-text-1)">
      0
    </span>
  );
}
