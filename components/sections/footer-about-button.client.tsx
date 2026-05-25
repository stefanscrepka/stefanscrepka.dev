'use client';

import { cn } from '@/lib/utils';

// W-a11y crítico #2: "About this site" trigger isolado em client component
// porque Footer (server) não suporta onClick. Antes era <Link href="#about-this-site">
// — screen reader anunciava "link" mas a ação é abrir dialog. Agora é
// <button aria-haspopup="dialog"> que pusha o hash via history.pushState
// (mantém deep-linkable: visitar /#about-this-site abre o modal direto).

export function FooterAboutButton() {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() => {
        if (typeof window === 'undefined') return;
        history.pushState(null, '', '#about-this-site');
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }}
      className={cn(
        'inline-flex items-center gap-1 py-2 sm:py-0 outline-none transition-colors',
        'duration-(--motion-fast) ease-(--ease-standard)',
        'hover:text-(--color-accent) focus-visible:text-(--color-accent)'
      )}
    >
      About this site →
    </button>
  );
}
