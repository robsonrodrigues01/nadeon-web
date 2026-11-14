# Proposta de Respostas para FAQ (Nadeon Labs)

> **Status:** proposta (aguardando aprovacao do Robson)  
> **Rota afetada:** `/faq` (`app/(shared)/faq`)  
> **Data:** 14 de novembro de 2026  
> **Autor da revisao:** Trilho

---

## 1. Contexto e Regras Aplicadas

Na revisao da tarefa W2-26, identificou-se que as respostas publicadas anteriormente em `faq-content.ts` continham afirmacoes comerciais e de saude sem respaldo direto nos boards de design (prazos de entrega fixos, percentuais de desconto arbitrarios, resultados em 2 a 4 semanas, etc.), violando a regra 8 do `AGENTS.md`.

Conforme orientado na correcao:

1. A pagina publica no site mantem apenas respostas cujo texto esteja presente nos boards oficiais de design.
2. Itens que possuem pergunta nos boards mas nao possuem resposta no design recebem a mensagem:
   `"Our team is finalizing this answer. Contact us at /help."`
3. O schema JSON-LD (`FAQPage`) foi ajustado para incluir exclusivamente os itens com resposta aprovada no design.
4. As 25 perguntas sem resposta no design estao listadas abaixo com respostas propostas, redigidas de acordo com as regras de conformidade (sem claims nao comprovados, com avisos FDA, Pet e equino, e com a instrucao de lotes coerente com "first lots publishing soon" e busca desligada), aguardando aprovacao do Robson antes de entrarem no codigo.

---

## 2. Itens Aprovados no Design (Ativos no JSON-LD)

Os itens abaixo possuem texto integral no design board e estao ativos tanto na pagina quanto no schema `FAQPage`:

1. **`nmn-vs-nad`** (Products)
   - **Board de origem:** `design/boards/Conteúdo_Conteúdo__60_Conte_do_FAQ_Desktop.dc.html`
   - **Pergunta:** What is NMN and how is it different from NAD+?
   - **Resposta aprovada:** NMN (nicotinamide mononucleotide) is a building block your cells convert into NAD+ in one enzyme step. NAD+ is the coenzyme itself. BioHack, Full Charge and Glow contain NMN. Renew and Prime contain NAD+. Read more on our Science page.

2. **`which-formula`** (Products)
   - **Board de origem:** `design/boards/Conteúdo_Conteúdo__60_Conte_do_FAQ_Desktop.dc.html` (pergunta); `design/boards/Loja_Loja__10_Loja_CollectionHuman_Desktop.dc.html` (resposta)
   - **Pergunta:** Which formula should I start with?
   - **Resposta aprovada:** Most people start with BioHack for daily NMN. If you are 50 or older, many add Renew for direct NAD+. Not sure? The quiz takes 60 seconds. Talk to your doctor before starting any supplement.

3. **`charge-timing`** (Subscriptions)
   - **Board de origem:** `design/boards/Conteúdo_Conteúdo__60_Conte_do_Subscribe_Human_Desktop.dc.html`
   - **Pergunta:** When will I be charged?
   - **Resposta aprovada:** When each box ships. You get an email reminder 3 days before, so you can skip or change it.

---

## 3. Lista de Perguntas e Respostas Propostas para Aprovacao

### Categoria: Products

#### 1. `how-to-take`

- **Board de origem:** `design/boards/Conteúdo_Conteúdo__60_Conte_do_FAQ_Desktop.dc.html`
- **Pergunta:** How do I take it, and when?
- **Resposta proposta:**
  > Take your daily serving with water, preferably in the morning to support cellular energy. Check your product label for specific serving size recommendations. Consult your healthcare provider before starting any dietary supplement.*

#### 2. `biohack-and-renew`

- **Board de origem:** `design/boards/Conteúdo_Conteúdo__60_Conte_do_FAQ_Desktop.dc.html`
- **Pergunta:** Can I take BioHack and Renew together?
- **Resposta proposta:**
  > Yes, BioHack provides NMN as an NAD+ precursor while Renew delivers direct NAD+. Many customers stack them as part of their daily routine. If you take prescription medications, consult your doctor first.*

#### 3. `vegan-gluten-free`

- **Board de origem:** `design/boards/Conteúdo_Conteúdo__60_Conte_do_FAQ_Desktop.dc.html`
- **Pergunta:** Are your products vegan and gluten-free?
- **Resposta proposta:**
  > Our capsules are 100% plant-based and our formulas contain no gluten ingredients. Please refer to individual product packaging for full allergen statements.

