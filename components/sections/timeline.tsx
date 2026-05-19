import type { InstitutionId } from '@/components/shared/institution-logo';
import { type TimelineMarker, TimelineMarkers } from './timeline.client';

// Section 10 — Jornada / Timeline. TracingBeam vertical (Aceternity) + 4 markers
// sequenciais. Cada marker ganha logos das instituições + year tabular-nums grande lime.
// Heritage industrial mencionado SÓ aqui (HANDOFF veta no hero).

const MARKERS: TimelineMarker[] = [
  {
    year: '2021—2023',
    place: 'SENAI Ponta Grossa',
    title: 'Eletrotécnica · fundamento',
    body: 'Diagramas elétricos, automação industrial, SolidWorks. Onde aprendi a pensar em sistemas que precisam funcionar 24/7. Tolerância zero pra "deve dar certo".',
    institutions: ['senai'],
  },
  {
    year: '2024',
    place: 'Scheffer Logística · B7Web Fullstack',
    title: 'Transição · eletromecânica + código',
    body: 'Eletromecânica de manhã, programação à noite. Primeiro produto em produção: site Estética MD (Vanilla JS + PHP + ScrollReveal). Provou que entrega importa mais que stack.',
    institutions: ['scheffer', 'b7web'],
  },
  {
    year: '2025',
    place: 'Makita do Brasil · Engenharia de Software Unicesumar',
    title: 'Profissionalização · três produtos em paralelo',
    body: 'Stack moderno: Next 15, React 19, TypeScript strict. NexaCore SaaS pra clínicas + STJ App PWA + sites de infoprodutos. Três produtos rodando ao mesmo tempo.',
    institutions: ['makita', 'unicesumar'],
  },
  {
    year: '2026',
    place: 'Content Engine · AI Product Engineer',
    title: 'Agora · multi-agente em produção',
    body: '22 agentes Claude SDK orquestrados em 5 squads. Prompt cache 2 camadas, anti-slop validator com 14 regex PT-BR, aprovação humana via Telegram em ≤10 min/dia. Aqui é o presente.',
    institutions: ['content-engine'],
  },
];

export type { InstitutionId };

export function TimelineSection() {
  return (
    <section
      id="jornada"
      className="container-narrow section-pad-y border-t border-(--color-hairline)"
      data-slot="timeline"
    >
      <header className="mb-12 flex flex-col gap-3 sm:mb-16">
        <p className="eyebrow">JORNADA</p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Da automação industrial pra IA multi-agente
        </h2>
        <p className="max-w-prose text-(--color-text-2) leading-relaxed">
          Cinco anos. Quatro estágios. Um fio condutor: construir sistemas que funcionam quando
          ninguém está olhando.
        </p>
      </header>

      <TimelineMarkers markers={MARKERS} />
    </section>
  );
}
