import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og/template';
import { CASE_STUDIES } from '@/lib/work/data';

const cs = CASE_STUDIES['estetica-md'];

export const alt = `${cs.title} — case study`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: 'CASE STUDY · ESTÉTICA MD',
    title: cs.title,
    tagline: cs.tagline,
    tone: cs.accent,
  });
}
