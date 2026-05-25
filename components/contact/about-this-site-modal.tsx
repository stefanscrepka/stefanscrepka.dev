'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// "Sobre este site" — modal honest credits.
// HANDOFF §38: Motion Narrative Map (1 linha por seção justificando motion).
// HANDOFF §59-61: Reeded Glass attribution (template Spline community → r3f custom).
//
// Trigger: hash #about-this-site no URL abre automaticamente.
// Fecha: ESC, X, clique fora, ou alterar hash.

const STACK_CREDITS = [
  { label: 'Framework', value: 'Next.js 16 · React 19 · TypeScript strict' },
  {
    label: 'Styling',
    value: 'Tailwind v4 (OKLCH tokens) · Geist + Geist Mono · PP Editorial New italic',
  },
  { label: 'Motion', value: 'Motion 12 · GSAP 3.15 · Lenis smooth scroll' },
  { label: '3D', value: 'react-three-fiber + drei + postprocessing · Three.js 184' },
  { label: 'Code highlight', value: 'Shiki SSR (zero runtime)' },
  { label: 'Forms', value: 'react-hook-form · Zod · Server Actions' },
  { label: 'Email', value: 'Resend · React Email' },
  {
    label: 'Embed',
    value: '@calcom/embed-react · honeypot anti-spam + Vercel platform protection',
  },
  {
    label: 'A11y / perf',
    value: 'Lighthouse CI · Playwright · prefers-reduced-motion fallback em todas as 12 seções',
  },
  {
    label: 'Deploy',
    value: 'Vercel gru1 + Coolify VPS (Content Engine 24/7) · Sentry · Vercel Analytics',
  },
];

const MOTION_NARRATIVE = [
  {
    section: 'Hero r3f',
    why: 'Três placas glass = três produtos em produção. Idle drift sutil mantém vida sem competir com texto.',
  },
  {
    section: 'Italic underline',
    why: 'PP Editorial italic existe pra UMA palavra: "multi-agente". Sublinhado lime desenhado anuncia que esse é o nó central.',
  },
  {
    section: 'Code marquee',
    why: 'Loop infinito imita CI/CD passing — sensação de produto vivo, não slide deck.',
  },
  {
    section: 'Stats count-up',
    why: 'Tabular-nums + count-up dá peso. 22 agentes, 27 tabelas, 100+ testes — números reais.',
  },
  {
    section: 'Featured Work reveal',
    why: 'Stagger 120ms convida o olho a ler cada card antes de pular pro próximo.',
  },
  {
    section: 'What I Build hover',
    why: 'Direction-aware lime overlay vem do quadrante onde o cursor entrou — micro-interação que recompensa exploração.',
  },
  {
    section: 'Other Work FlipCard',
    why: 'Estética MD é único bloco amber do site. Flip card cria diferenciação física, não só cromática.',
  },
  {
    section: 'Bento Skills perimeter trace',
    why: 'Linha lime desenhando o contorno on hover sugere circuito ligando — referência à eletrotécnica.',
  },
  {
    section: 'Timeline tracing beam',
    why: 'Beam scroll-driven liga 2021 a 2026 em uma única linha. Reforça narrativa contínua.',
  },
  {
    section: 'Manifesto word-by-word',
    why: 'Stagger 40ms force a leitura. Não é decorativo — é ritmo.',
  },
  {
    section: 'Contact success spring',
    why: 'Overshoot tight stiffness 300 dá satisfação física no "Enviado". Recompensa a ação.',
  },
  {
    section: 'Case studies (Content Engine)',
    why: 'Scroll horizontal pinned = 7 squads atravessam a tela como pipeline real, não galeria.',
  },
];

// Pares [label_bold, texto_continuação] — evita dangerouslySetInnerHTML.
const ATTRIBUTIONS: ReadonlyArray<readonly [string, string]> = [
  [
    'Hero r3f scene',
    ' inspirada no template "Reeded Liquid Glass Prism" (Spline community), reconstruída do zero em react-three-fiber sem usar o editor Spline.',
  ],
  [
    'Aceternity UI primitives',
    ' (FloatingDock, MacBookScroll, CompareSlider, TracingBeam, BentoGrid concept) — copy-paste shadcn-style, custom em lime.',
  ],
  ['Animate UI FlipCard', ' (Other Work — Estética MD card).'],
  [
    'Fontes',
    ': Geist + Geist Mono (Vercel, open source) · PP Editorial New italic (Pangram Pangram, licença comercial).',
  ],
  ['Anti-slop validator regex pt-BR', ' é código real do Content Engine — não placeholder.'],
  [
    'Screenshots',
    ' dos produtos são raw PNG (sem retoque de modelo gen-image). Chrome de mockup via CSS perspective.',
  ],
];

const PERF_BUDGET = [
  'LCP < 2.2s mobile · INP < 180ms · CLS < 0.08',
  'Bundle JS initial < 165KB gzipped',
  'r3f stack (~245KB) carregado lazy via dynamic({ ssr:false }) — só bate em /playground ou hero com motion ativo',
  'Reduced-motion: r3f vira poster SVG, marquees pausam, scroll-pinned vira vertical',
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
            Créditos honestos · Motion Narrative Map · stack confirmado · performance budget.
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

            <CreditSection title="MOTION NARRATIVE MAP">
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

            <CreditSection title="PERFORMANCE BUDGET">
              <ul className="flex flex-col gap-1.5 font-mono text-xs leading-relaxed text-(--color-text-2)">
                {PERF_BUDGET.map((row) => (
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
