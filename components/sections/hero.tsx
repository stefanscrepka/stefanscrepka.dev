import { CTAGroup } from '@/components/hero/cta-group';
import { EditorialAccent } from '@/components/hero/editorial-accent';
import { MonoSubhead } from '@/components/hero/mono-subhead';
import { PartnerMarquee } from '@/components/hero/partner-marquee';
import { SplitTextHeadline } from '@/components/hero/split-text-headline';
import { StatsRow } from '@/components/hero/stats-row';

// ============================================================
// Section 1 — Hero
//
// Layout: single-column centered-left editorial (midu + landonorris fusion).
// Tipografia massiva primeira dobra (text-5xl 80-108px clamp), italic editorial
// pontual em "multi-agente" sem underline, mono subhead, CTAs com magnetic primary.
//
// Right-side visual portal (Polo + Huly fusion) entra em Wave futura quando
// screenshot real do Content Engine for entregue por Stefan + ProductMockup
// chrome wrapped com rotate 6° + shadow-cinema. Por ora o hero fica single-col
// pra evitar slot vazio + headline ganha 100% da largura.
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

      {/* Main column — single-col editorial. max-w-5xl pra evitar headline esticar
          full container-max em telas >=xl (mantém ritmo de leitura humano).
          Sem min-h forçado — altura natural deixa headline + subhead + CTAs todos
          visíveis acima da dobra. */}
      <div
        className={[
          'container-max relative z-10 flex flex-col',
          'pt-28 pb-12 sm:pt-32 sm:pb-16',
          'lg:pb-20 lg:pt-32',
        ].join(' ')}
      >
        <div className="flex max-w-5xl flex-col gap-6 lg:gap-7">
          <SplitTextHeadline className="text-4xl sm:text-5xl !leading-[0.92] !tracking-[-0.035em] font-semibold">
            Construo IA <EditorialAccent>multi-agente</EditorialAccent> em produção — e o produto
            inteiro ao redor dela.
          </SplitTextHeadline>

          <MonoSubhead>
            AI Product Engineer · Claude SDK + Next 16 + TypeScript · três produtos rodando 24/7.
          </MonoSubhead>

          <CTAGroup />
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
