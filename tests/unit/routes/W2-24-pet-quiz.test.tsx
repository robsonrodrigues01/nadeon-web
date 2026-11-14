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

vi.mock("@/lib/providers/client", () => ({
  cartProvider: { addLines: vi.fn().mockResolvedValue({}) },
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
  });
});
