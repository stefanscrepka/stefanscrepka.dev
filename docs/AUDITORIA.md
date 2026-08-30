## 🎯 Veredicto Executivo

Auditei o ZIP `stefanscrepka.dev-main` por código-fonte, assets e screenshots incluídos. Não consegui rodar Lighthouse/axe real porque o ambiente não conseguiu baixar/ativar `pnpm`; então performance e DOM final foram estimados por inspeção estática.

A página está acima da média em direção de arte, sistema visual, copy técnica e coerência de marca. Mas não é “nível Linear/Vercel”: há um bloqueador grave de conversão no formulário, contraste abaixo de AA em microtextos, excesso de runtime/motion e cases que ainda vendem mais stack do que impacto. A maior força é a identidade visual com tokens OKLCH e narrativa técnica específica. A maior fraqueza é que a conversão principal parece quebrada no código.

## Passada 1 — Experiência em 30s

Em 5 segundos a página comunica: “sou AI Product Engineer, construo IA multi-agente em produção e produto completo ao redor”. Isso é claro. O olho vai primeiro para o H1 gigante em `#hero`, depois para o acento editorial em “multi-agente”, depois para os CTAs “Ver os produtos” / “Conversar 15min”.

O tom emocional é técnico, escuro, agressivo, “builder sério”. Funciona para um perfil dev/IA. A fricção imediata: muito brilho lime + claims técnicos densos cedo demais. Para um decisor não técnico, “Claude SDK + Next 16 + TypeScript · três produtos rodando 24/7” é prova, mas ainda não é valor de negócio.

## 📊 Notas por Dimensão

| Dimensão               |       Nota | Peso | Contribuição |
| ---------------------- | ---------: | ---: | -----------: |
| Acessibilidade & WCAG  |     7.1/10 |  15% |         1.07 |
| Cores & Sistema Visual |     8.0/10 |  12% |         0.96 |
| Tipografia             |     8.3/10 |  10% |         0.83 |
| Storytelling & Copy    |     7.6/10 |  15% |         1.14 |
| Motion Design          |     7.1/10 |  12% |         0.85 |
| Layout & Composição    |     7.8/10 |  10% |         0.78 |
| Projetos / Cases       |     6.4/10 |   8% |         0.51 |
| Performance Perceptual |     5.8/10 |   8% |         0.46 |
| Trust & Conversão      |     5.4/10 |  10% |         0.54 |
| **NOTA FINAL**         | **7.1/10** | 100% |            — |

---

# 🔬 Auditoria Detalhada

## 1. Acessibilidade & WCAG 2.2 — **7.1/10**

**Evidências concretas**

1. Positivo: existe skip link real em `app/layout.tsx`: `<a href="#main" className="skip-link">Pular para o conteúdo</a>`. Isso é básico, mas muita landing “premium” ignora.
2. Positivo: foco global existe em `app/globals.css`: `*:focus-visible { outline: 3px solid var(--color-border-focus); outline-offset: 2px; }`.
3. Negativo: `--color-text-3` tem contraste estimado de **4.15:1** sobre `--color-bg` e **3.88:1** sobre `--color-surface`; ele é usado em textos pequenos como `.eyebrow`, `.text-2xs`, labels mono e detalhes. Isso falha AA para texto normal pequeno.

**Recomendações cirúrgicas**

* Subir `--color-text-3` de `oklch(55% 0.005 130)` para algo perto de `oklch(60–62% 0.005 130)`. Não mexa no `text-2`; corrija só o token fraco.
* Em `ContactForm`, remover `role="radiogroup"` redundante e corrigir o erro de ARIA: o container usa `aria-labelledby={errorId}` quando deveria usar `aria-describedby={errorId}`. Melhor ainda: usar radios nativos registrados com `name="prefere"`.

---

## 2. Teoria das Cores & Sistema Visual — **8.0/10**

**Evidências concretas**

1. A paleta é intencional: base dark `oklch(13% 0.005 130)`, accent lime `oklch(94% 0.22 124)` e amber isolado para Estética MD. Isso é sistema, não escolha aleatória.
2. O lime guia atenção corretamente: H1 accent, CTA primário, sequence labels, bullets dos cases, status “disponível”, hover states e foco.
3. O amber está bem contido em `OtherWorkSection` / `EsteticaFlipCardClient`, evitando poluir o produto principal.

**Recomendações cirúrgicas**

* Reduzir uso de lime em microdetalhes simultâneos. Hoje o mesmo acento compete em H1, stats, bullets, borders, status bars, arrows, glow, focus e overlays. Preserve lime para CTA, status e dados-chave.
* Criar tokens semânticos de “muted readable”: `--color-text-muted-aa` para texto pequeno. Não use `text-3` em `text-2xs`.

---

## 3. Tipografia — **8.3/10**

**Evidências concretas**

1. A escala em `globals.css` é sofisticada: usa clamps fluidos e ratio próximo de perfect fourth. `--text-base`, `--text-lg`, `--text-xl`, `--text-6xl` têm line-height e tracking próprios.
2. O H1 em `HeroSection` usa `text-4xl sm:text-5xl !leading-[0.92] !tracking-[-0.035em]`, o que dá impacto editorial real.
3. O uso de Geist Sans + Geist Mono + PP Editorial em “multi-agente” cria contraste sem virar carnaval tipográfico.

**Recomendações cirúrgicas**

* Reduzir mono uppercase em labels secundárias. `tracking-widest + text-2xs + text-3` aparece demais; vira textura antes de virar informação.
* No mobile, testar timeline: `year` em `TimelineMarkers` usa `text-[3.5rem]` com string longa `2021—2023`. Isso pode quebrar linha/overflow em telas estreitas.

---

## 4. Storytelling & Copywriting — **7.6/10**

**Evidências concretas**

1. O hero comunica “o quê”: “Construo IA multi-agente em produção — e o produto inteiro ao redor dela.” Forte e específico.
2. A prova social vem cedo: `SocialProofLine` mostra “22 agentes Claude SDK”, “B2B em produção”, “162 testes runtime” antes dos cases.
3. Os cases têm stack real: `Content Engine`, `NexaCore SaaS`, `STJ App` trazem números, ferramentas e status de produção.

**Recomendações cirúrgicas**

* Reescrever o subhead para incluir “para quem”. Hoje fala stack: “Claude SDK + Next 16 + TypeScript”. Trocar por algo como: “Para founders e times que precisam transformar processos manuais em software com IA operando 24/7.”
* Nos cards de projetos, adicionar impacto de negócio antes de stack. Exemplo: “reduziu aprovação humana para ≤10 min/dia” deve vir antes de “pgvector RAG / Drizzle / Claude SDK”.

---

## 5. Motion Design — **7.1/10**

**Evidências concretas**

1. Positivo: há respeito parcial a `prefers-reduced-motion`: `LenisProvider` não inicia smooth scroll se `reduced !== false`; `SplitTextHeadline` e `CountUp` também têm fallback.
2. Positivo: motion tem propósito declarado: reveal do H1, count-up nos stats, stagger nos cases, sticky manifesto, hover states nos cards.
3. Negativo: nem todos os componentes client respeitam reduced-motion explicitamente. `FeaturedWorkReveal`, `OtherWorkReveal` e `TimelineMarkers` usam Motion `initial/animate/whileInView` sem checar `useReducedMotionSafe`.

**Recomendações cirúrgicas**

* Padronizar um helper `getMotionProps(reduced)` para todos os reveals. Hoje cada componente resolve motion de um jeito.
* Cortar pelo menos uma camada de espetáculo no manifesto: `200vh sticky + GSAP scrub + word stagger + signature SVG fetch + backdrop drift` é memorável, mas é caro e frágil.

---

## 6. Layout, Composição & Grid — **7.8/10**

**Evidências concretas**

1. O grid é claro: `container-max`, `container-prose`, `section-pad-y`, `section-pad-y-lg` criam ritmo consistente.
2. `FeaturedWorkSection` tem composição forte: hero tile full-width + dois half tiles espelhados. Isso guia leitura.
3. A página tem excesso vertical: Hero + SocialProof + Featured + OtherWork + Skills + Timeline + Playground + Manifesto + Contact + Footer. Para landing de conversão, isso começa a virar portfólio longo demais.

**Recomendações cirúrgicas**

* Unificar `OtherWork`, `Skills` e `Playground` em uma área secundária mais curta. Hoje há muita seção boa, mas o funil fica longo.
* Em mobile, priorizar: Hero → prova → 1 case flagship → contato. O restante pode virar `/work` ou `/playground`.

---

## 7. Seção de Projetos / Cases — **6.4/10**

**Evidências concretas**

