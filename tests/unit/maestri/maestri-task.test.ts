import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {
  claimTask,
  heartbeatTask,
  blockTask,
  reviewTask,
  doneTask,
  releaseTask,
  appendEvent,
  loadTasks,
  saveTasks,
  listTasks,
} from "../../../scripts/maestri-task.mjs";

describe("maestri-task CLI e reserva atômica", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "maestri-test-"));
    const initialTasks = [
      {
        id: "W0-07",
        titulo: "Primeira tarefa real pelo fluxo completo",
        onda: 0,
        papel: "Frontend",
        preset: "Gemini 3.8 Flash (AGY)",
        depende_de: ["W0-02", "W0-03", "W0-04", "W0-05", "W0-06"],
        status: "backlog",
        responsavel: null,
        lease_ate: null,
        branch: "agy/W0-07",
        pr: null,
        criterios: "PR revisado e CI verde.",
      },
    ];
    saveTasks(tmpDir, initialTasks);
  });

  afterEach(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it("duas reservas simultâneas da mesma tarefa, só uma vence", async () => {
    const results = await Promise.allSettled([
      claimTask(tmpDir, "W0-07", "AgentA"),
      claimTask(tmpDir, "W0-07", "AgentB"),
    ]);

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);

    const tasks = loadTasks(tmpDir);
    const task = tasks.find((t: { id: string }) => t.id === "W0-07");
    expect(task.status).toBe("em_andamento");
    expect(["AgentA", "AgentB"]).toContain(task.responsavel);
  });

  it("lease vencido libera a tarefa para nova reserva", async () => {
    // Simula tarefa com lease no passado (expirado)
    const expiredLease = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const tasks = loadTasks(tmpDir);
    tasks[0].status = "em_andamento";
    tasks[0].responsavel = "AgentOld";
    tasks[0].lease_ate = expiredLease;
    saveTasks(tmpDir, tasks);

    // AgentNew deve conseguir reservar porque o lease expirou
    const updated = await claimTask(tmpDir, "W0-07", "AgentNew");

    expect(updated.status).toBe("em_andamento");
    expect(updated.responsavel).toBe("AgentNew");
    expect(new Date(updated.lease_ate).getTime()).toBeGreaterThan(Date.now());
  });

  it("evento duplicado não duplica no log de eventos", () => {
    const eventId = "unique-event-id-12345";
    const firstRes = appendEvent(tmpDir, {
      event_id: eventId,
      type: "claim",
      task: "W0-07",
      agent: "AgentA",
    });
    expect(firstRes.appended).toBe(true);

    const secondRes = appendEvent(tmpDir, {
      event_id: eventId,
      type: "claim",
      task: "W0-07",
      agent: "AgentA",
    });
    expect(secondRes.appended).toBe(false);

    const eventsFile = path.join(tmpDir, "logs", "events.jsonl");
    const lines = fs
      .readFileSync(eventsFile, "utf8")
      .split("\n")
      .filter((l) => l.trim().length > 0);

    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0]);
    expect(parsed.event_id).toBe(eventId);
  });

  it("executa ciclo de vida: heartbeat, block, review, done e release", async () => {
    await claimTask(tmpDir, "W0-07", "AgentCycle");

    // heartbeat
    const hb = await heartbeatTask(tmpDir, "W0-07");
    expect(new Date(hb.lease_ate).getTime()).toBeGreaterThan(Date.now());

    // block
    const blocked = await blockTask(tmpDir, "W0-07", "Depende de W0-06");
    expect(blocked.status).toBe("bloqueada");
    expect(blocked.lease_ate).toBeNull();
    const blockedFile = path.join(tmpDir, "status", "W0-07", "BLOCKED");
    expect(fs.existsSync(blockedFile)).toBe(true);

    // review
    const reviewed = await reviewTask(
      tmpDir,
      "W0-07",
      "https://github.com/pull/1"
    );
    expect(reviewed.status).toBe("para_revisao");
    expect(reviewed.pr).toBe("https://github.com/pull/1");

    // done
    const done = await doneTask(tmpDir, "W0-07");
    expect(done.status).toBe("entregue");
    expect(done.lease_ate).toBeNull();
    const doneFile = path.join(tmpDir, "status", "W0-07", "DONE");
    expect(fs.existsSync(doneFile)).toBe(true);

    // release
    const released = await releaseTask(tmpDir, "W0-07");
    expect(released.status).toBe("backlog");
    expect(released.responsavel).toBeNull();

    // list
    const list = await listTasks(tmpDir);
    expect(list).toHaveLength(1);
  });

  it("done preserva o conteúdo anterior do arquivo DONE se já existir", async () => {
    await claimTask(tmpDir, "W0-07", "AgentAuthor");

    const statusDir = path.join(tmpDir, "status", "W0-07");
    fs.mkdirSync(statusDir, { recursive: true });
    const initialDoneContent = "SHA: 1234567\npnpm verify: ok\n";
    fs.writeFileSync(path.join(statusDir, "DONE"), initialDoneContent, "utf8");

    await doneTask(tmpDir, "W0-07");

    const donePath = path.join(statusDir, "DONE");
    const finalContent = fs.readFileSync(donePath, "utf8");

    expect(finalContent.startsWith(initialDoneContent)).toBe(true);
    expect(finalContent).toContain("Entregue em:");
  });
});
