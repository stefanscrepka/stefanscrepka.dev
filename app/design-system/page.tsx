import type { Metadata } from 'next';
import { DialogsSection } from './_sections/dialogs';
import { EffectsSection } from './_sections/effects';
import { PrimitivesSection } from './_sections/primitives';
import { TokensSection } from './_sections/tokens';

export const metadata: Metadata = {
  title: 'Design System',
  description:
    'Tokens OKLCH, primitivos shadcn-style hand-written e effects atoms do portfolio stefanscrepka.dev. Lime A primária. Hand-written + radix-ui unified.',
  robots: { index: false, follow: false },
};

const TOC = [
  { label: '01 · Tokens', href: '#tokens' },
  { label: '02 · Primitivos', href: '#primitives' },
  { label: '03 · Diálogos', href: '#dialogs' },
  { label: '04 · Effects', href: '#effects' },
];

export default function DesignSystemPage() {
  return (
    <div className="container-max section-pad-y pt-32 flex flex-col gap-16">
      <header className="flex flex-col gap-5 max-w-3xl">
        <p className="eyebrow">/design-system</p>
        <h1 className="text-5xl font-semibold tracking-tight leading-[0.95]">Design system</h1>
        <p className="text-(--color-text-2) leading-relaxed max-w-prose">
          Sandbox de tokens + primitivos + diálogos + effects. Tudo hand-written em{' '}
          <code className="font-mono">components/ui/</code> e{' '}
          <code className="font-mono">components/ui-effects/</code> usando{' '}
          <code className="font-mono">radix-ui</code> unified +{' '}
          <code className="font-mono">cva</code> + <code className="font-mono">tw-animate-css</code>
          . Sem CLI shadcn — tokens OKLCH controlados end-to-end (gotcha #2 evitado: zero conflito
          HSL).
        </p>
        <nav className="flex flex-wrap gap-2 mt-2" aria-label="Sumário">
          {TOC.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-[11px] uppercase tracking-wider rounded-full border border-(--color-hairline) px-3 py-1.5 text-(--color-text-2) outline-none transition-colors hover:border-(--color-accent) hover:text-(--color-accent) focus-visible:border-(--color-accent) focus-visible:text-(--color-accent)"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <TokensSection />
      <PrimitivesSection />
      <DialogsSection />
      <EffectsSection />
    </div>
  );
}
