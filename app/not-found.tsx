import Link from 'next/link';

// W-a11y crítico #1: era <main> aninhado dentro de <main id="main"> do root
// layout — viola WCAG 1.3.1 + ARIA landmarks unique. Usar <section> aqui.
// W-copy: "pipeline quebrado" → "rota não encontrada" (universal vs jargão).
export default function NotFound() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-4xl font-semibold !tracking-[-0.025em] !leading-[1.05] md:text-5xl lg:text-6xl">
        404 — rota não encontrada
      </h1>
      <p className="max-w-md font-mono text-sm text-(--color-text-2)">
        Essa rota não existe (ou existiu e foi refatorada). O resto do site continua rodando.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-pill bg-(--color-accent) px-5 py-2.5 text-sm font-semibold text-(--color-text-on-accent) shadow-(--shadow-md) outline-none transition-[transform,box-shadow] duration-(--motion-fast) hover:-translate-y-[2px] hover:shadow-(--shadow-glow-lime-sm) focus-visible:-translate-y-[2px] focus-visible:shadow-(--shadow-glow-lime-sm)"
      >
        Voltar pra home →
      </Link>
    </section>
  );
}
