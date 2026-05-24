import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';
import { SH_PATH_H, SH_PATH_S, SH_PATH_SIGNAL } from './sh-monogram-paths';

// SH single-glyph monogram — v3 (2026-05-24).
// Source: Logos-Stefan/Primary.png → Vectorizer.ai → sanitized.
// Cores: currentColor (S + H) + var(--sh-accent, #D2FF00) (signal point lime).
// Tokens em 0 0 1024 1024 (paths em escala natural do raster).

interface SHMonogramProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: number;
}

export function SHMonogram({ size = 28, className, style, ...rest }: SHMonogramProps) {
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
