import * as Sentry from '@sentry/nextjs';
import { initBotId } from 'botid/client/core';

// Vercel BotID — anti-spam pro contact Server Action.
// W-deploy (2026-05-25): substitui o comentário falso "BotID em vercel.json"
// que nunca foi implementado. Resolve risk de email amplification (form era
// usável como amplifier: atacante submete email=vitima@x.com, server envia
// SMTP pra vítima da nossa reputação Resend).
//
// O contact form é submitted via Server Action da home (`/`). BotID protege
// POSTs nessa rota — o checkBotId() na action lê os headers anexados pelo
// client SDK e valida verdict.
//
// Dev local: checkBotId() sempre retorna { isBot: false } — sem necessidade
// de mock manual. Production: protection ativa via plataforma Vercel.
//
// Deep Analysis ($1/1000 calls) precisa ser ativado manualmente no painel
// Vercel: Project → Firewall → Rules → Enable "Vercel BotID Deep Analysis".

initBotId({
  protect: [
    {
      path: '/',
      method: 'POST',
    },
  ],
});

// W-deploy (2026-05-25): Sentry router transition tracking. Sem isto, o SDK
// não instrumenta navegações client-side App Router (perde traces de slow
// navigation + INP entre rotas).
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
