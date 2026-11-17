import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderToString } from "react-dom/server";
import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import DevKitPage from "@/app/(shared)/dev/kit/page";

const mockNotFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

// Server components are async functions and renderToString cannot run them, so
// resolve only async components here. Sync (client) components are left as
// elements for React to render, as they are in Next.
function isAsyncComponent(
  type: unknown
): type is (props: unknown) => Promise<ReactNode> {
  return (
    typeof type === "function" &&
    (type as { constructor?: { name?: string } }).constructor?.name ===
      "AsyncFunction"
  );
}

async function resolveServerComponents(node: ReactNode): Promise<ReactNode> {
  if (Array.isArray(node)) {
    return Promise.all(node.map(resolveServerComponents));
  }
  if (!isValidElement<{ children?: ReactNode }>(node)) return node;
  if (isAsyncComponent(node.type)) {
    return resolveServerComponents(await node.type(node.props));
  }
  if (node.props.children === undefined) return node;
  return cloneElement(node, {
    children: await resolveServerComponents(node.props.children),
  });
}

async function renderPage(jsx: ReactElement): Promise<string> {
  return renderToString((await resolveServerComponents(jsx)) as ReactElement);
}

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
    delete process.env.CONTEXT;
    delete process.env.DEV_KIT;

    await expect(DevKitPage()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalledTimes(1);
  });

  it("returns 404 in production even with preview and DEV_KIT flags", async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    process.env.CONTEXT = "deploy-preview";
    process.env.DEV_KIT = "1";

    await expect(DevKitPage()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalledTimes(1);
  });

  it("allows the dev kit in a Netlify deploy preview", async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "test";
    process.env.CONTEXT = "deploy-preview";
    delete process.env.DEV_KIT;

    const jsx = await DevKitPage();
    expect(jsx).toBeDefined();
    expect(mockNotFound).not.toHaveBeenCalled();
  });

  it("renders successfully in development mode with both themes, typography scale, tokens, and components", async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV =
      "development";
    delete process.env.CONTEXT;

    const jsx = await DevKitPage();
    expect(jsx).toBeDefined();
    expect(mockNotFound).not.toHaveBeenCalled();

    const html = await renderPage(jsx);

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
