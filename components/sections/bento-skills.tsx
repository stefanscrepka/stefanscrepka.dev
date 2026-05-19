import { type BentoSkillsCell, BentoSkillsGrid } from './bento-skills.client';

// Section 9 — Stack confirmado em formato Bento Grid asimétrico.
// 6 células: 2 large (2×1: IA AGENTIC + INFRA) + 4 standard.
// Layout grid 6-col desktop, stack mobile.
// Hover lime emissive border + tracing line perimeter draw (anim via Motion).
// Reveal stagger 100ms on view.

const CELLS: BentoSkillsCell[] = [
  {
    size: 'large',
    heading: 'IA AGENTIC',
    tags: [
      'Claude Agent SDK',
      'Opus 4.7',
      'Sonnet 4.6',
      'Haiku 4.5',
      'MCP',
      'prompt caching',
      'tool use',
      'vision',
      'streaming SSE',
    ],
    note: '22 agentes Claude orquestrados em 5 squads. Substitui times humanos.',
  },
  {
    size: 'small',
    heading: 'RAG + VECTOR',
    tags: [
      'pgvector',
      'Qdrant',
      'BGE-M3',
      'Gemini embedding-004',
      'Ollama local',
      're-ranking',
      'hybrid search',
    ],
  },
  {
    size: 'small',
    heading: 'FRONTEND',
    tags: [
      'Next 16',
      'React 19',
      'TypeScript strict',
      'Tailwind v4',
      'shadcn/ui',
      'Motion 12',
      'GSAP',
      'Three.js + r3f',
    ],
  },
  {
    size: 'small',
    heading: 'BACKEND',
    tags: [
      'Node 22',
      'Postgres 17',
      'Drizzle',
      'Prisma',
      'Redis',
      'BullMQ',
      'Socket.io',
      'Fastify',
      'Inngest',
      'Server Actions',
    ],
  },
  {
    size: 'small',
    heading: 'INTEGRAÇÕES',
    tags: [
      'Stripe',
      'Asaas',
      'Evolution API',
      'Telegram (grammy)',
      'Google Calendar',
      'Google Drive',
      'Resend',
      'Cal.com',
    ],
  },
  {
    size: 'large',
    heading: 'INFRA + OBSERVABILITY',
    tags: [
      'Vercel Fluid Compute',
      'Docker multi-stage',
      'Coolify VPS',
      'Sentry',
      'Langfuse',
      'GitHub Actions',
      'Playwright E2E',
    ],
    note: 'Three.js fonte da verdade pra deploy → Vercel gru1 region. Coolify VPS roda Content Engine 24/7 com GPU local.',
  },
];

export function BentoSkillsSection() {
  return (
    <section id="skills" className="container-max section-pad-y border-t border-(--color-hairline)">
      <header className="mb-10 flex flex-col gap-3 sm:mb-14">
        <p className="eyebrow">STACK</p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Ferramentas que entram em produção
        </h2>
        <p className="max-w-prose text-(--color-text-2) leading-relaxed">
          Stack confirmado pelos três produtos rodando. Não é uma lista de cursos — é o que está no{' '}
          <code className="font-mono text-(--color-text-1)">package.json</code> e no{' '}
          <code className="font-mono text-(--color-text-1)">docker-compose.yml</code> agora.
        </p>
      </header>

      <BentoSkillsGrid cells={CELLS} />
    </section>
  );
}
