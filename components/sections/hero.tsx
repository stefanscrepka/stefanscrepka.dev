import { CTAGroup } from '@/components/hero/cta-group';
import { EditorialAccent } from '@/components/hero/editorial-accent';
import { MonoSubhead } from '@/components/hero/mono-subhead';
import { PartnerMarquee } from '@/components/hero/partner-marquee';
import { SplitTextHeadline } from '@/components/hero/split-text-headline';
import { StatsRow } from '@/components/hero/stats-row';

// ============================================================
// Section 1 — Hero (Wave 1: stripped, Wave 2: HeroVideo entra)
//
// Removido em Wave 1:
//   - HeroSceneClient + scene-3d r3f + hero-poster (visual "3 retângulos
//     flutuantes" rejeitado pelo Stefan + bug Canvas null/alpha)
//   - CodeMarquee (R-15 anti-slop validator regex strip — Stefan: "nada a ver")
//
// Mantém:
//   - Atmosphere radial lime beam CSS (continua útil mesmo sem canvas)
//   - Top vignette
//   - Headline travada com "multi-agente" italic
//   - MonoSubhead, CTAGroup, StatsRow, PartnerMarquee
//
// Wave 2 vai adicionar <HeroVideo /> no slot direito (vídeo loop Veo 3.1
// atmospheric beam pure, conforme plano §B).
// ============================================================

export async function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Atmosphere — radial lime beam emanating from bottom-center.
          Stage-light pattern. Layered atrás do grid, mix-blend screen pra
          reforçar luz emergente sem clarear texto/CTA por cima. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0">
        <div
          className="absolute left-1/2 bottom-[-30%] h-[140%] w-[160%] -translate-x-1/2 blur-3xl"
          style={{
            background: `radial-gradient(ellipse 50% 80% at 50% 100%,
              color-mix(in oklch, var(--color-accent) 18%, transparent) 0%,
              color-mix(in oklch, var(--color-accent) 7%, transparent) 28%,
              color-mix(in oklch, var(--color-accent) 2%, transparent) 55%,
              transparent 75%)`,
            mixBlendMode: 'screen',
          }}
        />
      </div>

      {/* Top vignette — escurece levemente o topo pra deixar headline respirando
          contra o palco escuro. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[40%]"
        style={{
          background: 'linear-gradient(to bottom, oklch(13% 0.005 130 / 0.6) 0%, transparent 100%)',
        }}
      />

      {/* Main grid — headline left + hero visual slot right (Wave 2 preenche com <HeroVideo />) */}
      <div
        className={[
          'container-max relative z-10 grid items-center gap-10',
          'pt-32 pb-12 sm:pt-36 sm:pb-16',
          'lg:min-h-[78dvh] lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-20 lg:pt-40',
        ].join(' ')}
      >
        <div className="flex flex-col gap-7 lg:gap-9">
          <SplitTextHeadline className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl !leading-[0.92] !tracking-[-0.035em] font-bold">
            Construo IA <EditorialAccent delay={1.25}>multi-agente</EditorialAccent> em produção — e
            o produto inteiro ao redor dela.
          </SplitTextHeadline>

          <MonoSubhead>
            AI Product Engineer · Claude SDK + Next 16 + TypeScript · três produtos rodando 24/7.
          </MonoSubhead>

          <CTAGroup />
        </div>

        {/* Hero visual slot — Wave 1: stub vazio (sem r3f). Wave 2: <HeroVideo /> entra aqui
            com vídeo loop atmospheric Veo 3.1. */}
        <div
          aria-hidden="true"
          className={[
            'relative aspect-square w-full max-w-[560px] overflow-hidden',
            'place-self-center',
            'lg:aspect-auto lg:min-h-[600px] lg:max-w-none lg:place-self-stretch',
            // Slot stub: reforça atmosphere com gradient interno até Wave 2 chegar
            'rounded-2xl',
          ].join(' ')}
          data-slot="hero-visual-placeholder"
        />
      </div>

      {/* Stats row strip */}
      <div className="container-max relative z-10 py-6 hairline-bottom">
        <StatsRow />
      </div>

      {/* Partner marquee — logos infinite scroll */}
      <div className="relative z-10">
        <PartnerMarquee />
      </div>
    </section>
  );
}
