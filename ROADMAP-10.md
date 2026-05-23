# Roadmap 10/10 — `stefanscrepka.dev`

> Plano cirúrgico pra subir a landing de **8.12/10** (média 4 IAs: 7.1 · 8.68 · 8.4 · 8.3) pra **9.5+/10** em ~3 sprints curtos. Cada item tem: arquivo + linha, fix exato, esforço estimado e Δ esperado de nota.
>
> **Compilado em**: 2026-05-23
> **Base**: `AUDITORIA.md` (4 IAs) + verificação direta no código + agentes a11y/perf

---

## 📊 Onde estamos vs onde vamos

| Dimensão | Média 4 IAs | Meta | Gap | Wave de fix |
|---|---:|---:|---:|---|
| Acessibilidade & WCAG | 7.65 | 9.5 | +1.85 | W0 + W1 |
| Cores & Sistema Visual | 8.75 | 9.5 | +0.75 | W2 |
| Tipografia | 8.95 | 9.5 | +0.55 | W2 |
| Storytelling & Copy | 8.40 | 9.5 | +1.10 | W2 + W3 |
| Motion Design | 8.50 | 9.5 | +1.00 | W1 |
| Layout & Composição | 8.45 | 9.0 | +0.55 | W2 |
| Projetos / Cases | 7.60 | 9.5 | +1.90 | W2 + W3 |
| Performance Perceptual | 6.83 | 9.5 | +2.67 | **W0** |
| Trust & Conversão | 7.60 | 9.5 | +1.90 | **W0** + W3 |
| **NOTA** | **8.12** | **9.5+** | **+1.4** | — |

---

## 🎯 Consenso das 4 auditorias (achados em ≥3 das 4)

Esses NÃO são opinião — são onde 4 modelos diferentes convergiram independentemente. Atacar primeiro.

| # | Achado | IAs que sinalizaram | Severidade |
|---|---|:-:|---|
| 1 | `--color-text-3` (oklch 55% L) falha WCAG AA em microcopy 11px (~4.2:1 vs 4.5:1 mínimo) | 4 / 4 | BLOQUEADOR |
| 2 | Hero `<video preload="auto">` 5.05 MB sem `poster` sem media query | 4 / 4 | BLOQUEADOR |
| 3 | Cases vendem stack técnico, faltam métricas de impacto não-técnico | 4 / 4 | BLOQUEADOR de conversão |
| 4 | Falta prova social humana (testimonials, clientes, logos) | 3 / 4 | ALTO |

---

## 🚨 Achados de bloqueador individual confirmados em código

Não tiveram consenso (auditoria única detectou), mas verifiquei no código e são **reais**:

| Bloqueador | Confirmado em | Detalhe |
|---|---|---|
| **Form de contato provavelmente quebrado** | `components/sections/contact-form.client.tsx:87-92` | `onValid` cria `jsonToFormData(data)`, descarta com `void fd`, e chama `requestSubmit()` recursivo. Race entre RHF `handleSubmit` (preventDefault) e `action={action}` (React 19 Server Action). |
| **Radio `prefere` sem `name`** | `components/sections/contact-form.client.tsx:276-282` | Server Action faz `formData.get('prefere')` mas radios não têm `name="prefere"` nem `{...register('prefere')}`. Valor chega `null` no servidor → Zod parse falha. |
| **Footer link `#process` é dead link** | `components/sections/footer.tsx:19` | `href: '#process'` mas não há `id="process"` em nenhum arquivo da home. Process é rota separada `/process`. Clica → não rola. |
| **Avatar 3.07 MB exibido a 128-192px** | `public/avatar-stefan.png` | `next/image` carrega original. Em mobile baixa 3MB pra mostrar imagem de 128px de largura. |
| **Hero video 5.05 MB com `preload="auto"`** | `public/bg/Anime_minimalista_no_song_202605220236.mp4` | Sem poster, sem dimension hints, sem media query. |
| **Dead code que infla bundle** | 3 paths abaixo | Imports zero, mas pacotes pesados continuam no `package.json` |
| ↳ `components/hero/spline-hero.tsx` | — | Zero importers. `@splinetool/react-spline` + `@splinetool/runtime` no `package.json` = ~180 KB gz vivo. |
| ↳ `components/sections/bento-skills-rive.tsx` | — | Zero importers (só `bento-skills.tsx` é importado em `page.tsx`). `@rive-app/react-canvas` = ~50 KB gz + WASM ~120 KB. |
| ↳ `shiki@4.0.2` no `package.json` | — | Zero `import` real, só usado como string identifier. Risco de bundle leak ~280 KB. |
| **PP Editorial Regular carregado, nunca usado** | `app/layout.tsx:27-31` | `editorial-accent.tsx:20` só força `font-style: italic`. Regular 58 KB OTF é desperdício. |
| **LCP real é o `<h1>` SplitText, não o vídeo** | `components/sections/hero.tsx:88` | Vídeo está atrás de mask `transparent 0% → black 65%` + `opacity:0.7` — não compete pra LCP. O `<h1>` é bloqueado por: `'use client'` força hydration; GSAP+SplitText+ScrollTrigger síncronos no module top (~110 KB gz no critical path); PP Editorial italic OTF span-só FOIT-vulnerável. |
| **`<h2>STEFAN HEINZ SCREPKA</h2>` decorativa entra no document outline** | `components/sections/manifesto.tsx:202-208` | Wrapper é `aria-hidden`, mas o `<h2>` ainda navega via `H` key de screen reader. |
| **SVG grain do manifesto sem `aria-hidden`** | `components/sections/manifesto-backdrop.tsx:37` | Tem `focusable="false"` mas falta `aria-hidden="true"` — leitor de tela tenta descrever o filtro. |

