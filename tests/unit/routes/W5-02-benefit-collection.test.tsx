// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import BenefitCollectionPage from "@/app/(pet)/pet/benefit/[beneficio]/page";

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

const params = Promise.resolve({ beneficio: "joints" });

afterEach(cleanup);

describe("W5-02 /pet/benefit/[beneficio]", () => {
  it("renders the benefit collection model with semantic catalog actions and pending content", async () => {
    render(await BenefitCollectionPage({ params }));

    expect(screen.getByRole("main")).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "To be confirmed support for dogs" })
    ).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "Shop To be confirmed" })
        .getAttribute("href")
    ).toBe("#hero-formula");
    expect(
      screen
        .getAllByRole("link", { name: "Take the quiz" })
        .every((link) => link.getAttribute("href") === "/pet/quiz")
    ).toBe(true);
    expect(
      screen
        .getByRole("link", { name: "Visit the journal" })
        .getAttribute("href")
    ).toBe("/pet/journal");
    expect(
      screen.getByRole("group", { name: "Hero formula purchase options" })
    ).toBeTruthy();
    expect(screen.getAllByRole("radio")).toHaveLength(5);
    expect(
      screen
        .getAllByRole("radio")
        .every((input) => (input as HTMLInputElement).disabled)
    ).toBe(true);
    expect(
      screen.getByRole("button", { name: "Decrease quantity" })
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Increase quantity" })
    ).toBeTruthy();
    expect(
      (screen.getByRole("button", { name: "Add to cart" }) as HTMLButtonElement)
        .disabled
    ).toBe(true);
    expect(
      screen.getAllByRole("button", { name: "Add kit to cart" })
    ).toHaveLength(3);
    expect(
      screen
        .getAllByRole("button", { name: "Add kit to cart" })
        .every((button) => (button as HTMLButtonElement).disabled)
    ).toBe(true);
    expect(document.body.textContent).toContain("For animal use only.");
    expect(document.body.textContent).toContain("To be confirmed");
    expect(document.body.textContent).not.toMatch(
      /\[Benefit\]|\[X\]|\$XX|\(example\)/i
    );
  });
});
