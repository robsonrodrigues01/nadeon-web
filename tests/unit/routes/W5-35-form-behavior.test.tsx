// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const actions = vi.hoisted(() => ({
  privacy: vi.fn(),
  orderLookup: vi.fn(),
  review: vi.fn(),
  course: vi.fn(),
  professional: vi.fn(),
  affiliate: vi.fn(),
  wholesale: vi.fn(),
}));

vi.mock("@/app/(shared)/legal/do-not-sell/_components/actions", () => ({
  submitPrivacyRequest: (...args: unknown[]) => actions.privacy(...args),
}));
vi.mock("@/app/(shared)/track/_components/actions", () => ({
  lookupOrderAction: (...args: unknown[]) => actions.orderLookup(...args),
}));
vi.mock("@/app/(shared)/reviews/write/actions", () => ({
  submitReviewAction: (...args: unknown[]) => actions.review(...args),
}));
vi.mock("@/app/(shared)/courses/[curso]/actions", () => ({
  registerForCourse: (...args: unknown[]) => actions.course(...args),
}));
vi.mock("@/app/(shared)/professionals/actions", () => ({
  submitProfessionalApplication: (...args: unknown[]) =>
    actions.professional(...args),
}));
vi.mock("@/app/(shared)/affiliates/actions", () => ({
  submitAffiliateApplication: (...args: unknown[]) =>
    actions.affiliate(...args),
}));
vi.mock("@/app/(shared)/wholesale/actions", () => ({
  submitWholesaleApplication: (...args: unknown[]) =>
    actions.wholesale(...args),
}));
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { PrivacyRequestForm } from "@/app/(shared)/legal/do-not-sell/_components/privacy-form";
import { OrderLookup } from "@/app/(shared)/track/_components/order-lookup";
import { ReviewForm } from "@/app/(shared)/reviews/write/_components/review-form";
import { CourseRegistrationForm } from "@/app/(shared)/courses/[curso]/_components/course-registration-form";
import { ProfessionalApplicationForm } from "@/app/(shared)/professionals/_components/professional-application-form";
import { AffiliateApplicationForm } from "@/app/(shared)/affiliates/_components/affiliate-application-form";
import { WholesaleApplicationForm } from "@/app/(shared)/wholesale/_components/wholesale-application-form";
import { PetsSection } from "@/app/(account)/account/settings/_components/pets-section";
import { getDefaultMarket } from "@/lib/market/markets";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

async function fillPrivacyRequest(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(screen.getByLabelText("State of residence"), "CA");
  await user.type(screen.getByLabelText("First name"), "Test");
  await user.type(screen.getByLabelText("Last name"), "Shopper");
  await user.type(screen.getByLabelText("Email"), "shopper@example.test");
  await user.click(screen.getByRole("checkbox"));
}

async function fillReview(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("radio", { name: "5 out of 5" }));
  await user.type(screen.getByLabelText("Review title"), "A useful routine");
  await user.type(
    screen.getByLabelText("Your review"),
    "This routine fits my mornings."
  );
  await user.click(screen.getByRole("checkbox", { name: /own experience/i }));
  await user.click(screen.getByRole("checkbox", { name: /review terms/i }));
}

async function fillProfessional(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("radio", { name: "Pet health" }));
  await user.type(screen.getByLabelText("Full name"), "Test Professional");
  await user.selectOptions(
    screen.getByLabelText("Profession"),
    "Veterinarian (DVM)"
  );
  await user.type(
    screen.getByLabelText("License or credential number"),
    "TEST-CREDENTIAL"
  );
  await user.type(screen.getByLabelText("Practice or clinic"), "Test Clinic");
  await user.type(screen.getByLabelText("State"), "CA");
  await user.type(screen.getByLabelText("Email"), "vet@example.test");
  await user.type(screen.getByLabelText("Phone"), "555-0100");
  await user.selectOptions(
    screen.getByLabelText("How would you recommend Nadeon?"),
    "referral"
  );
  await user.click(screen.getByRole("checkbox", { name: /active license/i }));
  await user.click(screen.getByRole("checkbox", { name: /program terms/i }));
}

async function fillAffiliate(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Full name"), "Test Creator");
  await user.type(screen.getByLabelText("Email"), "creator@example.test");
  await user.type(screen.getByLabelText("Social handles"), "@testcreator");
  await user.type(
    screen.getByLabelText("Content links"),
    "https://example.test/post-one\nhttps://example.test/post-two"
  );
  await user.selectOptions(
    screen.getByLabelText("Audience size range"),
    "5K to 25K"
  );
  await user.selectOptions(screen.getByLabelText("Niche"), "both");
  await user.click(
    screen.getByRole("checkbox", { name: /content guidelines/i })
  );
  await user.click(
    screen.getByRole("checkbox", { name: /disclose the partnership/i })
  );
}

