'use client';

import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';
import { useAnchorScroll } from '@/lib/scroll/anchor-scroll';

// Link reutilizável pra in-page anchors. Intercepta click e usa Lenis quando disponível.
// Pode ser usado dentro de RSCs (boundary client-only fica isolado neste componente).
//
// W4.1 (2026-05-23): suporta hrefs absolute `/#x` além de `#x`. Smooth scroll
// só dispara quando estamos NA home (pathname === '/'). Em outras rotas, deixa
// o browser navegar nativamente pra home + scroll via hash.

interface AnchorLinkProps extends Omit<ComponentProps<'a'>, 'onClick'> {
  href: string;
}

function extractAnchor(href: string): string | null {
  if (href.startsWith('#')) return href;
  if (href.startsWith('/#')) return href.slice(1);
  return null;
}

export function AnchorLink({ href, children, ...props }: AnchorLinkProps) {
  const scroll = useAnchorScroll();
  const pathname = usePathname();

  return (
    <a
      href={href}
      onClick={(e) => {
        const anchor = extractAnchor(href);
        if (anchor && pathname === '/') {
          e.preventDefault();
          scroll(anchor);
        }
      }}
      {...props}
    >
      {children}
    </a>
  );
}
