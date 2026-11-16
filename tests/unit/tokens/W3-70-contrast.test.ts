import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

function parseColor(value: string): [number, number, number, number] {
  const hex = value.match(/^#([\da-f]{3}|[\da-f]{6})$/i)?.[1];
  if (hex) {
    const expanded =
      hex.length === 3 ? [...hex].map((part) => part + part).join("") : hex;
    const parts = expanded
      .match(/../g)!
      .map((part) => parseInt(part, 16) / 255);
    return [parts[0], parts[1], parts[2], 1];
  }
  const rgb = value
    .match(/^rgba?\(([^)]+)\)$/i)?.[1]
    ?.split(/[\s,/]+/)
    .filter(Boolean);
  if (!rgb || rgb.length < 3) {
    throw new Error(`Unsupported CSS color: ${value}`);
  }
  return [
    Number(rgb[0]) / 255,
    Number(rgb[1]) / 255,
    Number(rgb[2]) / 255,
    rgb[3] !== undefined ? Number(rgb[3]) : 1,
  ];
}

function composite(
  fg: [number, number, number, number],
  bg: [number, number, number, number]
): [number, number, number, number] {
  const a = fg[3];
  return [
    fg[0] * a + bg[0] * (1 - a),
    fg[1] * a + bg[1] * (1 - a),
    fg[2] * a + bg[2] * (1 - a),
    1,
  ];
}

