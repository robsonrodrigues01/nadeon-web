"use client";

import React, { useState, useMemo } from "react";

export interface Task {
  id: string;
  titulo: string;
  onda: number;
  papel: string;
  preset: string;
  depende_de: string[];
  status:
    "backlog" | "em_andamento" | "para_revisao" | "entregue" | "bloqueada";
  responsavel: string | null;
  revisor?: string | null;
  lease_ate: string | null;
  branch: string | null;
  pr: string | null;
  criterios: string;
  bloqueio?: string | null;
}

export interface PipelineEvent {
  event_id: string;
  ts: string;
  type: string;
  task?: string;
  agent?: string;
  preset?: string;
  reason?: string;
  pr?: string;
  note?: string;
}

interface PipelineDashboardProps {
  tasks: Task[];
  events: PipelineEvent[];
}

const COLUMNS: { key: Task["status"] | "all"; title: string; color: string }[] =
  [
    {
      key: "backlog",
      title: "Backlog",
      color: "border-zinc-300 dark:border-zinc-700",
    },
    { key: "em_andamento", title: "Em andamento", color: "border-blue-500/50" },
    {
      key: "para_revisao",
      title: "Para revisão",
      color: "border-amber-500/50",
    },
    { key: "entregue", title: "Entregue", color: "border-emerald-500/50" },
  ];

