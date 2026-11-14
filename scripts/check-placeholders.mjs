import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const TARGET_DIRS = ["app", "components", "content"];
const ALLOWED_EXTENSIONS = new Set([
  ".tsx",
  ".jsx",
  ".ts",
  ".js",
  ".md",
  ".mdx",
]);
const EXCLUDED_DIRS = ["data/mocks", "data", "node_modules", ".next", ".git"];

const PLACEHOLDER_PATTERNS = [
  { name: "bracket [", regex: /\[/ },
  { name: "dollar $XX", regex: /\$xx\b/i },
  { name: "placeholder (example)", regex: /\(example\)/i },
];

function isExcluded(filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  return EXCLUDED_DIRS.some(
    (dir) => normalized.includes(`/${dir}/`) || normalized.startsWith(`${dir}/`)
  );
}

function getFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!isExcluded(fullPath)) {
        files.push(...getFiles(fullPath));
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (ALLOWED_EXTENSIONS.has(ext) && !isExcluded(fullPath)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

export function checkRenderedString(text, filePath, line, issues) {
  if (!text || typeof text !== "string") return;
  const trimmed = text.trim();
  if (!trimmed) return;

  for (const { name, regex } of PLACEHOLDER_PATTERNS) {
    if (regex.test(trimmed)) {
      issues.push({
        file: filePath,
        line,
        pattern: name,
        text: trimmed,
      });
    }
  }
}

export function checkMarkdown(content, filePath) {
  const issues = [];
  const lines = content.split("\n");

  lines.forEach((rawLine, index) => {
    // Strip markdown links [label](url) and images ![alt](url) before checking for raw brackets
    const sanitizedLine = rawLine
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[[^\]]+\]\([^)]*\)/g, "");

    checkRenderedString(sanitizedLine, filePath, index + 1, issues);
  });

  return issues;
}

export function checkCode(content, filePath) {
  const issues = [];
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith(".tsx") || filePath.endsWith(".jsx")
      ? ts.ScriptKind.TSX
      : ts.ScriptKind.TS
  );

  function getLine(pos) {
    return sourceFile.getLineAndCharacterOfPosition(pos).line + 1;
  }

  function visit(node) {
    // Ignore all JSX attributes (e.g. className="text-[10px]", class, id, style, etc.)
    if (ts.isJsxAttribute(node)) {
      return;
    }

    // 1. Direct rendered JSX text children: <div>[Hello]</div>
    if (ts.isJsxText(node)) {
      checkRenderedString(
        node.getText(sourceFile),
        filePath,
        getLine(node.getStart(sourceFile)),
        issues
      );
    }

    // 2. String literal inside JSX expression container child: <div>{"[Hello]"}</div>
    if (
      ts.isJsxExpression(node) &&
      node.expression &&
      ts.isStringLiteral(node.expression) &&
      node.parent &&
      (ts.isJsxElement(node.parent) || ts.isJsxFragment(node.parent))
    ) {
      checkRenderedString(
        node.expression.text,
        filePath,
        getLine(node.expression.getStart(sourceFile)),
        issues
      );
    }

    // 3. Metadata content strings: export const metadata = { title: "[...]" }
    if (
      ts.isPropertyAssignment(node) &&
      node.name &&
      ts.isStringLiteral(node.initializer)
    ) {
      const propName = node.name.getText(sourceFile);
      if (["title", "description"].includes(propName)) {
        checkRenderedString(
          node.initializer.text,
          filePath,
          getLine(node.initializer.getStart(sourceFile)),
          issues
        );
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return issues;
}

export function main() {
  const allFiles = TARGET_DIRS.flatMap((dir) => getFiles(dir));
  const issues = [];

  for (const file of allFiles) {
    const content = fs.readFileSync(file, "utf8");
    if (file.endsWith(".md") || file.endsWith(".mdx")) {
      issues.push(...checkMarkdown(content, file));
    } else {
      issues.push(...checkCode(content, file));
    }
  }

  if (issues.length > 0) {
    console.error(
      `\n❌ Found ${issues.length} unreplaced placeholder(s) in rendered text:\n`
    );
    for (const issue of issues) {
      console.error(
        `  - ${issue.file}:${issue.line} [${issue.pattern}]: "${issue.text}"`
      );
    }
    console.error(
      "\nPlease replace placeholders before merging to production."
    );
    process.exit(1);
  }

  console.log("✓ No unreplaced placeholders found in rendered text.");
  process.exit(0);
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  main();
}
