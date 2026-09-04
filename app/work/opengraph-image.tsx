import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og/template';

export const alt = 'Work · três produtos | Stefan Heinz Screpka';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function WorkOgImage() {
  return renderOgImage({
    eyebrow: 'WORK',
    title: 'Três produtos. Três problemas resolvidos.',
    tagline:
      'Content Engine · Caluna · STARK. Multi-agente Claude, secretária de clínica no WhatsApp, passagem de turno industrial. Cada um com capturas reais e detalhes técnicos abertos.',
  });
}
