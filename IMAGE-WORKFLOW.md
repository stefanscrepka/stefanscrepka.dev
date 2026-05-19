# Screenshot → AI Image Enhancement → Site Integration

Pipeline pra transformar prints brutos dos sistemas (Content Engine, NexaCore admin striveos.shop, STJ App, Estética MD) em hero shots cinematic estilo Nextronium / NEONE / Huly. Documento de referência pra o Stefan executar.

Modelos cobertos (status maio 2026):
- **ChatGPT Image 2** (gpt-image-2) — OpenAI, abril 2026. Fast iteration, melhor text rendering curto, melhor inpainting com mask.
- **Nano Banana Pro** (gemini-3-pro-image-preview) — Google, novembro 2025. 4K native, melhor preservação de texto longo, até 14 reference images. **NOTA**: "Nano Banana Pro 2" não existe ainda — você se referiu provavelmente ao Pro (atual top) vs Nano Banana 2 (Flash, mais barato/rápido).

---

## PASSO 1 — Capturar screenshots LIMPAS dos sistemas

### 1A. Setup no Chrome

```powershell
# Profile dedicado pra captura (sem extensions interferindo)
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --user-data-dir="C:\Users\Stefan1\chrome-capture-profile" `
  --new-window "http://localhost:3000"
```

Dentro do Chrome:
1. F12 abre DevTools
2. Ctrl+Shift+M ativa device toolbar
3. Device dropdown → **Responsive**
4. Dimensões: `1920 × 1080` (default desktop) ou `2560 × 1440` (4K-ready)
5. Menu `⋮` no device toolbar → **Add device pixel ratio**
6. DPR = `2.0` (vai dobrar a resolução de saída — 1920×1080 vira 3840×2160)

### 1B. Captura

Ctrl+Shift+P abre Command Menu. Digite `screenshot`:
- **"Capture screenshot"** → só o viewport (mais limpo)
- **"Capture full size screenshot"** → página inteira (cuidado com sticky headers duplicados)
- **"Capture node screenshot"** → 1 elemento DOM específico (selecione no Elements panel antes) — **melhor opção pra capturar só o painel principal do dashboard, sem nav nem sidebar**

PNG vai pra `Downloads/`.

### 1C. Alternativa headless (sem browser chrome interferindo)

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --headless=new `
  --disable-gpu `
  --hide-scrollbars `
  --force-device-scale-factor=2 `
  --window-size=1920,1080 `
  --screenshot="C:\Users\Stefan1\Downloads\content-engine-source.png" `
  "http://localhost:3000/dashboard"
```

`--force-device-scale-factor=2` é o flag-chave. Output sai em 3840×2160.

### 1D. Antes de capturar — checklist

- [ ] Dark mode ativo no app (combina com paleta do portfolio)
- [ ] Dados reais (não Lorem) visíveis
- [ ] Zoom do browser em 100%
- [ ] Sem barras de scroll visíveis (use Capture node screenshot ou hide-scrollbars)
- [ ] Extensões desligadas (Incognito ou profile dedicado)
- [ ] Lazy-loaded images já carregadas (scroll uma vez antes)
- [ ] Cursor fora da área (DevTools tem "freeze" mas seguro mover pra um canto)

---

## PASSO 2 — Decidir a composição alvo

Duas referências base (saved local):
- **Nextronium** (`4a63b6f3f1ad9720eaf7cdb9ec3189a0.jpg`) — light beam radial origem BAIXO, V-shape triptych de dashboards
- **NEONE/Lumine** (`37cce64bc95918146fefb124a8d236c0.jpg`) — arc glowing TOPO, dashboard único centralizado cortado no fold

**Para o site do Stefan, recomendação por produto:**

| Produto | Estilo | Por quê |
|---|---|---|
| Content Engine | Nextronium radial beam (lime warm) | Sistema multi-agente = múltiplas peças → triptych funciona (squad dashboards lado a lado) |
| NexaCore SaaS | NEONE arc + single dashboard | Admin clínico = um produto único focado → arc dá premium tone |
| STJ App | NEONE adaptado portrait + glow circular | É PWA mobile → device frame 4:5 com glow purple radial |
| Estética MD | Light style sem beam (amber subtle) | Single página clínica → quer warmth, não dramaticness |

---

## PASSO 3 — Prompts customizados

### Estrutura prompt ChatGPT Image 2 (5-7 segmentos rotulados)

```
Scene: [environment/backdrop]
Subject: [the screenshot — describe what it is]
Composition: [framing, perspective tilt, position]
Lighting: [direction, color, hardness, source]
Style: [single dominant aesthetic — pick ONE]
Preserve: [exact list of invariants]
Constraints: [exclusions]
```

