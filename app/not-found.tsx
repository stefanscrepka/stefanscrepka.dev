import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">404 — pipeline quebrado</h1>
      <p className="max-w-md font-mono text-sm" style={{ color: 'var(--color-text-2)' }}>
        Essa rota não existe (ou existiu e foi refatorada). O resto do site continua rodando.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors"
        style={{
          backgroundColor: 'var(--color-accent)',
          color: 'var(--color-text-on-accent)',
        }}
      >
        Voltar pra home →
      </Link>
    </main>
  );
}
