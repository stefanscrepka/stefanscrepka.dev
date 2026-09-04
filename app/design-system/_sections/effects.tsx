import { ArtifactFrame } from '@/components/work/artifact-frame';
import { CodeArtifact, RegistryList } from '@/components/work/code-artifact';

// F6 (2026-09-04): o ProductMockup (tilt + halo lime + reflexo) saiu do
// sistema. A moldura de mídia agora é o ArtifactFrame; código e registros
// crus são CodeArtifact / RegistryList. Esta seção documenta os três.

export function EffectsSection() {
  return (
    <section id="effects" className="flex flex-col gap-12">
      <header className="flex flex-col gap-2 hairline-bottom pb-6">
        <p className="eyebrow">04 · Effects</p>
        <h2 className="text-3xl font-semibold !tracking-[-0.025em] !leading-[1.05]">
          ArtifactFrame + CodeArtifact + GrainOverlay
        </h2>
        <p className="max-w-prose text-(--color-text-2) leading-relaxed text-sm">
          <code className="font-mono">{'<ArtifactFrame />'}</code> enquadra uma captura real como
          registro: marcas de corte, hairline e uma barra mono com a procedência (rota · ambiente ·
          data). Sem tilt, sem halo, sem chrome de navegador.{' '}
          <code className="font-mono">{'<CodeArtifact />'}</code> e{' '}
          <code className="font-mono">{'<RegistryList />'}</code> fazem o mesmo com código-fonte e
          tabelas de registro. <code className="font-mono">{'<GrainOverlay />'}</code> segue global
          · fixed inset-0 mix-blend-overlay opacity 4%, drift 60s loop.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-3)">
          ArtifactFrame · barra × aspect
        </p>
        <div className="grid gap-8 lg:grid-cols-3">
          <ArtifactFrame
            aspect="16/10"
            label="studio · /agentes"
            meta="local · set/2026"
            caption="label + meta + caption · 16/10"
          >
            <MockScreen label="content-engine-agentes.avif" />
          </ArtifactFrame>
          <ArtifactFrame aspect="16/9" label="stark · /telao" meta="1920×1080 · TV" caption="16/9">
            <MockScreen label="stark-telao.avif" />
          </ArtifactFrame>
          <ArtifactFrame aspect="4/3" caption="sem barra · 4/3">
            <MockScreen label="sk3d-patches.avif" />
          </ArtifactFrame>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-3)">
            CodeArtifact · linhas numeradas, destaque em text-1
          </p>
          <CodeArtifact
            source="lib/work/content-engine-artifacts.ts"
            startLine={1}
            highlight={[2]}
            meta="typescript"
            lines={[
              '// Nada aqui foi escrito pra este site:',
              '// cada bloco é cópia literal de um arquivo do produto.',
              'export const CE_TELEGRAM_COMMANDS = [',
              "  { cmd: '/start', file: 'start.ts' },",
              '];',
            ]}
          />
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-3)">
            RegistryList · id · nome · detalhe, uma linha acesa
          </p>
          <RegistryList
            lit="E-0"
            source="apps/web/src/lib/agent-roles.ts"
            rows={[
              { id: 'E-0', name: 'Editor-Chefe', detail: 'arbitra e decide o pacote do dia' },
              { id: 'I-1', name: 'Pulso de Mercado', detail: 'lê o que está acontecendo no nicho' },
              {
                id: 'R-15',
                name: 'Auditor Anti-Slop',
                detail: 'reprova o que parece feito por IA',
              },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-(--color-hairline) p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-3)">
          GrainOverlay · ativo globalmente (camada 8, fixed inset-0)
        </p>
        <p className="text-sm text-(--color-text-2) leading-relaxed max-w-prose">
          Look pra cima/baixo da página · o grão SVG feTurbulence está em todo lugar com{' '}
          <code className="font-mono">mix-blend-overlay opacity 0.04</code>. Drift{' '}
          <code className="font-mono">--motion-drift (60s)</code> linear infinite. Reduced-motion
          baseline override globalmente mata o drift via{' '}
          <code className="font-mono">@media (prefers-reduced-motion: reduce)</code>.
        </p>
      </div>
    </section>
  );
}

function MockScreen({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col gap-3 bg-(--color-surface-elevated) p-5 text-(--color-text-3)">
      <span className="font-mono text-[10px] uppercase tracking-wider">{label}</span>
      <div className="grid flex-1 grid-cols-3 gap-2">
        <div className="rounded-sm bg-(--color-surface-overlay)" />
        <div className="col-span-2 rounded-sm bg-(--color-surface-overlay)" />
        <div className="col-span-2 rounded-sm bg-(--color-surface-overlay)" />
        <div className="rounded-sm bg-(--color-surface-overlay)" />
      </div>
      <span className="font-mono text-[10px]">placeholder · no site a captura é real</span>
    </div>
  );
}
