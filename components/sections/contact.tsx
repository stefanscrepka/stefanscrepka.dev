import { ContactMonogramBackdrop } from '@/components/contact/contact-monogram-backdrop';
import { DirectLinksRow } from '@/components/contact/direct-links-row';
import { cn } from '@/lib/utils';
import { ContactForm } from './contact-form.client';

// Section 12 — Contact cinematic close.
//
// Estrutura peak-end:
//   1. Eyebrow + headline editorial massiva (4xl→6xl) com tracking tight.
//   2. Sub editorial sutil (text-reading max-w-prose).
//   3. Form premium centered (max-w-2xl) com inputs hairline + pill segmented + CTA pill.
//   4. Direct links: 4 cards minimal (WhatsApp / Email / LinkedIn / GitHub) em row.
//   5. Cal.com modal trigger ghost abaixo (HANDOFF §97: nunca link externo, sempre embedded).
//
// Decorativo: monograma SH gigante lime outline opacity 0.1 ancorado bottom-right,
// scanline left edge ultra-sutil. Reforça identidade sem competir com form.

export function ContactSection() {
  return (
    <section
      id="contato"
      className={cn(
        'relative isolate overflow-hidden',
        'container-max section-pad-y-lg border-t border-(--color-hairline)'
      )}
      data-slot="contact"
    >
      <ContactMonogramBackdrop />

      <div className="relative z-10 flex flex-col gap-14 sm:gap-16">
        {/* HEADER cinematic — eyebrow + headline editorial + sub */}
        <header className="flex max-w-4xl flex-col gap-5 sm:gap-6">
          <p className="eyebrow">VAMOS CONVERSAR</p>
          <h2
            className={cn(
              'headline-display text-(--color-text-1)',
              'text-3xl sm:text-4xl',
              'tracking-[-0.025em] !leading-[1.05] text-balance'
            )}
          >
            Tem algo complexo demais
            <br className="hidden sm:block" />
            <span className="text-(--color-text-2)"> pra virar </span>
            <span className="text-(--color-accent)">landing genérica</span>?
          </h2>
          <p className="max-w-prose text-reading text-(--color-text-2)">
            Form chega direto no meu email. Confirmação automática. Se prefere síncrono, WhatsApp ou
            Cal.com 15min embedded — sem ida-e-volta pra marcar horário.
          </p>
        </header>

        {/* FORM stage — centered max-w-2xl pra concentrar atenção.
            Surface com hairline + inset bisel = card cinematic premium. */}
        <div
          className={cn(
            'mx-auto w-full max-w-3xl',
            'rounded-3xl border border-(--color-hairline) glass-panel',
            'shadow-(--shadow-inset-bisel)',
            'p-6 sm:p-10 lg:p-12'
          )}
        >
          <ContactForm />
        </div>

        {/* DIRECT LINKS row + Cal.com trigger (componente client) */}
        <div className="mx-auto w-full max-w-5xl">
          <DirectLinksRow />
        </div>
      </div>
    </section>
  );
}
