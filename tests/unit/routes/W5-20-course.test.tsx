// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import contentData from "@/data/content.json";

const { contentProviderMock, notFoundMock } = vi.hoisted(() => ({
  contentProviderMock: { getCourse: vi.fn() },
  notFoundMock: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));

vi.mock("@/lib/providers", () => ({ contentProvider: contentProviderMock }));
vi.mock("next/navigation", () => ({ notFound: notFoundMock }));
vi.mock("@/components/layout/announcement-bar", () => ({
  AnnouncementBar: () => null,
}));
vi.mock("@/components/layout/header", () => ({ Header: () => null }));
vi.mock("@/components/layout/footer", () => ({ Footer: () => null }));
vi.mock("@/components/brand/trust-strip", () => ({ TrustStrip: () => null }));
vi.mock("@/app/(shared)/courses/[curso]/actions", () => ({
  registerForCourse: vi.fn(),
}));

import CoursePage from "@/app/(shared)/courses/[curso]/page";

afterEach(cleanup);

describe("W5-20 /courses/[curso]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    contentProviderMock.getCourse.mockImplementation(
      async (slug) =>
        contentData.courses.find((course) => course.slug === slug) ?? null
    );
  });

  it.each([
    ["30-day-longevity", "The 30-Day Longevity Routine", "Sleep"],
    ["senior-dog-care", "Senior Dog Care in 14 Days", "Mobility"],
  ])("renders provider lessons for %s", async (slug, title, lesson) => {
    render(await CoursePage({ params: Promise.resolve({ curso: slug }) }));

    expect(screen.getByRole("heading", { level: 1, name: title })).toBeTruthy();
    expect(screen.getByRole("heading", { name: lesson })).toBeTruthy();
    expect(screen.getByText("WHAT YOU'LL LEARN")).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: /7 lessons, every/ })
    ).toBeTruthy();
    expect(contentProviderMock.getCourse).toHaveBeenCalledWith(slug);
  });

  it("qualifies Pet course health copy and avoids unconfirmed instructor details", async () => {
    render(
      await CoursePage({
        params: Promise.resolve({ curso: "senior-dog-care" }),
      })
    );

    const doseLesson = screen.getByText(
      "How to read a label and dose by weight.*"
    );
    expect(doseLesson.parentElement?.className).toContain("inline");
    expect(
      screen
        .getAllByRole("note")
        .some((note) =>
          note.textContent?.includes("Food and Drug Administration")
        )
    ).toBe(true);
    expect(
      screen
        .getAllByRole("note")
        .some((note) => note.textContent?.includes("For animal use only"))
    ).toBe(true);
    expect(screen.getByLabelText("Your name")).toBeTruthy();
    expect(screen.getByLabelText("Dog's name")).toBeTruthy();
    expect(screen.getByLabelText("Email address")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Send me the free course" })
    ).toBeTruthy();
    expect(screen.getAllByText("To be confirmed").length).toBeGreaterThan(0);
    expect(screen.queryByText(/Name, DVM|license #/i)).toBeNull();
  });

  it("qualifies the Human course's starred health claim", async () => {
    render(
      await CoursePage({
        params: Promise.resolve({ curso: "30-day-longevity" }),
      })
    );

    const claim = screen.getByText(
      "What it is, why it declines, where NMN fits.*"
    );
    expect(claim.parentElement?.className).toContain("inline");
    expect(
      screen
        .getAllByRole("note")
        .some((note) =>
          note.textContent?.includes("Food and Drug Administration")
        )
    ).toBe(true);
  });

  it("renders unknown course slugs as not found", async () => {
    contentProviderMock.getCourse.mockResolvedValue(null);

    await expect(
      CoursePage({ params: Promise.resolve({ curso: "unknown-course" }) })
    ).rejects.toThrow("NOT_FOUND");
    expect(notFoundMock).toHaveBeenCalledOnce();
  });
});
