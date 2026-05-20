# MOTION DESIGN PRINCIPLES — stefanscrepka.dev

**Documento operacional · Versão de produção 1.0**
Autor: Motion Design Specialist
Consumidor: Prompt Engineer (Veo 3.1, Imagen 3, OBS post, DaVinci Resolve)
Escopo: hero loop, bento de processos, case covers, headshot, cell IA Agentic

---

## A. FILOSOFIA DE MOTION — O "ADN" DO SITE

O motion de stefanscrepka.dev é **infraestrutura silenciosa que respira**. Não é decoração. Stefan vende a imagem de **AI Product Engineer que constrói sistemas reais em produção** — o que significa que cada pixel animado precisa carregar uma das três funções: (1) **revelar continuidade de sistema** (fluxo de dados, loops fechados, feedback HITL), (2) **reforçar atmosfera de centro de operações** (terminal, monitor, light beam num void escuro = data center after-hours), ou (3) **pontuar uma transição de estado** (hover, scroll, navegação). Tudo o que não cumpre uma dessas três funções é ruído e deve ser cortado. O ADN é **restraint cinematográfico**: 1 movimento grande por composição, 80% negative space, easing assimétrico, luz que tem direção e fonte, partículas com massa, transições com peso. O oposto do "vibe vídeo AI generic" — que é caracterizado por movimento em todas as direções ao mesmo tempo, easing linear, particle systems sem física, lens flares aleatórios, color soup saturadíssimo, e zoom in/out sem intenção. O site fala "operador profissional silencioso", não "demo de tecnologia em loop infinito". Cada loop precisa parecer um **frame congelado de um processo industrial maior que continua acontecendo offscreen**.

---

## B. PRINCÍPIOS ANTI-AI-SLOP (18 itens operacionais)

### 1. Loops têm seam invisível por ping-pong ou phase-lock, nunca por dissolve
- **Por quê:** dissolve loop deixa "respiração" no frame 0/n — a mancha mais identificável de "vídeo AI".
- **Como verificar:** abre o MP4 em DaVinci, set playhead em frame `n-1`, depois em frame `0`. Diff perceptível = reprovou.
- **Como evitar no prompt:** incluir "loopable via ping-pong reverse" ou "elements drift across full frame and exit, replaced by phase-shifted clones" · banir "fade out, fade in", "transition to start".

### 2. Easing curves nunca lineares, exceto loop primário e grão
- **Por quê:** linear é o tell #1 de "feito em After Effects sem motion designer". Real motion no mundo físico é sempre easing.
- **Como verificar:** plota a curva de luminância de um pixel central em DaVinci. Linha reta = reprovou.
- **Como evitar no prompt:** "ease-in-out organic, like fluid in glass" · banir "constant speed", "uniform pulse".

### 3. Motion blur é shutter-based (180° rule), nunca pós-processamento gaussiano
- **Por quê:** blur fake = mancha radial direcional sem coerência temporal entre frames.
- **Como verificar:** scrub frame-by-frame e olhe trailing edges de partículas. Se o blur é simétrico em ambas direções de movimento = fake.
- **Como evitar no prompt:** "shot at 24fps with 180-degree shutter angle, natural motion blur on moving elements" · banir "motion blur effect", "blur trail".

### 4. Partículas têm massa, direção primária e drag
- **Por quê:** particles drifting em todas direções igualmente = simulation default sem intenção. Real atmospheric dust tem corrente dominante + brownian sutil.
- **Como verificar:** track 5 partículas frame-by-frame. Se trajetórias formam padrão coerente (uma corrente vertical + microscatter) = pass. Se aleatório uniforme = reprovou.
- **Como evitar no prompt:** "dust particles drifting upward with vertical bias, gentle lateral brownian, varied sizes, parallax depth" · banir "particles floating around", "random particle motion".

