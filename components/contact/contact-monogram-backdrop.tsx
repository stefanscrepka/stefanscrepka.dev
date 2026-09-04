import { cn } from '@/lib/utils';

// Decorativo atrás do Contact — F6 (2026-09-04): só a hairline vertical.
//
// O que saiu, e por quê:
//   • O blob radial lime (60vh × 55vw, blur-3xl, "light leak") — a maior
//     mancha de fumaça verde da parte de baixo da página; brand book v1 §17
//     veta glow, §11 fixa lime em 2% da massa.
//   • O carimbo SH em outline sangrando 30% pelo canto — em qualquer frame lia
//     como polígonos soltos, e o brand book veta cortar/rotacionar a marca
//     ("Do not stretch, rotate or rebuild the mark"). A marca inteira já vive
//     na nav e no rodapé, nos tamanhos que o brand book prevê.
// aria-hidden, zero JS, CSS-only.

interface ContactMonogramBackdropProps {
  className?: string;
}

export function ContactMonogramBackdrop({ className }: ContactMonogramBackdropProps) {
  return (
    <div
      aria-hidden="true"
      data-slot="contact-monogram-backdrop"
      className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}
    >
      {/* Hairline vertical na borda esquerda — sinaliza "interior técnico" no
          close; um único traço, a meia força, esvaindo nas pontas. */}
      <div
        className="absolute left-0 top-0 h-full w-px"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, var(--color-accent-emissive) 40%, var(--color-accent-emissive) 60%, transparent 100%)',
          opacity: 0.3,
        }}
      />
    </div>
  );
}
