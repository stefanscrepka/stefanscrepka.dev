import { ImageResponse } from 'next/og';

// OG image template helper — usado pelo /opengraph-image.tsx da home e
// de cada case study. 1200×630 (Twitter/LinkedIn/OG canonical).
// Sem custom fonts (system stack) pra evitar edge fetch falhar build.
//
// Cores hex compiladas dos OKLCH (next/og roda no edge sem CSS vars).

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = 'image/png' as const;

interface OgImageOptions {
  eyebrow: string;
  title: string;
  tagline: string;
  tone?: 'lime' | 'amber';
}

const TONE_HEX = {
  lime: '#D2FF00',
  amber: '#F5B847',
} as const;

export function renderOgImage({ eyebrow, title, tagline, tone = 'lime' }: OgImageOptions) {
  const accent = TONE_HEX[tone];

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#080A07',
        color: '#FAFAFA',
        padding: '72px 88px',
        position: 'relative',
        fontFamily:
          '"Inter", "Geist Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Subtle radial accent glow */}
      <div
        style={{
          position: 'absolute',
          top: '-220px',
          right: '-220px',
          width: '700px',
          height: '700px',
          background: `radial-gradient(circle, ${accent}40 0%, transparent 60%)`,
          opacity: 0.5,
          display: 'flex',
        }}
      />

      {/* Top bar — monograma + dominio */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '72px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: accent,
              color: '#080A07',
              fontSize: '22px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              letterSpacing: '-0.04em',
            }}
          >
            S/H
          </div>
          <span
            style={{
              fontFamily: '"Geist Mono", "JetBrains Mono", ui-monospace, monospace',
              fontSize: '14px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#8C8E8B',
              display: 'flex',
            }}
          >
            stefanscrepka.dev
          </span>
        </div>
        <span
          style={{
            fontFamily: '"Geist Mono", ui-monospace, monospace',
            fontSize: '14px',
            color: accent,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          {eyebrow}
        </span>
      </div>

      {/* Title block */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <h1
          style={{
            fontSize: title.length > 30 ? '64px' : '80px',
            lineHeight: 1,
            letterSpacing: '-0.035em',
            fontWeight: 600,
            margin: 0,
            color: '#FAFAFA',
            display: 'flex',
            maxWidth: '1024px',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: '28px',
            lineHeight: 1.35,
            color: '#BFC1BE',
            margin: 0,
            maxWidth: '900px',
            display: 'flex',
          }}
        >
          {tagline}
        </p>
      </div>

      {/* Bottom bar — accent bar + label */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginTop: '48px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '4px',
            borderRadius: '2px',
            background: accent,
            display: 'flex',
          }}
        />
        <span
          style={{
            fontFamily: '"Geist Mono", ui-monospace, monospace',
            fontSize: '15px',
            color: '#8C8E8B',
            letterSpacing: '0.04em',
            display: 'flex',
          }}
        >
          AI Product Engineer · Ponta Grossa, PR
        </span>
      </div>
    </div>,
    { ...OG_SIZE }
  );
}
