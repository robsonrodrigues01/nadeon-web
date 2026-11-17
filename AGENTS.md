<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Regras do projeto Nadeon

Antes de qualquer tarefa, leia este arquivo, o briefing e as seções 0 e 1.4 do
plano v3 em `/Users/robsoncoffy/Documents/Nadeon/Website/plano-v3-nadeon-web.md`.
Documentação interna em português do Brasil, sem travessão; código, rotas e textos
do site em inglês. Preserve o bloco gerado pelo Next acima.

### 1. Fluxo

Reserve com `node scripts/maestri-task.mjs claim <task_id> <agent_id>` e trabalhe
somente no worktree e branch da tarefa. Use `MAESTRI_HOME` apontando para
`/Users/robsoncoffy/Documents/Nadeon/Website/nadeon-web/.maestri`, o estado central.
A cada 60 s, renove a reserva pelo comando `heartbeat <task_id>` do mesmo CLI e
grave `status/<task_id>/heartbeat` no estado central com data, passo e último
comando. Se travar, registre `BLOCKED` nessa pasta com motivo e o que destrava,
e use `block <task_id> <motivo>`; se o CLI faltar, registre o bloqueio no arquivo.
Por decisão do Robson, o fluxo vigente é local e prevalece sobre o fluxo GitHub
do plano: faça commit no próprio branch `agy/<task_id>`, sem `git push`, sem abrir
PR e sem usar `gh pr`. Cumprida a entrega do autor na regra 12, grave `DONE` com
o SHA do commit, a saída do `pnpm verify`, resumo, riscos e evidências; salve
checkpoint em `agents/states/<agent_id>.json` no estado central. O Maestro atribui
a revisão e faz o merge no `main` local após aprovação.
Deploys de produção, domínio, DNS, credenciais, pagamentos reais e gastos
exigem aprovação explícita do Robson. Segredos ficam fora do Git.

Capacidade do Mac (16 GB, travou em 14/11): no seu worktree rode só os testes da
sua área (`pnpm vitest run <pasta>`), lint e typecheck. Comando pesado (`pnpm gate`,
`pnpm build`, `next build`, suíte completa do Vitest) só um por vez no Mac inteiro:
`until mkdir /tmp/nadeon-heavy.lock 2>/dev/null; do sleep 15; done`, rode o comando
e depois `rmdir /tmp/nadeon-heavy.lock`, mesmo se falhar. O gate completo roda uma
vez, no merge, pelo Maestro.

- Certo: reservar `W0-06`, renovar heartbeat e entregar commit local com SHA e verify no `DONE`.
- Errado: trabalhar no checkout de outro agente ou marcar `DONE` com gate falhando.

### 2. Escopo

Escreva só nos caminhos autorizados no briefing. `package.json`, lockfile,
configs, `lib/contracts/`, `styles/tokens.css` e layout raiz (`app/layout.tsx`)
são compartilhados e exigem tarefa específica que autorize a alteração.

- Certo: alterar apenas a rota e os testes listados na tarefa.
- Errado: ajustar `package.json` para resolver uma tarefa que só autoriza uma página.

### 3. Bibliotecas

Use só bibliotecas presentes no `package.json`. Se precisar de outra, registre
`BLOCKED` com a justificativa e aguarde a autorização e a tarefa específica.

- Certo: reutilizar uma biblioteca já declarada.
- Errado: instalar um pacote novo por conveniência, inclusive como dependência de desenvolvimento.

### 4. Visual

Use os tokens de `styles/tokens.css`, sem cores hex soltas. As referências são
as telas desktop e mobile de `design/boards/` indicadas no briefing; confira ambas.

- Certo: `color: var(--fg)` seguindo as duas telas da tarefa.
- Errado: `color: #fff` ou implementar só a referência desktop.

### 5. HTML semântico

Ação usa `<button>`; navegação usa `<a>` via `next/link`. Campos usam `<input>`,
`<select>` ou `<textarea>` com `<label>` associado; grupos de opções usam
`<fieldset>` com `<legend>`. Botão só com ícone recebe `aria-label` e ícone decorativo
com `aria-hidden="true"`. O design usa div para tudo; o código não copia isso.

- Certo: `<button type="button">Add to cart</button>` e `<Link href="/cart">Cart</Link>`.
- Errado: `<div onClick={addToCart}>Add to cart</div>` ou campo sem label.

### 6. Dados

Consuma dados somente pelos contratos de `lib/contracts/`, usando seus providers.
Até a onda 4, use mocks aprovados; integrações reais entram na onda 4.
Exemplos do design (`[X]`, `$XX`, `(example)`) pertencem aos mocks, nunca a texto
fixo em componentes. Respeite as decisões fechadas da seção 0 do plano v3.

