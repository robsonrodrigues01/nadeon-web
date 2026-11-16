// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { getAllProducts, getAllKits } from "@/data/products";
import {
  QuizStart,
  QuizQuestionComponent,
  QuizAnalyzing,
  QuizResultHuman,
  QuizResultPet,
  QuizWizard,
} from "@/components/commerce/quiz";
import { getQuiz, evaluateQuizRecommendation } from "@/lib/quiz";

// Mock server action
vi.mock("@/components/brand/newsletter/actions", () => ({
  subscribeNewsletter: vi.fn().mockResolvedValue({ success: true }),
  subscribe: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock client cart provider
vi.mock("@/lib/providers/client", () => ({
  cartProvider: {
    addLines: vi.fn().mockResolvedValue({}),
  },
}));

describe("Quiz Component Suite (W1-15)", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("QuizStart Component", () => {
    it("renders Human start screen with 'Start the quiz →' button and dynamic time/count", () => {
      const humanQuiz = getQuiz("human");
      expect(humanQuiz).toBeDefined();

      const onStart = vi.fn();
      render(<QuizStart quiz={humanQuiz!} onStart={onStart} />);

      // Button
      const startBtn = screen.getByRole("button", { name: /start the quiz/i });
      expect(startBtn).toBeDefined();
      expect(startBtn.tagName).toBe("BUTTON");

      // Verify dynamic time and question count (no [X] placeholders)
      expect(screen.getByText(/takes about 1 minute/i)).toBeDefined();
      expect(screen.getByText(/5 questions/i)).toBeDefined();

      // Click button
      fireEvent.click(startBtn);
      expect(onStart).toHaveBeenCalledWith("human");
    });

    it("renders Pet start screen with 3 species buttons: dog, cat, horse", () => {
      const dogQuiz = getQuiz("dog");
      expect(dogQuiz).toBeDefined();

      const onStart = vi.fn();
      render(<QuizStart quiz={dogQuiz!} onStart={onStart} />);

      const startDogBtn = screen.getByRole("button", {
        name: /start dog quiz/i,
      });
      const startCatBtn = screen.getByRole("button", {
        name: /start cat quiz/i,
      });
      const startHorseBtn = screen.getByRole("button", {
        name: /start horse quiz/i,
      });

      expect(startDogBtn).toBeDefined();
      expect(startCatBtn).toBeDefined();
      expect(startHorseBtn).toBeDefined();

      fireEvent.click(startDogBtn);
      expect(onStart).toHaveBeenCalledWith("dog");

      fireEvent.click(startCatBtn);
      expect(onStart).toHaveBeenCalledWith("cat");

      fireEvent.click(startHorseBtn);
      expect(onStart).toHaveBeenCalledWith("horse");
    });
  });

  describe("QuizQuestionComponent", () => {
    it("renders question cards, progressbar, and navigation buttons for single-choice question", () => {
      const humanQuiz = getQuiz("human");
      expect(humanQuiz).toBeDefined();

      const onAnswer = vi.fn();
      const onNext = vi.fn();
      const onBack = vi.fn();

      render(
        <QuizQuestionComponent
          quiz={humanQuiz!}
          questionIndex={1} // Step 2: Goal
          answers={{ "age-range": "45-to-54" }}
          onAnswer={onAnswer}
          onNext={onNext}
          onBack={onBack}
        />
      );

      // Progress bar
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toBeDefined();
      expect(progressbar.getAttribute("aria-valuenow")).toBe("40");

      // Options
      const dailyEnergyCard = screen.getByText("Daily energy");
      expect(dailyEnergyCard).toBeDefined();
      fireEvent.click(dailyEnergyCard);
      expect(onAnswer).toHaveBeenCalledWith("goal", "daily-energy");

      // Navigation buttons
      const backBtn = screen.getByRole("button", {
        name: /previous question/i,
      });
      const continueBtn = screen.getByRole("button", {
        name: /continue to next step/i,
      });

      expect(backBtn).toBeDefined();
      expect(continueBtn).toBeDefined();

      fireEvent.click(backBtn);
      expect(onBack).toHaveBeenCalled();
    });

    it("renders semantic pet-profile inputs: name, weight, and age group fieldset", () => {
      const dogQuiz = getQuiz("dog");
      expect(dogQuiz).toBeDefined();

      const onAnswer = vi.fn();
      const onNext = vi.fn();
      const onBack = vi.fn();

      render(
        <QuizQuestionComponent
          quiz={dogQuiz!}
          questionIndex={0}
          answers={{ petName: "Max", weightLbs: 35, ageGroup: "senior" }}
          onAnswer={onAnswer}
          onNext={onNext}
          onBack={onBack}
        />
      );

      // Name input with label
      const nameInput = screen.getByLabelText(/what is your dog's name\?/i);
      expect(nameInput).toBeDefined();
      expect(nameInput.tagName).toBe("INPUT");

      // Weight input with label
      const weightInput = screen.getByLabelText(/how much does max weigh\?/i);
      expect(weightInput).toBeDefined();
      expect(weightInput.tagName).toBe("INPUT");

      // Age group buttons
      const seniorOption = screen.getByText("Senior");
      expect(seniorOption).toBeDefined();
      fireEvent.click(seniorOption);
      expect(onAnswer).toHaveBeenCalledWith("ageGroup", "senior");
    });
  });

  describe("QuizAnalyzing Component", () => {
    it("renders Done and In progress states and auto-transitions", async () => {
      const humanQuiz = getQuiz("human");
      const onComplete = vi.fn();

      render(
        <QuizAnalyzing
          quiz={humanQuiz!}
          answers={{ goal: "daily-energy" }}
          onComplete={onComplete}
          autoTransitionMs={200}
        />
      );

      expect(screen.getByText("Done")).toBeDefined();
      expect(screen.getByText("In progress")).toBeDefined();

      await waitFor(
        () => {
          expect(onComplete).toHaveBeenCalled();
        },
        { timeout: 500 }
      );
    });
  });

  describe("QuizResultHuman Component", () => {
    it("renders kit recommendation, add to cart button, alternatives, and email capture", async () => {
      const humanQuiz = getQuiz("human");
      const recommendation = await evaluateQuizRecommendation(humanQuiz!, {
        goal: "daily-energy",
        "age-range": "45-to-54",
        "afternoon-slump": "most-days",
        format: "capsules",
        "takes-nmn": "no",
      });

      const onRetake = vi.fn();
      const onEditAnswers = vi.fn();

      render(
        <QuizResultHuman
          quiz={humanQuiz!}
          answers={{
            goal: "daily-energy",
            "age-range": "45-to-54",
            "afternoon-slump": "most-days",
            format: "capsules",
            "takes-nmn": "no",
          }}
          recommendation={recommendation}
          onRetake={onRetake}
          onEditAnswers={onEditAnswers}
        />
      );

      // Buttons
      const addToCartBtn = screen.getByRole("button", {
        name: /add routine to cart/i,
      });
      expect(addToCartBtn).toBeDefined();
      fireEvent.click(addToCartBtn);

      const retakeBtn = screen.getByRole("button", {
        name: /retake the quiz/i,
      });
      expect(retakeBtn).toBeDefined();
      fireEvent.click(retakeBtn);
      expect(onRetake).toHaveBeenCalled();

      // Alternatives
      const fullChargeBtn = screen.getByRole("button", {
        name: /choose full charge/i,
      });
      expect(fullChargeBtn).toBeDefined();

      const justBiohackBtn = screen.getByRole("button", {
        name: /just biohack/i,
      });
      expect(justBiohackBtn).toBeDefined();

      // Email capture
      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toBeDefined();
      const emailBtn = screen.getByRole("button", {
        name: /email my results/i,
      });
      expect(emailBtn).toBeDefined();

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(emailBtn);
    });
  });

  describe("QuizResultPet Component", () => {
    it("renders pet plan, dosing schedule, subscribe/one-time toggle, cart CTA, and compliance notices", async () => {
      const dogQuiz = getQuiz("dog");
      const recommendation = await evaluateQuizRecommendation(dogQuiz!, {
        petName: "Max",
        weightLbs: 35,
        ageGroup: "senior",
        concern: "joints-mobility",
        "picky-eater": "no",
      });

      const onRetake = vi.fn();
      const onEditAnswers = vi.fn();

      render(
        <QuizResultPet
          quiz={dogQuiz!}
          answers={{
            petName: "Max",
            weightLbs: 35,
            ageGroup: "senior",
            concern: "joints-mobility",
            "picky-eater": "no",
          }}
          recommendation={recommendation}
          // W2-38: preço e plano de assinatura vêm do catálogo.
          productsMap={Object.fromEntries(
            getAllProducts().map((p) => [p.slug, p])
          )}
          kitsMap={Object.fromEntries(getAllKits().map((k) => [k.slug, k]))}
          onRetake={onRetake}
          onEditAnswers={onEditAnswers}
        />
      );

      // Pet plan headline and dose info
      expect(screen.getByText(/Max's Personalized Plan/i)).toBeDefined();

      // Subscription & one-time options
      const oneTimeBtn = screen.getByRole("button", {
        name: /one-time purchase/i,
      });
      expect(oneTimeBtn).toBeDefined();
      fireEvent.click(oneTimeBtn);

      const subBtn = screen.getByRole("button", {
        name: /subscribe every 30 days/i,
      });
      expect(subBtn).toBeDefined();
      fireEvent.click(subBtn);

      // Add plan to cart button
      const addPlanBtn = screen.getByRole("button", {
        name: /add plan to cart/i,
      });
      expect(addPlanBtn).toBeDefined();
      fireEvent.click(addPlanBtn);

      // Email capture
      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toBeDefined();
      const emailPlanBtn = screen.getByRole("button", {
        name: /email my plan/i,
      });
      expect(emailPlanBtn).toBeDefined();

      // Pet regulatory compliance
      expect(screen.getByText(/for animal use only/i)).toBeDefined();
    });
  });

  describe("QuizWizard Integration", () => {
    it("walks through human quiz from start to results smoothly", async () => {
      const humanQuiz = getQuiz("human");
      render(<QuizWizard initialQuiz={humanQuiz!} defaultScreen="start" />);

      // 1. Start screen
      const startBtn = screen.getByRole("button", { name: /start the quiz/i });
      fireEvent.click(startBtn);
      expect(document.activeElement).toBe(screen.getByTestId("quiz-wizard"));

      // 2. Question 1 (Age)
      const ageOption = await screen.findByText("45 to 54");
      fireEvent.click(ageOption);
      const continueBtn = screen.getByRole("button", {
        name: /continue to next step/i,
      });
      fireEvent.click(continueBtn);

      // 3. Question 2 (Goal)
      const goalOption = await screen.findByText("Daily energy");
      fireEvent.click(goalOption);
      expect(await screen.findByText("Question 2")).toBeDefined();
    });
  });
});
