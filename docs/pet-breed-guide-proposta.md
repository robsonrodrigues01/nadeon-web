# Proposta de Producao: /pet/breeds/[raca] (Guia de Raca)

Documento de conformidade com a Regra 8 do projeto Nadeon (`BRIEFING-CONSTRUTOR-W2.md` e `AGENTS.md`) e com a regra crítica de dosagem veterinária.
Na implementação da rota `/pet/breeds/[raca]` (ex: `/pet/breeds/labrador-retriever`), nenhum dado de saúde, alegação ou dose que não esteja estritamente confirmada foi inventado.
Todos os elementos pendentes estão assinalados como "To be confirmed" no código e na renderização do site. As propostas abaixo aguardam validação clínica veterinária e aprovação do Robson para publicação em produção.

---

## 1. Tabela de Placeholders e Propostas

| Elemento / Seção      | Texto no Board de Design                                                                                    | Exibição em Código (Regra 8)                                                                 | Proposta para Aprovação Clínica                                                                                                    |
| :-------------------- | :---------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| **Hero Subtitle**     | `...and a supplement dose for 51 to 90 lb dogs.`                                                            | `...and a supplement dose for To be confirmed lb dogs.`                                      | "A comprehensive care guide for Labradors at every life stage: weight, exercise, nutrition and vet-reviewed NAD+ supplementation." |
| **Byline Reviewer**   | `Reviewed by Name, DVM (example) · License # · Date`                                                        | `Reviewed by Veterinary Advisory Board (To be confirmed) · License # To be confirmed`        | Informar o nome e registro do veterinário responsável antes do lançamento em produção.                                             |
| **Breed Facts**       | `Size: Large (example)`, `Weight range: 51 to 90 lb (example)`, `Life expectancy: 10 to 12 years (example)` | `To be confirmed` (consumido do contrato `contentProvider`)                                  | Confirmar faixas oficiais do AKC: Porte Grande, 55–80 lb (fêmeas: 55–70 lb, machos: 65–80 lb), expectativa de 11–13 anos.          |
| **Weight & Exercise** | `Typical adult weight: 30 lb, 55 lb, 80 lb, 100 lb`                                                         | `Typical weight: To be confirmed (example)`                                                  | Fixar na faixa de 55 a 80 lb com recomendação de escore corporal (BCS 4-5/9).                                                      |
| **Supplement Guide**  | `DOSE FOR A 55 TO 80 LB LABRADOR: [Dose] a day, [Product name]`                                             | `Dose: To be confirmed. Product names, formats and dosages are To be confirmed.`             | "Dose diária: 1 soft chew (ou 1 colher medidora do pó) ao dia para cães de 55 a 80 lb, administrado junto à refeição matinal."     |
| **FAQ Dosagem**       | `For dogs from 51 to 90 lb the label dose of [Product name] is [Dose] a day...`                             | `Dose: To be confirmed. Label dose and veterinary recommendation are To be confirmed.`       | Publicar a dosagem recomendada somente após conclusão do rótulo final aprovado pela regulação.                                     |
| **Shop Section**      | `[Product name] · $XX`, `[Breed] kit`                                                                       | Labrador Retriever Starter Kit com `AddKitButton` apontando para o kit registrado `chew-oil` | Kit com Chews diários + Óleo de recuperação articular.                                                                             |

---

## 2. Decisões de Segurança Regulatória e Links

1. **Avisos Pet Obrigatórios**: A rota inclui `<PetRegulatoryNotice />`, garantindo que "For animal use only" e o disclaimer da FDA para suplementos animais sejam visíveis.
2. **Alegações de Benefício**: Todas as menções com asterisco utilizam `<Claim>`, mantendo o disclaimer exigido.
3. **Links para Rotas Existentes**: Os links nos cartões de raças relacionadas apontam com segurança para `/pet/breeds`, evitando erros de roteamento para páginas de raças ainda não existentes.
4. **Botões Obrigatórios da Seção 5**:
   - `Take the quiz` -> `/pet/quiz`
   - `All breed guides` -> `/pet/breeds`
   - `Shop all for dogs` -> `/pet/dogs`
   - `Add kit to cart` -> Adição do kit Pet via `cartProvider.addKit`.
