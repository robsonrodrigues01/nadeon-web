import process from "node:process";
import { expect, test, type Page } from "@playwright/test";

const measurementHosts =
  /googletagmanager\.com|google-analytics\.com|clarity\.ms|connect\.facebook\.net/;

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

test.beforeEach(async ({ page }) => {
  await mockExternalNetwork(page);
});

test.describe("W4-24 wave 4 customer flows", () => {
  test("tracks a TEST guest order without putting the email in the URL", async ({
    page,
  }) => {
    await page.goto("/track");
    await page.getByLabel("Order number").fill("TEST-NL-0001");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByRole("button", { name: "Track order" }).click();

    await expect(
      page.getByRole("heading", { name: "Order #TEST-NL-0001" })
    ).toBeVisible();
    await expect(page.getByText("Tracking 1Z9999999999999999")).toBeVisible();
    await expect(page).toHaveURL(/\/track(?:$|\?)/);
    expect(new URL(page.url()).search).toBe("");
  });

  test("tracks a TEST order from Help and sends a copy of the message", async ({
    page,
  }) => {
    await page.goto("/help");

    const trackSection = page.locator("#track");
    await trackSection.getByLabel("Order number").fill("TEST-NL-0001");
    await trackSection.getByLabel("Email").fill("test@example.com");
    await trackSection.getByRole("button", { name: "Track order" }).click();
    await expect(trackSection.getByRole("status")).toContainText(
      "Order #TEST-NL-0001"
    );
    await expect(
      trackSection.getByRole("link", { name: /track package/i })
    ).toBeVisible();

    const contactSection = page.locator("#contact");
    await contactSection.getByLabel("Name").fill("Test Shopper");
    await contactSection.getByLabel("Email").fill("test@example.com");
    await contactSection.getByLabel("Topic").selectOption("Orders & Shipping");
    await contactSection
      .getByLabel("Message")
      .fill("Please send me a copy of this test message.");
    await contactSection
      .getByRole("checkbox", { name: "Send me a copy of this message" })
      .check();
    await contactSection.getByRole("button", { name: "Send message" }).click();

    await expect(contactSection.getByRole("status")).toHaveText(
      "Message sent."
    );
  });

  test("does not request measurement before consent and records Accept all", async ({
    page,
  }) => {
    const measurementRequests: string[] = [];
    page.on("request", (request) => {
      if (measurementHosts.test(request.url())) {
        measurementRequests.push(request.url());
      }
    });

    await page.goto("/human", { waitUntil: "networkidle" });
    const banner = page.getByRole("region", {
      name: "Cookie consent banner",
    });
    await expect(banner).toBeVisible();
    expect(measurementRequests).toEqual([]);

    await banner.getByRole("button", { name: "Accept all" }).click();
    await expect(banner).toHaveCount(0);
    const consent = await page.evaluate(() => {
      const value = document.cookie.match(
        /(?:^|; )nadeon_consent=([^;]*)/
      )?.[1];
      return value ? JSON.parse(decodeURIComponent(value)) : null;
    });
    expect(consent.preferences).toMatchObject({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  });

  test("records Reject non-essential without enabling measurement", async ({
    page,
  }) => {
    const measurementRequests: string[] = [];
    page.on("request", (request) => {
      if (measurementHosts.test(request.url())) {
        measurementRequests.push(request.url());
      }
    });
    await page.goto("/human", { waitUntil: "networkidle" });
    const banner = page.getByRole("region", {
      name: "Cookie consent banner",
    });
    await expect(banner).toBeVisible();
    await banner.getByRole("button", { name: "Reject non-essential" }).click();
    const consent = await page.evaluate(() => {
      const value = document.cookie.match(
        /(?:^|; )nadeon_consent=([^;]*)/
      )?.[1];
      return value ? JSON.parse(decodeURIComponent(value)) : null;
    });
    expect(consent.preferences).toMatchObject({
      necessary: true,
      analytics: false,
      marketing: false,
    });
    expect(measurementRequests).toEqual([]);
  });

  test("revokes accepted optional consent in cookie settings", async ({
    page,
  }) => {
    const baseUrl =
      process.env.PLAYWRIGHT_TEST_BASE_URL ??
      `http://localhost:${process.env.PORT ?? "3000"}`;
    await page.context().addCookies([
      {
        name: "nadeon_first_visit_popup",
        value: "dismissed",
        url: baseUrl,
      },
    ]);
    await page.goto("/human");
    const banner = page.getByRole("region", {
      name: "Cookie consent banner",
    });
    await expect(banner).toBeVisible();
    await banner.getByRole("button", { name: "Accept all" }).click();
    await page.evaluate(() =>
      window.dispatchEvent(new CustomEvent("nadeon_open_consent_settings"))
    );
    const settings = page.getByRole("dialog", { name: /cookie settings/i });
    await expect(settings).toBeVisible();
    await expect(settings.getByLabel("Analytics Cookies")).toBeChecked();
    await expect(settings.getByLabel("Marketing Cookies")).toBeChecked();
    await settings.getByLabel("Analytics Cookies").uncheck();
    await settings.getByLabel("Marketing Cookies").uncheck();
    await settings.getByRole("button", { name: "Save preferences" }).click();

    const consent = await page.evaluate(() => {
      const value = document.cookie.match(
        /(?:^|; )nadeon_consent=([^;]*)/
      )?.[1];
      return value ? JSON.parse(decodeURIComponent(value)) : null;
    });
    expect(consent.preferences).toMatchObject({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  });

  test("copies an order link and adds its items to the cart again", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/account/orders/ord_TEST_0001");

    await page.getByRole("button", { name: "Copy link" }).click();
    await expect(page.getByRole("status")).toContainText("Link copied");
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(new URL("/account/orders/ord_TEST_0001", page.url()).toString());

    await page.getByRole("button", { name: "Buy again" }).click();
    await expect(page.getByRole("status")).toContainText("Added to cart");
  });
});
