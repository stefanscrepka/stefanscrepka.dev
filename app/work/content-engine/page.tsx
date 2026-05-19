import type { Metadata } from 'next';
import { CaseStudyHero } from '@/components/work/case-study-hero';
import { CONTENT_ENGINE_PANELS, ContentEnginePanel } from '@/components/work/content-engine-panels';
import { ScrollPinnedHorizontal } from '@/components/work/scroll-pinned-horizontal';
import { getCaseStudy } from '@/lib/work/data';

const CS = getCaseStudy('content-engine');

export const metadata: Metadata = {
  title: `${CS?.title ?? 'Content Engine'} — Case Study`,
  description: CS?.tagline ?? '',
};

// /work/content-engine — ScrollPinnedHorizontal 7 panels (intro + 5 squads + HITL).
// Mobile: vertical stack natural (matchMedia kill pin). Reduced-motion: same.

export default function ContentEnginePage() {
  if (!CS) return null;

  const panels = CONTENT_ENGINE_PANELS.map((panel, idx) => (
    <ContentEnginePanel
      key={panel.id}
      panel={panel}
      index={idx}
      total={CONTENT_ENGINE_PANELS.length}
    />
  ));

  return (
    <main className="pb-32">
      <CaseStudyHero cs={CS} />

      <ScrollPinnedHorizontal
        panels={panels}
        ariaLabel="Content Engine — 5 squads + HITL"
        showDots
      />

      <section className="container-max mt-20 grid gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <p className="eyebrow">Stack</p>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-(--color-text-2)">
            {CS.stack.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden="true" className="text-(--color-accent)">
                  ·
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <p className="eyebrow">Squads em detalhe</p>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-(--color-text-2)">
            {CS.details.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden="true" className="text-(--color-accent)">
                  ·
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
