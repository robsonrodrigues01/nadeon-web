# Proposta para categorias do Journal

O board `Sistema_Conteúdo__70_Sistema_Journal_categoria_Desktop.dc.html` e sua versão mobile mostram números de artigos, datas, excerpt de exemplo e um reviewer de exemplo. A rota não publica esses placeholders: usa apenas os registros existentes em `contentProvider`; quando não há conteúdo correspondente, mostra “To be confirmed”.

| Ponto                     | Proposta para aprovação                                                                                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Artigos nas subcategorias | Acrescentar ao contrato de conteúdo o vínculo artigo-subcategoria antes de ativar filtros além de “All”. A seleção atual mostra o estado vazio quando nenhum registro corresponde. |
| Ordenação por data        | Usar `publishedAt` após haver datas aprovadas no resumo do artigo; até lá, não afirmar uma ordenação.                                                                              |
| Reviewer e bio            | Exibir apenas credenciais e nomes aprovados; os campos ausentes ficam “To be confirmed”.                                                                                           |
| CTA Pet                   | O texto de quiz e o destino `/pet/quiz` seguem o board; nenhuma recomendação de artigo adicional foi criada.                                                                       |
