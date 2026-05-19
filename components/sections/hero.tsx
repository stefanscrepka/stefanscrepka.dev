import { CodeMarquee } from '@/components/hero/code-marquee';
import { CTAGroup } from '@/components/hero/cta-group';
import { EditorialAccent } from '@/components/hero/editorial-accent';
import { HeroSceneClient } from '@/components/hero/hero-scene.client';
import { MonoSubhead } from '@/components/hero/mono-subhead';
import { PartnerMarquee } from '@/components/hero/partner-marquee';
import { SplitTextHeadline } from '@/components/hero/split-text-headline';
import { StatsRow } from '@/components/hero/stats-row';
import { StatusBadge } from '@/components/hero/status-badge';
import { TimeClock } from '@/components/hero/time-clock';

// Section 1 — Hero. Layout revisado pra densidade visual:
//   ─ Top bar: StatusBadge + TimeClock (HUD pattern Argus/IT Empire)
//   ─ Main grid: text col esquerda + r3f scene direita (mantém 8-layer)
//   ─ Code marquee Shiki SSR
//   ─ Stats row tabular-nums
//   ─ Partner marquee — logos stack/parceiros (pattern Lando Norris)
// Reduced-motion: 1-4 snap, 5 → poster SVG, 6 frame único, 7 valores finais, 8 pausado.

export async function HeroSection() {
  return (
    <section id="hero" className="relative">
      {/* Top HUD bar — status + clock */}
      <div className="container-max flex items-center justify-between gap-4 pt-28 sm:pt-32">
        <StatusBadge label="disponível pra projetos" />
        <TimeClock />
      </div>

      {/* Main grid — headline + r3f */}
      <div
        className={[
          'container-max grid items-center gap-10 pt-8 pb-14',
          'lg:min-h-[72dvh] lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-20',
        ].join(' ')}
      >
        <div className="flex flex-col gap-7 lg:gap-9">
          <SplitTextHeadline>
            Construo IA <EditorialAccent delay={1.25}>multi-agente</EditorialAccent> em produção — e
            o produto inteiro ao redor dela.
          </SplitTextHeadline>

          <MonoSubhead>
            AI Product Engineer · Claude SDK + Next 16 + TypeScript · três produtos rodando 24/7.
          </MonoSubhead>

          <CTAGroup />
        </div>

        <div
          className={[
            'relative aspect-square w-full max-w-[560px] overflow-hidden rounded-xl',
            'border border-(--color-hairline) bg-(--color-base) place-self-center',
            'lg:aspect-auto lg:min-h-[520px] lg:max-w-none lg:place-self-stretch',
          ].join(' ')}
          style={{ backgroundColor: '#080A07' }}
        >
          <HeroSceneClient className="absolute inset-0 h-full w-full" />
        </div>
      </div>

      {/* Code marquee strip — R-15 anti-slop validator real */}
      <CodeMarquee />

      {/* Stats row strip */}
      <div className="container-max py-6 hairline-bottom">
        <StatsRow />
      </div>

      {/* Partner marquee — stack/parceiros logos infinite scroll */}
      <PartnerMarquee />
    </section>
  );
}
