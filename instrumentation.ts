import * as Sentry from '@sentry/nextjs';

export async function register() {
  // W-deploy (2026-05-25): valida env vars no boot via Zod schema. Em prod,
  // env malformado (RESEND_API_KEY sem prefix re_, BASE_URL não-URL, etc)
  // joga error em vez de runtime silencioso ao usuário submeter contact form.
  await import('./lib/env');

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
