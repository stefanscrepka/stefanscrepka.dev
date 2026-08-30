# CLAUDE.md — Padrão de Engenharia Front-end (reutilizável)

> Template destilado de um projeto de referência **production-grade** (Next.js 16 · React 19 ·
> Tailwind v4 · Motion 12 · GSAP/Lenis). Copie para a raiz de um projeto novo como `CLAUDE.md`.
> Regras marcadas com 🔧 são escolhas a parametrizar; `<placeholder: …>` = preencher por projeto.
> O objetivo deste arquivo: fazer o projeto **nascer com o mesmo nível de rigor** — não importar
> conteúdo de outro projeto.

## Como adaptar a um projeto novo

1. Escolha **1 cor de acento** e derive surfaces/text/borders em **OKLCH** (§4). Troque os
   `<placeholder>` de cor, fonte e domínio.
2. Confirme as versões reais no `package.json` e **leia os docs versionados do framework** antes de
   codar (§2). Não confie na memória de treino — APIs mudam entre majors.
3. Crie `lib/animation/eases.ts` como SSoT dos easings e espelhe nos tokens CSS (§4/§6).
4. Rode o `init`/codemod oficial do framework para o scaffold; só então aplique estes padrões.
5. Apague as seções que não se aplicam (ex.: sem 3D → corte R3F). Um CLAUDE.md honesto descreve o
   que existe, não aspirações.

---

## 1. Princípios inegociáveis

- **Claim↔evidência.** Toda afirmação — visual, de performance, de copy — tem prova. Mudou algo
  mensurável? **Meça antes/depois** com um probe re-rodável e guarde o número. Nada de "ficou mais
  rápido" sem trace.
- **Fix real > cosmético.** Corrija a causa-raiz. Nunca uma máscara CSS, stub ou gradiente para
  *esconder* um defeito — isso é tapa-buraco e será cobrado. Ofereça o fix real primeiro.
- **Server-first.** RSC por padrão; `'use client'` só onde há interação real. Mantenha as ilhas
  client finas (§5).
- **Performance e a11y são requisitos, não polish.** CLS 0, orçamento de JS, foco visível,
  `prefers-reduced-motion`, contraste AA — entram desde o primeiro commit, não no fim.
- **Tokens são a única fonte da verdade.** Zero valores mágicos: cor, tipo, espaçamento, ease, raio,
  sombra vêm de tokens. Um valor literal repetido é um bug de design system.
- **Documente o *porquê* no lugar onde dói.** Decisão não-óbvia ganha comentário curto explicando o
  motivo e o anti-padrão que evita (veja o estilo dos comentários neste codebase). Achados/pendências
  vivem num `ROADMAP.md` + `LAUNCH-CHECKLIST.md` rastreáveis.
- **Leia os docs do framework antes de codar.** "This is NOT the framework you know": consulte os
  guias versionados (ex.: `node_modules/<framework>/…/docs/`) — não a API que você lembra.

---

## 2. Stack canônica 🔧

Confirme versões no `package.json`. Defaults recomendados (ajuste ao projeto):

| Camada | Escolha | Porquê |
|---|---|---|
| Framework | Next.js (App Router, RSC) | Server Components + Server Actions + streaming nativos |
| UI | React 19 | `ref` as prop, `useActionState`, `<ViewTransition>` |
| Estilo | Tailwind **v4** (`@theme`) | tokens viram utilities automaticamente; zero config JS |
| Primitivos | Radix UI + **CVA** + `cn()` (clsx + tailwind-merge) | acessível por padrão, variantes type-safe |
| Motion (UI) | **Motion 12** (`LazyMotion`/`m`) | reveal/gesture com bundle mínimo |
| Scroll/scrub | **GSAP + Lenis** (carga condicional) | scroll coreografado; só desktop não-reduced (§6) |
| 3D (opcional) | Three + R3F + drei | só em rota dedicada, nunca no first-load |
| Validação | **Zod** (schema compartilhado) | mesma fonte client + server (§9) |
| Form | React Hook Form + `@hookform/resolvers/zod` | UX no client, Server Action no server |
| Email | Resend + React Email | template tipado |
| Anti-bot | Vercel BotID + honeypot | defesa em camadas (§9) |
| Obs. | Sentry + Vercel Analytics/Speed Insights | erros desminificados + Web Vitals reais |
| Lint/format | **Biome** (1 ferramenta) + ESLint só `react-hooks` | rápido; menos config que ESLint+Prettier |
| Tipos | TypeScript **strict** estendido | ver §10 |
| Testes | Vitest (unit) + Playwright (e2e/probes) + LHCI | medição re-rodável (§11) |
| Pacote | pnpm · Node ≥22 | lockfile determinístico |

