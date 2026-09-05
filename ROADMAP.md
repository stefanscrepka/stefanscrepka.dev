# ROADMAP — Auditoria Sensorial → Implementação

> **Origem**: auditoria sensorial completa de 2026-06-10 (protocolo Playwright: 100+ capturas,
> métricas medidas em build de produção, código cruzado com a tela — evidências em `_audit/`,
> pasta gitignored). Nota da auditoria: **7.3/10** — "bom demais pra ser esquecível, bugado
> demais pra ser inevitável". Este documento lista TODOS os achados, o que já foi corrigido
> (com validação empírica) e o que resta, em ordem de impacto.
>
> **Status**: ✅ implementado + validado nesta sessão · 🔴 bloqueado em ação humana (assets) ·
> 🟡 refinamento futuro (espec pronta) · 📝 decisão documentada
>
> Complementa o `STEFAN-TODO.md` (ações humanas pré-launch) — itens de asset são cross-referenciados.

---

## FASE 1 — Corrigido nesta sessão (era P0/P1)

### 1. ✅ Headline do hero "piscava e re-tocava" (replay GSAP)

- **Problema**: SSR pintava o headline completo (frame T66ms), o GSAP SplitText carregava em
  `requestIdleCallback`, **escondia o texto já visível** (~T900–1900ms) e re-animava palavra a
  palavra. Em CPU 4x o visitante lia por ~2s antes do texto sumir. Primeira impressão = glitch,
  num site cuja tese é "funciona 24/7".
- **Fix**: `components/hero/headline-word-reveal.tsx` (novo, server component) — split por
  palavra NO SERVIDOR (`<span class="headline-word" style="--word-i:n">`), animação 100% CSS
  (`globals.css`: 600ms, stagger 55ms, `--ease-enter`) rodando do PRIMEIRO paint, antes de
  qualquer JS. Não existe estado "visível→escondido". `split-text-headline.tsx` (GSAP) deletado
  — SplitText saiu do bundle da home (~40 KB gz no idle path).
  - Detalhe técnico: keyframe parte de `opacity: 0.01` (não 0) — preserva o LCP no primeiro
    paint em vez de migrá-lo pro fim do stagger; imperceptível sobre fundo oklch(13%).
  - Reduced-motion: media query desliga → headline estático (validado: opacity 1, 0 animações).
- **Validação**: sonda de opacity monotônica (30 amostras × 100ms): **zero quedas**; 13
  palavras; LCP **364–680ms** (H1) e CLS **0** mantidos; teste e2e do headline passa.

### 2. ✅ Colisão `text-base`: CTAs invisíveis nos cases + frase final do footer apagada

- **Problema**: o token `--color-base` no `@theme` fazia o Tailwind v4 gerar um utilitário de
  COR `text-base` que sobrescrevia o `text-base` de font-size (usado por `Button size="lg"`,
  footer, inputs...). Como a ordem dos chunks CSS varia por rota, o MESMO botão era branco na
  home e **preto-sobre-preto** nos 4 cases ("Ler arquitetura completa →" renderizava como pill
  vazio). A frase peak-end do footer ("Se não funciona 24/7, não conta.") estava invisível.
- **Fix**: rename na raiz — `--color-base` → `--color-bg` (66 substituições em 31 arquivos,
  fontes + docs). Sem o token "base", `text-base` volta a ser só font-size, independente de
  ordem de chunk.
- **Validação**: cor computada do CTA = `lab(97.74)` (texto claro) ✓; frase do footer
  `lab(97.74)` a 23.7px ✓; grep `--color-base` no repo = **zero** hits; e2e 7/7.

### 3. ✅ CSP quebrava os workers do Three.js (12 erros no console do /playground)

- **Problema**: workers `blob:` do troika (drei `<Text>`) chamam `importScripts(blob:)` — que é
  governado por **script-src** (não `worker-src`). Sem `blob:` lá, 12 erros vermelhos na página
  que existe pra impressionar tech leads.
- **Fix**: `next.config.ts` — `script-src` ganhou `blob:` (com `'unsafe-inline'` já presente,
  não amplia superfície de forma material; análise CSP3 confirmada em revisão).
- **Validação**: `/playground` com **0 worker errors** no console (era 12).

### 4. ✅ Anel de foco invisível em todos os Buttons

- **Problema**: `outline-none` nos utilities do Button/Tabs **mascarava o anel global do design
  system** (`globals.css *:focus-visible { outline: 3px solid var(--color-border-focus) }`) —
  utilities vencem a base layer. Foco por teclado não tinha indicador nenhum nos elementos mais
  importantes do site (WCAG 2.4.7).
- **Fix**: `button.tsx` e `tabs.tsx` removeram `outline-none` E o trio local
  `focus-visible:outline-*` (redundante/conflitante com a regra global, que agora cobre).
  Bônus da revisão: `TabsContent` também perdeu o `outline-none` residual (painel Radix é
  focável); `TILE_SHELL` (featured-work) trocou `outline-none` → `outline-hidden` (preserva
  indicador em forced-colors/Windows High Contrast).
- **Validação**: anel computado no CTA focado = **`3px solid lab(95 -36 82)`** (lime) ✓ +
  screenshot. Nota: `transition-all` faz o anel assentar a cor em ~150ms (fade-in) — cosmético.

### 5. ✅ Stagger do Featured Work era código morto (tiles entravam em bloco)

- **Problema**: `FeaturedWorkReveal` recebia UM filho único (um `<div>` wrapper), então o
  `staggerChildren: 0.08` nunca acontecia na tela — a coreografia descrita nos comentários não
  existia.
- **Fix**: HeroTile e a row de half-tiles agora são children DIRETOS do reveal; o layout
  flex/gap migrou pra `className` do container Motion. Atributos `data-reveal` vestigiais
  removidos (zero consumidores, verificado por grep).
- **Validação**: trace de opacities durante a entrada — hero 0.27 enquanto halves 0.00; hero
  0.51 vs 0.06... **6 amostras com hero liderando**, ambos assentam em 1. A coreografia existe.

### 6. ✅ Transição de página: corte seco → crossfade com View Transitions

- **Problema**: navegação entre rotas era swap instantâneo (<180ms) sem nenhuma continuidade.
- **Fix**: `experimental.viewTransition: true` + `<ViewTransition default="page-fade">` em volta
  do conteúdo do `<main>` (nav/footer ficam fora e persistem) + CSS `::view-transition-old/new`
  (fade-out 180ms `--ease-exit`, fade-in 280ms + rise 8px `--ease-enter`) + kill explícito de
  reduced-motion (cópia fiel do snippet da doc bundled).
- **Validação**: vídeo da navegação (screencast do compositor) com `ffmpeg blackdetect` —
  **zero janelas pretas**; e2e passa. (Screenshot avulso durante VT em headless mostra frame
  preto — artefato do capture, descartado pela evidência de vídeo.)
- 📝 **Decisão documentada**: em rotas com `loading.tsx` (work/process) e RSC lento, o
  page-fade roda 2× (página→skeleton→conteúdo) — o guia bundled trata esse handoff como
  legítimo (Step 2). Refinamento opcional: ViewTransition dedicado com `enter`/`exit` nos
  fallbacks.

### 7. ✅ Back-link dos cases nascia cortado sob a nav fixa

- **Problema**: `CaseStudyHero` tinha `pt-10` mas a TopBarNav é `fixed h-14/h-16` — "← Outros
  cases" nascia meio escondido em todas as 4 case pages.
- **Fix**: `pt-24 sm:pt-28 lg:pt-32` (nav + respiro; um degrau abaixo do `pt-32/36` do índice
  /work — hierarquia coerente).
- **Validação**: back-link top = 128px vs nav bottom = 64px ✓ + screenshot.

### 8. ✅ Vale emocional da timeline (vazios de viewport inteira)

- **Problema**: gaps de 8/12/14rem entre entries = ~3 telas de preto morto no meio da página
  (o "vale" onde o visitante desliga, frames y6958/y8472 do audit).
- **Fix**: `timeline.client.tsx` gaps → 5/7/8rem (corte ~43% dos vazios, mantém o drama
  tipográfico). TracingBeam mede altura dinamicamente (ResizeObserver) — sem dessincronização.
- **Validação**: seção 2922px → **2634px** (−288px exatos = 3×6rem) + screenshot de ritmo.

### 9. ✅ Preload do hero-poster vazava pra TODAS as rotas

- **Problema**: `<link rel=preload>` no root layout → toda página interna pré-carregava ~47 KB
  que nunca usava + warning "preloaded but not used" no console de cada rota.
- **Fix**: movido pra `HeroSection` via **`ReactDOM.preload()`** (a API que a doc bundled
  prescreve pra resource hints em RSC — refinado pós-revisão de conformidade).
- **Validação**: HTML servido da home contém o preload ✓; HTML dos cases **não** contém ✓.
  (No DOM ao vivo o prefetch do Next pode injetar hoistables da home ao pré-buscar links pra
  ela — comportamento correto de prefetch, não é leak.)

### 10. ✅ Deprecações/conformidade Next 16 + a11y menores

- `next/image`: `priority` (deprecado no 16) → `preload` em CaseStudyCover/ProductMockup —
  **paridade 1:1 comprovada na fonte** (`get-img-props.js`: mesmo eager + mesmo hint);
  `priority={false}` morto removido do ProductCover.
- `images.qualities: [75, 95]` registrado (Next 16 valida; CaseStudyCover usa `quality={95}`).
- Tap targets: links mono de 17–20px ("GitHub →", "Ver todos no playground →") → `py-3 -my-3`
  = ~44px de área de toque sem mudar o visual (medido: 44/44/41px ✓).
- Subhead do hero: scrim tipográfico (`textShadow` na cor do fundo via `color-mix`) — recupera
  contraste sobre a faixa clara da onda do vídeo/poster (pior caso era o poster mobile).
