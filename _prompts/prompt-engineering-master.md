# PROMPTS REFINADOS V2 — stefanscrepka.dev (Portfolio Editorial)

**Prompt Engineering Master Document · V2**
Reescrito após Stefan apontar: **isso é portfólio pessoal, não landing de produto.**

> **REGRA DE OURO V2:** Cole literal. Itere com seed. Cada prompt aqui é **editorial cinema do CONTEXTO**, não demo do produto. Se um prompt aqui parece "venda" em vez de "atmosfera de quem trabalha" → ele tá errado, reporta.

---

## MUDANÇA FILOSÓFICA (V1 → V2)

V1 estava errado. Pensei como landing page de produto:
- ❌ Beam atmospheric vazio (genérico, sem significado pro Stefan)
- ❌ HITL approval frame (= vídeo de produto rodando = landing)
- ❌ Squad orbital diagram (= demo da arquitetura interna)

V2 está certo. Pensa como **portfólio pessoal premium**:
- ✅ Editorial cinema do CONTEXTO (mostra o LUGAR onde Stefan trabalha, não O QUE ele construiu)
- ✅ Tipografia + craft + restraint
- ✅ Atmosphere humana implícita (humano fora do frame, mas presente)
- ✅ Lime accent SEMPRE isolado em um ponto único, nunca dominante

Os portfolios que Stefan curte (Lando, Midu, Portfolite, Portfolo, Rauno.me) **não mostram o produto rodando no hero**. Mostram a **pessoa + atmosfera + signaling de craft**.

---

## PRINCÍPIO MESTRE — A LEI DO SITE

> **Visual de portfólio é EDITORIAL CINEMA DO CONTEXTO, não DEMO DO PRODUTO.**

3 perguntas que validam qualquer asset antes de aceitar:
1. Esse visual mostra o **lugar onde algo acontece**, não a UI do que aconteceu?
2. Tem **humano implícito** (objetos usados, luz, hora do dia) mas **nenhum humano no frame**?
3. O lime/amber está **isolado em UM ponto único**, não espalhado?

3 sim = passa. Qualquer não = recomeça.

---

## ESTÉTICA MESTRA — "MIDNIGHT WORKSHOP EDITORIAL"

Tom unificado de todo asset visual do site:

- **Atmosfera**: noite (ou alvorada/início de manhã), foco solitário, hardware real
- **Mood**: Roger Deakins meets Khalid Mohtaseb (Apple product films) meets Bradford Young (Arrival quietness)
- **Color split**: warm amber #B07A3E em highlights (heritage Eletrotécnica + Estética MD echo sutil) + cool cyan-blue #1E2A38 em shadows. Lime accent #D2FF00 isolado em pontos específicos.
- **Film stock**: Kodak Portra 400/800 medium format simulated grain (orgânico, premium, NÃO digital)
- **Composição**: rule of thirds, 70% negative space, foco em UM elemento
- **Anti-cliché**: zero orange-and-teal LUT, zero Instagram filter, zero smoke machine

---

## TOOL STACK V2 (atualizado pra editorial estático predominante)

| Tier | Tool | Uso primário | Custo |
|---|---|---|---|
| **Primary** | **Imagen 3** (Google, upgraded I/O 2026-05-19) | 4 case covers editoriais + opcional hero backdrop + opcional contact closing | FREE via Gemini API |
| Backup | **Nano Banana 2** (Gemini App, free) | Image consistency / refinement / variantes | FREE |
| Especial | **Veo 3.1** | APENAS se quiser regenerar Manifesto backdrop atmospheric. Beam já gerado anteriormente pode ser reusado | FREE (cap quota) |
| Code | **React + Motion 12** | Cursor-aware reveal layer (hero), Agent Pool grid (Bento Skills) — zero asset, puro código | - |

**Não vamos usar (V2):**
- Seedance 2.0 (não precisamos mais de vídeo cinematic; reservado pra Manifesto se necessário)
- Kling 3.0 (mesmo motivo)
- Pika 2.5 / Luma Ray3.14 (mini-gifs de produto não fazem sentido no portfolio editorial)
- GPT Image 2 (Imagen 3 cobre o que precisamos)

