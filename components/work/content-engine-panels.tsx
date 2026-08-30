import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// 7 painéis do Content Engine case study (intro + 5 squads + HITL).
// Cada panel: badge + título + descrição + detalhe técnico + diagram SVG.
// Microcopy 05§Seção 4. SVG diagrams custom por squad (agente count + flow).

export interface PanelSpec {
  id: string;
  badge: string;
  title: string;
  body: string;
  detail: string;
  diagram: ReactNode;
}

export const CONTENT_ENGINE_PANELS: PanelSpec[] = [
  {
    id: 'intro',
    badge: 'CONTENT ENGINE',
    title: 'Sistema multi-agente autônomo',
    body: '22 agentes Claude SDK em 5 squads orquestrados. Substitui agência de 4-6 pessoas. Aprovação humana ≤10 min/dia via Telegram.',
    detail: 'Cron 03h-07h30 · stack local GPU RTX 3070 subsidiando inferência',
    diagram: <DiagramOverview />,
  },
  {
    id: 'squad-0',
    badge: 'SQUAD 0 · ONBOARDING',
    title: '6 agentes · O-1...O-6',
    body: 'Brand brief intake + LoRA training pipeline offline. RTX 3070 local. Smoke test automático antes de promover modelo.',
    detail: 'Output: brand model + voice fingerprint + visual reference set',
    diagram: <DiagramDots count={6} label="O" />,
  },
  {
    id: 'squad-1',
    badge: 'SQUAD 1 · INTELIGÊNCIA',
    title: '4 agentes · I-1...I-4',
    body: 'Web search Perplexity + Exa. Competitive analysis. Trend detection. Embeddings BGE-M3 + Gemini.',
    detail: 'BGE-M3 embeddings 1024-dim · Qdrant namespace por marca',
    diagram: <DiagramDots count={4} label="I" />,
  },
  {
    id: 'squad-2',
    badge: 'SQUAD 2 · ESTRATÉGIA',
    title: '2 agentes · S-5, S-6',
    body: 'Content calendar generation. Posting time optimization por marca (R-18 feedback loop).',
    detail: 'Calendar mensal + posting windows otimizados por timezone + audiência',
    diagram: <DiagramDots count={2} label="S" />,
  },
  {
    id: 'squad-3',
    badge: 'SQUAD 3 · CRIAÇÃO',
    title: '8 agentes · C-7...C-14',
    body: 'Copy (Opus 4.7 + Sonnet 4.6) + visual (Higgsfield, Nano Banana 2, SDXL+LoRA) + video (Veo 3.1, Sora 2).',
    detail: '3 lanes paralelas · LoRA per brand fine-tuning · vision multi-model routing',
    diagram: <DiagramDots count={8} label="C" />,
  },
  {
    id: 'squad-4',
    badge: 'SQUAD 4 · REVISÃO ANTI-SLOP',
    title: '4 agentes · R-15...R-18',
    body: '20-item checklist + 14 regex pt-BR detectando AI-tells. Feedback loop posting times. Goldens datasets pra fine-tuning.',
    detail: '14 regex banlist · "no mundo atual" · "além disso" · "vamos explorar" · ...',
    diagram: <DiagramDots count={4} label="R" />,
  },
  {
    id: 'hitl',
    badge: 'E-0 · APROVAÇÃO HITL',
    title: '1 agente humano-in-the-loop',
    body: 'Telegram bot grammy. Humano aprova/edita/rejeita em ≤10 min/dia. Goldens populam datasets pra fine-tuning.',
    detail: 'Bot grammy · approve/edit/reject inline · golden output → next training batch',
    diagram: <DiagramHITL />,
  },
];