- Flip-card Estética MD: hint adapta ao input real via `useIsTouch` ("Toque..." / "Passe o
  mouse..." / genérico no SSR — sem hydration mismatch, hook retorna null no 1º render).

**Validação global da Fase 1**: suíte de sondas Playwright **13/14 PASS** (a 14ª —
reduced-motion — passou 3/3 em re-runs isolados; a falha na suíte era transiente de medição),
`tsc --noEmit` limpo, Biome limpo, `next build` verde, **e2e 7/7** (×2 rodadas), smoke do build
final 4/4. Revisão por 2 agentes (adversarial + conformidade com a doc bundled): todos os
apontamentos acionáveis aplicados ou documentados.

---

## FASE 2 — 🔴 Bloqueado em você (assets) — máximo impacto restante

> Já especificados no `STEFAN-TODO.md`; aqui só o porquê emocional, em ordem.

1. **Screenshot/screencast REAL do Content Engine no flagship tile** (TODO #1) — o cover do
   tile principal é um diagrama SVG; a auditoria apontou como o maior gap de prova ("freelancer
   com mockup" vs "engineer com produto"). Um loop de 4s do Telegram aprovando draft às 3h vale
   mais que qualquer animação.
2. **Bento "22" → evidência viva** (TODO #8) — vídeo Telegram HITL ou diagrama orbital; remove
   o último stub admitido em código.
3. **Hero video 1080p+** (TODO #12 adjacente) — o loop atual é 1280×720 esticado a 1440+;
   re-render/upscale devolve nitidez ao palco principal.
4. **Avatar + envs + DNS + Resend/Sentry/Cal** (TODOs #2–7) — infra de launch.

## FASE 3 — ✅ Implementado + validado (sessão 2026-06-11)

> Fase 1 re-verificada antes de começar: 10/10 claims confirmados por agentes adversariais
> independentes (cada um tentando REFUTAR a alegação no código). Resíduos que eles acharam
> foram absorvidos nesta fase (ver "Resíduos da Fase 1" abaixo).

1. ✅ **Assinatura do manifesto com trim-path real** — o SVG é trace de fill (não strokes),
   então o desenho usa a técnica de máscara: 3 strokes grossos seguindo o DUCTUS da escrita
   ("S" → "tefan" → flourish — a volta da caneta da ponta do loop numa linha única sob o nome
   + traço/ponto) com `stroke-dashoffset` 1→0 (`pathLength=1`) e **easing por segmento**
   (S `power1.inOut`, letras `power1.out`, flourish `power2.out` rápido — letras lentas,
   flourish snap, como assinatura real). Coordenadas derivadas visualmente em
   `_audit/f3-sig-lab.html` (5 iterações com teste de cobertura magenta/lime → 100% do fill
   coberto); rect de segurança fecha a máscara no fim (antialiasing das pontas). Zero-JS e
   reduced-motion = assinatura completa estática (default do markup).
   - Gotcha medido: o CSSPlugin do GSAP **não interpola** `strokeDashoffset` (snap binário —
     `_audit/f3-tween-test.html`); a animação usa o **attr plugin** (`attr:
     {'stroke-dashoffset'}`), que interpola.
   - **Validação**: `_audit/f3-sig-validate.mjs` no build de prod — PASS: monotônico, ordem de
     ductus correta (S mid-draw 0.71 em p=0.45; tefan 0.43 em p=0.7), estado final completo
     (segs 0 + fill 1). Frames em `_audit/shots/f3-sig-live-*.png`.
2. ✅ **Dieta de hidratação (parcial — candidatos nomeados)** — BentoSkills e Timeline
   viraram **Server Components**: o conteúdo (cards, year/title/body/instituições) chega
   server-rendered como children de ilhas finas (`BentoRevealGrid`/`TimelineReveal` — só o
   reveal stagger + TracingBeam + MarkerDot hidratam). Hover do PerimeterTrace virou CSS puro
   (`:hover/:focus-within`, mesmos timings; validado 1px→0px), gates JS de reduced-motion
   viraram variantes `motion-safe/reduce`, keyframes inline (1 `<style>` por célula) foram pra
   `globals.css`.
   - **Medição** (probe `_audit/f3-hydration-probe.mjs`, 5 runs, CPU 4x, prod): mediana
     **2.123ms → 1.951ms (−8%)** e variância muito mais apertada (1917–2004 vs 1687–2184).
   - 📝 Honestidade: o grosso dos long tasks é framework + hero clients (marquee/stats GSAP) +
     Lenis + burst dos chunks dynamic (~2.5s). Próximos alvos da dieta (futuro): hero islands,
     Lenis defer, contact form.
3. ✅ **loading.tsx removidos (fix de causa-raiz — era o que F3.3 deveria refinar)** — a
   tentativa inicial foi suavizar o double-fade com ViewTransition `exit/enter` dedicada nos
   fallbacks. Ao medir CLS no Lighthouse, achei algo MUITO pior que o double-fade: os
   `loading.tsx` de /work e /process (criados no audit) forçavam um Suspense boundary que, em
   páginas **100% estáticas** (○), fazia o React servir o skeleton (curto) + o conteúdo num
   `<div hidden>` revelado por script `$RC` pós-parse. O footer despencava ~1500px ao trocar o
   skeleton pelo conteúdo: **CLS 0.534** (Lighthouse perf 0.71 em /work, /process, /content-engine;
   home e /privacidade, sem loading.tsx, tinham CLS 0).
   - **Atribuição** (`_audit/f3-cls-trace.mjs`): o conteúdo nascia dentro de um `<div display:none>`
     (width 0 → cover aspect-ratio colapsava → footer alto), revelado só com JS. Confirmado
     removendo os loading.tsx → **CLS 0 em todas as rotas** (`_audit/f3-cls-measure.mjs`).
     Pré-Fase-3 (o audit só mediu CLS da home), mas resolvido aqui.
   - **Decisão**: como são páginas estáticas (instantâneas no hard load) e o `page-fade` da raiz
     (Fase 1 #6) já segura a navegação soft **sem flash branco** (verificado: 0 frames em branco,
     `_audit/f3-softnav.mjs` — a página anterior fica visível até o estático resolver, então
     crossfade), os `loading.tsx` foram **removidos** + os wrappers VT revertidos das 6 pages +
     CSS skeleton removido. Sem skeleton não há double-fade nem handoff a refinar. Fix de
     causa-raiz, não cosmético. (`/playground/loading.tsx` mantido: página pesada de Three.js,
     CLS 0.059 < 0.1, loading state justificado.)
4. ✅ **`@utility focus-ring` removido** — zero consumidores (grep); a regra global
   `*:focus-visible` cobre. Decisão documentada no lugar da utility em globals.css.
5. ✅ **Atmosfera pausada fora da viewport** — `hooks/use-paused-offscreen.ts`
   (IntersectionObserver → `animation-play-state`): `hairline-breathe` do footer (ilha
   `footer.client.tsx`) e `manifesto-beam-drift` (backdrop). 📝 GrainOverlay: IO **não se
   aplica** (fixed inset-0 = sempre intersectando); drift é transform-only/compositor —
   decisão documentada no componente (se aparecer custo: bakear PNG, LAUNCH-CHECKLIST).
6. ✅ **HeroTile cover: `preload` → `loading="eager"`** — `eager` substitui `preload` (cujo
   `<link>` no head disputava banda com o hero-poster/LCP). A doc bundled do next/image
   recomenda eager/fetchPriority sobre preload na maioria dos casos. **Ressalva honesta
   (revisão adversarial):** no flagship HeroTile o cover é o Content Engine, que tem
   `screenshot=null` → renderiza DIAGRAMA SVG inline, então `eager` (como o `preload`/`priority`
   anteriores) fica **dormente** ali — só ativa quando o screenshot real chegar (Phase 2).
   Onde a prop REALMENTE morde hoje: `/work/estetica-md` (cover real era o LCP e estava lazy →
   `eager`, LCP element agora `<img loading=eager>`). ProductMockup mantém `preload` — onde o
   mockup acima do fold é de fato o LCP. Ver bloco "Revisão adversarial" abaixo.
7. ✅ **Lighthouse CI** — `pnpm lhci` no build final. **A primeira passada PEGOU o CLS 0.534**
   (item #3) e um erro de a11y, ambos consertados:
   - Antes: perf **0.71** (/work, /process, /content-engine, por causa do CLS), gate falhando.
   - Depois do fix do CLS: perf **0.98–0.99** · a11y **1.00** (0.96 /privacidade) · BP **0.96** ·
     SEO **1.00** · **CLS 0.000** em todas as 5 URLs (medições em `.lighthouseci/`).
   - Último bloqueador (error-level do preset `lighthouse:recommended`): `link-in-text-block` —
     um link mailto na /privacidade se distinguia do texto só por cor (underline só no hover,
     WCAG 1.4.1). Consertado: underline **permanente** (decoration em accent/50, satura no
     hover) — propagado pros 4 links in-text de accent do site (privacidade, contact-form,
     playground, cal-modal) por consistência. CTAs standalone (button.tsx `link` variant) não
     são afetados (o audit só flagra links DENTRO de bloco de texto).
8. ✅ **Cal.com modal: skeleton de calendário** — skeleton month-view ecoando a anatomia do
   booker (meta do evento + grid 7×5 + coluna de slots; neutro, zero lime — "lime só quando
   faz algo") até o evento `linkReady` do embed SDK, com failsafe de 10s (link direto continua
   na descrição). `aria-busy` agora desliga no ready. **Validado**: skeleton visível a 400ms,
   fade-out + busy=false após ready (`_audit/f3-cal-bento-validate.mjs` +
   `_audit/shots/f3-cal-skeleton.png`).
9. ✅ **Footer "— stefan": reveal sutil on-scroll** — a frase peak-end ganha beat próprio
   (fade + rise 10px, `outQuint`, once; "— stefan" assenta 450ms depois). Ilha
   `footer.client.tsx`; reduced-motion via `MotionConfig reducedMotion="user"` global.

### Revisão adversarial da Fase 3 (4 dimensões × find→verify cético) — 3 achados confirmados, todos corrigidos

> 26 agentes (4 dimensões de review → verificação cética por finding). 22 findings rejeitados
> como estilo/teórico; **3 confirmados como reais e acionáveis**, consertados aqui:

- **[médio · claim↔evidência] `eager` era no-op no tile que o usava** — o HeroTile passava `eager`
  só pro flagship Content Engine, mas `content-engine.screenshot === null` → renderiza DIAGRAMA
  SVG inline (sem `<img>`, sem atributo `loading`). A prop era silenciosamente descartada e os
  comentários descreviam um comportamento de imagem que não acontecia. **Fix**: comentários agora
  HONESTOS (a prop fica dormente no diagrama, ativa quando o screenshot real chegar — Phase 2
  TODO #1; a prop de fato aplica `loading="eager"` no PATH 1 com imagem). Bônus: descoberto via
  warning do Next que o cover REAL de `/work/estetica-md` (estetica-md-home.avif) era o **LCP e
  lazy** → recebeu `eager` (LCP element confirmado `<img loading=eager>`, era `<img>` lazy; os
  outros 3 cases têm LCP textual, sem imagem a otimizar — medido em `_audit/f3-lcp-check.mjs`).
- **[alto · a11y] nav primária desktop sem anel de foco** — os links Work/Process/Manifesto/Contato
  tinham `outline-none` + foco só por troca de cor de texto (text-2→text-1; e ZERO mudança no link
  ativo, já text-1). Como `outline-none` (utilities) vence o `*:focus-visible` global (base layer),
  o anel global NÃO cobria — falha WCAG 2.4.7. A refatoração de foco da Fase 1 (button/tabs/flip-card)
  não chegou aqui. **Fix**: `ring-2` lime explícito, igual ao NavLogo + trigger mobile do mesmo
  arquivo.
- **[alto · a11y] back-link dos cases sem anel de foco** — "← Outros cases" tinha `outline-none` +
  foco só por aumento de gap (não é indicador perceptível). Mesmo mecanismo de cascade. **Fix**:
  `ring-2` lime explícito.

### Resíduos da Fase 1 absorvidos (achados pelos verificadores adversariais)

- `flip-card.tsx`: trio `focus-visible:outline-2/offset/color` local removido (conflitava 2px
  vs anel global 3px — mesmo fix do button.tsx, esquecido em ui-effects/).
- `outline-none` → anel global ou `outline-hidden` (forced-colors) propagado: footer (links nav
  + meta), footer-about-button, playground-teaser (link + tile), other-work (links + pill
  WhatsApp), social-proof-line, contact-form ("Enviar outra"). Mesma razão do TILE_SHELL.
- Comentários/docs stale: timeline ("min 12rem"), e2e home.spec (SplitText), JSDoc
  case-study-cover/product-mockup (`priority`), LAUNCH-CHECKLIST (snippet CSP paste-ready SEM
  `blob:` — regredia o fix dos workers — e referência a split-text-headline deletado).
- `visual-audit.spec.ts`: `networkidle` → `load` (o /playground nunca aquieta a rede — script
  do Vercel Analytics 404a fora do runtime Vercel e fica em retry; flake pré-existente).
- 📝 Não tocado (corretos como estão): `public/bg/hero-poster-v2.webp` órfão (66 KB, decisão de
  asset é do Stefan); aria-busy do fallback do contact-form-lazy (semântica correta de
  pending); inputs/dialog/sheet/dropdown com substitutos de foco próprios.

**Validação global da Fase 3**:
- Suíte da Fase 1 re-rodada **14/14 PASS** (zero regressões, incluindo a sonda reduced-motion
  antes flaky) — re-rodada após CADA conjunto de mudanças (dieta de hidratação, revert do
  loading.tsx, fixes da revisão).
- `tsc --noEmit` limpo · Biome limpo · `next build` verde (25/25 páginas estáticas).
- **e2e 27 passed** (2 skipped = spec de screenshots excluída do CI). Os 2 fails de
  `/playground` da rodada anterior (flake `networkidle`) foram deflakados (`networkidle→load`).
- **Lighthouse CI verde (exit 0)** após o fix do CLS + o fix de a11y `link-in-text-block`:
  perf **0.98–0.99** · a11y **1.00** (0.96 /privacidade) · BP **0.96** · SEO **1.00** ·
  **CLS 0.000** nas 5 URLs (era perf 0.71 / CLS 0.534 antes).
- Long tasks (CPU 4x, prod): mediana **2.123 → 1.951ms**.
- Validadores re-rodáveis novos: trim-path da assinatura (PASS), skeleton Cal + trace bento
  (PASS), CLS por rota (0 em tudo, /playground 0.059), LCP por case page, hidratação.

## FASE 4 — ✅ Implementado + validado (sessão 2026-08-29)

> Auditoria sensorial nova: 174 capturas (11 rotas × 2 viewports × filme de scroll),
> análise quantitativa por pixel (numpy/scipy: ritmo vertical, densidade, uso de lime,
> contraste real de texto sobre mídia) + sondas de DOM. Suíte re-rodável em `_audit/f4/`.
> **13 achados, todos corrigidos e medidos antes/depois.**

### P0 — defeitos reais

1. ✅ **Playground 3D estava COMPLETAMENTE QUEBRADO** *(o achado mais grave)*
   - **Sintoma**: `/playground` — a página feita pra impressionar tech lead — mostrava
     "CARREGANDO THREE.JS…" **para sempre**. O `<canvas>` montava e era dimensionado
     (1341×446) mas a subárvore inteira ficava com `display: none !important`.
     Reproduzido em **Chrome real (headed)**, não é artefato de headless.
   - **Causa**: `display:none !important` é como o React esconde uma árvore **suspensa**
     (`hideInstance`). O `<Text>` do drei suspende via troika; sem prop `font`,
     troika@0.52 resolve a fonte pelo `unicode-font-resolver`, que faz
     `fetch("https://cdn.jsdelivr.net/gh/lojjic/unicode-font-resolver@v1.0.1/...")`
     dentro do worker. **jsdelivr não está no `connect-src`** → `TypeError: Failed to
     fetch` → a promise do Suspense nunca resolve → cena inteira escondida.
     Mesma classe do fix da Fase 1 #3 (CSP × workers do Three.js), que cobriu
     `script-src blob:` mas não este fetch de dados de fonte.
   - **Bissecção**: sem o `<Text>` a cena renderiza; com ele trava — testado com woff2
     local, ttf local e sem `font`. Nenhum formato resolveu: o troika suspendia igual.
   - **Fix**: `<Text>` do drei **removido deste caminho**. Rótulos A/B/C agora são
     `<sprite>` com textura de canvas 2D (`PegLabel` em `hanoi-3d.tsx`): sem worker,
     sem fetch, sem superfície de CSP, ~20 linhas, e sprite sempre encara a câmera
     (que era justamente o motivo de usar texto 3D com OrbitControls).
     Posição corrigida de `y=-0.35` (abaixo do plano do chão → ocluído) pra `y=0.24, z=1.55`.
   - **Validação**: cena completa renderiza (3 pegs, 4 discos, chão, rótulos A/B/C),
     `loading=false`, `hidden=0`, canvas 1356×446, **0 pageerrors**.

2. ✅ **Subhead do hero ilegível sobre a mídia** — contraste medido pixel a pixel
   - **Antes**: mobile **1.86:1** (99.9% dos pixels de glifo abaixo de AA), desktop 3.78:1.
   - **Causa-raiz**: a máscara do vídeo (`transparent → 0.85 @55% → 1 @75%`) deixava a
     mídia em brilho **MÁXIMO** justo na faixa do subhead/CTA/stats — o **oposto** do que
     o comentário do componente afirmava. Pior no mobile porque `<source media>` desliga
     o vídeo (<768px) e sobra o poster AVIF, que é um frame claro.
   - **Fix**: `@utility hero-media-mask` (globals.css) **responsiva** — a mídia agora pica
     na faixa do headline (texto grande, passa contraste com folga) e cai antes do texto
     pequeno; stops diferentes por viewport porque os layouts diferem (bloco de texto
     começa em 56.7% no mobile vs 67% no desktop). Subhead sobe pra `text-1` + scrim de
     halo curto (4 raios) em vez de um brilho largo de 16px que se diluía sobre a onda.
   - **Depois**: mobile **11.74:1**, desktop **12.44:1** (CR@p90). Headline segue OK
     (3.91/5.19, mínimo 3.0 pra texto grande). Bônus: a onda ficou **mais** presente
     atrás do headline.

3. ✅ **Rótulos do diagrama flagship vazavam da caixa** — `"Whisper local · audio"`
   media **173.2% da largura da caixa** (vazava 4.39u de cada lado e furava o viewBox);
   `"HITL Telegram"` 107.9%; `"6 agents"` preenchia 96% (zero respiro óptico).
   Visível em `/` (tile principal) e `/work`. **Fix**: rótulos remodelados em duas
   linhas (título + qualificador), caixa 12→12.4u, gap 1.4→1.1u, tamanhos derivados da
   métrica real do Geist Mono (avanço 0.6em): título @1.45, meta @2.10, sub @1.35.
   Topologia agora explícita: `IN (input) → S0..S4 (N agents) → E-0 (output)`.
   **Validação**: 4 → **0** ocorrências de overflow em 9 rotas.

4. ✅ **`/design-system` estourava 206px na horizontal no mobile** — o espécime
   `text-5xl/6xl` num grid `[7rem_1fr]` não podia encolher (`1fr` = `minmax(auto,1fr)`,
   e `auto` = max-content), empurrando o documento pra 596px num viewport de 390px — a
   nav herdava a largura. **Fix**: `minmax(0,1fr)` + `min-w-0` + coluna de rótulo menor
   no mobile. **Validação**: scrollWidth == clientWidth em 7 rotas.

5. ✅ **A página do design system documentava tokens que não existem** —
   `--text-7xl` e `--color-info` tinham sido removidos do `@theme` mas continuavam
   listados. `fontSize: var(--text-7xl)` sem valor não quebra nada visivelmente: o span
   herda o tamanho do pai, então a linha rotulada "text-7xl" renderizava no tamanho do
   body. Documentação que mente em silêncio. **Fix**: removidos + **teste de guarda**
   (`tests/unit/design-system-tokens.test.ts`) que falha se qualquer token citado pela
   página não existir no `@theme`. Negative-test feito: reinserir o token derruba o teste.

6. ✅ **Poster do hero baixado em TODA rota interna** — `ReactDOM.preload()` cria um
   hoistable que o **prefetch do Next injeta no `<head>` da rota atual** ao pré-buscar
   o link da home. Medido: **200 OK de ~47 KB** em `/work`, `/process`, `/privacidade`,
   `/work/stj-app` + warning "preloaded but not used" no console de 14 combinações
   rota×viewport. A premissa ("poster é candidato a LCP em mobile") foi **refutada**:
   o LCP da home é o **H1** nos dois viewports. **Fix**: `preload()` removido — o
   atributo `poster` do `<video>` já busca a imagem. **Validação**: 4 → **0** requisições;
   LCP da home sem regressão (mediana de 7 runs: desktop 344ms, mobile 232ms).

7. ✅ **Tap targets abaixo de 24px** (WCAG 2.2 SC 2.5.8) — "About this site →",
   "Privacidade →", "GitHub source →" (16.5px), "← Outros cases" (16.5px), "← Voltar"
   (16.5px). **Fix**: `py-2 -my-2` (desktop) / `py-2 sm:-my-2` (footer) — cresce a área
   de toque sem mexer no layout visual. Lighthouse a11y de `/privacidade`: 0.96 → **1.00**.

### P1 — craft

8. ✅ **Marcadores do timeline desalinhados do feixe** — três cópias manuais das mesmas
   constantes (`left-3 sm:left-4 md:left-6`, `pl-10 sm:pl-12 md:pl-14`,
   `-left-[1.875rem] sm:-left-[2rem] md:-left-[2.125rem]`) dessincronizaram: o centro de
   cada marcador caía **11–13px à direita** da linha em todo breakpoint — a linha
   atravessava a borda esquerda do anel, não o centro. **Fix**: contrato único
   `--beam-x` / `--beam-pad` / `--beam-line` em globals.css; trilho, padding do conteúdo,
   marcadores e glow final todos **derivam** dele. **Validação**: linha=25, dot=25,
   marcadores=[25,25], **desvio máximo 0.0px**.

9. ✅ **Ornamento do manifesto se lia como skeleton de carregamento** — eram quatro
   hairlines empilhadas (60/80/100/70px, opacidade decrescente, gap 6px): literalmente o
   desenho de um placeholder de texto. Num site cuja tese é precisão, um ornamento que se
   lê como estado inacabado custa mais do que entrega. **Fix**: UMA régua que esvanece
   (gradient lime → transparent). Um skeleton nunca esvanece, então a leitura fica
   inequívoca — e o vocabulário casa com os eyebrows da timeline.

10. ✅ **Separador da stats row abria linha no mobile** — o `·` era LÍDER dentro de cada
    item (`index > 0`, antes do `<dt>`); como o container é `flex flex-wrap`, o item que
    quebrava levava o separador junto e a linha começava com "· 100+ testes runtime".
    **Fix**: separador virou TRAILING — nenhuma linha começa com ele.

11. ✅ **Rag do headline no mobile: "em" sozinho numa linha** — 7 linhas, 436px.
    Não era `text-balance` (balance/pretty/normal davam o MESMO rag): era largura pura —
    `"em produção"` mede **371px numa coluna de 358px**. **Fix**: override de tamanho só
    em `<640px` (curva resolvida pra f(390px)=58px, mantendo f(639px)≈77px, então o topo
    da faixa e o degrau pro `sm:text-5xl` não mudam). **Depois**: 6 linhas, 345px,
    zero órfã — **91px a menos de scroll**. Amarrar o travessão com NBSP foi testado e
    **piorou** (volta pra 7 linhas), por isso não foi feito.

12. ✅ **`pnpm test` estava quebrado** — sem `vitest.config.ts`, o vitest globava tudo,
    inclusive as specs do Playwright e os testes de repos vendorizados em `.agents/`
    ("34 failed | 1 passed"). **Fix**: config com `include` escopado a `tests/unit/**`.

13. ✅ **Sonda `preloadHome` afirmava o contrário do medido** — exigia que a home tivesse
    o `<link rel=preload>` do poster. Atualizada pra afirmar o estado correto (nenhum
    preload em lugar nenhum), com a medição registrada no comentário.

### Refinamento de composição (2ª rodada)

14. ✅ **Vazio interno no par de half-tiles** — os dois tiles espelhados recebiam
    aspect ratios DIFERENTES (`4/3` e `16/9`), gerando capas de 468px vs 350px numa
    linha de grid de altura igual. Como o CTA é `mt-auto`, os 118px de diferença
    viravam um buraco dentro do tile mais curto. Os dois screenshots são nativamente
    **16:10** (1920×1200 e 3840×2400), ou seja, ambos os ratios anteriores CORTAVAM
    a imagem — NexaCore perdia ~17% das laterais, STJ ~11% do topo/base.
    **Fix**: `16/10` nos dois. Resolve recorte, consistência do par e vazio de uma
    vez. Capas iguais (390px), tile 78px mais curto, CTAs alinhados.

15. ✅ **Célula "IA AGENTIC" do bento (último stub admitido em código)** — o stat
    "22" boiava sozinho no meio de uma célula obrigada a ter a altura de três células
    empilhadas. Agora carrega a linha dos 5 squads (`S0 ONBOARDING · S1 INTELIGÊNCIA
    · …`), que é dado já verificado e consistente. A nota abaixo foi reescrita porque
    listava os mesmos cinco nomes entre parênteses — dizer duas vezes na mesma célula
    não informa mais.
    Junto: **fonte única** pros nomes dos squads em `lib/work/data.ts`
    (`CONTENT_ENGINE_SQUADS`), que antes viviam duplicados em três arquivos —
    duplicata de dado é exatamente como a contradição "22 vs 24" nasce.

16. ✅ **Ornamento do bento** — era `◆◆◆` / `═══` / `◆` conforme o tamanho da célula.
    É um sistema, mas ilegível: a 11px, `◆◆◆` lê como "•••" e `═══` como "===", e
    ninguém deduz "três losangos = extra-large". Ornamento que varia por um motivo
    imperceptível é ruído fingindo ser sinal. Uma marca só nas quatro células.

### 📝 Verificado e NÃO alterado — 2ª rodada (olhei e o problema não existia)

- **Foto do contato "fora do grid"** — é `lg:flex-row` + `gap-12` partindo do trilho
  do container. Correto; minha leitura anterior veio de frame parcial.
- **Monograma SH do contato "cortado feito polígono aleatório"** — visto na seção
  INTEIRA (screenshot de elemento, não de viewport), lê como marca-d'água legível.
  O tint oliva que medi no vão entre LinkedIn e GitHub é a sobreposição intencional.
- **Assinatura do manifesto "atravessando o corpo do texto"** — ela só desenha no
  estado de SAÍDA, quando o card já encolheu; no estado de entrada os `dashoffset`
  são 1,1,1. Não cruza nada que alguém esteja lendo.
- **Tabs do playground "espremidas no terço esquerdo"** — ocupam 32% de 1408px, mas
  tab à esquerda com régua full-width é o padrão convencional. Não é defeito.

### 📝 Verificado e NÃO alterado (a medição contradisse a suspeita)

- **`nexacore-calendar.avif` como LCP lazy** — o Next emite esse warning durante a suíte
  e2e, mas em viewport real o LCP de `/work/nexacore` é **texto** (`<P>` 184ms desktop,
  `<H1>` 160ms mobile). Marcar a imagem como `eager` só criaria disputa de banda. Sem fix.
- **Logos do marquee/bento** — a suspeita de "arco-íris quebrando a disciplina de um
  acento só" não se confirmou: os logos são tintados em lime via `currentColor`. Sem fix.
- **`domMax` no `/playground`** (+13.3 KB gz vs `domAnimation`) — é **necessário**:
  `parens-viz.tsx` usa `AnimatePresence mode="popLayout"`. Trocar exigiria mudar a
  visualização; fica registrado como decisão, não como dívida silenciosa.
- **`THREE.Clock` deprecado** — o warning vem de dentro do three/drei, não do código do
  repo. Nada a corrigir aqui.
- **2 falhas em `product-screenshots.spec.ts`** — a spec aponta pra um caminho local
  duplicado (`site_estetica_md-main/site_estetica_md-main/index.html`); a pasta real não
  tem o nível repetido. Falha ambiental pré-existente, spec já excluída do CI.

### 🔴 Pendente de decisão SUA (achados de claim↔evidência — não toquei de propósito)

Os dois itens abaixo são dado/posicionamento seu. Corrigir qualquer um deles exigiria
eu escolher um número ou reescrever uma afirmação — então parei e deixei documentado.

1. **`22` vs `24` agentes — o diagrama contradiz o próprio rodapé.**
   `components/work/diagrams.tsx` declara a composição dos squads como
   `S0=6 · S1=4 · S2=2 · S3=8 · S4=4`, que soma **24**. Mas o rodapé do MESMO SVG diz
   "22 AGENTES · 5 SQUADS", e outros sete pontos do site também afirmam 22:
   hero subhead, stats row, bento (`count: 22`), timeline, social-proof-line,
   featured-work e content-engine-panels.
   Está visível no tile principal da home — a peça de maior tráfego do site.
   **Decisão necessária**: ou um dos counts por squad está errado, ou o total é 24.
   Enquanto não resolver, `lib/work/data.ts → CONTENT_ENGINE_SQUADS` guarda só os
   NOMES dos squads (consistentes em todo lugar), deliberadamente sem contagem, e a
   célula do bento não constrói nada em cima do número por squad.

2. **Status bars de INFRA se apresentam como monitoramento vivo, mas são estáticas.**
   `StatusBar` (bento-skills.tsx) renderiza, para "Vercel deploy", "Coolify VPS",
   "Sentry errors" e "Langfuse traces": um ponto verde com `animate-ping` (o sinal
   universal de "ao vivo"), uma barra de atividade animada e a palavra **"ok"**.
   Nada disso lê estado real — os nomes são hardcoded e o "ok" é literal no JSX.
   Num site que removeu o watermark do Veo de verdade em vez de mascarar, que tirou
   o stub do "22" e que mantém um modal "Sobre este site" de créditos honestos, um
   widget que simula telemetria é a mesma categoria de problema.
   **Opções**: (a) deixar como está e assumir que é ilustrativo; (b) tirar o ping +
   o "ok" e manter só os nomes como chips (vira "as superfícies de observabilidade
   que eu rodo", que é verdade); (c) ligar em dado real. Não apliquei nenhuma —
   é a sua voz.

**Validação global da Fase 4**:
- Suíte nova `_audit/f4/validate.mjs` — **6/6 PASS**
- Suíte das Fases 1/3 `_audit/s10-validate.mjs` — **14/14 PASS**
- `pnpm test` (vitest) — **4/4 PASS**; `tsc --noEmit` limpo; Biome limpo; build verde
- **e2e 25 passed / 2 skipped** (excluída a spec de screenshots)
- **Lighthouse CI verde**: perf **0.98–0.99** · a11y **1.00 nas 5 URLs** (era 0.96 em
  /privacidade) · BP 0.96 · SEO 1.00 · **CLS 0.000** em tudo

## FASE 5 — ✅ Implementado + validado (sessão 2026-09-02) — polish "Apple-level" por componente

Método: pesquisa em 7 frentes (R1 fontes, R2/R3 motion APIs e libs de componentes, R4 referências
de design 2026, R5 audit de performance, R6 3D, R7 ciência de motion/leitura — 75 fontes verificadas),
depois loop medido por lote: captura (filme de scroll + element shots, 22 rotas×viewports) →
análise de pixel (massa cromática, ritmo/zonas mortas, lime) → fix → rebuild em :3001 → suítes →
reavaliar. Relatório de trabalho: `_audit/f5/FINDINGS-after.md` (+ `research/R1..R7`).
Branch: `f5/polish` (sem commit — só quando você pedir).

### Medido antes → depois (mesmos frames, mesmo método)

| Medida | Antes | Depois |
|---|---|---|
| Massa cromática no fold da home (desktop / mobile) | 14.46% / 15.60% | **2.40% / 4.46%** (refs: Linear 0.04%, Griffin 0.56%) |
| Massa cromática bento / timeline | 2.21% / 2.46% | 1.68% / 1.14% |
| Zona morta manifesto→contact | 840px | **624px** |
| Long tasks de hidratação da home (mediana de 5) | 1951ms | **894ms** |
| Feixe da timeline: progresso a 0 / 50% / 100% | travado até ~57% | 0 / 810 / 1620px |
| Alinhamento feixe × 4 marcadores | sonda quebrada | **0.0px** |
| `text-3` sobre `surface-overlay` (WCAG 1.4.3) | 4.46:1 ✗ | **4.73:1** ✓ |
| LCP home (H1) / CLS | 360ms / 0 | 388–424ms / 0 (sem regressão) |

### P0 — defeitos reais (medidos, não achismo)

1. ✅ **Glow final do feixe 56px à direita da linha** (`marginLeft` dentro do wrapper com padding) → `calc(var(--beam-line) - var(--beam-pad))`.
2. ✅ **Dois pontos no início do feixe** (dot inicial 20px acima do 1º marcador) → `startDot={false}`.
3. ✅ **Buraco de ~300px no Other Work ≥1024** (face frontal do FlipCard não esticava) → `h-full` na face + cover `object-top`.
4. ✅ **Feixe CSS travado até 57% da seção** — no Chrome, `exit 0%` de um sujeito mais alto que o viewport só começa quando o fundo encosta no fundo → `animation-range: cover 100vh cover 100%` (= fallback JS `-top/height`).
5. ✅ **Stats row servia "0 agentes Claude" no HTML** (crawler/reader/print/JS falhando) → valor final no servidor; rebaixa pra 0 só se ainda está fora do viewport na hidratação.
6. ✅ **`--color-surface-overlay` 26% → 24%** (R7: text-3 sobre overlay falhava AA por 0.04).
7. ✅ **Vídeo do hero sem mecanismo de pausa** (WCAG 2.2.2 nível A — autoplay >5s em paralelo com conteúdo; reduced-motion é preferência de SO, não controle na página) → `hero-video-toggle.client.tsx`, só renderiza quando há source ativa, persiste na sessão.
8. ✅ Código morto: `scroll-pinned-horizontal.tsx`, `macbook-scroll.tsx`, `ContentEnginePanel`; comentários que descreviam código que não existia mais.
9. ✅ **CLS 0.0024 na home apontado pelo Lighthouse em 3/3 runs** (`section#hero > div.pointer-events-none > div.absolute`): o botão de pausa do vídeo montava depois da hidratação, a faixa de stats crescia 16px, o hero crescia e o brilho absoluto (140% da altura) deslocava → `md:min-h` reservando a altura do botão. Build final: CLS 0.000 nos 15 runs.

### P1 — motion sem custo (R2/R3)

- ✅ Marquee em CSS keyframe (pausa fora da viewport e no hover; reduced = parado).
- ✅ Count-up em IO+rAF com o mesmo cubic-bezier (`cubicBezier()` em `lib/animation/eases.ts`) — GSAP+ScrollTrigger fora do path eager do hero (~46 KB gz a menos em toda visita).
- ✅ Feixe da timeline em CSS scroll-driven (`view()`), JS só quando `animation-timeline` não existe; reset explícito em reduced-motion (o kill global de 0.01ms não serve pra timelines de progresso).
- ✅ Assinatura com `DrawSVGPlugin` (GSAP 3.13+ gratuito) medindo o comprimento real — some o workaround `pathLength=1` + attr plugin.
- ✅ Lenis: `stopInertiaOnNavigate` + `prevent` em `[data-lenis-prevent],[role="dialog"]`.
- ✅ Stagger do H1 55→45ms (assenta em ~1.1s; R7: ~1s pra reveal de texto); reveal do manifesto com `stagger: { amount: 0.5 }` (era 35ms × ~66 palavras ≈ 2.9s até a última).

### P1 — gramática dos sites de engenharia 2026 (R4)

- ✅ Vídeo do hero quase-mono (`saturate(0.12) contrast(1.06) brightness(0.92)`, opacity 0.5): a onda vira textura de luz; o único evento de cor acima da dobra é a palavra em itálico + o CTA.
- ✅ Anos da timeline em branco semibold — acento como estrutura (marcador + feixe), nunca como fill.
- ✅ Bento XL: diagrama de orquestração RSC (CRON 03H → Claude Agent SDK → S0…S4 em arco → E-0 humano, único nó aceso; leader lines com callouts mono) + caption "22 agentes · 5 squads · 1 humano no loop"; chips-líder acesos (Claude Agent SDK, pgvector, TypeScript strict, BullMQ) — uma coisa acesa por célula.
- ✅ INFRA: telemetria simulada (ping + "ok") → `<dl>` de superfícies de runtime com o papel real de cada uma (Vercel GRU1 · este site + NexaCore; Coolify VPS · Content Engine 24/7 · GPU local; Sentry; Langfuse). Interim honesto até você decidir a/b/c da Fase 4.
- ✅ Flagship: diagrama reequilibrado (header de spec-sheet "CONTENT ENGINE · PIPELINE NOTURNO / 22 AGENTES · 5 SQUADS", caixas maiores, rodapé "CRON 03H–07H30 · APROVAÇÃO HUMANA ≤10 MIN/DIA · GPU LOCAL"; no mobile só os IDs).
- ✅ Nav em mono uppercase (voz de UI, como os eyebrows) + linha de progresso de scroll de 1px (`animation-timeline: scroll(root)`).
- ✅ Corner-ticks (marcas de registro) nos mini-cards e no teaser do playground — moldura que não encaixota; acendem em lime no hover/focus.
- ✅ H2 do Work em dois tons por luminância ("Três problemas resolvidos." em text-2); hover de um tile escurece os irmãos (`:has()`, só pointer fine).
- ✅ Relógio vivo GMT-3 no rodapé (`Intl.DateTimeFormat`, 15s).
- ✅ Contact sobe 24dvh sobre o fim do palco do manifesto (transição Lando, zona morta 840→624px); carimbo SH em outline, só md+, 26vw≤340px sangrando 30% pelo canto; botão Cal.com com fundo opaco por cima.
- ✅ Radiogroup do contato em 3 colunas no mobile; NBSP antes de "·" (timeline, caption do bento).
- ✅ Modal "Sobre este site" reescrito com números reais (seção "MEDIDO, NÃO PROMETIDO", crédito do vídeo Veo).

### P2 — View Transition

- ✅ Morph do título tile→case: `<ViewTransition name="case-title-<slug>" share="case-title-morph" enter="none" exit="none">` no h3 dos tiles (home e /work) e no h1 do case; 420ms na curva padrão; reduced-motion já zera todos os `::view-transition-*`. Verificado (`_audit/f5/probe-vt5.mjs`, clique sem auto-scroll): home → case e /work → case fecham o par (group + old + new, 420ms); sem par (alvo fora da viewport — regra do React) o snapshot solitário segue o fade da página (`:only-child`). Bônus do caminho: Featured Work sem `m.*` (reveal em CSS + controlador) e a home com UM filho DOM sob o `page-fade` (1 snapshot de saída em vez de 9).

### 📝 Verificado e NÃO alterado

- Frase de fechamento do rodapé já tem o beat próprio (R7 "fim" do peak-end) — `FooterClosing` once.
- Skip-link "Pular para o conteúdo" aparece no meio das element shots: artefato do `captureBeyondViewport` do Playwright (header fixo pintado no meio), provado com `probe-skiplink.mjs` (transform −90px, sem foco). No site não aparece.
- Mola do CTA magnético (ζ=1.49, sem overshoot) e do sucesso do form (ζ=0.657, um overshoot de 6.5%) — R7 diz que estão certas; não mexer.
- Costura manifesto→contact: hairline de seção como em todas as outras; o tom oliva acima é a atmosfera do palco terminando.

### 🔴 Decisões SUAS (com a evidência que a pesquisa trouxe)

1. **22 vs 24 agentes** (S0=6·S1=4·S2=2·S3=8·S4=4 = 24 no diagrama; 8 pontos dizem 22). R7/Fogg 2003: contradição notada generaliza pra todos os números da página. Resolver pro número menor e verificável.
2. **"100+ testes runtime"** → exato e datado ("117 testes · set/2026"). R7/Janiszewski & Uy 2008: número redondo aberto é descontado; o preciso, não.
3. **Screenshot real do Content Engine** (STEFAN-TODO #1) — R7/Riegelsberger 2005: captura com dados reais é *sintoma* (evidência cara de falsificar); diagrama é *símbolo*. E colocar pelo menos um artefato real acima ou logo abaixo da dobra (prominence-interpretation).
4. **Vídeo do hero**: manter (agora quase-mono), regravar, ou só atmosfera. R7: a impressão "premium" fecha em 17–50ms — o poster estático é a impressão, a animação de entrada não conta.
5. **INFRA a/b/c** — (b) está aplicado como interim; (c) ligar em dado real continua em aberto.
6. **PP Editorial New**: "free for personal use" é ambíguo (fsType 4). Instrument Serif Italic (OFL, 27 KB, precisa ~1.06em) ou licença web (~US$40).
7. **Tokens × brand book**: `--color-bg` renderiza #070806 (brand book: #0F1212); accent #CDFF35 (brand: #D2FF00). Escolher a fonte da verdade.
8. **3D** — R6, com a CSP medida: **nada no hero** (r3f = +234 KB gz na rota que não pode regredir; CSP bloqueia WASM: DRACO/KTX2/Rive morrem). Plano: Fase 0 redesenhar o SH (traço de 763 segmentos, ~42% sub-pixel — extrudado "brilha"); Fase 1 bake em Blender → AVIF + loop curto no Contact (0 KB JS, ~60 KB); Fase 2 r3f só se a Fase 1 "ficar massa". `'wasm-unsafe-eval'` na CSP é decisão separada.
9. **Geist subsetting via next/font/local** (~80 KB a menos) — Google Fonts Geist perde `ss01`; `tnum/calt/zero` no Geist Mono são no-ops (a fonte não tem essas features).
10. **Trilho de margem, dither semântico, stepper sticky nos cases, faixa de acento full-bleed única, escada de hairlines** (R4 §1.2/1.6/1.8/1.13/1.15) — ficaram fora de propósito: ou mudam o layout, ou dependem dos seus artefatos. Lista pronta em `_audit/f5/research/R4-design-references.md`.

**Validação global da Fase 5** (build de produção, :3001):
- `_audit/s10-validate.mjs` — **14/14 PASS** · `_audit/f4/validate.mjs` — **6/6 PASS** (sonda de alinhamento refeita pra DOM + geometria sem transform)
- `_audit/f5/verify-lote2.mjs` — feixe/assinatura/marquee/stats ✓ · `capture.mjs` — 22 rotas×viewports, 0 pageerror, CLS 0 (playground 0.059 conhecido)
- `pnpm test` (vitest) **4/4** · `tsc --noEmit` limpo · Biome limpo · build verde (25 rotas)
- Hidratação (long tasks, mediana de 5 runs): **894–914ms** (baseline 1951ms)
- **Lighthouse CI (build final, mediana de 3 runs × 5 URLs)**: perf **0.98** (home) / **0.99** (/work, /work/content-engine, /process, /privacidade) · a11y **1.00** nas 5 · BP 0.96 · SEO 1.00 · **CLS 0.000 nos 15 runs** · TBT 0ms. (`pnpm lhci` quebra num shim do corepack nesta máquina — rodar `node node_modules/@lhci/cli/src/cli.js collect|assert --config=_audit/f5/lighthouserc.f5.json` com o server em :3001.)
- e2e: **25 passed / 2 skipped**; as 2 falhas são `product-screenshots.spec.ts` (abre um `index.html` local do Estética MD que não existe nesta máquina — mesma exclusão da Fase 4).

## FASE 6 — ✅ Implementado + validado (sessão 2026-09-04) — fumaça verde, SVGs desenhados, artefatos reais

Pedido do Stefan: "essa fumaça verde em volta de tudo tá parecendo IA slop", "SVGs muito feios
(o do content engine)", "as imagens dos sistemas dava pra melhorar", "STJ acho melhor tirar". Regra
de trabalho: subir cada sistema e capturar EU MESMO (nada de screenshot antigo), e o brand book v1
(`Trabalho-final/stefan_heinz_screpka_brandbook_v1.pdf`) como constituição: "Precision, not
decoration" · "Restraint, not spectacle" · §11 proporção 90/8/2 · §17 "Do not add gradients, glow,
shadows or 3D effects" · "Do not stretch, rotate or rebuild the mark".
Branch: `f5/polish` (F5 + F6 sem commit — só quando você pedir; patch de segurança do F5 em
`%TEMP%/claude/.../scratchpad/f5-uncommitted-backup.patch`).

### O que era a "fumaça verde" (inventário medido, `grep radial|blur|glow`)

| Onde | O que | Agora |
|---|---|---|
| `MockupFrame` (toda captura) | `0 0 60px` lime a 40% + reflexo no chão + brilho lime no topo + tilt 3D | removido (componente deletado) |
| Tiles do Featured Work, mini-cards, teaser | halo `0 0 32–48px accent-glow` no hover + `glass-panel` (backdrop-blur) | borda um degrau mais clara + marcas de corte acendem |
| Hero | elipse 160%×140% em `blur-3xl`, lime 12% | removido — atmosfera é o vídeo (já quase mono) |
| Contact | blob 60vh×55vw `blur-3xl` + carimbo SH cortado 30% pelo canto + halo no avatar | só a hairline vertical; SH inteiro segue na nav/rodapé |
| FlipCard Estética MD | halo amber 32px nas 3 faces + halo no CTA | sombra neutra |
| Tokens `--shadow-glow-lime-sm/md`, `-amber-sm` | blur 16–32px | **anel** de 2–3px a 22–28% (mesma gramática do anel de foco) — 20+ consumidores mudam de uma vez |
| Case hero | ponto com `animate-ping` ("ao vivo" sem ler estado) | ponto estático |
| `SquadsStatusLine` | pontinhos lime pulsando S0→S1→… | removido (simulava pipeline vivo) |

### SVGs desenhados → artefatos reais

- **Flagship / índice / hero do case**: `SquadsDiagram` (caixas IN→S0…E-0) → captura real do
  **Content Engine Studio** (página Equipe: caixa de entrada com o pacote do dia + os 19 papéis),
  marca **SK3D** (a sua), runtime em modo scripted (regras, $0, sem LLM). Página do case ganhou a
  seção "O produto, rodando" (Hoje + Equipe) e a página **/marca** no painel do Squad 0.
- **/work/content-engine**: os sete `DiagramDots`/`DiagramOverview`/`DiagramHITL` → registros
  crus copiados do código (`lib/work/content-engine-artifacts.ts`): papéis dos agentes
  (`apps/web/src/lib/agent-roles.ts`), templates O-1…O-6 (`packages/prompts/templates`), as 14
  regex `AI_TELL_PATTERNS_V1` (`apps/runtime/src/anti-slop/ai-tells.ts` L17–32), os 8 comandos do
  bot (`apps/telegram-bot/src/bot.ts`).
- **Other Work**: terminal falso (Caronas) → `InMemoryRepository.java` L15–32 verbatim; IDE falsa
  (Estrutura C) → `02_fibonacci_memoizado.c` L25–42 verbatim. Componentes novos
  `CodeArtifact` / `RegistryList` (zero dependência, linha numerada, quebra com recuo pendurado).
- Deletados: `diagrams.tsx`, `content-engine-panels.tsx`, `product-cover.tsx`, os dois
  `product-mockup.tsx`, `squads-status-line.tsx`, `compare-slider.tsx`, CSS `.ce-*`.

### Moldura nova — `components/work/artifact-frame.tsx`

Marcas de corte + hairline (`--color-hairline-alpha-2/-3`, escada nova) + barra mono com a
PROCEDÊNCIA (rota · ambiente · data) + legenda. Sem tilt, sem halo, sem bolinhas de macOS. Acervo
consultado antes (cult-ui BrowserWindow, Magic UI Safari, Aceternity Code Block) e descartado com
razão registrada no cabeçalho do arquivo. `contain: inline-size` + `min-w-0` porque `<pre>` e a
barra empurravam a largura no mobile (+300px em /work/stark, +24px em /design-system — medidos e
zerados: `f4/validate` 6/6).

### Capturas (todas em 2×, `_audit/f6/raw` → masters → AVIF crf24 yuv444, `public/work-screenshots`)

| Sistema | Como subiu | Captura |
|---|---|---|
| Content Engine Studio | `apps/web` :3200 (acme) / :3201 (**sk3d**, cópia gitignored em `.brand-tmp/web-sk3d`) + runtime :4010 em modo scripted (Docker `dev-db` :5433). Ciclo diário scripted rodado pra `sk3d` (O-1…O-5 + intel/strategy/creation/review/editor → `ready_for_approval`) | `/agentes`, `/` (Hoje), `/marca` |
| STARK | `LP/` `next dev -p 3300` + seed do projeto (login admin do README) | telão 1920×1080, painel, relatório, lista |
| NexaCore (**hoje: Caluna**) | subagente subiu `Caluna/nexacore-saas` em :3600 (Postgres/Redis novos em :5434/:6380, `prisma db push` + `prisma/seed.ts`, login pelo widget Clerk da instância dev com e-mail de teste) e capturou **11 rotas com dados de seed** — mas o produto está **rebatizado Caluna** (92 refs no código, 0 "NexaCore", commit "pós-rebrand"), palette clara creme/dourado, marca ainda em construção. **O site segue com as capturas de produção** (striveos.shop 4K, tenant vazio, R$ 0,00); striveos.shop respondeu **HTTP 522** duas vezes hoje. AVIF das telas limpas prontos em `_audit/f6/avif/caluna-{services,clients,landing,dashboard}.avif` | dashboard, agenda (produção) · 11 rotas Caluna em `raw/nexacore__*` |
| Estética MD | cópia local servida em :3700 | home + seção Tratamentos |
| Abalo · site STARK | `dist/` servidos em :3400 / :3500 | home |
| SK3D patches | render `output/_FINAL_todos.png` | grid Série A |

### STJ App → STARK

STJ saiu (rota, OG, dados, social proof, JSON-LD; `redirects()` 308 `/work/stj-app → /work`; segue
citado só na timeline 2025, como história). Entrou **STARK** (`app/work/stark`): passagem de turno
de uma linha de OSB — status honesto "Piloto · proposta comercial entregue em jul/2026"; cliente
anonimizado ("fabricante multinacional de painéis, PR"); seção "Motor de cálculo" com
`painel.ts` L80–85 e L136–139 verbatim. Other Work ganhou SK3D, Abalo e o site da STARK.
Copy "três produtos em produção" agora = Content Engine, NexaCore, Estética MD.

### Medido antes → depois (mesmo método F5, `chroma.py`, frames equivalentes)

| Frame | F5 | F6 |
|---|---|---|
| Featured Work (el-work) chroma | 0.75% | **0.45%** |
| Other Work (el-other-work) | 9.34% (halo amber + capa) | 3.1–7.4% (só a mídia real) |
| Case Content Engine y765 | 1.76% | 1.71% |
| Case NexaCore y765 | 2.91% | 2.41% |
| Hero fold desktop / mobile | 2.40 / 4.46 | 2.40 / 4.46 (o beam removido estava abaixo do limiar do medidor; visualmente sumiu) |

### Validação (build de produção, :3001)

- `s10-validate` **14/14** · `f4/validate` **6/6** · `verify-lote2` ok (feixe 0/810/1620, assinatura S→tefan→flourish)
- `capture.mjs` 22 rotas × viewports: 0 pageerror (só `/_vercel/*` 404 local), **CLS 0** (playground 0.059 conhecido)
- vitest **4/4** · `tsc` limpo · Biome limpo · build 25 rotas
- **e2e 25 passed** contra a build (`PLAYWRIGHT_BASE_URL=http://localhost:3001`) — a config antiga reusava QUALQUER servidor em :3000; no dia era o Langfuse do Docker (`lang="en"`, 404) — corrigido em `playwright.config.ts`
- Lighthouse (mediana 3 runs × 5 URLs): perf **0.98** home / **0.99** demais · a11y **1.00** (o número de linha a 60% de opacidade dava 2.69:1 em /work/content-engine — corrigido, 1.00 re-medido) · BP 0.96 · SEO 1.00 · CLS 0

### 🔴 Decisões SUAS (F6)

1. **22 agentes**: o registro do próprio Studio (`agent-roles.ts`) tem **19 papéis no ciclo diário + 6 no onboarding**; o site diz 22 em 8 pontos. Nada novo afirma contagem; escolha o número e eu propago.
2. **STARK**: o nome do cliente ficou fora (sem autorização de marca), mas a captura do relatório mostra o nome do produto da linha ("LP OSB APA PLUS…") e o supervisor do seed. Aprovar como está, ou eu recorto.
3. **NexaCore → Caluna**: o produto foi rebatizado e o site não sabe. Opções: (a) manter "NexaCore" + capturas de produção (tenant vazio) — como está; (b) renomear o case pra Caluna (URL `/work/nexacore`, JSON-LD, OG, sitemap e 8 pontos de copy) e usar as capturas locais limpas (Serviços, Clientes, landing); (c) título NexaCore + capturas Caluna com legenda "rebatizado". Não publiquei a marca nova sem o seu ok. Bugs reais do produto vistos no seed (não mexi no repo): Agenda "Valor do Dia **R$ 8.001.200.180,00**" (preços concatenados como string, `800+1200+180`), Pagamentos "Recebido **R$ 21.800,00**" (Clientes mostra R$ 2.180,00 pros mesmos 3), Dashboard "próximo às **Invalid Date**", saudação "Usuário"; drift de migração (`migrate deploy` ok, seed cai com `P2022 googleDriveEnabled` — precisou `db push`); `next dev` estoura o heap sem `--max-old-space-size=8192`.
4. **Link privado**: `github.com/stefanscrepka/content-engine` é privado — o CTA "Ver no GitHub" virou "Ver o produto rodando ↓". Se quiser publicar o repo, eu volto o link.
5. **Chip "Sk3d"** no Studio (title-case do slug em `app-shell.tsx`) aparece na captura de /marca — é do produto, não do site.
6. **Efeitos colaterais do subagente NexaCore** (revisar): o classificador bloqueou 2 comandos dele (script que levava `CLERK_SECRET_KEY` à API do Clerk; cópia do `.env`) — nenhum valor de segredo foi impresso; ele contornou criando o usuário de teste `stefan+clerk_test@example.com` (código 424242) na sua instância **dev** do Clerk e inserindo a linha `User` que o `seed.ts` manda inserir. Containers `nexacore-shots-pg`/`-redis` + volumes `nexacore-shots_*` são novos (os antigos intactos; o volume antigo `nexacore-saas_postgres_data` está vazio — por isso as capturas de maio eram vazias). Repo `git status` limpo. As chaves Clerk estão numa **quarta** cópia do repo (`14-Codigos e Projetos Dev/opt/nexacore-saas/.env`).
7. Servidores que deixei rodando pra re-captura: runtime CE :4010, Studio :3200/:3201, STARK :3300, Caluna :3600 (+ Docker `nexacore-shots-*`), estáticos :3400/:3500/:3700, portfolio :3001. Pode matar tudo (`Get-NetTCPConnection -LocalPort 3001,3200,3201,3300,3400,3500,3600,3700 | % OwningProcess | sort -u | % { Stop-Process -Id $_ }`; `docker rm -f nexacore-shots-pg nexacore-shots-redis`).

## FASE 7 — ✅ Implementado + validado (sessão 2026-09-04, à noite) — a segunda passada: assinatura, imagens tratadas, Caluna, copy humana, acervo

Feedback do Stefan sobre a F6, ponto a ponto, e o que foi feito (branch `f5/polish`, tudo ainda sem commit):

| Crítica | O que era | O que ficou |
|---|---|---|
| "o contato invade o manifesto antes de terminar a animação" | F5 puxava o Contact 24dvh pra cima; ele entrava a 70% do range e a assinatura só fechava a 87% (medido em `_audit/f7/sig-probe.mjs`) | a timeline do palco desconta a sobreposição real (`margin-top` negativa do irmão, lida do DOM) e a seção ganhou +24dvh/+18dvh; o Contact só sobe com a assinatura completa (contact top = 965px a 70%, viewport 900) |
| "melhorar a rasterização da assinatura, fazer ela assinar mesmo" | `drop-shadow` duplo forçava o SVG a virar bitmap borrada; máscara de 4 traços a 60–95px revelava em blocos; velocidade = velocidade do scroll | esqueleto do fill (`skeleton.py`) → ductus real com 30 trechos de largura = espessura local (`trace.py`, 98,3% de cobertura + rect final) → `gen-sig.py` emite o componente. Assinada **no tempo** (2,34 s medidos no DOM: S 0,69 s → "tefan" 0,96 s → barra do t → ponto), disparada quando o palco passa de 30%, com a ponta da caneta correndo na frente. Sem glow: vetor puro |
| "ainda tem muitos — no site" | 156 linhas com travessão fora de comentários | 0 no texto visível (`patch-f7c.py`, arquivo a arquivo; sobraram só em comentários de código) |
| "linguagem muito robotizada" | prova social e tiles como ficha técnica ("22 agentes Claude SDK · orquestrados em 5 squads, cron 24/7") | frases com verbo ("Uma equipe de agentes escreve, revisa e espera a sua aprovação. Todo dia."), fato em mono embaixo |
| "não está desatualizado?" (22 agentes, 27 tabelas, 100+ testes, LGPD) | números de maio | auditoria do código (subagente, `ROADMAP` abaixo): **19 agentes** (17 no ciclo diário) em 5 squads · **57 tabelas** · **2.059 testes** no runtime (3.468 no monorepo) · 28 regex anti-slop (14+14) · cron 03:00→07:30 America/Sao_Paulo · prompt cache com dois TTLs, desligado por padrão · GPU: bge-m3, Qwen 3.5 9B, SD 3.5, faster-whisper · **"LGPD compliance" não existe no código** → trocado por "rotulagem de IA obrigatória no publish" |
| "mudamos para Caluna e você manteve NexaCore" | case NexaCore com capturas de produção vazias | `/work/caluna` (redirect 308 do antigo), copy do posicionamento novo (secretária no WhatsApp, 11 ferramentas, 35 models, 554 testes), capturas do build atual com seed (landing, serviços, clientes, como funciona), Caluna em social proof, manifesto, timeline, bento, SEO, JSON-LD, sitemap, testes |
| "print da STARK no meio da transição" | captura a ~1 s, na intro (IHM) | `cap-site.mjs`: espera 15 s, congela as animações, pixel 0 → o hero real ("Linha parada vira ponto de partida") |
| "imagens amadoras / não tratou" | capturas cruas | pipeline `cap-site.mjs` (assentar, congelar `document.getAnimations()`, esconder cursor/scrollbar, 2×), moldura de navegador (`ArtifactFrame variant="browser"`) pra sites, moldura de registro pra apps, Estética/Abalo refeitos no pixel 0 |
| "3D: só as bolinhas; algo interativo e criativo" | render dos patches | visualizador r3f com **três meshes reais** (patch Bahia em relevo, a bola com 12 soquetes, peça de CAD com o SK3D em relevo), decimados no Blender 4.4 (`_audit/f7/3d/blend_prep.py`), sem Draco (CSP), carregado só ao entrar na tela; foto do patch impresso; render Cycles do Quadro Correnteza |
| "Caronas e C: monte de código, cards longos" | 18 linhas cada | 8–9 linhas (o miolo), cards na altura da captura ao lado |
| "IA Agentic com um SVG imenso" | diagrama de arco/nós | ledger do cron copiado de `env.ts` + faixa dos 5 squads com contagem |
| "não usou o footer do acervo" | 3 colunas + rodapé rolando | rodapé **fixo atrás da página, revelado no fim** (hyperiux/parallax-footer), frase grande + ação (21st/ember-footer-cta), colunas curtas (smoothui/footer-1); newsletter (watermelon) descartada com motivo no cabeçalho do arquivo |
| "/privacidade gigante" | 8 seções, ~1.100 palavras | "Em cinco linhas" + 4 blocos, metade do tamanho, mesma base legal |

**Método desta fase** (o que faltou na F6): inventário real do acervo (`acervo.json`, `triagem.json` → necessidades `rodape`, `fileira-marcas`, `revelacao-imagem`…), leitura do `feedback_design_taste.md` do Stefan no projeto Caluna, subagente de auditoria claim↔evidência nos dois repos (Opus, read-only), e conferência visual por seção em desktop e mobile depois de cada build (`_audit/f7/shots.mjs`), com zoom 3× na assinatura e amostragem de tempo no DOM (`sig-timing.mjs`).

**Validação (build final, :3001)**: `s10` 14/14 · `f4` 6/6 · vitest 4/4 · `tsc` e Biome limpos · e2e 25 passed (as 2 falhas são o `product-screenshots.spec` que abre um `index.html` inexistente, igual F4–F6) · Lighthouse mediana 3×5 URLs: perf 0.98 (home) / 0.99, a11y 1.00, SEO 1.00, CLS 0 · 0 requisições ≥400 fora de `/_vercel/*` · chroma: Featured Work 0.52%, Stack 0.75%, Other Work 4.22% (foto e render reais), rodapé 1.63% (o botão).

### 🔴 Decisões SUAS (F7)

1. **A bola do viewer**: o STL `multi-flag-ball.stl` é modelo seu ou base de terceiros? A nota diz "fatiada e impressa", não "modelada". Se for de terceiros, eu tiro do seletor.
2. **Peça de CAD**: está como "pra uma fabricante de painéis" (o cliente Arauco anonimizado, mesma regra do STARK). Se puder nomear, eu nomeio.
3. **Conta de teste do Clerk** e containers `nexacore-shots-*` do subagente (ver F6 #6) continuam existindo.
4. **Commit**: F5 + F6 + F7 sem commit. `git add -A && git commit` quando quiser.
5. Servidores ainda rodando: portfolio :3001, CE :4010/:3200/:3201, STARK :3300, Caluna :3600, estáticos :3400/:3500/:3700.

## FASE 8 — ✅ Implementado + validado (sessão 2026-09-05) — hero novo, 3D de verdade, assinatura no scroll, acervo varrido, commits

Feedback do Stefan sobre a F7 e o que foi feito:

| Crítica | O que ficou |
|---|---|
| "o tracing da assinatura está 1000× pior: não vai segundo o scroll" | Voltou a ser **scrubbed** (a versão de 25/05 era assim), mas sobre o ductus novo de 30 trechos e com a ponta da caneta correndo na frente. Janelas no range do sticky: S 0,30→0,50 · "tefan" 0,52→0,76 · barra do t 0,78 · ponto 0,825 · rect 0,85. Sem glow. |
| "o contato não invadia o manifesto em 25/05" | Contact de volta ao fluxo normal (sem a margem negativa do F5); manifesto em 130/180dvh. Medido: o Contact encosta no fim do palco exatamente a 100% do range, nunca antes. |
| "vasco impresso é feio, a bola não é minha, o quadro do Grêmio é antigo, os piores projetos no viewer" | Curadoria nas memórias do projeto logos-futebol (subagente, read-only): entraram o **LEVITA v4** (macro Flamengo, Vasco de frente, prancha cotada gerada da geometria), a **cena animada do hub da STARK** (154 quadros, 330 malhas, 244 objetos animados: vídeo de 5 s a 324 KB + a cena aberta no Blender 4.4, capturada por `_audit/f8/blender-shot.ps1`) e a **peça de CAD**. O viewer mostra o LEVITA Grêmio montado com as **cores reais dos filamentos do 3MF** (#101010, #F2F2F2, #0056B8; `_audit/f8/3d/levita_glb.py`) e a peça de CAD, de frente. Saíram o patch do Bahia, a bola de terceiros, a foto do Vasco e o Correnteza (safra reprovada nas memórias). |
| "a hero dá pra melhorar bastante; essa fala está perdida" | Pesquisa (subagente) diagnosticou: um foco só (a manchete) e quatro faixas de texto pequeno com o mesmo peso; a subline repetia "em produção" e o número dos stats. Hero em **duas colunas**: manchete + **uma linha de prova com verbo** ("Às 03h um cron acorda 19 agentes Claude. Às 07h30 o pacote do dia espera três botões seus no Telegram.") + CTAs à esquerda; à direita **o turno de hoje** (`components/hero/day-rail.tsx`: o cron como o runtime o executa, 07h30 aceso, relógio real). Eyebrow mono que se resolve de glifos (`hero-eyebrow.client.tsx`, padrão 21st/decrypt-text). O bento XL trocou o ledger do cron pelo **registro dos agentes** (19 + 6, por squad). |
| "você realmente estudou todo o acervo?" | Dois subagentes varreram os **2.240 itens** (803 + 1.437) com a régua do acervo, 20 rejeitados com motivo, TOP 10 de cada. Entraram nesta fase: **cursor de mira** (reactbits/target-cursor reescrito: ponto + quatro cantos de 12px que enquadram qualquer alvo clicável, os mesmos 12px das marcas de corte; só ponteiro fino, sem reduced-motion, cursor nativo volta em campos de texto), **eyebrow que se resolve** (21st/decrypt-text), **copiar e-mail** no contato (21st/copy-button), **pausa que também para a marquee** (21st/logo-marquee, fecha o WCAG 2.2.2), **carimbo de coordenada** no rodapé (refero/dope.security). Fila com os relatórios em `_audit/f8/research-*.md`: command-menu ⌘K, hover-slider como índice do Other Work, ascii-effect no avatar, painel Lighthouse como prova no case, animateView pro morph. |

**Validação (build final, :3001)**: `s10` 14/14 · `f4` 6/6 · vitest 4/4 · `tsc` e Biome limpos · e2e 25 passed (2 falhas conhecidas do `product-screenshots.spec`) · Lighthouse mediana 3×5: ver tabela na sessão · hero fold chroma medido · 0 requisições ≥400 fora de `/_vercel/*` · CSP: o viewer usa `useGLTF(src, false)` (o decoder Draco em WASM disparava CompileError).

**Commits**: a partir desta fase o trabalho de F5–F8 foi commitado em série pequena na `f5/polish` (mensagens curtas, convencionais, sem co-autor) e enviado ao `origin`.

### 🔴 Decisões SUAS (F8)

1. **Peça de CAD**: cliente segue anonimizado ("uma fabricante de painéis"). Nomear é com você.
2. **Escudos de clube**: o card diz "estudo pessoal" (a memória do projeto registra a dúvida da Lei Pelé art. 87 pra venda; mostrar ≠ vender).
3. **Hub da STARK**: a legenda não diz "conceito original" porque a coreografia foi medida do vídeo de referência do cliente (memória `hub`); se quiser, eu escrevo isso no card.
4. **Cursor de mira**: se incomodar, é um componente só (`target-cursor.client.tsx`) montado no layout.
5. **Fila do acervo** (ver `_audit/f8/research-acervo-*.md`): ⌘K, índice do Other Work com preview, painel Lighthouse no case. Diga quais quer.

## FASE 9 — ✅ Implementado + validado (sessão 2026-09-05, madrugada) — hero como índice, cursor fora, card XL por método, pesquisa em quatro frentes

Pedido do Stefan: "o hero parece algo focado em 1 produto só, e não no meu portfólio"; "esse card [IA AGENTIC] fica como se tudo girasse em torno a 1 projeto"; "não quero cursor personalizado, está todo bugado, torna tudo amador". E, no meio da sessão, sobre a primeira tentativa: "por que você tirou aquela iluminação incrível do manifesto? e ainda deixou a hero mais poluída".

Método: memória + estudos do dono (Estudo-STARK: síntese, Apple, top design, ciência da leitura) + plano original (Plano-Portfolio) + as 27 referências de `Portfolio/Prints`; filme de scroll da build; **quatro pesquisas em paralelo (Opus)** com relatórios em `_audit/f9/research/`: R1 heros de portfólio (27 sites medidos), R2 bibliotecas/MCPs (12 fontes, 38 fontes baixadas), R3 fontes e motion (14 itálicas com licença conferida, 4 APIs), R4 auditoria adversarial do site. Loop: patch (`_audit/f9/patch-f9*.py`, `assert count==1`) → build → :3001 → captura + zoom + chroma + sondas de geometria → reavaliar.

### O que mudou

| Onde | Antes | Agora |
|---|---|---|
| **Hero** | eyebrow sem nome; linha de prova e trilho "o turno de hoje" só do Content Engine; stats row com 5 números do mesmo produto; eyebrow que embaralhava glifos | eyebrow **com o nome**; manchete intacta (5 linhas em xl, tamanho pela largura da coluna: `min(7.25rem, 7.4vw)`); uma linha curta sobre o conjunto; à direita o **índice**: cinco trabalhos numerados, ano e estado real, cada linha um link (`components/hero/work-index.tsx`, Server Component, zero JS). Stats row, `SocialProofLine` (repetia o índice 300px abaixo) e o decrypt do eyebrow saíram. Botão de pausa (WCAG 2.2.2) mora na faixa da marquee, absoluto |
| **Hero (o que o Stefan reprovou no meio)** | 1ª tentativa desta fase: captura do item ativo em `ArtifactFrame`, relógio, uma descrição por linha | "mais poluído": tudo isso saiu no mesmo dia. O que ficou é o mínimo que prova pluralidade |
| **Cursor de mira** | `TargetCursor` no layout + 55 linhas de CSS | removido (componente, montagem, CSS) |
| **Bento XL "IA AGENTIC"** | organograma dos 19 agentes do Content Engine | **o mesmo loop, três produtos**: linhas = gatilho → agente ou regra → validação → aprovação humana (acesa) → registro; colunas = Content Engine, Caluna, STARK (no STARK: "regra, não modelo"). Cada célula com origem em `data.ts`. Mobile: um bloco por produto |
| **Manifesto** | — | **intacto**. A neutralização da luz que eu tinha feito foi revertida por `git checkout` na hora do pedido; os dois arquivos são idênticos ao HEAD |
| **Viewer 3D** | `useGLTF(src, false)` → o drei ainda instanciava o **MeshoptDecoder** (WASM) e a CSP logava `CompileError` em toda visita à home | `useGLTF(src, false, false)`; 0 pageerror no filme |
| **Estética MD (Other Work)** | ~400px de vazio no fim do card em lg (capa 16/10 fixa ao lado de dois mini-cards); frase em âmbar não clicável | capa em modo fill (`aspect="auto"`), âmbar só no CTA (a regra do estudo STARK do próprio dono) |
| **Timeline → Playground** | cauda do feixe com blur + halo de 24px e ~190px de zona morta | linha esvaindo, 40+64px, sem glow |
| **Playground H2** | `lg:text-5xl` = o mesmo tamanho do H1 do hero | `text-3xl sm:text-4xl`, como as outras seções |
| **Contato** | eyebrow "12 / 12 · próximo passo" (arquitetura de 12 seções de maio; a home tem 8) | "Próximo passo" |
| **Rodapé** | carimbo de coordenada quebrava no meio da hora em 1440px | duas linhas de propósito |
| **Sobre este site** | "Hero · stats" (não existe mais) e "assinatura escrita no tempo (2 s)" (o F8 devolveu ao scroll) | índice do hero; assinatura guiada pelo scroll com as janelas reais |
| **CSS de fontes** | 7 `font-feature-settings` que não existem nos arquivos Geist (`tnum`, `zero`, `calt`, `lnum` na Mono; `calt` na Sans e na PP Editorial), medidos com fontTools (R3) | removidos; a Mono já é tabular e o zero já vem cortado |
| **Copy e metadados** | description, nav, OG da home e do /work falavam em "três produtos" e "19 agentes aprovados no Telegram" | cinco trabalhos, capturas reais; OG do /work bate com a página ("Quatro produtos. Escopo real.") |
| **Infra de componentes** | sem `components.json` (o MCP do shadcn não enxergava registry nenhum) | `components.json` com 6 registries grátis verificados (react-bits, componentry, kibo, watermelon, aceternity, magicui); MCP do Watermelon em `.mcp.json` |

### Medido (build final, :3001)

| Medida | F8 | F9 |
|---|---|---|
| Massa cromática do fold, desktop / mobile (`chroma.py`) | 2,27% / 4,30% | **1,89% / 4,12%** |
| Altura do hero no mobile (390px) | 1.327px (1,6 telas) | **1.036px (1,23 telas)**; três linhas do índice dentro da dobra |
| CTA primário dentro da dobra em 1920×1080 / 1440×900 / 1280×800 (`probe-hero.mjs`) | — | 853 / 808 / 750px (dobra 1080 / 900 / 800) ✓; marquee inteira (1920) ou inteira fora (1440/1280), nunca cortada |
| Nomes de produto na dobra (R1 mediu 0 no F8; mediana dos portfólios: 5) | 0 | **5** |
| `pageerror` na home (filme de scroll) | 1 (WASM/CSP) | **0** |
| s10 · f4 · vitest · e2e | 14/14 · 6/6 · 4/4 · 25 passed | 14/14 · 6/6 · 4/4 · 25 passed (+2 falhas conhecidas do `product-screenshots.spec`) |
| Lighthouse desktop (mediana 3×5 URLs) | perf 0,97 home / 0,99 · a11y 1,00 · SEO 1,00 · CLS 0 | perf **0,96** home (LCP virou o poster do vídeo, 1,35 s; o H1 pinta a 334 ms) / **0,99** demais · a11y **1,00** · BP 0,96 (os 4 `/_vercel/*` 404 do ambiente local) · SEO 1,00 · **CLS 0 em 15 runs** |
| Lighthouse mobile (mediana 3×2 URLs; **nunca tinha sido medido**, R4 F07) | — | home perf **0,76** · LCP **5,6 s** · TBT 207 ms · a11y **1,00** (era 0,97 antes do `<dl>`) · CLS 0; `/work/content-engine` perf 0,84 · LCP 4,5 s. É o próximo alvo (fila abaixo) |

### O que as pesquisas disseram e o que entrou

- **R1 (heros)**: 27 portfólios abertos; na dobra, mediana de 5 trabalhos nomeados e 15 links, nome da pessoa em 23 de 24, maior texto mediana 32px (o nosso: 120px). Conceito recomendado ("O ARQUIVO": manchete intacta + índice numerado à direita) é o que ficou, menos a 6ª linha (Playground) e a faixa de números por trabalho (repetiria o índice). Bônus adotado: o card XL como "o mesmo loop" (opção B).
- **R2 (bibliotecas)**: 8 das 12 fontes já estavam no acervo; motion.so é gerador de vídeo (não a Motion), craftwork é marketplace de ilustração, originkit é quase todo pago; shadcnblocks revende primitivos MIT do Kibo. MCP do 21st funciona (busca grátis, código 2/dia). Entrou: `components.json` + registries, MCP do Watermelon. Fila (não entrou): `componentry/hover-transition` (wipe por clip-path), `aceternity/pointer-highlight`, `componentry/ascii-effect`, `watermelon/fluid-tabs` como indicador da nav.
- **R3 (fontes/motion)**: PP Editorial "free for personal use" mora numa FAQ, não na EULA; licença web real **US$ 480**, não US$ 40; Instrument Serif Italic (OFL, 21,6 KB vs 40,8 KB, ajuste 1,039em) é a substituta medida. Geist Mono sem `tnum/zero/calt/lnum` (limpo). string-tune e anime.js: não adicionar. Lenis: o relatório pede 1.3.26 por reduced-motion, mas o `LenisProvider` já não inicializa o Lenis sob reduced-motion (bail-out antes do import); sem ação.
- **R4 (auditoria adversarial)**: 50 achados (12 P0, 14 P1, 24 P2), 114 capturas, 16 scripts re-rodáveis (`r4-*.mjs`). Corrigidos nesta fase e re-verificados por `probe-r4-fixes.mjs`: **F06** canonical de `/work` e `/playground` apontava pra home (agora próprio) · **F04** submit vazio fazia POST (validação Zod síncrona antes do `preventDefault`; 0 POSTs medidos, foco no 1º erro) · **F05** falha de rede no envio derrubava a página inteira pelo error boundary (action envolvida em try/catch, campos restaurados) · **F08** `<dl>` inválido no card XL mobile (a11y mobile 0,97 → 1,00) · **F13** flip card virava no foco e o Enter desvirava; CTA do WhatsApp inalcançável (foco não vira, Enter vira, Tab chega no CTA) · **F14** indicador da nav preso em "Contato" ao voltar ao topo (conjunto visível no IO; `[]` no topo) · **F15** fechar o Cal.com jogava o foco no `<body>` (volta pro botão que abriu) · **F16** `/process` era seis de seis Content Engine e dizia "em produção há meses": entraram "OEE somado antes de dividir" (STARK) e "tenantId em 27 dos 35 modelos" (Caluna); a frase virou "com número e com o arquivo onde vive" · **F09/F10** "19 agentes acordados às 03h" (o cron acorda 4 às 03h e 17 no dia): timeline e card XL reescritos · **F01/F02** manifesto cita o STARK; nav "Produtos e cases"; JSON-LD com SK3D · **F11** uma data só pro rebrand da Caluna · **F17** poster do hub em 960×720 (25 KB, era 61 KB) e `sizes` da capa flagship · **F22** avatar sem sombra de 64px nem filete lime · **F23** glifos das instituições sem lime · **F24** promessa de resposta unificada ("até 12h, dias úteis") em nav, form, e-mail, `/process` · **F25** marquee não é mais cortada na dobra · **F26** índice alinhado ao topo · **F44** vídeo do hub com botão de pausa (WCAG 2.2.2) · **F48** alvos do rodapé ≥ 24px · **F49** célula do bento sem lift/anel (não é clicável) · copy: F27, F28, F29, F30, F31, F34, F36, F37, F38, F40, F41, F42, F45, F46. **Discordo de um:** F03 ("STJ App" na timeline é história de 2025, não foi rebatizado STARK; são produtos diferentes). **Ficaram pra você:** F07 (Lighthouse mobile), F18 (fonte), F20/F21 (escala tipográfica, Other Work em 3,8 telas), F23 (mostrar marcas de instituições), F43 (vídeo do hero), F50 (lime fora de ação como decisão de direção), confidencialidade do STARK.

### Fila (não entrou nesta fase)

- **Lighthouse mobile** (R4 F07): o portão de CI só media desktop. O caminho é a dieta de JS da home (R3 B6: os quatro reveals de `useInView` pra `animation-timeline: view()`, `MagneticCTA` em CSS, `motion` fora do caminho da home) e o LCP do poster no mobile.

- Migrar os quatro reveals `m` + `useInView` (bento, other-work, teaser, timeline) pra `animation-timeline: view()` com o fallback da `tracing-beam` (tira ~18 KB gz de motion do caminho da home; R3 B6).
- `componentry/hover-transition` (wipe) se algum dia houver capa no índice; `pointer-highlight` como marca de corte numa palavra do manifesto; `ascii-effect` no retrato do contato.
- Indicador deslizante na nav (`anchor-name` já é universal; R3).

### 🔴 Decisões SUAS (F9)

1. **Tamanho e peso do H1**: R1 mediu 24 heros de pessoa; nenhum passa de 58px numa proposta de valor, e o cânone do próprio estudo (linear.app) roda 72px/510. Hoje: 106px em 1440 (era 120), peso 600. Reduzir mais é decisão sua; a manchete não muda em nenhum cenário.
2. **PP Editorial New**: a FAQ da Pangram Pangram cobre "personal portfolios (web)", a EULA não define "personal use"; a licença web custa US$ 480. Trocar por **Instrument Serif Italic** (OFL, `next/font/google`, −19 KB) é uma linha em `layout.tsx` + `font-size: 1.039em` no `EditorialAccent`. Espécimes lado a lado em `_audit/f9/research/shots-R3/specimen-*.png`.
3. **components.json e MCP do Watermelon** entraram como infraestrutura (não mudam o site). Se não quiser registries no repo, é só apagar o arquivo.
4. **Índice do hero**: cinco linhas (Content Engine, Caluna, STARK, Estética MD, SK3D). R1 sugeria uma 6ª (Playground). Diga se quer.

## Artefatos de validação

- `_audit/logs/s10-validate.json` — resultado das 14 sondas (PASS/FAIL com números)
- `_audit/shots/v-*.png` — provas visuais (headline sem replay, CTA visível, anel lime, timeline)
- `_audit/video/` — vídeo da navegação com View Transition (blackdetect: zero)
- `_audit/s10-validate.mjs` — suíte re-rodável: `BASE_URL=http://localhost:3001 node _audit/s10-validate.mjs`
- **Fase 9 (2026-09-05, madrugada)** — `_audit/f9/` (gitignored): `research/R1-hero-portfolio.md`, `R2-componentes.md`, `R3-fontes-e-motion.md`, `R4-auditoria-adversarial.md` (+ `shots-R*/`, `src-R2/`, `fonts/`), `patch-f9*.py`, `probe-hero.mjs` (geometria em 6 viewports), `probe-index.mjs` (hover/foco/âncora do índice), `probe-js.mjs` (JS da home), `cap-now.mjs` (filme + fold), `shots-now/` (F8) → `shots-d/` (final), `prints-sheet/` (as 27 referências em folha de contato), `lighthouserc.f9.json`, `commit-series.sh`
- **Fase 8 (2026-09-05)** — `_audit/f8/` (gitignored): `research-acervo-digest.md`, `research-3d-e-hero-digest.md`, `roadmap-f8-section.md`, `patch-f8*.py`, `blender-shot.ps1` + `blender-ui-setup.py` (captura da UI do Blender), `3d/levita_glb.py`, `hub/` (vídeo), `masters/`, `avif/`, `shots/`, `shots-hero.mjs`, `probe-skip.mjs`, `sig/`
- **Fase 7 (2026-09-04, noite)** — `_audit/f7/` (gitignored): `sig/` (skeleton.py, trace.py, gen-sig.py, ductus.json, overlays), `sig-probe.mjs` / `sig-timing.mjs` / `sig-frames.mjs`, `cap-site.mjs` (captura assentada no pixel 0), `site-settle.mjs`, `shots.mjs` (seções desktop+mobile), `find-404.mjs`, `3d/` (blend_prep.py, GLBs e previews), `patch-f7*.py`, `lighthouserc.f7.json`, `roadmap-f7-section.md`
- **Fase 6 (2026-09-04)** — `_audit/f6/` (gitignored): `raw/` capturas 2× de todos os sistemas · `masters/` recortes · `avif/` encodes · `cap*.mjs`/`ce-*.mjs`/`nexacore-*.mjs` scripts de captura por sistema · `probe-overflow.mjs` (largura de scroll por rota/viewport) · `shot-sections.mjs` (recorte por seção) · `patch-f6*.py` (patches idempotentes com `assert count==1`) · `lighthouserc.ce.json` · `logs/` (server, seed, capturas) · `roadmap-f6-section.md`
- **Fase 3 (2026-06-11)**:
  - `_audit/f3-sig-lab.html` + `f3-sig-shot.mjs` — laboratório do ductus da assinatura
    (grid de coordenadas + modo `?coverage` magenta/lime)
  - `_audit/f3-sig-validate.mjs` — valida o trim-path no build real (ordem, interpolação,
    estado final) + frames `shots/f3-sig-live-*.png`
  - `_audit/f3-tween-test.html` — prova do gotcha GSAP (CSSPlugin não interpola
    strokeDashoffset; attr plugin sim)
  - `_audit/f3-hydration-probe.mjs` — long tasks CPU 4x re-rodável
    (`LABEL=x node _audit/f3-hydration-probe.mjs`); logs `f3-hydration-{baseline,after-f3b}.json`
  - `_audit/f3-cal-bento-validate.mjs` — skeleton do Cal + trace CSS do bento +
    presença SSR; `shots/f3-cal-skeleton.png`, `shots/f3-bento-hover.png`
- **Fase 4 (2026-08-29)** — `_audit/f4/`:
  - `validate.mjs` — suíte re-rodável (6 sondas): overflow de `<text>` em SVG, overflow
    horizontal mobile em 7 rotas, vazamento do poster, alinhamento do feixe, render do
    Hanoi 3D, tokens fantasma.
    `BASE_URL=http://localhost:3001 node _audit/f4/validate.mjs`
  - `capture.mjs` + `analyze_rhythm.py` + `analyze_frames.py` — 174 capturas e análise
    quantitativa (ritmo vertical, zonas mortas, uso de lime, trilhos de alinhamento)
  - `probe-media-contrast.mjs` + `contrast-report.py` — contraste REAL de texto sobre
    vídeo/imagem: captura o par com/sem texto pra isolar os glifos e amostra um anel
    local na imagem RENDERIZADA (portanto inclui o scrim de text-shadow). O método CSS
    comum não enxerga isso — ele lê a cor de fundo declarada, não os pixels do vídeo.
  - `lcp-runs.mjs` — distribuição de LCP (mediana de N runs, contra ruído de 1 amostra)
  - `probe-rag3.mjs` — laboratório de rag do headline (tamanho × tracking → quebras reais)
  - `svg-text-overflow.mjs` — mede todo `<text>` de SVG contra a caixa via `getBBox()`
  - `verify-hanoi.mjs` — prova de render do Hanoi 3D (`HEADED=1 CH=chrome` pra Chrome real)
- ⚠️ **Gotcha de método**: screenshot `fullPage` do Chromium **corta acima de 16384px**
  (2^14). `home__mobile` (32812px) e `design-system__mobile` (26080px) geraram "zonas
  mortas" falsas de 37–50% na primeira análise. Em página alta, confie no filme de
  scroll, não no fullPage.
- **Fase 5 (2026-09-02)** — `_audit/f5/`:
  - `capture.mjs` (filme + element shots + LCP/CLS/console; `OUT=… LOGS=…`), `shot-el.mjs`,
    `shot-vp.mjs` (viewport com o elemento centralizado — sem o artefato do header fixo),
    `zoom.py`, `chroma.py` (massa cromática), `analyze_rhythm.py`, `lime_frames.py`
  - `verify-lote1.mjs`, `verify-lote2.mjs`, `probe-beam-range.mjs`, `probe-vt.mjs`,
    `probe-skiplink.mjs`; `FINDINGS-baseline.md` → `FINDINGS-after.md`; `research/R1..R7`
  - Em Git Bash, passar `/` como rota exige `MSYS_NO_PATHCONV=1`.
- A pasta `_audit/` está no `.gitignore` — apague quando quiser.