1. `FeaturedWorkSection` comunica três projetos, mas `totalCount={4}` nos labels cria ruído: o header diz “Três produtos”, o label diz “01 / 04”.
2. Dois dos três featured cases usam diagramas fallback porque `screenshot: null` em `Content Engine` e `NexaCore`. Para uma landing premium, diagrama não substitui produto real.
3. Os cases comunicam stack e escopo, mas pouco impacto: faltam métricas como receita, conversão, tempo economizado, usuários, volume processado, custo reduzido.

**Recomendações cirúrgicas**

* Corrigir `totalCount` para `3` nos featured cards ou incluir Estética MD na grade principal. Inconsistência numérica derruba confiança.
* Cada card precisa de uma linha fixa: **Problema → Solução → Impacto**. Exemplo: “Aprovação de conteúdo manual → Telegram HITL + 22 agentes → ≤10 min/dia.”

---

## 8. Performance Perceptual — **5.8/10**

**Evidências concretas**

1. O hero carrega vídeo com `preload="auto"` em `HeroSection`: `/bg/Anime_minimalista_no_song_202605220236.mp4`. O arquivo tem ~5.01 MB, 1280×720, 8s, ~5 Mbps.
2. `avatar-stefan.png` tem ~3.07 MB para um retrato exibido em 128–192px de largura na seção de contato. Isso é desperdício bruto.
3. O projeto carrega bibliotecas pesadas no ecossistema: GSAP, Motion, Lenis, Radix, Cal.com embed, Vercel Analytics, Speed Insights, Three/r3f, Rive, Shiki. Algumas parecem não ser usadas na home atual ou ficam sob risco de bundle se importadas em client islands.

**Recomendações cirúrgicas**

* Trocar hero video para poster estático + lazy video depois de interação/idle. Se insistir em vídeo: `preload="metadata"` e versão AV1/WebM/MP4 abaixo de 1 MB.
* Exportar `avatar-stefan` em AVIF/WebP responsivo. Para o tamanho real exibido, 80–180 KB já seria suficiente.

---

## 9. Trust, Conversão & Fricção — **5.4/10**

**Evidências concretas**

1. Bloqueador: `ContactForm` cria `fd = jsonToFormData(data)` e imediatamente descarta com `void fd`; depois chama `formRef.current.requestSubmit()`. Isso tende a reentrar no próprio `onSubmit` e não envia o `FormData` convertido.
2. Outro bloqueador: os radios de `prefere` não usam `register('prefere')` nem `name="prefere"`. O Server Action faz `formData.get('prefere')`; logo o valor pode chegar `null`.
3. Footer tem `Process` apontando para `#process`, mas a seção da jornada é `id="jornada"` e o nav principal usa `/process`. É link morto/enganoso.

**Recomendações cirúrgicas**

* Corrigir o submit: ou usar Server Action nativa com inputs nomeados, ou chamar `startTransition(() => action(jsonToFormData(data)))`. Não misture `handleSubmit`, `requestSubmit` e `FormData` descartado.
* Adicionar política de privacidade/uso de dados no footer ou perto do formulário. Você coleta nome, email e mensagem; “LGPD compliance” sem política visível soa performático.

---

# 🚨 Top 5 Problemas Críticos

## 1. Formulário de contato provavelmente quebrado

**Problema observável**
`components/sections/contact-form.client.tsx`: `onValid` cria `jsonToFormData(data)`, descarta, e chama `requestSubmit()`.

**Por que importa**
CTA de contato é conversão primária. Se o submit falha, a landing vira peça visual, não máquina de aquisição.

**Fix específico**
Trocar:

```ts
const fd = jsonToFormData(data);
formRef.current.requestSubmit();
void fd;
```

por chamada real da action, ou remover RHF do caminho e deixar HTML nativo enviar `FormData` com `name` em todos os campos.

---

## 2. Campo “prefere” não é enviado corretamente

**Problema observável**
Radios em `ContactForm` têm `checked`, `onChange`, `className="peer sr-only"`, mas não têm `name="prefere"` nem `register('prefere')`.

**Por que importa**
O servidor lê `formData.get('prefere')`. Sem `name`, o valor não existe no POST.

**Fix específico**
No input radio:

```tsx
<input
  {...register('prefere')}
  id={id}
  type="radio"
  value={option}
  className="peer sr-only"
/>
```

ou adicionar `name="prefere"` se for controlar manualmente.

---

## 3. Hero video pesado com preload agressivo

**Problema observável**
`HeroSection` usa `<video preload="auto">` com arquivo de ~5 MB.

**Por que importa**
LCP perceptual e rede mobile sofrem. O usuário ainda nem decidiu se quer rolar, e você já puxa um vídeo decorativo pesado.

**Fix específico**
Usar `preload="metadata"`, adicionar `poster`, e carregar vídeo só depois de `requestIdleCallback` ou `IntersectionObserver`. Para reduced-motion, renderizar apenas poster.

---

## 4. Contraste fraco em microcopy

**Problema observável**
`--color-text-3` é usado em `.eyebrow`, labels, subtitles, footer microcopy e detalhes técnicos pequenos. Contraste estimado abaixo de 4.5:1.

**Por que importa**
Texto pequeno em mono já é menos legível. Com contraste baixo, parece “premium”, mas sacrifica leitura real.

**Fix específico**
Alterar token:

```css
--color-text-3: oklch(61% 0.005 130);
```

e reservar o `55%` apenas para elementos decorativos `aria-hidden`.

---

## 5. Cases ainda não provam impacto suficiente

**Problema observável**
`FeaturedWorkSection` fala muito de “Claude SDK”, “Drizzle”, “pgvector”, “Socket.io”, “BullMQ”, mas pouco de resultado mensurável para cliente/negócio.

**Por que importa**
Stack convence dev. Impacto convence comprador.

**Fix específico**
Em cada `CaseStudy`, adicionar campos obrigatórios:

```ts
problem: string;
solution: string;
impact: string;
metric: string;
```

E renderizar esses dados acima da lista de stack.

---

# 💎 Top 3 Acertos

## 1. Identidade visual consistente

Os tokens OKLCH, lime como acento principal, amber isolado e dark surfaces criam um sistema reconhecível. Isso não parece template genérico quando a página fala de IA/produto.

## 2. Hero com proposição específica

“Construo IA multi-agente em produção — e o produto inteiro ao redor dela” é muito superior a “crio soluções digitais inovadoras”. Tem posição, recorte e memorabilidade.

## 3. Prova técnica cedo na página

`SocialProofLine` e `StatsRow` colocam números reais antes dos cases. “22 agentes”, “27 tabelas”, “100+ tests”, “162 testes runtime” criam densidade técnica imediatamente.

---

# 🎓 Referências de Inspiração

Para subir de **7.1** para **8.5+**, estudar especialmente:

1. **Linear** — contenção visual, hierarquia de produto, motion sem excesso.
2. **Vercel** — performance percebida, tipografia técnica, páginas longas sem sensação de peso.
3. **Stripe** — storytelling de produto com prova e casos de uso, não só stack.
4. **Family** — direção de arte autoral com clareza de conversão.
5. **Rauno / Emil Kowalski** — motion com precisão, menos camadas, mais intenção.

## Nota final brutal

A landing tem ambição e repertório. O sistema visual é bom o bastante para portfólio forte. Mas o formulário quebrado, o hero pesado e os cases sem impacto mensurável impedem nota alta. Hoje é uma página de builder talentoso com execução visual avançada, mas ainda não uma landing de conversão impecável. **7.1/10.**

Aqui está a auditoria técnica e implacável baseada na inspeção profunda do código-fonte (Next.js, Tailwind v4, CSS OKLCH) da sua landing page.

## 🎯 Veredicto Executivo

Este é um produto de engenharia de interface de alto nível. Você compreendeu e implementou a assinatura de design "Premium Tech" (Vercel, Linear, Stripe) não apenas na superfície, mas na fundação arquitetônica do CSS e React. O uso de espaços OKLCH, escala fluida de tipografia baseada em perfeita-quarta e disciplina de motion provam senioridade. Sua maior força é a **engenharia tipográfica e de lighting/sombras**. Sua fraqueza atual é o viés excessivamente técnico no copy dos cases de estudo, que afasta tomadores de decisão de negócio, e potenciais gargalos de renderização perceptual (LCP) no Hero.

## 📊 Notas por Dimensão

| Dimensão | Nota | Peso | Contribuição |
| --- | --- | --- | --- |
| Acessibilidade & WCAG | 8.5/10 | 15% | 1.27 |
| Cores & Sistema Visual | 9.5/10 | 12% | 1.14 |
| Tipografia | 9.5/10 | 10% | 0.95 |
| Storytelling & Copy | 8.0/10 | 15% | 1.20 |
| Motion Design | 9.0/10 | 12% | 1.08 |
| Layout & Composição | 9.0/10 | 10% | 0.90 |
| Projetos / Cases | 8.0/10 | 8% | 0.64 |
| Performance Perceptual | 7.5/10 | 8% | 0.60 |
| Trust & Conversão | 9.0/10 | 10% | 0.90 |
| **NOTA FINAL** | **8.68/10** | 100% | — |

