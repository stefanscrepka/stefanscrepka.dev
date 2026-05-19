'use client';

import type { ComponentProps } from 'react';
import { useAnchorScroll } from '@/lib/scroll/anchor-scroll';

// Link reutilizável pra in-page anchors. Intercepta click e usa Lenis quando disponível.
// Pode ser usado dentro de RSCs (boundary client-only fica isolado neste componente).

interface AnchorLinkProps extends Omit<ComponentProps<'a'>, 'onClick'> {
  href: string;
}

export function AnchorLink({ href, children, ...props }: AnchorLinkProps) {
  const scroll = useAnchorScroll();

  return (
    <a
      href={href}
      onClick={(e) => {
        if (href.startsWith('#')) {
          e.preventDefault();
          scroll(href);
        }
      }}
      {...props}
    >
      {children}
    </a>
  );
}
