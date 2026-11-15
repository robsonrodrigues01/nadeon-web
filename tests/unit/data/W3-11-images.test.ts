import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const productsDirectory = path.resolve(process.cwd(), "data/products");
const rendersDirectory = path.resolve(process.cwd(), "public/renders");

function productsFrom(file: string) {
  const data = JSON.parse(
    fs.readFileSync(path.join(productsDirectory, file), "utf8")
  );
  return Array.isArray(data) ? data : data.products;
}

describe("W3-11 product images", () => {
  it("points every product to its render or the shared neutral placeholder", () => {
    for (const file of fs
      .readdirSync(productsDirectory)
      .filter((name) => name.endsWith(".json"))) {
      for (const product of productsFrom(file)) {
        const hasRender = fs.existsSync(
          path.join(rendersDirectory, `${product.slug}.png`)
        );
        expect(product.images).toEqual([
          hasRender
            ? `/renders/${product.slug}.png`
            : "/renders/placeholder.svg",
        ]);
      }
    }
    expect(fs.existsSync(path.join(rendersDirectory, "placeholder.svg"))).toBe(
      true
    );
  });
});
