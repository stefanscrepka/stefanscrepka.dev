import { cn } from '@/lib/utils';

// ============================================================
// HeroPoster — 2D versão estática do palco cinematográfico
//
// Usado em:
//   - prefers-reduced-motion: reduce
//   - SSR / pré-hidratação (Canvas r3f não renderiza no server)
//   - Error boundary se Canvas falhar
//
// Composição (matching scene-3d):
//   - Background var(--color-base) absoluto (zero gradient decorativo)
//   - Lime beam vertical radial saindo do bottom-center
//   - 3 placas glass tilted (L -8°, C frontmost lime border, R +8°)
//   - Vignette sutil nos cantos pra reforçar palco
//   - SR-only descritivo quando alt definido
//
// Zero animação JS — só CSS estático. Funciona sem JavaScript.
// ============================================================

interface HeroPosterProps {
  className?: string | undefined;
  /** Quando definido = role="img" semântico (reduced-motion replacement);
   *  quando vazio = elemento decorativo (Suspense fallback while r3f loads). */
  alt?: string | undefined;
}

export function HeroPoster({ className, alt }: HeroPosterProps) {
  const ariaProps = alt
    ? ({ role: 'img', 'aria-label': alt } as const)
    : ({ 'aria-hidden': true } as const);

  return (
    <div
      data-slot="hero-poster"
      {...ariaProps}
      className={cn(
        'relative isolate flex h-full w-full items-center justify-center',
        'overflow-hidden bg-(--color-base)',
        className
      )}
    >
      {/* Layer 1 — Lime volumetric beam (radial elipse, bottom-center → up) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 45% 75% at 50% 100%,
            color-mix(in oklch, var(--color-accent) 28%, transparent) 0%,
            color-mix(in oklch, var(--color-accent) 12%, transparent) 25%,
            color-mix(in oklch, var(--color-accent) 4%, transparent) 50%,
            transparent 75%)`,
        }}
      />

      {/* Layer 2 — Lime ambient halo (atrás das placas, soft blur) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at center, var(--color-accent-glow) 0%, transparent 70%)',
        }}
      />

      {/* Layer 3 — Plates triptych */}
      <div className="relative h-full w-full">
        {/* Plate L — left, recuada com perspective + rotation -8° */}
        <div
          aria-hidden="true"
          className="absolute left-[10%] top-[22%] h-[58%] w-[36%]"
          style={{
            transform: 'perspective(900px) rotateY(-14deg) rotateZ(-2deg) translateZ(-40px)',
            background: `linear-gradient(135deg,
              oklch(22% 0.010 130 / 0.65) 0%,
              oklch(16% 0.008 130 / 0.45) 100%)`,
            backdropFilter: 'blur(2px)',
            border: '1px solid oklch(30% 0.010 130 / 0.8)',
            borderRadius: '2px',
            boxShadow: `
              0 1px 1px oklch(0% 0 0 / 0.04),
              0 8px 24px oklch(0% 0 0 / 0.32),
              0 32px 64px oklch(0% 0 0 / 0.4),
              inset 0 1px 0 oklch(100% 0 0 / 0.06),
              inset 0 0 0 1px oklch(100% 0 0 / 0.02)`,
          }}
        >
          <ReededGlassLines />
        </div>

        {/* Plate R — right, recuada +8° */}
        <div
          aria-hidden="true"
          className="absolute right-[10%] top-[26%] h-[54%] w-[34%]"
          style={{
            transform: 'perspective(900px) rotateY(14deg) rotateZ(2deg) translateZ(-40px)',
            background: `linear-gradient(135deg,
              oklch(20% 0.010 130 / 0.6) 0%,
              oklch(14% 0.008 130 / 0.4) 100%)`,
            backdropFilter: 'blur(2px)',
            border: '1px solid oklch(30% 0.010 130 / 0.8)',
            borderRadius: '2px',
            boxShadow: `
              0 1px 1px oklch(0% 0 0 / 0.04),
              0 8px 24px oklch(0% 0 0 / 0.32),
              0 32px 64px oklch(0% 0 0 / 0.4),
              inset 0 1px 0 oklch(100% 0 0 / 0.06),
              inset 0 0 0 1px oklch(100% 0 0 / 0.02)`,
          }}
        >
          <ReededGlassLines />
        </div>

        {/* Plate C — frontmost, lime emissive border */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[18%] h-[64%] w-[40%] -translate-x-1/2"
          style={{
            transform: 'perspective(900px) translateZ(20px)',
            background: `linear-gradient(135deg,
              oklch(24% 0.012 130 / 0.78) 0%,
              oklch(18% 0.010 130 / 0.6) 100%)`,
            backdropFilter: 'blur(3px)',
            border: '1.5px solid var(--color-accent)',
            borderRadius: '2px',
            boxShadow: `
              0 1px 1px oklch(0% 0 0 / 0.04),
              0 8px 24px oklch(0% 0 0 / 0.4),
              0 32px 80px oklch(0% 0 0 / 0.5),
              0 0 60px color-mix(in oklch, var(--color-accent) 22%, transparent),
              0 0 32px var(--color-accent-emissive),
              inset 0 1px 0 oklch(100% 0 0 / 0.12),
              inset 0 0 0 1px color-mix(in oklch, var(--color-accent) 12%, transparent)`,
          }}
        >
          <ReededGlassLines tone="accent" />
        </div>
      </div>

      {/* Layer 4 — Floor reflection sutil (lime bouncing off bottom edge) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[18%] w-[70%] -translate-x-1/2 opacity-60 blur-md"
        style={{
          background:
            'linear-gradient(to bottom, color-mix(in oklch, var(--color-accent) 18%, transparent) 0%, transparent 100%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Layer 5 — Vignette pra reforçar palco escuro nos cantos */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 180px oklch(0% 0 0 / 0.55)',
        }}
      />
    </div>
  );
}

/**
 * Reeded glass texture — linhas verticais finas mimic vidro canelado real.
 * Tone "accent" usa lime sutil; default neutro.
 */
function ReededGlassLines({ tone }: { tone?: 'accent' }) {
  const isAccent = tone === 'accent';
  const lineColor = isAccent ? 'oklch(94% 0.22 124 / 0.06)' : 'oklch(100% 0 0 / 0.035)';
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-60"
      style={{
        backgroundImage: `repeating-linear-gradient(
          90deg,
          transparent 0,
          transparent 6px,
          ${lineColor} 6px,
          ${lineColor} 7px
        )`,
      }}
    />
  );
}
