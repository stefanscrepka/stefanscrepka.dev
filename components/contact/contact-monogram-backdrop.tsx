// Decorative SH monogram backdrop atrás do Contact.
// Outline lime grande (opacity 0.08-0.12) ancorado bottom-right do section,
// CSS-only · zero JS · aria-hidden. Mesma geometria do SHMonogram canonical
// pra reforçar identidade sem mostrar avatar/foto.

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

      {/* Monograma SH gigante outline lime — ancora bottom-right.
          Stroke 0.8 dá feel de blueprint, opacity baixa pra não competir com form.
          aspect-square + clamp pra escalar de mobile (240px) até desktop (640px). */}
      <svg
        viewBox="0 0 32 32"
        className="absolute -right-12 -bottom-16 sm:-right-16 sm:-bottom-24"
        style={{
          width: 'clamp(280px, 50vw, 640px)',
          height: 'clamp(280px, 50vw, 640px)',
          color: 'var(--color-accent)',
          opacity: 0.1,
        }}
        focusable="false"
        aria-hidden="true"
      >
        <title>SH monograma decorativo</title>
        {/* S — sigmoide */}
        <path
          d="M12 5
             Q 4 5 4 9
             Q 4 12 8 13.2
             Q 12 14.4 12 17.6
             Q 12 22 4 22"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* H — duas verticais + travessão */}
        <path
          d="M20 5 V22 M28 5 V22 M20 13.5 H28"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

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
