// Artefatos VERBATIM do Content Engine (F6, 2026-09-04).
//
// Nada aqui foi escrito pra este site: cada bloco é cópia literal de um arquivo
// do monorepo do produto (content-engine, privado) e cita a origem. É o
// "registro cru" no lugar do resumo (R4 §1.10) — uma lista de regex ou o
// registro de papéis do Studio é evidência que custa caro pra falsificar
// (R7 / Riegelsberger 2005); um diagrama de caixas não é. Se o produto mudar,
// isto muda junto; nunca o contrário.

export type CeSquadId = 'direcao' | 'inteligencia' | 'estrategia' | 'criacao' | 'revisao';

export interface CeAgent {
  id: string;
  role: string;
  duty: string;
  squad: CeSquadId;
}

export const CE_SQUAD_LABELS: Record<CeSquadId, string> = {
  direcao: 'Direção',
  inteligencia: 'Inteligência',
  estrategia: 'Estratégia',
  criacao: 'Criação',
  revisao: 'Revisão',
};

/** apps/web/src/lib/agent-roles.ts → ROLES. Os 19 papéis do ciclo diário, com o
 *  texto que o dono lê na página Equipe do Studio ("Caçador de Virais · concluiu
 *  03:14", não "I-2 completed"). Ordem = DEPARTMENT_ORDER do mesmo arquivo. */
export const CE_AGENTS: readonly CeAgent[] = [
  { id: 'E-0', role: 'Editor-Chefe', duty: 'arbitra e decide o pacote do dia', squad: 'direcao' },
  {
    id: 'I-1',
    role: 'Pulso de Mercado',
    duty: 'lê o que está acontecendo no nicho',
    squad: 'inteligencia',
  },
  {
    id: 'I-2',
    role: 'Caçador de Virais',
    duty: 'garimpa formatos e hooks que estão bombando',
    squad: 'inteligencia',
  },
  {
    id: 'I-3',
    role: 'Vigia da Concorrência',
    duty: 'monitora o que os concorrentes postam e anunciam',
    squad: 'inteligencia',
  },
  {
    id: 'I-4',
    role: 'Sinal da Audiência',
    duty: 'lê sentimento e dores nos comentários',
    squad: 'inteligencia',
  },
  {
    id: 'S-5',
    role: 'Estrategista de Conteúdo',
    duty: 'decide o brief: pillar, formato, objetivo',
    squad: 'estrategia',
  },
  {
    id: 'S-6',
    role: 'Engenheiro de Hook',
    duty: 'gera e ranqueia os ganchos dos primeiros segundos',
    squad: 'estrategia',
  },
  {
    id: 'C-7',
    role: 'Copywriter',
    duty: 'escreve as variantes de copy (safe/bold/viral)',
    squad: 'criacao',
  },
  {
    id: 'C-8',
    role: 'Diretor Visual',
    duty: 'define a direção de arte de cada peça',
    squad: 'criacao',
  },
  { id: 'C-9', role: 'Gerador de Imagem', duty: 'produz as imagens on-brand', squad: 'criacao' },
  {
    id: 'C-10',
    role: 'Gerador de Vídeo',
    duty: 'produz vídeo com IA quando o tema permite',
    squad: 'criacao',
  },
  {
    id: 'C-11',
    role: 'Sound Designer',
    duty: 'recomenda o som (trending vs próprio)',
    squad: 'criacao',
  },
  {
    id: 'C-12',
    role: 'Diretor de Footage',
    duty: 'manda a shot list semanal pro dono gravar',
    squad: 'criacao',
  },
  {
    id: 'C-13',
    role: 'Curador de Footage',
    duty: 'transcreve e indexa o footage gravado',
    squad: 'criacao',
  },
  { id: 'C-14', role: 'Editor de Vídeo', duty: 'monta o reel 9:16 dos cortes', squad: 'criacao' },
  {
    id: 'R-15',
    role: 'Auditor Anti-Slop',
    duty: 'reprova o que parece feito por IA',
    squad: 'revisao',
  },
  {
    id: 'R-16',
    role: 'Guardião da Marca',
    duty: 'garante coerência com a identidade',
    squad: 'revisao',
  },
  {
    id: 'R-17',
    role: 'Otimizador de Plataforma',
    duty: 'adapta caption/hashtags por rede',
    squad: 'revisao',
  },
  {
    id: 'R-18',
    role: 'Horário de Postagem',
    duty: 'aprende a melhor hora de publicar',
    squad: 'revisao',
  },
];

export function ceAgentsOf(squad: CeSquadId): readonly CeAgent[] {
  return CE_AGENTS.filter((a) => a.squad === squad);
}

/** packages/prompts/templates/*.md — os seis agentes do onboarding (Squad 0), pelo
 *  nome do arquivo de prompt. Rodam uma vez por marca, não no ciclo diário. */
export const CE_ONBOARDING_TEMPLATES = [
  { id: 'O-1', file: 'o1-niche-discovery.md' },
  { id: 'O-2', file: 'o2-vertical-strategist-synthesize.md' },
  { id: 'O-3', file: 'o3-brand-card-synthesize.md' },
  { id: 'O-4', file: 'o4-archetype-voice-synthesize.md' },
  { id: 'O-5', file: 'o5-calendar-architect-synthesize.md' },
  { id: 'O-6', file: 'o6-style-ref-library-synthesize.md' },
] as const;

/** apps/runtime/src/anti-slop/ai-tells.ts → AI_TELL_PATTERNS_V1. As 14 regex
 *  pt-BR que reprovam texto com cara de IA no validator do E-0 (a lista V2, com
 *  mais 14, alimenta o auditor R-15). Linhas 17–32 do arquivo, sem edição. */
export const CE_AI_TELLS_SOURCE = {
  file: 'apps/runtime/src/anti-slop/ai-tells.ts',
  startLine: 17,
  lines: [
    'export const AI_TELL_PATTERNS_V1: readonly RegExp[] = [',
    '  /no mundo atual/i,',
    '  /al[eé]m disso/i,',
    '  /vamos explorar/i,',
    '  /em conclus[aã]o/i,',
    '  /[eé] importante notar/i,',
    '  /voc[eê] sabia que/i,',
    '  /transforma[cç][aã]o digital/i,',
    '  /revoluci(?:on|ô)/i,',
    '  /fundamental para/i,',
    '  /essencial para/i,',
    '  /no contexto atual/i,',
    '  /cada vez mais comum/i,',
    '  /em nossa sociedade/i,',
    '  /uma jornada (?:de|para)/i,',
    '];',
  ],
} as const;

/** apps/telegram-bot/src/bot.ts → bot.command(...), na ordem do registro
 *  (linhas 62–69). Cada comando tem um arquivo próprio em src/commands/. */
export const CE_TELEGRAM_COMMANDS = [
  { cmd: '/start', file: 'start.ts' },
  { cmd: '/help', file: 'help.ts' },
  { cmd: '/ping', file: 'ping.ts' },
  { cmd: '/whoami', file: 'whoami.ts' },
  { cmd: '/status', file: 'status.ts' },
  { cmd: '/onboard', file: 'onboard.ts' },
  { cmd: '/cancel', file: 'cancel.ts' },
  { cmd: '/pending', file: 'pending.ts' },
] as const;
