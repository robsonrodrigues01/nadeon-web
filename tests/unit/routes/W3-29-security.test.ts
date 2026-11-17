import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import nextConfig from "../../../next.config";
import DevKitPage from "../../../app/(shared)/dev/kit/page";

const notFoundMock = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("next/navigation", () => ({
  notFound: () => notFoundMock(),
}));

describe("W3-29 production security", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("always returns 404 for dev kit in production despite preview flags", async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    process.env.CONTEXT = "deploy-preview";
    process.env.DEV_KIT = "1";
    await expect(DevKitPage()).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("exports production security headers without unsafe-eval", async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    const rules = await nextConfig.headers?.();
    const headers = new Map(
      rules?.[0]?.headers.map(({ key, value }) => [key, value])
    );
    const csp = headers.get("Content-Security-Policy");

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).not.toContain("unsafe-eval");
    expect(headers.get("X-Frame-Options")).toBe("DENY");
    expect(headers.get("Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin"
    );
    expect(headers.get("Permissions-Policy")).toContain("camera=()");
  });

  it("omits CSP in development so Next HMR remains usable", async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV =
      "development";
    const rules = await nextConfig.headers?.();
    expect(
      rules?.[0]?.headers.some(({ key }) => key === "Content-Security-Policy")
    ).toBe(false);
  });
});
