#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import process from "node:process";
import { fileURLToPath } from "node:url";

const LEASE_DURATION_MS = 15 * 60 * 1000; // 15 minutos
const LOCK_TIMEOUT_MS = 10000; // 10 segundos para considerar lock obsoleto

/**
 * Determina o caminho raiz do .maestri
 */
export function getMaestriDir(customDir) {
  if (customDir) return path.resolve(customDir);
  if (process.env.MAESTRI_HOME) return path.resolve(process.env.MAESTRI_HOME);

  // O estado central vence a cópia versionada em .maestri/ de cada worktree.
  const central =
    "/Users/robsoncoffy/Documents/Nadeon/Website/nadeon-web/.maestri";
  if (fs.existsSync(central)) return central;

  const local = path.resolve(process.cwd(), ".maestri");
  if (fs.existsSync(path.join(local, "pipeline", "tasks.json"))) {
    return local;
  }

  return local;
}

/**
 * Adquire lock atômico baseado em mkdir
 */
export async function withLock(maestriDir, fn) {
  const lockDir = path.join(maestriDir, ".lock");
  const start = Date.now();
  const maxWait = 10000;

  while (true) {
    try {
      fs.mkdirSync(lockDir);
      break; // Lock adquirido com sucesso
    } catch (err) {
      if (err.code === "EEXIST") {
        try {
          const stat = fs.statSync(lockDir);
          if (Date.now() - stat.mtimeMs > LOCK_TIMEOUT_MS) {
            // Lock obsoleto, limpa e tenta novamente
            fs.rmSync(lockDir, { recursive: true, force: true });
            continue;
          }
        } catch {
          // Se falhou ao inspecionar stat, pode ter sido removido por outro processo
          continue;
        }

        if (Date.now() - start > maxWait) {
          throw new Error(`Timeout aguardando lock em ${lockDir}`);
        }

        // Aguarda jitter aleatório entre 20ms e 60ms
        const delay = Math.floor(Math.random() * 40) + 20;
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw err;
      }
    }
  }

  try {
    return await fn();
  } finally {
    try {
      fs.rmSync(lockDir, { recursive: true, force: true });
    } catch {
      // Ignora erro ao liberar lock se já tiver sido removido
    }
  }
}

/**
 * Carrega lista de tarefas
 */
export function loadTasks(maestriDir) {
  const tasksFile = path.join(maestriDir, "pipeline", "tasks.json");
  if (!fs.existsSync(tasksFile)) {
    return [];
  }
  const content = fs.readFileSync(tasksFile, "utf8");
  return JSON.parse(content);
}

/**
 * Salva lista de tarefas de forma atômica
 */
export function saveTasks(maestriDir, tasks) {
  const pipelineDir = path.join(maestriDir, "pipeline");
  fs.mkdirSync(pipelineDir, { recursive: true });

  const tasksFile = path.join(pipelineDir, "tasks.json");
  const tempFile = path.join(
    pipelineDir,
    `tasks.json.tmp.${crypto.randomUUID()}`
  );

  fs.writeFileSync(tempFile, JSON.stringify(tasks, null, 2) + "\n", "utf8");
  fs.renameSync(tempFile, tasksFile);
}

/**
 * Grava evento idempotente em logs/events.jsonl
 */
export function appendEvent(maestriDir, eventData) {
  const logsDir = path.join(maestriDir, "logs");
  fs.mkdirSync(logsDir, { recursive: true });

  const eventsFile = path.join(logsDir, "events.jsonl");
  const eventId = eventData.event_id || crypto.randomUUID();

  // Verifica se o evento já existe para garantir idempotência
  if (fs.existsSync(eventsFile)) {
    const lines = fs.readFileSync(eventsFile, "utf8").split("\n");
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const parsed = JSON.parse(line);
        if (parsed.event_id === eventId) {
          return { appended: false, event: parsed };
        }
      } catch {
        // Ignora linhas inválidas
      }
    }
  }

  const record = {
    event_id: eventId,
    ts: eventData.ts || new Date().toISOString(),
    ...eventData,
  };

  fs.appendFileSync(eventsFile, JSON.stringify(record) + "\n", "utf8");
  return { appended: true, event: record };
}

/**
 * Atualiza status em disco
 */
function updateStatusFile(maestriDir, taskId, filename, content) {
  const statusDir = path.join(maestriDir, "status", taskId);
  fs.mkdirSync(statusDir, { recursive: true });
  fs.writeFileSync(path.join(statusDir, filename), content, "utf8");
}

/**
 * Remove arquivo de status se existir
 */
function removeStatusFile(maestriDir, taskId, filename) {
  const filePath = path.join(maestriDir, "status", taskId, filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch {
      // Ignora erro
    }
  }
}

/**
 * Comando: list
 */
export async function listTasks(maestriDir) {
  return loadTasks(maestriDir);
}

