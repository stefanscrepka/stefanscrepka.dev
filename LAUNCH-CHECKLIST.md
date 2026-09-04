# Launch Checklist — stefanscrepka.dev

> Consolidado de 10 auditorias paralelas em 2026-05-25.
> Cobertura: Visual · Performance · A11y · SEO · Code quality · Mobile · Copy · Animation · Deploy · Security.
>
> **Veredito**: o site tem **ossos Vercel/Linear-tier** (tokens OKLCH auditados, leitmotif tipográfico, magnetic CTA restrito, Lenis/GSAP sync canônica, reduced-motion 95% compliance, server/client boundary explícita, Zod compartilhado). Mas **não está pronto pra launch público** por causa de:
>
> 1. ferimentos visuais expostos (3 cases sem screenshot real, ✺ glyph violando brand em 4 lugares, hero video AI-slop, manifesto stub "22" admitido em código)
> 2. blockers de deploy (sem `global-error.tsx`, sem CSP, Sentry source-maps off, rate limit ausente, bundle 3× acima do alvo)
> 3. blockers de a11y WCAG AA (8 itens corrigíveis em 2–3h)
> 4. blockers mobile (FlipCard Estética MD literalmente unreachable em touch, 100vh em vez de dvh, PWA iOS incompleto)
> 5. risco LGPD real (Sentry Session Replay sem masking captura textos do form)
>
> **Caminho até "Apple/Vercel-tier launch"**: ~3 a 5 dias de trabalho focado.
>
> Itens marcados `[BLOCK]` não podem ir ao ar. `[HIGH]` lance se quiser, mas o gap pra Apple/Vercel é visível. `[MED]` é polish que falta. `[LOW]` é nice-to-have pós-launch.

---

## Sumário executivo — 5 mudanças que mais movem a agulha

1. **Entregar screenshots reais** para Content Engine + NexaCore (substituir SVG diagrams nas covers). Sem isso o flagship é "freelancer com mockups".
2. **Resolver os 5 showstoppers de deploy** (CSP, global-error, Sentry wrapper, rate limit, bundle). 1 dia de trabalho.
3. **Fechar os 8 a11y blockers** (`<main>` aninhado, SheetTitle, FlipCard, heading order, focus indicators, `#after-pinned` quebrado, `role="alert"` duplo, video pause). 2–3h.
4. **Mobile basics** (FlipCard touch, `dvh` no manifesto, `-webkit-tap-highlight-color`, PNG icons PWA iOS, button sizes 44px). ~12h.
5. **Trocar `Next 16` por `Next.js` no hero subline** (resolve inconsistência com cases Next 14/15) + reescrever subline pra ser específica ("22 agentes Claude SDK aprovados via Telegram") em vez de stack-list genérico.

---

## BLOCKERS — não pode lançar com isso

### Visual / Brand

- [ ] **Remover `✺` glyph das 4 ocorrências** — viola memória `user_brand_glyph_not_marca`. Refactor antigo não foi limpo.
  - `components/sections/bento-skills.tsx:85`
  - `components/sections/manifesto-body.tsx:178`
  - `components/sections/footer.tsx:161`
  - `app/layout.tsx:192` (easter-egg console)
  - **Fix**: substituir por `<SHMonogram size={10}>` em mini ou bullet `·` lime.

- [ ] **Substituir hero video "anime/swirl"** (`components/sections/hero.tsx:51-74`) — é o maior anti-pattern visual do site, "AI slop atmospheric". Vercel/Linear nunca usariam.
  - **Fix**: loop curto MP4 do terminal/log do Content Engine real (Telegram approval), OU WebGL custom (partículas representando squads), OU só radial lime + grain.

- [ ] **Entregar screenshots reais Content Engine + NexaCore** — `lib/work/data.ts:100,148`. Hoje 2 de 3 cases featured caem em SVG diagram dentro de MockupFrame. Hero tile gigante do flagship é diagrama, não evidência.
  - **Fix**: dropear pelo menos 1 screencap MP4 do Telegram approval Content Engine + 1 dashboard NexaCore (PII redacted ok).

- [ ] **Substituir stub admitido "22 agentes" no bento** — `components/sections/bento-skills.client.tsx:152-155`. Comment linha 145-147 diz "Wave 1 stub: count textual mono grande. Wave 4 vai substituir por <video> real do Telegram HITL". Dívida visual exposta em produção.
  - **Fix**: entregar Wave 4 OU diagram orbital real.

- [ ] **Transição manifesto → contact** é dura, mata o reveal cinematográfico. `components/sections/manifesto.tsx:184` + `components/sections/contact.tsx`.
  - **Fix**: gradient fade ou eclipse de saída.

### Performance

- [ ] **First-load JS 944 KB uncompressed (~315 KB gz) — 3× acima do alvo Vercel** (`.next/diagnostics/route-bundle-stats.json`).
  - **Root cause #1**: GSAP vazando pro first-load de TODA rota. `components/hero/partner-marquee.tsx:3-4` e `components/hero/stats-row.tsx:3-5` têm `import { gsap } from 'gsap'` static + são eager via Hero. Chunk 70KB.
  - **Fix**: dynamic import dentro de useEffect. Economia: −22KB gz no first-load.

- [ ] **`Hanoi3D Canvas` sem `frameloop="demand"`** — `components/playground/hanoi-3d.tsx:146-150`. RAF loop 60fps mesmo quando user pausa. Drena GPU/bateria.
  - **Fix**: `<Canvas frameloop="demand">` + `invalidate()` em mudança de estado.

- [ ] **~10MB de assets órfãos no deploy**:
  - `public/bg/Anime_minimalista_no_song_202605220236.mp4` (5.25MB) — **zero referências** em código
  - `public/bg/eclipse-lime.png` (882KB) — órfão
  - `public/bg/Midu-Style.png` (860KB) — órfão
  - `public/ChatGPT-Image-22-de-mai.-de-2026_-16_45_16.svg` (8.6KB) — órfão
  - `public/work-screenshots/*.png` + `*.webp` (3.5MB total) — código só referencia `.avif`
  - `public/fonts/PPEditorialNew-Regular.otf` (58KB) — comentário diz que foi removido em W0.7 mas arquivo continua
  - **Fix**: `rm` em tudo isso.

