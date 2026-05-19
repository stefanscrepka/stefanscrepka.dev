import Link from 'next/link';
import { CaseStudyCover } from '@/components/work/case-study-cover';
import { CASE_STUDIES, type CaseStudy } from '@/lib/work/data';
import { FeaturedWorkReveal } from './featured-work.client';

// Featured Work — Apple-style tile rhythm.
// 1 hero tile full-bleed (Content Engine) + 2 half-tiles (NexaCore | STJ App).
// Anti-AI-slop: NÃO repetir grid 3-col uniforme com Process abaixo.

export function FeaturedWorkSection() {
  const contentEngine = CASE_STUDIES['content-engine'];
  const nexacore = CASE_STUDIES.nexacore;
  const stjApp = CASE_STUDIES['stj-app'];

  return (
    <section id="work" className="container-max section-pad-y border-t border-(--color-hairline)">
      <header className="mb-12 flex flex-col gap-3 sm:mb-16">
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
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Hero tile — Content Engine FULL-BLEED */}
          <HeroTile caseStudy={contentEngine} />

          {/* Half-tile pair — NexaCore + STJ App */}
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
            <HalfTile caseStudy={nexacore} />
            <HalfTile caseStudy={stjApp} />
          </div>
        </div>
      </FeaturedWorkReveal>
    </section>
  );
}

/* ============================================================
   Hero tile — Content Engine. Grid 60/40 cover + text.
   ============================================================ */

function HeroTile({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <Link
      href={`/work/${caseStudy.slug}`}
      data-reveal
      className="group/hero-tile relative grid overflow-hidden rounded-2xl border border-(--color-hairline) bg-(--color-surface) p-6 outline-none transition-[border-color,transform,box-shadow] duration-(--motion-fast) hover:border-(--color-accent) hover:shadow-(--shadow-glow-lime-sm) focus-visible:border-(--color-accent) sm:p-8 lg:grid-cols-[1.3fr_1fr] lg:gap-8"
    >
      {/* Cover */}
      <div className="relative">
        <CaseStudyCover caseStudy={caseStudy} aspectRatio="16/10" tilt="cinema" />
      </div>

      {/* Copy */}
      <div className="flex flex-col gap-4 pt-2 lg:py-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-(--color-accent)">
          ↳ FLAGSHIP · {caseStudy.status.toUpperCase()}
        </p>
        <h3 className="text-2xl font-semibold leading-tight tracking-tight text-(--color-text-1) sm:text-3xl lg:text-4xl">
          {caseStudy.title}
        </h3>
        <p className="text-base leading-relaxed text-(--color-text-2)">{caseStudy.tagline}</p>

        {/* Tag chips — taxonomy estilo Midu/Nubien */}
        <ul className="mt-1 flex flex-wrap gap-1.5">
          {['Claude SDK', '22 agentes', '5 squads', 'HITL Telegram', 'pgvector'].map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-(--color-hairline-strong) bg-(--color-surface-elevated) px-2.5 py-1 font-mono text-[11px] text-(--color-text-3)"
            >
              {tag}
            </li>
          ))}
        </ul>

        <p className="mt-auto inline-flex items-center gap-2 pt-4 font-mono text-sm text-(--color-accent)">
          Ver case study completo →
        </p>
      </div>
    </Link>
  );
}

/* ============================================================
   Half tile — NexaCore + STJ App. Cover full width + text below.
   ============================================================ */

function HalfTile({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <Link
      href={`/work/${caseStudy.slug}`}
      data-reveal
      className="group/half-tile flex flex-col gap-5 rounded-2xl border border-(--color-hairline) bg-(--color-surface) p-6 outline-none transition-[border-color,transform,box-shadow] duration-(--motion-fast) hover:-translate-y-1 hover:border-(--color-accent) hover:shadow-(--shadow-glow-lime-sm) focus-visible:-translate-y-1 focus-visible:border-(--color-accent)"
    >
      <CaseStudyCover caseStudy={caseStudy} aspectRatio="16/10" tilt="subtle" />

      <p className="font-mono text-[11px] uppercase tracking-widest text-(--color-text-3)">
        {caseStudy.status}
      </p>
      <h3 className="text-xl font-semibold leading-tight tracking-tight text-(--color-text-1) sm:text-2xl">
        {caseStudy.title}
      </h3>
      <p className="text-sm leading-relaxed text-(--color-text-2)">{caseStudy.shortLine}</p>

      <p className="mt-auto inline-flex items-center gap-1.5 font-mono text-xs text-(--color-accent)">
        Ver case study →
      </p>
    </Link>
  );
}
