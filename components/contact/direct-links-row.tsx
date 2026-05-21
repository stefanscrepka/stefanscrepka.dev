'use client';

import { useCalModal } from '@/lib/contact/cal-modal-context';
import { cn } from '@/lib/utils';

// 4 cards minimal em linha (WhatsApp · Email · LinkedIn · GitHub) — versão
// horizontal e enxuta pra usar abaixo do form na seção Contact cinematic.
// Cada card: ícone mono + label + dado em mono, hover lift + lime border.
// Cal.com trigger fica em row separada abaixo (ghost button + microcopy).

interface DirectLinkItem {
  label: string;
  detail: string;
  href: string;
  external?: boolean;
  icon: React.ReactNode;
}

const ICON_STROKE = 'currentColor';

const LINKS: DirectLinkItem[] = [
  {
    label: 'WhatsApp',
    detail: '(42) 99859-2522',
    href: 'https://wa.me/5542998592522',
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true" focusable="false">
        <path
          d="M20.5 3.5A11 11 0 0 0 3.6 17.4L2.5 21.5l4.2-1.1A11 11 0 1 0 20.5 3.5Z"
          stroke={ICON_STROKE}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 8.2c.2-.5.5-.5.7-.5h.5c.2 0 .4 0 .6.5l.7 1.7c.1.3.1.6-.1.8l-.4.5c-.2.2-.3.5 0 .8.5.9 1.4 2 2.4 2.4.3.2.6.1.8 0l.5-.4c.2-.2.5-.2.8-.1l1.7.7c.5.2.5.4.5.6v.5c0 .2 0 .5-.5.7-.6.2-1.7.4-2.7-.2-1.4-.7-2.9-2-3.9-3-.9-1-2.3-2.5-3-3.9-.6-1-.4-2.1-.2-2.7Z"
          fill={ICON_STROKE}
        />
      </svg>
    ),
  },
  {
    label: 'Email',
    detail: 'stefanheinz2006@gmail.com',
    href: 'mailto:stefanheinz2006@gmail.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true" focusable="false">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke={ICON_STROKE} strokeWidth="1.4" />
        <path d="m3 7 9 6 9-6" stroke={ICON_STROKE} strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    detail: '/in/stefan-heinz-screpka',
    href: 'https://www.linkedin.com/in/stefan-heinz-screpka-323ab9242/',
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke={ICON_STROKE} strokeWidth="1.4" />
        <circle cx="8" cy="8.5" r="1.1" fill={ICON_STROKE} />
        <path
          d="M7.5 10.5h1.2v7H7.5zM11 10.5h1.2v1c.3-.5 1-1.2 2.2-1.2 2 0 2.3 1.4 2.3 3v4.2H15.5v-3.8c0-.9-.2-1.6-1.1-1.6s-1.2.7-1.2 1.6v3.8H11v-7Z"
          fill={ICON_STROKE}
        />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    detail: '/stefanscrepka',
    href: 'https://github.com/stefanscrepka',
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true" focusable="false">
        <path
          d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.4-1-1.1-1.3-1.1-1.3-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5a4 4 0 0 1 1-2.7c-.1-.3-.5-1.3.1-2.8 0 0 .8-.3 2.7 1a9.5 9.5 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .6 1.5.2 2.5.1 2.8a4 4 0 0 1 1 2.7c0 3.9-2.4 4.8-4.6 5 .4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"
          stroke={ICON_STROKE}
          strokeWidth="1.2"
          fill="none"
        />
      </svg>
    ),
  },
];

export function DirectLinksRow() {
  const { open: calOpen, openModal } = useCalModal();

  return (
    <div data-slot="direct-links-row" className="flex flex-col gap-8 sm:gap-10">
      {/* 4 cards minimal hairline — grid 2x2 mobile, 4x1 desktop.
          Hover lift -2px + border lime + icon vira lime. */}
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {LINKS.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer' : undefined}
              className={cn(
                'group/link flex h-full flex-col gap-3 rounded-xl px-4 py-4 sm:px-5 sm:py-5',
                'border border-(--color-hairline) bg-(--color-surface)/40',
                'shadow-(--shadow-inset-bisel)',
                'outline-none transition-[border-color,background-color,transform,box-shadow]',
                'duration-(--motion-fast) ease-(--ease-standard)',
                'hover:-translate-y-0.5 hover:border-(--color-accent) hover:bg-(--color-accent-subtle)',
                'hover:shadow-(--shadow-glow-lime-sm)',
                'focus-visible:-translate-y-0.5 focus-visible:border-(--color-accent)',
                'focus-visible:bg-(--color-accent-subtle)'
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'inline-flex size-9 items-center justify-center rounded-md',
                  'border border-(--color-hairline-strong) bg-(--color-base)',
                  'text-(--color-text-2) transition-colors duration-(--motion-fast)',
                  'group-hover/link:border-(--color-accent) group-hover/link:text-(--color-accent)',
                  'group-focus-visible/link:border-(--color-accent) group-focus-visible/link:text-(--color-accent)'
                )}
              >
                {item.icon}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-(--color-text-1)">{item.label}</span>
                <span className="font-mono text-2xs tracking-tight text-(--color-text-3) leading-relaxed break-all">
                  {item.detail}
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>

      {/* Cal.com trigger — ghost minimal abaixo dos cards.
          NUNCA link externo per HANDOFF §97: modal embedded always. */}
      <div className="flex flex-col gap-3 border-t border-(--color-hairline) pt-7 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex flex-col gap-1">
          <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
            Prefere agendar direto?
          </p>
          <p className="text-sm leading-relaxed text-(--color-text-2)">
            15 minutos · modal embedded · sem ida-e-volta de email pra marcar horário.
          </p>
        </div>
        <button
          type="button"
          onClick={openModal}
          className={cn(
            'group/cal inline-flex shrink-0 items-center justify-center gap-2 rounded-pill',
            'border border-(--color-accent) bg-transparent px-6 py-3',
            'font-mono text-sm font-semibold text-(--color-accent)',
            'outline-none transition-[background-color,box-shadow,transform]',
            'duration-(--motion-fast) ease-(--ease-standard)',
            'hover:-translate-y-0.5 hover:bg-(--color-accent-subtle)',
            'hover:shadow-(--shadow-glow-lime-sm)',
            'focus-visible:bg-(--color-accent-subtle) focus-visible:shadow-(--shadow-glow-lime-sm)'
          )}
          aria-haspopup="dialog"
          aria-expanded={calOpen}
        >
          <span>Cal.com 15min</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="size-4 transition-transform duration-(--motion-fast) group-hover/cal:translate-x-0.5"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M5 12h14m-6-6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
