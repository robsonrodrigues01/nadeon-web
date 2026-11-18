import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const roots = ["app", "components"];
const extensions = [".tsx", ".jsx", ".ts", ".js"];

function sourceFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(entryPath);
    return /\.(tsx|jsx|ts|js)$/.test(entry.name) ? [entryPath] : [];
  });
}

function importSpecifiers(source: string): string[] {
  const imports = [
    ...source.matchAll(
      /^\s*(?:import|export)\s+(?:[\s\S]*?\s+from\s*)?["']([^"']+)["']/gm
    ),
    ...source.matchAll(/\bimport\(\s*["']([^"']+)["']\s*\)/g),
  ];
  return imports.map((match) => match[1]);
}

function resolveSource(
  specifier: string,
  importer: string,
  files: Set<string>
): string | null {
  const unresolvedBase = specifier.startsWith("@/")
    ? specifier.slice(2)
    : specifier.startsWith(".")
      ? path.relative(".", path.resolve(path.dirname(importer), specifier))
      : null;
  if (!unresolvedBase) return null;

  const candidates = [
    unresolvedBase,
    ...extensions.map((extension) => unresolvedBase + extension),
    ...extensions.map((extension) =>
      path.join(unresolvedBase, `index${extension}`)
    ),
  ];
  return candidates.find((candidate) => files.has(candidate)) ?? null;
}

function routeModules(route: string, files: string[]): Set<string> {
  const fileSet = new Set(files);
  const modules = new Set<string>();
  const visit = (file: string) => {
    if (modules.has(file)) return;
    modules.add(file);
    const source = fs.readFileSync(file, "utf8");
    for (const specifier of importSpecifiers(source)) {
      const imported = resolveSource(specifier, file, fileSet);
      if (imported) visit(imported);
    }
  };

  visit(route);
  let directory = path.dirname(route);
  while (directory === "app" || directory.startsWith(`app${path.sep}`)) {
    for (const layout of [
      "layout.tsx",
      "layout.jsx",
      "layout.ts",
      "layout.js",
    ]) {
      const candidate = path.join(directory, layout);
      if (fileSet.has(candidate)) visit(candidate);
    }
    if (directory === "app") break;
    directory = path.dirname(directory);
  }
  return modules;
}

describe("W5-28 image usage audit", () => {
  it("requires accessible alt text and responsive image sizing", () => {
    const files = roots.flatMap(sourceFiles);
    const violations: string[] = [];
    const preloadsByFile = new Map<string, number>();

    for (const file of files) {
      const source = fs.readFileSync(file, "utf8");
      if (/<img\b/.test(source)) violations.push(`${file}: use next/image`);
      let preloadedImages = 0;

      for (const image of source.matchAll(/<Image\b([\s\S]*?)\/>/g)) {
        const props = image[1];
        const line = source.slice(0, image.index).split("\n").length;
        const location = `${file}:${line}`;
        const hasAlt = /\balt\s*=/.test(props);
        const hasFill = /\bfill(?:\s|\n|$)/.test(props);
        const hasDimensions =
          /\bwidth\s*=/.test(props) && /\bheight\s*=/.test(props);
        const hasSizes = /\bsizes\s*=/.test(props);

        if (!hasAlt) violations.push(`${location}: missing alt`);
        if (!hasFill && !hasDimensions) {
          violations.push(`${location}: missing fill or width and height`);
        }
        if (!hasSizes) violations.push(`${location}: missing sizes`);
        if (/\b(?:priority|preload)\b/.test(props)) {
          preloadedImages += 1;
          if (!/human\/.*(?:hero|gallery)\.tsx$/.test(file)) {
            violations.push(`${location}: preload must be a route hero image`);
          }
        }
      }
      if (preloadedImages > 1)
        violations.push(`${file}: only one image may preload`);
      preloadsByFile.set(file, preloadedImages);
    }

    const routeFiles = files.filter((file) =>
      /(?:^|\/)page\.(?:tsx|jsx)$/.test(file)
    );
    for (const route of routeFiles) {
      const preloadCount = [...routeModules(route, files)].reduce(
        (count, file) => count + (preloadsByFile.get(file) ?? 0),
        0
      );
      if (preloadCount > 1)
        violations.push(`${route}: only one image may preload per route`);
    }

    expect(violations).toEqual([]);
  });

  // Manual step: preview representative routes in a browser and confirm the preloaded image is visible above the fold.
});
