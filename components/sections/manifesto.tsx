'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';
import { ManifestoBackdrop } from './manifesto-backdrop';
import { ManifestoBody } from './manifesto-body';

gsap.registerPlugin(ScrollTrigger);

// Section #manifesto — UNICA section, arquitetura Lando-fiel.
//
// Research agente confirma Lando real:
//   - NAO usa position: sticky CSS comum NEM GSAP pin: true
//   - 2 sections position:absolute top:0 stackeadas dentro de outer wrapper
//     com altura grande (~1800px = 2 viewports)
//   - Sticky CSS no inner conseguimos replicar esse comportamento
//   - Exit = translateY natural do outer wrapper (sem fade, sem cascade)
//   - 0px gap entre reveal e proxima section (NAO ha tela preta)
//
// Aqui:
//   <section id="manifesto" h-[200vh] bg-base relative>
//     <div sticky top-0 h-screen overflow-hidden>
//       <ManifestoBackdrop /> + <bg name> + <atmosphere>
//       <inner manifesto REAL — encolhe scale 1 → 0.4>
//         <frame wrapper — bg/border emerge (vira retangulo)>
//           <ManifestoBody />
//         </frame>
//       </inner>
//       <signature SVG lime overtop com clip-path reveal>
//     </div>
//   </section>
//
// Sticky range = section.height - viewport.height = 200vh - 100vh = 100vh
// de scroll travado durante o reveal. Apos esse range, sticky desprende
// NATURALMENTE, inner translata up junto com outer, ContactSection emerge
// pelo bottom no doc flow. ZERO teletransporte, ZERO buraco.

const FINAL_SCALE = 0.4;
const FRAME_BG = 'color-mix(in oklch, var(--color-surface-deep) 75%, transparent)';
const FRAME_BORDER = 'color-mix(in oklch, var(--color-accent) 28%, transparent)';

interface ManifestoSectionProps {
  className?: string;
}

