'use client';

import { m, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

// CinematicCover — premium cover visual cinematográfica usada nos case studies
// quando o screenshot real ainda não foi entregue. Substitui ScreenshotPlaceholder
// (grid 12×8 mock + monogram SH) por composições com identidade real.
//
// 4 variants, cada uma referenciando um mood específico:
//   - radial-beam     → Nextronium triptych + lime beam radial vindo do bottom
//   - arc-glow        → NEONE arc glowing topo + painel central tipo dashboard SaaS
//   - portrait-glow   → device PWA vertical centralizado + halo lime radial atrás
//   - amber-soft      → amber warm glow radial + painel curves/circles (Estética MD only)
//
// Anti-AI-slop:
//   - Zero hex inline, zero `purple-600 sobre branco`, zero "shadow genérica".
//   - 3-layer cinema shadow + inset hairline highlight (Linear/Vercel signature).
//   - Grain overlay SVG 4% via feTurbulence.
//   - Motion: idle drift 0.5° loop 8s ease-in-out, desligado em prefers-reduced-motion.
//   - Hover (quando interactive): translateY(-2px) + glow expandido — NUNCA scale 1.05.

export type CinematicVariant = 'radial-beam' | 'arc-glow' | 'portrait-glow' | 'amber-soft';

interface CinematicCoverProps {
  variant: CinematicVariant;
  caseSlug: string;
  caseTitle: string;
  /** Aspect ratio CSS shorthand. Default 16/9 (override pra portrait via '9/19'). */
  aspectRatio?: string | undefined;
  /** Habilita hover lift + glow expand. Default false. */
  interactive?: boolean | undefined;
  className?: string | undefined;
}

const ACCENT_BY_VARIANT: Record<CinematicVariant, 'lime' | 'amber'> = {
  'radial-beam': 'lime',
  'arc-glow': 'lime',
  'portrait-glow': 'lime',
  'amber-soft': 'amber',
};

// Grain texture compartilhada — SVG feTurbulence embed inline base64 NÃO usado
// (overhead de parsing); aqui o pattern é referenciado por <svg> in-document.
// Opacity 0.04 = 4% como solicitado pelo spec.
function GrainOverlay({ id }: { id: string }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04] mix-blend-overlay"
      focusable="false"
    >
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" />
        <feColorMatrix
          values="0 0 0 0 1
                  0 0 0 0 1
                  0 0 0 0 1
                  0 0 0 1 0"
        />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
}

export function CinematicCover({
  variant,
  caseSlug,
  caseTitle,
  aspectRatio = '16 / 9',
  interactive = false,
  className,
}: CinematicCoverProps) {
  const reducedMotion = useReducedMotion();
  const accent = ACCENT_BY_VARIANT[variant];
  const grainId = `grain-${caseSlug}`;

  // Idle drift: rotate ±0.5° infinite 8s ease-in-out. Sutil; só percebido em
  // sustained gaze. Reduced-motion → spread vazio (sem animação).
  const idleAnimation = reducedMotion
    ? {}
    : {
        animate: { rotate: [0, 0.5, 0, -0.5, 0] },
        transition: {
          duration: 8,
          ease: 'easeInOut' as const,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'loop' as const,
        },
      };

  const hoverProps =
    interactive && !reducedMotion
      ? {
          whileHover: {
            y: -2,
            transition: { duration: 0.3, ease: [0.2, 0, 0, 1] as const },
          },
        }
      : {};

  return (
    <m.div
      data-slot="cinematic-cover"
      data-variant={variant}
      data-accent={accent}
      role="img"
      aria-label={`${caseTitle} — composição visual cinematográfica`}
      {...idleAnimation}
      {...hoverProps}
      className={cn(
        'relative isolate w-full overflow-hidden',
        'rounded-2xl',
        // Outer cinema shadow + inset 1px highlight (Vercel/Linear signature).
        'shadow-(--shadow-cinema)',
        'before:absolute before:inset-0 before:rounded-2xl before:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] before:pointer-events-none before:z-30',
        // Hover glow expand quando interactive.
        interactive &&
          'transition-shadow duration-(--motion-modal) ease-(--ease-smooth) hover:shadow-[var(--shadow-cinema),0_0_64px_var(--color-accent-emissive)]',
        interactive &&
          accent === 'amber' &&
          'hover:shadow-[var(--shadow-cinema),0_0_64px_oklch(82%_0.18_75/0.4)]',
        className
      )}
      style={{
        aspectRatio,
        backgroundColor: 'var(--color-base)',
      }}
    >
      {/* Variant-specific composition */}
      {variant === 'radial-beam' ? <RadialBeamScene /> : null}
      {variant === 'arc-glow' ? <ArcGlowScene /> : null}
      {variant === 'portrait-glow' ? <PortraitGlowScene /> : null}
      {variant === 'amber-soft' ? <AmberSoftScene /> : null}

      {/* Grain overlay topo de tudo — adiciona "film stock" feel */}
      <GrainOverlay id={grainId} />
    </m.div>
  );
}