/**
 * Comando: claim <id> <agent>
 */
export async function claimTask(maestriDir, taskId, agent, options = {}) {
  return withLock(maestriDir, async () => {
    const tasks = loadTasks(maestriDir);
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      throw new Error(`Tarefa ${taskId} não encontrada.`);
    }

    const now = Date.now();
    const isCurrentlyClaimed =
      task.status === "em_andamento" &&
      task.responsavel &&
      task.lease_ate &&
      new Date(task.lease_ate).getTime() > now;

    if (isCurrentlyClaimed && task.responsavel !== agent) {
      throw new Error(
        `Tarefa ${taskId} já está reservada por ${task.responsavel} até ${task.lease_ate}.`
      );
    }

    const leaseAte = new Date(now + LEASE_DURATION_MS).toISOString();
    task.status = "em_andamento";
    task.responsavel = agent;
    task.lease_ate = leaseAte;

    saveTasks(maestriDir, tasks);

    appendEvent(maestriDir, {
      event_id: options.eventId,
      type: "claim",
      task: taskId,
      agent,
    });

    removeStatusFile(maestriDir, taskId, "BLOCKED");
    updateStatusFile(
      maestriDir,
      taskId,
      "heartbeat",
      `data: ${new Date().toISOString()}\npasso: Reserva adquirida\ncomando: claim ${taskId} ${agent}\nresponsavel: ${agent}\nlease_ate: ${leaseAte}\n`
    );

    return task;
  });
}

/**
 * Comando: heartbeat <id>
 */
export async function heartbeatTask(maestriDir, taskId, options = {}) {
  return withLock(maestriDir, async () => {
    const tasks = loadTasks(maestriDir);
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      throw new Error(`Tarefa ${taskId} não encontrada.`);
    }

    const now = Date.now();
    const leaseAte = new Date(now + LEASE_DURATION_MS).toISOString();
    task.lease_ate = leaseAte;

    saveTasks(maestriDir, tasks);

    appendEvent(maestriDir, {
      event_id: options.eventId,
      type: "heartbeat",
      task: taskId,
      agent: task.responsavel || "unknown",
    });

    updateStatusFile(
      maestriDir,
      taskId,
      "heartbeat",
      `data: ${new Date().toISOString()}\npasso: Heartbeat renovado\ncomando: heartbeat ${taskId}\nresponsavel: ${task.responsavel || "unknown"}\nlease_ate: ${leaseAte}\n`
    );

    return task;
  });
}

/**
 * Comando: block <id> <motivo>
 */
export async function blockTask(maestriDir, taskId, reason, options = {}) {
  return withLock(maestriDir, async () => {
    const tasks = loadTasks(maestriDir);
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      throw new Error(`Tarefa ${taskId} não encontrada.`);
    }

    task.status = "bloqueada";
    task.lease_ate = null;

    saveTasks(maestriDir, tasks);

    appendEvent(maestriDir, {
      event_id: options.eventId,
      type: "block",
      task: taskId,
      reason,
      agent: task.responsavel || "unknown",
    });

    updateStatusFile(maestriDir, taskId, "BLOCKED", `${reason}\n`);

    return task;
  });
}

/**
 * Comando: review <id> <pr>
 */
export async function reviewTask(maestriDir, taskId, prUrl, options = {}) {
  return withLock(maestriDir, async () => {
    const tasks = loadTasks(maestriDir);
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      throw new Error(`Tarefa ${taskId} não encontrada.`);
    }

    task.status = "para_revisao";
    task.pr = prUrl;

    saveTasks(maestriDir, tasks);

    appendEvent(maestriDir, {
      event_id: options.eventId,
      type: "review",
      task: taskId,
      pr: prUrl,
      agent: task.responsavel || "unknown",
    });

    return task;
  });
}

/**
 * Comando: done <id>
 */
export async function doneTask(maestriDir, taskId, options = {}) {
  return withLock(maestriDir, async () => {
    const tasks = loadTasks(maestriDir);
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      throw new Error(`Tarefa ${taskId} não encontrada.`);
    }

    task.status = "entregue";
    task.lease_ate = null;

    saveTasks(maestriDir, tasks);

    appendEvent(maestriDir, {
      event_id: options.eventId,
      type: "done",
      task: taskId,
      agent: task.responsavel || "unknown",
      pr: task.pr || null,
    });

    const donePath = path.join(maestriDir, "status", taskId, "DONE");
    const doneContent = `PR: ${task.pr || "N/A"}\nEntregue em: ${new Date().toISOString()}\n`;

    if (fs.existsSync(donePath)) {
      fs.appendFileSync(donePath, doneContent, "utf8");
    } else {
      updateStatusFile(maestriDir, taskId, "DONE", doneContent);
    }

    return task;
  });
}

/**
 * Comando: release <id>
 */
