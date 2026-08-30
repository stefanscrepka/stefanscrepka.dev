# PROMPT — Destilar um `CLAUDE.md` reutilizável a partir do stefanscrepka.dev

> **Como usar:** abra uma sessão do Claude Code **na raiz deste repositório** (`stefanscrepka-dev`)
> e cole tudo abaixo da linha `═══`. O resultado é um `CLAUDE.md` portátil que faz qualquer
> projeto web novo nascer com o mesmo padrão "honest, precise, production-grade" deste.
> Caminhos absolutos abaixo são da máquina onde este projeto vive — ajuste se mudar de máquina.

═══════════════════════════════════════════════════════════════════════════════

## PAPEL

Você é um **arquiteto front-end / engenheiro de plataforma sênior**. Sua missão tem duas etapas
inseparáveis:

1. **Auditar** o projeto `stefanscrepka.dev` de forma **profunda e totalmente técnica** — não só
   *o quê* foi feito, mas *por quê* (a fundamentação de cada decisão).
2. **Destilar** essa análise em um único arquivo **`CLAUDE.md` REUTILIZÁVEL** — um manual de
   padrões que carregue o mesmo nível de qualidade para **outros projetos**, do zero.

Trabalhe com profundidade máxima. Quando fizer sentido, paralelize a leitura com agentes `Explore`
(um por subsistema: design system, motion, RSC/hidratação, performance, SEO/a11y, tooling) e
sintetize. Verifique tudo no código atual antes de afirmar — este projeto exige **claim↔evidência**.

---

## DISTINÇÃO CRÍTICA (não erre nisto)

Você está extraindo **padrões, princípios e anti-padrões TRANSFERÍVEIS** — *não* o conteúdo
específico do Stefan.

- ✅ **Entra no CLAUDE.md:** "ilhas RSC com children", "tokens em OKLCH via `@theme`", "scroll-jack
  por sticky CSS, nunca `pin: true`", "medir antes/depois com probe re-rodável".
- ❌ **NÃO entra (ou vira `<placeholder>`):** os case studies, a copy PT-BR, a marca SH, a paleta
  lime `#D2FF00`, o domínio, os e-mails, os números do portfólio.