> **Regra:** ao tocar uma API do framework, abra o guia versionado correspondente primeiro. Ex. real
> deste projeto: comentários de código apontam para `node_modules/next/dist/docs/01-app/02-guides/…`.

---

## 3. Comandos 🔧

```bash
pnpm dev          # dev server
pnpm build        # build de produção
pnpm typecheck    # tsc --noEmit  (deve passar limpo)
pnpm lint         # biome check .
pnpm lint:fix     # biome check --write .
pnpm test         # vitest
pnpm test:e2e     # playwright
pnpm lhci         # lighthouse CI (rodar contra build de prod)
pnpm analyze      # ANALYZE=true next build (bundle inspection)
```

Valide performance/CLS sempre contra **build de produção** (`pnpm build && pnpm start`), não em dev.
Use uma porta livre para o servidor de validação (ex.: `:3001`) se o dev server ocupar a `:3000`.

---

## 4. Design system

- **Cor em OKLCH**, sempre. Lightness perceptualmente uniforme → contraste previsível ao variar hue.
  Defina surfaces, 1 acento (+ hover/subtle/glow), text 1–3, hairlines (solid + alpha) e semânticos.
  ```css
  --color-bg: oklch(13% 0.005 130);
  --color-accent: <placeholder: oklch(94% 0.22 124)>;
  --color-text-3: oklch(63% 0.005 130); /* tom mais baixo que ainda passa AA 4.5:1 */
  ```
- **Tokens em `@theme` = SSoT.** Tailwind v4 gera as utilities a partir dos namespaces (`--color-*`,
  `--text-*`, `--ease-*`, `--radius-*`, `--shadow-*`, `--breakpoint-*`). Nada de config JS paralela.
- **Tipografia fluida via `clamp()`** — sem media query por tamanho. Inclua line-height/letter-spacing
  por step. Use ratio maior nos extremos (`text-5xl/6xl`) para drama editorial.
  ```css
  --text-3xl: clamp(2.75rem, 2.05rem + 3.4vw, 3.75rem);
  --text-3xl--line-height: 1.1; --text-3xl--letter-spacing: -0.02em;
  ```
- **Easings espelhados em TS.** `lib/animation/eases.ts` exporta tuples; os tokens `--ease-*` repetem
  os mesmos valores. CSS usa `ease-(--ease-x)`; Motion usa `EASES.x`; GSAP usa `toCss(EASES.x)`.
  Evita drift entre CSS e runtime.
- **Anule escalas default que causam drift.** Ao usar um nome que o Tailwind já provê (`amber`),
  zere a escala default (`--color-amber-50: initial; …`) para um `bg-amber-400` por engano não pegar
  o default v4 silenciosamente.
- **`@utility` para padrões repetidos** (`headline-display`, `eyebrow`, `glass-panel`,
  `section-pad-y`, `container-max`, `inset-bisel`). São variant-aware (`hover:`, `sm:`).
- **Fallback de fonte metric-adjusted.** Para fonte custom com `display: swap`, crie um `@font-face`
  sintético (`size-adjust` + `ascent/descent-override`) aproximando a fonte de sistema → corta CLS no
  swap. Carregue só os pesos realmente usados.

