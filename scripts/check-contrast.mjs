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

function contrast(fg, bg) {
  const front = luminance(composite(fg, bg));
  const back = luminance(bg);
  return (Math.max(front, back) + 0.05) / (Math.min(front, back) + 0.05);
}

function toHex(rgb) {
  return (
    "#" +
    rgb
      .slice(0, 3)
      .map((v) =>
        Math.round(v * 255)
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

function toHsl([r, g, b]) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lightness = (max + min) / 2;
  if (!delta) return [0, 0, lightness];
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  const hue =
    max === r
      ? ((g - b) / delta) % 6
      : max === g
        ? (b - r) / delta + 2
        : (r - g) / delta + 4;
  return [((hue * 60 + 360) % 360) / 360, saturation, lightness];
}

function fromHsl([h, s, l]) {
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - chroma / 2;
  const rgb =
    h < 1 / 6
      ? [chroma, x, 0]
      : h < 2 / 6
        ? [x, chroma, 0]
        : h < 3 / 6
          ? [0, chroma, x]
          : h < 4 / 6
            ? [0, x, chroma]
            : h < 5 / 6
              ? [x, 0, chroma]
              : [chroma, 0, x];
  return rgb.map((channel) => channel + m).concat(1);
}

function sameToneSuggestion(fg, bg, minimum) {
  const hsl = toHsl(fg);
  const destination = luminance(fg) > luminance(bg) ? 1 : 0;
  let low = 0;
  let high = 1;
  for (let i = 0; i < 24; i++) {
    const amount = (low + high) / 2;
    const candidate = fromHsl([
      hsl[0],
      hsl[1],
      hsl[2] * (1 - amount) + destination * amount,
    ]);
    if (contrast(candidate, bg) >= minimum) high = amount;
    else low = amount;
  }
  return toHex(
    fromHsl([hsl[0], hsl[1], hsl[2] * (1 - high) + destination * high])
  );
}

export function getContrastReport(
  css = fs.readFileSync(path.resolve("styles/tokens.css"), "utf8")
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
  ].map(([, hex]) => parseColor("#" + hex));
  const pairs = [];
  const add = (theme, name, fgValue, bgValue, minimum, category) => {
    const fg = parseColor(fgValue);
    const bg = parseColor(bgValue);
    const value = contrast(fg, bg);
    pairs.push({
      theme,
      name,
      foreground: fgValue,
      background: bgValue,
      ratio: value,
      minimum,
      category,
      suggestion:
        value < minimum
          ? "Suggested same-tone foreground adjustment: " +
            sameToneSuggestion(fg, bg, minimum)
          : null,
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
    add(theme, "fg-muted/bg", vars["fg-muted"], vars.bg, 4.5, "text");
    add(
      theme,
      "fg-muted/bg-elevated",
      vars["fg-muted"],
      vars["bg-elevated"],
      4.5,
      "text"
    );
    add(theme, "accent-fg/accent", vars["accent-fg"], vars.accent, 4.5, "text");
    add(
      theme,
      "accent-text/bg",
      vars["accent-text"] || vars.accent,
      vars.bg,
      4.5,
      "text"
    );
    add(
      theme,
      "accent-text/bg-elevated",
      vars["accent-text"] || vars.accent,
      vars["bg-elevated"],
      4.5,
      "text"
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
    if (gold.length) {
      const foreground = parseColor(vars["accent-fg"]);
      const darkest = gold.reduce((worst, stop) =>
        contrast(foreground, stop) < contrast(foreground, worst) ? stop : worst
      );
      add(
        theme,
        "primary gold button text",
        vars["accent-fg"],
        toHex(darkest),
        4.5,
        "button"
      );
    }
    if (theme === "pet")
      add(theme, "pet solid button text", vars.bg, vars.fg, 4.5, "button");
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
        "- " + pair.theme + " " + pair.name + ": " + pair.suggestion
      );
    process.exitCode = 1;
  }
}