- Certo: renderizar o nome retornado pelo `AccountProvider` mock.
- Errado: fixar `Alex (example)` no JSX ou consultar a Shopify diretamente na página.

### 7. Preço

Preço vem sempre do `CatalogProvider`, com a moeda do mercado. Formate com
`Intl.NumberFormat`; nunca concatene `$` nem fixe USD para todos os mercados.

- Certo: `new Intl.NumberFormat(locale, { style: "currency", currency: price.currencyCode }).format(Number(price.amount))`, com `price` do catálogo no mercado selecionado.
- Errado: `"$" + price.amount` ou preço fixo copiado do design.

### 8. Conformidade

Alegação de benefício com asterisco usa `<Claim>`, que injeta o aviso da FDA.
Páginas Pet exibem `For animal use only`; onde houver produto de cavalo, inclua
também o aviso equino aprovado. Use apenas depoimentos, números, lotes e COAs reais.
No lançamento, reviews ficam em `No reviews yet`, sem botão; sem laudos, mostre
`first lots publishing soon` com busca desligada. Texto legal do design é rascunho
e exige revisão jurídica antes de abrir o domínio.

- Certo: `<Claim>{benefit.text}</Claim>` e os avisos Pet/equino aplicáveis.
- Errado: benefício com asterisco fora de `<Claim>` ou inventar nota, depoimento ou COA.

### 9. Acessibilidade

Garanta contraste AA nos dois temas, foco visível, navegação por teclado e alvos
interativos de pelo menos 44 × 44 px. Confira estados de foco e a ordem de navegação.

- Certo: botão de 44 × 44 px acessível por Tab e acionável pelo teclado, com foco visível.
- Errado: alvo de 20 px, foco removido ou ação disponível só ao passar o mouse.

### 10. Imagens

Use `next/image` com `width`, `height` e `alt`. O texto alternativo descreve a
imagem; use `alt=""` quando ela for puramente decorativa.

- Certo: `<Image src={image.src} width={image.width} height={image.height} alt={image.alt} />`.
- Errado: `<img src={image.src} />` sem dimensões nem texto alternativo.

### 11. Skills

Confira as skills instaladas no seu CLI e leia as aplicáveis: `ponytail` para
simplicidade; `tdd` quando houver implementação ou correção testável;
`diagnosing-bugs` ao investigar falhas. Não presuma instalação nem invente uso;
se alguma faltar, registre a ausência e siga as regras do projeto.

- Certo: ler `tdd`, se instalada e aplicável, e provar falha antes da correção.
- Errado: afirmar que usou uma skill sem verificar sua existência e ler suas instruções.

### 12. Pronto

Para a entrega do autor, exija `pnpm verify` verde no worktree, diff dentro do
escopo e `DONE` com SHA do commit local e saída da verificação. A revisão por outro
agente é atribuída pelo Maestro e exige aprovação antes do merge local. Revisores
usam `git -C /Users/robsoncoffy/Documents/Nadeon/Website/nadeon-web diff main...agy/<task_id>`
e respondem `APROVADO` ou `MUDANÇAS`, com os achados, somente ao Maestro.
Para interface, anexe screenshots em 375, 768 e 1280 px em
`status/<task_id>/shots` no estado central. Playwright, Lighthouse e axe continuam
restritos ao CI; enquanto indisponível, registre a evidência pendente sem afirmar
que foi executada. Documentação exige o diff como evidência, sem screenshots.

- Certo: `DONE` com SHA, verify verde e evidências; Maestro obtém revisão antes do merge local.
- Errado: declarar verify verde sem executar, fazer merge sem revisão ou usar mocks como prova de integração real.

### 13. Providers no cliente

Componente cliente (`"use client"`) só importa de `lib/providers/client`. Nunca importe de `lib/providers` em componente cliente. Formulários (newsletter, contato, e-mail do quiz) usam Server Actions. O carrinho é exceção: ele vive no navegador, então adicionar, alterar e remover itens usa `cartProvider` de `lib/providers/client` direto no cliente, no mesmo padrão do ProductCard.

### 14. Preço e moeda

Todo preço exibido passa por `formatMoneyWithMarket` ou `formatMarketPrice` de `lib/market/formatter.ts`, com a moeda do mercado. Proibido `Intl.NumberFormat("en-US")` fixo, helper de preço local e qualquer valor de preço, frete ou desconto escrito no código: tudo vem dos dados ou do mercado.

- Certo: `import { cartProvider } from "@/lib/providers/client"` em componente cliente e server action para formulários.
- Errado: `import { formsProvider } from "@/lib/providers"` dentro de arquivo com `"use client"`.
