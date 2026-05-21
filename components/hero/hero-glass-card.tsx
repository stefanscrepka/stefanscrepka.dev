'use client';

import { m } from 'motion/react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// ============================================================
// HeroGlassCard — refractive glass portrait card pra coluna direita do hero.
//
// Vibe: Polo/Johan Beker translucent window + Huly emissive border + Rive
// Translucent Window. CSS-only + SVG procedural + Motion 12 (zero r3f).
//
// Estrutura:
//  - 3 layers de background interno (caustic gradient → grain → top highlight)
//  - 3 zonas de conteudo (header status mono → body STACK + rotating lines → footer hairline)
//  - 1 idle parallax loop + 1 glow pulse loop + 1 mount reveal (scale + opacity)
//
// Fallback: backdrop-filter ausente → @supports not vira surface-elevated solid.
// Reduced-motion: tudo statico (rotacao mantida, sem floats/cycles).
// ============================================================

interface HeroGlassCardProps {
  className?: string;
}

// Rotating stack lines — CSS-only cycle via staggered animation delays.
// Cada line aparece 3s, fade out 0.5s; total 4 lines = 12s loop.
const STACK_LINES = [
  'Multi-agent pipeline · S3 Criação',
  'Claude SDK · 22 agentes · 5 squads',
  'Anti-slop validator · 14 regex pt-BR',
  'Prompt cache · 2 camadas · 100 tests',
] as const;

const CYCLE_DURATION = 12; // segundos (4 lines × 3s)
const STEP = 100 / STACK_LINES.length; // 25% por line

