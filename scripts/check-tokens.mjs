import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const targetDirs = ["app", "components"];
const allowedExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".css",
  ".scss",
  ".json",
  ".md",
  ".mdx",
]);

// Hex colors must have 3-8 hex digits and a true word end (not followed by hyphen or word char)
const hexPattern = /#([0-9a-fA-F]{3,8})(?![\w-])/g;

/**
 * Checks whether a hex match on a given line appears in a color context.
 * Ignores anchors, element IDs, SVG url(#...) references, and non-color hashes.
 */
export function isColorContext(line, matchIndex) {
  const before = line.slice(0, matchIndex);

  // 1. Exclude non-color contexts: anchors, ids, URLs, references, markdown headers
  if (
    /(?:href|id|aria-controls|aria-describedby|to|url)\s*[:=]\s*["'{]?[^"'}>]*$/i.test(
      before
    )
  ) {
    return false;
  }
  if (/url\(\s*["']?$/i.test(before)) {
    return false;
  }
  if (
    /(?:order|reference|license|ticket|issue|pr|step)\s*#?$/i.test(
      before.trim()
    )
  ) {
    return false;
  }
  if (/^\s*#+$/.test(before)) {
    return false;
  }

  // 2. Identify positive color contexts
  // A. Tailwind arbitrary color utility class (e.g. text-[#fff], bg-[#2a1710], border-[#e0a63c])
  if (
    /(?:bg|text|border|fill|stroke|ring|from|to|via|accent|shadow|outline|decoration|divide|caret)-\[\s*$/i.test(
      before
    )
  ) {
    return true;
  }

  // B. SVG or HTML color attributes (e.g. fill="#fff", stroke="#000", stopColor="#ffc35a")
  if (
    /\b(?:fill|stroke|stopColor|stop-color|color)\s*=\s*["'{]\s*$/i.test(before)
  ) {
    return true;
  }

  // C. CSS or style properties (e.g. color: "#fff", backgroundColor: "#fff", border: "1px solid #fff")
  if (
    /\b(?:color|background|background-color|backgroundColor|border|border-color|borderColor|border-top-color|border-bottom-color|border-left-color|border-right-color|fill|stroke|stop-color|stopColor|outline|outline-color|outlineColor|box-shadow|boxShadow|text-shadow|textShadow|accent-color|accentColor|caret-color|caretColor|text-decoration-color|textDecorationColor)\s*[:=]\s*[^;,\n}>]*$/i.test(
      before
    )
  ) {
    return true;
  }

  // D. Color variables, object keys or constants (e.g. const customColor = "#fff", { brandBg: "#fff" })
  if (
    /\b\w*(?:color|colors|background|bg|fill|stroke|border|palette|tint|hex)\w*\s*[:=]\s*["']?\s*$/i.test(
      before
    )
  ) {
    return true;
  }

  // E. Plain CSS / SCSS rule declaration (e.g. property: value #hex;)
  if (/^[\s\t]*[a-z-]+(?:\s*:[^;]*)$/i.test(before)) {
    return true;
  }

  return false;
}

/**
 * Checks a string of code or file content for unauthorized hex color violations.
 */
export function checkCode(content, filePath = "test.tsx") {
  const violations = [];
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    let match;
    hexPattern.lastIndex = 0;
    while ((match = hexPattern.exec(line)) !== null) {
      if (isColorContext(line, match.index)) {
        violations.push({
          file: filePath,
          line: index + 1,
          hex: match[0],
          text: line.trim(),
        });
      }
    }
  });

  return violations;
}

function scanDirectory(dirPath, violations) {
  if (!fs.existsSync(dirPath)) return;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      scanDirectory(fullPath, violations);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (!allowedExtensions.has(ext)) continue;

      const content = fs.readFileSync(fullPath, "utf8");
      const relativePath = path.relative(process.cwd(), fullPath);
      const fileViolations = checkCode(content, relativePath);
      violations.push(...fileViolations);
    }
  }
}

export function main() {
  const violations = [];

  for (const dir of targetDirs) {
    scanDirectory(path.resolve(process.cwd(), dir), violations);
  }

  if (violations.length > 0) {
    console.error(
      `\n❌ Encontradas ${violations.length} ocorrências de cores hex fora de styles/tokens.css:`
    );
    for (const v of violations) {
      console.error(`  - ${v.file}:${v.line} [${v.hex}]: "${v.text}"`);
    }
    console.error(
      "\nUse os tokens semânticos de styles/tokens.css ou classes utilitárias do Tailwind.\n"
    );
    process.exit(1);
  } else {
    console.log(
      "✓ Nenhum código hexadecimal encontrado fora de styles/tokens.css em app/ e components/."
    );
    process.exit(0);
  }
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  main();
}
