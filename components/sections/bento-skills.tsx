import { type TechId, TechLogo } from '@/components/shared/tech-logo';
import { cn } from '@/lib/utils';
import { CE_ONBOARDING_TEMPLATES, ceAgentsOf } from '@/lib/work/content-engine-artifacts';
import { CONTENT_ENGINE_SQUADS } from '@/lib/work/data';
import { BentoRevealGrid } from './bento-skills.client';

// Section 9 — Stack confirmado em formato Bento Grid asimétrico.
// Hierarquia declarada (não tudo importante):
//   - IA AGENTIC XL (col-span 4 row-span 3) — o registro dos agentes (F8)
//   - RAG/FRONTEND/BACKEND stack vertical à direita (col-span 2 cada)
//   - INFRA + OBSERVABILITY full-width abaixo (col-span 6) com as superfícies
//     de runtime + INTEGRAÇÕES chip strip embedded
//
// F3.2 (2026-06-11) — dieta de hidratação: BentoCell (e PerimeterTrace)
// são Server Components. O que era estado React:
//   - hover do PerimeterTrace → CSS :hover/:focus-within (globals.css,
//     [data-bento-trace]) com os mesmos timings do tween Motion;
//   - gate JS de reduced-motion no lift → variante motion-safe.
// Só o reveal com stagger continua client (BentoRevealGrid, ilha fina).
//
// F5 (2026-09-02) — três mudanças de conteúdo, todas por claim↔evidência:
//   1. XL: o "22" gigante (um número sem estrutura atrás, e a origem da
//      pendência 22-vs-24) virou um diagrama de ORQUESTRAÇÃO em 1px — o
//      sistema em vez da soma: cron → Claude Agent SDK → 5 squads → E-0
//      (humano). A contagem vira legenda, não monumento. Um único elemento
//      aceso: o humano no loop (R4 §5.3, padrão Sprrrint "one lit element").
//   2. small: cada célula acende UM chip (o que sustenta a claim) — o resto
//      recua pra text-3. Três listas planas viram três células compostas.
//   3. wide: as "status bars" (ponto verde com ping + barras animadas + "OK")
//      simulavam telemetria — o site não lê estado nenhum. Num site cuja tese
//      é "funciona 24/7", um dashboard fingido é a maior dívida de
//      credibilidade da página (R4 §7.12; ROADMAP F4 "pendente"). Agora a
//      célula lista as superfícies de runtime e o papel de cada uma —
//      informação verdadeira na própria cara. Isso também tira o segundo
//      verde (--color-success) de uma superfície que já tem lime.

export interface BentoSkillsCell {
  size: 'xl' | 'small' | 'wide';
  heading: string;
  techs: TechId[];
  extras?: string[];
  /** F5: o chip "aceso" da célula — a peça que sustenta a claim do heading. */
  lead?: string;
  note?: string;
  feature?: 'orchestration' | 'runtime';
  /** Apenas no INFRA wide cell — chip strip de integrações inline. */
  integrations?: string[];
}

const CELL_CLASS_BY_SIZE: Record<BentoSkillsCell['size'], string> = {
  xl: 'col-span-1 sm:col-span-6 lg:col-span-4 lg:row-span-3',
  small: 'col-span-1 sm:col-span-3 lg:col-span-2',
  wide: 'col-span-1 sm:col-span-6 lg:col-span-6',
};

// F5 (2026-09-02): o min-h das células small só existe pra igualar altura
// quando elas dividem uma linha (sm+). No mobile (coluna única) ele deixava
// ~90px vazios no rodapé de cada uma das três (medido: 224px de célula pra
// ~130px de conteúdo) — ~270px de scroll morto. Mobile = altura do conteúdo.
const MIN_HEIGHT_BY_SIZE: Record<BentoSkillsCell['size'], string> = {
  xl: 'min-h-[420px] lg:min-h-[640px]',
  small: 'sm:min-h-[14rem]',
  wide: 'min-h-[340px]',
};

