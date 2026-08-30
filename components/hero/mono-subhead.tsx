import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Subhead mono — server component, sem animacao (animation era unreliable em
// React 19 + concurrent: gsap.from quebrava, Motion 12 m.p invisivel em algumas
// hydration races). Subhead estatico aparece sempre. Performance > delight aqui.

interface MonoSubheadProps {
  children: ReactNode;
  className?: string;
}

export function MonoSubhead({ children, className }: MonoSubheadProps) {
  return (
    <p
      data-slot="mono-subhead"
      className={cn('max-w-prose font-mono text-sm sm:text-base', className)}
      style={{
        // F4 (2026-08-29): text-2 (oklch 75%) sobre o poster/video claro dava
        // 1.86:1 no mobile e 3.78:1 no desktop (medido pixel a pixel em
        // _audit/f4/logs/media-contrast.json — min AA = 4.5). Duas mudancas de
        // causa-raiz, nao cosmeticas:
        //   1. a mascara da midia agora cai nesta faixa (hero-media-mask);
        //   2. o subhead sobe pra text-1. E a linha de proposta de valor do
        //      site — hierarquia ja esta dada por tamanho (14/16px vs 60/80px)
        //      e por familia (mono vs display), nao precisa ser dada por cor.
        color: 'var(--color-text-1)',
        // Scrim tipografico: halo CURTO e denso colado no glifo vence fundo
        // texturizado melhor que um unico brilho largo (o de 16px se dilui
        // sobre a onda). Tres raios pequenos + um medio de apoio.
        textShadow: [
          '0 0 1px color-mix(in oklch, var(--color-bg) 92%, transparent)',
          '0 1px 2px color-mix(in oklch, var(--color-bg) 88%, transparent)',
          '0 0 6px color-mix(in oklch, var(--color-bg) 72%, transparent)',
          '0 0 18px color-mix(in oklch, var(--color-bg) 55%, transparent)',
        ].join(', '),
      }}
    >
      {children}
    </p>
  );
}
