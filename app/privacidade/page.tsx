import type { Metadata } from 'next';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// /privacidade — Política de privacidade enxuta, LGPD-compliant.
// W1.6 (2026-05-23): exigência identificada nas auditorias. Tom manifesto-fiel:
// linguagem direta, sem template legal genérico. Lista o que coletamos, por
// que, por quanto tempo, e como exercer direitos do Art. 18 da LGPD.

export const metadata: Metadata = {
  title: 'Privacidade — política de dados',
  description:
    'Quais dados coletamos pelo formulário de contato, por quanto tempo guardamos, com quem compartilhamos e como você exerce seus direitos da LGPD.',
  openGraph: {
    title: 'Política de privacidade · Stefan Heinz Screpka',
    description:
      'LGPD-compliant. Quais dados coletamos via form de contato, retenção, processadores e como você exerce direitos.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/privacidade' },
};

const LAST_UPDATED = '23 de maio de 2026';

interface Section {
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

const SECTIONS: Section[] = [
  {
    id: 'controlador',
    eyebrow: 'Quem',
    title: 'Controlador dos dados',
    paragraphs: [
      'Stefan Heinz Screpka, pessoa física, Ponta Grossa — Paraná. Eu sou o controlador único. Sem time, sem terceirização de processamento dos seus dados — só eu leio o que você envia.',
    ],
  },
  {
    id: 'coleta',
    eyebrow: 'O quê',
    title: 'O que coleto e por quê',
    paragraphs: [
      'No formulário de contato em /#contato você fornece: nome, email, canal preferido (WhatsApp · email · Cal.com) e a mensagem. Só isso. Sem campos opcionais escondidos, sem retargeting pixel.',
      'Uso esses dados pra responder você sobre seu projeto. Fim. Não vendo, não compartilho com lista de prospect, não treino modelo com sua mensagem.',
    ],
  },
  {
    id: 'processadores',
    eyebrow: 'Com quem',
    title: 'Processadores que tocam seus dados',
    paragraphs: [
      'Três serviços técnicos veem trechos do seu dado em algum momento. Nenhum vê a totalidade fora do necessário.',
    ],
    bullets: [
      'Resend (envio de email): recebe nome, email, mensagem pra entregar o auto-reply e me notificar. Dados armazenados pelo Resend conforme política deles (criptografia em trânsito + repouso).',
      'Vercel (hosting): processa a request HTTPS do form. Não persiste o conteúdo da mensagem.',
      'Vercel Analytics + Speed Insights: métricas anônimas de navegação (sem PII, sem cookie de identificação). Sem GA, sem Meta Pixel.',
      'Sentry (logs de erro): se algo quebra no server, captura stack trace técnico. Não logo conteúdo de mensagem.',
    ],
  },
  {
    id: 'retencao',
    eyebrow: 'Quando',
    title: 'Por quanto tempo guardo',
    paragraphs: [
      'Mensagens via form: 12 meses após o último contato. Depois disso, deleto da minha inbox e do Resend.',
      'Métricas anônimas (Vercel Analytics): 30 dias rolling window. Não há perfil persistente.',
      'Logs Sentry: 90 dias. Quase nunca contém PII — só payload técnico.',
    ],
  },
  {
    id: 'direitos',
    eyebrow: 'Seus direitos (LGPD Art. 18)',
    title: 'O que você pode pedir',
    paragraphs: [
      'A LGPD te garante acesso, correção, exclusão, portabilidade e oposição ao tratamento. Pra exercer qualquer um, manda email pra stefanheinz2006@gmail.com com "LGPD" no assunto. Respondo em ≤12h em dias úteis.',
    ],
    bullets: [
      'Acesso — peço retorno em ≤7 dias com tudo que tenho sobre você',
      'Correção — atualizo dado errado na mesma hora que confirmo identidade',
      'Exclusão — apago seu registro do Resend e da minha inbox em ≤24h',
      'Portabilidade — exporto em formato legível (JSON ou texto)',
      'Oposição — paro de processar (se nunca contratamos serviço, é só não responder)',
    ],
  },
  {
    id: 'cookies',
    eyebrow: 'Cookies',
    title: 'O que rola no seu browser',
    paragraphs: [
      'Esse site não usa cookie de identificação nem de marketing. Vercel Analytics roda sem cookie (usa hash anônimo de sessão). Você não precisa aceitar nada — não tem banner porque não tem o que aceitar.',
      'Único dado persistido localmente: preferência de prefers-reduced-motion (lida do seu sistema, não armazenada).',
    ],
  },
  {
    id: 'atualizacoes',
    eyebrow: 'Quando muda',
    title: 'Atualizações desta política',
    paragraphs: [
      `Atualizado em ${LAST_UPDATED}. Mudanças materiais (novos processadores, retenção maior) ganham aviso visível no /#contato por 30 dias antes de entrar em vigor.`,
    ],
  },
];

export default function PrivacidadePage() {
  return (
    <main className="container-narrow section-pad-y-lg pt-32 sm:pt-40">
      {/* Header editorial */}
      <header className="mb-20 flex flex-col gap-4 sm:mb-24">
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
        <p className="mt-3 max-w-prose text-reading text-(--color-text-2)">
          Sem letrinha miúda. Sem template legal copiado. Aqui está exatamente quais dados passam
          por mim, com quem compartilho, por quanto tempo guardo e o que você pode exigir a qualquer
          momento.
        </p>
        <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
          Atualizado em {LAST_UPDATED}
        </p>
      </header>

      <article className="flex flex-col gap-16 sm:gap-20">
        {SECTIONS.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="flex flex-col gap-4 border-l border-(--color-hairline) pl-6 sm:pl-8"
          >
            <p className="font-mono text-2xs uppercase tracking-widest text-(--color-accent)">
              {section.eyebrow}
            </p>
            <h2
              className={cn(
                'font-semibold text-(--color-text-1)',
                'text-2xl sm:text-3xl',
                '!tracking-tight !leading-[1.1]'
              )}
            >
              {section.title}
            </h2>
            <div className="flex flex-col gap-5 text-reading text-(--color-text-2)">
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
            {section.bullets ? (
              <ul className="flex flex-col gap-3 pt-2 text-base leading-relaxed text-(--color-text-2)">
                {section.bullets.map((b) => (
                  <li key={b.slice(0, 32)} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[9px] block h-1 w-1 shrink-0 rounded-full bg-(--color-accent)"
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </article>

      {/* Footer CTA */}
      <div className="mt-24 flex flex-col gap-4 border-t border-(--color-hairline) pt-12 sm:mt-28 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
            Dúvida específica?
          </p>
          <p className="text-base leading-relaxed text-(--color-text-2)">
            Email com "LGPD" no assunto pra{' '}
            <a
              href="mailto:stefanheinz2006@gmail.com?subject=LGPD"
              className="text-(--color-accent) underline-offset-4 hover:underline"
            >
              stefanheinz2006@gmail.com
            </a>
          </p>
        </div>
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
    </main>
  );
}
