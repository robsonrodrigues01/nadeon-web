import fs from "node:fs";
import path from "node:path";

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

const hexPattern = /#([0-9a-fA-F]{3,8})\b/g;

let violationsCount = 0;
const violations = [];

function scanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      scanDirectory(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (!allowedExtensions.has(ext)) continue;

      const content = fs.readFileSync(fullPath, "utf8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        const matches = line.match(hexPattern);
        if (matches) {
          for (const match of matches) {
            violationsCount++;
            violations.push({
              file: path.relative(process.cwd(), fullPath),
              line: index + 1,
              hex: match,
              text: line.trim(),
            });
          }
        }
      });
    }
  }
}

for (const dir of targetDirs) {
  scanDirectory(path.resolve(process.cwd(), dir));
}

if (violationsCount > 0) {
  console.error(
    `\n❌ Encontradas ${violationsCount} ocorrências de cores hex fora de styles/tokens.css:`
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
