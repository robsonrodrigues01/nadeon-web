# Pendências por Rota para o Robson

Este documento consolida o mapeamento das pendências de conteúdo, dados, preços, imagens e aprovações nas 63 rotas ativas do site Nadeon.

Para cada rota, o relatório apresenta:

- **(a) Dados pendentes:** Textos, preços, imagens ou atributos marcados como `To be confirmed` ou dependentes de dados de exemplo, com referência `arquivo:linha`.
- **(b) Proposta de referência:** Documento em `docs/*-proposta.md` com ideias de formato, texto e regras. Todas as propostas aguardam aprovação do Robson e não são regras aprovadas.
- **(c) Insumos e decisões necessárias:** Definições do Robson, como textos aprovados no board, fotografias, imagens tridimensionais, preços, códigos de produto na Shopify, políticas jurídicas e aprovação de alegações.

Ao final, apresenta-se uma **lista única priorizada** com as decisões transversais que destravam o maior número de rotas simultaneamente.

---

## 1. Rota `/` (Home de Entrada / Gateway)

- **Página:** `app/(shared)/page.tsx`
- **(a) Dados pendentes no código:** Nenhum texto `To be confirmed` fixo no código. A página consome produtos e banners via `catalogProvider` e `contentProvider`.
- **(b) Proposta de referência:** Nenhuma proposta isolada; implementa o board de entrada desktop e mobile.
- **(c) Decisão ou insumo do Robson:** Imagens tridimensionais finais dos produtos Human e Pet para os cards de destaque e a composição dividida do topo; códigos reais dos produtos principais na Shopify.

---

## 2. Rota `/about` (Sobre a Nadeon)

- **Página:** `app/(shared)/about/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`. Cópias históricas e valores da marca implementados com base no board.
- **(b) Proposta de referência:** Nenhuma pendência de proposta editorial.
- **(c) Decisão ou insumo do Robson:** Validação jurídica das alegações institucionais de pureza e qualidade dos processos laboratoriais.

---

## 3. Rota `/account` (Dashboard do Cliente)

- **Página:** `app/(account)/account/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed` no arquivo da página. Consome dados de cliente e resumo de pedidos via `accountProvider`.
- **(b) Proposta de referência:** `docs/account-retention-proposta.md` e contratos de conta em `lib/contracts/account.ts`.
- **(c) Decisão ou insumo do Robson:** Nenhuma pendência adicional de login; essa decisão já está encerrada no plano v3.

---

## 4. Rota `/account/email-preferences` (Preferências de E-mail)

- **Página:** `app/(account)/account/email-preferences/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(account)/account/email-preferences/_components/actions.ts:47, 80`: Mensagens de retorno da ação de formulário (`message: "To be confirmed"`).
  - `app/(account)/account/email-preferences/_components/email-preferences-form.tsx:18, 42`: Descrições de categorias de comunicação (`description: "To be confirmed"`).
  - `app/(account)/account/email-preferences/_components/email-preferences-form.tsx:83`: Prazo de descadastramento total (`take up to To be confirmed to stop completely`).
  - `app/(account)/account/email-preferences/_components/email-preferences-form.tsx:183`: Dias de aviso prévio de cobrança de assinatura (`A heads-up To be confirmed days before each delivery`).
  - `app/(account)/account/email-preferences/_components/email-preferences-form.tsx:234`: Prazo de efetivação de alterações (`Changes apply within To be confirmed`).
  - `app/(account)/account/email-preferences/_components/email-preferences-form.tsx:287`: Frequência de resumo semanal/mensal (`<option value="">To be confirmed</option>`).
- **(b) Proposta de referência:** Nenhuma proposta específica de preferências de e-mail foi localizada.
- **(c) Decisão ou insumo do Robson:** Definir as descrições e os prazos operacionais de comunicação e descadastro. Nenhum prazo é assumido neste documento.

---

## 5. Rota `/account/orders` (Histórico de Pedidos)

- **Página:** `app/(account)/account/orders/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`. Utiliza contrato `AccountProvider.getOrders()`.
- **(b) Proposta de referência:** Contratos em `lib/contracts/account.ts`.
- **(c) Decisão ou insumo do Robson:** Conexão com os pedidos reais na Shopify e links de rastreio de transportadoras integradas.

---

## 6. Rota `/account/orders/[id]` (Detalhe do Pedido)

- **Página:** `app/(account)/account/orders/[id]/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`.
- **(b) Proposta de referência:** Contratos em `lib/contracts/account.ts`.
- **(c) Decisão ou insumo do Robson:** Definição das URLs de rastreamento das transportadoras parceiras e política de reenvio.

---

## 7. Rota `/account/pets` (Gerenciamento de Pets)

- **Página:** `app/(account)/account/pets/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(account)/account/pets/page.tsx:68`: Texto de recomendações de produtos no cabeçalho (`Recommendations: To be confirmed`).
  - `app/(account)/account/pets/_components/actions.ts:47`: Mensagem de confirmação de cadastro (`message: "To be confirmed"`).
  - `app/(account)/account/pets/_components/pet-profile-manager.tsx:122`: Opção vazia de nível de atividade (`To be confirmed`).
  - `app/(account)/account/pets/_components/pet-profile-manager.tsx:130, 134`: Texto da foto e opção de foco de saúde (`To be confirmed`).
  - `app/(account)/account/pets/_components/pet-profile-manager.tsx:179`: Opção alternativa quando falta o nível de atividade.
  - `app/(account)/account/pets/_components/pet-profile-manager.tsx:194`: Identificação da foto no cartão do pet (`Photo: To be confirmed`).
  - `app/(account)/account/pets/_components/pet-profile-manager.tsx:202, 209, 216`: Valores de raça, peso e idade quando não estão disponíveis.
  - `app/(account)/account/pets/_components/pet-profile-manager.tsx:251, 279`: Texto auxiliar do link para adicionar pet e mensagem de recomendações ainda pendente.
