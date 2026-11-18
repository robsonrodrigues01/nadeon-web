# Relatório de Revisão de Segurança da Onda 5 (W5-26)

Este documento apresenta o relatório detalhado da auditoria de segurança estática e comportamental realizada em todas as rotas e server actions adicionadas ou modificadas na Onda 5, tomando como base os merges realizados a partir do commit `d819a44`.

## 1. Escopo e Metodologia

Foram auditados os seguintes merges e rotas da Onda 5:

- `6740c91 Merge W5-22 (aprovada)`: Rota `/reviews/write` e ação `submitReviewAction`
- `9f65623 Merge W5-25 (aprovada)`: Rota `/account/orders` e visualização de pedidos
- `ae0059d Merge W5-20 (aprovada)`: Rota `/courses/[curso]` e ação `registerForCourse`
- `ee9f52f Merge W5-18 (aprovada)`: Rota `/professionals` e ação `submitProfessionalApplication`
- `095ba0d Merge W5-14 (aprovada)`: Rota `/journal/[slug]`
- `5160192 Merge W5-19 (aprovada)`: Rota `/affiliates` e ação `submitAffiliateApplication`

Adicionalmente, foram inspecionadas as rotas e ações complementares entregues no ciclo da Onda 5:

- `app/(shared)/wholesale/actions.ts`: Ação `submitWholesaleApplication` (W5-15)
- `app/(shared)/gift-card/actions.ts`: Ação `prepareGiftCardPurchase` (W5-06)
- `app/(shared)/where-to-buy/page.tsx`: Sanitização de parâmetros de busca (W5-16)
- `app/(shared)/reviews/page.tsx`: Exibição e anonimização de avaliações (W5-21)
- `app/(pet)/pet/breeds/page.tsx` e `[raca]/page.tsx`: Guias de raças (W5-07, W5-08)

Os cinco eixos de auditoria analisados foram:

1. Segredos no código (tokens, chaves de API, senhas).
2. Validação de esquemas com Zod em Server Actions.
3. Checagem de sessão e controle de acesso a recursos por ID (padrão W4-20 e prevenção a IDOR).
4. Exposição de dados de clientes (PII) em logs.
5. Imports diretos de `lib/providers/mock/` fora do registry.

---

## 2. Resultados por Vetor de Auditoria

### 2.1. Segredos no Código

- **Status:** Conforme (nenhum segredo identificado no código fonte).
- **Verificação:** Busca textual e regex por termos sensíveis (`apiKey`, `api_key`, `secret`, `token`, `password`, `bearer`, `private_key`) em `app/` e `lib/`.
- **Achados:**
  - Todas as chaves e segredos em uso pelo sistema são recuperados estritamente via variáveis de ambiente (`process.env.MAILYTE_API_KEY` em `lib/providers/live/index.ts:317` e `process.env.SHOPIFY_WEBHOOK_SECRET` em `app/api/webhooks/route.ts:34`).
  - As credenciais em mocks limitam-se a tokens estáticos de teste explícitos (`mock_tok_TEST_123456789` em `lib/providers/mock/account.ts:23`).
  - Nenhum segredo ou token privado está versionado no repositório.

### 2.2. Validação com Zod em Server Actions

- **Status:** Conforme (as server actions analisadas validam os dados com Zod).
- **Verificação:**
  - `app/(shared)/affiliates/actions.ts:32`: Utiliza `AffiliateApplicationSchema.safeParse`. Possui proteção contra poluição de parâmetros HTTP na linha 25 verificando `formData.getAll(field).length > 1`.
  - `app/(shared)/courses/[curso]/actions.ts:37`: Valida dados via `CourseRegistrationSchema.safeParse` com refinamento condicional `superRefine` para cursos com campos específicos.
  - `app/(shared)/professionals/actions.ts:61`: Utiliza `ProfessionalApplicationSchema.safeParse`, com verificação prévia de parâmetros duplicados na linha 54.
  - `app/(shared)/reviews/write/actions.ts:28`: Utiliza `ReviewFormSchema.safeParse` com `.strict()` para impedir campos não autorizados no payload.
  - `app/(shared)/wholesale/actions.ts:20`: Utiliza `WholesaleApplicationInputSchema.safeParse`.
  - `app/(shared)/gift-card/actions.ts:7`: Utiliza `GiftCardPurchaseInputSchema.parse(input)`.
- **Observação de estilo:**
  - Em `app/(shared)/gift-card/actions.ts:7`, o método `.parse()` é utilizado diretamente, gerando rejeição caso o payload seja inválido. O componente cliente correspondente captura a rejeição com bloco `try/catch`. Recomenda-se para padronização futura avaliar a adoção de `safeParse` retornando estado de erro tipado, conforme as demais ações.

### 2.3. Checagem de Sessão e Prevenção de IDOR (Padrão W4-20)

