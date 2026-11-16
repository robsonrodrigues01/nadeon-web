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

test.beforeEach(async ({ page }) => {
  await mockExternalNetwork(page);
});

test.describe("W3-51 deferred overlays", () => {
  test("loads the cart drawer, traps focus, and restores it after Escape", async ({
    page,
  }) => {
    await page.goto("/human");

    const trigger = page.getByRole("link", { name: /cart \(\d+\)/i });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: /your cart/i });
    await expect(
      dialog.getByRole("heading", { name: /your cart is empty/i })
    ).toBeVisible();
    const first = dialog.getByRole("button", { name: /close cart/i });
    const last = dialog.getByRole("link", { name: /take the quiz/i });
    await expect(first).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(last).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("loads cookie settings, traps focus, and restores it after Escape", async ({
    page,
  }) => {
    await page.goto("/human");

    const banner = page.getByRole("region", {
      name: /cookie consent banner/i,
    });
    const trigger = banner.getByRole("button", { name: "Settings" });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: /cookie settings/i });
    const first = dialog.getByRole("button", {
      name: /close cookie settings/i,
    });
    const last = dialog.getByRole("button", { name: /save preferences/i });
    await expect(dialog.getByLabel("Analytics Cookies")).toBeVisible();
    await expect(first).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(last).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("loads the first-visit popup, traps focus, and closes it with Escape", async ({
    page,
  }) => {
    await page.goto("/human");

    await page.getByRole("button", { name: "Accept all" }).click();

    const dialog = page.getByRole("dialog", {
      name: /10% off your first order/i,
    });
    const close = dialog.getByRole("button", { name: "Close dialog" });
    const last = dialog.getByRole("button", { name: "No thanks" });
    await expect(dialog.getByLabel("Email address")).toBeVisible();
    await expect(dialog.getByLabel("Email address")).toBeFocused();
    await close.focus();
    await page.keyboard.press("Shift+Tab");
    await expect(last).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(page.locator("body")).toBeFocused();
  });
});

test.describe("W3-51 deferred quiz results", () => {
  test("loads the Human result after the final answer", async ({ page }) => {
    await page.goto("/human/quiz");
    await page.getByRole("button", { name: /start the quiz/i }).click();

    for (const answer of [
      "35 to 44",
      "Daily energy",
      "Most days",
      "Capsules",
      "No, I am new to NMN",
    ]) {
      await page.getByRole("button", { name: answer }).click();
      await page.getByRole("button", { name: /continue/i }).click();
    }

    await expect(page.getByRole("status")).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 1, name: "Your Routine" })
    ).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole("button", { name: /retake quiz/i })
    ).toBeVisible();
  });

  test("loads the Pet result after the final answer", async ({
    page,
  }, testInfo) => {
    await page.goto("/pet/quiz");
    await page.getByRole("button", { name: /start dog quiz/i }).click();

    const petName = `Pet-${Date.now()}-${testInfo.workerIndex}`;
    await page.getByLabel(/what is your dog's name/i).fill(petName);
    await page.getByLabel(/how much does .* weigh/i).fill("65");
    await page.getByRole("button", { name: "Senior" }).click();
    await page.getByRole("button", { name: /continue/i }).click();
    await page.getByRole("button", { name: "Joints and mobility" }).click();
    await page.getByRole("button", { name: /continue/i }).click();
    await page
      .getByRole("button", { name: "No, eats almost anything" })
      .click();
    await page.getByRole("button", { name: /continue/i }).click();

    await expect(page.getByRole("status")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      petName
    );
  });
});

test.describe("W3-51 account feedback", () => {
  test.describe.configure({ mode: "serial" });

  test("pauses an active subscription and announces the updated status", async ({
    page,
  }) => {
    await page.goto("/account/subscriptions");

    const card = page
      .getByRole("article")
      .filter({ has: page.getByRole("button", { name: "Pause" }) })
      .first();
    await card.getByRole("button", { name: "Pause" }).click();

    await expect(card.getByRole("status")).toContainText(/paused/i);
    await expect(card.getByRole("status")).toBeVisible();
  });

  test("cancels a subscription and announces the updated status", async ({
    page,
  }) => {
    await page.goto("/account/subscriptions");
    await page
      .getByRole("link", { name: "Cancel subscription" })
      .first()
      .click();

    await page.getByRole("radio").first().check();
    await page.getByRole("button", { name: "Cancel subscription" }).click();

    const status = page.getByRole("status");
    await expect(status).toContainText(/cancelled/i);
    await expect(status).toContainText(/subscription status: cancelled/i);
  });

  test("saves the current profile with a unique update and announces it", async ({
    page,
  }, testInfo) => {
    await page.goto("/account/settings");

    const firstName = page.getByLabel("First name");
    const currentName = await firstName.inputValue();
    const updatedName = `${currentName} ${Date.now()}-${testInfo.workerIndex}`;
    await firstName.fill(updatedName);
    await page.getByRole("button", { name: "Save changes" }).click();

    await expect(page.getByRole("status")).toBeVisible();
    await expect(firstName).toHaveValue(updatedName);
    await page.reload();
    await expect(firstName).toHaveValue(updatedName);
  });
});
