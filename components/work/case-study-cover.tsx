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
  /** F3.6 (2026-06-11): carrega eager (sem lazy) MAS sem <link rel=preload>.
   *  Aplica `loading="eager"` ao next/image SÓ no PATH 1 (screenshot real) —
   *  o fetch começa no parse do HTML sem competir na fila do preload scanner
   *  com o hero-poster (candidato a LCP). A doc bundled do next/image recomenda
   *  loading="eager"/fetchPriority em vez de preload na maioria dos casos.
   *  NOTA (F3-review): no PATH 2 (screenshot=null → diagrama SVG inline) esta
   *  prop é inócua — não há <img> pra adiantar. Default false (lazy). */
  eager?: boolean;
  /** Override `sizes` para o next/image. Default assume tile a 50vw (half tile
   *  ou /work grid 2-col). Override pra hero full-width ou 3-col grid. */
  sizes?: string;
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
  eager = false,
  sizes,
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
          sizes={sizes ?? '(min-width: 1024px) 50vw, 100vw'}
          // W-fix (2026-05-26): quality 95 (era default 75). UI screenshots
          // têm muito high-frequency detail (texto, bordas, ícones). q75 cria
          // ringing visível em texto pequeno = aparência "pixelizada". q95
          // mantém legibilidade premium sem custo significativo de peso.
          quality={95}
          className="object-cover"
          // F3.6 (2026-06-11): era preload (paridade com o priority antigo).
          // O <link rel=preload> no head disputava banda com o hero-poster
          // durante a janela crítica do LCP; eager mantém o fetch cedo (sem
          // lazy pop-in) com prioridade natural de <img> no documento.
          loading={eager ? 'eager' : undefined}
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
