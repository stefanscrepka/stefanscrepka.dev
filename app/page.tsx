import { FeaturedWorkSection } from '@/components/sections/featured-work';
import { HeroSection } from '@/components/sections/hero';
import { ManifestoSection } from '@/components/sections/manifesto';
import { OtherWorkSection } from '@/components/sections/other-work';
import { SocialProofLine } from '@/components/sections/social-proof-line';
import { WhatIBuildSection } from '@/components/sections/what-i-build';

// Home — single-page scroll storytelling.
// FASE 3: Hero (8-layer), SocialProofLine, Manifesto.
// FASE 4: WhatIBuildSection (#process), FeaturedWorkSection (#work preview), OtherWorkSection.
// FASE 5: Bento Skills, Timeline.
// FASE 6: Contato form + CalcomModal + DirectLinks.

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SocialProofLine />
      <FeaturedWorkSection />
      <WhatIBuildSection />
      <OtherWorkSection />
      <ManifestoSection />

      <PlaceholderSection
        id="contato"
        index="12"
        eyebrow="Contato"
        title="Vamos conversar"
        phase="FASE 6"
        body="Form Resend Server Action + react-hook-form + Zod. Cal.com modal embedded 15min. WhatsApp pré-preenchido. Email direto. Vercel BotID anti-spam invisível."
      />
    </>
  );
}

function PlaceholderSection({
  id,
  index,
  eyebrow,
  title,
  phase,
  body,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  phase: string;
  body: string;
}) {
  return (
    <section id={id} className="container-max section-pad-y border-t border-(--color-hairline)">
      <div className="flex max-w-3xl flex-col gap-4">
        <p className="eyebrow">
          {index} · {eyebrow}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        <p className="max-w-prose leading-relaxed text-(--color-text-2)">{body}</p>
        <p className="mt-2 font-mono text-xs text-(--color-text-3)">
          {'// preenche em '}
          {phase}
        </p>
      </div>
    </section>
  );
}
