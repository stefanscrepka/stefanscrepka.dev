'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

// Global error boundary — captura erros no PRÓPRIO root layout (quando
// app/error.tsx não pode renderizar porque o layout falhou). Precisa de
// <html> + <body> completos porque substitui o root layout inteiro.
//
// W-deploy (2026-05-25): sem este boundary, erro no root layout = tela em
// branco Next default. Catastrófico pra portfolio premium.
//
// Mantém styling mínimo inline (sem importar componentes do site, que podem
// ser a causa do crash). Sentry capture imediato.

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body
        style={{
          backgroundColor: '#080A07',
          color: '#fafafa',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          padding: '2rem 1rem',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#D2FF00',
            margin: 0,
          }}
        >
          Falha crítica
        </p>
        <h1
          style={{
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          Algo quebrou no carregamento da página.
        </h1>
        <p
          style={{
            maxWidth: '32rem',
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: '0.875rem',
            color: '#a3a3a3',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          O stack trace foi enviado ao Sentry. Recarregue a página ou volte mais tarde.
        </p>
        {error.digest ? (
          <p
            style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: '0.6875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#737373',
              margin: 0,
            }}
          >
            ref: {error.digest}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => reset()}
          style={{
            backgroundColor: '#D2FF00',
            color: '#080A07',
            border: 'none',
            borderRadius: '9999px',
            padding: '0.625rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Tentar de novo
        </button>
      </body>
    </html>
  );
}
