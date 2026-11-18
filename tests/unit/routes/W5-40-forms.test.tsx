// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { AffiliateApplicationForm } from "@/app/(shared)/affiliates/_components/affiliate-application-form";
import { ProfessionalApplicationForm } from "@/app/(shared)/professionals/_components/professional-application-form";
import { CourseRegistrationForm } from "@/app/(shared)/courses/[curso]/_components/course-registration-form";
import { PrivacyRequestForm } from "@/app/(shared)/legal/do-not-sell/_components/privacy-form";
import WriteReviewPage from "@/app/(shared)/reviews/write/page";

afterEach(cleanup);

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
