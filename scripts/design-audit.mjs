import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

// Paths
const currentDir = process.cwd();
const candidates = [
  path.resolve(currentDir, "../../design/boards"),
  path.resolve(currentDir, "../design/boards"),
  path.resolve(currentDir, "design/boards"),
  "/Users/robsoncoffy/Documents/Nadeon/Website/design/boards",
];

const boardsDir = candidates.find((dir) => fs.existsSync(dir));

if (!boardsDir) {
  console.error("Diretório design/boards não encontrado.");
  process.exit(1);
}

const files = fs.readdirSync(boardsDir).filter((f) => f.endsWith(".dc.html"));
console.log(`Analisando ${files.length} telas em ${boardsDir}...`);

const hexCounts = new Map();
const radiusCounts = new Map();
const shadowCounts = new Map();
const fontSizeCounts = new Map();
const spacingCounts = new Map();
const gradientCounts = new Map();

for (const file of files) {
  const filePath = path.join(boardsDir, file);
  const content = fs.readFileSync(filePath, "utf8");

  // Cores hex
  const hexes = content.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  for (const h of hexes) {
    const norm = h.toUpperCase();
    hexCounts.set(norm, (hexCounts.get(norm) || 0) + 1);
  }

  // Border radius
  const radii = content.match(/border-radius:\s*([^;"]+)/g) || [];
  for (const r of radii) {
    const val = r.replace("border-radius:", "").trim();
    radiusCounts.set(val, (radiusCounts.get(val) || 0) + 1);
  }

  // Box shadow
  const shadows = content.match(/box-shadow:\s*([^;"]+)/g) || [];
  for (const s of shadows) {
    const val = s.replace("box-shadow:", "").trim();
    shadowCounts.set(val, (shadowCounts.get(val) || 0) + 1);
  }

  // Font size
  const fontSizes = content.match(/font-size:\s*([^;"]+)/g) || [];
  for (const f of fontSizes) {
    const val = f.replace("font-size:", "").trim();
    fontSizeCounts.set(val, (fontSizeCounts.get(val) || 0) + 1);
  }

  // Espaçamentos (padding, margin, gap)
  const paddings = content.match(/padding(-[a-z]+)?:\s*([^;"]+)/g) || [];
  for (const p of paddings) {
    const val = p.replace(/padding(-[a-z]+)?:\s*/, "").trim();
    spacingCounts.set(`p:${val}`, (spacingCounts.get(`p:${val}`) || 0) + 1);
  }

  const margins = content.match(/margin(-[a-z]+)?:\s*([^;"]+)/g) || [];
  for (const m of margins) {
    const val = m.replace(/margin(-[a-z]+)?:\s*/, "").trim();
    spacingCounts.set(`m:${val}`, (spacingCounts.get(`m:${val}`) || 0) + 1);
  }

  const gaps = content.match(/gap:\s*([^;"]+)/g) || [];
  for (const g of gaps) {
    const val = g.replace("gap:", "").trim();
    spacingCounts.set(`gap:${val}`, (spacingCounts.get(`gap:${val}`) || 0) + 1);
  }

  // Gradientes
  const grads =
    content.match(/(linear-gradient\([^;"]+\)|radial-gradient\([^;"]+\))/g) ||
    [];
  for (const g of grads) {
    gradientCounts.set(g, (gradientCounts.get(g) || 0) + 1);
  }
}

// Ordenação
function getTop(map, limit = 20) {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

// Cálculo de Luminância e Contraste WCAG 2.1
function hexToRgb(hex) {
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (clean.length === 8) {
    clean = clean.substring(0, 6);
  }
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return { r, g, b };
}

function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function getLuminance(r, g, b) {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function getContrast(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Blending para opacidades sobre cor de fundo
function blendHex(fgHex, bgHex, alpha) {
  const fg = hexToRgb(fgHex);
  const bg = hexToRgb(bgHex);
  const r = Math.round(fg.r * alpha + bg.r * (1 - alpha));
  const g = Math.round(fg.g * alpha + bg.g * (1 - alpha));
  const b = Math.round(fg.b * alpha + bg.b * (1 - alpha));
  const toHex = (n) => n.toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Pares para conferência de contraste
const contrastChecks = [
  // Tema Human
  {
    theme: "Human",
    context: "Texto principal sobre fundo Espresso",
    fg: "#FFF6EA",
    bg: "#2A1710",
    nameFg: "Cream",
    nameBg: "Espresso",
    level: "Normal / Headings",
  },
  {
    theme: "Human",
    context: "Texto principal sobre fundo elevado",
    fg: "#FFF6EA",
    bg: "#16100C",
    nameFg: "Cream",
    nameBg: "Espresso Elevated",
    level: "Normal / Headings",
  },
  {
    theme: "Human",
    context: "Texto silenciado (70% opacidade) sobre Espresso",
    fg: blendHex("#FFF6EA", "#2A1710", 0.7),
    bg: "#2A1710",
    nameFg: "Cream 70%",
    nameBg: "Espresso",
    level: "Body / Muted",
  },
  {
    theme: "Human",
    context: "Destaque dourado claro sobre Espresso",
    fg: "#F8DC86",
    bg: "#2A1710",
    nameFg: "Gold Light",
    nameBg: "Espresso",
    level: "Normal / Headings",
  },
  {
    theme: "Human",
    context: "Destaque dourado médio sobre Espresso",
    fg: "#E0A63C",
    bg: "#2A1710",
    nameFg: "Gold Mid",
    nameBg: "Espresso",
    level: "Large text / UI",
  },
  {
    theme: "Human",
    context: "Botão dourado (Espresso sobre gradiente ouro médio)",
    fg: "#2A1710",
    bg: "#E0A63C",
    nameFg: "Espresso",
    nameBg: "Gold Mid",
    level: "Button / UI",
  },
  {
    theme: "Human",
    context: "Botão dourado claro (Espresso sobre ouro claro)",
    fg: "#2A1710",
    bg: "#F8DC86",
    nameFg: "Espresso",
    nameBg: "Gold Light",
    level: "Button / UI",
  },
  // Tema Pet
  {
    theme: "Pet",
    context: "Texto principal sobre fundo Cream",
    fg: "#2A1710",
    bg: "#FFF6EA",
    nameFg: "Espresso",
    nameBg: "Cream",
    level: "Normal / Headings",
  },
  {
    theme: "Pet",
    context: "Texto principal sobre fundo Card branco",
    fg: "#2A1710",
    bg: "#FFFFFF",
    nameFg: "Espresso",
    nameBg: "White",
    level: "Normal / Headings",
  },
  {
    theme: "Pet",
    context: "Texto silenciado (70% opacidade) sobre Cream",
    fg: blendHex("#2A1710", "#FFF6EA", 0.7),
    bg: "#FFF6EA",
    nameFg: "Espresso 70%",
    nameBg: "Cream",
    level: "Body / Muted",
  },
  {
    theme: "Pet",
    context: "Texto silenciado (70% opacidade) sobre Card branco",
    fg: blendHex("#2A1710", "#FFFFFF", 0.7),
    bg: "#FFFFFF",
    nameFg: "Espresso 70%",
    nameBg: "White",
    level: "Body / Muted",
  },
  // Cores de produto
  {
    theme: "Produtos / Badges",
    context: "Texto Espresso sobre Amber (#FFC35A)",
    fg: "#2A1710",
    bg: "#FFC35A",
    nameFg: "Espresso",
    nameBg: "Product Amber",
    level: "Badge / UI",
  },
  {
    theme: "Produtos / Badges",
    context: "Texto Espresso sobre Coral (#FF6B6B)",
    fg: "#2A1710",
    bg: "#FF6B6B",
    nameFg: "Espresso",
    nameBg: "Product Coral",
    level: "Badge / UI",
  },
  {
    theme: "Produtos / Badges",
    context: "Texto Espresso sobre Lilac (#B892FF)",
    fg: "#2A1710",
    bg: "#B892FF",
    nameFg: "Espresso",
    nameBg: "Product Lilac",
    level: "Badge / UI",
  },
  {
    theme: "Produtos / Badges",
    context: "Texto Espresso sobre Rose (#FF8FC0)",
    fg: "#2A1710",
    bg: "#FF8FC0",
    nameFg: "Espresso",
    nameBg: "Product Rose",
    level: "Badge / UI",
  },
  {
    theme: "Produtos / Badges",
    context: "Texto Espresso sobre Sky (#7CC4FF)",
    fg: "#2A1710",
    bg: "#7CC4FF",
    nameFg: "Espresso",
    nameBg: "Product Sky",
    level: "Badge / UI",
  },
  {
    theme: "Produtos / Badges",
    context: "Texto Espresso sobre Mint (#7FE0B0)",
    fg: "#2A1710",
    bg: "#7FE0B0",
    nameFg: "Espresso",
    nameBg: "Product Mint",
    level: "Badge / UI",
  },
  {
    theme: "Gradiente / Destaque",
    context: "Texto Cream sobre Violet (#6A2FA3)",
    fg: "#FFF6EA",
    bg: "#6A2FA3",
    nameFg: "Cream",
    nameBg: "Violet",
    level: "Accent section",
  },
];

const contrastResults = contrastChecks.map((item) => {
  const ratio = getContrast(item.fg, item.bg);
  const aaNormal = ratio >= 4.5;
  const aaLarge = ratio >= 3.0;
  return {
    ...item,
    ratio: ratio.toFixed(2),
    passAANormal: aaNormal ? "Passa (AA)" : "Falha (AA normal)",
    passAALarge: aaLarge ? "Passa (AA grande/UI)" : "Falha",
  };
});

// Geração do relatório em Markdown sem travessão
const topColors = getTop(hexCounts, 25);
const topRadii = getTop(radiusCounts, 15);
const topShadows = getTop(shadowCounts, 10);
const topFontSizes = getTop(fontSizeCounts, 15);
const topSpacings = getTop(spacingCounts, 15);
const topGradients = getTop(gradientCounts, 10);

const docsDir = path.resolve(currentDir, "docs");
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

// Geração dos Screenshots de teste dos dois temas via Playwright
async function generateThemeScreenshots() {
  const tokensCssPath = path.resolve(currentDir, "styles/tokens.css");
  let tokensCss = "";
  if (fs.existsSync(tokensCssPath)) {
    tokensCss = fs.readFileSync(tokensCssPath, "utf8");
  }

  function buildHtml(theme) {
    return `<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
<head>
  <meta charset="utf-8">
  <title>Nadeon Test - ${theme.toUpperCase()}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700&display=swap" rel="stylesheet">
  <style>
    ${tokensCss}
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--fg);
      font-family: var(--font-dm-sans);
      padding: 48px;
      min-height: 100vh;
    }
    .container {
      max-width: 960px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 14px;
      border-radius: var(--radius-pill);
      background: var(--border);
      color: var(--fg);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      align-self: flex-start;
    }
    .card {
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);
      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .button-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 14px 28px;
      border-radius: var(--radius-pill);
      background: var(--gradient-gold);
      color: var(--accent-fg);
      font-family: var(--font-dm-sans);
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      align-self: flex-start;
    }
    .input-field {
      width: 100%;
      max-width: 380px;
      padding: 12px 16px;
      border-radius: var(--radius-field);
      border: 1px solid var(--border);
      background: var(--bg);
      color: var(--fg);
      font-family: var(--font-dm-sans);
      font-size: 14px;
      outline: none;
    }
    .swatches {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 8px;
    }
    .swatch {
      flex: 1;
      min-width: 110px;
      padding: 14px;
      border-radius: var(--radius-field);
      font-size: 11px;
      font-weight: 700;
      color: #2A1710;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: center;
      justify-content: center;
    }
    .gradient-preview {
      height: 48px;
      border-radius: var(--radius-field);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
  </style>
</head>
<body>
  <div class="container">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div class="label" style="font-size: 18px; letter-spacing: 0.1em; color: var(--accent);">NADEON LABS</div>
      <div class="badge">TEMA: ${theme.toUpperCase()}</div>
    </div>

    <div>
      <h1 class="hero">CELLULAR ENERGY</h1>
      <p class="lead" style="color: var(--fg-muted); margin-top: 8px;">
        Advanced longevity formulations engineered for biological vitality.
      </p>
    </div>

    <div class="card">
      <h2 class="title">LONGEVITY RESEARCH</h2>
      <p class="body">
        Our dual approach targets the primary hallmarks of aging across human cellular biology and canine vitality, utilizing pharmaceutical grade NAD+ precursors.
      </p>

      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <input class="input-field" type="email" placeholder="Enter your email" value="researcher@nadeonlabs.com" readonly>
        <button class="button-primary">CLAIM ACCESS</button>
      </div>

      <div style="margin-top: 16px;">
        <div class="label" style="margin-bottom: 8px; color: var(--fg-muted);">Product Palette</div>
        <div class="swatches">
          <div class="swatch" style="background: var(--product-amber);"><span>Amber</span><span>#FFC35A</span></div>
          <div class="swatch" style="background: var(--product-coral);"><span>Coral</span><span>#FF6B6B</span></div>
          <div class="swatch" style="background: var(--product-lilac);"><span>Lilac</span><span>#B892FF</span></div>
          <div class="swatch" style="background: var(--product-rose);"><span>Rose</span><span>#FF8FC0</span></div>
          <div class="swatch" style="background: var(--product-sky);"><span>Sky</span><span>#7CC4FF</span></div>
          <div class="swatch" style="background: var(--product-mint);"><span>Mint</span><span>#7FE0B0</span></div>
        </div>
      </div>

      <div style="margin-top: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div class="gradient-preview bg-gradient-gold" style="color: #2A1710;">--gradient-gold</div>
        <div class="gradient-preview bg-gradient-sunrise" style="color: #FFF6EA;">--gradient-sunrise</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  const chromePath =
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const launchOptions = { headless: true };
  if (fs.existsSync(chromePath)) {
    launchOptions.executablePath = chromePath;
  }

  const browser = await chromium.launch(launchOptions);
  const context = await browser.newContext({
    viewport: { width: 1200, height: 900 },
    deviceScaleFactor: 2,
  });

  for (const theme of ["human", "pet"]) {
    const page = await context.newPage();
    const html = buildHtml(theme);
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const screenshotPath = path.join(docsDir, `screenshot-${theme}.png`);
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot salvo: ${screenshotPath}`);
    await page.close();
  }

  await browser.close();
}

const report = `# Levantamento de Design e Auditoria de Tokens

Levantamento realizado de forma automatizada pelo script scripts/design-audit.mjs a partir dos ${files.length} arquivos de telas em design/boards/*.dc.html e especificações em BRAND.md.

## 1. Contagem de Cores Hex

Total de cores unicas identificadas: ${hexCounts.size}

| Cor Hex | Ocorrências | Identificação no Brand Kit |
| --- | --- | --- |
${topColors
  .map(([hex, count]) => {
    let desc = "Cor de apoio / detalhe";
    if (hex === "#2A1710") desc = "Espresso (Fundo Human / Texto Pet)";
    else if (hex === "#FFF6EA") desc = "Cream (Fundo Pet / Texto Human)";
    else if (hex === "#FFFFFF") desc = "White (Cards e painéis)";
    else if (hex === "#B97A22") desc = "Gold Dark (parada gradiente)";
    else if (hex === "#E0A63C") desc = "Gold Mid (parada gradiente / accent)";
    else if (hex === "#F8DC86") desc = "Gold Light (parada gradiente)";
    else if (hex === "#FFEDB0") desc = "Gold Extra Light (badges / banners)";
    else if (hex === "#F3CC62") desc = "Gold Amber (links / highlights)";
    else if (hex === "#16100C") desc = "Espresso Dark (bg-elevated Human)";
    else if (hex === "#221812") desc = "Espresso Médio (bg secundário)";
    else if (hex === "#FF8FC0") desc = "Product Rose";
    else if (hex === "#7FE0B0") desc = "Product Mint";
    else if (hex === "#7CC4FF") desc = "Product Sky";
    else if (hex === "#FFC35A") desc = "Product Amber";
    else if (hex === "#FF6B6B") desc = "Product Coral";
    else if (hex === "#B892FF") desc = "Product Lilac";
    return `| \`${hex}\` | ${count} | ${desc} |`;
  })
  .join("\n")}

## 2. Raios de Borda (border-radius)

Total de variações de raios identificadas: ${radiusCounts.size}

| Raio | Ocorrências | Token Semântico Mapeado |
| --- | --- | --- |
${topRadii
  .map(([radius, count]) => {
    let mapping = "Variação específica";
    if (radius === "999px") mapping = "--radius-pill (botões e badges)";
    else if (radius === "50%") mapping = "--radius-circle (avatares e ícones)";
    else if (radius === "18px" || radius === "20px" || radius === "16px")
      mapping = "--radius-card (cards e painéis)";
    else if (radius === "10px" || radius === "12px" || radius === "14px")
      mapping = "--radius-field (inputs e contêineres)";
    else if (radius === "6px" || radius === "8px" || radius === "4px")
      mapping = "--radius-sm / tags";
    return `| \`${radius}\` | ${count} | ${mapping} |`;
  })
  .join("\n")}

## 3. Sombras (box-shadow)

Total de variações de sombras identificadas: ${shadowCounts.size}

| Sombra | Ocorrências | Aplicação |
| --- | --- | --- |
${topShadows
  .map(([shadow, count]) => `| \`${shadow}\` | ${count} | Cards e frascos |`)
  .join("\n")}

## 4. Tamanhos de Fonte (font-size)

Total de variações de font-size identificadas: ${fontSizeCounts.size}

| Tamanho | Ocorrências | Uso Observado |
| --- | --- | --- |
${topFontSizes
  .map(([size, count]) => `| \`${size}\` | ${count} | Tipografia do sistema |`)
  .join("\n")}

## 5. Espaçamentos Recorrentes (padding, margin, gap)

| Propriedade e Valor | Ocorrências |
| --- | --- |
${topSpacings.map(([sp, count]) => `| \`${sp}\` | ${count} |`).join("\n")}

## 6. Gradientes

| Gradiente | Ocorrências | Token Semântico |
| --- | --- | --- |
${topGradients
  .map(([grad, count]) => {
    let name = "Gradiente complementar";
    if (grad.includes("#F8DC86") && grad.includes("#B97A22"))
      name = "--gradient-gold";
    else if (grad.includes("#F7B267") || grad.includes("#E05A8A"))
      name = "--gradient-sunrise";
    return `| \`${grad}\` | ${count} | ${name} |`;
  })
  .join("\n")}

## 7. Verificação de Contraste WCAG 2.1 AA

Conferência de acessibilidade para pares de cor de texto e fundo em ambos os temas:

| Tema | Contexto | Cor Texto | Cor Fundo | Razão de Contraste | Status AA (Normal: 4.5:1, Grande: 3.0:1) |
| --- | --- | --- | --- | --- | --- |
${contrastResults
  .map(
    (r) =>
      `| ${r.theme} | ${r.context} | \`${r.fg}\` (${r.nameFg}) | \`${r.bg}\` (${r.nameBg}) | ${r.ratio}:1 | ${r.passAANormal} |`
  )
  .join("\n")}

### Conclusões do Contraste
1. O par Human principal (Cream sobre Espresso) atinge 15.97:1, superando com folga o critério WCAG AAA (7.0:1).
2. O par Pet principal (Espresso sobre Cream) atinge 15.97:1, igualmente superior ao critério WCAG AAA.
3. No botão dourado, o texto Espresso sobre o fundo dourado atinge 7.89:1 a 12.68:1, garantindo leitura nítida e aprovação AA.
4. Para as cores de produto (Amber, Coral, Rose, Sky, Mint, Lilac), o uso de texto Espresso (#2A1710) atinge conformidade AA ampla (acima de 6.16:1 em todas as tonalidades).

## 8. Evidência Visual dos Temas

Renderização dos temas Human e Pet com aplicação de tokens semânticos, gradientes, raios de borda e tipografia (Archivo 125% e DM Sans):

- Tema Human: ![Tema Human](screenshot-human.png)
- Tema Pet: ![Tema Pet](screenshot-pet.png)
`;

const outputPath = path.join(docsDir, "design-audit.md");
fs.writeFileSync(outputPath, report, "utf8");
console.log(`Auditoria gerada com sucesso em ${outputPath}`);

try {
  await generateThemeScreenshots();
  console.log("Screenshots gerados com sucesso.");
} catch (err) {
  console.error("Aviso ao gerar screenshots:", err.message);
}
