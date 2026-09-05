import { CTAGroup } from '@/components/hero/cta-group';
import { EditorialAccent } from '@/components/hero/editorial-accent';
import { HeadlineWordReveal } from '@/components/hero/headline-word-reveal';
import { HeroVideoToggle } from '@/components/hero/hero-video-toggle.client';
import { PartnerMarquee } from '@/components/hero/partner-marquee';
import { WorkIndex } from '@/components/hero/work-index';
import { HERO_INDEX } from '@/lib/work/data';

// ============================================================
// Section 1 — Hero
//
// F9 (2026-09-05): manchete + índice. O F8 tinha posto à direita o cron do
// Content Engine e, embaixo, uma linha de prova e uma stats row só dele; o
// Stefan leu o resultado como "o site de um produto, não o meu portfólio".
// A primeira tentativa desta fase (captura do item ativo, relógio, uma
// descrição por linha) ele achou mais poluída ainda. O que ficou:
//   • eyebrow com o NOME (o hero não dizia quem era a pessoa);
//   • a manchete travada (assina o manifesto e o rodapé);
//   • uma linha de apoio curta sobre o conjunto, não sobre um produto;
//   • à direita, o índice: cinco trabalhos numerados, ano e estado real,
//     cada um um link (work-index.tsx, Server Component);
//   • a stats row, a linha de prova social e o eyebrow que embaralhava
//     glifos saíram (redundantes com o índice, ou gimmick);
//   • o botão de pausa (WCAG 2.2.2) mora na faixa da marquee, que é a coisa
//     que ele pausa junto com o vídeo. Absoluto: não reserva altura, não
//     desloca nada quando hidrata.
// ============================================================

export function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Background video — anime minimalista (Stefan dropou). Autoplay loop
          muted playsInline pra autoplay garantido em iOS/Safari.
          W0.5 (2026-05-23): preload="metadata"; poster AVIF; <source media>
          só carrega vídeo em desktop sem reduced-motion.
          F4 (2026-08-29): a máscara é `@utility hero-media-mask` (globals.css),
          responsiva: a mídia pica na faixa do headline e cai antes do texto
          pequeno (contraste medido por pixel). O LCP é o H1, não o poster —
          por isso não há preload (medido em _audit/f4). */}
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
          // F5 (2026-09-02): quase-monocromático — a onda vira textura de luz
          // e o único evento de cor acima da dobra é a palavra em itálico +
          // o CTA (massa cromática do fold 14,5% → 2,4%).
          style={{ opacity: 0.5, filter: 'saturate(0.12) contrast(1.06) brightness(0.92)' }}
        >
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

      {/* F9: a vinheta de topo saiu (0 de 9 sites de referência usam; a
          máscara da mídia já é transparente no topo). */}

      <div
        className={[
          'container-max relative z-10 grid gap-10',
          'pt-20 pb-10 sm:pt-24 sm:pb-12',
          // Duas colunas só a partir de xl: em 1024–1279 a coluna da manchete
          // teria ~540px pra um H1 de 120px (quatro caracteres por linha).
          // F9 (R4 F26): índice alinhado pelo topo (o rótulo ÍNDICE na linha do
          // eyebrow), não colado no rodapé da coluna. pb-24 (R4 F25): a marquee
          // ficava cortada ao meio na dobra de 900px; agora começa depois dela
          // em 1280/1440 e cabe inteira em 1920.
          'xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] xl:items-start xl:gap-16 xl:pt-24 xl:pb-24',
        ].join(' ')}
      >
        <div className="flex max-w-5xl flex-col gap-5 xl:gap-6">
          <p data-slot="hero-eyebrow" className="eyebrow">
            <span className="text-(--color-text-2)">Stefan Heinz Screpka</span> · AI Product
            Engineer
          </p>
          {/* F4 (2026-08-29): tamanho só em <640px medido pra caber em 6 linhas
              sem órfã (probe-rag3). W-audit (2026-06-10): reveal por palavra em
              CSS, server-rendered (headline-word-reveal.tsx).
              F9: em xl a manchete divide a largura com o índice (coluna de
              ~690–784px); o tamanho passa a seguir a viewport (7,4vw, teto de
              116px) pra "multi-agente em" caber numa linha e o H1 fechar em
              cinco, com os CTAs dentro da dobra de 900px (probe-hero.mjs). */}
          <HeadlineWordReveal className="text-4xl max-sm:!text-[clamp(3.25rem,1.765rem+7.63vw,4.8rem)] sm:text-5xl lg:!text-[min(7.25rem,9vw)] xl:!text-[min(7.25rem,7.4vw)] !leading-[0.98] sm:!leading-[0.92] !tracking-[-0.035em] font-semibold text-balance">
            Construo IA <EditorialAccent>multi-agente</EditorialAccent> em produção, e o produto
            inteiro ao redor dela.
          </HeadlineWordReveal>

          {/* Uma linha sobre o conjunto, não sobre um produto. O scrim de
              text-shadow segue porque a linha está sobre o vídeo (contraste
              medido por pixel em F4; a sonda s10 lê este slot). */}
          <p
            data-slot="hero-proof"
            className="max-w-[44ch] text-base leading-relaxed text-(--color-text-1) sm:text-lg"
            style={{
              textShadow:
                '0 0 1px color-mix(in oklch, var(--color-bg) 92%, transparent), 0 1px 2px color-mix(in oklch, var(--color-bg) 88%, transparent), 0 0 6px color-mix(in oklch, var(--color-bg) 72%, transparent)',
            }}
          >
            Cinco trabalhos, da equipe de agentes ao chão de fábrica. Cada um com captura real.
          </p>

          <CTAGroup />
        </div>

        <WorkIndex items={HERO_INDEX} />
      </div>

      {/* Partner marquee — logos infinite scroll. Stefan AMA esse modulo.
          O botão de pausa (vídeo + marquee) vive sobre a faixa, no canto. */}
      <div className="relative z-10">
        <PartnerMarquee />
        <HeroVideoToggle className="absolute top-1/2 right-4 -translate-y-1/2 sm:right-6" />
      </div>
    </section>
  );
}
