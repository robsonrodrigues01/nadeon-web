# Decisões Técnicas (ADRs)

## ADR-001: Existência do AGENTS.md
- **Status:** Aceito
- **Contexto:** Next.js 16.3 cria e valida AGENTS.md na raiz do repositório.
- **Decisão:** Manter o arquivo AGENTS.md gerado pelo framework e versionado no repositório.

## ADR-002: Nome do antigo middleware no Next.js 16.3
- **Status:** Aceito
- **Contexto:** Convenção de roteamento intermediário no Next.js 16.3.
- **Decisão:** O middleware foi substituído pelo proxy em proxy.ts (ou proxy.js), com função proxy executada no runtime nodejs.

## ADR-003: Integração e Deploy na Netlify
- **Status:** Aceito
- **Contexto:** Conexão contínua entre GitHub e Netlify para prévias automáticas.
- **Decisão:** Repositório nadeon-web conectado ao GitHub e ao projeto Netlify, com commits vinculados ao autor configurado.

## ADR-004: Abertura e Domínio
- **Status:** Aceito
- **Contexto:** Condição de entrada no ar do site de produção.
- **Decisão:** O domínio nadeonlabs.com só entra no ar com a Shopify integrada e apta para vendas. Até o lançamento, todo o trabalho é validado nas prévias da Netlify.

## ADR-005: Cronograma e Ritmo das Ondas
- **Status:** Aceito
- **Contexto:** Metas de entrega do site nadeon-web.
- **Decisão:** Meta de lançamento em meados de dezembro de 2026. As ondas rodam de forma sequencial sem datas fixas por funcionalidade.

## ADR-006: Escopo do Lançamento
- **Status:** Aceito
- **Contexto:** Definição do escopo da primeira versão pública.
- **Decisão:** Escopo fixado na Lista L completa (seção 2 do plano técnico v3).

## ADR-007: Mocks e Provedores de Dados
- **Status:** Aceito
- **Contexto:** Isolamento de integrações externas durante desenvolvimento inicial.
- **Decisão:** Todas as chamadas usam interfaces em lib/contracts com implementações mock até a onda 4, quando a Shopify real é conectada.

## ADR-008: Plano da Shopify
- **Status:** Aceito
- **Contexto:** Custos e arquitetura de comércio eletrônico.
- **Decisão:** Utilizar o plano padrão da Shopify. Migração para Shopify Plus apenas se volume de atacado justificar.

## ADR-009: Mercado Global e Moedas
- **Status:** Aceito
- **Contexto:** Venda internacional desde o lançamento.
- **Decisão:** Idioma único em inglês para todo o mundo. Preços em moeda local via Shopify Markets. Impostos de importação quitados pelo cliente na entrega, explicitados em Shipping e checkout.

## ADR-010: Produtos e SKUs
- **Status:** Aceito
- **Contexto:** Catálogo inicial de produtos.
- **Decisão:** 21 SKUs com nomes e preços provisórios baseados no design. Cadastro manual na Shopify utilizando handles fornecidos pelo projeto.

## ADR-011: Autenticação de Clientes
- **Status:** Aceito
- **Contexto:** Experiência de login e criação de contas.
- **Decisão:** Acesso exclusivamente sem senha por código enviado por e-mail (Customer Account API). Sem telas de esqueci minha senha ou cadastro separado.

## ADR-012: Assinaturas
- **Status:** Aceito
- **Contexto:** Recorrência e venda de suplementos em planos de reposição.
- **Decisão:** Uso do Shopify Subscriptions integrado à Customer Account API.

## ADR-013: Mensageria e E-mails
- **Status:** Aceito
- **Contexto:** Disparo de newsletters e notificações da loja.
- **Decisão:** Mailyte para newsletter, campanhas e formulários do site. E-mails transacionais (confirmação e rastreio de pedido) gerenciados nativamente pela Shopify.

