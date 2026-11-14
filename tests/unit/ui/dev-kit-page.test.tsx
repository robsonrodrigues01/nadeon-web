import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderToString } from "react-dom/server";
import DevKitPage from "@/app/(shared)/dev/kit/page";

const mockNotFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("next/navigation", () => ({
  notFound: () => mockNotFound(),
}));

describe("/dev/kit Page", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("throws notFound() in production mode when not in preview", async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    delete process.env.VERCEL_ENV;
    delete process.env.DEV_KIT;

    await expect(DevKitPage()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalledTimes(1);
  });

  it("allows access in preview mode even with NODE_ENV=production", async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    process.env.VERCEL_ENV = "preview";

    const jsx = await DevKitPage();
    expect(jsx).toBeDefined();
    expect(mockNotFound).not.toHaveBeenCalled();
  });

  it("renders successfully in development mode with both themes, typography scale, tokens, and components", async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV =
      "development";
    delete process.env.VERCEL_ENV;

    const jsx = await DevKitPage();
    expect(jsx).toBeDefined();
    expect(mockNotFound).not.toHaveBeenCalled();

    const html = renderToString(jsx);

    // Themes side-by-side
    expect(html).toContain('data-theme="human"');
    expect(html).toContain('data-theme="pet"');

    // Typographic scale
    expect(html).toContain("hero");
    expect(html).toContain("title");
    expect(html).toContain("lead");
    expect(html).toContain("body");
    expect(html).toContain("label");

    // Token palette & product colors
    expect(html).toContain("--product-amber");
    expect(html).toContain("--product-coral");
    expect(html).toContain("--product-lilac");
    expect(html).toContain("--gradient-gold");

    // Button variants and states
    expect(html).toContain("bg-gradient-gold");
    expect(html).toContain("border-2");
    expect(html).toContain("underline");

    // Products from mock CatalogProvider
    expect(html).toContain("BioHack");
    expect(html).toContain("More Good Years");
    expect(html).toContain("$65.00");
    expect(html).toContain("$44.00");
  });
});
