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
  test.describe("Pet Product Purchase Flow", () => {
    test.beforeEach(async ({ page }) => {
      await mockExternalNetwork(page);
    });

    test("navigates to pet product page and displays details and animal compliance notice", async ({
      page,
    }) => {
      await page.goto("/pet/products/more-good-years");

      // Verify product heading and info
      await expect(
        page.getByRole("heading", { level: 1, name: /more good years/i })
      ).toBeVisible();

      // Verify compliance disclaimer for pet products
      await expect(page.getByText(/for animal use only/i)).toBeVisible();

      // Verify Add to cart button is present
      const addToCartButton = page.getByRole("button", {
        name: /add to cart/i,
      });
      await expect(addToCartButton).toBeVisible();
    });

    test("toggles between subscription and one-time purchase, configures options, and adds to cart", async ({
      page,
    }) => {
      await page.goto("/pet/products/more-good-years");

      const subscriptionRadio = page.getByRole("radio", {
        name: /subscribe & save/i,
      });
      const oneTimeRadio = page.getByRole("radio", {
        name: /one-time purchase/i,
      });

      // Default is subscription
      await expect(subscriptionRadio).toBeChecked();
      await expect(
        page.getByRole("radio", { name: /2 jars every 60 days/i })
      ).toBeVisible();

      // Switch to one-time purchase
      await oneTimeRadio.check();
      await expect(oneTimeRadio).toBeChecked();
      await expect(subscriptionRadio).not.toBeChecked();

      // Select 2 jars variant in one-time mode
      const twoJarsRadio = page.getByRole("radio", { name: /2 jars/i });
      await twoJarsRadio.check();
      await expect(twoJarsRadio).toBeChecked();

      // Click Add to cart
      const addToCartButton = page.getByRole("button", {
        name: /add to cart/i,
      });
      await addToCartButton.click();

      // Verify live region feedback
      await expect(page.getByText(/added .* to cart/i)).toBeVisible();

      // Navigate to /cart and verify product is present
      await page.goto("/cart");
      await expect(
        page.getByRole("heading", { level: 1, name: /your cart/i })
      ).toBeVisible();
      await expect(page.getByText(/more good years/i)).toBeVisible();
      await expect(page.getByRole("link", { name: /checkout/i })).toBeVisible();
    });

    test("subscribes to pet product and verifies subscription item in cart", async ({
      page,
    }) => {
      await page.goto("/pet/products/more-good-years");

      const subscriptionRadio = page.getByRole("radio", {
        name: /subscribe & save/i,
      });
      await subscriptionRadio.check();

      // Select 1 jar every 30 days plan
      const plan30Radio = page.getByRole("radio", {
        name: /1 jar every 30 days/i,
      });
      await plan30Radio.check();
      await expect(plan30Radio).toBeChecked();

      const addToCartButton = page.getByRole("button", {
        name: /add to cart/i,
      });
      await addToCartButton.click();

      await expect(page.getByText(/added .* to cart/i)).toBeVisible();

      await page.goto("/cart");
      await expect(page.getByText(/more good years/i)).toBeVisible();
      await expect(page.getByText(/every 30 days/i)).toBeVisible();
    });
  });
}
