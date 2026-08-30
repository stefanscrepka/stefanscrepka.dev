// Single source of truth pros 4 case studies. Microcopy alinhada com
// Plano-Portfolio/02_INFORMATION_ARCHITECTURE.md + 05_SECOES_DETALHADAS.md + HANDOFF §3
// (números honest: 22 não 25 agentes, 100 não 1203 tests, 61 componentes NexaCore, 162 tests STJ).

export type CaseStudySlug = 'content-engine' | 'nexacore' | 'stj-app' | 'estetica-md';

export interface CaseStudyCTA {
  label: string;
  href: string;
  variant?: 'default' | 'outline';
  external?: boolean;
}

export type ProductDiagramKey =
  | 'squads'
  | 'nexacore'
  | 'stj'
  | 'estetica'
  | 'caronas'
  | 'estrutura-c';

/** Hero asset (image OR video) usado nos featured covers + case study heroes.
 *  Wave 1 = null (CinematicCover morreu junto com SVGs procedurais).
 *  Wave 2-4 = path real quando Stefan entregar screencaps/screenshots reais + Aceternity mockups. */
export interface HeroAsset {
  src: string;
  type: 'image' | 'video';
  /** Poster .webp obrigatório quando type='video' (LCP + reduced-motion fallback). */
  poster?: string;
  /** Aspect ratio explícito pra evitar CLS. */
  aspect: '16/10' | '16/9' | '4/3' | '3/2' | '1/1' | '9/16' | '4/5';
}

export interface CaseStudy {
  slug: CaseStudySlug;
  title: string;
  tagline: string;
  description: string;
  status: string;
  stack: string[];
  details: string[];
  ctas: CaseStudyCTA[];
  /** Path real em /public quando Stefan entregar. Null = MockupFrame vazio (Wave 1). */
  screenshot: string | null;
  /** Hero asset estruturado (Wave 2-4). Null até Stefan dropar assets. */
  heroAsset: HeroAsset | null;
  /** Diagrama SVG fallback custom por produto (consumido por ProductCover diagram mode). */
  diagram: ProductDiagramKey;
  accent: 'lime' | 'amber';
  /** Microcopy do card "Other Work" + index gallery */
  shortLine: string;
  /** W2.1 (2026-05-23): impact line — bullet de outcome operacional/financeiro,
   *  renderizado ACIMA dos highlights técnicos em FeaturedWorkSection. Traduz
   *  stack pra valor de negócio (Auditor 1+2+3+4 sinalizaram consenso). */
  impact?: {
    metric: string;
    context: string;
  };
  /** W3.2 (2026-05-23): problema que o case resolve. Render junto com solution
   *  (tagline) + impact num triad "Problema · Solução · Impacto" no topo
   *  da página /work/[slug]. Permite o decisor não-técnico entender o "por quê"
   *  antes do mergulho em squads + stack. */
  problem?: string;
}