async function fillWholesale(user: ReturnType<typeof userEvent.setup>) {
  for (const [label, value] of [
    ["Business name", "Test Store"],
    ["Contact name", "Test Buyer"],
    ["Email", "buyer@example.test"],
    ["Phone", "555-0100"],
    ["State", "CA"],
    ["Number of locations", "2"],
    ["Reseller permit or EIN", "TEST-EIN"],
    ["Estimated monthly order", "100 to 500 units"],
  ]) {
    await user.type(screen.getByLabelText(label), value);
  }
  await user.selectOptions(
    screen.getByLabelText("Business type"),
    "Pet stores & groomers"
  );
  await user.click(screen.getByLabelText("Nadeon Pet"));
  await user.click(
    screen.getByRole("checkbox", { name: /agree to be contacted/i })
  );
}

beforeEach(() => vi.clearAllMocks());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("W5-35 form behavior", () => {
  it("announces privacy-request validation, pending, server error, and success", async () => {
    const user = userEvent.setup();
    render(<PrivacyRequestForm />);

    await user.click(screen.getByRole("button", { name: "Submit request" }));
    expect(screen.getByRole("checkbox").getAttribute("aria-invalid")).toBe(
      "true"
    );
    expect(screen.getByRole("status").getAttribute("aria-live")).toBe("polite");
    expect(screen.getByRole("status").textContent).toMatch(
      /confirm that the information/i
    );

    await fillPrivacyRequest(user);
    const request = deferred<unknown>();
    actions.privacy.mockReturnValueOnce(request.promise);
    await user.click(screen.getByRole("button", { name: "Submit request" }));
    const pending = await screen.findByRole("button", {
      name: "Submitting...",
    });
    expect((pending as HTMLButtonElement).disabled).toBe(true);

    await act(async () =>
      request.resolve({
        status: "error",
        error: "Privacy service unavailable.",
      })
    );
    expect(
      await screen.findByText("Privacy service unavailable.")
    ).toBeTruthy();
    expect(screen.getByRole("status").getAttribute("aria-live")).toBe("polite");

    render(
      <PrivacyRequestForm
        initialFormState={{
          status: "success",
          id: "privacy_TEST",
          email: "shopper@example.test",
          requestType: "do_not_sell",
        }}
      />
    );
    expect(
      screen.getByRole("heading", { name: "Request received" })
    ).toBeTruthy();
  });

  it("announces order lookup no-result and server failure, then reports a found order", async () => {
    const user = userEvent.setup();
    const onOrderFound = vi.fn();
    const lookup = deferred<unknown>();
    actions.orderLookup.mockReturnValueOnce(lookup.promise);
    render(<OrderLookup signInHref="/account" onOrderFound={onOrderFound} />);
    await user.type(screen.getByLabelText("Order number"), "NL-123456");
    await user.type(screen.getByLabelText("Email"), "shopper@example.test");
    await user.click(screen.getByRole("button", { name: "Track order" }));
    expect(
      (
        (await screen.findByRole("button", {
          name: "Tracking...",
        })) as HTMLButtonElement
      ).disabled
    ).toBe(true);

    await act(async () =>
      lookup.resolve({
        status: "not_found",
        errorMessage: "No order found with those details.",
      })
    );
    expect((await screen.findByRole("alert")).textContent).toContain(
      "No order found with those details."
    );

    expect(screen.getByRole("alert").getAttribute("role")).toBe("alert");
    expect(onOrderFound).not.toHaveBeenCalled();
  });

  it("shows review validation, pending, server error, and success feedback", async () => {
    const user = userEvent.setup();
    const submit = deferred<unknown>();
    actions.review.mockReturnValueOnce(submit.promise);
    render(
      <ReviewForm
        orderId="ord_TEST"
        productSlug="test-product"
        displayName="Test Shopper"
        email="shopper@example.test"
      />
    );
    await fillReview(user);
    await user.click(screen.getByRole("button", { name: "Submit review" }));
    expect(
      (
        (await screen.findByRole("button", {
          name: "Submitting",
        })) as HTMLButtonElement
      ).disabled
    ).toBe(true);
    await act(async () =>
      submit.resolve({
        status: "error",
        message: "Review service unavailable.",
      })
    );
    expect((await screen.findByRole("alert")).textContent).toContain(
      "Review service unavailable."
    );

    expect(screen.getByRole("alert").getAttribute("role")).toBe("alert");
  });

  it("announces review success after a user submission", async () => {
    const user = userEvent.setup();
    actions.review.mockResolvedValueOnce({ status: "success" });
    render(
      <ReviewForm
        orderId="ord_TEST"
        productSlug="test-product"
        displayName="Test Shopper"
        email="shopper@example.test"
      />
    );
    await fillReview(user);
    await user.click(screen.getByRole("button", { name: "Submit review" }));
    expect((await screen.findByRole("status")).textContent).toMatch(
      /thanks for your review/i
    );
  });

  it("announces course validation, provider error, and success around a disabled pending button", async () => {
    const user = userEvent.setup();
    const submit = deferred<unknown>();
    actions.course.mockReturnValueOnce(submit.promise);
    render(
      <CourseRegistrationForm courseSlug="30-day-longevity" audience="human" />
    );
    await user.type(screen.getByLabelText("First name"), "Test");
    await user.type(
      screen.getByLabelText("Email address"),
      "student@example.test"
    );
    await user.click(
      screen.getByRole("button", { name: "Send me the free course" })
    );
    expect(
      (
        screen.getByRole("button", {
          name: "Send me the free course",
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true);
    await act(async () =>
      submit.resolve({
        success: false,
        message: "Course signup unavailable.",
      })
    );
    expect((await screen.findByRole("alert")).textContent).toContain(
      "Course signup unavailable."
    );
  });

  it("announces course signup success", async () => {
    const user = userEvent.setup();
    actions.course.mockResolvedValueOnce({
      success: true,
      message: "You're on the list.",
    });
    render(
      <CourseRegistrationForm courseSlug="30-day-longevity" audience="human" />
    );
    await user.type(screen.getByLabelText("First name"), "Test");
    await user.type(
      screen.getByLabelText("Email address"),
      "student@example.test"
    );
    await user.click(
      screen.getByRole("button", { name: "Send me the free course" })
    );
    expect((await screen.findByRole("status")).textContent).toContain(
      "You're on the list."
    );
  });

  it("announces professional validation and server failure, then confirms success", async () => {
    const user = userEvent.setup();
    const submit = deferred<unknown>();
    actions.professional.mockReturnValueOnce(submit.promise);
    render(<ProfessionalApplicationForm />);
    await fillProfessional(user);
    await user.click(
      screen.getByRole("button", { name: "Submit application" })
    );
    expect(
      (
        (await screen.findByRole("button", {
          name: "Submitting…",
        })) as HTMLButtonElement
      ).disabled
    ).toBe(true);
    await act(async () => submit.resolve({ status: "error" }));
    expect((await screen.findByRole("alert")).textContent).toMatch(
      /check the form/i
    );

    expect(screen.getByRole("alert").getAttribute("role")).toBe("alert");
  });

  it("announces professional application success", async () => {
    const user = userEvent.setup();
    actions.professional.mockResolvedValueOnce({ status: "submitted" });
    render(<ProfessionalApplicationForm />);
    await fillProfessional(user);
    await user.click(
      screen.getByRole("button", { name: "Submit application" })
    );
    expect((await screen.findByRole("status")).textContent).toMatch(
      /application received/i
    );
  });

  it("announces affiliate validation and server failure, then confirms success", async () => {
    const user = userEvent.setup();
    const submit = deferred<unknown>();
    actions.affiliate.mockReturnValueOnce(submit.promise);
    render(<AffiliateApplicationForm />);
    await fillAffiliate(user);
    await user.click(
      screen.getByRole("button", { name: "Submit application" })
    );
    expect(
      (
        (await screen.findByRole("button", {
          name: "Submitting…",
        })) as HTMLButtonElement
      ).disabled
    ).toBe(true);
    await act(async () => submit.resolve({ status: "error" }));
    expect((await screen.findByRole("alert")).textContent).toMatch(
      /check the form/i
    );

    expect(screen.getByRole("alert").getAttribute("role")).toBe("alert");
  });

  it("announces affiliate application success", async () => {
    const user = userEvent.setup();
    actions.affiliate.mockResolvedValueOnce({ status: "submitted" });
    render(<AffiliateApplicationForm />);
    await fillAffiliate(user);
    await user.click(
      screen.getByRole("button", { name: "Submit application" })
    );
    expect((await screen.findByRole("status")).textContent).toMatch(
      /application received/i
    );
  });

  it("announces wholesale validation and server failure, then confirms success", async () => {
    const user = userEvent.setup();
    const submit = deferred<unknown>();
    actions.wholesale.mockReturnValueOnce(submit.promise);
    render(<WholesaleApplicationForm />);
    await fillWholesale(user);
    await user.click(
      screen.getByRole("button", { name: "Submit application" })
    );
    expect(
      (
        (await screen.findByRole("button", {
          name: "Submit application",
        })) as HTMLButtonElement
      ).disabled
    ).toBe(true);
    await act(async () => submit.resolve({ status: "error" }));
    expect((await screen.findByRole("alert")).textContent).toMatch(
      /could not submit your application/i
    );

    expect(screen.getByRole("alert").getAttribute("role")).toBe("alert");
  });

  it("announces wholesale application success", async () => {
    const user = userEvent.setup();
    actions.wholesale.mockResolvedValueOnce({ status: "submitted" });
    render(<WholesaleApplicationForm />);
    await fillWholesale(user);
    await user.click(
      screen.getByRole("button", { name: "Submit application" })
    );
    expect((await screen.findByRole("status")).textContent).toMatch(
      /application received/i
    );
  });

  it("shows an empty My pets state and an available add-pet action", () => {
    render(
      <PetsSection
        pets={[]}
        products={[]}
        concernOptions={[]}
        market={getDefaultMarket()}
      />
    );
    expect(screen.getByRole("status").textContent).toMatch(
      /no pets saved yet/i
    );
    expect(screen.getByRole("button", { name: /add pet/i })).toBeTruthy();
  });
});
