import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import nextConfig from "@/next.config";

const read = (p: string) => readFileSync(join(process.cwd(), p), "utf8");

describe("W6-06: código de servidor não vai para o navegador", () => {
  it("client.ts importa só live/browser, nunca live/index", () => {
    const src = read("lib/providers/client.ts");
    expect(src).toMatch(/from "\.\/live\/browser"/);
    expect(src).not.toMatch(/from "\.\/live"\s*;/);
    expect(src).not.toMatch(/from "\.\/live\/index"/);
  });

  it("live/browser.ts não tem Mailyte, chaves nem env de servidor", () => {
    const src = read("lib/providers/live/browser.ts");
    expect(src).not.toMatch(/mailyte/i);
    expect(src).not.toMatch(/API_KEY|process\.env/);
    expect(src).not.toMatch(/from "\.\/index"|from "\."\s*;/);
  });

  it("client.ts decide live/mock por NEXT_PUBLIC_PROVIDERS", () => {
    expect(read("lib/providers/client.ts")).toContain(
      "process.env.NEXT_PUBLIC_PROVIDERS"
    );
  });

  it("next.config não expõe x-powered-by", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });
});
