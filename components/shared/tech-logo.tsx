// Brand icons via @icons-pack/react-simple-icons (oficial Simple Icons).
// Color via CSS currentColor — text-(--color-text-2) default, hover lime.
// Glyphs renderizam todos no mesmo tamanho (size 22px default).
// Fallback custom SVG só pra brands fora do pacote (ex: shiki).

import {
  SiAnthropic,
  SiDrizzle,
  SiFramer,
  SiGsap,
  SiNextdotjs,
  SiPostgresql,
  SiReact,
  SiRedis,
  SiSentry,
  SiStripe,
  SiSupabase,
  SiTailwindcss,
  SiTelegram,
  SiThreedotjs,
  SiTypescript,
  SiVercel,
  SiWhatsapp,
} from '@icons-pack/react-simple-icons';
import { cn } from '@/lib/utils';

// O pacote não expõe `types` no exports map; deriva o IconType direto de um
// componente conhecido pra evitar resolução de subpath quebrada.
type IconType = typeof SiVercel;

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

// Mapeia ids → componente do pacote oficial. Brands fora do pacote (shiki)
// caem no fallback custom abaixo.
const PACK_ICONS: Partial<Record<TechId, IconType>> = {
  vercel: SiVercel,
  nextjs: SiNextdotjs,
  react: SiReact,
  tailwind: SiTailwindcss,
  anthropic: SiAnthropic,
  postgres: SiPostgresql,
  three: SiThreedotjs,
  gsap: SiGsap,
  motion: SiFramer,
  typescript: SiTypescript,
  redis: SiRedis,
  stripe: SiStripe,
  sentry: SiSentry,
  supabase: SiSupabase,
  drizzle: SiDrizzle,
  whatsapp: SiWhatsapp,
  telegram: SiTelegram,
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
  const Icon = PACK_ICONS[id];
  if (Icon) {
    return (
      <Icon
        size={size}
        color="currentColor"
        title={LABELS[id]}
        aria-hidden="true"
        focusable="false"
        className="shrink-0 text-(--color-accent)"
      />
    );
  }

  // Fallback custom para brands fora do Simple Icons (shiki).
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

  if (id === 'shiki') {
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
  }

  return null;
}
