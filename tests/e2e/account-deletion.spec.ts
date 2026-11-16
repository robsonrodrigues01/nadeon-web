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

if (!process.env.VITEST) {
  test.describe("Account Settings — Account Deletion Flow", () => {
    test.beforeEach(async ({ page }) => {
      await mockExternalNetwork(page);
    });

    test("opens deletion confirmation dialog, cancels with 'Keep my account', and restores focus", async ({
      page,
    }) => {
      await page.goto("/account/settings");

      // Verify Delete account section
      await expect(
        page.getByRole("heading", { name: /delete account/i })
      ).toBeVisible();

      const trigger = page.getByRole("button", {
        name: /request account deletion/i,
      });
      await expect(trigger).toBeVisible();
      await trigger.click();

      // Alert dialog is displayed
      const dialog = page.getByRole("alertdialog");
      await expect(dialog).toBeVisible();
      await expect(
        dialog.getByRole("heading", {
          name: /confirm account deletion request/i,
        })
      ).toBeVisible();

      // Cancel deletion via "Keep my account" button
      const cancelButton = dialog.getByRole("button", {
        name: /keep my account/i,
      });
      await cancelButton.click();

      // Dialog is dismissed and trigger regains focus
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });

    test("dismisses deletion confirmation dialog with Escape key and restores focus", async ({
      page,
    }) => {
      await page.goto("/account/settings");

      const trigger = page.getByRole("button", {
        name: /request account deletion/i,
      });
      await trigger.click();

      const dialog = page.getByRole("alertdialog");
      await expect(dialog).toBeVisible();

      // Press Escape to dismiss
      await page.keyboard.press("Escape");

      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });

    test("confirms account deletion request and displays confirmation with reference number", async ({
      page,
    }) => {
      await page.goto("/account/settings");

      const trigger = page.getByRole("button", {
        name: /request account deletion/i,
      });
      await trigger.click();

      const dialog = page.getByRole("alertdialog");
      await expect(dialog).toBeVisible();

      // Submit confirmation
      const confirmButton = dialog.getByRole("button", {
        name: /confirm deletion/i,
      });
      await confirmButton.click();

      // Verify success state rendered by dedicated action
      await expect(
        page.getByRole("heading", { name: /deletion request received/i })
      ).toBeVisible();

      const statusMessage = page.getByRole("status");
      await expect(statusMessage).toBeVisible();
      await expect(statusMessage).toContainText(/reference #/i);
    });
  });
}
