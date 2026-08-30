import Image from 'next/image';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ProductMockup — premium frame pra screenshots reais (PNGs entregues pelo Stefan).
//
// Tratamento Apple/Huly:
//   - Border radius 18px (var(--radius-2xl))
//   - 3-layer cinema shadow (var(--shadow-cinema))
//   - Inset highlight 1px rgba(255,255,255,0.06)
//   - Frame opcional:
//       'browser' — 3 dots macOS-style topo (use quando print é puro viewport
//                   sem chrome próprio, ex: NexaCore dashboard)
//       'device'  — notch pill centro topo (mobile/PWA)
//       'bare'    — sem chrome, só radius+shadow+glow. Linear/Stripe style.
//                   Use quando o print JÁ tem chrome próprio na UI capturada
//                   (ex: STJ-app que tem topbar `stj | Home Tasks Aprovações...`)
//       'none'    — alias legado de 'bare' (mantido pra compat)
//   - Tilt opcional sutil: rotateX(2deg) rotateY(-1deg)
//   - Glow opcional: 'lime' | 'amber' | 'none'
//   - next/image com sizes + preload opcional (case pages: o mockup acima do
//     fold costuma SER o LCP — lá o <link rel=preload> é o hint correto,
//     diferente do HeroTile da home, ver F3.6 em case-study-cover.tsx)
//   - alt obrigatório (acessibilidade)
//
// Para wrappar children custom (diagrams SVG, MacBookScroll content, FlipCards),
// use MockupFrame — primitivo compartilhado abaixo.

interface ProductMockupProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  frame?: 'browser' | 'device' | 'bare' | 'none' | undefined;
  tilted?: boolean | undefined;
  glow?: 'lime' | 'amber' | 'none' | undefined;
  priority?: boolean | undefined;
  className?: string | undefined;
}

export function ProductMockup({
  src,
  alt,
  width,
  height,
  frame = 'none',
  tilted = false,
  glow = 'lime',
  priority = false,
  className,
}: ProductMockupProps) {
  return (
    <MockupFrame frame={frame} tilted={tilted} glow={glow} className={className}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        // W-audit (2026-06-10): `priority` deprecado no Next 16 → `preload`.
        preload={priority}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="h-full w-full object-cover"
      />
    </MockupFrame>
  );
}

/* ============================================================
   MockupFrame — primitivo compartilhado que aplica:
     - radius 2xl + 3-layer cinema shadow + inset highlight 1px
     - chrome opcional (browser dots / device notch / none)
     - tilt opcional sutil 3D
     - glow ambient opcional (lime/amber/none)
   Usado por:
     - ProductMockup (com next/image)
     - ProductCover (legacy children-based wrapper pra diagrams + mockup mode)
   ============================================================ */

interface MockupFrameProps {
  children: ReactNode;
  frame?: 'browser' | 'device' | 'bare' | 'none' | undefined;
  tilted?: boolean | undefined;
  glow?: 'lime' | 'amber' | 'none' | undefined;
  className?: string | undefined;
}

const GLOW_TONE_MAP = {
  lime: 'var(--color-accent-emissive)',
  amber: 'oklch(82% 0.18 75 / 0.4)',
  none: 'transparent',
} as const;

const BORDER_TONE_MAP = {
  lime: 'var(--color-hairline-strong)',
  amber: 'oklch(82% 0.18 75 / 0.3)',
  none: 'var(--color-hairline-strong)',
} as const;

const TOP_GLARE_TONE_MAP = {
  lime: 'var(--color-accent)',
  amber: 'oklch(82% 0.18 75)',
  none: 'oklch(100% 0 0 / 0.2)',
} as const;

export function MockupFrame({
  children,
  frame = 'none',
  tilted = false,
  glow = 'lime',
  className,
}: MockupFrameProps) {
  // Tilt: perspective 3D sutil. Safari fallback automático se transform-style
  // não suportado (degrada para flat sem quebrar).
  const tiltTransform = tilted ? 'perspective(1400px) rotateX(2deg) rotateY(-1deg)' : undefined;

  return (
    <div
      data-slot="product-mockup"
      data-frame={frame}
      data-tilted={tilted ? 'true' : 'false'}
      data-glow={glow}
      className={cn(
        'group/mockup relative w-full',
        '[transform-style:preserve-3d]',
        '[perspective:1400px]',
        className
      )}
    >
      <div
        className={cn(
          // W-fix (2026-05-26): h-full pra propagar altura do parent (aspect-
          // ratio) pros nested divs. Sem isso, <Image fill> colapsa em 0×0
          // porque o ancestral relative+overflow-hidden não tem altura.
          'relative h-full w-full overflow-hidden',
          'rounded-2xl',
          'transition-transform duration-(--motion-modal) ease-(--ease-smooth)'
        )}
        style={{
          transform: tiltTransform,
          border: `1px solid ${BORDER_TONE_MAP[glow]}`,
          boxShadow: [
            'var(--shadow-cinema)',
            glow !== 'none' ? `0 0 60px ${GLOW_TONE_MAP[glow]}` : null,
            // Inset highlight 1px — Linear/Vercel signature.
            'inset 0 1px 0 oklch(100% 0 0 / 0.08)',
            `inset 0 0 0 1px ${
              glow === 'lime'
                ? 'oklch(94% 0.22 124 / 0.06)'
                : glow === 'amber'
                  ? 'oklch(82% 0.18 75 / 0.06)'
                  : 'oklch(100% 0 0 / 0.06)'
            }`,
          ]
            .filter(Boolean)
            .join(', '),
        }}
      >
        {/* Frame chrome */}
        {frame === 'browser' ? <BrowserChrome /> : null}
        {frame === 'device' ? <DeviceNotch /> : null}

        {/* Content area — flex pra preencher resto após chrome */}
        <div
          className={cn(
            'relative w-full overflow-hidden',
            frame === 'browser' && 'rounded-b-[14px]',
            frame === 'device' && 'rounded-[14px]'
          )}
          style={{
            height: frame === 'browser' ? 'calc(100% - 28px)' : '100%',
          }}
        >
          {children}
        </div>

        {/* Top glare — subtle highlight line topo do mockup (glass shimmer) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${TOP_GLARE_TONE_MAP[glow]} 50%, transparent)`,
            opacity: 0.4,
          }}
        />
      </div>

      {/* Floor reflection — gradiente suave sob o mockup (só com tilt) */}
      {tilted && glow !== 'none' ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-4 left-1/2 h-8 w-3/4 -translate-x-1/2 opacity-30 blur-2xl"
          style={{
            background: `radial-gradient(ellipse at center, ${GLOW_TONE_MAP[glow]} 0%, transparent 70%)`,
          }}
        />
      ) : null}
    </div>
  );
}

/* ============================================================
   Browser chrome — barra superior com 3 dots (macOS-style)
   ============================================================ */

function BrowserChrome() {
  return (
    <div
      aria-hidden="true"
      className="flex h-7 items-center gap-1.5 border-b px-3"
      style={{
        backgroundColor: 'var(--color-surface-overlay)',
        borderColor: 'var(--color-hairline-strong)',
      }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: 'oklch(65% 0.20 10 / 0.7)' }}
      />
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: 'oklch(80% 0.18 100 / 0.7)' }}
      />
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: 'oklch(75% 0.15 142 / 0.7)' }}
      />
    </div>
  );
}

/* ============================================================
   Device notch — pill superior central (mobile/PWA)
   ============================================================ */

function DeviceNotch() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1.5 z-10 h-1 w-16 -translate-x-1/2 rounded-full"
      style={{ backgroundColor: 'var(--color-bg)' }}
    />
  );
}