---

## 🌊 WAVE 0 — Bloqueadores triviais ≤ 2 horas

> Custo total: 1 dev × 2h. Δ nota esperado: **+0.7 (8.12 → 8.8)**. Δ Lighthouse Performance: **+22-28 pontos**.

### W0.1 — Subir `--color-text-3` em uma linha

**Por que:** consenso 4/4. WCAG 2.2 AA em 20+ ocorrências de `text-2xs + text-3` mais 6 ocorrências `text-3/60` `text-3/70` (que ficam ~1.5:1 → invisíveis).

**Fix:**
```css
/* app/globals.css:46 */
--color-text-3: oklch(63% 0.005 130);  /* era 55% — sobe pra ~5.4:1 vs base */
```

**Efeito colateral**: nenhum. Variável CSS, propaga em build.

**Verificação:** rodar `npx pa11y http://localhost:3000` (ou usar axe DevTools no browser). Antes: 20+ violations. Depois: 0 relacionadas a text-3.

**Esforço:** 5 min.

---

### W0.2 — Migrar `<h2>` decorativo do manifesto para `<div>`

**Fix:**
```tsx
// components/sections/manifesto.tsx:202-208
// trocar:
<h2 ref={nameRef} className="..." style={{ fontSize: ..., opacity: 0 }}>
  STEFAN HEINZ SCREPKA
</h2>

// por:
<div ref={nameRef} role="presentation" aria-hidden="true" className="...">
  STEFAN HEINZ SCREPKA
</div>
```

**Esforço:** 2 min.

---

### W0.3 — `aria-hidden` no SVG grain do manifesto

**Fix:**
```tsx
// components/sections/manifesto-backdrop.tsx:37
// Adicionar aria-hidden="true" na <svg> (já tem focusable="false")
```

**Esforço:** 1 min.

---

### W0.4 — Resize avatar 3.07MB → AVIF 384×512 ≈ 40KB

**Por que:** -99% transfer. Avatar nunca passa de 192px na renderização (`contact.tsx:53` usa `sizes="(min-width: 1024px) 192px, ..."`). 3MB é desperdício bruto.

**Comando:** com `sharp` ou `npx @squoosh/cli`:
```bash
npx @squoosh/cli --avif '{"quality":70}' --resize '{"width":384,"height":512}' \
  public/avatar-stefan.png -d public/
```

**Fix em código:**
```tsx
// components/sections/contact.tsx:53
src="/avatar-stefan.avif"  // antes: /avatar-stefan.png
```

**Esforço:** 10 min.

---

### W0.5 — Hero video: poster + `preload="metadata"` + media query

**Por que:** consenso 4/4. O vídeo NÃO é LCP (mask esconde), mas baixa 5MB no critical bandwidth e disputa CPU/GPU com o reveal do `<h1>`.

