import dynamic from 'next/dynamic';
import { FeaturedWorkSection } from '@/components/sections/featured-work';
import { HeroSection } from '@/components/sections/hero';
import { SocialProofLine } from '@/components/sections/social-proof-line';

// Home — single-page scroll storytelling.
// SocialProofLine entre Hero e FeaturedWork = ponte narrativa de 3 linhas que
// sinaliza "três produtos em produção" antes do mergulho nos cases.
//
// W1.2 (2026-05-23): eager = fold-1 (Hero + SocialProof + FeaturedWork). Tudo
// abaixo carrega via next/dynamic com ssr=true (preserva SEO/HTML estático) +
// chunk client separado (hidratação deferida — reduz JS first-load gz).
// Manifesto e PlaygroundTeaser são os maiores ganhos (GSAP + Motion pesado).

const OtherWorkSection = dynamic(() =>
  import('@/components/sections/other-work').then((m) => ({ default: m.OtherWorkSection }))
);
const BentoSkillsSection = dynamic(() =>
  import('@/components/sections/bento-skills').then((m) => ({ default: m.BentoSkillsSection }))
);
const TimelineSection = dynamic(() =>
  import('@/components/sections/timeline').then((m) => ({ default: m.TimelineSection }))
);
const PlaygroundTeaser = dynamic(() =>
  import('@/components/sections/playground-teaser').then((m) => ({ default: m.PlaygroundTeaser }))
);
const ManifestoSection = dynamic(() =>
  import('@/components/sections/manifesto').then((m) => ({ default: m.ManifestoSection }))
);
const ContactSection = dynamic(() =>
  import('@/components/sections/contact').then((m) => ({ default: m.ContactSection }))
);

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SocialProofLine />
      <FeaturedWorkSection />
      <OtherWorkSection />
      <BentoSkillsSection />
      <TimelineSection />
      <PlaygroundTeaser />
      <ManifestoSection />
      <ContactSection />
    </>
  );
}