### 5. Composição respeita rule of thirds OU centralização extrema com simetria perfeita
- **Por quê:** "AI center-framed but slightly off" = uncanny valley de composição. Compromete a percepção premium.
- **Como verificar:** sobrepor grade rule-of-thirds. Focal point deve cair em interseção OU em center exato (50%/50%) com tolerância ±2px.
- **Como evitar no prompt:** "composition: vertical light column locked at right-third (x=0.66), or dead-center with perfect bilateral symmetry" · banir "centered composition" sem qualificador.

### 6. Negative space ≥ 70% do frame, sempre
- **Por quê:** AI tende a preencher o frame. Premium é vazio respirando.
- **Como verificar:** apply luminance threshold em 15%, mede % black. <70% = reprovou.
- **Como evitar no prompt:** "70% of frame is deep black void, only 30% contains active visual elements" · banir "rich visual scene", "detailed environment".

### 7. Color science: cool desat base + lime isolado em emissive
- **Por quê:** Veo default = warm saturated soap opera digital. Site é cool/cyan-shadows + lime emissive isolado tipo neon-in-fog.
- **Como verificar:** vectorscope. Bulk dos pixels em quadrante azul-cyan baixa saturação, ponto lime isolado em high sat. Distribuição radial uniforme = reprovou.
- **Como evitar no prompt:** "color palette: deep oklch dark base #080A07 with cool cyan-blue shadows, lime accent #D2FF00 only in emissive highlight, desaturated overall except the lime source" · banir "vibrant", "colorful", "rich color".

### 8. Lighting consistency: 1 key + 1 fill suave + 1 rim opcional, nunca chiaroscuro caótico
- **Por quê:** AI multiplica fontes de luz pra "ficar interessante" — resultado é shadows conflitantes = uncanny.
- **Como verificar:** identifica shadows em 3 objetos. Apontam pra mesma direção ±10°? Pass. Direções aleatórias = reprovou.
- **Como evitar no prompt:** "single primary light source from screen-top, soft cyan ambient fill, no secondary highlights, consistent shadow direction" · banir "dramatic lighting", "multiple light sources".

### 9. Edge integrity: zero warping em superfícies retas
- **Por quê:** AI warpa edges em frames intermediários — Bezier wobble em coisas que deveriam ser retas (telas, edges de UI, light beam vertical).
- **Como verificar:** track uma edge reta com Mocha por 100 frames. Variance > 1.5px = reprovou.
- **Como evitar no prompt:** "vertical light beam is geometrically straight, fixed width, no organic distortion" · banir "flowing", "organic shapes" pra elementos que devem ser estáveis.

### 10. DOF é decisão, não default
- **Por quê:** AI default = tudo blur-in-blur-out. Real DOF tem plano focal estável que define hierarquia.
- **Como verificar:** identifica focal plane no frame 1 e frame n. Mesmo? Pass. Drift = reprovou.
- **Como evitar no prompt:** "shallow depth of field f/2.0, focal plane locked on [X], foreground particles soft, background pitch black void" · banir "rack focus", "shifting focus" exceto se for intencional.

### 11. Camera movement: locked-off por padrão; pan/orbit só se justificável
- **Por quê:** AI ama micro-orbital movement como "respiração" — vira soap opera. Tripod-locked = pro.
- **Como verificar:** track 3 corner points por 100 frames. Variance combinada > 2px = camera não está locked.
- **Como evitar no prompt:** "static locked-off camera, tripod-mounted, no handheld motion, no breathing zoom" · banir "subtle camera movement", "drone-like floating".

### 12. Atmospherics (fog, haze, mist) substituem detail, não escondem
- **Por quê:** AI usa volumetric fog como "smudge tool" pra esconder fail. Pro usa pra criar profundidade.
- **Como verificar:** turn off fog mentalmente — a composição faz sentido? Pass. Tudo desaparece = reprovou.
- **Como evitar no prompt:** "thin atmospheric haze 15% density adds depth between foreground beam and void background, scene composition reads cleanly without it" · banir "thick fog", "mysterious atmosphere".

