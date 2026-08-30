import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og/template';

export const alt = 'Process — método multi-agente | Stefan Heinz Screpka';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function ProcessOgImage() {
  return renderOgImage({
    eyebrow: 'PROCESS',
    title: 'Disciplina, não milagre.',
    tagline:
      'Anti-slop validator · prompt cache 2 camadas · HITL Telegram · cron 03h–07h30 · stack local GPU. Como construo IA multi-agente em produção.',
  });
}
