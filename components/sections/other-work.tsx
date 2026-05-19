import Link from 'next/link';
import { ProductCover, type ProductDiagramKey } from '@/components/work/product-cover';
import { OtherWorkReveal } from './other-work.client';

// Section 7 — Other Work (~80vh). Estética MD FlipCard amber + 2 mini-cards.
// Microcopy: 05§Seção 7. CTAs travados HANDOFF §77 (WhatsApp deeplink pré-preenchido).
// AMBER usado APENAS dentro deste card destaque (escopo isolado).

const WHATSAPP_DEEPLINK_ESTETICA =
  'https://wa.me/5542998592522?text=Ol%C3%A1%20Stefan%2C%20vi%20o%20site%20da%20Cl%C3%ADnica%20MD%20e%20quero%20algo%20assim%20pra%20minha%20cl%C3%ADnica.';

export function OtherWorkSection() {
  return (
    <section
      id="other-work"
      className="container-max section-pad-y border-t border-(--color-hairline)"
    >
      <header className="mb-10 flex flex-col gap-3 sm:mb-14">
        <p className="eyebrow">OUTROS TRABALHOS</p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Breadth · sites institucionais a algoritmos C
        </h2>
        <p className="max-w-prose text-(--color-text-2) leading-relaxed">
          Primeiro produto em produção (Estética MD), CLI universitária (Caronas Java), fundamento C
          (Estrutura de Dados) — três projetos que mostram amplitude além dos SaaS atuais.
        </p>
      </header>

      <OtherWorkReveal>
        {/* Layout asimétrico: Estética MD card grande à esquerda (2/3) +
            coluna direita com Caronas (top) e Estrutura C (bottom). */}
        <div className="grid gap-5 sm:gap-6 lg:grid-cols-[2fr_1fr]">
          {/* Featured: Estética MD FlipCard amber — 2/3 largura, altura total */}
          <EsteticaCard />

          {/* Coluna direita stacked: Caronas (top) + Estrutura C (bottom) */}
          <div className="grid grid-cols-1 gap-5 sm:gap-6">
            <MiniCard
              label="Caronas Java CLI"
              diagram="caronas"
              line="Records + java.time + java.util.concurrent · Repository Pattern do zero · academic but real."
              href="https://github.com/stefanscrepka/sistema-caronas"
            />

            <MiniCard
              label="Estrutura de Dados (C)"
              diagram="estrutura-c"
              line="17 arquivos .c · Hanoi recursivo · Fibonacci memoizado · parênteses balanceamento. Veja Hanoi rodando no Playground."
              href="https://github.com/stefanscrepka/estrutura-de-dados"
              secondaryHref="/playground"
              secondaryLabel="Playground →"
            />
          </div>
        </div>
      </OtherWorkReveal>
    </section>
  );
}

function EsteticaCard() {
  return (
    <div data-other-card="estetica-md">
      <EsteticaFlipCardClient deeplink={WHATSAPP_DEEPLINK_ESTETICA} />
    </div>
  );
}

import { EsteticaFlipCardClient } from './other-work.client';

interface MiniCardProps {
  label: string;
  diagram: ProductDiagramKey;
  line: string;
  href: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

function MiniCard({ label, diagram, line, href, secondaryHref, secondaryLabel }: MiniCardProps) {
  return (
    <div
      data-other-card="mini"
      className="group/mini flex h-full flex-col gap-4 rounded-2xl border border-(--color-hairline) bg-(--color-surface) p-5 transition-[border-color,transform,box-shadow] duration-(--motion-fast) hover:-translate-y-1 hover:border-(--color-accent) hover:shadow-(--shadow-glow-lime-sm)"
    >
      <ProductCover
        mode="diagram"
        diagram={diagram}
        label={label}
        aspectRatio="16/10"
        tone="lime"
      />
      <div className="flex flex-1 flex-col gap-3">
        <p className="text-sm font-semibold text-(--color-text-1)">{label}</p>
        <p className="flex-1 text-xs leading-relaxed text-(--color-text-2)">{line}</p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href={href}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-(--color-accent) underline-offset-4 outline-none transition-colors hover:underline focus-visible:underline"
          >
            GitHub →
          </Link>
          {secondaryHref ? (
            <Link
              href={secondaryHref}
              className="font-mono text-xs text-(--color-text-3) outline-none transition-colors hover:text-(--color-accent) focus-visible:text-(--color-accent)"
            >
              {secondaryLabel ?? secondaryHref}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