### Estrutura prompt Nano Banana Pro (Google 5-part formula)

```
Subject: [who/what — be specific]
Composition: [framing, camera angle, aspect ratio]
Action: [what is happening]
Location: [where the scene is]
Style: [single aesthetic descriptor]
```

### Prompt 1 — CONTENT ENGINE (Nextronium-style)

#### Para ChatGPT Image 2 (cole no chat + drag screenshot):

```
Scene: dark studio environment, near-black #080A07 backdrop, single
radial light beam emanating from below center frame at the bottom
edge, beam tint electric lime (#D2FF00) fading to transparent at
edges, faint volumetric haze fanning outward upward and sideways.

Subject: a single rectangular software dashboard screenshot
("Content Engine — Pipeline View") floating in mid-air. This is
Image A — pixel-exact reference, do not redraw the interior.

Composition: 7-degree perspective tilt to the right, dashboard
positioned slightly left of center vertically, 16:9 framing,
35mm cinematic feel, dashboard occupies 60% of frame height.

Lighting: warm key from below center (matching the beam origin),
soft fill from camera-left, hard contact shadow beneath dashboard
at 12% opacity offset 40px upward (the beam is below, light pours up).

Style: photorealistic product render, cinema-grade, dark studio
aesthetic. Pick ONLY photorealistic — no octane render, no pixar,
no anime.

Preserve: the dashboard pixels exactly as supplied — original UI
text verbatim, original UI colors (the lime accent on UI stays in
UI, the lime atmosphere stays in atmosphere — they DO NOT mix),
button positions, chart data, no font substitution.

Constraints: no browser chrome, no address bar, no extra UI panels,
no watermark, no duplicate dashboards, no logos beyond what's
already in the source.
```

#### Para Nano Banana Pro (Gemini app com Thinking mode + Create images, ou Vertex AI API):

```
Subject: a Content Engine dashboard screenshot (Image A — treat as
pixel-exact reference, do not redraw the interior).

Composition: 16:9 cinematic frame. Dashboard floats slightly left of
center with a 7-degree perspective tilt to the right. Low-angle
shot, shallow depth of field on the background only.

Action: the dashboard hangs suspended in a dark studio space; a
radial beam of electric lime light (#D2FF00) emanates from below
center at the bottom edge of the frame, fanning upward and outward
through volumetric haze. The beam appears to pool LOW, grounding
the dashboard like stage lighting.

Location: a near-black studio void (#080A07), with a barely-visible
reflective floor plane reflecting the dashboard at 25% opacity.

Style: photorealistic product render, cinema-grade, Apple keynote
aesthetic, muted teal-and-lime color grading. The dashboard interior
remains pixel-sharp and color-untouched; ONLY the surrounding
atmosphere is stylized. Render at 4K, 16:9.
```

### Prompt 2 — NEXACORE (NEONE-style arc)

#### ChatGPT Image 2:

```
Scene: black void background (#080A07), a horizontal glowing arc of
light spanning from screen-left to screen-right, arc color soft
white core (#FAFAFA) fading to lime (#D2FF00) at edges, thin film
of volumetric haze beneath arc.

Subject: NexaCore admin dashboard screenshot, full-window capture.
This is Image A — pixel-exact reference.

Composition: dashboard sits BELOW the arc on a barely-visible
reflective floor plane, 4-degree tilt back, dashboard occupies 60%
of frame, 21:9 ultrawide framing. Arc occupies upper third.

Lighting: top rim light from the arc (lime-white), warm undertone
bounce on dashboard top edge, soft contact shadow below.

Style: Apple keynote aesthetic, photorealistic.

Preserve: dashboard pixels verbatim, all labels and metric numbers
exactly as supplied, no font substitution, original color palette
of the UI untouched.

Constraints: no extra dashboards, no text outside the dashboard
beyond what's already there, no logos beyond what's in the source.
```

#### Nano Banana Pro:

```
Subject: the NexaCore admin dashboard (Image A — pixel-exact, do not
modify the interior in any way).

Composition: 21:9 ultrawide cinematic frame. Dashboard sits below a
horizontal glowing arc that spans the full width of the frame at
one-third from the top. Dashboard center, slight back-tilt 4 degrees.

Action: the arc glows with a soft white core (#FAFAFA) fading to
lime (#D2FF00) at its edges, casting a top rim light on the
dashboard. A faint film of haze hangs beneath the arc.

Location: black void (#080A07) with a barely-visible reflective
floor plane reflecting the dashboard at 30% opacity.

Style: Apple Vision keynote aesthetic, photorealistic, high-fidelity.
Three-point softbox lighting with the arc as the key light. Dashboard
text and chart data remain pixel-sharp and unchanged. Render at 4K, 21:9.
```

