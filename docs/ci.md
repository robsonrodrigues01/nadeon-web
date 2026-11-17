# Pipeline de CI e Gates de Merge

Este documento descreve a arquitetura de integracao continua (CI), os gates de merge locais e remotos, os comandos para execucao e o procedimento de reversao (rollback) em producao na Vercel.

## 1. Visao Geral dos Gates

A integridade do branch principal (`main`) e garantida por gates estritos de qualidade. Nenhum codigo entra no `main` sem aprovacao completa.

### Workflows do GitHub Actions (.github/workflows/ci.yml)

A suite remota do GitHub Actions permanece pronta e versionada no repositorio para quando os servicos remotos forem reativados. Ela contempla quatro jobs:

1. **ci**: executa format:check, lint, typecheck, testes unitarios, data:check e build.
2. **e2e**: executa build, sobe servidor local e roda testes Playwright com axe core.
3. **security**: executa Gitleaks e auditoria de vulnerabilidades de dependencias.
4. **lighthouse**: roda em modo aviso no PR contra a previa de deploy da Vercel.

### Gate Real Local (Fluxo Atual da Onda 0)

Devido a restricoes de cobranca e cota remota no GitHub, o gate mandatorio e executado localmente antes de qualquer integracao. O comando oficial e:

```bash
pnpm gate
```

Este comando encadeia em sequencia estrita:
`pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm data:check && pnpm build`

Se qualquer etapa falhar, o build e abortado imediatamente e o merge e impedido.

## 2. Como Rodar Localmente

### Gate de Merge Local

```bash
pnpm gate
```

### Validacao Rapida de Codigo (sem build)

```bash
pnpm verify
```

### Comandos Individuais

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

Observacao importante: Playwright, Lighthouse e Axe rodam exclusivamente no ambiente de CI remoto do GitHub Actions, nunca na maquina local de desenvolvimento.

## 3. Procedimento de Merge Local

Com a adocao do fluxo de desenvolvimento local, a integracao segue os seguintes passos:

1. **Finalizacao no Worktree**: o autor conclui os commits no branch `agy/<task_id>` e garante que `pnpm gate` esteja 100% verde.
2. **Revisao de Codigo**: revisores avaliam o diff localmente a partir do diretorio principal:
   ```bash
   git -C /Users/robsoncoffy/Documents/Nadeon/Website/nadeon-web diff main...agy/<task_id>
   ```
3. **Veredito**: os revisores respondem diretamente ao Maestro com `APROVADO` ou solicitam mudancas.
4. **Merge no Main**: o Maestro valida o `pnpm gate` verde e realiza o merge do branch no `main` localmente, sem `git push` nem `gh pr`.

## 4. Registro de Branch Protection e Prova com PR Vermelho

### Status: Nao Aplicaveis nesta fase

As etapas originais de ativacao de Branch Protection via API do GitHub e de abertura de PR de teste quebrado para prova de bloqueio remoto foram classificadas como **Nao Aplicaveis** pelas seguintes razoes tecnicas:

1. **Conta GitHub no plano Free com repositorio privado**: a API do GitHub restringe Branch Protection e Rulesets para repositorios publicos ou organizacoes no plano GitHub Pro (retornando HTTP 403).
2. **Limite de faturamento de GitHub Actions atingido**: a conta remota suspendeu execucoes de runners do GitHub Actions ate regularizacao de spending limit.

A seguranca do projeto permanece preservada pelo gate local mandatorio (`pnpm gate`) e pela aprovacao humana centralizada pelo Maestro antes de qualquer merge no `main`.

## 5. Procedimento de Reversao (Rollback da Vercel)

Se uma versao integrada ao `main` apresentar instabilidade ou incidente critico em producao, utilize um dos metodos abaixo:

### Metodo 1: Rollback Instantaneo pelo Dashboard da Vercel

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

Quando o pipeline de CI estiver ativo, a Vercel executara o deploy da versao revertida automaticamente.