### 13. Frame rate: 24fps cinematográfico, nunca 30/60 fps default
- **Por quê:** 30/60fps = "video doméstico/TV". 24fps = "filme".
- **Como verificar:** metadata. Não tá em 24? Reprovou.
- **Como evitar no prompt:** "24fps cinematic frame rate" · banir nada — 24 é parâmetro de Veo.

### 14. Lens flares: nunca, salvo se for source physical (rim light bate na câmera)
- **Por quê:** lens flare aleatório = J.J. Abrams parody = AI tell.
- **Como verificar:** identifica fonte do flare. Coincide com light source na cena? Pass. Aparece do nada? Reprovou.
- **Como evitar no prompt:** "no lens flares unless from a physically motivated light source already in frame" · banir "lens flare", "anamorphic flare" salvo intencional.

### 15. Bokeh tem shape consistente (circular ou hex específico do anamorphic chosen)
- **Por quê:** bokeh mudando shape entre frames = AI instability.
- **Como verificar:** zoom 4x em 3 pontos out-of-focus. Shapes idênticos? Pass.
- **Como evitar no prompt:** "circular bokeh from f/2.0 prime lens, consistent shape" · banir "creative bokeh", "anamorphic" se não souber controlar.

### 16. Text on screen: zero, sempre. Mesmo lorem ipsum.
- **Por quê:** Veo gera text que muda glyph entre frames — instant tell. Stripe webhook, Telegram, Docker logs precisam vir de OBS real, nunca Veo.
- **Como verificar:** qualquer caractere legível no frame = reprovou (se gerado por AI).
- **Como evitar no prompt:** "no text, no UI labels, no readable characters anywhere in frame" · banir todo prompt-mention de "code", "terminal text".

### 17. Hands, faces, mãos digitando: NUNCA via Veo. Sempre captura real ou ilustração 2D.
- **Por quê:** hands AI = 6 dedos, deformação entre frames. Faces AI = morphing identity.
- **Como verificar:** qualquer aparição de figura humana = reprovou.
- **Como evitar no prompt:** "no humans, no hands, no people, no body parts in frame" · banir totalmente.

### 18. Grain é monocromático e plate-based, nunca colored noise digital
- **Por quê:** RGB noise = digital sensor noise = barato. Mono grain = filme 35mm = premium.
- **Como verificar:** isolate noise layer (high-pass). Vê tint? Reprovou. Greyscale puro? Pass.
- **Como evitar no prompt:** não adicionar grain no prompt — adicionar em post via DaVinci Film Grain plate.

---

## C. EASING & TIMING — Tabela operacional

Referência aos tokens definidos em `app/globals.css` (linhas 175–198).

