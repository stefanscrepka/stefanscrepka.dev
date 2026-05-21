import type { Metadata } from 'next';
import Link from 'next/link';
import { TracingBeam } from '@/components/ui-effects/tracing-beam';
import { cn } from '@/lib/utils';

// /process — Como construo: método multi-agente.
// Layout: container-narrow + TracingBeam side rail (Aceternity) + prose editorial.
// Cinco seções: anti-slop validator, prompt cache 2 camadas, HITL Telegram,
// cron 03h–07h30, stack local GPU.
//
// Tipografia: h2 text-2xl/3xl tracking-tight leading-1.1; corpo text-reading
// 17–19px com leading 1.6. Hairlines lime entre seções pra ritmo editorial.

export const metadata: Metadata = {
  title: 'Process — método multi-agente',
  description:
    'Como construo IA multi-agente em produção: anti-slop validator com 14 regex PT-BR, prompt cache 2 camadas, HITL via Telegram, cron 03h–07h30 e stack local GPU.',
  openGraph: {
    title: 'Process · Stefan Heinz Screpka',
    description:
      'Método multi-agente em produção — anti-slop, prompt cache 2 camadas, HITL Telegram, cron e stack local GPU.',
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
    title: 'Anti-slop validator — 14 regex PT-BR',
    body: [
      'LLM gera conteúdo que parece bom até alguém ler em voz alta. "É importante destacar que…", "no cenário atual…", "estamos diante de…" — padrões de slop que o leitor identifica em três segundos e desconfia da marca toda.',
      'Cada draft passa por 14 regex PT-BR antes de subir pra revisão humana. Quem falha volta pra reescrita com o motivo apontado. Não é heurística — é gate. Conteúdo que não passa não chega no Telegram.',
    ],
    highlights: [
      'Padrões banidos: hedge ("vale destacar"), buzzwords vazias, voz passiva crônica',
      'Custo: 0 — roda em string match, sem chamada de API extra',
      'Métrica: 100% dos drafts publicados passaram pelo validator',
    ],
  },
  {
    id: 'prompt-cache',
    index: '02',
    eyebrow: 'Performance',
    title: 'Prompt cache 2 camadas',
    body: [
      'Cada chamada Claude tem o mesmo system prompt + brand voice + 4-5 exemplos de tom. ~3.5k tokens de contexto que NÃO mudam entre runs.',
      'Camada 1: cache_control "ephemeral" no system prompt — TTL 5min, hit rate ~85% nos cron jobs. Camada 2: cached examples no user message — hit rate ~60%. Custo de input reduzido em ~70% vs zero-cache.',
    ],
    highlights: [
      'Hit rate medido via Langfuse trace span "anthropic.cache_read_input_tokens"',
      'Invalidação manual quando brand voice muda (script CLI)',
      'Reduz latência p95 de ~4.2s pra ~1.8s em chamadas cacheadas',
    ],
  },
  {
    id: 'hitl-telegram',
    index: '03',
    eyebrow: 'Aprovação',
    title: 'HITL via Telegram — ≤10 min/dia',
    body: [
      'Aprovação humana é gargalo se o fluxo é "abre dashboard, lê draft, clica aprovar". Movi pro Telegram — chega notificação, abre no celular, lê em 30s, responde "ok" ou "reescreve por X".',
      'Bot Telegram + Evolution API. Cada draft vira uma mensagem com botões inline (Aprovar / Rejeitar / Reescrever). Decisão fica persistida no Postgres com timestamp e justificativa. Audit trail completo sem fricção.',
    ],
    highlights: [
      'Volume real: 40-60 drafts/dia → 8-10 min total de aprovação',
      'Reescrita: bot pede motivo + reenvia pro agent corrigir',
      'Sem dashboard novo — Telegram é a UI; backend é só webhook + queue',
    ],
  },
  {
    id: 'cron',
    index: '04',
    eyebrow: 'Orquestração',
    title: 'Cron 03h–07h30 · janela noturna',
    body: [
      'Geração roda quando humano não está olhando. Cron dispara 5 squads sequenciais entre 03h e 07h30 BRT. Quando acordo às 8h, fila de aprovação já está cheia, agentes já processaram tudo, custo de inferência foi diluído pela noite.',
      'BullMQ + Redis pra coordenar dependências entre squads (squad S2 precisa do output de S1). Sentry captura falhas, retry automático com backoff exponencial. Se tudo quebrar, alerta no Telegram às 7h45.',
    ],
    highlights: [
      'Janela escolhida: API menos congestionada + sem competição com horário de pico',
      'Output médio noturno: 50-80 drafts, 30-50 imagens, 10-15 vídeos',
      'Custo previsível — orçamento batido com tolerância ±8%',
    ],
  },
  {
    id: 'stack-local',
    index: '05',
    eyebrow: 'Infraestrutura',
    title: 'Stack local GPU — subsidiando custo',
    body: [
      'Imagens e embeddings rodam em GPU local (RTX 4070 Ti). Stable Diffusion XL pra hero images, BGE-M3 pros embeddings do pgvector RAG. Custo marginal: 0 — energia já paga.',
      'Claude SDK chama API só quando precisa de raciocínio (writing, validação semântica, decisões). Embeddings, imagens, OCR, vision tasks light → local. Resultado: cost-per-piece cai ~62% vs full-API.',
    ],
    highlights: [
      'SDXL turbo: ~8s por imagem 1024x1024',
      'BGE-M3 embedding service: latência p95 ~120ms',
      'Fallback automático pra API quando GPU está saturada',
    ],
  },
  {
    id: 'closing',
    index: '06',
    eyebrow: 'Resumo',
    title: 'Disciplina, não milagre',
    body: [
      'Nada acima é "AI breakthrough". É engenharia: gate de qualidade que recusa, cache que mede, aprovação que cabe no celular, cron que respeita orçamento, GPU local pra diluir custo. Cada peça defendida com métrica.',
      'É assim que multi-agente sobrevive em produção sem virar buraco de dinheiro ou pesadelo de moderação. Se vai trabalhar comigo, é esse o padrão.',
    ],
  },
];

export default function ProcessPage() {
  return (
    <section className="section-pad-y" data-slot="process">
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
            Como construo · método multi-agente.
          </h1>
          <p className="mt-2 max-w-prose text-reading text-(--color-text-2)">
            Seis decisões de engenharia que tornam multi-agente um sistema previsível em vez de uma
            promessa de slide. Cada uma medida, defendida com número, em produção há meses.
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
            Quer aplicar esse método no seu produto? Respondo em menos de 12h.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3) outline-none transition-colors hover:text-(--color-text-1) focus-visible:text-(--color-text-1)"
            >
              ← Voltar
            </Link>
            <Link
              href="/#contato"
              className={cn(
                'inline-flex items-center gap-2 font-mono text-sm text-(--color-accent)',
                'transition-[gap,color] duration-(--motion-transition) ease-(--ease-smooth)',
                'hover:gap-3 hover:text-(--color-accent-hover) focus-visible:gap-3 outline-none'
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
