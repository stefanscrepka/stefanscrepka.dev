import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og/template';

export const alt = 'Stefan Heinz Screpka · AI Product Engineer';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: 'PORTFOLIO',
    title: 'Construo IA multi-agente em produção.',
    tagline:
      'E o produto inteiro ao redor dela. Content Engine, Caluna, STARK, Estética MD e SK3D, com capturas reais.',
  });
}
