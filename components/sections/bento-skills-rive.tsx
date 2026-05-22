'use client';

import { useRive } from '@rive-app/react-canvas';
import { cn } from '@/lib/utils';

// Rive interactive bento grid — substitui BentoSkills SVG procedural.
// Asset CC BY 4.0 do marketplace Rive (kidastudio):
// https://rive.app/marketplace/17543-36177-interactive-bento-grid/
// File em public/rive/bento-grid.riv (Stefan dropou).
//
// Credito kidastudio aparece no footer (License attribution per CC BY 4.0).

interface BentoSkillsRiveProps {
  className?: string;
}

export function BentoSkillsRive({ className }: BentoSkillsRiveProps) {
  const { RiveComponent } = useRive({
    src: '/rive/bento-grid.riv',
    autoplay: true,
    // Stateful interaction: state machine name detectado automaticamente.
    // Se file tiver multiple state machines, descobre via Rive editor.
    stateMachines: 'State Machine 1',
  });

  return (
    <section
      id="skills"
      className={cn('container-max section-pad-y border-t border-(--color-hairline)', className)}
    >
      <header className="mb-10 flex flex-col gap-3 sm:mb-14">
        <p className="eyebrow">STACK</p>
        <h2
          className="font-semibold tracking-tight text-3xl sm:text-4xl !leading-[1.05]"
          style={{ textWrap: 'balance' }}
        >
          Ferramentas que entram em produção.
        </h2>
        <p className="mt-2 max-w-prose text-reading" style={{ color: 'var(--color-text-2)' }}>
          Stack confirmado pelos três produtos rodando. Bento interativo — passe o mouse pelas
          células.
        </p>
      </header>

      {/* Rive canvas — aspect ratio do asset original (geralmente quadrado ou
          16/10). Fallback se file falhar: spinner sutil. */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-hairline)',
        }}
      >
        <RiveComponent
          className="h-full w-full"
          style={{
            backgroundColor: 'transparent',
          }}
        />
      </div>
    </section>
  );
}
