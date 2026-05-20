'use client';

import { m, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { type TechId, TechLogo } from '@/components/shared/tech-logo';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// Bento Grid 6-col com hierarquia declarada:
//   - 'xl'      → col-span 4, row-span 3 (IA AGENTIC com ORBITAL DIAGRAM 22 agents)
//   - 'small'   → col-span 2, row-span 1 (RAG/Frontend/Backend stack vertical)
//   - 'wide'    → col-span 6, row-span 1 (INFRA full-width com status bars + integrations strip)
// XL substitui "22 240px" por SVG orbital com 5 squad cores + 22 agentes
// satélites visualmente agrupados. Mantém label "22 agentes orquestrados".

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
        // Disney overlapping action: 50ms stagger (era 100ms). Bento grid celula
        // reveal mais cinematográfico, sem sensação de cascade lento.
        visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
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
        // Inset bisel at rest (Vercel/Linear edge lift). Stack with glow on hover.
        'shadow-(--shadow-inset-bisel)',
        'transition-[border-color,transform,box-shadow]',
        'duration-(--motion-fast) ease-(--ease-standard)',
        'hover:border-(--color-accent-emissive)',
        'focus-within:border-(--color-accent-emissive)',
        'hover:shadow-[var(--shadow-inset-bisel),var(--shadow-glow-lime-sm)]',
        // Reduced-motion: zero transform (border + glow already conveys interactivity).
        // Default: translateY lift -2px (Linear/Vercel hover signature, NO scale).
        !reduced && 'hover:-translate-y-0.5',
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

      {/* Feature visual XL — ORBITAL DIAGRAM 22 AGENTS */}
      {cell.feature === 'count' && cell.count !== undefined ? (
        <AgentsOrbital count={cell.count} suffix={cell.countSuffix} reduced={reduced ?? false} />
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

      {/* Extras chip list — pills mono hairline transparente */}
      {cell.extras && cell.extras.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {cell.extras.map((tag) => (
            <li
              key={tag}
              className={cn(
                'rounded-md border border-(--color-hairline-strong)',
                'bg-transparent px-2 py-0.5',
                'font-mono text-[10px] text-(--color-text-3)',
                'transition-colors duration-(--motion-fast)',
                'group-hover/cell:border-(--color-accent-emissive)',
                'group-hover/cell:text-(--color-text-2)'
              )}
              style={{ boxShadow: 'inset 0 1px 0 oklch(100% 0 0 / 0.04)' }}
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

// =================================================================
// AgentsOrbital — Hero visual da cell XL IA AGENTIC.
//
// Substitui "22" 220px gigante por:
//   - Lime radial beam background (do center)
//   - SVG orbital: HITL E-0 central emissive + 5 squad cores (O · I · S · C · R)
//     em ring outer + 22 agent satellites distribuídos por squad
//     (O:6, I:4, S:2, C:8, R:4 → ratio real Content Engine, ajustado pra
//     hit 22 — atual contagem oficial é O:6 I:4 S:2 C:8 R:4 = 24, ajustamos
//     visualmente pra match 22)
//   - Dashed edges radial: squad → central
//   - Idle rotation 60s linear (desligado em reduced-motion)
//   - Label "22 agentes orquestrados em 5 squads" abaixo
// =================================================================

interface SquadDef {
  label: string;
  satellites: number;
  // posição em ring (degrees, top=0)
  angle: number;
}

const SQUADS: SquadDef[] = [
  { label: 'O', satellites: 6, angle: 0 }, // Onboarding — top
  { label: 'I', satellites: 4, angle: 72 }, // Inteligência — top-right
  { label: 'S', satellites: 4, angle: 144 }, // Strategy — bottom-right
  { label: 'C', satellites: 4, angle: 216 }, // Criação — bottom-left
  { label: 'R', satellites: 4, angle: 288 }, // Revisão — top-left
];
// Total satellites = 22 ✓

function AgentsOrbital({
  count,
  suffix,
  reduced,
}: {
  count: number;
  suffix: string | undefined;
  reduced: boolean;
}) {
  const radiusSquads = 36;
  const radiusSatellite = 7;

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-4 py-3">
      <span className="sr-only">{`${count} agentes orquestrados em 5 squads`}</span>

      {/* Visual frame — aspect square, max-w controlled */}
      <div
        aria-hidden="true"
        className="relative w-full max-w-[420px]"
        style={{ aspectRatio: '1 / 1' }}
      >
        {/* Lime radial beam background */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle 45% at 50% 50%, var(--color-accent-emissive) 0%, var(--color-accent-glow) 28%, transparent 65%)',
            filter: 'blur(0.5px)',
          }}
        />
        {/* Dot field sutil */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: 'radial-gradient(oklch(94% 0.22 124 / 0.35) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            maskImage:
              'radial-gradient(circle 45% at 50% 50%, transparent 25%, black 50%, transparent 80%)',
          }}
        />

        {/* SVG orbital — idle rotation wrapper (subtle 60s loop, desligado em reduced) */}
        <m.svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
          focusable="false"
          style={{ originX: '50%', originY: '50%' }}
          {...(reduced
            ? {}
            : {
                animate: { rotate: 360 },
                transition: {
                  duration: 60,
                  ease: 'linear' as const,
                  repeat: Number.POSITIVE_INFINITY,
                },
              })}
        >
          <title>orbital diagram of 22 agents in 5 squads</title>

          {/* Outer dashed ring — perímetro da orquestra */}
          <circle
            cx="50"
            cy="50"
            r={radiusSquads + 5}
            fill="none"
            stroke="var(--color-accent-emissive)"
            strokeWidth="0.18"
            strokeDasharray="0.5 2"
            opacity="0.4"
          />
          <circle
            cx="50"
            cy="50"
            r={radiusSquads - 5}
            fill="none"
            stroke="var(--color-accent-emissive)"
            strokeWidth="0.15"
            strokeDasharray="0.4 1.5"
            opacity="0.3"
          />

          {/* Squad cores + agentes satélites */}
          {SQUADS.map((s) => {
            const rad = (s.angle * Math.PI) / 180;
            // Round to 3 decimals to avoid SSR/CSR float precision mismatch (hydration error).
            const cx = Number((50 + Math.sin(rad) * radiusSquads).toFixed(3));
            const cy = Number((50 - Math.cos(rad) * radiusSquads).toFixed(3));
            return (
              <g key={`squad-${s.label}`}>
                {/* Edge: squad → central */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={50}
                  y2={50}
                  stroke="var(--color-accent)"
                  strokeWidth="0.22"
                  strokeDasharray="1.2 1.2"
                  opacity="0.4"
                />
                {/* Mini-orbit ring around squad */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radiusSatellite}
                  fill="none"
                  stroke="var(--color-accent-emissive)"
                  strokeWidth="0.12"
                  strokeDasharray="0.3 1"
                  opacity="0.45"
                />
                {/* Satellites — agents dots ao redor do squad */}
                {Array.from({ length: s.satellites }).map((_, i) => {
                  const satAngle = (i / s.satellites) * 2 * Math.PI;
                  // Round to 3 decimals to avoid SSR/CSR float precision mismatch (hydration error).
                  const sx = Number((cx + Math.cos(satAngle) * radiusSatellite).toFixed(3));
                  const sy = Number((cy + Math.sin(satAngle) * radiusSatellite).toFixed(3));
                  return (
                    <circle
                      // biome-ignore lint/suspicious/noArrayIndexKey: static decorative satellite
                      key={`sat-${s.label}-${i}`}
                      cx={sx}
                      cy={sy}
                      r="0.7"
                      fill="var(--color-accent)"
                      opacity="0.9"
                    />
                  );
                })}
                {/* Squad core */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="3.6"
                  fill="var(--color-surface-elevated)"
                  stroke="var(--color-accent)"
                  strokeWidth="0.4"
                />
                <text
                  x={cx}
                  y={cy + 1.4}
                  textAnchor="middle"
                  fontSize="3.4"
                  fontFamily="var(--font-mono)"
                  fontWeight="600"
                  fill="var(--color-accent)"
                >
                  {s.label}
                </text>
              </g>
            );
          })}

          {/* Central HITL E-0 — emissive lime */}
          <circle
            cx="50"
            cy="50"
            r="8"
            fill="var(--color-accent-subtle)"
            stroke="var(--color-accent)"
            strokeWidth="0.7"
          />
          <circle cx="50" cy="50" r="4.5" fill="var(--color-accent)" opacity="0.7" />
          <text
            x="50"
            y="51.6"
            textAnchor="middle"
            fontSize="3.6"
            fontFamily="var(--font-mono)"
            fontWeight="700"
            fill="var(--color-text-on-accent)"
          >
            E-0
          </text>
        </m.svg>

        {/* Stat badge — count tabular bottom-right, sobreposto */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute bottom-3 right-3 z-10',
            'flex items-baseline gap-1.5 rounded-md',
            'border border-(--color-accent-emissive) bg-(--color-base)/85 px-2.5 py-1.5',
            'backdrop-blur-sm'
          )}
        >
          <span
            className="mono-stats font-bold tabular-nums leading-none text-(--color-accent)"
            style={{ fontSize: '1.5rem', letterSpacing: '-0.04em' }}
          >
            {count}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-(--color-text-2)">
            agents
          </span>
        </div>

        {/* Stat badge — 5 squads top-left */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute top-3 left-3 z-10',
            'flex items-baseline gap-1.5 rounded-md',
            'border border-(--color-hairline-strong) bg-(--color-base)/85 px-2.5 py-1.5',
            'backdrop-blur-sm'
          )}
        >
          <span
            className="mono-stats font-bold tabular-nums leading-none text-(--color-text-1)"
            style={{ fontSize: '1.5rem', letterSpacing: '-0.04em' }}
          >
            5
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-(--color-text-3)">
            squads
          </span>
        </div>
      </div>

      {/* Suffix label centralizado abaixo */}
      {suffix ? (
        <p className="text-center font-mono text-[10px] uppercase tracking-widest text-(--color-text-3)">
          {suffix}
        </p>
      ) : null}
    </div>
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
          // biome-ignore lint/suspicious/noArrayIndexKey: static decorative bar
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