function luminance(color: [number, number, number, number]): number {
  const channels = color
    .slice(0, 3)
    .map((v) =>
      v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    );
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(
  fgValue: string | [number, number, number, number],
  bgValue: string | [number, number, number, number]
): number {
  const fg = typeof fgValue === "string" ? parseColor(fgValue) : fgValue;
  const bg = typeof bgValue === "string" ? parseColor(bgValue) : bgValue;
  const blendedFg = fg[3] < 1 ? composite(fg, bg) : fg;
  const l1 = luminance(blendedFg);
  const l2 = luminance(bg);
  const [lighter, darker] = [Math.max(l1, l2), Math.min(l1, l2)];
  return (lighter + 0.05) / (darker + 0.05);
}

function loadTokens() {
  const css = fs.readFileSync(path.resolve("styles/tokens.css"), "utf8");
  const blocks = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(
    ([, selector, body]) => ({
      selector,
      vars: Object.fromEntries(
        [...body.matchAll(/--([\w-]+)\s*:\s*([^;]+)\s*;/g)].map(
          ([, key, value]) => [key, value.trim()]
        )
      ),
    })
  );

  const human = Object.assign(
    {},
    ...blocks
      .filter((b) => b.selector.includes('[data-theme="human"]'))
      .map((b) => b.vars)
  );

  const pet = Object.assign(
    {},
    ...blocks
      .filter((b) => b.selector.includes('[data-theme="pet"]'))
      .map((b) => b.vars)
  );

  const goldMatches = [
    ...(css.match(/--gradient-gold\s*:\s*([^;]+);/)?.[1] || "").matchAll(
      /#([\da-f]{3}|[\da-f]{6})\b/gi
    ),
  ].map(([, hex]) => `#${hex}`);

  return { human, pet, goldStops: goldMatches, css };
}

describe("W3-70: WCAG AA contrast for Pet and Human tokens", () => {
  const { human, pet, goldStops, css } = loadTokens();

  describe("Token definition and button preservation", () => {
    it("defines --accent-text token for both human and pet themes", () => {
      expect(human["accent-text"]).toBeDefined();
      expect(pet["accent-text"]).toBeDefined();
    });

    it("does not darken --accent globally in Pet theme to avoid breaking buttons", () => {
      // Pet --accent remains the gold brand accent (#e0a63c)
      expect(pet.accent.toLowerCase()).toBe("#e0a63c");
      // And accent-fg (#2a1710) on --accent satisfies WCAG AA (> 4.5:1)
      const buttonTextContrast = contrastRatio(pet["accent-fg"], pet.accent);
      expect(buttonTextContrast).toBeGreaterThanOrEqual(4.5);
    });

    it("defines --accent-text in Pet theme with contrast >= 4.5:1 against Pet surfaces", () => {
      const onBg = contrastRatio(pet["accent-text"], pet.bg);
      const onElevated = contrastRatio(pet["accent-text"], pet["bg-elevated"]);
      expect(onBg).toBeGreaterThanOrEqual(4.5);
      expect(onElevated).toBeGreaterThanOrEqual(4.5);
    });

    it("exposes --color-accent-text in @theme inline and accessible utility classes", () => {
      expect(css).toContain("--color-accent-text: var(--accent-text);");
      expect(css).toContain("color: var(--accent-text);");
    });
  });

  describe("Comprehensive token pair contrast ratios", () => {
    it("satisfies WCAG AA (>= 4.5:1) for text pairs in Human theme", () => {
      expect(contrastRatio(human.fg, human.bg)).toBeGreaterThanOrEqual(4.5);
      expect(
        contrastRatio(human.fg, human["bg-elevated"])
      ).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(human["fg-muted"], human.bg)).toBeGreaterThanOrEqual(
        4.5
      );
      expect(
        contrastRatio(human["fg-muted"], human["bg-elevated"])
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrastRatio(human["accent-text"], human.bg)
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrastRatio(human["accent-text"], human["bg-elevated"])
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrastRatio(human["accent-fg"], human.accent)
      ).toBeGreaterThanOrEqual(4.5);
    });

    it("satisfies WCAG AA (>= 4.5:1) for text pairs in Pet theme", () => {
      expect(contrastRatio(pet.fg, pet.bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(pet.fg, pet["bg-elevated"])).toBeGreaterThanOrEqual(
        4.5
      );
      expect(contrastRatio(pet["fg-muted"], pet.bg)).toBeGreaterThanOrEqual(
        4.5
      );
      expect(
        contrastRatio(pet["fg-muted"], pet["bg-elevated"])
      ).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(pet["accent-text"], pet.bg)).toBeGreaterThanOrEqual(
        4.5
      );
      expect(
        contrastRatio(pet["accent-text"], pet["bg-elevated"])
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrastRatio(pet["accent-fg"], pet.accent)
      ).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(pet.bg, pet.fg)).toBeGreaterThanOrEqual(4.5);
    });

    it("satisfies WCAG AA (>= 4.5:1) for selected navigation tint surface (accent/10 on bg)", () => {
      const humanBg = parseColor(human.bg);
      const humanAccentTint = composite([0.88, 0.65, 0.24, 0.1], humanBg);
      expect(
        contrastRatio(human["accent-text"], humanAccentTint)
      ).toBeGreaterThanOrEqual(4.5);

      const petBg = parseColor(pet.bg);
      const petAccentTint = composite([0.88, 0.65, 0.24, 0.1], petBg);
      expect(
        contrastRatio(pet["accent-text"], petAccentTint)
      ).toBeGreaterThanOrEqual(4.5);
    });

    it("satisfies WCAG AA (>= 4.5:1) for primary gold buttons on worst stop in both themes", () => {
      const minStopHuman = Math.min(
        ...goldStops.map((stop) => contrastRatio(human["accent-fg"], stop))
      );
      expect(minStopHuman).toBeGreaterThanOrEqual(4.5);

      const minStopPet = Math.min(
        ...goldStops.map((stop) => contrastRatio(pet["accent-fg"], stop))
      );
      expect(minStopPet).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe("Gradient text elimination and small auxiliary text opacity", () => {
    it("does not use bg-gradient-gold as text in app/not-found.tsx", () => {
      const notFoundContent = fs.readFileSync(
        path.resolve("app/not-found.tsx"),
        "utf8"
      );
      expect(notFoundContent).not.toMatch(/bg-gradient-gold\s+bg-clip-text/);
    });

    it("does not use bg-gradient-gold as text in components/layout/popup/first-visit-popup.tsx", () => {
      const popupContent = fs.readFileSync(
        path.resolve("components/layout/popup/first-visit-popup.tsx"),
        "utf8"
      );
      expect(popupContent).not.toMatch(/bg-gradient-gold\s+bg-clip-text/);
    });

    it("does not apply compounding opacity (opacity-70 with fg-muted/70) to legal auxiliary text", () => {
      const newsletterContent = fs.readFileSync(
        path.resolve("components/brand/newsletter/newsletter.tsx"),
        "utf8"
      );
      expect(newsletterContent).not.toContain(
        "text-fg-muted/70 mt-2.5 leading-normal opacity-70"
      );

      const popupContent = fs.readFileSync(
        path.resolve("components/layout/popup/first-visit-popup.tsx"),
        "utf8"
      );
      expect(popupContent).not.toContain(
        "text-fg-muted/70 mt-2 text-center leading-normal"
      );
    });
  });
});