- **(b) Proposta de referência:** `docs/account-pets-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Aprovação veterinária de qualquer recomendação de dose e decisão sobre armazenamento de fotos.

---

## 8. Rota `/account/settings` (Configurações da Conta)

- **Página:** `app/(account)/account/settings/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`. Formulários de endereço e dados pessoais conectados a dados de exemplo.
- **(b) Proposta de referência:** `docs/account-retention-proposta.md` e `lib/contracts/account.ts`.
- **(c) Decisão ou insumo do Robson:** Validação do fluxo de exclusão definitiva conforme a Lei Geral de Proteção de Dados (LGPD) e a Lei de Privacidade do Consumidor da Califórnia (CCPA, sigla em inglês).

---

## 9. Rota `/account/subscriptions` (Assinaturas Ativas)

- **Página:** `app/(account)/account/subscriptions/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`.
- **(b) Proposta de referência:** `docs/account-retention-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Nenhuma decisão pendente sobre o serviço de assinaturas; o plano v3 já define Shopify Subscriptions.

---

## 10. Rota `/account/subscriptions/[id]/cancel` (Fluxo de Cancelamento)

- **Página:** `app/(account)/account/subscriptions/[id]/cancel/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed` fixo no arquivo.
- **(b) Proposta de referência:** `docs/account-retention-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Aprovação das opções de retenção de clientes (pular entrega, alterar ciclo para 60 dias ou pausar temporariamente). A oferta de desconto foi descartada pelo plano v3.

---

## 11. Rota `/affiliates` (Programa de Afiliados e Criadores)

- **Página:** `app/(shared)/affiliates/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(shared)/affiliates/page.tsx:45, 63`: Metadados e introdução (`Program details: To be confirmed`).
  - `app/(shared)/affiliates/page.tsx:87`: Faixas percentuais de comissão dos criadores (`To be confirmed`).
  - `app/(shared)/affiliates/page.tsx:147`: Política de produtos gratuitos para teste (`To be confirmed`).
  - `app/(shared)/affiliates/page.tsx:168`: Requisitos mínimos de seguidores e prazo de análise (`To be confirmed`).
  - `app/(shared)/affiliates/page.tsx:190`: Termos do programa e diretrizes de conteúdo (`To be confirmed`).
  - `app/(shared)/affiliates/page.tsx:210, 218`: Respostas das perguntas frequentes e canal de dúvidas (`To be confirmed`).
  - `app/(shared)/affiliates/_components/affiliate-application-form.tsx:36, 44`: Exemplos de redes e nicho (`placeholder="To be confirmed"`).
  - `app/(shared)/affiliates/_components/affiliate-application-form.tsx:103, 112, 131`: Checkbox de diretrizes e mensagem de confirmação (`To be confirmed`).
- **(b) Proposta de referência:** `docs/affiliates-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Aprovar a proposta de comissão e definir a plataforma de rastreamento e as regras de publicidade aplicáveis. As condições propostas ainda aguardam aprovação.

---

## 12. Rota `/cart` (Carrinho de Compras)

- **Página:** `app/(shared)/cart/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`. Preços e itens derivados do `catalogProvider` e `cartProvider`.
- **(b) Proposta de referência:** Regras de frete em `lib/market/shipping.ts`.
- **(c) Decisão ou insumo do Robson:** Aprovar os limites propostos para frete grátis por mercado. Os valores atuais no código ainda aguardam confirmação.

---

## 13. Rota `/courses/[curso]` (Cursos Gratuitos por E-mail)

- **Página:** `app/(shared)/courses/[curso]/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(shared)/courses/[curso]/page.tsx:28`: Descrição nos metadados da rota (`description: "To be confirmed"`).
  - `app/(shared)/courses/[curso]/actions.ts:40, 49, 50, 52`: Mensagens de retorno da inscrição (`message: "To be confirmed"`).
- **(b) Proposta de referência:** `docs/courses-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Fornecer os textos completos das lições de e-mail e integrar listas do Klaviyo ou Mailyte.

---

## 14. Rota `/dev/kit` (Workbench Interno de UI)

- **Página:** `app/(shared)/dev/kit/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`. Rota interna para verificação de tokens e componentes.
- **(b) Proposta de referência:** `docs/design-audit.md`.
- **(c) Decisão ou insumo do Robson:** Nenhuma pendência; rota restrita ao ambiente de desenvolvimento.

---

## 15. Rota `/experts` (Comitê Científico e Especialistas)

- **Página:** `app/(shared)/experts/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(shared)/experts/page.tsx:9`: Descrição nos metadados (`description: "To be confirmed"`).
  - `app/(shared)/experts/page.tsx:86`: Texto institucional do painel consultivo (`To be confirmed`).
  - `app/(shared)/experts/page.tsx:118`: Descrição da etapa 4 do processo de revisão (`To be confirmed`).
  - `app/(shared)/experts/page.tsx:164`: Critérios de seleção de especialistas (`To be confirmed`).
  - `app/(shared)/experts/page.tsx:219`: Política de remuneração e independência dos pareceristas (`To be confirmed`).
  - `app/(shared)/experts/page.tsx:238, 252`: Respostas das perguntas frequentes e texto de contato (`To be confirmed`).
- **(b) Proposta de referência:** `docs/experts-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Nomes reais, fotos em alta resolução, mini-biografias e credenciais médicas ou veterinárias dos membros do conselho.

---

## 16. Rota `/faq` (Perguntas Frequentes)

- **Página:** `app/(shared)/faq/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed` no arquivo da página. Consome dados de `contentProvider`.
- **(b) Proposta de referência:** `docs/faq-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Aprovação das respostas propostas em `docs/faq-proposta.md` para as perguntas que não constavam no board de design.

---

## 17. Rota `/gift-card` (Vale-Presente Digital)

- **Página:** `app/(shared)/gift-card/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(shared)/gift-card/page.tsx:19, 72`: Metadados e nota legal de expiração (`To be confirmed`).
  - `app/(shared)/gift-card/_components/gift-card-purchase-form.tsx:83, 93, 106`: Instruções de envio, data e mensagem (`To be confirmed`).
  - `app/(shared)/gift-card/_components/gift-card-purchase-form.tsx:234, 446`: Validação de entrega e termos de uso (`To be confirmed`).
  - `app/(shared)/gift-card/_components/gift-card-faq.tsx:21, 33, 37, 41, 45`: Respostas sobre recarga, expiração, devolução e uso entre mercados (`To be confirmed`).
- **(b) Proposta de referência:** `docs/gift-card-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Aprovar os valores nominais propostos, as artes dos designs e o cadastro do cartão-presente na Shopify. Nenhum valor da proposta está aprovado.

---

## 18. Rota `/help` (Central de Ajuda e Contato)