**Fix:**
```tsx
// components/sections/hero.tsx:38-48
// 1) Gerar poster do frame 0:
//    ffmpeg -i public/bg/Anime_minimalista_no_song_202605220236.mp4 -vf "select=eq(n\,0)" -vframes 1 public/bg/hero-poster.jpg
//    npx @squoosh/cli --avif '{"quality":60}' public/bg/hero-poster.jpg -d public/bg/

// 2) Editar o componente:
<video
  autoPlay
  loop
  muted
  playsInline
  preload="metadata"
  poster="/bg/hero-poster.avif"
  className="h-full w-full object-cover"
  style={{ opacity: 0.7 }}
  aria-hidden="true"
>
  <source
    src="/bg/Anime_minimalista_no_song_202605220236.mp4"
    type="video/mp4"
    media="(min-width: 768px) and (prefers-reduced-motion: no-preference)"
  />
</video>
```

**Bonus:** reencode VP9/AV1 pra ≤1.8 MB com `ffmpeg -i in.mp4 -c:v libaom-av1 -crf 35 -b:v 0 out.mp4`. Economia: −3.2 MB sem perda perceptual.

**Esforço:** 20 min (inclui ffmpeg).

---

### W0.6 — Purge de dead code + deps não usadas

**Fix:**
```bash
# 1) Deletar arquivos dead code
rm components/hero/spline-hero.tsx
rm components/sections/bento-skills-rive.tsx

# 2) Editar package.json — remover:
#    "@rive-app/react-canvas"
#    "@splinetool/react-spline"
#    "@splinetool/runtime"
#    "shiki"   (zero import real — verificar antes com grep)

# 3) pnpm install
pnpm install
```

**Verificação:**
```bash
pnpm run build
# Bundle delta esperado: -330 KB gz no first load JS.
```

**Esforço:** 15 min (inclui verificação grep + build).

---

### W0.7 — Remover PP Editorial Regular weight

**Fix:**
```tsx
// app/layout.tsx:20-36
const ppEditorial = localFont({
  src: [
    {
      path: '../public/fonts/PPEditorialNew-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    // REMOVER o bloco Regular (linhas 27-31)
  ],
  variable: '--font-editorial',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});
```

**Bonus** (separado, W2): converter `Italic.otf` → `Italic.woff2` reduz 58KB → ~28KB. Use `npx ttf2woff2` ou `pyftsubset` com subset latin.

**Esforço:** 5 min (sem conversão woff2) / 30 min (com woff2 + subset).

---

### W0.8 — Fix footer dead link `#process`

**Decisão:** o `Process` no nav top-bar usa `/process` (rota separada — `layout.tsx:40`), então o footer deve seguir o mesmo padrão.

**Fix:**
```tsx
// components/sections/footer.tsx:19
{ label: 'Process', href: '/process' },  // era '#process'
```

Adicionalmente, mover `AnchorLink` → `next/link` quando o href começa com `/` (não com `#`).

**Esforço:** 3 min.

---

## 🌊 WAVE 1 — Bloqueadores estruturais ≤ 1 dia

> Custo total: 1 dev × 6-8h. Δ nota esperado: **+0.4 (8.8 → 9.2)**. Foco: conversão + a11y form + lazy boundaries.

### W1.1 — Consertar o ContactForm

**Por que:** Auditor 1 sinalizou. Verifiquei no código: `onValid` faz `formRef.current.requestSubmit()` mas o RHF `handleSubmit` já intercepta o submit. Loop ou no-op. Radio `prefere` sem `name` quebra Server Action.

**Estratégia:** usar React 19 nativo Server Action via `action={action}` puro, RHF SÓ pra validação client-side (não submit).

**Fix (escopo grande — pseudo):**

```tsx
// components/sections/contact-form.client.tsx

// 1) Remover o ref + requestSubmit truque. Deixar form action={action} nativo.
<form ref={formRef} action={action} className="...">
  {/* Inputs precisam de name="..." pra serem coletados pelo FormData */}
  <input name="nome" {...register('nome')} ... />
  <input name="email" {...register('email')} ... />

  {/* Radios — adicionar name="prefere" + register */}
  {PREFERE_OPTIONS.map((option) => (
    <input
      {...register('prefere')}
      id={id}
      type="radio"
      value={option}
      className="peer sr-only"
    />
  ))}

  <textarea name="mensagem" {...register('mensagem')} ... />

  {/* Botão dispara submit nativo. RHF reagirá ao submit pra validar ANTES.
     Se inválido, e.preventDefault() do handleSubmit barra o nativo.
     Se válido, deixa passar → action={action} executa. */}
  <Button type="submit" loading={isPending}>Enviar →</Button>
</form>

// 2) onSubmit deve ser apenas validação que preventDefaults se inválido:
<form
  ref={formRef}
  action={action}
  onSubmit={async (e) => {
    const ok = await trigger();  // RHF
    if (!ok) e.preventDefault();
  }}
>
```

