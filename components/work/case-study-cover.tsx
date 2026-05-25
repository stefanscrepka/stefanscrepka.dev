import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { CaseStudy } from '@/lib/work/data';
import { ProductCover } from './product-cover';
import { MockupFrame } from './product-mockup';

// CaseStudyCover — dispatcher inteligente entre dois renderers:
//
//   1. screenshot existe (PNG real entregue pelo Stefan)
//      → MockupFrame premium + next/image cover (Apple/Huly-style)
//
//   2. screenshot == null (Wave 1 stub state)
//      → MockupFrame VAZIO com micro-label (até Wave 4 entregar Aceternity
//        MacBookScroll + screenshots reais + Imagen 3 compositions)
//
// Wave 1 removeu o CinematicCover (4 variants procedurais SVG). Wave 4 vai
// preencher cada cover com asset real ou composição Aceternity.

interface CaseStudyCoverProps {
  caseStudy: CaseStudy;
  aspectRatio?: '16/10' | '16/9' | '4/3' | '3/2' | '1/1' | undefined;
  tilt?: 'none' | 'subtle' | 'cinema' | undefined;
  /** Habilita hover lift. Default false (parent usually é Link). */
  interactive?: boolean;
  /** Marca como `priority` no Next/Image. Use no PRIMEIRO cover above-the-fold
   *  (FeaturedWork HeroTile) — pode ser o LCP element em mobile com hero video
   *  gated. Default false. */
  priority?: boolean;
  className?: string | undefined;
}

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
  interactive: _interactive = false,
  priority = false,
  className,
}: CaseStudyCoverProps) {
  // ─────────────────────────────────────────────────────────────────────
  // PATH 1: Screenshot real existe → premium MockupFrame
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
          priority={priority}
        />
      </MockupFrame>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // PATH 2: Sem screenshot → diagrama SVG custom por produto.
  // Cada case study tem seu proprio diagrama em components/work/diagrams.tsx
  // (SquadsDiagram pipeline horizontal, NexaCoreDiagram stack vertical,
  // StjAppDiagram, EsteticaDiagram, etc) — substitui o frame vazio invisivel
  // que antes deixava o HeroTile do Content Engine como um buraco.
  // ─────────────────────────────────────────────────────────────────────
  return (
    <ProductCover
      mode="diagram"
      diagram={caseStudy.diagram}
      tone={caseStudy.accent}
      tilt={tilt}
      aspectRatio={aspectRatio}
      label={`${caseStudy.title} — arquitetura visual`}
      className={className}
    />
  );
}
