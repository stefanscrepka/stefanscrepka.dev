import { type TechId, TechLogo } from '@/components/shared/tech-logo';
import { cn } from '@/lib/utils';
import { BentoRevealGrid } from './bento-skills.client';

// Section 9 — Stack confirmado em formato Bento Grid asimétrico.
// Hierarquia declarada (não tudo importante):
//   - IA AGENTIC XL (col-span 4 row-span 3) — o mesmo loop em três produtos (F9)
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
      'OpenAI na Caluna',
      'MCP',
      'prompt caching',
      'tool use',
      'vision',
      'streaming SSE',
    ],
    note: 'O que muda é o gatilho e quem assina. No STARK não há modelo nenhum: é regra fechada contra o Excel oficial. Nos outros dois a IA propõe e uma pessoa decide antes de publicar ou cobrar.',
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
        // F9 (R4 F49): a célula não é link nem botão; o hover só clareia a borda
        // um degrau e desenha o contorno (PerimeterTrace). Sem lift, sem anel.
        'hover:border-(--color-hairline-alpha-3)',
        // Reduced-motion: zero transform (border + glow already conveys
        // interactivity) — variante CSS, sem gate JS.
        // Default: translateY lift -2px (Linear/Vercel hover signature, NO scale).
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

      {/* Feature XL — o mesmo loop, três produtos (F9) */}
      {cell.feature === 'orchestration' ? <LoopRegistry /> : null}

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
// LoopRegistry — o mesmo loop, três produtos (F9, 2026-09-05).
//
// O card anterior era o organograma dos 19 agentes do Content Engine: o
// registro de UM produto no lugar da competência ("esse card fica como se
// tudo girasse em torno a 1 projeto"). A pesquisa R1 propôs mostrar o método
// que atravessa os produtos: gatilho → agente ou regra → validação →
// aprovação humana → registro. Linhas = os cinco passos; colunas = os três
// cases. No STARK o passo "agente" é regra, não modelo, e o card diz isso.
// Cada célula tem origem em lib/work/data.ts (números da auditoria F7). Um
// só elemento aceso: a aprovação humana. RSC puro, zero JS, zero SVG.
// =================================================================

const LOOP_STEPS = [
  { key: 'gatilho', label: 'Gatilho' },
  { key: 'agente', label: 'Agente ou regra' },
  { key: 'validacao', label: 'Validação' },
  { key: 'aprovacao', label: 'Aprovação humana', lit: true },
  { key: 'registro', label: 'Registro' },
] as const;

type LoopStepKey = (typeof LOOP_STEPS)[number]['key'];

const LOOP_PRODUCTS: readonly { name: string; cells: Record<LoopStepKey, string> }[] = [
  {
    name: 'Content Engine',
    cells: {
      gatilho: 'cron das 03h00 às 07h30, fuso de São Paulo',
      agente: '19 papéis Claude em 5 squads, 17 no ciclo diário',
      validacao: '28 regex anti-slop, surprisal e um juiz LLM',
      aprovacao: 'três botões no Telegram, às 07h30',
      registro: '57 tabelas Postgres, 45 migrations',
    },
  },
  {
    name: 'Caluna',
    cells: {
      gatilho: 'uma mensagem no WhatsApp da clínica',
      agente: 'assistente com 11 ferramentas',
      validacao: 'pede confirmação antes de marcar ou cobrar',
      aprovacao: 'acima de um teto chama a dona; handoff pelo inbox',
      registro: '35 modelos Prisma, 27 com tenantId',
    },
  },
  {
    name: 'STARK',
    cells: {
      gatilho: 'o fim do turno',
      agente: 'regra, não modelo: as fórmulas do Excel oficial',
      validacao: 'fechadas contra três planilhas, dígito a dígito',
      aprovacao: 'o supervisor fecha o turno; o telão atualiza',
      registro: 'Postgres 17 com migrations; PDF e Excel',
    },
  },
];

const LOOP_GRID = 'grid grid-cols-[minmax(0,8.5rem)_repeat(3,minmax(0,1fr))]';

function LoopRegistry() {
  return (
    <figure className="relative my-1 w-full">
      {/* md+: matriz passos × produtos. */}
      <div
        role="table"
        aria-label="O mesmo loop em três produtos"
        className="hidden overflow-hidden rounded-md border border-(--color-hairline) md:block"
      >
        <div role="row" className={LOOP_GRID}>
          <span role="columnheader" className="px-3 py-2" />
          {LOOP_PRODUCTS.map((p) => (
            <span
              key={p.name}
              role="columnheader"
              className="border-l border-(--color-hairline) px-3 py-2 font-mono text-2xs uppercase tracking-widest text-(--color-text-1)"
            >
              {p.name}
            </span>
          ))}
        </div>
        {LOOP_STEPS.map((step) => {
          const lit = 'lit' in step && step.lit;
          return (
            <div
              key={step.key}
              role="row"
              className={cn(LOOP_GRID, 'border-t border-(--color-hairline)')}
            >
              <span
                role="rowheader"
                className={cn(
                  'flex items-baseline gap-2 px-3 py-2.5 font-mono text-2xs uppercase tracking-widest',
                  lit ? 'text-(--color-accent)' : 'text-(--color-text-3)'
                )}
              >
                {step.label}
                {lit ? (
                  <span aria-hidden="true" className="inline-block size-1.5 bg-(--color-accent)" />
                ) : null}
              </span>
              {LOOP_PRODUCTS.map((p) => (
                <span
                  key={p.name}
                  role="cell"
                  className={cn(
                    'border-l border-(--color-hairline) px-3 py-2.5 font-mono text-2xs leading-relaxed',
                    lit ? 'text-(--color-text-1)' : 'text-(--color-text-3)'
                  )}
                >
                  {p.cells[step.key]}
                </span>
              ))}
            </div>
          );
        })}
      </div>

      {/* < md: um bloco por produto, os cinco passos empilhados. */}
      <div className="flex flex-col gap-3 md:hidden">
        {LOOP_PRODUCTS.map((p) => (
          // F9 (R4 F08): o nome do produto fica FORA do <dl> (um <div> com texto
          // solto dentro de <dl> é HTML inválido e derrubava a a11y mobile a 0,97).
          <div key={p.name} className="overflow-hidden rounded-md border border-(--color-hairline)">
            <p className="px-3 py-2 font-mono text-2xs uppercase tracking-widest text-(--color-text-1)">
              {p.name}
            </p>
            <dl aria-label={p.name}>
              {LOOP_STEPS.map((step) => {
                const lit = 'lit' in step && step.lit;
                return (
                  <div
                    key={step.key}
                    className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-x-3 border-t border-(--color-hairline) px-3 py-1.5"
                  >
                    <dt
                      className={cn(
                        'font-mono text-2xs uppercase tracking-wider',
                        lit ? 'text-(--color-accent)' : 'text-(--color-text-3)'
                      )}
                    >
                      {step.label}
                    </dt>
                    <dd
                      className={cn(
                        'font-mono text-2xs leading-relaxed',
                        lit ? 'text-(--color-text-1)' : 'text-(--color-text-3)'
                      )}
                    >
                      {p.cells[step.key]}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        ))}
      </div>

      <figcaption className="mt-3 text-balance font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
        <span className="text-(--color-text-1)">3 produtos</span>&nbsp;· o loop é o mesmo, muda o
        gatilho e quem assina&nbsp;· números conferidos no código&nbsp;· set/2026
      </figcaption>
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
      <title>contorno da célula</title>
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
