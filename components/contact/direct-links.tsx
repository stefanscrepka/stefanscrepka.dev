'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CalcomModal } from './calcom-modal';

// Bloco direito da Seção 12: 4 links diretos + trigger Cal.com modal.
// WhatsApp puro aqui (sem text pré-preenchido — esse é EXCLUSIVO da
// Estética MD per HANDOFF §76-78).

interface DirectLinkItem {
  label: string;
  detail: string;
  href: string;
  external?: boolean;
}

const LINKS: DirectLinkItem[] = [
  {
    label: 'WhatsApp',
    detail: '(42) 99859-2522',
    href: 'https://wa.me/5542998592522',
    external: true,
  },
  {
    label: 'Email',
    detail: 'stefanheinz2006@gmail.com',
    href: 'mailto:stefanheinz2006@gmail.com',
  },
  {
    label: 'LinkedIn',
    detail: '/in/stefan-heinz-screpka',
    href: 'https://www.linkedin.com/in/stefan-heinz-screpka-323ab9242/',
    external: true,
  },
  {
    label: 'GitHub',
    detail: '/stefanscrepka',
    href: 'https://github.com/stefanscrepka',
    external: true,
  },
];

export function DirectLinks() {
  const [calOpen, setCalOpen] = useState(false);

  return (
    <aside
      data-slot="direct-links"
      className={cn(
        'flex flex-col gap-6 rounded-2xl border border-(--color-hairline)',
        'bg-(--color-surface) p-6 sm:p-7'
      )}
    >
      <header className="flex items-start gap-4">
        {/* Avatar fallback SVG — quando Stefan entregar foto, troca por <Image> */}
        <div
          aria-hidden="true"
          className={cn(
            'relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-full',
            'border border-(--color-accent) bg-(--color-surface-elevated)'
          )}
          style={{ boxShadow: '0 0 24px var(--color-accent-glow)' }}
        >
          <svg viewBox="0 0 48 48" className="size-9 text-(--color-accent)" aria-hidden="true">
            <title>Stefan Heinz Screpka</title>
            <text
              x="24"
              y="30"
              textAnchor="middle"
              fontSize="20"
              fontFamily="var(--font-display)"
              fontWeight="700"
              letterSpacing="-0.04em"
              fill="currentColor"
            >
              S/H
            </text>
          </svg>
          {/* Live dot */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-(--color-surface)"
            style={{
              background: 'var(--color-success)',
              boxShadow: '0 0 8px var(--color-success)',
            }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="eyebrow">CANAIS DIRETOS</p>
          <h3 className="text-lg font-semibold tracking-tight text-(--color-text-1)">
            Prefere falar agora?
          </h3>
          <p className="font-mono text-[11px] text-(--color-text-3)">Online · Ponta Grossa, PR</p>
        </div>
      </header>

      <ul className="flex flex-col gap-3">
        {LINKS.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer' : undefined}
              className={cn(
                'group/link flex items-center justify-between gap-4 rounded-md',
                'border border-(--color-hairline-strong) bg-(--color-base) px-4 py-3',
                'outline-none transition-[border-color,background-color,transform]',
                'duration-(--motion-fast) ease-(--ease-standard)',
                'hover:-translate-y-0.5 hover:border-(--color-accent) hover:bg-(--color-accent-subtle)',
                'focus-visible:border-(--color-accent) focus-visible:bg-(--color-accent-subtle)'
              )}
            >
              <div className="flex flex-col gap-0">
                <span className="text-sm font-semibold text-(--color-text-1)">{item.label}</span>
                <span className="font-mono text-[11px] text-(--color-text-3)">{item.detail}</span>
              </div>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="size-4 shrink-0 text-(--color-text-3) transition-colors group-hover/link:text-(--color-accent)"
                aria-hidden="true"
                focusable="false"
              >
                <title>abrir</title>
                <path
                  d="M5 12h14m-6-6 6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3 border-t border-(--color-hairline) pt-5">
        <p className="font-mono text-[11px] uppercase tracking-widest text-(--color-text-3)">
          Ou agendar direto
        </p>
        <button
          type="button"
          onClick={() => setCalOpen(true)}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-md',
            'border border-(--color-accent) bg-transparent px-5 py-2.5',
            'font-mono text-sm font-semibold text-(--color-accent)',
            'outline-none transition-[background-color,box-shadow]',
            'duration-(--motion-fast) ease-(--ease-standard)',
            'hover:bg-(--color-accent-subtle) hover:shadow-(--shadow-glow-lime-sm)',
            'focus-visible:bg-(--color-accent-subtle) focus-visible:shadow-(--shadow-glow-lime-sm)'
          )}
          aria-haspopup="dialog"
          aria-expanded={calOpen}
        >
          Cal.com 15min →
        </button>
        <p className="font-mono text-[11px] text-(--color-text-3) leading-relaxed">
          Modal embedded · sem ida-e-volta de email pra marcar horário.
        </p>
      </div>

      <CalcomModal open={calOpen} onOpenChange={setCalOpen} />
    </aside>
  );
}
