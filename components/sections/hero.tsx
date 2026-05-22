import { CTAGroup } from '@/components/hero/cta-group';
import { EditorialAccent } from '@/components/hero/editorial-accent';
import { MonoSubhead } from '@/components/hero/mono-subhead';
import { PartnerMarquee } from '@/components/hero/partner-marquee';
import { SplitTextHeadline } from '@/components/hero/split-text-headline';
import { StatsRow } from '@/components/hero/stats-row';

// ============================================================
// Section 1 — Hero (single-column)
//
// Layout: single-column editorial editorial (midu/landonorris). Headline
// massiva ocupa largura ate max-w-5xl. Subhead mono + CTAs + Spotify widget.
// Slot direito do dual-column anterior (Spline glass) foi removido — asset
// estava deslocado + peso pesado.
//
// Background eclipse lime aparece SO nesta section via div absolute inset-0
// dentro do <section>. Mask gradient corta bottom 25% (caracteres CJK da
// imagem original) + fade pra dark.
// ============================================================

export async function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Background MIDU-style — "STEFAN" lime glow gigante ancorado no bottom.
          Imagem dropada pelo Stefan em public/bg/Midu-Style.png. Tratamento:
          - Position center 115% empurra letras pra fora do viewport ate so o
            topo aparecer (vibe wallpaper/signature, nao protagonista).
          - Mask gradient top 0->50% transparent garante headline limpa.
          - Opacity 0.7 — presenca sem competir com CTAs. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        style={{
          backgroundImage: 'url(/bg/Midu-Style.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 115%',
          backgroundRepeat: 'no-repeat',
          opacity: 0.7,
          maskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,1) 65%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,1) 65%)',
        }}
      />

      {/* Atmosphere — radial lime beam emanating from bottom-center.
          Stage-light pattern. Layered atrás do conteudo, mix-blend screen pra
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

      {/* Main column — single-column editorial. max-w-5xl evita esticar
          full container-max em telas xl+ (mantem ritmo de leitura). */}
      <div
        className={[
          'container-max relative z-10 flex flex-col',
          'pt-28 pb-12 sm:pt-32 sm:pb-16',
          'lg:pb-20 lg:pt-32',
        ].join(' ')}
      >
        <div className="flex max-w-5xl flex-col gap-6 lg:gap-7">
          <SplitTextHeadline className="text-4xl sm:text-5xl !leading-[0.92] !tracking-[-0.035em] font-semibold text-balance">
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

      {/* Partner marquee — logos infinite scroll. Stefan AMA esse modulo. */}
      <div className="relative z-10">
        <PartnerMarquee />
      </div>
    </section>
  );
}