const CELLS: BentoSkillsCell[] = [
  {
    size: 'xl',
    heading: 'IA AGENTIC',
    feature: 'orchestration',
    techs: ['anthropic', 'shiki'],
    lead: 'Claude Agent SDK',
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
    note: 'Cada papel tem prompt versionado, modo scripted pra testar sem LLM e uma tabela própria no Postgres. Substitui uma equipe de quatro a seis pessoas.',
  },
  {
    size: 'small',
    heading: 'RAG + VECTOR',
    techs: ['postgres'],
    lead: 'pgvector',
    extras: ['Qdrant', 'BGE-M3', 'Gemini emb-004', 'Ollama local', 're-ranking'],
  },
  {
    size: 'small',
    heading: 'FRONTEND',
    techs: ['nextjs', 'react', 'tailwind', 'three', 'gsap', 'motion'],
    lead: 'TypeScript strict',
    extras: ['shadcn/ui', 'r3f + drei'],
  },
  {
    size: 'small',
    heading: 'BACKEND',
    techs: ['typescript', 'postgres', 'drizzle', 'redis'],
    lead: 'BullMQ',
    extras: ['Node 22', 'Socket.io', 'Fastify', 'Inngest', 'Server Actions'],
  },
  {
    size: 'wide',
    heading: 'INFRA + OBSERVABILITY',
    feature: 'runtime',
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
    note: 'Vercel gru1 pro site; Coolify numa VPS pro Content Engine e pra Caluna, com a GPU local por trás.',
  },
];

// Superfícies de runtime da célula INFRA — o que cada uma faz, sem simular
// estado. Substitui as status bars (ver nota F5 no topo do arquivo).
const RUNTIME_SURFACES = [
  { name: 'Vercel', role: 'gru1 · este site' },
  { name: 'Coolify VPS', role: 'Content Engine + Caluna · GPU local' },
  { name: 'Sentry', role: 'erros + sourcemaps em produção' },
  { name: 'Langfuse', role: 'traces e custo por chamada LLM' },
] as const;

