import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArtifactFrame } from '@/components/work/artifact-frame';
import { ArtifactVideo } from '@/components/work/artifact-video.client';
import { CodeArtifact } from '@/components/work/code-artifact';
import { ModelViewer, type ViewerModel } from '@/components/work/model-viewer';
import { cn } from '@/lib/utils';
import { EsteticaFlipCardClient, OtherWorkReveal } from './other-work.client';

// Section 7 — Other Work.
//
// F7 (2026-09-04):
//   • Os dois blocos de código (Caronas, Estrutura de Dados) tinham 18 linhas
//     cada e esticavam a coluna. Agora são os 6 a 7 linhas que importam
//     (o miolo do salvar(), o miolo do fibonacci memoizado), e os cards
//     têm a mesma altura da captura ao lado.
//   • F8 (2026-09-05): o card 3D foi refeito com o que o Stefan considera
//     bom (curadoria nas memórias do projeto logos-futebol): o quadro LEVITA
//     (v4, final), a cena animada do hub da STARK e a peça de CAD. Saíram o
//     patch do Bahia, a bola de terceiros, a foto do patch ruim e o render
//     Correnteza (safra reprovada).
//   • As capturas de SITE (Abalo, STARK Automação) usam a moldura de
//     navegador; as duas foram refeitas no pixel 0 com a intro assentada
//     (a do site da STARK era do meio da transição).
//   • Travessões fora do texto.

const WHATSAPP_DEEPLINK_ESTETICA =
  'https://wa.me/5542998592522?text=Ol%C3%A1%20Stefan%2C%20vi%20o%20site%20da%20Cl%C3%ADnica%20MD%20e%20quero%20algo%20assim%20pra%20minha%20cl%C3%ADnica.';

// sistema-caronas (público) · src/br/edu/caronas/repository/InMemoryRepository.java — verbatim.
const CARONAS_SOURCE = {
  source: 'repository/InMemoryRepository.java',
  startLine: 22,
  lines: [
    '    public T salvar(T entidade) {',
    '        Objects.requireNonNull(entidade, "Entidade nao pode ser nula.");',
    '        if (entidade.getId() != 0) {',
    '            throw new IllegalStateException(',
    '                    "Entidade ja possui ID; use atualizar() para alteracoes.");',
    '        }',
    '        int novoId = sequencia.getAndIncrement();',
    '        entidade.setId(novoId);',
    '        banco.put(novoId, entidade);',
  ],
} as const;

// estrutura-de-dados (público) · 2bim/exercicios/02_fibonacci_memoizado.c — verbatim.
const FIB_SOURCE = {
  source: '2bim/exercicios/02_fibonacci_memoizado.c',
  startLine: 34,
  lines: [
    '    if (cache[n] != -1)',
    '    {',
    '        return cache[n];',
    '    }',
    '',
    '    cache[n] = fibonacci_memo(n - 1, cache, chamadas) +',
    '               fibonacci_memo(n - 2, cache, chamadas);',
    '    return cache[n];',
  ],
} as const;

// Meshes reais, exportados dos arquivos que vão pro fatiador (Blender 4.4,
// decimados, sem Draco). Ver public/models e _audit/f8/3d/levita_glb.py.
const SK3D_MODELS: readonly ViewerModel[] = [
  {
    id: 'levita',
    label: 'quadro levita',
    src: '/models/sk3d-levita-gremio.glb',
    note: 'LEVITA Grêmio, 200 × 200 × 23 mm: o escudo em três cores flutua a 14 mm do fundo. As cores são as dos filamentos do 3MF.',
    description:
      'Modelo 3D interativo do quadro LEVITA do Grêmio: moldura preta quadrada com o escudo em relevo azul, branco e preto flutuando sobre o fundo',
  },
  {
    id: 'cad',
    label: 'peça sob medida',
    src: '/models/sk3d-peca-industrial.glb',
    note: 'Peça de CAD sob encomenda pra um cliente industrial: 66,6 × 27,9 × 33,7 mm, com a marca em relevo, modelada e impressa.',
    description:
      'Modelo 3D interativo de uma peça mecânica sob medida, com um cilindro e um suporte',
  },
];

