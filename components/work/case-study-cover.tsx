import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { CaseStudy } from '@/lib/work/data';
import { CinematicCover } from './cinematic-cover';
import { MockupFrame } from './product-mockup';

// CaseStudyCover — dispatcher inteligente entre dois renderers:
//
//   1. screenshot existe (PNG real entregue pelo Stefan)
//      → ProductMockup wrapper via MockupFrame + next/image cover
//
//   2. screenshot == null (estado atual)
//      → CinematicCover com a variant declarada no CaseStudy
//        (radial-beam | arc-glow | portrait-glow | amber-soft)
//
// Substitui o legacy fallback de ProductCover mode='diagram' nos featured tiles
// — diagramas SVG continuam vivos pra uso explícito (other-work mini cards,
// MacBookScroll screen interno, STJ before/after CompareSlider). Aqui o que
// estamos REMOVENDO é o look genérico "placeholder Loading skeleton" e
// substituindo por composições cinematográficas com identidade.

interface CaseStudyCoverProps {
  caseStudy: CaseStudy;
  aspectRatio?: '16/10' | '16/9' | '4/3' | '3/2' | '1/1' | undefined;
  tilt?: 'none' | 'subtle' | 'cinema' | undefined;
  /** Habilita hover lift no CinematicCover. Default false (parent usually é Link). */
  interactive?: boolean;
  className?: string | undefined;
}

const ASPECT_CSS: Record<NonNullable<CaseStudyCoverProps['aspectRatio']>, string> = {
  '16/10': '16 / 10',
  '16/9': '16 / 9',
  '4/3': '4 / 3',
  '3/2': '3 / 2',
  '1/1': '1 / 1',
};

const ASPECT_CLASS: Record<NonNullable<CaseStudyCoverProps['aspectRatio']>, string> = {
  '16/10': 'aspect-[16/10]',
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  '1/1': 'aspect-square',
};

export function CaseStudyCover({
  caseStudy,
  aspectRatio = '16/10',
  tilt = 'subtle',
  interactive = false,
  className,
}: CaseStudyCoverProps) {
  // ─────────────────────────────────────────────────────────────────────
  // PATH 1: Screenshot real existe → premium ProductMockup
  // ─────────────────────────────────────────────────────────────────────
  if (caseStudy.screenshot) {
    return (
      <MockupFrame
        glow={caseStudy.accent}
        tilted={tilt !== 'none'}
        className={cn(ASPECT_CLASS[aspectRatio], className)}
      >
        <Image
          src={caseStudy.screenshot}
          alt={`${caseStudy.title} — captura de tela do produto em produção`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority={false}
        />
      </MockupFrame>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // PATH 2: Sem screenshot → CinematicCover com variant do case
  // ─────────────────────────────────────────────────────────────────────
  return (
    <CinematicCover
      variant={caseStudy.cinematicVariant}
      caseSlug={caseStudy.slug}
      caseTitle={caseStudy.title}
      aspectRatio={ASPECT_CSS[aspectRatio]}
      interactive={interactive}
      className={className}
    />
  );
}
