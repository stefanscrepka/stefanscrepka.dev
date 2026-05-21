import Link from 'next/link';
import { CaronasDiagram, EstruturaCDiagram } from '@/components/work/diagrams';
import { EsteticaFlipCardClient, OtherWorkReveal } from './other-work.client';

// Section 7 — Other Work. Layout cinema premium:
//   • Estética MD FlipCard amber (2/3 largura, full height) — único portador de amber.
//   • 2 mini-cards lime/neutral à direita stacked: Caronas Java + Estrutura C.
//
// Decisões pra premium feel:
//   • Gap generoso (gap-10 sm:gap-12) entre coluna principal e stack lateral.
//   • Mini-cards minimalistas: diagram SVG inline (sem MockupFrame pesado), só
//     título + um line + 1-2 links. Zero placeholder ruim.
//   • Amber SCOPE: vive APENAS no FlipCard via tone="amber" + data-clinic-scope.
//     Mini-cards são lime/neutral puros — zero bleed.
//   • Hover dos mini-cards: translateY(-2px) + lime border + glow expand. Sem scale.
//   • Padding interno tighter (p-6 sm:p-7), border 1px hairline + inset highlight.

const WHATSAPP_DEEPLINK_ESTETICA =
  'https://wa.me/5542998592522?text=Ol%C3%A1%20Stefan%2C%20vi%20o%20site%20da%20Cl%C3%ADnica%20MD%20e%20quero%20algo%20assim%20pra%20minha%20cl%C3%ADnica.';

export function OtherWorkSection() {
  return (
    <section
      id="other-work"
      className="container-max section-pad-y-lg border-t border-(--color-hairline)"
    >
      <header className="mb-14 flex flex-col gap-4 sm:mb-16 lg:mb-20">
        <p className="eyebrow">OUTROS TRABALHOS</p>
        <h2
          className={[
            'text-3xl font-semibold text-(--color-text-1)',
            'sm:text-4xl',
            '!tracking-tight !leading-[1.05] text-balance',
          ].join(' ')}
        >
          De sites institucionais a algoritmos C.
        </h2>
        <p className="max-w-prose text-reading text-(--color-text-2)">
          Primeiro produto em produção (Estética MD), CLI universitária (Caronas Java), fundamento C
          (Estrutura de Dados) — três projetos que mostram amplitude além dos SaaS atuais.
        </p>
      </header>

      <OtherWorkReveal>
        {/* Asymmetric layout: Estética MD (2/3) + stack right (1/3) */}
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1.85fr_1fr] lg:gap-12">
          {/* Featured: Estética MD amber FlipCard — UNICO portador de amber */}
          <div data-other-card="estetica-md">
            <EsteticaFlipCardClient deeplink={WHATSAPP_DEEPLINK_ESTETICA} />
          </div>

          {/* Right column stacked — lime/neutral mini-cards */}
          <div className="grid grid-cols-1 gap-8 sm:gap-10">
            <MiniCard
              label="Caronas Java CLI"
              tech="Java 21 · Records · java.time"
              line="Repository Pattern construído do zero. CLI educacional mas real."
              href="https://github.com/stefanscrepka/sistema-caronas"
            >
              <CaronasDiagram label="Caronas Java" className="h-full w-full" />
            </MiniCard>

            <MiniCard
              label="Estrutura de Dados (C)"
              tech="C · 17 .c files · recursão"
              line="Hanoi recursivo · Fibonacci memoizado · parênteses balanceamento."
              href="https://github.com/stefanscrepka/estrutura-de-dados"
              secondaryHref="/playground"
              secondaryLabel="Ver Hanoi rodando"
            >
              <EstruturaCDiagram label="Estrutura de Dados C" className="h-full w-full" />
            </MiniCard>
          </div>
        </div>
      </OtherWorkReveal>
    </section>
  );
}

/* ============================================================
   MiniCard — minimalista lime/neutral. Diagram SVG inline (sem
   MockupFrame), title compacto, tech mono badge, 1 line, links.
   Hover: translateY(-2px) + lime border + glow expand 600ms.
   ============================================================ */

interface MiniCardProps {
  label: string;
  tech: string;
  line: string;
  href: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  children: React.ReactNode;
}

function MiniCard({
  label,
  tech,
  line,
  href,
  secondaryHref,
  secondaryLabel,
  children,
}: MiniCardProps) {
  return (
    <article
      data-other-card="mini"
      className={[
        'group/mini relative isolate flex h-full flex-col gap-5 overflow-hidden rounded-2xl p-6 sm:p-7',
        'border border-(--color-hairline) bg-(--color-surface)',
        // 2-layer rest: ambient md shadow + inset bisel (Vercel/Linear signature edge lift).
        'shadow-[var(--shadow-md),var(--shadow-inset-bisel)]',
        // Hover lift + glow expand. duration 600ms ease-smooth. Inset bisel preserved.
        'transition-[transform,border-color,box-shadow] duration-(--motion-page) ease-(--ease-smooth)',
        'hover:-translate-y-[2px] hover:border-(--color-accent)',
        'hover:shadow-[var(--shadow-lg),var(--shadow-inset-bisel),0_0_48px_var(--color-accent-glow)]',
        'focus-within:-translate-y-[2px] focus-within:border-(--color-accent)',
        'focus-within:shadow-[var(--shadow-lg),var(--shadow-inset-bisel),0_0_48px_var(--color-accent-glow)]',
      ].join(' ')}
    >
      {/* Diagram canvas — aspect 16/10 cinema, dark base, hairline */}
      <div
        className={[
          'relative z-10 aspect-[16/10] w-full overflow-hidden rounded-xl',
          'border border-(--color-hairline) bg-(--color-base)',
          'flex items-center justify-center p-4',
        ].join(' ')}
      >
        {children}
      </div>

      {/* Copy block */}
      <div className="relative z-10 flex flex-1 flex-col gap-3">
        <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">{tech}</p>
        <h3 className="text-lg font-semibold !tracking-tight !leading-[1.15] text-(--color-text-1)">
          {label}
        </h3>
        <p className="text-sm leading-relaxed text-(--color-text-2)">{line}</p>

        {/* Links row — lime ghost, anchored bottom */}
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-3">
          <Link
            href={href}
            target="_blank"
            rel="noreferrer"
            className={[
              'inline-flex items-center gap-1.5 font-mono text-xs text-(--color-accent)',
              'transition-[gap,color] duration-(--motion-transition) ease-(--ease-smooth)',
              'outline-none hover:gap-2 hover:text-(--color-accent-hover) focus-visible:underline',
            ].join(' ')}
          >
            GitHub
            <span aria-hidden="true">→</span>
          </Link>
          {secondaryHref ? (
            <Link
              href={secondaryHref}
              className={[
                'inline-flex items-center gap-1.5 font-mono text-xs text-(--color-text-3)',
                'transition-[gap,color] duration-(--motion-transition) ease-(--ease-smooth)',
                'outline-none hover:gap-2 hover:text-(--color-accent) focus-visible:text-(--color-accent)',
              ].join(' ')}
            >
              {secondaryLabel ?? secondaryHref}
              <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