#### 4. `how-long-results`

- **Board de origem:** `design/boards/Conteúdo_Conteúdo__60_Conte_do_FAQ_Desktop.dc.html`
- **Pergunta:** How long until I notice a difference?
- **Resposta proposta:**
  > Individual responses vary based on age, lifestyle, and consistent daily routine. Cellular NAD+ replenishment is gradual. We recommend consistent daily use and tracking how you feel over time.*

#### 5. `where-made`

- **Board de origem:** `design/boards/Conteúdo_Conteúdo__60_Conte_do_FAQ_Desktop.dc.html`
- **Pergunta:** Where are your products made?
- **Resposta proposta:**
  > Formulated and manufactured in our Clifton, New Jersey lab facility. Every production lot is numbered, dated, and tracked from raw ingredient to finished bottle.

---

### Categoria: Orders & Shipping

#### 6. `return-policy`

- **Board de origem:** `design/boards/Sistema_Conteúdo2__70_Sistema_Shipping_returns_Desktop_copy.dc.html`
- **Pergunta:** What is your return policy?
- **Resposta proposta:**
  > We back our products with a 60-day guarantee on your first order. If you are not satisfied, contact our support team at /help to initiate a refund.

#### 7. `shipping-time`

- **Board de origem:** `design/boards/Sistema_Conteúdo2__70_Sistema_Shipping_returns_Desktop_copy.dc.html`
- **Pergunta:** When will my order ship?
- **Resposta proposta:**
  > Orders are processed promptly on business days. You will receive an email confirmation with tracking information as soon as your package is dispatched by our carrier.

#### 8. `shipping-destinations`

- **Board de origem:** `design/boards/Sistema_Conteúdo2__70_Sistema_Shipping_returns_Desktop_copy.dc.html`
- **Pergunta:** Do you ship outside the US?
- **Resposta proposta:**
  > We currently ship across the United States. International shipping coverage and availability will be announced as regional distribution expands.

#### 9. `change-shipping-address`

- **Board de origem:** `design/boards/Sistema_Conteúdo2__70_Sistema_Shipping_returns_Desktop_copy.dc.html`
- **Pergunta:** Can I change my address after ordering?
- **Resposta proposta:**
  > If your order has not yet been processed by our warehouse, our support team can update the destination. Please reach out via /help immediately with your order details.

#### 10. `refund-timeline`

- **Board de origem:** `design/boards/Sistema_Conteúdo2__70_Sistema_Shipping_returns_Desktop_copy.dc.html`
- **Pergunta:** How long do refunds take to show up?
- **Resposta proposta:**
  > Once approved, refunds are credited back to your original payment method. Depending on your financial institution, funds typically reflect in your account within a few business days.

#### 11. `package-delivered-missing`

- **Board de origem:** `design/boards/Sistema_Conteúdo2__70_Sistema_Shipping_returns_Desktop_copy.dc.html`
- **Pergunta:** What if my package says delivered but I do not have it?
- **Resposta proposta:**
  > Please check around your delivery location and with neighbors first. If your package remains missing after 24 hours, contact us at /help and we will assist with carrier tracking.

---

### Categoria: Subscriptions

#### 12. `subscribe-and-save`

- **Board de origem:** `design/boards/Loja_Loja__10_Loja_CollectionHuman_Desktop.dc.html`
- **Pergunta:** How does Subscribe & Save work?
- **Resposta proposta:**
  > Subscribe & Save provides regular automated deliveries with savings on recurring products. You can skip upcoming deliveries, adjust delivery intervals, or cancel anytime through your account.

#### 13. `multiple-subscriptions`

- **Board de origem:** `design/boards/Conteúdo_Conteúdo__60_Conte_do_Subscribe_Human_Desktop.dc.html`
- **Pergunta:** Can I subscribe to more than one formula?
- **Resposta proposta:**
  > Yes. You can bundle multiple formulas into your subscription or manage individual delivery intervals directly in your account dashboard.

#### 14. `discount-stacking`

- **Board de origem:** `design/boards/Conteúdo_Conteúdo__60_Conte_do_Subscribe_Human_Desktop.dc.html`
- **Pergunta:** Does the 15% stack with other offers?
- **Resposta proposta:**
  > Subscription pricing reflects our preferred recurring rate and generally does not combine with one-time coupon codes unless specified in an active promotional campaign.

#### 15. `not-for-me`