*(Nota 8.68: "Muito bom para Excelente. Nível de referência nacional. Defensável em portfolio top.")*

---

## 🔬 Auditoria Detalhada

### 1. ACESSIBILIDADE & WCAG 2.2

**Evidências:**

1. A utilidade `@utility focus-ring` com `outline: none` e reposição por `box-shadow` double-layer (2px base + 4px accent) é um padrão WCAG de altíssima fidelidade.
2. Atributos semânticos implementados cirurgicamente: `aria-hidden="true"` nos elementos decorativos do hover (`→`) e no vídeo de fundo.
3. Classe `@utility skip-link` forçando `z-index: 100` e tradução vertical para navegação por teclado limpa antes do pre-hydration.

**Recomendações Cirúrgicas:**

* O texto terciário `oklch(55% 0.005 130)` sobre o fundo base `oklch(13% 0.005 130)` tem um contraste aproximado de 4.3:1 (dependendo do monitor). Para texto pequeno (eyebrows/nav), o WCAG AA exige 4.5:1. Suba a luminosidade do text-3 para no mínimo `60%`.
* No componente `button.tsx`, na variante "ghost", há risco de contraste no estado default (`text-(--color-text-2)`) em monitores com baixo brilho.

### 2. TEORIA DAS CORES & SISTEMA VISUAL

**Evidências:**

1. O setup do `--shadow-inset-bisel` usando `inset 0 0 0 1px oklch(98% 0.005 130 / 0.06)` reproduz perfeitamente o edge lift signature da Linear.
2. Disciplina semântica de paleta nula: você forçou o reset de cores do Tailwind v4 (`--color-amber-*: initial`) para evitar vazamento de estilos não intencionais. Isso é nível sênior.
3. Uso correto do Lime como emissivo (`--color-accent-emissive`) com alpha customizado, acoplado ao `mix-blend-mode: screen` no flare do Hero.

**Recomendações Cirúrgicas:**

* No Hero, a luz atmosférica `radial-gradient` cruza com a máscara de gradiente do vídeo. Em displays P3, a transição para `transparent` no radial OKLCH pode gerar banding (faixas cinzas) sem um noise dither. Adicione grain sutil especificamente na div do flare.

### 3. TIPOGRAFIA

**Evidências:**

1. Escala modular imaculada: uso de `clamp()` combinando base e `vw` com ratio 1.333 (perfect fourth).
2. Força motriz tipográfica nas utilities: `@utility headline-display` amarrando tracking negativo (`-0.025em`), leading brutalista (`0.95`) e `text-wrap: balance` nativamente no body.
3. Regra obsessiva para dados: `font-variant-numeric: tabular-nums` forçado em `.font-mono` para evitar jank visual durante count-ups (clocks).

**Recomendações Cirúrgicas:**

* A fonte de fallback para PP Editorial New é `Georgia, 'Times New Roman'`. O x-height e o width da Georgia são substancialmente diferentes da PP Editorial. Isso causará um Cumulative Layout Shift (CLS) massivo se a webfont demorar 200ms. Use ferramentas como o `Capsize` para injetar `size-adjust` no CSS do font-face.
* `--text-reading` tem leading 1.55, o que é ótimo, mas se passar de 75 caracteres de `measure` em telas ultrawide (dentro de um `max-w-prose`), começará a cansar os olhos.

### 4. STORYTELLING & COPYWRITING

**Evidências:**

1. Hero copy implacável: "Construo IA multi-agente em produção — e o produto inteiro ao redor dela." Você mata duas objeções (sabe fazer AI + sabe lançar o app real).
2. Subhead técnica que qualifica os leads: "Claude SDK + Next 16 + TypeScript". Filtra curiosos, atrai CTOs/Tech Leads.
3. Secção "Bento Skills" tem uma nota de honestidade visceral: "Não é lista de cursos — é o que está no package.json".

**Recomendações Cirúrgicas:**

* Na section Featured Work, os highlights são 100% de engenharia (`Next 14 + Clerk JWT`, `162 testes`, `BullMQ`). O Tech Lead aprova, mas o Diretor/C-Level que assina o cheque de US$ 10k+ não entende o valor disso. Traduza uma das três bullets técnicas para métrica de impacto em cada card (ex: "Reduziu SLA de aprovação de 48h para 10 min").

### 5. MOTION DESIGN

**Evidências:**

1. Token de easing proprietário `--ease-snappy: cubic-bezier(0.34, 1.56, 0.64, 1)` revela entendimento dos princípios de animação de peso físico.
2. A recusa dogmática de escalar (`scale`) cards no hover (`hover:-translate-y-[2px]`), relegando o scale `0.98` apenas ao pseudo-estado `:active` dos botões. Esta é a diferença tátil entre um site genérico e um produto polido.
3. Gate de pre-hydration script no head (`html[data-pre-hydration]`) para combater Flash of Unstyled Content (FOUC) do GSAP antes da hidratação do React.

**Recomendações Cirúrgicas:**

* A duração do hover no TILE_SHELL (`350ms`) com `ease-(--ease-standard)` pode parecer ligeiramente descompassada com o `--ease-snappy`. Em UIs densas de engenharia, transições de hover (box-shadow) frequentemente perfazem melhor perto dos `200ms` (sua var `--motion-fast`).

### 6. LAYOUT, COMPOSIÇÃO & GRID

**Evidências:**

1. Layout cinematográfico no "Featured Work": Hero tile quebra a monotonia ocupando largura total, com aspect ratio 16/10, espelhado abaixo por tiles 4/3 e 16/9.
2. Uso do `container-max` com clamp adaptável (`max-w-90rem` com `padding-inline: 1rem`), preservando controle absoluto sobre o whitespace periférico.
3. Secção "Bento Skills" abandona as clássicas grades simétricas mortas por uma grid de "IA AGENTIC" agressiva ocupando múltiplas colunas como flagship.

**Recomendações Cirúrgicas:**

* No Tile espelhado (`text-right` + `cover-left`), se o texto no right side quebrar na tela de tablet (`sm` a `lg`), pode criar uma orfandade estrutural. Assegure que em viewport de tablet (abaixo de `lg`), ambas as metades degradam para stack vertical.

### 7. PROJETOS / CASES

**Evidências:**

1. Labels de sequência com estética de receipt ("01 / 04 — FLAGSHIP").
2. Hierarchy de componentes (`SequenceLabel`, `CaseStudyCover`, `SquadsStatusLine` com pulse loop S0→S1).

**Recomendações Cirúrgicas:**

* O `SquadsStatusLine` gera valor dinâmico, mas faltam tooltips táticos ou indicativos interativos para o usuário leigo entender que aqueles "pulsos" são simulações do estado de arquiteturas LLM ativas.
* Novamente: amarre a métrica do case. Mostrar o "como" é forte, mas o "e daí?" converte.

### 8. PERFORMANCE PERCEPTUAL

**Evidências:**

1. Uso de CSS system fonts nativos antes do swap de assets mais pesados (Geist + local).
2. `<video>` tag com atributos defensivos de otimização (`preload="auto"`, `muted`, `playsInline`).

**Recomendações Cirúrgicas:**

* O vídeo não possui um atributo `poster`. Isso é um crime capital em Performance LCP. Em 3G ou rede instável, o fundo hero renderizará a `oklch(13%)` pura ou pior, transparente contra luz radial branca, atrasando a absorção do CTA por mais de 2.5s. Exporte o frame 0 do vídeo como JPEG progressivo (< 50kb) e adicione em `poster="/bg/Anime_frame_0.jpg"`.

### 9. TRUST & CONVERSÃO

**Evidências:**

1. Easter-egg via inject perigoso `dangerouslySetInnerHTML` focado puramente em prospectar devs seniores ou recrutadores inspecionando a console. Tática espetacular.
2. Rejeição de formulários genéricos em prol de `CalModalProvider` e Links do WhatsApp direto nas prioridades primárias.

**Recomendações Cirúrgicas:**

* A mensagem CTA de hero é `CTAGroup`. Assumindo que leva para agendamento. Se você oferece algo high-ticket B2B ("Substitui agência inteira"), ter uma política de precificação mínima "Starting at $X" próximo ao link de agenda desqualifica curiosos que tomariam seu tempo no Cal.com.

---

## 🚨 Top 5 Problemas Críticos (Bloqueadores)