- [ ] **`next.config.ts` falta `experimental.optimizePackageImports`** pra `motion`, `motion/react`, `@icons-pack/react-simple-icons` (barrel com 5118 ícones), `radix-ui`. Economia esperada: −15–25KB gz.

### Acessibilidade (WCAG AA failing)

- [ ] **Múltiplos `<main>` aninhados** — `app/privacidade/page.tsx:111` + `app/work/content-engine/page.tsx:31` + `app/work/nexacore/page.tsx:22` + `app/work/estetica-md/page.tsx:20` + `app/work/stark/page.tsx`. Layout já wrapa em `<main>` (`app/layout.tsx:206`).
  - **Fix (5 min)**: trocar cada `<main>` interno por `<>` ou `<div>`.

- [ ] **Sheet mobile nav sem `SheetTitle`/`SheetDescription`** — `components/ui-effects/top-bar-nav.tsx:205-246`. Radix warning + sem accessible name.
  - **Fix (2 min)**: adicionar `<SheetTitle className="sr-only">Menu de navegação</SheetTitle>`.

- [ ] **FlipCard com `<a>` aninhado dentro de `<button>`** — `components/ui-effects/flip-card.tsx:53-87,91-164` + `components/sections/other-work.client.tsx:105-126`. HTML inválido, tab order quebrado.
  - **Fix (30 min)**: trocar `<button>` por `<div role="button" tabIndex={0}>` ou separar trigger de conteúdo.

- [ ] **Heading order pula nível** — `components/contact/about-this-site-modal.tsx:216` usa `<h4>` direto após h2.
  - **Fix (1 min)**: `<h4>` → `<h3>`.

- [ ] **Focus indicator inexistente em links de conteúdo** (color-only viola WCAG 1.4.11 Non-text Contrast 3:1):
  - `components/sections/social-proof-line.tsx:101`
  - `app/process/page.tsx:214,223`
  - **Fix (5 min)**: remover `outline-none` ou adicionar `focus-visible:ring-2 focus-visible:ring-(--color-accent)`.

- [ ] **Link "Pular showcase" aponta pra `#after-pinned` que NÃO EXISTE** — `components/work/scroll-pinned-horizontal.tsx:146`.
  - **Fix (1 min)**: adicionar `<div id="after-pinned"/>` depois do bloco OU remover link.

- [ ] **Contact form: `aria-describedby` + `role="alert"` simultâneos** — `components/sections/contact-form.client.tsx:344`. Causa anúncio duplo no screen reader.
  - **Fix**: escolher 1 strategy — `role="alert"` só, ou `aria-describedby` só.

- [ ] **Vídeo hero autoplay loop sem botão pause** (WCAG 2.2.2 Pause/Stop/Hide para movimento contínuo >5s).
  - **Fix**: botão "Pausar fundo" canto inferior do hero, OU resolver via fix do blocker visual #2.

### Mobile

- [ ] **FlipCard Estética MD literalmente UNREACHABLE em mobile** — `components/sections/other-work.client.tsx:42`. `trigger="hover"` faz `onClick={undefined}` em touch. Microcopy diz "Passe o mouse / toque pra ver detalhes" mas toque não dispara nada.
  - **Fix (15 min)**: trocar pra `trigger="click"` ou autodetect via `useIsTouch`.

- [ ] **Manifesto usa `100vh` em vez de `dvh`/`svh`** — `components/sections/manifesto.tsx:184,196`. iOS Safari URL bar dinâmica cria jank perceptível de ~80px durante swipe. Signature SVG fica descentrada.
  - **Fix (1 linha)**: `h-screen` → `h-dvh`; outer `h-[130vh] md:h-[180vh]` → `h-[130dvh] md:h-[180dvh]`.

- [ ] **PWA install iOS quebrado** — `app/manifest.ts:18-31` só tem SVG icon. Android precisa PNG 192/512. Falta `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-touch-startup-image` em `app/layout.tsx`.

- [ ] **`-webkit-tap-highlight-color` global ausente** — iOS Safari mostra retângulo azul em todo tap, quebra o dark+lime cinema.
  - **Fix (2 linhas em `app/globals.css`)**: `a, button, [role="button"] { -webkit-tap-highlight-color: transparent; }`.

### Code / Bugs

- [ ] **Contact form `handleSubmit` race condition** — `components/sections/contact-form.client.tsx:114-119`. Async + `await trigger()` antes de `preventDefault()`. Submit nativo escapa validação client em casos extremos.
  - **Fix**: `preventDefault()` síncrono primeiro, validar, depois `form.requestSubmit()`.

- [ ] **Manifesto fetch silent fail bloqueia setup inteiro** — `components/sections/manifesto.tsx:62-69,107`. Se `fetch('/signature-stefan.svg')` falhar (404/network), `svgMarkup=null` faz a guarda impedir GSAP setup. Section vira 130-180vh de altura sem animação nem signature.
  - **Fix**: estado `'pending' | 'ready' | 'failed'`; ainda setup timeline no fail (sem signature) OU import SVG estático inline (`components/shared/signature-stefan.tsx`).

- [ ] **Case studies retornam `null` em vez de `notFound()`** — `app/work/content-engine/page.tsx:19` + 3 cases. 200 OK com página em branco em vez de 404 propriamente.
  - **Fix**: `import { notFound } from 'next/navigation'` + `if (!CS) notFound();`.

- [ ] **`app/global-error.tsx` AUSENTE** — sem error boundary root-level. Erro no root layout = tela em branco Next default. Catastrófico pra portfolio premium.
  - **Fix (30 min)**: criar Client Component com `<html><body>` completos chamando `Sentry.captureException(error)`.

- [ ] **`app/error.tsx` AUSENTE** — erros RSC explodem genericamente. Especialmente Server Action contact pode falhar fora do try/catch (Resend init crash).

### Deploy / Security

- [ ] **CSP header ausente** — `next.config.ts:30-56`. 3 `dangerouslySetInnerHTML` em `app/layout.tsx:170-196` (pre-hydration, JSON-LD, easter-egg) + 1 em `components/sections/manifesto.tsx:267`. Controlado hoje, mas zero defesa-em-profundidade.
  - **Fix**: ver bloco "Headers recomendados" abaixo.