- **Board de origem:** `design/boards/Conteúdo_Conteúdo__60_Conte_do_Subscribe_Human_Desktop.dc.html`
- **Pergunta:** What if it is not for me?
- **Resposta proposta:**
  > You can pause, adjust, or cancel your subscription at any time without fees prior to your next scheduled shipment via your account settings.

---

### Categoria: Pets

#### 16. `pet-dosage-dog`

- **Board de origem:** `design/boards/Home_NadeonLabsBrandKit__03_Home_Pet_Desktop_1_2.dc.html`
- **Pergunta:** How many chews should my dog take?
- **Resposta proposta:**
  > Serving size depends on your dog's weight. Please follow the weight-based dosing chart on your product label. For animal use only. Consult your veterinarian before introducing any new supplement.*

#### 17. `pet-senior-dogs`

- **Board de origem:** `design/boards/Home_NadeonLabsBrandKit__03_Home_Pet_Desktop_1_2.dc.html`
- **Pergunta:** Is NMN safe for senior dogs?
- **Resposta proposta:**
  > Our pet line includes formulas specifically developed to support vitality and joint comfort in mature dogs. For animal use only. Always discuss supplementation with your veterinarian.*

#### 18. `pet-combine-chews-oils`

- **Board de origem:** `design/boards/Home_NadeonLabsBrandKit__03_Home_Pet_Desktop_1_2.dc.html`
- **Pergunta:** Can I combine chews and oils?
- **Resposta proposta:**
  > Yes, chews and oils may be combined as long as total daily intake aligns with the weight-based guidelines on each package. For animal use only.

#### 19. `pet-cat-drops`

- **Board de origem:** `design/boards/Home_NadeonLabsBrandKit__03_Home_Pet_Desktop_1_2.dc.html`
- **Pergunta:** Are the cat drops flavored?
- **Resposta proposta:**
  > Cat drops are formulated for easy daily administration and can be mixed into wet food or treats. For animal use only.

#### 20. `pet-horse-top-dress`

- **Board de origem:** `design/boards/Home_NadeonLabsBrandKit__03_Home_Pet_Desktop_1_2.dc.html`
- **Pergunta:** How do I use the horse top-dress?
- **Resposta proposta:**
  > Add the measured scoop directly to your horse's daily grain or feed ration according to the label directions. For animal use only. Not for horses intended for food.

#### 21. `pet-why-nmn`

- **Board de origem:** `design/boards/Loja_Loja__10_Loja_ProductPet_MoreGoodYears_Desktop_2_2.dc.html`
- **Pergunta:** Why NMN for dogs?
- **Resposta proposta:**
  > Just like humans, pets experience natural declines in cellular NAD+ levels as they age. NMN supplementation supports cellular energy and resilience. For animal use only.*

---

### Categoria: Quality

#### 22. `quality-manufacturing`

- **Board de origem:** `design/boards/Home_NadeonLabsBrandKit__02_Home_Human_Desktop_1_2.dc.html`
- **Pergunta:** Where are your products made and tested?
- **Resposta proposta:**
  > All Nadeon formulas are produced in our Clifton, New Jersey facility. Every lot is numbered, dated, and undergoes independent third-party testing for identity and purity.

#### 23. `quality-lot-testing`

- **Board de origem:** `design/boards/Loja_Loja__10_Loja_ProductHuman_BioHack_Desktop_1_2.dc.html`
- **Pergunta:** How pure is your NMN and how do you test it?
- **Resposta proposta:**
  > Every production run is verified by accredited third-party laboratories using HPLC testing for purity and potency, alongside screening for heavy metals and microbial counts.

#### 24. `quality-view-lab-results`

- **Board de origem:** `design/boards/Loja_Loja__10_Loja_CollectionHuman_Desktop.dc.html`
- **Pergunta:** How do I find the lab report for my jar?
- **Resposta proposta (com estado coerente de lancamento: busca desligada e primeiros lotes em publicacao):**
  > Certificates of analysis (COAs) will be published directly on our Lab Results page as initial production lots are completed. First lots are publishing soon, and public lookup will activate as lots become available.

#### 25. `quality-plant-based`

- **Board de origem:** `design/boards/Loja_Loja2__10_Loja_Shop_by_format_Capsules_Desktop_copy.dc.html`
- **Pergunta:** What are the capsules made of?
- **Resposta proposta:**
  > We utilize 100% plant-based hypromellose capsules, free from animal gelatin and artificial fillers.