- **Página:** `app/(shared)/help/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`. Formulários de contato e suporte usam dados de exemplo.
- **(b) Proposta de referência:** `docs/faq-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Definir o e-mail oficial de suporte e o horário de atendimento. Ambos ainda são pendências.

---

## 19. Rota `/human` (Página Inicial Human)

- **Página:** `app/(human)/human/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed` na rota.
- **(b) Proposta de referência:** Proposta de conteúdo geral em `docs/w5-00a-content-proposals.md`.
- **(c) Decisão ou insumo do Robson:** Imagens tridimensionais das fórmulas Human (Global Longevity e Prime) e aprovação jurídica das alegações sobre dinucleotídeo de nicotinamida e adenina (NAD+).

---

## 20. Rota `/human/build-your-box` (Montagem de Caixa Human)

- **Página:** `app/(human)/human/build-your-box/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`. Lógica de cálculo de economia baseada no catálogo.
- **(b) Proposta de referência:** Contratos de bundles em `lib/contracts/catalog.ts`.
- **(c) Decisão ou insumo do Robson:** Definir e aprovar as regras de desconto por quantidade de itens no box. Os exemplos da proposta não são regras aprovadas.

---

## 21. Rota `/human/compare` (Comparador de Fórmulas Human)

- **Página:** `app/(human)/human/compare/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(human)/human/compare/page.tsx:9`: Metadados (`To be confirmed`).
  - `app/(human)/human/compare/_components/compare-formulas.tsx:46, 49`: Alegações de benefícios não mapeados (`To be confirmed`).
  - `app/(human)/human/compare/_components/compare-formulas.tsx:56, 60, 64`: Dados comparativos de absorção e rotina (`To be confirmed`).
  - `app/(human)/human/compare/_components/compare-formulas.tsx:112, 117, 122, 127, 132, 137`: Especificações técnicas por linha da tabela (`To be confirmed`).
  - `app/(human)/human/compare/_components/compare-formulas.tsx:185, 237`: Destaques de pureza e dosagem (`To be confirmed`).
- **(b) Proposta de referência:** `docs/human-compare-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Aprovação da tabela comparativa entre dinucleotídeo de nicotinamida e adenina (NAD+) Global e NAD+ Prime (ingredientes ativos, quantidades por dose e rotina proposta).

---

## 22. Rota `/human/kits` (Coleção de Kits Human)

- **Página:** `app/(human)/human/kits/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`.
- **(b) Proposta de referência:** Contratos de catálogo em `lib/contracts/catalog.ts`.
- **(c) Decisão ou insumo do Robson:** Renders dos kits com embalagem agrupada e precificação com desconto em relação aos itens avulsos.

---

## 23. Rota `/human/kits/[slug]` (Página de Detalhe do Kit Human)

- **Página:** `app/(human)/human/kits/[slug]/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`.
- **(b) Proposta de referência:** Contratos de catálogo em `lib/contracts/catalog.ts`.
- **(c) Decisão ou insumo do Robson:** Criação dos produtos compostos (bundles) na Shopify para permitir adição direta ao carrinho.

---

## 24. Rota `/human/products/[slug]` (Página de Produto Human)

- **Página:** `app/(human)/human/products/[slug]/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`. Cópias e abas de ciência estruturadas via catálogo.
- **(b) Proposta de referência:** `docs/shopify-handles.md`.
- **(c) Decisão ou insumo do Robson:** Imagens tridimensionais das variantes de tamanho e frasco, além de lotes e laudos reais para a primeira remessa.

---

## 25. Rota `/human/quiz` (Quiz de Recomendação Human)

- **Página:** `app/(human)/human/quiz/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`.
- **(b) Proposta de referência:** `docs/quiz-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Validação médica das perguntas sobre sono, energia e cognição e regras de recomendação de produtos.

---

## 26. Rota `/human/shop` (Catálogo Completo Human)

- **Página:** `app/(human)/human/shop/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`.
- **(b) Proposta de referência:** Contratos de catálogo em `lib/contracts/catalog.ts`.
- **(c) Decisão ou insumo do Robson:** Renders em formato isolado (recorte transparente) para os cards de produto da grade.

---

## 27. Rota `/human/shop/[format]` (Catálogo por Formato Human)

- **Página:** `app/(human)/human/shop/[format]/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`.
- **(b) Proposta de referência:** Contratos de catálogo em `lib/contracts/catalog.ts`.
- **(c) Decisão ou insumo do Robson:** Confirmação dos formatos disponíveis na linha Human (cápsulas, pó ou líquido).

---

## 28. Rota `/human/subscribe` (Vantagens da Assinatura Human)

- **Página:** `app/(human)/human/subscribe/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`.
- **(b) Proposta de referência:** `docs/shipping-returns-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Aprovar o percentual de desconto permanente da assinatura e os brindes do primeiro pedido; os valores mostrados no design ainda não foram aprovados.

---

## 29. Rota `/ingredients` (Glossário de Ingredientes)

- **Página:** `app/(shared)/ingredients/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(shared)/ingredients/page.tsx:10, 39`: Metadados e introdução (`To be confirmed`).
  - `app/(shared)/ingredients/_components/ingredient-glossary.tsx:44`: Forma química e padrão de pureza (`To be confirmed`).
  - `app/(shared)/ingredients/_components/ingredient-glossary.tsx:109`: Miligramagem clínica por dose (`To be confirmed`).
  - `app/(shared)/ingredients/_components/ingredient-glossary.tsx:173, 184`: Sinônimos científicos e referências de absorção (`To be confirmed`).
  - `app/(shared)/ingredients/_components/ingredient-glossary.tsx:197, 210, 223`: Citações de estudos clínicos e nomes de pesquisadores (`To be confirmed`).
  - `app/(shared)/ingredients/_components/ingredient-glossary.tsx:236, 267`: Mecanismo de ação no organismo de cada composto (`To be confirmed`).