**Custo total estimado V2:** ~$0 (tudo free via Gemini API + Nano Banana). Geração: 1-2h iterando 5 imagens.

---

## A. HERO

### A.1 Direção principal — SEM asset dominante

O hero **não precisa de imagem grande**. Em portfolios premium (Rauno.me, Vercel engineering, Linear Origins), o hero é **tipografia + whitespace + micro-interactions**. O craft está nos detalhes invisíveis, não no asset gigante.

**O que vai no hero:**
1. ✅ Headline travada + EditorialAccent italic "multi-agente" + subhead + CTAs (já temos)
2. ✅ **Cursor-aware secret reveal layer** (CODE, não asset) — textos contextuais aparecem sutilmente quando cursor entra em áreas específicas
3. 🟡 **Opcional**: imagem editorial sutil de fundo (prompt A.2 abaixo)

### A.2 Imagem opcional pro slot direito do hero — Imagen 3

**SE quiser ter um asset no slot direito do hero** (recomendado deixar SEM, mas opção aqui):

```
Editorial cinematic still photograph, shot on Hasselblad medium format,
50mm f/2.8.

Subject: An out-of-focus rear quarter view of a contemporary desk at
night. Visible only as soft shapes: the warm halo of a single
incandescent bulb (warm 2700K) in upper-left, the cool blue rectangle
of a monitor that's mostly off-frame (only its glow spills into the
right side), the faintest suggestion of a mechanical keyboard's
silhouette in foreground.

The frame is 70% atmospheric haze and warm-cool color split. No
recognizable text on the monitor. No product. No brand. No human.

Lighting: dominant motivated practical light from the bulb (warm amber
fall-off into the right half of frame), counter-lit by the cool monitor
glow (cyan-blue) on the left edge. Highlights soft, blacks lifted.

Color: split toning — warm amber #B07A3E in highlights, cool cyan-blue
in shadows. Neutral 70% saturation overall. Single lime hint #D2FF00
ONLY at one pinpoint on the bulb filament glow (almost imperceptible —
represents accent without dominating).

Texture: Kodak Portra 800 medium format grain, 14% intensity, organic.

Mood: 03h, focused solitude, the room where AI systems are built.
Reference: Roger Deakins atmospheric night interiors, Bradford Young
quietness, Greig Fraser ambient light.

Aspect: 3:4 portrait OR 1:1 square (escolha ao gerar).
```

**Negative:**
```
no human, no face, no hands, no text legible, no logos, no brands
visible, no product UI, no dashboard, no lime overload, no neon, no
orange-teal cliché, no smoke machine plume, no rainbow, no oversaturation
```

**Significado:** "este é o lugar onde Stefan constrói". Sente-se a presença de uma pessoa sem ver ninguém. Editorial pura.

**Recomendação:** **deixa sem.** O hero ganha mais força minimal + cursor-aware reveal layer (que eu codifico).

---

## B. FEATURED WORK COVERS — Editorial Cinema do Contexto

4 fotos editoriais. Cada uma evoca o **contexto** do produto, **sem demo**.

### B.1 Content Engine cover

```
Editorial cinematic still photograph, shot on Hasselblad medium format,
80mm f/4.

Subject: A dark workshop interior at 03h. The frame is dominated by
an out-of-focus terminal screen on the right — cool cyan glow,
unreadable colored ASCII shapes only (no legible text), suggesting
log output streaming. On the left, a single overhead amber bulb casts
warm light. Between them, suspended dust particles drift in the beams.

In foreground: a closed leather notebook (worn, used), a single ceramic
black coffee mug (no logo), and a wired mechanical keyboard seen edge-on
(caps visible but no readable letters). No human.

Lighting: dual-source, warm amber bulb left + cool cyan monitor right.
Shadows deep, blacks lifted. Dust catches both lights.

Color: split toning warm amber + cool cyan shadows. 70% saturation.
Single lime hint #D2FF00 on one cap of the keyboard (faint reflection,
suggests brand without showing).

Texture: Kodak Portra 800 medium format grain 14%. Subtle natural
roll-off in highlights.

Mood: the place where multi-agent systems are debugged at night.
Reference: Roger Deakins, Bradford Young quiet night interiors.

Composition: rule of thirds, screen on right third, bulb on upper-left
third, objects in lower-third foreground.

Aspect: 16:10 (1920x1200).
```

