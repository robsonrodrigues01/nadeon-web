// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { AffiliateApplicationForm } from "@/app/(shared)/affiliates/_components/affiliate-application-form";
import { ProfessionalApplicationForm } from "@/app/(shared)/professionals/_components/professional-application-form";
import { CourseRegistrationForm } from "@/app/(shared)/courses/[curso]/_components/course-registration-form";
import * as courseActions from "@/app/(shared)/courses/[curso]/actions";
import { PrivacyRequestForm } from "@/app/(shared)/legal/do-not-sell/_components/privacy-form";
import WriteReviewPage from "@/app/(shared)/reviews/write/page";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("W5-40 form visual states and compliance", () => {
  it("Affiliate application submit button contains brand hover and active classes", () => {
    render(<AffiliateApplicationForm />);
    const submitBtn = screen.getByRole("button", {
      name: /submit application/i,
    });
    expect(submitBtn.className).toContain("hover:brightness-105");
    expect(submitBtn.className).toContain("active:scale-[0.98]");
    expect(submitBtn.className).toContain("text-accent-fg");
    expect(submitBtn.className).toContain("shadow-card");
  });

  it("Professional application submit button contains brand hover and active classes", () => {
    render(<ProfessionalApplicationForm />);
    const submitBtn = screen.getByRole("button", {
      name: /submit application/i,
    });
    expect(submitBtn.className).toContain("hover:brightness-105");
    expect(submitBtn.className).toContain("active:scale-[0.98]");
    expect(submitBtn.className).toContain("text-accent-fg");
    expect(submitBtn.className).toContain("shadow-card");
  });

  it("Course registration submit button contains brand hover and active classes", () => {
    render(
      <CourseRegistrationForm courseSlug="30-day-longevity" audience="human" />
    );
    const submitBtn = screen.getByRole("button", {
      name: /send me the free course/i,
    });
    expect(submitBtn.className).toContain("hover:brightness-105");
    expect(submitBtn.className).toContain("active:scale-[0.98]");
    expect(submitBtn.className).toContain("text-accent-fg");
  });

  it("Course registration displays and announces sending state during submission", async () => {
    let resolveAction!: (value: courseActions.CourseRegistrationState) => void;
    const pendingPromise = new Promise<courseActions.CourseRegistrationState>(
      (resolve) => {
        resolveAction = resolve;
      }
    );

    vi.spyOn(courseActions, "registerForCourse").mockImplementation(
      () => pendingPromise
    );

    render(
      <CourseRegistrationForm courseSlug="30-day-longevity" audience="human" />
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const nameInput = screen.getByLabelText(/first name/i);
    const submitBtn = screen.getByRole("button", {
      name: /send me the free course/i,
    });

    fireEvent.change(nameInput, { target: { value: "Alex" } });
    fireEvent.change(emailInput, { target: { value: "alex@example.com" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const button = screen.getByRole("button") as HTMLButtonElement;
      expect(button.disabled).toBe(true);
      expect(button.textContent).toContain("Sending…");
      const liveEl = screen.getByText("Sending…", { selector: "p" });
      expect(liveEl.getAttribute("aria-live")).toBe("polite");
    });

    resolveAction({ success: true, message: "Course registration complete." });
    await waitFor(() => {
      expect(screen.getByText("Course registration complete.")).toBeDefined();
    });
  });

  it("Privacy request form uses token text-product-coral for server error status", () => {
    render(
      <PrivacyRequestForm
        initialFormState={{
          status: "error",
          error: "Simulated privacy error",
        }}
      />
    );
    const errorEl = screen.getByText("Simulated privacy error");
    expect(errorEl.className).toContain("text-product-coral");
    expect(errorEl.className).not.toContain("text-red-600");
  });

  it("WriteReviewPage renders with valid mock order parameters in development", async () => {
    const page = await WriteReviewPage({
      searchParams: Promise.resolve({
        orderId: "ord_TEST_0001",
        productSlug: "biohack",
      }),
    });
    render(page);
    expect(
      screen.getByRole("heading", { name: /write a review/i, level: 1 })
    ).toBeDefined();
    expect(
      screen.getByRole("button", { name: /submit review/i })
    ).toBeDefined();
  });
});
