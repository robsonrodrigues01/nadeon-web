# PROJECT_HANDOFF: website Nadeon Labs (nadeon-web)

Handoff do Claude Code para o Maestro. Data: 13/11/2026. Fonte da verdade do plano: [../plano-v3-nadeon-web.md](../plano-v3-nadeon-web.md). Catálogo de telas: [../Catalogo/catalogo-telas-nadeon.md](../Catalogo/catalogo-telas-nadeon.md).

## 1. Objetivo

Construir o site headless da Nadeon Labs (linhas Human e Pet) em Next.js 16.3 na Vercel, com a Shopify como motor de catálogo, carrinho, assinatura, conta e checkout. O site só abre no nadeonlabs.com já vendendo, o mais rápido possível (meta: meados de dezembro de 2026).

## 2. Requisitos aprovados (não rediscutir)

Todos estão na seção 0 do plano v3. Os que mais afetam a execução:

- Lista L completa (seção 2 do plano) no lançamento. Mocks até a onda 4; Shopify real só na onda 4.
- Contratos em `lib/contracts/` com implementação mock e real, escolhida por variável de ambiente.
- Login só por código (Customer Account API). Shopify Subscriptions. Reviews em metaobjects. Mailyte para e-mail. Banner de cookies próprio (opt-out nos EUA, opt-in fora). Venda mundial com Shopify Markets.
- HTML semântico obrigatório (o design só usa div e span).
- No máximo 8 agentes rodando build ao mesmo tempo, com fila. Playwright, Lighthouse e axe só no CI.
- Merge automático no `main` com CI verde até o lançamento. Aprovação do Robson só para virar o DNS.
- Tudo em inglês no site; documentação interna em português do Brasil.

## 3. Hipóteses (verificar, não assumir)

- Next.js 16.3 gera um AGENTS.md com a documentação da versão. Confirmar ao criar o projeto.
- O nome do antigo middleware no Next 16 (proxy). Confirmar na documentação gerada.
- A Customer Account API exige HTTPS e URL de retorno cadastrada. Verificar só na onda 4.

## 4. Restrições

- Nenhum app pago além do plano da Shopify. Mailyte no plano gratuito.
- Nenhum segredo no código. Variáveis só na Vercel e em `.env.local` fora do Git.
- Dados de exemplo (`[X]`, `$XX`, `(example)`) nunca viram texto fixo em componente.
- Lab Results só com lotes reais.
- Não tocar no DNS do nadeonlabs.com (Cloudflare) antes da aprovação de lançamento.

## 5. Bloqueantes externos (com o Robson)

| Item | Bloqueia |
| --- | --- |
| Aprovar o `quiz.json` proposto | Fim da onda 1 |
| Cadastro manual dos 21 SKUs na Shopify | Onda 4 |
| Conta e chave de API do Mailyte | Onda 4 |
| Shopify Subscriptions instalado com os 5 planos | Onda 4 |
| COAs reais | Lançamento |
| Revisão jurídica dos textos legais | Lançamento |
| Aprovação da virada do DNS | Lançamento |

## 6. Caminhos

| O quê | Caminho |
| --- | --- |
| Pasta do projeto | `/Users/robsoncoffy/Documents/Nadeon/Website` |
| Repositório (criado na W0-01) | `/Users/robsoncoffy/Documents/Nadeon/Website/nadeon-web` |
| Worktrees dos agentes | `/Users/robsoncoffy/Documents/Nadeon/Website/worktrees/<task_id>` |
| Estado do Maestri (fonte central) | `/Users/robsoncoffy/Documents/Nadeon/Website/nadeon-web/.maestri` (no checkout principal, fora dos worktrees) |
| Telas do design (uma por arquivo, markup `x-dc`) | `/Users/robsoncoffy/Documents/Nadeon/Website/design/boards/*.dc.html` + `_boards.json` |
| Resumo do Brand Kit | `/Users/robsoncoffy/Documents/Nadeon/Website/design/brand/BRAND.md` |
| Inventário de botões e campos | `/Users/robsoncoffy/Documents/Nadeon/Website/Catalogo/inventario-elementos.csv` |
| HTMLs originais do design | `/Users/robsoncoffy/Documents/Nadeon/Website/Páginas/` |

## 7. Fases e tarefas

IDs estáveis no formato `W<onda>-<nn>`. A onda 0 está detalhada em [BRIEFINGS.md](BRIEFINGS.md). As demais ondas são decompostas pelo Maestro (papel Planner) ao fim da onda anterior, a partir das seções 2 e 3 do plano v3 e da seção 5 do catálogo (botões e campos por página).

| Onda | Tarefas | Gate de saída |
| --- | --- | --- |
| 0. Fundação | W0-01 a W0-07 | Validação ponta a ponta da W0-07 concluída |
| 1. Base | Componentes globais, de loja, quiz, dose, dados, renders, handles | `/dev/kit` completo, `data:check` verde, quiz aprovado |
| 2. Páginas L | Uma tarefa por rota (desktop + mobile) | Todas as rotas L abrem com mocks |
| 3. QA | Fluxos, acessibilidade, performance, SEO, conformidade | CI verde nas metas |
| 4. Integrações | Seção 3.1 do plano, na ordem | Compra de teste em 2 países e jornadas disparando |
| Lançamento | Checklist da seção 3.2 do plano | Aprovação do Robson e DNS virado |

## 8. Critérios de pronto gerais

Toda tarefa só é aceita com:
- `pnpm verify` verde no worktree e CI verde no PR.
- Diff só nos caminhos permitidos pela tarefa.
- Revisão por um agente diferente do autor.
- Evidência anexada no PR: comandos rodados e saídas, screenshots em 375, 768 e 1280 px para tarefas de interface.
- Checkpoint final em `.maestri/agents/states/<agent_id>.json`.

## Retomada (16/11/2026 20:05 BRT)

Este arquivo é o handoff original de requisitos. Estado corrente em PROJECT_STATE.md, próximas ações em NEXT_ACTIONS.md, decisões em DECISIONS.md, eventos em logs/events.jsonl e pipeline em pipeline/tasks.json.