**Negative:**
```
no human, no face, no hands, no readable text on screen, no readable
text anywhere, no logo, no brand, no UI dashboard, no demo, no Apple
logo, no smoke plume, no rainbow, no oversaturation, no orange-teal
LUT cliché
```

**Significado:** "Content Engine não é uma UI bonita — é um sistema que roda enquanto eu trabalho na madrugada com isso na frente."

---

### B.2 NexaCore cover

```
Editorial cinematic still photograph, Hasselblad medium format,
80mm f/4.

Subject: A clean modern desk in soft morning light. On the desk: a
MacBook open at slight 30° angle, showing a dark mode dashboard
interface — visible but intentionally soft-focused so the data panels
are recognizable as a dashboard but unreadable in detail. Beside the
MacBook: a small ceramic vase with a single dried branch, a folded
grey notebook, a glass of water with morning condensation.

Background: soft out-of-focus window light, pale cool morning, hint
of architectural lines (a window frame edge, very blurred).

Lighting: window light (cool 5800K) as key, diffused. No artificial
light. Soft natural midday quality. The MacBook screen is a secondary
glow on the desk surface.

Color: cool morning grade, slightly desaturated, single lime hint
#D2FF00 in one place on the dashboard (a tiny KPI accent, barely
visible). Lifted blacks, soft highlights.

Texture: Kodak Portra 400 grain 12%, organic film roll-off.

Mood: B2B SaaS managed from a calm professional workspace. Quiet
authority, not flashy startup energy. The opposite of "founder hero
shot".

Composition: rule of thirds, MacBook center-right, supporting objects
left third.

Aspect: 16:9 (1920x1080).
```

**Negative:**
```
no human, no hands, no face, no logos (Apple logo blurred out), no
readable text/data on dashboard, no demo screenshot, no neon glow, no
orange-teal, no oversaturation, no Instagram filter
```

**Significado:** "Sistema B2B sério, rodando para clínicas reais. Não é hype startup — é trabalho sólido administrado calmamente."

---

### B.3 STJ App cover

```
Editorial cinematic still photograph, Hasselblad medium format,
80mm f/4.

Subject: An iPhone in portrait orientation, propped vertically on a
matte black surface against a soft out-of-focus background. The screen
is on, displaying a PWA mobile interface — dark mode, visible as a
structured app screen but data intentionally illegible (soft defocus).
Single lime accent visible as a small status indicator on the screen.

Around the phone: a closed athletic notebook (suggesting fitness/
operational context — STJ App is for @linareis.fit operations), a
single pen, a wireless earbud case (matte black, no logo).

Background: out-of-focus dark workspace, hint of a window with cool
diffused light bleeding in from upper-left.

Lighting: cool window light key (5500K) + the phone screen's own glow
as fill. Subtle, no harsh shadows.

Color: cool desaturated grade, lime isolated to single screen status
indicator. Lifted blacks. No orange-teal.

Texture: Kodak Portra 400 grain 12%.

Mood: operational tool for a team, used quietly in a real workspace.
Not lifestyle photo. Not startup flat-lay. Just real working object.

Composition: phone vertical center, supporting objects flanking. Rule
of thirds: phone screen at right-third intersection.

Aspect: 4:5 portrait (1080x1350).
```

**Negative:**
```
no human, no hands, no face, no Apple logo visible, no readable text
on screen, no brand logos, no fitness influencer aesthetic, no neon,
no orange-teal, no oversaturation
```

**Significado:** "PWA real, usado pela equipe @linareis.fit em operação cotidiana. Ferramenta, não product showcase."

---

### B.4 Estética MD cover (amber sub-accent isolado)