## ADR-014: Avaliações de Clientes (Reviews)
- **Status:** Aceito
- **Contexto:** Exibição de avaliações nas páginas de produtos.
- **Decisão:** Armazenamento em metaobjects da Shopify. No lançamento, estado visual vazio sem formulário de submissão (aberto semanas após primeiras entregas).

## ADR-015: Canal de Suporte
- **Status:** Aceito
- **Contexto:** Atendimento ao cliente no lançamento.
- **Decisão:** Suporte apenas via formulário de contato por e-mail (Mailyte). Chat em tempo real postergado para fase futura.

## ADR-016: Gestão de Cookies e Privacidade
- **Status:** Aceito
- **Contexto:** Conformidade regulatória (LGPD, GDPR, CCPA).
- **Decisão:** Banner de consentimento próprio. Mecanismo de opt-out nos Estados Unidos e opt-in no restante do mundo, com suporte a sinais GPC e Do Not Sell.

## ADR-017: Campanhas e Cupons Iniciais
- **Status:** Aceito
- **Contexto:** Estratégia promocional no lançamento.
- **Decisão:** Apenas cupom de 10% de desconto na primeira compra. Telas promocionais de Black Friday e feriados mantidas como modelos de campanha.

## ADR-018: Laudos e Certificados de Análise (COA)
- **Status:** Aceito
- **Contexto:** Transparência de qualidade farmacêutica dos lotes.
- **Decisão:** Apenas lotes e COAs reais são publicados. Caso não haja lotes no lançamento, exibe aviso e desativa a ferramenta de busca de lotes.

## ADR-019: Ativos Visuais e Renders
- **Status:** Aceito
- **Contexto:** Apresentação visual dos produtos.
- **Decisão:** Renders tridimensionais dos potes com base nos rótulos oficiais. Fotografias de lifestyle e animais incorporadas de forma progressiva.

## ADR-020: Textos Legais e Revisão Jurídica
- **Status:** Aceito
- **Contexto:** Termos de serviço, privacidade e conformidade médica/veterinária.
- **Decisão:** Textos do design adotados como rascunho funcional. Revisão e validação jurídica obrigatórias antes da publicação no domínio final.

## ADR-021: Quiz Personalizado
- **Status:** Aceito
- **Contexto:** Recomendação de produtos Human e Pet.
- **Decisão:** Regras e perguntas estruturadas na onda 1 para validação e aprovação formal do gestor.

## ADR-022: Tratamento de Lacunas do Design
- **Status:** Aceito
- **Contexto:** Casos não cobertos explicitamente no layout Figma/design boards.
- **Decisão:** Detalhes de kits reaproveitam a arquitetura de páginas de produto. Variantes para gatos e cavalos adotam o layout Pet com dosagens apropriadas.

## ADR-023: Execução Concorrente de Agentes
- **Status:** Aceito
- **Contexto:** Capacidade de processamento da máquina local.
- **Decisão:** Limite de 8 agentes executando tarefas com compilação concorrente. Testes pesados de Playwright e Lighthouse executados exclusivamente no CI.

## ADR-024: Política de Integração Contínua e Aprovação
- **Status:** Aceito
- **Contexto:** Agilidade de desenvolvimento entre ondas.
- **Decisão:** Merge automático na branch main mediante sucesso de todas as etapas do CI até o lançamento. Aprovação humana direta requerida para apontamento de DNS.

## ADR-025: Gestão de DNS
- **Status:** Aceito
- **Contexto:** Virada de tráfego do domínio nadeonlabs.com.
- **Decisão:** Página provisória atual mantida até o corte final. No dia da abertura, apontamento do DNS no Cloudflare em modo DNS-only direto para a Netlify.

