import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

// Monograma S/H custom — geometria industrial (heritage Eletrotécnica via forma, não copy).
// Usa currentColor pra cascatar a cor do parent. Stroke 1.8 dá peso de hardware sem brutalismo.

interface SHMonogramProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: number;
}

export function SHMonogram({ size = 28, className, ...props }: SHMonogramProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="Stefan Heinz Screpka"
      className={cn('shrink-0', className)}
      {...props}
    >
      {/* S — meia esquerda, curva sigmoide */}
      <path
        d="M12 5
           Q 4 5 4 9
           Q 4 12 8 13.2
           Q 12 14.4 12 17.6
           Q 12 22 4 22"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* H — meia direita, duas verticais + travessão */}
      <path
        d="M20 5 V22 M28 5 V22 M20 13.5 H28"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