```
Editorial cinematic still photograph, Hasselblad medium format,
80mm f/4.

Subject: A warm aesthetic clinic reception corner, late afternoon.
Visible elements: a folded linen towel on a pale oak surface, a
ceramic vase with a single white lily, a small ambient lamp casting
warm amber glow #FFB347. NO medical instruments. NO clinical white.
NO doctor's office sterility. Just the warm, calm, premium feeling
of a spa.

Background: out-of-focus warm cream walls with subtle architectural
shadows. Soft sunset light streaming from off-frame window (3500K,
warm gold).

Lighting: dominant window light (warm sunset) + soft amber lamp as
fill. All warm. Soft, diffused, NO harsh shadows.

Color: warm desaturated palette, amber #FFB347 as the only saturated
accent on lamp glow, cream and pale oak warm midtones, lifted blacks
warm undertone. NO lime. NO cool blue.

Texture: Kodak Portra 400 grain 12%, gentle film roll-off.

Mood: medical aesthetic premium spa, calm sophistication, human warmth.
Reference: Cereal magazine editorial, hôtel boutique photography,
Emmanuel Lubezki Tree of Life ambient interior.

Composition: rule of thirds, lamp glow upper-right, vase center, towel
foreground.

Aspect: 16:9 (1920x1080).
```

**Negative:**
```
no human, no hands, no faces, no medical instruments, no needles, no
syringes, no clinical white sterile, no doctor coat, no LIME GREEN
(this case is amber-only), no cyberpunk, no neon, no text legible, no
logos, no plastic surfaces, no waxy
```

**CRÍTICO:** amber só, **ZERO lime** nesta cover. Stefan travou isolation amber pra MD.

**Significado:** "Clínica premium, atmosfera de cuidado e calma. Cliente real, em produção. Quem quer um site assim sabe que esse é o tom."

---

## C. MANIFESTO BACKDROP — Sutil, introspecção

### C.1 Opção A — Reusar beam Veo já gerado

O `Light_beam_in_deep_void_202605201459.mp4` que já temos pode virar backdrop do Manifesto com **5% opacity overlay** atrás do texto. No contexto Manifesto (declaração filosófica do autor), o beam atmospheric ganha significado: é a luz da introspecção.

**Tratamento:**
- Opacity 0.04-0.08 no `<video>` tag
- `mix-blend-mode: screen` ou `multiply`
- Position behind manifesto text com `z-index: -1`
- Lazy load + reduced-motion fallback pro frame poster

### C.2 Opção B — Gerar backdrop editorial estático novo (Imagen 3)

```
Abstract editorial backdrop, soft long-exposure photograph of dust
particles suspended in a single cool light beam falling diagonally
across a deep void. Heavy atmospheric haze, Kodak film grain. Locked-
off frame. Cool cyan-blue shadows, single lime hint #D2FF00 isolated
in one particle highlight. 80% negative space.

Reference: Bradford Young Arrival heptapod interior, atmospheric
restraint.

Aspect: 16:9 widescreen.
```

**Negative:**
```
no human, no object, no architecture, no text, no logos, no
oversaturation, no smoke machine, no rainbow
```

**Significado:** "espaço de pensamento" — apenas atmosfera sutil, deixa o texto do manifesto ser o protagonista.

**Recomendação:** Opção A (reusar Veo). Não desperdiça o asset já gerado, recontextualiza.

---

## D. CONTACT / FOOTER CLOSING

### D.1 Imagem editorial closing — opcional (Imagen 3)

```
Editorial cinematic still, Hasselblad medium format 80mm f/4.

Subject: A clean desk at dawn. Empty surface (warm oak), a single
closed leather notebook, a coffee cup with steam catching morning
light. The workspace at rest. Window light pours in soft from upper-
left.

Lighting: dawn light, warm 3800K, diffused, gentle directional.

Color: warm desaturated grade, lifted blacks warm undertone, single
lime hint #D2FF00 on a pen detail (barely visible).

Texture: Kodak Portra 400 grain 12%.

Mood: end of the work day, quiet readiness, contact moment. Reference:
Lubezki Tree of Life morning interior.

Composition: rule of thirds, window light upper-left, objects centered-
right.

Aspect: 16:9 OR full-width hero of contact section.
```

