import Image from 'next/image';
import { ContactMonogramBackdrop } from '@/components/contact/contact-monogram-backdrop';
import { DirectLinksRow } from '@/components/contact/direct-links-row';
import { EditorialAccent } from '@/components/hero/editorial-accent';
import { cn } from '@/lib/utils';
import { ContactFormLazyMount } from './contact-form-lazy.client';

// Section 12 — Contact cinematic close.
//
// Estrutura peak-end:
//   1. Eyebrow + headline editorial massiva (4xl→6xl) com tracking tight.
//   2. Sub editorial sutil (text-reading max-w-prose).
//   3. Form premium centered (max-w-2xl) com inputs hairline + pill segmented + CTA pill.
//   4. Direct links: 4 cards minimal (WhatsApp / Email / LinkedIn / GitHub) em row.
//   5. Cal.com modal trigger ghost abaixo (HANDOFF §97: nunca link externo, sempre embedded).
//
// Decorativo (F6): só a hairline vertical na borda esquerda. O blob radial
// lime (60vh × 55vw em blur-3xl) e o carimbo SH cortado pelo canto saíram —
// o brand book veta glow e veta cortar/rotacionar a marca (v1 §17).

export function ContactSection() {
  return (
    <section
      id="contato"
      className={cn(
        'relative isolate overflow-hidden',
        // F8 (2026-09-05): fluxo normal de novo, como em 25/05. A margem
        // negativa do F5 (18/24dvh) fazia o Contact subir por cima do palco do
        // manifesto antes da assinatura terminar; o Stefan preferiu a versão
        // em que cada seção fica no seu lugar.
        'container-max section-pad-y-lg border-t border-(--color-hairline)'
      )}
      data-slot="contact"
    >
      <ContactMonogramBackdrop />

      <div className="relative z-10 flex flex-col gap-14 sm:gap-16">
        {/* HEADER cinematic — avatar gritty street + eyebrow + headline + sub.
            Avatar autoral (foto Stefan apoiado em GTR em garagem underground) +
            headline editorial. Vibe midu mas com atitude gritty propria. */}
        <header className="flex flex-col gap-8 sm:gap-10 lg:flex-row lg:items-start lg:gap-12">
          {/* Avatar editorial — vertical portrait 3:4 com hairline (F6: o halo
              lime de 32px saiu — retrato não é botão). Tilt -2deg adiciona personalidade (anti-perfeicao
              deliberada, princ. 10 estetica master). */}
          <div className="shrink-0">
            <div
              className={cn(
                'relative overflow-hidden rounded-2xl',
                'border border-(--color-hairline-strong)',
                'shadow-(--shadow-cinema)',
                // W-mob2 #5: w-28 (era w-32) em mobile — column single + headline editorial
                // não compete por largura. Mantém 3:4 portrait ratio.
                'h-40 w-28 sm:h-56 sm:w-40 lg:h-64 lg:w-48'
              )}
              style={{
                transform: 'rotate(-2deg)',
                boxShadow: 'var(--shadow-cinema)',
              }}
            >
              {/* W0.4 (2026-05-23): avatar PNG 3.07 MB → AVIF 384×512 15 KB
                  (-99.5%). next/image continua negociando densidade via sizes. */}
              <Image
                src="/avatar-stefan.avif"
                alt="Stefan Heinz Screpka, retrato autoral"
                fill
                sizes="(min-width: 1024px) 192px, (min-width: 640px) 160px, 128px"
                className="object-cover"
                style={{ objectPosition: 'center top' }}
              />
              {/* Hairline highlight top — inset border lime sutil */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    'linear-gradient(to right, transparent, var(--color-accent) 50%, transparent)',
                  opacity: 0.4,
                }}
              />
            </div>
          </div>

          {/* Headline editorial + sub */}
          <div className="flex max-w-4xl flex-col gap-5 sm:gap-6">
            {/* Eyebrow numeric final — "12 / 12" sequence (esta e a ultima section
                substantiva antes do footer). Anti-padrao mono uppercase universal. */}
            {/* W1.4 (2026-05-23): separadores /60 ficavam ~1.5:1 sobre base
                (invisível). Trocados por hairline-strong + aria-hidden — sai
                de scope de WCAG e mantém visual de "receipt". */}
            <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
              <span className="text-(--color-accent) tabular-nums">12</span>
              <span aria-hidden="true" className="mx-1.5 text-(--color-hairline-strong)">
                /
              </span>
              <span className="tabular-nums">12</span>
              <span aria-hidden="true" className="mx-2.5 text-(--color-hairline-strong)">
                ·
              </span>
              <span>próximo passo</span>
            </p>
            <h2
              className={cn(
                'headline-display text-(--color-text-1)',
                'text-3xl sm:text-4xl',
                'tracking-[-0.025em] !leading-[1.05] text-balance'
              )}
            >
              Tem algo complexo demais
              <br className="hidden sm:block" />
              {/* W-design #3: 3ª batida do leitmotif PP Editorial italic.
                  Hero "multi-agente", Manifesto "multi-agente", Contact "landing
                  genérica" — assinatura tipográfica recorrente. */}
              <span className="text-(--color-text-2)"> pra virar </span>
              <EditorialAccent>landing genérica</EditorialAccent>?
            </h2>
            <p className="max-w-prose text-reading text-(--color-text-2)">
              Form chega direto no meu email. Confirmação automática. Se prefere síncrono, WhatsApp
              ou Cal.com 15min embedded, sem ida e volta pra marcar horário.
            </p>
          </div>
        </header>

        {/* FORM stage — centered max-w-2xl pra concentrar atenção.
            Surface com hairline + inset bisel = card cinematic premium. */}
        <div
          className={cn(
            'mx-auto w-full max-w-3xl',
            'rounded-3xl border border-(--color-hairline) bg-(--color-surface)',
            'shadow-(--shadow-inset-bisel)',
            'p-6 sm:p-10 lg:p-12'
          )}
        >
          <ContactFormLazyMount />
        </div>

        {/* DIRECT LINKS row + Cal.com trigger (componente client) */}
        <div className="mx-auto w-full max-w-5xl">
          <DirectLinksRow />
        </div>
      </div>
    </section>
  );
}
