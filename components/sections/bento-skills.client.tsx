'use client';

import { m, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { type TechId, TechLogo } from '@/components/shared/tech-logo';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// Bento Grid 6-col com hierarquia declarada:
//   - 'xl'      → col-span 4, row-span 3 (IA AGENTIC com "22" 220px)
//   - 'small'   → col-span 2, row-span 1 (RAG/Frontend/Backend stack vertical)
//   - 'wide'    → col-span 6, row-span 1 (INFRA full-width com status bars + integrations strip)

export interface BentoSkillsCell {
  size: 'xl' | 'small' | 'wide';
  heading: string;
  techs: TechId[];
  extras?: string[];
  note?: string;
  feature?: 'count' | 'live';
  count?: number;
  countSuffix?: string;
  /** Apenas no INFRA wide cell — chip strip de integrações inline. */
  integrations?: string[];
}

const CELL_CLASS_BY_SIZE: Record<BentoSkillsCell['size'], string> = {
  xl: 'col-span-1 sm:col-span-6 lg:col-span-4 lg:row-span-3',
  small: 'col-span-1 sm:col-span-3 lg:col-span-2',
  wide: 'col-span-1 sm:col-span-6 lg:col-span-6',
};

const MIN_HEIGHT_BY_SIZE: Record<BentoSkillsCell['size'], string> = {
  xl: 'min-h-[420px] lg:min-h-[640px]',
  small: 'min-h-[14rem]',
  wide: 'min-h-[340px]',
};

interface BentoSkillsGridProps {
  cells: BentoSkillsCell[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.165, 0.84, 0.44, 1] as const },
  },
};

export function BentoSkillsGrid({ cells }: BentoSkillsGridProps) {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -120px 0px' });

  return (
    <m.ul
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
      }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-6 sm:gap-5"
    >
      {cells.map((cell) => (
        <m.li
          key={cell.heading}
          variants={itemVariants}
          className={cn(CELL_CLASS_BY_SIZE[cell.size], MIN_HEIGHT_BY_SIZE[cell.size])}
        >
          <BentoCell cell={cell} />
        </m.li>
      ))}
    </m.ul>
  );
}

