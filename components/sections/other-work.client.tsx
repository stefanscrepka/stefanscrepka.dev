'use client';

import { m, useInView } from 'motion/react';
import { type ReactNode, useRef } from 'react';
import { FlipCard } from '@/components/ui-effects/flip-card';
import { ProductCover } from '@/components/work/product-cover';
import { EASES } from '@/lib/animation/eases';
import { cn } from '@/lib/utils';

// Client islands para OtherWorkSection — FlipCard amber + reveal stagger.
// AMBER scope: `data-clinic-scope` opcional pra css overrides futuros, mas aqui o
// amber vive APENAS dentro deste FlipCard via tone="amber" prop.

interface OtherWorkRevealProps {
  children: ReactNode;
}

export function OtherWorkReveal({ children }: OtherWorkRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5, ease: EASES.standard }}
    >
      {children}
    </m.div>
  );
}

interface EsteticaFlipCardClientProps {
  deeplink: string;
}

export function EsteticaFlipCardClient({ deeplink }: EsteticaFlipCardClientProps) {
  return (
    <FlipCard
      tone="amber"
      trigger="hover"
      axis="y"
      ariaLabel="Virar card Estética MD — ver detalhes"
      className="h-full min-h-[28rem]"
      front={
        <div className="flex h-full flex-col gap-5 p-6 sm:p-7" data-clinic-scope>
          <ProductCover
            mode="diagram"
            diagram="estetica"
            label="Estética MD — site institucional Dra. Martina Dona"
            tone="amber"
            aspectRatio="16/10"
          />
          <div className="flex flex-1 flex-col gap-3">
            <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
              Em produção desde Dez/2024
            </p>
            <h3 className="text-xl font-semibold leading-tight text-(--color-text-1)">
              Estética MD
            </h3>
            <p
              className="text-sm leading-relaxed font-semibold"
              style={{ color: 'var(--color-amber)' }}
            >
              Feito pra clínicas premium — estética, odonto, med spa.
            </p>
            <p className="text-sm leading-relaxed text-(--color-text-2)">
              Site institucional + conversão para Dra. Martina Dona (ozonioterapia, criolipólise,
              drenagem, RF, depilação laser, peeling). Vanilla JS antes do React.
            </p>
            <p className="mt-auto font-mono text-2xs text-(--color-text-3)">
              Passe o mouse / toque pra ver detalhes →
            </p>
          </div>
        </div>
      }
      back={
        <div className="flex h-full flex-col gap-4 p-6 sm:p-7" data-clinic-scope>
          <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
            Stack & detalhes
          </p>
          <ul className="flex flex-col gap-2 text-xs leading-relaxed text-(--color-text-2)">
            <li>HTML5 · CSS3 · JS vanilla · PHP + PHPMailer</li>
            <li>1.697 linhas CSS · 914 linhas JS · 41 imagens reais</li>
            <li>ScrollReveal · Typed.js · OwlCarousel2 · WhatsApp wa.me</li>
            <li>Custom cursor duplo (outer + inner) · lerp suave</li>
            <li>Navbar inteligente hide/show no scroll direction</li>
            <li>Parallax shapes trigonométrico (sin/cos drift)</li>
            <li>Formulário PHP + JS + CORS bilateral · emails dual</li>
          </ul>

          <p
            className="text-sm leading-relaxed font-semibold pt-2"
            style={{ color: 'var(--color-amber)' }}
          >
            Quer um site assim pra sua clínica?
          </p>
          <p className="text-xs leading-relaxed text-(--color-text-2)">
            Posicionamento premium. Conversão por WhatsApp. Cliente referência local. Sem template
            Shopify.
          </p>

          {/* CTA WhatsApp — amber tone, anchored bottom */}
          <a
            href={deeplink}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'mt-auto inline-flex items-center justify-center gap-2 rounded-pill px-5 py-3',
              'font-semibold text-sm shadow-(--shadow-md)',
              // Hover: translateY lift (NÃO scale) + glow expand. Active: micro
              // press feedback 0.98 (única vez que scale é OK = tactile button press).
              'transition-[transform,box-shadow] duration-(--motion-transition) ease-(--ease-smooth)',
              'hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98]',
              'focus-visible:-translate-y-[2px] outline-none'
            )}
            style={{
              backgroundColor: 'var(--color-amber)',
              color: 'var(--color-base)',
              boxShadow: 'var(--shadow-md), 0 0 24px oklch(82% 0.18 75 / 0.5)',
            }}
          >
            Conversar no WhatsApp →
          </a>
        </div>
      }
    />
  );
}