**Esforço:** 1.5h (incluindo teste manual de envio + verificar Resend inbox).

**Verificação:** abrir DevTools Network → enviar form → conferir que `formData` no POST tem `nome`, `email`, `prefere`, `mensagem`.

---

### W1.2 — Lazy boundaries em `app/page.tsx`

**Por que:** Agent perf identificou que 5 sections abaixo do fold ficam no critical bundle. `next/dynamic` libera ~180 KB gz.

**Fix:**
```tsx
// app/page.tsx
import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/sections/hero';
import { SocialProofLine } from '@/components/sections/social-proof-line';
import { FeaturedWorkSection } from '@/components/sections/featured-work';

// Lazy abaixo da fold-1:
const OtherWorkSection = dynamic(
  () => import('@/components/sections/other-work').then(m => ({ default: m.OtherWorkSection })),
  { ssr: true, loading: () => <div className="container-max section-pad-y h-[60vh]" /> }
);
const BentoSkillsSection = dynamic(
  () => import('@/components/sections/bento-skills').then(m => ({ default: m.BentoSkillsSection })),
  { ssr: true }
);
const TimelineSection = dynamic(
  () => import('@/components/sections/timeline').then(m => ({ default: m.TimelineSection })),
  { ssr: true }
);
const PlaygroundTeaser = dynamic(
  () => import('@/components/sections/playground-teaser').then(m => ({ default: m.PlaygroundTeaser })),
  { ssr: true }
);
const ManifestoSection = dynamic(
  () => import('@/components/sections/manifesto').then(m => ({ default: m.ManifestoSection })),
  { ssr: true }
);
const ContactSection = dynamic(
  () => import('@/components/sections/contact').then(m => ({ default: m.ContactSection })),
  { ssr: true }
);

export default function HomePage() { /* same JSX */ }
```

**Importante:** `ssr: true` mantém SEO + first paint. Só o JS islands fica defer.

**Esforço:** 30 min.

---

### W1.3 — Reescrever `radio` semântico em `ContactForm`

Já coberto em W1.1, mas sublinho: `name="prefere"` é obrigatório pra Server Action receber valor.

---

### W1.4 — Limpar `text-(--color-text-3)/60` `/70` em separadores

**Por que:** alpha sobre text-3 fica ~1.5:1, invisível. Trocar por `text-(--color-hairline-strong)` que é decorativo aceitável e tem fundo de outline.

**Localizações:**
- `components/sections/contact.tsx:79, 81`
- `components/sections/footer.tsx:82, 117`
- `components/sections/manifesto-body.tsx:147, 151`

**Fix:**
```tsx
// Antes:
<span className="text-(--color-text-3)/60">·</span>

// Depois (decorativo, contraste OK):
<span aria-hidden="true" className="text-(--color-hairline-strong)">·</span>
```

**Esforço:** 20 min.

---

### W1.5 — Heading hierarchy: garantir UMA h1 + zero pulos

**Verificação:** rodar `pnpm exec next build` + browser `document.querySelectorAll('h1').length` deve ser 1. Confirmado pelo agent a11y que está OK, mas validar pós-fix da `<h2>STEFAN`.

**Esforço:** 10 min.

---

### W1.6 — Política de privacidade visível

**Por que:** Auditor 1 sinalizou. JSON-LD diz "LGPD compliance" mas não há link. Em B2B brasileiro, sinal vermelho.

**Fix:**
```tsx
// 1) Criar /app/privacidade/page.tsx — texto curto (≤500 palavras):
//    O que coletamos (nome, email, mensagem via Resend)
//    Por que (responder você)
//    Por quanto tempo (até resolução do contato, max 12 meses)
//    Direitos LGPD: acesso, correção, exclusão por email
//    Contato DPO: stefanheinz2006@gmail.com

// 2) Adicionar link no footer + abaixo do form:
//    "Ao enviar, você concorda com nossa Política de Privacidade →"
```

**Esforço:** 1h (escrever texto + criar rota).

---

## 🌊 WAVE 2 — Polish & Trust ≤ 3 dias

