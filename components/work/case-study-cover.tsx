import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { CaseStudy } from '@/lib/work/data';
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
          priority={false}
        />
      </MockupFrame>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // PATH 2 (Wave 1 stub): Sem screenshot → MockupFrame vazio com micro-label
  // ─────────────────────────────────────────────────────────────────────
  return (
    <MockupFrame
      glow={caseStudy.accent}
      tilted={tilt !== 'none'}
      className={cn(ASPECT_CLASS[aspectRatio], className)}
    >
      <div aria-hidden="true" className="absolute inset-0 flex items-end justify-start p-6">
        <span className="font-mono text-[10px] uppercase tracking-widest text-(--color-text-3)">
          {caseStudy.title} — asset em produção
        </span>
      </div>
    </MockupFrame>
  );
}
