# Memória de Longo Prazo (Long-Term Memory)

- **Princípios do Projeto:**
  - Código limpo, minimalista e fortemente tipado (TypeScript estrito).
  - Sem inventar dados: dados fixos como "[X]" ou "$XX" do design devem vir obrigatoriamente de contratos tipados em lib/contracts.
  - HTML semântico obrigatório: nunca utilizar divs genéricas quando existirem tags semânticas apropriadas (button, a, fieldset, label, etc.).
  - Acessibilidade WCAG AA como requisito não negociável (contraste, foco visível, navegação por teclado, alvos mínimos de 44px).
  - Isolamento de dependências: nenhum pacote npm adicional além dos homologados na onda 0 sem aprovação expressa.
  - Formatação e moedas dinâmicas respeitando a localidade do mercado do cliente via Intl.NumberFormat.
