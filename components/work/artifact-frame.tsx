import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ArtifactFrame — a moldura de PROVA (F6, 2026-09-04). Substitui o MockupFrame.
//
// O MockupFrame tratava toda captura como vitrine: tilt 3D, halo lime de 60px,
// reflexo no "chão", brilho no topo, três bolinhas de macOS. Somado aos halos
// de hover dos tiles, era a "fumaça verde" em volta de tudo — e o brand book
// (v1 §17) proíbe exatamente isso: "Do not add gradients, glow, shadows or 3D
// effects". A referência que sobreviveu à pesquisa (R4 §1.5, §1.10, §1.15:
// arrakis.tech, spade.com, linear.app) enquadra mídia como registro, não como
// joia: marcas de corte nos cantos, hairline, e uma linha mono dizendo O QUE é
// a captura (rota, dimensão, data). A elevação vem da borda, nunca de blur.
//
// Acervo consultado antes de desenhar (Referencias-logo/acervo/saida):
// cult-ui BrowserWindow, Magic UI Safari, Aceternity Code Block. Todos trazem
// chrome de navegador (barra de URL, bolinhas, sidebar fake) ou uma dependência
// de syntax-highlighter — o oposto do registro seco que este site precisa.
// Por isso a moldura é própria e mínima: ~40 linhas, zero JS.
//
// Uso:
//   <ArtifactFrame label="studio · /agentes" meta="1440×900 · set/2026" aspect="16/10"
//                  caption="Captura em ambiente local · dados de fixture">
//     <Image fill … />
//   </ArtifactFrame>

export type ArtifactAspect = '16/10' | '16/9' | '4/3' | '3/2' | '1/1' | '3/4' | 'auto';

const ASPECT_CLASS: Record<ArtifactAspect, string> = {
  '16/10': 'aspect-[16/10]',
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  '1/1': 'aspect-square',
  '3/4': 'aspect-[3/4]',
  auto: '',
};

interface ArtifactFrameProps {
  children: ReactNode;
  aspect?: ArtifactAspect | undefined;
  /** Linha mono à esquerda da barra: a rota ou o nome do arquivo capturado. */
  label?: string | undefined;
  /** Linha mono à direita da barra: dimensão, data, ambiente. */
  meta?: string | undefined;
  /** Legenda abaixo da moldura (mono, uppercase). */
  caption?: ReactNode | undefined;
  /** Marcas de corte nos cantos (default true). Acendem via `--tick-color` do pai. */
  ticks?: boolean | undefined;
  className?: string | undefined;
  /** Classes extras no quadro interno (ex.: `bg-white` pra capturas claras). */
  frameClassName?: string | undefined;
  /** Classes extras na área de mídia (ex.: `aspect-[16/10] lg:aspect-auto` no modo fill). */
  mediaClassName?: string | undefined;
  /** F7: `browser` desenha a barra como barra de endereço mínima (URL num pill
   *  centrado, sem bolinhas) — capturas de SITE, vs. `record` pra apps/arquivos. */
  variant?: 'record' | 'browser' | undefined;
}

export function ArtifactFrame({
  children,
  aspect = '16/10',
  label,
  meta,
  caption,
  ticks = true,
  className,
  frameClassName,
  mediaClassName,
  variant = 'record',
}: ArtifactFrameProps) {
  const hasBar = Boolean(label || meta);
  // aspect="auto" = modo fill: a moldura ocupa a altura do pai (flex column) e a
  // mídia preenche o que sobra — usado quando o card precisa igualar a altura
  // da coluna vizinha (FlipCard do Estética MD no grid do Other Work).
  const fill = aspect === 'auto';
  return (
    <figure
      data-slot="artifact-frame"
      className={cn(
        'relative w-full min-w-0 [contain:inline-size]',
        fill && 'flex h-full flex-col',
        className
      )}
    >
      <div className={cn(ticks && 'corner-ticks p-2', fill && 'flex min-h-0 flex-1 flex-col')}>
        <div
          className={cn(
            'overflow-hidden rounded-[4px] border border-(--color-hairline-alpha-2) bg-(--color-surface-deep)',
            fill && 'flex min-h-0 flex-1 flex-col',
            frameClassName
          )}
        >
          {hasBar && variant === 'browser' ? (
            <div
              aria-hidden="true"
              className={cn(
                'grid h-8 grid-cols-[1fr_auto_1fr] items-center gap-3 px-3',
                'border-b border-(--color-hairline-alpha) bg-(--color-surface)',
                'font-mono text-2xs tracking-wider text-(--color-text-3)'
              )}
            >
              <span aria-hidden="true" className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full border border-(--color-hairline-strong)" />
                <span className="size-1.5 rounded-full border border-(--color-hairline-strong)" />
              </span>
              <span className="min-w-0 max-w-[60vw] truncate rounded-full border border-(--color-hairline-alpha) bg-(--color-surface-deep) px-3 py-0.5 text-center lowercase">
                {label}
              </span>
              {meta ? (
                <span className="min-w-0 truncate text-right uppercase tabular-nums">{meta}</span>
              ) : (
                <span />
              )}
            </div>
          ) : hasBar ? (
            <div
              aria-hidden="true"
              className={cn(
                'flex h-7 items-center justify-between gap-3 px-3',
                'border-b border-(--color-hairline-alpha) bg-(--color-surface)',
                'font-mono text-2xs uppercase tracking-wider text-(--color-text-3)'
              )}
            >
              <span className="min-w-0 truncate">{label}</span>
              {meta ? <span className="shrink-0 tabular-nums">{meta}</span> : null}
            </div>
          ) : null}
          <div
            className={cn(
              'relative w-full',
              fill ? 'min-h-0 flex-1' : ASPECT_CLASS[aspect],
              mediaClassName
            )}
          >
            {children}
          </div>
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-3 px-2 font-mono text-2xs uppercase leading-relaxed tracking-wider text-(--color-text-3)">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
