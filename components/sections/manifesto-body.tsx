import { EditorialAccent } from '@/components/hero/editorial-accent';
import { cn } from '@/lib/utils';

// Conteudo do manifesto extraido em componente reutilizavel.
// Usado em 2 lugares:
//   1. <ManifestoSection> — render full size com word-stagger GSAP
//      (enableWordStagger=true) marca cada palavra com data-word.
//   2. <ManifestoSignatureReveal> — replica visual que encolhe pra retangulo
//      no Lando reveal (enableWordStagger=false, aria-hidden no wrapper outer
//      pra screen reader nao ler 2x).

export const MANIFESTO_PULL_QUOTE =
  'Software sério tem o mesmo padrão de qualquer sistema crítico: ou funciona 24/7 ou alguém perde dinheiro.';

export const MANIFESTO_BODY_PARAGRAPHS = [
  'Eu construo nesse padrão. TypeScript strict. Contratos de teste. Observabilidade real. Prompts que não inventam. Multi-agente Claude orquestrado em squads. Três produtos em produção provam: Content Engine, Caluna, Estética MD.',
  'Não vendo “ajudo empresas a inovar”. Vendo entrega que paga conta. Aprovação humana em três botões por dia. Anti-slop com 28 regex pt-BR. GPU local subsidiando o custo de inferência.',
];

export const MANIFESTO_SIGNATURE =
  'Construo IA multi-agente em produção, e o produto inteiro ao redor dela.';

// W-design #3: leitmotif tipográfico — PP Editorial italic em "multi-agente"
// no manifesto signature (eco do hero). 3 batidas pelo site: Hero, Manifesto,
// Contact (+ "landing genérica" no Contact h2). Cria assinatura tipográfica.
function ManifestoSignatureRich() {
  return (
    <>
      Construo IA <EditorialAccent>multi-agente</EditorialAccent> em produção, e o produto inteiro
      ao redor dela.
    </>
  );
}

interface ManifestoBodyProps {
  enableWordStagger?: boolean;
  /** Quando true, omite o ATO 5 mono row. */
  omitMonoRow?: boolean;
  /** Quando true, omite ATO 4 (signature emocional) + ATO 5 (mono row) —
   * usados quando esses atos viram o conteúdo do retângulo do reveal. */
  omitFinal?: boolean;
}

export function ManifestoBody({
  enableWordStagger = false,
  omitMonoRow = false,
  omitFinal = false,
}: ManifestoBodyProps) {
  const paragraphs = MANIFESTO_BODY_PARAGRAPHS.map((para) => ({
    text: para,
    words: para.split(/(\s+)/),
  }));

  return (
    <div className="flex flex-col gap-12 sm:gap-14">
      {/* ATO 1 — Pull-quote.
          W-a11y crítico #3: blockquote agora tem cite="" pointing to anchor +
          <footer><cite> com autor (Stefan Heinz Screpka). Sem isso, screen
          readers anunciam "quote" sem source. */}
      <blockquote
        cite="https://stefanscrepka.dev/#manifesto"
        className="border-l-2 border-(--color-accent) py-2 pl-6 sm:pl-8"
      >
        <p
          className={cn(
            'font-semibold leading-[1.05] tracking-[-0.025em]',
            'text-[1.875rem] sm:text-[2.25rem] lg:text-[2.625rem]',
            'text-(--color-text-1)'
          )}
        >
          “{MANIFESTO_PULL_QUOTE}”
        </p>
        <footer className="sr-only">
          <cite>Stefan Heinz Screpka, Manifesto</cite>
        </footer>
      </blockquote>

      {/* ATO 2 — Quebra de seção.
          F4 (2026-08-29): eram QUATRO hairlines empilhadas (60/80/100/70px,
          opacidade decrescente). A intenção era ornamento; a leitura era
          skeleton de carregamento — quatro linhas curtas, desalinhadas à
          direita, com 6px de respiro, é literalmente o desenho de um
          placeholder de texto. Num site cuja tese é precisão, um ornamento
          que se lê como estado inacabado custa mais do que entrega.
          Agora: UMA régua que esvanece. Um skeleton nunca esvanece, então a
          leitura fica inequívoca — e o vocabulário (hairline + lime a meia
          força) é o mesmo dos eyebrows da timeline. */}
      <div
        aria-hidden="true"
        className="my-2 h-px w-24"
        style={{
          background:
            'linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) 45%, transparent 100%)',
          opacity: 0.5,
        }}
      />

      {/* ATO 3 — Paragraphs */}
      <div
        className={cn(
          'flex flex-col gap-7 text-(--color-text-1)',
          'text-reading [&_p]:leading-[1.6]'
        )}
      >
        {paragraphs.map((para) => {
          const paraId = para.text.slice(0, 24);
          return (
            <p key={`p-${paraId}-${para.words.length}`}>
              {para.words.map((word, wIdx) => {
                const key = `w-${paraId}-${wIdx}-${word.length}`;
                if (word.trim() === '') {
                  return <span key={key}>{word}</span>;
                }
                if (enableWordStagger) {
                  return (
                    <span key={key} data-word className="inline-block">
                      {word}
                    </span>
                  );
                }
                return <span key={key}>{word}</span>;
              })}
            </p>
          );
        })}
      </div>

      {/* ATO 4 — Signature emocional. */}
      {!omitFinal && (
        <p
          className={cn(
            'font-semibold leading-[1.1] tracking-[-0.025em]',
            'text-[1.75rem] sm:text-[2rem] lg:text-[2.25rem]',
            'text-(--color-accent)'
          )}
        >
          <ManifestoSignatureRich />
        </p>
      )}

      {/* ATO 5 — Mono signature row. */}
      {!omitMonoRow && !omitFinal && <ManifestoMonoRow />}
    </div>
  );
}

// ATO 4 (signature emocional) + ATO 5 (mono row) — final do manifesto,
// renderizado dentro do frame retangulo do reveal Lando-style. Stefan: "VIRA
// RETANGULO" apontando pra essa parte do manifesto.
export function ManifestoFinal({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <p
        className={cn(
          'font-semibold leading-[1.15] tracking-[-0.02em]',
          'text-[1.5rem] sm:text-[1.75rem]',
          'text-(--color-accent)'
        )}
      >
        <ManifestoSignatureRich />
      </p>
      <ManifestoMonoRow />
    </div>
  );
}

// ATO 5 isolado pra ser renderizado dentro do frame retangulo do reveal.
export function ManifestoMonoRow({ className }: { className?: string }) {
  return (
    <div className={cn('mt-2 flex flex-col gap-3', className)}>
      <span
        aria-hidden="true"
        className="block h-px w-12 bg-(--color-accent)"
        style={{ opacity: 0.6 }}
      />
      <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3) leading-relaxed">
        Stefan Heinz Screpka{' '}
        <span aria-hidden="true" className="mx-1 text-(--color-hairline-strong)">
          ·
        </span>
        Ponta Grossa, Paraná{' '}
        <span aria-hidden="true" className="mx-1 text-(--color-hairline-strong)">
          ·
        </span>
        <span className="text-(--color-accent)">disponível</span>
      </p>
    </div>
  );
}
