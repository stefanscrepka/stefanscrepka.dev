// Diagramas SVG custom por produto — substituem placeholder genérico "SH" em
// case study covers. Cada um é único e comunica a arquitetura real do produto.
// Estáticos (zero JS), com decorative aria-hidden — semântica fica no card pai.
//
// Layout: viewBox 100×60 (16/10), preenche o ProductCover/Mockup container.

import { cn } from '@/lib/utils';

interface DiagramProps {
  className?: string;
  label?: string;
}

// =================================================================
// CONTENT ENGINE — pipeline horizontal real
// Whisper (input audio) -> S0 Onboarding -> S1 Inteligência -> S2 Estratégia
// -> S3 Criação -> S4 Revisão -> E-0 HITL Telegram (output approval)
//
// Substituiu uma "rede de pontos lime conectados" generica (anti-AI slop).
// Agora mostra o pipeline DIRECIONAL real do produto: data flow esquerda
// pra direita, glass-panel cards + setas estilo Apple iPhone spec sheet.
// =================================================================

interface PipelineStage {
  id: string;
  count?: string;
  title: string;
  emissive?: boolean;
}

const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'IN', title: 'Whisper local · audio' },
  { id: 'S0', count: '6', title: 'Onboarding' },
  { id: 'S1', count: '4', title: 'Inteligência' },
  { id: 'S2', count: '2', title: 'Estratégia' },
  { id: 'S3', count: '8', title: 'Criação' },
  { id: 'S4', count: '4', title: 'Revisão' },
  { id: 'E-0', title: 'HITL Telegram', emissive: true },
];

const STAGE_W = 12;
const STAGE_H = 22;
const GAP = 1.4;
const ROW_Y = 16; // top of stage row
const X_START = (100 - (PIPELINE_STAGES.length * STAGE_W + (PIPELINE_STAGES.length - 1) * GAP)) / 2;

export function SquadsDiagram({ className, label }: DiagramProps) {
  return (
    <svg
      viewBox="0 0 100 60"
      preserveAspectRatio="xMidYMid meet"
      className={cn('h-full w-full', className)}
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      {label ? <title>{label}</title> : null}

      <defs>
        <pattern id="grid-ce" width="4" height="4" patternUnits="userSpaceOnUse">
          <path
            d="M 4 0 L 0 0 0 4"
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth="0.15"
            opacity="0.35"
          />
        </pattern>
        {/* Arrow marker reutilizado por todos os connectors */}
        <marker
          id="arrow-ce"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="3.4"
          markerHeight="3.4"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)" />
        </marker>
      </defs>

      <rect width="100" height="60" fill="url(#grid-ce)" />

      {/* Connector lines + arrowheads ENTRE stages */}
      {PIPELINE_STAGES.slice(0, -1).map((stage, idx) => {
        const x1 = X_START + (idx + 1) * STAGE_W + idx * GAP;
        const x2 = X_START + (idx + 1) * (STAGE_W + GAP);
        const y = ROW_Y + STAGE_H / 2;
        return (
          <line
            key={`arrow-${stage.id}`}
            x1={x1}
            y1={y}
            x2={x2 - 0.5}
            y2={y}
            stroke="var(--color-accent)"
            strokeWidth="0.5"
            opacity="0.6"
            markerEnd="url(#arrow-ce)"
          />
        );
      })}

      {/* Stages */}
      {PIPELINE_STAGES.map((stage, idx) => {
        const x = X_START + idx * (STAGE_W + GAP);
        const emissive = stage.emissive;
        return (
          <g key={`stage-${stage.id}`}>
            <rect
              x={x}
              y={ROW_Y}
              width={STAGE_W}
              height={STAGE_H}
              rx="1.6"
              ry="1.6"
              fill={emissive ? 'var(--color-accent-subtle)' : 'var(--color-surface-elevated)'}
              stroke={emissive ? 'var(--color-accent)' : 'var(--color-hairline-strong)'}
              strokeWidth={emissive ? '0.6' : '0.3'}
            />
            {/* Inset highlight top — bisel effect */}
            <line
              x1={x + 1}
              y1={ROW_Y + 0.5}
              x2={x + STAGE_W - 1}
              y2={ROW_Y + 0.5}
              stroke="var(--color-accent)"
              strokeWidth="0.15"
              opacity={emissive ? '0.45' : '0.15'}
            />
            {/* Stage id (S0, S1, ..., E-0) */}
            <text
              x={x + STAGE_W / 2}
              y={ROW_Y + 7.5}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="3.8"
              fontFamily="var(--font-mono)"
              fontWeight="600"
              fill={emissive ? 'var(--color-accent)' : 'var(--color-text-1)'}
            >
              {stage.id}
            </text>
            {/* Stage count (6, 4, 2, 8, 4) ou nada */}
            {stage.count ? (
              <text
                x={x + STAGE_W / 2}
                y={ROW_Y + 13}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="2.4"
                fontFamily="var(--font-mono)"
                fill="var(--color-accent)"
              >
                {stage.count} agents
              </text>
            ) : null}
            {/* Stage title curto embaixo */}
            <text
              x={x + STAGE_W / 2}
              y={ROW_Y + STAGE_H - 3}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="1.65"
              fontFamily="var(--font-mono)"
              fill={emissive ? 'var(--color-accent)' : 'var(--color-text-2)'}
            >
              {stage.title}
            </text>
          </g>
        );
      })}

      {/* Footer mono uppercase tracking-widest */}
      <text
        x="50"
        y="50"
        textAnchor="middle"
        fontSize="1.8"
        fontFamily="var(--font-mono)"
        fill="var(--color-text-3)"
        letterSpacing="0.2"
      >
        22 AGENTES · 5 SQUADS · APROVAÇÃO HUMANA ≤10 MIN/DIA · CRON 03H–07H30
      </text>
    </svg>
  );
}