---

## 5. Arquitetura de componentes

- **RSC por padrão.** Convenção de nomes: `*.tsx` = Server; **`*.client.tsx`** = Client (`'use
  client'` no topo). O sufixo torna a fronteira de hidratação óbvia em review.
- **Ilha client fina + `children` server.** A seção pesada é RSC; a ilha client recebe o conteúdo
  já renderizado no server como `children` e só orquestra o reveal. O conteúdo não re-hidrata.
  ```tsx
  // featured-work.tsx (Server) — dados + layout
  <FeaturedWorkReveal className="flex flex-col gap-16">
    <HeroTile caseStudy={data} />            {/* server-rendered */}
  </FeaturedWorkReveal>

  // featured-work.client.tsx (Client) — SÓ o reveal
  const inView = useInView(ref, { once: true, margin: '0px 0px -120px 0px' });
  return <m.div variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>{children}</m.div>;
  ```
  Resultado medido neste tipo de migração: queda de long tasks na home. **Meça** antes/depois.
- **Hover/decoração = CSS, não estado React.** Trace, glow, lift via `:hover/:focus-within` +
  `transition` (mesmos timings dos tokens). Tira JS da árvore e funciona sem hidratar.
- **Hooks SSR-safe retornam `null` antes do mount.** `useReducedMotionSafe`, `useIsTouch` usam
  `useMounted`/estado → evitam hydration mismatch; quem consome trata o `null` como "ainda não sei".
- **Providers compõem na raiz** (Motion → Scroll → contextos de app), conteúdo dentro. Mantenha-os
  finos.

---

## 6. Motion & scroll

**Playbook (já implementado neste padrão):**

- **Scroll-jack por sticky CSS, nunca `pin: true`.** Para "seção A encolhe enquanto B emerge sem
  gap": `outer` alto + `inner sticky top-0 h-screen`; GSAP entra **só com `scrub`** para animar os
  children. `pin: true` gerencia `position: fixed` e deixa transform residual / trava anchors / corta
  no exit.
  ```
  <section class="h-[200vh]"><div class="sticky top-0 h-screen overflow-hidden"> … </div></section>
  ScrollTrigger.create({ trigger, start:'top top', end:()=>`+=${h-innerHeight}`, scrub:1, animation:tl })
  ```
- **Lenis ↔ GSAP num ticker só.** `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add(t =>
  lenis.raf(t*1000))` + **`gsap.ticker.lagSmoothing(0)`**. Singleton com cleanup (StrictMode monta 2×).
- **Carregue GSAP/Lenis sob demanda.** São ~40 KB gz: `import()` dinâmico **só** quando
  `!reduced && !touch`. Touch/reduced nunca baixam o bundle de scroll.
- **`prefers-reduced-motion` em CSS *e* JS.** `MotionConfig reducedMotion="user"` + um kill global no
  CSS (`animation/transition-duration: .01ms !important`). Pseudo-elementos `::view-transition-*` não
  são cobertos pelo `*` → regra explícita.
- **Pause animação atmosférica off-screen** via `IntersectionObserver` alternando
  `animationPlayState` (compositing contínuo é caro em low-end). Loop ease-in-out retoma sem salto.
- **Reveal de headline = CSS, não JS.** Cada palavra é um `<span>` server-rendered com `--word-i` e
  `animation-delay: calc(var(--word-i)*Xms)`. Anima do **primeiro paint**, sem replay glitch e sem
  `SplitText` (~40 KB). `opacity` inicial `0.01` (não `0`) mantém o LCP no FCP.
- **`LazyMotion features={domAnimation} strict`** força `<m.*>` (não `<motion.*>`) e corta ~5 KB vs
  `domMax`. Override local em rotas que precisam de `layout`/`popLayout`.
- **Anti-scale.** Hover move/eleva (`translateY(-2px)`, `translateX(2px)`, glow), nunca `scale` —
  evita blur de texto e o look "AI slop".

