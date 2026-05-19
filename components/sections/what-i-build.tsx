import { TechLogo } from '@/components/shared/tech-logo';
import { type WhatIBuildCardData, WhatIBuildGrid } from './what-i-build.client';

// Section 3 — "What I Build" trio. Cards com VISUAL BACKGROUND único por modo:
//   01 — Mini squads diagram (Content Engine pattern)
//   02 — Tech logos cluster (full-stack stack)
//   03 — Circuit/state-machine SVG (backend crítico pattern)
// Quebra a uniformidade "ícone genérico + texto" — cada card tem identidade visual.

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
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Três modos · um padrão
        </h2>
        <p className="max-w-prose text-(--color-text-2) leading-relaxed">
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
// Visual backgrounds — chamados pelo client per visual key
// =================================================================

export function SquadsVisual() {
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full" aria-hidden="true" focusable="false">
      <title>squads visual</title>
      {/* Central node */}
      <circle
        cx="100"
        cy="60"
        r="14"
        fill="var(--color-accent-subtle)"
        stroke="var(--color-accent)"
        strokeWidth="1"
      />
      <text
        x="100"
        y="63"
        textAnchor="middle"
        fontSize="9"
        fontFamily="var(--font-mono)"
        fontWeight="700"
        fill="var(--color-accent)"
      >
        E-0
      </text>

      {/* 5 squad nodes around */}
      {[
        { x: 100, y: 18, label: 'O' },
        { x: 162, y: 42, label: 'I' },
        { x: 144, y: 96, label: 'S' },
        { x: 56, y: 96, label: 'C' },
        { x: 38, y: 42, label: 'R' },
      ].map((node) => (
        <g key={node.label}>
          <line
            x1={node.x}
            y1={node.y}
            x2="100"
            y2="60"
            stroke="var(--color-accent)"
            strokeWidth="0.4"
            strokeDasharray="2 2"
            opacity="0.5"
          />
          <circle
            cx={node.x}
            cy={node.y}
            r="7"
            fill="var(--color-surface-elevated)"
            stroke="var(--color-accent)"
            strokeWidth="0.6"
          />
          <text
            x={node.x}
            y={node.y + 2.5}
            textAnchor="middle"
            fontSize="6"
            fontFamily="var(--font-mono)"
            fontWeight="600"
            fill="var(--color-accent)"
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function StackVisual() {
  const techs = [
    'nextjs',
    'react',
    'postgres',
    'stripe',
    'whatsapp',
    'three',
    'typescript',
    'redis',
  ] as const;
  return (
    <div className="grid h-full w-full grid-cols-4 gap-3 p-2">
      {techs.map((id) => (
        <div
          key={id}
          className="flex flex-col items-center justify-center gap-1 rounded-md border border-(--color-hairline) bg-(--color-surface-elevated) p-2"
        >
          <TechLogo id={id} size={18} showLabel={false} />
          <span className="text-[8px] font-mono text-(--color-text-3) uppercase tracking-wider">
            {id}
          </span>
        </div>
      ))}
    </div>
  );
}

export function CircuitVisual() {
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full" aria-hidden="true" focusable="false">
      <title>circuit pattern visual</title>
      <defs>
        <pattern id="circ-grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path
            d="M 10 0 L 0 0 0 10"
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth="0.3"
            opacity="0.4"
          />
        </pattern>
      </defs>
      <rect width="200" height="120" fill="url(#circ-grid)" />

      {/* State machine nodes */}
      {[
        { x: 25, y: 60, label: 'in' },
        { x: 70, y: 30, label: 'queue' },
        { x: 70, y: 90, label: 'cache' },
        { x: 130, y: 30, label: 'job' },
        { x: 130, y: 90, label: 'retry' },
        { x: 175, y: 60, label: 'out' },
      ].map((node) => (
        <g key={node.label}>
          <rect
            x={node.x - 12}
            y={node.y - 8}
            width="24"
            height="16"
            rx="2"
            fill="var(--color-surface-elevated)"
            stroke="var(--color-accent)"
            strokeWidth="0.5"
          />
          <text
            x={node.x}
            y={node.y + 2.5}
            textAnchor="middle"
            fontSize="7"
            fontFamily="var(--font-mono)"
            fill="var(--color-accent)"
          >
            {node.label}
          </text>
        </g>
      ))}

      {/* Edges */}
      {[
        { x1: 25, y1: 60, x2: 70, y2: 30 },
        { x1: 25, y1: 60, x2: 70, y2: 90 },
        { x1: 70, y1: 30, x2: 130, y2: 30 },
        { x1: 70, y1: 90, x2: 130, y2: 90 },
        { x1: 70, y1: 90, x2: 130, y2: 30 },
        { x1: 130, y1: 90, x2: 70, y2: 30 },
        { x1: 130, y1: 30, x2: 175, y2: 60 },
        { x1: 130, y1: 90, x2: 175, y2: 60 },
      ].map((edge) => (
        <line
          key={`${edge.x1}-${edge.y1}-${edge.x2}-${edge.y2}`}
          x1={edge.x1 + 12}
          y1={edge.y1}
          x2={edge.x2 - 12}
          y2={edge.y2}
          stroke="var(--color-accent)"
          strokeWidth="0.4"
          strokeDasharray="1.5 1"
          opacity="0.5"
        />
      ))}
    </svg>
  );
}
