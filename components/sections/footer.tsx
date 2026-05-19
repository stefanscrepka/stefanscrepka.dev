import Link from 'next/link';
import { AnchorLink } from '@/components/shared/anchor-link';
import { SHMonogram } from '@/components/shared/sh-monogram';
import { cn } from '@/lib/utils';

// RSC footer — 3-col + brand row + copyright row. Anchor smooth-scroll via AnchorLink islands.

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Manifesto', href: '#manifesto' },
  { label: 'Contato', href: '#contato' },
] as const;

const CONTACT_LINKS = [
  { label: 'WhatsApp', href: 'https://wa.me/5542998592522', external: true },
  { label: 'Cal.com 15min', href: '#contato', external: false },
  { label: 'stefanheinz2006@gmail.com', href: 'mailto:stefanheinz2006@gmail.com', external: true },
] as const;

const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/stefan-heinz-screpka-323ab9242/' },
  { label: 'GitHub', href: 'https://github.com/stefanscrepka' },
] as const;

const STACK_CREDITS = [
  'Next 16 · React 19',
  'Tailwind v4 · Geist',
  'PP Editorial New',
  'r3f + drei · GSAP · Lenis',
  'Shiki SSR · Sentry · Vercel',
];

const linkClass = cn(
  'inline-flex items-center gap-1.5 text-sm text-(--color-text-2) outline-none',
  'transition-colors hover:text-(--color-accent) focus-visible:text-(--color-accent)'
);

export function Footer() {
  return (
    <footer
      data-slot="footer"
      className="border-t border-(--color-hairline) bg-(--color-base) py-16 mt-32"
    >
      <div className="container-max flex flex-col gap-12">
        {/* Brand row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <span className="text-(--color-accent)" aria-hidden="true">
            <SHMonogram size={40} />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold text-(--color-text-1)">Stefan Heinz Screpka</p>
            <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-3)">
              AI Product Engineer · stefanscrepka.dev
            </p>
          </div>
        </div>

        {/* 3-col grid */}
        <div className="grid gap-10 sm:grid-cols-3">
          <FooterColumn title="Navegação">
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <AnchorLink href={item.href} className={linkClass}>
                    {item.label}
                  </AnchorLink>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Contato">
            <ul className="flex flex-col gap-2">
              {CONTACT_LINKS.map((item) =>
                item.external ? (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                      className={linkClass}
                    >
                      {item.label}
                    </a>
                  </li>
                ) : (
                  <li key={item.label}>
                    <AnchorLink href={item.href} className={linkClass}>
                      {item.label}
                    </AnchorLink>
                  </li>
                )
              )}
            </ul>
          </FooterColumn>

          <FooterColumn title="Créditos técnicos">
            <ul className="flex flex-col gap-1.5 font-mono text-xs text-(--color-text-3) leading-relaxed">
              {STACK_CREDITS.map((row) => (
                <li key={row}>{row}</li>
              ))}
            </ul>
          </FooterColumn>
        </div>

        {/* Social row */}
        <div className="flex flex-wrap items-center gap-3 hairline-top pt-8">
          {SOCIAL_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className={cn(
                'inline-flex items-center gap-2 rounded-md border border-(--color-hairline) px-3 py-1.5 text-xs font-mono',
                'text-(--color-text-2) outline-none transition-colors',
                'hover:border-(--color-accent) hover:text-(--color-accent)',
                'focus-visible:border-(--color-accent) focus-visible:text-(--color-accent)'
              )}
            >
              {item.label}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="size-3"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M7 17L17 7M9 7h8v8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ))}
          <span className="font-mono text-xs text-(--color-text-3)" aria-hidden="true">
            · disponível pra projetos
          </span>
        </div>

        {/* Copyright row */}
        <div className="flex flex-col justify-between gap-3 font-mono text-[11px] tracking-wide text-(--color-text-3) sm:flex-row sm:items-center">
          <p>© 2026 · Construído em Ponta Grossa, PR</p>
          <Link
            href="#about-this-site"
            className={cn(
              'inline-flex items-center gap-1 outline-none transition-colors',
              'hover:text-(--color-accent) focus-visible:text-(--color-accent)'
            )}
          >
            Sobre este site →
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-[11px] uppercase tracking-widest text-(--color-text-3)">
        {title}
      </p>
      {children}
    </div>
  );
}
