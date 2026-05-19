'use server';

import { Resend } from 'resend';
import { ContactConfirmation } from '@/emails/contact-confirmation';
import {
  type ContactInput,
  ContactSchema,
  type PrefereCanal,
} from '@/lib/validation/contact-schema';

// Server Action de contato: honeypot → Zod parse → Resend dual envio
// (interno pro Stefan + auto-reply pro user).
//
// Anti-spam baseline:
//   - Honeypot field `website` (invisível pro usuário, preenchido por bots)
//   - Zod schema strict (min/max + email format)
//   - Resend rate limiting platform-level
//
// Vercel BotID está configurado a nível de plataforma (vercel.json) na Fase 7
// — não precisa de SDK npm. Spam que passar do honeypot é capturado lá.
//
// Gotcha #10 (HANDOFF §148): Resend DIRECT no action (sem waitUntil)
// porque Vercel Fluid Compute precisa aguardar a Promise antes do shutdown
// gracioso. waitUntil mata o request handler antes do send finalizar.

export type ContactState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string }
  | { status: 'validation'; fieldErrors: Record<string, string[]> };

const PREFERE_LABEL: Record<PrefereCanal, string> = {
  whatsapp: 'WhatsApp',
  email: 'Email',
  calcom: 'Cal.com',
};

const INTERNAL_TO = process.env.CONTACT_TO_EMAIL ?? 'stefanheinz2006@gmail.com';
const FROM = process.env.CONTACT_FROM_EMAIL ?? 'Stefan <hello@stefanscrepka.dev>';

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // 1) Honeypot: campo `website` invisível pra usuário. Bot preenche.
  //    Retorna success silencioso pra não revelar a heurística.
  const honeypot = formData.get('website');
  if (typeof honeypot === 'string' && honeypot.length > 0) {
    return { status: 'success' };
  }

  // 2) Zod parse
  const raw = {
    nome: formData.get('nome'),
    email: formData.get('email'),
    prefere: formData.get('prefere'),
    mensagem: formData.get('mensagem'),
    website: formData.get('website') ?? undefined,
  };
  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.') || '_root';
      const existing = fieldErrors[key] ?? [];
      existing.push(issue.message);
      fieldErrors[key] = existing;
    }
    return { status: 'validation', fieldErrors };
  }

  const input: ContactInput = parsed.data;

  // 3) Resend send
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Em dev sem API key, simular sucesso mas logar.
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[contact] RESEND_API_KEY ausente — simulando envio em dev.', input);
      return { status: 'success' };
    }
    return {
      status: 'error',
      message: 'Não foi. Tenta WhatsApp direto: (42) 99859-2522.',
    };
  }

  const resend = new Resend(apiKey);

  try {
    // 3a) Email interno pro Stefan — texto plain pra parsing rápido no inbox
    await resend.emails.send({
      from: FROM,
      to: INTERNAL_TO,
      replyTo: input.email,
      subject: `[stefanscrepka.dev] ${input.nome} · canal preferido: ${PREFERE_LABEL[input.prefere]}`,
      text: [
        `De: ${input.nome} <${input.email}>`,
        `Canal preferido: ${PREFERE_LABEL[input.prefere]}`,
        '',
        'Mensagem:',
        input.mensagem,
      ].join('\n'),
    });

    // 3b) Auto-reply pro user (React Email template)
    await resend.emails.send({
      from: FROM,
      to: input.email,
      replyTo: INTERNAL_TO,
      subject: 'Recebido — respondo em <12h.',
      react: ContactConfirmation({
        nome: input.nome,
        prefere: input.prefere,
        mensagem: input.mensagem,
      }),
    });

    return { status: 'success' };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[contact] Resend error:', error);
    }
    return {
      status: 'error',
      message: 'Não foi. Tenta WhatsApp direto: (42) 99859-2522.',
    };
  }
}
