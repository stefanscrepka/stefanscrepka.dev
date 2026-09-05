import type { Metadata } from 'next';
import Link from 'next/link';
import { TracingBeam } from '@/components/ui-effects/tracing-beam';
import { cn } from '@/lib/utils';

// /process — Como construo: oito decisões, três produtos (F9: era seis de seis
// Content Engine; entraram o OEE do STARK e o tenantId da Caluna).
// Layout: container-narrow + TracingBeam side rail (Aceternity) + prose editorial.
// Cinco seções: anti-slop validator, prompt cache 2 camadas, HITL Telegram,
// cron 03h–07h30, stack local GPU.
//
// Tipografia: h2 text-2xl/3xl tracking-tight leading-1.1; corpo text-reading
// 17–19px com leading 1.6. Hairlines lime entre seções pra ritmo editorial.

export const metadata: Metadata = {
  title: 'Process · oito decisões, três produtos',
  description:
    'Como construo: oito decisões de engenharia em três produtos. Anti-slop em cascata, prompt cache com dois TTLs, aprovação em três botões no Telegram, cron das 03h às 07h30, inference local numa RTX 3070, OEE somado antes de dividir no STARK e tenantId em 27 dos 35 modelos da Caluna.',
  openGraph: {
    title: 'Process · Stefan Heinz Screpka',
    description:
      'Oito decisões de engenharia em três produtos: anti-slop, prompt cache, aprovação no Telegram, cron, inference local, OEE somado e tenantId.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/process' },
};

interface Section {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  body: string[];
  highlights?: string[];
}