- **(b) Proposta de referência:** `docs/ingredients-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Revisão científica e jurídica dos compostos listados, incluindo mononucleotídeo de nicotinamida (NMN) e trimetilglicina (TMG), além de resveratrol, quercetina, fisetina e apigenina, e das dosagens declaradas.

---

## 30. Rota `/journal` (Blog e Artigos)

- **Página:** `app/(shared)/journal/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(shared)/journal/page.tsx:8`: Descrição nos metadados (`description: "To be confirmed"`).
  - `data/content.json:64-75`, artigo `why-nad-declines-in-senior-dogs-and-what-you-can-do`: os campos `reviewer`, `publishedAt`, `updatedAt` e `sections[].body` estão como `To be confirmed`; `sections[].title` contém títulos também pendentes. O tempo está no campo `readingMinutes` (linha 62), não nas linhas 226 ou 256 do navegador.
  - `app/(shared)/journal/_components/journal-browser.tsx:198-200, 207-211`: o cartão mostra `readingMinutes`, `title` e `excerpt`; as linhas 226 e 256 são, respectivamente, o estado sem resultados e o título de guias de raças.
- **(b) Proposta de referência:** `docs/journal-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Textos completos dos primeiros artigos editoriais, identificação do revisor, datas e fotos de capa autorizadas.

---

## 31. Rota `/journal/[categoria]` (Artigos por Categoria)

- **Página:** `app/(shared)/journal/[categoria]/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(shared)/journal/[categoria]/page.tsx:23`: Descrição da categoria nos metadados (`To be confirmed`).
- **(b) Proposta de referência:** `docs/journal-category-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Definição das taxonomias finais de artigos (Longevity Science, Daily Routine, Pet Health).

---

## 32. Rota `/lab-results` (Resultados de Testes e Pureza)

- **Página:** `app/(shared)/lab-results/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed` no arquivo da rota; busca desabilitada no lançamento exibindo mensagem informativa de que os primeiros lotes serão publicados em breve.
- **(b) Proposta de referência:** `docs/contracts.md` (seção LabsProvider).
- **(c) Decisão ou insumo do Robson:** Certificados de análise reais emitidos por laboratório independente, com números de lote e teores de pureza.

---

## 33. Rota `/legal/accessibility` (Declaração de Acessibilidade)

- **Página:** `app/(shared)/legal/accessibility/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(shared)/legal/accessibility/_components/feedback-form.tsx:88`: Prazo de resposta ao formulário (`To be confirmed`).
  - `app/(shared)/legal/accessibility/_components/accessibility-content.tsx:69, 73`: Datas de atualização e última auditoria (`To be confirmed`).
  - `app/(shared)/legal/accessibility/_components/accessibility-content.tsx:220, 248`: Contato de e-mail e telefone de suporte (`To be confirmed`).
  - `app/(shared)/legal/accessibility/_components/accessibility-content.tsx:423, 442, 461`: Versões das tecnologias assistivas e sistemas operacionais homologados (`To be confirmed`).
  - `app/(shared)/legal/accessibility/_components/accessibility-content.tsx:512, 534, 555, 597`: Cronograma de correção de limitações e contatos dos responsáveis técnicos (`To be confirmed`).
- **(b) Proposta de referência:** `docs/legal-accessibility-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Informar o e-mail e telefone reais de acessibilidade; os contatos exibidos no código são placeholders. Aprovar a meta das Diretrizes de Acessibilidade para Conteúdo Web 2.1, nível AA (WCAG 2.1 AA).

---

## 34. Rota `/legal/do-not-sell` (Privacidade e Não Venda de Dados)

- **Página:** `app/(shared)/legal/do-not-sell/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(shared)/legal/do-not-sell/_components/do-not-sell-content.tsx:64`: Data de vigência da política (`To be confirmed`).
  - `app/(shared)/legal/do-not-sell/_components/do-not-sell-content.tsx:117, 122, 123, 130`: Endereço postal e telefone gratuito para solicitações (`To be confirmed`).
  - `app/(shared)/legal/do-not-sell/_components/do-not-sell-content.tsx:175, 186`: Prazos de resposta para confirmação e conclusão sob a Lei de Privacidade do Consumidor da Califórnia (CCPA, sigla em inglês) e a Lei de Direitos de Privacidade da Califórnia (CPRA, sigla em inglês), ambos `To be confirmed`.
  - `app/(shared)/legal/do-not-sell/_components/privacy-form.tsx:207, 221, 236, 251`: Protocolo de registro e remetente de e-mail de verificação (`To be confirmed`).
  - `app/(shared)/legal/do-not-sell/_components/privacy-form.tsx:553, 568`: Prazo de validação de documentos de agente autorizado (`To be confirmed`).
- **(b) Proposta de referência:** `docs/legal-do-not-sell-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Dados cadastrais da empresa nos EUA, incluindo endereço postal e telefone gratuito para solicitações da Califórnia. Os valores exibidos são exemplos provisórios, não contatos confirmados.

---

## 35. Rota `/legal/privacy` (Política de Privacidade)

- **Página:** `app/(shared)/legal/privacy/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(shared)/legal/privacy/_components/privacy-content.tsx:92, 93, 94`: Data de vigência, versão e data de última atualização (`To be confirmed`).
  - `app/(shared)/legal/privacy/_components/privacy-content.tsx:438`: Telefone do encarregado de proteção de dados (`To be confirmed`).
  - `app/(shared)/legal/privacy/_components/privacy-content.tsx:561`: E-mail oficial de privacidade (`To be confirmed`).
- **(b) Proposta de referência:** `docs/legal-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Revisão jurídica dos dados da empresa e definição do e-mail institucional de privacidade. O endereço exibido é um exemplo provisório.

---

## 36. Rota `/legal/terms` (Termos de Serviço)

- **Página:** `app/(shared)/legal/terms/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(shared)/legal/terms/_components/terms-content.tsx:105, 106, 107`: Data de vigência, versão e atualização dos termos (`To be confirmed`).
  - `app/(shared)/legal/terms/_components/terms-content.tsx:868, 926`: E-mail do departamento jurídico e foro de arbitragem/jurisdição (`To be confirmed`).
- **(b) Proposta de referência:** `docs/legal-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Revisão jurídica por advogado com experiência em comércio eletrônico nos EUA e definição da jurisdição aplicável.

---

## 37. Rota `/lp/[campanha]` (Landing Pages Promocionais)

- **Página:** `app/(campaign)/lp/[campanha]/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(campaign)/lp/[campanha]/page.tsx:13, 36`: Título e descrição da oferta nos metadados (`To be confirmed`).
  - `app/(campaign)/lp/[campanha]/page.tsx:82, 83`: Termos da campanha e datas de início/fim (`To be confirmed`).
  - `app/(campaign)/lp/[campanha]/page.tsx:118, 126, 134, 142`: Percentual de desconto e regras de cupom promocional (`To be confirmed`).
  - `app/(campaign)/lp/[campanha]/page.tsx:156, 169, 182, 195`: Produtos participantes e brindes associados (`To be confirmed`).
  - `app/(campaign)/lp/[campanha]/page.tsx:210, 225, 240`: Limitações por cliente e exclusões (`To be confirmed`).
- **(b) Proposta de referência:** `docs/lp-campanha-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Definição das campanhas de lançamento (nomes, descontos, produtos vinculados e datas de vigência na Shopify).

