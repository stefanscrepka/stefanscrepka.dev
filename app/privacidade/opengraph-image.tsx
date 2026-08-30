import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og/template';

export const alt = 'Privacidade — política de dados | Stefan Heinz Screpka';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function PrivacidadeOgImage() {
  return renderOgImage({
    eyebrow: 'PRIVACIDADE',
    title: 'O que coleto, por quê, e como você apaga.',
    tagline:
      'LGPD-compliant. Quais dados via form de contato, retenção real, processadores nomeados e como você exerce direitos do Art. 18.',
  });
}