const SECTIONS: Section[] = [
  {
    id: 'anti-slop',
    index: '01',
    eyebrow: 'Qualidade',
    title: 'Anti-slop em cascata',
    body: [
      'LLM gera texto que parece bom até alguém ler em voz alta. "No mundo atual", "além disso", "vale destacar": o leitor identifica em três segundos e desconfia da marca inteira.',
      'Cada draft passa por três estágios antes de subir pra revisão humana. Primeiro, 28 regex pt-BR: 14 clássicas de 2024 e 2025, e 14 que surgiram em 2026, quando os modelos aprenderam a evitar as clássicas. Depois, uma medida de surprisal rodando local. Por fim, um juiz LLM. Quem falha volta pra reescrita com o motivo apontado.',
    ],
    highlights: [
      'Além das regex: travessão, cadência uniforme, emoji e falta de especificidade também reprovam',
      'O validator do Editor-Chefe usa as 14 clássicas; o auditor R-15 usa as 28',
      'Os padrões estão em apps/runtime/src/anti-slop/ai-tells.ts, e a lista aparece no case',
    ],
  },
  {
    id: 'prompt-cache',
    index: '02',
    eyebrow: 'Custo',
    title: 'Prompt cache com dois TTLs',
    body: [
      'Cada chamada carrega o mesmo system prompt, a mesma voz da marca e as mesmas ferramentas. Isso é prefixo cacheável, e o cache da Anthropic cobra 10% do preço de input na leitura.',
      'O runtime marca o prefixo em duas superfícies (system e tools) e escolhe entre dois TTLs, 5 minutos ou 1 hora, com uma guarda de tamanho mínimo por modelo. E vem desligado por padrão: um agente que roda uma vez por dia nunca colheria o desconto, só pagaria o prêmio de escrita. Cache que não mede é fé.',
    ],
    highlights: [
      'packages/agent-runtime/src/caching.ts: no máximo 4 breakpoints por chamada',
      'Tokens de cache contados por TTL no custo de cada execução (Langfuse)',
      'AGENT_CACHE_ENABLED decide por ambiente; o default é false, com o motivo escrito no código',
    ],
  },
  {
    id: 'hitl-telegram',
    index: '03',
    eyebrow: 'Aprovação',
    title: 'Três botões no Telegram',
    body: [
      'Aprovação humana vira gargalo quando o fluxo é "abre o painel, lê o draft, clica". Aqui o pacote do dia chega no celular: aprovar, refinar ou rejeitar, e um texto livre quando é refinar.',
      'A decisão fica persistida com quem decidiu, quando e por quê, e um índice único garante que cada pacote só recebe uma decisão. O mesmo fluxo existe no Studio, pra quem prefere a tela grande.',
    ],
    highlights: [
      'Bot em grammY; comando /pending lista o que espera decisão',
      'Refinar abre um texto livre com 5 minutos pra responder',
      'Sem dashboard novo pra aprender: o Telegram é a interface',
    ],
  },
  {
    id: 'cron',
    index: '04',
    eyebrow: 'Orquestração',
    title: 'Cron das 03h às 07h30',
    body: [
      'A geração roda enquanto ninguém está olhando. No fuso de São Paulo: inteligência às 03h00, estratégia às 05h30, criação às 06h00, revisão às 07h15, Editor-Chefe às 07h30. Quando o dono acorda, o pacote está pronto; a publicação sai às 09h.',
      'São 16 jobs no node-cron, com noOverlap e um kill switch por ambiente. Um watchdog de hora em hora aponta o que travou; um watcher por minuto acompanha renders e publicações.',
    ],
    highlights: [
      'C-12 (shot list) roda no domingo às 18h; C-13 (curadoria) a cada upload',
      'Captura de performance às 06h, 14h, 20h e 23h; o analista P-20 fecha o dia às 23h',
      'Tudo em apps/runtime/src/env.ts, com o timezone explícito',
    ],
  },
  {
    id: 'stack-local',
    index: '05',
    eyebrow: 'Infraestrutura',
    title: 'Inference local numa RTX 3070',
    body: [
      'Claude entra onde precisa de raciocínio. O resto roda na GPU da mesa: embeddings com bge-m3 no Ollama, classificação em massa com Qwen 3.5 9B, imagem com SD 3.5 no ComfyUI e transcrição com faster-whisper em CUDA.',
      'Um semáforo garante um modelo por vez na GPU, e cada carga tem fallback pra API quando a placa está ocupada. O custo marginal de uma imagem local é energia.',
    ],
    highlights: [
      'SD 3.5 Medium: cerca de 25 s por imagem na RTX 3070',
      'Treino de LoRA por marca com Kohya, na mesma placa',
      'Chaves e hosts por ambiente: OLLAMA_HOST, COMFYUI_API_URL, FASTER_WHISPER_DEVICE',
    ],
  },
  {
    id: 'oee',
    index: '06',
    eyebrow: 'Cálculo',
    title: 'OEE somado antes de dividir',
    body: [
      'No STARK, o painel do período não pode ser a média dos OEEs de cada turno: turnos de duração diferente pesariam igual e o número do mês não fecharia com o Excel oficial da fábrica.',
      'O motor soma os numeradores e os denominadores de cada turno e só então divide, com as mesmas fórmulas da planilha, fechadas dígito a dígito contra três planilhas oficiais. Não há modelo nenhum aqui: é regra, e regra se testa.',
    ],
    highlights: [
      'src/lib/servicos/painel.ts: razão das somas, não média de razões',
      '153 testes de lógica pura no vitest',
      'Roda on-premises, sem internet, como serviço do Windows; o telão da sala de controle mostra o resultado',
    ],
  },
  {
    id: 'tenant',
    index: '07',
    eyebrow: 'Isolamento',
    title: 'tenantId em 27 dos 35 modelos',
    body: [
      'Na Caluna, cada clínica é um tenant, e um vazamento entre contas seria o fim do produto. Dos 35 modelos do Prisma, 27 carregam tenantId; a assistente só enxerga a agenda, os serviços e as clientes da clínica que está falando com ela.',
      'A mesma cautela vale pra IA: antes de marcar ou cobrar, ela pede confirmação; acima de um teto de valor, chama a dona; e o handoff humano acontece no inbox, com o histórico inteiro.',
    ],
    highlights: [
      'prisma/schema.prisma: 35 modelos, 27 com tenantId',
      'Assistente com 11 ferramentas sobre OpenAI, com tool calling',
      '554 testes (vitest e Playwright); Sentry com redator de PII',
    ],
  },
  {
    id: 'closing',
    index: '08',
    eyebrow: 'Resumo',
    title: 'Disciplina, não milagre',
    body: [
      'Nada acima é "AI breakthrough". É engenharia: um gate de qualidade que recusa, um cache que mede antes de ligar, uma aprovação que cabe no celular, um cron que respeita o fuso, uma GPU que dilui custo, um OEE que soma antes de dividir e um tenantId em cada tabela que importa. Cada peça com o arquivo onde ela vive.',
      'É assim que um produto sobrevive em produção sem virar buraco de dinheiro ou pesadelo de moderação. Se vai trabalhar comigo, é esse o padrão.',
    ],
  },
];