export const CASE_STUDIES: Record<CaseStudySlug, CaseStudy> = {
  'content-engine': {
    slug: 'content-engine',
    title: 'Content Engine',
    tagline: 'Sistema multi-agente autônomo · 22 agentes Claude SDK em 5 squads',
    description:
      'Substitui agência de 4-6 pessoas. Aprovação humana ≤10 min/dia via Telegram. Cron 03h–07h30. Stack local GPU RTX 3070 subsidiando custo.',
    status: 'Operacional · cron 24/7 · em iteração',
    stack: [
      'Claude Agent SDK · Opus 4.7 + Sonnet 4.6 + Haiku 4.5',
      '22 agentes em 5 squads + E-0 HITL',
      '27 tabelas Drizzle · Postgres 17',
      'BGE-M3 embeddings 1024-dim · Qdrant namespace per brand',
      'Whisper local · Ollama local · RTX 3070 inference',
      'grammy Telegram bot · vitest 100 tests runtime',
      'Anti-slop validator · 14 regex pt-BR + 20-item checklist',
    ],
    details: [
      'Squad 0 — Onboarding (O-1...O-6, 6 agentes): brand brief intake + LoRA training pipeline',
      'Squad 1 — Inteligência (I-1...I-4, 4 agentes): web search Perplexity/Exa + competitive analysis',
      'Squad 2 — Estratégia (S-5, S-6, 2 agentes): content calendar + posting time optimization',
      'Squad 3 — Criação (C-7...C-14, 8 agentes): copy + visual (Higgsfield, Nano Banana 2, SDXL+LoRA) + video (Veo 3.1, Sora 2)',
      'Squad 4 — Revisão Anti-Slop (R-15...R-18, 4 agentes): 20-item checklist + feedback loop posting times + goldens datasets',
      'E-0 — Aprovação HITL: Telegram bot grammy, humano aprova/edita/rejeita em ≤10 min/dia',
    ],
    ctas: [
      {
        label: 'Ver no GitHub →',
        href: 'https://github.com/stefanscrepka/content-engine',
        external: true,
        variant: 'default',
      },
      { label: 'Ler arquitetura completa →', href: '#architecture', variant: 'outline' },
    ],
    screenshot: null,
    heroAsset: null,
    diagram: 'squads',
    accent: 'lime',
    shortLine:
      'Sistema multi-agente Claude SDK · 22 agentes em 5 squads · substitui agência inteira.',
    impact: {
      metric: '≤10 min/dia',
      context: 'humano aprova via Telegram — substitui equipe de 4-6 pessoas',
    },
    problem:
      'Volume + variedade de conteúdo pra múltiplas marcas exige equipe de 4-6 pessoas trabalhando full-time. Agência tradicional não escala, freelancer não bate o padrão.',
  },
  nexacore: {
    slug: 'nexacore',
    title: 'NexaCore SaaS',
    tagline: 'B2B multi-tenant em produção pra clínicas de estética · striveos.shop',
    description:
      'CRM + agenda + faturamento + IA conversacional + WhatsApp + analytics numa única aplicação. Deployado em produção.',
    status: 'Em produção desde 2025 · striveos.shop',
    stack: [
      'Next 14 App Router · React 18.3',
      'Clerk JWT + RBAC + MFA',
      'Prisma + PostgreSQL 16',
      'Redis 7 + Socket.io 4.8 (Redis adapter)',
      'BullMQ workers + AI worker same-process',
      'OpenAI GPT-4o-mini + circuit breaker com budget tracking',
      'Evolution API 2.3.7 (WhatsApp Business)',
      'Asaas + Stripe dual gateway',
      '61 componentes design system',
    ],
    details: [
      'Real-time dashboard via Socket.io + Redis adapter (multi-instance)',
      'BullMQ + AI worker same-process (1 container, single deploy)',
      'Soft delete + temporal queries LGPD-compliant',
      'Circuit breaker OpenAI com budget tracking por tenant',
      'Admin panel com impersonation + audit trail',
      'Multi-tenancy por subdomínio + row-level isolation',
    ],
    ctas: [
      {
        label: 'Acessar produção: striveos.shop →',
        href: 'https://striveos.shop',
        external: true,
        variant: 'default',
      },
      { label: 'Agendar call 15min →', href: '/#contato', variant: 'outline' },
    ],
    // W-assets (2026-05-26): screenshots reais NexaCore — dashboard como primary
    // (cover do card flagship + MacBookScroll na case page). 1920×1200, AVIF
    // crf 32 ~32KB. Diagram fica como fallback (não usado em produção mas
    // mantido pra design-system reference).
    screenshot: '/work-screenshots/nexacore-dashboard.avif',
    heroAsset: {
      src: '/work-screenshots/nexacore-dashboard.avif',
      type: 'image',
      aspect: '16/10',
    },
    diagram: 'nexacore',
    accent: 'lime',
    shortLine: 'B2B SaaS clínicas estéticas · Next 14 + Clerk + WhatsApp + 61 componentes design.',
    impact: {
      metric: 'Em produção',
      context: 'CRM + agenda + faturamento + WhatsApp num único deploy multi-tenant',
    },
    problem:
      'Clínicas estéticas operam em 5+ ferramentas separadas (CRM, agenda, faturamento, WhatsApp, analytics). Fricção pra equipe, dados inconsistentes, custo somado caro.',
  },
  'stj-app': {
    slug: 'stj-app',
    title: 'STJ App',
    tagline: 'Cockpit operacional PWA · Next 15 + Supabase + Claude Haiku 4.5',
    description:
      'Construído para a equipe @linareis.fit. Aprovações de conteúdo com IA, calendário semana móvel, knowledge base RAG, métricas live, chat Coach/Lina Brain, Studio Lite (asset + CV validator vision), Telegram bot integrado.',
    status: 'Em produção · uso interno equipe @linareis.fit',
    stack: [
      'Next 15.3.9 App Router · React 19',
      'Supabase Auth + Postgres + Storage',
      'Claude Haiku 4.5 streaming',
      'Prompt cache 2 camadas (Anthropic API 1h + Supabase hash 24h)',
      'Vision CV validator multi-modal (Claude vision)',
      'pgvector + Gemini text-embedding-004 RAG',
      'Inngest async workflows',
      'Upstash Redis rate limiting',
      'Serwist PWA · offline fallback',
      'Playwright E2E 6 specs + 156 unit/integration',
    ],
    details: [
      'Auth flow: login → Supabase Auth → 2FA TOTP challenge → recovery codes → app shell PWA',
      'Prompt cache hit rate alto: server-side Anthropic API (1h TTL) + Supabase hash-based (24h TTL)',
      'Vision validator: Claude vision compara asset vs spec, retorna OK/FAIL + reasoning estruturado',
      'RAG: knowledge base indexada via Gemini embeddings 768-dim, pgvector cosine search',
      'Inngest workflows: async com retries idempotentes + observability nativa',
    ],
    ctas: [
      {
        label: 'Acessar produção →',
        href: 'https://stj-app.vercel.app/',
        external: true,
        variant: 'default',
      },
      { label: 'Post-mortem técnico →', href: '#post-mortem', variant: 'outline' },
    ],
    // W-assets (2026-05-26): substituído tela-de-login (stj-app-desktop.avif)
    // pelo home page LOGADO mostrando produto em uso — tasks reais (rodar
    // /daily-content + brief visual, streak buffer, manhã/tarde). Captura 4K
    // (3840×2160) → AVIF 2880px wide. Linear-grade: chrome próprio da app
    // (topbar stj), sem URL bar do browser exposto.
    screenshot: '/work-screenshots/stj-app-home.avif',
    heroAsset: {
      src: '/work-screenshots/stj-app-home.avif',
      type: 'image',
      aspect: '16/9',
    },
    diagram: 'stj',
    accent: 'lime',
    shortLine: 'PWA cockpit · Claude Haiku 4.5 streaming · prompt cache 2 camadas · 162 testes.',
    impact: {
      metric: 'Cockpit interno',
      context: 'equipe @linareis.fit aprovando conteúdo + treino + métricas num só app',
    },
    problem:
      'Equipe operacional aprovando conteúdo, gerenciando treinos e consultando métricas em apps separados (Notion + Drive + Excel + Telegram). Lentidão, contexto perdido, sem auditoria.',
  },
  'estetica-md': {
    slug: 'estetica-md',
    title: 'Estética MD',
    tagline: 'Site institucional + conversão pra Dra. Martina Dona',
    description:
      'Feito pra clínicas premium — estética, odonto, med spa. Primeiro produto em produção, antes do React.',
    status: 'Em produção desde Dez/2024',
    stack: [
      'HTML5 · CSS3 · JS vanilla',
      'PHP + PHPMailer backend',
      'ScrollReveal · Typed.js · OwlCarousel2',
      'WhatsApp wa.me deeplink',
      '1.697 linhas CSS · 914 linhas JS vanilla',
      '41 imagens reais · PHP form CORS bilateral',
    ],
    details: [
      'Custom cursor duplo (outer + inner) com lerp suave',
      'Navbar inteligente hide/show no scroll direction',
      'Parallax shapes trigonométrico (sin/cos drift)',
      'Tratamentos: ozonioterapia · criolipólise · drenagem · RF · depilação laser · peeling',
      'Validação bilateral PHP + JS + CORS',
      'Emails bilaterais (cliente + clínica) via PHPMailer',
    ],
    ctas: [
      {
        label: 'Quero um site assim pra minha clínica →',
        href: 'https://wa.me/5542998592522?text=Ol%C3%A1%20Stefan%2C%20vi%20o%20site%20da%20Cl%C3%ADnica%20MD%20e%20quero%20algo%20assim%20pra%20minha%20cl%C3%ADnica.',
        external: true,
        variant: 'default',
      },
      {
        label: 'Ver no GitHub →',
        href: 'https://github.com/stefanscrepka/site_estetica_md',
        external: true,
        variant: 'outline',
      },
    ],
    screenshot: '/work-screenshots/estetica-md-home.avif',
    heroAsset: {
      src: '/work-screenshots/estetica-md-home.avif',
      type: 'image',
      // W-fix (2026-05-26): aspect 16/10 → 3/2. A captura nativa é 3/2 (Dra.
      // foto + certificado) e estava esticada/cortada ao forçar 16/10.
      aspect: '3/2',
    },
    diagram: 'estetica',
    accent: 'amber',
    shortLine: 'Site clínica premium · vanilla JS + PHP · prova de motion design antes do React.',
  },
};

