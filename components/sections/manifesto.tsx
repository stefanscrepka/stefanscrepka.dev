'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMemo, useRef } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';
import { ManifestoBackdrop } from './manifesto-backdrop';

gsap.registerPlugin(ScrollTrigger);

// Section 11 — Manifesto. Text Generate Effect (word-by-word reveal stagger 80ms,
// 600ms ease-dramatic). Trigger on view via ScrollTrigger.
// Reduced-motion: snap full text immediately.
//
// PLACEHOLDER COPY — substituir pela §C13 (Asset Bible) quando Stefan entregar.
// HANDOFF veta "chão de fábrica" / "eletrotécnica" no hero ou headline; manifesto
// pode tocar heritage industrial mas com moderação (Stefan: "você tá focando demais").

const MANIFESTO_TEXT = `Software sério tem o mesmo padrão de qualquer sistema crítico: ou funciona 24/7 ou alguém perde dinheiro. Eu construo nesse padrão.

TypeScript strict. Contratos de teste. Observabilidade real. Prompts que não inventam. Multi-agente Claude SDK orquestrado em squads. Três produtos em produção — NexaCore, Content Engine, STJ App — provam.

Não vendo "ajudo empresas a inovar". Vendo entrega que paga conta. Aprovação humana em ≤10 minutos por dia. Anti-slop validator com 14 regex pt-BR. Stack local GPU subsidiando custo de inferência.

Construo IA multi-agente em produção — e o produto inteiro ao redor dela.`;

interface ManifestoSectionProps {
  text?: string;
  className?: string;
}

export function ManifestoSection({ text = MANIFESTO_TEXT, className }: ManifestoSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  // Split em paragraphs preservando line breaks
  const paragraphs = useMemo(
    () =>
      text
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean),
    [text]
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
        stagger: 0.04,
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
    { dependencies: [reduced, paragraphs.length] }
  );

  return (
    <section
      id="manifesto"
      className={cn('relative isolate section-pad-y-lg', className)}
      data-slot="manifesto"
    >
      <ManifestoBackdrop />
      <div className="container-prose flex flex-col gap-8">
        <p className="eyebrow">Manifesto</p>
        <div
          ref={ref}
          className="flex flex-col gap-6 text-lg leading-relaxed text-(--color-text-1)"
        >
          {paragraphs.map((para, pIdx) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: manifesto text is static, paragraphs never reorder
            <p key={`p-${pIdx}-${para.slice(0, 24)}`}>
              {para.split(/(\s+)/).map((word, wIdx) => {
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
        <p className="font-mono text-xs text-(--color-text-3)">
          — Stefan Heinz Screpka · Ponta Grossa, PR
        </p>
      </div>
    </section>
  );
}
