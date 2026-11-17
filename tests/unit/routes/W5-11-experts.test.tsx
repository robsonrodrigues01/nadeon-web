// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ExpertsPage from "@/app/(shared)/experts/page";

const { contentProviderMock } = vi.hoisted(() => ({
  contentProviderMock: {
    getExpertsPage: vi.fn(),
    listExperts: vi.fn(),
    getExpertReviewProcess: vi.fn(),
  },
}));

vi.mock("@/lib/providers", () => ({ contentProvider: contentProviderMock }));

afterEach(cleanup);

beforeEach(() => {
  vi.clearAllMocks();
  contentProviderMock.getExpertsPage.mockResolvedValue({
    eyebrow: "SCIENTIFIC ADVISORY BOARD",
    title: "The people behind the formulas",
    description:
      "Physicians, scientists and veterinarians review what goes into every Nadeon formula, for people and for pets. Their names and photos appear here once each advisor approves.",
    humanSection: "Human advisory board",
    humanDescription:
      "Medical doctors and scientists who review our human formulas, doses and label wording.",
    petSection: "Pet advisory board",
    petDescription:
      "Licensed veterinarians who review every chew, oil and drop for dogs, cats and horses.",
    clinicSection: "Partner veterinarians",
    clinicDescription:
      "Practicing vets who share feedback from real exam rooms, so our pet formulas fit everyday care.",
  });
  contentProviderMock.listExperts.mockResolvedValue([]);
  contentProviderMock.getExpertReviewProcess.mockResolvedValue([]);
});

describe("W5-11 /experts", () => {
  it("renders the board sections without inventing people or linking to missing routes", async () => {
    render(await ExpertsPage());

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "The people behind the formulas",
      })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Human advisory board" })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Pet advisory board" })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Partner veterinarians" })
    ).toBeTruthy();
    expect(screen.getAllByText("To be confirmed").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: "See lab results" }).getAttribute("href")
    ).toBe("/lab-results");
    expect(
      screen
        .getByRole("link", { name: "Read the science" })
        .getAttribute("href")
    ).toBe("/science");
    expect(
      screen.queryByRole("link", { name: /Nadeon for Professionals/i })
    ).toBeNull();
    expect(document.body.textContent).not.toMatch(
      /\(example\)|Name, MD|Name, PhD|Name, DVM|placeholder/i
    );
    expect(contentProviderMock.getExpertsPage).toHaveBeenCalledOnce();
    expect(contentProviderMock.listExperts).toHaveBeenCalledTimes(2);
    expect(contentProviderMock.listExperts).toHaveBeenNthCalledWith(1, "human");
    expect(contentProviderMock.listExperts).toHaveBeenNthCalledWith(2, "pet");
    expect(contentProviderMock.getExpertReviewProcess).toHaveBeenCalledOnce();
  });
});
