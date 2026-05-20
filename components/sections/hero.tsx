import { CodeMarquee } from '@/components/hero/code-marquee';
import { CTAGroup } from '@/components/hero/cta-group';
import { EditorialAccent } from '@/components/hero/editorial-accent';
import { HeroSceneClient } from '@/components/hero/hero-scene.client';
import { MonoSubhead } from '@/components/hero/mono-subhead';
import { PartnerMarquee } from '@/components/hero/partner-marquee';
import { SplitTextHeadline } from '@/components/hero/split-text-headline';
import { StatsRow } from '@/components/hero/stats-row';

// ============================================================
// Section 1 — Hero (HUD detox + cinematic atmosphere)
//
// Removido (HUD competindo com headline):
//   - StatusBadge "disponível pra projetos" → vai pro footer
//   - TimeClock decorativo → eliminado (Argus pattern, slop tendency)
//
// Repositionado:
//   - CodeMarquee descido pra "abaixo do hero principal", opacity reduzida,
//     mask gradient mais agressivo nas bordas. Não compete mais com headline.
//
// Estrutura:
//   1. Atmosphere layer (radial lime beam — palco)
//   2. Main grid 2-col: headline + r3f scene (lg+)
//   3. CodeMarquee sutil (separator strip)
//   4. StatsRow (mono-tabular)
//   5. PartnerMarquee (logos infinite scroll)
//
// Atmosfera vem 100% do canvas r3f (volumetric beam + bloom). O radial
// background CSS reforça a continuidade do beam pra fora do canvas até o
// resto da page — vinheta unificada.
// ============================================================

export async function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Atmosphere — radial lime beam emanating from bottom-center (continua o beam do canvas).
          Stage-light pattern (Nextronium). Layered atrás do grid, mix-blend screen pra
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
          contra o palco escuro (vs. competir com brilho do beam). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[40%]"
        style={{
          background: 'linear-gradient(to bottom, oklch(13% 0.005 130 / 0.6) 0%, transparent 100%)',
        }}
      />

      {/* Main grid — headline + r3f scene */}
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

        {/* Hero scene container — sem border decorativo (atmosfera vem do conteúdo,
            não da moldura). Aspect square mobile, fill desktop. Background base
            via inline fallback caso OKLCH falhe. */}
        <div
          className={[
            'relative aspect-square w-full max-w-[560px] overflow-hidden',
            'bg-(--color-base) place-self-center',
            'lg:aspect-auto lg:min-h-[600px] lg:max-w-none lg:place-self-stretch',
          ].join(' ')}
        >
          <HeroSceneClient className="absolute inset-0 h-full w-full" />
        </div>
      </div>

      {/* Code marquee — sutil separator strip abaixo do hero principal.
          Opacity reduced + mask gradient agressivo. Não compete com headline,
          funciona como "engine room" hint (R-15 anti-slop validator real code). */}
      <div className="relative z-10 opacity-50 transition-opacity duration-300 hover:opacity-90">
        <CodeMarquee />
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
