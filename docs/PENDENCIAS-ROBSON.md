# Pendências para decisão do Robson

## Textos `To be confirmed` exibidos

A busca foi feita com `rg -n -i 'to be confirmed' app components`. As linhas abaixo agrupam cada arquivo e o assunto de cada ocorrência.

| Rota | Textos pendentes | Arquivo e linhas | Proposta relacionada |
| --- | --- | --- | --- |
| `/shipping-returns` | Política de devolução de frascos abertos; etiqueta e frete de retorno; prazo de reembolso; janela de relato de dano; corte e agenda de expedição; destinos internacionais; alteração de endereço; devolução de assinatura; resolução de entrega; prazo de reembolso e taxa de reposição; prazos, custos, limites e métodos de frete; data de atualização; envio de assinaturas; origem do pedido; janela de garantia; transportadoras e rastreio; requisitos de entrega; política de devolução, elegibilidade e exclusões; janela para relatar problema | `app/(shared)/shipping-returns/page.tsx`, linhas 44–680 | `docs/shipping-returns-proposta.md` propõe políticas, prazos e tarifas para aprovação. |
| `/legal/accessibility` | Prazo de resposta; datas de atualização e revisão; contato de acessibilidade; status WCAG; versões de tecnologias assistivas; sistemas e navegadores testados; limitações de conteúdo incorporado; plano e prazo de correção; tecnologias e conteúdo inacessíveis; datas, responsáveis, horário e prazo de suporte | `app/(shared)/legal/accessibility/_components/feedback-form.tsx:48` e `app/(shared)/legal/accessibility/_components/accessibility-content.tsx:69–597` | `docs/legal-accessibility-proposta.md` mapeia os placeholders e propõe conteúdo para aprovação. |
| `/legal/terms` | Data de atualização, vigência e versão; contato de privacidade por e-mail e telefone; e-mail legal | `app/(shared)/legal/terms/_components/terms-content.tsx:105–928` | `docs/legal-proposta.md` cobre Termos e Privacidade. |
| `/legal/privacy` | Data de atualização, vigência e versão; contato de privacidade por e-mail e telefone; e-mail de privacidade | `app/(shared)/legal/privacy/_components/privacy-content.tsx:92–561` | `docs/legal-proposta.md` cobre Termos e Privacidade. |
| `/legal/do-not-sell` | Data de atualização; aplicação do GPC e escopo da conta; e-mail, telefone e endereço postal; prazos de confirmação e conclusão | `app/(shared)/legal/do-not-sell/_components/do-not-sell-content.tsx:64–186` | `docs/legal-do-not-sell-proposta.md` mapeia os placeholders e propõe conteúdo para aprovação. |
| `/legal/do-not-sell` | Identificador de protocolo; data de registro; remetente do e-mail de verificação; prazo de conclusão; dados pedidos para verificação; limite de uso dos dados; prazo de resposta | `app/(shared)/legal/do-not-sell/_components/privacy-form.tsx:143–487` | `docs/legal-do-not-sell-proposta.md` cobre o conteúdo da rota. |
| `/pet/quiz` resultado | Nome e idade do animal quando ausentes; preços de produtos e kit; formato e nomes de produtos; dose, benefícios, horários; mensagens de cartões, desconto, economia anual, frete e assinatura | `components/commerce/quiz/quiz-result-pet.tsx:44–705` | `docs/quiz-pet-result-proposta.md` registra a adaptação Pet e os dados que ficam pendentes até catálogo e integração. `docs/quiz-proposta.md` cobre regras e conteúdo geral do quiz. |

## Propostas existentes em `docs/`

| Proposta | Aprovação necessária |
| --- | --- |
| `docs/account-retention-proposta.md` | Confirmar se haverá oferta de retenção de 20% e as regras com Shopify. |
| `docs/faq-proposta.md` | Aprovar as respostas propostas para FAQ que não têm resposta no board. |
| `docs/legal-accessibility-proposta.md` | Aprovar datas, contatos, prazos e declarações de acessibilidade. |
| `docs/legal-do-not-sell-proposta.md` | Aprovar dados de contato, prazos e conteúdo do fluxo de privacidade. |
| `docs/legal-proposta.md` | Aprovar datas, versão e contatos dos Termos e da Política de Privacidade. |
| `docs/quiz-pet-result-proposta.md` | Aprovar as decisões de conteúdo do resultado Pet que o board não especifica. |
| `docs/quiz-proposta.md` | Aprovar perguntas, opções e regras de recomendação dos quizzes Human e Pet. |
| `docs/shipping-returns-proposta.md` | Aprovar políticas, prazos, tarifas e condições de envio e devolução. |

## Outras decisões pendentes

- **Renders:** o DONE da W3-11 diz “12 SKUs”, mas enumera 12 famílias com três códigos cada, total de 36 códigos. Confirmar se a pendência são 12 renders de família ou 36 variantes. A lista registrada em `status/W3-11/DONE` é: `NAD-HUM-GLO-1/2/3`, `NAD-HUM-PRI-1/2/3`, `NAD-PET-GDY-1/2/3`, `NAD-PET-SWD-1/2/3`, `NAD-PET-MGYO-1/2/3`, `NAD-PET-GYRO-1/2/3`, `NAD-PET-STPO-1/2/3`, `NAD-PET-SHNO-1/2/3`, `NAD-PET-HJP-1/2/3`, `NAD-PET-PUR-1/2/3`, `NAD-PET-LSD-1/2/3` e `NAD-PET-SGD-1/2/3`.
- **Contraste Pet:** `pet accent UI/bg`, `#e0a63c` sobre `#fff6ea`, contraste `2.03:1` (mínimo `3:1`); sugestão do verificador: `#bd851e`. `pet accent UI/bg-elevated`, `#e0a63c` sobre `#ffffff`, contraste `2.17:1` (mínimo `3:1`); sugestão: `#c48a1f`. Saída de `node scripts/check-contrast.mjs`. Decidir cores antes de alterar tokens.
- **Revisões:** a decisão ADR-020 em `.maestri/DECISIONS.md` exige revisão jurídica antes da publicação. A decisão sobre `/science`, também registrada ali, deixa a substanciação científica das alegações para revisão de conteúdo e jurídica do Robson.
- **GitHub:** decidir quando autorizar o push. O fluxo de entrega local atual não faz push.
