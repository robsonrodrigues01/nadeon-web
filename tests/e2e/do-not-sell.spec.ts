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
  test.describe("Legal — Do Not Sell Privacy Request Flow", () => {
    test.beforeEach(async ({ page }) => {
      await mockExternalNetwork(page);
    });

    test("shows validation error when state of residence is not selected", async ({
      page,
    }) => {
      await page.goto("/legal/do-not-sell");

      // Verify page and form headings
      await expect(
        page.getByRole("heading", { level: 1, name: /do not sell/i })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /submit a request/i })
      ).toBeVisible();

      // Fill in user details but leave state unselected
      await page.getByLabel(/^first name/i).fill("Alex");
      await page.getByLabel(/^last name/i).fill("Morgan");
      await page.getByLabel(/^email/i).fill("alex.morgan@example.com");

      // Check confirmation accuracy
      await page
        .getByRole("checkbox", {
          name: /i confirm that i am the person named above/i,
        })
        .check();

      // Submit form
      const submitButton = page.getByRole("button", {
        name: /submit request/i,
      });
      await submitButton.click();

      // Assert error message is announced in status region
      const errorStatus = page.locator("#privacy-validation-error");
      await expect(errorStatus).toBeVisible();
      await expect(errorStatus).toContainText(
        /select your state of residence/i
      );

      // Assert state select is marked invalid
      const stateSelect = page.locator("#state-residence");
      await expect(stateSelect).toHaveAttribute("aria-invalid", "true");
    });

    test("submits valid privacy request and displays confirmation with reference number", async ({
      page,
    }) => {
      await page.goto("/legal/do-not-sell");

      // Select request type
      const requestTypeRadio = page.getByRole("radio", {
        name: /do not sell or share my personal information/i,
      });
      await requestTypeRadio.check();

      // Select state of residence
      await page.getByLabel(/state of residence/i).selectOption("CA");

      // Fill personal information
      await page.getByLabel(/^first name/i).fill("Alex");
      await page.getByLabel(/^last name/i).fill("Morgan");
      await page.getByLabel(/^email/i).fill("alex.morgan@example.com");

      // Confirm accuracy
      await page
        .getByRole("checkbox", {
          name: /i confirm that i am the person named above/i,
        })
        .check();

      // Submit request
      const submitButton = page.getByRole("button", {
        name: /submit request/i,
      });
      await submitButton.click();

      // Assert confirmation view is displayed
      await expect(
        page.getByRole("heading", { name: /request received/i })
      ).toBeVisible();
      await expect(
        page.getByText(/your request has been received/i)
      ).toBeVisible();
      await expect(page.getByText(/reference #/i)).toBeVisible();
    });
  });
}
