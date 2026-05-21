import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Editorial accent — italic PP Editorial lime. ÚNICO momento editorial-italic do site.
// Sem underline (decisão pós-auditoria 2026-05-21: SVG underline duplicava em wrap +
// virava "link rotulado" no inconsciente). Italic + cor lime + PP Editorial já carregam
// o stripe pattern editorial sozinhos. Server component agora (sem GSAP/SVG/refs).

interface EditorialAccentProps {
  children: ReactNode;
  className?: string;
}

export function EditorialAccent({ children, className }: EditorialAccentProps) {
  return (
    <em
      className={cn('not-italic', className)}
      style={{
        fontFamily: 'var(--font-editorial)',
        fontStyle: 'italic',
        fontWeight: 400,
        color: 'var(--color-accent)',
      }}
    >
      {children}
    </em>
  );
}
