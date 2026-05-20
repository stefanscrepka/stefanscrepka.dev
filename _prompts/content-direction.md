# DIRETORIA DE CONTEÚDO — stefanscrepka.dev

**De:** Creative Director / Content Director
**Para:** Stefan Screpka
**Sobre:** Que visual fica em cada slot do site, **e por quê**.

---

## DIAGNÓSTICO

Auditei o site no estado pós-Wave 1 e reli AGENTS.md + plano + data.ts. O problema é estrutural, não estético: **o site herdou referências (Huly, Nubien, Portfolite, Apple) sem importar o que elas SIGNIFICAM nos contextos originais**. Huly tem beam porque tem dashboard pra envolver. Apple tem produto em close-up porque o produto é o protagonista comprável. Nubien tem portal violet porque "AI emerging" é literal pra eles. **O teu produto comprável é a sua capacidade de fazer sistemas multi-agente que rodam 24/7** — então o teu visual precisa ser sobre isso, não sobre dashboards bonitos flutuando.

Tua headline diz **"Construo IA multi-agente em produção"**. Tudo o que aparece no site precisa provar essa frase. Beam atmospheric pure não prova nada — qualquer um pode comprar um vídeo Veo de beam. Um traço de Telegram aprovando um post, um log de Docker piscando às 03h17, uma cinematic de você no terminal — isso prova.

A linha que define o site não é "AI portal mystery" nem "product hero" nem "dev brutalist". É **"infraestrutura silenciosa que rodou enquanto você dormiu"**. Esse é o frame mental.

---

## E. PRINCÍPIO TRANSVERSAL — A LEI DO SITE

A regra única que TODO visual do site Stefan precisa passar antes de entrar em produção. Equivalente ao "beam unifies modules" do Huly:

> **TODO visual do stefanscrepka.dev é um RECORTE de algo que aconteceu sem o visitante estar olhando.**

**Explicação:** O site não mostra produto pronto pra vender (Apple), nem AI emergindo místico (Nubien), nem agência criativa colorida (Portfolite). Mostra **o resíduo silencioso de sistemas que trabalham 24/7**: um Telegram que pediu aprovação ontem às 03h, um log de Docker que rodou enquanto você dormiu, um cron que disparou no horário, uma clínica que registrou agendamento, um PR que foi mergeado. O visitante chega ao site e está testemunhando um **after-hours em uma sala de operações** — não uma demo nem uma vitrine.

**Como aplicar:** Antes de aprovar qualquer visual novo, perguntar:
1. "Esse visual é um evento que ACONTECEU sozinho?"
2. "O Stefan está apenas testemunhando, não performando?"
3. "Existe um humano implícito na cena, mas não está no frame?"

Se as 3 respostas forem sim, o visual é Stefan. Se alguma é não, o visual é decoração e precisa morrer.

---

## A. HERO — 5 CONCEITOS RANQUEADOS

### Conceito #1 — **HITL APPROVAL FRAME** (RECOMENDADO) — Risco 2/5

**O que mostra:** Loop 6s seamless. Um único frame de Telegram (versão dark, mobile portrait dentro de device frame premium estilo Apple/Vercel). Mensagem entrando do bot @content_engine: "Squad C-7 → post pronto pra @linareis.fit. Aprovar?". Dois botões aparecem: `✓ Aprovar` (lime) e `✗ Rejeitar` (cinza). Sem dedo, sem mão. Aos 3s, um cursor de teclado simples (não mão AI) toca `✓`. O botão pulsa lime uma vez. Aparece sutil: "13:17:42 — aprovado · próximo em 47min". Loop reset.

**Significado:** "Eu construí um sistema que toma decisões sozinho e me pede aprovação de 10 segundos. Eu sou a interface dele com o mundo, não o operador dele." Isso É a tese da headline: multi-agente em produção + humano no loop ≤10 min/dia.

**Por que ESSA imagem pra ESSA headline:** A frase "multi-agente em produção" precisa de prova de que existe um humano no controle de algo autônomo. Telegram é a interface real do Content Engine (não Discord, não Slack, não dashboard inventado). Isso destrói o medo do recrutador de "ah, mais um cara que liga a chave do GPT". Aqui ele vê: existe um sistema autônomo, e existe um humano que controla. Os dois.