export function ManifestoSection({ className }: ManifestoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const sigRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/signature-stefan.svg')
      .then((res) => res.text())
      .then((text) => {
        if (!cancelled) setSvgMarkup(text);
      })
      .catch(() => {
        if (!cancelled) setSvgMarkup(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Word-stagger no manifesto natural (entrada do sticky).
  useGSAP(
    () => {
      if (!innerRef.current || reduced === null || reduced) return;
      const wordEls = innerRef.current.querySelectorAll<HTMLSpanElement>('[data-word]');
      if (wordEls.length === 0) return;
      const tween = gsap.from(wordEls, {
        opacity: 0,
        y: 8,
        filter: 'blur(8px)',
        duration: 0.6,
        stagger: 0.035,
        ease: 'expo.out',
        scrollTrigger: { trigger: innerRef.current, start: 'top 70%', once: true },
      });
      return () => {
        tween.kill();
      };
    },
    { dependencies: [reduced] }
  );

  // Timeline scrubbed que anima durante o range do sticky.
  useGSAP(
    () => {
      const section = sectionRef.current;
      const inner = innerRef.current;
      const frame = frameRef.current;
      const name = nameRef.current;
      const atmosphere = atmosphereRef.current;
      const sig = sigRef.current;
      if (!section || !inner || !frame || !name || !atmosphere || !sig) return;
      if (reduced === null || svgMarkup === null) return;

      if (reduced) {
        gsap.set(inner, { scale: FINAL_SCALE });
        gsap.set(frame, { backgroundColor: FRAME_BG, borderColor: FRAME_BORDER });
        gsap.set(name, { opacity: 0.08, scale: 1 });
        gsap.set(atmosphere, { opacity: 1 });
        gsap.set(sig, { opacity: 1, clipPath: 'inset(0 0% 0 0)' });
        return;
      }

      // Initial state — manifesto natural visivel, sem frame/bg/signature.
      gsap.set(inner, { scale: 1, opacity: 1, transformOrigin: 'center center' });
      gsap.set(frame, { backgroundColor: 'transparent', borderColor: 'transparent' });
      gsap.set(name, { opacity: 0, scale: 1.2 });
      gsap.set(atmosphere, { opacity: 0 });
      gsap.set(sig, { opacity: 0, clipPath: 'inset(0 100% 0 0)' });

      const tl = gsap.timeline();

      // ENTRY (0 → 0.5) — manifesto encolhe + bg layers emergem + sig fade-in.
      tl.to(name, { opacity: 0.08, scale: 1, ease: 'power2.out', duration: 0.45 }, 0);
      tl.to(atmosphere, { opacity: 1, ease: 'power1.out', duration: 0.15 }, 0);
      tl.to(inner, { scale: FINAL_SCALE, ease: 'expo.inOut', duration: 0.5 }, 0);
      tl.to(
        frame,
        { backgroundColor: FRAME_BG, borderColor: FRAME_BORDER, ease: 'power2.out', duration: 0.4 },
        0.05
      );

      // SIGNATURE drawn (0.3 → 0.85) — clip-path reveal esquerda → direita.
      // NOTA: Lando usa Rive .riv com Trim Path keyframes seguindo o ductus
      // natural da escrita (curvado, com easing por segmento). Nossa SVG
      // solida nao suporta isso sem conversao pra stroke-based. Mantemos
      // clip-path linear como aproximacao.
      tl.to(sig, { opacity: 1, ease: 'power1.out', duration: 0.06 }, 0.3);
      tl.to(sig, { clipPath: 'inset(0 0% 0 0)', ease: 'power2.inOut', duration: 0.55 }, 0.3);

      // HOLD signature visible (0.85 → 1.0) — sticky CSS libera naturalmente
      // depois desse range, inner translata up junto com outer, ContactSection
      // emerge pelo bottom. Sem cascading exit manual.

      const trigger = ScrollTrigger.create({
        trigger: section,
        // Animation roda durante o range em que o sticky inner esta travado:
        // section.top → section.bottom - viewport_height.
        start: 'top top',
        end: () => `+=${section.offsetHeight - window.innerHeight}`,
        scrub: 1,
        invalidateOnRefresh: true,
        animation: tl,
      });

      const fontsReady = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts
        ?.ready;
      if (fontsReady) {
        fontsReady.then(() => ScrollTrigger.refresh());
      }

      return () => {
        trigger.kill();
      };
    },
    { dependencies: [reduced, svgMarkup] }
  );

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className={cn(
        'relative isolate bg-(--color-base)',
        // Altura define scroll length total. W2.3 (2026-05-23): reduzido de
        // 200vh → 180vh — pin range de 100vh → 80vh. Reveal mantém impacto
        // sem o "stuck feeling" do scroll travado por viewport inteiro.
        'h-[180vh]',
        className
      )}
      data-slot="manifesto"
    >
      {/* W1.5 (2026-05-23): h2 sr-only pra heading outline ter entrada
          "Manifesto" na navegação por headings (AT). Texto visível é blockquote
          + signature, sem heading semântico próprio antes. */}
      <h2 className="sr-only">Manifesto</h2>

      {/* Inner sticky — pin natural via CSS. Quando section.bottom passa
          viewport.bottom, sticky libera, inner sobe COM o outer junto. */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <ManifestoBackdrop />

        {/* Background nome "STEFAN HEINZ SCREPKA" gigante atras (z-5). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          }}
        >
          {/* W0.2 (2026-05-23): era <h2> decorativo. Saía no document outline
              de leitor de tela mesmo com aria-hidden no pai. Trocado por <div>
              com role=presentation pra cair fora da heading navigation. */}
          <div
            ref={nameRef}
            role="presentation"
            aria-hidden="true"
            className="whitespace-nowrap font-bold uppercase leading-none tracking-[0.02em] text-(--color-text-3) will-change-transform"
            style={{ fontSize: 'clamp(120px, 18vw, 280px)', opacity: 0 }}
          >
            STEFAN HEINZ SCREPKA
          </div>
        </div>

        {/* Atmosphere radial lime — z-10. */}
        <div
          ref={atmosphereRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[10]"
          style={{
            background: `radial-gradient(ellipse 55% 40% at 50% 50%,
              color-mix(in oklch, var(--color-accent) 14%, transparent) 0%,
              color-mix(in oklch, var(--color-accent) 5%, transparent) 35%,
              transparent 70%)`,
            opacity: 0,
          }}
        />

        {/* Inner manifesto + frame — z-20. Manifesto REAL (ATOS 1-5 completos),
            encolhe scale 1 → 0.4. Frame wrapper bg/border emerge. */}
        <div ref={innerRef} className="container-prose relative z-[20] will-change-transform">
          <div
            ref={frameRef}
            className="relative rounded-3xl border px-6 py-8 sm:px-10 sm:py-12 will-change-transform"
            style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
          >
            <ManifestoBody enableWordStagger />
          </div>
        </div>

        {/* Signature SVG lime cursive overtop — z-30 com drop-shadow glow. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[30] flex items-center justify-center px-6"
        >
          <div
            ref={sigRef}
            className="flex w-full max-w-3xl items-center justify-center will-change-transform"
            style={{
              color: 'var(--color-accent)',
              filter:
                'drop-shadow(0 0 28px color-mix(in oklch, var(--color-accent) 40%, transparent)) drop-shadow(0 0 10px color-mix(in oklch, var(--color-accent) 60%, transparent))',
            }}
          >
            <div
              className="flex w-full items-center justify-center [&>svg]:h-auto [&>svg]:max-h-[55vh] [&>svg]:w-full"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG markup local trusted (asset proprio)
              dangerouslySetInnerHTML={svgMarkup ? { __html: svgMarkup } : undefined}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
