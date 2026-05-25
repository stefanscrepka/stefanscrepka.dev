# Melhorias — Audit Multi-Agente (2026-05-24)

> Síntese de 5 agentes especializados (Performance, Mobile UX, Design, Motion, A11y/SEO/Copy) + screenshots Playwright em viewports mobile/desktop. Documento de referência pra próximas waves de polish.

---

## 🎯 Executive Summary

| Categoria | Score atual estimado | Wave necessária |
|---|---|---|
| Performance (CWV prod) | LCP ~2.8s · TBT ~450ms · TTI ~4.5s | **W-perf** (5 itens críticos abaixo) |
| Mobile UX/UI | 7.8/10 | **W-mob2** (refino fino, hierarquia) |
| Design (golden ratio + composição) | 8.6/10 | **W-design** (5 quick wins) |
| Motion design (Disney/Material/Apple) | 8.2/10 | **W-motion** (10 ajustes) |
| WCAG 2.2 AA | 94% | **W-a11y** (3 críticos + polish) |
| WCAG 2.2 AAA | 79% | (não-meta — AA é o gate) |
| SEO técnico | 88% | **W-seo** (9 winnings) |

**Diagnóstico**: o site está em **estado premium-grade** com arquitetura sólida. Não há refactor estrutural pendente — apenas ~30-40 polish items distribuídos em 6 waves curtas. Após aplicar W-perf + W-mob2, métricas atingem "Good" no CWV.

---

## 📸 Screenshots de referência

Capturas em produção (`pnpm start`) via Playwright, viewports:
- **Mobile**: 375×812 (iPhone 14/15 base)
- **Desktop**: 1440×900

Output em `screenshots-2026-05-21/`. 10 rotas × 2 viewports = ~20 fullpage + viewport caps.

---

## ⚡ W-perf — Performance (Production estimado)

> Baseline real: first-load JS home = 459 KB gzip. Production LCP estimado: 2.8s mobile 4G. Meta: <2.5s LCP, <200ms TBT.

### CRÍTICO 1: Contact form bundle vaza no first-load (~80 KB gz)
**Arquivo**: `app/page.tsx` (ContactSection já é `dynamic()` mas form subtree precisa lazy mount via IntersectionObserver)
**Por quê**: Zod runtime (37 hits) + react-hook-form + Motion = 80 KB gz que só importa pra INP do contact, não LCP.
**Fix**: extrair `<ContactForm>` (client) em wrapper `dynamic({ ssr:true, loading: null })`, mount via IO ao chegar a section.
**Effort**: 30min · **Risk**: ZERO (ssr:true mantém HTML estático)
**Impacto**: TBT −60-90ms, first-load gz −80 KB.

### CRÍTICO 2: `LenisProvider` static-import arrasta GSAP+ScrollTrigger (40 KB gz)
**Arquivo**: `components/providers/lenis-provider.tsx:8`
**Por quê**: import estático de `gsap-lenis-sync.ts` carrega GSAP+ST mesmo quando mobile/touch bail-eia. Ironicamente paga preço sem benefício.
**Fix**: dynamic import dentro do useEffect após bail-out:
```ts
if (reduced !== false || isTouch !== false) return;
const { initSmoothScroll, destroySmoothScroll } = await import('@/lib/animation/gsap-lenis-sync');
```
Mesmo pattern em `stats-row.tsx` e `partner-marquee.tsx`.
**Effort**: 1h · **Risk**: baixo (desktop demora ~200ms a mais pra ativar Lenis, imperceptível)
**Impacto**: TBT −120ms mobile, −40 KB gz, LCP −150-250ms 4G.

### CRÍTICO 3: `CalcomModal` eager (~25-35 KB gz)
**Arquivo**: `lib/contact/cal-modal-context.tsx:30`
**Por quê**: `<CalcomModal />` renderiza unconditional. `@calcom/embed-react` SDK no bundle de toda rota.
**Fix**: dynamic + gate por `open === true`:
```ts
const CalcomModalLazy = dynamic(() => import('@/components/contact/calcom-modal').then(m => m.CalcomModal), { ssr: false, loading: () => null });
{open ? <CalcomModalLazy ... /> : null}
```
**Effort**: 15min · **Risk**: primeira abertura demora ~150ms a mais (aceitável — é intencional)
**Impacto**: −25-35 KB gz, TBT −40-60ms.

