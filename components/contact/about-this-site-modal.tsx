'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// "Sobre este site" — modal honest credits.
// HANDOFF §38: Motion Narrative Map (1 linha por seção justificando motion).
//
// F5 (2026-09-02): conteúdo reescrito pra bater com o site que EXISTE. O texto
// anterior descrevia um hero r3f com placas de vidro, um sublinhado desenhado,
// um "code marquee", uma seção "What I Build", um scroll horizontal pinned no
// case do Content Engine, Shiki e postprocessing no stack — nada disso está
// mais no código (removidos entre 2026-05 e 2026-06). Num modal que se chama
// "créditos honestos", cada linha abaixo aponta pra algo que dá pra abrir o
// DevTools e conferir. Números vêm de medição (ROADMAP.md, Fase 3/4), não de
// meta.
//
// Trigger: hash #about-this-site no URL abre automaticamente.
// Fecha: ESC, X, clique fora, ou alterar hash.

const STACK_CREDITS = [
  { label: 'Framework', value: 'Next.js 16 (App Router, RSC) · React 19 · TypeScript strict' },
  {
    label: 'Styling',
    value:
      'Tailwind v4 com tokens OKLCH · Geist + Geist Mono · PP Editorial New italic (uma palavra)',
  },
  {
    label: 'Motion',
    value:
      'Motion 12 · GSAP 3.15 + ScrollTrigger · Lenis 1.3 (só desktop; desligado em touch e em prefers-reduced-motion)',
  },
  {
    label: '3D',
    value:
      'react-three-fiber 9 + drei · Three.js 0.184, só no /playground e no visualizador 3D do Other Work, carregados sob demanda',
  },
  { label: 'Forms', value: 'react-hook-form · Zod 4 · Server Actions' },
  { label: 'Email', value: 'Resend · React Email' },
  {
    label: 'Embed / anti-spam',
    value: '@calcom/embed-react (modal, nunca link externo) · honeypot · Vercel BotID',
  },
  {
    label: 'Qualidade',
    value: 'Biome · Vitest · Playwright · Lighthouse CI · sondas próprias de contraste e ritmo',
  },
  {
    label: 'Deploy / observabilidade',
    value: 'Vercel · Sentry · Vercel Analytics + Speed Insights',
  },
];

const MOTION_NARRATIVE = [
  {
    section: 'Hero · headline',
    why: 'Cada palavra é um <span> renderizado no servidor; a entrada é CSS puro (600ms, stagger 45ms) e roda do primeiro paint, antes de qualquer JS. Não existe estado "aparece, some e volta".',
  },
  {
    section: 'Hero · stats',
    why: 'Contagem 0→N com duração em escala log: 19 e 2.059 chegam com a mesma velocidade percebida. Tabular-nums pra nada pular.',
  },
  {
    section: 'Hero · marquee',
    why: 'Loop linear de 40s com os logos do stack; pausa no hover. Em reduced-motion fica parado.',
  },
  {
    section: 'Hero · CTA magnético',
    why: 'Só o botão primário atrai o cursor (±6px, raio de 80px). Um por página. Mais que isso vira truque.',
  },
  {
    section: 'Featured Work',
    why: 'O tile flagship entra 80ms antes dos dois half-tiles: o olho lê o Content Engine primeiro. Hover levanta 2px, a borda clareia um degrau, as marcas de corte da captura acendem em lime e a seta do "Ver case" avança. Sem scale, sem halo.',
  },
  {
    section: 'Other Work · FlipCard',
    why: 'Estética MD é o único bloco amber do site. Vira no hover (desktop) ou no toque (touch); em reduced-motion as faces trocam sem rotação.',
  },
  {
    section: 'Stack · perimeter trace',
    why: 'Uma linha lime desenha o contorno da célula no hover: circuito ligando, referência à eletrotécnica. CSS puro (stroke-dashoffset), zero JS.',
  },
  {
    section: 'Jornada · tracing beam',
    why: 'O gradiente lime segue o scroll e liga 2021 a 2026 numa linha só; cada marcador acende ao entrar na tela.',
  },
  {
    section: 'Manifesto',
    why: 'Sticky CSS no padrão do landonorris.com: o texto encolhe até virar um cartão e, quando o palco passa de 30%, a assinatura é escrita no tempo (2 s) na ordem real da caneta: S, "tefan", a barra do t, o ponto. A ponta da caneta corre na frente do traço. Reduced-motion: estado final, estático.',
  },
  {
    section: 'Contato · sucesso',
    why: 'Spring (stiffness 280) no "Recebido. Respondo em <12h.": a recompensa física de ter enviado.',
  },
  {
    section: 'Troca de rota',
    why: 'View Transitions: 180ms de saída + 280ms de entrada com 8px de subida. Nav e footer ficam parados.',
  },
  {
    section: 'Rodapé',
    why: 'Fica fixo atrás da página e é revelado quando o conteúdo termina de rolar (md+), o último beat. Padrão parallax footer do acervo; no mobile volta ao fluxo normal.',
  },
];

