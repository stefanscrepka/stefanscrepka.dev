import type { Metadata } from 'next';
import { MacBookScroll } from '@/components/ui-effects/macbook-scroll';
import { CaseStudyCover } from '@/components/work/case-study-cover';
import { CaseStudyHero } from '@/components/work/case-study-hero';
import { getCaseStudy } from '@/lib/work/data';

const CS = getCaseStudy('nexacore');

export const metadata: Metadata = {
  title: `${CS?.title ?? 'NexaCore'} — Case Study`,
  description: CS?.tagline ?? '',
};

// /work/nexacore — MacBookScroll Aceternity-style com screenshot do admin real
// (placeholder até Stefan drop o PNG). Bullets stack abaixo.

export default function NexaCorePage() {
  if (!CS) return null;

  return (
    <main className="pb-32">
      <CaseStudyHero cs={CS} />

      <MacBookScroll
        title={
          <p className="font-mono text-xs uppercase tracking-widest text-(--color-text-3)">
            Admin dashboard · striveos.shop
          </p>
        }
        screen={
          <CaseStudyCover caseStudy={CS} aspectRatio="16/10" tilt="none" className="border-0" />
        }
      />

      <div className="container-max mt-12 grid gap-12 lg:mt-20 lg:grid-cols-2">
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
          <p className="eyebrow">Detalhes que valem</p>
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
      </div>
    </main>
  );
}
