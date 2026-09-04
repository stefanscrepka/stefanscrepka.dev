'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Linha de prova entre o Hero e o Featured Work: três produtos, uma frase
// cada. F7 (2026-09-04): a versão anterior era um empilhado de palavras-chave
// ("22 agentes Claude SDK · orquestrados em 5 squads, cron 24/7") que lia
// como ficha técnica de robô. Agora cada linha diz o que o produto FAZ, em
// português, e o número que sobrou é o que o código confirma (19 agentes,
// registro em apps/web/src/lib/agent-roles.ts).
//
// Reveal: stagger 80ms via IntersectionObserver one-shot. Reduced-motion: snap.

interface ProofLineItem {
  href: string;
  /** A frase. Curta, com verbo. */
  headline: string;
  /** Um fato verificável, em mono. */
  fact: string;
  product: string;
}

const PROOF_LINES: ProofLineItem[] = [
  {
    href: '/work/content-engine',
    headline: 'Uma equipe de agentes escreve, revisa e espera a sua aprovação. Todo dia.',
    fact: '19 agentes Claude · 5 squads · cron às 03h',
    product: 'Content Engine',
  },
  {
    href: '/work/caluna',
    headline: 'A secretária de clínica que atende no WhatsApp, agenda e lembra sozinha.',
    fact: 'Next 14 · Evolution API · 35 modelos Prisma',
    product: 'Caluna',
  },
  {
    href: '/work/stark',
    headline: 'A passagem de turno de uma linha de OSB saiu do Excel e foi pro telão.',
    fact: 'OEE dígito a dígito · 153 testes',
    product: 'STARK',
  },
];

export function SocialProofLine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      aria-label="Três produtos em produção"
      className={cn(
        'container-max relative z-10',
        'border-t border-b border-(--color-hairline)',
        'py-5 sm:py-6'
      )}
      data-slot="social-proof-line"
    >
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6 lg:gap-10">
        {PROOF_LINES.map((line, idx) => (
          <li
            key={line.href}
            className={cn(
              'transition-[opacity,transform] duration-(--motion-page) ease-(--ease-dramatic)',
              visible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
            )}
            style={{ transitionDelay: visible ? `${idx * 80}ms` : '0ms' }}
          >
            <Link
              href={line.href}
              className={cn(
                'group/proof flex h-full flex-col gap-2 rounded-md outline-hidden',
                'transition-colors duration-(--motion-fast) ease-(--ease-standard)',
                'focus-visible:ring-2 focus-visible:ring-(--color-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg)'
              )}
            >
              <span className="font-mono text-2xs uppercase tracking-wider text-(--color-accent)">
                {line.product}
              </span>
              <span className="text-pretty text-sm font-medium leading-snug text-(--color-text-1) sm:text-base">
                {line.headline}
              </span>
              <span className="mt-auto inline-flex items-center gap-2 pt-1 font-mono text-xs text-(--color-text-3) transition-colors group-hover/proof:text-(--color-text-2)">
                {line.fact}
                <span
                  aria-hidden="true"
                  className="inline-block text-(--color-accent) transition-transform duration-(--motion-fast) group-hover/proof:translate-x-0.5 group-focus-visible/proof:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