// Os seis artefatos do card 3D, todos 4:3 (masters em _audit/f8/masters).
const HUB_VIDEO = {
  webm: '/work-video/stark-hub.webm',
  mp4: '/work-video/stark-hub.mp4',
  // F9 (R4 F17): poster de 960×720 (25 KB) no lugar do master de 2133×1600 (61 KB),
  // que o mobile baixava pra mostrar em 320×240.
  poster: '/work-screenshots/stark-hub-f130-poster.avif',
};

export function OtherWorkSection() {
  return (
    <section
      id="other-work"
      className="container-max section-pad-y-lg border-t border-(--color-hairline)"
    >
      <header className="mb-14 flex flex-col gap-4 sm:mb-16 lg:mb-20">
        <p className="eyebrow">OUTROS TRABALHOS</p>
        <h2
          className={[
            'text-3xl font-semibold text-(--color-text-1)',
            'sm:text-4xl',
            '!tracking-tight !leading-[1.05] text-balance',
          ].join(' ')}
        >
          Além dos três produtos.
        </h2>
        <p className="max-w-prose text-reading text-(--color-text-2)">
          O primeiro site em produção, quadros e peças que saem do Blender pra impressora, um
          monitor sísmico com brand book próprio, o site de uma automação industrial. E o fundamento
          em Java e C.
        </p>
      </header>

      <OtherWorkReveal>
        <div className="flex flex-col gap-8 sm:gap-10 lg:gap-12">
          {/* Linha 1 — Estética MD (2/3) + código real (1/3, empilhado) */}
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] lg:gap-12">
            <div data-other-card="estetica-md">
              <EsteticaFlipCardClient deeplink={WHATSAPP_DEEPLINK_ESTETICA} />
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-8 sm:gap-10">
              <MiniCard
                label="Caronas Java CLI"
                tech="Java 21 · Records · java.time"
                line="Repository Pattern do zero: um repositório em memória sincronizado, com IDs sequenciais. CLI da faculdade, mas de verdade."
                href="https://github.com/stefanscrepka/sistema-caronas"
                media={
                  <CodeArtifact
                    source={CARONAS_SOURCE.source}
                    lines={CARONAS_SOURCE.lines}
                    startLine={CARONAS_SOURCE.startLine}
                    highlight={[28, 29, 30]}
                    meta="java 21"
                  />
                }
              />

              <MiniCard
                label="Estrutura de Dados (C)"
                tech="C · 19 arquivos .c · recursão"
                line="Fibonacci ingênuo contra memoizado, com contagem de chamadas. Torres de Hanoi, listas encadeadas, tabela hash."
                href="https://github.com/stefanscrepka/estrutura-de-dados"
                secondaryHref="/playground"
                secondaryLabel="Ver Hanoi rodando"
                media={
                  <CodeArtifact
                    source={FIB_SOURCE.source}
                    lines={FIB_SOURCE.lines}
                    startLine={FIB_SOURCE.startLine}
                    highlight={[39, 40]}
                    meta="C"
                  />
                }
              />
            </div>
          </div>

          {/* Linha 2 — 3D, largura inteira. Seis artefatos em 4:3: o viewer
              (LEVITA e a peça de CAD), a animação do hub da STARK, a cena no
              Blender, e três imagens do LEVITA (macro, frente, prancha). O
              que saiu, por decisão do Stefan: o patch do Bahia (a escala em
              que 8 de 10 escudos reprovam), a bola (modelo de terceiros), a
              foto do patch do Vasco (impressa pra mostrar como ficou ruim) e o
              render Correnteza (safra reprovada). */}
          <MiniCard
            label="Do Blender à impressora"
            tech="Blender 4.4 · Cycles · Python · CAD · Bambu A1"
            line="O quadro LEVITA: escudo em terraços de cor sobre um pedestal escondido, gerado em Python, renderizado no Cycles sobre a malha que vai pro fatiador, com a prancha cotada tirada da própria geometria. A cena do hub da STARK: 154 quadros, 330 malhas, 244 objetos animados. Peças de CAD sob encomenda."
            privateNote="Estudo pessoal · peças físicas"
            media={
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <ArtifactFrame
                  aspect="4/3"
                  label="viewer · levita grêmio"
                  meta="glb · 4 cores"
                  frameClassName="bg-(--color-bg)"
                >
                  <div className="absolute inset-0">
                    <ModelViewer models={SK3D_MODELS} />
                  </div>
                </ArtifactFrame>
                <ArtifactFrame
                  aspect="4/3"
                  label="stark · hub-sinal.blend"
                  meta="cycles · 154 quadros"
                >
                  <ArtifactVideo
                    webm={HUB_VIDEO.webm}
                    mp4={HUB_VIDEO.mp4}
                    poster={HUB_VIDEO.poster}
                    label="Animação do hub da STARK: um módulo central com a marca distribui sinal pra sete módulos com logos de fabricantes, sobre um fundo de circuitos"
                  />
                </ArtifactFrame>
                <ArtifactFrame
                  aspect="4/3"
                  label="blender 4.4 · quadro 77"
                  meta="343 objetos · 244 animados"
                >
                  <Image
                    src="/work-screenshots/stark-hub-blender-ui.avif"
                    alt="Blender 4.4 com a cena hub-sinal aberta: a câmera no quadro 77, o outliner com os logos e a timeline com os keyframes"
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                    quality={92}
                    className="object-cover"
                  />
                </ArtifactFrame>
                <ArtifactFrame aspect="4/3" label="levita flamengo · macro" meta="render cycles">
                  <Image
                    src="/work-screenshots/levita-flamengo-macro.avif"
                    alt="Macro do quadro LEVITA do Flamengo: o monograma CRF em relevo branco sobre as faixas vermelhas e pretas, com a textura das camadas de impressão"
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                    quality={92}
                    className="object-cover"
                  />
                </ArtifactFrame>
                <ArtifactFrame aspect="4/3" label="levita vasco · frente" meta="4 cores · 2 trocas">
                  <Image
                    src="/work-screenshots/levita-vasco-frente.avif"
                    alt="Quadro LEVITA do Vasco de frente: o escudo com a caravela em ouro flutuando dentro da moldura preta"
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                    quality={92}
                    className="object-cover"
                  />
                </ArtifactFrame>
                <ArtifactFrame
                  aspect="4/3"
                  label="levita · prancha cotada"
                  meta="gerada da geometria"
                  frameClassName="bg-white"
                >
                  <Image
                    src="/work-screenshots/levita-cotas.avif"
                    alt="Prancha técnica do LEVITA: planta da moldura, vista de frente do escudo, corte vertical 1:1 e detalhes, todos cotados em milímetros"
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                    quality={92}
                    className="object-cover"
                  />
                </ArtifactFrame>
              </div>
            }
          />

          {/* Linha 3 — dois sites, moldura de navegador, pixel 0 assentado. */}
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12">
            <MiniCard
              label="Abalo · monitor sísmico"
              tech="React · Vite · Storybook · Leaflet"
              line="Terremotos das últimas 24h em tempo real (USGS) e um diário de observações. Brand book, design system em oklch e catálogo no Storybook."
              href="https://github.com/stefanscrepka/abalo"
              media={
                <ArtifactFrame
                  variant="browser"
                  aspect="16/10"
                  label="abalo / início"
                  meta="build · set/2026"
                >
                  <Image
                    src="/work-screenshots/abalo-home.avif"
                    alt="Abalo, home: “O pulso do planeta, ao vivo.” sobre a curvatura da Terra, com o símbolo A com sismógrafo"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    quality={95}
                    className="object-cover object-top"
                  />
                </ArtifactFrame>
              }
            />

            <MiniCard
              label="STARK · site institucional"
              tech="Astro 7 · Cloudflare Workers · 6 portões de CI"
              line="Site de uma automação industrial de Ponta Grossa: 32 páginas, teto de 3 ilhas de JS e seis portões que quebram o build quando uma regra medida é violada."
              privateNote="Repositório privado · em assinatura"
              media={
                <ArtifactFrame
                  variant="browser"
                  aspect="16/10"
                  label="starkautomacao.com"
                  meta="build · set/2026"
                >
                  <Image
                    src="/work-screenshots/starksite-home.avif"
                    alt="Site da STARK Automação, hero: “Linha parada vira ponto de partida” sobre a foto de uma linha de produção"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    quality={95}
                    className="object-cover object-top"
                  />
                </ArtifactFrame>
              }
            />
          </div>
        </div>
      </OtherWorkReveal>
    </section>
  );
}

