import { DirectLinks } from '@/components/contact/direct-links';
import { ContactForm } from './contact-form.client';

// Section 12 — Contato.
// 2-col desktop (form esquerda · direct-links direita) · stack mobile.
// HANDOFF §97: Cal.com sempre modal embedded (DirectLinks tem o trigger).
// HANDOFF §148 gotcha #10: Resend direct no Server Action (sem waitUntil).

export function ContactSection() {
  return (
    <section
      id="contato"
      className="container-max section-pad-y border-t border-(--color-hairline)"
      data-slot="contact"
    >
      <header className="mb-12 flex flex-col gap-3 sm:mb-16">
        <p className="eyebrow">VAMOS CONVERSAR</p>
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl !leading-[0.95]">
          Conta o problema.
          <br />
          Respondo em &lt;12h.
        </h2>
        <p className="mt-2 max-w-prose text-(--color-text-2) leading-relaxed">
          Form chega direto no meu email. Confirmação automática. Se prefere síncrono, WhatsApp ou
          Cal.com 15min embedded — sem ida-e-volta pra marcar horário.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
        <ContactForm />
        <DirectLinks />
      </div>
    </section>
  );
}
