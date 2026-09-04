'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';
import { ManifestoBackdrop } from './manifesto-backdrop';
import { ManifestoBody } from './manifesto-body';
import { SignatureStefan } from './signature-stefan-svg';

// F5 (2026-09-02): DrawSVGPlugin (+2.2 KB gz neste chunk, que já é dynamic)
// mede o comprimento real de cada stroke e interpola o dash. GSAP 3.13+ é
// gratuito com todos os plugins.
gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

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
//   <section id="manifesto" h-[180dvh] bg-(--color-bg) relative>
//     <div sticky top-0 h-screen overflow-hidden>
//       <ManifestoBackdrop /> + <bg name> + <atmosphere>
//       <inner manifesto REAL — encolhe scale 1 → 0.4>
//         <frame wrapper — bg/border emerge (vira retangulo)>
//           <ManifestoBody />
//         </frame>
//       </inner>
//       <signature SVG lime overtop — escrita pelo scroll, ductus real>
//     </div>
//   </section>
//
// Sticky range = section.height - viewport.height. Apos esse range, sticky
// desprende NATURALMENTE, inner translata up junto com outer, ContactSection
// emerge pelo bottom no doc flow. ZERO teletransporte, ZERO buraco.
//
// F7/F8 (2026-09-04/05) — a assinatura é guiada pelo SCROLL (scrub), como em
// maio, mas sobre o ductus real: 30 trechos gerados do esqueleto do fill
// (signature-stefan-svg.tsx), cada traço com a própria curva, e a ponta da
// caneta (data-sig-pen) correndo na frente do traço. O F7 tinha trocado o
// scrub por tempo (2 s) e o Stefan reprovou: a assinatura esperava o scroll
// parar pra começar. Agora quem rola vê a caneta andar. O halo de
// drop-shadow que rasterizava o SVG numa bitmap borrada continua fora.

const FINAL_SCALE = 0.4;

// Janela da assinatura no range do sticky: começa a 30% (o cartão já quase
// no tamanho final) e fecha a 85%; o resto do range é hold com a assinatura
// completa, até o sticky soltar.
const SIGN_START = 0.3;

