// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import PetQuizPage from "@/app/(pet)/pet/quiz/page";
import { HumanQuizClient } from "@/app/(human)/human/quiz/_components/human-quiz-client";
import { QuizAnalyzing } from "@/components/commerce/quiz";
import { getQuiz } from "@/lib/quiz";

// Mock next/navigation
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  notFound: vi.fn(),
}));

// Mock newsletter action
const subscribeMock = vi.fn().mockResolvedValue({ success: true });
vi.mock("@/components/brand/newsletter/actions", () => ({
  subscribeNewsletter: (...args: unknown[]) => subscribeMock(...args),
  subscribe: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock client cart provider
const addLinesMock = vi.fn().mockResolvedValue({});
vi.mock("@/lib/providers/client", () => ({
  cartProvider: {
    addLines: (...args: unknown[]) => addLinesMock(...args),
  },
}));

vi.mock("@/lib/providers", () => ({
  catalogProvider: {
    getProducts: vi.fn().mockResolvedValue([]),
    getKits: vi.fn().mockResolvedValue([]),
    getProduct: vi.fn().mockResolvedValue(null),
  },
}));

describe("5.6 Semantic Elements: Quiz", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Início Human `/human/quiz`", () => {
    it("renders Start the quiz button and exit link", () => {
      const humanQuiz = getQuiz("human");
      expect(humanQuiz).toBeDefined();

      render(<HumanQuizClient quiz={humanQuiz!} />);

      expect(
        screen.getByRole("button", { name: /start the quiz/i })
      ).toBeDefined();
      expect(screen.getByRole("link", { name: /exit quiz/i })).toBeDefined();
    });
  });

  describe("Início Pet `/pet/quiz`", () => {
    it("renders channel start buttons: dog, cat, horse", async () => {
      const page = await PetQuizPage();
      render(page);

      expect(
        screen.getByRole("button", { name: /start dog quiz/i })
      ).toBeDefined();
      expect(
        screen.getByRole("button", { name: /start cat quiz/i })
      ).toBeDefined();
      expect(
        screen.getByRole("button", { name: /start horse quiz/i })
      ).toBeDefined();
    });
  });

  describe("Pergunta Human", () => {
    it("renders option buttons, navigation controls (Back, Continue), and progress bar", async () => {
      const humanQuiz = getQuiz("human")!;
      render(<HumanQuizClient quiz={humanQuiz} />);

      // Start quiz to enter questions
      fireEvent.click(screen.getByRole("button", { name: /start the quiz/i }));

      // Progress bar
      expect(await screen.findByRole("progressbar")).toBeDefined();

      // Navigation buttons
      expect(
        screen.getByRole("button", { name: /previous question/i })
      ).toBeDefined();
      expect(
        screen.getByRole("button", { name: /continue to next step/i })
      ).toBeDefined();

      // Multiple choice option buttons
      const options = screen.getAllByRole("button");
      expect(options.length).toBeGreaterThan(2);
    });
  });

  describe("Pergunta Pet", () => {
    it("renders pet profile fields, age option buttons, and navigation controls", async () => {
      const page = await PetQuizPage();
      render(page);

      // Start dog quiz
      fireEvent.click(screen.getByRole("button", { name: "Start dog quiz" }));

      // Progress bar
      expect(await screen.findByRole("progressbar")).toBeDefined();

      // Inputs: pet name and weight
      const nameInput = screen.getByLabelText(/name/i, { selector: "input" });
      expect(nameInput.tagName).toBe("INPUT");

      const weightInput = screen.getByLabelText(/weigh/i, {
        selector: "input",
      });
      expect(weightInput.tagName).toBe("INPUT");

      // Age buttons (Puppy, Adult, Senior)
      for (const age of ["Puppy", "Adult", "Senior"]) {
        expect(
          screen.getByRole("button", { name: new RegExp(`^${age}`) })
        ).toBeDefined();
      }

      // Navigation buttons
      expect(
        screen.getByRole("button", { name: "Previous question" })
      ).toBeDefined();
      expect(
        screen.getByRole("button", { name: "Continue to next step" })
      ).toBeDefined();
    });
  });

  describe("Analisando (Human e Pet)", () => {
    it("renders analyzing state with Done and In progress indicators", () => {
      const humanQuiz = getQuiz("human")!;
      render(
        <QuizAnalyzing
          quiz={humanQuiz}
          answers={{
            "age-range": "35-to-44",
            goal: "daily-energy",
            "afternoon-slump": "sometimes",
            format: "capsules",
            "takes-nmn": "no",
          }}
          onComplete={vi.fn()}
        />
      );

      expect(screen.getByRole("status")).toBeDefined();
      expect(screen.getAllByText("Done").length).toBeGreaterThan(0);
      expect(screen.getAllByText("In progress").length).toBeGreaterThan(0);
      expect(
        screen.getByRole("button", { name: /view results now/i })
      ).toBeDefined();
    });
  });

  describe("Resultado Human", () => {
    it("renders recommended kit CTA, alternatives, retake action, and email signup", async () => {
      const humanQuiz = getQuiz("human")!;
      render(<HumanQuizClient quiz={humanQuiz} />);

      // Step through all 5 questions
      fireEvent.click(screen.getByRole("button", { name: /start the quiz/i }));

      await screen.findByRole("progressbar");

      // Question 1
      fireEvent.click(screen.getByRole("button", { name: /^35 to 44\b/ }));
      fireEvent.click(
        screen.getByRole("button", { name: /continue to next step/i })
      );

      // Question 2
      fireEvent.click(screen.getByRole("button", { name: /^Daily energy\b/ }));
      fireEvent.click(
        screen.getByRole("button", { name: /continue to next step/i })
      );

      // Question 3
      fireEvent.click(screen.getByRole("button", { name: /^Sometimes\b/ }));
      fireEvent.click(
        screen.getByRole("button", { name: /continue to next step/i })
      );

      // Question 4
      fireEvent.click(screen.getByRole("button", { name: /^Capsules\b/ }));
      fireEvent.click(
        screen.getByRole("button", { name: /continue to next step/i })
      );

      // Question 5
      fireEvent.click(
        screen.getByRole("button", { name: /^No, I am new to NMN\b/ })
      );
      fireEvent.click(
        screen.getByRole("button", { name: /continue to next step/i })
      );

      // Fast forward past analyzing
      const viewResults = await screen.findByRole("button", {
        name: /view results now/i,
      });
      fireEvent.click(viewResults);

      // Recommendation result CTA and retake action
      expect(
        await screen.findByRole("button", { name: /add routine to cart/i })
      ).toBeDefined();
      expect(
        screen.getByRole("button", { name: /retake the quiz/i })
      ).toBeDefined();
      expect(
        screen.getByLabelText("Email address", { selector: "input" })
      ).toBeDefined();
      expect(
        screen.getByRole("button", { name: /email my results/i })
      ).toBeDefined();
    });
  });

  describe("Resultado Pet", () => {
    it("renders Add plan to cart button, subscription/one-time toggle, Retake button, and email input with submit button", async () => {
      const page = await PetQuizPage();
      render(page);

      // Start dog quiz
      fireEvent.click(screen.getByRole("button", { name: "Start dog quiz" }));
      fireEvent.change(screen.getByLabelText(/name/i, { selector: "input" }), {
        target: { value: "Buddy" },
      });
      fireEvent.click(screen.getByRole("button", { name: /^Senior/ }));
      fireEvent.click(
        screen.getByRole("button", { name: "Continue to next step" })
      );

      // Step 2
      const dogQuiz = getQuiz("dog")!;
      const concern = dogQuiz.questions[1].options[0].label;
      fireEvent.click(
        screen.getByRole("button", { name: new RegExp(`^${concern}`) })
      );
      fireEvent.click(
        screen.getByRole("button", { name: "Continue to next step" })
      );

      // Step 3
      const picky = dogQuiz.questions[2].options[0].label;
      fireEvent.click(
        screen.getByRole("button", { name: new RegExp(`^${picky}`) })
      );
      fireEvent.click(
        screen.getByRole("button", { name: "Continue to next step" })
      );

      // Pet Result Screen
      const result = await screen.findByTestId(
        "quiz-result-pet",
        {},
        { timeout: 5000 }
      );
      expect(result).toBeTruthy();

      expect(screen.getByRole("button", { name: /one-time/i })).toBeDefined();
      expect(
        screen.getByRole("button", { name: /add plan to cart/i })
      ).toBeDefined();
      expect(
        screen.getByLabelText("Email address", { selector: "input" })
      ).toBeDefined();
      expect(
        screen.getByRole("button", { name: /email my plan/i })
      ).toBeDefined();
    });
  });
});
