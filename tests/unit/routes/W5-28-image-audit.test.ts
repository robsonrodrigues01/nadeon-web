import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const roots = ["app", "components"];

function sourceFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(entryPath);
    return /\.(tsx|jsx)$/.test(entry.name) ? [entryPath] : [];
  });
}

describe("W5-28 image usage audit", () => {
  it("requires accessible alt text and responsive image sizing", () => {
    const files = roots.flatMap(sourceFiles);
    const violations: string[] = [];

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
        if (hasFill && !hasSizes)
          violations.push(`${location}: fill requires sizes`);
        if (/\b(?:priority|preload)\b/.test(props)) {
          preloadedImages += 1;
          if (!/human\/.*(?:hero|gallery)\.tsx$/.test(file)) {
            violations.push(`${location}: preload must be a route hero image`);
          }
        }
      }
      if (preloadedImages > 1)
        violations.push(`${file}: only one image may preload`);
    }

    expect(violations).toEqual([]);
  });
});