### CRÍTICO 4: `AboutThisSiteModal` eager (`app/layout.tsx:193`)
**Por quê**: Easter-egg renderizado sempre, só abre via hash `#about-this-site`.
**Fix**: dynamic + hash gate. Mesmo pattern do #3.
**Effort**: 20min · **Risk**: ZERO · **Impacto**: −5-10 KB gz.

### CRÍTICO 5: SplitTextHeadline reveal pinta DEPOIS do LCP
**Arquivo**: `components/hero/split-text-headline.tsx:60-77`
**Por quê**: `gsap.set(opacity:0)` no useEffect → animação chega após idleCallback. Lighthouse mede LCP no momento das letras visíveis (não no DOM mount).
**Fix**: adicionar `anim-pre-hidden` no `<h1>` SSR, remover via `MotionProvider` RAF. Headline pinta junto do paint inicial.
**Effort**: 1h · **Risk**: gate de timeout 800ms já compensa devices lentos
**Impacto**: LCP −300-500ms mobile 4G.

### ALTOS 6-10

| # | Item | File | Effort | Impacto |
|---|---|---|---|---|
| 6 | Hero poster AVIF 51KB → 25KB | `public/bg/hero-poster.avif` | 15min | LCP −80-150ms |
| 7 | LazyMotion features split (`domAnimation` global, `domMax` só /playground) | `motion-provider.tsx` | 30min | −5 KB gz, TBT −10-20ms |
| 8 | `gsap.registerPlugin(ScrollTrigger)` ao top de 5 arquivos | `manifesto.tsx`, `stats-row.tsx`, etc | 30min | TBT −30-50ms |
| 9 | CSS bundle 100KB raw / 17KB gz auditar (Tailwind v4 + tw-animate-css) | `globals.css` | 1h | FCP −80-120ms |
| 10 | `priority` no primeiro CaseStudyCover (Content Engine) | `featured-work.tsx` `<HeroTile>` | 20min | LCP −200ms se virar cover |
| 11 | `FibonacciViz` + `ParensViz` static imports → dynamic | `playground-page.tsx:9-10` | 15min | /playground first-load −80-120 KB gz |
| 12 | Preload AVIF poster (foi removido, re-adicionar com `type="image/avif"`) | `app/layout.tsx <head>` | 5min | LCP −150-300ms (se hero-poster for LCP element) |

**Estimativa pós-fix #1-9**: first-load gz 459KB → **310-330 KB** | LCP 2.8s → **1.9-2.2s** | TBT 450ms → **150-200ms** | TTI 4.5s → **2.8-3.2s**.

---

## 📱 W-mob2 — Mobile UX/UI refino

> Estado mobile já com correções W-mob (Lenis off touch, MacBookScroll static, Manifesto 130vh, safe-area, inputs 16px). Resta polish fino de hierarquia + spacing.

### Críticos (5)
1. **Hero H1 `text-4xl !leading-[0.92]` em 375px** — `components/sections/hero.tsx:115`. 60px font + 55px line-height + 6 palavras → quebra ruim em iOS 16. Verificar `text-wrap:balance` real comportamento.
2. **FeaturedWork tiles `gap-12 sm:gap-16` mobile** — `featured-work.tsx:55-76`. 48px gap entre tiles em 343px net width = scroll fatigue 3 cards × 600vh+. Reduzir gap mobile + considerar `aspect-[16/10]` mobile uniforme.
3. **Manifesto backdrop nome `clamp(120px, 18vw, 280px)` em 375px = 67.5px** — `manifesto.tsx:217`. MENOR que hero H1 (60px+) → hierarquia invertida. Aumentar mín pra `clamp(90px, 22vw, 280px)`.
4. **container-max padding-inline 1rem (16px) + tile p-5 sm:p-7** — math: 375 − 16×2 − 20×2 = **303px innermost** pra texto. `max-w-prose` (72ch) extrapola = reflow ruim.
5. **`section-pad-y` mobile = 87px × 12 sections = 2.1MB de padding puro**. Reduzir `clamp(3rem, 5vw, 7rem)` mobile.