export async function releaseTask(maestriDir, taskId, options = {}) {
  return withLock(maestriDir, async () => {
    const tasks = loadTasks(maestriDir);
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      throw new Error(`Tarefa ${taskId} não encontrada.`);
    }

    const previousAgent = task.responsavel;
    task.status = "backlog";
    task.responsavel = null;
    task.lease_ate = null;

    saveTasks(maestriDir, tasks);

    appendEvent(maestriDir, {
      event_id: options.eventId,
      type: "release",
      task: taskId,
      agent: previousAgent || "unknown",
    });

    return task;
  });
}

/**
 * Execução CLI
 */
async function runCli() {
  const args = process.argv.slice(2);
  let customHome = null;
  let eventId = null;

  // Processa opções opcionais
  const filteredArgs = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--home" && args[i + 1]) {
      customHome = args[i + 1];
      i++;
    } else if (args[i] === "--event-id" && args[i + 1]) {
      eventId = args[i + 1];
      i++;
    } else {
      filteredArgs.push(args[i]);
    }
  }

  const maestriDir = getMaestriDir(customHome);
  const command = filteredArgs[0];

  try {
    switch (command) {
      case "list": {
        const tasks = await listTasks(maestriDir);
        console.table(
          tasks.map((t) => ({
            ID: t.id,
            Titulo: t.titulo?.slice(0, 32),
            Onda: t.onda,
            Status: t.status,
            Responsavel: t.responsavel || "-",
            LeaseAte: t.lease_ate || "-",
            Branch: t.branch || "-",
            PR: t.pr || "-",
          }))
        );
        break;
      }
      case "claim": {
        const [, taskId, agent] = filteredArgs;
        if (!taskId || !agent) {
          console.error("Uso: maestri-task claim <id> <agent>");
          process.exit(1);
        }
        const updated = await claimTask(maestriDir, taskId, agent, { eventId });
        console.log(
          `Tarefa ${taskId} reservada com sucesso para ${agent} até ${updated.lease_ate}`
        );
        break;
      }
      case "heartbeat": {
        const [, taskId] = filteredArgs;
        if (!taskId) {
          console.error("Uso: maestri-task heartbeat <id>");
          process.exit(1);
        }
        const updated = await heartbeatTask(maestriDir, taskId, { eventId });
        console.log(
          `Heartbeat renovado para ${taskId} até ${updated.lease_ate}`
        );
        break;
      }
      case "block": {
        const [, taskId, ...reasonParts] = filteredArgs;
        const reason = reasonParts.join(" ");
        if (!taskId || !reason) {
          console.error("Uso: maestri-task block <id> <motivo>");
          process.exit(1);
        }
        await blockTask(maestriDir, taskId, reason, { eventId });
        console.log(`Tarefa ${taskId} marcada como bloqueada: ${reason}`);
        break;
      }
      case "review": {
        const [, taskId, prUrl] = filteredArgs;
        if (!taskId || !prUrl) {
          console.error("Uso: maestri-task review <id> <pr>");
          process.exit(1);
        }
        await reviewTask(maestriDir, taskId, prUrl, { eventId });
        console.log(`Tarefa ${taskId} enviada para revisão com PR: ${prUrl}`);
        break;
      }
      case "done": {
        const [, taskId] = filteredArgs;
        if (!taskId) {
          console.error("Uso: maestri-task done <id>");
          process.exit(1);
        }
        await doneTask(maestriDir, taskId, { eventId });
        console.log(`Tarefa ${taskId} marcada como entregue.`);
        break;
      }
      case "release": {
        const [, taskId] = filteredArgs;
        if (!taskId) {
          console.error("Uso: maestri-task release <id>");
          process.exit(1);
        }
        await releaseTask(maestriDir, taskId, { eventId });
        console.log(`Reserva da tarefa ${taskId} liberada.`);
        break;
      }
      default: {
        console.log(`Uso: scripts/maestri-task.mjs <comando> [argumentos]
Comandos:
  list                  Lista todas as tarefas e seus estados
  claim <id> <agent>    Reserva uma tarefa para um agente com lease de 15 min
  heartbeat <id>        Renova o lease da tarefa por mais 15 min
  block <id> <motivo>   Marca a tarefa como bloqueada com o motivo
  review <id> <pr>      Marca a tarefa como para revisão associando o PR
  done <id>             Marca a tarefa como entregue
  release <id>          Libera a reserva da tarefa de volta para o backlog
Opções:
  --home <dir>          Caminho customizado da pasta .maestri
  --event-id <uuid>     ID único de evento para garantir idempotência`);
        process.exit(command ? 1 : 0);
      }
    }
  } catch (err) {
    console.error(`Erro: ${err.message}`);
    process.exit(1);
  }
}

const isDirectRun =
  process.argv[1] &&
  (process.argv[1] === fileURLToPath(import.meta.url) ||
    process.argv[1].endsWith("maestri-task.mjs"));

if (isDirectRun) {
  runCli();
}