---

## 38. Rota `/offers/[oferta]` (Página de Coleção Promocional)

- **Página:** `app/(shared)/offers/[oferta]/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(shared)/offers/[oferta]/page.tsx:17, 40, 41, 47`: Metadados e título promocional (`To be confirmed`).
  - `app/(shared)/offers/[oferta]/page.tsx:112, 118, 124, 130`: Cronômetro/contagem regressiva e badges de desconto (`To be confirmed`).
  - `app/(shared)/offers/[oferta]/page.tsx:154, 162, 170`: Quantidade de estoque e limite por pedido (`To be confirmed`).
  - `app/(shared)/offers/[oferta]/page.tsx:205, 218, 231`: Termos legais da promoção e condições de devolução (`To be confirmed`).
  - `app/(shared)/offers/[oferta]/page.tsx:255, 268`: Condições de frete grátis da campanha (`To be confirmed`).
- **(b) Proposta de referência:** `docs/offers-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Cadastro das coleções promocionais na Shopify com cupons correspondentes.

---

## 39. Rota `/pet` (Página Inicial Pet)

- **Página:** `app/(pet)/pet/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed` fixo no arquivo da rota.
- **(b) Proposta de referência:** `docs/w5-00a-content-proposals.md`.
- **(c) Decisão ou insumo do Robson:** Imagens tridimensionais das fórmulas Pet (mastigáveis e óleos para cães, gatos e equinos), fotografias dos animais e selos veterinários.

---

## 40. Rota `/pet/benefit/[beneficio]` (Página de Benefício Pet)

- **Página:** `app/(pet)/pet/benefit/[beneficio]/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(pet)/pet/benefit/[beneficio]/page.tsx:13, 21`: Metadados (`To be confirmed`).
  - `app/(pet)/pet/benefit/[beneficio]/page.tsx:69, 87, 94`: Citações de revisão veterinária e estudos clínicos (`To be confirmed`).
  - `app/(pet)/pet/benefit/[beneficio]/page.tsx:112, 128, 144, 160`: Dosagens recomendadas por porte e tempo para primeiros efeitos (`To be confirmed`).
  - `app/(pet)/pet/benefit/[beneficio]/page.tsx:185, 202, 219`: Estatísticas percentuais de melhora e relatos de tutores (`To be confirmed`).
  - `app/(pet)/pet/benefit/[beneficio]/page.tsx:245, 262, 280`: Perguntas frequentes sobre cada benefício (articulações, energia, pelagem, cognição) (`To be confirmed`).
- **(b) Proposta de referência:** `docs/pet-benefit-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Revisão veterinária das afirmações de benefício e dos prazos propostos; nenhum prazo é tratado como aprovado.

---

## 41. Rota `/pet/breeds` (Índice de Raças Pet)

- **Página:** `app/(pet)/pet/breeds/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(pet)/pet/breeds/page.tsx:12, 72`: Metadados e introdução (`To be confirmed`).
  - `app/(pet)/pet/breeds/_components/breed-browser.tsx:119`: Texto de ajuda da busca (`To be confirmed`).
  - `app/(pet)/pet/breeds/_components/breed-browser.tsx:246, 247, 248`: Expectativa de vida média, peso típico e sensibilidades comuns (`To be confirmed`).
  - `app/(pet)/pet/breeds/_components/breed-browser.tsx:281, 295`: Informações de dosagem preventiva (`To be confirmed`).
- **(b) Proposta de referência:** `docs/pet-breeds-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Fotos reais/vetores ilustrativos de cada raça e confirmação dos dados zootécnicos pelo comitê veterinário.

---

## 42. Rota `/pet/breeds/[raca]` (Guia de Cuidados da Raça)

- **Página:** `app/(pet)/pet/breeds/[raca]/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(pet)/pet/breeds/[raca]/page.tsx:38`: Metadados da raça (`description: "To be confirmed"`).
  - `app/(pet)/pet/breeds/[raca]/page.tsx:113, 127, 141, 143`: Nome do veterinário revisor e datas (`To be confirmed`).
  - `app/(pet)/pet/breeds/[raca]/page.tsx:185, 210, 235`: Faixas de peso exatas e rotinas de exercício recomendadas (`To be confirmed`).
  - `app/(pet)/pet/breeds/[raca]/page.tsx:280, 310, 345`: Sintomas de envelhecimento precoce e recomendações clínicas (`To be confirmed`).
  - `app/(pet)/pet/breeds/[raca]/page.tsx:390, 420, 455`: Tabela de suporte nutricional por fase da vida (`To be confirmed`).
  - `app/(pet)/pet/breeds/[raca]/_components/guide-faq.tsx:13, 17, 21, 25`: Respostas específicas sobre a predisposição genética da raça (`To be confirmed`).
- **(b) Proposta de referência:** `docs/pet-breed-guide-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Revisão técnica veterinária assinada para cada guia de raça (atendendo à restrição de não publicar orientação clínica sem comprovação).

---

## 43. Rota `/pet/build-your-box` (Montagem de Caixa Pet)

- **Página:** `app/(pet)/pet/build-your-box/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`.
- **(b) Proposta de referência:** Contratos em `lib/contracts/catalog.ts`.
- **(c) Decisão ou insumo do Robson:** Regras de combinação permitida entre produtos para cães, gatos e equinos no mesmo box.

---

## 44. Rota `/pet/cats` (Linha Felinos)

- **Página:** `app/(pet)/pet/cats/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`.
- **(b) Proposta de referência:** `docs/w5-00a-content-proposals.md`.
- **(c) Decisão ou insumo do Robson:** Imagem tridimensional do óleo de salmão para gatos e definição dos palatabilizantes utilizados.

---

## 45. Rota `/pet/concern/[problema]` (Página de Queixa Pet)

