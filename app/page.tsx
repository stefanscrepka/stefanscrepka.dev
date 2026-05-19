import { HeroSection } from '@/components/sections/hero';
import { ManifestoSection } from '@/components/sections/manifesto';
import { SocialProofLine } from '@/components/sections/social-proof-line';

// Home — single-page scroll (12 seções).
// FASE 3 já: Hero (8-layer), SocialProofLine, Manifesto.
// FASE 4: WhatIBuild, Featured Work case studies, Other Work.
// FASE 5: Bento Skills, Timeline.
// FASE 6: Contato form + CalcomModal + DirectLinks.

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SocialProofLine />

      <PlaceholderSection
        id="work"
        index="03"
        eyebrow="Work"
        title="Featured work — Content Engine, NexaCore, STJ App"
        phase="FASE 4"
        body="Scroll-jacked horizontal pin dos 5 squads do Content Engine. MacBook Scroll com screenshot real do NexaCore admin. Compare Slider + Tracing Beam vertical do STJ App auth flow."
      />

      <PlaceholderSection
        id="process"
        index="04"
        eyebrow="Process"
        title="O que eu construo — IA multi-agente · Product Eng full-stack · Backend crítico"
        phase="FASE 4"
        body="Trio Direction Aware Hover cards. Bento skills grid 6 cells. Timeline carreira com Tracing Beam vertical mostrando Eletrotécnica SENAI → AI Product Engineer."
      />

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
