# Sistema de Pipeline e Estado do Maestri

Este documento descreve a arquitetura, o CLI de controle de tarefas e a rota `/pipeline` do projeto Nadeon Labs (nadeon-web).

## 1. Visão Geral e Estrutura em `.maestri/`

O estado de execução dos agentes é centralizado e mantido em arquivos simples e auditáveis sob a pasta `.maestri/`:

- `pipeline/tasks.json`: fonte central de dados de todas as tarefas planejadas e em execução.
- `PROJECT_STATE.md`: resumo executivo do estado atual do projeto e ondas de desenvolvimento.
- `NEXT_ACTIONS.md`: próximos passos recomendados e desbloqueios imediatos.
- `HANDOFF.md`: guia de transição e regras entre turnos e agentes.
- `DECISIONS.md`: registro de decisões arquiteturais (ADRs) numeradas e estruturadas.
- `memory/SHORT_TERM.md`: contexto de curto prazo, agentes ativos e bloqueios recentes.
- `memory/LONG_TERM.md`: princípios duradouros de arquitetura, acessibilidade e padrões.
- `agents/states/`: arquivos individuais com o estado e progresso de cada agente (`<agent_id>.json`).
- `tasks/`: pasta com detalhamentos específicos de tarefas.
- `logs/events.jsonl`: trilha de auditoria append-only de todos os eventos com UUID idempotente.
- `logs/errors.jsonl`: registro de erros operacionais.
- `logs/audit.jsonl`: auditoria de verificações e gates.
- `checkpoints/`: snapshots periódicos de estado.
- `status/<task_id>/`: diretórios dinâmicos contendo `heartbeat`, `BLOCKED` ou `DONE`.

## 2. CLI: `scripts/maestri-task.mjs`

O script foi implementado em Node.js puro, sem dependências externas, garantindo execução ultrarrápida e portabilidade total entre ambientes.

### Mecanismo de Lock Atômico e Lease

- **Lock Atômico:** usa `fs.mkdirSync` sobre `.lock` como primitiva atômica do sistema de arquivos POSIX, com auto-recuperação contra processos abortados (timeout de 10 segundos).
- **Lease de 15 Minutos:** a reserva (`claim`) atribui `lease_ate` para 15 minutos à frente. Se o agente travar ou não renovar, o lease expira e permite que outro agente assuma a tarefa.
- **Idempotência:** toda transação pode receber um `--event-id <uuid>`. Se o evento já constar no log `logs/events.jsonl`, a gravação em duplicidade é evitada.

### Comandos Disponíveis

```bash
# Listar todas as tarefas no terminal
node scripts/maestri-task.mjs list

# Reservar uma tarefa para um agente com lease de 15 minutos
node scripts/maestri-task.mjs claim <id> <agent>

# Renovar o lease por mais 15 minutos e atualizar heartbeat
node scripts/maestri-task.mjs heartbeat <id>

# Registrar bloqueio e motivo
node scripts/maestri-task.mjs block <id> <motivo>

# Associar PR e mudar status para revisão
node scripts/maestri-task.mjs review <id> <pr_url>

# Marcar tarefa como entregue e concluída
node scripts/maestri-task.mjs done <id>

# Liberar reserva da tarefa de volta para o backlog
node scripts/maestri-task.mjs release <id>
```

### Opções Globais

- `--home <caminho>`: especifica um diretório `.maestri` personalizado (útil para testes ou isolamento).
- `--event-id <uuid>`: define um identificador único para garantir idempotência da operação.

## 3. Painel `/pipeline`

A rota `app/(shared)/pipeline/page.tsx` provê uma interface visual completa para monitoramento em tempo real:

- **Controle de Acesso:** acessível exclusivamente em ambiente de desenvolvimento (`NODE_ENV=development`) ou com a variável `PIPELINE_DASHBOARD=1`. Em produção sem a variável, a rota invoca `notFound()` e retorna HTTP 404.
- **Quadro Kanban:** 4 colunas principais (Backlog, Em andamento, Para revisão, Entregue) com contadores no cabeçalho.
- **Filtros Interativos:** filtragem dinâmica no lado do cliente por Onda, Papel e busca textual (por ID, título, agente).
- **Cartões de Tarefa:** exibem ID, título, onda, papel, preset, dependências, alertas destacados de bloqueio (`BLOCKED`), responsável e link do Pull Request.
- **Auditoria de Eventos:** tabela exibindo os últimos 50 eventos ordenados de forma decrescente, com badges coloridos por tipo de ação.