- **Página:** `app/(pet)/pet/concern/[problema]/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(pet)/pet/concern/[problema]/page.tsx:20, 21`: Metadados (`To be confirmed`).
  - `app/(pet)/pet/concern/[problema]/page.tsx:100, 115, 118`: Nomes de veterinários pareceristas e estudos clínicos (`To be confirmed`).
  - `app/(pet)/pet/concern/[problema]/page.tsx:142, 160, 178`: Orientações de conduta para tutores e sinais de alerta (`To be confirmed`).
  - `app/(pet)/pet/concern/[problema]/page.tsx:210, 230, 250`: Casos de estudo e porcentagens de melhora (`To be confirmed`).
  - `app/(pet)/pet/concern/[problema]/_components/concern-filters.tsx:27, 41`: Filtros de severidade e idade (`To be confirmed`).
  - `app/(pet)/pet/concern/[problema]/_components/concern-product-card.tsx:27`: Justificativa clínica da recomendação do kit (`To be confirmed`).
- **(b) Proposta de referência:** `docs/pet-concern-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Validação veterinária das recomendações para problemas de articulação (Joints), estresse (Calm), pele/pelagem (Skin & Coat) e digestão (Gut).

---

## 46. Rota `/pet/dogs` (Linha Cães)

- **Página:** `app/(pet)/pet/dogs/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`.
- **(b) Proposta de referência:** `docs/w5-00a-content-proposals.md`.
- **(c) Decisão ou insumo do Robson:** Imagens tridimensionais dos mastigáveis sabor bacon e fígado nos três portes de cão.

---

## 47. Rota `/pet/dose-calculator` (Calculadora de Dose Pet)

- **Página:** `app/(pet)/pet/dose-calculator/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`. Lógica matemática de peso vs miligramas implementada em `lib/dosing/calculator.ts`.
- **(b) Proposta de referência:** Valores atuais da tabela de dosagem em `lib/contracts/catalog.ts`; a aprovação veterinária permanece pendente.
- **(c) Decisão ou insumo do Robson:** Assinatura formal do médico veterinário responsável pela fórmula de dosagem por quilo/libra.

---

## 48. Rota `/pet/horses` (Linha Equinos)

- **Página:** `app/(pet)/pet/horses/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`. Aviso regulatório equino obrigatório implementado conforme Regra 8.
- **(b) Proposta de referência:** `docs/w5-00a-content-proposals.md`.
- **(c) Decisão ou insumo do Robson:** Renders do pote de 1 kg para cavalos e fotos de haras ou cavalos de alta performance.

---

## 49. Rota `/pet/journal` (Journal Pet)

- **Página:** `app/(pet)/pet/journal/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(pet)/pet/journal/page.tsx:8`: Descrição nos metadados (`description: "To be confirmed"`).
  - `data/content.json:61-75`, artigo `why-nad-declines-in-senior-dogs-and-what-you-can-do`: o campo `excerpt` termina em asterisco; `reviewer`, `publishedAt`, `updatedAt` e `sections[].body` são `To be confirmed`.
- **(b) Proposta de referência:** `docs/journal-proposta.md`; qualquer texto sugerido aguarda aprovação.
- **(c) Decisão ou insumo do Robson:** Confirmar o tratamento do aviso da Food and Drug Administration (FDA): a proposta, ainda pendente de confirmação do responsável, é exibir o aviso uma vez perto do título em cada artigo do Journal Pet. O campo de resumo (`excerpt`) termina em asterisco e o cartão o mostra em `app/(shared)/journal/_components/journal-browser.tsx:210-211`. Os corpos ainda são placeholders; completar os artigos e obter revisão veterinária antes da publicação.

---

## 50. Rota `/pet/kits` (Coleção de Kits Pet)

- **Página:** `app/(pet)/pet/kits/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`.
- **(b) Proposta de referência:** Contratos em `lib/contracts/catalog.ts`.
- **(c) Decisão ou insumo do Robson:** Renders das caixas de kits combinados (Daily Chew + Salmon Oil).

---

## 51. Rota `/pet/kits/[slug]` (Página de Detalhe do Kit Pet)

- **Página:** `app/(pet)/pet/kits/[slug]/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`.
- **(b) Proposta de referência:** Contratos em `lib/contracts/catalog.ts`.
- **(c) Decisão ou insumo do Robson:** Cadastro dos kits Pet como produtos compostos na Shopify.

---

## 52. Rota `/pet/products/[slug]` (Página de Produto Pet)

- **Página:** `app/(pet)/pet/products/[slug]/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`.
- **(b) Proposta de referência:** `docs/shopify-handles.md`.
- **(c) Decisão ou insumo do Robson:** Renders dos frascos e potes Pet (3 tamanhos de chews, 2 tamanhos de óleo) e tabela de níveis de garantia nutricional do rótulo.

---

## 53. Rota `/pet/quiz` (Quiz de Recomendação Pet)

- **Página:** `app/(pet)/pet/quiz/page.tsx`
- **(a) Dados pendentes no código:**
  - `components/commerce/quiz/quiz-result-pet.tsx:44, 46`: Nomes e idades ausentes (`To be confirmed`).
  - `components/commerce/quiz/quiz-result-pet.tsx:124, 135`: Preço individual de produtos e valor total do kit (`To be confirmed`).
  - `components/commerce/quiz/quiz-result-pet.tsx:151, 172, 190`: Formatos de apresentação e doses sugeridas (`To be confirmed`).
  - `components/commerce/quiz/quiz-result-pet.tsx:210, 245, 280`: Mensagens personalizadas de benefício e rotina matinal/noturna (`To be confirmed`).
  - `components/commerce/quiz/quiz-result-pet.tsx:320, 360, 410`: Valores de economia anual e incentivos de assinatura (`To be confirmed`).
- **(b) Proposta de referência:** `docs/quiz-pet-result-proposta.md` e `docs/quiz-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Aprovação das regras de recomendação do resultado Pet (combinação de suplementos por idade, espécie e nível de atividade física).

---

## 54. Rota `/pet/subscribe` (Vantagens da Assinatura Pet)

