import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CompareSlider } from '@/components/ui-effects/compare-slider';
import { TracingBeam } from '@/components/ui-effects/tracing-beam';
import { CaseImpactTriad } from '@/components/work/case-impact-triad';
import { CaseStudyHero } from '@/components/work/case-study-hero';
import { ProductCover } from '@/components/work/product-cover';
import { getCaseStudy } from '@/lib/work/data';
import { buildBreadcrumbJsonLd, buildCaseStudyJsonLd } from '@/lib/work/json-ld';

const CS = getCaseStudy('stj-app');

export const metadata: Metadata = {
  title: `${CS?.title ?? 'STJ App'} — Case Study`,
  description:
    'Cockpit operacional PWA pra equipe @linareis.fit. Claude Haiku 4.5 streaming + prompt cache 2 camadas + RAG pgvector + Vision CV validator + 162 testes. Supabase Auth + 2FA TOTP + Inngest workflows.',
  openGraph: {
    type: 'article',
    title: `${CS?.title ?? 'STJ App'} — Case Study · Stefan Heinz Screpka`,
    description:
      'PWA cockpit operacional. Claude Haiku 4.5 streaming + prompt cache 2 camadas + RAG pgvector. Supabase Auth + 2FA TOTP. 162 testes runtime.',
    url: '/work/stj-app',
  },
  alternates: { canonical: '/work/stj-app' },
};

const AUTH_FLOW = [
  {
    label: 'login → Supabase Auth',
    body: 'Email + senha. Sessão JWT via cookie httpOnly. Anti-bruteforce rate limiting (Upstash).',
  },
  {
    label: '2FA TOTP challenge',
    body: 'Após primeiro login OK, validação Time-Based OTP. Setup via QR code Authenticator.',
  },
  {
    label: 'Recovery codes opcionais',
    body: '10 single-use codes em fallback. Stored hashed em Supabase. Self-service regenerate.',
  },
  {
    label: 'PWA app shell loaded',
    body: 'Serwist registra service worker. Offline fallback page funcional. Asset precache otimizado.',
  },
];

export default function STJAppPage() {
  if (!CS) notFound();

  return (
    <div className="pb-32">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data SSR
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildCaseStudyJsonLd(CS)) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data SSR
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd(CS)) }}
      />
      <CaseStudyHero cs={CS} />

      {/* W3.2: Problema → Solução → Impacto antes do mergulho técnico. */}
      <CaseImpactTriad cs={CS} />

      <section className="container-max mt-12 flex flex-col gap-6">
        <p className="eyebrow">Antes · Depois</p>
        <h2 className="text-2xl font-semibold tracking-tight">
          Workflow manual → Evolution API automatizado
        </h2>
        <CompareSlider
          beforeLabel="Antes"
          afterLabel="Depois"
          before={
            <ProductCover
              mode="mockup"
              label="WORKFLOW MANUAL — antes Evolution API"
              tone="lime"
              aspectRatio="16/10"
              tilt="none"
              className="h-full border-0"
            >
              <div className="flex h-full flex-col items-center justify-center gap-3 bg-(--color-bg) p-4 font-mono text-xs text-(--color-text-3)">
                <span className="text-[11px] uppercase tracking-widest text-(--color-text-3)">
                  ANTES
                </span>
                <span className="text-(--color-text-1)">WhatsApp + Excel</span>
                <span className="text-(--color-text-3)">processo manual · 4-6h/dia</span>
                <span className="mt-2 inline-flex items-center gap-1 text-(--color-danger)">
                  ✕ erros copy-paste · sem audit · sem histórico
                </span>
              </div>
            </ProductCover>
          }
          after={
            <ProductCover
              mode="diagram"
              diagram="stj"
              label="EVOLUTION API — automação real-time STJ App"
              tone="lime"
              aspectRatio="16/10"
              tilt="none"
              className="h-full border-0"
            />
          }
        />
      </section>

      <section className="container-max mt-20 flex flex-col gap-6">
        <p className="eyebrow">Auth + 2FA Flow</p>
        <h2 className="text-2xl font-semibold tracking-tight">Quatro etapas, zero confiança</h2>
        <TracingBeam className="mt-4">
          <div className="flex flex-col gap-10 pb-8">
            {AUTH_FLOW.map((step, idx) => (
              <article key={step.label} className="flex flex-col gap-2">
                <p className="font-mono text-[11px] uppercase tracking-widest text-(--color-text-3)">
                  Passo {idx + 1}
                </p>
                <h3 className="text-lg font-semibold tracking-tight text-(--color-text-1)">
                  {step.label}
                </h3>
                <p className="text-sm leading-relaxed text-(--color-text-2)">{step.body}</p>
              </article>
            ))}
          </div>
        </TracingBeam>
      </section>

      <section className="container-max mt-20 grid gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <p className="eyebrow">Stack</p>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-(--color-text-2)">
            {CS.stack.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden="true" className="text-(--color-accent)">
                  ·
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <p className="eyebrow">Detalhes técnicos</p>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-(--color-text-2)">
            {CS.details.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden="true" className="text-(--color-accent)">
                  ·
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
