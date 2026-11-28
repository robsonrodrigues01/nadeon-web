# Shopify Customer Account API (OAuth com PKCE)

Documentação do login sem senha por código via e-mail na Customer Account API da Shopify,
com fluxo OAuth 2.0 + PKCE (cliente público), gestão de sessão em cookies `HttpOnly`,
leitura e atualização básica do perfil do cliente e saída federada.

## 1. Cadastro na Shopify (canal Headless)

No canal **Headless** da Shopify Admin, em **Customer Account API** (tipo de cliente **Public**, sem client secret, usando PKCE):

- **Callback URIs (HTTPS obrigatórios):**
  - `https://www.nadeonlabs.com/account/auth/callback`
  - `https://nadeon-web.vercel.app/account/auth/callback`
- **JavaScript origins:**
  - `https://www.nadeonlabs.com`
  - `https://nadeon-web.vercel.app`
- **Logout URIs:**
  - `https://www.nadeonlabs.com`
  - `https://nadeon-web.vercel.app`

As rotas de callback e logout calculam `redirect_uri` e `post_logout_redirect_uri` a partir
da origem da requisição (`x-forwarded-proto` + `x-forwarded-host` quando presentes, ou
`request.nextUrl.origin`). Não é permitido callback HTTP em produção na Shopify.

## 2. Variáveis de ambiente (servidor)

Nenhuma destas variáveis deve receber prefixo `NEXT_PUBLIC_` nem ser exposta ao cliente:

| Variável                             | Obrigatória | Descrição                                                            |
| ------------------------------------ | ----------- | -------------------------------------------------------------------- |
| `SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID` | Sim         | Client ID do aplicativo público no canal Headless                    |
| `SHOPIFY_SHOP_ID`                    | Sim         | ID numérico da loja na Shopify (usado nos endpoints OIDC/API)        |
| `SHOPIFY_STORE_DOMAIN`               | Sim (loja)  | Domínio `.myshopify.com` da loja para Storefront/Admin               |
| `PROVIDERS_LIVE`                     | Parcial     | Inclua `account` (ex.: `PROVIDERS_LIVE=account`) ou `PROVIDERS=live` |

Se `SHOPIFY_SHOP_ID` (numérico) ou `SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID` estiver ausente ou
inválido em modo live, `LiveAccountProvider` e as rotas `/account/auth/*` falham com erro
explícito de configuração (`Shopify Customer Account configuration error`), sem fallback para mocks.

## 3. Escopos OAuth

```text
openid email customer-account-api:full
```

## 4. Cookies e proteção dos tokens

Todos os cookies de autenticação são gravados exclusivamente pelo servidor com as flags
`HttpOnly`, `Secure`, `SameSite=Lax` e `Path=/`:

| Cookie                    | Finalidade                                                                        | Validade                                   |
| ------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------ |
| `nadeon_ca_pkce`          | Estado transitório (`state`, `nonce`, `codeVerifier`, `returnTo`) durante o login | 10 minutos                                 |
| `nadeon_ca_access_token`  | Token de acesso da Customer Account API (`shcat_...`)                             | 30 dias (expiração lógica em `expires_at`) |
| `nadeon_ca_refresh_token` | Token para renovação quando o access token expira                                 | 30 dias                                    |
| `nadeon_ca_expires_at`    | Data ISO de expiração do access token                                             | 30 dias                                    |
| `nadeon_ca_id_token`      | `id_token` JWT usado como `id_token_hint` no logout                               | 30 dias                                    |
| `nadeon_ca_customer_id`   | GID do cliente (`gid://shopify/Customer/...`)                                     | 30 dias                                    |

Os tokens nunca são enviados ao navegador em payloads client-side, logs ou URLs de redirecionamento.

## 5. Endpoints de descoberta e API

- **Descoberta OpenID Connect (com cache em memória de 1 h):**
  `https://shopify.com/authentication/{SHOPIFY_SHOP_ID}/.well-known/openid-configuration`
