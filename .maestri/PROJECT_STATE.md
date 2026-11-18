# Estado do projeto nadeon-web

Atualizado: 16/11/2026 01:45 BRT (Maestro).

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

- 16/11 madrugada: tema de cores aplicado de fato (W3-26), revisões visuais em 320/375/768/1280/1440, teclado e foco, acessibilidade estática (0 achados após W3-56), contraste (2 pares Pet aguardando decisão do Robson), segurança (W3-25/W3-59), JS por rota reduzido (W3-42/43/52), testes de comportamento (W3-39/40/41), specs Playwright (W3-31/51). Gate do main: 1196 testes + build verdes.
- Em curso: W3-45 (conta; conflito com W3-32), W3-60 e W3-64 (segurança), W3-65 (checagem visual).
- Agentes no Antigravity/Gemini com --dangerously-skip-permissions (pedido do Robson); Codex ficou com pouca cota.

## 16/11/2026 20:05 BRT (Maestro)

- Onda 3 FECHADA: 87 tarefas, todas entregues (W3-01 a W3-88). Total do pipeline: 164 entregues até a W3-88.
- Main local em 3e47c94 + checkpoints; gate: 1302 testes + build verdes. GitHub: origin/main em aa946eb, main local 453 commits à frente. Push só com aprovação do Robson.
- Entraram hoje: segurança Do Not Sell e action própria de exclusão de conta (W3-60, W3-64), imagens 404 e responsivas (W3-68, W3-72, W3-88), contraste AA Pet (W3-70), testes de cobertura (W3-74), specs Playwright (W3-78), correções visuais e de teclado (W3-84, W3-85).
- Incidente: merge W3-60 quebrou excluir conta (delete-account.tsx reusava submitPrivacyRequest); revertido e corrigido com action própria (DECISIONS 16/11).
- Fila permanente: todos os 14 itens feitos; itens 1 e 4 com segunda passada sem achados novos (W3-86, W3-87).
- Onda 4 lançada: W4-00 (contrato, com mock) em andamento com Prisma5; W4-00b depende dela; W4-01 a W4-11 bloqueadas com motivo (Shopify real, Mailyte, IDs de medição, materiais e decisões do Robson).
- Agentes: Prisma5 (Gemini, com rede), Trilho e Crivo5 (Codex sem bypass: sem rede e sem portal confiável, o Maestro roda o gate com rede), revisores Lente e Lupa (Codex). Vigia3 (Antigravity sem bypass) ocioso, trava em permissão. Crivo4 Gemini esgotou cota (reset ~99h), virou Crivo5.
- Auditor de Operações: aparece como terminal "Terminal", roda Claude Code e não tem rotina de 60 s. Correção proposta ao Robson, aguardando.
- Memória do Mac oscila em amarelo (kern.memorystatus_vm_pressure_level = 2); dev server do main rodando para tarefas de portal.

## 17/11/2026 02:45 BRT (Maestro)

- Onda 4, parte sem pré-requisitos ENTREGUE: W4-00/00b (contrato e rotas de pedido), W4-03a (script de catálogo Shopify), W4-06a (webhooks HMAC + Mailyte mock), W4-08a (medição só com consentimento), W4-09a (Customer Privacy API no banner), W4-12 (painel antigo removido), W4-13/14/15 (três testes instáveis corrigidos).
- Gate do main: 1358 testes + build verdes. Main local, sem push.
- Bloqueadas: W4-01 a W4-11 (Shopify real por último, por decisão do Robson; Mailyte aguardando o site oficial; IDs de medição; materiais W3-79; decisão do detalhe de kit).
- Skills em uso: ponytail full + tdd + diagnosing-bugs (construtores), ponytail-review (revisores). Auditor em Codex/Luna com rotina de 1 min.

## 17/11/2026 03:35 BRT (Maestro)

- Segunda rodada da onda 4 entregue: revisão de segurança W4-16 gerou W4-19 (P1 consentimento), W4-20 (sessão e dono do ID nas actions), W4-21 (webhook idempotente), W4-22 (/track mínimo); W4-17 console limpo; W4-18 aviso de imagem.
- Gate do main: 1379 testes + build verdes. Main local, sem push.
- Bloqueadas: W4-01 a W4-11 (Shopify por último; Mailyte aguardando site; IDs de medição; materiais W3-79; detalhe de kit) e W4-23 (deduplicação entre processos: escolha de armazenamento compartilhado).

## 18/11/2026 01:35 BRT (Maestro)

- Onda 5 local quase fechada: W5-00 a W5-36 entregues, exceto a W5-34 (console por rota), em revisão. Pipeline: 230 entregues, 12 bloqueadas (onda 4, dependem da Shopify e do Robson).
- Main em 3a8a11a; gate: 1595 testes + build verdes.
- Bitbucket: origin/main em 2d0672e. Netlify: o push em main dispara o deploy (webhook do Bitbucket para o build hook "bitbucket-push-main" da Netlify). nadeonlabs.com público com dados de teste, por decisão do Robson (DECISIONS 18/11). Mailyte em produção (MAILYTE_MODE=live).
- Banco de dados: nenhum próprio. A Shopify guarda os dados (Storefront, Cart, Customer Account, Subscriptions, Metaobjects) e o Mailyte guarda contatos. Tudo por providers em lib/providers (mock ou live).
- Pendências do Robson: docs/pendencias-por-rota.md (lista priorizada); Shopify por último; IDs de medição; detalhe de kit; programas de afiliados e indicação (textos do board retidos na W5-36); cores Pet abaixo de WCAG (W5-29); confirmar o aviso FDA nos artigos Pet.

## 18/11/2026 04:25 BRT (Maestro)

- Segunda passada da fila permanente nas rotas das ondas 4 e 5 concluída: W5-37 (visual 1440/320), W5-38 (alvos de 44 px), W5-39 (teclado e foco e checagem de dono em reviews/write), W5-40 (visual 768 px e estados visuais de formulário).
- Main e origin/main em 53e1ba6, publicado na Netlify (fns 1, rotas 200). Gate: 1614 testes + build.
- Incidente 18/11 ~01:40-02:40: depois da reconexão do repositório, o site ficou em 404 por falta do plugin Next.js; resolvido (DECISIONS 18/11).
- Abertas: nenhuma. Bloqueadas: 12 da onda 4 (Shopify e Robson).