- [ ] **Sentry source maps NÃO sobem** — `next.config.ts` exporta `withAnalyzer(withMDX(nextConfig))` mas nunca passa por `withSentryConfig`. Stack traces em prod chegam minified (`a.js:1:2840`). Impossível debugar incidente.
  - **Fix**: instalar `@sentry/nextjs` wizard OU envelope manual com `withSentryConfig` (snippet em "Headers recomendados").

- [ ] **Server Action de contato SEM rate limit + EMAIL AMPLIFICATION risk** — `lib/server-actions/contact.ts:41-129`. Auto-reply pra `input.email` permite atacante usar form como **email amplifier**: submeter `email=vitima@x.com` faz seu servidor SMTP mandar pra vítima. Queima reputação Resend rápido. Comentário linha 19 fala "BotID configurado em vercel.json Fase 7" mas `vercel.json` não tem nada.
  - **Fix**: BotID SDK (`@vercel/botid`) ou Upstash Redis ratelimit (N/IP/hora) OU Cloudflare Turnstile. Em paralelo, **pular auto-reply** ou só enviar após rate-check.

- [ ] **Sentry Session Replay sem masking captura PII** — `sentry.client.config.ts:14-17` tem `maskAllText: false, blockAllMedia: false` + `replaysSessionSampleRate: 0.1`. Textos digitados no contact form vão pro Sentry. **NÃO declarado em `/privacidade`** — violação LGPD direta (Art. 7º).
  - **Fix**: `maskAllText: true` + `blockAllMedia: true` + `replaysSessionSampleRate: 0.01` + adicionar `beforeSend(event) { delete event.user?.ip_address; delete event.request?.cookies; return event; }`. OU desligar Replay (`replaysSessionSampleRate: 0`). E declarar em `/privacidade` se mantiver.

### Copy / Trust

- [ ] **"Next 16" no hero contradiz cases "Next 14/15"** — `components/sections/hero.tsx:126` vs `lib/work/data.ts:122` (NexaCore "Next 14") e `lib/work/data.ts:168` (STJ "Next 15.3.9"). Recruiter sério confere — queima credibilidade.
  - **Fix**: hero subline → "AI Product Engineer · 22 agentes Claude SDK aprovados via Telegram · três produtos em produção." (sem versão de Next, e específico em vez de stack-list).

---

## HIGH — diferença de "bom" pra Vercel/Apple-tier

### Visual

- [ ] `app/globals.css:512-516` · Outline focus global 3px é agressivo demais. Apple/Linear/Vercel usam 2px + offset 1px + box-shadow ring nos cards.
- [ ] `components/sections/featured-work.tsx:106-119` · `glass-panel` + `shadow-md` + `shadow-inset-bisel` simultâneos no Hero tile = sobrecarga visual + GPU. Trocar por `bg-(--color-surface)` opaco.
- [ ] `components/sections/featured-work.tsx:115-118` · 3 efeitos de hover simultâneos (translate + border + glow) = over-acknowledgement. Escolher 1 (border-color shift à la Linear).
- [ ] `components/sections/bento-skills.client.tsx:141` · `'◆◆◆' / '═══' / '◆'` ASCII art "alien crypto" — substituir por SHMonogram mini, count `01·02·03`, ou ícones semânticos.
- [ ] `components/sections/bento-skills.client.tsx:185-188` · Hover do cell muda cor de **todas** as ~20 chips ao mesmo tempo. Remover `group-hover` das chips.
- [ ] `components/sections/bento-skills.client.tsx:311-343` · `PerimeterTrace` SVG anima stroke-dashoffset no hover — Awwwards-2018 "draw on hover", caro. Remover.
- [ ] `components/sections/timeline.client.tsx:51` · Gap 8rem→14rem (128–224px) entre markers é excessivo. Baixar pra 6/8/10rem.
- [ ] `components/sections/timeline.client.tsx:70-77` · Year 88px desktop **maior 2.2× que title 40px** — hierarquia invertida pra editorial timeline. Inverter.
- [ ] `components/sections/contact.tsx:46-75` · Avatar `rotate(-2deg)` é truque "feito por humano" de portfolio 2021. Apple/Vercel não tiltam headshots.
- [ ] `components/ui-effects/macbook-scroll.tsx:35-39` · MacBook scroll é clichê pós-2020 Apple Pro Display ad. Aceternity. Substituir por camera dolly horizontal CSS ou sticky hero full-bleed.
- [ ] `components/ui/button.tsx:25-27` · Default variant `rounded-pill` + outline `rounded-md` = inconsistência de shape language. Unificar.
- [ ] `components/work/scroll-pinned-horizontal.tsx:189-209` · Dots progress decorativos (`aria-hidden`), não clicáveis. Vercel/Linear: clicáveis (jump to panel).
- [ ] **Saturação lime ~14%** — regra 60/30/10 estrita: base/surface 60%, text 30%, lime 10%. Auditar cada uso e reduzir ~30-40%.

### Performance

- [ ] **Sentry semi-configurado**: configs existem mas Sentry browser **não inicializa** (sem `instrumentation-client.ts`, sem `withSentryConfig`). Decidir A) ativar + remover replayIntegration B) deletar tudo.
- [ ] **Lighthouse CI threshold 0.85 + insights críticos desligados** — `lighthouserc.json:16,27`. `lcp-discovery-insight`, `lcp-phases-insight`, `interaction-to-next-paint-insight`, `forced-reflow-insight`, `color-contrast` todos `off`. Esconder o problema, não resolver. **Fix**: subir pra `0.95`, religar insights como warn, adicionar mobile preset rodando em paralelo, adicionar URLs `/work`, `/work/content-engine`, `/process` aos testes.
- [ ] **Cal.com sem `preconnect`** — modal first-open paga 200-500ms de TLS+DNS+TTFB. Adicionar `<link rel="preconnect" href="https://cal.com" crossOrigin="">` em `app/layout.tsx`.
- [ ] **Manifesto faz `fetch('/signature-stefan.svg')`** post-mount — round-trip evitável. Inline SVG via import.
- [ ] **Hero video 941KB desktop** (`hero-loop.webm` 525KB + `hero-loop.mp4` 412KB). Linear/Vercel: 60-150KB. Reencode AV1 baixa pra ~250-450KB.

### A11y (should-fix AA-ish)

