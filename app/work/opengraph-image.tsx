import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og/template';

export const alt = 'Work — três produtos em produção | Stefan Heinz Screpka';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function WorkOgImage() {
  return renderOgImage({
    eyebrow: 'WORK',
    title: 'Três produtos. Três problemas resolvidos.',
    tagline:
      'Content Engine · NexaCore · STJ App. Multi-agente Claude SDK, B2B multi-tenant, PWA cockpit. Cada um com escopo real e detalhes técnicos abertos.',
  });
}
