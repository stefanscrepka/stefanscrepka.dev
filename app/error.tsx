'use client';

import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';

// Per-route error boundary — captura erros em qualquer rota DEPOIS do root
// layout. Usa estilo do site (não default Next branding). global-error.tsx
// captura erro no próprio root layout.
//
// W-deploy (2026-05-25): sem este boundary, exceptions em RSC caíam no
// fallback genérico Next sem captura Sentry.

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <section className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="font-mono text-2xs uppercase tracking-widest text-(--color-accent)">
        Algo quebrou
      </p>
      <h1 className="text-4xl font-semibold !tracking-[-0.025em] !leading-[1.05] md:text-5xl lg:text-6xl">
        Erro inesperado.
      </h1>
      <p className="max-w-md font-mono text-sm text-(--color-text-2)">
        Já registrei o stack trace no Sentry. Você pode tentar de novo ou voltar pra home. O resto
        do site continua rodando.
      </p>
      {error.digest ? (
        <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
          ref: {error.digest}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-pill bg-(--color-accent) px-5 py-2.5 text-sm font-semibold text-(--color-text-on-accent) shadow-(--shadow-md) outline-none transition-[transform,box-shadow] duration-(--motion-fast) hover:-translate-y-[2px] hover:shadow-(--shadow-glow-lime-sm) focus-visible:-translate-y-[2px] focus-visible:shadow-(--shadow-glow-lime-sm)"
        >
          Tentar de novo
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-pill border border-(--color-hairline-strong) px-5 py-2.5 text-sm font-medium text-(--color-text-1) outline-none transition-colors duration-(--motion-fast) hover:border-(--color-accent) hover:text-(--color-accent) focus-visible:border-(--color-accent) focus-visible:text-(--color-accent)"
        >
          Voltar pra home →
        </Link>
      </div>
    </section>
  );
}
