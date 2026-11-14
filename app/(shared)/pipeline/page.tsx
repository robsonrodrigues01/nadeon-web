import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { notFound } from "next/navigation";
import { PipelineDashboard, Task, PipelineEvent } from "./pipeline-dashboard";

export const dynamic = "force-dynamic";

function getMaestriDir(): string {
  if (process.env.MAESTRI_HOME) {
    return path.resolve(process.env.MAESTRI_HOME);
  }
  const central =
    "/Users/robsoncoffy/Documents/Nadeon/Website/nadeon-web/.maestri";
  if (fs.existsSync(central)) {
    return central;
  }
  return path.resolve(process.cwd(), ".maestri");
}

function loadPipelineData(): { tasks: Task[]; events: PipelineEvent[] } {
  const maestriDir = getMaestriDir();
  let tasks: Task[] = [];
  const events: PipelineEvent[] = [];

  // Carrega tarefas de pipeline/tasks.json
  const tasksFile = path.join(maestriDir, "pipeline", "tasks.json");
  if (fs.existsSync(tasksFile)) {
    try {
      const content = fs.readFileSync(tasksFile, "utf8");
      tasks = JSON.parse(content);
    } catch {
      tasks = [];
    }
  }

  // Enriquece tarefas com dados da pasta status/ (ex: motivo de bloqueio)
  for (const task of tasks) {
    const blockedFile = path.join(maestriDir, "status", task.id, "BLOCKED");
    if (fs.existsSync(blockedFile)) {
      try {
        task.bloqueio = fs.readFileSync(blockedFile, "utf8").trim();
      } catch {
        task.bloqueio = "Bloqueado";
      }
    }
  }

  // Carrega eventos de logs/events.jsonl (últimos 50 eventos)
  const eventsFile = path.join(maestriDir, "logs", "events.jsonl");
  if (fs.existsSync(eventsFile)) {
    try {
      const content = fs.readFileSync(eventsFile, "utf8");
      const lines = content.split("\n").filter((l) => l.trim().length > 0);
      for (const line of lines) {
        try {
          const ev = JSON.parse(line);
          events.push(ev);
        } catch {
          // Ignora linhas com JSON corrompido
        }
      }
    } catch {
      // Ignora erro de leitura
    }
  }

  // Inverte para exibir os mais recentes primeiro e limita a 50
  const recentEvents = events.reverse().slice(0, 50);

  return { tasks, events: recentEvents };
}

export default function PipelinePage() {
  const isDev = process.env.NODE_ENV === "development";
  const isDashboardEnabled = process.env.PIPELINE_DASHBOARD === "1";

  // Só existe quando NODE_ENV=development ou PIPELINE_DASHBOARD=1; em produção responde 404
  if (!isDev && !isDashboardEnabled) {
    notFound();
  }

  const { tasks, events } = loadPipelineData();

  return <PipelineDashboard tasks={tasks} events={events} />;
}
