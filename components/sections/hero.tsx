import { CTAGroup } from '@/components/hero/cta-group';
import { EditorialAccent } from '@/components/hero/editorial-accent';
import { HeroGlassCard } from '@/components/hero/hero-glass-card';
import { MonoSubhead } from '@/components/hero/mono-subhead';
import { PartnerMarquee } from '@/components/hero/partner-marquee';
import { SplitTextHeadline } from '@/components/hero/split-text-headline';
import { StatsRow } from '@/components/hero/stats-row';

// ============================================================
// Section 1 — Hero
//
// Layout: dual-column editorial. Coluna esquerda (1.2fr) carrega tipografia
// massiva + subhead + CTAs. Coluna direita (0.8fr) hospeda HeroGlassCard
// refractive — vibe Polo/Johan Beker + Rive Translucent Window + Huly portal.
//
// Mobile (<lg): single-col stack natural — card desce abaixo dos CTAs em
// largura cheia. Desktop (>=lg): grid 1.2fr/0.8fr com gap-12 + items-center.
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

      {/* Main grid — dual-column desktop, single stack mobile.
          1.2fr/0.8fr distribui peso pro texto; items-center alinha card
          vertical no centro do bloco editorial. */}
      <div
        className={[
          'container-max relative z-10',
          'pt-28 pb-12 sm:pt-32 sm:pb-16',
          'lg:pb-20 lg:pt-32',
          'grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12',
        ].join(' ')}
      >
        <div className="flex flex-col gap-6 lg:gap-7">
          <SplitTextHeadline className="text-4xl sm:text-5xl !leading-[0.92] !tracking-[-0.035em] font-semibold">
            Construo IA <EditorialAccent>multi-agente</EditorialAccent> em produção — e o produto
            inteiro ao redor dela.
          </SplitTextHeadline>

          <MonoSubhead>
            AI Product Engineer · Claude SDK + Next 16 + TypeScript · três produtos rodando 24/7.
          </MonoSubhead>

          <CTAGroup />
        </div>

        {/* Right column — HeroGlassCard refractive. Full-width mobile,
            justify-self center pra nao colar na borda do container. */}
        <div className="flex justify-center lg:justify-end">
          <HeroGlassCard />
        </div>
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