- [ ] `text-3` (oklch 63%) sobre `--color-surface-elevated` (oklch 22%) = ~3.6:1 (falha AA). Bento cells. Tokenizar `--color-text-on-elevated` (oklch 70%).
- [ ] Botão "Enviar outra mensagem →" em lime sobre lime-subtle = ~3.8:1 borderline AA. Trocar por `text-(--color-text-1)` + underline lime.
- [ ] `aria-current="page"` no TopBarNav (`top-bar-nav.tsx:134`) ✅ mas Footer (`footer.tsx:103`) não. Replicar ou aceitar (footer = secondary nav).
- [ ] Faltam `lang="en"` em "AI Product Engineer", "FEATURED WORK", "Cal.com", "Content Engine". AT lê com prosódia portuguesa.
- [ ] Pill segmented "Como prefere conversar?" — keyboard arrow nav entre radios NÃO funciona (cada radio em `<label>` separado). Usar Radix RadioGroup.

### Mobile

- [ ] **Button sizes sub-44px**: `components/ui/button.tsx:43-48` `default h-10` (40px), `sm h-8` (32px), `icon size-10` (40px). Sheet/Dialog close `size-8`. Subir `default h-11`, `sm h-10`, `icon size-11`.
- [ ] **Hanoi range slider thumb `size-4`** (16px) — `components/playground/hanoi-controls.tsx:64,70`. Tocável só com unha. Subir pra `size-7` ou `size-11`.
- [ ] **Hero CTAs com `flex-wrap`** podem fazer secundário cair pra baixo (hierarquia perdida). Mobile-first `flex-col`.
- [ ] **Form keyboard hints faltando**: `autoCapitalize="words"` no nome, `enterKeyHint="send"` no textarea, `enterKeyHint="next"` intermediários, `autoComplete="name|email"`.
- [ ] **Hero subhead em 320px viewport** (`hero.tsx:120`) pode estourar 30vh (60px font × 4-5 linhas). Empurra CTAs pra abaixo do fold.
- [ ] Avatar 112×160px em mobile com tilt + glow vira "decoração que rouba atenção do form" em portrait.
- [ ] Pull-quote do manifesto `text-[1.875rem]` escalando 0.4× = ilegível durante final do scroll-jacking mobile.

### SEO

- [ ] **4 case studies sem `openGraph` próprio nem `alternates.canonical`** — `app/work/[slug]/page.tsx` (4 arquivos). Compartilhamento LinkedIn/Twitter renderiza title default da home.
- [ ] **4 case studies sem JSON-LD `SoftwareApplication`/`CreativeWork`** — já flagado em `docs/MELHORIAS-2026-05-24.md:234` como W-seo #1, não foi feito.
- [ ] **Falta `BreadcrumbList` JSON-LD** nos cases. Componente visual existe em `app/work/layout.tsx:11-25`, falta só o schema.
- [ ] **`Person` schema falta `image`, `worksFor`, mais `sameAs`** (Cal.com, WhatsApp) — `app/layout.tsx:91-145`.
- [ ] **Falta `WebSite` schema** com `publisher: { '@id': '#person' }` cross-link.
- [ ] **`/process` é candidato OURO pra `HowTo` JSON-LD** com os 6 steps — maior ROI rich snippet do site. Considerar `FAQPage` também.
- [ ] **`app/sitemap.ts:7-53` usa `new Date()` global** — Google desconfia ("tudo mudou hoje"). Usar dates reais por rota.
- [ ] **`app/robots.ts`** não exclui `/design-system` (que é `robots: noindex`). Adicionar `disallow: ['/design-system']`.
- [ ] Descriptions de cases muito curtas (`CS?.tagline` ~60-80 chars). Google reescreve em SERP. Reescrever ≥140 chars.

### Code quality

- [ ] **`react-email` deveria estar em `devDependencies`** — é CLI/preview, não runtime. `@react-email/components` (runtime) está correto.
- [ ] **`marked` e `@react-three/postprocessing` em deps mas zero imports** — remover.
- [ ] **`diagrams.tsx` 988 linhas** — 5+ diagrams num arquivo. Cada page importa tudo. Quebrar em `diagrams/squads.tsx`, etc.
- [ ] **`contact-form.client.tsx` 443 linhas** — quebrar em `<ContactFormFields>`, `<ContactFormSuccess>`, `<HoneypotInput>`.
- [ ] **TracingBeam id hardcoded** — `components/ui-effects/tracing-beam.tsx:93` `id="tracing-beam-gradient"`. Usar `useId()`.
- [ ] **`HeroSection` async sem await** — `components/sections/hero.tsx:21`. Tornar síncrona.
- [ ] **Zero unit tests** — Vitest config existe mas nenhum spec fora de e2e. Funções puras testáveis: `lib/server-actions/form-data-bridge.ts`, `lib/scroll/anchor-scroll.ts`, `lib/validation/contact-schema.ts`, `hanoi-3d.ts` helpers, `parens-viz.ts` analyze.
- [ ] **E2E cobre ~30% dos fluxos críticos** — faltam contact form submission, Cal.com modal, anchor scroll, about-this-site hash, playground tabs keyboard, 404 render, case study impact triad.
- [ ] **`product-screenshots.spec.ts` path Windows hardcoded** `C:\Users\Stefan1\...` (quebra em CI/Linux). Ignorado mas é dívida.

### Animation

