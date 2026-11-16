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
  test.describe("Build Your Box Flows (Human & Pet)", () => {
    test.beforeEach(async ({ page }) => {
      await mockExternalNetwork(page);
    });

    test("completes human build-your-box journey with formula selection, frequency, and cart confirmation", async ({
      page,
    }) => {
      await page.goto("/human/build-your-box");

      // Verify headings and steps
      await expect(
        page.getByRole("heading", { level: 1, name: /build your box/i })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /choose your formulas/i })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /choose your frequency/i })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /review your box/i })
      ).toBeVisible();

      // Submit button should initially be disabled before any formulas are added
      const startSubscriptionButton = page.getByRole("button", {
        name: /start my subscription/i,
      });
      await expect(startSubscriptionButton).toBeDisabled();

      // Step 1: Select formulas
      const addBiohackButton = page.getByRole("button", {
        name: /add biohack/i,
      });
      await expect(addBiohackButton).toBeVisible();
      await addBiohackButton.click();

      // Button updates to indicate formula is added
      await expect(
        page.getByRole("button", { name: /biohack added to box/i })
      ).toBeVisible();

      // Increase BioHack quantity to 2
      const increaseBiohackButton = page.getByRole("button", {
        name: /increase biohack quantity/i,
      });
      await increaseBiohackButton.click();

      // Add a second formula: Renew
      const addRenewButton = page.getByRole("button", {
        name: /add renew/i,
      });
      await expect(addRenewButton).toBeVisible();
      await addRenewButton.click();
      await expect(
        page.getByRole("button", { name: /renew added to box/i })
      ).toBeVisible();

      // Step 2: Change subscription frequency
      const radio90Days = page.getByLabel(/90 days/i);
      await radio90Days.check();
      await expect(radio90Days).toBeChecked();

      // Step 3: Verify review box pricing & subtotal reflect selections
      const reviewAside = page.getByRole("complementary", {
        name: /review your box/i,
      });
      await expect(reviewAside.getByText(/subtotal/i)).toBeVisible();
      await expect(
        reviewAside.getByText(/subscribe & save \d+%/i)
      ).toBeVisible();
      await expect(reviewAside.getByText(/total per delivery/i)).toBeVisible();

      // Verify Start my subscription is now enabled
      await expect(startSubscriptionButton).toBeEnabled();

      // Click Start my subscription and verify cart drawer opens with added items
      await startSubscriptionButton.click();

      const cartDialog = page.getByRole("dialog", { name: /your cart/i });
      await expect(cartDialog).toBeVisible();
      await expect(
        cartDialog.getByRole("heading", { name: /your cart \(\d+\)/i })
      ).toBeVisible();
      await expect(cartDialog.getByText(/biohack/i)).toBeVisible();
      await expect(cartDialog.getByText(/renew/i)).toBeVisible();
    });

    test("completes pet build-your-box journey with pet profile, formulas, frequency, and cart confirmation", async ({
      page,
    }) => {
      await page.goto("/pet/build-your-box");

      // Verify heading and breadcrumbs
      await expect(
        page.getByRole("heading", { level: 1, name: /build their box/i })
      ).toBeVisible();
      await expect(
        page.getByRole("navigation", { name: /breadcrumb/i })
      ).toBeVisible();

      // Step 0: Fill pet details
      const petNameInput = page.getByLabel(/pet name/i);
      await petNameInput.fill("Max");

      // Species: Dog
      const dogOption = page.getByRole("radio", { name: /^dog$/i });
      await dogOption.check();
      await expect(dogOption).toBeChecked();

      // Weight band: 21-50 lbs
      const weightOption = page.getByRole("radio", { name: /21.*50/i });
      if (await weightOption.isVisible()) {
        await weightOption.check();
      }

      // Age: Adult
      const adultOption = page.getByRole("radio", { name: /adult/i });
      await adultOption.check();

      // Step 1: Add pet formula (e.g. More Good Years)
      const addFormulaButton = page.getByRole("button", {
        name: /add more good years/i,
      });
      await expect(addFormulaButton).toBeVisible();
      await addFormulaButton.click();

      // Step 2: Choose frequency (e.g. 60 days)
      const frequency60 = page.getByRole("radio", { name: /60 days/i });
      await frequency60.check();
      await expect(frequency60).toBeChecked();

      // Step 3: Review summary
      const reviewSection = page.getByRole("region", {
        name: /review your box/i,
      });
      await expect(reviewSection.getByText(/for max/i)).toBeVisible();
      await expect(reviewSection.getByText(/more good years/i)).toBeVisible();
      await expect(
        reviewSection.getByText(/total per delivery/i)
      ).toBeVisible();

      // Submit subscription and verify cart drawer opens
      const submitSubscriptionButton = reviewSection.getByRole("button", {
        name: /start my subscription/i,
      });
      await expect(submitSubscriptionButton).toBeEnabled();
      await submitSubscriptionButton.click();

      const cartDialog = page.getByRole("dialog", { name: /your cart/i });
      await expect(cartDialog).toBeVisible();
      await expect(cartDialog.getByText(/more good years/i)).toBeVisible();
    });
  });
}
