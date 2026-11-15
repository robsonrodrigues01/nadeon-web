# Estado do projeto nadeon-web

Atualizado: 15/11/2026 00:45 BRT (Maestro).

- Fluxo: local. Merge no main após revisão APROVADO de outro agente + `pnpm gate` verde, rodado pelo Maestro sob a trava `/tmp/nadeon-heavy.lock`.
- Onda 0 e onda 1: entregues.
- Onda 2: FECHADA. W2-01 a W2-36 no main. Gate: 100 arquivos, 989 testes, build verde.
- Em andamento (pós-onda 2, achados das revisões): W2-37 MarketProvider no layout raiz, W2-38 QuizResultPet sem valores fixos, W2-39 lacunas de contrato (copy, pedido de visitante, reorder, copy link).
- GitHub: origin/main parado em aa946eb (checkpoint 19:10 de 14/11). Push só com aprovação do Robson. Onda 3 (Playwright, axe, Lighthouse) depende do CI.
- Capacidade: 3 construtores + 2 revisores + Auditor; um comando pesado por vez; Antigravity com `--add-dir` da pasta Website e /private/tmp; ver gotchas em maestri/ORQUESTRADOR.md.
- Fidelidade do pipeline: maestri/reconcile.mjs roda a cada 60 s na rotina do Auditor. CLI maestri-task sempre grava no estado central.
- Pendências do Robson: aprovar docs/quiz-proposta.md, docs/faq-proposta.md, docs/shipping-returns-proposta.md, docs/legal-proposta.md (e propostas legal-*); revisão jurídica dos textos legais; substanciação científica das claims do /science (DECISIONS 14/11); aprovar push ao GitHub.
