import { readdirSync } from "node:fs";
import path from "node:path";

/** Server-only: product render slugs present in public/renders (e.g. "biohack" for biohack.png). */
export function listProductRenders(): Set<string> {
  try {
    return new Set(
      readdirSync(path.join(process.cwd(), "public", "renders"))
        .filter((f) => f.endsWith(".png"))
        .map((f) => f.slice(0, -4))
    );
  } catch {
    return new Set();
  }
}