**Princípios destilados do north-star (cinematic scroll premium, ex.: landonorris.com / OFF+BRAND):**

1. **Scroll coreografado** — cada seção "performa" sua entrada; o scroll é o motor da narrativa.
   *Replicar:* GSAP `scrub` + timeline por seção, eases dos tokens.
2. **Reveals por sticky-stacking, sem teletransporte** — seções coexistem no viewport na transição.
   *Replicar:* o padrão sticky CSS acima (foi exatamente a conclusão de auditar esse tipo de site).
3. **Ritmo calma↔impacto** — respiro antes de um momento grande. *Replicar:* `section-pad-y` generoso
   + 1 gesto forte por seção, não dez pequenos.
4. **Tipografia editorial em escala dramática** — display enorme como imagem. *Replicar:*
   `text-5xl/6xl` fluido + `headline-display`.
5. **Smooth scroll coeso** — toda a página com a mesma física de scroll. *Replicar:* Lenis (desktop).
6. **Um momento de exceção** (ex.: faixa horizontal) — *replicar com parcimônia:* `matchMedia`
   desktop = horizontal scrub, mobile = stack vertical natural + dots via `IntersectionObserver`.
7. **Coesão de motion** — os mesmos eases/durations em tudo. *Replicar:* `EASES` + `--motion-*`.

---

## 7. Performance

- **`experimental.optimizePackageImports`** para barrels pesados (libs de ícone, motion, primitivos)
  → tree-shake real no first-load.
- **Imagens AVIF/WebP**; registre cada `quality` usado em `images.qualities` (majors recentes validam
  contra allowlist). Use `quality` alta só onde há texto fino (screenshots de UI).
- **Preload escopado à rota que usa.** Em React 19, ice o `<link>`/`preload()` a partir do RSC da
  seção — nunca no root layout (senão toda rota pré-carrega um asset que só uma usa).
- **⚠️ `loading.tsx` em rota estática → CLS alto.** Em página 100% estática ele força um Suspense que
  serve o conteúdo num `<div hidden>` revelado por script pós-parse → o layout despenca na troca
  (CLS medido: 0.534). **Só adicione com trabalho async real.** Para soft-nav sem flash, use **View
  Transitions** (`experimental.viewTransition` + `<ViewTransition>` envolvendo o `<main>`).
- **Orçamento de first-load JS.** Acompanhe com `pnpm analyze`; o que não é crítico vira `import()`
  dinâmico (scroll, 3D, modais).
- **Suíte de medição re-rodável** (`_audit/*.mjs` ou similar): LCP, CLS por rota, probe de hidratação,
  soft-nav sem flash, focus-ring. Rode antes/depois de qualquer mudança de motion/tokens.

---

## 8. Acessibilidade & SEO

- **Foco global visível.** `*:focus-visible { outline: 3px solid … }` no `@layer base`.
  ⚠️ **Tailwind v4: utilities vencem `@layer base`** — um `outline-none` solto mata o anel global.
  Para suprimir borda mantendo o foco do SO, use `outline-hidden` (outline transparente), não `none`.
- **Skip link** para `#main`; `:target { scroll-margin-top: var(--scroll-anchor-offset) }` para
  âncoras não ficarem sob o header fixo.
- **Contraste AA via OKLCH.** O tom de texto mais baixo deve passar ≥4.5:1 (suba o L até passar;
  reserve tons abaixo disso só para decorativo `aria-hidden`).
- **Semântica + `text-wrap: balance`** em h1–h3; uma única landmark `<main>`; `sr-only` para rótulos
  de contexto; respeite ordem de heading.
- **Metadata API** com `title.template`, `metadataBase`, OpenGraph/Twitter, `alternates.languages`
  (hreflang, mesmo monolíngue), `appleWebApp` para standalone iOS.
- **JSON-LD cruzado por `@id`.** `Person`/`Organization` + `WebSite`/obras ligados por URI canônico
  (`creator: { '@id': … }`) → o Google liga autor↔obra.
