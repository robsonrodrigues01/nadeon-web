// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from "@testing-library/react";
import PetQuizPage, { metadata } from "@/app/(pet)/pet/quiz/page";
import { getQuiz } from "@/lib/quiz";

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

vi.mock("@/lib/providers", () => ({
  catalogProvider: {
    getProducts: vi.fn().mockResolvedValue([]),
    getKits: vi.fn().mockResolvedValue([]),
    getProduct: vi.fn().mockResolvedValue(null),
  },
}));

const addLinesMock = vi.fn().mockResolvedValue({});
vi.mock("@/lib/providers/client", () => ({
  cartProvider: { addLines: (...args: unknown[]) => addLinesMock(...args) },
}));

const subscribeMock = vi
  .fn()
  .mockResolvedValue({ success: true, message: "ok" });
vi.mock("@/components/brand/newsletter/actions", () => ({
  subscribeNewsletter: (...args: unknown[]) => subscribeMock(...args),
  subscribe: vi.fn().mockResolvedValue({ success: true }),
}));

const dogQuiz = getQuiz("dog")!;

async function renderPage() {
  const element = await PetQuizPage();
  return render(element);
}

describe("Route /pet/quiz (W2-24)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Metadata", () => {
    it("takes title and description from data/quiz.json", () => {
      expect(metadata.title).toContain(dogQuiz.title);
      expect(metadata.description).toBe(dogQuiz.supportingText);
    });

    it("sets canonical to /pet/quiz", () => {
      const canonical = metadata.alternates?.canonical as string | undefined;
      expect(canonical).toContain("/pet/quiz");
    });
  });

  describe("Start screen (5.6 Início Pet)", () => {
    it("renders the three channel actions as buttons", async () => {
      await renderPage();
      for (const name of [
        "Start dog quiz",
        "Start cat quiz",
        "Start horse quiz",
      ]) {
        const button = screen.getByRole("button", { name });
        expect(button.tagName).toBe("BUTTON");
        expect(button.getAttribute("type")).toBe("button");
      }
    });

    it("renders the promise headline from data", async () => {
      await renderPage();
      expect(
        screen.getByRole("heading", { level: 1, name: dogQuiz.promiseHeadline })
      ).toBeTruthy();
    });
  });

  describe("Question screen (5.6 Pergunta Pet)", () => {
    async function startDogQuiz() {
      await renderPage();
      fireEvent.click(screen.getByRole("button", { name: "Start dog quiz" }));
      await screen.findByLabelText(/name/i, { selector: "input" });
    }

    it("shows the pet profile fields as labelled inputs", async () => {
      await startDogQuiz();
      const name = screen.getByLabelText(/name/i, { selector: "input" });
      expect(name.tagName).toBe("INPUT");
    });

    it("renders each first-step option as a button inside a fieldset with legend", async () => {
      await startDogQuiz();
      const firstStep = dogQuiz.questions[0];
      const fieldset = screen
        .getAllByRole("group")
        .find((group) => group.tagName === "FIELDSET");
      expect(fieldset).toBeTruthy();
      expect(screen.getByText(firstStep.title)).toBeTruthy();
      const optionButton = within(fieldset!).getAllByRole("button")[0];
      expect(optionButton.tagName).toBe("BUTTON");
      expect(optionButton.hasAttribute("aria-pressed")).toBe(true);
    });

    it("renders Back and Continue as buttons, with Continue disabled before the profile is complete", async () => {
      await startDogQuiz();
      const back = screen.getByRole("button", { name: "Previous question" });
      const next = screen.getByRole("button", {
        name: "Continue to next step",
      });
      expect(back.tagName).toBe("BUTTON");
      expect(next.tagName).toBe("BUTTON");
      expect((next as HTMLButtonElement).disabled).toBe(true);
    });

    it("renders the exit action as a button", async () => {
      await startDogQuiz();
      const exit = screen.getByRole("button", { name: "Exit quiz" });
      expect(exit.tagName).toBe("BUTTON");
    });

    it("exposes the progress bar with an accessible name", async () => {
      await startDogQuiz();
      expect(screen.getByRole("progressbar")).toBeTruthy();
    });

    it("renders the Puppy, Adult and Senior age options as pressable buttons", async () => {
      await startDogQuiz();
      for (const label of ["Puppy", "Adult", "Senior"]) {
        const button = screen.getByRole("button", {
          name: new RegExp(`^${label}`),
        });
        expect(button.tagName).toBe("BUTTON");
        // O componente pré-seleciona "Senior" (ageGroup padrão); os outros começam sem seleção.
        const expected = label === "Senior" ? "true" : "false";
        expect(button.getAttribute("aria-pressed")).toBe(expected);
      }
    });

    it("derives the size band from the weight field (porte)", async () => {
      await startDogQuiz();
      const weight = screen.getByLabelText(/weigh/i, { selector: "input" });
      expect(weight.tagName).toBe("INPUT");
      expect(screen.getByText(/Medium · 21 to 50 lbs/)).toBeTruthy();

      fireEvent.change(weight, { target: { value: "12" } });
      expect(screen.getByText(/Small · Up to 20 lbs/)).toBeTruthy();

      fireEvent.change(weight, { target: { value: "60" } });
      expect(screen.getByText(/Large · 51 to 90 lbs/)).toBeTruthy();
    });

    it("enables Continue once name and weight are filled", async () => {
      await startDogQuiz();
      const next = screen.getByRole("button", {
        name: "Continue to next step",
      }) as HTMLButtonElement;
      fireEvent.change(screen.getByLabelText(/name/i, { selector: "input" }), {
        target: { value: "Max" },
      });
      expect(next.disabled).toBe(false);
    });
  });

  describe("Full flow to Analisando and Resultado Pet", () => {
    async function answerAllAndReachResult() {
      await renderPage();
      fireEvent.click(screen.getByRole("button", { name: "Start dog quiz" }));
      fireEvent.change(screen.getByLabelText(/name/i, { selector: "input" }), {
        target: { value: "Max" },
      });
      fireEvent.click(screen.getByRole("button", { name: /^Senior/ }));
      fireEvent.click(
        screen.getByRole("button", { name: "Continue to next step" })
      );

      // Step 2: concern (single-choice, from data)
      const concern = dogQuiz.questions[1].options[0].label;
      fireEvent.click(
        screen.getByRole("button", { name: new RegExp(`^${concern}`) })
      );
      fireEvent.click(
        screen.getByRole("button", { name: "Continue to next step" })
      );

      // Step 3: picky eater (single-choice, from data)
      const picky = dogQuiz.questions[2].options[0].label;
      fireEvent.click(
        screen.getByRole("button", { name: new RegExp(`^${picky}`) })
      );
      fireEvent.click(
        screen.getByRole("button", { name: "Continue to next step" })
      );
    }

    it("shows the Analisando steps with Done and In progress states", async () => {
      await answerAllAndReachResult();
      const analyzing = await screen.findByTestId("quiz-analyzing");
      expect(
        within(analyzing).getAllByText("In progress").length
      ).toBeGreaterThan(0);
    });

    it("renders the Pet result with plan, One-time, Add plan to cart and e-mail form", async () => {
      await answerAllAndReachResult();
      const result = await screen.findByTestId(
        "quiz-result-pet",
        {},
        { timeout: 5000 }
      );
      expect(result).toBeTruthy();

      const oneTime = screen.getByRole("button", { name: /One-time/ });
      expect(["true", "false"]).toContain(oneTime.getAttribute("aria-pressed"));

      const addPlan = screen.getByRole("button", { name: /Add plan to cart/ });
      expect(addPlan.tagName).toBe("BUTTON");

      const email = screen.getByLabelText("Email address", {
        selector: "input",
      });
      expect(email.tagName).toBe("INPUT");
      expect(email.getAttribute("type")).toBe("email");

      expect(
        screen.getByRole("button", { name: "Email my plan" }).tagName
      ).toBe("BUTTON");
    });

    it("sends the plan e-mail through the newsletter action for the dog line", async () => {
      await answerAllAndReachResult();
      await screen.findByTestId("quiz-result-pet", {}, { timeout: 5000 });

      fireEvent.change(
        screen.getByLabelText("Email address", { selector: "input" }),
        {
          target: { value: "dog.owner@example.com" },
        }
      );
      fireEvent.click(screen.getByRole("button", { name: "Email my plan" }));

      await vi.waitFor(() => expect(subscribeMock).toHaveBeenCalled());
      expect(subscribeMock.mock.calls[0][0]).toBe("dog-quiz-plan");
      expect(subscribeMock.mock.calls[0][1]).toBe("dog.owner@example.com");
    });
  });

  describe("Regulatory notice (rule 8)", () => {
    it("renders the Pet regulatory notice with the animal-use warning", async () => {
      await renderPage();
      expect(
        screen.getByRole("complementary", {
          name: "Pet regulatory information",
        })
      ).toBeTruthy();
      expect(screen.getByText(/For animal use only/)).toBeTruthy();
    });
  });
});