export function PipelineDashboard({ tasks, events }: PipelineDashboardProps) {
  const [selectedOnda, setSelectedOnda] = useState<string>("all");
  const [selectedPapel, setSelectedPapel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Opções únicas de onda e papel
  const ondas = useMemo(() => {
    const set = new Set(tasks.map((t) => String(t.onda)));
    return Array.from(set).sort();
  }, [tasks]);

  const papeis = useMemo(() => {
    const set = new Set(tasks.map((t) => t.papel));
    return Array.from(set).sort();
  }, [tasks]);

  // Filtragem das tarefas
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (selectedOnda !== "all" && String(t.onda) !== selectedOnda)
        return false;
      if (selectedPapel !== "all" && t.papel !== selectedPapel) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches =
          t.id.toLowerCase().includes(query) ||
          t.titulo.toLowerCase().includes(query) ||
          (t.responsavel && t.responsavel.toLowerCase().includes(query)) ||
          t.papel.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    });
  }, [tasks, selectedOnda, selectedPapel, searchQuery]);

  // Agrupamento por coluna Kanban
  // Tarefas com status 'bloqueada' aparecem na coluna 'Em andamento' com badge de bloqueio destacado
  const tasksByColumn = useMemo(() => {
    const map: Record<string, Task[]> = {
      backlog: [],
      em_andamento: [],
      para_revisao: [],
      entregue: [],
    };

    for (const t of filteredTasks) {
      if (t.status === "bloqueada") {
        map.em_andamento.push(t);
      } else if (map[t.status]) {
        map[t.status].push(t);
      } else {
        map.backlog.push(t);
      }
    }
    return map;
  }, [filteredTasks]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10 font-sans">
      {/* Header */}
      <header className="mb-8 border-b border-zinc-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Painel Maestri Pipeline
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              Live
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Monitoramento em tempo real do estado das tarefas e eventos dos
            agentes autônomos.
          </p>
        </div>

        {/* Resumo rápido */}
        <div className="flex items-center gap-4 text-xs">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-center">
            <span className="block text-zinc-400">Total</span>
            <strong className="text-base font-semibold text-white">
              {tasks.length}
            </strong>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-center">
            <span className="block text-blue-400">Em andamento</span>
            <strong className="text-base font-semibold text-blue-400">
              {tasks.filter((t) => t.status === "em_andamento").length}
            </strong>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-center">
            <span className="block text-rose-400">Bloqueadas</span>
            <strong className="text-base font-semibold text-rose-400">
              {tasks.filter((t) => t.status === "bloqueada").length}
            </strong>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-center">
            <span className="block text-emerald-400">Entregues</span>
            <strong className="text-base font-semibold text-emerald-400">
              {tasks.filter((t) => t.status === "entregue").length}
            </strong>
          </div>
        </div>
      </header>

      {/* Barra de Filtros */}
      <section
        aria-label="Filtros do Kanban"
        className="mb-8 flex flex-wrap items-center gap-4 bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label
            htmlFor="filter-onda"
            className="text-xs font-medium text-zinc-400"
          >
            Onda:
          </label>
          <select
            id="filter-onda"
            value={selectedOnda}
            onChange={(e) => setSelectedOnda(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-xs text-white rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">Todas as ondas</option>
            {ondas.map((o) => (
              <option key={o} value={o}>
                Onda {o}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label
            htmlFor="filter-papel"
            className="text-xs font-medium text-zinc-400"
          >
            Papel:
          </label>
          <select
            id="filter-papel"
            value={selectedPapel}
            onChange={(e) => setSelectedPapel(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-xs text-white rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">Todos os papéis</option>
            {papeis.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 min-w-[200px]">
          <label
            htmlFor="search-task"
            className="text-xs font-medium text-zinc-400"
          >
            Busca:
          </label>
          <input
            id="search-task"
            type="search"
            placeholder="Filtrar por id, título, agente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-xs text-white placeholder-zinc-500 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {(selectedOnda !== "all" || selectedPapel !== "all" || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedOnda("all");
              setSelectedPapel("all");
              setSearchQuery("");
            }}
            className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
          >
            Limpar filtros
          </button>
        )}
      </section>

      {/* Kanban Board */}
      <section aria-label="Quadro Kanban de Tarefas" className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLUMNS.map((col) => {
            const columnTasks = tasksByColumn[col.key] || [];
            return (
              <div
                key={col.key}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex flex-col min-h-[500px]"
              >
                {/* Cabeçalho da coluna */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
                  <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
                    {col.title}
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Lista de cards */}
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {columnTasks.length === 0 ? (
                    <div className="h-32 flex items-center justify-center border border-dashed border-zinc-800 rounded-lg text-xs text-zinc-500">
                      Nenhuma tarefa
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <article
                        key={task.id}
                        className={`p-4 rounded-lg bg-zinc-900 border transition-all hover:border-zinc-600 ${
                          task.status === "bloqueada"
                            ? "border-rose-700/80 bg-rose-950/20"
                            : "border-zinc-800"
                        }`}
                      >
                        {/* ID e Onda */}
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-mono font-bold text-amber-400">
                            {task.id}
                          </span>
                          <span className="text-zinc-500">
                            Onda {task.onda}
                          </span>
                        </div>

                        {/* Título */}
                        <h3 className="text-sm font-semibold text-zinc-100 leading-snug mb-2">
                          {task.titulo}
                        </h3>

                        {/* Papel e Preset */}
                        <div className="text-xs text-zinc-400 mb-3 space-y-1">
                          <div>
                            <span className="text-zinc-500">Papel:</span>{" "}
                            {task.papel}
                          </div>
                          <div>
                            <span className="text-zinc-500">Preset:</span>{" "}
                            {task.preset}
                          </div>
                        </div>

                        {/* Dependências */}
                        {task.depende_de && task.depende_de.length > 0 && (
                          <div className="text-xs text-zinc-400 mb-2 flex items-center gap-1.5 flex-wrap">
                            <span className="text-zinc-500">Depende de:</span>
                            {task.depende_de.map((dep) => (
                              <span
                                key={dep}
                                className="font-mono text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded"
                              >
                                {dep}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Alerta de Bloqueio */}
                        {(task.status === "bloqueada" || task.bloqueio) && (
                          <div className="mt-2 p-2 rounded bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs">
                            <strong className="block text-rose-200 mb-0.5">
                              Bloqueada:
                            </strong>
                            <p className="line-clamp-2 text-[11px]">
                              {task.bloqueio || "Bloqueio registrado."}
                            </p>
                          </div>
                        )}

                        {/* Rodapé do card: Responsável, Lease e Links */}
                        <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="font-medium text-zinc-300">
                              {task.responsavel || "Não atribuído"}
                            </span>
                            {task.revisor && (
                              <span className="text-amber-400">
                                · revisor {task.revisor}
                              </span>
                            )}
                          </div>

                          {task.pr && (
                            <a
                              href={task.pr}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-400 hover:text-amber-300 underline font-mono"
                            >
                              PR
                            </a>
                          )}
                        </div>

                        {task.lease_ate && task.status === "em_andamento" && (
                          <div
                            suppressHydrationWarning
                            className="mt-1 text-[10px] text-zinc-500 font-mono"
                          >
                            Lease até {task.lease_ate.slice(11, 16)} UTC
                          </div>
                        )}
                      </article>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Seção dos Últimos 50 Eventos */}
      <section
        aria-label="Últimos Eventos"
        className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
          <div>
            <h2 className="text-lg font-bold text-white">Últimos 50 Eventos</h2>
            <p className="text-xs text-zinc-400">
              Histórico auditável e cronológico das mudanças de estado do
              pipeline.
            </p>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            {events.length} {events.length === 1 ? "evento" : "eventos"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-800/60 text-zinc-400 font-medium border-b border-zinc-700/50">
              <tr>
                <th scope="col" className="py-2.5 px-3">
                  Data/Hora
                </th>
                <th scope="col" className="py-2.5 px-3">
                  Tipo
                </th>
                <th scope="col" className="py-2.5 px-3">
                  Tarefa
                </th>
                <th scope="col" className="py-2.5 px-3">
                  Agente
                </th>
                <th scope="col" className="py-2.5 px-3">
                  Detalhes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-zinc-500">
                    Nenhum evento registrado até o momento.
                  </td>
                </tr>
              ) : (
                events.map((ev, i) => {
                  let badgeColor = "bg-zinc-800 text-zinc-300";
                  if (ev.type === "claim")
                    badgeColor =
                      "bg-blue-950 text-blue-400 border border-blue-800";
                  else if (ev.type === "done")
                    badgeColor =
                      "bg-emerald-950 text-emerald-400 border border-emerald-800";
                  else if (ev.type === "block")
                    badgeColor =
                      "bg-rose-950 text-rose-400 border border-rose-800";
                  else if (ev.type === "review")
                    badgeColor =
                      "bg-amber-950 text-amber-400 border border-amber-800";
                  else if (ev.type === "heartbeat")
                    badgeColor = "bg-zinc-800 text-zinc-400";

                  return (
                    <tr
                      key={`${ev.event_id ?? ev.ts}-${i}`}
                      className="hover:bg-zinc-800/30"
                    >
                      <td
                        suppressHydrationWarning
                        className="py-2.5 px-3 font-mono text-zinc-400 whitespace-nowrap"
                      >
                        {ev.ts
                          ? ev.ts.replace("T", " ").slice(0, 19) + " UTC"
                          : "-"}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${badgeColor}`}
                        >
                          {ev.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-400">
                        {ev.task || "-"}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-zinc-200">
                        {ev.agent || "-"}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-400 max-w-md truncate">
                        {ev.reason ||
                          ev.pr ||
                          ev.note ||
                          (ev.preset ? `Preset: ${ev.preset}` : "-")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
