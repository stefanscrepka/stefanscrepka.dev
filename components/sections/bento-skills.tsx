import { type TechId, TechLogo } from '@/components/shared/tech-logo';
import { cn } from '@/lib/utils';
import { BentoRevealGrid } from './bento-skills.client';

// Section 9 — Stack confirmado em formato Bento Grid asimétrico.
// Hierarquia declarada (não tudo importante):
//   - IA AGENTIC XL (col-span 4 row-span 3, "22" 220px gigante)
//   - RAG/FRONTEND/BACKEND stack vertical à direita (col-span 2 cada)
//   - INFRA + OBSERVABILITY full-width abaixo (col-span 6) com status bars +
//     INTEGRAÇÕES chip strip embedded
//
// F3.2 (2026-06-11) — dieta de hidratação: BentoCell (e StatusBar/ProgressBar/
// PerimeterTrace) voltaram a ser Server Components. O que era estado React:
//   - hover do PerimeterTrace → CSS :hover/:focus-within (globals.css,
//     [data-bento-trace]) com os mesmos timings do tween Motion;
//   - gate JS de reduced-motion no lift/ping → variantes motion-safe/reduce;
//   - keyframes progressPulse inline (1 <style> por célula) → globals.css.
// Só o reveal com stagger continua client (BentoRevealGrid, ilha fina).

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
        <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">STACK</p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl !leading-[1.05] text-balance">
          Ferramentas que entram em produção.
        </h2>
        <p className="mt-2 max-w-prose text-reading text-(--color-text-2)">
          Stack confirmado pelos três produtos rodando. Não é uma lista de cursos — é o que está no{' '}
          <code className="font-mono text-(--color-text-1)">package.json</code> e no{' '}
          <code className="font-mono text-(--color-text-1)">docker-compose.yml</code> agora.
        </p>
      </header>

      <BentoRevealGrid
        items={CELLS.map((cell) => ({
          key: cell.heading,
          className: cn(CELL_CLASS_BY_SIZE[cell.size], MIN_HEIGHT_BY_SIZE[cell.size]),
          children: <BentoCell cell={cell} />,
        }))}
      />
    </section>
  );
}

