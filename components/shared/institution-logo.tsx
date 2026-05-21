import { cn } from '@/lib/utils';

// Stylized institution marks — não logos oficiais 1:1, mas glyphs custom
// que evocam cada instituição em tom monocromático + accent lime.

export type InstitutionId =
  | 'senai'
  | 'scheffer'
  | 'b7web'
  | 'makita'
  | 'unicesumar'
  | 'content-engine';

interface InstitutionLogoProps {
  ids: InstitutionId[];
  size?: number;
  className?: string | undefined;
}

const LABELS: Record<InstitutionId, string> = {
  senai: 'SENAI',
  scheffer: 'Scheffer',
  b7web: 'B7Web',
  makita: 'Makita',
  unicesumar: 'Unicesumar',
  'content-engine': 'Content Engine',
};

export function InstitutionLogo({ ids, size = 18, className }: InstitutionLogoProps) {
  return (
    <ul
      data-slot="institution-logos"
      className={cn('flex flex-wrap items-center gap-3', className)}
    >
      {ids.map((id) => (
        <li key={id} className="inline-flex items-center gap-2">
          <InstitutionGlyph id={id} size={size} />
          <span className="font-mono text-2xs uppercase tracking-widest text-(--color-text-2)">
            {LABELS[id]}
          </span>
        </li>
      ))}
    </ul>
  );
}

function InstitutionGlyph({ id, size }: { id: InstitutionId; size: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    'aria-hidden': true,
    focusable: false,
    className: 'shrink-0 text-(--color-accent)',
  } as const;

  switch (id) {
    case 'senai':
      // Shield + industrial gear hint
      return (
        <svg {...common}>
          <title>SENAI</title>
          <path
            d="M12 3 4 6v6c0 4.5 3.5 8 8 9 4.5-1 8-4.5 8-9V6Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M12 9.5v-2M12 14.5v2M9.5 12h-2M16.5 12h-2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'scheffer':
      // Logistics / mountain
      return (
        <svg {...common}>
          <title>Scheffer Logística</title>
          <path
            d="M3 18 9 9l4 6 3-4 5 7Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'b7web':
      // "B7" stylized as code
      return (
        <svg {...common}>
          <title>B7Web</title>
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fontSize="10"
            fontFamily="ui-monospace, monospace"
            fontWeight="700"
            fill="currentColor"
          >
            B7
          </text>
        </svg>
      );
    case 'makita':
      // Power tool / lightning
      return (
        <svg {...common}>
          <title>Makita do Brasil</title>
          <path
            d="M13 3 5 14h6l-2 7 10-11h-6Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.15"
          />
        </svg>
      );
    case 'unicesumar':
      // Triangle + book
      return (
        <svg {...common}>
          <title>Unicesumar</title>
          <path d="M12 3 4 18h16Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M9 15h6M10 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'content-engine':
      // Hexagon network — reuso conceitual do SquadsDiagram
      return (
        <svg {...common}>
          <title>Content Engine</title>
          <polygon
            points="12,3 20,7 20,17 12,21 4,17 4,7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
          <circle cx="12" cy="7" r="1" fill="currentColor" />
          <circle cx="17" cy="14" r="1" fill="currentColor" />
          <circle cx="7" cy="14" r="1" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}