// =================================================================
// NEXACORE — stack vertical multi-tenant SaaS
// =================================================================

const NEXACORE_LAYERS = [
  { label: 'Clerk Auth + RBAC + MFA', sub: 'JWT · multi-tenant' },
  { label: 'Next 14 · React 18.3', sub: '61 componentes design' },
  { label: 'Prisma · Postgres 16', sub: 'soft delete · LGPD' },
  { label: 'Redis · Socket.io · BullMQ', sub: 'realtime + queues' },
  { label: 'OpenAI · circuit breaker', sub: 'budget tracking per tenant' },
  { label: 'Evolution API · Stripe · Asaas', sub: 'WhatsApp + payments' },
];

export function NexaCoreDiagram({ className, label }: DiagramProps) {
  return (
    <svg
      viewBox="0 0 100 60"
      preserveAspectRatio="xMidYMid meet"
      className={cn('h-full w-full', className)}
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      {label ? <title>{label}</title> : null}

      <defs>
        <linearGradient id="nxc-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="100" height="60" fill="url(#nxc-bg)" />

      {/* Tag superior */}
      <text
        x="6"
        y="6"
        fontSize="1.8"
        fontFamily="var(--font-mono)"
        fill="var(--color-accent)"
        letterSpacing="0.25"
      >
        ↳ STACK NEXACORE · striveos.shop
      </text>

      {/* 6 horizontal bars — stack layers */}
      {NEXACORE_LAYERS.map((layer, i) => {
        const y = 11 + i * 7;
        const isAccent = i === 0 || i === 5;
        return (
          <g key={layer.label}>
            <rect
              x="6"
              y={y}
              width="88"
              height="5.6"
              rx="0.8"
              fill={isAccent ? 'var(--color-accent-subtle)' : 'var(--color-surface-elevated)'}
              stroke={isAccent ? 'var(--color-accent)' : 'var(--color-hairline-strong)'}
              strokeWidth="0.3"
            />
            {/* layer index pill */}
            <rect
              x="6.6"
              y={y + 0.8}
              width="6"
              height="4"
              rx="0.5"
              fill="var(--color-base)"
              stroke="var(--color-accent)"
              strokeWidth="0.25"
            />
            <text
              x="9.6"
              y={y + 3.7}
              textAnchor="middle"
              fontSize="2.4"
              fontFamily="var(--font-mono)"
              fontWeight="600"
              fill="var(--color-accent)"
            >
              L{i + 1}
            </text>
            <text
              x="14"
              y={y + 2.6}
              fontSize="1.9"
              fontFamily="var(--font-mono)"
              fontWeight="600"
              fill="var(--color-text-1)"
            >
              {layer.label}
            </text>
            <text
              x="14"
              y={y + 4.8}
              fontSize="1.4"
              fontFamily="var(--font-mono)"
              fill="var(--color-text-3)"
            >
              {layer.sub}
            </text>
          </g>
        );
      })}

      {/* Footer */}
      <text
        x="6"
        y="58"
        fontSize="1.6"
        fontFamily="var(--font-mono)"
        fill="var(--color-text-3)"
        letterSpacing="0.2"
      >
        B2B MULTI-TENANT · 61 COMPONENTES DESIGN · EM PRODUÇÃO 2025
      </text>
    </svg>
  );
}

// =================================================================
// STJ APP — PWA cockpit phone + cache layers + workflow nodes
// =================================================================

export function StjAppDiagram({ className, label }: DiagramProps) {
  return (
    <svg
      viewBox="0 0 100 60"
      preserveAspectRatio="xMidYMid meet"
      className={cn('h-full w-full', className)}
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      {label ? <title>{label}</title> : null}

      <defs>
        <radialGradient id="stj-bg" cx="30%" cy="40%" r="60%">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="100" height="60" fill="url(#stj-bg)" />

      {/* Phone outline (PWA) */}
      <g>
        <rect
          x="18"
          y="8"
          width="22"
          height="44"
          rx="2.5"
          fill="var(--color-surface-elevated)"
          stroke="var(--color-accent)"
          strokeWidth="0.5"
        />
        {/* Notch */}
        <rect x="26" y="9" width="6" height="1" rx="0.5" fill="var(--color-base)" />
        {/* Screen content — 3 cache layers + Claude streaming */}
        <rect x="20" y="12" width="18" height="38" rx="1.2" fill="var(--color-base)" />

        {/* Layer 1: Anthropic API cache 1h */}
        <rect
          x="22"
          y="14"
          width="14"
          height="6"
          rx="0.6"
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="0.25"
        />
        <text
          x="23.5"
          y="16.6"
          fontSize="1.4"
          fontFamily="var(--font-mono)"
          fontWeight="600"
          fill="var(--color-accent)"
        >
          L1
        </text>
        <text
          x="26.5"
          y="16.6"
          fontSize="1.3"
          fontFamily="var(--font-mono)"
          fill="var(--color-text-1)"
        >
          Anthropic 1h
        </text>
        <text
          x="23.5"
          y="18.8"
          fontSize="1.1"
          fontFamily="var(--font-mono)"
          fill="var(--color-text-3)"
        >
          server-side
        </text>

        {/* Layer 2: Supabase hash 24h */}
        <rect
          x="22"
          y="22"
          width="14"
          height="6"
          rx="0.6"
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="0.25"
        />
        <text
          x="23.5"
          y="24.6"
          fontSize="1.4"
          fontFamily="var(--font-mono)"
          fontWeight="600"
          fill="var(--color-accent)"
        >
          L2
        </text>
        <text
          x="26.5"
          y="24.6"
          fontSize="1.3"
          fontFamily="var(--font-mono)"
          fill="var(--color-text-1)"
        >
          Supabase 24h
        </text>
        <text
          x="23.5"
          y="26.8"
          fontSize="1.1"
          fontFamily="var(--font-mono)"
          fill="var(--color-text-3)"
        >
          hash-based
        </text>

        {/* Vision validator */}
        <rect
          x="22"
          y="30"
          width="14"
          height="5"
          rx="0.6"
          fill="var(--color-surface-overlay)"
          stroke="var(--color-hairline-strong)"
          strokeWidth="0.2"
        />
        <text
          x="29"
          y="33"
          textAnchor="middle"
          fontSize="1.3"
          fontFamily="var(--font-mono)"
          fill="var(--color-text-2)"
        >
          Vision CV
        </text>

        {/* RAG pgvector */}
        <rect
          x="22"
          y="37"
          width="14"
          height="5"
          rx="0.6"
          fill="var(--color-surface-overlay)"
          stroke="var(--color-hairline-strong)"
          strokeWidth="0.2"
        />
        <text
          x="29"
          y="40"
          textAnchor="middle"
          fontSize="1.3"
          fontFamily="var(--font-mono)"
          fill="var(--color-text-2)"
        >
          RAG pgvector
        </text>

        {/* Streaming pulse dot */}
        <circle cx="29" cy="46" r="1.2" fill="var(--color-accent)" />
        <text
          x="29"
          y="49"
          textAnchor="middle"
          fontSize="1.2"
          fontFamily="var(--font-mono)"
          fill="var(--color-accent)"
        >
          Haiku 4.5 ●
        </text>
      </g>

      {/* Inngest workflow nodes — direita */}
      <g>
        <text
          x="48"
          y="11"
          fontSize="1.8"
          fontFamily="var(--font-mono)"
          fill="var(--color-accent)"
          letterSpacing="0.2"
        >
          ↳ INNGEST WORKFLOWS
        </text>

        {/* 5 workflow nodes vertical */}
        {[
          'auth · 2FA TOTP',
          'approve content',
          'CV validator',
          'embed pgvector',
          'streaming SSE',
        ].map((step, i) => {
          const y = 16 + i * 7;
          return (
            <g key={step}>
              <circle cx="50" cy={y + 2} r="1.4" fill="var(--color-accent)" />
              {i < 4 ? (
                <line
                  x1="50"
                  y1={y + 3.6}
                  x2="50"
                  y2={y + 7}
                  stroke="var(--color-accent)"
                  strokeWidth="0.3"
                  strokeDasharray="0.8 0.6"
                />
              ) : null}
              <rect
                x="54"
                y={y}
                width="40"
                height="4"
                rx="0.6"
                fill="var(--color-surface-elevated)"
                stroke="var(--color-hairline-strong)"
                strokeWidth="0.2"
              />
              <text
                x="55.5"
                y={y + 2.7}
                fontSize="1.5"
                fontFamily="var(--font-mono)"
                fill="var(--color-text-1)"
              >
                {step}
              </text>
            </g>
          );
        })}
      </g>

      {/* Footer */}
      <text
        x="50"
        y="57"
        textAnchor="middle"
        fontSize="1.6"
        fontFamily="var(--font-mono)"
        fill="var(--color-text-3)"
        letterSpacing="0.2"
      >
        PWA · CACHE 2 CAMADAS · 162 TESTES · @LINAREIS.FIT
      </text>
    </svg>
  );
}

// =================================================================
// CARONAS JAVA — terminal style com java records + util.concurrent
// =================================================================

export function CaronasDiagram({ className, label }: DiagramProps) {
  return (
    <svg
      viewBox="0 0 100 60"
      preserveAspectRatio="xMidYMid meet"
      className={cn('h-full w-full', className)}
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      {label ? <title>{label}</title> : null}

      <rect width="100" height="60" fill="var(--color-base)" />

      {/* Terminal window chrome */}
      <rect
        x="5"
        y="6"
        width="90"
        height="48"
        rx="1.5"
        fill="var(--color-surface-elevated)"
        stroke="var(--color-hairline-strong)"
        strokeWidth="0.3"
      />
      <rect x="5" y="6" width="90" height="4" rx="1.5" fill="var(--color-surface-overlay)" />
      <circle cx="8" cy="8" r="0.7" fill="oklch(65% 0.20 10)" />
      <circle cx="10.5" cy="8" r="0.7" fill="oklch(80% 0.18 100)" />
      <circle cx="13" cy="8" r="0.7" fill="oklch(75% 0.15 142)" />
      <text
        x="50"
        y="9"
        textAnchor="middle"
        fontSize="1.4"
        fontFamily="var(--font-mono)"
        fill="var(--color-text-3)"
      >
        ~/sistema-caronas · java 21
      </text>

      {/* Code lines */}
      {[
        { y: 14, content: '$ java -jar caronas.jar', tone: 'accent' },
        { y: 18, content: '› Carregando estado de file storage…', tone: 'text-3' },
        { y: 22, content: '› 14 caronas ativas · 23 motoristas', tone: 'text-2' },
        { y: 28, content: '> nova-carona MGF→PG 06:30 [4 vagas]', tone: 'accent' },
        { y: 32, content: '  ✓ Carona #45 criada em 12ms', tone: 'text-2' },
        { y: 38, content: '> listar-rotas-populares', tone: 'accent' },
        { y: 42, content: '  PG → CTBA  (32 ofertas)', tone: 'text-2' },
        { y: 46, content: '  MGF → PG   (18 ofertas)', tone: 'text-2' },
      ].map((line) => (
        <text
          key={line.y}
          x="7.5"
          y={line.y}
          fontSize="1.8"
          fontFamily="var(--font-mono)"
          fill={
            line.tone === 'accent'
              ? 'var(--color-accent)'
              : line.tone === 'text-2'
                ? 'var(--color-text-1)'
                : 'var(--color-text-3)'
          }
        >
          {line.content}
        </text>
      ))}

      {/* Cursor block */}
      <rect x="7.5" y="51" width="1.4" height="2" fill="var(--color-accent)" />

      {/* Footer */}
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontSize="1.5"
        fontFamily="var(--font-mono)"
        fill="var(--color-text-3)"
        letterSpacing="0.2"
      >
        JAVA 21 · RECORDS · CONCURRENT · CLI UNIVERSITÁRIA UNICESUMAR
      </text>
    </svg>
  );
}

// =================================================================
// ESTRUTURA C — code snippet Fibonacci memoizada
// =================================================================

export function EstruturaCDiagram({ className, label }: DiagramProps) {
  return (
    <svg
      viewBox="0 0 100 60"
      preserveAspectRatio="xMidYMid meet"
      className={cn('h-full w-full', className)}
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      {label ? <title>{label}</title> : null}

      <rect width="100" height="60" fill="var(--color-base)" />

      {/* IDE-style file tab */}
      <rect x="5" y="5" width="22" height="4" rx="0.5" fill="var(--color-surface-overlay)" />
      <text x="7" y="7.8" fontSize="1.6" fontFamily="var(--font-mono)" fill="var(--color-accent)">
        fibonacci.c
      </text>

      {/* Line numbers + code */}
      {[
        { ln: 1, txt: '#include <stdio.h>', col: 'comment' },
        { ln: 2, txt: '', col: 'plain' },
        { ln: 3, txt: 'long memo[100] = {0};', col: 'keyword' },
        { ln: 4, txt: '', col: 'plain' },
        { ln: 5, txt: 'long fib(int n) {', col: 'keyword' },
        { ln: 6, txt: '  if (n <= 1) return n;', col: 'plain' },
        { ln: 7, txt: '  if (memo[n]) return memo[n];', col: 'plain' },
        { ln: 8, txt: '  return memo[n] = fib(n-1) + fib(n-2);', col: 'accent' },
        { ln: 9, txt: '}', col: 'keyword' },
        { ln: 10, txt: '', col: 'plain' },
        { ln: 11, txt: 'int main() {', col: 'keyword' },
        { ln: 12, txt: '  printf("%ld\\n", fib(50));', col: 'plain' },
        { ln: 13, txt: '  return 0;', col: 'plain' },
        { ln: 14, txt: '}', col: 'keyword' },
      ].map((line) => {
        const y = 13 + line.ln * 2.5;
        const fillColor =
          line.col === 'comment'
            ? 'var(--color-text-3)'
            : line.col === 'keyword'
              ? 'var(--color-accent)'
              : line.col === 'accent'
                ? 'var(--color-accent)'
                : 'var(--color-text-1)';
        return (
          <g key={line.ln}>
            <text
              x="7"
              y={y}
              fontSize="1.4"
              fontFamily="var(--font-mono)"
              fill="var(--color-text-3)"
            >
              {line.ln.toString().padStart(2, ' ')}
            </text>
            <text x="11" y={y} fontSize="1.6" fontFamily="var(--font-mono)" fill={fillColor}>
              {line.txt}
            </text>
          </g>
        );
      })}

      {/* Output sidebar — speedup callout */}
      <g>
        <rect
          x="65"
          y="13"
          width="30"
          height="38"
          rx="1"
          fill="var(--color-surface-elevated)"
          stroke="var(--color-accent)"
          strokeWidth="0.3"
        />
        <text
          x="80"
          y="17"
          textAnchor="middle"
          fontSize="1.6"
          fontFamily="var(--font-mono)"
          fontWeight="600"
          fill="var(--color-accent)"
          letterSpacing="0.2"
        >
          MEMO vs NAIVE
        </text>

        <text x="67" y="22" fontSize="1.3" fontFamily="var(--font-mono)" fill="var(--color-text-3)">
          fib(50)
        </text>
        <text x="67" y="25" fontSize="1.4" fontFamily="var(--font-mono)" fill="var(--color-text-1)">
          naive: 2^50 calls
        </text>
        <text x="67" y="29" fontSize="1.4" fontFamily="var(--font-mono)" fill="var(--color-accent)">
          memo: 99 calls
        </text>

        <line
          x1="67"
          y1="32"
          x2="93"
          y2="32"
          stroke="var(--color-hairline-strong)"
          strokeWidth="0.2"
        />

        <text x="67" y="36" fontSize="1.3" fontFamily="var(--font-mono)" fill="var(--color-text-3)">
          speedup:
        </text>
        <text
          x="80"
          y="44"
          textAnchor="middle"
          fontSize="6"
          fontFamily="var(--font-mono)"
          fontWeight="700"
          fill="var(--color-accent)"
        >
          11M×
        </text>
        <text
          x="80"
          y="48"
          textAnchor="middle"
          fontSize="1.2"
          fontFamily="var(--font-mono)"
          fill="var(--color-text-3)"
        >
          O(2ⁿ) → O(n)
        </text>
      </g>

      {/* Footer */}
      <text
        x="50"
        y="57"
        textAnchor="middle"
        fontSize="1.5"
        fontFamily="var(--font-mono)"
        fill="var(--color-text-3)"
        letterSpacing="0.2"
      >
        ESTRUTURA DE DADOS I · 17 ARQUIVOS .C · HANOI + FIB + PARENS
      </text>
    </svg>
  );
}

// =================================================================
// ESTÉTICA MD — clinic silhouette + amber accent + vanilla stack
// =================================================================

export function EsteticaDiagram({ className, label }: DiagramProps) {
  return (
    <svg
      viewBox="0 0 100 60"
      preserveAspectRatio="xMidYMid meet"
      className={cn('h-full w-full', className)}
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      {label ? <title>{label}</title> : null}

      <defs>
        <radialGradient id="md-glow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="oklch(82% 0.18 75)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="oklch(82% 0.18 75)" stopOpacity="0" />
        </radialGradient>
        <pattern id="md-grid" width="5" height="5" patternUnits="userSpaceOnUse">
          <path
            d="M 5 0 L 0 0 0 5"
            fill="none"
            stroke="oklch(82% 0.18 75)"
            strokeWidth="0.12"
            opacity="0.3"
          />
        </pattern>
      </defs>

      <rect width="100" height="60" fill="url(#md-grid)" />
      <rect width="100" height="60" fill="url(#md-glow)" />

      {/* Browser chrome stylized — site institucional */}
      <g>
        <rect
          x="18"
          y="9"
          width="64"
          height="38"
          rx="1.6"
          fill="var(--color-surface-elevated)"
          stroke="oklch(82% 0.18 75)"
          strokeWidth="0.5"
        />
        {/* Chrome bar */}
        <rect x="18" y="9" width="64" height="3.5" rx="1.6" fill="var(--color-surface-overlay)" />
        <circle cx="20.5" cy="10.75" r="0.5" fill="oklch(65% 0.20 10)" />
        <circle cx="22.2" cy="10.75" r="0.5" fill="oklch(80% 0.18 100)" />
        <circle cx="23.9" cy="10.75" r="0.5" fill="oklch(75% 0.15 142)" />
        <text
          x="26"
          y="11.2"
          fontSize="1.3"
          fontFamily="var(--font-mono)"
          fill="var(--color-text-3)"
        >
          esteticamd.com.br
        </text>

        {/* Hero typography "ESTÉTICA MD" */}
        <text
          x="50"
          y="22"
          textAnchor="middle"
          fontSize="6.5"
          fontFamily="serif"
          fontStyle="italic"
          fontWeight="400"
          fill="oklch(82% 0.18 75)"
          letterSpacing="-0.05"
        >
          Estética
        </text>
        <text
          x="50"
          y="31"
          textAnchor="middle"
          fontSize="6.5"
          fontFamily="serif"
          fontStyle="italic"
          fontWeight="400"
          fill="oklch(82% 0.18 75)"
          letterSpacing="-0.05"
        >
          MD
        </text>

        {/* Underline */}
        <line x1="35" y1="34" x2="65" y2="34" stroke="oklch(82% 0.18 75)" strokeWidth="0.4" />

        {/* Sub stack chips */}
        {['Vanilla JS', 'PHP', 'ScrollReveal', 'Typed.js', 'OwlCarousel'].map((tech, i) => (
          <g key={tech}>
            <rect
              x={22 + i * 12}
              y="38"
              width="10.5"
              height="3.5"
              rx="0.4"
              fill="var(--color-surface-overlay)"
              stroke="oklch(82% 0.18 75 / 0.4)"
              strokeWidth="0.2"
            />
            <text
              x={27.25 + i * 12}
              y="40.5"
              textAnchor="middle"
              fontSize="1.4"
              fontFamily="var(--font-mono)"
              fill="oklch(82% 0.18 75)"
            >
              {tech}
            </text>
          </g>
        ))}

        {/* CTA bar */}
        <rect x="30" y="43" width="40" height="3" rx="1.5" fill="oklch(82% 0.18 75)" />
        <text
          x="50"
          y="45.3"
          textAnchor="middle"
          fontSize="1.5"
          fontFamily="var(--font-mono)"
          fontWeight="600"
          fill="var(--color-base)"
        >
          Agendar consulta
        </text>
      </g>

      {/* WhatsApp deeplink badge — bottom */}
      <g>
        <rect
          x="32"
          y="50"
          width="36"
          height="4"
          rx="2"
          fill="var(--color-surface-overlay)"
          stroke="oklch(82% 0.18 75)"
          strokeWidth="0.3"
        />
        <text
          x="50"
          y="53"
          textAnchor="middle"
          fontSize="1.6"
          fontFamily="var(--font-mono)"
          fontWeight="600"
          fill="oklch(82% 0.18 75)"
        >
          ↳ WhatsApp (42) 99859-2522
        </text>
      </g>

      {/* Footer */}
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontSize="1.5"
        fontFamily="var(--font-mono)"
        fill="var(--color-text-3)"
        letterSpacing="0.2"
      >
        SITE INSTITUCIONAL · EM PRODUÇÃO DESDE DEZ/2024
      </text>
    </svg>
  );
}
