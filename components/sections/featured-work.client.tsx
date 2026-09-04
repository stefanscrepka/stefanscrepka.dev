'use client';

import { useEffect } from 'react';

// Controlador do reveal do Featured Work — F5 (2026-09-02).
//
// Antes: island Motion (`m.div` + variants + useInView) que ENVOLVIA os tiles
// via children — o reveal era o único motivo de `m.*` nesta seção. Agora o
// reveal é CSS (globals.css, `[data-reveal-item]`) e este componente só troca
// `data-reveal="pending"` → `"in"` no grupo quando ele entra na viewport
// (mesmo gatilho do useInView anterior: once + margin -120px embaixo). Os
// tiles ficam na árvore RSC e a home perde mais um `m.*`.
//
// Nota de método (claim↔evidência): uma sonda inicial sugeria que o island
// impedia o par do <ViewTransition name="case-title-…"> na navegação
// home → case. Era a sonda: o `page.click` do Playwright rola o link e o
// React só pareia boundaries VISÍVEIS (measureInstance().view). Com clique
// sem auto-scroll (_audit/f5/probe-vt5.mjs) o par fecha — o island não era
// a causa. A troca fica pelo mérito próprio (menos JS, tiles em RSC).
// Sem JS: <noscript> em featured-work.tsx mostra tudo.

const GROUP = '[data-slot="featured-work"] [data-reveal-group]';

export function FeaturedWorkRevealController() {
  useEffect(() => {
    const group = document.querySelector<HTMLElement>(GROUP);
    if (!group) return;
    const show = () => {
      group.dataset.reveal = 'in';
    };
    // Já passou do grupo antes da hidratação (rolou rápido): mostra direto,
    // senão o IO nunca dispara e os tiles ficariam invisíveis.
    if (group.getBoundingClientRect().bottom < 0 || typeof IntersectionObserver === 'undefined') {
      show();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          show();
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -120px 0px' }
    );
    io.observe(group);
    return () => io.disconnect();
  }, []);

  return null;
}
