# Contratos de Integracao e Provedores Mock

Este documento descreve a arquitetura de contratos de dados do projeto Nadeon Web, com suas respectivas interfaces TypeScript, esquemas de validacao Zod, implementacoes de dados simulados (mock) e instrucoes de uso.

## Visao Geral da Arquitetura

Todas as paginas e componentes da aplicacao interagem com dados externos exclusivamente atraves de contratos definidos no diretorio [lib/contracts/](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/lib/contracts).

O arquivo [lib/providers/index.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/lib/providers/index.ts) seleciona a implementacao correspondente com base na variavel de ambiente `PROVIDERS`:

1. `PROVIDERS=mock` (padrao): utiliza as implementacoes funcionais com dados realistas em [lib/providers/mock/](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/lib/providers/mock).
2. `PROVIDERS=live`: utiliza as implementacoes em [lib/providers/live/index.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/lib/providers/live/index.ts), configuradas como stubs que lancam erro explicito para a onda 4 (`not implemented: onda 4`).

---

## Contratos Disponiveis

### 1. CatalogProvider

- Arquivo de contrato: [lib/contracts/catalog.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/lib/contracts/catalog.ts)
- Esquema de produtos: [data/products.schema.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/data/products.schema.ts)
- Implementacao mock: [lib/providers/mock/catalog.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/lib/providers/mock/catalog.ts)
- Teste unitario: [tests/unit/contracts/catalog.test.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/tests/unit/contracts/catalog.test.ts)

Metodos:

- `getProducts(filter?: CatalogFilter): Promise<Product[]>`
- `getProduct(slug: string): Promise<Product | null>`
- `getCollection(handle: string, filter?: CatalogFilter, sort?: CatalogSort): Promise<Collection | null>`
- `getKits(line?: ProductLine): Promise<Kit[]>`
- `getKit(slug: string): Promise<Kit | null>`
- `search(q: string): Promise<Product[]>`

Exemplo de uso:

```typescript
import { catalogProvider } from "@/lib/providers";

// Buscar produto pelo slug
const product = await catalogProvider.getProduct("biohack");
console.log(product?.name); // "BioHack"
console.log(product?.variants[0].price); // { amount: 65, currencyCode: "USD" }

// Listar formulas caninas
const dogProducts = await catalogProvider.getProducts({
  line: "pet",
  species: "dog",
});

// Pesquisar produtos
const searchResults = await catalogProvider.search("NAD+");
```

---

### 2. CartProvider

- Arquivo de contrato: [lib/contracts/cart.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/lib/contracts/cart.ts)
- Implementacao mock: [lib/providers/mock/cart.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/lib/providers/mock/cart.ts)
- Teste unitario: [tests/unit/contracts/cart.test.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/tests/unit/contracts/cart.test.ts)

A implementacao mock utiliza Zustand com persistencia automatica no navegador (`localStorage`), possuindo compatibilidade total com renderizacao no servidor e testes em ambiente Node.

Metodos:

- `get(): Promise<Cart | null>`
- `create(): Promise<Cart>`
- `addLines(lines: AddCartLineInput[]): Promise<Cart>`
- `updateLines(lines: UpdateCartLineInput[]): Promise<Cart>`
- `removeLines(lineIds: string[]): Promise<Cart>`
- `applyDiscount(code: string): Promise<Cart>`
- `setLineSellingPlan(lineId: string, sellingPlanId: string | null): Promise<Cart>`
- `checkoutUrl(): Promise<string>`

Casos limite cobertos:

- Carrinho vazio: inicializado com totais zerados e lista vazia.
- Cupom invalido: lanca erro especificando codigo invalido.
- Assinatura vinculada: aplica automaticamente 15% de desconto no preco da linha.

Exemplo de uso:

```typescript
import { cartProvider } from "@/lib/providers";

// Adicionar produto com plano de assinatura de 30 dias
const cart = await cartProvider.addLines([
  {
    variantId: "var_biohack_1",
    quantity: 1,
    sellingPlanId: "plan_biohack_30d",
  },
]);

// Aplicar cupom de desconto
const discountedCart = await cartProvider.applyDiscount("WELCOME10");

// Obter link para finalizacao
const checkoutUrl = await cartProvider.checkoutUrl();
```

---

### 3. AccountProvider

- Arquivo de contrato: [lib/contracts/account.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/lib/contracts/account.ts)
- Implementacao mock: [lib/providers/mock/account.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/lib/providers/mock/account.ts)
- Teste unitario: [tests/unit/contracts/account.test.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/tests/unit/contracts/account.test.ts)

Contem dados realistas do cliente exemplo "Alex Morgan", seus enderecos, historico de pedidos com rastreio da UPS e cadastro de pets.