function BentoCell({ cell }: { cell: BentoSkillsCell }) {
  const isXL = cell.size === 'xl';
  const isWide = cell.size === 'wide';

  return (
    <article
      data-slot="bento-cell"
      data-size={cell.size}
      data-feature={cell.feature}
      className={cn(
        'group/cell relative isolate flex h-full flex-col gap-4 overflow-hidden p-4 sm:p-7',
        // W-design #1: trocado `glass-panel` (alpha 0.55 + backdrop-blur) por
        // surface-elevated opaco. Remove 5º layer ambíguo do stacking dark→
        // base→surface→elevated→glass. Mais cinematic, sem custo de
        // backdrop-filter compositing.
        'rounded-2xl border border-(--color-hairline) bg-(--color-surface-elevated)',
        // Inset bisel at rest (Vercel/Linear edge lift). Stack with glow on hover.
        'shadow-(--shadow-inset-bisel)',
        'transition-[border-color,transform,box-shadow]',
        'duration-(--motion-fast) ease-(--ease-standard)',
        'hover:border-(--color-accent-emissive)',
        'focus-within:border-(--color-accent-emissive)',
        'hover:shadow-[var(--shadow-inset-bisel),var(--shadow-glow-lime-sm)]',
        // Reduced-motion: zero transform (border + glow already conveys
        // interactivity) — variante CSS, sem gate JS.
        // Default: translateY lift -2px (Linear/Vercel hover signature, NO scale).
        'motion-safe:hover:-translate-y-0.5',
        isXL && 'lg:p-10',
        isWide && 'lg:p-8'
      )}
    >
      <PerimeterTrace />

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
          className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)"
        >
          {cell.size === 'xl' ? '◆◆◆' : cell.size === 'wide' ? '═══' : '◆'}
        </span>
      </header>

      {/* Feature visual XL — Wave 1 stub: count textual mono grande.
          Wave 4 vai substituir por <video> real do Telegram HITL (reusa asset
          do bento-processos cell 1, conforme plano §D.2). */}
      {cell.feature === 'count' && cell.count !== undefined ? (
        <div className="relative flex flex-1 flex-col items-center justify-center gap-3 py-4">
          <span
            className="mono-stats font-bold tabular-nums leading-none text-(--color-accent)"
            style={{ fontSize: 'clamp(4.5rem, 18vw, 9rem)', letterSpacing: '-0.04em' }}
          >
            {cell.count}
          </span>
          {cell.countSuffix ? (
            <p className="text-center font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
              {cell.countSuffix}
            </p>
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

      {/* Extras chip list — pills mono hairline transparente */}
      {cell.extras && cell.extras.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {cell.extras.map((tag) => (
            <li
              key={tag}
              className={cn(
                'rounded-md border border-(--color-hairline-strong)',
                'bg-transparent px-2 py-0.5',
                'font-mono text-2xs text-(--color-text-3)',
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
            <StatusBar key={service} label={service} />
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
          <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3) mb-2">
            ↳ INTEGRAÇÕES
          </p>
          <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {cell.integrations.map((name) => (
              <li
                key={name}
                className="shrink-0 rounded-md border border-(--color-hairline-strong) bg-(--color-bg) px-3 py-1.5 font-mono text-2xs text-(--color-text-2)"
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
// AgentsOrbital REMOVIDO (Wave 1).
//
// Era o SVG orbital com 5 squad cores + 22 agentes satélites rotacionando
// 60s. Stefan classificou como visual "perdido" / "SVG procedural" — mesmo
// padrão visual que foi removido em outras seções.
//
// Wave 4 vai substituir por <video> real do Telegram HITL (Stefan grava
// screencap do bot recebendo aprovação). Mesmo asset será reusado no
// bento-processos cell 1.
//
// Por enquanto (Wave 1) a célula IA AGENTIC mostra apenas o count textual
// grande (ver BentoCell acima, branch cell.feature === 'count').
// =================================================================

// Auxiliares: StatusBar + ProgressBar (cell wide INFRA),
// PerimeterTrace (hover border de TODAS as células). Todos RSC desde F3.2 —
// reduced-motion via variantes CSS + kill global, animações via globals.css.

function StatusBar({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-(--color-hairline) bg-(--color-bg) px-3 py-2.5">
      <span className="relative flex size-2 shrink-0 items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute inline-flex size-full rounded-full opacity-50 motion-safe:animate-ping motion-reduce:hidden"
          style={{ background: 'var(--color-success)' }}
        />
        <span
          aria-hidden="true"
          className="relative inline-flex size-2 rounded-full"
          style={{ background: 'var(--color-success)', boxShadow: '0 0 6px var(--color-success)' }}
        />
      </span>
      <span className="flex-1 font-mono text-xs text-(--color-text-1)">{label}</span>
      <ProgressBar />
      <span className="font-mono text-2xs uppercase tracking-widest text-(--color-success)">
        ok
      </span>
    </div>
  );
}

function ProgressBar() {
  // Mini progress bar visual — 6 bars dancing. Keyframes progress-pulse em
  // globals.css; reduced-motion global encerra no frame "to" (estático ~80%).
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
            animation: `progress-pulse ${1.5 + i * 0.15}s ease-in-out ${i * 0.1}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

function PerimeterTrace() {
  // F3.2: stroke-dashoffset 1 → 0 via CSS transition disparada por
  // :hover/:focus-within do card (globals.css [data-bento-trace]).
  // motion-reduce:hidden preserva o comportamento antigo (gate JS escondia).
  return (
    <svg
      data-bento-trace
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 size-full motion-reduce:hidden"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <title>perimeter glow</title>
      <rect
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
      />
    </svg>
  );
}
