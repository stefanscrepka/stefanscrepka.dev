import { cn } from '@/lib/utils';

// SVG feTurbulence grain overlay, RSC. Fixed position pointer-events-none.
// 4% opacity padrão. Drift loop 60s via CSS keyframe (kill via reduced-motion global override).
// mix-blend overlay deixa o grão sentir surface por baixo sem ofuscar conteúdo.
//
// F3.5 (2026-06-11): decisão documentada — IntersectionObserver NÃO se aplica
// aqui (fixed inset-0 = sempre intersectando por definição). O drift é
// transform-only (compositor); abas ocultas já não pintam. Se aparecer custo
// em low-end, o caminho é o LAUNCH-CHECKLIST: bakear PNG 256² tiled.

interface GrainOverlayProps {
  opacity?: number;
  className?: string;
}

export function GrainOverlay({ opacity = 0.04, className }: GrainOverlayProps) {
  return (
    <div
      aria-hidden="true"
      data-slot="grain-overlay"
      className={cn(
        'pointer-events-none fixed inset-0 z-40 mix-blend-overlay',
        'motion-safe:animate-grain-drift',
        className
      )}
      style={{ opacity }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
        className="h-full w-full"
        aria-hidden="true"
        focusable="false"
      >
        <filter id="grain-noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
            seed="7"
          />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-noise)" />
      </svg>
    </div>
  );
}
