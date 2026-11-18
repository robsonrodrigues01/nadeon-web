import process from "node:process";
import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  "/account/email-preferences",
  "/account/pets",
  "/account/subscriptions/sub_biohack_001/cancel",
  "/human/compare",
  "/human/kits",
  "/human/kits/the-duo",
  "/human/shop",
  "/human/shop/capsules",
  "/human/subscribe",
  "/pet/benefit/joints-mobility",
  "/pet/breeds",
  "/pet/breeds/labrador-retriever",
  "/pet/cats",
  "/pet/concern/joints-mobility",
  "/pet/dogs",
  "/pet/dose-calculator",
  "/pet/horses",
  "/pet/journal",
  "/pet/kits",
  "/pet/kits/pet-vitality-duo",
  "/pet/subscribe",
  "/about",
  "/affiliates",
  "/courses/30-day-longevity",
  "/experts",
  "/faq",
  "/gift-card",
  "/ingredients",
  "/journal",
  "/journal/nmn-vs-nad-what-is-the-difference",
  "/journal/category/dog-health",
  "/lab-results",
  "/offers/model",
  "/professionals",
  "/reviews",
  "/science",
  "/search",
  "/shipping-returns",
  "/where-to-buy",
  "/wholesale",
  "/pet",
] as const;

async function mockExternalNetwork(page: Page) {
  const appOrigin = new URL(
    process.env.PLAYWRIGHT_TEST_BASE_URL ??
      `http://localhost:${process.env.PORT ?? "3000"}`
  ).origin;

  await page.route("**/*", async (route) => {
    if (new URL(route.request().url()).origin === appOrigin) {
      await route.continue();
      return;
    }
    await route.fulfill({ status: 204 });
  });
}

test.describe("W5-32 page route smoke and accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await mockExternalNetwork(page);
  });

  for (const route of routes) {
    test(`${route} returns 200, renders one h1, stays error-free and passes axe`, async ({
      page,
    }) => {
      const consoleErrors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => consoleErrors.push(error.message));

      const response = await page.goto(route);
      expect(response?.status(), `${route} response status`).toBe(200);
      const headings = page.getByRole("heading", { level: 1 });
      await expect(headings, `${route} h1 count`).toHaveCount(1);
      await expect(headings, `${route} h1 visibility`).toBeVisible();

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .disableRules(["page-has-heading-one"])
        .analyze();
      expect(
        accessibilityScanResults.violations,
        `${route} axe violations`
      ).toEqual([]);

      expect(consoleErrors).toEqual([]);
    });
  }
});