- [ ] **Manifesto anima `backgroundColor`** (não composited) + `filter: blur(8px)` em 50+ palavras stagger — Chromium repaint custoso. Trocar por `transform: translateY` + `opacity`.
- [ ] **MacBook scroll sem spring smoothing** — pulsa step-by-step em wheel rápido. `useSpring` sobre `scrollYProgress`.
- [ ] **Manifesto `expo.inOut`** sabota reveal (1ª metade congela, 2ª espasma). Trocar por `power2.out` / `EASES.outQuint`.
- [ ] **grain-overlay** combina `feTurbulence` + `mix-blend-overlay` + `animate-grain-drift` 60s fullscreen permanente. Bakear PNG 256×256 tiled.
- [ ] **MacBook scroll sem `useSpring`** smoothing — pulsa step-by-step.
- [ ] **Partner-marquee `will-change-transform` permanente** — cria compositor layer mesmo idle. Aplicar dentro de `useGSAP`, remover no cleanup.
- [ ] **Page transitions inexistentes** — Home → /work/* é blank flash do router. Faltam `loading.tsx` em `/work/`, `/work/[slug]/`, `/process/`. Gap mais visível vs Vercel/Linear.

### Deploy

- [ ] **`vercel.json` mínimo demais** — sem `functions.maxDuration`, sem `cleanUrls`/`trailingSlash`, sem `headers` mirror. Snippet em "Configs recomendados".
- [ ] **Env vars sem validação Zod runtime** — criar `lib/env.ts` com `EnvSchema.parse(process.env)`. Falha build se malformado em vez de runtime silencioso.
- [ ] **PWA prometido (Serwist no README) mas não implementado** — `package.json` não tem `@serwist/next`, sem `app/sw.ts`. README enganoso. Ou implementa ou remove menção + `display: 'browser'` no manifest.
- [ ] **Lighthouse só roda desktop preset** — `lighthouserc.json:9`. Mobile real BR é onde o problema aparece. Adicionar suíte mobile com threshold 0.75.
- [ ] **GitHub Actions pinadas em `@v4` (tags mutáveis)** — supply chain risk. Pinar em SHA.

### Security

- [ ] **`rel="noreferrer"` sem `noopener` explícito** — `components/sections/footer.tsx:184-195`, `other-work.tsx:154-163`, outros. Browsers modernos implicam mas best practice é declarar.
- [ ] **`fetch('/signature-stefan.svg').text() → dangerouslySetInnerHTML`** — same-origin OK, mas adicionar DOMPurify (3KB) como defense-in-depth.

---

## MEDIUM — polish que falta

### Visual

- `app/globals.css:215` · Grain animado 60s infinito mobile = frame budget impact. Estático.
- `components/ui-effects/grain-overlay.tsx:18` · `z-40` é alto. Testar com Cal modal aberto. Baixar pra `z-10`.
- `components/sections/featured-work.tsx:88-98` · "01 / 03 — FLAGSHIP · CONTENT ENGINE" redundante com h3 abaixo. Cortar.
- `components/sections/featured-work.tsx:264` · `SquadsStatusLine` loop infinito 4.5s mesmo off-screen. Pausar com `useInView`.
- `components/sections/contact.tsx:96-110` · `<br className="hidden sm:block">` no headline bloqueia text-balance.
- `components/sections/playground-teaser.tsx:226-273` · SVG previews "bonitinhos mas frios". Trocar por GIF/MP4 2-3s do demo real.
- `components/sections/timeline.client.tsx:144-153` · Beam end glow termina abrupto. Prolongar 24-32px fade.
- `components/work/squads-status-line.tsx:11-20` · 6 steps full label em mobile wrap em 3 linhas + setas → caos. Mobile mostrar IDs (S0·S1·...·E-0) com tooltip.
- `components/sections/footer.tsx:81-87` · "stefanscrepka.dev" text-3 sobre surface-deep ~63% L = falha AAA.
- `app/process/page.tsx:147-202` · 6 sections × 6 layers verticais = densidade cognitiva. Collapse highlights default + expandable.
- `app/design-system/page.tsx` · Hoje noindex. Isso é deep tech proof que recrutador procura. Indexar e linkar do footer.
- `components/sections/manifesto-body.tsx:79-87` · Hairlines gap-1.5 (6px) apertado. Subir pra gap-2.5 (10px).
- `components/sections/contact.tsx:120-128` · Container `rounded-3xl` (18px) + inputs `rounded-md` (6px) = 3× cartoon. Container `rounded-2xl`.
- `components/sections/featured-work.tsx:60` · `totalCount={3}` mas site tem 4 cases (Estética MD em Other). Sequence "01/03" mente. Ou `02/04` ou "Selected · 03".
- `app/playground/page.tsx:23` · `<PlaygroundPage>` Client mas página em si é trivialmente Server. Refatorar pra Server Component + client islands.
- `components/ui-effects/top-bar-nav.tsx:48-49` · `bg-(--color-bg)/85` + `backdrop-blur-md` custa GPU sobre hero video. Trocar por bg sólido.

### Performance

- `IntersectionObserver` instances em 5+ componentes — cada 1-2KB runtime. Consolidar em context.
- `LenisProvider` MutationObserver anexado antes do bail-out mobile.

### Copy

- Hero subline genérico (já no blockers, mas o concreto fica aqui): "AI Product Engineer · 22 agentes Claude SDK aprovados via Telegram · três produtos em produção."
- **NexaCore vs Striveos**: customer-facing brand precisa ser UM só.
- Featured Work "Três produtos. Três posturas." → "Três produtos. Três problemas resolvidos." (concreto vs abstrato).
- Other Work "amplitude além dos SaaS atuais" → "Quem é Stefan antes do AI Product Engineer."
- Bento Skills: eyebrow "stack que entra em produção" + h2 "Ferramentas que entram em produção" = repetição. Eyebrow "STACK" simples.
- Submit button "Enviar →" muito curto. "Enviar mensagem →".
- Stats Row: "100+ vitest tests" redundante. "100+ testes runtime". "27 tabelas Drizzle" → "27 tabelas Postgres" (Drizzle confunde leitor não-dev).
- Status "Em desenvolvimento ativo · cron operacional" contraditório. "Operacional · cron 24/7 · em iteração".
- Hyphen vs en-dash inconsistente em "Cron 03h-07h30" / "cron 03h–07h30". Padronizar `–`.
- `lib/work/data.ts:75` · "brand brief intake" anglicismo → "captação de brief de marca".
- Process page CaseImpactTriad "PROBLEMA / SOLUÇÃO / IMPACTO" → "O QUE QUEBRAVA / O QUE EU FIZ / O QUE MUDOU" (stefan-style).
- Validation "Mensagem grande demais (>2000 caracteres)." → "Mensagem grande demais. Máx. 2000 caracteres."
- Easter-egg console "producao" sem acento + mistura PT-EN. Padronizar PT acentuado.
- IA AGENTIC card 8 chips com `vision` e `tool use` redundantes com `Claude Agent SDK`. Cortar pra 6.

### A11y AAA

- `text-3` em contextos prose: subir pra oklch 70% (ratio ~6:1).
- Reduced-motion + scroll-jacking: encurtar `h-[180vh]` pra `h-screen` em reduced-motion. Hoje user de RM ainda atravessa 180vh vazio.
- `role="status" aria-live="polite"` em form status row anuncia "Respondo em até 12h" em todo render = pollution. Separar live region só pro slot que muda.

### Animation

- `components/sections/timeline.client.tsx:184-192` · `animate-pulse` infinito em marker "NOW". Limitar `repeat: 3` via Motion.
- `components/hero/cta-group.tsx:77` · Re-define `EASES_BACK_OUT` que já existe em `lib/animation/eases.ts:14`. Importar.
- `components/ui-effects/flip-card.tsx:116` · `scale: flipped ? [1,0.98,1] : [1,0.98,1]` — array idêntico nos branches. Simplificar.
- `components/ui-effects/tracing-beam.tsx:42-43` · `stiffness: 500` alto demais pra scroll trace. Baixar pra 200.
- `components/sections/manifesto.tsx:259-267` · Duplo `drop-shadow` em SVG = gargalo. Consolidar single.

### Mobile

- Spinning loader success state spring `stiffness: 280, damping: 22` + bg blur stutters em iOS Safari.
- Sheet content `w-72 sm:w-80` sem `safe-area-inset-bottom` — último item atrás do home indicator.
- Bento integrações chip strip `overflow-x-auto` sem `scroll-snap-x` + sem edge fade.
- ScrollPinnedHorizontal sem swipe-hint visual em mobile.

### Deploy

- `next.config.ts:28` · `images.remotePatterns` vazio (OK hoje, documentar pra adicionar quando consumir CDN).
- Sentry sem `sendDefaultPii: false` explícito server.
- `replaysSessionSampleRate: 0.1` em prod = 10% sessões com replay. Baixar 0.01.
- Política /privacidade NÃO menciona Session Replay nem base legal explícita ("legítimo interesse Art. 7º X LGPD").
- Vercel Analytics + Speed Insights sem menção LGPD base legal.

### Security

- `.env.example:22` · `VERCEL_BOT_ID_SECRET=` no template mas BotID não implementado. Dead config — remover ou implementar.
- `sentry.client.config.ts:5-20` · DSN check `if(dsn)` sem warn — Sentry desativa silenciosamente se env vazio em prod.
- `lib/server-actions/contact.ts:38-39` · Fallback hardcoded `?? 'stefanheinz2006@gmail.com'` mascarando misconfiguração. Throw em prod.
- `lib/server-actions/contact.ts:79` · `console.warn(..., input)` em dev imprime input cru. Re-habilitação acidental em prod = leak.

---

## LOW / nice-to-have

- `app/icon.tsx` favicon usa "S/" textual + Inter no fallback. Trocar por SHMonogram path direto.
- `app/opengraph-image.tsx` + `lib/og/template.tsx` — substituir "S/H" textual por SVG `sh-mark.svg` inline + grain pattern no fundo. Per-case adicionar diagram silhueta SVG (squads pro CE, dashboard pro NexaCore).
- OG dedicadas para `/process`, `/privacidade`, `/playground`, `/work` index.
- `app/twitter-image.tsx` separada (hoje reaproveita OG — funciona, mas Twitter prefere ratio diferente).
- `components/sections/manifesto-body.tsx:60-76` — pull-quote sem aspas decorativas grandes (Apple Annual Report style).
- `components/contact/contact-monogram-backdrop.tsx:33-43` · SHMonogram gigante mobile cobre 50% do form em 343px. Cap a 200px.
- `app/sitemap.ts` · Cores PNG 192/512 para Android PWA install.
- `app/manifest.ts:14` · `orientation: 'portrait'` força retrato. Considerar `'any'` pra case studies wide.
- `app/manifest.ts:16` · `categories: ['portfolio', 'developer', 'productivity']` — `productivity` errado pra portfolio. Trocar por `business`.
- Stack badges (3 mini-icons Claude/Next/TS) no canto bottom-right da OG.
- Input focus states com border drawing 200ms ease-out (Stripe/Linear-tier).
- Character counter animado no textarea (tabular-nums count-up).
- Hover underline draw progressive em footer links.
- Form validation shake on error (Stripe-style com `useAnimate`).
- Cursor states custom em case study covers (`zoom-in`) e MagneticCTA.
- Mobile menu sheet item stagger 30ms.
- Sentry Alerts no painel (>5 errors/5min, novo issue regression, Resend send failure spike).
- Uptime monitoring (BetterStack/UptimeRobot) + `app/api/health/route.ts`.
- Cal.com catch silencioso adicionar `Sentry.captureMessage('cal-api-init-failed')`.
- Subir `compose-slider.tsx:149` cursor pattern pra outros lugares.
- Recomendação estratégica: **EN version** (perde 30-40% reach global hoje). Mínimo: `/en` página única com manifesto + hero + work summary.

---

## STRENGTHS — preservar intocados

### Visual
- Sistema OKLCH com namespaces semânticos (`globals.css:9-216`), comentários documentando decisões WCAG por token. **Linear-tier**.
- Fluid type scale com clamps + tracking + leading intencionais (`globals.css:81-122`).
- Leitmotif PP Editorial Italic em "multi-agente" isolado em 3 momentos do site (`components/hero/editorial-accent.tsx`). **Assinatura tipográfica MAIS forte do site**.
- Status eyebrow + pulse-dot mono no case study hero — atmosfera Linear release-notes.
- Radial lime beam emanating bottom-center com 3-stop alpha + blur-3xl — Apple Pro Display aesthetic.
- MagneticCTA proximity check 80px + strength 6px + único por viewport — Linear-tier discipline.
- 8 easings nomeados (`--ease-standard/snappy/dramatic/out-quart`) — Apple/Vercel-grade.
- SequenceLabel "01 / 03 — FLAGSHIP" tabular-nums receipt aesthetic.
- CVA com `active:scale-[0.98]` universal — Linear tactile signature.
- "Sobre este site" modal com stack credits + motion narrative + reeded glass — **Vercel-tier transparency**.

### Code / Stack
- TS strict + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` + `noImplicitReturns` — config rara.
- Zod compartilhado client + re-parse server.
- `useActionState` (React 19) corretamente usado.
- `hooks/use-reduced-motion-safe.ts` + `use-mounted.ts` previnem hydration mismatch consistentemente.
- Server Action sem `waitUntil` (fluid compute friendly), honeypot, error responses sanitizadas (zero stack leak).
- `MotionConfig reducedMotion="user"` propaga em todo subtree.
- LazyMotion `domAnimation` root + `domMax` override só em `/playground`.
- Anti-FOUC pre-hydration script inline em `<head>`.
- `reactStrictMode: true`.
- Comentários como manifestos por trás de cada decisão (`W0.4`, `Gotcha #3`, `HANDOFF §148`).

### Animation
- `lib/animation/gsap-lenis-sync.ts:54-87` — sync canônica com `lagSmoothing(0)` + restauração original. **Reference-grade**.
- ~~`components/hero/split-text-headline.tsx`~~ — substituído no audit 2026-06-10 por `components/hero/headline-word-reveal.tsx` (split por palavra no servidor + animação CSS do primeiro paint; matou o replay do GSAP).
- `components/providers/lenis-provider.tsx:22-46` — bail-out completo em touch + reduced-motion. Mobile nunca paga Lenis (40KB).
- `components/hero/stats-row.tsx:96-117` — count-up log-scaled duration + imperative `node.textContent` (zero React commits).
- `components/sections/contact-form.client.tsx:134-220` — success state com spring + word-stagger + sr-only fallback. **Apple-tier emotional closing**.
- `components/playground/parens-viz.tsx:197-237` — AnimatePresence `popLayout` com layout transitions. Detail que separa dev real de template.

### Copy
- **9/10 voz consistente**. Anti-buzzword (zero "synergize/leverage/passionate about/AI-powered").
- Frases icônicas (preservar): "Construo IA multi-agente em produção", "Software sério tem o mesmo padrão de qualquer sistema crítico", "Não vendo 'ajudo empresas a inovar'. Vendo entrega que paga conta.", "Se não funciona 24/7, não conta. — stefan", "Disciplina, não milagre.", "Não é uma lista de cursos — é o que está no package.json".
- 404 page tom autoral.
- Microcopy de form errors: "Não foi. Tenta WhatsApp direto: (42) 99859-2522." — humano em momento de falha.
- Specifics over abstracts: 22, 27, 162, ≤10, <12h.

### Deploy / Security
- Headers básicos sólidos: HSTS preload-ready, X-Frame DENY, X-Content-Type, Permissions-Policy, Referrer-Policy.
- `productionBrowserSourceMaps: false` + `poweredByHeader: false`.
- `.gitignore` cobre `.env*`, `.vercel`, `.sentryclirc`.
- `/privacidade` LGPD Art. 18 compliance honest.
- Honeypot bem implementado.
- Histórico git limpo (só `.env.example` commitado).
- CI completo (Biome + ESLint + TS + Build + Playwright + Lighthouse).

---

## Headers / configs recomendados (paste-ready)

```ts
// next.config.ts
import { withSentryConfig } from '@sentry/nextjs';

async headers() {
  const csp = [
    "default-src 'self'",
    // blob: obrigatorio — workers do Three.js/troika chamam importScripts(blob:)
    // que e governado por script-src (fix do audit 2026-06-10; sem isso /playground
    // loga 12 erros). Fonte de verdade: next.config.ts.
    "script-src 'self' 'unsafe-inline' blob: https://va.vercel-scripts.com https://vitals.vercel-insights.com https://app.cal.com https://embed.cal.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://va.vercel-scripts.com https://vitals.vercel-insights.com https://app.cal.com https://api.cal.com wss://app.cal.com",
    "frame-src https://app.cal.com https://embed.cal.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ');

  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()' },
        { key: 'Content-Security-Policy', value: csp },
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
      ],
    },
  ];
}

export default withSentryConfig(withAnalyzer(withMDX(nextConfig)), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
```

```jsonc
// vercel.json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install --frozen-lockfile",
  "outputDirectory": ".next",
  "regions": ["gru1"],
  "functions": { "app/**": { "maxDuration": 10 } },
  "cleanUrls": true,
  "trailingSlash": false
}
```

```ts
// sentry.client.config.ts + sentry.server.config.ts
Sentry.init({
  dsn,
  sendDefaultPii: false,
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 0.5,
  beforeSend(event) {
    if (event.request) { delete event.request.cookies; delete event.request.data; }
    if (event.user) { delete event.user.email; delete event.user.ip_address; }
    return event;
  },
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
```

```ts
// app/globals.css
a, button, [role="button"] {
  -webkit-tap-highlight-color: transparent;
}
```

---

## Ordem de fix recomendada

### Sprint 1 (1 dia) — Quick wins sem risco visual

1. Remover ✺ glyph 4 lugares (15 min)
2. Apagar ~10MB de assets órfãos em `public/bg/` + `public/work-screenshots/` + fonte órfã (15 min)
3. Trocar `<main>` aninhado em 5 arquivos (5 min)
4. Adicionar SheetTitle/Description sr-only ao mobile nav (2 min)
5. Heading order h4→h3 (1 min)
6. Adicionar `id="after-pinned"` ou remover link (1 min)
7. Trocar `100vh`→`dvh` no manifesto (1 linha)
8. Adicionar `-webkit-tap-highlight-color: transparent` global (2 linhas)
9. Remover `marked` e `@react-three/postprocessing` de deps (5 min)
10. Mover `react-email` pra devDependencies (1 min)
11. `notFound()` em 4 case studies (5 min)
12. Dynamic-izar GSAP em partner-marquee + stats-row (1h)
13. Adicionar `frameloop="demand"` ao Hanoi Canvas (1 linha)
14. Adicionar `experimental.optimizePackageImports` em next.config.ts (5 min)
15. Preconnect Cal.com (2 linhas)

### Sprint 2 (1 dia) — Deploy hardening

1. Criar `app/global-error.tsx` + `app/error.tsx` (30 min)
2. Adicionar CSP + headers complementares (1h)
3. Envelope `withSentryConfig` + adicionar `SENTRY_AUTH_TOKEN` no Vercel (1h)
4. Sentry `beforeSend` PII scrub + `maskAllText: true` no replay (30 min)
5. Implementar rate limit BotID ou Upstash Redis (2-3h)
6. Atualizar `vercel.json` completo (15 min)
7. Criar `lib/env.ts` com Zod validation (30 min)
8. Decidir PWA: implementar Serwist ou remover menção (2h se implementa)
9. Atualizar `lighthouserc.json` (threshold 0.95, religar insights, mobile preset, mais URLs) (15 min)
10. Atualizar `/privacidade` com Session Replay + base legal (15 min)

### Sprint 3 (2 dias) — Conteúdo + a11y completos

1. **Entregar screenshots reais Content Engine + NexaCore** (1 dia design+dev)
2. Substituir hero video por terminal/log loop (4h)
3. Substituir bento "22" stub por video Telegram HITL ou diagram orbital real (4h)
4. Hero subline reescrita + remover "Next 16" (15 min)
5. NexaCore vs Striveos decisão de brand (decision)
6. FlipCard `trigger="click"` ou autodetect (15 min)
7. Manifesto SVG fetch → inline import (30 min)
8. Manifesto `backgroundColor` → opacity de bg layer (1h)
9. Manifesto `expo.inOut` → `power2.out` (1 linha)
10. Button sizes 44px + Sheet/Dialog close 44px + Hanoi slider thumb 28px (2h)
11. Form keyboard hints (`autoCapitalize`, `enterKeyHint`, `autoComplete`) (15 min)
12. PWA iOS: PNG icons + apple-mobile-web-app meta + splash screens (2h)
13. Focus indicators em links sem outline (15 min)
14. Contact form `aria-describedby` vs `role="alert"` (decisão + 5 min)
15. FlipCard refactor `<button>` → `<div role="button">` (30 min)
16. Botão pause hero video (15 min)
17. Page transitions: `loading.tsx` em `/work`, `/work/[slug]`, `/process` (1h)

### Sprint 4 (1 dia) — SEO + copy completo

1. 4 case studies: `openGraph` + `alternates.canonical` + description ≥140 chars (30 min)
2. JSON-LD `SoftwareApplication`/`CreativeWork` nos 4 cases (1h)
3. `BreadcrumbList` JSON-LD nos cases + visual breadcrumb (1h)
4. `WebSite` schema + expandir `Person.sameAs` + `image` (15 min)
5. `HowTo` JSON-LD em `/process` com 6 steps (1h) ← maior ROI rich snippet
6. `app/sitemap.ts` dates reais por rota (10 min)
7. `app/robots.ts` `disallow: ['/design-system']` (1 linha)
8. OG dedicadas pra `/process`, `/work` index, `/privacidade` (1h)
9. Copy fixes do audit (~30 min): hero subline, status, Other Work header, bento eyebrow, submit button, etc.
10. Decidir EN version (estratégia)

### Pós-launch (V1.1)
- Reduzir saturação lime (~14% → ~9%)
- Substituir 1-2 patterns Aceternity por motivos próprios (MacBook scroll, PerimeterTrace)
- Quebrar `diagrams.tsx` (988 linhas)
- Quebrar `contact-form.client.tsx` (443 linhas)
- Unit tests pra funções puras (`hanoi-3d`, `parens-viz`, `contact-schema`, `anchor-scroll`)
- E2E pra fluxos críticos (form submit, Cal modal, anchor scroll, 404)
- Reencode hero video AV1
- Bakear grain noise em PNG estático
- EN version
- Sentry alerts + uptime monitoring
- DMARC/SPF/DKIM DNS verification Resend
- Google Search Console + sitemap submission
- HSTS preload submission (após 30 dias estável)

---

## Lighthouse estimado

| Categoria | Atual | Após Sprint 1+2 | Após Sprint 1-4 | Target |
|---|---|---|---|---|
| Performance (mobile) | 75-82 | 85-90 | 90-95 | 95+ |
| Performance (desktop) | 88-94 | 95-98 | 98-100 | 95+ |
| Accessibility | 89-93 (com color-contrast off) | 96-100 | 100 | 100 |
| Best Practices | ~92 | 100 | 100 | 100 |
| SEO | 92-96 | 96-100 | 100 | 100 |

**Apple-tier 100/100/100/100** alcançável apenas removendo o hero video em mobile (já feito ✅) e substituindo por evidência real em desktop (Sprint 3).

---

## Files-key cross-reference

Arquivos tocados em mais de uma auditoria — ordem de prioridade pra editar:

1. `components/sections/manifesto.tsx` — visual + a11y + performance + animation + code (fetch silent fail + 100vh + backgroundColor anim + expo.inOut + SVG inline)
2. `components/sections/hero.tsx` — visual + copy + performance + a11y (video + subline + GSAP leak via PartnerMarquee + autoplay pause)
3. `components/sections/contact-form.client.tsx` — code + a11y + mobile + animation (handleSubmit race + role=alert dup + 443 linhas + active:scale-100 sabotado)
4. `components/ui-effects/flip-card.tsx` — a11y + mobile (button nested + trigger=hover mobile)
5. `components/ui/button.tsx` — mobile + visual (sizes sub-44 + rounded inconsistency)
6. `components/sections/featured-work.tsx` — visual + code (glass-panel sobrecarga + 374 linhas + totalCount=3 mente)
7. `components/sections/bento-skills.client.tsx` — visual + copy + a11y (✺ glyph + "22" stub + ASCII art + text-3 contraste)
8. `components/sections/timeline.client.tsx` — visual + animation + a11y (gap excessivo + hierarchy invertida + animate-pulse infinito)
9. `app/layout.tsx` — security + a11y + visual + performance + mobile (CSP + 3 dangerouslySetInnerHTML + preconnect Cal + PWA iOS meta)
10. `next.config.ts` — deploy + security + performance (CSP + withSentryConfig + optimizePackageImports)
11. `sentry.client.config.ts` — security + deploy + LGPD (maskAllText + beforeSend + replaysSessionSampleRate)
12. `lib/server-actions/contact.ts` — security + code + deploy (rate limit + amplification + fallback hardcoded)
13. `app/work/*/page.tsx` (4) — SEO + a11y + code (openGraph + canonical + SoftwareApplication JSON-LD + main aninhado + notFound)
14. `lib/work/data.ts` — visual + copy + SEO (screenshots reais + descriptions + Next 14/15 inconsistency)

---

**Total estimado pra "Apple/Vercel-tier launch ready"**: 3-5 dias de trabalho focado.
**Total estimado pra "AA compliance + sem blockers"**: 1-2 dias.
