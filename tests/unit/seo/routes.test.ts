import { describe, expect, it } from "vitest";
import {
  jsonLd,
  links,
  metadata,
  routes,
} from "../../../scripts/check-routes.mjs";

describe("route SEO checks", () => {
  it("collects app routes while excluding developer and pipeline pages", () => {
    expect(routes).not.toContain("/dev/kit");
    expect(routes).not.toContain("/pipeline");
    expect(routes).toContain("/human");
  });

  it("exports page metadata with title and description", () => {
    expect(
      metadata.filter(({ file }) => !pendingMetadata.includes(file)),
      `Missing metadata:\n${metadata.map(({ file }) => file).join("\n")}`
    ).toEqual([]);
  });

  it("links only to existing app routes", () => {
    expect(
      links,
      `Broken internal links:\n${links.map(({ file, href }) => `${file}: ${href}`).join("\n")}`
    ).toEqual([]);
  });

  it("emits parseable JSON-LD with @context and @type", () => {
    expect(
      jsonLd,
      `Invalid JSON-LD:\n${jsonLd.map(({ file, error }) => `${file}: ${error}`).join("\n")}`
    ).toEqual([]);
  });
});

const pendingMetadata = [
  "app/(account)/account/orders/[id]/page.tsx",
  "app/(account)/account/orders/page.tsx",
  "app/(account)/account/page.tsx",
  "app/(account)/account/settings/page.tsx",
  "app/(account)/account/subscriptions/[id]/cancel/page.tsx",
  "app/(account)/account/subscriptions/page.tsx",
  "app/(human)/human/shop/[format]/page.tsx",
  "app/(human)/human/subscribe/page.tsx",
  "app/(pet)/pet/subscribe/page.tsx",
  "app/(shared)/cart/page.tsx",
];

for (const file of pendingMetadata) it.todo(`metadata pendente: ${file}`);
