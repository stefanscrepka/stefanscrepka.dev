import Link from 'next/link';
import type { ReactNode } from 'react';

// Chrome compartilhado dos case studies: back-link sutil topo-esquerdo. Renderiza
// abaixo do FloatingDock global (já provido pelo root layout.tsx).

export default function WorkLayout({ children }: { children: ReactNode }) {
  return (
    <div data-slot="work-layout">
      <div className="container-max pt-28 pb-4">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-(--color-text-3) outline-none transition-colors hover:text-(--color-accent) focus-visible:text-(--color-accent)"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-3" aria-hidden="true">
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Voltar para o trabalho
        </Link>
      </div>
      {children}
    </div>
  );
}
