import { type BentoSkillsCell, BentoSkillsGrid } from './bento-skills.client';

// Section 9 — Stack confirmado em formato Bento Grid asimétrico.
// Hierarquia declarada (não tudo importante):
//   - IA AGENTIC XL (col-span 4 row-span 3, "22" 220px gigante)
//   - RAG/FRONTEND/BACKEND stack vertical à direita (col-span 2 cada)
//   - INFRA + OBSERVABILITY full-width abaixo (col-span 6) com status bars +
//     INTEGRAÇÕES chip strip embedded

const CELLS: BentoSkillsCell[] = [
  {
    size: 'xl',
    heading: 'IA AGENTIC',
    feature: 'count',
    count: 22,
    countSuffix: 'agentes em 5 squads',
    techs: ['anthropic', 'shiki'],
    extras: [
      'Opus 4.7',
      'Sonnet 4.6',
      'Haiku 4.5',
      'MCP',
      'prompt caching',
      'tool use',
      'vision',
      'streaming SSE',
    ],
    note: 'Claude Agent SDK orquestra squads especializados (Onboarding · Inteligência · Estratégia · Criação · Revisão). Substitui agência inteira.',
  },
  {
    size: 'small',
    heading: 'RAG + VECTOR',
    techs: ['postgres'],
    extras: ['pgvector', 'Qdrant', 'BGE-M3', 'Gemini emb-004', 'Ollama local', 're-ranking'],
  },
  {
    size: 'small',
    heading: 'FRONTEND',
    techs: ['nextjs', 'react', 'tailwind', 'three', 'gsap', 'motion'],
    extras: ['TypeScript strict', 'shadcn/ui', 'r3f + drei'],
  },
  {
    size: 'small',
    heading: 'BACKEND',
    techs: ['typescript', 'postgres', 'drizzle', 'redis'],
    extras: ['Node 22', 'BullMQ', 'Socket.io', 'Fastify', 'Inngest', 'Server Actions'],
  },
  {
    size: 'wide',
    heading: 'INFRA + OBSERVABILITY',
    feature: 'live',
    techs: ['vercel', 'sentry'],
    extras: [
      'Vercel Fluid Compute',
      'Docker multi-stage',
      'Coolify VPS · GPU local',
      'Langfuse',
      'GitHub Actions',
      'Playwright E2E',
    ],
    integrations: [
      'Stripe',
      'Asaas',
      'WhatsApp',
      'Evolution API',
      'Telegram',
      'Cal.com',
      'Resend',
      'Supabase',
      'Google Cal',
      'Google Drive',
    ],
    note: 'Vercel gru1 (frontend público) + Coolify VPS rodando Content Engine 24/7 com GPU local.',
  },
];

export function BentoSkillsSection() {
  return (
    <section id="skills" className="container-max section-pad-y border-t border-(--color-hairline)">
      <header className="mb-10 flex flex-col gap-3 sm:mb-14">
        <p className="eyebrow">STACK</p>
        <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl !leading-[0.95]">
          Ferramentas que entram em produção.
        </h2>
        <p className="mt-2 max-w-prose text-reading text-(--color-text-2)">
          Stack confirmado pelos três produtos rodando. Não é uma lista de cursos — é o que está no{' '}
          <code className="font-mono text-(--color-text-1)">package.json</code> e no{' '}
          <code className="font-mono text-(--color-text-1)">docker-compose.yml</code> agora.
        </p>
      </header>

      <BentoSkillsGrid cells={CELLS} />
    </section>
  );
}
