import { CodeMarquee } from '@/components/hero/code-marquee';
import { CTAGroup } from '@/components/hero/cta-group';
import { EditorialAccent } from '@/components/hero/editorial-accent';
import { HeroSceneClient } from '@/components/hero/hero-scene.client';
import { MonoSubhead } from '@/components/hero/mono-subhead';
import { SplitTextHeadline } from '@/components/hero/split-text-headline';
import { StatsRow } from '@/components/hero/stats-row';

// Section 1 — Hero, ~100vh. 8-layer choreography:
//   1. SplitText words reveal (split-text-headline)
//   2. Italic underline draws (editorial-accent, delay 1.25s)
//   3. Subhead fade-up (mono-subhead, delay 0.4s)
//   4. CTAs scale+opacity stagger (cta-group, delay 0.6s)
//   5. r3f Scene mouse-parallax + idle drift (hero-scene.client)
//   6. Code marquee Shiki SSR infinite linear (code-marquee)
//   7. Stats count-up on view (stats-row)
//   8. Grain overlay global (já em layout.tsx)
// Reduced-motion: 1-4 snap, 5 → poster SVG, 6 frame único, 7 valores finais.

export async function HeroSection() {
  return (
    <section id="hero" className="relative">
      {/* Top — headline column + r3f scene column */}
      <div
        className={[
          'container-max grid items-center gap-10 pt-32 pb-16',
          'lg:min-h-[80dvh] lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-20',
        ].join(' ')}
      >
        <div className="flex flex-col gap-7 lg:gap-9">
          <SplitTextHeadline>
            Construo IA <EditorialAccent delay={1.25}>multi-agente</EditorialAccent> em produção — e
            o produto inteiro ao redor dela.
          </SplitTextHeadline>

          <MonoSubhead>
            AI Product Engineer · Claude SDK + Next 16 + TypeScript · três produtos rodando.
          </MonoSubhead>

          <CTAGroup />
        </div>

        <div className="relative aspect-square w-full max-w-[560px] place-self-center lg:max-w-none lg:place-self-stretch">
          <HeroSceneClient className="h-full w-full" />
        </div>
      </div>

      {/* Code marquee strip */}
      <CodeMarquee />

      {/* Stats row strip */}
      <div className="container-max py-6 hairline-bottom">
        <StatsRow />
      </div>
    </section>
  );
}