Quando um detalhe for específico do projeto, **generalize-o** ("escolha 1 cor de acento e derive as
variações em OKLCH") ou marque como `<placeholder: …>`. O leitor final do CLAUDE.md é um agente
trabalhando num repositório **diferente e vazio**.

---

## POR QUE ESTE PROJETO É UMA BOA REFERÊNCIA (leia para calibrar o padrão)

O site se vende como "honesto, preciso, production-grade", e a engenharia honra isso: cada
afirmação visual tem evidência, cada fix é real (não cosmético), cada regressão de performance é
medida com um probe re-rodável antes/depois. É **audit-driven**: `ROADMAP.md` e
`LAUNCH-CHECKLIST.md` são as fontes da verdade dos achados; `_audit/` guarda ~24 sondas Playwright
re-executáveis. Esse *rigor de processo* é parte do padrão a transferir — não só o código.

---

## FONTES OBRIGATÓRIAS (analise nesta ordem)

### 1. A MEMÓRIA — o "porquê" das decisões (LEIA PRIMEIRO)

Estas são observações ponto-no-tempo das decisões já tomadas e da dor que as motivou. São o
material mais valioso: contêm o *raciocínio*, não só o resultado. **Trate como racional de decisão,
mas confirme contra o código atual** (podem estar desatualizadas).

Diretório: `C:\Users\Stefan1\.claude\projects\C--Users-Stefan1-Downloads-stefanscrepka-dev\memory\`

- `MEMORY.md` — índice
- `feedback_lando_sticky_pattern.md` — **scroll-jack Lando-style**: `outer h-[200vh]` + `inner
  sticky top-0 h-screen`, GSAP só pra `scrub` — **nunca `pin: true`** (causou bugs estruturais)
- `project_rsc_islands_pattern.md` — **dieta de hidratação**: ilha Motion fina recebe conteúdo
  server-rendered como `children`; hover/decoração viram CSS
- `project_loading_tsx_cls.md` — `loading.tsx` em rota **estática** dispara streaming reveal `$RC`
  → CLS 0.534. Não adicionar sem trabalho async real
- `project_fase3_sig_trimpath.md` — gotchas de SVG/GSAP: CSSPlugin **não interpola**
  `stroke-dashoffset` (use `attr`); `mask` + `transform` no mesmo nó quebra coordenadas
- `project_audit_roadmap.md` — a auditoria sensorial virou implementação; `--color-base`→`--color-bg`
  (colisão com `text-base` do Tailwind v4); Tailwind v4 = utilities vencem `@layer base`
- `feedback_prefers_real_fixes.md` — **fix real > cosmético** (removeu watermark via ffmpeg, não
  máscara CSS); claim↔evidência é inegociável
- `user_brand_glyph_not_marca.md` — exemplo de "decoração ≠ marca" (lição de identidade, não regra
  de código — generalize, não copie o glyph)
- `project_caluna_figma_mcp.md` — fluxo de marca via Figma MCP (contexto, provavelmente fora do
  escopo do CLAUDE.md genérico)

Extraia de cada uma: **a regra, o porquê, e o anti-padrão que ela previne.**

### 2. GOVERNANÇA E PROCESSO

- `AGENTS.md` (raiz) — a regra-mãe: *"This is NOT the Next.js you know… read the relevant guide in
  `node_modules/next/dist/docs/` before writing any code."*
- `ROADMAP.md` (raiz) e `LAUNCH-CHECKLIST.md` (raiz) — como achados são rastreados/priorizados
  (P0/P1, blockers, fases)
- `_audit/*.mjs` — o estilo das sondas re-rodáveis (`s1`–`s13` + `f3-*`): LCP, CLS, hidratação,
  soft-nav, focus-ring. Note o padrão "medir contra build de produção na `:3001`".
- `docs/AUDITORIA.md`, `docs/ROADMAP-10.md`, `docs/brand-book.md`, `docs/dossie-de-marca.md` — a
  fundamentação de design e a metodologia de auditoria.

### 3. O CÓDIGO (stack + padrões — confirme versões e convenções)

- **Stack/tooling:** `package.json` — Next 16.2.6, React 19.2.4, Tailwind v4, Motion v12, GSAP 3 +
  `@gsap/react`, Lenis, Three + R3F + drei, Zod 4, RHF, Radix, CVA, Resend, BotID, Sentry, Vercel
  Analytics/Speed Insights. Tooling: **Biome** (lint+format), ESLint só `react-hooks`, **TS strict**
  (`exactOptionalPropertyTypes`, `noUnusedLocals`), Vitest, Playwright, LHCI, bundle-analyzer.
  Gerenciador: **pnpm**; Node ≥22.
- **Design system:** `app/globals.css` — tokens `@theme` em **OKLCH**, escala tipográfica **fluida
  via `clamp()`**, `@utility` custom (`headline-display`, `eyebrow`, `glass-panel`, `section-pad-y`…),
  sombras em camadas, breakpoints. `lib/animation/eases.ts` — **SSoT** dos cubic-bezier, espelhado
  1:1 no CSS.
- **Arquitetura de componentes:** o split `*.tsx` (Server) vs `*.client.tsx` (Client). Estude um par
  completo, ex.: `components/sections/featured-work.tsx` + `featured-work.client.tsx`
  (ilha `useInView` + stagger envolvendo tiles server-rendered). Veja também `bento-skills*` e
  `timeline*` (hover via CSS puro).
- **Motion/scroll:** `lib/animation/gsap-lenis-sync.ts` (Lenis no ticker do GSAP, `lagSmoothing(0)`,
  `ScrollTrigger.update`); `components/providers/` (`motion-provider` com `LazyMotion`+`domAnimation`
  `strict` + `MotionConfig reducedMotion="user"`; `lenis-provider` com **import dinâmico** de
  GSAP/Lenis atrás de `!reduced && !touch`). Hooks: `use-reduced-motion-safe`, `use-is-touch`,
  `use-paused-offscreen`.
- **Forms/server:** `components/sections/contact-form.client.tsx` (RHF + `zodResolver` +
  `useActionState`) + `lib/server-actions/contact.ts` (BotID + honeypot + **re-validação Zod no
  servidor** + Resend) + `lib/validation/contact-schema.ts` (schema **compartilhado** client/server).
- **SEO/metadata:** `app/layout.tsx` (Metadata API, JSON-LD `Person`/`WebSite` cruzados por `@id`,
  script pré-hidratação anti-FOUC), `app/robots.ts`, `app/sitemap.ts` (`lastModified` **manual**, não
  `new Date()`), `lib/work/json-ld.ts`.
- **Config:** `next.config.ts` (Sentry com `deleteSourcemapsAfterUpload`, BotID, MDX,
  `optimizePackageImports`, `experimental.viewTransition`, formats AVIF/WebP), `biome.json`,
  `tsconfig.json`.

### 4. landonorris.com — NORTH-STAR DE MOTION CRAFT (referência externa)

O padrão de scroll deste projeto **nasceu** de uma análise profunda do `landonorris.com` (a memória
registra: 286 screenshots + leitura do JS bundle revelaram sections `position: absolute` empilhadas
num wrapper alto → replicado com `position: sticky` no React). Portanto o Lando é literalmente a
fonte do padrão.

**Faça:** abra o site (browser/Playwright se disponível, senão WebFetch + análise do que conseguir),
observe o scroll e destile **5–8 princípios de motion premium transferíveis** — ex.: scroll
coreografado (cada seção "performa" sua entrada), reveals por sticky-stacking **sem teletransporte/gap**,
ritmo (calma ↔ impacto), tipografia editorial em escala dramática, smooth-scroll, coesão de motion
(mesmos eases/durations em tudo). Para cada princípio, indique **como replicá-lo** com a stack deste
projeto (Lenis + GSAP scrub + sticky CSS + tokens de ease). Deixe claro o que é "north-star
aspiracional" vs "já implementado aqui".

### 5. DOCS DO NEXT.JS BUNDLED

Antes de escrever qualquer regra sobre Next, confirme no `node_modules/next/dist/docs/` — é Next 16,
com mudanças que divergem do conhecimento de treino (App Router, RSC, Server Actions, View
Transitions, Metadata API). A própria regra "leia os docs bundled antes de codar" deve constar no
CLAUDE.md final.

---

## EIXOS DE ANÁLISE (disseque cada um: o quê + por quê + como replicar)

1. **Filosofia / fundamentações** — claim↔evidência, fix real > cosmético, server-first, audit-driven,
   acessível por padrão. (As âncoras de tudo.)
2. **Stack & versões** — o conjunto e *por que* cada peça (ex.: Biome no lugar de ESLint+Prettier;
   Motion `LazyMotion` pra cortar bundle; Lenis+GSAP sincronizados).
3. **Design system** — OKLCH (uniformidade perceptual → contraste previsível), tipografia fluida sem
   media queries, tokens como SSoT em `@theme`, eases espelhados em TS, escala de espaçamento/sombra.
4. **Arquitetura de componentes** — RSC por padrão; **ilha client fina** recebendo server content como
   `children`; dieta de hidratação (medida: −8% em long tasks); hover/decoração como CSS.
5. **Motion & scroll** — sticky-jack (não `pin`); Lenis↔GSAP ticker; `reducedMotion="user"`; import
   dinâmico atrás de `!reduced && !touch`; `matchMedia` desktop/mobile; pausar animação off-screen.
6. **Performance** — `optimizePackageImports`, AVIF/WebP, preload escopado, headline por CSS (sem
   SplitText), **gotcha do `loading.tsx`/CLS**, View Transitions p/ soft-nav sem `loading.tsx`,
   orçamento de first-load JS, suíte de medição re-rodável.
7. **Acessibilidade** — focus-visible global (e a pegadinha do Tailwind v4: utilities vencem
   `@layer base`), skip link, reduced-motion em CSS **e** JS, contraste WCAG AA via OKLCH, semântica,
   Radix + títulos de diálogo.
8. **SEO** — Metadata API, JSON-LD cruzado por `@id`, sitemap com datas manuais, robots, OG.
9. **Segurança/produção** — Zod em camadas, BotID + honeypot, CSP/headers, Sentry sem vazar
   sourcemaps, segredos por env.
10. **Tooling & guardrails** — Biome, TS strict, scripts (`typecheck`, `lint`, `test`, `lhci`,
    `analyze`), convenção `*.client.tsx`, "leia os docs do Next bundled".

---

## ANTI-PADRÕES JÁ APRENDIDOS (capture-os com o porquê — são ouro)

O CLAUDE.md deve listar explicitamente o que **não** fazer, porque cada item custou debug real:

- ❌ `GSAP pin: true` para scroll-jack → transform residual, anchor bloqueado, exit brusco.
  ✅ `outer h-[200vh]` + `inner sticky top-0 h-screen`, GSAP só `scrub`.
- ❌ `loading.tsx` em rota **estática** → Suspense/`$RC` derruba o layout → CLS alto.
  ✅ só com trabalho async real; soft-nav usa View Transitions.
- ❌ Máscara/gradiente CSS para **esconder** um defeito (ex.: watermark) → tapa-buraco.
  ✅ fix real na fonte (ex.: ffmpeg `delogo`).
- ❌ Animar `stroke-dashoffset` pelo CSSPlugin do GSAP → snap binário (não interpola).
  ✅ `attr: { 'stroke-dashoffset': … }`.
- ❌ `mask` num `<g>` que também tem `transform` → coordenadas `userSpaceOnUse` quebram.
  ✅ máscara num wrapper **sem** transform.
- ❌ Nome de token colidindo com utility do Tailwind (`--color-base` ↔ `text-base`).
  ✅ nomes que não colidem (`--color-bg`).
- ❌ `outline-none` em componente assumindo que respeita `@layer base` no Tailwind v4 →
  utilities vencem a base e matam o anel de foco global. ✅ não sobrescrever foco; testar após ~450ms.
- ❌ Afirmar melhoria sem medir. ✅ probe re-rodável, antes/depois, build de prod.

---

## ESTRUTURA DO `CLAUDE.md` DE SAÍDA

Produza um documento enxuto e escaneável, em **PT-BR** (termos técnicos, APIs, comandos e código em
inglês), com regras **imperativas e acionáveis** — não prosa. Sugestão de seções:

1. **Princípios inegociáveis** — claim↔evidência, fix real > cosmético, server-first, medir sempre,
   acessível e performático por padrão. (5–8 bullets afiados.)
2. **Stack canônica** — a lista + 1 linha de *porquê* por escolha + "leia `node_modules/<framework>/…
   docs` antes de codar".
3. **Comandos do projeto** — `dev/build/typecheck/lint/test/e2e/lhci/analyze` (como placeholders se
   variarem por projeto).
4. **Design system** — regras de token (OKLCH, `@theme` SSoT, fluid `clamp()`, eases espelhados em TS),
   com `<placeholders>` para cores/escala.
5. **Arquitetura de componentes** — RSC por padrão; padrão da ilha fina + `children`; quando criar
   `*.client.tsx`; CSS-first para hover/decoração.
6. **Motion & scroll** — o playbook (sticky-jack, Lenis↔GSAP, import dinâmico gateado, reduced-motion)
   + os princípios destilados do Lando.
7. **Performance** — checklist + os gotchas medidos (loading.tsx/CLS, headline por CSS, preload
   escopado, View Transitions).
8. **Acessibilidade & SEO** — foco, reduced-motion, semântica, Metadata API, JSON-LD, sitemap manual.
9. **Segurança & forms** — Zod em camadas, BotID/honeypot, CSP, Sentry sem sourcemaps, env.
10. **Anti-padrões** — a lista do bloco acima, generalizada.
11. **Definition of Done / como validar** — typecheck+lint limpos, probe re-rodável antes/depois,
    Lighthouse por rota, claim↔evidência.

Inclua no topo um bloco curto **"Como adaptar este CLAUDE.md a um projeto novo"** (trocar
placeholders, escolher a cor de acento, rodar o codemod/`init` do framework, criar `eases.ts`).

---

## CRITÉRIOS DE QUALIDADE DO OUTPUT

- **Reutilizável de verdade:** zero referência ao conteúdo do Stefan; tudo em padrão ou placeholder.
- **Acionável:** cada bullet é uma regra que um agente consegue seguir/verificar — não teoria.
- **O porquê embutido** quando não óbvio (como as memórias fazem): regra → motivo → anti-padrão.
- **Conciso e escaneável:** prefira bullets e blocos de código curtos; corte enchimento. Mire em algo
  que caiba como contexto permanente (idealmente ≤ ~400 linhas).
- **Verificado:** toda regra ancorada em algo que você confirmou no código/docs, não em memória de
  treino. Marque suposições.

---

## PROCESSO SUGERIDO

1. Ler as 8 memórias → mapa do *porquê* das decisões.
2. Ler governança (`AGENTS.md`, `ROADMAP.md`, `LAUNCH-CHECKLIST.md`, `_audit/`, `docs/`).
3. Confirmar stack/versões no `package.json` e padrões no código (paralelize com `Explore` por eixo).
4. Estudar `landonorris.com` e destilar os princípios de motion.
5. Conferir as APIs do Next nos docs bundled.
6. Separar **universal** vs **específico**; converter específico em placeholder.
7. Escrever o `CLAUDE.md` na estrutura acima.
8. **Auto-revisão final** (abaixo) e então gravar o arquivo.

## AUTO-REVISÃO FINAL (não entregue sem passar)

- [ ] Removi todo conteúdo específico do Stefan? (cases, marca, cores fixas, copy, domínio)
- [ ] Cada regra tem o *porquê* quando não é óbvio?
- [ ] Os anti-padrões medidos estão lá, generalizados?
- [ ] Os princípios do Lando estão conectados a "como replicar" com esta stack?
- [ ] Está enxuto, imperativo e escaneável (sem prosa, ≤ ~400 linhas)?
- [ ] Toda afirmação técnica foi verificada no código/docs, não na memória de treino?

**Entregue:** grave o resultado como `CLAUDE.md` (ou no caminho que o usuário pedir) e, junto, um
parágrafo curto explicando as principais escolhas de destilação e o que virou placeholder.
