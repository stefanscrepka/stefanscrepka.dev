import { z } from 'zod';

// Schema compartilhado client/server — RHF parseia via @hookform/resolvers/zod
// no client, Server Action re-parseia no server (defesa em profundidade).
// PT-BR error messages (zod 4 `error()` callback dentro de cada field).

export const PREFERE_OPTIONS = ['whatsapp', 'email', 'calcom'] as const;
export type PrefereCanal = (typeof PREFERE_OPTIONS)[number];

export const ContactSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, { message: 'Pelo menos 2 caracteres.' })
    .max(80, { message: 'Máx. 80 caracteres.' }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Email inválido.' })
    .max(120, { message: 'Email longo demais.' }),
  prefere: z.enum(PREFERE_OPTIONS, { message: 'Escolha um canal.' }),
  mensagem: z
    .string()
    .trim()
    .min(10, { message: 'Conta um pouco mais: pelo menos 10 caracteres.' })
    .max(2000, { message: 'Mensagem grande demais (>2000 caracteres).' }),
  // Honeypot: campo invisível pra bot. Server descarta se preenchido.
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof ContactSchema>;
