import fs from "node:fs";
import path from "node:path";
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

function checkRenderedString(text, filePath, line, issues) {
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

function checkMarkdownFile(filePath, issues) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  lines.forEach((rawLine, index) => {
    // Strip markdown links [label](url) and images ![alt](url) before checking for raw brackets
    const sanitizedLine = rawLine
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[[^\]]+\]\([^)]*\)/g, "");

    checkRenderedString(sanitizedLine, filePath, index + 1, issues);
  });
}

function checkCodeFile(filePath, issues) {
  const content = fs.readFileSync(filePath, "utf8");
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
    // 1. Direct JSX text: <div>[Hello]</div>
    if (ts.isJsxText(node)) {
      checkRenderedString(
        node.getText(sourceFile),
        filePath,
        getLine(node.getStart(sourceFile)),
        issues
      );
    }

    // 2. JSX attribute string values: title="[Hello]" or alt="$XX"
    if (ts.isJsxAttribute(node) && node.initializer) {
      if (ts.isStringLiteral(node.initializer)) {
        checkRenderedString(
          node.initializer.text,
          filePath,
          getLine(node.initializer.getStart(sourceFile)),
          issues
        );
      }
    }

    // 3. String literal inside JSX expression container: <div>{"[Hello]"}</div>
    if (
      ts.isJsxExpression(node) &&
      node.expression &&
      ts.isStringLiteral(node.expression)
    ) {
      checkRenderedString(
        node.expression.text,
        filePath,
        getLine(node.expression.getStart(sourceFile)),
        issues
      );
    }

    // 4. Metadata exports: export const metadata = { title: "[...]" }
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
}

function main() {
  const allFiles = TARGET_DIRS.flatMap((dir) => getFiles(dir));
  const issues = [];

  for (const file of allFiles) {
    if (file.endsWith(".md") || file.endsWith(".mdx")) {
      checkMarkdownFile(file, issues);
    } else {
      checkCodeFile(file, issues);
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

main();
