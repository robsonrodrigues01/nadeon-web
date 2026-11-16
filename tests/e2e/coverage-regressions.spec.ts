import process from "node:process";
import { expect, test, type Page } from "@playwright/test";

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

test.describe("Journey regression coverage", () => {
  test.beforeEach(async ({ page }) => {
    await mockExternalNetwork(page);
  });

  test("lets visitors look up an order from Help", async ({
    page,
  }, testInfo) => {
    await page.goto("/help");

    const lookup = page.getByRole("region", { name: /where is my order/i });
    await lookup.getByLabel("Order number").fill("NL-000000");
    await lookup
      .getByLabel("Email")
      .fill(`e2e-${testInfo.testId}@example.invalid`);
    await lookup.getByRole("button", { name: /track order/i }).click();

    await expect(lookup.getByRole("status")).toContainText(/no order found/i);
  });

  test("lets visitors look up an order from Track", async ({
    page,
  }, testInfo) => {
    await page.goto("/track");

    const lookup = page.getByRole("region", { name: /find your order/i });
    await lookup.getByLabel("Order number").fill("NL-000000");
    await lookup
      .getByLabel("Email")
      .fill(`e2e-${testInfo.testId}@example.invalid`);
    await lookup.getByRole("button", { name: /track order/i }).click();

    await expect(lookup.getByRole("status")).toContainText(/no order found/i);
    await expect(lookup.getByLabel("Order number")).toHaveValue("NL-000000");
  });

  test("supports reorder and copy-link actions in order history", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: async () => {} },
      });
    });
    await page.goto("/account/orders");

    await page
      .getByRole("button", { name: /buy again/i })
      .first()
      .click();
    await expect(
      page.getByRole("status").filter({ hasText: /added to cart/i })
    ).toBeVisible();

    await page
      .getByRole("button", { name: /copy link/i })
      .first()
      .click();
    await expect(
      page.getByRole("status").filter({ hasText: /link copied/i })
    ).toBeVisible();
  });

  test("shows an empty cart without shipping progress", async ({ page }) => {
    await page.goto("/cart");

    await expect(
      page.getByRole("heading", { level: 1, name: /your cart is empty/i })
    ).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: /shop pet categories/i })
    ).toBeVisible();
    await expect(
      page.getByRole("progressbar", { name: /free shipping progress/i })
    ).toHaveCount(0);
  });

  test("shows shipping progress for a filled cart", async ({ page }) => {
    await page.goto("/dev/kit");
    await page
      .getByRole("button", { name: /add to cart/i })
      .first()
      .click();
    await expect(
      page.getByRole("status").filter({ hasText: /added .* to cart/i })
    ).toBeVisible();

    await page.goto("/cart");
    await expect(
      page.getByRole("list", { name: /items in your cart/i })
    ).toBeVisible();
    await expect(
      page.getByRole("progressbar", { name: /free shipping progress/i })
    ).toBeVisible();
  });

  test("reserves footer space while the cookie banner is open", async ({
    page,
  }) => {
    await page.goto("/human");

    const banner = page.getByRole("region", {
      name: /cookie consent banner/i,
    });
    await expect(banner).toBeVisible();
    await page.keyboard.press("End");

    await expect
      .poll(async () => {
        const bannerBox = await banner.boundingBox();
        const reservedSpace = await page.evaluate(
          () =>
            Number.parseFloat(getComputedStyle(document.body).paddingBottom) ||
            0
        );
        return Boolean(bannerBox && reservedSpace >= bannerBox.height);
      })
      .toBe(true);
  });

  test("makes the skip link the first keyboard target", async ({ page }) => {
    await page.goto("/");

    const skipLink = page.getByRole("link", {
      name: /skip to (main )?content/i,
    });
    await page.keyboard.press("Tab");
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toHaveAttribute("href", "#main-content");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main-content$/);
  });

  test("opens legal pages and the not-found route", async ({ page }) => {
    const legalPages = [
      ["/legal/terms", /terms of service/i],
      ["/legal/privacy", /privacy policy/i],
      ["/legal/do-not-sell", /your privacy choices/i],
      ["/legal/accessibility", /accessibility statement/i],
    ] as const;

    for (const [path, heading] of legalPages) {
      await page.goto(path);
      await expect(
        page.getByRole("heading", { level: 1, name: heading })
      ).toBeVisible();
    }

    await page.goto("/e2e-route-not-found");
    await expect(
      page.getByRole("heading", { level: 1, name: /this page wandered off/i })
    ).toBeVisible();
  });
});
