import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArtifactFrame } from '@/components/work/artifact-frame';
import { CaseImpactTriad } from '@/components/work/case-impact-triad';
import { CaseStudyHero } from '@/components/work/case-study-hero';
import { CodeArtifact, RegistryList } from '@/components/work/code-artifact';
import {
  CE_AI_TELLS_SOURCE,
  CE_ONBOARDING_TEMPLATES,
  CE_TELEGRAM_COMMANDS,
  ceAgentsOf,
} from '@/lib/work/content-engine-artifacts';
import { getCaseStudy } from '@/lib/work/data';
import { buildBreadcrumbJsonLd, buildCaseStudyJsonLd } from '@/lib/work/json-ld';

const CS = getCaseStudy('content-engine');

export const metadata: Metadata = {
  title: `${CS?.title ?? 'Content Engine'} · case study`,
  description:
    'Sistema multi-agente Claude: 19 agentes em 5 squads, acordados por cron às 03h, entregam um pacote por marca às 07h30 pra você aprovar no Telegram. Anti-slop com 28 regex pt-BR e inference local numa RTX 3070.',
  openGraph: {
    type: 'article',
    title: `${CS?.title ?? 'Content Engine'} · case study · Stefan Heinz Screpka`,
    description:
      '19 agentes Claude em 5 squads. Um pacote por dia, três botões pra aprovar. Anti-slop com 28 regex pt-BR. Inference local numa RTX 3070.',
    url: '/work/content-engine',
  },
  alternates: { canonical: '/work/content-engine' },
};

// /work/content-engine — F6 (2026-09-04): os sete painéis com "círculos numa
// linha" (DiagramDots) e o hub-e-raios (DiagramOverview) saíram. No lugar de
// cada desenho entra o registro cru correspondente, copiado do código do
// produto (lib/work/content-engine-artifacts.ts): os papéis dos agentes como o
// Studio os nomeia, os templates de prompt do onboarding, as 14 regex do
// anti-slop, os comandos do bot. E, antes de tudo, o produto rodando: duas
// capturas do Studio em ambiente local.

interface Panel {
  id: string;
  badge: string;
  title: string;
  body: string;
  detail: string;
}

// Microcopy 05§Seção 4 (mantida). O artefato de cada painel é escolhido no JSX.
const PANELS: Panel[] = [
  {
    id: 'squad-0',
    badge: 'SQUAD 0 · ONBOARDING',
    title: '6 agentes · O-1...O-6',
    body: 'Roda uma vez por marca: mapa do mercado, leitura do material, voz, calendário de 30 dias e a biblioteca de referências visuais. Treino de LoRA na RTX 3070 local, com smoke test antes de promover o modelo.',
    detail: 'Output: brand model + voice fingerprint + visual reference set',
  },
  {
    id: 'squad-1',
    badge: 'SQUAD 1 · INTELIGÊNCIA',
    title: '4 agentes · I-1...I-4',
    body: 'Às 03h: busca na web (Perplexity e Exa), concorrência, tendências e sinais da audiência. Embeddings bge-m3 no Ollama local, guardados no Qdrant por marca.',
    detail: 'BGE-M3 embeddings 1024-dim · Qdrant namespace por marca',
  },
  {
    id: 'squad-2',
    badge: 'SQUAD 2 · ESTRATÉGIA',
    title: '2 agentes · S-5, S-6',
    body: 'Às 05h30: o calendário do dia e o melhor horário de cada marca, ajustado pelo que a Revisão aprendeu (R-18).',
    detail: 'Calendar mensal + posting windows otimizados por timezone + audiência',
  },
  {
    id: 'squad-3',
    badge: 'SQUAD 3 · CRIAÇÃO',
    title: '8 agentes · C-7...C-14',
    body: 'Às 06h: copy com Opus 4.7 e Sonnet 4.6; imagem com SD 3.5 no ComfyUI local, Higgsfield e Nano Banana; vídeo com Veo 3.1 e Sora 2. C-12 roda por semana, C-13 a cada upload.',
    detail: '3 lanes paralelas · LoRA per brand fine-tuning · vision multi-model routing',
  },
  {
    id: 'squad-4',
    badge: 'SQUAD 4 · REVISÃO ANTI-SLOP',
    title: '4 agentes · R-15...R-18',
    body: 'Às 07h15: anti-slop em cascata. 28 regex pt-BR (14 clássicas, 14 de 2026), surprisal local e um juiz LLM. O que passa vira golden pro próximo treino.',
    detail: 'A lista ao lado é o código: AI_TELL_PATTERNS_V1, sem edição',
  },
  {
    id: 'hitl',
    badge: 'E-0 · APROVAÇÃO HITL',
    title: '1 humano no loop',
    body: 'Às 07h30 o Editor-Chefe monta o pacote do dia. Você aprova, refina ou rejeita em três botões, no Studio ou no Telegram. Sem reunião.',
    detail:
      'Bot grammY · aprovar, refinar, rejeitar inline · o golden vira o próximo lote de treino',
  },
];

