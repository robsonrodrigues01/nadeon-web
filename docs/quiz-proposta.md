# Proposta de Estrutura e Regras do Quiz Nadeon

> **Status:** proposta (aguardando aprovação do Robson)  
> **Linhas cobertas:** Human e Pet (Dog, Cat, Horse)  
> **Fontes de dados:** `data/quiz.json`, `data/products.ts`, `lib/dosing`

---

## 1. Visão Geral

O motor de quiz foi implementado como uma máquina pura de recomendação em `lib/quiz/`. Todos os minutos e contagens de perguntas são calculados dinamicamente com base nas definições em `data/quiz.json` (eliminando placeholders como `[X]`).

Todas as recomendações mapeiam exclusivamente para produtos e kits cadastrados e validados no catálogo oficial (`data/products.ts`).

---

## 2. Quiz Human

- **Tempo estimado:** 1 minuto
- **Total de etapas:** 5 perguntas
- **Headline:** Find your personalized NAD+ routine

### Perguntas e Opções Propostas

1. **Idade (`age-range`)**:
   - `18-to-34`: 18 to 34 (Foundational cellular protection and active recovery)
   - `35-to-44`: 35 to 44 (Maintaining energy metabolism and resilience)
   - `45-to-54`: 45 to 54 (Replenishing natural NAD+ decline and vitality)
   - `55-plus`: 55+ (Comprehensive healthy aging and DNA repair support)

2. **Objetivo principal (`goal`)**:
   - `daily-energy`: Daily energy (Steady energy from morning to evening*)
   - `healthy-aging`: Healthy aging (Support NAD+ levels as you get older*)
   - `skin-hair-nails`: Skin, hair and nails (Glow from the inside, with collagen*)
   - `focus-recovery`: Focus and recovery (Clear head at work, bounce back after training*)

3. **Queda de energia à tarde (`afternoon-slump`)**:
   - `most-days`: Most days
   - `sometimes`: Sometimes
   - `rarely`: Rarely

4. **Formato preferido (`format`)**:
   - `capsules`: Capsules
   - `powders-drops`: Powders & Drops
   - `no-preference`: No preference

5. **Experiência com NMN (`takes-nmn`)**:
   - `no`: No, I am new to NMN
   - `yes`: Yes, I take NMN regularly

### Regras de Recomendação Human

- **Se objetivo for `daily-energy`**:
  - Kit recomendado: `energy-duo` (BioHack 500 mg pela manhã + Renew com almoço)
  - Alternativas: `full-charge` ("Choose Full Charge" - fórmula 4-em-1) e `biohack` ("Just BioHack")
- **Se objetivo for `skin-hair-nails`**:
  - Kit recomendado: `beauty-duo` (Glow NMN + colágeno marinho e Prime)
  - Alternativas: `glow` e `full-routine`
- **Se objetivo for `healthy-aging`**:
  - Kit recomendado: `full-routine` (BioHack + Renew + Powerhouse)
  - Alternativas: `energy-duo` e `full-charge`
- **Se objetivo for `focus-recovery`**:
  - Kit recomendado: `morning-stack` (BioHack + gotas Daylight)
  - Alternativas: `full-charge` e `biohack`

---

## 3. Quizzes Pet

A tela inicial Pet permite selecionar a espécie: **Dog**, **Cat** ou **Horse**. Todas as recomendações pet integram cálculo de dose automático por peso via `lib/dosing`.

### 3.1 Quiz Dog (Cães)

- **Etapa 1 - Perfil (`dog-profile`)**:
  - Nome do cão (texto)
  - Peso em lbs (numérico com indicador visual de faixas: até 20 lbs, 21-50 lbs, 51-90 lbs, 91+ lbs)
  - Idade: Puppy (até 1 ano), Adult (1 a 6 anos), Senior (7+ anos)
- **Etapa 2 - Foco de saúde (`concern`)**:
  - `joints-mobility`: Joints and mobility (Hips, ease getting up, stairs)
  - `daily-energy`: Daily energy & vitality
  - `cognitive-sharpness`: Cognitive clarity (Alertness, sleep cycles)
  - `calm-composure`: Calm & composure (Thunder, separation, travel)
- **Etapa 3 - Paladar (`picky-eater`)**:
  - `no`: No, eats almost anything (Soft chews)
  - `yes`: Yes, somewhat picky (Drops on food)

**Recomendações Dog:**

- Cão sênior com foco em articulações: Kit `chew-oil` (More Good Years + Golden Years Oil) ou `senior-starter`. Dose calculada por peso (ex.: 35 lbs = 2 chews/dia: 1 café da manhã, 1 jantar).
- Foco em calma: Kit `chew-good-days` (More Good Years + Good Days).
- Foco cognitivo: `still-sharp` + `still-sharp-oil`.

### 3.2 Quiz Cat (Gatos)

- **Etapa 1 - Perfil (`cat-profile`)**:
  - Nome do gato, peso em lbs (típico 5 a 20 lbs) e idade (Kitten, Adult, Senior).
- **Etapa 2 - Foco (`concern`)**:
  - `joints-jumping`: Hips, joints & high jumps
  - `calm-stress`: Calm & stress support
  - `overall-vitality`: Overall cellular vitality

**Recomendações Cat:**

- Kit `cat-care` (High Jump gotas para articulações + Purr Mode gotas calmantes).

### 3.3 Quiz Horse (Cavalos)

- **Etapa 1 - Perfil (`horse-profile`)**:
  - Nome do cavalo, peso em lbs (~800 a 1400 lbs) e lifestage (Pleasure & trail, Performance & sport, Senior & retired).
- **Etapa 2 - Foco (`concern`)**:
  - `joint-stride`: Joint mobility & long stride
  - `foundation-vitality`: Daily longevity & senior vitality

**Recomendações Horse:**

- Cavalo atleta / mobilidade: `long-stride` (Joint Powder).
- Cavalo sênior: `solid-ground` (Senior Powder).
- Inclui aviso equino obrigatório: _"Equine products: not for horses intended for food."_

---

## 4. Conformidade e Recursos Implementados

1. **Avisos Legais:** `<Claim>` para alegações de benefício com aviso da FDA; _"For animal use only"_ em todas as telas Pet; aviso específico para equinos.
2. **Preço Dinâmico:** Formatado via `Intl.NumberFormat` com a moeda do mercado, consumido do `CatalogProvider`.
3. **HTML Semântico & Acessibilidade:** `<button>`, `<fieldset>`, `<legend>`, `<input>` com `<label>` associado, barra de progresso com `role="progressbar"`, contrastes e alvos interativos >= 44x44px.
4. **Integração:** Adição ao carrinho via `CartProvider` (`@/lib/providers/client`) e envio de resultados por e-mail via Server Action reutilizando `components/brand/newsletter/actions.ts`.
