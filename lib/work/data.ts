// Single source of truth pros 4 case studies.
//
// F7 (2026-09-04): todos os números daqui foram conferidos no código dos
// produtos (auditoria em ROADMAP.md → FASE 7):
//   Content Engine — apps/web/src/lib/agent-roles.ts (19 papéis), packages/
//   contracts/src/agent-activity.ts (5 squads), apps/runtime/src/env.ts (cron
//   03:00 → 07:30, America/Sao_Paulo), apps/runtime/src/db/schema.ts (57
//   tabelas), 243 arquivos de teste / 2.059 casos no runtime,
//   apps/runtime/src/anti-slop/ai-tells.ts (14 + 14 regex).
//   Caluna — antes NexaCore; rebatizado nos commits de 31/05 e 01/06/2026.
//   prisma/schema.prisma (35 models, 27 com tenantId), 554 casos de teste,
//   src/services/ai-service.ts (11 ferramentas voltadas à cliente).
// Nenhum número redondo, nenhum número que o código não sustente.
//
// F6 (2026-09-04): toda capa é uma CAPTURA REAL do produto (`cover: Artifact`),
// com a procedência (rota, ambiente, data) que a moldura mostra. Diagrama é
// afirmação, captura é evidência.

export type CaseStudySlug = 'content-engine' | 'caluna' | 'stark' | 'estetica-md';

export interface CaseStudyCTA {
  label: string;
  href: string;
  variant?: 'default' | 'outline';
  external?: boolean;
}

export type ArtifactAspect = '16/10' | '16/9' | '4/3' | '3/2' | '1/1' | '3/4';

/** Uma captura real do produto, com a procedência que a moldura (ArtifactFrame) exibe. */
export interface Artifact {
  src: string;
  alt: string;
  aspect: ArtifactAspect;
  width: number;
  height: number;
  /** Barra da moldura, à esquerda: a rota ou o arquivo capturado. */
  label?: string;
  /** Barra da moldura, à direita: dimensão · ambiente · data. */
  meta?: string;
  /** Legenda abaixo da moldura (páginas de case). */
  caption?: string;
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
  /** Capa: a captura que representa o produto nos tiles, no índice e no case. */
  cover: Artifact;
  /** Outras telas, usadas nas páginas de case. */
  gallery?: Artifact[];
  accent: 'lime' | 'amber';
  /** Microcopy do card "Other Work" + index gallery */
  shortLine: string;
  /** Impact line: um outcome, renderizado acima dos highlights técnicos. */
  impact?: {
    metric: string;
    context: string;
  };
  /** O problema que o case resolve (triad Problema · Solução · Impacto). */
  problem?: string;
  /** Pra quem foi feito; anonimizado quando não há autorização de uso da marca. */
  client?: string;
}

