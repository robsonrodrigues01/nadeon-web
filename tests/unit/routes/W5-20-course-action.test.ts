import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { formsProviderMock } = vi.hoisted(() => ({
  formsProviderMock: { subscribe: vi.fn() },
}));

vi.mock("@/lib/providers", () => ({ formsProvider: formsProviderMock }));

afterEach(() => vi.restoreAllMocks());

import { registerForCourse } from "@/app/(shared)/courses/[curso]/actions";

function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

describe("W5-20 course signup action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    formsProviderMock.subscribe.mockResolvedValue({
      success: true,
      id: "sub_123",
      message: "Subscribed successfully",
    });
  });

  it("validates the Human signup and sends only email to the provider without logging PII", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const email = "human-signup@example.com";
    const firstName = "Taylor Private";

    const result = await registerForCourse(
      { success: null, message: "" },
      form({
        courseSlug: "30-day-longevity",
        firstName,
        email,
      })
    );

    expect(formsProviderMock.subscribe).toHaveBeenCalledWith(
      "course-30-day-longevity",
      email,
      true
    );
    expect(JSON.stringify(result)).not.toContain(email);
    expect(JSON.stringify(result)).not.toContain(firstName);
    expect(
      [log, info, warn, error]
        .flatMap((spy) => spy.mock.calls)
        .flat()
        .join(" ")
    ).not.toContain(email);
    expect(
      [log, info, warn, error]
        .flatMap((spy) => spy.mock.calls)
        .flat()
        .join(" ")
    ).not.toContain(firstName);
  });

  it("requires the dog's name, rejects invalid email and unknown course slugs", async () => {
    const initial = { success: null, message: "" };
    const missingDogName = await registerForCourse(
      initial,
      form({
        courseSlug: "senior-dog-care",
        firstName: "Taylor",
        email: "pet-signup@example.com",
      })
    );
    expect(missingDogName.success).toBe(false);
    expect(formsProviderMock.subscribe).not.toHaveBeenCalled();

    const invalidEmail = await registerForCourse(
      initial,
      form({
        courseSlug: "senior-dog-care",
        firstName: "Taylor",
        dogName: "Buddy",
        email: "not-an-email",
      })
    );
    expect(invalidEmail.success).toBe(false);
    expect(formsProviderMock.subscribe).not.toHaveBeenCalled();

    const unknownCourse = await registerForCourse(
      initial,
      form({
        courseSlug: "unlisted-course",
        firstName: "Taylor",
        dogName: "Buddy",
        email: "pet-signup@example.com",
      })
    );
    expect(unknownCourse.success).toBe(false);
    expect(formsProviderMock.subscribe).not.toHaveBeenCalled();
  });

  it("accepts Pet names but never forwards or returns them", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const firstName = "Taylor Private";
    const dogName = "Buddy Private";
    const email = "pet-signup@example.com";

    const result = await registerForCourse(
      { success: null, message: "" },
      form({
        courseSlug: "senior-dog-care",
        firstName,
        dogName,
        email,
      })
    );

    expect(formsProviderMock.subscribe).toHaveBeenCalledWith(
      "course-senior-dog-care",
      email,
      true
    );
    expect(JSON.stringify(result)).not.toContain(firstName);
    expect(JSON.stringify(result)).not.toContain(dogName);
    const logs = [log, info, warn, error]
      .flatMap((spy) => spy.mock.calls)
      .flat()
      .join(" ");
    expect(logs).not.toContain(firstName);
    expect(logs).not.toContain(dogName);
    expect(logs).not.toContain(email);
  });
});