export function HeroGlassCard({ className }: HeroGlassCardProps) {
  const reduced = useReducedMotionSafe();

  // Motion 12: reveal mount animation (scale 0.92→1 + opacity 0→1, ease-dramatic).
  // Reduced-motion: snap final, sem delay.
  const reveal =
    reduced === null || reduced
      ? { initial: false, animate: { opacity: 1, scale: 1 } }
      : {
          initial: { opacity: 0, scale: 0.92 },
          animate: { opacity: 1, scale: 1 },
          transition: {
            duration: 0.8,
            delay: 0.6,
            // ease-dramatic equivalent (Motion accepts cubic-bezier array)
            ease: [0.165, 0.84, 0.44, 1] as const,
          },
        };

  return (
    <m.div
      {...reveal}
      role="figure"
      aria-label="Stack ativo"
      data-slot="hero-glass-card"
      className={cn(
        // Layout & posicionamento
        'relative isolate w-full max-w-[420px]',
        'aspect-[4/5]',
        // Rotacao editorial (Polo): 2° mobile → 4° desktop
        'rotate-[2deg] lg:rotate-[4deg]',
        // Glass material — fallback handled via @supports inline style abaixo
        'glass-panel',
        // Layer compositing
        'rounded-2xl overflow-hidden',
        // Cinema shadow + inset bisel via box-shadow inline
        className
      )}
      style={{
        // Combina shadow-cinema + inset-bisel + emissive lime glow sutil pra
        // dar luminance lift sem competir com hairline-alpha externa.
        boxShadow: [
          'var(--shadow-cinema)',
          'var(--shadow-inset-bisel)',
          '0 0 24px oklch(94% 0.22 124 / 0.18)',
        ].join(', '),
        // Border tint emissive lime na esquerda (Huly signature) via gradient mask
        // sobreposto na borda standard glass-panel. Subtle.
        borderImage:
          'linear-gradient(135deg, oklch(94% 0.22 124 / 0.35) 0%, oklch(100% 0 0 / 0.06) 30%, oklch(100% 0 0 / 0.06) 100%) 1',
      }}
    >
      {/* === Background Layer 1 — Caustic gradient SVG procedural ===
          Radial concentrico bottom-left lime + linear sweep top-right emissive.
          Mix-blend screen pra adicionar luminance sem clarear texto por cima. */}
      <svg
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="hgc-caustic-radial" cx="20%" cy="85%" r="80%">
            <stop offset="0%" stopColor="oklch(94% 0.22 124 / 0.32)" />
            <stop offset="40%" stopColor="oklch(94% 0.22 124 / 0.12)" />
            <stop offset="75%" stopColor="oklch(94% 0.22 124 / 0.02)" />
            <stop offset="100%" stopColor="oklch(94% 0.22 124 / 0)" />
          </radialGradient>
          <linearGradient id="hgc-caustic-sweep" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(94% 0.22 124 / 0.18)" />
            <stop offset="50%" stopColor="oklch(94% 0.22 124 / 0.04)" />
            <stop offset="100%" stopColor="oklch(94% 0.22 124 / 0)" />
          </linearGradient>
          {/* Grain noise mais visivel que o site-wide (8% vs 4%) — confere texture
              ao glass refraction. */}
          <filter id="hgc-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              stitchTiles="stitch"
              seed="11"
            />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" />
          </filter>
        </defs>
        <rect width="400" height="500" fill="url(#hgc-caustic-radial)" />
        <rect
          width="400"
          height="500"
          fill="url(#hgc-caustic-sweep)"
          style={{ mixBlendMode: 'screen' }}
        />
        <rect width="400" height="500" filter="url(#hgc-grain)" opacity="0.08" />
      </svg>

      {/* === Background Layer 2 — Top-edge highlight inset (white/lime alpha) ===
          Reinforca o bisel sem usar box-shadow (que ja esta saturado de layers). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, oklch(94% 0.22 124 / 0) 0%, oklch(94% 0.22 124 / 0.45) 30%, oklch(100% 0 0 / 0.18) 60%, oklch(94% 0.22 124 / 0) 100%)',
        }}
      />

      {/* === Background Layer 3 — Glow border pulse loop ===
          box-shadow inset alpha lime que pulsa 0.4 → 0.7 → 0.4 em 4s.
          Motion 12 animate prop (sem state). */}
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        {...(reduced === null || reduced
          ? {}
          : {
              animate: {
                boxShadow: [
                  'inset 0 0 0 1px oklch(94% 0.22 124 / 0.4)',
                  'inset 0 0 0 1px oklch(94% 0.22 124 / 0.7)',
                  'inset 0 0 0 1px oklch(94% 0.22 124 / 0.4)',
                ],
              },
              transition: {
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut' as const,
              },
            })}
        style={{
          boxShadow: 'inset 0 0 0 1px oklch(94% 0.22 124 / 0.4)',
        }}
      />

      {/* === Content Idle Parallax wrapper ===
          translateY -2px → +2px slow loop 8s (Lando Norris parallax sutil).
          Reduced-motion: estatico. */}
      <m.div
        {...(reduced === null || reduced
          ? {}
          : {
              animate: { y: [-2, 2, -2] },
              transition: {
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut' as const,
              },
            })}
        className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6"
      >
        {/* === Header — Status mono ===
            ✺ glyph lime + label uppercase tracking-widest + dot pulsante 6px */}
        <header className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="text-(--color-accent) text-base leading-none"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            ✺
          </span>
          <span
            className={cn(
              'font-mono uppercase tracking-widest text-(--color-accent)',
              'flex items-center gap-2'
            )}
            style={{ fontSize: 'var(--text-2xs)', fontWeight: 500 }}
          >
            Ativo · Construindo
            <span
              aria-hidden="true"
              className="relative inline-flex h-1.5 w-1.5 rounded-full bg-(--color-accent)"
            >
              {/* Pulsing dot ring */}
              <m.span
                className="absolute inset-0 rounded-full bg-(--color-accent)"
                {...(reduced === null || reduced
                  ? {}
                  : {
                      animate: { scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] },
                      transition: {
                        duration: 1.8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'easeOut' as const,
                      },
                    })}
              />
            </span>
          </span>
        </header>

        {/* === Body — Bloco grande STACK ATIVO + rotating lines ===
            Centralizado vertical via flex-1 + justify-center. */}
        <div className="flex flex-1 flex-col justify-center gap-5 py-6">
          <div
            className="font-mono uppercase text-(--color-accent)"
            style={{
              fontSize: 'clamp(1.5rem, 2.2vw + 1rem, 2.25rem)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textShadow: '0 0 24px oklch(94% 0.22 124 / 0.35)',
            }}
          >
            Stack
            <br />
            Ativo
          </div>

          {/* Rotating micro-lines — CSS-only stacked absolute, cada line tem
              animation-delay escalonado. Reduced-motion: mostra apenas a primeira. */}
          <div className="relative h-4 overflow-hidden" aria-live="off">
            {STACK_LINES.map((line, idx) => {
              const reducedMode = reduced === null || reduced;
              return (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: lines são estáveis e únicas
                  key={idx}
                  aria-hidden={reducedMode && idx > 0 ? 'true' : undefined}
                  className={cn(
                    'absolute inset-x-0 top-0 font-mono uppercase text-(--color-text-2)',
                    'truncate'
                  )}
                  style={{
                    fontSize: 'var(--text-2xs)',
                    letterSpacing: 'var(--tracking-wide)',
                    opacity: reducedMode ? (idx === 0 ? 1 : 0) : 0,
                    animation: reducedMode
                      ? undefined
                      : `hgc-line-cycle ${CYCLE_DURATION}s linear infinite`,
                    animationDelay: reducedMode
                      ? undefined
                      : `${idx * (CYCLE_DURATION / STACK_LINES.length)}s`,
                  }}
                >
                  {line}
                </span>
              );
            })}
          </div>

          {/* Keyframes inline — hgc-line-cycle: cada linha tem janela de visibilidade
              de STEP%, fade out 0.5s antes do proximo, hidden no resto do loop. */}
          <style>{`
            @keyframes hgc-line-cycle {
              0% { opacity: 0; transform: translateY(4px); }
              2% { opacity: 1; transform: translateY(0); }
              ${(STEP - 4).toFixed(2)}% { opacity: 1; transform: translateY(0); }
              ${STEP.toFixed(2)}% { opacity: 0; transform: translateY(-4px); }
              100% { opacity: 0; transform: translateY(-4px); }
            }
          `}</style>
        </div>

        {/* === Footer — ✺ + timestamp BRT + version ===
            Hairline divider acima, mono tabular-nums, text-2xs. */}
        <footer
          className="flex items-center justify-between gap-3 pt-3"
          style={{
            borderTop: '1px solid var(--color-hairline-alpha)',
          }}
        >
          <span
            aria-hidden="true"
            className="text-(--color-accent) leading-none"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)' }}
          >
            ✺ 001
          </span>
          <span
            className="font-mono text-(--color-text-3)"
            style={{ fontSize: 'var(--text-2xs)', fontVariantNumeric: 'tabular-nums' }}
          >
            03:42 BRT
          </span>
          <span
            className="font-mono text-(--color-text-3)"
            style={{ fontSize: 'var(--text-2xs)', fontVariantNumeric: 'tabular-nums' }}
          >
            v1.0
          </span>
        </footer>
      </m.div>

      {/* === Fallback @supports — backdrop-filter ausente vira solid surface-elevated ===
          Safari old / Firefox sem feature → glass-panel deixa fundo transparente
          sem blur. Aqui forca surface solido pra nao quebrar contraste interno. */}
      <style>{`
        @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
          [data-slot="hero-glass-card"] {
            background-color: var(--color-surface-elevated) !important;
          }
        }
      `}</style>
    </m.div>
  );
}
