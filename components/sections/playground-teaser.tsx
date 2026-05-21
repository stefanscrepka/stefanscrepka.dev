'use client';

import { m, useInView } from 'motion/react';
import Link from 'next/link';
import { useRef } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { EASES } from '@/lib/animation/eases';
import { cn } from '@/lib/utils';

// PlaygroundTeaser — bridge entre TimelineSection e ManifestoSection.
// Três cards 3-up (Hanoi 3D · Fibonacci · Parens), cada um preview estático
// editorial + CTA "Ver completo →" linkando pra /playground#tab.
//
// Visual: glass-panel + inset-bisel + hairline + lime hover. Sem competir com
// FeaturedWork (3 cards bem menores, aspect-square). Reveal stagger Motion 12
// dramatic ease, on view once.

interface TeaserCard {
  href: string;
  index: string;
  name: string;
  subtitle: string;
  description: string;
  preview: 'hanoi' | 'fibonacci' | 'parens';
}

const TEASER_CARDS: TeaserCard[] = [
  {
    href: '/playground#tab-hanoi',
    index: '01',
    name: 'Hanoi 3D',
    subtitle: 'r3f · recursão visualizada',
    description:
      'Torre de Hanoi rodando em react-three-fiber. Move 8 discos, vê recursão acontecer.',
    preview: 'hanoi',
  },
  {
    href: '/playground#tab-fibonacci',
    index: '02',
    name: 'Fibonacci',
    subtitle: 'canvas · O(2ⁿ) vs O(n)',
    description: 'Comparativo de complexidade: ingênuo vs memoizado, no mesmo gráfico, tempo real.',
    preview: 'fibonacci',
  },
  {
    href: '/playground#tab-parens',
    index: '03',
    name: 'Parênteses',
    subtitle: 'SVG · pilha balanceamento',
    description: 'Stack visualizada. Digita expressão, vê push/pop, sabe na hora se balanceia.',
    preview: 'parens',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASES.dramatic },
  },
};

export function PlaygroundTeaser() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const inView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });

  return (
    <section
      id="playground-teaser"
      ref={ref}
      className="container-max section-pad-y border-t border-(--color-hairline)"
      data-slot="playground-teaser"
    >
      <header className="mb-12 flex flex-col gap-3 sm:mb-16">
        <p className="eyebrow">PLAYGROUND</p>
        <h2
          className={cn(
            'font-semibold text-(--color-text-1)',
            'text-3xl sm:text-4xl lg:text-5xl',
            '!tracking-[-0.025em] !leading-[1.02] text-balance'
          )}
        >
          Coisas que construí
          <br />
          pra aprender.
        </h2>
        <p className="mt-2 max-w-prose text-reading text-(--color-text-2)">
          Algoritmos C da faculdade virando demos interativos. Visualizar é entender — recursão,
          complexidade, pilha. Cada um vive numa página própria, isolado, sem custo na home.
        </p>
      </header>

      <m.div
        initial="hidden"
        animate={reduced || inView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="grid gap-6 sm:grid-cols-3 sm:gap-8"
      >
        {TEASER_CARDS.map((card) => (
          <m.div key={card.href} variants={cardVariants}>
            <TeaserCardLink card={card} />
          </m.div>
        ))}
      </m.div>

      <p className="mt-10 text-center font-mono text-2xs uppercase tracking-widest text-(--color-text-3) sm:mt-12">
        <Link
          href="/playground"
          className={cn(
            'inline-flex items-center gap-2 outline-none',
            'text-(--color-text-3) transition-colors duration-(--motion-fast)',
            'hover:text-(--color-accent) focus-visible:text-(--color-accent)'
          )}
        >
          Ver todos no playground
          <span aria-hidden="true">→</span>
        </Link>
      </p>
    </section>
  );
}

/* ============================================================
   Card link — aspect-[4/3] glass-panel + preview + microcopy
   ============================================================ */

