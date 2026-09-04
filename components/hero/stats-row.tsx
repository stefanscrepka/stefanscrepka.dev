'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cubicBezier, EASES } from '@/lib/animation/eases';
import { cn } from '@/lib/utils';

// Layer 7 do 8-layer choreography: stats row tabular-nums count-up 0→target.
// ease-dramatic, trigger via IntersectionObserver (on view, uma vez).
// Honesty (HANDOFF §3): 22 agentes (não 25), 27 tabelas, 100+ vitest tests
// (não 1203 — esse number agrega pytest etc).
// Reduced-motion: snap target values direto.
//
// F5 (2026-09-02): GSAP + ScrollTrigger saíram daqui. O count-up é um
// IntersectionObserver + requestAnimationFrame com o MESMO easing (o cubic-
// bezier `--ease-dramatic`, avaliado em JS por `cubicBezier()`), a mesma
// duração em escala log e a mesma escrita imperativa no DOM. Antes, este
// componente (e o marquee) puxavam ~46 KB gz de gsap+ScrollTrigger no path
// eager do Hero em TODA visita — inclusive mobile, onde o Lenis nem inicia e
// nada mais precisava de GSAP. Um contador de três números não justifica isso.

interface StatItem {
  value?: number;
  suffix?: string;
  label: string;
}

// F7 (2026-09-04): números conferidos no código do Content Engine —
// agent-roles.ts (19), db/schema.ts + auth-schema.ts (57 tabelas), 243
// arquivos de teste com 2.059 casos no runtime. "LGPD compliance" saiu: não
// existe mecanismo no código (o que existe é rotulagem de IA no publish).
const HERO_STATS: StatItem[] = [
  { value: 19, label: 'agentes Claude' },
  { value: 57, label: 'tabelas Postgres' },
  { value: 2059, label: 'testes no runtime' },
  { label: 'inference local numa RTX 3070' },
  { label: 'rotulagem de IA obrigatória no publish' },
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

const easeDramatic = cubicBezier(EASES.dramatic);

function CountUp({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced === null) return;

    // Reduced-motion / sem IntersectionObserver: o HTML já traz o valor final.
    if (reduced || typeof IntersectionObserver === 'undefined') {
      node.textContent = String(target);
      return;
    }

    // F5 (2026-09-02): o servidor renderiza o VALOR FINAL (antes era "0").
    // Crawler, reader mode, print e JS falhando liam "0 agentes Claude" — um
    // número errado justamente onde o site promete honestidade. O contador só
    // rebaixa pra 0 quando o stat ainda está FORA do viewport na hidratação
    // (desktop 1440×900: y≈972; mobile 390×844: y≈1400 — o caso normal). Se
    // já está visível (tela alta, ou o usuário rolou antes do JS), fica no
    // valor final: nunca existe "aparece, some e volta".
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      node.textContent = String(target);
      return;
    }
    node.textContent = '0';

    let raf = 0;
    // W-motion #9: duration constante 1.5s sentia diferente para targets
    // diferentes (22 vs 100 = mesmo tempo, mas 100 conta ~4.5× mais rápido).
    // D'Silva motion principle: perceived speed ≠ duration. Log scaling
    // mantém velocidade perceptual aproximadamente constante.
    const durationMs = (0.6 + Math.log10(Math.max(target, 1)) * 0.4) * 1000;

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        // Escrita imperativa — evita ~90 React commits/s × 3 stats em paralelo.
        node.textContent = String(Math.round(target * easeDramatic(t)));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    // Dispara quando o topo do stat entra pelo bottom do viewport (mesmo
    // gatilho do ScrollTrigger `start: 'top bottom'` anterior), uma vez.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0 }
    );
    io.observe(node);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, reduced]);

  return (
    <span ref={ref} className="font-semibold text-(--color-text-1)">
      {target}
    </span>
  );
}