> Custo total: 1 dev × 18-24h. Δ nota esperado: **+0.3 (9.2 → 9.5)**. Foco: cases com impacto + assets editoriais + craft tipográfico.

### W2.1 — Cada case study ganha bullet de impacto não-técnico

**Por que:** consenso 4/4. Stack convence dev, impacto convence comprador.

**Fix:**
```ts
// lib/work/data.ts — estender interface CaseStudy
export interface CaseStudy {
  // ... campos existentes ...
  impact: {
    metric: string;        // "≤10 min/dia"
    context: string;       // "aprovação humana via Telegram"
    comparison: string;    // "vs 4-6 horas/dia em agência tradicional"
  };
}

// Em CASE_STUDIES['content-engine']:
impact: {
  metric: '≤10 min/dia',
  context: 'humano-in-loop via Telegram',
  comparison: 'substitui equipe de 4-6 pessoas',
},

// Em CASE_STUDIES.nexacore:
impact: {
  metric: 'multi-tenant',
  context: 'B2B em produção pra clínicas estéticas',
  comparison: 'striveos.shop · clínicas ativas',
},

// Em CASE_STUDIES['stj-app']:
impact: {
  metric: '162 testes runtime',
  context: 'PWA + prompt cache 2 camadas',
  comparison: 'INP <100ms em campo via Lighthouse',
},
```

E renderizar **acima** dos highlights técnicos em `components/sections/featured-work.tsx`. Tipografia editorial — não chip.

**Esforço:** 4h (incluir reescrita das taglines).

---

### W2.2 — Screenshot real do Content Engine (atualmente diagram fallback)

**Por que:** Auditor 1 e Auditor 3 sinalizaram. `screenshot: null` no flagship cria inconsistência visual com os outros tiles (NexaCore e STJ usam screenshot real).

**Opções:**
1. Capturar Telegram bot recebendo aprovação HITL → screencap composto
2. Aceternity MacBookScroll com dashboard mock
3. Diagrama vetorial cinematográfico custom

**Fix:**
```ts
// lib/work/data.ts:88
screenshot: '/work-screenshots/content-engine-telegram-hitl.png',
```

**Esforço:** 3h (capturar + editar Figma + export).

---

### W2.3 — Reduzir manifesto sticky de 200vh → 180vh

**Por que:** Auditor 1 e auditoria pessoal. 100vh de scroll travado é o limite. 80vh dá mais respiração sem perder reveal.

**Fix:**
```tsx
// components/sections/manifesto.tsx:182
'h-[180vh]',  // era 'h-[200vh]'
```

E ajustar timeline durations proporcionalmente.

**Esforço:** 20 min + 30 min de tunagem visual.

---

### W2.4 — Code-split do GSAP+SplitText do hero

**Por que:** Agent perf identificou que GSAP no critical path bloqueia o LCP do `<h1>`. Estratégia: renderizar headline estática primeiro, dar `requestIdleCallback` pro SplitText.

**Fix:**
```tsx
// components/hero/split-text-headline.tsx
// 1) Render shell SSR estática (sem 'use client' no shell)
// 2) Client island lazy aciona o SplitText pós-LCP

export function SplitTextHeadline({ children, className }: Props) {
  return (
    <h1 className={cn('headline-display text-balance', className)} data-split-target>
      {children}
    </h1>
  );
}

// Em separate file:
// components/hero/split-text-runtime.client.tsx (dynamic import)
'use client';
import { useEffect } from 'react';
export function SplitTextRuntime() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // requestIdleCallback → import('gsap') + import('gsap/SplitText')
    const handle = requestIdleCallback(async () => {
      const { gsap } = await import('gsap');
      const { SplitText } = await import('gsap/SplitText');
      // ... animação ...
    }, { timeout: 1500 });
    return () => cancelIdleCallback(handle);
  }, []);
  return null;
}
```

**Esforço:** 3h (refator + teste de hydration).

---

### W2.5 — `mix-blend-mode: screen` no flare do hero → trocar por OKLCH alpha

**Por que:** Auditor 2 sinalizou. `mix-blend-mode: screen` com `<video>` embaixo força recálculos GPU absurdos no Safari mobile (jank visível em iPhone XR pra cima).