### Altos (8)
- `--text-2xs` 11px + `tracking-widest` 0.16em em eyebrows mono = apertado em 375px. `tracking-wide` (0.08em) abaixo `sm:`.
- `container-max` overflow horizontal mobile com `max-w-prose` (504px) em 343px net.
- `bento-skills.client.tsx:147` count "22" `clamp(5rem, 12vw, 9rem)` = 45px mobile — sem breathing room.
- Hero `pt-28 pb-12 sm:pt-32 sm:pb-16` — 160px vertical margin mobile. Reduzir `pt-20 pb-8`.
- Avatar contact `h-44 w-32` em column single — stack excessivo. Reduzir `w-28` ou crop tight.
- Footer 3-col `gap-10` no stack mobile = 40px. Reduzir `gap-6 sm:gap-10`.
- ContactForm pill radio "Cal.com 15min" longest — abreviar pra "Cal.com" mobile ou stack vertical.
- Case study covers (Hero 16/10, Half 4/3 e 16/9) sem mobile aspect override.

### Médios (9)
- Subhead `text-sm sm:text-base` em 343px = 3-4 lines mono → considerar reduzir max-w-prose mobile.
- BentoSkills cells `p-6 sm:p-7` reduzir `p-4 sm:p-6` mobile.
- Manifesto pin range 203px (130vh − viewport) → swipe hint visual ausente.
- ContactForm inputs `h-12 text-base` mobile — h-12 OK, mas `text-sm sm:text-base` evita placeholder vazar.
- Tap targets footer/links: hairline buttons 30-36px height — abaixo de 44pt.
- Spotify widget no Hero (já removido?) — confirmar e remover do código se sim.

---

## 🎨 W-design — Design system + composição

> Tokens OKLCH + Tailwind v4 + Geist + PP Editorial são premium-grade. Refinos abaixo são todos sub-1h e não-destrutivos.

### EXCELENTE (preservar)
- `lg:grid-cols-[1.55fr_1fr]` no HeroTile ≈ φ (1.618) ✓
- Lime A oklch(94% 0.22 124) sobre dark 13% = APCA Lc ~88 (AAA)
- `--color-amber-*: initial` nullify Tailwind defaults (premium engineering)
- Hairline alpha duas variantes (solid + alpha) replica Linear/Vercel
- Geist Sans display + body com `font-optical-sizing: auto`
- `text-balance` universal em h1/h2/h3 + `font-feature-settings: 'ss01' 1` global

### Top 5 melhorias (priorizadas por impacto/esforço)

1. **Trocar `glass-panel` por surface opaco nos BentoCells** (~5min)
   - Remove ambiguidade de layer (5º layer com alpha 0.55 sobre dark fica ambíguo)
   - Ganha cinematic, sem custo de backdrop-filter

2. **Variar lime usage — 60/30/10 enforcement** (~10min)
   - Hoje lime aparece em 14-18% (eyebrows + bullets + accent borders + hover glows + signature) — passa de 10%
   - Trocar bullet dots `bg-(--color-accent)` por `bg-(--color-text-3)` nos HalfTile highlights (manter só no HeroTile)
   - Reforça poder semântico de "atenção aqui"

3. **PP Editorial italic 2× a mais** (~15min)
   - Hoje aparece SÓ em "multi-agente" do hero — tão raro vira invisível
   - Manifesto ATO 4: substituir uma palavra-chave
   - Contact section: "Tem algo *complexo demais* pra virar landing genérica?"
   - Cria leitmotiv tipográfico — 3 batidas pelo site

4. **Mobile line-height override** (~5min)
   - `--text-5xl--line-height: 1.0` em viewports `<640px`
   - Corrige descender collision em "multi-agente" italic (descendentes q/g/y colidem)

