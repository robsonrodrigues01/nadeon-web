This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Dados

O acesso a todos os dados externos da aplicacao e feito exclusivamente por meio de contratos definidos em `lib/contracts/` e acessados via `lib/providers/`.

### Variavel de ambiente `PROVIDERS`

A selecao da implementacao e controlada pela variavel de ambiente `PROVIDERS`:

```bash
# Padrao: executa com dados realistas e estado local (mock)
PROVIDERS=mock

# Modo integracao real: utiliza as APIs externas (Shopify Storefront, Customer Account, Mailyte, etc.)
PROVIDERS=live
```

No modo `mock` (padrao), a aplicacao utiliza dados realistas baseados nas especificacoes de design (cliente Alex, assinaturas BioHack e More Good Years, carrinho persistente via Zustand).

No modo `live`, metodos reais previstos para a onda 4 estao declarados como stubs que lancam erro informando que serao implementados na onda 4.

Exemplo de importacao direta:

```typescript
import {
  catalogProvider,
  cartProvider,
  accountProvider,
  subscriptionProvider,
  reviewsProvider,
  formsProvider,
  labsProvider,
  campaignConfig,
} from "@/lib/providers";
```

Consulte a documentacao completa dos contratos em [docs/contracts.md](file:///Users/robsoncoffy/Documents/Nadeon/Website/worktrees/W0-03/docs/contracts.md).

## Verificacao e Testes

Para rodar a suite completa de verificacao:

```bash
pnpm verify
```

Para rodar apenas os testes unitarios de contrato:

```bash
pnpm test
```