export function ContentEnginePanel({
  panel,
  index,
  total,
}: {
  panel: PanelSpec;
  index: number;
  total: number;
}) {
  return (
    <article
      className={cn('flex h-full w-full flex-col items-start justify-center gap-6', 'max-w-3xl')}
      aria-labelledby={`ce-panel-${panel.id}`}
    >
      <p className="font-mono text-2xs uppercase tracking-widest text-(--color-accent)">
        {panel.badge}
      </p>
      <h3
        id={`ce-panel-${panel.id}`}
        className="text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl"
      >
        {panel.title}
      </h3>
      <p className="text-base leading-relaxed text-(--color-text-2) sm:text-lg">{panel.body}</p>
      <p className="font-mono text-xs leading-relaxed text-(--color-text-3)">{panel.detail}</p>

      <div className="mt-4 flex w-full items-center justify-center">{panel.diagram}</div>

      <p className="mt-auto font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </p>
    </article>
  );
}

// ============================================================
// Diagram SVGs — custom per squad type
// ============================================================

function DiagramOverview() {
  return (
    <svg viewBox="0 0 320 80" className="w-full max-w-md" aria-hidden="true" focusable="false">
      {/* Hub center + 5 spokes */}
      <circle
        cx="160"
        cy="40"
        r="10"
        stroke="var(--color-accent)"
        strokeWidth="2"
        fill="var(--color-accent)"
        fillOpacity="0.15"
      />
      {[20, 70, 120, 200, 250, 300].map((x) => (
        <g key={x}>
          <line
            x1="160"
            y1="40"
            x2={x}
            y2="40"
            stroke="var(--color-hairline-strong)"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
          <circle
            cx={x}
            cy="40"
            r="5"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            fill="var(--color-bg)"
          />
        </g>
      ))}
    </svg>
  );
}

function DiagramDots({ count, label }: { count: number; label: string }) {
  const positions = Array.from(
    { length: count },
    (_, i) => 20 + i * (280 / Math.max(1, count - 1))
  );
  return (
    <svg viewBox="0 0 320 60" className="w-full max-w-md" aria-hidden="true" focusable="false">
      {/* Connecting line */}
      <line
        x1="20"
        y1="30"
        x2="300"
        y2="30"
        stroke="var(--color-hairline-strong)"
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      {positions.map((x, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static layout
        <g key={`${label}-${i}`}>
          <circle
            cx={x}
            cy="30"
            r="8"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            fill="var(--color-bg)"
          />
          <text
            x={x}
            y="34"
            textAnchor="middle"
            fontSize="8"
            fontFamily="var(--font-mono)"
            fill="var(--color-accent)"
          >
            {`${label}${i + 1}`}
          </text>
        </g>
      ))}
    </svg>
  );
}

function DiagramHITL() {
  return (
    <svg viewBox="0 0 320 80" className="w-full max-w-md" aria-hidden="true" focusable="false">
      {/* Human icon */}
      <circle
        cx="60"
        cy="36"
        r="8"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        fill="var(--color-bg)"
      />
      <path d="M 50 60 Q 60 50 70 60" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" />
      <text
        x="60"
        y="78"
        textAnchor="middle"
        fontSize="8"
        fontFamily="var(--font-mono)"
        fill="var(--color-text-3)"
      >
        humano
      </text>

      {/* Telegram bot arrows */}
      <path
        d="M 80 40 L 240 40"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        markerEnd="url(#arrow-r)"
      />
      <path
        d="M 240 50 L 80 50"
        stroke="var(--color-hairline-strong)"
        strokeWidth="1"
        strokeDasharray="2 3"
        markerEnd="url(#arrow-l)"
      />

      <rect
        x="250"
        y="20"
        width="50"
        height="40"
        rx="4"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        fill="var(--color-bg)"
      />
      <text
        x="275"
        y="44"
        textAnchor="middle"
        fontSize="8"
        fontFamily="var(--font-mono)"
        fill="var(--color-accent)"
      >
        E-0
      </text>
      <text
        x="275"
        y="78"
        textAnchor="middle"
        fontSize="8"
        fontFamily="var(--font-mono)"
        fill="var(--color-text-3)"
      >
        telegram bot
      </text>

      <defs>
        <marker id="arrow-r" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 z" fill="var(--color-accent)" />
        </marker>
        <marker
          id="arrow-l"
          markerWidth="6"
          markerHeight="6"
          refX="1"
          refY="3"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 6 3 L 0 6 z" fill="var(--color-hairline-strong)" />
        </marker>
      </defs>
    </svg>
  );
}