| Tipo de motion | Duração | Easing | Token CSS | Quando NÃO usar |
|---|---|---|---|---|
| **Micro-feedback** (button press, focus ring) | 50–150ms | `cubic-bezier(0.2, 0, 0, 1)` standard | `--motion-instant` / `--motion-micro` + `--ease-standard` | Para reveals ou loops — fica nervoso |
| **Hover state lift** (card, link) | 200ms | `cubic-bezier(0.05, 0.7, 0.1, 1)` enter | `--motion-fast` + `--ease-enter` | Em transitions inter-página — leve demais |
| **Tooltip / popover entrance** | 200ms enter, 150ms exit | `--ease-enter` enter / `--ease-exit` exit | `--motion-fast` | Para hero / componente persistente |
| **Modal / drawer** | 400ms | `cubic-bezier(0.165, 0.84, 0.44, 1)` dramatic | `--motion-modal` + `--ease-dramatic` | Em hover — pesado demais |
| **Scroll reveal** (in-view fade up) | 600–800ms | `cubic-bezier(0.22, 1, 0.36, 1)` out-quint | `--motion-page` / `--motion-scroll` + `--ease-out-quint` | Em micro-interactions — lerdo |
| **Hero entrance / large transition** | 1200ms | `cubic-bezier(0.165, 0.84, 0.44, 1)` dramatic | `--motion-hero` + `--ease-dramatic` | Em qualquer coisa que não seja primeira impressão |
| **Hero video loop (pulse rate)** | 6–8s loop, light beam pulse a cada 3–4s | sine wave (sin²) para pulse intensity | n/a (raw video) | Pulse mais rápido que 2s = "AI generic" |
| **Bento mini-gif loop** | 4–6s loop | linear ping-pong com easing nos extremos | n/a (raw video) | Loop <3s = nervoso. >8s = perde foco |
| **Particle drift** | 60s full traversal | linear (only here) | `--motion-drift` | Em qualquer outro contexto que não particles/grain |
| **Marquee** | 40s full cycle | linear | `--motion-marquee` | Marquee fora deste range vira "tela de carregamento" |
| **Spring (drag, interactive)** | n/a — physics | stiffness 280, damping 24, mass 1 | via Motion 12 spring config | Para elementos não-interativos |
| **Snappy bounce** (badge entrance, success state) | 200–300ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` snappy | `--motion-fast` / `--motion-transition` + `--ease-snappy` | Em transitions sérias — fica brincalhão |

**Regra de ouro de timing:**
- < 200ms: o usuário sente "instantâneo".
- 200–500ms: o usuário percebe transição, fluxo cognitivo preservado.
- 500ms–1.2s: o usuário vê "movimento intencional" — usar com parcimônia.
- > 1.2s: só hero entrance única, ou loop ambiente. Nunca interação.

**Easing assimétrico obrigatório:** entrance = `--ease-enter` (slow start, fast in), exit = `--ease-exit` (fast out, slow tail). Usar a mesma curva pra in e out = motion robótico.

---

## D. COLOR GRADING — Receita oficial DaVinci Resolve

Esta receita se aplica **uniformemente** a todos os assets: hero video Veo, mini-gifs OBS, screenshots case studies, headshot. Garante consistency visual entre fontes muito diferentes.

### Node tree (DaVinci Resolve 19, Color page)

**Node 01 — Log conversion / normalization**
- Input transform: assume Rec.709 sRGB do Veo / sRGB do OBS / sRGB de Imagen.
- Convert to DaVinci Wide Gamut Intermediate via Color Space Transform OFX.
- Razão: dar headroom pros próximos nodes sem clipar.

**Node 02 — Lift / Gamma / Gain primary**
- Lift: `R -0.02, G -0.01, B +0.03` (cyan lift nos shadows)
- Gamma: `R 0.98, G 1.00, B 1.01` (whisper de cyan no midtones)
- Gain: `R 0.97, G 0.99, B 0.98` (slight pull-down de overall exposure, dá weight)
- Offset: `-0.05` global (deep blacks, NÃO crush — fica em 3% IRE, não 0%)
- **Black point:** lift blacks de 0% para +3% IRE — preserva detail in shadows, sinaliza "cinema digital" vs "vídeo amador crushed".

**Node 03 — Saturação global**
- HSL Saturation Curve:
  - Reds: -40% (kill skin tones default warmth)
  - Yellows: -20% (mantém lime mas reduz parasitic yellow)
  - Greens (lime range, ~120° hue): +25% (lime POPS isolado)
  - Cyans/Blues: -30% (cool shadows desat)
  - Magentas: -50% (kill purple cast comum em Veo)
- **Global Saturation target: 75%** (down 25% from default 100%).
- Lime alvo no vectorscope: ~80% sat, fora do "broadcast safe" graph mas dentro de display gamut.

**Node 04 — Curves: contrast S + highlight rolloff**
- Luma curve: classic S — preto em (0, 0), shadow pull (32, 18), midtone neutral (128, 128), highlight roll (220, 230), branco em (255, 250 — não 255, dá rolloff).
- **Rolloff highlights** evita clip "digital" — específico do lime emissive não estourar pra branco puro.

**Node 05 — Split toning (Color Wheels secondary)**
- Shadows: push para `oklch(20% 0.04 230)` — cool cyan-teal
- Highlights: push para `oklch(85% 0.05 110)` — quase-lime pale, MUITO sutil (intensity 8%)
- Midtones: neutros
- Razão: orange-and-teal "blockbuster" mas reversed — site é cyan-shadow + lime-highlight, NÃO o cliché.

**Node 06 — Bloom on lime isolado (Qualifier + glow)**
- Qualifier HSL: Hue 110–135°, Sat min 60%, Luma min 70%.
- Aplicar Glow OFX: radius 8, intensity 35%, blend mode Screen.
- **Subtle, não dramatic.** O lime EMITE luz, mas não vira halo gigante.

**Node 07 — Grain plate**
- Resolve Film Grain OFX: preset **Kodak Vision3 5219 (500T)** — grain pattern fino, organic.
- Intensity: 16% (signature do site).
- Size: 0.5 (small grain, dá texture sem ofuscar).
- Saturation: 0% (monocromático — força greyscale grain, NÃO RGB noise).

**Node 08 — Final vignette**
- Power Window radial, soft edge 100%.
- Inside: 0 (no effect on center).
- Outside: -0.15 stops (dim corners 15%).
- Razão: foco no centro/focal point, edges fall off para o void.

**Node 09 — Output transform**
- Convert back to Rec.709 sRGB para entrega web.
- Render: H.264, CRF 18, 24fps, no audio (assets são silenciosos).

### Saturação target consolidada

| Element | Saturação |
|---|---|
| Overall scene | 75% |
| Lime accent | 80% isolated (raised via qualifier) |
| Amber (Estética MD only) | 65% |
| Skin tones (headshot) | 50% (desaturated, cool) |
| Shadows | 30% (cyan tint preserved) |

### Cinema reference

A receita acima é uma versão "**Apple product film 2020+**" cruzada com "**Drive (2011) Refn opening sequence**" cruzada com "**Blade Runner 2049 daytime exteriors**". Frio mas não morto, com um único accent que carrega o frame.

---

## E. COMPOSIÇÃO POR ASSET

### E.1 Hero video loop (Veo 3.1)
- **Aspect ratio:** 16:9 (1920×1080), `object-fit: cover` no DOM.
- **Focal point:** vertical light beam centralizado em **x=0.66** (right-third intersection) — assimetria intencional. Texto hero ocupa left-half do DOM em overlay.
- **Negative space:** 75% void escuro.
- **Hierarquia:** (1) light beam vertical lime, (2) particles drifting upward com parallax depth (3 camadas: close blurry, mid sharp, far hazy), (3) atmospheric haze 15%.
- **Idle state:** loop sem hover effect — vive standalone.
- **Mobile fallback:** static poster frame 1080×1920 vertical recompose.

### E.2 Bento mini-gifs (OBS Studio capture)
- **Aspect ratio:** 4:3 (1200×900) para celas grandes, 1:1 (800×800) para celas pequenas.
- **Focal point:** **centralizado** com simetria — capturas de UI são naturalmente center-framed.
- **Negative space:** 40–50% (UI bento tem mais density que hero — ok porque é "informação").
- **Hierarquia:** (1) elemento que MUDA (status indicator, log line aparecendo), (2) UI estática contexto, (3) chrome (window frame, dock).
- **Hover state:** static frame paused → on hover, video plays. Idle → frame estático com selo "loop pausado" (lime micro-indicator no canto sup. esq.).

### E.3 Case study covers (Aceternity device frame + screenshot OR Imagen 3 composition)
- **Aspect ratio:** 16:10 (MacBook frame) ou 9:16 (iPhone frame), wrap dentro de container 4:3.
- **Focal point:** screenshot center, device frame canto esquerdo-baixo (rule of thirds bottom-left).
- **Negative space:** 50–55% (device "flutua" em background com gradient sutil).
- **Hierarquia:** (1) device screen content sharp, (2) device chrome (subtle reflection), (3) background gradient (void → 5% lime hint).
- **Hover state:** parallax tilt 3D ±3° via Motion 12 useMotionValue + Lenis scroll progress. NÃO mexer em scale (jank no metric LCP).

### E.4 Headshot context (composição Imagen 3 OR foto real graded)
- **Aspect ratio:** 4:5 portrait (800×1000).
- **Focal point:** eyes na **upper-third horizontal line** (y=0.33), eye-line cruzando left-third vertical (x=0.33). Stefan olha para fora-do-frame em direção do texto adjacente.
- **Negative space:** 60% (background void com 1 prop ambiental — janela, monitor offscreen, plant blurred no canto).
- **Hierarquia:** (1) eyes sharp, (2) face neutra cool-graded, (3) shoulders/torso suave, (4) background fall-off pesado f/1.8.
- **Idle:** static. Hover: cross-fade pra alternate frame mesma pose (micro variation, dá "vida" sem ser uncanny).

### E.5 Cell IA Agentic (reuso video Telegram HITL do bento)
- **Aspect ratio:** 16:10 dentro da célula bento grande.
- **Focal point:** chat conversation flow, com decision button aparecendo no centro da tela em loop sec 3.
- **Negative space:** 30% (UI bento natural fill).
- **Hierarquia:** (1) button appearing (HITL action), (2) message flow, (3) Telegram chrome.
- **Idle:** loop ativo (esta é a cela "alive" do bento Skills — todas outras são static screenshots, ela move pra chamar atenção pro destaque "agentic").

---

## F. REFERÊNCIAS CINEMATOGRÁFICAS

Cada nome abaixo vira **token "evocar [X]"** consumível pelo Prompt Engineer.

1. **Roger Deakins · Blade Runner 2049 atmospheric night exteriors**
   - Token: "evocar Deakins 2049 — fog cyan-blue volumetric, single warm/cool light source, edges absorvidos pelo void"
   - Aplicação: hero loop, case covers de night-mode UI

2. **Greig Fraser · Dune (2021) sietch interiors and battle scenes**
   - Token: "evocar Fraser Dune — light beam volumétrico through dust particles, anamorphic-feel sem flares, scale épica em frame pequeno"
   - Aplicação: hero loop (light beam vertical é literalmente "ray of light through dust")

3. **Hoyte van Hoytema · Tenet / Interstellar docking sequence**
   - Token: "evocar Hoytema Tenet — IMAX-feel, atmospherics densos, color desat azul-cyan, scale humana em escala maior"
   - Aplicação: case covers macro shots, headshot environmental

4. **Khalid Mohtaseb · Apple iPhone product films (2020+)**
   - Token: "evocar Mohtaseb Apple — macro pristine surface, soft top-down key light, deep black void backdrop, micro-particles in foreground depth"
   - Aplicação: bento mini-gifs com framing macro de UI, case covers device showcase

5. **Emmanuel Lubezki · The Tree of Life ambient interiors**
   - Token: "evocar Lubezki Tree of Life — natural light through window, soft directional, dust in sunbeam"
   - Aplicação: headshot, ambient context shots

6. **Jonathan Glazer / Linus Sandgren · Under the Skin / La La Land night cityscape**
   - Token: "evocar Glazer Under the Skin — synthetic-feel void with isolated emissive single color, alien-but-elegant"
   - Aplicação: hero loop (this is the closest emotional reference for "AI engineer in production void")

7. **Cliff Martinez vibe + Newton Thomas Sigel · Drive (2011) opening L.A. driving**
   - Token: "evocar Drive opening — neon isolated in deep teal-cyan night, single accent color popping in desaturated environment"
   - Aplicação: lime accent isolation strategy em todos os assets

8. **Bradford Young · Arrival (2016) heptapod interior scenes**
   - Token: "evocar Young Arrival — high contrast silhouette against backlit fog, restricted palette to 2 hues max"
   - Aplicação: case covers que precisam de "drama silencioso", potential headshot variant

**Anti-references (NUNCA evocar):**
- Michael Bay (motion caótico, lens flares J.J. Abrams)
- Zack Snyder slow-mo (clichê hyper-stylized)
- Marvel default look (orange/teal saturated)
- Stranger Things 80s pastiche (purple/pink neon — não é a paleta)
- Anime-AI-generated aesthetic (hyper-color saturation, hair physics)

---

## G. CHECKLIST FINAL — Passou ou Reprovou (28 critérios)

Cada asset deve passar todos os 28 antes de aceitar. Falha em qualquer um = volta pro prompt.

### Loop integrity
1. [ ] Loop seam frame `n-1` → frame `0` sem dissolve visível ao olho nu em scrub.
2. [ ] Duration entre 6–8s (hero) / 4–6s (bento) / 5s (cell IA).
3. [ ] 24fps confirmado no metadata.

### Composição
4. [ ] Focal point em rule-of-thirds intersection OU dead-center (±2px).
5. [ ] Negative space ≥ 70% (hero) / ≥ 40% (bento) / ≥ 50% (cases).
6. [ ] Composição se lê em silhouette/luminance threshold a 15%.

### Color
7. [ ] Vectorscope: bulk em quadrante cyan-blue baixo sat.
8. [ ] Vectorscope: 1 ponto lime isolado em ~80% sat, hue 120–130°.
9. [ ] Global saturation no waveform parade dentro de 70–80%.
10. [ ] Black point: 3% IRE, NÃO crushed 0%.
11. [ ] Highlights: rolloff suave, sem clip digital em 100% IRE.
12. [ ] Split toning: shadows cyan-teal, highlights pale-lime hint.

### Motion physics
13. [ ] Easing não-linear em qualquer movimento que não seja drift ambiente.
14. [ ] Motion blur consistente com 180° shutter (proporcional à velocidade).
15. [ ] Partículas com corrente direcional dominante + brownian sutil, NÃO drift uniforme aleatório.
16. [ ] Camera locked-off (corners variance < 2px ao longo do loop).

### Lighting
17. [ ] 1 key light identificável + 1 fill ambient + (opcional) 1 rim.
18. [ ] Shadows apontam para mesma direção ±10°.
19. [ ] Light source em posição consistente entre frame 0 e frame n.

### Edge integrity
20. [ ] Straight edges (light beam, UI chrome) tracked com Mocha: variance < 1.5px.
21. [ ] Zero warping em texto/glyphs (se houver — só em OBS capture, nunca Veo).

### Anti-AI-slop
22. [ ] Nenhum humano, mão, rosto AI-generated (só OBS capture ou Imagen com supervisão).
23. [ ] Nenhum lens flare aleatório sem source physical.
24. [ ] Bokeh consistente em shape ao longo do loop.
25. [ ] Sem text AI-generated com glyphs mudando entre frames.
26. [ ] Sem "subtle camera breathing" — câmera é dead-locked.

### Output
27. [ ] Grain monocromático aplicado em DaVinci (Kodak 5219 16% intensity).
28. [ ] Vignette sutil aplicado (-0.15 stops corners), sem ser óbvio.

---

## NOTAS PARA O PROMPT ENGINEER

- **Tokens prontos para reuso direto** estão em F (referências cinematográficas) — copy/paste em prompts.
- **Tabela de timing** em C é direta — bento gif "loop de 4–6s ping-pong com easing sine²" vai direto pro prompt.
- **Color grade** em D é POST-process — não pedir no prompt Veo. Veo entrega raw, DaVinci aplica.
- **Lighting & framing** em E são instruções pro prompt textual.
- **Anti-slop principles** em B traduzem 1:1 em frases "include" e "ban" do prompt.
- **Princípio 16 e 17 são inquebráveis:** sem text gerado, sem humans gerados. Tudo isso vem de OBS ou Imagen+revisão manual.
- Hero loop é a única peça que pode permitir-se 8s — todas as outras 4–6s.
- A célula IA Agentic do bento Skills **reusa** o mesmo MP4 do bento principal Telegram HITL — single render, dois consumers.