export function BentoSkillsSection() {
  return (
    <section id="skills" className="container-max section-pad-y border-t border-(--color-hairline)">
      <header className="mb-10 flex flex-col gap-3 sm:mb-14">
        <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">STACK</p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl !leading-[1.05] text-balance">
          Ferramentas que entram em produção.
        </h2>
        <p className="mt-2 max-w-prose text-reading text-(--color-text-2)">
          Stack confirmado pelos três produtos rodando. Não é uma lista de cursos: é o que está no{' '}
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
          {/* F4 (2026-08-29): era ◆◆◆ / ═══ / ◆ conforme o tamanho da célula.
              É um sistema — mas ilegível: em 11px, ◆◆◆ lê como "•••" e ═══ como
              "===", e ninguém deduz "três losangos = extra-large". Ornamento que
              varia por um motivo imperceptível é ruído fingindo ser sinal.
              Uma marca só, igual nas quatro células. */}
          ◆
        </span>
      </header>

      {/* Feature visual XL — diagrama de orquestração (F5) */}
      {cell.feature === 'orchestration' ? <AgentsRegistry /> : null}

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

      {/* Chips — o `lead` aceso em lime (hairline lime + texto lime), os
          extras em text-3 sobre hairline. Um elemento aceso por célula. */}
      {cell.lead || (cell.extras && cell.extras.length > 0) ? (
        <ul className="flex flex-wrap gap-1.5">
          {cell.lead ? (
            <li
              className={cn(
                'rounded-md border border-(--color-accent-emissive) bg-(--color-accent-subtle)',
                'px-2 py-0.5 font-mono text-2xs text-(--color-accent)'
              )}
              style={{ boxShadow: 'inset 0 1px 0 oklch(100% 0 0 / 0.04)' }}
            >
              {cell.lead}
            </li>
          ) : null}
          {cell.extras?.map((tag) => (
            <li
              key={tag}
              className={cn(
                'rounded-md border border-(--color-hairline-strong)',
                'bg-transparent px-2 py-0.5',
                'font-mono text-2xs text-(--color-text-3)',
                'transition-colors duration-(--motion-fast)',
                'group-hover/cell:text-(--color-text-2)'
              )}
              style={{ boxShadow: 'inset 0 1px 0 oklch(100% 0 0 / 0.04)' }}
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Superfícies de runtime (wide INFRA cell) — nome + papel, sem estado
          simulado. Layout de "registro": hairline entre linhas, mono. */}
      {cell.feature === 'runtime' ? (
        <dl className="grid gap-x-6 pt-2 sm:grid-cols-2">
          {RUNTIME_SURFACES.map((s) => (
            <div
              key={s.name}
              className="flex items-baseline justify-between gap-4 border-t border-(--color-hairline) py-2.5"
            >
              <dt className="font-mono text-xs text-(--color-text-1)">{s.name}</dt>
              <dd className="text-right font-mono text-2xs uppercase tracking-wider text-(--color-text-3)">
                {s.role}
              </dd>
            </div>
          ))}
        </dl>
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
          {/* F5 (2026-09-02): no mobile a strip rola na horizontal com a
              scrollbar escondida — o último chip visível era cortado seco
              ("Evolution API" pela metade) sem nenhum sinal de que há mais.
              A máscara esvanece os 2.5rem finais só quando há overflow real
              (em desktop os chips param antes da borda e nada muda). */}
          <ul
            className={cn(
              'flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
              '[mask-image:linear-gradient(to_right,black_calc(100%-2.5rem),transparent)] sm:[mask-image:none]'
            )}
          >
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
// AgentsRegistry — a equipe, como o Studio a registra (F8, 2026-09-05).
//
// O ledger do cron subiu pro hero (day-rail.tsx); aqui fica o outro registro
// verdadeiro: os 19 papéis do ciclo diário + os 6 do onboarding, copiados de
// apps/web/src/lib/agent-roles.ts e packages/prompts/templates
// (lib/work/content-engine-artifacts.ts), agrupados por squad com o horário
// em que o cron os acorda. Um único elemento aceso: o Editor-Chefe.
// RSC puro, zero JS, zero SVG.
// =================================================================

const REGISTRY_GROUPS = [
  {
    code: 'S0',
    name: 'Onboarding',
    when: 'uma vez por marca',
    rows: CE_ONBOARDING_TEMPLATES.map((t) => ({ id: t.id, name: t.file.replace(/\.md$/, '') })),
  },
  { code: 'S1', name: 'Inteligência', when: '03h00', rows: ceAgentsOf('inteligencia') },
  { code: 'S2', name: 'Estratégia', when: '05h30', rows: ceAgentsOf('estrategia') },
  { code: 'S3', name: 'Criação', when: '06h00', rows: ceAgentsOf('criacao') },
  { code: 'S4', name: 'Revisão', when: '07h15', rows: ceAgentsOf('revisao') },
  { code: 'E-0', name: 'Direção', when: '07h30', rows: ceAgentsOf('direcao'), lit: true },
] as const;

function AgentsRegistry() {
  return (
    <figure className="relative my-1 w-full">
      <dl className="grid gap-px overflow-hidden rounded-md border border-(--color-hairline) bg-(--color-hairline) sm:grid-cols-2 lg:grid-cols-3">
        {REGISTRY_GROUPS.map((g) => (
          <div key={g.code} className="flex flex-col gap-2 bg-(--color-surface-elevated) px-3 py-3">
            <dt className="flex items-baseline justify-between gap-2 font-mono text-2xs uppercase tracking-widest">
              <span
                className={'lit' in g && g.lit ? 'text-(--color-accent)' : 'text-(--color-text-1)'}
              >
                {g.code} · {g.name}
              </span>
              <span className="text-(--color-text-3)">{g.when}</span>
            </dt>
            <dd className="flex flex-col gap-1 font-mono text-2xs leading-snug">
              {g.rows.map((r) => (
                <span key={r.id} className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-2">
                  <span className="tabular-nums text-(--color-text-2)">{r.id}</span>
                  <span className="truncate text-(--color-text-3)">
                    {'role' in r ? r.role : r.name}
                  </span>
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
      <figcaption className="mt-3 text-balance font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
        <span className="text-(--color-text-1)">19 agentes</span>&nbsp;· 5 squads&nbsp;· 6 no
        onboarding&nbsp;· apps/web/src/lib/agent-roles.ts
      </figcaption>
      <p className="sr-only">
        Registro dos agentes do Content Engine por squad:{' '}
        {CONTENT_ENGINE_SQUADS.map((sq) => `${sq.name} (${sq.agents} agentes, ${sq.when})`).join(
          ', '
        )}
        ; o Editor-Chefe fecha o dia às 07h30.
      </p>
    </figure>
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
