import process from "node:process";
import { test, expect, type Page } from "@playwright/test";
import { mockAccountProvider } from "@/lib/providers/mock/account";

// Guard suite execution so Vitest skips execution without throwing Playwright runner errors.
if (!process.env.VITEST) {
  test.describe("Account Flow (Mock Auth, Orders, Subscriptions & Settings)", () => {
    test("navigates to account overview with mock session and verifies profile information", async ({
      page,
    }: {
      page: Page;
    }) => {
      await page.goto("/account");

      const customer = await mockAccountProvider.getCustomer();
      if (!customer) throw new Error("Mock customer is unavailable");

      // Verify dashboard header and customer greeting
      await expect(
        page.getByRole("heading", { level: 1, name: /my account/i })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", {
          level: 2,
          name: new RegExp(customer.firstName, "i"),
        })
      ).toBeVisible();

      // Verify sidebar navigation links
      const accountNav = page.getByRole("navigation", { name: "Account" });
      await expect(accountNav).toBeVisible();
      await expect(
        accountNav.getByRole("link", { name: /overview/i })
      ).toBeVisible();
      await expect(
        accountNav.getByRole("link", { name: /orders/i })
      ).toBeVisible();
      await expect(
        accountNav.getByRole("link", { name: /subscriptions/i })
      ).toBeVisible();
      await expect(
        accountNav.getByRole("link", { name: /profile/i })
      ).toBeVisible();
    });

    test("signs out and redirects to login URL", async ({
      page,
    }: {
      page: Page;
    }) => {
      await page.goto("/account");

      const signOutButton = page.getByRole("button", { name: /sign out/i });
      await expect(signOutButton).toBeVisible();

      // Submitting sign out redirects to login URL with returnTo parameter
      await Promise.all([
        page.waitForURL(/account\/login/i),
        signOutButton.click(),
      ]);

      expect(page.url()).toContain("/account/login");
    });

    test("views orders list and navigates into order details", async ({
      page,
    }: {
      page: Page;
    }) => {
      await page.goto("/account/orders");

      // Verify page title and header
      await expect(
        page.getByRole("heading", { level: 1, name: /orders/i })
      ).toBeVisible();

      // Verify order cards are rendered
      await expect(page.getByText(/Order #NL-100234/i)).toBeVisible();
      await expect(page.getByText(/Order #NL-100189/i)).toBeVisible();

      // Click "Details" on an order to navigate to order details page
      const detailsLink = page.getByRole("link", { name: /details/i }).filter({
        has: page.getByText(/NL-100234/),
      });
      await expect(detailsLink).toBeVisible();
      await detailsLink.click();

      // Verify order detail view
      await expect(
        page.getByRole("heading", { level: 1, name: /order #NL-/i })
      ).toBeVisible();
      await expect(page.getByText(/placed/i)).toBeVisible();

      // Verify breadcrumb or back link to all orders
      const backLink = page.getByRole("link", { name: /all orders/i });
      await expect(backLink).toBeVisible();
      await backLink.click();
      await expect(page).toHaveURL(/\/account\/orders/);
    });

    test("views active subscriptions and management options", async ({
      page,
    }: {
      page: Page;
    }) => {
      await page.goto("/account/subscriptions");

      // Verify heading and content
      await expect(
        page.getByRole("heading", { level: 1, name: /subscriptions/i })
      ).toBeVisible();

      // Verify active subscription card is visible
      await expect(page.getByText(/active/i)).toBeVisible();
    });

    test("views account settings, addresses, and pet profiles", async ({
      page,
    }: {
      page: Page;
    }) => {
      await page.goto("/account/settings");

      const customer = await mockAccountProvider.getCustomer();
      const addresses = await mockAccountProvider.getAddresses();
      const pets = await mockAccountProvider.getPets();
      if (!customer) throw new Error("Mock customer is unavailable");

      // Verify profile section and form inputs
      await expect(
        page.getByRole("heading", { name: /profile/i })
      ).toBeVisible();
      const firstNameInput = page.getByLabel("First name");
      await expect(firstNameInput).toBeVisible();
      await expect(firstNameInput).toHaveValue(customer.firstName);

      const lastNameInput = page.getByLabel("Last name");
      await expect(lastNameInput).toBeVisible();
      await expect(lastNameInput).toHaveValue(customer.lastName);

      // Verify addresses section
      await expect(
        page.getByRole("heading", { name: /addresses/i })
      ).toBeVisible();
      for (const address of addresses) {
        await expect(page.getByText(address.address1)).toBeVisible();
      }

      // Verify pets section
      for (const pet of pets) {
        await expect(page.getByText(pet.name, { exact: true })).toBeVisible();
        await expect(page.getByText(pet.breed, { exact: true })).toBeVisible();
      }
    });
  });
}
