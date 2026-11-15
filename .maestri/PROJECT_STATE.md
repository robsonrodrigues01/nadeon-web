# Estado do projeto nadeon-web

Atualizado: 15/11/2026 02:30 BRT (Maestro).

- Fluxo: local. Merge no main após revisão APROVADO de outro agente + `pnpm gate` verde, rodado pelo Maestro sob a trava `/tmp/nadeon-heavy.lock`.
- Onda 0 e onda 1: entregues.
- Onda 2: FECHADA. W2-01 a W2-36 no main. Gate: 100 arquivos, 989 testes, build verde.
- Pós-onda 2 entregues: W2-37 (MarketProvider sem cookies() na raiz; rotas de conteúdo seguem estáticas), W2-38 (QuizResultPet sem fixos), W2-39 (contrato), W2-40 (rotas ligadas ao contrato), W2-41 (/cart frete e vazio), W2-43 (conta e /track); W2-42 encerrada sem mudança.
- Onda 3 local entregue: W3-01 testes semânticos do catálogo (28 it.todo = onda C, Shopify ou login onda 4), W3-02 specs Playwright (não executadas no Mac), W3-03 scripts/check-routes.mjs, W3-04 links e metadata corrigidos, W3-05 lint sem warnings.
- Gate atual do main: 114 arquivos, 1098 testes + 28 todo, build verde, `node scripts/check-routes.mjs` exit 0. 82 tarefas entregues, nenhuma aberta.
- Construtores em Luna 6 Low (Codex gpt-6-luna low) desde a cota do Gemini esgotar (15/11 ~00:05).
- GitHub: origin/main parado em aa946eb (checkpoint 19:10 de 14/11); main local 181+ commits à frente. Push só com aprovação do Robson. Onda 3 (Playwright, axe, Lighthouse) depende do CI.
- Capacidade: 3 construtores + 2 revisores + Auditor; um comando pesado por vez; Antigravity com `--add-dir` da pasta Website e /private/tmp; ver gotchas em maestri/ORQUESTRADOR.md.
- Fidelidade do pipeline: maestri/reconcile.mjs roda a cada 60 s na rotina do Auditor. CLI maestri-task sempre grava no estado central.
- Pendências do Robson: aprovar docs/quiz-proposta.md, docs/faq-proposta.md, docs/shipping-returns-proposta.md, docs/legal-proposta.md (e propostas legal-*); revisão jurídica dos textos legais; substanciação científica das claims do /science (DECISIONS 14/11); aprovar push ao GitHub.

- Revisão visual (W3-06 a W3-08) via portal contra os boards concluída. Correções entregues: W3-09 shell duplicado, W3-10 fontes sem ciclo (Archivo/DM Sans), W3-11 e W3-13 imagens pelo catálogo (12 SKUs com placeholder neutro aguardando renders do Robson), W3-12 e cart-line-item sem rolagem horizontal (38 rotas medidas em 375 px), W3-14 banner de cookies não cobre CTAs. Gate: 1105 testes + build verdes. 96 tarefas entregues, nenhuma aberta.
- Pendente baixo: espaçamento do início do quiz Human (achado vago da W3-08).
