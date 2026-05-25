import { z } from 'zod';

// Validação runtime de env vars (server-side). Importado em instrumentation.ts
// pra falhar build/boot se vars críticas estiverem malformadas, evitando
// descobrir só quando user manda contact form (RESEND_API_KEY) ou Sentry deveria
// receber error (SENTRY_DSN).
//
// IMPORTANTE: este módulo é SERVER-ONLY. Vars NEXT_PUBLIC_* são inlined no
// bundle client em build — não precisam validar aqui (acesso direto a
// process.env.NEXT_PUBLIC_* funciona client).
//
// W-deploy (2026-05-25): substitui process.env.XYZ ?? 'fallback' espalhado
// que mascarava misconfiguração em prod.

const EnvSchema = z.object({
  // === Sentry ===
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional().or(z.literal('')),
  SENTRY_DSN: z.string().url().optional().or(z.literal('')),
  SENTRY_AUTH_TOKEN: z.string().min(1).optional(),
  SENTRY_ORG: z.string().min(1).optional(),
  SENTRY_PROJECT: z.string().min(1).optional(),

  // === Resend ===
  RESEND_API_KEY: z
    .string()
    .startsWith('re_', { message: 'RESEND_API_KEY deve começar com "re_"' })
    .optional()
    .or(z.literal('')),
  CONTACT_TO_EMAIL: z.string().email().default('stefanheinz2006@gmail.com'),
  CONTACT_FROM_EMAIL: z.string().default('Stefan <hello@stefanscrepka.dev>'),

  // === Cal.com ===
  NEXT_PUBLIC_CAL_USERNAME: z.string().default('stefanscrepka'),
  NEXT_PUBLIC_CAL_EVENT_TYPE: z.string().default('15min'),

  // === Public ===
  NEXT_PUBLIC_BASE_URL: z.string().url().default('https://stefanscrepka.dev'),

  // === Node ===
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

function parseEnv() {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    // Em prod, falhar boot é melhor que runtime silencioso (Server Action no-op).
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    const msg = `[env] Validação falhou:\n${issues}`;
    if (process.env.NODE_ENV === 'production') {
      throw new Error(msg);
    }
    // Em dev, avisar mas seguir com defaults pra não bloquear local dev.
    console.warn(msg);
    return EnvSchema.parse({ ...process.env, NODE_ENV: process.env.NODE_ENV ?? 'development' });
  }
  return result.data;
}

export const env = parseEnv();