export const CASE_STUDIES: Record<CaseStudySlug, CaseStudy> = {
  'content-engine': {
    slug: 'content-engine',
    title: 'Content Engine',
    tagline:
      'Uma equipe de agentes Claude que pesquisa, escreve, revisa e espera a sua aprovação. Todo dia, pra cada marca.',
    description:
      '19 agentes em 5 squads rodam por cron no fuso de São Paulo, das 03h às 07h30, e deixam um pacote por marca pronto pra você aprovar, refinar ou rejeitar no Telegram ou no Studio. O que não precisa de raciocínio roda numa RTX 3070 local.',
    status: 'Operacional · cron diário · em iteração',
    stack: [
      'Anthropic SDK 0.93 + Claude Agent SDK 0.3 · Opus 4.7, Sonnet 4.6, Haiku 4.5',
      '19 agentes em 5 squads, mais 6 de onboarding (registro do próprio Studio)',
      '57 tabelas Postgres · Drizzle · 45 migrations',
      'Qdrant por marca · embeddings bge-m3 via Ollama (1024 dimensões)',
      'RTX 3070 local: Qwen 3.5 9B, SD 3.5 no ComfyUI, faster-whisper com CUDA',
      'grammY (bot do Telegram) · Langfuse · node-cron',
      '2.059 testes no runtime · 3.468 no monorepo · lint, typecheck e build no CI',
    ],
    details: [
      'Squad 0, onboarding (O-1 a O-6): entende o mercado, lê o material da marca, extrai a voz e monta o calendário. Roda uma vez por marca.',
      'Squad 1, inteligência (I-1 a I-4, 03h00): busca na web, concorrência, tendências e sinais da audiência.',
      'Squad 2, estratégia (S-5 e S-6, 05h30): o que publicar e em que horário.',
      'Squad 3, criação (C-7 a C-14, 06h00): copy, imagem, vídeo e a edição mecânica.',
      'Squad 4, revisão (R-15 a R-18, 07h15): anti-slop em cascata, 28 regex pt-BR, surprisal e um juiz LLM.',
      'E-0, o Editor-Chefe (07h30): monta o pacote do dia. Você aprova, refina ou rejeita em três botões.',
    ],
    // O repositório é PRIVADO: os dois CTAs apontam pra evidência que existe
    // na própria página.
    ctas: [
      { label: 'Ver o produto rodando ↓', href: '#produto', variant: 'default' },
      { label: 'Ler a arquitetura →', href: '#architecture', variant: 'outline' },
    ],
    cover: {
      src: '/work-screenshots/content-engine-agentes.avif',
      alt: 'Content Engine Studio, página Equipe: a caixa de entrada com o pacote do dia esperando aprovação e a grade dos agentes por squad',
      aspect: '16/10',
      width: 2880,
      height: 1800,
      label: 'studio · /agentes',
      meta: 'local · set/2026',
      caption:
        'Studio, página Equipe, marca SK3D. Captura em ambiente local com o runtime em modo scripted (regras, sem chamada a LLM), set/2026',
    },
    gallery: [
      {
        src: '/work-screenshots/content-engine-hoje.avif',
        alt: 'Content Engine Studio, página Hoje: o pacote do dia com duas variantes de copy e os botões aprovar, refinar e rejeitar',
        aspect: '16/10',
        width: 2880,
        height: 1800,
        label: 'studio · / (hoje)',
        meta: 'local · set/2026',
        caption: 'Hoje: o pacote do dia da SK3D esperando a decisão do humano',
      },
      {
        src: '/work-screenshots/content-engine-equipe.avif',
        alt: 'Content Engine Studio, página Equipe: a grade dos agentes por departamento com status, horário e custo de cada um',
        aspect: '16/10',
        width: 2880,
        height: 1800,
        label: 'studio · /agentes',
        meta: 'local · set/2026',
        caption: 'Equipe: quem fez o quê, a que horas, quanto custou',
      },
    ],
    accent: 'lime',
    shortLine: 'Multi-agente Claude · 19 agentes em 5 squads · um pacote por dia pra você aprovar.',
    impact: {
      metric: '1 pacote/dia',
      context: 'por marca, pronto às 07h30, esperando três botões: aprovar, refinar, rejeitar',
    },
    problem:
      'Conteúdo diário pra várias marcas exige uma equipe de quatro a seis pessoas em tempo integral. Agência não escala, freelancer não segura o padrão, e a maior parte do trabalho é repetível.',
  },
  caluna: {
    slug: 'caluna',
    title: 'Caluna',
    tagline:
      'A secretária de clínica de estética que vive no WhatsApp: atende, agenda, confirma, lembra e cobra.',
    description:
      'SaaS multi-tenant pra clínicas de estética. A cliente escreve no WhatsApp da clínica e uma assistente com 11 ferramentas responde, marca, remarca, manda o PIX e confirma o pagamento. A dona entra na conversa só quando faz diferença. Até junho de 2026 o produto se chamava NexaCore.',
    status: 'Em produção desde 2025 · rebatizado Caluna em jun/2026',
    stack: [
      'Next 14 App Router · React 18 · TypeScript',
      'Clerk (auth e MFA) · Prisma 5 · PostgreSQL · 35 modelos, 27 com tenantId',
      'Redis + BullMQ: fila de respostas da IA e de envios do WhatsApp',
      'Socket.io com adapter Redis: painel em tempo real',
      'Evolution API 2.3.7 (WhatsApp) · OpenAI (chat, tool calling, Whisper)',
      'Asaas (PIX e boleto) · Google Calendar · Sentry com redator de PII',
      '554 testes (vitest e Playwright)',
    ],
    details: [
      'Atende na hora, 24h, no WhatsApp que a clínica já usa',
      'Consulta serviços, profissionais e horários livres; marca, remarca ou cancela',
      'Confirma o horário quando o PIX cai e lembra a cliente 24h e 2h antes',
      'Sugere o retorno na hora certa e um serviço complementar',
      'Pede confirmação antes de marcar ou cobrar; acima de um teto, chama a dona',
      'Handoff humano pelo inbox, com lead score e etiquetas',
    ],
    ctas: [
      { label: 'Ver as telas ↓', href: '#telas', variant: 'default' },
      { label: 'Agendar 15min →', href: '/#contato', variant: 'outline' },
    ],
    // F7: capturas do build atual rodando em ambiente local com o seed do
    // repo. O striveos.shop (domínio da versão NexaCore) estava fora do ar no
    // dia; nada aqui é da versão antiga.
    cover: {
      src: '/work-screenshots/caluna-landing.avif',
      alt: 'Landing da Caluna: “Sua agenda cheia, sem você tocar no celular.” ao lado de uma conversa de WhatsApp em que a secretária marca uma limpeza de pele',
      aspect: '16/10',
      width: 2880,
      height: 1800,
      label: 'caluna · /',
      meta: 'build local · set/2026',
      caption: 'Landing atual: a promessa, e a conversa do WhatsApp como peça central',
    },
    gallery: [
      {
        src: '/work-screenshots/caluna-servicos.avif',
        alt: 'Caluna, página Serviços: cinco procedimentos com duração, preço e regra de lembrete, e os totais no topo',
        aspect: '16/10',
        width: 2880,
        height: 1800,
        label: 'caluna · /services',
        meta: 'build local · seed',
        caption: 'Serviços: preço, duração e a regra de lembrete que a secretária usa',
      },
      {
        src: '/work-screenshots/caluna-clientes.avif',
        alt: 'Caluna, página Clientes: tabela com contato, última visita, atendimentos, total gasto e status de cada cliente',
        aspect: '16/10',
        width: 2880,
        height: 1800,
        label: 'caluna · /clients',
        meta: 'build local · seed',
        caption: 'Clientes: histórico, receita e o botão de conversa em cada linha',
      },
      {
        src: '/work-screenshots/caluna-landing-features.avif',
        alt: 'Landing da Caluna, seção “Conecta o WhatsApp. E pronto.”: três passos em cards e o aviso de cookies do site',
        aspect: '16/10',
        width: 2880,
        height: 1800,
        label: 'caluna · / (como funciona)',
        meta: 'build local · set/2026',
        caption: 'Como funciona, em três passos. O aviso de cookies é do produto',
      },
    ],
    accent: 'lime',
    shortLine:
      'Secretária no WhatsApp pra clínicas de estética · Next 14 + Prisma + Evolution API.',
    impact: {
      metric: '11 ferramentas',
      context:
        'a assistente consulta a agenda, marca, cobra e confirma sozinha; a dona entra só quando faz diferença',
    },
    problem:
      'A dona da clínica perde lead à noite, toma no-show de surpresa e passa o dia respondendo WhatsApp entre um atendimento e outro. Ela quer cuidar de quem chega, não da agenda.',
  },
  stark: {
    slug: 'stark',
    title: 'STARK',
    tagline:
      'Passagem de turno de uma linha de OSB: formulário digital, KPIs de OEE calculados na hora, telão pra sala de controle, PDF e Excel',
    description:
      'Substitui a planilha Excel de passagem de turno de uma fábrica de painéis OSB. Roda on-premises, sem internet, como serviço do Windows: o supervisor fecha o turno e os indicadores aparecem no telão da sala de controle.',
    status: 'Piloto · proposta comercial entregue em jul/2026',
    stack: [
      'Next.js 16 App Router · React 19 · TypeScript',
      'Prisma 6 · PostgreSQL 17 · migrations versionadas',
      'Sessão própria (jose + bcryptjs) · papéis operador, supervisor, leitura e admin',
      'Recharts (painel e telão) · @react-pdf/renderer (PDF A4) · exceljs (XLSX e CSV)',
      'Importador dos .xlsm legados · fórmulas fechadas contra três planilhas oficiais',
      'vitest · 153 testes de lógica pura · serviço do Windows on-premises',
    ],
    details: [
      'OEE, disponibilidade, performance e qualidade recalculados a cada fechamento, com as mesmas fórmulas do Excel oficial, dígito a dígito',
      'Telão 16:9 pra TV da sala de controle: gauges real × meta, ritmo vs meta acumulada, projeção de fechamento, Pareto por código e por área',
      'Painel do período com filtros (turno, produto, supervisor) e tendência de OEE por dia e turno',
      'Busca global de paradas e ocorrências no histórico',
      'Cadastros de metas, códigos de falha, áreas e planos de ação',
      'Exporta PDF do relatório e Excel/CSV do período; importa o histórico dos .xlsm',
    ],
    ctas: [
      { label: 'Ver as telas ↓', href: '#telas', variant: 'default' },
      { label: 'Agendar 15min →', href: '/#contato', variant: 'outline' },
    ],
    cover: {
      src: '/work-screenshots/stark-telao.avif',
      alt: 'STARK, telão de KPIs do mês na sala de controle: OEE, detenção × meta, disponibilidade, ritmo do mês, paradas por código e maiores paradas',
      aspect: '16/9',
      width: 2880,
      height: 1620,
      label: 'stark · /telao?mes=2025-03',
      meta: '1920×1080 · TV',
      caption:
        'Telão de KPIs pra TV da sala de controle. Captura em ambiente local com o seed do projeto, set/2026',
    },
    gallery: [
      {
        src: '/work-screenshots/stark-painel.avif',
        alt: 'STARK, painel do período: OEE, performance, qualidade, disponibilidade, volume e tendência de OEE por dia e turno',
        aspect: '16/10',
        width: 2880,
        height: 1800,
        label: 'stark · /painel',
        meta: 'local · set/2026',
        caption: 'Painel do período: agregados por componentes somados, não média de OEEs',
      },
      {
        src: '/work-screenshots/stark-relatorio.avif',
        alt: 'STARK, relatório de turno fechado: identificação do turno, produto, consumo por insumo com desvio e perda em reais',
        aspect: '16/10',
        width: 2880,
        height: 1800,
        label: 'stark · /relatorios/[id]',
        meta: 'local · set/2026',
        caption: 'Relatório fechado: identificação, produto, consumo por insumo, desvios',
      },
      {
        src: '/work-screenshots/stark-relatorios.avif',
        alt: 'STARK, lista de relatórios de turno com filtros por data, turno, status, produto e supervisor, e exportação CSV/Excel',
        aspect: '16/10',
        width: 2880,
        height: 1800,
        label: 'stark · /relatorios',
        meta: 'local · set/2026',
        caption: 'Histórico consultável: filtros, status e exportação',
      },
    ],
    accent: 'lime',
    shortLine:
      'Passagem de turno industrial · Next 16 + Postgres · OEE dígito a dígito · telão de KPIs.',
    impact: {
      metric: 'Excel → sistema',
      context:
        'KPIs de OEE calculados no fechamento do turno, histórico consultável e telão na sala de controle',
    },
    problem:
      'A passagem de turno vivia numa planilha Excel por turno: fórmulas frágeis, sem histórico consultável, indicadores refeitos à mão e nenhuma visibilidade na sala de controle.',
    client: 'Linha de OSB de uma fabricante multinacional de painéis (Paraná)',
  },
  'estetica-md': {
    slug: 'estetica-md',
    title: 'Estética MD',
    tagline: 'Site institucional e de conversão pra Dra. Martina Dona',
    description:
      'Feito pra uma clínica premium: estética, odonto, med spa. Primeiro produto em produção, antes do React.',
    status: 'Em produção desde Dez/2024',
    stack: [
      'HTML5 · CSS3 · JS vanilla',
      'PHP + PHPMailer no backend',
      'ScrollReveal · Typed.js · OwlCarousel2',
      'WhatsApp wa.me deeplink',
      '1.697 linhas de CSS · 914 linhas de JS vanilla',
      '41 imagens reais · formulário PHP com CORS bilateral',
    ],
    details: [
      'Cursor duplo (outer e inner) com lerp suave',
      'Navbar que some ao rolar pra baixo e volta ao rolar pra cima',
      'Parallax de shapes trigonométrico (drift em seno e cosseno)',
      'Tratamentos: ozonioterapia · criolipólise · drenagem · RF · depilação laser · peeling',
      'Validação bilateral PHP + JS + CORS',
      'Emails pros dois lados (cliente e clínica) via PHPMailer',
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
    // F7: recapturado no pixel 0, com a intro assentada (6 s de espera).
    cover: {
      src: '/work-screenshots/estetica-md-home.avif',
      alt: 'Estética MD, home do site: “Clínica Estética MD”, Dra. Martina Dona com o certificado, CTAs de tratamentos e avaliação',
      aspect: '16/10',
      width: 2880,
      height: 1800,
      label: 'estética md · /',
      meta: 'site estático · set/2026',
      caption: 'Home do site institucional. Captura do build atual, set/2026',
    },
    accent: 'amber',
    shortLine:
      'Site de clínica premium · vanilla JS + PHP · prova de motion design antes do React.',
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
   Squads do Content Engine — FONTE ÚNICA, conferida no código
   (packages/contracts/src/agent-activity.ts: intel, strategy, creation,
   review, editor; apps/web/src/lib/agent-roles.ts: nomes em pt-BR). O
   onboarding (O-1 a O-6) roda uma vez por marca, fora do ciclo diário, e o
   Editor-Chefe (E-0) fecha o dia. Contagens e horários vêm do registro do
   runtime (apps/runtime/src/index.ts) e do cron (apps/runtime/src/env.ts).
   ============================================================ */
export const CONTENT_ENGINE_SQUADS = [
  {
    id: 's0',
    code: 'S0',
    name: 'Onboarding',
    agents: 6,
    range: 'O-1 a O-6',
    when: 'uma vez por marca',
  },
  { id: 's1', code: 'S1', name: 'Inteligência', agents: 4, range: 'I-1 a I-4', when: '03h00' },
  { id: 's2', code: 'S2', name: 'Estratégia', agents: 2, range: 'S-5 e S-6', when: '05h30' },
  { id: 's3', code: 'S3', name: 'Criação', agents: 8, range: 'C-7 a C-14', when: '06h00' },
  { id: 's4', code: 'S4', name: 'Revisão', agents: 4, range: 'R-15 a R-18', when: '07h15' },
] as const;

/** O ciclo diário como o cron o executa (apps/runtime/src/env.ts, fuso America/Sao_Paulo). */
export const CONTENT_ENGINE_DAILY_CRON = [
  { at: '03:00', expr: '0 3 * * *', job: 'daily-intel', who: 'I-1 a I-4' },
  { at: '05:30', expr: '30 5 * * *', job: 'daily-strategy', who: 'S-5, S-6' },
  { at: '06:00', expr: '0 6 * * *', job: 'daily-creation', who: 'C-7 a C-11, C-14' },
  { at: '07:15', expr: '15 7 * * *', job: 'daily-review', who: 'R-15 a R-18' },
  { at: '07:30', expr: '30 7 * * *', job: 'daily-editor', who: 'E-0' },
  { at: '09:00', expr: 'publish', job: 'publicação', who: 'você aprovou' },
] as const;

/* ============================================================
   Índice do hero (F9, 2026-09-05): o corpo de trabalho, numerado, na primeira
   tela. Os quatro cases reusam a capa dos tiles; o quinto é o estúdio de
   impressão 3D, que não tem página própria e aponta pro card do Other Work.
   Ano e estado são os do case (status em cada CaseStudy) — nenhum aqui diz
   mais do que a página diz.
   ============================================================ */
export interface HeroIndexItem {
  /** Numeração do índice ("01"). */
  n: string;
  title: string;
  /** O que a coisa faz, com verbo. */
  line: string;
  year: string;
  /** Estado real, em uma ou duas palavras. */
  status: string;
  /** Rota do case, ou âncora (#id) de uma seção da home. */
  href: string;
  cover: Artifact;
  /** Recorte da capa na moldura 16/10 do hero (default: topo, pra manter a barra da UI). */
  coverPosition?: 'top' | 'center';
}

export const HERO_INDEX: readonly HeroIndexItem[] = [
  {
    n: '01',
    title: 'Content Engine',
    line: 'Agentes que escrevem e esperam sua aprovação.',
    year: '2026',
    status: 'operacional',
    href: '/work/content-engine',
    cover: CASE_STUDIES['content-engine'].cover,
  },
  {
    n: '02',
    title: 'Caluna',
    line: 'Atende e agenda pelo WhatsApp da clínica.',
    year: '2025',
    status: 'em produção',
    href: '/work/caluna',
    cover: CASE_STUDIES.caluna.cover,
  },
  {
    n: '03',
    title: 'STARK',
    line: 'A passagem de turno saiu do Excel pro telão.',
    year: '2026',
    status: 'piloto',
    href: '/work/stark',
    cover: CASE_STUDIES.stark.cover,
  },
  {
    n: '04',
    title: 'Estética MD',
    line: 'Site de clínica que converte pelo WhatsApp.',
    year: '2024',
    status: 'no ar',
    href: '/work/estetica-md',
    cover: CASE_STUDIES['estetica-md'].cover,
  },
  {
    n: '05',
    title: 'SK3D',
    line: 'Quadros e peças que eu modelo e imprimo.',
    year: '2026',
    status: 'peças físicas',
    href: '#other-work',
    cover: {
      src: '/work-screenshots/levita-gremio-angulo.avif',
      alt: 'Quadro LEVITA do Grêmio em ângulo: o escudo em relevo azul, branco e preto flutuando sobre a moldura preta impressa',
      aspect: '4/3',
      width: 1500,
      height: 1125,
      label: 'sk3d · quadro levita',
      meta: 'render cycles · 2026',
    },
    coverPosition: 'center',
  },
];