**Asset source:** Screencap real OBS do teu próprio bot grammy rodando, gravado em 4K à 24fps, depois passado por DaVinci com a receita do motion-design-principles.md §D (Kodak grain 16%, cyan-shadow, lime bloom em #D2FF00). Zero AI gerando texto/UI — Telegram é capture real. Cursor pode ser um glyph SVG fake animado em CSS (não mão AI).

**Risco:** 2/5 — Você já tem o bot. Captura em ~20 minutos. DaVinci em 1h. Maior risco: ler texto Telegram tem que estar legível em mobile sem ofuscar (text size ≥14pt no source).

---

### Conceito #2 — **SQUAD HANDOFF LOG TAIL** — Risco 2/5

**O que mostra:** Terminal preto (Ghostty/Wezterm aesthetic), single column, sem chrome de janela. Loop 8s. Linhas de log aparecem com cursor de monospace genuíno:
```
[03:14:22] O-1 ✓ brand brief intake completo
[03:14:23] O-1 → I-1 handoff payload (847 tokens)
[03:14:25] I-1 ✓ perplexity search 3 queries
[03:14:31] I-1 → S-5 calendar slot pending
[03:14:33] S-5 ✓ schedule 06h14 BR
[03:14:34] S-5 → C-7 brief sent
[03:14:41] C-7 ✓ copy v1 generated (gpt-tokens 1,247)
[03:14:42] C-7 → R-15 anti-slop check
[03:14:44] R-15 ⚠ flagged: "no mundo atual" (regex hit)
[03:14:45] R-15 → C-7 regenerate
[03:14:52] C-7 ✓ copy v2 generated
[03:14:53] R-15 ✓ all checks passed
[03:14:54] E-0 → telegram bot push aprovação
```
Aos 8s, scroll suave reseta no top.

**Significado:** "Esse é o ritmo real de um sistema multi-agente: handoffs entre squads, cada agente tendo um job, validação acontecendo, tokens sendo gastos. Isso aconteceu enquanto você dormiu."

**Por que essa imagem:** É o oposto do AI portal genérico. Recrutador técnico lê e entende em 5 segundos a arquitetura. Founder lê e entende "isso é coisa séria". Visualmente cinema (terminal monospace preto-lime tem o mesmo charme de Matrix sem ser Matrix).

**Asset source:** Captura real OBS do log do teu Content Engine (modo verbose ativado). Edita pra deixar legível, comprime tempo (16 minutos viram 8s), aplica grain DaVinci. **Os textos saem do log real do teu sistema, não do Veo.**

**Risco:** 2/5

---

### Conceito #3 — **CRON CLOCK 03H** — Risco 3/5

**O que mostra:** Plano fixo, 16:9. Centro do frame: relógio digital monospace gigante mostrando `03:14:22 BRT`. Acima discreto: `content-engine.service · active (running)`. Abaixo: um único pequeno log line atualizando a cada 800ms: `S-5 ✓ post agendado · próximo: I-2 trends scan`. Volumetric light beam lime vem de cima como o teu Veo beam, mas agora **com um motivo**: ele ilumina o cron quando ele roda. Aos 5s do loop, beam pulsa, cron atualiza pra `03:14:23`, nova log line aparece. Loop 8s.

**Significado:** "Enquanto o mundo dorme, meu sistema trabalha. Cron 03h-07h30 não é metáfora — é literal." Recupera o beam Veo mas dá razão pra ele existir: ele marca os ticks do cron.

**Por que essa imagem:** Cron 03h-07h30 está literalmente no data.ts (linha 60). Visualizar isso é o opposite of "AI bullshit". O beam ganha sentido. **Resolve o problema do Stefan ("beam tem que significar algo").**

**Asset source:** Composição mista — fundo Veo (beam que você já tem) + overlay HTML/CSS legítimo renderizado em OBS via página local em localhost mostrando relógio real do sistema. Compositing DaVinci pra unir.

**Risco:** 3/5

---

### Conceito #4 — **TELEGRAM + DOCKER SPLIT** — Risco 3/5

**O que mostra:** Frame dividido em duas metades verticais. Esquerda: Telegram em mobile portrait. Direita: log do Docker container rodando. Quando o ✓ é clicado em Telegram, na direita o Docker mostra: `agent.E-0 → published successfully`. Os dois lados sincronizados ao mesmo evento. Loop 7s.

**Significado:** "O ato humano (Telegram) gera o ato máquina (Docker). Tem dois lados — eu não construo só backend, eu construo a ponte humano-máquina."

**Risco:** 3/5

---

### Conceito #5 — **STEFAN MICROACTION** — Risco 4/5

**O que mostra:** Você (foto real, não AI), grayscale dessaturado cool, em um único momento. Plano americano (peito pra cima), olhando levemente off-frame. Sentado em frente ao terminal. Aos 3s do loop, vira meio segundo a cabeça pra esquerda. Loop 8s. Behind você: out-of-focus, o teu setup real (RTX 3070 bem out of focus, monitor com Tailwind config blurred). Single key light cool de cima-esquerda, fill mínimo, lime hint apenas no edge da bochecha.

**Significado:** "Esse cara existe, está aqui, agora, na frente do sistema dele." Personificação. Lando-style.

**Risco:** 4/5 (precisa de filmagem real bem feita)

---

### FAVORITO: **Conceito #1 — HITL APPROVAL FRAME**

**Justificativa em 4 pontos:**

1. **Prova literal da headline em 3 segundos.** "Construo IA multi-agente em produção" + visual de aprovação de output multi-agente = match perfeito.

2. **Risco baixo (2/5) e exequível com o que Stefan já tem.** Bot grammy já roda. Captura em 20min, edit em 1h, DaVinci 1h. Total: ~3h pra ter asset final.

3. **Resolve a queixa do Stefan diretamente.** "Tem que fazer sentido" = aqui faz sentido porque mostra o produto Content Engine no momento em que o produto realmente é tocado pelo humano.

4. **Acessível em 2 personas-fit ao mesmo tempo.** Recrutador técnico vê "bot Telegram = engineer real". Founder intl vê "HITL = controle responsável de AI = não é spam slop".

**Decisão:** Substituir o beam atmospheric Veo (genérico) por essa composição. O Veo já gerado pode virar **background do Manifesto** (ali o beam pode significar "introspecção"). Não desperdiça asset, recontextualiza.

---

## B. CASE STUDY COVERS — UM VISUAL POR PRODUTO

### B.1 — Content Engine (sem dashboard)

**Visual:** Diagrama isométrico vivo dos 5 squads em formato de "esteira de produção industrial". 5 fileiras verticais com nomes O / I / S / C / R. Animação muito sutil: tokens fluindo entre as colunas (handoff entre squads). Não chip falso de dashboard — é uma planta de fábrica industrial multi-agente em vista top-down, terminando no Telegram (E-0). Single page diagram, lime accents, hairline borders. Estilo: Linear changelog page meets Bauhaus blueprint.

**Significado:** "Content Engine não tem UI porque não precisa — é uma fábrica de conteúdo. Aqui está a planta dela." Heritage Eletrotécnica do Stefan emerge sutilmente aqui (planta industrial = ele veio do SENAI).

**Asset source:** SVG custom desenhado em Figma + animação Motion/GSAP minimal. Não precisa de Veo.

### B.2 — NexaCore SaaS (em produção)

**Visual:** MacBook scroll Aceternity com screenshot REAL da striveos.shop (admin panel dark mode, dados reais visíveis — gráficos, agenda da semana, métricas de clínica). Stefan captura em produção em 4K. Sem mockup falso.

**Significado:** "Isso aqui está rodando. URL real. Clínicas reais usando."

**Asset source:** Stefan captura via Chrome DevTools com DPR 2.0.

### B.3 — STJ App (PWA mobile real)

**Visual:** Compare Slider Aceternity. Lado esquerdo: app shell offline (PWA, Serwist fallback). Lado direito: app shell online com Claude Haiku 4.5 streaming uma resposta real do chat Lina Brain (tokens aparecendo gradualmente). User arrasta pra ver os dois estados.

**Significado:** "É um PWA real. Funciona offline. Tem AI streaming em tempo real."

**Asset source:** Dois screencaps mobile reais + Compare Slider Aceternity já disponível.

### B.4 — Estética MD (amber, calmo)

**Visual:** Hover flip card. Front: foto real da landing page do site Estética MD (warm amber palette, cursor custom dual, foto da Dra. Martina). Back: stats premium + WhatsApp deeplink. Ambient amber glow ao redor do card (já existe em código).

**Significado:** "Site clínica premium. Cliente real, em produção. Quer um igual? WhatsApp."

**Asset source:** Screenshot real + Flip card Animate UI (já existe no projeto).

---

## C. BENTO SKILLS — CÉLULA IA AGENTIC

**Conceito recomendado — "AGENT POOL"**:

Pequeno componente React + Motion. Uma grade 5×5 com 22 pontos ocupados (3 espaços vazios da grid representam "capacidade não-saturada"). Cada ponto é um agente, identificado por seu código (O-1, O-2, O-3...). Pulsam em ondas sucessivas: aos segundos 0-1, todos squads "O" pulsam lime. Aos 2-3, squads "I". E assim por diante, ciclo de 6s. Quando hovera o cell, todos os 22 squads se acendem simultaneamente em lime forte.

Embaixo, texto pequeno: `5 squads · 22 agentes · ≤10 min/dia humano-in-loop`.

**Significado:** "Aqui estão os 22, organizados. Não satélites flutuando — uma grade ordenada, igual planta industrial." Reforça o mesmo princípio do cover do Content Engine.

**Asset source:** Componente React puro com motion. Zero arquivos. Stefan codifica em 2h.

---

## D. SUBSTITUTO DO "WHAT I BUILD"

**Diagnóstico:** "What I Build" era redundante com Featured Work. Não precisa substituir.

**Recomendação:** **NÃO substituir.** O fluxo atual `Hero → Featured Work → Other Work → Bento Skills → Timeline → Manifesto → Contact` está enxuto e cinemático.

**SE for adicionar algo:** Inserir uma **"PROCESS STRIP"** ENTRE Hero e Featured Work. Banda fina (160px) full-bleed com 3 mini-cards horizontais:

1. **"Cron 03h"** — screencap mini do log do Content Engine acordando às 03h (4s loop)
2. **"PR review"** — screencap mini do GitHub mostrando um PR sendo aprovado (4s loop)
3. **"Deploy hook"** — screencap mini do Vercel deploy verde aparecendo (4s loop)

3 momentos invisíveis do dia de um Product Engineer, lado a lado. Eyebrow acima: "PROCESSO". Microcopy abaixo: "O que acontece quando ninguém está olhando".

**Significado:** "Trabalho não é demo — é cron, PR, deploy." Continua o ADN "infraestrutura silenciosa".

**Asset source:** 3 screencaps OBS reais, cada um 4s, autoplay loop.

---

## RECOMENDAÇÃO FINAL — ORDEM DE EXECUÇÃO

1. **Hero (Wave 2 revisada):** Trocar beam Veo por **HITL Approval Frame** (Conceito #1). 3h de execução.
2. **Bento Skills IA Agentic:** Substituir count "22" pelo **Agent Pool grid 5×5** componente React. 2h.
3. **Featured Work covers:** Diagrama isométrico Content Engine (3h) + screencap NexaCore (1h) + Compare Slider STJ App (2h) + flip card Estética MD (já existe).
4. **Process Strip (opcional):** 3 mini-loops entre Hero e Featured Work. 2h.

**Total para o site ganhar significado real: ~13h.**

**O beam Veo já gerado:** não joga fora. Recoloca como backdrop do Manifesto, onde "luz vertical caindo no escuro" significa "introspecção / declaração" — esse contexto justifica beam atmospheric puro. Princípio transversal respeitado.
