'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';
import { ManifestoBackdrop } from './manifesto-backdrop';
import { ManifestoBody } from './manifesto-body';
import { SignatureStefan } from './signature-stefan-svg';

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
//   <section id="manifesto" h-[200vh] bg-(--color-bg) relative>
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
      if (reduced === null) return;

      // F3.1 (2026-06-11): elementos do trim-path da assinatura — 3 strokes
      // de máscara seguindo o ductus (S → "tefan" → flourish) + rect de
      // segurança do estado final. Ver signature-stefan-svg.tsx.
      const sigSegs = sig.querySelectorAll<SVGPathElement>('[data-sig-seg]');
      const sigMaskFill = sig.querySelector<SVGRectElement>('[data-sig-mask-fill]');

      if (reduced) {
        gsap.set(inner, { scale: FINAL_SCALE });
        // W-perf (2026-05-25): frame agora é overlay opacity em vez de
        // animar backgroundColor/borderColor (não composited, força paint).
        gsap.set(frame, { opacity: 1 });
        gsap.set(name, { opacity: 0.08, scale: 1 });
        gsap.set(atmosphere, { opacity: 1 });
        // Markup default já é assinatura completa (dashoffset 0 + rect on).
        gsap.set(sig, { opacity: 1 });
        return;
      }

      // Initial state — manifesto natural visivel, sem frame/bg/signature.
      gsap.set(inner, { scale: 1, opacity: 1, transformOrigin: 'center center' });
      gsap.set(frame, { opacity: 0 });
      gsap.set(name, { opacity: 0, scale: 1.2 });
      gsap.set(atmosphere, { opacity: 0 });
      gsap.set(sig, { opacity: 0 });
      // attr plugin (não CSS): o CSSPlugin não interpola strokeDashoffset
      // mid-tween (snap binário no fim — medido em _audit/f3-tween-test.html);
      // animar o atributo interpola e evita inline-style sobre o markup.
      gsap.set(sigSegs, { attr: { 'stroke-dashoffset': 1 } });
      if (sigMaskFill) gsap.set(sigMaskFill, { opacity: 0 });

      const tl = gsap.timeline();

      // ENTRY (0 → 0.5) — manifesto encolhe + bg layers emergem + sig fade-in.
      // W-perf (2026-05-25): expo.inOut → power2.out — expo congelava 1ª
      // metade do scrub e espasmava 2ª (curva agressiva demais pra reveal
      // cinematográfico). power2.out tem deceleração natural, mais Apple-tier.
      tl.to(name, { opacity: 0.08, scale: 1, ease: 'power2.out', duration: 0.45 }, 0);
      tl.to(atmosphere, { opacity: 1, ease: 'power1.out', duration: 0.15 }, 0);
      tl.to(inner, { scale: FINAL_SCALE, ease: 'power2.out', duration: 0.5 }, 0);
      tl.to(frame, { opacity: 1, ease: 'power2.out', duration: 0.4 }, 0.05);

      // SIGNATURE drawn (0.3 → 0.87) — F3.1 (2026-06-11): trim-path REAL.
      // Era clip-path linear (wipe esquerda→direita); agora 3 strokes de
      // máscara seguem o ductus da escrita com easing por segmento
      // (equivalente ao Trim Path do Rive que o Lando usa):
      //   S        power1.inOut — a caneta acelera no meio da curva grande
      //   "tefan"  power1.out   — letras correntes, desacelera no n
      //   flourish power2.out   — a volta sob o nome é um golpe rápido e
      //                           confiante (assinatura real: letras lentas,
      //                           flourish snap)
      // Overlap de 0.02 entre segmentos = continuidade de caneta no scrub.
      tl.to(sig, { opacity: 1, ease: 'power1.out', duration: 0.06 }, 0.3);
      if (sigSegs.length === 3) {
        tl.to(
          sigSegs[0] as SVGPathElement,
          { attr: { 'stroke-dashoffset': 0 }, ease: 'power1.inOut', duration: 0.24 },
          0.3
        );
        tl.to(
          sigSegs[1] as SVGPathElement,
          { attr: { 'stroke-dashoffset': 0 }, ease: 'power1.out', duration: 0.26 },
          0.52
        );
        tl.to(
          sigSegs[2] as SVGPathElement,
          { attr: { 'stroke-dashoffset': 0 }, ease: 'power2.out', duration: 0.09 },
          0.76
        );
        if (sigMaskFill) {
          // Rede de segurança: fecha a máscara 100% no fim (antialiasing das
          // pontas dos strokes não deixa resíduo no estado final).
          tl.to(sigMaskFill, { opacity: 1, duration: 0.02 }, 0.85);
        }
      } else {
        // Fallback defensivo (máscara ausente): wipe antigo.
        gsap.set(sig, { clipPath: 'inset(0 100% 0 0)' });
        tl.to(sig, { clipPath: 'inset(0 0% 0 0)', ease: 'power2.inOut', duration: 0.55 }, 0.3);
      }

      // HOLD signature visible (0.87 → 1.0) — sticky CSS libera naturalmente
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
    { dependencies: [reduced] }
  );

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className={cn(
        'relative isolate bg-(--color-bg)',
        // Altura define scroll length total. W2.3 (2026-05-23): reduzido de
        // 200vh → 180vh — pin range de 100vh → 80vh. W-mob (2026-05-24):
        // mobile 130vh (pin range 30vh ≈ 2 swipes) preserva reveal cinemático
        // sem prender scroll em viewport pequeno. Stick range proporcional via
        // section.offsetHeight - innerHeight (GSAP scrub adapta automático).
        // W-mob (2026-05-25): dvh em vez de vh — iOS Safari URL bar dinâmica
        // criava jank ~80px de buffer + signature SVG descentrada.
        'h-[130dvh] md:h-[180dvh]',
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
      <div className="sticky top-0 flex h-dvh w-full items-center justify-center overflow-hidden">
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
            style={{ fontSize: 'clamp(110px, 24vw, 280px)', opacity: 0 }}
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
            encolhe scale 1 → 0.4. Frame wrapper bg/border emerge via opacity
            de uma layer pré-renderizada (W-perf 2026-05-25 — antes animava
            backgroundColor/borderColor que não são composited e forçavam
            paint inteiro a cada frame de scroll). */}
        <div ref={innerRef} className="container-prose relative z-[20] will-change-transform">
          <div className="relative px-6 py-8 sm:px-10 sm:py-12">
            {/* Frame overlay: bg surface-deep + border lime alpha, opacity
                animada via GSAP. Quando opacity 0, manifesto natural visível.
                Quando opacity 1, frame retangular emerge — efeito Lando reveal. */}
            <div
              ref={frameRef}
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute inset-0 rounded-3xl border will-change-[opacity]',
                'border-(--color-accent)/30 bg-(--color-surface-deep)/75'
              )}
            />
            <div className="relative">
              <ManifestoBody enableWordStagger />
            </div>
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
            <div className="flex w-full items-center justify-center [&>svg]:h-auto [&>svg]:max-h-[55vh] [&>svg]:w-full">
              <SignatureStefan />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
