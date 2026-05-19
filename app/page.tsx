export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <p
        className="font-mono text-xs uppercase tracking-[0.16em]"
        style={{ color: 'var(--color-text-3)' }}
      >
        FASE 1 — bootstrap
      </p>
      <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">stefanscrepka.dev</h1>
      <p className="max-w-prose font-mono text-sm" style={{ color: 'var(--color-text-2)' }}>
        Construo IA{' '}
        <em className="not-italic" style={{ color: 'var(--color-accent)' }}>
          multi-agente
        </em>{' '}
        em produção — e o produto inteiro ao redor dela.
      </p>
      <p className="font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>
        Next 16 · React 19 · Tailwind v4 · Geist · Lenis · GSAP · Motion · r3f
      </p>
    </main>
  );
}