## Decisões do Maestro na onda 2 (14/11/2026)
- Rewards fica fora do lançamento (onda D do plano); rotas mostram só o que o contrato tem.
- Copy link, Reorder, consulta de pedido de visitante (/track estado B) e miniaturas de pedido dependem de campos novos em lib/contracts: ficam para uma tarefa de contrato antes da onda 4, não bloqueiam a rota.
- Frete grátis vem de lib/market (W1-26), nunca escrito na página.
- Board do design vale como fonte de dado quando o catálogo não tem o campo (ex.: tabela de dose dos cavalos), desde que conferido e citado no DONE.
- Defeito de componente compartilhado não reprova a rota; vira tarefa própria.
- 14/11 W2-29 (/science): revisor Grifo pediu fontes científicas para a queda de NAD+ com a idade, o transporte de NMN e os benefícios dos 4 ingredientes. Todo o texto vem do board Science e usa `<Claim>` com aviso FDA, então a rota foi aprovada pelo Maestro. A substanciação científica das alegações entra na revisão de conteúdo e jurídica do Robson antes do lançamento (ver status/W2-29/REVIEW.md).
- 14/11 W2-27 (/help): revisor Ourives apontou que "Track order" sempre responde pending e que "Send me a copy" não é enviado. Os dois dependem do contrato (não há consulta de pedido nem campo `copy` em ContactInput). Aprovada pelo Maestro; entram na tarefa de contrato antes da onda 4, junto com Copy link, Reorder e /track estado B.
- 15/11 W2-37 (MarketProvider): revisor Bússola2 mostrou que ler cookies() no app/layout.tsx torna dinâmicas 17 rotas hoje estáticas (legal, FAQ, science, 404, homes). Decisão do Maestro: o provider raiz não lê cookie no servidor (mercado do cookie aplicado no cliente após hidratação); páginas que já são dinâmicas e chamam getVisitorMarket() envolvem seu conteúdo num MarketProvider com initialMarket para o HTML inicial já sair no mercado certo.
- 15/11 revisão visual W3-06: achados sistêmicos viram W3-09 (shell duplicado), W3-10 (fonte/tema), W3-11 (imagens), W3-12 (overflow 375). Revisão visual W3-07/W3-08 adiada até essas correções. W3-11 autorizada a alterar data/products/*.json só no campo images.
- 16/11 testes (W3-41): dado sintético é permitido só em fixture de teste, declarado no próprio teste e marcado como TEST (ex.: lote "TEST-LOT-0001"); nunca em data/, lib/providers/mock nem em texto exibido no produto.

- 2026-11-16: fila permanente item 5 adiado (portal intermitente na W3-67); item 6 liberado como W3-69 para o Lente. Gemini pausados para troca de conta do Robson.
- 2026-11-16: fila item 7 adiado (next build com memória em 48%); item 8 liberado como W3-71.
- 2026-11-16: fila item 9 adiado (portal instável); item 10 liberado como W3-73 por leitura. W3-68 ampliada com 18 assets da W3-71.
- 2026-11-16: merges W3-60/W3-64 revertidos (6f147cb, 529f7a1): W3-60 quebrou excluir conta, que reusa submitPrivacyRequest. reset no main foi negado pelo classificador; usado revert.
- 2026-11-16: fila esgotada; itens 1 e 4 voltam (W3-86, W3-87) porque o main mudou desde W3-15/W3-67 (W3-68/70/72/84).
- 2026-11-16: onda 4 lançada no pipeline: W4-00/W4-00b (contrato, elegíveis com mock) e W4-01..W4-11 bloqueadas com o motivo (dependências do Robson e da Shopify real).
- 2026-11-17: onda 4 adiantada sem pré-requisitos: W4-03a, W4-06a, W4-08a (em andamento), W4-09a (depende de W4-08a). Painel do pipeline agora é estático em maestri/pipeline.html, gerado pela vigia (check-ativos.sh), independente do dev server.
- 2026-11-17: Auditor trocado de Claude para Codex/Luna (recruit --replace "Terminal" -> "Auditor"); rotina própria "Auditor vigia nadeon" [25d880] a cada 1 min com pre-run check-ativos.sh. A vigia do Maestro [cbe11e] segue apontando para Claude Code.
- 2026-11-17: skills verificadas (codex plugin list, agy plugin list): ponytail 5.3.3 e mattpocock-skills 1.3.2 ativos no Codex e no Antigravity. Construtores: ponytail full + tdd + diagnosing-bugs; revisores: ponytail-review. Seções Skills nos briefings; DONE e REVIEW registram "Skills usadas:".
- 2026-11-17: itens 12 e 4 da fila voltam (W4-16, W4-17) porque a onda 4 mudou webhooks, actions, consentimento, medição, /track e /help.
- 2026-11-17: item 13 da fila volta (W4-24): fluxos novos da onda 4 sem spec Playwright.
- 2026-11-17: itens 2 e 5 da fila voltam (W4-25) para as telas novas da onda 4.
- 2026-11-17: Robson pediu adiantar a onda 5 (Crescimento) com mocks antes do lançamento. W5-00a/W5-00b (contratos) primeiro, depois uma rota por tarefa (W5-01 a W5-22). Texto só do board; o resto To be confirmed com proposta em docs/.
- 2026-11-17: Mailyte real (Robson já tem chave e DNS). Deduplicação entre processos de webhooks (W4-23) resolvida pelo unique_id do Mailyte, sem armazenamento próprio.
- 2026-11-17: Robson decidiu trocar a Vercel pela Netlify para hospedagem (substitui ADR de deploy e a virada de DNS para a Vercel; DNS do lançamento passa a apontar para a Netlify). Netlify suporta Next >= 13.5 pelo adaptador OpenNext (App Router, Server Actions, ISR, middleware). Pendências: confirmar proxy do Next 16 e next/font/google na Netlify; remover @vercel/analytics e @vercel/speed-insights. Agent Runners da Netlify não substituem os agentes do Maestri.
- 2026-11-17: W4-29 aprovada pelo Maestro apesar do achado do Lente: menções à Vercel só no histórico do tasks.json, que não se reescreve.
- 2026-11-17: Robson vai usar Bitbucket ligado à Netlify (substitui GitHub como remoto). CI do GitHub Actions (.github/workflows/ci.yml) precisa virar bitbucket-pipelines.yml (W4-30). Agent Runners da Netlify não funcionam com Bitbucket; não são usados. Push inicial só com autorização do Robson e URL do repositório Bitbucket.
- 2026-11-17: main enviado ao Bitbucket (git@ssh.bitbucket.org:nadeon/nadeonlabs.git) com force-with-lease sobre o Initial commit d3c8cf5, a pedido do Robson (opção 2). origin = Bitbucket; github mantido como remoto secundário.
- 2026-11-17: nadeonlabs.com já aponta para a Netlify (feito pelo Robson). Site dava 404: build_settings vazios e sem adaptador Next. Corrigido pelo Maestro via API: cmd pnpm build, dir .next, plugin @netlify/plugin-nextjs; deploy 6afce14c ready (commit 3611a21). Site público com mocks antes do checklist de lançamento: decisão pendente do Robson (proteger, voltar DNS ou manter).
- 2026-11-18: /journal/[categoria] (W5-13) e /journal/[slug] (W5-14) são ambíguas no Next (mesmo nível dinâmico); build do main falhou. Decisão do Maestro: artigos em /journal/[slug], categorias em /journal/category/[categoria]. Merge da W5-14 revertido (7ffeaa4); W5-24 move a categoria e reaplica a W5-14.

## 2026-11-18 — nadeonlabs.com público antes da Shopify
Robson decidiu manter o nadeonlabs.com público com dados de teste antes do lançamento ("não tem problema ficar público"). Substitui a regra do plano de só abrir com a Shopify vendendo. Não perguntar de novo.

## 2026-11-18 — Plugin Next.js da Netlify some ao reconectar o repositório
Reconectar o repositório na Netlify apagou o plugin @netlify/plugin-nextjs. Os deploys saíram sem função de servidor e o site inteiro deu 404 (deploys de f7abf5b 04:27Z, 905dc06, 2d0672e e fe24fe5). Plugin recolocado pela API. Toda vez que mexer na ligação do repositório, conferir que o deploy tem "1 function deployed". Correção definitiva: netlify.toml com [[plugins]], que pede @netlify/plugin-nextjs nas devDependencies e depende da aprovação do Robson.