5. **Type scale 1.5 ratio nos extremos** (~30min + validação visual)
   - Ratio 1.333 perfect fourth é "safe" — Linear/Vercel usam 1.25, editorial usa 1.5-1.618
   - `--text-5xl: clamp(5rem, 3.5rem + 7vw, 7.5rem)` (+11%)
   - `--text-6xl: clamp(7rem, 4rem + 15vw, 10rem)` (+11%)
   - Cria gap dramático nos extremos, sem refazer scale toda

### Refinos opcionais
- **Rule of thirds no Hero**: focal point cai top-left, vazio bottom-right. Considerar microcard "agora em produção: Content Engine" na coordenada áurea direita.
- **Aspect ratio φ (13/8 ou 21/13)** em UM cover dominante (HeroTile Content Engine) — silêncio visual sutil.
- **Closing line variação**: "Se não roda às 3h da manhã, não conta. — stefan ✺" (concreto vs abstrato 24/7) OU "24/7 ou nada. — stefan ✺" (brutalist).
- **Eyebrow "FEATURED WORK"** → "→ Três produtos" minúsculo italic (quebra padrão tech 2018-2024).

---

## ⚡ W-motion — Motion design refino

> Stack: Motion 12 + GSAP 3.15 + Lenis 1.3 + 8 eases tokens. `useReducedMotionSafe` ubíquo.

### EXCELENTE (preservar — signature)
1. SplitTextHeadline (idle GSAP + LCP-friendly + Disney Slow In/Out)
2. Manifesto Lando-sticky (h-200vh + sticky-top, não GSAP pin — Awwwards-grade)
3. TracingBeam scroll-linked (useSpring smoothing)
4. Squads status line loop 750ms ("produto vivo" — narrative)
5. MagneticCTA spring 150/20/0.3 (Apple HIG soft spring)

### Top 10 melhorias

| # | Componente | File:Line | Fix | Princípio |
|---|---|---|---|---|
| 1 | PartnerMarquee | `partner-marquee.tsx:50` | `duration: 50s` ignora `--motion-marquee: 40s` token. Sincronizar via `getPropertyValue` ou hardcode 40 | Consistência |
| 2 | FeaturedWork tile reveal | `featured-work.client.tsx:19,45` | Cards entram todos `x:-24`. Half-tiles espelhados devem mirror: left x:-24, right x:+24, hero y:24 | Disney Arc |
| 3 | BentoSkills entrada | `bento-skills.client.tsx:50-57` | `EASES.snappy` overshoot em grid de 6 cells gera ruído coletivo. Trocar `EASES.outQuint` ou `dramatic` | Material standard-decelerate |
| 4 | Timeline marker reveal | `timeline.client.tsx:29-36` | Stagger 50ms + 12-14rem spacing → última marker animação separada do scroll. Trocar pra `whileInView` per marker com `viewport amount: 0.3` | Disney Timing |
| 5 | Hero CTA stagger | `cta-group.tsx:32` | `delayChildren: 0.6` muito alto (CTAs aparecem 600ms+ depois). Reduzir 0.3 ou amarrar a `splitText.completed` | Material hero CTA 200-400ms |
| 6 | MarkerDot inView feedback | `timeline.client.tsx:171-186` | Falta Follow Through. Adicionar `bounce-once 600ms ease-out` no `onVisible` trigger | Disney Squash & Stretch sutil |
| 7 | ScrollPinnedHorizontal ease | `scroll-pinned-horizontal.tsx:94-96` | `ease: 'none'` + `scrub:1` = navegação binária. Trocar `scrub:1.2` ou `ease:'power1.inOut'` (absorbe jitter trackpad) | D'Silva |
| 8 | FlipCard anticipation | `flip-card.tsx:112` | Sem wind-up. Adicionar `scale 1→0.98→1` mid-rotation + duration 0.7 + `[0.65,0,0.35,1]` | Disney Squash & Stretch |
| 9 | StatsRow count-up duration | `stats-row.tsx:98` | `duration: 1.5` constante pra 22, 27 e 100 — 100 sente 4.5× mais rápido. Trocar `0.6 + log10(target) * 0.4` | D'Silva perceived speed |
| 10 | Footer hairline estática | `footer.tsx:60-67` | Adicionar `@keyframes hairline-breathe` 4s ease-in-out infinite (`opacity 0.4 → 0.6`), paused em reduced-motion | Awwwards 2025 trend |