- **Página:** `app/(pet)/pet/subscribe/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`.
- **(b) Proposta de referência:** `docs/shipping-returns-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Definir e aprovar eventuais benefícios adicionais para assinantes Pet; exemplos de proposta não são compromissos aprovados.

---

## 55. Rota `/professionals` (Programa para Médicos e Veterinários)

- **Página:** `app/(shared)/professionals/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(shared)/professionals/page.tsx:55`: Descrição do programa nos metadados (`Program details: To be confirmed`).
  - `app/(shared)/professionals/page.tsx:79, 103`: Tiers de desconto profissional e modelo de comissão por indicação (`To be confirmed`).
  - `app/(shared)/professionals/page.tsx:114, 144`: Política de envio de amostras gratuitas para clínicas (`To be confirmed`).
  - `app/(shared)/professionals/page.tsx:170, 195`: Acesso à biblioteca técnica e laudos de pureza restritos (`To be confirmed`).
  - `app/(shared)/professionals/page.tsx:220, 250`: Perguntas frequentes sobre verificação no Conselho Regional de Medicina ou no Conselho Regional de Medicina Veterinária e venda direta em clínicas (`To be confirmed`).
  - `app/(shared)/professionals/_components/professional-application-form.tsx:96, 111, 129, 167, 200`: Exemplos de registro profissional, especialidades e resposta de envio (`To be confirmed`).
- **(b) Proposta de referência:** `docs/professionals-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Aprovar as condições propostas para profissionais, definir regras de verificação dos registros no Conselho Regional de Medicina ou no Conselho Regional de Medicina Veterinária e decidir sobre material impresso de apoio. As propostas aguardam aprovação.

---

## 56. Rota `/reviews` (Avaliações Públicas e Depoimentos)

- **Página:** `app/(shared)/reviews/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(shared)/reviews/page.tsx:51`: Sanitização de autor quando incompleto (`displayAuthorName -> "To be confirmed"`).
  - `app/(shared)/reviews/page.tsx:248, 249, 261`: Mensagens sobre programa de incentivo a avaliações e termos de moderação (`To be confirmed`).
- **(b) Proposta de referência:** `docs/reviews-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Conexão com a plataforma oficial de avaliações (Shopify Reviews, Junip ou Yotpo) e política de não oferecer recompensa financeira por avaliações.

---

## 57. Rota `/reviews/write` (Envio de Nova Avaliação)

- **Página:** `app/(shared)/reviews/write/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(shared)/reviews/write/page.tsx:126`: Nota de diretrizes sobre avaliações incentivadas (`Reviews are not incentivized. To be confirmed.`).
  - `app/(shared)/reviews/write/_components/review-form.tsx:112, 115`: Envio de fotos e avaliação detalhada por atributo (`Add photos (optional): To be confirmed`).
- **(b) Proposta de referência:** `docs/reviews-write-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Definir se serão aceitas fotos de clientes em avaliações, com moderação antes da publicação, e aprovar os termos de uso de imagem.

---

## 58. Rota `/science` (Base Científica e Estudos)

- **Página:** `app/(shared)/science/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed` no arquivo da rota; citações e gráficos implementados de acordo com o board.
- **(b) Proposta de referência:** `docs/contracts.md` e decisão ADR-020 em `.maestri/DECISIONS.md`.
- **(c) Decisão ou insumo do Robson:** Revisão científica final e validação jurídica das alegações sobre dinucleotídeo de nicotinamida e adenina (NAD+), sirtuínas e formação de mitocôndrias.

---

## 59. Rota `/search` (Busca no Site)

- **Página:** `app/(shared)/search/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`.
- **(b) Proposta de referência:** `lib/contracts/catalog.ts`.
- **(c) Decisão ou insumo do Robson:** Definir e aprovar sinônimos autorizados para a busca na Shopify.

---

## 60. Rota `/shipping-returns` (Políticas de Envio e Devolução)

- **Página:** `app/(shared)/shipping-returns/page.tsx`
- **(a) Dados pendentes no código:**
  - Linhas 44 a 158: Horário limite para envio no mesmo dia, transportadoras, custos de frete econômico e expresso, destinos internacionais atendidos, política de devolução de frascos abertos, eventual taxa para reposição de estoque e prazos de reembolso (`To be confirmed`).
  - Linhas 205 a 235: Data de atualização da política, prazo e condições da garantia e endereço de devolução de pacotes (`To be confirmed`). Os termos propostos aguardam aprovação jurídica.
  - Linhas 351 a 369: Requisitos de entrega em caixas postais e endereços militares (`To be confirmed`).
  - Linhas 489 a 501: Frequência e regras de frete em envios recorrentes de assinaturas (`To be confirmed`).
  - Linhas 617 a 680: Janela máxima para relatar caixas avariadas no transporte (`To be confirmed`).
