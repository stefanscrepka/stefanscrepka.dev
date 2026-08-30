'use client';

import { useRef } from 'react';
import { usePausedOffscreen } from '@/hooks/use-paused-offscreen';

// Backdrop visual atrás do manifesto — light leak vertical estilo Huly beam +
// grain SVG amplificado. Pattern: 4/13 prints do Stefan usam light beam vertical.
// Paused em prefers-reduced-motion via @media query global.
// F3.5 (2026-06-11): beam-drift também pausa fora da viewport (o manifesto
// vive no fim da home; o loop de 20s rodava desde o load em toda a página).

export function ManifestoBackdrop() {
  const beamRef = useRef<HTMLDivElement>(null);
  usePausedOffscreen(beamRef);

  return (
    <div
      data-slot="manifesto-backdrop"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Light beam vertical — gradient lime emissive blur */}
      <div
        ref={beamRef}
        className="absolute left-1/2 top-0 h-full w-[40vw] -translate-x-1/2 blur-3xl opacity-60"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, var(--color-accent-glow) 30%, var(--color-accent-glow) 70%, transparent 100%)',
          animation: 'manifesto-beam-drift 20s ease-in-out infinite',
        }}
      />

      {/* Faint side highlights */}
      <div
        className="absolute -left-12 top-1/4 h-[60%] w-32 rounded-full blur-2xl opacity-30"
        style={{
          background: 'radial-gradient(circle, var(--color-accent-emissive) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute -right-12 top-1/3 h-[55%] w-32 rounded-full blur-2xl opacity-25"
        style={{
          background: 'radial-gradient(circle, var(--color-accent-emissive) 0%, transparent 70%)',
        }}
      />

      {/* Grain extra — amplificado em relação ao global.
          W0.3 (2026-05-23): aria-hidden explícito (pai já era hidden, mas alguns
          AT antigos não herdavam confiavelmente sobre <svg><title>). */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06] mix-blend-overlay"
        aria-hidden="true"
        focusable="false"
      >
        <filter id="manifesto-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.45 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#manifesto-grain)" />
      </svg>

      <style>
        {`
          @keyframes manifesto-beam-drift {
            0%, 100% { transform: translate(-50%, 0) scaleY(1); opacity: 0.5; }
            50% { transform: translate(-50%, -2%) scaleY(1.05); opacity: 0.7; }
          }
          @media (prefers-reduced-motion: reduce) {
            [data-slot="manifesto-backdrop"] > div:first-child {
              animation: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}