**Negative:**
```
no human, no face, no hands, no logos, no readable text, no neon, no
oversaturation
```

**Significado:** "fim do dia, mesa limpa, momento de conversar". Closing emocional.

**Recomendação:** Opcional. Se gerar, usa como fundo sutil da contact section.

---

## E. BENTO SKILLS — CELL IA AGENTIC (componente React, não asset)

Não precisa de prompt de imagem aqui. É código.

**Conceito "Agent Pool 5×5":**
- Componente React + Motion 12
- Grade 5×5 com 22 pontos ocupados (3 vazios = "capacidade não-saturada")
- Cada ponto = 1 agente, identificado por código (O-1, O-2, ...)
- Pulsam em ondas sucessivas por squad: 0-1s squad O pulsa lime, 1-2s squad I pulsa, etc.
- Loop 6s
- On hover: todos os 22 acendem simultâneo em lime forte

Label abaixo: `5 squads · 22 agentes · ≤10 min/dia humano-in-loop`

**Significado:** "22 agentes organizados como um inventário, não satélites flutuando." Reforça heritage industrial Eletrotécnica de forma sutil (grid ordenada = planta de fábrica).

**Implementação:** ~2h de código. Stefan ou Claude codifica.

---

## F. WORKFLOW DE GERAÇÃO (Imagen 3)

### F.1 Por imagem

1. **Setup:** Gemini API ou Google AI Studio (free tier). Aspect ratio configurado na request.
2. **Geração paralela:** rode 4 variações simultâneas do mesmo prompt (Imagen 3 permite). ~30s cada.
3. **Avaliação em 100% zoom:**
   - Text legibility: NÃO deve ter texto legível em screens (deve estar soft-focused)
   - Hardware fidelity: laptops/phones realistas, sem 7 portas USB
   - Color match: split toning warm/cool correto, lime/amber isolado
   - Composition: rule of thirds respeitado
4. **Refine via Imagen 3 image editing:** Imagen 3 suporta in-painting de regions. Mask área problemática, regenera.
5. **Aprovação:** pelo menos 1 de 4 variações deve passar checklist anti-slop (`motion-design-principles.md` §G).

### F.2 Iterações esperadas

| Asset | Variações iniciais | Refinements esperados | Total tempo |
|---|---|---|---|
| Hero backdrop (opcional) | 4 | 1-2 | 30min |
| Content Engine cover | 4 | 2-3 | 45min |
| NexaCore cover | 4 | 1-2 | 30min |
| STJ App cover | 4 | 1-2 | 30min |
| Estética MD cover | 4 | 2-3 | 45min |
| Manifesto backdrop (opt B) | 4 | 1 | 20min |
| Contact closing (opt) | 4 | 1 | 20min |

**Total estimado:** 1.5-2h de geração + iteração se gerar tudo.

**Mínimo viável (MVP)**: gerar APENAS as 4 case covers. ~2.5h. Resto fica como atmosphere CSS-only e cursor-aware reveal (que eu codifico).

---

## G. PÓS-PRODUÇÃO

### G.1 Color grade unificado (Lightroom OU DaVinci OU Photoshop)

Pra TODAS as 4-7 imagens, aplicar a mesma receita pra garantir consistency entre fontes Imagen 3 diferentes:

**Lightroom Develop module (mais simples):**
- **White Balance**: Temp -8 (cool shift global), Tint 0
- **Tone**: Exposure 0, Contrast +15, Highlights -25, Shadows +20, Whites -10, Blacks +12 (lifted blacks)
- **Presence**: Texture +8, Clarity 0, Dehaze -5 (slight haze return), Vibrance -15, Saturation -10
- **HSL/Color**: Greens (lime range) → Saturation +20. Reds → Saturation -25. Blues → Luminance +5. Outros: untouched.
- **Effects**: Grain Amount 20, Size 25, Roughness 50
- **Detail**: Sharpening 25 + masking 50 (sharpen apenas edges)