### 5 Oportunidades novas

1. **CSS scroll-driven animations** (Chrome 115+, Safari 26+) — `animation-timeline: view()` no MarkerDot, dispensa useScroll JS. `@supports` fallback.
2. **Diagonal stagger no BentoSkills** — delay por `row+col` em vez de linear order (top-left → bottom-right).
3. **Magnetic hover em SVG diagrams** — dots de `DiagramDots` (content-engine-panels) ganham micro-translate(±2px) com delay aleatório no hover. Linear/Vercel data-viz pattern.
4. **View Transitions API** — Next 16 + Chrome 111+. Shared element transition entre tile cover (FeaturedWork) e case-study hero. `transition-name` matching. Cinematic.
5. **Scroll-velocity-driven grain intensity** — `grain-overlay.tsx` reactive: scroll rápido → opacity 0.04→0.08 (filme analógico em movimento). Lenis expõe velocity → useMotionValue + spring.

---

## ♿ W-a11y — WCAG 2.2 AA polish

> Score atual estimado: **AA 94% · AAA 79%**. Base sólida (skip-link, focus-ring 3px, JSON-LD, reduced-motion universal). Achados abaixo fecham AA + AAA optional.

### CRÍTICOS (3)

1. **`<main>` duplicado em `not-found.tsx`** — `app/not-found.tsx:5`. Layout já provê `<main id="main">`. **Fix**: trocar pra `<div>` ou `<section>`.

2. **Footer `<a href="#about-this-site">` quebra a11y do dialog** — `footer.tsx:167`. Screen reader anuncia "link" não "button opens dialog". **Fix**: `<button aria-haspopup="dialog" onClick={...}>`.

3. **`<blockquote>` sem `cite`** — `manifesto-body.tsx:44`. Adicionar `cite="..."` + `<footer><cite>Stefan Heinz Screpka</cite></footer>` interno.

### MÉDIOS (7)
- `role="progressbar"` em `<span>` com `aria-hidden` — `scroll-pinned-horizontal.tsx:191`. Remover role ou expor com aria-label.
- Cal.com modal iframe sem fallback de loading semântico — `calcom-modal.tsx:103-105`. Adicionar `aria-live="polite" aria-busy={true}` + sr-only "Carregando agenda Cal.com..."
- `--color-text-3` AAA-only — 4.6:1 sobre base = AA ✓, AAA ✗ (7:1). Documentar como decisão deliberada AA ou subir pra `oklch(73%)`.
- `<article>` decorativos sem `aria-labelledby` em `other-work.tsx:106`.
- Aspas curly inconsistentes — `manifesto-body.tsx` usa `"…"` (U+201C/U+201D), resto usa ASCII `"`. Padronizar PT-BR.
- Datas em formato misto (timeline em-dash, privacidade longo, footer puro). Adicionar `<time datetime="">` em todos.
- Heading outline `/process` — `<ol>` linha 146 envolvendo `<h2>` é semanticamente confuso. Trocar pra `<section>` semantic com cada step como `<h2>`.

---

## 🔍 W-seo — SEO winnings

1. **JSON-LD `CreativeWork` ou `SoftwareApplication` por case study** — `app/work/{slug}/page.tsx`. Indexar Content Engine, NexaCore, STJ App, Estética MD como obras autorais com `creator: Person@id`.

2. **JSON-LD `BreadcrumbList`** — `/work/[slug]` e `/process`. Breadcrumb "Home › Work › Content Engine". +1-2% CTR SERP.

3. **Person schema `@id` ausente** — `app/layout.tsx:81-133`. Adicionar `"@id": "https://stefanscrepka.dev/#person"` para ligar cross-schema.

4. **OG image dedicada faltante** — `/process`, `/privacidade`, `/playground`, `/work` não têm `opengraph-image.tsx`. Adicionar.

5. **Sitemap.ts faltam rotas** — `app/sitemap.ts:7-40` sem `/process` nem `/privacidade`.

6. **`<time datetime>`** ausente em timeline + privacidade. SEO + a11y win combinado.