/* ============================================================
   Variant 1 — RADIAL BEAM (Content Engine, Nextronium mood)
   ============================================================
   Composição: triptych de 3 painéis flutuantes em V-shape (esquerda -8°,
   central frontmost com lime emissive border, direita +8°). Lime radial
   beam subindo do bottom-center, fan volumetric upward. Painéis com
   mini-conteúdo abstrato (linhas mono / nodes), não UI real.
   ============================================================ */

function RadialBeamScene() {
  return (
    <div className="absolute inset-0">
      {/* Lime beam radial — gradient cônico do bottom */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 60% at 50% 110%, var(--color-accent-emissive) 0%, var(--color-accent-glow) 25%, transparent 60%)',
        }}
      />
      {/* Volumetric haze sutil — radial blur diffuso */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background:
            'radial-gradient(ellipse 50% 80% at 50% 100%, oklch(94% 0.22 124 / 0.18) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
      {/* Dot field sutil — segunda camada de textura */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(oklch(94% 0.22 124 / 0.25) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 30%, transparent 80%)',
        }}
      />

      {/* Triptych de 3 painéis — esquerda -8°, central 0°, direita +8° */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-[68%] w-[78%] items-end justify-center gap-[2.5%]">
          {/* Painel esquerdo — rotação -8°, levemente recuado */}
          <AbstractPanel
            kind="bars"
            className="h-[78%] w-[28%]"
            style={{ transform: 'rotate(-8deg) translateY(6%)' }}
            emissive={false}
          />
          {/* Painel central — frontmost, emissive lime border */}
          <AbstractPanel
            kind="nodes"
            className="h-[100%] w-[36%] z-10"
            style={{ transform: 'translateY(-4%)' }}
            emissive
          />
          {/* Painel direito — rotação +8° */}
          <AbstractPanel
            kind="rows"
            className="h-[78%] w-[28%]"
            style={{ transform: 'rotate(8deg) translateY(6%)' }}
            emissive={false}
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Variant 2 — ARC GLOW (NexaCore, NEONE mood)
   ============================================================
   Composição: arc glow lime topo (gradient horizontal com curve), painel
   central tipo "dashboard mockup abstrato" centralizado abaixo. Hairlines
   + linhas mono dentro do painel — sugestão de SaaS, não interface real.
   ============================================================ */

function ArcGlowScene() {
  return (
    <div className="absolute inset-0">
      {/* Arc glow superior — elipse extra-wide cortada no topo */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1/2"
        style={{
          background:
            'radial-gradient(ellipse 60% 100% at 50% -10%, oklch(98% 0.005 130 / 0.32) 0%, var(--color-accent-emissive) 12%, var(--color-accent-glow) 28%, transparent 50%)',
        }}
      />
      {/* Arc stroke — linha fina lime curve no topo (simula edge do arc) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 30"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 h-[28%] w-full"
        focusable="false"
      >
        <defs>
          <linearGradient id="arc-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M 0 28 Q 50 -8 100 28" fill="none" stroke="url(#arc-stroke)" strokeWidth="0.4" />
      </svg>
      {/* Volumetric haze sutil sob o arc */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[18%] h-[18%]"
        style={{
          background: 'linear-gradient(to bottom, oklch(94% 0.22 124 / 0.08) 0%, transparent 100%)',
          filter: 'blur(12px)',
        }}
      />

      {/* Painel dashboard central */}
      <div className="absolute inset-0 flex items-end justify-center pb-[6%]">
        <AbstractPanel kind="dashboard" className="h-[58%] w-[72%]" emissive={false} />
      </div>

      {/* Floor reflection sutil — degrade pra baixo */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[18%]"
        style={{
          background: 'linear-gradient(to top, var(--color-base) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}

/* ============================================================
   Variant 3 — PORTRAIT GLOW (STJ App, PWA mobile mood)
   ============================================================
   Composição: device frame vertical 9/19 centralizado + halo lime
   circular radial atrás + sutil grain. Frame dark com hairline.
   ============================================================ */

function PortraitGlowScene() {
  return (
    <div className="absolute inset-0">
      {/* Halo lime circular atrás do device — pulse subtle aesthetic */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle 38% at 50% 50%, var(--color-accent-emissive) 0%, var(--color-accent-glow) 30%, transparent 65%)',
        }}
      />
      {/* Particle field sutil — dots fade out from center */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(oklch(94% 0.22 124 / 0.4) 0.5px, transparent 0.5px)',
          backgroundSize: '24px 24px',
          maskImage:
            'radial-gradient(circle 50% at 50% 50%, transparent 25%, black 60%, transparent 90%)',
        }}
      />

      {/* Device frame portrait 9:19 — centralizado */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative h-[84%] aspect-[9/19] rounded-[14px] overflow-hidden"
          style={{
            background:
              'linear-gradient(180deg, oklch(22% 0.010 130) 0%, oklch(18% 0.008 130) 100%)',
            border: '1px solid var(--color-hairline-strong)',
            boxShadow: 'inset 0 1px 0 oklch(100% 0 0 / 0.08), 0 24px 48px oklch(0% 0 0 / 0.4)',
          }}
        >
          {/* Notch — pill superior */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[2.5%] h-[1.2%] w-[28%] -translate-x-1/2 rounded-full"
            style={{ backgroundColor: 'var(--color-base)' }}
          />
          {/* Screen content — gradient lime + linhas abstratas */}
          <div className="absolute inset-[5%] top-[7%] flex flex-col gap-[4%]">
            {/* Header bar */}
            <div
              className="h-[8%] w-[60%] rounded-[3px]"
              style={{ backgroundColor: 'var(--color-surface-elevated)' }}
            />
            {/* Card row 1 — lime emissive */}
            <div
              className="h-[18%] w-full rounded-[4px]"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-accent-subtle) 0%, var(--color-surface-elevated) 100%)',
                border: '1px solid var(--color-accent-emissive)',
              }}
            />
            {/* Card rows 2-4 — neutral */}
            <div
              className="h-[10%] w-full rounded-[3px]"
              style={{ backgroundColor: 'var(--color-surface-elevated)' }}
            />
            <div
              className="h-[10%] w-[88%] rounded-[3px]"
              style={{ backgroundColor: 'var(--color-surface-elevated)' }}
            />
            <div
              className="h-[10%] w-[76%] rounded-[3px]"
              style={{ backgroundColor: 'var(--color-surface-elevated)' }}
            />
            {/* Pulse dot — bottom indicator */}
            <div className="mt-auto flex items-center gap-[3%] pb-[8%]">
              <span
                aria-hidden="true"
                className="block h-[6px] w-[6px] rounded-full"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  boxShadow: '0 0 12px var(--color-accent-emissive)',
                }}
              />
              <div
                className="h-[6%] flex-1 rounded-[3px]"
                style={{ backgroundColor: 'var(--color-accent-subtle)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Variant 4 — AMBER SOFT (Estética MD, warm premium mood)
   ============================================================
   Composição: lime SUBSTITUÍDO POR AMBER. Soft warm radial glow,
   1 painel central abstrato com curves/circles representando
   "estética premium" — sem hard lines, edges suaves.
   ============================================================ */

function AmberSoftScene() {
  return (
    <div className="absolute inset-0">
      {/* Soft amber glow — radial diagonal upper-right (warmth, não dramaticness) */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 65% 30%, oklch(82% 0.18 75 / 0.32) 0%, oklch(82% 0.18 75 / 0.12) 30%, transparent 65%)',
        }}
      />
      {/* Counter-glow sutil — leve calor no bottom-left */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 25% 80%, oklch(82% 0.18 75 / 0.10) 0%, transparent 60%)',
        }}
      />

      {/* Painel central com curves + circles — abstração orgânica premium */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative h-[72%] w-[78%] overflow-hidden rounded-2xl"
          style={{
            background:
              'linear-gradient(180deg, oklch(22% 0.010 130) 0%, oklch(18% 0.008 130) 100%)',
            border: '1px solid oklch(82% 0.18 75 / 0.25)',
            boxShadow: 'inset 0 1px 0 oklch(100% 0 0 / 0.06), 0 16px 36px oklch(0% 0 0 / 0.3)',
          }}
        >
          {/* Decorative curves SVG — fluid arcs */}
          <svg
            aria-hidden="true"
            viewBox="0 0 200 120"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full"
            focusable="false"
          >
            <defs>
              <linearGradient id="md-curve-1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="oklch(82% 0.18 75)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="oklch(82% 0.18 75)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="md-curve-2" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(82% 0.18 75)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="oklch(82% 0.18 75)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Curve principal — arc fluido top */}
            <path
              d="M -10 70 Q 60 10 110 50 T 220 30"
              fill="none"
              stroke="url(#md-curve-1)"
              strokeWidth="0.6"
            />
            <path
              d="M -10 90 Q 80 30 130 70 T 220 50"
              fill="none"
              stroke="url(#md-curve-2)"
              strokeWidth="0.4"
            />
            {/* Circles decorativos — partículas orgânicas */}
            <circle
              cx="40"
              cy="40"
              r="22"
              fill="none"
              stroke="oklch(82% 0.18 75)"
              strokeWidth="0.25"
              strokeOpacity="0.35"
            />
            <circle
              cx="160"
              cy="80"
              r="32"
              fill="none"
              stroke="oklch(82% 0.18 75)"
              strokeWidth="0.25"
              strokeOpacity="0.3"
            />
            <circle
              cx="100"
              cy="60"
              r="14"
              fill="none"
              stroke="oklch(82% 0.18 75)"
              strokeWidth="0.3"
              strokeOpacity="0.45"
            />
            <circle cx="100" cy="60" r="5" fill="oklch(82% 0.18 75)" fillOpacity="0.6" />
          </svg>

          {/* Centerpiece — orb amber emissive */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[18%] w-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, oklch(82% 0.18 75 / 0.7) 0%, oklch(82% 0.18 75 / 0.2) 50%, transparent 80%)',
              filter: 'blur(2px)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   AbstractPanel — sub-componente compartilhado entre variants
   ============================================================
   Painel dark com hairline + mini-conteúdo abstrato. Quatro `kind`s:
     - bars      → bars verticais (data)
     - nodes     → graph node + edges (rede)
     - rows      → linhas horizontais (rows de table abstrata)
     - dashboard → mock dashboard layout (header + sidebar + chart abstract)
   ============================================================ */

interface AbstractPanelProps {
  kind: 'bars' | 'nodes' | 'rows' | 'dashboard';
  className?: string;
  style?: React.CSSProperties;
  emissive: boolean;
}

function AbstractPanel({ kind, className, style, emissive }: AbstractPanelProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('relative overflow-hidden rounded-lg', className)}
      style={{
        ...style,
        background: 'linear-gradient(180deg, oklch(22% 0.010 130) 0%, oklch(18% 0.008 130) 100%)',
        border: emissive
          ? '1px solid var(--color-accent)'
          : '1px solid var(--color-hairline-strong)',
        boxShadow: emissive
          ? 'inset 0 1px 0 oklch(100% 0 0 / 0.08), 0 0 24px var(--color-accent-emissive), 0 16px 32px oklch(0% 0 0 / 0.4)'
          : 'inset 0 1px 0 oklch(100% 0 0 / 0.06), 0 12px 24px oklch(0% 0 0 / 0.3)',
      }}
    >
      {kind === 'bars' ? <PanelBars /> : null}
      {kind === 'nodes' ? <PanelNodes /> : null}
      {kind === 'rows' ? <PanelRows /> : null}
      {kind === 'dashboard' ? <PanelDashboard /> : null}
    </div>
  );
}

function PanelBars() {
  // 6 barras verticais — representam data series. Heights pseudo-random fixos
  // (não animados pra preservar lock visual).
  const heights = [42, 68, 28, 86, 54, 72];
  return (
    <div className="absolute inset-0 flex flex-col p-[8%]">
      {/* Mini header line */}
      <div
        className="mb-[6%] h-[5%] w-[60%] rounded-sm"
        style={{ backgroundColor: 'var(--color-surface-overlay)' }}
      />
      {/* Bars row */}
      <div className="flex flex-1 items-end gap-[3%]">
        {heights.map((h, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static decorative
            key={i}
            className="flex-1 rounded-t-sm"
            style={{
              height: `${h}%`,
              backgroundColor: i === 3 ? 'var(--color-accent)' : 'var(--color-surface-overlay)',
            }}
          />
        ))}
      </div>
      {/* Bottom axis line */}
      <div
        className="mt-[3%] h-px w-full"
        style={{ backgroundColor: 'var(--color-hairline-strong)' }}
      />
    </div>
  );
}

function PanelNodes() {
  // Network graph — 4 nodes + central hub + edges. Sugere multi-agente.
  return (
    <div className="absolute inset-0">
      <svg
        viewBox="0 0 100 140"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
        aria-hidden="true"
        focusable="false"
        role="presentation"
      >
        {/* Edges */}
        <line
          x1="20"
          y1="30"
          x2="50"
          y2="70"
          stroke="var(--color-accent-emissive)"
          strokeWidth="0.5"
          strokeDasharray="1.5 1"
        />
        <line
          x1="80"
          y1="30"
          x2="50"
          y2="70"
          stroke="var(--color-accent-emissive)"
          strokeWidth="0.5"
          strokeDasharray="1.5 1"
        />
        <line
          x1="20"
          y1="110"
          x2="50"
          y2="70"
          stroke="var(--color-accent-emissive)"
          strokeWidth="0.5"
          strokeDasharray="1.5 1"
        />
        <line
          x1="80"
          y1="110"
          x2="50"
          y2="70"
          stroke="var(--color-accent-emissive)"
          strokeWidth="0.5"
          strokeDasharray="1.5 1"
        />

        {/* Outer nodes */}
        {[
          [20, 30],
          [80, 30],
          [20, 110],
          [80, 110],
        ].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle
              cx={cx}
              cy={cy}
              r="6"
              fill="var(--color-surface-elevated)"
              stroke="var(--color-accent)"
              strokeWidth="0.6"
            />
            <circle cx={cx} cy={cy} r="2" fill="var(--color-accent)" />
          </g>
        ))}

        {/* Central hub */}
        <circle
          cx="50"
          cy="70"
          r="10"
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="0.8"
        />
        <circle cx="50" cy="70" r="4" fill="var(--color-accent)" />
      </svg>
    </div>
  );
}

