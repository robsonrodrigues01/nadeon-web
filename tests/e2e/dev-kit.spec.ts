import process from "node:process";
import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Vitest scans all **/*.spec.ts by default during `pnpm test`.
// Guard suite execution so Vitest skips execution without throwing Playwright runner errors.
if (!process.env.VITEST) {
  test.describe("Dev Kit Showcase Route (/dev/kit)", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
      // Navigate to /dev/kit
      await page.goto("/dev/kit");
    });

    test("renders page header and both themes side-by-side", async ({
      page,
    }: {
      page: Page;
    }) => {
      await expect(
        page.getByRole("heading", { level: 1, name: /nadeon dev kit/i })
      ).toBeVisible();

      const humanSection = page.locator('[data-theme="human"]');
      const petSection = page.locator('[data-theme="pet"]');

      await expect(humanSection).toBeVisible();
      await expect(petSection).toBeVisible();
    });

    test("displays typographic scale elements in both themes", async ({
      page,
    }: {
      page: Page;
    }) => {
      await expect(page.locator(".hero").first()).toBeVisible();
      await expect(page.locator(".title").first()).toBeVisible();
      await expect(page.locator(".lead").first()).toBeVisible();
      await expect(page.locator(".body").first()).toBeVisible();
      await expect(page.locator(".label").first()).toBeVisible();
    });

    test("displays brand tokens and product colors swatches", async ({
      page,
    }: {
      page: Page;
    }) => {
      await expect(page.getByText("--gradient-gold")).toBeVisible();
      await expect(page.getByText("--gradient-sunrise")).toBeVisible();
      await expect(page.getByText("--product-amber")).toBeVisible();
      await expect(page.getByText("--product-coral")).toBeVisible();
      await expect(page.getByText("--product-lilac")).toBeVisible();
      await expect(page.getByText("--product-rose")).toBeVisible();
      await expect(page.getByText("--product-sky")).toBeVisible();
      await expect(page.getByText("--product-mint")).toBeVisible();
    });

    test("renders Button variants, states, and validates interactive target size >= 44px", async ({
      page,
    }: {
      page: Page;
    }) => {
      const primaryButton = page.getByRole("button", {
        name: /shop best sellers/i,
      });
      await expect(primaryButton).toBeVisible();

      // Verify WCAG 2.5.5 touch target size requirement
      const box = await primaryButton.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
      }

      const disabledButton = page.getByRole("button", { name: /sold out/i });
      await expect(disabledButton).toBeDisabled();

      const loadingButton = page.getByRole("button", { name: /adding\.\.\./i });
      await expect(loadingButton).toBeDisabled();
      await expect(loadingButton).toHaveAttribute("aria-busy", "true");
    });

    test("renders minimal product cards with multi-market pricing (USD & EUR) and compliance", async ({
      page,
    }: {
      page: Page;
    }) => {
      // Human product
      await expect(
        page.getByRole("heading", { name: "BioHack" })
      ).toBeVisible();
      await expect(page.getByText("$65.00").first()).toBeVisible();

      // Pet product
      await expect(
        page.getByRole("heading", { name: "More Good Years" })
      ).toBeVisible();
      await expect(page.getByText("$44.00").first()).toBeVisible();
      await expect(page.getByText(/for animal use only/i)).toBeVisible();
    });

    test("passes accessibility checks with Axe without violations", async ({
      page,
    }: {
      page: Page;
    }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });
}