**Export:**
- Sharpening for Screen: Standard
- File Settings: AVIF 80 quality, WebP 85 quality, JPG 88 quality (gerar os 3)
- Resolution: 1920px long edge (downsample do 4K Imagen 3)

### G.2 Compress final via sharp-cli ou ffmpeg

Se preferir CLI (mais rápido pra batch):

```bash
# AVIF + WebP + JPG batch (pasta atual)
for img in *.png; do
  npx sharp-cli -i "$img" -o "${img%.png}.avif" -f avif -q 80
  npx sharp-cli -i "$img" -o "${img%.png}.webp" -f webp -q 85
  npx sharp-cli -i "$img" -o "${img%.png}.jpg" -f jpeg -q 88
done
```

Onde dropar:
```
public/assets/work/
├── content-engine/
│   ├── cover.{avif,webp,jpg}
│   └── thumb.webp  (640w resize)
├── nexacore/
├── stj-app/
└── estetica-md/

public/assets/hero/
└── backdrop.{avif,webp,jpg}  (se gerar opcional)

public/assets/manifesto/
└── backdrop.{avif,webp,jpg}  (se gerar opt B)

public/assets/contact/
└── closing.{avif,webp,jpg}  (se gerar opcional)
```

---

## H. ANTI-PADRÕES BANIDOS (V2)

| ❌ Banido | ✅ Substituto |
|---|---|
| Vídeo do produto rodando no hero | Cursor-aware secret reveal layer (código) + opcional atmosphere editorial sutil |
| MacBookScroll com screenshot demo bombástico | Foto editorial de contexto, screenshot ilegível por defocus |
| HITL Telegram frame no hero | Mesma coisa sobe pra Bento Skills ou case study interno se quiser |
| Squad orbital diagram com 22 satélites animados | "Agent Pool 5×5" grid componente React (sutil, sem AI slop) |
| Beam atmospheric sem contexto | Atmosphere editorial COM significado (luz de janela, lâmpada warm, monitor glow) — não geometric beam |
| Lime espalhado em superfícies | Lime SEMPRE isolado em UM ponto único por frame |
| Orange-and-teal cliché LUT | Warm amber highlights + cool cyan shadows (split editorial) |
| Pessoas geradas por IA | Zero humanos no frame; presença implícita via objetos |
| Text legível gerado por IA | Text soft-focused / ilegível por defocus (única seguro) |

---

## I. RESUMO EXECUTIVO PRA STEFAN

### Ordem de execução recomendada

1. **Codificar `<CursorAwareReveal />`** — eu faço, ~2h. Não depende de você gerar nada.
2. **Gerar 4 case covers editoriais** (Imagen 3) — Stefan, ~2.5h iterando. Cole prompts B.1-B.4.
3. **(Opcional)** Gerar hero backdrop editorial sutil (Imagen 3) — Stefan, 30min. Cole prompt A.2.
4. **(Opcional)** Gerar manifesto backdrop OU reusar Veo beam — decidir entre Opção A/B em C.
5. **(Opcional)** Gerar contact closing — Stefan, 20min. Cole prompt D.1.

### Custo total

**Imagens via Imagen 3 = FREE** (Gemini API free tier suficiente).
**Tempo Stefan**: 2.5-4h iterando.
**Tempo Claude (código)**: ~2h pro cursor-aware reveal + 2h pro Agent Pool grid.

### MVP absoluto

Se só fizer **1 coisa**: gera as **4 case covers editoriais** (B.1-B.4). Isso sozinho já transforma o site de "Wave 1 vazio" pra "portfolio editorial premium funcionando".

### Nada vai pro lixo

Beam Veo gerado antes vira backdrop do Manifesto (Opção A). Todo prompt aqui é defensável em 1 frase de significado pra portfolio pessoal.

---

**Final note:** se algum prompt aqui ainda parecer "venda de produto" pra você, é minha falha de framing — reporta e refazemos. A regra: **toda imagem é o lugar onde Stefan trabalha, não o que ele construiu.**
