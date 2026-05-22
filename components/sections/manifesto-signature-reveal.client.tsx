'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';

gsap.registerPlugin(ScrollTrigger);

// Lando Norris pattern — pin scroll-scrubbed zoom out reveal.
// User chega no fim do manifesto, pin ativa. Signature SVG comeca zoomed in
// AGRESSIVO (scale 4, dentro do path = invisivel formato) + opacity 0.
// Conforme scrolla, "camera afasta" — scale 4 → 1 + opacity 0 → 1 progressivo.
// SEM duplicar conteudo do manifesto (Stefan: "nao crie categoria nova").
//
// Bg opaco isolate + full-bleed escape do container-prose pai = camara escura
// propria, contato nao vaza durante pin.
// Reduced-motion: snap final (signature visivel scale 1, sem pin).

export function ManifestoSignatureReveal() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
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

  useGSAP(
    () => {
      if (!wrapRef.current || !svgRef.current) return;
      if (reduced === null || svgMarkup === null) return;

      // Reduced-motion: snap final (signature visivel).
      if (reduced) {
        gsap.set(svgRef.current, { scale: 1, opacity: 1, filter: 'blur(0px)' });
        return;
      }

      // Initial: signature ZOOMED IN scale 4 (camera dentro do path da assinatura,
      // ve-se apenas um pedaco zoomed/blurred) + opacity 0 invisivel.
      gsap.set(svgRef.current, { scale: 4, opacity: 0, filter: 'blur(8px)' });

      // Timeline scrubbed: scale 4 → 1 (camera afasta DRAMATICO) +
      // opacity 0 → 1 (reveal) + blur 8 → 0 (foco).
      const trigger = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: '+=120%', // 120vh scroll length pinned
        pin: true,
        anticipatePin: 1,
        scrub: 1,
        invalidateOnRefresh: true,
        animation: gsap.timeline().to(svgRef.current, {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'power1.inOut',
        }),
      });

      return () => {
        trigger.kill();
      };
    },
    { dependencies: [reduced, svgMarkup], scope: wrapRef }
  );

  return (
    <div
      ref={wrapRef}
      className="relative isolate flex h-screen w-screen items-center justify-center overflow-hidden bg-(--color-base)"
      style={{
        // Full-bleed escape do container-prose pai. Width 100vw + margin negativa
        // pra anular padding do <section> manifesto. mt-16 espacamento pos ATO 5.
        marginLeft: 'calc(50% - 50vw)',
        marginRight: 'calc(50% - 50vw)',
        marginTop: '4rem',
      }}
      aria-label="Assinatura Stefan Heinz Screpka"
    >
      {/* Atmosphere radial lime sutil (eco do hero) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 50%,
            color-mix(in oklch, var(--color-accent) 8%, transparent) 0%,
            transparent 70%)`,
        }}
      />

      {/* Signature SVG. SVG inline tem width="1536pt" hardcoded — arbitrary
          variant [&>svg] forca width 100% + max-height. Centered absolute. */}
      <div
        ref={svgRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 will-change-transform"
        style={{ color: 'var(--color-accent)' }}
        aria-hidden="true"
      >
        <div
          className="flex w-full max-w-4xl items-center justify-center [&>svg]:h-auto [&>svg]:max-h-[60vh] [&>svg]:w-full"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG markup local trusted (asset proprio)
          dangerouslySetInnerHTML={svgMarkup ? { __html: svgMarkup } : undefined}
        />
      </div>
    </div>
  );
}
