import { afterEach, describe, expect, it, vi } from "vitest";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { MockFormsProvider } from "@/lib/providers/mock/forms";

describe("W3-28 mock form logging", () => {
  afterEach(() => vi.restoreAllMocks());

  it("refuses a configured log path outside the .maestri/logs root", async () => {
    const tempRoot = mkdtempSync(path.join(tmpdir(), "nadeon-forms-root-"));
    const outsidePath = path.join(
      tmpdir(),
      `forms-outside-${Date.now()}.jsonl`
    );
    const previousLogPath = process.env.FORMS_MOCK_LOG;
    vi.spyOn(process, "cwd").mockReturnValue(tempRoot);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    process.env.FORMS_MOCK_LOG = outsidePath;

    try {
      const provider = new MockFormsProvider();
      await provider.sendContact({
        name: "Private Person",
        email: "private@example.test",
        topic: "support",
        message: "Private message body",
      });
      expect(existsSync(outsidePath)).toBe(false);
    } finally {
      if (previousLogPath === undefined) delete process.env.FORMS_MOCK_LOG;
      else process.env.FORMS_MOCK_LOG = previousLogPath;
      rmSync(outsidePath, { force: true });
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it("does not create a directory through a symbolic link at the log root", async () => {
    const tempRoot = mkdtempSync(path.join(tmpdir(), "nadeon-forms-symlink-"));
    const maestriDir = path.join(tempRoot, ".maestri");
    const externalTarget = path.join(tempRoot, "external-target");
    mkdirSync(maestriDir);
    symlinkSync(externalTarget, path.join(maestriDir, "logs"), "dir");
    const previousLogPath = process.env.FORMS_MOCK_LOG;
    vi.spyOn(process, "cwd").mockReturnValue(tempRoot);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    delete process.env.FORMS_MOCK_LOG;

    try {
      await new MockFormsProvider().sendContact({
        name: "Private Person",
        email: "private@example.test",
        topic: "support",
        message: "Private message body",
      });
      expect(existsSync(externalTarget)).toBe(false);
    } finally {
      if (previousLogPath === undefined) delete process.env.FORMS_MOCK_LOG;
      else process.env.FORMS_MOCK_LOG = previousLogPath;
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it("does not create the log root through a symbolic .maestri parent", async () => {
    const tempRoot = mkdtempSync(
      path.join(tmpdir(), "nadeon-maestri-symlink-")
    );
    const externalDirectory = path.join(tempRoot, "external");
    mkdirSync(externalDirectory);
    symlinkSync(externalDirectory, path.join(tempRoot, ".maestri"), "dir");
    const previousLogPath = process.env.FORMS_MOCK_LOG;
    vi.spyOn(process, "cwd").mockReturnValue(tempRoot);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    delete process.env.FORMS_MOCK_LOG;

    try {
      await new MockFormsProvider().sendContact({
        name: "Private Person",
        email: "private@example.test",
        topic: "support",
        message: "Private message body",
      });
      expect(existsSync(path.join(externalDirectory, "logs"))).toBe(false);
    } finally {
      if (previousLogPath === undefined) delete process.env.FORMS_MOCK_LOG;
      else process.env.FORMS_MOCK_LOG = previousLogPath;
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it("records only timestamp, type, and generated ID without personal data", async () => {
    const tempRoot = mkdtempSync(path.join(tmpdir(), "nadeon-forms-"));
    vi.spyOn(process, "cwd").mockReturnValue(tempRoot);
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    try {
      const provider = new MockFormsProvider();
      const result = await provider.sendContact({
        name: "Private Person",
        email: "private@example.test",
        topic: "support",
        message: "Private message body",
      });
      await provider.trackEvent("event", "private@example.test", {
        message: "Private analytics body",
      });

      const consoleOutput = JSON.stringify(log.mock.calls);
      const file = path.join(tempRoot, ".maestri/logs/forms-mock.jsonl");
      const entries = readFileSync(file, "utf8")
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line));
      expect(consoleOutput).not.toContain("Private Person");
      expect(consoleOutput).not.toContain("private@example.test");
      expect(consoleOutput).not.toContain("Private message body");
      expect(consoleOutput).not.toContain("Private analytics body");
      expect(entries).toHaveLength(2);
      expect(entries[0]).toEqual({
        timestamp: expect.any(String),
        formType: "contact",
        id: result.id,
      });
      expect(entries[1]).toMatchObject({
        timestamp: expect.any(String),
        formType: "track_event",
        id: expect.any(String),
      });
      expect(JSON.stringify(entries)).not.toContain("private@example.test");
      expect(JSON.stringify(entries)).not.toContain("Private message body");
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