function BentoCell({ cell }: { cell: BentoSkillsCell }) {
  const [hover, setHover] = useState(false);
  const reduced = useReducedMotionSafe();
  const isXL = cell.size === 'xl';
  const isWide = cell.size === 'wide';

  return (
    <article
      data-slot="bento-cell"
      data-size={cell.size}
      data-feature={cell.feature}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className={cn(
        'group/cell relative isolate flex h-full flex-col gap-4 overflow-hidden p-6 sm:p-7',
        'rounded-2xl border border-(--color-hairline) bg-(--color-surface)',
        'transition-[border-color,transform,box-shadow]',
        'duration-(--motion-fast) ease-(--ease-standard)',
        'hover:border-(--color-accent)',
        'focus-within:border-(--color-accent)',
        'hover:shadow-(--shadow-glow-lime-sm)',
        reduced ? 'hover:scale-[1.003]' : 'hover:-translate-y-0.5',
        isXL && 'lg:p-10',
        isWide && 'lg:p-8'
      )}
    >
      {!reduced ? <PerimeterTrace active={hover} /> : null}

      <header className="flex items-baseline justify-between gap-3">
        <h3
          className={cn(
            'font-mono uppercase tracking-widest text-(--color-accent)',
            isXL ? 'text-sm' : 'text-xs'
          )}
        >
          {cell.heading}
        </h3>
        <span
          aria-hidden="true"
          className="font-mono text-[10px] uppercase tracking-widest text-(--color-text-3)"
        >
          {cell.size === 'xl' ? '◆◆◆' : cell.size === 'wide' ? '═══' : '◆'}
        </span>
      </header>

      {/* Feature visual XL — "22" GIGANTE */}
      {cell.feature === 'count' && cell.count !== undefined ? (
        <div className="flex items-baseline gap-3 pb-1 pt-2">
          <span
            aria-hidden="true"
            className={cn(
              'mono-stats font-bold leading-none text-(--color-accent) tabular-nums',
              isXL ? 'text-[140px] sm:text-[180px] lg:text-[220px]' : 'text-6xl sm:text-7xl'
            )}
            style={{ letterSpacing: '-0.04em' }}
          >
            {cell.count}
          </span>
          {cell.countSuffix ? (
            <span
              className={cn(
                'font-mono uppercase tracking-widest text-(--color-text-3)',
                isXL ? 'text-sm max-w-[16ch]' : 'text-xs'
              )}
            >
              <span className="sr-only">{`${cell.count} `}</span>
              {cell.countSuffix}
            </span>
          ) : null}
        </div>
      ) : null}

      {/* Tech logos */}
      {cell.techs.length > 0 ? (
        <ul className="flex flex-wrap gap-x-3 gap-y-2">
          {cell.techs.map((id) => (
            <li key={id}>
              <TechLogo id={id} size={isXL ? 20 : 16} showLabel />
            </li>
          ))}
        </ul>
      ) : null}

      {/* Extras chip list */}
      {cell.extras && cell.extras.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {cell.extras.map((tag) => (
            <li
              key={tag}
              className={cn(
                'rounded-md border border-(--color-hairline-strong)',
                'bg-(--color-surface-elevated) px-2 py-0.5',
                'font-mono text-[10px] text-(--color-text-3)',
                'transition-colors duration-(--motion-fast)',
                'group-hover/cell:border-(--color-accent-emissive)',
                'group-hover/cell:text-(--color-text-2)'
              )}
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Status bars LIVE (wide INFRA cell) */}
      {cell.feature === 'live' ? (
        <div className="grid gap-2 pt-2 sm:grid-cols-2 lg:grid-cols-4">
          {['Vercel deploy', 'Coolify VPS', 'Sentry errors', 'Langfuse traces'].map((service) => (
            <StatusBar key={service} label={service} reduced={reduced ?? false} />
          ))}
        </div>
      ) : null}

      {cell.note ? (
        <p
          className={cn(
            'pt-2 leading-relaxed text-(--color-text-2)',
            isXL ? 'text-base mt-auto' : 'text-sm mt-auto'
          )}
        >
          {cell.note}
        </p>
      ) : null}

      {/* Integrações chip strip (wide INFRA cell only) — horizontal scroll-snap */}
      {cell.integrations && cell.integrations.length > 0 ? (
        <div className="mt-3 border-t border-(--color-hairline) pt-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-(--color-text-3) mb-2">
            ↳ INTEGRAÇÕES
          </p>
          <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {cell.integrations.map((name) => (
              <li
                key={name}
                className="shrink-0 rounded-md border border-(--color-hairline-strong) bg-(--color-base) px-3 py-1.5 font-mono text-[11px] text-(--color-text-2)"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}

function StatusBar({ label, reduced }: { label: string; reduced: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-(--color-hairline) bg-(--color-base) px-3 py-2.5">
      <span className="relative flex size-2 shrink-0 items-center justify-center">
        {!reduced ? (
          <span
            aria-hidden="true"
            className="absolute inline-flex size-full animate-ping rounded-full opacity-50"
            style={{ background: 'var(--color-success)' }}
          />
        ) : null}
        <span
          aria-hidden="true"
          className="relative inline-flex size-2 rounded-full"
          style={{ background: 'var(--color-success)', boxShadow: '0 0 6px var(--color-success)' }}
        />
      </span>
      <span className="flex-1 font-mono text-xs text-(--color-text-1)">{label}</span>
      <ProgressBar reduced={reduced} />
      <span className="font-mono text-[10px] uppercase tracking-widest text-(--color-success)">
        ok
      </span>
    </div>
  );
}

function ProgressBar({ reduced }: { reduced: boolean }) {
  // Mini progress bar visual — 6 bars dancing. Reduced-motion: static at 80%.
  return (
    <div className="flex items-end gap-0.5 h-3">
      {[3, 5, 7, 5, 8, 6].map((h, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block w-0.5 bg-(--color-success)"
          style={{
            height: `${h * 1.5}px`,
            opacity: 0.65,
            ...(reduced
              ? {}
              : {
                  animation: `progressPulse ${1.5 + i * 0.15}s ease-in-out ${i * 0.1}s infinite alternate`,
                }),
          }}
        />
      ))}
      <style>
        {`@keyframes progressPulse { from { transform: scaleY(0.6); opacity: 0.35; } to { transform: scaleY(1); opacity: 0.85; } }`}
      </style>
    </div>
  );
}

function PerimeterTrace({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 size-full"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <title>perimeter glow</title>
      <m.rect
        x="1"
        y="1"
        width="98"
        height="98"
        rx="6"
        ry="6"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="0.6"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        initial={{ strokeDashoffset: 1, opacity: 0 }}
        animate={active ? { strokeDashoffset: 0, opacity: 1 } : { strokeDashoffset: 1, opacity: 0 }}
        transition={{
          strokeDashoffset: { duration: 0.6, ease: [0.165, 0.84, 0.44, 1] },
          opacity: { duration: 0.18, ease: [0.2, 0, 0, 1] },
        }}
      />
    </svg>
  );
}
