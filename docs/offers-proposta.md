# Proposta de conteudo para `/offers/[oferta]` (Promo collection)

Documento de alinhamento para os blocos da pagina de modelo de promocao `/offers/[oferta]`.
Conforme a regra do projeto, nenhuma campanha, desconto, data de termino, contagem regressiva ou kit promocional foi inventado. Ate aprovacao e publicacao via contrato, os valores permanecem como `To be confirmed`.

## Blocos para aprovacao

| Bloco                   | Estado atual                                         | Proposta para aprovacao                                                                                               |
| ----------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Identificacao da oferta | `To be confirmed` (ou dados do `offersProvider`)     | Definir catalogo de promocoes ativas, slugs (`[oferta]`), titulos e descricoes comerciais.                            |
| Desconto e mecanica     | `To be confirmed`                                    | Definir se a promocao e percentual (`percentage`) ou comprou-ganhou (`buy_x_get_y`), limites e regras de cumulacao.   |
| Cupom e codigo          | `To be confirmed`                                    | Cadastrar codigos promocionais na Shopify/provedor de checkout e parametrizar aplicacao automatica via URL.           |
| Contagem regressiva     | `To be confirmed` nos 4 blocos (DAYS, HRS, MIN, SEC) | Definir data/hora de inicio e fim por fuso horario (`startsAt`, `endsAt`) no contrato para contagem ativa no cliente. |
| Kits em oferta          | `To be confirmed`                                    | Selecionar quais kits da linha Pet e Human participam da promocao e seus respectivos precos promocionais.             |
| Produtos em oferta      | `To be confirmed`                                    | Mapear os produtos elegiveis e filtros de navegacao por especie/linha.                                                |
| Bundle builder          | `To be confirmed`                                    | Definir regras do montador de kits: quantidade minima de itens, produtos elegiveis e desconto progressivo aplicado.   |
| Termos e condicoes      | `To be confirmed`                                    | Validacao juridica dos termos completos da promocao (elegibilidade de assinaturas, frete, estoque e exclusoes).       |
| Avisos regulatorios     | Avisos aprovados da FDA e Pet                        | Manter os avisos regulatorios institucionais em todas as ofertas de produtos animais.                                 |
