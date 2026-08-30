import type { ReactNode } from 'react';

// Chrome compartilhado dos case studies. W-design (2026-05-26): removido o
// back-link "Voltar para o trabalho" do layout — era redundante em /work
// (você já ESTÁ em /work) e duplicado nas case pages (CaseStudyHero já tem
// "← Outros cases"). TopBarNav global cuida da navegação principal.

export default function WorkLayout({ children }: { children: ReactNode }) {
  return <div data-slot="work-layout">{children}</div>;
}
