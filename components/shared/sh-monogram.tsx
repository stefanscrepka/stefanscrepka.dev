import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';
import { SH_PATH_H, SH_PATH_S, SH_PATH_SIGNAL } from './sh-monogram-paths';

// SH single-glyph monogram — v3 (2026-05-24).
// Source: Logos-Stefan/Primary.png → Vectorizer.ai → sanitized.
// Cores: currentColor (S + H) + var(--sh-accent, #D2FF00) (signal point lime).
// Tokens em 0 0 1024 1024 (paths em escala natural do raster).

interface SHMonogramProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: number;
  /** Quando true, o SVG é decorativo (aria-hidden) — sem role/aria-label/title.
      Use em contextos onde o componente pai já provê accessible name (link/button
      com aria-label), pra evitar label-content-name-mismatch do Lighthouse. */
  decorative?: boolean;
}

export function SHMonogram({
  size = 28,
  className,
  style,
  decorative = false,
  ...rest
}: SHMonogramProps) {
  if (decorative) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 1024 1024"
        aria-hidden="true"
        focusable="false"
        className={cn('shrink-0', className)}
        style={style}
        {...rest}
      >
        <g fill="currentColor">
          <path d={SH_PATH_S} />
          <path d={SH_PATH_H} />
        </g>
        <path fill="var(--sh-accent, #D2FF00)" d={SH_PATH_SIGNAL} />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      role="img"
      aria-label="Stefan Heinz Screpka"
      className={cn('shrink-0', className)}
      style={style}
      {...rest}
    >
      <title>Stefan Heinz Screpka</title>
      <g fill="currentColor">
        <path d={SH_PATH_S} />
        <path d={SH_PATH_H} />
      </g>
      <path fill="var(--sh-accent, #D2FF00)" d={SH_PATH_SIGNAL} />
    </svg>
  );
}