Metodos:

- `getSession(): Promise<Session | null>`
- `signInUrl(returnTo?: string): Promise<string>`
- `signOut(): Promise<void>`
- `getCustomer(): Promise<CustomerProfile | null>`
- `getOrders(): Promise<Order[]>`
- `getOrder(id: string): Promise<Order | null>`
- `getAddresses(): Promise<Address[]>`
- `updateProfile(input: ProfileInput): Promise<CustomerProfile>`
- `getPets(): Promise<Pet[]>`
- `savePet(pet: PetInput): Promise<Pet>`

Exemplo de uso:

```typescript
import { accountProvider } from "@/lib/providers";

// Carregar perfil do cliente logado
const customer = await accountProvider.getCustomer();
console.log(customer?.firstName, customer?.profileType); // "Alex", "Both"

// Obter historico de pedidos
const orders = await accountProvider.getOrders();

// Cadastrar novo animal de estimacao
const newPet = await accountProvider.savePet({
  name: "Buster",
  species: "dog",
  breed: "Labrador",
  weightLbs: 72,
  activityLevel: "high",
  concerns: ["Joint comfort"],
});
```

---

### 4. SubscriptionProvider

- Arquivo de contrato: [lib/contracts/subscription.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/lib/contracts/subscription.ts)
- Implementacao mock: [lib/providers/mock/subscription.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/lib/providers/mock/subscription.ts)
- Teste unitario: [tests/unit/contracts/subscription.test.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/tests/unit/contracts/subscription.test.ts)

Gerencia assinaturas ativas das linhas BioHack e More Good Years, alem de controle de capacidades e bloqueio de acoes invalidas.

Metodos:

- `list(): Promise<Subscription[]>`
- `get(id: string): Promise<Subscription | null>`
- `capabilities(): Promise<SubscriptionCapabilities>`
- `skip(id: string): Promise<Subscription>`
- `reschedule(id: string, nextBillingDate: string): Promise<Subscription>`
- `changeFrequency(id: string, intervalDays: number): Promise<Subscription>`
- `swapProduct(id: string, lineId: string, newVariantId: string): Promise<Subscription>`
- `changeQuantity(id: string, lineId: string, quantity: number): Promise<Subscription>`
- `pause(id: string): Promise<Subscription>`
- `resume(id: string): Promise<Subscription>`
- `cancel(id: string, reason: string, feedback?: string): Promise<Subscription>`

Casos limite cobertos:

- Assinatura cancelada: tentativas de adiar, pausar, retomar ou alterar itens lancam erro explicito.
- Intervalo nao suportado: validacao contra `allowedIntervalDays` (30, 60, 90, 120, 180 dias).

Exemplo de uso:

```typescript
import { subscriptionProvider } from "@/lib/providers";

// Pular proxima entrega
const updatedSub = await subscriptionProvider.skip("sub_biohack_001");

// Alterar frequencia de cobranca para 60 dias
await subscriptionProvider.changeFrequency("sub_biohack_001", 60);

// Pausar assinatura temporariamente
await subscriptionProvider.pause("sub_mgy_002");
```

---

### 5. ReviewsProvider

- Arquivo de contrato: [lib/contracts/reviews.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/lib/contracts/reviews.ts)
- Implementacao mock: [lib/providers/mock/reviews.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/lib/providers/mock/reviews.ts)
- Teste unitario: [tests/unit/contracts/reviews.test.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/tests/unit/contracts/reviews.test.ts)

Metodos:

- `list(filter?: ReviewsFilter): Promise<{ reviews: Review[]; total: number }>`
- `summary(productSlug: string): Promise<ReviewSummary>`
- `submit(payload: SubmitReviewInput): Promise<Review>`

Comportamento do mock:

- Por padrao, retorna lista vazia (reproduzindo fielmente o estado de lancamento da loja).
- Permite carregar amostras de avaliacoes quando `includeDevSamples: true` for informado, facilitando o desenvolvimento de componentes na pagina `/dev/kit`.

Exemplo de uso:

```typescript
import { reviewsProvider } from "@/lib/providers";

// Resumo de avaliacoes de um produto
const summary = await reviewsProvider.summary("biohack");

// Enviar nova avaliacao
const review = await reviewsProvider.submit({
  productSlug: "biohack",
  rating: 5,
  title: "Excelente clareza mental",
  body: "Resultados perceptíveis logo nas primeiras semanas de uso diário.",
  authorName: "Carlos R.",
  authorEmail: "carlos@example.com",
  termsAccepted: true,
});
```

---

### 6. FormsProvider

