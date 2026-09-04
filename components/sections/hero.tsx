import { CTAGroup } from '@/components/hero/cta-group';
import { DayRail } from '@/components/hero/day-rail';
import { EditorialAccent } from '@/components/hero/editorial-accent';
import { HeadlineWordReveal } from '@/components/hero/headline-word-reveal';
import { HeroEyebrow } from '@/components/hero/hero-eyebrow.client';
import { HeroVideoToggle } from '@/components/hero/hero-video-toggle.client';
import { PartnerMarquee } from '@/components/hero/partner-marquee';
import { StatsRow } from '@/components/hero/stats-row';

// ============================================================
// Section 1 — Hero
//
// F8 (2026-09-05): duas colunas em lg. À esquerda, a manchete (a mesma
// frase que assina o manifesto e o rodapé), UMA linha de prova com verbo
// ("Às 03h um cron acorda 19 agentes…") e os CTAs. À direita, o contrapeso
// que faltava: o turno de hoje, o dia de trabalho do Content Engine como o
// cron o executa (day-rail.tsx). Antes, abaixo da manchete vinham quatro
// faixas de texto pequeno com o mesmo peso (subhead em lista de
// palavras-chave, CTAs, stats, marquee) e nenhuma tinha prioridade; a
// subline repetia "em produção" e o número dos stats. O eyebrow mono se
// resolve de glifos no primeiro paint (hero-eyebrow.client.tsx).
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
          data-hero-video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/bg/hero-poster-v2.avif"
          className="h-full w-full object-cover"
          // F5 (2026-09-02): o loop é uma onda olive-dourada (matiz ~90–100°)
          // e, a saturate(0.85), era a maior superfície de cor do site: 14.25%
          // de massa cromática no fold (medido, _audit/f5/research/R4 §0) contra
          // 0.04% no linear.app e 0.56% no griffin.com — e brigava com o lime
          // (124°) em vez de sustentá-lo. Quase-monocromático: a onda vira
          // textura de luz (prata/grafite) e o único evento de cor acima da
          // dobra volta a ser a palavra em itálico + o CTA. O poster (mobile)
          // recebe o mesmo filtro por ser desenhado pelo <video>.
          style={{ opacity: 0.5, filter: 'saturate(0.12) contrast(1.06) brightness(0.92)' }}
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

      {/* F6 (2026-09-04): o "radial lime beam" (elipse 160%×140% em blur-3xl,
          lime a 12%) saiu. Era a maior mancha de acento do site depois do
          vídeo e lia como fumaça, não como palco — o brand book v1 §11 fixa a
          proporção 90/8/2 (preto/off-white/lime) e o §17 veta glow. A
          atmosfera do hero é o próprio vídeo, já quase monocromático. */}

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
          'container-max relative z-10 grid gap-12',
          'pt-20 pb-8 sm:pt-24 sm:pb-12',
          'lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-end lg:gap-16 lg:pt-24 lg:pb-14',
        ].join(' ')}
      >
        <div className="flex max-w-5xl flex-col gap-5 lg:gap-6">
          <HeroEyebrow text="AI Product Engineer · Ponta Grossa, Paraná" />
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
            Construo IA <EditorialAccent>multi-agente</EditorialAccent> em produção, e o produto
            inteiro ao redor dela.
          </HeadlineWordReveal>

          {/* A linha de prova: uma frase com verbo, o fato mais forte do site,
              no lugar da lista de palavras-chave. */}
          <p
            data-slot="hero-proof"
            className="max-w-[38ch] text-base leading-relaxed text-(--color-text-1) sm:text-lg"
            style={{
              textShadow:
                '0 0 1px color-mix(in oklch, var(--color-bg) 92%, transparent), 0 1px 2px color-mix(in oklch, var(--color-bg) 88%, transparent), 0 0 6px color-mix(in oklch, var(--color-bg) 72%, transparent)',
            }}
          >
            Às 03h um cron acorda 19 agentes Claude. Às 07h30 o pacote do dia espera três botões
            seus no Telegram.
          </p>

          <CTAGroup />
        </div>

        <DayRail />
      </div>

      {/* Stats row strip + controle do vídeo (WCAG 2.2.2 — ver hero-video-toggle).
          md:min-h-9: o botão (36px) só monta depois da hidratação e só em md+;
          sem a altura reservada a faixa crescia 16px, o hero crescia junto e o
          brilho absoluto (140% da altura, bottom -30%) deslocava — Lighthouse
          media CLS 0.0024 na home em 3/3 runs (lote 4d), apontando exatamente
          `section#hero > div.pointer-events-none > div.absolute`. */}
      <div className="container-max relative z-10 flex items-center justify-between gap-6 py-6 hairline-bottom min-h-[calc(2.25rem+3rem)]">
        <StatsRow />
        <HeroVideoToggle className="shrink-0" />
      </div>

      {/* Partner marquee — logos infinite scroll. Stefan AMA esse modulo. */}
      <div className="relative z-10">
        <PartnerMarquee />
      </div>
    </section>
  );
}