- **Descoberta da Customer Account API GraphQL (com cache em memória de 1 h):**
  `https://shopify.com/{SHOPIFY_SHOP_ID}/.well-known/customer-account-api`
  (fallback padrão: `https://shopify.com/{SHOPIFY_SHOP_ID}/account/customer/api/2026-10/graphql`)
- **Cabeçalho de autenticação GraphQL:**
  `Authorization: <access_token>` (enviado diretamente, sem prefixo `Bearer`).

## 6. Fluxo de autenticação, sessão e saída

1. **Início (`accountProvider.signInUrl(returnTo)` -> `GET /account/auth/login`):**
   - `signInUrl` aceita apenas caminhos relativos ao próprio site começando com `/` único
     (rejeita `//`, `\`, esquemas como `https:`/`javascript:`, caracteres de controle e rotas `/account/auth/*`),
     usando `/account` como padrão para evitar open redirect.
   - `GET /account/auth/login` descobre `authorization_endpoint`, gera `code_verifier` (32 bytes aleatórios),
     calcula `code_challenge` (`S256`), gera `state` e `nonce`, grava o cookie `nadeon_ca_pkce` e redireciona
     para a Shopify com `response_type=code` e `redirect_uri=<origem>/account/auth/callback`.
2. **Retorno (`GET /account/auth/callback`):**
   - Valida `code`, `state` (comparação em tempo constante com o cookie `nadeon_ca_pkce`) e ausência de `error`.
   - Troca o código no `token_endpoint` via `POST application/x-www-form-urlencoded` enviando apenas
     `grant_type=authorization_code`, `client_id`, `redirect_uri`, `code` e `code_verifier` (cliente público, sem segredo).
   - Decodifica o payload do `id_token` e valida `nonce` em tempo constante.
   - **Decisão sobre assinatura do `id_token`:** a validação de assinatura via JWKS foi deixada opcional neste ciclo
     porque o `id_token` é recebido diretamente do `token_endpoint` da Shopify via TLS na troca servidor-servidor
     (OIDC Core, seção 3.1.3.7).
   - Consulta `{ customer { id } }` na Customer Account API GraphQL para garantir que `session.customerId` coincida
     com `customer.id`, grava os cookies de sessão, apaga `nadeon_ca_pkce` e redireciona para `returnTo`.
   - Qualquer falha apaga `nadeon_ca_pkce` e redireciona para `/account/auth/error` sem expor tokens nem detalhes técnicos.
3. **Leitura de sessão e refresh (`accountProvider.getSession()`):**
   - Se o `access_token` ainda é válido (com margem de 60 s), retorna `{ accessToken, expiresAt, customerId }`.
   - Se expirou e há `refresh_token`: Server Components no Next.js não podem gravar cookies. Para não consumir um
     `refresh_token` rotativo sem conseguir persistir os novos tokens, `getSession()` verifica antes se a store de
     cookies é gravável. Em Server Components, retorna `null` com segurança para a página redirecionar ao login
     (`/account/auth/login`); em Server Actions e Route Handlers (cookies graváveis), renova via `grant_type=refresh_token`,
     atualiza os cookies ou limpa a sessão se o refresh falhar.
4. **Perfil (`getCustomer()` e `updateProfile()`):**
   - `getCustomer()` consulta `customer { id firstName lastName emailAddress { emailAddress } phoneNumber { phoneNumber } defaultAddress { id } }`.
   - Campos ausentes na Shopify (`firstName`, `lastName` nulos) recebem `""`; `phone` e `defaultAddressId` ficam `undefined`
     quando ausentes; `birthDate` fica `undefined` e `profileType` usa o padrão `"Both"` (metafields de perfil e pets
     entram na W4-39).
   - `updateProfile()` atualiza `firstName` e `lastName` via mutação `customerUpdate`.
5. **Saída (`accountProvider.signOut()` e `GET /account/auth/logout`):**
   - Remove todos os cookies de sessão e, havendo `id_token`, redireciona para `end_session_endpoint` com
     `id_token_hint` e `post_logout_redirect_uri=<origem>`.
