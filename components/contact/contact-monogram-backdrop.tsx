// Decorative SH monogram backdrop atrás do Contact.
// V3 (2026-05-24): usa <SHMonogram /> canonical (filled) com opacity 0.08 em vez
// de versão outline custom anterior. Coerência total com mark em top-bar/footer.
// aria-hidden, zero JS, CSS-only.

import { SHMonogram } from '@/components/shared/sh-monogram';
import { cn } from '@/lib/utils';

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
      {/* Gradient light leak top-right — sutil, faz a página "exalar" no fim */}
      <div
        className="absolute -top-32 right-[-10vw] h-[60vh] w-[55vw] rounded-full blur-3xl opacity-25"
        style={{
          background:
            'radial-gradient(circle at center, var(--color-accent-glow) 0%, transparent 70%)',
        }}
      />

      {/* Monograma SH gigante filled lime — ancora bottom-right.
          Opacity 0.08 dá feel de marca-d'água sem competir com form.
          Style.width/height sobrescreve width attribute pra escalar de mobile (280px)
          até desktop (640px) via clamp. */}
      <SHMonogram
        size={1024}
        className="absolute -right-12 -bottom-16 sm:-right-16 sm:-bottom-24"
        style={{
          width: 'clamp(280px, 50vw, 640px)',
          height: 'clamp(280px, 50vw, 640px)',
          color: 'var(--color-accent)',
          opacity: 0.08,
        }}
        aria-hidden="true"
      />

      {/* Scanline ultra-sutil left edge — sinaliza "interior técnico" no close */}
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
