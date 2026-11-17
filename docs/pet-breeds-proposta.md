# Proposta de Producao: /pet/breeds (Indice de Racas)

Documento de conformidade com a Regra 8 do projeto Nadeon (`BRIEFING-CONSTRUTOR-W2.md` e `AGENTS.md`).
Na implementacao da rota `/pet/breeds`, todo texto mantido no codigo segue estritamente os boards de design.
Alegações de dose e de revisão veterinária sem comprovação foram completamente substituídas por "To be confirmed" no código e documentadas neste arquivo para aprovação antes de qualquer publicação clínica.

---

## 1. Tabela de Placeholders e Propostas

| Elemento / Secao           | Texto Original no Board / Rascunho                                                                                 | Exibicao em Codigo (Regra 8)                                                                 | Proposta para Aprovacao                                                                                                               |
| :------------------------- | :----------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| **Hero Subtitle**          | `Intro placeholder. Health topics by life stage, weight and exercise...`                                           | `To be confirmed.`                                                                           | "Care guides tailored to your pet's life stage, activity, nutrition notes and support routine."                                       |
| **Popular Breeds**         | `POPULAR: [Breed], [Breed], [Breed]...`                                                                            | `To be confirmed`                                                                            | Cães: Labrador Retriever, French Bulldog, German Shepherd, Golden Retriever. Gatos: Maine Coon, Siamese, Ragdoll, Persian.            |
| **Size Key**               | `Size key: Small up to [XX] lb · Medium [XX] to [XX] lb · Large [XX] to [XX] lb · Giant over [XX] lb`              | `Size key: Small up to To be confirmed lb · Medium To be confirmed to To be confirmed lb...` | `Size key: Small up to 25 lb · Medium 26 to 50 lb · Large 51 to 90 lb · Giant over 90 lb`                                             |
| **Card Subtitle**          | `[Breed] - Care guide & health topics`                                                                             | `Care guide & health topics`                                                                 | Exibir o grupo oficial (ex: `Sporting group`, `Companion`) quando disponivel no catalogo de conteudo.                                 |
| **Card Action Link**       | `Breed guide →` (apontando para rota inexistente)                                                                  | `Take pet quiz →` (apontando para `/pet/quiz`)                                               | Rótulo e destino perfeitamente alinhados até a fusão da rota `/pet/breeds/[raca]`.                                                    |
| **Missing breed copy**     | `Mixed breed or a breed we have not covered yet? Take the quiz for a routine and dose by your dog's size and age.` | `To be confirmed.`                                                                           | "Mixed breed or a breed we haven't covered yet? Take the pet quiz to find the ideal formula based on your pet's life stage and size." |
| **Request a breed notice** | `Request a breed: To be confirmed. We are prioritizing our next batch of veterinary-reviewed breed guides.`        | `Request a breed: To be confirmed.`                                                          | "Request a breed: We are collecting requests for our upcoming series of breed care guides."                                           |

---

## 2. Decisoes de Conformidade Regulamentar (Regra 8 e Revisão)

1. **Avisos Pet Obrigatórios**: A rota inclui `<PetRegulatoryNotice />`, garantindo que "For animal use only" e o disclaimer da FDA para produtos animais sejam exibidos.
2. **Alegações de Saúde e Doses Removidas**: Nenhuma alegação terapêutica, dose por peso ou menção a revisão veterinária não comprovada existe no código de produção. Todos os trechos usam `To be confirmed.` no site.
3. **Filtro de Espécie Ativo e Baseado em Contrato**: O seletor Dogs / Cats consome exclusivamente o campo `species` validado pelo contrato `BreedGuideSchema` (`lib/contracts/content.ts`). Nenhuma heurística baseada em substrings de nomes ou slugs é utilizada, prevenindo classificações errôneas (ex: Catahoula Leopard Dog permanece classificado como Dog).
4. **Alvos Táteis Acessíveis**: Botões do índice A-Z possuem dimensão mínima de 44 × 44 px (`min-w-11 min-h-11`), satisfazendo a Regra 9 do AGENTS.md.
5. **Rótulo e Destino de Links Alinhados**: Os links nos cartões exibem `Take pet quiz →` com destino para `/pet/quiz`, garantindo transparência completa da navegação para usuários e tecnologias assistivas.
