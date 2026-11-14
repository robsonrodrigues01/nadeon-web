# Pipeline de CI e Gates de Merge

Este documento descreve a arquitetura de integracao continua (CI), as politicas de protecao de branch, os comandos para reproducao local e o procedimento de reversao (rollback) em producao na Vercel.

## 1. Visao Geral dos Gates

Nenhum codigo entra no branch principal (`main`) sem validacao previa. O pipeline e executado no GitHub Actions a cada abertura ou atualizacao de Pull Request e em pushes diretos no `main`.

O merge automatico e disparado quando todos os gates obrigatorios sao concluidos com sucesso.

Os jobs configurados sao:

1. **ci**:
   - Valida estilo de codigo (`pnpm format:check`).
   - Executa analise estatica (`pnpm lint`).
   - Verifica tipos TypeScript (`pnpm typecheck`).
   - Executa testes unitarios (`pnpm test`).
   - Valida ausencia de placeholders em textos renderizados (`pnpm data:check`).
   - Compila a aplicacao Next.js (`pnpm build`).

2. **e2e**:
   - Executa o build da aplicacao.
   - Inicia o servidor local via `pnpm start`.
   - Roda testes end to end com Playwright.
   - Executa analise de acessibilidade automatizada com `@axe-core/playwright` em cada pagina visitada, garantindo conformidade com WCAG sem violacoes.

3. **security**:
   - Executa varredura profunda de segredos no historico Git via Gitleaks.
   - Audita dependencias npm com nivel critico e alto (`pnpm security:audit`).

4. **lighthouse** (em modo aviso ate a onda 3):
   - Aguarda o deploy da previa gerada pela Vercel no PR via API do GitHub.
   - Executa o Lighthouse CI contra a URL de previa.
   - Avalia metas de performance (85), acessibilidade (95), SEO (95) e boas praticas (95).

## 2. Como Rodar Localmente

Antes de enviar commits para o repositorio remoto, todos os gates podem ser reproduzidos na estacao de trabalho:

### Validacao completa padrao

```bash
pnpm verify
```

### Executar cada etapa individualmente

```bash
# Verificacao de formatacao
pnpm format:check

# Correcao automatica de formatacao
pnpm format

# Analise estatica (ESLint)
pnpm lint

# Verificacao de tipos (TypeScript)
pnpm typecheck

# Testes unitarios (Vitest)
pnpm test

# Verificacao de placeholders em textos renderizados
pnpm data:check

# Compilacao de producao
pnpm build
```

### Testes End to End (E2E e Acessibilidade)

```bash
# Instalar navegadores do Playwright caso necessario
pnpm exec playwright install chromium

# Executar testes E2E
pnpm test:e2e
```

### Auditoria de seguranca e vulnerabilidades

```bash
pnpm security:audit
```

## 3. Politica de Branch Protection e Auto-merge

O branch `main` e estritamente protegido via configuracoes da API do GitHub:

- Push direto e desabilitado para qualquer usuario.
- Required Status Checks ativos: `ci`, `e2e` e `security` devem estar estritamente verdes antes da integracao.
- O branch deve estar atualizado com o `main` antes do merge (`strict: true`).
- Aprovacao humana nao e exigida nesta fase para permitir merge automatico agil via `gh pr merge --auto`.

## 4. Procedimento de Reversao (Rollback da Vercel)

Se uma versao integrada ao `main` apresentar instabilidade ou incidente critico em producao, utilize um dos metodos abaixo:

### Metodo 1: Rollback instantaneo pelo Dashboard da Vercel

1. Acesse o projeto no painel: `https://vercel.com/robsoncoffys-projects/nadeon-web`.
2. Navegue ate a aba **Deployments**.
3. Localize o ultimo deploy saudavel e estavel anterior ao incidente.
4. Clique no menu de opcoes (tres pontos) desse deploy e selecione **Instant Rollback**.
5. Confirme a operacao. O trafego de producao sera imediatamente redirecionado para a versao estavel selecionada, sem necessidade de novo build.

### Metodo 2: Rollback via Vercel CLI

Caso possua autorizacao e acesso CLI configurado:

```bash
# Listar os ultimos deployments
vercel list

# Promover o deployment estavel para producao
vercel alias set <DEPLOYMENT_ID_OU_URL> nadeon.com
```

### Metodo 3: Reversao no Git (Manter historico limpo)

Para alinhar o repositorio com a producao restaurada:

```bash
git checkout main
git pull origin main
git revert <COMMIT_HASH_DO_PROBLEMA> -m 1
git push origin main
```

O pipeline de CI rodara a validacao automatica e a Vercel executara o deploy da versao revertida.
