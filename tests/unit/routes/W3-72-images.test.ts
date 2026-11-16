import { describe, expect, it } from "vitest";
import fs from "node:fs";

const source = (file: string) => fs.readFileSync(file, "utf8");

describe("W3-72 responsive image loading", () => {
  it("sizes kit images for the 1, 2, and 4 column grid without eager loading", () => {
    const browser = source(
      "app/(human)/human/kits/_components/kits-browser.tsx"
    );

    expect(browser).toContain(
      'sizes="(min-width: 64rem) calc((min(100vw, 1200px) - 168px) / 4), (min-width: 48rem) calc((min(100vw, 1200px) - 88px) / 2), (min-width: 40rem) calc((100vw - 56px) / 2), calc(100vw - 32px)"'
    );
    expect(browser).not.toContain('loading="eager"');
    expect(browser).not.toContain("preload");
  });

  it("preloads only the primary above-the-fold image in the Human hero", () => {
    const hero = source("app/(human)/human/_components/hero.tsx");
    const heroImages = hero.match(/<Image[\s\S]*?\/>/g) ?? [];
    const preloadedImages = heroImages.filter((image) =>
      image.includes("preload")
    );

    expect(preloadedImages).toHaveLength(1);
    expect(preloadedImages[0]).toContain('src="/renders/biohack.png"');
    expect(preloadedImages[0]).toContain(
      'sizes="(max-width: 639px) 96px, 128px"'
    );
    expect(preloadedImages[0]).not.toContain('loading="eager"');

    const fullCharge = heroImages.find((image) =>
      image.includes('src="/renders/full-charge.png"')
    );
    expect(fullCharge).toBeDefined();
    expect(fullCharge).toContain('sizes="(max-width: 639px) 96px, 128px"');
  });
});
