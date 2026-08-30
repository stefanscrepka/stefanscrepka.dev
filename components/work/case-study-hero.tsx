import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CaseStudy } from '@/lib/work/data';

// CaseStudyHero — cinematic header pras 4 páginas /work/[slug].
//
// Premium decisions:
//   • Back link mono sutil pro topo ("← Outros cases").
//   • Eyebrow status com pulse dot ao lado (mono lime).
//   • Título massivo tracking-tight -0.025em leading 1.05.
//   • Tagline editorial maior, max-w-3xl (não confunde com description).
//   • Description body text neutro, max-w-prose.
//   • CTA primário pill lime/amber + secondary outline.
//     Hover lift -2px no primário (translateY, NÃO scale).
//   • Amber scope: data-clinic-scope coloca o hero em territory amber
//     APENAS no Estética MD slug. Demais cases usam lime via default tokens.

interface CaseStudyHeroProps {
  cs: CaseStudy;
  className?: string;
}

export function CaseStudyHero({ cs, className }: CaseStudyHeroProps) {
  const isAmber = cs.accent === 'amber';
  const accentColor = isAmber ? 'var(--color-amber)' : 'var(--color-accent)';
  const accentGlow = isAmber ? '0 0 24px oklch(82% 0.18 75 / 0.45)' : 'var(--shadow-glow-lime-sm)';

  return (
    <header
      className={cn(
        // W-audit (2026-06-10): pt-10/12/14 → pt-24/28/32. A TopBarNav é FIXED
        // (h-14 md:h-16) e sobrepõe o fluxo — com pt-10 o back-link "← Outros
        // cases" nascia meio cortado embaixo da nav (frames d4-case-*-hero do
        // audit). Novo pt = nav (56/64px) + respiro, um degrau abaixo do
        // pt-32/36 do índice /work (hierarquia coerente).
        'container-max flex flex-col gap-7 pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24',
        className
      )}
      data-clinic-scope={isAmber ? '' : undefined}
    >
      {/* Back link — sutil, mono, lime hover */}
      <Link
        href="/work"
        className={cn(
          'group/back inline-flex w-fit items-center gap-2 rounded-sm font-mono text-2xs uppercase tracking-widest',
          // F4 (2026-08-29): alvo tinha 16.5px de altura (WCAG 2.2 SC 2.5.8 pede 24).
          // py-2 -my-2 cresce a área de toque sem alterar o layout visual.
          'py-2 -my-2',
          'text-(--color-text-3) outline-none',
          'transition-[gap,color] duration-(--motion-transition) ease-(--ease-smooth)',
          'hover:gap-3 focus-visible:gap-3',
          // F3-review (2026-06-11): aumento de gap não é indicador de foco
          // perceptível (WCAG 2.4.7); `outline-none` vence o anel global, então
          // ring-2 explícito dá o anel que faltava no único back-link das cases.
          'focus-visible:ring-2 focus-visible:ring-(--color-border-focus) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg)'
        )}
        style={{
          // amber scope hover color override sem propagação global
          ['--hover-accent' as string]: accentColor,
        }}
      >
        <span
          aria-hidden="true"
          className="transition-transform duration-(--motion-transition) ease-(--ease-smooth) group-hover/back:-translate-x-[2px] group-focus-visible/back:-translate-x-[2px]"
          style={{ color: 'inherit' }}
        >
          ←
        </span>
        <span className="group-hover/back:text-(--color-text-1) group-focus-visible/back:text-(--color-text-1)">
          Outros cases
        </span>
      </Link>

      {/* Eyebrow status — mono + pulse dot lime (ou amber) */}
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="relative inline-flex h-2 w-2 items-center justify-center"
        >
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
            style={{ backgroundColor: accentColor }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ backgroundColor: accentColor, boxShadow: accentGlow }}
          />
        </span>
        <p
          className="font-mono text-2xs uppercase tracking-widest"
          style={{ color: 'var(--color-text-3)' }}
        >
          {cs.status}
        </p>
      </div>

      {/* Title massive — tracking tight + leading 1.05 cinema */}
      <h1
        className={cn(
          'font-semibold text-(--color-text-1)',
          'text-4xl sm:text-5xl lg:text-6xl xl:text-[5.25rem]',
          '!tracking-tight !leading-[1.02]'
        )}
      >
        {cs.title}
      </h1>

      {/* Tagline editorial — larger, max-w-3xl */}
      <p
        className="max-w-3xl text-lg leading-snug sm:text-xl lg:text-2xl"
        style={{ color: 'var(--color-text-2)' }}
      >
        {cs.tagline}
      </p>

      {/* Description — body reading-pace 17px, max-w-prose */}
      <p className="max-w-prose text-reading text-(--color-text-2)">{cs.description}</p>

      {/* CTAs — primary pill lime/amber + secondary outline. Hover lift -2px. */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {cs.ctas.map((cta) => {
          const isPrimary = cta.variant !== 'outline';
          const baseLift =
            'transition-[transform,box-shadow,background-color] duration-(--motion-transition) ease-(--ease-smooth) hover:-translate-y-[2px] focus-visible:-translate-y-[2px]';

          if (cta.external) {
            return (
              <Button
                key={cta.label}
                variant={cta.variant ?? 'default'}
                size="lg"
                asChild
                className={cn(baseLift, isPrimary && 'shadow-(--shadow-md)')}
                style={
                  isAmber && isPrimary
                    ? {
                        backgroundColor: accentColor,
                        color: 'var(--color-bg)',
                        boxShadow: `var(--shadow-md), ${accentGlow}`,
                      }
                    : undefined
                }
              >
                <a href={cta.href} target="_blank" rel="noreferrer">
                  {cta.label}
                </a>
              </Button>
            );
          }
          return (
            <Button
              key={cta.label}
              variant={cta.variant ?? 'outline'}
              size="lg"
              asChild
              className={baseLift}
            >
              <a href={cta.href}>{cta.label}</a>
            </Button>
          );
        })}
      </div>
    </header>
  );
}
