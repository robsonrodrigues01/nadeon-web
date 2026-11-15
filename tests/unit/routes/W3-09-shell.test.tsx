import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const pages = [
  "app/(human)/human/page.tsx",
  "app/(human)/human/shop/page.tsx",
  "app/(human)/human/products/[slug]/page.tsx",
  "app/(pet)/pet/page.tsx",
  "app/(pet)/pet/dogs/page.tsx",
];

describe("W3-09 route shell", () => {
  it("leaves one announcement bar and header to the Human/Pet layouts", () => {
    for (const path of pages) {
      const source = readFileSync(path, "utf8");
      expect(source).not.toMatch(/<AnnouncementBar\b/);
      expect(source).not.toMatch(/<Header\b/);
    }
  });
});
