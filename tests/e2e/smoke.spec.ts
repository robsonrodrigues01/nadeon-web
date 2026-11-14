import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("smoke and accessibility", () => {
  test("homepage opens and passes axe scan", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("main")).toBeVisible();
    await expect(page).toHaveTitle(/Nadeon Labs/);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .disableRules(["page-has-heading-one"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
