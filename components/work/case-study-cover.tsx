import Image from 'next/image';
import type { CaseStudy } from '@/lib/work/data';
import { type ArtifactAspect, ArtifactFrame } from './artifact-frame';

// CaseStudyCover — a capa do case é SEMPRE uma captura real (F6, 2026-09-04).
//
// Antes: dispatcher entre "screenshot real" e "diagrama SVG fallback" — o
// flagship (Content Engine) caía no fallback e o tile principal da home era um
// desenho de caixas. Agora `caseStudy.cover` é obrigatório e a moldura é o
// ArtifactFrame (marcas de corte + hairline + barra mono com a procedência),
// sem tilt, sem halo.

interface CaseStudyCoverProps {
  caseStudy: CaseStudy;
  /** `loading="eager"` no <img> — só pro cover que é candidato a LCP. */
  eager?: boolean;
  /** Override `sizes` do next/image. Default assume tile a 50vw. */
  sizes?: string;
  /** Mostra a barra com rota + meta (default true). */
  bar?: boolean;
  /** Mostra a legenda abaixo (default false — tiles não; páginas de case sim). */
  caption?: boolean;
  /** Override do aspect da capa (ex.: 'auto' = preencher a altura do pai). */
  aspect?: ArtifactAspect | undefined;
  mediaClassName?: string | undefined;
  className?: string | undefined;
  /** F7: moldura de navegador (capturas de SITE, não de app). */
  browser?: boolean | undefined;
}

export function CaseStudyCover({
  caseStudy,
  eager = false,
  sizes,
  bar = true,
  caption = false,
  aspect,
  mediaClassName,
  className,
  browser = false,
}: CaseStudyCoverProps) {
  const a = caseStudy.cover;
  return (
    <ArtifactFrame
      aspect={aspect ?? a.aspect}
      mediaClassName={mediaClassName}
      label={bar ? a.label : undefined}
      meta={bar ? a.meta : undefined}
      caption={caption ? a.caption : undefined}
      className={className}
      variant={browser ? 'browser' : 'record'}
    >
      <Image
        src={a.src}
        alt={a.alt}
        fill
        sizes={sizes ?? '(min-width: 1024px) 50vw, 100vw'}
        // UI screenshots têm texto fino; q75 cria ringing visível. Registrado
        // em next.config.ts (images.qualities).
        quality={95}
        className="object-cover object-top"
        loading={eager ? 'eager' : undefined}
      />
    </ArtifactFrame>
  );
}