- **`sitemap.ts` com datas manuais por rota**, não `new Date()` global ("tudo mudou hoje" vira ruído
  para o crawler). **`robots.ts`** com `disallow` das rotas `noindex` (poupa crawl budget).

---

## 9. Segurança & forms

- **Zod schema compartilhado, validado nas duas pontas.** RHF parseia no client (UX); a Server Action
  **re-parseia no server** (defesa em profundidade). Mesma fonte = sem drift.
- **Anti-spam em camadas:** BotID (fingerprint ML) → honeypot (campo invisível, `z.string().max(0)`)
  → Zod strict → rate limit da plataforma. Bot/honeypot retornam **sucesso silencioso** (não revele a
  heurística).
- **Side-effects (email) direto na action**, sem `waitUntil`, em runtimes com graceful shutdown
  (Fluid Compute aguarda a Promise; `waitUntil` pode matar o handler antes do envio concluir).
- **Headers/CSP completos** (`script-src`/`connect-src`/`frame-src` mínimos; `frame-ancestors 'none'`,
  `object-src 'none'`, HSTS, `Referrer-Policy`, `Permissions-Policy`). Inclua `blob:` em `script-src`
  só se web workers (ex.: 3D) exigirem. `'unsafe-eval'` apenas em dev.
- **Sentry sem vazar fonte:** suba sourcemaps e **delete do output** (`deleteSourcemapsAfterUpload`)
  — stack traces desminificados no painel, código não publicado em `/_next/static/`.
- **Segredos por env.** Com `exactOptionalPropertyTypes`, injete configs opcionais via spread
  condicional (`...(process.env.X ? { x: process.env.X } : {})`).

---

## 10. Anti-padrões (cada um custou debug real — generalizados)

- ❌ `GSAP pin: true` para scroll-jack → transform residual / anchor travado / exit brusco.
  ✅ `outer` alto + `inner sticky top-0 h-screen`, GSAP só `scrub`.
- ❌ `loading.tsx` em rota estática → CLS por streaming reveal. ✅ só com async real; soft-nav = View
  Transitions.
- ❌ Máscara/gradiente/stub para esconder defeito. ✅ fix de causa-raiz.
- ❌ Animar `stroke-dashoffset` pelo CSSPlugin do GSAP (snap binário, não interpola). ✅ `attr: {…}`.
- ❌ `mask` num nó que também tem `transform` (coordenadas `userSpaceOnUse` quebram). ✅ máscara em
  wrapper **sem** transform.
- ❌ Nome de token colidindo com utility do Tailwind (`--color-base` ↔ `text-base`). ✅ nomes neutros
  (`--color-bg`); zere escalas default que você reaproveita.
- ❌ `outline-none` confiando em `@layer base` (utilities vencem no v4) → mata foco. ✅ `outline-hidden`.
- ❌ `scale` no hover de cards/CTA (blur, "AI slop"). ✅ translate/glow.
- ❌ Static import de libs pesadas de motion/3D no first-load. ✅ `import()` gateado.
- ❌ Afirmar melhoria sem medir. ✅ probe re-rodável, antes/depois, build de prod.

---

## 11. Definition of Done

- [ ] `pnpm typecheck` e `pnpm lint` limpos; `pnpm test`/`test:e2e` verdes.
- [ ] Mudou motion/layout/tokens? **Probe antes/depois** anexado; **CLS 0** por rota (Lighthouse no
      build de prod). `loading.tsx` só onde há async real.
- [ ] `prefers-reduced-motion` e foco visível verificados; contraste AA conferido.
- [ ] Nenhuma afirmação sem evidência; nenhum asset/stub/comentário órfão deixado para trás.
- [ ] Decisões não-óbvias comentadas com o *porquê*; pendências no `ROADMAP.md`/`LAUNCH-CHECKLIST.md`.
- [ ] APIs do framework conferidas nos docs versionados — não na memória de treino.
