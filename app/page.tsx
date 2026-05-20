import { BentoSkillsSection } from '@/components/sections/bento-skills';
import { ContactSection } from '@/components/sections/contact';
import { FeaturedWorkSection } from '@/components/sections/featured-work';
import { HeroSection } from '@/components/sections/hero';
import { ManifestoSection } from '@/components/sections/manifesto';
import { OtherWorkSection } from '@/components/sections/other-work';
import { TimelineSection } from '@/components/sections/timeline';

// Home — single-page scroll storytelling.
// Wave 1 (demolição): removidos SilentFrame, SocialProofLine, WhatIBuildSection
// (estavam visualmente perdidos / redundantes com FeaturedWork).
// Wave 3 vai adicionar BentoProcessos (gifs de processos reais) entre HeroSection
// e FeaturedWorkSection, substituindo o WhatIBuild.

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedWorkSection />
      <OtherWorkSection />
      <BentoSkillsSection />
      <TimelineSection />
      <ManifestoSection />
      <ContactSection />
    </>
  );
}
