import { CTAGroup } from '@/components/hero/cta-group';
import { EditorialAccent } from '@/components/hero/editorial-accent';
import { HeadlineWordReveal } from '@/components/hero/headline-word-reveal';
import { MonoSubhead } from '@/components/hero/mono-subhead';
import { PartnerMarquee } from '@/components/hero/partner-marquee';
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
  // F4 (2026-08-29): o `preload()` do poster foi REMOVIDO.
  //
  // A premissa original era "poster é candidato a LCP em mobile". Medido
  // (_audit/f4/lcp-check.mjs, build de produção): o LCP da home é o **H1**
  // em ambos os viewports — 420ms no desktop, 260ms no mobile. O poster
  // nunca foi o LCP, então o preload não comprava nada.
  //
  // O que ele custava, medido (_audit/f4/probe-poster-leak.mjs): o hoistable
  // criado por ReactDOM.preload() é injetado no <head> da rota ATUAL quando o
  // Next pré-busca o link da home na nav. Resultado em /work, /process,
  // /privacidade e /work/stj-app: 1 requisição de 200 OK do AVIF (~47 KB)
  // por rota + o warning "preloaded but not used" no console.
  // Comportamento correto do prefetch — mas banda e ruído de console por zero
  // ganho. O atributo `poster` do <video> já busca a imagem sozinho.

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
              mobile fica só com poster + bg dark sem custar 5 MB de banda 4G.

          W3.3: mask gradient começa mais cedo + opacity 0.55 + saturate 0.85
          mantêm o anime sutil sem competir com headline.

          F4 (2026-08-29): a máscara virou `@utility hero-media-mask` (globals.css),
          RESPONSIVA. A antiga (`0.85 @55% → 1 @75%`) deixava a mídia em brilho
          MÁXIMO justo na faixa do subhead/CTA/stats — o oposto do que este
          comentário afirmava. Medido: subhead a 1.86:1 no mobile (min 4.5).
          Agora a mídia pica na faixa do headline e cai antes do texto pequeno. */}
      <div
        aria-hidden="true"
        className="hero-media-mask pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/bg/hero-poster-v2.avif"
          className="h-full w-full object-cover"
          style={{ opacity: 0.55, filter: 'saturate(0.85)' }}
        >
          {/* WebM/VP9 preferido por browsers modernos. <source media> mantém
              gate por viewport + prefers-reduced-motion (mobile + reduced =
              só poster, zero MB de video). */}
          <source
            src="/bg/hero-loop-v2.webm"
            type="video/webm"
            media="(min-width: 768px) and (prefers-reduced-motion: no-preference)"
          />
          <source
            src="/bg/hero-loop-v2.mp4"
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
          full container-max em telas xl+ (mantem ritmo de leitura).
          W-mob2 #4: pt-28 → pt-20 mobile (top-bar 56px + 24px breath); pb-12 → pb-8 mobile.
          Economiza ~80px de scroll inicial sem comprometer hero respiração desktop. */}
      <div
        className={[
          'container-max relative z-10 flex flex-col',
          'pt-20 pb-8 sm:pt-32 sm:pb-16',
          'lg:pb-20 lg:pt-32',
        ].join(' ')}
      >
        <div className="flex max-w-5xl flex-col gap-6 lg:gap-7">
          {/* W-mob2 #1: leading-[0.92] mobile (text-4xl=60px → ~55px line-height) faz
              descendentes de "g/p/q/y" de "multi-agente" italic colidirem com linha
              abaixo. Em mobile usar 0.98; sm:↑ retoma 0.92 cinematográfico. */}
          {/* F4 (2026-08-29): override de tamanho só em <640px.
              Medido (_audit/f4/probe-rag3.mjs, 390px): a 63.07px o headline
              quebrava em 7 linhas com "em" SOZINHO numa linha. Não era o
              `text-balance` — balance/pretty/normal davam o MESMO rag. Era
              largura pura: "em produção" mede 371px numa coluna de 358px, então
              "em" não tinha como subir nem descer acompanhado.
              A 58px cabe: 6 linhas, zero órfã, e 91px a menos de altura
              (436→345px) — scroll que o mobile agradece.
              Curva resolvida pra f(390px)=58px mantendo f(639px)≈77px, ou seja,
              o topo da faixa não muda e o degrau pro sm:text-5xl continua igual.
              Testado também amarrar o travessão com NBSP: PIOROU (volta pra 7
              linhas e ressuscita a órfã) — por isso não foi feito. */}
          {/* W-audit (2026-06-10): reveal por palavra server/CSS — ver
              headline-word-reveal.tsx. Mata o replay GSAP (SSR pintava,
              idle escondia, re-animava) e tira SplitText do bundle da home. */}
          <HeadlineWordReveal className="text-4xl max-sm:!text-[clamp(3.25rem,1.765rem+7.63vw,4.8rem)] sm:text-5xl !leading-[0.98] sm:!leading-[0.92] !tracking-[-0.035em] font-semibold text-balance">
            Construo IA <EditorialAccent>multi-agente</EditorialAccent> em produção — e o produto
            inteiro ao redor dela.
          </HeadlineWordReveal>

          <MonoSubhead>
            AI Product Engineer · 22 agentes Claude SDK aprovados via Telegram · três produtos em
            produção.
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
