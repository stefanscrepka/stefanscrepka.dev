import Link from 'next/link';
import { AnchorLink } from '@/components/shared/anchor-link';
import { SHMonogram } from '@/components/shared/sh-monogram';
import { cn } from '@/lib/utils';
import { FooterBreathingHairline, FooterClosing, FooterRevealSpacer } from './footer.client';
import { FooterAboutButton } from './footer-about-button.client';
import { FooterClock } from './footer-clock.client';

// Footer — F7 (2026-09-04), a partir do acervo (Referencias-logo/acervo/saida,
// necessidade "rodape"): o que ficou de cada referência e o que não entrou.
//
//   hyperiux/parallax-footer — o rodapé fixo atrás da página, revelado pelo
//     conteúdo que sobe. É o "último beat" que o site não tinha: a página
//     termina de rolar e o rodapé já está lá, parado. Entrou (md+).
//   21st/ember-footer-cta — uma frase grande e UMA ação, acima das colunas.
//     Entrou: a frase peak-end do manifesto vira o fecho, com "Falar comigo"
//     ao lado. O gradiente pixelado deles não entrou (brand book §17).
//   smoothui/footer-1 — colunas curtas com rótulo mono e o bloco da marca à
//     esquerda. Entrou a estrutura; as quatro colunas viraram três.
//   watermelon/footer — newsletter. Não entrou: não existe newsletter.
//
// Estrutura:
//   ROW 1: fecho (frase) · ação (Falar comigo → / WhatsApp)
//   ROW 2: marca + lugar/hora/status · Navegação · Conexão direta
//   ROW 3: © · Sobre este site · Privacidade · GitHub source

const NAV_LINKS = [
  { label: 'Work', href: '/#work' },
  { label: 'Process', href: '/process' },
  { label: 'Manifesto', href: '/#manifesto' },
  { label: 'Contato', href: '/#contato' },
] as const;

const SOCIAL_LINKS = [
  { label: 'WhatsApp', href: 'https://wa.me/5542998592522' },
  { label: 'Email', href: 'mailto:stefanheinz2006@gmail.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/stefan-heinz-screpka-323ab9242/' },
  { label: 'GitHub', href: 'https://github.com/stefanscrepka' },
] as const;

const linkClass = cn(
  'inline-flex items-center gap-1.5 py-2 sm:py-0 text-sm text-(--color-text-2)',
  'transition-colors duration-(--motion-fast) ease-(--ease-standard)',
  'hover:text-(--color-accent) focus-visible:text-(--color-accent)'
);

const metaLinkClass = cn(
  'inline-flex items-center gap-1 py-2 sm:-my-2 transition-colors',
  'duration-(--motion-fast) ease-(--ease-standard)',
  'hover:text-(--color-accent) focus-visible:text-(--color-accent)'
);

export function Footer() {
  return (
    <>
      <FooterRevealSpacer />
      <footer
        data-slot="footer"
        className={cn(
          'relative isolate bg-(--color-surface-deep)',
          'border-t border-(--color-hairline)',
          // md+: fixo atrás do <main> (que tem z-10 e fundo opaco); o
          // espaçador acima reserva a altura no fluxo.
          'md:fixed md:inset-x-0 md:bottom-0 md:z-0',
          'pt-14 pb-[max(3.5rem,calc(3.5rem+env(safe-area-inset-bottom)))] sm:pt-16 sm:pb-[max(4rem,calc(4rem+env(safe-area-inset-bottom)))]',
          'pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]'
        )}
      >
        <FooterBreathingHairline />

        <div className="container-max flex flex-col gap-10 sm:gap-12">
          {/* ROW 1 — fecho + ação */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
            <div className="flex flex-col gap-4">
              <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
                Última linha
              </p>
              <FooterClosing />
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <AnchorLink
                href="/#contato"
                className={cn(
                  'inline-flex items-center gap-2 rounded-pill bg-(--color-accent) px-5 py-3',
                  'font-mono text-sm font-medium text-(--color-bg)',
                  'transition-[transform,background-color] duration-(--motion-fast) ease-(--ease-standard)',
                  'hover:-translate-y-[1px] hover:bg-(--color-accent-hover) focus-visible:-translate-y-[1px]'
                )}
              >
                Falar comigo
                <span aria-hidden="true">→</span>
              </AnchorLink>
              <a
                href="https://wa.me/5542998592522"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  'inline-flex items-center gap-2 rounded-pill border border-(--color-hairline-strong) px-5 py-3',
                  'font-mono text-sm text-(--color-text-1)',
                  'transition-colors duration-(--motion-fast) ease-(--ease-standard)',
                  'hover:border-(--color-accent) hover:text-(--color-accent) focus-visible:border-(--color-accent)'
                )}
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* ROW 2 — marca · navegação · conexão */}
          <div className="grid gap-8 border-t border-(--color-hairline) pt-8 sm:grid-cols-3 sm:gap-10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-(--color-accent)" aria-hidden="true">
                  <SHMonogram size={28} />
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-(--color-text-3)">
                  stefanscrepka.dev
                </span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-(--color-text-2)">
                IA multi-agente em produção, e o produto inteiro ao redor dela.
              </p>
              {/* F8: coordenada + hora, o carimbo de fim de página (acervo:
                  refero/dope.security "coordinate footer"). */}
              <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
                25.09° S · 50.16° W{' '}
                <span aria-hidden="true" className="mx-1 text-(--color-hairline-strong)">
                  ·
                </span>
                Ponta Grossa, Paraná{' '}
                <span aria-hidden="true" className="mx-1 text-(--color-hairline-strong)">
                  ·
                </span>
                <FooterClock />{' '}
                <span aria-hidden="true" className="mx-1 text-(--color-hairline-strong)">
                  ·
                </span>
                <span className="text-(--color-accent)">disponível</span>
              </p>
            </div>

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

          {/* ROW 3 — meta */}
          <div className="flex flex-col gap-4 border-t border-(--color-hairline) pt-6 font-mono text-2xs tracking-wide text-(--color-text-3) sm:flex-row sm:items-center sm:justify-between">
            <p className="uppercase tracking-widest">© 2026 Stefan Heinz Screpka</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <FooterAboutButton />
              <Link href="/privacidade" className={metaLinkClass}>
                Privacidade →
              </Link>
              <a
                href="https://github.com/stefanscrepka/stefanscrepka-dev"
                target="_blank"
                rel="noreferrer"
                className={metaLinkClass}
              >
                GitHub source →
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
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
