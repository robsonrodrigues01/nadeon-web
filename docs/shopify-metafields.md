# Metafields de produto na Shopify

Conteúdo dos produtos que vive na Shopify (decisão de 2026-11-26 em `.maestri/DECISIONS.md`).
Preço, variantes, estoque, planos de assinatura e fotos são campos nativos da Shopify;
o resto fica em metafields do produto, no namespace `nadeon`, com leitura pública na Storefront API.

| Chave              | Tipo                        | Conteúdo                                                          |
| ------------------ | --------------------------- | ----------------------------------------------------------------- |
| `technical_name`   | single_line_text_field      | Subtítulo, ex.: NMN 500 mg                                        |
| `line`             | single_line_text_field      | `human` ou `pet`                                                  |
| `species`          | single_line_text_field      | `dog`, `cat` ou `horse` (só Pet)                                  |
| `format`           | single_line_text_field      | Capsules, Soft chews, Oils...                                     |
| `color`            | color                       | Cor do rótulo usada no site                                       |
| `serving`          | single_line_text_field      | Quanto tomar por vez                                              |
| `servings_per_jar` | number_integer              | Doses por pote                                                    |
| `net_weight`       | single_line_text_field      | Conteúdo do pote                                                  |
| `how_to_use`       | multi_line_text_field       | Modo de usar                                                      |
| `benefits`         | list.single_line_text_field | Benefícios; todos são exibidos como alegação com aviso da FDA     |
| `claims`           | list.single_line_text_field | Alegações; todas são exibidas com aviso da FDA                    |
| `related`          | list.single_line_text_field | Handles de produtos relacionados                                  |
| `actives`          | json                        | Lista de `{name, amount}`                                         |
| `faq`              | json                        | Lista de `{question, answer}`                                     |
| `dosing_by_weight` | json                        | Lista de `{minWeightLbs, maxWeightLbs, dose, servingDescription}` |

## Script de cópia

`scripts/shopify-product-content.mjs` cria as definições que faltam e copia o conteúdo de
`data/products` para os produtos com o mesmo handle. Usa o login do Shopify CLI
(`shopify store auth` com `read_products,write_products`).

```
node --env-file=.env.local scripts/shopify-product-content.mjs          # dry-run, não grava
node --env-file=.env.local scripts/shopify-product-content.mjs --apply  # grava
```

Se o CLI não estiver no PATH, defina `SHOPIFY_CLI` com o caminho dele. Rodar de novo sobrescreve
os valores com o conteúdo atual de `data/products`; depois da migração, edite o conteúdo na Shopify.
