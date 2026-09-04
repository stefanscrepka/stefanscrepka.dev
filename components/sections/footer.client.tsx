'use client';

import { m } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { usePausedOffscreen } from '@/hooks/use-paused-offscreen';
import { EASES } from '@/lib/animation/eases';

// Ilhas client do Footer (RSC):
//
// 1. FooterBreathingHairline — F3.5 (2026-06-11): a hairline lime que
//    "respira" (hairline-breathe 4s infinite) pausa fora da viewport.
//
// 2. FooterClosing — F3.9 (2026-06-11): a frase peak-end ("Se não funciona
//    24/7, não conta.") ganha um beat próprio quando entra na viewport.
//
// 3. FooterRevealSpacer — F7 (2026-09-04): o rodapé fica FIXO atrás da página
//    (padrão "parallax footer" do acervo, hyperiux/parallax-footer): o
//    conteúdo sobe e revela o rodapé como último beat, em vez de o rodapé
//    rolar junto. Isso pede um espaçador em fluxo com a altura exata do
//    rodapé; a altura é medida por ResizeObserver e vira `--footer-h`. No
//    mobile (< md) o rodapé volta ao fluxo normal e o espaçador some, porque
//    um rodapé fixo mais alto que a tela não teria como ser rolado.

export function FooterBreathingHairline() {
  const ref = useRef<HTMLDivElement>(null);
  usePausedOffscreen(ref);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-px motion-safe:[animation:hairline-breathe_4s_ease-in-out_infinite]"
      style={{
        background:
          'linear-gradient(to right, transparent 0%, var(--color-accent) 50%, transparent 100%)',
        opacity: 0.4,
      }}
    />
  );
}

export function FooterClosing() {
  return (
    <m.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: EASES.outQuint }}
      className="max-w-2xl text-2xl font-semibold !leading-[1.1] !tracking-[-0.02em] text-(--color-text-1) sm:text-3xl lg:text-4xl"
    >
      Se não funciona 24/7, não conta.
    </m.p>
  );
}

const FALLBACK_FOOTER_HEIGHT = 560;

export function FooterRevealSpacer() {
  const [height, setHeight] = useState<number>(FALLBACK_FOOTER_HEIGHT);

  useEffect(() => {
    const footer = document.querySelector<HTMLElement>('[data-slot="footer"]');
    if (!footer || typeof ResizeObserver === 'undefined') return;
    const apply = () => setHeight(Math.ceil(footer.getBoundingClientRect().height));
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(footer);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      aria-hidden="true"
      data-slot="footer-spacer"
      className="hidden md:block"
      style={{ height }}
    />
  );
}
