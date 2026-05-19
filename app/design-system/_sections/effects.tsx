import { ProductMockup } from '@/components/ui-effects/product-mockup';
import { cn } from '@/lib/utils';

export function EffectsSection() {
  return (
    <section id="effects" className="flex flex-col gap-12">
      <header className="flex flex-col gap-2 hairline-bottom pb-6">
        <p className="eyebrow">04 · Effects</p>
        <h2 className="text-3xl font-semibold tracking-tight">ProductMockup + GrainOverlay</h2>
        <p className="max-w-prose text-(--color-text-2) leading-relaxed text-sm">
          <code className="font-mono">{'<ProductMockup />'}</code> aplica chrome CSS-only sobre
          screenshots raw (zero re-encode de pixels).{' '}
          <code className="font-mono">{'<GrainOverlay />'}</code>
          já está ativo globalmente — fixed inset-0 mix-blend-overlay opacity 4%, drift 60s loop.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-3)">
          ProductMockup — tone × tilt
        </p>
        <div className="grid gap-8 lg:grid-cols-3">
          <ProductMockup tone="lime" tilt="subtle" caption="tone=lime · tilt=subtle (default)">
            <MockScreen label="content-engine-dashboard.png" />
          </ProductMockup>

          <ProductMockup
            tone="amber"
            tilt="subtle"
            caption="tone=amber · tilt=subtle (estética MD)"
          >
            <MockScreen label="estetica-md-home.png" amber />
          </ProductMockup>

          <ProductMockup tone="lime" tilt="deep" caption="tone=lime · tilt=deep (case study hero)">
            <MockScreen label="nexacore-admin.png" />
          </ProductMockup>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-(--color-hairline) p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-3)">
          GrainOverlay — ativo globalmente (camada 8, fixed inset-0)
        </p>
        <p className="text-sm text-(--color-text-2) leading-relaxed max-w-prose">
          Look pra cima/baixo da página — o grão SVG feTurbulence está em todo lugar com{' '}
          <code className="font-mono">mix-blend-overlay opacity 0.04</code>. Drift{' '}
          <code className="font-mono">--motion-drift (60s)</code> linear infinite. Reduced-motion
          baseline override globalmente mata o drift via{' '}
          <code className="font-mono">@media (prefers-reduced-motion: reduce)</code>.
        </p>
      </div>
    </section>
  );
}

function MockScreen({ label, amber = false }: { label: string; amber?: boolean }) {
  return (
    <div
      className={cn(
        'flex aspect-[16/10] w-full flex-col gap-3 p-5',
        'bg-(--color-surface-elevated)',
        amber ? 'text-(--color-amber)' : 'text-(--color-accent)'
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-wider text-(--color-text-3)">
        {label}
      </span>
      <div className="grid flex-1 grid-cols-3 gap-2">
        <div className="rounded-sm bg-(--color-surface-overlay)" />
        <div className="col-span-2 rounded-sm bg-(--color-surface-overlay)" />
        <div className="col-span-2 rounded-sm bg-(--color-surface-overlay)" />
        <div className="rounded-sm bg-(--color-surface-overlay)" />
      </div>
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            'h-1.5 w-16 rounded-pill',
            amber ? 'bg-(--color-amber)' : 'bg-(--color-accent)'
          )}
        />
        <span className="font-mono text-[10px] text-(--color-text-3)">screenshot raw</span>
      </div>
    </div>
  );
}
