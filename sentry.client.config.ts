import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

// W-deploy/LGPD (2026-05-25):
//   - sendDefaultPii: false explícito (default v10 já é false; declarar evita
//     regressão em update futuro do SDK).
//   - beforeSend scrub cookies/data/user.email/user.ip_address pra evitar
//     vazamento de PII em stack traces.
//   - replayIntegration maskAllText:true + blockAllMedia:true: textos digitados
//     no contact form (nome, email, mensagem) NÃO vão pro Sentry. Imagens
//     bloqueadas pra evitar capturar avatars ou cookies bake. Resolve LGPD
//     risk grave (form era um data vazamento desnão-declarado).
//   - replaysSessionSampleRate: 0.01 (era 0.1 → reduziu 10x). 1% de sessões
//     gravadas é suficiente pra detectar regressões UX sem coletar volume
//     desnecessário.

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 0,
    replaysOnErrorSampleRate: 0.5,
    sendDefaultPii: false,
    debug: false,
    beforeSend(event) {
      if (event.request) {
        delete event.request.cookies;
        delete event.request.data;
      }
      if (event.user) {
        delete event.user.email;
        delete event.user.ip_address;
      }
      return event;
    },
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  });
}
