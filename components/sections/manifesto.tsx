'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMemo, useRef } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';
import { ManifestoBackdrop } from './manifesto-backdrop';

gsap.registerPlugin(ScrollTrigger);

// Section 11 — Manifesto em 3 atos editorial:
//   ATO 1 — Pull-quote serif italic 32-40px (primeira frase isolada, o gancho)
//   ATO 2 — 4 hairlines horizontais 60-100px stagger (break editorial)
//   ATO 3 — Prose corpo 18px text-1 72ch normal (parágrafos do meio com word-stagger)
//   ATO 4 — Último parágrafo serif italic 28px peso heavy (assinatura final)
// Backdrop existente expande full-section com light beam vertical lime.

const MANIFESTO_PULL_QUOTE =
  'Software sério tem o mesmo padrão de qualquer sistema crítico: ou funciona 24/7 ou alguém perde dinheiro.';

const MANIFESTO_BODY_PARAGRAPHS = [
  'Eu construo nesse padrão. TypeScript strict. Contratos de teste. Observabilidade real. Prompts que não inventam. Multi-agente Claude SDK orquestrado em squads. Três produtos em produção — NexaCore, Content Engine, STJ App — provam.',
  'Não vendo "ajudo empresas a inovar". Vendo entrega que paga conta. Aprovação humana em ≤10 minutos por dia. Anti-slop validator com 14 regex pt-BR. Stack local GPU subsidiando custo de inferência.',
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
      <div className="container-prose flex flex-col gap-10">
        <p className="eyebrow">Manifesto</p>

        {/* ATO 1 — Pull-quote serif italic (primeira frase, o gancho) */}
        <blockquote
          className="border-l-2 border-(--color-accent) pl-6 py-2"
          style={{ borderLeftWidth: '2px' }}
        >
          <p
            className={cn(
              'leading-[1.05] tracking-[-0.01em]',
              'text-2xl sm:text-3xl lg:text-[2.25rem]',
              'text-(--color-text-1)'
            )}
            style={{
              fontFamily: 'var(--font-editorial)',
              fontStyle: 'italic',
              fontWeight: 500,
            }}
          >
            “{MANIFESTO_PULL_QUOTE}”
          </p>
        </blockquote>

        {/* ATO 2 — 4 hairlines horizontais break editorial */}
        <div aria-hidden="true" className="my-2 flex flex-col gap-1.5">
          {[60, 80, 100, 70].map((w, i) => (
            <span
              key={`break-${i}-${w}`}
              className="block h-px bg-(--color-accent)"
              style={{ width: `${w}px`, opacity: 0.45 - i * 0.08 }}
            />
          ))}
        </div>

        {/* ATO 3 — Prose corpo 18px com word-stagger GSAP */}
        <div
          ref={ref}
          className="flex flex-col gap-6 text-lg leading-relaxed text-(--color-text-1)"
        >
          {paragraphsWithWords.map((para, pIdx) => (
            <p key={`p-${pIdx}-${para.text.slice(0, 24)}`}>
              {para.words.map((word, wIdx) => {
                const key = `w-${pIdx}-${wIdx}-${word.length}`;
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
          ))}
        </div>

        {/* ATO 4 — Assinatura final serif italic peso heavy */}
        <p
          className={cn(
            'leading-tight tracking-tight',
            'text-xl sm:text-2xl lg:text-3xl',
            'text-(--color-accent)'
          )}
          style={{
            fontFamily: 'var(--font-editorial)',
            fontStyle: 'italic',
            fontWeight: 600,
          }}
        >
          {MANIFESTO_SIGNATURE}
        </p>

        <p className="mt-4 font-mono text-xs text-(--color-text-3)">
          — Stefan Heinz Screpka · Ponta Grossa, PR · ✺
        </p>
      </div>
    </section>
  );
}