1. **Ausência do atributo `poster` no `<video>` do Hero.**
* *Por que importa:* Bloqueador de LCP brutal. A primeira renderização da área mais importante do site ficará pendurada pelo TTFB do vídeo.
* *Fix:* `poster="/bg/fallback-hero-frame.jpg"` no nó do `<video>`.


2. **Font-Mismatch CLS em `PP Editorial New`.**
* *Por que importa:* Font-swap da `Georgia` para `PP Editorial New` vai causar re-flow de layout em cima do texto hero (que você usa na palavra *multi-agente*).
* *Fix:* Adicione `size-adjust` no `@font-face` ou remova a família inteira se for apenas para uma única palavra em itálico e troque por SVG/Asset inline caso seja apenas estético.


3. **Contraste de Acessibilidade no `--color-text-3`.**
* *Por que importa:* `oklch(55% 0.005 130)` num container cinza-escuro não passa em WCAG AA para fontes de 11px a 14px (Eyebrows e sequence labels).
* *Fix:* Suba a luz do `--color-text-3` para `oklch(62% 0.005 130)`.


4. **Mix-Blend-Mode Screen no Hero Glow.**
* *Por que importa:* O `mix-blend-mode: screen` com o `<video>` reproduzindo embaixo força a GPU a recálculos de pintura absurdos por frame (particularmente no Safari mobile). Jank e bateria drenada.
* *Fix:* Remova o blend mode e ajuste o canal alpha nativamente no gradiente usando as mesmas OKLCHs em overlay simples.


5. **Comunicação exclusiva para Devs no Featured Work.**
* *Por que importa:* Decisores financeiros que leem "Clerk JWT + Prisma" não conectam valor de negócio a isso.
* *Fix:* Reescrever o Array de `HIGHLIGHTS_BY_SLUG` para incluir sempre uma (1) bullet de resultado financeiro/operacional humano explícito.



---

## 💎 Top 3 Acertos Excepcionais

1. **A implementação de Iluminação de Edge (Inset Bisel).** A forma como você resolveu a borda e iluminação interna no `.group/tile` com `--shadow-inset-bisel` usando `inset` é idêntica à forma como o time de design engineer da Linear constrói profundidade.
2. **O Sistema Tipográfico e CSS Variables V4.** Seu `globals.css` é arte computacional. Variáveis amarradas em perfect fourths sem a poluição do tailwind padrão (rejeitando os utilitários de amber intencionalmente).
3. **Resistência Ativa ao "Overscaling".** Utilizar micro-interações restritas a deslocamentos em Eixo-Y (`translate-y`) para cards, em vez da preguiça comum de dar `scale: 1.05`, manteve o produto em estado premium absoluto.

## 🎓 Referências de Inspiração

