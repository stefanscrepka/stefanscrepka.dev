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
      className={cn('max-w-prose font-mono text-sm sm:text-base', className)}
      style={{ color: 'var(--color-text-2)' }}
    >
      {children}
    </p>
  );
}
