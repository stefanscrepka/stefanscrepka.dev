import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CaseStudy } from '@/lib/work/data';

// Header reutilizável dos case studies — eyebrow + title + tagline + status + CTAs.

interface CaseStudyHeroProps {
  cs: CaseStudy;
  className?: string;
}

export function CaseStudyHero({ cs, className }: CaseStudyHeroProps) {
  const accentColor = cs.accent === 'amber' ? 'var(--color-amber)' : 'var(--color-accent)';

  return (
    <header
      className={cn('container-max flex flex-col gap-6 pt-8 pb-12', className)}
      data-clinic-scope={cs.accent === 'amber' ? '' : undefined}
    >
      <p
        className="font-mono text-[11px] uppercase tracking-widest"
        style={{ color: 'var(--color-text-3)' }}
      >
        {cs.status}
      </p>
      <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
        {cs.title}
      </h1>
      <p
        className="max-w-3xl text-base leading-relaxed sm:text-lg"
        style={{ color: 'var(--color-text-2)' }}
      >
        {cs.tagline}
      </p>
      <p className="max-w-prose text-sm leading-relaxed text-(--color-text-2)">{cs.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {cs.ctas.map((cta) =>
          cta.external ? (
            <Button
              key={cta.label}
              variant={cta.variant ?? 'default'}
              size="lg"
              asChild
              style={
                cs.accent === 'amber' && cta.variant !== 'outline'
                  ? { backgroundColor: accentColor, color: 'var(--color-base)' }
                  : undefined
              }
            >
              <a href={cta.href} target="_blank" rel="noreferrer">
                {cta.label}
              </a>
            </Button>
          ) : (
            <Button key={cta.label} variant={cta.variant ?? 'outline'} size="lg" asChild>
              <a href={cta.href}>{cta.label}</a>
            </Button>
          )
        )}
      </div>
    </header>
  );
}