export const CASE_STUDY_SLUGS = Object.keys(CASE_STUDIES) as CaseStudySlug[];

export function getCaseStudy(slug: string): CaseStudy | null {
  if (slug in CASE_STUDIES) {
    return CASE_STUDIES[slug as CaseStudySlug];
  }
  return null;
}

/* ============================================================
   Squads do Content Engine — FONTE ÚNICA.
   O nome dos 5 squads aparecia duplicado em três lugares
   (squads-status-line.tsx, o diagrama do pipeline e a cópia dos cases).
   Duplicata de dado é como a contradição "22 vs 24 agentes" nasce; aqui
   fica um lugar só.

   ⚠️ Deliberadamente SEM contagem por squad. O diagrama do pipeline
   (components/work/diagrams.tsx) declara 6/4/2/8/4, que soma **24** — mas o
   rodapé do próprio diagrama e outros sete pontos do site afirmam **22
   agentes**. Um dos dois números está errado e isso é decisão do Stefan, não
   minha. Enquanto não se resolver, nada novo é construído em cima da
   contagem por squad. Ver ROADMAP.md → Fase 4 → "Pendente de decisão".
   ============================================================ */
export const CONTENT_ENGINE_SQUADS = [
  { id: 's0', code: 'S0', name: 'Onboarding' },
  { id: 's1', code: 'S1', name: 'Inteligência' },
  { id: 's2', code: 'S2', name: 'Estratégia' },
  { id: 's3', code: 'S3', name: 'Criação' },
  { id: 's4', code: 'S4', name: 'Revisão' },
] as const;
