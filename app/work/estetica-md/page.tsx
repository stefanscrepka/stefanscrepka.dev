import type { Metadata } from 'next';
import { CaseStudyHero } from '@/components/work/case-study-hero';
import { ScreenshotPlaceholder } from '@/components/work/screenshot-placeholder';
import { getCaseStudy } from '@/lib/work/data';

const CS = getCaseStudy('estetica-md');

export const metadata: Metadata = {
  title: `${CS?.title ?? 'Estética MD'} — Case Study`,
  description: CS?.tagline ?? '',
};

// /work/estetica-md — Amber accent isolated. Sem interactive componente complexo;
// pattern editorial premium pra clínica buyer não-técnica.

export default function EsteticaMDPage() {
  if (!CS) return null;

  return (
    <main data-clinic-scope className="pb-32">
      <CaseStudyHero cs={CS} />

      <div className="container-max grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="order-2 lg:order-1">
          <ScreenshotPlaceholder
            label="estetica-md-home.png"
            caption="Site institucional pra Dra. Martina Dona · em produção desde Dez/2024"
            tone="amber"
            aspectRatio="3/2"
          />
        </div>
        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <p
            className="text-xl font-semibold leading-relaxed"
            style={{ color: 'var(--color-amber)' }}
          >
            Feito pra clínicas premium — estética, odonto, med spa.
          </p>
          <ul className="flex flex-col gap-2.5 text-sm leading-relaxed text-(--color-text-2)">
            {CS.details.map((d) => (
              <li key={d} className="flex gap-2">
                <span aria-hidden="true" style={{ color: 'var(--color-amber)' }}>
                  ·
                </span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="container-max mt-20 grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">Stack</p>
          <ul className="flex flex-col gap-2 font-mono text-xs leading-relaxed text-(--color-text-2)">
            {CS.stack.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div
          className="flex flex-col gap-3 rounded-2xl p-6"
          style={{
            border: '1px solid var(--color-hairline-strong)',
            backgroundColor: 'var(--color-surface)',
            boxShadow: 'var(--shadow-md), 0 0 32px oklch(82% 0.18 75 / 0.12)',
          }}
        >
          <p
            className="font-mono text-[11px] uppercase tracking-widest"
            style={{ color: 'var(--color-amber)' }}
          >
            Quer um site assim pra sua clínica?
          </p>
          <p className="text-sm leading-relaxed text-(--color-text-1)">
            Posicionamento premium. Conversão por WhatsApp. Cliente referência local. Sem template
            Shopify.
          </p>
          <p className="text-xs leading-relaxed text-(--color-text-2)">
            Conversa de 15min direto no WhatsApp ou Cal.com pra avaliar fit.
          </p>
        </div>
      </section>
    </main>
  );
}