- **(b) Proposta de referência:** `docs/shipping-returns-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Aprovação das tarifas, janelas operacionais de frete e política de garantia de satisfação (proposta em `docs/shipping-returns-proposta.md`).

---

## 61. Rota `/track` (Rastreamento de Pedido)

- **Página:** `app/(shared)/track/page.tsx`
- **(a) Dados pendentes no código:** Nenhum `To be confirmed`. Formulário integrado a dados de exemplo para rastreio.
- **(b) Proposta de referência:** `lib/contracts/account.ts`.
- **(c) Decisão ou insumo do Robson:** Definir e aprovar a integração com o serviço de rastreamento de pedidos.

---

## 62. Rota `/where-to-buy` (Onde Encontrar Nadeon)

- **Página:** `app/(shared)/where-to-buy/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(shared)/where-to-buy/page.tsx:28`: Descrição nos metadados (`Store locations: To be confirmed`).
  - `app/(shared)/where-to-buy/page.tsx:135`: Detalhes de frete na compra online direta (`Free shipping details: To be confirmed`).
  - `app/(shared)/where-to-buy/page.tsx:303`: Lista de pontos de venda físicos parceiros (`Store locations: To be confirmed`).
  - `app/(shared)/where-to-buy/page.tsx:351`: Ações de solicitação de novos pontos comerciais (`Wholesale actions: To be confirmed`).
- **(b) Proposta de referência:** `lib/contracts/store-locator.ts`.
- **(c) Decisão ou insumo do Robson:** Fornecer a listagem de clínicas, pet shops ou lojas físicas parceiras (nomes, endereços, latitude/longitude) para cadastro no localizador.

---

## 63. Rota `/wholesale` (Venda no Atacado entre Empresas)

- **Página:** `app/(shared)/wholesale/page.tsx`
- **(a) Dados pendentes no código:**
  - `app/(shared)/wholesale/page.tsx:21, 62`: Pedido mínimo inicial em dólares ou unidades (`Minimum: To be confirmed`).
  - `app/(shared)/wholesale/page.tsx:25`: Acesso público aos relatórios de lote para lojistas (`Public lab reports: To be confirmed`).
  - `app/(shared)/wholesale/page.tsx:108`: Catálogo de produtos e preços para lojistas (`To be confirmed`).
  - `app/(shared)/wholesale/page.tsx:228, 239`: Prazo de resposta da equipe comercial e e-mail para lojistas (`To be confirmed`).
  - `app/(shared)/wholesale/page.tsx:276`: Perguntas frequentes sobre exclusividade territorial e revenda online em marketplaces (`To be confirmed`).
- **(b) Proposta de referência:** `docs/wholesale-proposta.md`.
- **(c) Decisão ou insumo do Robson:** Aprovar as condições propostas de pedido mínimo, desconto e catálogo de produtos e preços para lojistas. Os valores e condições da proposta ainda não foram aprovados.

---

## Lista Única Priorizada de Decisões do Robson

Esta lista organiza as decisões por **impacto decrescente no número de rotas destravadas simultaneamente**, permitindo focar primeiro nos insumos que resolvem blocos inteiros do site:

1. **Imagens tridimensionais e fotos de produtos (destrava 20 rotas):**
   - Aprovar imagens em alta resolução e confirmar o escopo: o material de pendências registra a dúvida entre 12 imagens por família de produto e 36 variantes, sem confirmar uma contagem final.
   - _Rotas destravadas:_ `/`, `/human`, `/pet`, `/human/products/[slug]`, `/pet/products/[slug]`, `/human/shop`, `/human/shop/[format]`, `/pet/dogs`, `/pet/cats`, `/pet/horses`, `/human/kits`, `/human/kits/[slug]`, `/pet/kits`, `/pet/kits/[slug]`, `/human/build-your-box`, `/pet/build-your-box`, `/cart`, `/account/orders`, `/account/orders/[id]`, `/lp/[campanha]`.

2. **Políticas de frete, envio e devoluções (destrava 10 rotas):**
   - Aprovar a proposta `docs/shipping-returns-proposta.md`, incluindo prazos, limites de frete grátis, transportadoras, garantia e política de frascos abertos. Os termos e valores da proposta ainda não estão aprovados.
   - _Rotas destravadas:_ `/shipping-returns`, `/cart`, `/where-to-buy`, `/human/subscribe`, `/pet/subscribe`, `/lp/[campanha]`, `/offers/[oferta]`, `/account/subscriptions/[id]/cancel`, `/legal/terms`, `/help`.

3. **Revisão jurídica e dados institucionais dos EUA (destrava 8 rotas):**
   - Fornecer razão social, endereço para devoluções e notificações, telefone gratuito e e-mails de privacidade. Contatos em código e em propostas são placeholders até que os valores reais sejam confirmados.
   - Revisar e aprovar as propostas `docs/legal-proposta.md`, `docs/legal-accessibility-proposta.md` e `docs/legal-do-not-sell-proposta.md`; nenhuma está aprovada por este relatório.
   - _Rotas destravadas:_ `/legal/terms`, `/legal/privacy`, `/legal/accessibility`, `/legal/do-not-sell`, `/account/settings`, `/about`, `/help`, `/shipping-returns`.

4. **Validação veterinária e doses Pet (destrava 7 rotas):**
   - Revisão e aprovação veterinária das doses por peso, dos guias de raças e das alegações de saúde nas propostas `docs/pet-breed-guide-proposta.md`, `docs/pet-benefit-proposta.md` e `docs/pet-concern-proposta.md`. As propostas aguardam aprovação.
   - _Rotas destravadas:_ `/pet/breeds`, `/pet/breeds/[raca]`, `/pet/benefit/[beneficio]`, `/pet/concern/[problema]`, `/pet/quiz`, `/pet/dose-calculator`, `/account/pets`.

5. **Regras comerciais de parcerias (destrava 4 rotas):**
   - Revisar e aprovar as condições propostas para afiliados (`docs/affiliates-proposta.md`), profissionais de saúde (`docs/professionals-proposta.md`), venda entre empresas (`docs/wholesale-proposta.md`) e vale-presente (`docs/gift-card-proposta.md`). Comissões, rastreamento, pedido mínimo, catálogo de produtos e preços para lojistas e valores do vale-presente permanecem pendentes; nenhum desses termos é apresentado como aprovado.
   - _Rotas destravadas:_ `/affiliates`, `/professionals`, `/wholesale`, `/gift-card`.

6. **Especialistas e laudos reais de laboratório (destrava 4 rotas):**
   - Fotos e minibiografias dos pareceristas reais em `docs/experts-proposta.md`.
   - Primeiros certificados de análise reais para publicação na página de laudos.
   - _Rotas destravadas:_ `/experts`, `/lab-results`, `/science`, `/ingredients`.

7. **Acessibilidade e contraste em várias rotas (pendente da revisão final W5-29):**
   - O resumo do verificador W5-29 registrou seis pares Pet abaixo dos limites: cor de destaque `#e0a63c` sobre fundo comum `#fff6ea` (`2,03:1`) e fundo elevado `#ffffff` (`2,17:1`), abaixo de `3:1` para interface; coral `#ff6b6b` sobre esses fundos (`2,59:1` e `2,78:1`), abaixo de `4,5:1` para texto; verde-menta `#7fe0b0` sobre esses fundos (`1,49:1` e `1,59:1`), também abaixo de `4,5:1`. **Todos os resultados permanecem pendentes da revisão final W5-29.**
   - Há uma divergência ainda não resolvida: o resumo W5-29 atribui `1,49:1` e `1,59:1` ao verde-menta, enquanto a revisão W5-29 descreve dois resultados genéricos de âmbar nessas razões como combinações que a interface não usa. A revisão também identifica os anéis de foco Pet `accent` com `2,03:1` e `2,17:1`, abaixo do mínimo de interface `3:1`; descreve o ícone âmbar em cartão escuro e o texto de anúncio em superfícies escuras ou âmbar. A identificação final dos pares deve aguardar a revisão W5-29; não altere cores por este relatório.
   - _Rotas afetadas:_ várias páginas e componentes com tema Pet; a lista exata depende da confirmação dos pares realmente renderizados.