// Pares [label_bold, texto_continuação] — evita dangerouslySetInnerHTML.
const ATTRIBUTIONS: ReadonlyArray<readonly [string, string]> = [
  [
    'Padrões Aceternity UI',
    ' (TracingBeam, conceito de BentoGrid) reconstruídos sobre os tokens do site, nada instalado como dependência.',
  ],
  ['FlipCard', ' segue o padrão do Animate UI (Other Work, Estética MD).'],
  [
    'Reveal do manifesto',
    ' foi estudado no landonorris.com e replicado com CSS sticky + timeline GSAP scrubbed (não pin).',
  ],
  [
    'Fontes',
    ': Geist + Geist Mono (Vercel, open source) · PP Editorial New italic (Pangram Pangram, licença free for personal use).',
  ],
  [
    'Capturas',
    ' são todas do produto real, sem retoque, com a procedência na barra de cada moldura: Estética MD em produção; Content Engine Studio, Caluna e STARK rodando em ambiente local (runtime em modo scripted e o seed de cada projeto: o fluxo é o de produção, o conteúdo é de fixture). Nenhuma capa é diagrama ou mockup.',
  ],
  [
    'Trechos de código',
    ' (regex do anti-slop, papéis dos agentes, comandos do bot, o agregador de OEE do STARK, o repositório do Caronas, o Fibonacci em C) são cópias literais dos arquivos citados na barra de cada bloco.',
  ],
  ['Anti-slop validator regex pt-BR', ' é código real do Content Engine, não placeholder.'],
  [
    'Vídeo de fundo do hero',
    ' é um loop gerado (Google Veo) e tratado em ffmpeg. É atmosfera, não evidência de produto.',
  ],
];

const MEASURED = [
  'Lighthouse CI em build de produção (5 rotas): performance 0.98–0.99 · acessibilidade 1.00 · SEO 1.00 · CLS 0',
  'LCP da home é o próprio título (texto), não uma imagem: ~0,35s em build local; em campo depende da rede',
  'Three.js (~245 KB) só é baixado em /playground e quando o visualizador 3D do Other Work entra na tela',
  'Toda animação tem paridade em prefers-reduced-motion: headline e manifesto no estado final, marquee parado, contagens instantâneas',
];

export function AboutThisSiteModal() {
  const [open, setOpen] = useState(false);

  // Abre automaticamente quando hash #about-this-site presente.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => {
      if (window.location.hash === '#about-this-site') {
        setOpen(true);
      }
    };
    handler(); // verifica hash inicial
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next && typeof window !== 'undefined' && window.location.hash === '#about-this-site') {
      // Limpa hash sem recarregar.
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn('sm:max-w-3xl', 'h-[min(90vh,800px)] max-h-[90vh] overflow-hidden p-0')}
      >
        <div className="flex flex-col gap-2 border-b border-(--color-hairline) px-6 pt-6 pb-4">
          <DialogTitle>Sobre este site</DialogTitle>
          <DialogDescription>
            Créditos honestos · o porquê de cada animação · stack confirmado · o que foi medido.
          </DialogDescription>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-8">
            <CreditSection title="STACK">
              <ul className="flex flex-col gap-2">
                {STACK_CREDITS.map((item) => (
                  <li key={item.label} className="flex flex-col gap-0.5">
                    <span className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
                      {item.label}
                    </span>
                    <span className="text-sm text-(--color-text-2)">{item.value}</span>
                  </li>
                ))}
              </ul>
            </CreditSection>

            <CreditSection title="POR QUE CADA ANIMAÇÃO EXISTE">
              <p className="mb-3 text-xs leading-relaxed text-(--color-text-3)">
                Cada animação tem razão física ou emocional. Não é decorativa.
              </p>
              <ul className="flex flex-col gap-3">
                {MOTION_NARRATIVE.map((item) => (
                  <li key={item.section} className="flex flex-col gap-1">
                    <span className="font-mono text-2xs uppercase tracking-widest text-(--color-accent)">
                      {item.section}
                    </span>
                    <span className="text-sm leading-relaxed text-(--color-text-2)">
                      {item.why}
                    </span>
                  </li>
                ))}
              </ul>
            </CreditSection>

            <CreditSection title="ATRIBUIÇÕES HONESTAS">
              <ul className="flex flex-col gap-2">
                {ATTRIBUTIONS.map(([bold, rest]) => (
                  <li key={bold} className="text-sm leading-relaxed text-(--color-text-2)">
                    <strong className="font-semibold text-(--color-text-1)">{bold}</strong>
                    {rest}
                  </li>
                ))}
              </ul>
            </CreditSection>

            <CreditSection title="MEDIDO, NÃO PROMETIDO">
              <ul className="flex flex-col gap-1.5 font-mono text-xs leading-relaxed text-(--color-text-2)">
                {MEASURED.map((row) => (
                  <li key={row}>· {row}</li>
                ))}
              </ul>
            </CreditSection>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CreditSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="font-mono text-xs uppercase tracking-widest text-(--color-accent)">{title}</h3>
      {children}
    </section>
  );
}
