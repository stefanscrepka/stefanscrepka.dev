import Link from 'next/link';
import { ScreenshotPlaceholder } from '@/components/work/screenshot-placeholder';
import { CASE_STUDIES } from '@/lib/work/data';
import { FeaturedWorkReveal } from './featured-work.client';

// Home Section 4-6 condensado — 3 preview cards (Content Engine, NexaCore, STJ App)
// linkando para case studies completos em /work/{slug}.
// Decisão: spec 02 pedia case studies EMBEDADOS no home (~630vh somados), mas isso
// quebra UX scroll. Convergi pra preview cards no home + páginas detalhe em /work/.

const FEATURED_SLUGS = ['content-engine', 'nexacore', 'stj-app'] as const;

export function FeaturedWorkSection() {
  return (
    <section id="work" className="container-max section-pad-y border-t border-(--color-hairline)">
      <header className="mb-10 flex flex-col gap-3 sm:mb-14">
        <p className="eyebrow">FEATURED WORK</p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Três produtos · três posturas
        </h2>
        <p className="max-w-prose text-(--color-text-2) leading-relaxed">
          Content Engine resolve volume + variedade com multi-agente. NexaCore entrega produto
          inteiro pra clínicas. STJ App é cockpit operacional PWA. Cada um documentado com escopo
          real e detalhes técnicos.
        </p>
      </header>

      <FeaturedWorkReveal>
        <ul className="grid gap-6 md:grid-cols-3">
          {FEATURED_SLUGS.map((slug) => {
            const cs = CASE_STUDIES[slug];
            return (
              <li key={slug} data-reveal>
                <Link
                  href={`/work/${slug}`}
                  className="group/featured block h-full rounded-2xl border border-(--color-hairline) bg-(--color-surface) p-6 outline-none transition-[border-color,transform,box-shadow] duration-(--motion-fast) hover:-translate-y-1 hover:border-(--color-accent) hover:shadow-(--shadow-glow-lime-sm) focus-visible:-translate-y-1 focus-visible:border-(--color-accent) focus-visible:shadow-(--shadow-glow-lime-sm)"
                >
                  <ScreenshotPlaceholder
                    label={cs.title}
                    tone={cs.accent}
                    aspectRatio="16/10"
                    className="mb-5"
                  />
                  <p className="font-mono text-[11px] uppercase tracking-widest text-(--color-text-3)">
                    {cs.status}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-(--color-text-1) sm:text-xl">
                    {cs.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-(--color-text-2)">
                    {cs.shortLine}
                  </p>
                  <p className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-(--color-accent)">
                    Ver case study →
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </FeaturedWorkReveal>
    </section>
  );
}
