import process from "node:process";
import { test, expect, type Page } from "@playwright/test";

// Guard suite execution so Vitest skips execution without throwing Playwright runner errors.
if (!process.env.VITEST) {
  test.describe("Quiz Flow (Human & Pet to Result)", () => {
    test("completes the human routine quiz from start to personalized result", async ({
      page,
    }: {
      page: Page;
    }) => {
      await page.goto("/human/quiz");

      // Verify quiz start screen
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      // Start quiz
      const startButton = page.getByRole("button", {
        name: /start the quiz/i,
      });
      await expect(startButton).toBeVisible();
      await startButton.click();

      // Question 1: Age range
      await expect(page.getByRole("heading", { level: 2 })).toBeVisible();
      await page.getByRole("button", { name: "35 to 44" }).click();
      await page.getByRole("button", { name: /continue/i }).click();

      // Question 2: Main goal
      await page.getByRole("button", { name: "Daily energy" }).click();
      await page.getByRole("button", { name: /continue/i }).click();

      // Question 3: Afternoon slump
      await page.getByRole("button", { name: "Most days" }).click();
      await page.getByRole("button", { name: /continue/i }).click();

      // Question 4: Format preference
      await page.getByRole("button", { name: "Capsules" }).click();
      await page.getByRole("button", { name: /continue/i }).click();

      // Question 5: Takes NMN
      await page.getByRole("button", { name: "No, I am new to NMN" }).click();
      await page.getByRole("button", { name: /continue/i }).click();

      // Analyzing screen appears
      await expect(
        page.getByRole("status")
      ).toBeVisible();

      // Results screen appears after analysis
      // Verify personalized recommendation elements
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
        timeout: 10000,
      });
      await expect(
        page.getByRole("button", { name: /retake quiz/i })
      ).toBeVisible();
    });

    test("completes the pet quiz for dogs from species selection to personalized result", async ({
      page,
    }: {
      page: Page;
    }) => {
      await page.goto("/pet/quiz");

      // Verify pet quiz start screen
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      // Select Dog quiz
      const startDogButton = page.getByRole("button", {
        name: /start dog quiz/i,
      });
      await expect(startDogButton).toBeVisible();
      await startDogButton.click();

      // Question 1: Dog profile (name, weight, age)
      await expect(page.getByRole("heading", { level: 2 })).toBeVisible();
      await page.getByLabel(/what is your dog's name/i).fill("Test pet");
      await page.getByLabel(/how much does .* weigh/i).fill("65");

      await page.getByRole("button", { name: "Senior" }).click();
      await page.getByRole("button", { name: /continue/i }).click();

      // Question 2: Primary concern
      await page.getByRole("button", { name: "Joints and mobility" }).click();
      await page.getByRole("button", { name: /continue/i }).click();

      // Question 3: Picky eater
      await page
        .getByRole("button", { name: "No, eats almost anything" })
        .click();
      await page.getByRole("button", { name: /continue/i }).click();

      // Analyzing screen appears
      await expect(
        page.getByRole("status")
      ).toBeVisible();

      // Pet results screen appears
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
        timeout: 10000,
      });
      await expect(
        page.getByText(/for animal use only/i)
      ).toBeVisible();
    });
  });
}