/* ============================================================
   MiniCard — artefato real em cima (código, captura ou mesh), copy embaixo.
   Hover: sobe 2px, borda um degrau mais clara, marcas de corte acendem.
   ============================================================ */

interface MiniCardProps {
  label: string;
  tech: string;
  line: string;
  href?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Sem link público: diz o porquê, em mono. */
  privateNote?: string;
  media: ReactNode;
}

function MiniCard({
  label,
  tech,
  line,
  href,
  secondaryHref,
  secondaryLabel,
  privateNote,
  media,
}: MiniCardProps) {
  const articleId = `mini-${label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}`;

  return (
    <article
      data-other-card="mini"
      aria-labelledby={articleId}
      className={cn(
        'group/mini relative isolate flex h-full min-w-0 flex-col gap-5 overflow-hidden rounded-2xl p-5 sm:p-6',
        'border border-(--color-hairline) bg-(--color-surface)',
        'shadow-(--shadow-inset-bisel)',
        '[--tick-color:var(--color-hairline-strong)]',
        'transition-[transform,border-color] duration-[350ms] ease-(--ease-standard)',
        'hover:-translate-y-[2px] hover:border-(--color-hairline-alpha-3) hover:[--tick-color:var(--color-accent)]',
        'focus-within:-translate-y-[2px] focus-within:border-(--color-hairline-alpha-3) focus-within:[--tick-color:var(--color-accent)]'
      )}
    >
      <div className="relative z-10 min-w-0">{media}</div>

      <div className="relative z-10 flex flex-1 flex-col gap-3">
        <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">{tech}</p>
        <h3
          id={articleId}
          className="text-lg font-semibold !tracking-tight !leading-[1.15] text-(--color-text-1)"
        >
          {label}
        </h3>
        <p className="text-sm leading-relaxed text-(--color-text-2)">{line}</p>

        <div className="mt-auto flex flex-wrap items-center gap-4 pt-3">
          {href ? (
            <Link
              href={href}
              target="_blank"
              rel="noreferrer"
              className={cn(
                'inline-flex items-center gap-1.5 py-3 -my-3 font-mono text-xs text-(--color-accent)',
                'transition-[gap,color] duration-(--motion-transition) ease-(--ease-smooth)',
                'hover:gap-2 hover:text-(--color-accent-hover) focus-visible:underline'
              )}
            >
              GitHub
              <span aria-hidden="true">→</span>
            </Link>
          ) : null}
          {secondaryHref ? (
            <Link
              href={secondaryHref}
              className={cn(
                'inline-flex items-center gap-1.5 py-3 -my-3 font-mono text-xs text-(--color-text-3)',
                'transition-[gap,color] duration-(--motion-transition) ease-(--ease-smooth)',
                'hover:gap-2 hover:text-(--color-accent) focus-visible:text-(--color-accent)'
              )}
            >
              {secondaryLabel ?? secondaryHref}
              <span aria-hidden="true">→</span>
            </Link>
          ) : null}
          {privateNote ? (
            <span className="font-mono text-2xs uppercase tracking-wider text-(--color-text-3)">
              {privateNote}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
