import { BentoSkillsSection } from '@/components/sections/bento-skills';
import { ContactSection } from '@/components/sections/contact';
import { FeaturedWorkSection } from '@/components/sections/featured-work';
import { HeroSection } from '@/components/sections/hero';
import { ManifestoSection } from '@/components/sections/manifesto';
import { OtherWorkSection } from '@/components/sections/other-work';
import { SocialProofLine } from '@/components/sections/social-proof-line';
import { TimelineSection } from '@/components/sections/timeline';

// Home — single-page scroll storytelling.
// SocialProofLine entre Hero e FeaturedWork = ponte narrativa de 3 linhas que
// sinaliza "três produtos em produção" antes do mergulho nos cases. Substitui
// o trio "What I Build" removido (era redundante com FeaturedWork) sem deixar
// salto vazio entre Hero e Featured.

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SocialProofLine />
      <FeaturedWorkSection />
      <OtherWorkSection />
      <BentoSkillsSection />
      <TimelineSection />
      <ManifestoSection />
      <ContactSection />
    </>
  );
}
