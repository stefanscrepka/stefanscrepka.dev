import Link from 'next/link';
import { PartnerMarquee } from '@/components/hero/partner-marquee';
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
  'PP Editorial New (FFPU)',
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
      className="relative border-t border-(--color-hairline) bg-(--color-base) py-14 mt-16"
    >
      {/* Lime hairline divisor — sinaliza fim do conteúdo */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent 0%, var(--color-accent) 50%, transparent 100%)',
          opacity: 0.4,
        }}
      />

      <div className="container-max flex flex-col gap-10">
        {/* Brand row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
          <div className="flex items-center gap-4">
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

          {/* Mapa Ponta Grossa mini SVG — silhouette geográfica */}
          <PontaGrossaBadge />
        </div>

        {/* Partner marquee REUSE do Hero — fecha loop conceitual (Lando-style) */}
        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
          <PartnerMarquee />
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

        {/* Sign-off — assinatura editorial echoing Hero headline (loop conceitual) */}
        <p
          className="mt-2 text-center text-base sm:text-lg"
          style={{
            fontFamily: 'var(--font-editorial)',
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'oklch(94% 0.22 124 / 0.6)',
            letterSpacing: '-0.01em',
          }}
        >
          Construo IA multi-agente em produção.
        </p>
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

function PontaGrossaBadge() {
  return (
    <div
      aria-hidden="true"
      className="inline-flex items-center gap-2.5 rounded-md border border-(--color-hairline-strong) bg-(--color-surface) px-3 py-2"
    >
      <svg
        viewBox="0 0 32 24"
        width="32"
        height="24"
        className="text-(--color-accent)"
        aria-hidden="true"
        focusable="false"
      >
        <title>Ponta Grossa silhouette</title>
        {/* Stylized PR (Paraná) outline + dot for PG */}
        <path
          d="M2 6 8 3l5 4 7-2 6 5-3 6-5 3-8-2-6-3Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
          opacity="0.5"
        />
        <circle cx="12" cy="11" r="2" fill="currentColor" />
        <circle
          cx="12"
          cy="11"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.4"
        />
      </svg>
      <div className="flex flex-col gap-0">
        <span className="font-mono text-[10px] uppercase tracking-widest text-(--color-text-3)">
          BASED IN
        </span>
        <span className="font-mono text-xs text-(--color-text-1)">Ponta Grossa, PR</span>
      </div>
    </div>
  );
}