**Fix:**
```tsx
// components/sections/hero.tsx:54-66
// Remover mixBlendMode: 'screen' e ajustar alpha do radial diretamente:
<div
  className="absolute left-1/2 bottom-[-30%] h-[140%] w-[160%] -translate-x-1/2 blur-3xl"
  style={{
    background: `radial-gradient(ellipse 50% 80% at 50% 100%,
      oklch(94% 0.22 124 / 0.10) 0%,
      oklch(94% 0.22 124 / 0.04) 28%,
      oklch(94% 0.22 124 / 0.01) 55%,
      transparent 75%)`,
    // mixBlendMode removido
  }}
/>
```

**Esforço:** 30 min (tunagem visual fina).

---

### W2.6 — Hue-shift do vídeo de fundo do hero pra alinhar com lime accent

**Por que:** auditoria pessoal identificou que o anime tem verde-ciano (hue ~150°) enquanto `--color-accent` é hue 124° (lime amarelado). Dois verdes brigando.

**Opções:**
- (A) Reencode com filtro `hue=h=-25` no ffmpeg
- (B) Overlay CSS sólido `linear-gradient(transparent, oklch(94% 0.22 124 / 0.08))` em cima do video

**Fix (B) — mais rápido:**
```tsx
// hero.tsx — adicionar logo após o <video>:
<div
  aria-hidden="true"
  className="absolute inset-0 -z-10"
  style={{
    background: 'oklch(94% 0.22 124 / 0.08)',
    mixBlendMode: 'color',  // OK aqui, só sobre vídeo (já abstraído)
  }}
/>
```

**Esforço:** 30 min (ou 1.5h com ffmpeg reencode).

---

### W2.7 — Optimizar todos work-screenshots PNG → AVIF

**Por que:** Agent perf encontrou `estetica-md-home.png` 2.29 MB, `eclipse-lime.png` 882 KB, `Midu-Style.png` 860 KB, etc.

**Fix:**
```bash
npx @squoosh/cli --avif '{"quality":65}' \
  public/work-screenshots/*.png \
  public/bg/eclipse-lime.png \
  public/bg/Midu-Style.png \
  -d public/
```

E atualizar referências `.png` → `.avif` em `data.ts` e CSS.

**Esforço:** 30 min.

---

### W2.8 — `size-adjust` no fallback do PP Editorial Italic (anti-CLS)

**Por que:** Auditor 2 sinalizou. Georgia tem x-height diferente da PP Editorial; swap causa CLS pequeno mas mensurável.

**Fix:**
```tsx
// app/layout.tsx:20-36
const ppEditorial = localFont({
  src: [{ path: '...', weight: '400', style: 'italic' }],
  variable: '--font-editorial',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  adjustFontFallback: false,  // Next 16 não suporta auto pra localFont
  // Adicionar manualmente no @font-face via globals.css:
});

// app/globals.css — adicionar:
@font-face {
  font-family: 'PPEditorialItalic-fallback';
  src: local('Georgia Italic');
  size-adjust: 91%;  /* descobrir via Capsize / Fontaine */
  ascent-override: 92%;
  descent-override: 23%;
  line-gap-override: 0%;
}
```