// W-seo (2026-05-25): HowTo JSON-LD a partir dos SECTIONS — Google renderiza
// step-by-step rich snippet no SERP pra páginas marcadas como HowTo. Maior
// ROI rich snippet do site porque /process JÁ é estruturado como tutorial.
// W-seo helper: filtra a section "closing" (resumo, não é step).
function buildHowToJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://stefanscrepka.dev';
  const steps = SECTIONS.filter((s) => s.id !== 'closing');
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${baseUrl}/process#howto`,
    name: 'Como construo: oito decisões de engenharia em três produtos',
    description:
      'Sete decisões de engenharia em três produtos: anti-slop em cascata, prompt cache medido, aprovação no Telegram, cron no fuso certo, inference local, OEE somado antes de dividir e tenantId em 27 dos 35 modelos.',
    inLanguage: 'pt-BR',
    totalTime: 'PT8M',
    author: { '@id': `${baseUrl}/#person` },
    step: steps.map((section, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: section.title,
      text: section.body.join(' '),
      url: `${baseUrl}/process#${section.id}`,
    })),
  };
}

export default function ProcessPage() {
  return (
    <section className="section-pad-y" data-slot="process">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data SSR
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHowToJsonLd()) }}
      />
      <div className="container-narrow">
        <header className="mb-14 flex flex-col gap-4 sm:mb-20">
          <p className="eyebrow">PROCESS</p>
          <h1
            className={cn(
              'font-semibold text-(--color-text-1)',
              'text-3xl sm:text-4xl lg:text-5xl',
              '!tracking-[-0.025em] !leading-[1.02] text-balance'
            )}
          >
            Como construo. Oito decisões, três produtos.
          </h1>
          <p className="mt-2 max-w-prose text-reading text-(--color-text-2)">
            Oito decisões de engenharia, do Content Engine ao chão de fábrica, que tornam o sistema
            previsível em vez de promessa de slide. Cada uma com número e com o arquivo onde vive.
          </p>
        </header>

        <TracingBeam>
          <ol className="flex flex-col gap-20 sm:gap-24">
            {SECTIONS.map((section) => (
              <li key={section.id} id={section.id} className="flex flex-col gap-6 scroll-mt-24">
                {/* Sequence label — mono lime 01/06 */}
                <div className="flex items-baseline gap-3">
                  <p className="font-mono text-2xs uppercase tracking-widest text-(--color-accent) tabular-nums">
                    {section.index}
                  </p>
                  <span
                    aria-hidden="true"
                    className="block h-px w-10 bg-(--color-accent)"
                    style={{ opacity: 0.6 }}
                  />
                  <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
                    {section.eyebrow}
                  </p>
                </div>

                {/* Headline section */}
                <h2
                  className={cn(
                    'font-semibold text-(--color-text-1)',
                    'text-2xl sm:text-3xl',
                    '!tracking-[-0.022em] !leading-[1.1]'
                  )}
                >
                  {section.title}
                </h2>

                {/* Body prose — reading pace 17–19px leading 1.6 */}
                <div
                  className={cn(
                    'flex flex-col gap-4 text-(--color-text-2)',
                    'text-reading [&_p]:leading-[1.6]'
                  )}
                >
                  {section.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                </div>

                {/* Highlights — bullets crisp lime */}
                {section.highlights && section.highlights.length > 0 ? (
                  <ul className="mt-2 flex flex-col gap-2.5 text-sm leading-snug text-(--color-text-2)">
                    {section.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-[7px] block h-1 w-1 shrink-0 rounded-full bg-(--color-accent)"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </TracingBeam>

        {/* Footer CTA pair — back to home + contato */}
        <footer className="mt-24 flex flex-col gap-6 border-t border-(--color-hairline) pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-prose text-sm text-(--color-text-3)">
            Quer aplicar esse método no seu produto? Respondo em até 12h, dias úteis.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={cn(
                'rounded-md font-mono text-2xs uppercase tracking-widest text-(--color-text-3) outline-none transition-colors',
                // F4 (2026-08-29): 16.5px de altura → WCAG 2.2 SC 2.5.8 (24px).
                'py-2 -my-2',
                'hover:text-(--color-text-1) focus-visible:text-(--color-text-1)',
                // W-a11y (2026-05-25): focus-visible ring (antes só color shift).
                'focus-visible:ring-2 focus-visible:ring-(--color-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg)'
              )}
            >
              ← Voltar
            </Link>
            <Link
              href="/#contato"
              className={cn(
                'inline-flex items-center gap-2 rounded-md font-mono text-sm text-(--color-accent) outline-none',
                'transition-[gap,color] duration-(--motion-transition) ease-(--ease-smooth)',
                'hover:gap-3 hover:text-(--color-accent-hover) focus-visible:gap-3',
                'focus-visible:ring-2 focus-visible:ring-(--color-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg)'
              )}
            >
              Falar comigo
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </footer>
      </div>
    </section>
  );
}
