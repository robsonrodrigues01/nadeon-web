# Proposta para campanhas em `/lp/[campanha]`

O contrato atual de `CampaignConfig` informa campanha ativa, nome, mensagem de banner, título/subtítulo, código de desconto e data final. `ContentProvider` oferece artigos editoriais, mas não associa conteúdo de campanha, produto ou oferta a um modelo. Por isso, os itens abaixo ficam como “To be confirmed” até aprovação e inclusão em contratos/dados próprios.

| Item pendente                                                 | Proposta para aprovação                                                                                                           |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Identificação do modelo e slug                                | Manter os prefixos `listicle-`, `product-` e `seasonal-`; mapear os sufixos para conteúdo aprovado no registry.                   |
| Texto editorial, autoria, imagens e revisão                   | Publicar somente conteúdo revisado e aprovado vinculado à campanha; manter artigos do `ContentProvider` até esse vínculo existir. |
| Sinais, explicações e benefícios de saúde                     | Revisão veterinária/médica e de conformidade antes de publicar; cada benefício com asterisco segue em `<Claim>` e aviso aprovado. |
| Produto, dose, preço, assinatura, comparação e link de compra | Associar produto e preço do `CatalogProvider`, com moeda do mercado e dados verificáveis para qualquer comparação.                |
| Descontos, códigos, prazos, garantias e frete                 | Fornecer valores ativos pelo contrato de campanha e regras aprovadas; não inferir tiers a partir do board.                        |
| Depoimentos                                                   | Usar somente texto real, consentido e aprovado; até lá, manter “To be confirmed”.                                                 |
| Gift sets, gift wrap e prazos sazonais                        | Definir kits e opções no catálogo/checkout e prazos de entrega aprovados antes de habilitar controles.                            |
| Avisos legais                                                 | Revisão jurídica antes de abrir o domínio, conforme o plano v3.                                                                   |