Use [Fontaine](https://fontaine.dev) ou [Capsize](https://seek-oss.github.io/capsize/) pra calcular `size-adjust` exato.

**Esforço:** 45 min.

---

### W2.9 — Magnetic CTA: já tem `useReducedMotionSafe`, mas dar bypass via setting

Já confirmado que `components/ui-effects/magnetic-cta.tsx:25` usa o hook. ✓ Nada a fazer aqui (auditoria pessoal apontou em falso — confirmado).

---

### W2.10 — `tracking-tight + text-balance` em h2 mobile (verificar não há overflow)

**Por que:** Auditor 2 mencionou. Verificar timeline year string `2021—2023` em mobile (320px wide) com `text-[3.5rem]`.

**Fix se quebrar:**
```tsx
// components/sections/timeline.client.tsx:64-69
'text-[2.5rem] sm:text-[4.5rem] lg:text-[5.5rem]'  // antes: text-[3.5rem] base
```

**Esforço:** 15 min teste + ajuste.

---

## 🌊 WAVE 3 — Estado da arte ≤ 1 semana

> Custo total: 1 dev × 30-40h. Δ nota esperado: **+0.5 (9.5 → 10)**. Aqui é onde sobe pra Linear/Vercel tier.

### W3.1 — Prova social humana (testimonials editoriais)

**Por que:** consenso 3/4. B2B sem voucher externo = "esse cara é bom, mas e o risco?".

**Fix:**
- Novo `components/sections/testimonials.tsx` — 2-3 quotes editoriais.
- Posicionar **entre OtherWorkSection e BentoSkills** (entre execução e capacidades, no momento de decisão de "vou apostar").
- Formato: foto monocromática mini + frase + nome + papel (ex: "Maria, gestora Clínica X — NexaCore").
- Tipografia: PP Editorial Italic 28-36px + name mono uppercase 12px.

**Conseguir as quotes:**
- Pedir 1 frase via WhatsApp pra:
  - 1 cliente NexaCore (Estética MD ou outra)
  - 1 colega B7Web/Scheffer que viu Stefan trabalhar
  - 1 prof Unicesumar ou colega Makita

**Esforço:** 8h (4h pra conseguir as quotes + 4h pra implementar componente).

---

### W3.2 — Cases com narrativa Problema → Solução → Impacto

**Por que:** consenso 4/4. Já cobre W2.1 mas aqui aprofunda em cada case study page (`/work/[slug]`).

**Fix:**
- Cada case ganha uma section "Antes / Depois" no topo (acima do scroll-pinned-horizontal):
  - Bloco "PROBLEMA" — 1 frase + ícone alerta + 1 número (custo/tempo gasto)
  - Bloco "SOLUÇÃO" — 1 frase + arquitetura visual (já existe diagram)
  - Bloco "IMPACTO" — métrica concreta + benefício humano

**Esforço:** 6h (estrutura) + 4h (copy + diagrama por case = 12h total se 3 cases).

---

### W3.3 — Hero V2: substituir anime swirls por asset autoral (HITL Telegram)

**Por que:** Auditor 3 (e provavelmente Stefan, conforme content-direction.md V2) — beam genérico contradiz "lei do site" (todo visual = recorte de processo silencioso).

**Conceito:** screencap real do Stefan recebendo notificação Telegram do Content Engine HITL, blur cinematográfico, lime accent grading, slow drift loop 8s.

**Esforço:** 6h (filmar/screencap + editar Resolve + export AV1).

---

### W3.4 — Block "Powered by clientes você ama" (Vercel-style)

**Por que:** Auditor 4 sugeriu. Stripe/Vercel-pattern de trust.

**Fix:**
- Logo strip pequeno hairline, monocromático, 6-8 marks: clínicas que usam NexaCore + escolas de medicina (STJ App) + brands Content Engine.
- Posicionar acima ou abaixo do testimonials.
- Mono uppercase eyebrow: "EM PRODUÇÃO PARA".

**Esforço:** 4h.

---

### W3.5 — Lighthouse CI gate no GitHub Actions

**Por que:** previne regressão. Já tem `lighthouserc.json`, falta wirear no CI.

**Fix:**
- `.github/workflows/lhci.yml` rodando `pnpm lhci autorun` em cada PR
- Threshold: Performance ≥95, Accessibility ≥98, Best Practices ≥95, SEO 100
- Falhar build se cair

**Esforço:** 1.5h.

---

### W3.6 — Variável `text-display` editorial pros years da timeline

**Por que:** auditoria pessoal — sugestão pra subir polish em tipografia.

**Fix:**
```css
/* app/globals.css — adicionar */
@utility year-editorial {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums oldstyle-nums;
  font-feature-settings: 'lnum' 0, 'onum' 1;  /* old-style nums */
}
```

Aplicar em `components/sections/timeline.client.tsx:64`.

**Esforço:** 30 min.

---

### W3.7 — Cal.com modal com "Starting at $X" caveat (qualificação)

**Por que:** Auditor 2 sugeriu. Filtra curiosos.

**Fix:** Adicionar microcopy no `Cal.com 15min` trigger:
```tsx
<p className="font-mono text-2xs text-(--color-text-3) mt-2">
  Projetos a partir de R$ 15k · escopo mínimo 4 semanas
</p>
```

**Decisão pendente do Stefan:** valores reais. Coloquei placeholder.

**Esforço:** 10 min (após decisão).

---

## 📐 Sequência de execução recomendada (1 dev solo)

```
Dia 1 (segunda, ~4h):    Wave 0 inteira (W0.1 → W0.8)
                          → Esperado: 8.12 → 8.8, Lighthouse +25 pts

Dia 2 (terça, ~6h):       W1.1 (form fix) + W1.2 (lazy boundaries) + W1.4 (alpha cleanup)
Dia 3 (quarta, ~4h):      W1.5 (heading) + W1.6 (privacidade) + smoke test
                          → Esperado: 8.8 → 9.2

Dia 4 (quinta, ~6h):      W2.1 (impact bullets) + W2.7 (image opt)
Dia 5 (sexta, ~6h):       W2.4 (split GSAP off critical) + W2.2 (Content Engine screenshot)
Dia 6 (sáb, ~4h):         W2.3, W2.5, W2.6, W2.8, W2.10 (polish day)
                          → Esperado: 9.2 → 9.5+

Semana 2 (W3):            Conseguir testimonials + hero V2 + cases narrative + LHCI gate
                          → Esperado: 9.5 → 9.8-10
```

---

## 🚫 Anti-objetivos — o que NÃO fazer

Por integridade das decisões já tomadas:

1. **NÃO trocar Geist por Inter / outra sans.** A escolha de Geist + PP Editorial Italic é craft. Mudar é regressão.
2. **NÃO adicionar scale: 1.05 em hover de cards.** O `translateY(-2px)` puro foi decisão consciente (Linear/Vercel signature). Comentários nos arquivos reforçam.
3. **NÃO substituir Lando sticky por GSAP `pin: true`.** A implementação atual (200vh outer + sticky inner) é correta. Memória `feedback_lando_sticky_pattern.md` é regra.
4. **NÃO remover o easter egg console.** É craft de marca.
5. **NÃO encolher a section-pad-y.** O whitespace generoso é parte da identidade premium.
6. **NÃO mudar a paleta lime + amber sub-accent.** Sistema disciplinado, não tocar.
7. **NÃO transformar manifesto em accordion / collapse.** O sticky scroll-jacking é a peça-de-resistência narrativa.

---

## 🎯 Definition of Done por wave

### Wave 0
- [ ] `npx pa11y http://localhost:3000` retorna 0 critical violations
- [ ] Lighthouse Performance ≥ 80 em 4G simulado (cable)
- [ ] `pnpm run build` mostra bundle JS first load ≤ 200 KB gz
- [ ] Avatar carrega em ≤100ms em 4G
- [ ] Footer "Process" link funciona (vai pra `/process`)

### Wave 1
- [ ] Submit do form chega no inbox + Resend dashboard
- [ ] `formData.get('prefere')` retorna valor correto (testar 3 opções)
- [ ] Política de privacidade rota `/privacidade` indexável
- [ ] `next/dynamic` em 5 sections — confirmar via DevTools Network que chunks são separados
- [ ] Heading outline limpa via Lighthouse Accessibility ≥ 98

### Wave 2
- [ ] Cada case study tem bullet visível de impacto **acima** dos highlights técnicos
- [ ] Content Engine ganha screenshot real (não diagram)
- [ ] LCP em mobile cable 4G ≤ 1.8s (medido via PageSpeed Insights)
- [ ] Cumulative Layout Shift = 0 (zero)
- [ ] Manifesto: scroll de saída suave sem flicker

### Wave 3
- [ ] 2+ testimonials reais publicados (com permissão escrita)
- [ ] Hero V2 com asset autoral
- [ ] Lighthouse CI gate ativo no PR
- [ ] Lighthouse: Performance ≥95 · Accessibility ≥98 · BP ≥95 · SEO 100

---

## 📞 Decisões que precisam do Stefan

Não posso decidir essas sem você:

1. **Hero V2**: anime mantém ou troca por HITL Telegram screencap? (W3.3)
2. **Cal.com qualificação**: pricing tier público ou mantém invisível? (W3.7)
3. **Quotes de testimonials**: quais 3 contatos pedir frase? (W3.1)
4. **Política de privacidade**: tom formal ou continuar voz de manifesto? (W1.6)
5. **Domain `striveos.shop`** ainda live? Se sim, podemos linkar como prova externa.

---

**Última nota:** o site já é melhor que 90% do que existe em portfolio brasileiro de AI/Product Engineering. As 4 IAs concordaram que a fundação é sólida. Os pontos críticos não são "refazer" — são **destravar conversão (form quebrado) + ganhar Lighthouse (assets pesados + dead code) + traduzir stack pra impacto**. Isso é um sprint de execução, não de redesign.

🤖 Compilado por Claude Opus 4.7 com base em `AUDITORIA.md` + agentes Explore (a11y) + vercel:performance-optimizer + verificação direta de código + screenshots Playwright (desktop 1440×900 + mobile 390×844).
