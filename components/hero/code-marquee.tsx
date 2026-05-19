import { codeToHtml } from 'shiki';
import { CodeMarqueeTrack } from './code-marquee-track';

// Layer 6 do 8-layer choreography: code marquee Shiki SSR + GSAP infinite linear.
// Snippet real do R-15 anti-slop validator do Content Engine (14 regex pt-BR).
// Highlight em build-time (zero JS client pra syntax). GSAP track infinito 40s.

const SNIPPET = `// R-15 anti-slop validator — 14 regex banlist pt-BR
export const PT_BR_AI_TELLS = [
  /no mundo atual/gi,
  /além disso/gi,
  /vamos explorar/gi,
  /é importante ressaltar/gi,
  /vale ressaltar/gi,
  /cabe destacar/gi,
  /em primeiro lugar/gi,
  /por outro lado/gi,
  /em suma/gi,
  /de modo geral/gi,
  /é fundamental/gi,
  /em conclusão/gi,
  /em síntese/gi,
  /portanto, é essencial/gi,
] as const;`;

const MARQUEE_THEME = 'vesper';

export async function CodeMarquee() {
  const html = await codeToHtml(SNIPPET, {
    lang: 'typescript',
    theme: MARQUEE_THEME,
    transformers: [
      {
        name: 'strip-pre-bg',
        pre(node) {
          // Remove o bg do <pre> pra herdar do container Hero.
          if (node.properties.style && typeof node.properties.style === 'string') {
            node.properties.style = node.properties.style.replace(/background[^;]*;?/gi, '');
          }
        },
      },
    ],
  });

  return <CodeMarqueeTrack html={html} />;
}
