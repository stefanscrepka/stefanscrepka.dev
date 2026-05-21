'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Linha de prova social entre Hero e FeaturedWork — ponte narrativa que sinaliza
// "três produtos em produção" antes do scroll mergulhar nos cases.
//
// Estilo midu+landonorris híbrido: mono uppercase tracking-widest + glyph lime
// que pulsa no hover + hairline-top e hairline-bottom contendo o strip.
// Cada linha é um <Link> pra anchor da sub-rota (#work mantém visitante na home).
//
// Reveal: stagger 80ms via IntersectionObserver one-shot. Reduced-motion: snap.

interface ProofLineItem {
  href: string;
  /** Pré-glyph: número/destaque tabular-nums lime. */
  highlight: string;
  /** Body: claim curto sem peso de marketing. */
  body: string;
  /** Sufixo discreto pra identificar o produto. */
  product: string;
}

const PROOF_LINES: ProofLineItem[] = [
  {
    href: '/work/content-engine',
    highlight: '22 agentes Claude SDK',
    body: 'orquestrados em 5 squads, cron 24/7',
    product: 'Content Engine',
  },
  {
    href: '/work/nexacore',
    highlight: 'B2B em produção',
    body: 'multi-tenant clínicas estéticas',
    product: 'NexaCore · striveos.shop',
  },
  {
    href: '/work/stj-app',
    highlight: '162 testes runtime',
    body: 'PWA cockpit + prompt cache 2 camadas',
    product: 'STJ App',
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
      aria-label="Prova social — três produtos em produção"
      className={cn(
        'container-max relative z-10',
        'border-t border-b border-(--color-hairline)',
        'py-4 sm:py-5'
      )}
      data-slot="social-proof-line"
    >
      <ul className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        {PROOF_LINES.map((line, idx) => (
          <li
            // biome-ignore lint/correctness/useUniqueElementIds: stagger key is the href which is unique
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
                'group/proof inline-flex items-baseline gap-2 font-mono text-2xs uppercase',
                'tracking-widest text-(--color-text-3) leading-relaxed',
                'transition-colors duration-(--motion-fast) ease-(--ease-standard)',
                'hover:text-(--color-text-1) focus-visible:text-(--color-text-1) outline-none'
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'inline-block translate-y-px text-(--color-accent)',
                  'transition-transform duration-(--motion-fast)',
                  'group-hover/proof:translate-x-0.5 group-focus-visible/proof:translate-x-0.5'
                )}
              >
                →
              </span>
              <span className="text-(--color-text-1)">{line.highlight}</span>
              <span aria-hidden="true" className="text-(--color-hairline-strong)">
                ·
              </span>
              <span>{line.body}</span>
              <span aria-hidden="true" className="text-(--color-hairline-strong)">
                ·
              </span>
              <span className="text-(--color-accent)">{line.product}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
