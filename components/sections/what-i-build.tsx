import { type WhatIBuildCardData, WhatIBuildGrid } from './what-i-build.client';

// Section 3 — "What I Build" trio. Cards com VISUAL BACKGROUND cinematográfico
// (mini-composições inline na linguagem do CinematicCover, mas mais minimalistas
// e abstratas — não importam dele pra evitar dependência circular):
//   01 — Mini radial-beam lime + orbital nodes (multi-agente)
//   02 — Mini arc-glow + 3 painéis stack empilhados (full-stack)
//   03 — Mini circuit/pipeline com nodes e edges emissivas (backend crítico)
// Quebra a uniformidade "ícone genérico + texto" — cada card é uma peça visual.

const CARDS: WhatIBuildCardData[] = [
  {
    eyebrow: '01',
    title: 'IA multi-agente em produção',
    body: 'Sistemas Claude SDK que orquestram 20+ agentes em squads especializados. Substituem times. Aprovação humana via Telegram em ≤10 min/dia.',
    visual: 'squads',
    pillars: ['Claude SDK', '5 squads', 'HITL Telegram', 'anti-slop'],
  },
  {
    eyebrow: '02',
    title: 'Product engineering full-stack',
    body: 'Next 16 · React 19 · Postgres · Stripe · WhatsApp · Three.js. Da arquitetura ao deploy, do schema ao billing. Produto inteiro entregue.',
    visual: 'stack',
    pillars: ['Next 16', 'Postgres', 'Stripe', 'WhatsApp'],
  },
  {
    eyebrow: '03',
    title: 'Backend crítico',
    body: 'TypeScript strict · Drizzle/Prisma · BullMQ same-process · Socket.io realtime · circuit breakers · multi-tenancy LGPD. Onde "funciona em produção" é a única métrica.',
    visual: 'circuit',
    pillars: ['Drizzle', 'BullMQ', 'Socket.io', 'LGPD'],
  },
];

export function WhatIBuildSection() {
  return (
    <section
      id="process"
      className="container-max section-pad-y border-t border-(--color-hairline)"
    >
      <header className="mb-10 flex flex-col gap-3 sm:mb-14">
        <p className="eyebrow">O QUE EU CONSTRUO</p>
        <h2 className="text-3xl font-semibold sm:text-4xl lg:text-5xl !leading-[1.02] !tracking-[-0.025em]">
          Três modos · um padrão
        </h2>
        <p className="mt-2 max-w-prose text-reading text-(--color-text-2)">
          Cada produto exige uma postura diferente. Multi-agente quando o problema é volume e
          variedade. Product engineering quando é entrega ponta-a-ponta. Backend crítico quando
          &ldquo;funciona 24/7&rdquo; é a única coisa que importa.
        </p>
      </header>

      <WhatIBuildGrid cards={CARDS} />
    </section>
  );
}

// =================================================================
// Visual compositions — mini-cinematic scenes inline.
// Linguagem visual:
//   - Background gradient lime emissive radial (variant-specific position)
//   - Hairline outlines + inset highlight (Vercel/Linear signature)
//   - Geist Mono labels minimalistas, sem texto descritivo
//   - Grain SVG overlay 4% mix-blend-overlay
// =================================================================

