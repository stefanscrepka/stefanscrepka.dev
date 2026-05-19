'use client';

import { m, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// Bento Grid client: stagger reveal + hover lime border + SVG tracing line
// perimeter draw (top→right→bottom→left, 600ms).
// Reduced-motion: hover keeps subtle scale only, sem tracing line, sem stagger.

export interface BentoSkillsCell {
  size: 'large' | 'small';
  heading: string;
  tags: string[];
  note?: string;
}

const ROW1_GRID = 'col-span-1 sm:col-span-4 lg:col-span-4';
const SMALL_GRID = 'col-span-1 sm:col-span-2 lg:col-span-2';

const CELL_CLASS_BY_SIZE: Record<BentoSkillsCell['size'], string> = {
  large: ROW1_GRID,
  small: SMALL_GRID,
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
          className={cn(CELL_CLASS_BY_SIZE[cell.size], 'min-h-[14rem]')}
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

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: decorative hover container; tag elements remain focusable
    <article
      data-slot="bento-cell"
      data-size={cell.size}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className={cn(
        'group/cell relative isolate flex h-full flex-col gap-5 overflow-hidden p-6 sm:p-7',
        'rounded-2xl border border-(--color-hairline) bg-(--color-surface)',
        'transition-[border-color,transform,box-shadow]',
        'duration-(--motion-fast) ease-(--ease-standard)',
        'hover:border-(--color-accent)',
        'focus-within:border-(--color-accent)',
        'hover:shadow-(--shadow-glow-lime-sm)',
        reduced ? 'hover:scale-[1.005]' : 'hover:scale-[1.015] hover:-translate-y-0.5'
      )}
    >
      {/* Animated perimeter trace (SVG path, drawn top→right→bottom→left).
          Pointer-events none, aria-hidden — pure decoration. */}
      {!reduced ? <PerimeterTrace active={hover} /> : null}

      <header className="flex items-baseline justify-between gap-3">
        <h3 className="font-mono text-xs uppercase tracking-widest text-(--color-accent)">
          {cell.heading}
        </h3>
        <span
          aria-hidden="true"
          className="font-mono text-[10px] uppercase tracking-widest text-(--color-text-3)"
        >
          {cell.size === 'large' ? '◆◆' : '◆'}
        </span>
      </header>

      <ul className="flex flex-wrap gap-1.5 text-xs">
        {cell.tags.map((tag) => (
          <li
            key={tag}
            className={cn(
              'rounded-md border border-(--color-hairline-strong)',
              'bg-(--color-surface-elevated) px-2 py-1',
              'font-mono text-[11px] text-(--color-text-2)',
              'transition-colors duration-(--motion-fast)',
              'group-hover/cell:border-(--color-accent-emissive)',
              'group-hover/cell:text-(--color-text-1)'
            )}
          >
            {tag}
          </li>
        ))}
      </ul>

      {cell.note ? (
        <p className="mt-auto pt-2 text-sm leading-relaxed text-(--color-text-2)">{cell.note}</p>
      ) : null}
    </article>
  );
}

// SVG perimeter trace — 4 segments synced via stagger.
// Path total length normalized to ~400 (relative units). Use pathLength="1"
// to make stroke-dashoffset/dasharray work as 0..1 progress.
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
