# _prompts/

Documentos operacionais pra geração de assets visuais (vídeos, gifs, imagens) do stefanscrepka.dev.

Pasta com prefixo `_` = NÃO entra no build do Next.js. Só referência local.

## Arquivos

- **`motion-design-principles.md`** — Princípios de motion design profissional (18 anti-AI-slop rules + tabela de easing + receita DaVinci 9-node + 8 refs cinematográficas + checklist 28 critérios). Leia ANTES de gerar.
- **`prompt-engineering-master.md`** — Prompts prontos-pra-colar pra Veo 3.1, Seedance 2.0, Kling 3.0, Pika 2.5, Luma Ray3.14, Imagen 3, Nano Banana 2. Workflow iteração + ffmpeg commands + DaVinci nodes.

## Quick start

1. Leia `motion-design-principles.md` §B (anti-slop) e §F (refs cinema).
2. Abra `prompt-engineering-master.md` §B.1 — Veo 3.1 Versão A (hero recomendado).
3. Cole no Gemini API / Google AI Studio com Veo 3.1 Standard.
4. Itere 3 variações Fast em paralelo (§B.2), escolha vencedora, refina no Standard.
5. Pós-produção DaVinci com receita §D do motion-design-principles.md.
6. Compress com ffmpeg commands §E.1 do prompt-engineering-master.md.
7. Drop os MP4/WebM/poster em `public/assets/hero/`.

## Regra de ouro

Cole literal. Itere com **seed**, não com texto. Os tokens foram escolhidos por razões físicas no modelo. Se substituir "Roger Deakins" por "cinematic" → vira slop. Se tirar HEX `#D2FF00 at 60% saturation` → ganha neon Walmart.

Se falhar 5x seguidas no mesmo tool, **mude de tool, não de prompt**.

## Referência cruzada

- Plano master de implementação: `C:\Users\Stefan1\.claude\plans\wise-petting-squid.md`
- Motion tokens do projeto: `app/globals.css` linhas 175–198
- Aceternity components disponíveis: MacBookScroll, BentoGrid, DirectionAwareHover, TracingBeam, CompareSlider