function MiniGrain({ id }: { id: string }) {
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

/* ============================================================
   Visual 01 — SQUADS ORBITAL
   ============================================================
   Composição: lime radial beam vindo do bottom-center. E-0 HITL central
   emissive. 5 squad cores (O · I · S · C · R) em órbita. Agentes
   pequenos hairline dots ao redor de cada squad (sem labels — pura
   composição de pontos). Edges dashed do squad → central.
   ============================================================ */

export function SquadsVisual() {
  // 5 squads em posição orbital + counts por squad (real distribution
  // do Content Engine: O=6, I=4, S=2, C=8, R=4 → 22 agents).
  const squads = [
    { x: 50, y: 12, label: 'O', satellites: 6, angle: 90 },
    { x: 88, y: 38, label: 'I', satellites: 4, angle: 18 },
    { x: 76, y: 84, label: 'S', satellites: 2, angle: -54 },
    { x: 24, y: 84, label: 'C', satellites: 8, angle: -126 },
    { x: 12, y: 38, label: 'R', satellites: 4, angle: 162 },
  ];

  return (
    <div className="absolute inset-0">
      {/* Lime beam radial — gradient cônico do bottom */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 110%, var(--color-accent-emissive) 0%, var(--color-accent-glow) 25%, transparent 60%)',
        }}
      />
      {/* Dot field sutil de fundo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(oklch(94% 0.22 124 / 0.25) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 30%, transparent 80%)',
        }}
      />

      {/* SVG orbital */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        focusable="false"
      >
        <title>squads orbital diagram</title>

        {/* Edges dashed: cada squad → central */}
        {squads.map((s) => (
          <line
            key={`edge-${s.label}`}
            x1={s.x}
            y1={s.y}
            x2={50}
            y2={50}
            stroke="var(--color-accent)"
            strokeWidth="0.25"
            strokeDasharray="1.5 1.5"
            opacity="0.4"
          />
        ))}

        {/* Outer dashed ring — sugere "perímetro" da orquestra */}
        <circle
          cx="50"
          cy="50"
          r="36"
          fill="none"
          stroke="var(--color-accent-emissive)"
          strokeWidth="0.2"
          strokeDasharray="0.6 2"
          opacity="0.35"
        />

        {/* Squad nodes + agentes satélites */}
        {squads.map((s) => (
          <g key={`squad-${s.label}`}>
            {/* Mini-órbita do squad — sugere agentes orbitando */}
            <circle
              cx={s.x}
              cy={s.y}
              r="6"
              fill="none"
              stroke="var(--color-accent-emissive)"
              strokeWidth="0.15"
              strokeDasharray="0.3 1"
              opacity="0.45"
            />
            {/* Satélites — agents pequenos posicionados ao redor */}
            {Array.from({ length: s.satellites }).map((_, i) => {
              const satAngle = (i / s.satellites) * 2 * Math.PI;
              // Round to 3 decimals to avoid SSR/CSR float precision mismatch (hydration error).
              const sx = Number((s.x + Math.cos(satAngle) * 6).toFixed(3));
              const sy = Number((s.y + Math.sin(satAngle) * 6).toFixed(3));
              return (
                <circle
                  // biome-ignore lint/suspicious/noArrayIndexKey: static decorative satellite
                  key={`sat-${s.label}-${i}`}
                  cx={sx}
                  cy={sy}
                  r="0.6"
                  fill="var(--color-accent)"
                  opacity="0.85"
                />
              );
            })}
            {/* Squad core */}
            <circle
              cx={s.x}
              cy={s.y}
              r="3.2"
              fill="var(--color-surface-elevated)"
              stroke="var(--color-accent)"
              strokeWidth="0.4"
            />
            <text
              x={s.x}
              y={s.y + 1.2}
              textAnchor="middle"
              fontSize="2.8"
              fontFamily="var(--font-mono)"
              fontWeight="600"
              fill="var(--color-accent)"
            >
              {s.label}
            </text>
          </g>
        ))}

        {/* Central HITL E-0 — emissive lime */}
        <circle
          cx="50"
          cy="50"
          r="7"
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="0.6"
        />
        <circle cx="50" cy="50" r="3.5" fill="var(--color-accent)" opacity="0.7" />
        <text
          x="50"
          y="51.4"
          textAnchor="middle"
          fontSize="3.2"
          fontFamily="var(--font-mono)"
          fontWeight="700"
          fill="var(--color-text-on-accent)"
        >
          E-0
        </text>
      </svg>

      <MiniGrain id="grain-squads" />
    </div>
  );
}

/* ============================================================
   Visual 02 — STACK LAYERS
   ============================================================
   Composição: arc-glow lime superior + 3 painéis empilhados em
   isometric V-shape (frontend topo emissive, backend middle,
   db base). Cada painel mostra mini-textura representando
   sua função (rows / nodes / bars).
   ============================================================ */

