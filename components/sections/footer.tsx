import Link from 'next/link';
import { AnchorLink } from '@/components/shared/anchor-link';
import { SHMonogram } from '@/components/shared/sh-monogram';
import { cn } from '@/lib/utils';
import { FooterAboutButton } from './footer-about-button.client';

// Footer cinematic minimal — 3 colunas + bottom row.
// Background ligeiramente mais escuro que body (oklch -2% L) pra criar "shelf"
// visual sob o Contact. Lime hairline divisor top + generous bottom padding.
//
// Estrutura:
//   ROW 1 (3 col): Logo+frase · Navegação · Contato/redes
//   ROW 2 (hairline): © + city · About this site → · GitHub source →
//
// Anti-padrões evitados: sem "Made with ♥", sem newsletter fake, sem 6+ col,
// sem marquee redundante (já tem no Hero), sem sign-off competindo com Contact.

// W0.8 + W4.1 (2026-05-23): hrefs agora absolute (`/#work`) pra funcionar
// quando footer é montado em rotas internas (case studies, /privacidade etc).
// AnchorLink intercepta `#x` puro pra smooth scroll, então `/#work` cai pro
// fallback `<a href>` nativo que navega + dispara hash scroll.
const NAV_LINKS = [
  { label: 'Work', href: '/#work' },
  { label: 'Process', href: '/process' },
  { label: 'Manifesto', href: '/#manifesto' },
  { label: 'Contato', href: '/#contato' },
] as const;

const SOCIAL_LINKS = [
  { label: 'WhatsApp', href: 'https://wa.me/5542998592522', external: true },
  { label: 'Email', href: 'mailto:stefanheinz2006@gmail.com', external: true },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/stefan-heinz-screpka-323ab9242/',
    external: true,
  },
  { label: 'GitHub', href: 'https://github.com/stefanscrepka', external: true },
] as const;

// W-mob2 #11: py-2 mobile dá clickable area ~36px (sm:py-0 mantém visual desktop discreto).
const linkClass = cn(
  'inline-flex items-center gap-1.5 py-2 sm:py-0 text-sm text-(--color-text-2) outline-none',
  'transition-colors duration-(--motion-fast) ease-(--ease-standard)',
  'hover:text-(--color-accent) focus-visible:text-(--color-accent)'
);

export function Footer() {
  return (
    <footer
      data-slot="footer"
      className={cn(
        'relative isolate bg-(--color-surface-deep)',
        // Background deeper que body — token --color-surface-deep cria shelf sutil
        // sob Contact (-3% L vs --color-base).
        'border-t border-(--color-hairline)',
        'pt-16 pb-[max(5rem,calc(5rem+env(safe-area-inset-bottom)))] sm:pt-20 sm:pb-[max(6rem,calc(6rem+env(safe-area-inset-bottom)))]',
        'pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]'
      )}
    >
      {/* Lime hairline divisor — sinaliza fim do conteúdo (gradient fade nas pontas).
          W-motion #10: animação `hairline-breathe` 4s ease-in-out infinite oscila
          opacity 0.4 → 0.6. Awwwards 2025 trend em footers cinematográficos.
          Reduced-motion: bloco global em globals.css zera animation-duration. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px motion-safe:[animation:hairline-breathe_4s_ease-in-out_infinite]"
        style={{
          background:
            'linear-gradient(to right, transparent 0%, var(--color-accent) 50%, transparent 100%)',
          opacity: 0.4,
        }}
      />

      <div className="container-max flex flex-col gap-12 sm:gap-14">
        {/* ROW 1 — 3 colunas (Brand · Nav · Conexão).
            W-mob2 #6: gap-6 mobile (era gap-10) reduz spacing entre cols stacked. */}
        <div className="grid gap-6 sm:gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-(--color-accent)" aria-hidden="true">
                <SHMonogram size={32} />
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-(--color-text-3)">
                stefanscrepka.dev
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-(--color-text-2)">
              Construo IA multi-agente em produção — e o produto inteiro ao redor dela.
            </p>
            <p className="mt-1 font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
              Ponta Grossa, Paraná{' '}
              <span aria-hidden="true" className="mx-1 text-(--color-hairline-strong)">
                ·
              </span>
              <span className="text-(--color-accent)">disponível</span>
            </p>
          </div>

          {/* Col 2 — Navegação */}
          <FooterColumn title="Navegação">
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <AnchorLink href={item.href} className={linkClass}>
                    {item.label}
                  </AnchorLink>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* Col 3 — Direct conexão */}
          <FooterColumn title="Conexão direta">
            <ul className="flex flex-col gap-2.5">
              {SOCIAL_LINKS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                    className={linkClass}
                  >
                    {item.label}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="size-3 shrink-0 text-(--color-text-3)"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M7 17L17 7M9 7h8v8"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </FooterColumn>
        </div>

        {/* ROW 2 — Closing line memoravel (peak-end rule) + meta links.
            Copy autoral recursivo com manifesto pull-quote ("Software serio
            tem o mesmo padrao... funciona 24/7 ou alguem perde dinheiro").
            Substitui copyright generico anterior. */}
        <div className="flex flex-col gap-6 border-t border-(--color-hairline) pt-8 sm:gap-8">
          {/* Closing statement — frase autoral memoravel */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
            <p
              className="max-w-2xl text-base leading-snug text-(--color-text-1) sm:text-lg"
              style={{ letterSpacing: '-0.015em' }}
            >
              Se não funciona 24/7, não conta.{' '}
              <span className="text-(--color-text-3)">— stefan</span>{' '}
              <span aria-hidden="true" className="text-(--color-accent)">
                ✺
              </span>
            </p>
            <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3) shrink-0">
              ponta grossa · 2026
            </p>
          </div>

          {/* Meta row — meta links discretos. W1.6 (2026-05-23): adicionado
              link "Privacidade →" pro /privacidade, requisito LGPD.
              W-mob2 #11: py-2 mobile pra tap target ~36px. */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-2xs tracking-wide text-(--color-text-3)">
            <FooterAboutButton />
            <Link
              href="/privacidade"
              className={cn(
                'inline-flex items-center gap-1 py-2 sm:py-0 outline-none transition-colors',
                'duration-(--motion-fast) ease-(--ease-standard)',
                'hover:text-(--color-accent) focus-visible:text-(--color-accent)'
              )}
            >
              Privacidade →
            </Link>
            <a
              href="https://github.com/stefanscrepka/stefanscrepka-dev"
              target="_blank"
              rel="noreferrer"
              className={cn(
                'inline-flex items-center gap-1 py-2 sm:py-0 outline-none transition-colors',
                'duration-(--motion-fast) ease-(--ease-standard)',
                'hover:text-(--color-accent) focus-visible:text-(--color-accent)'
              )}
            >
              GitHub source →
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">{title}</p>
      {children}
    </div>
  );
}
