import Link from 'next/link';
import { AnchorLink } from '@/components/shared/anchor-link';
import { SHMonogram } from '@/components/shared/sh-monogram';
import { cn } from '@/lib/utils';

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

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Manifesto', href: '#manifesto' },
  { label: 'Contato', href: '#contato' },
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

const linkClass = cn(
  'inline-flex items-center gap-1.5 text-sm text-(--color-text-2) outline-none',
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
        'pt-16 pb-20 sm:pt-20 sm:pb-24'
      )}
    >
      {/* Lime hairline divisor — sinaliza fim do conteúdo (gradient fade nas pontas) */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent 0%, var(--color-accent) 50%, transparent 100%)',
          opacity: 0.4,
        }}
      />

      <div className="container-max flex flex-col gap-12 sm:gap-14">
        {/* ROW 1 — 3 colunas (Brand · Nav · Conexão) */}
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
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
              <span aria-hidden="true" className="mx-1 text-(--color-text-3)/60">
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
                      className="size-3 shrink-0 text-(--color-text-3)/70"
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

        {/* ROW 2 — Copyright row (hairline top, font-mono small) */}
        <div className="flex flex-col gap-4 border-t border-(--color-hairline) pt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="font-mono text-2xs tracking-wide text-(--color-text-3)">
            © 2026 Stefan Heinz Screpka{' '}
            <span aria-hidden="true" className="mx-1 text-(--color-text-3)/60">
              ·
            </span>
            Construído em Ponta Grossa, PR
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-2xs tracking-wide text-(--color-text-3)">
            <Link
              href="#about-this-site"
              className={cn(
                'inline-flex items-center gap-1 outline-none transition-colors',
                'duration-(--motion-fast) ease-(--ease-standard)',
                'hover:text-(--color-accent) focus-visible:text-(--color-accent)'
              )}
            >
              About this site →
            </Link>
            <a
              href="https://github.com/stefanscrepka/stefanscrepka-dev"
              target="_blank"
              rel="noreferrer"
              className={cn(
                'inline-flex items-center gap-1 outline-none transition-colors',
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
