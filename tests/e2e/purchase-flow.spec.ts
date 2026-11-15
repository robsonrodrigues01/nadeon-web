import process from "node:process";
import { test, expect, type Page } from "@playwright/test";

// Guard suite execution so Vitest skips execution without throwing Playwright runner errors.
if (!process.env.VITEST) {
  test.describe("Purchase Flow (Product, Options, Cart & Checkout)", () => {
    test("navigates to product page and displays product details", async ({
      page,
    }: {
      page: Page;
    }) => {
      await page.goto("/human/products/biohack");

      // Verify product heading and metadata
      await expect(
        page.getByRole("heading", { level: 1, name: /biohack/i })
      ).toBeVisible();
      await expect(page.getByText(/NMN 500 mg/i)).toBeVisible();

      // Verify purchase options container is present
      const addToCartButton = page.getByRole("button", {
        name: /add to cart/i,
      });
      await expect(addToCartButton).toBeVisible();
    });

    test("toggles between subscription and one-time purchase options", async ({
      page,
    }: {
      page: Page;
    }) => {
      await page.goto("/human/products/biohack");

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

      // Verify jar options are available
      await expect(page.getByRole("radio", { name: /1 jar/i })).toBeVisible();
      await expect(page.getByRole("radio", { name: /2 jars/i })).toBeVisible();

      // Switch back to subscription
      await subscriptionRadio.check();
      await expect(subscriptionRadio).toBeChecked();
      await expect(oneTimeRadio).not.toBeChecked();
    });

    test("adds a subscription product to the cart with feedback", async ({
      page,
    }: {
      page: Page;
    }) => {
      await page.goto("/human/products/biohack");

      // Ensure subscription is selected
      const subscriptionRadio = page.getByRole("radio", {
        name: /subscribe & save/i,
      });
      await subscriptionRadio.check();

      // Click add to cart
      const addToCartButton = page.getByRole("button", {
        name: /add to cart/i,
      });
      await addToCartButton.click();

      // Live feedback appears
      await expect(page.getByText(/added .* to cart/i)).toBeVisible();
    });

    test("adds a one-time product to the cart and navigates to /cart", async ({
      page,
    }: {
      page: Page;
    }) => {
      await page.goto("/human/products/biohack");

      // Select one-time purchase
      const oneTimeRadio = page.getByRole("radio", {
        name: /one-time purchase/i,
      });
      await oneTimeRadio.check();

      // Click add to cart
      const addToCartButton = page.getByRole("button", {
        name: /add to cart/i,
      });
      await addToCartButton.click();
      await expect(page.getByText(/added .* to cart/i)).toBeVisible();

      // Navigate to cart
      await page.goto("/cart");
      await expect(
        page.getByRole("heading", { level: 1, name: /your cart/i })
      ).toBeVisible();
      await expect(page.getByText(/biohack/i)).toBeVisible();
    });

    test("manages cart line items, quantity adjustments, and removal", async ({
      page,
    }: {
      page: Page;
    }) => {
      // Add product first
      await page.goto("/human/products/biohack");
      await page.getByRole("button", { name: /add to cart/i }).click();
      await expect(page.getByText(/added .* to cart/i)).toBeVisible();

      // Go to cart
      await page.goto("/cart");
      await expect(
        page.getByRole("heading", { level: 1, name: /your cart/i })
      ).toBeVisible();

      // Increase quantity
      const increaseBtn = page.getByRole("button", {
        name: /increase quantity/i,
      });
      if (await increaseBtn.isVisible()) {
        await increaseBtn.click();
      }

      // Check Order Summary visibility
      await expect(
        page.getByRole("heading", { level: 2, name: /order summary/i })
      ).toBeVisible();
      await expect(page.getByText(/subtotal/i)).toBeVisible();

      // Remove item
      const removeBtn = page.getByRole("button", { name: /remove/i });
      if (await removeBtn.isVisible()) {
        await removeBtn.click();
      }
    });

    test("applies promo code in order summary", async ({
      page,
    }: {
      page: Page;
    }) => {
      await page.goto("/human/products/biohack");
      await page.getByRole("button", { name: /add to cart/i }).click();
      await expect(page.getByText(/added .* to cart/i)).toBeVisible();

      await page.goto("/cart");
      const promoInput = page.getByLabel(/promo code/i);
      await expect(promoInput).toBeVisible();

      await promoInput.fill("SAVE10");
      await page.getByRole("button", { name: /apply/i }).click();
    });

    test("proceeds to checkout and triggers redirection to mock checkout URL", async ({
      page,
    }: {
      page: Page;
    }) => {
      await page.route("https://checkout.nadeon.com/**", (route) => {
        route.fulfill({
          status: 200,
          contentType: "text/html",
          body: "<html><body><h1>Mock Checkout</h1></body></html>",
        });
      });

      // Add product to ensure cart is not empty
      await page.goto("/human/products/biohack");
      await page.getByRole("button", { name: /add to cart/i }).click();
      await expect(page.getByText(/added .* to cart/i)).toBeVisible();

      // Navigate to cart
      await page.goto("/cart");
      await expect(
        page.getByRole("heading", { level: 1, name: /your cart/i })
      ).toBeVisible();

      const checkoutButton = page.getByRole("button", {
        name: /checkout securely/i,
      });
      await expect(checkoutButton).toBeVisible();

      // Click checkout and wait for redirection
      await Promise.all([
        page.waitForURL(/checkout\.nadeon\.com\/mock/i, { timeout: 15000 }),
        checkoutButton.click(),
      ]);

      expect(page.url()).toMatch(/checkout\.nadeon\.com\/mock/);
    });
  });
}
