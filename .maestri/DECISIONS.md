# Decisões Técnicas (ADRs)

## ADR-001: Existência do AGENTS.md
- **Status:** Aceito
- **Contexto:** Next.js 16.3 cria e valida AGENTS.md na raiz do repositório.
- **Decisão:** Manter o arquivo AGENTS.md gerado pelo framework e versionado no repositório.

## ADR-002: Nome do antigo middleware no Next.js 16.3
- **Status:** Aceito
- **Contexto:** Convenção de roteamento intermediário no Next.js 16.3.
- **Decisão:** O middleware foi substituído pelo proxy em proxy.ts (ou proxy.js), com função proxy executada no runtime nodejs.

## ADR-003: Integração e Deploy na Vercel
- **Status:** Aceito
- **Contexto:** Conexão contínua entre GitHub e Vercel para prévias automáticas.
- **Decisão:** Repositório nadeon-web conectado ao GitHub e ao projeto Vercel, com commits vinculados ao autor configurado.

## ADR-004: Abertura e Domínio
- **Status:** Aceito
- **Contexto:** Condição de entrada no ar do site de produção.
- **Decisão:** O domínio nadeonlabs.com só entra no ar com a Shopify integrada e apta para vendas. Até o lançamento, todo o trabalho é validado nas prévias da Vercel.

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
- **Decisão:** Página provisória atual mantida até o corte final. No dia da abertura, apontamento do DNS no Cloudflare em modo DNS-only direto para a Vercel.

## Decisões do Maestro na onda 2 (14/11/2026)
- Rewards fica fora do lançamento (onda D do plano); rotas mostram só o que o contrato tem.
- Copy link, Reorder, consulta de pedido de visitante (/track estado B) e miniaturas de pedido dependem de campos novos em lib/contracts: ficam para uma tarefa de contrato antes da onda 4, não bloqueiam a rota.
- Frete grátis vem de lib/market (W1-26), nunca escrito na página.
- Board do design vale como fonte de dado quando o catálogo não tem o campo (ex.: tabela de dose dos cavalos), desde que conferido e citado no DONE.
- Defeito de componente compartilhado não reprova a rota; vira tarefa própria.
- 14/11 W2-29 (/science): revisor Grifo pediu fontes científicas para a queda de NAD+ com a idade, o transporte de NMN e os benefícios dos 4 ingredientes. Todo o texto vem do board Science e usa `<Claim>` com aviso FDA, então a rota foi aprovada pelo Maestro. A substanciação científica das alegações entra na revisão de conteúdo e jurídica do Robson antes do lançamento (ver status/W2-29/REVIEW.md).
- 14/11 W2-27 (/help): revisor Ourives apontou que "Track order" sempre responde pending e que "Send me a copy" não é enviado. Os dois dependem do contrato (não há consulta de pedido nem campo `copy` em ContactInput). Aprovada pelo Maestro; entram na tarefa de contrato antes da onda 4, junto com Copy link, Reorder e /track estado B.
