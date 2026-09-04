import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og/template';

export const alt = 'Process · método multi-agente | Stefan Heinz Screpka';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function ProcessOgImage() {
  return renderOgImage({
    eyebrow: 'PROCESS',
    title: 'Disciplina, não milagre.',
    tagline:
      'Anti-slop em cascata · prompt cache · aprovação no Telegram · cron das 03h às 07h30 · inference local. Como construo IA multi-agente em produção.',
  });
}