7. **`hreflang`** PT-BR + `x-default`. `metadata.alternates.languages`.

8. **Easter egg console** — discoverable via `/about-this-site` modal pra audiência não-dev.

9. **OG card preview** — confirmar que Twitter card render `summary_large_image` aponta pra imagem dedicada.

---

## ✏️ W-copy — Microcopy review

| Local | Atual | Sugestão | Motivo |
|---|---|---|---|
| `cta-group.tsx:50` | "Ver os produtos →" | "Ver os 3 produtos em produção →" | Specificidade — número + outcome |
| `cta-group.tsx:66` | "Conversar 15min →" | "Agendar 15min →" | "Agendar" = action verb claro |
| `direct-links-row.tsx:147` | "Cal.com 15min" | "Reservar 15min · Cal.com" | Verbo first, brand sufixo |
| `not-found.tsx:7` | "404 — pipeline quebrado" | "404 — rota não encontrada" | "Pipeline quebrado" é jargão; universal mantém técnico |
| `contact.tsx:91` | "vamos conversar" | "próximo passo" | "Vamos conversar" cliché agência |
| `contact-form.client.tsx:397` | "Resposta em <12h em dias úteis." | "Respondo em até 12h · dias úteis." | Voz ativa + separador visual |
| `bento-skills.tsx:87` | "stack que entra em produção" | "Stack em produção" | Drop verbosity |
| Footer closing | "Se não funciona 24/7, não conta. — stefan" | "Se não roda às 3h da manhã, não conta. — stefan ✺" (variação A) OU "24/7 ou nada. — stefan ✺" (variação B brutalist) | Concreto > abstrato |

### Microcopy EXCELENTE (não mexer)
- "AI Product Engineer · três produtos rodando 24/7"
- "Recebido. Respondo em <12h." (contact form success)
- "Três produtos. Três posturas." (FeaturedWork header)
- "Disciplina, não milagre." (process punchline)
- "Não vendo 'ajudo empresas a inovar'. Vendo entrega que paga conta." (manifesto)

---

## 🎯 Plano de execução priorizado

### Sprint 1 — Performance (3-4h)
- W-perf #1 ContactForm IO mount
- W-perf #2 LenisProvider dynamic
- W-perf #3 CalcomModal dynamic
- W-perf #4 AboutThisSiteModal dynamic
- W-perf #5 SplitTextHeadline pre-hide CSS
- W-perf #6 AVIF re-encoder

**Esperado**: LCP 2.8s → 2.0s, TBT 450ms → 200ms.

### Sprint 2 — Mobile refino (2-3h)
- W-mob2 críticos 1-5 (hero H1, tile gap, manifesto backdrop, container padding, section-pad-y mobile)
- W-mob2 altos 1-3 (tracking, eyebrows, count "22" breathing)

### Sprint 3 — Design polish (1-2h)
- W-design top 5 (glass-panel → surface, lime usage, PP Editorial 2×, line-height mobile, type scale 1.5)

### Sprint 4 — Motion refino (2-3h)
- W-motion top 5 fixes (marquee duration, tile reveal mirror, bento ease, timeline stagger, CTA delay)
- 1-2 oportunidades novas (CSS scroll-driven OR View Transitions)

### Sprint 5 — A11y + SEO + Copy (1-2h)
- W-a11y 3 críticos
- W-seo 9 winnings (schemas, sitemap, OG images, hreflang)
- W-copy microcopy review (8 ajustes)

**Total estimado: 9-14h de trabalho focado** distribuído em 5 sprints curtos. Cada sprint independente — pode commitar/pushar entre eles.

---

## 📚 Referências utilizadas

- Material Design 3 motion-spec 2025
- Apple HIG 2026
- Pasquale D'Silva Motion Design 2024
- Awwwards SOTD 2025 medians
- Linear.app · Vercel.com · brittanychiang.com · paco.me · rauno.me · leerob.io
- WCAG 2.2 specification
- Disney 12 Principles of Animation (Ollie Johnston)
- Lighthouse 12.6.1 / axe-core 4.10

Documento gerado em 2026-05-24 por 5 agentes paralelos sob coordenação Claude Opus 4.7.