function TeaserCardLink({ card }: { card: TeaserCard }) {
  return (
    <Link
      href={card.href}
      className={cn(
        'group/teaser relative isolate flex flex-col gap-4 overflow-hidden rounded-2xl p-5 outline-none',
        'border border-(--color-hairline) glass-panel',
        'shadow-[var(--shadow-md),var(--shadow-inset-bisel)]',
        'transition-[transform,border-color,box-shadow] duration-(--motion-page) ease-(--ease-smooth)',
        'hover:-translate-y-[2px] hover:border-(--color-accent)',
        'hover:shadow-[var(--shadow-lg),var(--shadow-inset-bisel),0_0_36px_var(--color-accent-glow)]',
        'focus-visible:-translate-y-[2px] focus-visible:border-(--color-accent)',
        'focus-visible:shadow-[var(--shadow-lg),var(--shadow-inset-bisel),0_0_36px_var(--color-accent-glow)]'
      )}
    >
      {/* Preview canvas — aspect-[4/3] surface */}
      <div
        aria-hidden="true"
        className={cn(
          'relative aspect-[4/3] w-full overflow-hidden rounded-xl',
          'border border-(--color-hairline)/60 bg-(--color-surface)'
        )}
      >
        <CardPreview kind={card.preview} />
      </div>

      {/* Sequence label */}
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-2xs uppercase tracking-widest text-(--color-accent) tabular-nums">
          {card.index}
        </span>
        <span aria-hidden="true" className="text-(--color-text-3)">
          ·
        </span>
        <span className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
          {card.subtitle}
        </span>
      </div>

      {/* Name */}
      <h3
        className={cn(
          'font-semibold text-(--color-text-1)',
          'text-xl sm:text-2xl',
          '!tracking-tight !leading-[1.1]'
        )}
      >
        {card.name}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed text-(--color-text-2)">{card.description}</p>

      {/* CTA */}
      <span
        className={cn(
          'mt-auto inline-flex items-center gap-2 font-mono text-sm text-(--color-accent)',
          'transition-[gap,color] duration-(--motion-transition) ease-(--ease-smooth)',
          'group-hover/teaser:gap-3 group-hover/teaser:text-(--color-accent-hover)',
          'group-focus-visible/teaser:gap-3 group-focus-visible/teaser:text-(--color-accent-hover)'
        )}
      >
        Ver completo
        <span
          aria-hidden="true"
          className={cn(
            'inline-block transition-transform duration-(--motion-transition) ease-(--ease-smooth)',
            'group-hover/teaser:translate-x-[2px] group-focus-visible/teaser:translate-x-[2px]'
          )}
        >
          →
        </span>
      </span>
    </Link>
  );
}

/* ============================================================
   Card preview — SVG estático editorial por algoritmo.
   Zero JS/canvas pesado na home (preview real vive em /playground).
   ============================================================ */

function CardPreview({ kind }: { kind: TeaserCard['preview'] }) {
  if (kind === 'hanoi') return <HanoiPreview />;
  if (kind === 'fibonacci') return <FibonacciPreview />;
  return <ParensPreview />;
}

function HanoiPreview() {
  return (
    <svg
      viewBox="0 0 200 150"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 size-full"
      aria-hidden="true"
      focusable="false"
    >
      {/* Base */}
      <line
        x1="20"
        y1="120"
        x2="180"
        y2="120"
        stroke="var(--color-hairline-strong)"
        strokeWidth="1"
      />
      {/* Pegs */}
      {[50, 100, 150].map((cx) => (
        <line
          key={cx}
          x1={cx}
          y1="50"
          x2={cx}
          y2="120"
          stroke="var(--color-hairline-strong)"
          strokeWidth="1"
        />
      ))}
      {/* Discs torre esquerda (4 discos) */}
      <rect x="25" y="115" width="50" height="5" rx="2" fill="var(--color-accent)" opacity="0.95" />
      <rect x="30" y="107" width="40" height="5" rx="2" fill="var(--color-accent)" opacity="0.7" />
      <rect x="35" y="99" width="30" height="5" rx="2" fill="var(--color-accent)" opacity="0.5" />
      <rect x="40" y="91" width="20" height="5" rx="2" fill="var(--color-accent)" opacity="0.35" />
      {/* Disc no meio (em trânsito) */}
      <rect x="85" y="115" width="30" height="5" rx="2" fill="var(--color-accent)" opacity="0.8" />
      {/* Label */}
      <text
        x="100"
        y="40"
        fontSize="9"
        fontFamily="var(--font-mono)"
        fill="var(--color-text-3)"
        textAnchor="middle"
        letterSpacing="2"
      >
        n=4 · 15 moves
      </text>
    </svg>
  );
}

