import { cn } from '@/lib/utils';

// === Color swatches ===
const COLOR_GROUPS = [
  {
    title: 'Surfaces',
    swatches: [
      { token: '--color-base', label: 'base' },
      { token: '--color-surface', label: 'surface' },
      { token: '--color-surface-elevated', label: 'surface-elevated' },
      { token: '--color-surface-overlay', label: 'surface-overlay' },
    ],
  },
  {
    title: 'Accent — Lime A',
    swatches: [
      { token: '--color-accent', label: 'accent' },
      { token: '--color-accent-hover', label: 'accent-hover' },
      { token: '--color-accent-subtle', label: 'accent-subtle' },
      { token: '--color-accent-emissive', label: 'accent-emissive' },
    ],
  },
  {
    title: 'Text',
    swatches: [
      { token: '--color-text-1', label: 'text-1' },
      { token: '--color-text-2', label: 'text-2' },
      { token: '--color-text-3', label: 'text-3' },
      { token: '--color-text-on-accent', label: 'text-on-accent' },
    ],
  },
  {
    title: 'Sub-accent — Amber (scope: /work/estetica-md)',
    swatches: [
      { token: '--color-amber', label: 'amber' },
      { token: '--color-amber-glow', label: 'amber-glow' },
    ],
  },
  {
    title: 'Borders & Semantic',
    swatches: [
      { token: '--color-hairline', label: 'hairline' },
      { token: '--color-hairline-strong', label: 'hairline-strong' },
      { token: '--color-success', label: 'success' },
      { token: '--color-warning', label: 'warning' },
      { token: '--color-danger', label: 'danger' },
      { token: '--color-info', label: 'info' },
    ],
  },
] as const;

const TYPE_SCALE = [
  { token: '--text-7xl', label: 'text-7xl', sample: 'Ag' },
  { token: '--text-6xl', label: 'text-6xl', sample: 'Heading display' },
  { token: '--text-5xl', label: 'text-5xl', sample: 'Heading display' },
  { token: '--text-4xl', label: 'text-4xl', sample: 'Heading large' },
  { token: '--text-3xl', label: 'text-3xl', sample: 'Heading medium' },
  { token: '--text-2xl', label: 'text-2xl', sample: 'Heading small' },
  { token: '--text-xl', label: 'text-xl', sample: 'Subheading' },
  { token: '--text-lg', label: 'text-lg', sample: 'Body large' },
  { token: '--text-base', label: 'text-base', sample: 'Body text — 17px cadence Apple' },
  { token: '--text-sm', label: 'text-sm', sample: 'Body small / form labels' },
  { token: '--text-xs', label: 'text-xs', sample: 'Caption / mono stats' },
] as const;

const SPACING_STOPS = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128] as const;

const MOTION_TOKENS = [
  { token: '--motion-instant', value: '50ms' },
  { token: '--motion-micro', value: '150ms' },
  { token: '--motion-fast', value: '200ms' },
  { token: '--motion-transition', value: '300ms' },
  { token: '--motion-modal', value: '400ms' },
  { token: '--motion-page', value: '600ms' },
  { token: '--motion-scroll', value: '800ms' },
  { token: '--motion-hero', value: '1200ms' },
] as const;

const EASING_TOKENS = [
  { token: '--ease-standard', value: 'cubic-bezier(0.2, 0, 0, 1)' },
  { token: '--ease-enter', value: 'cubic-bezier(0.05, 0.7, 0.1, 1)' },
  { token: '--ease-snappy', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  { token: '--ease-smooth', value: 'cubic-bezier(0.42, 0, 0.58, 1)' },
  { token: '--ease-dramatic', value: 'cubic-bezier(0.165, 0.84, 0.44, 1)' },
] as const;

export function TokensSection() {
  return (
    <section id="tokens" className="flex flex-col gap-12">
      <header className="flex flex-col gap-2 hairline-bottom pb-6">
        <p className="eyebrow">01 · Tokens</p>
        <h2 className="text-3xl font-semibold !tracking-[-0.025em] !leading-[1.05]">
          Cor, tipografia, espaço, motion
        </h2>
        <p className="max-w-prose text-(--color-text-2) leading-relaxed text-sm">
          Single source of truth em <code className="font-mono">@theme</code> em
          <code className="font-mono"> globals.css</code>. Lime A primária em todo o site, Amber
          sub-accent apenas dentro da seção/page Estética MD.
        </p>
      </header>

      {/* Color swatches */}
      <div className="flex flex-col gap-8">
        {COLOR_GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-3)">
              {group.title}
            </p>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {group.swatches.map((s) => (
                <div
                  key={s.token}
                  className="flex flex-col gap-2 rounded-lg border border-(--color-hairline) p-3"
                >
                  <div
                    className="aspect-[3/2] w-full rounded-md border border-(--color-hairline)"
                    style={{ backgroundColor: `var(${s.token})` }}
                  />
                  <div className="flex flex-col gap-0.5">
                    <p className="font-mono text-xs text-(--color-text-1)">{s.label}</p>
                    <p className="font-mono text-[10px] text-(--color-text-3)">{s.token}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Type scale */}
      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-3)">
          Type scale — ratio 1.333 fluid (clamp 320→1920px)
        </p>
        <div className="flex flex-col gap-1 divide-y divide-(--color-hairline)">
          {TYPE_SCALE.map((t) => (
            <div key={t.token} className="grid grid-cols-[7rem_1fr] items-baseline gap-6 py-4">
              <span className="font-mono text-[11px] text-(--color-text-3)">{t.label}</span>
              <span
                className="text-(--color-text-1) leading-tight tracking-tight"
                style={{ fontSize: `var(${t.token})` }}
              >
                {t.sample}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-3)">
          Spacing — 8pt base (Tailwind v4 default --spacing)
        </p>
        <div className="flex flex-col gap-2">
          {SPACING_STOPS.map((n) => (
            <div key={n} className="flex items-center gap-4">
              <span className="w-12 font-mono text-[11px] text-(--color-text-3)">{n}px</span>
              <div
                className="h-3 rounded-sm bg-(--color-accent-subtle) border border-(--color-accent)/30"
                style={{ width: `${n}px` }}
              />
              <span className="font-mono text-[10px] text-(--color-text-3)">
                {n === 128 ? 'section default' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Motion durations */}
      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-3)">
          Motion — durations
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {MOTION_TOKENS.map((m) => (
            <div
              key={m.token}
              className={cn(
                'group flex items-center justify-between gap-3 rounded-md border border-(--color-hairline) px-3 py-2',
                'hover:border-(--color-accent) hover:bg-(--color-accent-subtle)'
              )}
            >
              <span className="font-mono text-xs text-(--color-text-1)">{m.token}</span>
              <span className="font-mono text-[10px] text-(--color-text-3)">{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Easings */}
      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-3)">
          Motion — easings
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {EASING_TOKENS.map((e) => (
            <div
              key={e.token}
              className="flex flex-col gap-2 rounded-md border border-(--color-hairline) px-3 py-3"
            >
              <span className="font-mono text-xs text-(--color-text-1)">{e.token}</span>
              <span className="font-mono text-[10px] text-(--color-text-3) leading-relaxed">
                {e.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