### Prompt 3 — STJ APP (mobile portrait com device frame)

#### ChatGPT Image 2:

```
Scene: deep dark gradient backdrop (#080A07 to #15172e), faint
particle dots in space, soft lime radial glow (#D2FF00 at 30%
opacity) from behind subject creating a halo.

Subject: STJ mobile app screenshot rendered inside an iPhone-style
device frame, frame material brushed graphite, no Apple logo, no
brand markings, no carrier text. This is Image A — pixel-exact
reference for the app content.

Composition: device tilted 12 degrees back and 6 degrees right,
floating center-frame, 4:5 portrait framing, ground reflection
falling off at 40% opacity.

Lighting: cool key from upper-left, warm lime rim from
camera-right, soft contact shadow at 50% opacity.

Style: photorealistic product render, shallow depth of field on
corners only, subject sharp.

Preserve: app screenshot pixels exactly, all text verbatim,
original brand colors of the app UI.

Constraints: no Apple logo, no carrier text, no extra phones, no
watermark, no notification overlays beyond what's in the screenshot.
```

#### Nano Banana Pro:

```
Subject: the STJ mobile app screenshot (Image A — pixel-exact
reference) rendered inside a generic device frame (no brand markings).

Composition: 4:5 portrait frame. Device tilted 12 degrees back, 6
degrees right, floating in the center of the frame. Low-angle shot
with shallow depth of field (f/1.8) on the device edges.

Action: a soft lime radial glow (#D2FF00) emanates from behind the
device; particles of light drift slowly in the foreground.

Location: deep void gradient (#080A07 at the top fading to #15172e
at the bottom) with faint star-field particles.

Style: photorealistic product render, cinematic color grading, warm
lime rim light from camera-right, cool blue key from upper-left.
The app screenshot interior is pixel-sharp; only the environment is
stylized. Render at 4K, 4:5.
```

### Prompt 4 — ESTÉTICA MD (warm amber, calmo, sem dramaticness)

#### ChatGPT Image 2:

```
Scene: warm dark backdrop (#080A07) with a subtle amber glow
(#F5B847 at 20% opacity) emanating from upper-right, no beam, no
arc — atmospheric warmth only.

Subject: the Estética MD home page screenshot (Image A — pixel-exact
reference), site institucional médico premium.

Composition: 16:10 framing, dashboard centered with minimal 3-degree
back tilt, calm presentation (not dramatic).

Lighting: soft warm key from upper-right (amber tone), neutral fill,
gentle contact shadow.

Style: editorial premium magazine cover, photorealistic, restrained.
The atmosphere is amber-warm; the site UI is untouched.

Preserve: original site pixels including the Estética MD italic
serif typography, the amber/cream palette of the brand, the
WhatsApp CTA button.

Constraints: no extra UI, no medical iconography added, no logos.
```

---

## PASSO 4 — Validar output (anti-failure checklist)

Antes de aceitar qualquer imagem gerada:

1. **Zoom 100%** — leia cada label da UI. Texto sumiu ou virou typo?
2. **Color picker** — pegue 3 pixels da paleta original (lime / branco / cinza). ΔE < 5 vs source?
3. **Sem chrome falso** — nenhuma barra de browser, nenhum window control fake?
4. **Mesma quantidade de elementos** — conte cards/botões. Match com source?
5. **Atmosphere ≠ UI** — o lime/amber está SÓ no fundo, não tingiu o card?
6. **Geometria intacta** — aspect ratio do dashboard preservado? Sem squashing?
7. **Sombra coerente** — direção da luz no atmosphere = direção da sombra debaixo?
8. **Um sujeito só** — sem dashboard duplicado acidental?
9. **Sem watermark / logo drift** — logos no source não viraram outros?
10. **Resolução real** — `Get-FileSize` no PNG bate com o solicitado?

**Se 2+ falham**: regenerate. **Se 1 falha + recuperável no Photoshop** (ex: 1 card tingido): composite local, não queime outra geração.

---

## PASSO 5 — Integrar no site

Quando tiver as imagens finais aprovadas:

### 5A. Salvar em `public/screenshots/`

```
public/screenshots/
├─ content-engine.png      (dashboard hero shot)
├─ content-engine-2k.png   (versão menor pra mobile)
├─ nexacore.png
├─ nexacore-2k.png
├─ stj-app.png
├─ stj-app-2k.png
└─ estetica-md.png
```

