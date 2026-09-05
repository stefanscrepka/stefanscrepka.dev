import type { Metadata } from 'next';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// /privacidade — F7 (2026-09-04): a página tinha oito seções e ~1.100 palavras
// pra dizer cinco coisas. Agora diz as cinco coisas primeiro, em uma linha
// cada, e detalha em quatro blocos curtos. Mesmo conteúdo legal (LGPD art. 7º
// e 18), metade do tamanho, nenhum template.

export const metadata: Metadata = {
  title: 'Privacidade',
  description:
    'O que o formulário de contato coleta, com quem os dados passam, por quanto tempo ficam e como você exerce os direitos da LGPD.',
  openGraph: {
    title: 'Privacidade · Stefan Heinz Screpka',
    description:
      'Nome, email e mensagem do formulário. Quatro processadores técnicos. Doze meses. Um email resolve qualquer pedido.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/privacidade' },
};

const LAST_UPDATED = '4 de setembro de 2026';

const IN_SHORT = [
  'Coleto só o que você digita no formulário: nome, email, canal preferido e a mensagem.',
  'Uso pra responder sobre o seu projeto. Não vendo, não compartilho, não treino modelo com isso.',
  'Quatro serviços técnicos tocam nos dados: Resend, Vercel, Vercel Analytics com Speed Insights, e Sentry.',
  'Guardo por 12 meses depois do último contato. Depois apago.',
  'Um email com “LGPD” no assunto resolve acesso, correção, exclusão ou portabilidade.',
];

interface Block {
  id: string;
  title: string;
  lines: string[];
}

const BLOCKS: Block[] = [
  {
    id: 'quem',
    title: 'Quem trata os dados',
    lines: [
      'Stefan Heinz Screpka, pessoa física, Ponta Grossa, Paraná. Sou o único controlador e a única pessoa que lê o que você envia.',
      'Base legal: execução de contato a seu pedido (LGPD art. 7º, V) e legítimo interesse pras métricas anônimas e pros logs de erro (art. 7º, IX).',
    ],
  },
  {
    id: 'com-quem',
    title: 'Por onde os dados passam',
    lines: [
      'Resend entrega o email de confirmação pra você e a notificação pra mim; guarda nome, email e mensagem sob a política deles.',
      'Vercel hospeda o site e roda a detecção de bot (BotID) na requisição do formulário. Não persiste o conteúdo.',
      'Vercel Analytics e Speed Insights medem navegação sem cookie e sem identificador pessoal. Sem Google Analytics, sem pixel.',
      'Sentry registra erros técnicos. O Session Replay roda em 1% das sessões com todo texto mascarado e mídia bloqueada.',
    ],
  },
  {
    id: 'quanto-tempo',
    title: 'Por quanto tempo',
    lines: [
      'Mensagens do formulário: 12 meses após o último contato, na minha caixa e no Resend.',
      'Métricas anônimas: janela móvel de 30 dias. Logs e replays do Sentry: 90 dias.',
      'Cookies: nenhum de identificação ou marketing. Por isso não há banner. A única preferência lida é a de movimento reduzido, do seu sistema.',
    ],
  },
  {
    id: 'direitos',
    title: 'O que você pode pedir (LGPD art. 18)',
    lines: [
      'Acesso, correção, exclusão, portabilidade e oposição. Mande um email com “LGPD” no assunto; respondo em até 12 horas em dias úteis.',
      'Exclusão sai em até 24 horas. Acesso e portabilidade em até 7 dias, em JSON ou texto.',
      'Mudanças relevantes entram nesta página, com a data da atualização no topo.',
    ],
  },
];

export default function PrivacidadePage() {
  return (
    <div className="container-narrow section-pad-y-lg pt-32 sm:pt-40">
      <header className="mb-14 flex flex-col gap-4 sm:mb-16">
        <p className="eyebrow">PRIVACIDADE · LGPD</p>
        <h1
          className={cn(
            'headline-display text-(--color-text-1)',
            'text-4xl sm:text-5xl lg:text-6xl',
            '!tracking-tight !leading-[1.02] text-balance'
          )}
        >
          O que coleto, por quê,
          <br />e como você apaga.
        </h1>
        <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
          Atualizado em {LAST_UPDATED}
        </p>
      </header>

      {/* Em cinco linhas: tudo que importa cabe aqui. */}
      <section
        aria-labelledby="privacidade-resumo"
        className="mb-14 rounded-2xl border border-(--color-hairline) bg-(--color-surface) p-6 shadow-(--shadow-inset-bisel) sm:mb-16 sm:p-8"
      >
        <h2
          id="privacidade-resumo"
          className="mb-5 font-mono text-2xs uppercase tracking-widest text-(--color-accent)"
        >
          Em cinco linhas
        </h2>
        <ol className="flex flex-col gap-3">
          {IN_SHORT.map((line, i) => (
            <li key={line} className="flex gap-4 text-base leading-relaxed text-(--color-text-1)">
              <span className="w-5 shrink-0 font-mono text-xs tabular-nums text-(--color-text-3) pt-1.5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ol>
      </section>

      <article className="flex flex-col gap-12 sm:gap-14">
        {BLOCKS.map((block) => (
          <section
            key={block.id}
            id={block.id}
            className="grid gap-4 border-t border-(--color-hairline) pt-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-10"
          >
            <h2 className="text-xl font-semibold !leading-[1.15] !tracking-tight text-(--color-text-1) sm:text-2xl">
              {block.title}
            </h2>
            <div className="flex flex-col gap-3 text-base leading-relaxed text-(--color-text-2)">
              {block.lines.map((line) => (
                <p key={line.slice(0, 40)}>{line}</p>
              ))}
            </div>
          </section>
        ))}
      </article>

      <div className="mt-16 flex flex-col gap-4 border-t border-(--color-hairline) pt-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-base leading-relaxed text-(--color-text-2)">
          Qualquer pedido:{' '}
          <a
            href="mailto:stefanheinz2006@gmail.com?subject=LGPD"
            className="text-(--color-accent) underline underline-offset-4 decoration-(--color-accent)/50 transition-[text-decoration-color] hover:decoration-(--color-accent)"
          >
            stefanheinz2006@gmail.com
          </a>{' '}
          com “LGPD” no assunto.
        </p>
        <Link
          href="/#contato"
          className={cn(
            'inline-flex shrink-0 items-center gap-2 rounded-pill',
            'border border-(--color-hairline-strong) bg-transparent px-6 py-3',
            'font-mono text-sm text-(--color-text-1)',
            'outline-none transition-colors duration-(--motion-fast) ease-(--ease-standard)',
            'hover:border-(--color-accent) hover:text-(--color-accent)',
            'focus-visible:border-(--color-accent) focus-visible:text-(--color-accent)'
          )}
        >
          Voltar pro contato
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
