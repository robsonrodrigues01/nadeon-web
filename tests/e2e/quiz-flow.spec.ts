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
      await expect(page.locator('[data-testid="quiz-start"]')).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      // Start quiz
      const startButton = page.getByRole("button", {
        name: /start the quiz/i,
      });
      await expect(startButton).toBeVisible();
      await startButton.click();

      // Question 1: Age range
      await expect(page.locator('[data-testid="quiz-question"]')).toBeVisible();
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
        page.locator('[data-testid="quiz-analyzing"]')
      ).toBeVisible();

      // Results screen appears after analysis
      const resultContainer = page.locator('[data-testid="quiz-result-human"]');
      await expect(resultContainer).toBeVisible({ timeout: 10000 });

      // Verify personalized recommendation elements
      await expect(
        resultContainer.getByRole("heading", { level: 1 })
      ).toBeVisible();
      await expect(
        resultContainer.getByRole("button", { name: /retake quiz/i })
      ).toBeVisible();
    });

    test("completes the pet quiz for dogs from species selection to personalized result", async ({
      page,
    }: {
      page: Page;
    }) => {
      await page.goto("/pet/quiz");

      // Verify pet quiz start screen
      await expect(page.locator('[data-testid="quiz-start"]')).toBeVisible();

      // Select Dog quiz
      const startDogButton = page.getByRole("button", {
        name: /start dog quiz/i,
      });
      await expect(startDogButton).toBeVisible();
      await startDogButton.click();

      // Question 1: Dog profile (name, weight, age)
      await expect(page.locator('[data-testid="quiz-question"]')).toBeVisible();
      const nameInput = page.locator('input[type="text"]').first();
      await nameInput.fill("Cooper");

      const weightInput = page.locator('input[type="number"]').first();
      await weightInput.fill("65");

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
        page.locator('[data-testid="quiz-analyzing"]')
      ).toBeVisible();

      // Pet results screen appears
      const resultContainer = page.locator('[data-testid="quiz-result-pet"]');
      await expect(resultContainer).toBeVisible({ timeout: 10000 });

      // Verify pet name and regulatory compliance notice are displayed
      await expect(resultContainer.getByText(/Cooper/i).first()).toBeVisible();
      await expect(
        resultContainer.getByText(/for animal use only/i)
      ).toBeVisible();
    });
  });
}