function PanelRows() {
  // Rows horizontais — representam data rows / log lines.
  const widths = [86, 72, 92, 64, 80, 70, 88];
  return (
    <div className="absolute inset-0 flex flex-col gap-[5%] p-[8%]">
      {/* Header pill */}
      <div
        className="h-[6%] w-[40%] rounded-sm"
        style={{ backgroundColor: 'var(--color-accent-subtle)' }}
      />
      {/* Row lines */}
      {widths.map((w, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static decorative
          key={i}
          className="h-[5%] rounded-sm"
          style={{
            width: `${w}%`,
            backgroundColor:
              i === 2 ? 'var(--color-accent-subtle)' : 'var(--color-surface-overlay)',
          }}
        />
      ))}
    </div>
  );
}

function PanelDashboard() {
  // Dashboard mock — top header, sidebar mini, chart area abstract.
  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Top chrome bar */}
      <div
        className="flex h-[10%] items-center gap-[1%] border-b px-[2.5%]"
        style={{
          borderColor: 'var(--color-hairline-strong)',
          backgroundColor: 'var(--color-surface-overlay)',
        }}
      >
        <span
          className="h-[6px] w-[6px] rounded-full"
          style={{ backgroundColor: 'oklch(65% 0.20 10)' }}
        />
        <span
          className="h-[6px] w-[6px] rounded-full"
          style={{ backgroundColor: 'oklch(80% 0.18 100)' }}
        />
        <span
          className="h-[6px] w-[6px] rounded-full"
          style={{ backgroundColor: 'oklch(75% 0.15 142)' }}
        />
        <div
          className="ml-[3%] h-[40%] w-[24%] rounded-sm"
          style={{ backgroundColor: 'var(--color-surface-elevated)' }}
        />
      </div>

      {/* Body — sidebar + main */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className="flex w-[18%] flex-col gap-[8%] border-r p-[3%]"
          style={{
            borderColor: 'var(--color-hairline-strong)',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[8%] w-full rounded-sm"
              style={{
                backgroundColor:
                  i === 1 ? 'var(--color-accent-subtle)' : 'var(--color-surface-overlay)',
              }}
            />
          ))}
        </div>

        {/* Main panel — chart + stats */}
        <div className="flex flex-1 flex-col gap-[4%] p-[3.5%]">
          {/* Stats row */}
          <div className="flex gap-[3%]">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[16%] flex-1 rounded-sm"
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-hairline-strong)',
                }}
              />
            ))}
          </div>
          {/* Chart area — abstract sparkline */}
          <div
            className="flex-1 rounded-sm p-[2%]"
            style={{
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-hairline-strong)',
            }}
          >
            <svg
              viewBox="0 0 100 30"
              preserveAspectRatio="none"
              className="h-full w-full"
              aria-hidden="true"
              focusable="false"
              role="presentation"
            >
              <defs>
                <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 22 L 12 18 L 24 20 L 36 12 L 48 14 L 60 8 L 72 11 L 84 6 L 100 9 L 100 30 L 0 30 Z"
                fill="url(#spark-fill)"
              />
              <path
                d="M 0 22 L 12 18 L 24 20 L 36 12 L 48 14 L 60 8 L 72 11 L 84 6 L 100 9"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="0.6"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
