import type { CaseStudy } from '@/lib/work/data';
import { ProductCover } from './product-cover';

// Smart helper que decide mode='image' (quando screenshot existe) vs
// mode='diagram' (fallback custom por produto) lendo direto do CaseStudy.

interface CaseStudyCoverProps {
  caseStudy: CaseStudy;
  aspectRatio?: '16/10' | '16/9' | '4/3' | '3/2' | '1/1' | undefined;
  tilt?: 'none' | 'subtle' | 'cinema' | undefined;
  className?: string | undefined;
}

export function CaseStudyCover({
  caseStudy,
  aspectRatio = '16/10',
  tilt = 'subtle',
  className,
}: CaseStudyCoverProps) {
  if (caseStudy.screenshot) {
    return (
      <ProductCover
        mode="image"
        src={caseStudy.screenshot}
        label={caseStudy.title}
        tone={caseStudy.accent}
        aspectRatio={aspectRatio}
        tilt={tilt}
        className={className}
      />
    );
  }

  return (
    <ProductCover
      mode="diagram"
      diagram={caseStudy.diagram}
      label={caseStudy.title}
      tone={caseStudy.accent}
      aspectRatio={aspectRatio}
      tilt={tilt}
      className={className}
    />
  );
}
