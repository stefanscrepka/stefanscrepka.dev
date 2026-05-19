import { type WhatIBuildCardData, WhatIBuildGrid } from './what-i-build.client';

// Section 3 — "What I Build" trio (~70vh). 3 cards Direction Aware Hover lime.
// Microcopy: 05§Seção 3. Reveal stagger 120ms on view via Motion 12 variants.

const CARDS: WhatIBuildCardData[] = [
  {
    eyebrow: '01',
    title: 'IA multi-agente em produção',
    body: 'Sistemas Claude SDK que orquestram 20+ agentes em squads especializados. Substituem times. Aprovação humana via Telegram em ≤10 min/dia.',
    icon: <IconNodes />,
  },
  {
    eyebrow: '02',
    title: 'Product engineering full-stack',
    body: 'Next 16 · React 19 · Postgres · Stripe · WhatsApp · Three.js. Da arquitetura ao deploy, do schema ao billing. Produto inteiro entregue.',
    icon: <IconLayers />,
  },
  {
    eyebrow: '03',
    title: 'Backend crítico',
    body: 'TypeScript strict · Drizzle/Prisma · BullMQ same-process · Socket.io realtime · circuit breakers · multi-tenancy LGPD. Onde "funciona em produção" é a única métrica.',
    icon: <IconCircuit />,
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

// ============================================================
// Custom SVG icons — 3 desenhados pra cada card
// ============================================================

function IconNodes() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true" focusable="false">
      <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="19" cy="5" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="5" cy="19" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="19" cy="19" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle
        cx="12"
        cy="12"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path
        d="M7 6.5l4 4M17 6.5l-4 4M7 17.5l4-4M17 17.5l-4-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true" focusable="false">
      <path
        d="M12 3l9 5-9 5-9-5 9-5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M3 12l9 5 9-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <path
        d="M3 17l9 5 9-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        opacity="0.35"
      />
    </svg>
  );
}

function IconCircuit() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true" focusable="false">
      <rect x="3" y="5" width="18" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 10h4M3 14h4M17 10h4M17 14h4M10 5v3M14 5v3M10 16v3M14 16v3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
