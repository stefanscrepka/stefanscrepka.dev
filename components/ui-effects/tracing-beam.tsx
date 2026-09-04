'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// TracingBeam vertical — trilho hairline com um "cometa" lime que acompanha o
// scroll (pattern Aceternity).
//
// F5 (2026-09-02): reescrito sem Motion e sem SVG medido.
// Antes: useScroll → 2× useTransform → 2× useSpring animando `y1/y2` de um
// <linearGradient> em TODO frame (coordenadas de gradiente não são
// compositáveis = paint por frame na seção mais alta da home), mais um
// ResizeObserver + estado `svgHeight` re-renderizando a subárvore.
// Agora: o cometa é um <div> com o gradiente pintado UMA vez (background-size
// = janela) e só o `transform` muda:
//   • Chrome/Safari: CSS scroll-driven animation (view-timeline, range `exit`
//     = "topo do container no topo do viewport → base no topo"), fora da
//     thread principal. Zero JS por frame.
//   • Firefox (sem animation-timeline): listener passivo de scroll escreve
//     `--beam-p` (0→1, throttled por rAF) e o CSS calcula o translate — sem
//     springs, sem estado React.
//   • reduced-motion / zero-JS: gradiente esticado no trilho inteiro (mesmo
//     estado "desenhado" de antes).
// A geometria do trilho vem do contrato `--beam-x / --beam-pad / --beam-line`
// (globals.css, F4): a linha vive em x = 1px dentro do wrapper de 20px.
// Estilos do cometa: `.beam-fill` em globals.css.

interface TracingBeamProps {
  children: ReactNode;
  className?: string;
  /** F5 (2026-09-02): o dot de início do trilho. `false` quando o consumidor
   *  desenha o próprio marcador na mesma posição (timeline) — senão ficam dois
   *  pontos a 20px um do outro. Default true (/process). */
  startDot?: boolean;
}

export function TracingBeam({ children, className, startDot = true }: TracingBeamProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Fallback pra browsers sem scroll-driven animations (Firefox, 2026-09).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // Mesmo range da animação CSS: 0 = topo do container no topo do
      // viewport, 1 = base do container no topo do viewport.
      const p = r.height > 0 ? Math.min(1, Math.max(0, -r.top / r.height)) : 0;
      el.style.setProperty('--beam-p', p.toFixed(4));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={cn('relative w-full', className)} data-slot="tracing-beam">
      {/* Trilho decorativo — wrapper de 20px, linha em x=1 (contrato --beam-line). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 bottom-0 w-5 overflow-hidden"
        style={{ left: 'var(--beam-x)' }}
      >
        {/* Dot inicial */}
        {startDot ? (
          <span
            className={cn(
              // F4: centro em `--beam-line` (a linha vive em x=1), nao na borda
              // esquerda do trilho — antes ficava 1px fora do eixo.
              'absolute -top-1 z-10 grid size-4 place-items-center rounded-full',
              'border border-(--color-hairline-strong) bg-(--color-bg)'
            )}
            style={{ left: 'calc(1px - 0.5rem)' }}
          >
            <span className="size-2 rounded-full bg-(--color-text-3) motion-reduce:bg-(--color-accent) motion-reduce:shadow-(--shadow-glow-lime-sm)" />
          </span>
        ) : null}

        {/* Linha base (hairline) */}
        <div
          className="absolute top-0 bottom-0 w-px bg-(--color-hairline-strong)"
          style={{ left: 'calc(1px - 0.5px)' }}
        />
        {/* Cometa lime — gradiente pintado uma vez, só transform anima */}
        <div
          className="beam-fill absolute top-0 w-[1.5px]"
          style={{ left: 'calc(1px - 0.75px)' }}
        />
      </div>

      <div style={{ paddingLeft: 'var(--beam-pad)' }}>{children}</div>
    </div>
  );
}
