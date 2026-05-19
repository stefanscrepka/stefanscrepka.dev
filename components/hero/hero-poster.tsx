import { cn } from '@/lib/utils';

// SSG fallback / reduced-motion replacement do <HeroScene3D />.
// 3 placas em 2D mimic do layout 3D — left -8°, center frontmost com lime emissive,
// right +8°. Renderiza zero JS, zero canvas, zero animação.
// Usado tanto como Suspense fallback durante import dinâmico quanto como replacement
// final quando prefers-reduced-motion: reduce está ativo.

interface HeroPosterProps {
  className?: string | undefined;
  /** Quando usado como fallback final (reduced-motion), recebe alt descritivo. */
  alt?: string | undefined;
}

export function HeroPoster({ className, alt }: HeroPosterProps) {
  // Quando alt definido = role="img" semântico (reduced-motion replacement);
  // quando alt vazio = elemento puramente decorativo (Suspense fallback while r3f loads).
  const ariaProps = alt
    ? ({ role: 'img', 'aria-label': alt } as const)
    : ({ 'aria-hidden': true } as const);

  return (
    <div
      data-slot="hero-poster"
      {...ariaProps}
      className={cn(
        'isolate flex h-full w-full items-center justify-center',
        'overflow-hidden bg-(--color-base)',
        className
      )}
      style={{ backgroundColor: '#080A07' }}
    >
      {/* Ambient lime glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[15%] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle at center, var(--color-accent-glow) 0%, transparent 70%)',
        }}
      />

      {/* Plate L — left, rotated -8° */}
      <div
        aria-hidden="true"
        className="absolute left-[8%] top-[18%] h-[60%] w-[42%] rounded-sm border border-(--color-hairline-strong)"
        style={{
          transform: 'rotate(-8deg) translateZ(0)',
          background:
            'linear-gradient(135deg, oklch(22% 0.010 130 / 0.6) 0%, oklch(18% 0.008 130 / 0.4) 100%)',
          backdropFilter: 'blur(2px)',
          boxShadow:
            'var(--shadow-cinema), inset 0 1px 0 oklch(100% 0 0 / 0.06), inset 0 0 0 1px oklch(100% 0 0 / 0.02)',
        }}
      >
        <PlateReededLines />
      </div>

      {/* Plate R — right, rotated +8° */}
      <div
        aria-hidden="true"
        className="absolute right-[8%] top-[28%] h-[55%] w-[38%] rounded-sm border border-(--color-hairline-strong)"
        style={{
          transform: 'rotate(8deg) translateZ(0)',
          background:
            'linear-gradient(135deg, oklch(20% 0.010 130 / 0.55) 0%, oklch(16% 0.008 130 / 0.35) 100%)',
          backdropFilter: 'blur(2px)',
          boxShadow:
            'var(--shadow-cinema), inset 0 1px 0 oklch(100% 0 0 / 0.06), inset 0 0 0 1px oklch(100% 0 0 / 0.02)',
        }}
      >
        <PlateReededLines />
      </div>

      {/* Plate C — centro, frontmost, lime emissive border */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[22%] h-[64%] w-[48%] -translate-x-1/2 rounded-sm"
        style={{
          background:
            'linear-gradient(135deg, oklch(24% 0.012 130 / 0.72) 0%, oklch(20% 0.010 130 / 0.55) 100%)',
          backdropFilter: 'blur(3px)',
          border: '1.5px solid var(--color-accent)',
          boxShadow:
            'var(--shadow-cinema), 0 0 48px var(--color-accent-emissive), inset 0 1px 0 oklch(100% 0 0 / 0.10), inset 0 0 0 1px oklch(94% 0.22 124 / 0.1)',
        }}
      >
        <PlateReededLines tone="accent" />
      </div>

      {/* Floor reflection sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[14%] w-[80%] -translate-x-1/2 opacity-40 blur-md"
        style={{
          background: 'linear-gradient(to bottom, var(--color-accent-glow) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}

function PlateReededLines({ tone }: { tone?: 'accent' }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-50"
      style={{
        backgroundImage: `repeating-linear-gradient(90deg, transparent 0, transparent 6px, oklch(100% 0 0 / ${
          tone === 'accent' ? '0.05' : '0.03'
        }) 6px, oklch(100% 0 0 / ${tone === 'accent' ? '0.05' : '0.03'}) 7px)`,
      }}
    />
  );
}