function PanelArtifact({ id }: { id: string }) {
  switch (id) {
    case 'squad-0':
      return (
        <div className="flex flex-col gap-6">
          <ArtifactFrame
            aspect="16/10"
            label="studio · /marca"
            meta="local · set/2026"
            caption="Marca: a base que a equipe usa. Mercado, material, voz, calendário (O-1 a O-5 prontos, O-6 na fila)"
          >
            <Image
              src="/work-screenshots/content-engine-marca.avif"
              alt="Content Engine Studio, página Marca: SK3D com 84% da base completa e a lista do que a IA já montou: mapa do mercado, leitura do material, voz, calendário de 30 dias"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              quality={95}
              className="object-cover object-top"
            />
          </ArtifactFrame>
          <RegistryList
            rows={CE_ONBOARDING_TEMPLATES.map((t) => ({ id: t.id, name: t.file }))}
            source="packages/prompts/templates · os seis prompts do onboarding, pelo nome do arquivo"
          />
        </div>
      );
    case 'squad-1':
      return (
        <RegistryList
          rows={ceAgentsOf('inteligencia').map((a) => ({ id: a.id, name: a.role, detail: a.duty }))}
          source="apps/web/src/lib/agent-roles.ts · como o Studio nomeia cada papel"
        />
      );
    case 'squad-2':
      return (
        <RegistryList
          rows={ceAgentsOf('estrategia').map((a) => ({ id: a.id, name: a.role, detail: a.duty }))}
          source="apps/web/src/lib/agent-roles.ts"
        />
      );
    case 'squad-3':
      return (
        <RegistryList
          rows={ceAgentsOf('criacao').map((a) => ({ id: a.id, name: a.role, detail: a.duty }))}
          source="apps/web/src/lib/agent-roles.ts"
        />
      );
    case 'squad-4':
      return (
        <div className="flex flex-col gap-6">
          <RegistryList
            rows={ceAgentsOf('revisao').map((a) => ({ id: a.id, name: a.role, detail: a.duty }))}
            lit="R-15"
          />
          <CodeArtifact
            source={CE_AI_TELLS_SOURCE.file}
            lines={CE_AI_TELLS_SOURCE.lines}
            startLine={CE_AI_TELLS_SOURCE.startLine}
            meta="typescript"
          />
        </div>
      );
    case 'hitl':
      return (
        <div className="flex flex-col gap-6">
          <RegistryList
            rows={ceAgentsOf('direcao').map((a) => ({ id: a.id, name: a.role, detail: a.duty }))}
            lit="E-0"
            source="apps/web/src/lib/agent-roles.ts"
          />
          <RegistryList
            rows={CE_TELEGRAM_COMMANDS.map((c) => ({ id: c.cmd, name: c.file }))}
            source="apps/telegram-bot/src/bot.ts · bot.command(…), na ordem do registro"
          />
        </div>
      );
    default:
      return null;
  }
}