* **rauno.me / family.co**: Para analisar como lidar com a legibilidade tátil sobre elementos em vidro (glassmorphism) mantendo 100% de acessibilidade AA+.
* **linear.app/method**: Seu copy é bom, mas o portal Method da Linear ensina a converter a linguagem super técnica ("BullMQ, JWT") numa narrativa filosófico/executiva pragmática.
* **[vercel.com/ship](https://vercel.com/ship)**: Observe a forma como eles interagem o hover de cartões arquitetônicos (diagramas/squads) integrando SVG animation sem pesar o DOM ou usar vídeo.

**🎯 Veredicto Executivo**  
Esta é uma landing page de portfólio premium para um AI Product Engineer que constrói sistemas multi-agente reais em produção. Em 5 segundos o visitante entende a proposta: “Construo IA multi-agente em produção — e o produto inteiro ao redor dela” (h1 com accent italic em “multi-agente”, subhead “AI Product Engineer”, CTA “Ver os produtos”). A estética dark cinematic (#080A07 void + lime #D2FF00 emissivo isolado) + motion sofisticada transmite craft elevado e calma profissional.  

**Maior força**: obsessiva intencionalidade de motion design e direção visual (18 regras anti-slop, receita DaVinci completa, “lei do site” de “recorte de infraestrutura silenciosa que rodou enquanto você dormiu”).  
**Maior fraqueza**: o hero atual (3D r3f/scene-3d.tsx com beam/volumetric lime, conforme notas de bug-fix e IMAGE-WORKFLOW.md) ainda é genérico “AI portal” e contradiz a própria crítica interna em content-direction.md — falta prova visual imediata do HITL/Telegram approval ou terminal log que justifique a headline.  

O site é 8.4/10: execução técnica e princípios de design são referência nacional; falta apenas alinhar a execução visual do hero e cases com a direção V2 editorial para chegar a 9+.

**📊 Notas por Dimensão**

| Dimensão                  | Nota | Peso | Contribuição |
|---------------------------|------|------|--------------|
| Acessibilidade & WCAG     | 8.0  | 15%  | 1.20        |
| Cores & Sistema Visual    | 9.0  | 12%  | 1.08        |
| Tipografia                | 9.0  | 10%  | 0.90        |
| Storytelling & Copy       | 8.0  | 15%  | 1.20        |
| Motion Design             | 9.0  | 12%  | 1.08        |
| Layout & Composição       | 8.5  | 10%  | 0.85        |
| Projetos / Cases          | 8.0  | 8%   | 0.64        |
| Performance Perceptual    | 8.0  | 8%   | 0.64        |
| Trust & Conversão         | 8.0  | 10%  | 0.80        |
| **NOTA FINAL**            | **8.4/10** | 100% | —           |

**🔬 Auditoria Detalhada**

**1. Acessibilidade & WCAG**  
Evidências:  
- `useReducedMotionSafe()` + `useMounted` hook explícito (evita mismatch SSR).  
- Playwright E2E testa headline, nav semântica (`aria-label="Navegação principal"`), headings corretos.  
- Canvas 3D (r3f) e Rive são dynamic `{ ssr: false }` — bom, mas sem ARIA fallback visível nos arquivos fornecidos.  
Recomendações:  
- Adicionar `role="img"` + `aria-label` descritivo nos canvases do hero (ex: “Cena 3D hero com luz lime representando sistemas multi-agente”).  
- Garantir foco visível no floating dock e keyboard navigation completa (teste tab order).

**2. Teoria das Cores & Sistema Visual**  
Evidências:  
- Paleta intencional: #080A07 base + lime #D2FF00 emissivo isolado + cool cyan shadows (regra 60-30-10 respeitada).  
- Receita completa de color grading DaVinci (Node 01-09) aplicada a todos assets.  
- OKLCH tokens em Tailwind v4 garantem consistência.  
Recomendações:  
- Manter lime apenas emissivo (nunca em UI buttons — já está correto).  
- Testar protanopia/deuteranopia: lime #D2FF00 ainda popa forte.

**3. Tipografia**  
Evidências:  
- Geist Sans + Geist Mono + PP Editorial New italic (accent perfeito para “multi-agente”).  
- Hierarquia clara (máximo 3-4 tamanhos), line-height 1.0–1.2 em displays, measure controlada.  
- Tracking negativo em tamanhos grandes já documentado.  
Recomendações:  
- Nenhuma — está excelente.

**4. Storytelling & Copywriting**  
Evidências:  
- Headline específica + verbo forte + benefício imediato.  
- “Lei do site” em content-direction.md é brilhante (todo visual = recorte de processo silencioso).  
- 4 cases reais (não mockups).  
Recomendações:  
- Substituir hero beam atual pelo HITL Telegram approval loop (Conceito #1 recomendado) — resolve a fricção de “genérico” em 3 segundos.  
- Adicionar 1-2 métricas concretas nos cases (ex: “≤10 min/dia humano-in-loop”).

**5. Motion Design**  
Evidências:  
- Documento motion-design-principles.md é nível referência (28 critérios, easing table, 18 anti-slop rules, refs Deakins/Fraser/Hoytema).  
- Lenis + GSAP sync + Motion 12 + Rive (inspirado Lando Norris screenshots).  
- Scroll-driven, hover lifts, micro-feedback todos com propósito.  
Recomendações:  
- Garantir 24fps + ping-pong loop seamless nos hero assets.  
- Aplicar DaVinci grading em todos Rive/3D outputs.

**6. Layout, Composição & Grid**  
Evidências:  
- Whitespace generoso, grid explícito, alinhamento ótico.  
- Floating dock + sections anchor (work/process/manifesto/contato).  
Recomendações:  
- Nenhuma crítica — ritmo excelente.

**7. Seção de Projetos / Cases**  
Evidências:  
- 4 cases reais com slugs exatos nos testes.  
- Workflow completo de screenshot → Imagen 3/Nano Banana + device frames.  
Recomendações:  
- Trocar diagram fallback por cinematic screenshot final (data.ts swap já preparado).  
- Adicionar hover preview com métrica (ex: “22 agentes • 5 squads”).

**8. Performance Perceptual**  
Evidências:  
- Next.js 16 + Turbopack, Lighthouse CI no workflow, images AVIF/WebP, pre-render 20 rotas.  
- Canvas 3D dynamic ssr:false.  
Recomendações:  
- Monitorar LCP do hero 3D (r3f pode ser pesado) — adicionar low-res poster + lazy.  
- Skeleton placeholders para Rive/canvases.

**9. Trust, Conversão & Fricção**  
Evidências:  
- Real client projects, contato direto (Cal.com, Resend, WhatsApp CTA em Estética MD).  
- Footer com domínio e legal.  
Recomendações:  
- Colocar prova social (depoimentos ou “clínicas usando NexaCore”) antes do CTA final.  
- Adicionar “Book 15min call” via Cal.com no hero secundário.

**🚨 Top 5 Problemas Críticos (Bloqueadores)**  
1. **Hero visual mismatch** — Beam genérico contradiz “lei do site”. Fix: implementar HITL Telegram approval loop (3h de trabalho conforme doc).  
2. **Case covers ainda em transição** — Diagram fallback vs cinematic prometido. Fix: seguir IMAGE-WORKFLOW passo 5B (data.ts + public/screenshots).  
3. **Canvas 3D/Rive a11y/perf** — Sem ARIA + potencial INP. Fix: `aria-hidden` + reduced-motion fallback + low-poly fallback.  
4. **Falta de métrica concreta** — Copy forte mas prova numérica fraca. Fix: adicionar “≤10 min/dia humano-in-loop” + números reais nos cases.  
5. **Live site 503** — Não indexável. Fix: deploy Vercel + verificar Fluid Compute cold start.

**💎 Top 3 Acertos**  
1. **Motion principles document** — Um dos mais completos que já vi em portfólio (28 critérios + DaVinci recipe). Preservar e replicar.  
2. **Paleta + tokens OKLCH** — Lime isolado + dark void é assinatura perfeita e consistente.  
3. **Self-critique brutal** — content-direction.md e _prompts mostram maturidade rara; o time já sabe exatamente o que precisa melhorar.

**🎓 Referências de Inspiração** (para subir o hero/storytelling)  
- linear.app (hero minimal + micro-interactions com propósito).  
- rauno.me (editorial cinema do contexto, sem produto genérico).  
- lando.itsoffbrand.io (Rive + 3D hero que conta história de piloto, não só “carro bonito”).  
- vercel.com (trust via real customers + métricas).  
- family.co (dark cinematic + whitespace que respira).

O site já está em patamar de portfólio top nacional. Implementar as 2-3 mudanças de hero + cases alinhadas com a própria direção V2 e ele compete com os melhores da América Latina.  

Pronto para a próxima iteração — o craft está aí.

ers\Stefan1\Downloads\stefanscrepka-dev\components\ui\input.tsx)
Read 26 lines


Compilando o veredicto agora.
ia             │ 9.0/10 │ 10%  │ 0.90         │
├────────────────────────┼────────┼──────┼──────────────┤
│ Storytelling & Copy    │ 9.0/10 │ 15%  │ 1.35         │
├────────────────────────┼────────┼──────┼──────────────┤
│ Motion Design          │ 9.0/10 │ 12%  │ 1.08         │
├────────────────────────┼────────┼──────┼──────────────┤
│ Layout & Composição    │ 8.5/10 │ 10%  │ 0.85         │
├────────────────────────┼────────┼──────┼──────────────┤
│ Projetos / Cases       │ 8.0/10 │ 8%   │ 0.64         │
🎯 Veredicto Executivo

Portfolio com DNA editorial cinematográfico raro no tier portfólio brasileiro — paleta lime-on-13%L cirúrgica, tipografia Geist+PP Editorial com micro-features (ss01/calt/text-balance/optical-sizing), arquitetura motion em 8 camadas e implementação fiel do scroll-jacking Lando (200vh outer + sticky inner) que 90% dos sites tentam imitar com GSAP pin: true e quebram. Maior força: storytelling técnico anti-jargão ("Não vendo 'ajudo empresas a inovar'. Vendo entrega que paga conta") amarrado pela leitmotif "funciona 24/7 ou alguém perde dinheiro" do hero ao footer. Maior fraqueza: dívida WCAG acumulada em microcopy — --color-text-3 (oklch 55% L) em text-2xs (11px) na home inteira fica em ~4.2:1 contra --color-bg (oklch 13% L), abaixo do AA de 4.5:1 pra texto normal. Não é o tipo de erro que invalida — é o tipo que separa "muito bom" de "estado da arte".

📊 Notas por Dimensão

┌────────────────────────┬────────┬──────┬──────────────┐
│        Dimensão        │  Nota  │ Peso │ Contribuição │

🎯 Veredicto Executivo

Portfolio com DNA editorial cinematográfico raro no tier portfólio brL cirúrgica, tipografia Geist+PP Editorial com micro-features(ss01/calt/text-balance/optical-sizing), arquitetura motion em 8 camadas e implementação fiel do scroll-jacking Lando (200vh outer + sticky inner) que 90% dos sites
tentam imitar com GSAP pin: true e quebram. Maior força: storytellingndo 'ajudo empresas a inovar'. Vendo entrega que paga conta") amarradopela leitmotif "funciona 24/7 ou alguém perde dinheiro" do hero ao footer. Maior fraqueza: dívida WCAG acumulada em microcopy — --color-text-3 (oklch 55% L) em text-2xs
(11px) na home inteira fica em ~4.2:1 contra --color-bg (oklch 13%  texto normal. Não é o tipo de erro que invalida — é o tipo que separa"muito bom" de "estado da arte".

📊 Notas por Dimensão

┌────────────────────────┬────────┬──────┬──────────────┐
│        Dimensão        │  Nota  │ Peso │ Contribuição │
├────────────────────────┼────────┼──────┼──────────────┤
│ Acessibilidade & WCAG  │ 7.0/10 │ 15%  │ 1.05         │
├────────────────────────┼────────┼──────┼──────────────┤
│ Cores & Sistema Visual │ 8.5/10 │ 12%  │ 1.02         │
├────────────────────────┼────────┼──────┼──────────────┤
│ Tipografia             │ 9.0/10 │ 10%  │ 0.90         │
├────────────────────────┼────────┼──────┼──────────────┤
│ Storytelling & Copy    │ 9.0/10 │ 15%  │ 1.35         │
├────────────────────────┼────────┼──────┼──────────────┤
│ Motion Design          │ 9.0/10 │ 12%  │ 1.08         │
├────────────────────────┼────────┼──────┼──────────────┤
│ Layout & Composição    │ 8.5/10 │ 10%  │ 0.85         │
├────────────────────────┼────────┼──────┼──────────────┤
│ Projetos / Cases       │ 8.0/10 │ 8%   │ 0.64         │
├────────────────────────┼────────┼──────┼──────────────┤
│ Performance Perceptual │ 7.0/10 │ 8%   │ 0.56         │
├────────────────────────┼────────┼──────┼──────────────┤
│ Trust & Conversão      │ 8.0/10 │ 10%  │ 0.80         │
├────────────────────────┼────────┼──────┼──────────────┤
│ NOTA FINAL             │ 8.3/10 │ 100% │ —            │
└────────────────────────┴────────┴──────┴──────────────┘

---
🔬 Auditoria Detalhada

1. Acessibilidade & WCAG 2.2 — 7.0/10

Evidências:
- --color-text-3 = oklch(55% 0.005 130) sobre --color-bg = oklch(13 55 vs 13 dá Y 0.229 vs 0.016, contrast ratio ≈ 4.25:1). Usado em@utility eyebrow a 11px (globals.css:278-286) que aparece em quase toda section — featured-work.tsx:35, bento-skills.tsx:83, other-work.tsx:28, contact.tsx:77, footer footer.tsx:80,153. WCAG 2.2 AA exige 4.5:1 pra texto < 18px — falha sistemática.
- components/sections/manifesto.tsx:200-208: <h2 ref={nameRef}>STEFAN HEINZ SCREPKA</h2> decorativa gigante NÃO está marcada aria-hidden. O wrapper externo é aria-hidden="true" (linha 194), mas o <h2> ainda entra no document outline pra screen readers via querySelectorAll heading navigation no AT (ex: NVDA H key). Conflita
com <h2> real de cada section.
- Boas práticas presentes: skip link (globals.css:389-411), focus-ring 3px lime universal (globals.css:437-441), @media (prefers-reduced-motion: reduce) global
(globals.css:482-491), pre-hydration FOUC gate (globals.css:502-510),ayout.tsx:75-128), honeypot + aria-live + aria-busy + aria-invalid noform (contact-form.client.tsx:206-214, 311-318, 360-369), <dl><dt class="sr-only"> em StatsRow (stats-row.tsx:65).

Recomendações:
- Subir --color-text-3 pra oklch(62% 0.005 130) (Lab L* 62 → Y 0.32 → ~5.4:1). Quebra zero porque é variável CSS.
- Marcar nameRef <h2> como <div aria-hidden="true"> decorativo (mantéoutline) ou usar role="presentation".

2. Cores & Sistema Visual — 8.5/10

Evidências:                                                                                                                                                             - Token system OKLCH disciplinado: 5 surfaces (base 13% → surface-ovees (hover/subtle/emissive/glow), amber scoped + anulação explícita doamber default Tailwind v4 via --color-amber-50..950: initial (globals.css:28-38) pra prevenir drift — sinal de design system maduro.                                    - Amber sub-accent confinado a UMA peça: EsteticaFlipCardClient via dtsx:48). Mini-cards Caronas/Estrutura ficam lime/neutral. Regraanti-bleed respeitada — visível na screenshot desktop-stop-other-work.png (amber só no card esquerdo, mini-card direito é mono+lime).
- Atrito chromatic: o video Anime_minimalista_no_song_202605220236.mp4 do hero (hero.tsx:38-49) tem swirls verde-ciano mais frios que --color-accent (oklch 124° = lime amarelado). Vê-se na screenshot desktop-stop-hero.png que o vortex dedo italic "multi-agente". O mask gradient mitiga em 35-100%, mas oterço inferior do hero mostra os dois greens lado a lado.

Recomendações:
- Pós-processar o vídeo com hue-shift +10° pra alinhar com lime accent (124°), ou cobrir com overlay extra mix-blend-color: var(--color-accent) a 8% pra unificar matiz.
- Documentar amber-scope rule num token-explorer no /design-system pr

3. Tipografia — 9.0/10

Evidências:
- Pareamento Geist Sans + Geist Mono + PP Editorial Italic — 3 vozes, zero ambiguidade. Editorial Italic só aparece em UM lugar: <EditorialAccent> na palavra "multi-agente" do hero (hero.tsx:89, editorial-accent.tsx:14-28). Estilo "regra editorial" — não item de menu.
- Escala fluida ratio 1.333 com clamp(min, fluid, max) em cada step ( negativo escalonado (-0.005 → -0.030em conforme cresce), e leadingdisplay 0.92 para text-6xl, 1.6 para body. Optical sizing + ss01 + calt + liga + kern habilitados em h1, h2 no @layer base (globals.css:462-466).
- text-wrap: balance universal em h1/h2/h3 (globals.css:471-475) + font-variant-numeric: tabular-nums forçado em .font-mono (globals.css:451-457) — anti-flicker em count-ups (stats-row.tsx:109-111, imperativo via DOM mutation pra evitar React commits).

Recomendações:
- O text-2xs (11px) é o piso da escala e fica nas eyebrows. Subir praking-widest reduziria o problema WCAG sem perder a microvoz mono.
- Considerar uma versão text-display específica pra os years da timeline (5.5rem) com font-variant-numeric: lining-nums oldstyle pra dar charme editorial diferenciado.

4. Storytelling & Copy — 9.0/10

Evidências:
Read image (171.1KB)

● Read(C:\Users\Stefan1\.claude\jobs\8dfc791f\shots\desktop-stop-other-
Read image (213.8KB)

● Read(C:\Users\Stefan1\.claude\jobs\8dfc791f\shots\desktop-stop-skills.png)
Read image (103.2KB)

● Read(C:\Users\Stefan1\.claude\jobs\8dfc791f\shots\desktop-stop-jornada.png)
Read image (101.3KB)

● Read(C:\Users\Stefan1\.claude\jobs\8dfc791f\shots\desktop-stop-playgr
Read image (110.8KB)

● Read(C:\Users\Stefan1\.claude\jobs\8dfc791f\shots\desktop-stop-manife
Read image (761KB)

● Read(C:\Users\Stefan1\.claude\jobs\8dfc791f\shots\desktop-stop-contat
Read image (177.8KB)

● Read(C:\Users\Stefan1\.claude\jobs\8dfc791f\shots\mobile-home-viewpor
Read image (345KB)

● Read(C:\Users\Stefan1\.claude\jobs\8dfc791f\shots\mobile-stop-work.pn
Read image (82KB)

● Read(C:\Users\Stefan1\.claude\jobs\8dfc791f\shots\mobile-stop-contato
Read image (89KB)

● Read(C:\Users\Stefan1\.claude\jobs\8dfc791f\shots\mobile-stop-manifes

● Read(C:\Users\Stefan1\.claude\jobs\8dfc791f\shots\desktop-home-viewport.png)
Read image (987.6KB)

● Read(C:\Users\Stefan1\Downloads\stefanscrepka-dev\components\ui\input.tsx)
Read 26 lines


Compilando o veredicto agora.

🎯 Veredicto Executivo

Portfolio com DNA editorial cinematográfico raro no tier portfólio brasileiro — paleta lime-on-13%L cirúrgica, tipografia Geist+PP Editorial com micro-features (ss01/calt/text-balance/optical-sizing), arquitetura motion em 8 camadas e implementação fiel do scroll-jacking Lando (200vh outer + sticky inner) que 90% dos sites tentam imitar com GSAP pin: true e quebram. Maior força: storytelling técnico anti-jargão ("Não vendo 'ajudo empresas a inovar'. Vendo entrega que paga conta") amarrado pela leitmotif "funciona 24/7 ou alguém perde dinheiro" do hero ao footer. Maior fraqueza: dívida WCAG acumulada em microcopy — --color-text-3 (oklch 55% L) em text-2xs (11px) na home inteira fica em ~4.2:1 contra --color-bg (oklch 13% L), abaixo do AA de 4.5:1 pra texto normal. Não é o tipo de erro que invalida — é o tipo que separa "muito bom" de "estado da arte".

📊 Notas por Dimensão
esign          │ 9.0/10 │ 12%  │ 1.08         │
├────────────────────────┼────────┼──────┼──────────────┤
│ Layout & Composição    │ 8.5/10 │ 10%  │ 0.85         │
├────────────────────────┼────────┼──────┼──────────────┤
│ Projetos / Cases       │ 8.0/10 │ 8%   │ 0.64         │
├────────────────────────┼────────┼──────┼──────────────┤
│ Performance Perceptual │ 7.0/10 │ 8%   │ 0.56         │
├────────────────────────┼────────┼──────┼──────────────┤
│ Trust & Conversão      │ 8.0/10 │ 10%  │ 0.80         │
├────────────────────────┼────────┼──────┼──────────────┤
│ NOTA FINAL             │ 8.3/10 │ 100% │ —            │
└────────────────────────┴────────┴──────┴──────────────┘

---
🔬 Auditoria Detalhada

1. Acessibilidade & WCAG 2.2 — 7.0/10

Evidências:
- --color-text-3 = oklch(55% 0.005 130) sobre --color-bg = oklch(13 55 vs 13 dá Y 0.229 vs 0.016, contrast ratio ≈ 4.25:1). Usado em@utility eyebrow a 11px (globals.css:278-286) que aparece em quase toda section — featured-work.tsx:35, bento-skills.tsx:83, other-work.tsx:28, contact.tsx:77, footer footer.tsx:80,153. WCAG 2.2 AA exige 4.5:1 pra texto < 18px — falha sistemática.
- components/sections/manifesto.tsx:200-208: <h2 ref={nameRef}>STEFANa gigante NÃO está marcada aria-hidden. O wrapper externo éaria-hidden="true" (linha 194), mas o <h2> ainda entra no document outline pra screen readers via querySelectorAll heading navigation no AT (ex: NVDA H key). Conflita com <h2> real de cada section.
- Boas práticas presentes: skip link (globals.css:389-411), focus-ring 3px lime universal (globals.css:437-441), @media (prefers-reduced-motion: reduce) global (globals.css:482-491), pre-hydration FOUC gate (globals.css:502-510), JSON-LD Person schema SSR (layout.tsx:75-128), honeypot + aria-live + aria-busy + aria-invalid no form (contact-form.client.tsx:206-214, 311-318, 360-369), <dl><dt class="sr-only"> em StatsRow (stats-row.tsx:65).

Recomendações:
- Subir --color-text-3 pra oklch(62% 0.005 130) (Lab L* 62 → Y 0.32 → ~5.4:1). Quebra zero porque é variável CSS.
- Marcar nameRef <h2> como <div aria-hidden="true"> decorativo (mantém estilo tipográfico, sai do outline) ou usar role="presentation".

2. Cores & Sistema Visual — 8.5/10

Evidências:
- Token system OKLCH disciplinado: 5 surfaces (base 13% → surface-overlay 26%), accent + 5 variantes (hover/subtle/emissive/glow), amber scoped + anulação explícita do
amber default Tailwind v4 via --color-amber-50..950: initial (globalst — sinal de design system maduro.
- Amber sub-accent confinado a UMA peça: EsteticaFlipCardClient via data-clinic-scope (other-work.tsx:48). Mini-cards Caronas/Estrutura ficam lime/neutral. Regra anti-bleed respeitada — visível na screenshot desktop-stop-other-work.png (amber só no card esquerdo, mini-card direito é mono+lime).
- Atrito chromatic: o video Anime_minimalista_no_song_202605220236.mpm swirls verde-ciano mais frios que --color-accent (oklch 124° = limeamarelado). Vê-se na screenshot desktop-stop-hero.png que o vortex de fundo diverge do CTA pill e do italic "multi-agente". O mask gradient mitiga em 35-100%, mas o
terço inferior do hero mostra os dois greens lado a lado.

Recomendações:
- Pós-processar o vídeo com hue-shift +10° pra alinhar com lime accenay extra mix-blend-color: var(--color-accent) a 8% pra unificar matiz.
- Documentar amber-scope rule num token-explorer no /design-system pra impedir futura regressão.

3. Tipografia — 9.0/10

Evidências:
- Pareamento Geist Sans + Geist Mono + PP Editorial Italic — 3 vozes, zero ambiguidade. Editorial Italic só aparece em UM lugar: <EditorialAccent> na palavra
"multi-agente" do hero (hero.tsx:89, editorial-accent.tsx:14-28). Esttem de menu.
- Escala fluida ratio 1.333 com clamp(min, fluid, max) em cada step (globals.css:74-117), tracking negativo escalonado (-0.005 → -0.030em conforme cresce), e leading
display 0.92 para text-6xl, 1.6 para body. Optical sizing + ss01 + caem h1, h2 no @layer base (globals.css:462-466).
- text-wrap: balance universal em h1/h2/h3 (globals.css:471-475) + font-variant-numeric: tabular-nums forçado em .font-mono (globals.css:451-457) — anti-flicker em count-ups (stats-row.tsx:109-111, imperativo via DOM mutation pra evitar React commits).

Recomendações:
- O text-2xs (11px) é o piso da escala e fica nas eyebrows. Subir pra 12px (0.75rem) + manter tracking-widest reduziria o problema WCAG sem perder a microvoz mono.
- Considerar uma versão text-display específica pra os years da timel-numeric: lining-nums oldstyle pra dar charme editorial diferenciado.

4. Storytelling & Copy — 9.0/10

Evidências:
- Hero entrega O QUÊ + PARA QUEM + POR QUE em <8s: "Construo IA multi-agente em produção — e o produto inteiro ao redor dela." + "AI Product Engineer · Claude SDK + Next
 16 + TypeScript · três produtos rodando 24/7." (hero.tsx:89-95). É ca única palavra vazia.
- Anti-jargão explícito no manifesto: "Não vendo 'ajudo empresas a inovar'. Vendo entrega que paga conta. Aprovação humana em ≤10 minutos por dia. Anti-slop validator com 14 regex pt-BR." (manifesto-body.tsx:16). Specifics > slogans.
- Recursão narrativa: pull-quote do manifesto ("Software sério tem o ema crítico: ou funciona 24/7 ou alguém perde dinheiro") ecoa no footer ("Se não funciona 24/7, não conta. — stefan", footer.tsx:147) e no eyebrow "FUNCIONA 24/7" implícito nos casos. Peak-end rule executada como manual.

Recomendações:
Design — 9.0/10

Evidências:
- 8-camadas em ordem narrativa, todas com propósito: SplitTextHeadline word-by-word reveal yPercent -20 + opacity (split-text-headline.tsx:43-58), MonoSubhead estático (decidido conscientemente, comentário em mono-subhead.tsx:6-10: "animation era unreliable em React 19 + concurrent"), CTAGroup stagger 50ms delay 600ms (cta-group.tsx:32), StatsRow count-up imperativo DOM (stats-row.tsx:108-111), PartnerMarquee 50s GSAP loop com pause-on-hover (partner-marquee.tsx:46-67).
- ManifestoSection (manifesto.tsx:174-263): implementação correta do Lando — h-[200vh] outer + position: sticky top-0 h-screen inner, GSAP scrubbed timeline durante o range de pin sem usar pin: true. O memory file feedback_lando_sticky_pattern.md deixa explícito que isso é regra. Comentário inline confirma a divergência sobre Rive Trim Path vs SVG clip-path (manifesto.tsx:138-141) — autoconsciência de craft.
- Easings nomeados como sistema (globals.css:180-188): --ease-standard cubic-bezier(0.2, 0, 0, 1) (Material standard), --ease-dramatic (0.165, 0.84, 0.44, 1), --ease-snappy (0.34, 1.56, 0.64, 1) (back-out spring), aplicados contextualmente (snappy nos bento cells, dramatic nos featured tiles, smooth nos hovers).

Recomendações:
- O range de 100vh de scroll travado no manifesto é o limite suportável. Considerar reduzir pra h-[180vh] (mantém ~80vh de pin) — usabilidade ↑ sem perder o reveal.
- Magnetic CTA strength=6 está ótimo, mas pra acessibilidade motora dar bypass via prefers-reduced-motion no MagneticCTA (já vi useReducedMotion em outros lugares — verificar se está no MagneticCTA também).

6. Layout & Composição — 8.5/10

Evidências:
- Three containers semânticos (container-max 90rem, container-narrow 61.25rem, container-prose 72ch, globals.css:313-332) usados conforme densidade da section: hero/work
 usam max, manifesto usa prose, footer/contact usam max. Ritmo corret
- Assimetria deliberada no Featured Work: HeroTile 1.55fr/1fr (Content Engine) + half-tiles ESPELHADOS (NexaCore text-LEFT, STJ text-RIGHT) com aspect ratios divergentes (4/3 vs 16/9, featured-work.tsx:60-75). Quebra simetria sem virar zoo.
- section-pad-y-lg = clamp(6rem, 10vw, 12rem) (globals.css:338-340) cria respiração maior nas sections-chave (hero, work, contato) e section-pad-y (4-8rem) nas de suporte. Diferenciação rítmica.

Recomendações:
- No mobile hero (mobile-home-viewport.png), a stats row "22 agentes Claude 27 Tabelas Drizzle 100+ vitest tests..." quebra em 3+ linhas com mono pequeno e contrast text-3. Considerar reduzir pra 3 stats no mobile (esconder os 3 últimos sem valor numérico) via sm:flex nos extras.
- A faixa "FEATURED WORK · 01 / 04 — FLAGSHIP · CONTENT ENGINE" no HeroTile (featured-work.tsx:88-95) tem hierarquia visual concorrente com a eyebrow da section. Diferenciar com cor ou peso.

7. Projetos / Cases — 8.0/10

Evidências:
- 3 featured + 3 other = 6 cases. Narrativa "Três produtos. Três posturas." (featured-work.tsx:43-46) define eixo de leitura. Sequence label cinematográfico "01 / 04 — FLAGSHIP · CONTENT ENGINE" mono lime tabular (featured-work.tsx:86-96).
- SquadsStatusLine no Content Engine tile (featured-work.tsx:224) é ooop S0 → S1 → ... → E-0 HITL visível no desktop-stop-work.png —comunica "produto vivo, agora" sem precisar de screenshot de produção.
- Highlights crisp por slug (featured-work.tsx:316-327): "Next 14 + Cant por subdomínio" / "Prompt cache 2 camadas · vision validatormulti-modal · 162 testes · pgvector RAG · Inngest workflows". Engineering credibility.

Recomendações:
- Faltam métricas de impacto não-técnico. Conta uma história só de stack. Adicionar 1 bullet financeiro/operacional por case: "≤10 min/dia substitui equipe 4-6 pessoas" (Content Engine), "X clínicas ativas" (NexaCore), "Y minutos economizados por consulta" (STJ App).
- Content Engine usa diagram: 'squads' (sem screenshot real, data.ts:90); NexaCore & STJ vão pelo path do MockupFrame com screenshot. Inconsistência visual entre flagship e secundários. Idealmente flagship também ganha screenshot ou um Aceternity MacBookScroll (já mencionado no comentário do case-study-cover.tsx:13-15 como
Wave 4).

8. Performance Perceptual — 7.0/10

Evidências:
- Hero usa <video autoPlay loop muted playsInline preload="auto"> sem width/height, sem poster, sem condição de viewport/connection (hero.tsx:38-48). Path: /bg/Anime_minimalista_no_song_202605220236.mp4. preload="auto" baixa o vídeo inteiro no load — se o arquivo for >5MB (típico anime loop), o INP/LCP sofrem especialmente
em 4G/3G ou em conexões de Ponta Grossa-PR fora do CDN. Não testei o a configuração é otimista demais.
- Bundle pesado pro home: GSAP + ScrollTrigger + SplitText + useGSAP + motion (Motion 12) + Lenis + Three + r3f + drei + Spline + Rive + Recharts + Shiki todos potencialmente carregados (package.json:26-58). Lazy boundaries não estão visíveis no app/page.tsx — todas as sections importadas direto.
- Boas práticas presentes: next/font Geist com swap (layout.tsx:3-4),isplay: 'swap' + fallback Georgia (layout.tsx:20-36), pre-hydrationFOUC gate (layout.tsx:142-147), next/image em screenshots + avatar (contact.tsx:52, case-study-cover.tsx:54), tabular-nums forçado contra flicker, useReducedMotionSafe em count-ups.

Recomendações:
- Adicionar poster="/bg/anime-poster.webp" no <video>, mudar pra preload="metadata", e gate autoPlay por (min-width: 768px) and (prefers-reduced-motion: no-preference)
via media query JS — economiza 5-15MB no mobile/reduced.
- Code-split sections abaixo do fold via next/dynamic com ssr: true mas loading placeholder. PlaygroundTeaser (SVG estático) e BentoSkills definitivamente podem ser lazy.

9. Trust & Conversão — 8.0/10

Evidências:

Recomendações:
- Falta prova social não-técnica. Mesmo o repo open-source mostra apenas códigos próprios. Adicionar 1-2 quotes de cliente real (NexaCore tem clínicas em produção) acima do form, talvez em formato citação editorial + nome + papel.
- O footer tem "About this site →" mas não tem política de privacidade nem link pra LGPD compliance (mencionado nas knowsAbout do JSON-LD). Pra um portfolio voltado a B2B brasileiro, faltar link de privacy = sinal vermelho legal.

---
🚨 Top 5 Problemas Críticos (Bloqueadores)

1. Contraste WCAG AA falha em microcopy mono — impacto: alto / esforço: trivial

- Problema: --color-text-3 (oklch 55%) em text-2xs (11px) eyebrows, mono-stats legends, sequence labels — todas as section-headers do site. Razão ≈ 4.2:1 vs. AA exige 4.5:1 pra texto < 18px.
- Por que importa: WCAG 2.2 AA é mínimo legal em vários contratos B2B/governo, e Linear/Vercel ficam 5:1+. É a barreira entre "muito bom" e "defensável".
- Fix: Em app/globals.css:46, trocar --color-text-3: oklch(55% 0.005 130) por oklch(63% 0.005 130). Zero refactor — uma variável.

2. <h2>STEFAN HEINZ SCREPKA</h2> decorativo entra no document outline — impacto: médio / esforço: trivial

- Problema: components/sections/manifesto.tsx:202-208 renderiza <h2 ref={nameRef}>STEFAN HEINZ SCREPKA</h2> como background gigante. O wrapper externo é aria-hidden, mas o <h2> ainda navega via H key em screen readers.
- Por que importa: Quebra o outline lógico (cada section deveria ter um <h2> semântico), polui navegação por headings.
- Fix: Trocar <h2> por <div role="presentation" aria-hidden="true"> ou aplicar aria-hidden="true" direto no elemento e mover o estilo display pra um span — não há motivo semântico pro nome decorativo ser heading.

3. Hero video sem poster, sem media query, preload="auto" — impacto: alto / esforço: baixo

- Problema: components/sections/hero.tsx:38-48 baixa o vídeo inteiro ao load (preload auto), sem dimension hints, sem poster. Em 4G médio brasileiro (10-25Mbps), LCP arrisca >2.5s.
- Por que importa: Hero é o LCP. Mobile-first user testa primeiro impressão em ≤3s.
- Fix: Adicionar poster="/bg/hero-poster.webp" + mudar pra preload="metadata" + gate autoPlay via useReducedMotionSafe() e media query min-width: 768px. Encolher o .mp4 (resolução 720p basta, target ≤2MB).

4. Cor do vídeo de fundo do hero diverge da paleta lime — impacto: médio / esforço: médio

- Problema: Anime swirls verde-ciano (hue ~150°) ao lado do CTA lime °). Dois verdes brigando.
- Por que importa: O hero é o framing-chave — discordância chromatic comunica "templated" mesmo com 8 layers de motion impecáveis.
- Fix: CSS overlay mix-blend-color: oklch(94% 0.22 124 / 0.20) em cimn> do video wrapper, OU regravar/pós-processar o asset com hue-shift+25° pra puxar pra 124°.

5. Falta prova social humana — impacto: alto / esforço: alto

- Problema: A página inteira é monólogo competente do Stefan. Nenhum quote, logo de cliente, nem testimonial. "Três produtos em produção" precisa de aval externo pra virar trust.
- Por que importa: B2B é decisão de compra. CTAs "Conversar 15min" exigem confiança prévia — sem terceiros vouchando, primeira reação é "esse cara é bom mas e o risco?".
- Fix: Inserir bloco compacto após o OtherWorkSection — 1-3 quotes edcliente Estética MD + colega B7Web), formato "1 frase + nome + papel +foto pequena monocromática". Não precisa testimonial-card padrão — pode ser citação tipográfica editorial alinhada ao tom do manifesto.

---
💎 Top 3 Acertos

1. Implementação correta do Lando sticky scroll-jacking (manifesto.tsx)                                                                                              
Memória feedback_lando_sticky_pattern.md instrui h-[200vh] outer + sticky top-0 h-screen inner, NÃO GSAP pin. Código segue à risca (manifesto.tsx:174-263). 90% das tentativas que vi de portfólios brasileiros usam ScrollTrigger.create({ pin: true }) e quebram em mobile/Safari. Aqui o GSAP só anima durante o range do sticky, sem assumir controle do scroll. Vale o stake do PR sozinho.

2. Disciplina do amber sub-accent + nullify do default Tailwind

globals.css:28-38 anula --color-amber-50..950: initial pra impedir que bg-amber-400 por engano funcione. Combinado com data-clinic-scope no EsteticaFlipCard (other-work.tsx:48) garante que amber é só uma variação local. Maioria dos design systems brasileiros mistura 3 accents e perde a identidade — esse aqui sabe o que é.

3. Anti-jargão como prática contínua, não slogan único

Hero ("Construo IA multi-agente em produção — e o produto inteiro ao  vendo 'ajudo empresas a inovar'. Vendo entrega que paga conta"),footer ("Se não funciona 24/7, não conta"), contato ("Tem algo complexo demais pra virar landing genérica?"). Cada seção é uma instância da mesma voz. Em portfólios brasileiros, ver isso é uma vez em 50.


🎓 Referências de Inspiração

Pra subir das notas 8/10 pras 9+/10, especialmente na dimensão mais fraca (Performance Perceptual + Trust):

1. https://linear.app — Performance Perceptual + Layout. O Linear roda Three.js + scroll-driven animations e ainda assim CLS 0 / LCP <1s. Estuda como eles lazy-load os módulos pesados via next/dynamic por rotas internas e pré-carregam apenas o LCP frame.
2. https://vercel.com — Trust + Conversão. Olha como o homepage cinematic deles intercala stack/product/customer logos. O bloco "POWERED BY THE CUSTOMERS YOU LOVE" resolve prova social sem virar testimonials slop. Pode-se replicar com 6-8 logos pequenos hairline + 1 quote editorial.
3. rauno.me (https://rauno.me/craft) — Motion + Microinteractions. O Rauno Freiberg pesquisa motion craft no nível de Disney 12 principles. Estuda os "Craft" microposts dele pra entender quando easing tem que ser back.out vs ease-smooth vs spring real.
4. https://family.co — Storytelling + Cases. Eles tratam o portfolio do estúdio como narrativa cinematic onde cada case é "ato" e o site inteiro é "manifesto". Stefan já está no caminho desse pattern — vale ver como eles amarram metric financeiro com tipografia editorial.
5. emilkowal.ski (https://emilkowal.ski/ui) — Tipografia + Microcraft. Emil Kowalski tem o melhor mix Geist+optical sizing no Ocidente. Olhar os specimens pra ver onde meter um font-feature-settings: 'ss02' 1 extra ou um font-variant-numda timeline pra subir polish.

Auditoria concluída. Nota final: 8.3/10 ("muito bom — diferenciado, i execução"). Há um caminho claro pra 9+/10: subir 1 token CSS (text-3+8% L) resolve a dívida WCAG; ajustes em <video> do hero + 1 bloco de prova social humana cobrem trust & performance; o resto já está em nível de referência regional.