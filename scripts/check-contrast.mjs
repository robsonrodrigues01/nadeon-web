import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function blocks(css) {
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(
    ([, selector, body]) => ({
      selector,
      vars: Object.fromEntries(
        [...body.matchAll(/--([\w-]+)\s*:\s*([^;]+)\s*;/g)].map(
          ([, key, value]) => [key, value.trim()]
        )
      ),
    })
  );
}

function parseColor(value) {
  const hex = value.match(/^#([\da-f]{3}|[\da-f]{6})$/i)?.[1];
  if (hex) {
    const expanded =
      hex.length === 3 ? [...hex].map((part) => part + part).join("") : hex;
    return expanded
      .match(/../g)
      .map((part) => parseInt(part, 16) / 255)
      .concat(1);
  }
  const rgb = value
    .match(/^rgba?\(([^)]+)\)$/i)?.[1]
    .split(/[\s,/]+/)
    .filter(Boolean);
  if (!rgb || rgb.length < 3)
    throw new Error("Unsupported CSS color: " + value);
  return [
    Number(rgb[0]) / 255,
    Number(rgb[1]) / 255,
    Number(rgb[2]) / 255,
    Number(rgb[3] ?? 1),
  ];
}

function composite(fg, bg) {
  return [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3])).concat(1);
}

function luminance(rgb) {
  const c = rgb
    .slice(0, 3)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
}

export function getContrastRatio(foreground, background) {
  const fg =
    typeof foreground === "string" ? parseColor(foreground) : foreground;
  const bg =
    typeof background === "string" ? parseColor(background) : background;
  const front = luminance(composite(fg, bg));
  const back = luminance(bg);
  return (Math.max(front, back) + 0.05) / (Math.min(front, back) + 0.05);
}

const defaultTokensPath = fs.existsSync(path.resolve("styles/tokens.css"))
  ? path.resolve("styles/tokens.css")
  : fileURLToPath(new URL("../styles/tokens.css", import.meta.url));

export function getContrastReport(
  css = fs.readFileSync(defaultTokensPath, "utf8")
) {
  const parsed = blocks(css);
  const root = Object.assign(
    {},
    ...parsed
      .filter((block) =>
        block.selector.split(",").some((s) => s.trim() === ":root")
      )
      .map((block) => block.vars)
  );
  const gold = [
    ...(root["gradient-gold"] || "").matchAll(/#([\da-f]{3}|[\da-f]{6})\b/gi),
  ].map(([, hex]) => "#" + hex);
  const pairs = [];
  const add = (theme, name, fgValue, bgValue, minimum, category) => {
    const fg = parseColor(fgValue);
    const bg = parseColor(bgValue);
    const value = getContrastRatio(fg, bg);
    pairs.push({
      theme,
      name,
      foreground: fgValue,
      background: bgValue,
      ratio: value,
      minimum,
      category,
    });
  };

  for (const theme of ["human", "pet"]) {
    const vars = Object.assign(
      {},
      root,
      ...parsed
        .filter((block) =>
          block.selector.includes('[data-theme="' + theme + '"]')
        )
        .map((block) => block.vars)
    );
    add(theme, "fg/bg", vars.fg, vars.bg, 4.5, "text");
    add(theme, "fg/bg-elevated", vars.fg, vars["bg-elevated"], 4.5, "text");
    add(theme, "large text fg/bg", vars.fg, vars.bg, 3, "large text");
    add(
      theme,
      "large text fg/bg-elevated",
      vars.fg,
      vars["bg-elevated"],
      3,
      "large text"
    );
    add(theme, "fg-muted/bg", vars["fg-muted"], vars.bg, 4.5, "text");
    add(
      theme,
      "fg-muted/bg-elevated",
      vars["fg-muted"],
      vars["bg-elevated"],
      4.5,
      "text"
    );
    add(
      theme,
      "accent-fg/accent button",
      vars["accent-fg"],
      vars.accent,
      4.5,
      "button"
    );
    add(
      theme,
      "accent-text/bg",
      vars["accent-text"] || vars.accent,
      vars.bg,
      4.5,
      "link"
    );
    add(
      theme,
      "accent-text/bg-elevated",
      vars["accent-text"] || vars.accent,
      vars["bg-elevated"],
      4.5,
      "link"
    );
    add(theme, "accent UI/bg", vars.accent, vars.bg, 3, "ui");
    add(
      theme,
      "accent UI/bg-elevated",
      vars.accent,
      vars["bg-elevated"],
      3,
      "ui"
    );
    gold.forEach((stop, index) =>
      add(
        theme,
        `primary gold button text on gradient stop ${index + 1}`,
        vars["accent-fg"],
        stop,
        4.5,
        "button"
      )
    );
    add(
      theme,
      "accent-fg/product-amber button text",
      vars["accent-fg"],
      root["product-amber"],
      4.5,
      "button"
    );
    if (theme === "human") {
      for (const token of ["product-amber", "product-coral", "product-mint"]) {
        add(theme, `${token} text/bg`, root[token], vars.bg, 4.5, "text");
        add(
          theme,
          `${token} text/bg-elevated`,
          root[token],
          vars["bg-elevated"],
          4.5,
          "text"
        );
      }
    } else {
      for (const token of ["product-coral", "product-mint"]) {
        add(theme, `${token} text/bg`, root[token], vars.bg, 4.5, "text");
        add(
          theme,
          `${token} text/bg-elevated`,
          root[token],
          vars["bg-elevated"],
          4.5,
          "text"
        );
      }
      add(
        theme,
        "product-amber icon/fg surface",
        root["product-amber"],
        vars.fg,
        3,
        "ui"
      );
      add(
        theme,
        "product-amber text/accent-fg banner",
        root["product-amber"],
        vars["accent-fg"],
        4.5,
        "text"
      );
      for (const token of [
        "product-amber",
        "product-coral",
        "product-sky",
        "product-mint",
      ]) {
        add(theme, `fg/${token} surface`, vars.fg, root[token], 4.5, "text");
      }
    }
    add(
      theme,
      "accent-fg/product-coral button text",
      vars["accent-fg"],
      root["product-coral"],
      4.5,
      "button"
    );
  }
  return { pairs };
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
) {
  const pairs = getContrastReport().pairs;
  const failures = pairs.filter((pair) => pair.ratio < pair.minimum);
  for (const pair of pairs) {
    console.log(
      (pair.ratio >= pair.minimum ? "PASS " : "FAIL ") +
        pair.theme +
        " " +
        pair.category +
        " " +
        pair.name +
        ": " +
        pair.ratio.toFixed(2) +
        ":1 (min " +
        pair.minimum +
        ":1), " +
        pair.foreground +
        " on " +
        pair.background
    );
  }
  if (failures.length) {
    console.error(
      "\n" + failures.length + " contrast pair(s) below threshold:"
    );
    for (const pair of failures)
      console.error(
        "- " +
          pair.theme +
          " " +
          pair.category +
          " " +
          pair.name +
          ": " +
          pair.ratio.toFixed(2) +
          ":1 (required " +
          pair.minimum +
          ":1)"
      );
    process.exitCode = 1;
  }
}