export function StackVisual() {
  return (
    <div className="absolute inset-0">
      {/* Arc glow superior */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1/2"
        style={{
          background:
            'radial-gradient(ellipse 60% 100% at 50% -10%, oklch(98% 0.005 130 / 0.20) 0%, var(--color-accent-emissive) 12%, var(--color-accent-glow) 28%, transparent 50%)',
        }}
      />

      {/* Arc stroke */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 30"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 h-[24%] w-full"
        focusable="false"
      >
        <defs>
          <linearGradient id="wib-arc-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M 0 28 Q 50 -8 100 28"
          fill="none"
          stroke="url(#wib-arc-stroke)"
          strokeWidth="0.5"
        />
      </svg>

      {/* 3 painéis empilhados — stack layers */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[76%] w-[78%]">
          {/* Top layer — FRONTEND (emissive lime) */}
          <div
            className="absolute left-[6%] right-[6%] top-[4%] h-[26%] overflow-hidden rounded-lg"
            style={{
              background:
                'linear-gradient(180deg, oklch(22% 0.010 130) 0%, oklch(18% 0.008 130) 100%)',
              border: '1px solid var(--color-accent)',
              boxShadow:
                'inset 0 1px 0 oklch(100% 0 0 / 0.10), 0 0 24px var(--color-accent-emissive), 0 8px 16px oklch(0% 0 0 / 0.35)',
              transform: 'perspective(800px) rotateX(8deg)',
              transformOrigin: 'center top',
            }}
          >
            {/* Mini header label */}
            <div className="flex h-full flex-col gap-[10%] p-[5%]">
              <div className="flex items-center gap-2">
                <div
                  className="h-[8px] w-[8px] rounded-full"
                  style={{
                    background: 'var(--color-accent)',
                    boxShadow: '0 0 6px var(--color-accent-emissive)',
                  }}
                />
                <span
                  className="font-mono text-[8px] uppercase tracking-widest"
                  style={{ color: 'var(--color-accent)' }}
                >
                  frontend
                </span>
              </div>
              {/* Rows abstratas */}
              <div className="flex flex-col gap-[8%]">
                <div
                  className="h-[6px] w-[68%] rounded-sm"
                  style={{ backgroundColor: 'var(--color-accent-subtle)' }}
                />
                <div
                  className="h-[6px] w-[44%] rounded-sm"
                  style={{ backgroundColor: 'var(--color-surface-overlay)' }}
                />
              </div>
            </div>
          </div>

          {/* Middle layer — BACKEND (neutral) */}
          <div
            className="absolute left-[3%] right-[3%] top-[36%] h-[26%] overflow-hidden rounded-lg"
            style={{
              background:
                'linear-gradient(180deg, oklch(22% 0.010 130) 0%, oklch(18% 0.008 130) 100%)',
              border: '1px solid var(--color-hairline-strong)',
              boxShadow: 'inset 0 1px 0 oklch(100% 0 0 / 0.06), 0 8px 16px oklch(0% 0 0 / 0.3)',
            }}
          >
            <div className="flex h-full flex-col gap-[10%] p-[5%]">
              <div className="flex items-center gap-2">
                <div
                  className="h-[6px] w-[6px] rounded-full"
                  style={{ background: 'var(--color-text-3)' }}
                />
                <span
                  className="font-mono text-[8px] uppercase tracking-widest"
                  style={{ color: 'var(--color-text-3)' }}
                >
                  backend
                </span>
              </div>
              {/* Nodes mini grid — sugere services */}
              <div className="flex gap-[2%]">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={`stack-node-${n}`}
                    className="h-[10px] flex-1 rounded-sm"
                    style={{
                      backgroundColor:
                        n === 3 ? 'var(--color-accent-subtle)' : 'var(--color-surface-overlay)',
                      border: '1px solid var(--color-hairline-strong)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom layer — DATA (neutral, deeper) */}
          <div
            className="absolute left-[0%] right-[0%] top-[68%] h-[26%] overflow-hidden rounded-lg"
            style={{
              background:
                'linear-gradient(180deg, oklch(22% 0.010 130) 0%, oklch(16% 0.008 130) 100%)',
              border: '1px solid var(--color-hairline-strong)',
              boxShadow: 'inset 0 1px 0 oklch(100% 0 0 / 0.05), 0 12px 24px oklch(0% 0 0 / 0.4)',
              transform: 'perspective(800px) rotateX(-8deg)',
              transformOrigin: 'center bottom',
            }}
          >
            <div className="flex h-full flex-col gap-[8%] p-[5%]">
              <div className="flex items-center gap-2">
                <div
                  className="h-[6px] w-[6px] rounded-full"
                  style={{ background: 'var(--color-text-3)' }}
                />
                <span
                  className="font-mono text-[8px] uppercase tracking-widest"
                  style={{ color: 'var(--color-text-3)' }}
                >
                  data
                </span>
              </div>
              {/* Bars verticais — representa tabelas/queries */}
              <div className="flex flex-1 items-end gap-[2.5%]">
                {[35, 58, 28, 70, 45, 62, 38, 52].map((h, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: static decorative bar
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{
                      height: `${h}%`,
                      backgroundColor:
                        i === 3 ? 'var(--color-accent-emissive)' : 'var(--color-surface-overlay)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <MiniGrain id="grain-stack" />
    </div>
  );
}

/* ============================================================
   Visual 03 — CIRCUIT PIPELINE
   ============================================================
   Composição: grid sutil de fundo + pipeline horizontal de
   nodes representando filas/jobs/cache/circuit-breakers. Lime
   emissive nos endpoints (in / out). Edges com strokeDasharray
   marchando — sugere fluxo de dados.
   ============================================================ */

export function CircuitVisual() {
  // Pipeline structure: in → queue → job → retry → out, com cache + breaker laterais
  const nodes = [
    { id: 'in', x: 12, y: 50, kind: 'endpoint' as const, label: 'in' },
    { id: 'queue', x: 32, y: 30, kind: 'process' as const, label: 'queue' },
    { id: 'cache', x: 32, y: 70, kind: 'aux' as const, label: 'cache' },
    { id: 'job', x: 56, y: 30, kind: 'process' as const, label: 'job' },
    { id: 'breaker', x: 56, y: 70, kind: 'aux' as const, label: 'breaker' },
    { id: 'retry', x: 76, y: 50, kind: 'process' as const, label: 'retry' },
    { id: 'out', x: 92, y: 50, kind: 'endpoint' as const, label: 'out' },
  ];

  const edges = [
    { from: 'in', to: 'queue' },
    { from: 'in', to: 'cache' },
    { from: 'queue', to: 'job' },
    { from: 'cache', to: 'job' },
    { from: 'job', to: 'breaker' },
    { from: 'job', to: 'retry' },
    { from: 'breaker', to: 'retry' },
    { from: 'retry', to: 'out' },
  ];

  const nodeById = (id: string) => nodes.find((n) => n.id === id);

  return (
    <div className="absolute inset-0">
      {/* Lime beam lateral — vem do lado direito (sentido de fluxo) */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 80% at 95% 50%, var(--color-accent-emissive) 0%, var(--color-accent-glow) 20%, transparent 55%)',
        }}
      />

      {/* Grid pattern fundo */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full opacity-50"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <pattern id="wib-grid" width="6" height="6" patternUnits="userSpaceOnUse">
            <path
              d="M 6 0 L 0 0 0 6"
              fill="none"
              stroke="var(--color-hairline)"
              strokeWidth="0.2"
              opacity="0.6"
            />
          </pattern>
          <linearGradient id="wib-edge-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#wib-grid)" />
      </svg>

      {/* Pipeline */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        focusable="false"
      >
        <title>backend pipeline visual</title>

        {/* Edges */}
        {edges.map((edge) => {
          const from = nodeById(edge.from);
          const to = nodeById(edge.to);
          if (!from || !to) return null;
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="var(--color-accent)"
              strokeWidth="0.35"
              strokeDasharray="1.2 1.2"
              opacity="0.6"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n) => {
          const isEndpoint = n.kind === 'endpoint';
          const r = isEndpoint ? 4 : 3.5;
          return (
            <g key={n.id}>
              {/* Halo glow nos endpoints */}
              {isEndpoint ? (
                <circle cx={n.x} cy={n.y} r="6.5" fill="var(--color-accent-glow)" opacity="0.5" />
              ) : null}
              <circle
                cx={n.x}
                cy={n.y}
                r={r}
                fill={isEndpoint ? 'var(--color-accent-subtle)' : 'var(--color-surface-elevated)'}
                stroke="var(--color-accent)"
                strokeWidth={isEndpoint ? '0.6' : '0.35'}
              />
              {isEndpoint ? <circle cx={n.x} cy={n.y} r="1.6" fill="var(--color-accent)" /> : null}
              <text
                x={n.x}
                y={n.y + r + 4.5}
                textAnchor="middle"
                fontSize="2.6"
                fontFamily="var(--font-mono)"
                fontWeight={isEndpoint ? '600' : '500'}
                fill={isEndpoint ? 'var(--color-accent)' : 'var(--color-text-3)'}
                letterSpacing="0.05em"
              >
                {n.label.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* Marker traces — small ticks ao longo do path principal */}
        {[20, 44, 64, 84].map((x) => (
          <line
            key={`tick-${x}`}
            x1={x}
            y1={48}
            x2={x}
            y2={52}
            stroke="var(--color-accent)"
            strokeWidth="0.2"
            opacity="0.45"
          />
        ))}
      </svg>

      <MiniGrain id="grain-circuit" />
    </div>
  );
}
