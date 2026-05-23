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
      {/* Background video — anime minimalista (Stefan dropou). Autoplay loop
          muted playsInline pra autoplay garantido em iOS/Safari. Mask gradient
          mantida do bg image anterior pra preservar headline limpa em cima e
          fade pra dark embaixo.
          W0.5 (2026-05-23):
            • preload="auto" → "metadata" — não baixa 5 MB antes de scroll.
            • poster AVIF 50 KB pintado no LCP enquanto o vídeo carrega.
            • <source media> gate só carrega vídeo em desktop sem reduced-motion;
              mobile fica só com poster + bg dark sem custar 5 MB de banda 4G. */}
      {/* W3.3 (2026-05-23): refinamento light do hero existente — sem trocar asset.
          • Mask gradient começa mais cedo (transparent 0% → 0.5 alpha 40% → opaque
            70%) — anime aparece mais sutil no topo, headline ganha breathing room.
          • opacity 0.7 → 0.55 reduz noise visual sem perder cinema.
          • saturate(0.85) cala levemente o verde sem distorcer hue (CSS-safe). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,1) 70%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,1) 70%)',
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/bg/hero-poster.avif"
          aria-hidden="true"
          className="h-full w-full object-cover"
          style={{ opacity: 0.55, filter: 'saturate(0.85)' }}
        >
          <source
            src="/bg/Anime_minimalista_no_song_202605220236.mp4"
            type="video/mp4"
            media="(min-width: 768px) and (prefers-reduced-motion: no-preference)"
          />
        </video>
      </div>

      {/* Atmosphere — radial lime beam emanating from bottom-center.
          Stage-light pattern. Layered atrás do conteudo.
          W2.5 (2026-05-23): mixBlendMode 'screen' removido — forçava recálculo
          GPU absurdo com video por trás (Safari iOS jank). Alpha bakeado
          diretamente nos stops OKLCH dá mesma luminância sem compositing custo. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0">
        <div
          className="absolute left-1/2 bottom-[-30%] h-[140%] w-[160%] -translate-x-1/2 blur-3xl"
          style={{
            background: `radial-gradient(ellipse 50% 80% at 50% 100%,
              oklch(94% 0.22 124 / 0.12) 0%,
              oklch(94% 0.22 124 / 0.05) 28%,
              oklch(94% 0.22 124 / 0.015) 55%,
              transparent 75%)`,
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