- **Status:** Conforme.
- **Verificação detalhada por tipo de fluxo:**
  - **Ações Públicas:** As ações em `affiliates`, `courses`, `professionals` e `wholesale` são formulários abertos de prospecção e cadastro externo, não operando sobre recursos pré-existentes de clientes.
  - **Ações Autenticadas (Avaliações / Reviews):**
    - `app/(shared)/reviews/write/page.tsx:26-47`: Antes de exibir o formulário de avaliação, a página valida a sessão ativa via `accountProvider.getSession()`. Em seguida, confere se `customer.id === session.customerId`. Localiza o pedido via `orderId` e garante que `order.email === customer.email`, o pedido está pago (`financialStatus === "paid"`), entregue (`fulfillmentStatus === "delivered"`) e contém o item avaliado (`productSlug`).
    - `app/(shared)/reviews/write/actions.ts:38-57`: Ao submeter a avaliação no servidor, todas as verificações são integralmente repetidas. O servidor revalida a sessão, a identidade do cliente autenticado, o e-mail do pedido e a presença do produto no pedido entregue.
    - Isso previne qualquer tentativa de spoofing ou IDOR na publicação de avaliações.

### 2.4. Dados do Cliente em Logs (PII)

- **Status:** Conforme no caso representativo coberto por teste; a revisão de todos os pontos de log permanece uma checagem estática/manual.
- **Verificação automatizada:** `tests/unit/security/W5-26-security.test.ts` submete uma solicitação wholesale com nome, e-mail e endereço sintéticos, captura `console.log/info/warn/error/debug` e confirma que os marcadores PII não aparecem na saída.
- **Limite:** O teste cobre uma action representativa. A inspeção de outras chamadas `console.*` não prova todos os caminhos de execução e deve ser repetida como revisão estática.
- **Achados:**
  - `lib/providers/mock/forms.ts:34`: Grava em desenvolvimento apenas `{ timestamp, formType, id }`, onde `id` é um identificador anônimo aleatório gerado no momento. Nenhum campo de formulário ou e-mail é impresso.
  - `app/api/webhooks/route.ts:104,151,177`: Grava apenas tópicos de eventos e identificadores numéricos do pedido (`id=${orderId}`), preservando e-mails, endereços e nomes de clientes fora do log.
  - `app/(pet)/pet/breeds/[raca]/_components/add-kit-button.tsx:25`: Grava apenas erro de interface no console local do navegador em caso de falha de adição ao carrinho.
  - `app/(shared)/reviews/page.tsx:46-52`: O nome do autor é explicitamente sanitizado pela função `displayAuthorName` antes de ser renderizado, expondo apenas o primeiro nome e a inicial do sobrenome (exemplo: "Sarah M."), resguardando a privacidade do usuário.

### 2.5. Imports de `lib/providers/mock/` Fora do Registry

- **Status:** Conforme no código de runtime auditado.
- **Verificação automatizada:** `tests/unit/security/W5-26-security.test.ts` procura imports estáticos diretos em `app/`, `components/`, `lib/` e `scripts/`, ignorando somente o próprio `lib/providers/`. Os testes em `tests/` ficam fora dessa regra porque usam mocks diretamente para fixtures de contrato.
- **Achado corrigido:** O workbench `app/(shared)/dev/kit/sections/W1-13.tsx` agora importa `mockCatalogProvider` pelo registry `@/lib/providers`.
- **Achados:**
  - As rotas e server actions da Onda 5 consomem provedores pelo registry `@/lib/providers` no servidor e `@/lib/providers/client` no cliente.
  - O workbench `app/(shared)/dev/kit/sections/W1-13.tsx` obtém o provider mock pelo registry, sem importar o módulo `lib/providers/mock/` diretamente.

---

## 3. Testes Automatizados Adicionados

Foi criada e ampliada a suíte de testes de regressão de segurança em:

- `tests/unit/security/W5-26-security.test.ts`

Cobertura da suíte:

1. Rejeição de submissão sem sessão (`null`) com motivo de login específico.
2. Rejeição de um pedido existente, pago e entregue que pertence a outro e-mail/sessão, sem chamar o provider de reviews.
3. Validação de nota e campos obrigatórios com Zod em avaliações.
4. Validação de formato de e-mail no cadastro de cursos.
5. Prevenção de ataques de injeção de parâmetros HTTP duplicados na aplicação de afiliados.
6. Validação de tipos e opções permitidas via enum Zod na aplicação de profissionais de saúde.
7. Captura do console numa action wholesale representativa, verificando ausência de nome, e-mail e endereço sintéticos.
8. Busca estática de imports diretos de `lib/providers/mock/` no código de runtime fora do registry.

---

## 4. Conclusão

As rotas e server actions analisadas validam dados com Zod e as avaliações repetem no servidor as checagens de sessão, dono do pedido e produto comprado. Os testes automatizam a rejeição de sessão nula, pedido de outro dono, isolamento de imports de mocks no código de runtime e a ausência de PII nos logs de uma action representativa. A inspeção ampla de outros logs e a revisão de segredos continuam sendo verificações estáticas, não provas automatizadas de todos os caminhos.