export default function ContentEnginePage() {
  if (!CS) notFound();
  const gallery = CS.gallery ?? [];

  return (
    <div className="pb-24">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data SSR
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildCaseStudyJsonLd(CS)) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data SSR
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd(CS)) }}
      />
      <CaseStudyHero cs={CS} />

      <CaseImpactTriad cs={CS} />

      {/* O produto, rodando — antes de qualquer arquitetura. */}
      <section
        id="produto"
        aria-labelledby="ce-produto-heading"
        className="container-max scroll-mt-24 mt-16 flex flex-col gap-10 sm:mt-20"
      >
        <header className="flex flex-col gap-3">
          <p className="eyebrow">O produto, rodando</p>
          <h2
            id="ce-produto-heading"
            className="text-2xl font-semibold !leading-[1.15] !tracking-tight sm:text-3xl"
          >
            Uma caixa de entrada, não um painel.
          </h2>
          <p className="max-w-prose text-reading text-(--color-text-2)">
            O Studio mostra o que o dono precisa decidir: o pacote do dia, com as variantes e os
            botões aprovar, refinar, rejeitar. E quem fez o quê, a que horas, quanto custou. As
            capturas são do produto em ambiente local, com o runtime em modo scripted (regras, sem
            chamada a LLM): o fluxo é o de produção, o conteúdo é de fixture.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {gallery.map((shot, i) => (
            <ArtifactFrame
              key={shot.src}
              aspect={shot.aspect}
              label={shot.label}
              meta={shot.meta}
              caption={shot.caption}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                quality={95}
                className="object-cover object-top"
                loading={i === 0 ? 'eager' : undefined}
              />
            </ArtifactFrame>
          ))}
        </div>
      </section>

      {/* Os 5 squads + HITL em vertical stack editorial. Cada painel é um
          <article> com 2-col: copy + registro cru. */}
      <section
        id="architecture"
        aria-labelledby="ce-flow-heading"
        className="container-max scroll-mt-24 mt-20 flex flex-col gap-12 sm:mt-28 sm:gap-16"
      >
        <header className="flex flex-col gap-3">
          <p className="eyebrow">Fluxo · 5 squads + HITL</p>
          <h2
            id="ce-flow-heading"
            className="text-2xl font-semibold !leading-[1.15] !tracking-tight sm:text-3xl"
          >
            19 agentes, 5 squads, um cron às 03h.
          </h2>
          <p className="max-w-prose text-reading text-(--color-text-2)">
            A Inteligência acorda às 03h e alimenta a Estratégia, que alimenta a Criação, que passa
            pela Revisão antes de chegar ao Editor-Chefe às 07h30. Ao lado de cada etapa, o registro
            correspondente copiado do código, não um desenho.
          </p>
        </header>

        <ol className="flex flex-col gap-12 sm:gap-16">
          {PANELS.map((panel, idx) => (
            <li
              key={panel.id}
              id={panel.id}
              className="scroll-mt-24 border-t border-(--color-hairline) pt-10 first:border-t-0 first:pt-0"
            >
              <article
                aria-labelledby={`ce-panel-${panel.id}`}
                className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start lg:gap-12"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-baseline gap-3">
                    <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-2) tabular-nums">
                      {String(idx + 1).padStart(2, '0')} /{' '}
                      {PANELS.length.toString().padStart(2, '0')}
                    </p>
                    <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
                      {panel.badge}
                    </p>
                  </div>
                  <h3
                    id={`ce-panel-${panel.id}`}
                    className="text-2xl font-semibold !leading-[1.1] !tracking-tight sm:text-3xl"
                  >
                    {panel.title}
                  </h3>
                  <p className="text-reading text-(--color-text-2)">{panel.body}</p>
                  <p className="font-mono text-xs leading-relaxed text-(--color-text-3)">
                    {panel.detail}
                  </p>
                </div>
                <div className="min-w-0 lg:pt-1">
                  <PanelArtifact id={panel.id} />
                </div>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-max mt-16 grid gap-10 sm:mt-20 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-4">
          <p className="eyebrow">Stack</p>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-(--color-text-2)">
            {CS.stack.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden="true" className="text-(--color-text-3)">
                  ·
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <p className="eyebrow">Squads em detalhe</p>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-(--color-text-2)">
            {CS.details.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden="true" className="text-(--color-text-3)">
                  ·
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
