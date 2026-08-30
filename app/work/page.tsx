import type { Metadata } from 'next';
import Link from 'next/link';
import { CaseStudyCover } from '@/components/work/case-study-cover';
import { CASE_STUDIES, CASE_STUDY_SLUGS } from '@/lib/work/data';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Quatro produtos com escopo real. Content Engine multi-agente, NexaCore SaaS clínicas, STJ App PWA cockpit, Estética MD site institucional. Stack honest, escopo entregue.',
};

// Index gallery dos 4 case studies + link pra cada page detalhe.
// F3.3 (2026-06-11): página estática sem loading.tsx — conteúdo inteiro no
// HTML (CLS 0). Transição de rota = page-fade da raiz (app/layout.tsx).
export default function WorkIndexPage() {
  return (
    <section className="container-max pt-32 pb-24 sm:pt-36">
      <header className="mb-12 flex flex-col gap-3">
        <p className="eyebrow">/work</p>
        <h1 className="text-4xl font-semibold sm:text-5xl lg:text-6xl !leading-[1.02] !tracking-[-0.03em]">
          Quatro produtos.
          <br />
          Escopo real.
        </h1>
        <p className="mt-2 max-w-prose text-reading text-(--color-text-2)">
          Três SaaS em produção (Content Engine, NexaCore, STJ App) + Estética MD, primeiro produto
          antes do React. Cada case documentado com stack honest, escopo entregue e o que aprendi no
          processo.
        </p>
      </header>

      <ul className="grid gap-6 md:grid-cols-2">
        {CASE_STUDY_SLUGS.map((slug) => {
          const cs = CASE_STUDIES[slug];
          return (
            <li key={slug}>
              <Link
                href={`/work/${slug}`}
                className="group/work-card block h-full rounded-2xl border border-(--color-hairline) bg-(--color-surface) p-6 shadow-(--shadow-inset-bisel) outline-none transition-[border-color,transform,box-shadow] duration-(--motion-fast) hover:-translate-y-1 hover:border-(--color-accent) hover:shadow-[var(--shadow-inset-bisel),var(--shadow-glow-lime-sm)] focus-visible:-translate-y-1 focus-visible:border-(--color-accent) focus-visible:shadow-[var(--shadow-inset-bisel),var(--shadow-glow-lime-sm)]"
              >
                <CaseStudyCover caseStudy={cs} aspectRatio="16/10" className="mb-5" />
                <p className="font-mono text-[11px] uppercase tracking-widest text-(--color-text-3)">
                  {cs.status}
                </p>
                <h2 className="mt-2 text-xl font-semibold !tracking-[-0.02em] !leading-[1.15] text-(--color-text-1)">
                  {cs.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-(--color-text-2)">{cs.shortLine}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-(--color-accent)">
                  Ver case study →
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
