import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ProductMockup — CSS perspective + 3-layer cinema shadow + inner highlight + lime
// emissive border. Wrap qualquer child (Image, video, SVG diagram) pra ganhar
// presença "device on display" estilo Apple/Linear/Vercel landing.
//
// Anti-AI-slop: NÃO usa gradient decorativo no fundo, NÃO escala 1.05 genérico.
// Inspiração: Quantum + Argus prints (perspective tilted device on dark surface).
//
// Safari fallback: @supports (transform-style: preserve-3d) — se não houver suporte,
// o elemento renderiza flat sem o tilt, mantendo cinema shadow.

interface ProductMockupProps {
  children: ReactNode;
  /** Aspect ratio do conteúdo interno. Default 16/10 — formato dashboard típico. */
  aspectRatio?: '16/10' | '16/9' | '4/3' | '3/2' | '1/1';
  /** Tom do glow accent ao redor — lime padrão, amber pra Estética MD only. */
  tone?: 'lime' | 'amber';
  /** Intensidade do tilt 3D. 'none' = flat (mobile / reduced-motion). */
  tilt?: 'none' | 'subtle' | 'cinema';
  /** Classes extras no wrapper externo (sizing, layout). */
  className?: string | undefined;
}

const ASPECT_CLASSES: Record<NonNullable<ProductMockupProps['aspectRatio']>, string> = {
  '16/10': 'aspect-[16/10]',
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  '1/1': 'aspect-square',
};

const TILT_STYLES: Record<NonNullable<ProductMockupProps['tilt']>, string | undefined> = {
  none: undefined,
  subtle: 'perspective(1400px) rotateX(3deg) rotateY(-2deg)',
  cinema: 'perspective(1200px) rotateX(6deg) rotateY(-4deg)',
};

const TONE_GLOW = {
  lime: 'var(--color-accent-emissive)',
  amber: 'oklch(82% 0.18 75 / 0.4)',
} as const;

const TONE_BORDER = {
  lime: 'var(--color-accent)',
  amber: 'oklch(82% 0.18 75)',
} as const;

export function ProductMockup({
  children,
  aspectRatio = '16/10',
  tone = 'lime',
  tilt = 'subtle',
  className,
}: ProductMockupProps) {
  return (
    <div
      data-slot="product-mockup"
      data-tone={tone}
      data-tilt={tilt}
      className={cn(
        'group/mockup relative w-full',
        '[transform-style:preserve-3d]',
        '[perspective:1400px]',
        className
      )}
    >
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-xl',
          'border border-(--color-hairline-strong)',
          'transition-transform duration-(--motion-modal) ease-(--ease-smooth)',
          ASPECT_CLASSES[aspectRatio]
        )}
        style={{
          transform: TILT_STYLES[tilt],
          boxShadow: [
            'var(--shadow-cinema)',
            `0 0 60px ${TONE_GLOW[tone]}`,
            `inset 0 1px 0 oklch(100% 0 0 / 0.08)`,
            `inset 0 0 0 1px ${tone === 'lime' ? 'oklch(94% 0.22 124 / 0.06)' : 'oklch(82% 0.18 75 / 0.06)'}`,
          ].join(', '),
          borderColor:
            tone === 'lime' ? 'var(--color-hairline-strong)' : 'oklch(82% 0.18 75 / 0.3)',
        }}
      >
        {/* Inner content — preenchimento full */}
        <div className="absolute inset-0">{children}</div>

        {/* Top glare — subtle highlight line topo do mockup (estilo glass) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${TONE_BORDER[tone]} 50%, transparent)`,
            opacity: 0.4,
          }}
        />
      </div>

      {/* Floor reflection — gradiente suave abaixo do mockup */}
      {tilt !== 'none' ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-4 left-1/2 h-8 w-3/4 -translate-x-1/2 opacity-30 blur-2xl"
          style={{
            background: `radial-gradient(ellipse at center, ${TONE_GLOW[tone]} 0%, transparent 70%)`,
          }}
        />
      ) : null}
    </div>
  );
}