function FibonacciPreview() {
  // Duas curvas: ingênuo (exponencial) vs memoizado (linear).
  return (
    <svg
      viewBox="0 0 200 150"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 size-full"
      aria-hidden="true"
      focusable="false"
    >
      {/* Grid */}
      <line
        x1="20"
        y1="130"
        x2="180"
        y2="130"
        stroke="var(--color-hairline-strong)"
        strokeWidth="1"
      />
      <line
        x1="20"
        y1="30"
        x2="20"
        y2="130"
        stroke="var(--color-hairline-strong)"
        strokeWidth="1"
      />
      {/* Memoizado (linear flat) — lime fraco */}
      <path
        d="M 20 128 L 60 125 L 100 122 L 140 120 L 175 118"
        stroke="var(--color-accent)"
        strokeWidth="1.2"
        fill="none"
        opacity="0.45"
      />
      {/* Ingênuo (exponencial) — lime forte */}
      <path
        d="M 20 128 Q 80 128, 110 110 Q 140 80, 175 35"
        stroke="var(--color-accent)"
        strokeWidth="1.6"
        fill="none"
      />
      {/* Labels */}
      <text
        x="100"
        y="20"
        fontSize="9"
        fontFamily="var(--font-mono)"
        fill="var(--color-text-3)"
        textAnchor="middle"
        letterSpacing="2"
      >
        O(2ⁿ) vs O(n)
      </text>
      <text
        x="170"
        y="46"
        fontSize="8"
        fontFamily="var(--font-mono)"
        fill="var(--color-accent)"
        textAnchor="end"
      >
        ingênuo
      </text>
      <text
        x="170"
        y="113"
        fontSize="8"
        fontFamily="var(--font-mono)"
        fill="var(--color-accent)"
        textAnchor="end"
        opacity="0.6"
      >
        memo
      </text>
    </svg>
  );
}

function ParensPreview() {
  // Stack vertical com símbolos abrindo/fechando.
  return (
    <svg
      viewBox="0 0 200 150"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 size-full"
      aria-hidden="true"
      focusable="false"
    >
      {/* Expression line */}
      <text
        x="20"
        y="30"
        fontSize="11"
        fontFamily="var(--font-mono)"
        fill="var(--color-text-2)"
        letterSpacing="2"
      >
        ( [ {} ] )
      </text>
      {/* Stack box */}
      <rect
        x="60"
        y="55"
        width="80"
        height="80"
        rx="4"
        fill="none"
        stroke="var(--color-hairline-strong)"
        strokeWidth="1"
      />
      {/* Stack frames (3 vazias + topo) */}
      {[
        { y: 125, label: '(' },
        { y: 108, label: '[' },
        { y: 91, label: '{' },
      ].map((frame, i) => (
        <g key={frame.label}>
          <rect
            x="64"
            y={frame.y - 12}
            width="72"
            height="14"
            rx="2"
            fill="var(--color-accent)"
            opacity={0.85 - i * 0.15}
          />
          <text
            x="100"
            y={frame.y - 2}
            fontSize="9"
            fontFamily="var(--font-mono)"
            fill="var(--color-base)"
            textAnchor="middle"
            fontWeight="600"
          >
            {frame.label}
          </text>
        </g>
      ))}
      <text
        x="100"
        y="148"
        fontSize="8"
        fontFamily="var(--font-mono)"
        fill="var(--color-text-3)"
        textAnchor="middle"
        letterSpacing="2"
      >
        stack · top → bottom
      </text>
    </svg>
  );
}
