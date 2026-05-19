import { ImageResponse } from 'next/og';

// Apple touch icon — 180×180 PNG via ImageResponse.
// Monograma S/H em lime sobre base com radial accent glow.

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080A07',
        position: 'relative',
        fontFamily: '"Geist Sans", "Inter", system-ui, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 30% 30%, rgba(210,255,0,0.18) 0%, transparent 60%)',
          display: 'flex',
        }}
      />
      <span
        style={{
          color: '#D2FF00',
          fontSize: 92,
          fontWeight: 700,
          letterSpacing: '-0.05em',
          display: 'flex',
        }}
      >
        S/H
      </span>
    </div>,
    { ...size }
  );
}
