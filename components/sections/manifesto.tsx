'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMemo, useRef } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';
import { ManifestoBackdrop } from './manifesto-backdrop';

gsap.registerPlugin(ScrollTrigger);

// Section 11 — Manifesto em 4 atos editorial:
//   ATO 1 — Pull-quote serif italic 32-44px (primeira frase isolada, o gancho).
//   ATO 2 — 4 hairlines horizontais 60-100px stagger (break editorial).
//   ATO 3 — Prose corpo 18-19px text-1 72ch leading 1.6 (parágrafos do meio com
//           word-stagger GSAP — ritmo, não decoração).
//   ATO 4 — Assinatura final serif italic 28-32px peso heavy (close emocional).
//   ATO 5 — Mono signature row: nome · cidade · disponibilidade (footer da seção).
// Backdrop existente expande full-section com light beam vertical lime.

const MANIFESTO_PULL_QUOTE =
  'Software sério tem o mesmo padrão de qualquer sistema crítico: ou funciona 24/7 ou alguém perde dinheiro.';

const MANIFESTO_BODY_PARAGRAPHS = [
  'Eu construo nesse padrão. TypeScript strict. Contratos de teste. Observabilidade real. Prompts que não inventam. Multi-agente Claude SDK orquestrado em squads. Três produtos em produção — NexaCore, Content Engine, STJ App — provam.',
  'Não vendo “ajudo empresas a inovar”. Vendo entrega que paga conta. Aprovação humana em ≤10 minutos por dia. Anti-slop validator com 14 regex pt-BR. Stack local GPU subsidiando custo de inferência.',
];

const MANIFESTO_SIGNATURE =
  'Construo IA multi-agente em produção — e o produto inteiro ao redor dela.';

interface ManifestoSectionProps {
  className?: string;
}

export function ManifestoSection({ className }: ManifestoSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  const paragraphsWithWords = useMemo(
    () =>
      MANIFESTO_BODY_PARAGRAPHS.map((para) => ({
        text: para,
        words: para.split(/(\s+)/),
      })),
    []
  );

  useGSAP(
    () => {
      if (!ref.current || reduced === null || reduced) return;

      const wordEls = ref.current.querySelectorAll<HTMLSpanElement>('[data-word]');
      if (wordEls.length === 0) return;

      const tween = gsap.from(wordEls, {
        opacity: 0,
        y: 8,
        filter: 'blur(8px)',
        duration: 0.6,
        stagger: 0.035,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 70%',
          once: true,
        },
      });

      return () => {
        tween.kill();
      };
    },
    { dependencies: [reduced] }
  );

  return (
    <section
      id="manifesto"
      className={cn('relative isolate section-pad-y-lg', className)}
      data-slot="manifesto"
    >
      <ManifestoBackdrop />
      <div className="container-prose flex flex-col gap-12 sm:gap-14">
        <p className="eyebrow">Manifesto</p>

        {/* ATO 1 — Pull-quote display tight. Sem italic editorial (regra "PP Editorial
            italic APENAS em multi-agente"): peso editorial vem via Geist semibold
            comprimido + tracking-tighter + leading 1.05 + border-l-2 lime. */}
        <blockquote className="border-l-2 border-(--color-accent) py-2 pl-6 sm:pl-8">
          <p
            className={cn(
              'font-semibold leading-[1.05] tracking-[-0.025em]',
              'text-[1.875rem] sm:text-[2.25rem] lg:text-[2.625rem]',
              'text-(--color-text-1)'
            )}
          >
            “{MANIFESTO_PULL_QUOTE}”
          </p>
        </blockquote>

        {/* ATO 2 — 4 hairlines horizontais break editorial */}
        <div aria-hidden="true" className="my-1 flex flex-col gap-1.5">
          {[60, 80, 100, 70].map((w, i) => (
            <span
              // Width único por linha → key estável; índice apenas pra opacity calc.
              key={`break-width-${w}`}
              className="block h-px bg-(--color-accent)"
              style={{ width: `${w}px`, opacity: 0.45 - i * 0.08 }}
            />
          ))}
        </div>

        {/* ATO 3 — Prose corpo Apple-sweet-spot 17-19px (text-reading utility).
            tracking -0.003em + leading 1.6 = readability máxima em parágrafos longos
            sem perder densidade editorial. Word-stagger GSAP scroll-driven. */}
        <div
          ref={ref}
          className={cn(
            'flex flex-col gap-7 text-(--color-text-1)',
            'text-reading [&_p]:leading-[1.6]'
          )}
        >
          {paragraphsWithWords.map((para) => {
            const paraId = para.text.slice(0, 24);
            return (
              <p key={`p-${paraId}-${para.words.length}`}>
                {para.words.map((word, wIdx) => {
                  // Word + index dentro do parágrafo + tamanho dão chave estável.
                  // (paraId no prefix evita colisão entre parágrafos com mesma word.)
                  const key = `w-${paraId}-${wIdx}-${word.length}`;
                  if (word.trim() === '') {
                    return <span key={key}>{word}</span>;
                  }
                  return (
                    <span key={key} data-word className="inline-block">
                      {word}
                    </span>
                  );
                })}
              </p>
            );
          })}
        </div>

        {/* ATO 4 — Assinatura emocional Geist semibold lime. Sem italic
            (regra "PP Editorial italic APENAS em multi-agente"): peso editorial
            vem via Geist semibold + tracking-tighter + lime accent. */}
        <p
          className={cn(
            'font-semibold leading-[1.1] tracking-[-0.025em]',
            'text-[1.75rem] sm:text-[2rem] lg:text-[2.25rem]',
            'text-(--color-accent)'
          )}
        >
          {MANIFESTO_SIGNATURE}
        </p>

        {/* ATO 5 — Mono signature row (peak-end pre-close).
            Hairline curta + nome completo + cidade + disponibilidade.
            Lime ✺ glyph faz eco com o accent da seção sem competir. */}
        <div className="mt-2 flex flex-col gap-3">
          <span
            aria-hidden="true"
            className="block h-px w-12 bg-(--color-accent)"
            style={{ opacity: 0.6 }}
          />
          <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3) leading-relaxed">
            Stefan Heinz Screpka{' '}
            <span aria-hidden="true" className="mx-1 text-(--color-text-3)/60">
              ·
            </span>
            Ponta Grossa, Paraná{' '}
            <span aria-hidden="true" className="mx-1 text-(--color-text-3)/60">
              ·
            </span>
            <span className="text-(--color-accent)">disponível</span>{' '}
            <span aria-hidden="true" className="text-(--color-accent)">
              ✺
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
