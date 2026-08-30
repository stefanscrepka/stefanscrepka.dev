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

## Artefatos de validação

- `_audit/logs/s10-validate.json` — resultado das 14 sondas (PASS/FAIL com números)
- `_audit/shots/v-*.png` — provas visuais (headline sem replay, CTA visível, anel lime, timeline)
- `_audit/video/` — vídeo da navegação com View Transition (blackdetect: zero)
- `_audit/s10-validate.mjs` — suíte re-rodável: `BASE_URL=http://localhost:3001 node _audit/s10-validate.mjs`
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
- A pasta `_audit/` está no `.gitignore` — apague quando quiser.
