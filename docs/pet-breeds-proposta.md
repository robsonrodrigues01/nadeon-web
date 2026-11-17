# Proposta de Producao: /pet/breeds (Indice de Racas)

Documento de conformidade com a Regra 8 do projeto Nadeon (`BRIEFING-CONSTRUTOR-W2.md` e `AGENTS.md`).
Na implementacao da rota `/pet/breeds`, todo texto mantido no codigo segue estritamente os boards de design.
Os placeholders nao aprovados estao exibidos como "To be confirmed" no site. As propostas abaixo aguardam revisao e aprovacao do Robson para entrada em producao.

---

## 1. Tabela de Placeholders e Propostas

| Elemento / Secao    | Texto Atual no Board                                                                                  | Exibicao em Codigo (Regra 8)                                                                 | Proposta para Aprovacao                                                                                                               |
| :------------------ | :---------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| **Hero Subtitle**   | `Intro placeholder. Health topics by life stage, weight and exercise...`                              | `To be confirmed. Health topics by life stage, weight and exercise...`                       | "Find veterinary-reviewed care guides tailored to your pet's life stage, weight and exercise, food notes and precise dose by weight." |
| **Popular Breeds**  | `POPULAR: [Breed], [Breed], [Breed]...`                                                               | Labrador Retriever, French Bulldog, Golden Retriever, German Shepherd, Poodle                | Manter as 5 racas mais populares registradas no AKC/FCI.                                                                              |
| **Size Key**        | `Size key: Small up to [XX] lb · Medium [XX] to [XX] lb · Large [XX] to [XX] lb · Giant over [XX] lb` | `Size key: Small up to To be confirmed lb · Medium To be confirmed to To be confirmed lb...` | `Size key: Small up to 25 lb · Medium 26 to 50 lb · Large 51 to 90 lb · Giant over 90 lb`                                             |
| **Card Subtitle**   | `[Breed] - Care guide & health topics`                                                                | `Care guide & health topics`                                                                 | Exibir o grupo oficial (ex: `Sporting group`, `Non-sporting group`) quando disponivel no catalogo de conteudo.                        |
| **Request a breed** | `Request a breed` (acao)                                                                              | Exibe aviso informativo interativo "Request a breed: To be confirmed"                        | Modal com campo de e-mail e nome da raca para notificacao automatica quando o guia correspondente for publicado.                      |

---

## 2. Decisoes de Conformidade Regulamentar (Regra 8)

1. **Avisos Pet Obrigatórios**: A rota inclui `<PetRegulatoryNotice />`, garantindo que "For animal use only" e o disclaimer da FDA para produtos animais sejam exibidos.
2. **Alegações de Saúde**: Nenhuma alegação terapêutica ou veterinária não comprovada foi inserida. Os textos limitam-se à navegação e tópicos de cuidados gerais.
3. **Links para Guias**: Conforme diretriz do usuário, os links dos cartões não apontam para a rota inexistente `/pet/breeds/[raca]` (que será implementada na W5-08), direcionando com segurança para `/pet/quiz`.
