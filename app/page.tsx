import { BentoSkillsSection } from '@/components/sections/bento-skills';
import { ContactSection } from '@/components/sections/contact';
import { FeaturedWorkSection } from '@/components/sections/featured-work';
import { HeroSection } from '@/components/sections/hero';
import { ManifestoSection } from '@/components/sections/manifesto';
import { OtherWorkSection } from '@/components/sections/other-work';
import { SilentFrame } from '@/components/sections/silent-frame';
import { SocialProofLine } from '@/components/sections/social-proof-line';
import { TimelineSection } from '@/components/sections/timeline';
import { WhatIBuildSection } from '@/components/sections/what-i-build';

// Home — single-page scroll storytelling.
// FASE 3: Hero (8-layer), SocialProofLine, Manifesto.
// FASE 4: WhatIBuildSection (#process), FeaturedWorkSection (#work preview), OtherWorkSection.
// FASE 5: BentoSkillsSection (#skills), TimelineSection (#jornada).
// FASE 6: ContactSection (#contato) — form Resend + CalcomModal + DirectLinks + BotID.

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SocialProofLine />
      <SilentFrame />
      <FeaturedWorkSection />
      <WhatIBuildSection />
      <OtherWorkSection />
      <BentoSkillsSection />
      <TimelineSection />
      <ManifestoSection />
      <ContactSection />
    </>
  );
}
