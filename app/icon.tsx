import { ImageResponse } from 'next/og';

// Favicon dinâmico — Next 16 file convention. 32×32 PNG via ImageResponse.
// Monograma S/H em lime sobre base #080A07.

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080A07',
        color: '#D2FF00',
        fontFamily: '"Geist Sans", "Inter", system-ui, sans-serif',
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: '-0.04em',
        borderRadius: 4,
      }}
    >
      S/
    </div>,
    { ...size }
  );
}
