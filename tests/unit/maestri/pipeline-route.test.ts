import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import PipelinePage from "../../../app/(shared)/pipeline/page";

// Mock do next/navigation
const mockNotFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("next/navigation", () => ({
  notFound: () => mockNotFound(),
}));

describe("Rota /pipeline - Controle de ambiente e renderização", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("em produção sem PIPELINE_DASHBOARD=1, responde com 404 (notFound)", () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    delete process.env.PIPELINE_DASHBOARD;

    expect(() => PipelinePage()).toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalledTimes(1);
  });

  it("em desenvolvimento (NODE_ENV=development), renderiza o painel", () => {
    (process.env as Record<string, string | undefined>).NODE_ENV =
      "development";
    delete process.env.PIPELINE_DASHBOARD;

    const pageElement = PipelinePage();
    expect(pageElement).toBeDefined();
    expect(mockNotFound).not.toHaveBeenCalled();
    expect(pageElement.props.tasks).toBeDefined();
    expect(pageElement.props.tasks.length).toBeGreaterThanOrEqual(7);
  });

  it("em produção com PIPELINE_DASHBOARD=1, responde com 404", () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    process.env.PIPELINE_DASHBOARD = "1";

    expect(() => PipelinePage()).toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalledTimes(1);
  });
});
