// Stylized brand marks — não são logos oficiais 1:1 (evita trademark issues
// + custom adequado ao design system lime/dark do site). Cada um é um glyph
// + wordmark Geist Mono. Renderizam todos no mesmo tamanho (size 28px default).

import { cn } from '@/lib/utils';

export type TechId =
  | 'vercel'
  | 'nextjs'
  | 'react'
  | 'tailwind'
  | 'anthropic'
  | 'postgres'
  | 'three'
  | 'gsap'
  | 'motion'
  | 'typescript'
  | 'redis'
  | 'stripe'
  | 'sentry'
  | 'supabase'
  | 'shiki'
  | 'drizzle'
  | 'whatsapp'
  | 'telegram';

interface TechLogoProps {
  id: TechId;
  size?: number;
  showLabel?: boolean;
  className?: string | undefined;
}

const LABELS: Record<TechId, string> = {
  vercel: 'Vercel',
  nextjs: 'Next.js',
  react: 'React',
  tailwind: 'Tailwind',
  anthropic: 'Claude SDK',
  postgres: 'Postgres',
  three: 'Three.js',
  gsap: 'GSAP',
  motion: 'Motion',
  typescript: 'TypeScript',
  redis: 'Redis',
  stripe: 'Stripe',
  sentry: 'Sentry',
  supabase: 'Supabase',
  shiki: 'Shiki',
  drizzle: 'Drizzle',
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
};

export function TechLogo({ id, size = 22, showLabel = true, className }: TechLogoProps) {
  return (
    <span
      data-slot="tech-logo"
      data-tech={id}
      className={cn(
        'inline-flex items-center gap-2 font-mono text-xs',
        'text-(--color-text-2)',
        className
      )}
    >
      <Glyph id={id} size={size} />
      {showLabel ? <span className="whitespace-nowrap">{LABELS[id]}</span> : null}
    </span>
  );
}

function Glyph({ id, size }: { id: TechId; size: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'aria-hidden': true,
    focusable: false,
    className: 'shrink-0 text-(--color-accent)',
  } as const;

  switch (id) {
    case 'vercel':
      return (
        <svg {...common}>
          <title>Vercel</title>
          <path d="M12 3 22 21 H2 Z" fill="currentColor" strokeWidth="0" />
        </svg>
      );
    case 'nextjs':
      return (
        <svg {...common}>
          <title>Next.js</title>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M7 7v10M7 7l10 10"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path d="M16 9v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'react':
      return (
        <svg {...common}>
          <title>React</title>
          <circle cx="12" cy="12" r="1.7" fill="currentColor" strokeWidth="0" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" strokeWidth="1.2" />
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.5"
            stroke="currentColor"
            strokeWidth="1.2"
            transform="rotate(60 12 12)"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.5"
            stroke="currentColor"
            strokeWidth="1.2"
            transform="rotate(-60 12 12)"
          />
        </svg>
      );
    case 'tailwind':
      return (
        <svg {...common}>
          <title>Tailwind</title>
          <path
            d="M6 10c1-3 3-4 5-4 3 0 4 1.5 5 3s2 3 4 3M6 16c1-3 3-4 5-4 3 0 4 1.5 5 3s2 3 4 3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'anthropic':
      return (
        <svg {...common}>
          <title>Anthropic Claude</title>
          <path
            d="M5 19 12 5l7 14M8.5 14h7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'postgres':
      return (
        <svg {...common}>
          <title>PostgreSQL</title>
          <ellipse cx="12" cy="9" rx="7" ry="4" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M5 9v6c0 2.2 3.1 4 7 4s7-1.8 7-4V9"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
          />
          <path
            d="M5 12c0 2.2 3.1 4 7 4s7-1.8 7-4"
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0.5"
          />
        </svg>
      );
    case 'three':
      return (
        <svg {...common}>
          <title>Three.js</title>
          <path
            d="M12 3 4 7v10l8 4 8-4V7Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M12 3v18M4 7l8 4 8-4M4 17l8-4 8 4" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case 'gsap':
      return (
        <svg {...common}>
          <title>GSAP</title>
          <path
            d="M3 12h4l2-5 4 10 2-6 2 3h4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'motion':
      return (
        <svg {...common}>
          <title>Motion</title>
          <circle cx="7" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="17" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10 12h4" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case 'typescript':
      return (
        <svg {...common}>
          <title>TypeScript</title>
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M7 11h6M10 11v7M14.5 17.5c0.5 0.7 1.3 1.2 2.5 1.2 1.4 0 2.5-0.7 2.5-2 0-2.5-4-1.7-4-3.5 0-1 0.7-1.7 2-1.7 0.9 0 1.5 0.3 2 0.9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );
    case 'redis':
      return (
        <svg {...common}>
          <title>Redis</title>
          <path
            d="M3 7 12 4l9 3-9 3-9-3Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M3 12 12 15l9-3M3 17 12 20l9-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'stripe':
      return (
        <svg {...common}>
          <title>Stripe</title>
          <rect x="3" y="6" width="3" height="12" fill="currentColor" strokeWidth="0" />
          <rect x="9" y="6" width="3" height="12" fill="currentColor" strokeWidth="0" />
          <rect
            x="15"
            y="6"
            width="3"
            height="12"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.5"
          />
        </svg>
      );
    case 'sentry':
      return (
        <svg {...common}>
          <title>Sentry</title>
          <path
            d="M12 4 21 19H15c0-3-1.5-7-3-9M12 8 16 19H8l4-11Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'supabase':
      return (
        <svg {...common}>
          <title>Supabase</title>
          <path
            d="M13 3v9h6L11 21v-9H5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.2"
          />
        </svg>
      );
    case 'shiki':
      return (
        <svg {...common}>
          <title>Shiki</title>
          <path
            d="M8 6 4 12l4 6M16 6l4 6-4 6M14 4l-4 16"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'drizzle':
      return (
        <svg {...common}>
          <title>Drizzle ORM</title>
          <path
            d="M6 4v6M10 8v6M14 4v6M18 8v6M6 16v4M14 16v4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg {...common}>
          <title>WhatsApp</title>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M8 11c0.5 2 2 3.5 4 4l1.5-1.5L15 14c-0.2-0.5-1-1.5-2-2L11.5 13.5c-1 0-1.8-0.8-2-2L11 10c-0.5-1-1.5-1.8-2-2L7.5 9.5c0 0.5 0.2 1 0.5 1.5Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.25"
          />
        </svg>
      );
    case 'telegram':
      return (
        <svg {...common}>
          <title>Telegram</title>
          <path
            d="M3 12 21 4 17 20l-6-4-3 4v-5l9-7-11 5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.15"
          />
        </svg>
      );
    default:
      return null;
  }
}