// Ritmo por traço, em fração do range (as janelas se encostam: pausas curtas
// = a caneta levantando). Curva por traço por cima dos trechos lineares.
const STROKE_TIMING: Record<string, { at: number; duration: number; ease: string }> = {
  s: { at: 0.3, duration: 0.2, ease: 'power1.inOut' },
  tefan: { at: 0.52, duration: 0.24, ease: 'power1.out' },
  tbar: { at: 0.78, duration: 0.035, ease: 'power2.out' },
};
const DOT_AT = 0.825;
const SIGN_END = 0.85;

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
        // F5/R7 (2026-09-02): `amount` distribui os 500ms pelo total de
        // palavras (≈7.5ms/palavra): o parágrafo inteiro está legível em ~1.1s
        // (Heer & Robertson 2007; Brysbaert 2019: 252ms/palavra).
        stagger: { amount: 0.5 },
        ease: 'expo.out',
        scrollTrigger: { trigger: innerRef.current, start: 'top 70%', once: true },
      });
      return () => {
        tween.kill();
      };
    },
    { dependencies: [reduced] }
  );

  // Timeline scrubbed do palco + assinatura no tempo.
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

      // Elementos da assinatura (signature-stefan-svg.tsx): traços em ordem
      // de escrita, cada um com seus trechos; o ponto; o rect de segurança; a
      // ponta da caneta.
      const strokes = Array.from(sig.querySelectorAll<SVGGElement>('[data-sig-stroke]'));
      const pieces = Array.from(sig.querySelectorAll<SVGPathElement>('[data-sig-piece]'));
      const dot = sig.querySelector<SVGCircleElement>('[data-sig-dot]');
      const maskFill = sig.querySelector<SVGRectElement>('[data-sig-mask-fill]');
      const pen = sig.querySelector<SVGCircleElement>('[data-sig-pen]');

      if (reduced) {
        gsap.set(inner, { scale: FINAL_SCALE });
        gsap.set(frame, { opacity: 1 });
        gsap.set(name, { opacity: 0.08, scale: 1 });
        gsap.set(atmosphere, { opacity: 1 });
        // Markup default já é a assinatura completa; explícito de qualquer forma.
        gsap.set(pieces, { drawSVG: '100%' });
        if (dot) gsap.set(dot, { opacity: 1 });
        if (maskFill) gsap.set(maskFill, { opacity: 1 });
        if (pen) gsap.set(pen, { opacity: 0 });
        gsap.set(sig, { opacity: 1 });
        return;
      }

      // Initial state — manifesto natural visivel, sem frame/bg/signature.
      gsap.set(inner, { scale: 1, opacity: 1, transformOrigin: 'center center' });
      gsap.set(frame, { opacity: 0 });
      gsap.set(name, { opacity: 0, scale: 1.2 });
      gsap.set(atmosphere, { opacity: 0 });
      gsap.set(sig, { opacity: 0 });
      gsap.set(pieces, { drawSVG: '0%' });
      if (dot) gsap.set(dot, { opacity: 0 });
      if (maskFill) gsap.set(maskFill, { opacity: 0 });
      if (pen) gsap.set(pen, { opacity: 0 });

      // ---- Palco + assinatura, tudo scrubbed -----------------------------
      const tl = gsap.timeline();

      // ENTRY (0 → 0.5) — manifesto encolhe + bg layers emergem + sig fade-in.
      // W-perf (2026-05-25): expo.inOut → power2.out — expo congelava 1ª
      // metade do scrub e espasmava 2ª (curva agressiva demais pra reveal
      // cinematográfico). power2.out tem deceleração natural, mais Apple-tier.
      tl.to(name, { opacity: 0.08, scale: 1, ease: 'power2.out', duration: 0.45 }, 0);
      tl.to(atmosphere, { opacity: 1, ease: 'power1.out', duration: 0.15 }, 0);
      tl.to(inner, { scale: FINAL_SCALE, ease: 'power2.out', duration: 0.5 }, 0);
      tl.to(frame, { opacity: 1, ease: 'power2.out', duration: 0.4 }, 0.05);
      tl.to(sig, { opacity: 1, ease: 'power1.out', duration: 0.06 }, SIGN_START);
      if (pen) tl.to(pen, { opacity: 1, duration: 0.03 }, SIGN_START);

      // Cada traço: sub-timeline linear (trecho dura o que mede) tweenada
      // pelo progress com a curva do traço, na janela dele dentro do scrub.
      for (const stroke of strokes) {
        const timing = STROKE_TIMING[stroke.dataset.sigStroke ?? ''];
        if (!timing) continue;
        const strokePieces = Array.from(
          stroke.querySelectorAll<SVGPathElement>('[data-sig-piece]')
        );
        const total = strokePieces.reduce((sum, p) => sum + Number(p.dataset.sigLen ?? '0'), 0);
        if (strokePieces.length === 0 || total <= 0) continue;
        const sub = gsap.timeline({ paused: true });
        for (const piece of strokePieces) {
          const share = Number(piece.dataset.sigLen ?? '0') / total;
          sub.to(piece, {
            drawSVG: '100%',
            duration: share,
            ease: 'none',
            onUpdate() {
              if (!pen) return;
              const len = piece.getTotalLength();
              const point = piece.getPointAtLength(len * this.progress());
              pen.setAttribute('cx', point.x.toFixed(1));
              pen.setAttribute('cy', point.y.toFixed(1));
            },
          });
        }
        tl.to(sub, { progress: 1, duration: timing.duration, ease: timing.ease }, timing.at);
      }
      if (dot) tl.to(dot, { opacity: 1, duration: 0.015 }, DOT_AT);
      if (pen) tl.to(pen, { opacity: 0, duration: 0.02 }, SIGN_END - 0.01);
      if (maskFill) {
        // Rede de segurança: fecha a máscara 100% no fim (antialiasing das
        // pontas dos trechos não deixa resíduo no estado final).
        tl.to(maskFill, { opacity: 1, duration: 0.01 }, SIGN_END);
      }
      // HOLD (0.86 → 1.0): assinatura completa até o sticky soltar.
      tl.to({}, { duration: 1 - SIGN_END - 0.01 }, SIGN_END + 0.01);

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
        // F8 (2026-09-05): de volta a 130/180dvh (25/05): o Contact não sobe
        // mais por cima do palco, então a seção não precisa da folga.
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

        {/* Signature SVG lime cursive overtop — z-30. F7: sem drop-shadow
            (o filter forçava o SVG a virar bitmap e borrava as bordas) e sem
            will-change: vetor puro, rasterizado pelo browser na resolução da
            tela a cada frame. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[30] flex items-center justify-center px-6"
        >
          <div
            ref={sigRef}
            className="flex w-full max-w-3xl items-center justify-center"
            style={{ color: 'var(--color-accent)' }}
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
