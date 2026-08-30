'use client';

import { m, useInView } from 'motion/react';
import { type ReactNode, useRef } from 'react';
import { TracingBeam } from '@/components/ui-effects/tracing-beam';
import { EASES } from '@/lib/animation/eases';
import { cn } from '@/lib/utils';

// F3.2 (2026-06-11) — dieta de hidratação: esta ilha encolheu pra SÓ o que
// precisa de JS — TracingBeam (scroll progress), o reveal whileInView de cada
// marker e o MarkerDot (bounce ao entrar). Year/title/body/instituições agora
// chegam server-rendered como children (MarkerContent em timeline.tsx) e não
// hidratam mais. Mesmo padrão do BentoRevealGrid.

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASES.dramatic },
  },
};

export interface TimelineRevealItem {
  key: string;
  isCurrent?: boolean | undefined;
  /** Conteúdo do marker server-rendered (MarkerContent em timeline.tsx). */
  children: ReactNode;
}

interface TimelineRevealProps {
  items: TimelineRevealItem[];
}

export function TimelineReveal({ items }: TimelineRevealProps) {
  return (
    <TracingBeam>
      {/* W-motion #4: cada marker tem seu próprio whileInView — Disney Timing
          per element, ritmo alinhado ao scroll natural do user. */}
      {/* W-audit (2026-06-10): gaps 8/12/14rem → 5/7/8rem. No filme do scroll
          do audit (frames y6958/y8472), os vazios entre entries ocupavam
          viewports inteiras de preto — o ritmo da página morria aqui por ~3
          telas (vale emocional). 8rem desktop ainda respira generoso; o corte
          de ~40% mantém o drama tipográfico sem matar o momentum. */}
      <ol className="flex flex-col gap-[5rem] sm:gap-[7rem] lg:gap-[8rem]">
        {items.map((item, idx) => (
          <m.li
            key={item.key}
            initial={itemVariants.hidden}
            whileInView={itemVariants.visible}
            viewport={{ once: true, amount: 0.3 }}
            className="relative flex flex-col gap-6"
          >
            <MarkerDot index={idx} isCurrent={item.isCurrent} />
            {item.children}
          </m.li>
        ))}
      </ol>

      {/* Beam end glow — soft lime blur depois do último marker (não corta seco) */}
      <div
        aria-hidden="true"
        className="pointer-events-none mt-16 h-32 w-px"
        style={{
          marginLeft: 'var(--beam-line)',
          background:
            'linear-gradient(to bottom, var(--color-accent) 0%, oklch(94% 0.22 124 / 0.4) 40%, transparent 100%)',
          filter: 'blur(2px)',
          boxShadow: '0 0 24px var(--color-accent-emissive)',
        }}
      />
    </TracingBeam>
  );
}

function MarkerDot({ index, isCurrent }: { index: number; isCurrent?: boolean | undefined }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        // F4 (2026-08-29): posicao DERIVADA do contrato --beam-* (globals.css)
        // em vez de três offsets manuais por breakpoint. Os antigos
        // (-1.875/-2/-2.125rem) deixavam o centro do marcador 11–13px à direita
        // da linha do feixe — medido em produção. `left` agora resolve pra
        // (linha do feixe) − (recuo do conteúdo) − (metade do size-7).
        'pointer-events-none absolute top-3 grid size-7 place-items-center',
        'rounded-full border bg-(--color-bg)',
        'transition-[border-color,box-shadow,transform] duration-(--motion-transition)',
        // Ring vira lime emissive quando marker entra no viewport (sinaliza
        // progresso ao longo do scroll, nao "está sempre off").
        inView ? 'border-(--color-accent)' : 'border-(--color-hairline-strong)',
        isCurrent && 'border-(--color-accent) shadow-(--shadow-glow-lime-sm)'
      )}
      style={{ left: 'calc(var(--beam-line) - var(--beam-pad) - 0.875rem)' }}
      data-active={inView ? '' : undefined}
      data-marker-index={index}
    >
      {/* W-motion #6: bounce-once Disney Squash & Stretch quando marker entra
          no viewport. Inner dot anima scale [1, 1.25, 1] em 500ms — Follow
          Through visual celebrando o "progresso lime". isCurrent ainda recebe
          o `animate-pulse` contínuo separado. */}
      <m.span
        initial={{ scale: 1 }}
        animate={inView ? { scale: [1, 1.25, 1] } : { scale: 1 }}
        transition={{ duration: 0.5, ease: EASES.outQuint, times: [0, 0.4, 1] }}
        className={cn(
          'block size-3 rounded-full transition-colors duration-(--motion-modal)',
          inView ? 'bg-(--color-accent) shadow-(--shadow-glow-lime-sm)' : 'bg-(--color-text-3)',
          isCurrent && 'animate-pulse'
        )}
      />
    </span>
  );
}