### 5B. Swap no data.ts (4 linhas)

`lib/work/data.ts`:

```ts
'content-engine': {
  // ...
  screenshot: '/screenshots/content-engine.png',  // antes: null
  diagram: 'squads',  // fallback se screenshot 404
  // ...
},
nexacore: {
  screenshot: '/screenshots/nexacore.png',
  diagram: 'nexacore',
},
'stj-app': {
  screenshot: '/screenshots/stj-app.png',
  diagram: 'stj',
},
'estetica-md': {
  screenshot: '/screenshots/estetica-md.png',
  diagram: 'estetica',
},
```

O `CaseStudyCover` component já está pronto pra isso — ele detecta automaticamente se `screenshot` está populado e troca de mode='diagram' pra mode='image' via `next/image`. Single source of truth, single deploy.

### 5C. `next/image` config (já configurado)

`next.config.ts` já tem `images.formats: ['image/avif', 'image/webp']`. Quando o PNG for servido, Next vai gerar AVIF/WebP automaticamente.

Sizes attribute no `ProductCover.tsx:image-mode` já configurado: `"(min-width: 1024px) 50vw, 100vw"` — Next vai gerar variantes responsivas.

---

## Bonus — Outras decisões visuais aplicáveis ao hero atual

Do agente que analisou Nextronium + NEONE em detalhe:

1. **Light beam de baixo > arc em cima** pro hero (Nextronium é mais memorável que NEONE pro caso multi-agente)
2. **V-shape no triptych** — empurra a placa central 0.5-1.0 unidade em z, recue as laterais. Sua scene-3d.tsx tem 3 placas mas todas no mesmo Z — isso é uma melhoria fácil
3. **Particle field / dot grid** sutil como segunda camada de textura no backdrop (Nextronium e NEONE têm)
4. **Headline line-height 1.0** (atualmente está 0.95 no display, mas linha-de-corpo está 1.5 — quando empilhar 2 linhas grandes, deixe 1.0 explicit)
5. **Cluster baixo** — dashboards a 60-80% da altura, atmosphere acima deles (pattern NEONE) ou luz pooling debaixo deles (pattern Nextronium)
6. **Um accent só por seção** — não compita lime + amber no hero; deixe amber pra Estética MD section

---

## Apêndice — Decision matrix

| Tarefa | ChatGPT Image 2 | Nano Banana Pro | Vencedor |
|---|---|---|---|
| Hero shot floating dashboard + atmosphere | Bom, cap 2K | 4K native, falloff cinematic | **Nano Banana Pro** |
| Edição cirúrgica com mask (swap botão) | Best inpainting | Menos preciso | **gpt-image-2** |
| Preservar texto longo (paragraphs) | Degrada após 50 chars | Best in market | **Nano Banana Pro** |
| Preservar labels curtos / metric numbers | Excelente | Excelente | Empate |
| Velocidade iteração (draft) | ~3s | ~10-15s (60-120s 4K) | **gpt-image-2** |
| Final 4K portfolio | 4K experimental | 4K native (até 5632×3072) | **Nano Banana Pro** |
| Multi-image composite (dashboard + style + env refs) | 2-3 refs | Até 14 refs | **Nano Banana Pro** |
| Raciocínio espacial complexo | Reasoning engine | Strong | **gpt-image-2** |
| Cost/1024×1024 hq | ~$0.21 | ~$0.14 | **Nano Banana Pro** |
| Cost/4K | n/a (não native) | ~$0.24 | **Nano Banana Pro** |

**Workflow recomendado pro Stefan:**
1. Drafte com gpt-image-2 a 2K (rápido, 3s loops no ChatGPT web UI)
2. Quando o prompt estiver fechado, finalize com Nano Banana Pro a 4K (Gemini app ou Vertex AI)
3. Se texto perder fidelidade: passe final no Photoshop/Figma — sobreponha screenshot original em transform exato sobre o background gerado. Pattern Linear/Vercel.

---

## Notas

- Status build atual: ✓ 20/20 rotas pre-renderizadas, typecheck + lint limpos
- Hero white-bug v2 fix aplicado: `HeroSceneClient` agora sempre wrappa em div com className + bg + style fallback inline. HeroPoster mudou de `aspect-square w-full` pra `h-full w-full`. scene-3d.tsx wrapper tem `width:100%; height:100%; backgroundColor:#080A07` inline
- THREE.Clock deprecation warning no console é de r3f/three.js 184 internamente — não é nosso código, ignorável (será corrigido em r3f update upstream)
- Outros warnings de extensões browser (`contentScript.js` Honey ou similar) — não é do site, são do Chrome extensions do user
