import { cn } from '@/lib/utils';
import type { CaseStudy } from '@/lib/work/data';

// W3.2 (2026-05-23): Triad "Problema · Solução · Impacto" pras páginas
// /work/[slug]. Renderiza ENTRE o CaseStudyHero e o ScrollPinnedHorizontal.
// Decisor não-técnico lê primeiro: 3 frases, 3 colunas, 3 lentes diferentes
// do mesmo caso. Depois vem o detalhe técnico (squads, stack, post-mortem).
//
// Renderização condicional: se case.problem === undefined, retorna null
// (gracefully degrada — não vaza placeholder).

interface CaseImpactTriadProps {
  cs: CaseStudy;
  className?: string;
}

export function CaseImpactTriad({ cs, className }: CaseImpactTriadProps) {
  // Render só se temos pelo menos problem + impact (tagline sempre existe).
  if (!cs.problem || !cs.impact) return null;

  const isAmber = cs.accent === 'amber';
  const accentColor = isAmber ? 'var(--color-amber)' : 'var(--color-accent)';

  // W-copy (2026-05-25): eyebrows trocados de "PROBLEMA / SOLUÇÃO / IMPACTO"
  // (framework genérico) pra voz autoral Stefan-style — concreto, primeira
  // pessoa, anti-corporate.
  const cells = [
    {
      eyebrow: 'O QUE QUEBRAVA',
      body: cs.problem,
      tone: 'danger' as const,
    },
    {
      eyebrow: 'O QUE EU FIZ',
      body: cs.tagline,
      tone: 'neutral' as const,
    },
    {
      eyebrow: 'O QUE MUDOU',
      body: cs.impact.context,
      metric: cs.impact.metric,
      tone: 'accent' as const,
    },
  ];

  return (
    <section
      aria-label="Problema, solução e impacto"
      className={cn('container-max border-t border-(--color-hairline) py-16 sm:py-20', className)}
    >
      <div className="grid gap-8 sm:gap-10 lg:grid-cols-3 lg:gap-12">
        {cells.map((cell) => (
          <article key={cell.eyebrow} className="flex flex-col gap-4">
            <p
              className="font-mono text-2xs uppercase tracking-widest"
              style={{
                color:
                  cell.tone === 'accent'
                    ? accentColor
                    : cell.tone === 'danger'
                      ? 'var(--color-danger)'
                      : 'var(--color-text-3)',
              }}
            >
              {cell.eyebrow}
            </p>
            {cell.metric ? (
              <p
                className="year-editorial font-bold leading-[0.95] tracking-tight"
                style={{
                  color: accentColor,
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  letterSpacing: '-0.03em',
                }}
              >
                {cell.metric}
              </p>
            ) : null}
            <p
              className={cn(
                'text-reading leading-relaxed',
                cell.tone === 'accent' ? 'text-(--color-text-1)' : 'text-(--color-text-2)'
              )}
            >
              {cell.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