- Arquivo de contrato: [lib/contracts/forms.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/lib/contracts/forms.ts)
- Implementacao mock: [lib/providers/mock/forms.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/lib/providers/mock/forms.ts)
- Teste unitario: [tests/unit/contracts/forms.test.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/tests/unit/contracts/forms.test.ts)

Centraliza os envios de formularios de contato, inscricao em newsletters, pedidos de privacidade (LGPD e CCPA / Do Not Sell), candidaturas de profissionais e rastreamento de eventos de navegacao.

Comportamento do mock:

- Em ambiente de desenvolvimento e testes, exibe o log no console e anexa as entradas em formato JSON Lines no arquivo `.maestri/logs/forms-mock.jsonl`.

Metodos:

- `subscribe(list: string, email: string, consent: boolean): Promise<FormSubmissionResult>`
- `sendContact(payload: ContactInput): Promise<FormSubmissionResult>`
- `sendPrivacyRequest(payload: PrivacyRequestInput): Promise<FormSubmissionResult>`
- `sendApplication(type: ApplicationType, payload: ApplicationInput): Promise<FormSubmissionResult>`
- `trackEvent(name: string, email: string | null, properties?: Record<string, unknown>): Promise<{ success: boolean }>`

Exemplo de uso:

```typescript
import { formsProvider } from "@/lib/providers";

// Inscricao na newsletter
await formsProvider.subscribe("newsletter-human", "user@example.com", true);

// Envio de mensagem de suporte
await formsProvider.sendContact({
  name: "Mariana Costa",
  email: "mariana@example.com",
  topic: "shipping",
  message: "Gostaria de saber o prazo estimado para a entrega.",
  orderNumber: "NL-100234",
});
```

---

### 7. LabsProvider

- Arquivo de contrato: [lib/contracts/labs.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/lib/contracts/labs.ts)
- Base de dados: [data/labs.json](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/data/labs.json)
- Implementacao mock: [lib/providers/mock/labs.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/lib/providers/mock/labs.ts)
- Teste unitario: [tests/unit/contracts/labs.test.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/tests/unit/contracts/labs.test.ts)

Permite consultar laudos analiticos de lotes e certificados de autenticidade (COA). O arquivo [data/labs.json](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/data/labs.json) inicia com uma lista vazia tipada conforme o esquema `LabLotSchema`.

Metodos:

- `findLot(lotNumber: string): Promise<LabLot | null>`
- `listLots(filter?: LabsFilter): Promise<LabLot[]>`

Exemplo de uso:

```typescript
import { labsProvider } from "@/lib/providers";

const lot = await labsProvider.findLot("NL-240101");
if (lot) {
  console.log(lot.productName, lot.coaUrl, lot.status);
}
```

---

### 8. CampaignConfig

- Arquivo de contrato: [lib/contracts/campaign.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/lib/contracts/campaign.ts)
- Base de dados: [data/campaign.json](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/data/campaign.json)
- Implementacao mock: [lib/providers/mock/campaign.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/lib/providers/mock/campaign.ts)
- Teste unitario: [tests/unit/contracts/campaign.test.ts](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/tests/unit/contracts/campaign.test.ts)

Controla banners promocionais, barras de aviso no topo e dados de campanhas ativas. No estado inicial da onda 0, nenhuma campanha esta ativa em [data/campaign.json](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/data/campaign.json).

Metodos:

- `getActiveCampaign(): Promise<Campaign | null>`

Exemplo de uso:

```typescript
import { campaignConfig } from "@/lib/providers";

const campaign = await campaignConfig.getActiveCampaign();
if (campaign && campaign.isActive) {
  console.log("Campanha ativa:", campaign.name, campaign.bannerText);
}
```

---

## Evidencia de Execucao dos Testes Vitest

Saida oficial da execucao de testes unitarios:

```text
$ vitest run

 RUN  v5.1.0 /Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03

 ✓ tests/unit/contracts/labs.test.ts (2 tests) 3ms
 ✓ tests/unit/contracts/campaign.test.ts (1 test) 3ms
 ✓ tests/unit/contracts/reviews.test.ts (5 tests) 16ms
 ✓ tests/unit/contracts/account.test.ts (8 tests) 23ms
 ✓ tests/unit/contracts/catalog.test.ts (7 tests) 11ms
 ✓ tests/unit/contracts/subscription.test.ts (9 tests) 7ms
 ✓ tests/unit/contracts/cart.test.ts (9 tests) 7ms
 ✓ tests/unit/contracts/providers-selection.test.ts (3 tests) 2ms
 ✓ tests/unit/contracts/forms.test.ts (6 tests) 14ms
 ✓ tests/unit/smoke.test.ts (1 test) 1ms

 Test Files  10 passed (10)
      Tests  51 passed (51)
   Start at  02:40:16
   Duration  289ms
```
