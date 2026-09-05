import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og/template';

export const alt = 'Process · método multi-agente | Stefan Heinz Screpka';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function ProcessOgImage() {
  return renderOgImage({
    eyebrow: 'PROCESS',
    title: 'Disciplina, não milagre.',
    tagline:
      'Anti-slop em cascata · prompt cache · três botões no Telegram · cron · inference local · OEE somado · tenantId. Oito decisões, três produtos.',
  });
}
