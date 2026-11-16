// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

const sendContact = vi.fn();
const lookupOrder = vi.fn();
const subscribeNewsletter = vi.fn();
const saveProfileAction = vi.fn();
const savePetAction = vi.fn();
const submitPrivacyRequest = vi.fn();
const submitAccessibilityFeedback = vi.fn();

vi.mock("@/app/(shared)/help/_components/actions", () => ({
  sendContactMessage: (...args: unknown[]) => sendContact(...args),
  lookupOrder: (...args: unknown[]) => lookupOrder(...args),
}));
vi.mock("@/components/brand/newsletter/actions", () => ({
  subscribeNewsletter: (...args: unknown[]) => subscribeNewsletter(...args),
}));
vi.mock("@/app/(account)/account/settings/_components/actions", () => ({
  saveProfileAction: (...args: unknown[]) => saveProfileAction(...args),
  saveProfileFormAction: (...args: unknown[]) => saveProfileAction(...args),
  savePetAction: (...args: unknown[]) => savePetAction(...args),
}));
vi.mock("@/app/(shared)/legal/do-not-sell/_components/actions", () => ({
  submitPrivacyRequest: (...args: unknown[]) => submitPrivacyRequest(...args),
}));
vi.mock("@/app/(shared)/legal/accessibility/_components/actions", () => ({
  submitAccessibilityFeedback: (...args: unknown[]) =>
    submitAccessibilityFeedback(...args),
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
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

import { ContactForm } from "@/app/(shared)/help/_components/contact-form";
import { TrackForm } from "@/app/(shared)/help/_components/track-form";
import { NewsletterForm } from "@/components/layout/footer/newsletter-form";
import { ProfileForm } from "@/app/(account)/account/settings/_components/profile-form";
import { PetForm } from "@/app/(account)/account/settings/_components/pet-form";
import { PrivacyRequestForm } from "@/app/(shared)/legal/do-not-sell/_components/privacy-form";
import { FeedbackForm } from "@/app/(shared)/legal/accessibility/_components/feedback-form";
import { OrderLookup } from "@/app/(shared)/track/_components/order-lookup";

const customer = {
  id: "customer-1",
  firstName: "A",
  lastName: "B",
  email: "a@example.com",
  phone: undefined,
  birthDate: undefined,
  profileType: "Human" as const,
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("W3-32 form states", () => {
  it.each([
    [
      "contact",
      <ContactForm key="contact" topics={["Orders & Shipping"]} />,
      sendContact,
      "Send message",
      "Sending...",
      { status: "error" },
      "Message not sent. Try again.",
      { status: "sent" },
      "Message sent.",
    ],
    [
      "help tracking",
      <TrackForm key="help-track" />,
      lookupOrder,
      "Track order",
      "Tracking...",
      { status: "error" },
      "Unable to track order. Try again.",
      {
        status: "found",
        orderNumber: "NL-123456",
        fulfillmentStatus: "processing",
        itemCount: 1,
      },
      "Order #NL-123456",
    ],
    [
      "accessibility",
      <FeedbackForm key="accessibility" />,
      submitAccessibilityFeedback,
      "Send feedback",
      "Sending...",
      { status: "error", error: "Try again." },
      "Try again.",
      { status: "success" },
      "Feedback received.",
    ],
  ])(
    "shows pending, error, and success for %s",
    async (
      _name,
      form,
      action,
      idle,
      loading,
      errorState,
      errorText,
      successState,
      successText
    ) => {
      let resolve!: (value: unknown) => void;
      action.mockReturnValueOnce(
        new Promise((done) => {
          resolve = done;
        })
      );
      render(form);
      const submit = screen.getByRole("button", { name: idle });
      fireEvent.submit(submit.closest("form")!);
      await waitFor(() =>
        expect(
          (screen.getByRole("button", { name: loading }) as HTMLButtonElement)
            .disabled
        ).toBe(true)
      );
      await act(async () => resolve(errorState));
      await waitFor(() =>
        expect(screen.getByRole("status").textContent).toContain(errorText)
      );
      action.mockResolvedValueOnce(successState);
      const currentSubmit = screen.getByRole("button", { name: idle });
      fireEvent.submit(currentSubmit.closest("form")!);
      await waitFor(() =>
        expect(screen.getByRole("status").textContent).toContain(successText)
      );
    }
  );

  it("shows newsletter loading, error, then success while keeping an empty idle status", async () => {
    let resolve!: (value: unknown) => void;
    subscribeNewsletter.mockReturnValueOnce(
      new Promise((done) => {
        resolve = done;
      })
    );
    render(<NewsletterForm />);
    expect(screen.queryByRole("status")).toBeNull();
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.submit(
      screen.getByRole("button", { name: "Get 10% off" }).closest("form")!
    );
    expect(
      (
        (await screen.findByRole("button", {
          name: "Subscribing...",
        })) as HTMLButtonElement
      ).disabled
    ).toBe(true);
    await act(async () => resolve({ success: false }));
    expect((await screen.findByRole("status")).getAttribute("aria-live")).toBe(
      "polite"
    );
    expect(screen.getByRole("status").textContent).toContain(
      "Could not complete subscription."
    );
    subscribeNewsletter.mockResolvedValueOnce({ success: true });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.submit(
      screen.getByRole("button", { name: "Get 10% off" }).closest("form")!
    );
    expect((await screen.findByRole("status")).textContent).toContain(
      "Thanks for subscribing!"
    );
  });

  it("renders a polite idle result region for account profile save", () => {
    render(<ProfileForm customer={customer} />);
    expect(
      (
        screen.getByRole("button", {
          name: "Save changes",
        }) as HTMLButtonElement
      ).disabled
    ).toBe(false);
    expect(screen.getByRole("status").getAttribute("aria-live")).toBe("polite");
  });

  it("shows profile pending, invalid, and saved states", async () => {
    let resolve!: (value: unknown) => void;
    saveProfileAction.mockReturnValueOnce(
      new Promise((done) => {
        resolve = done;
      })
    );
    render(<ProfileForm customer={customer} />);
    fireEvent.submit(
      screen.getByRole("button", { name: "Save changes" }).closest("form")!
    );
    await waitFor(() =>
      expect(
        (screen.getByRole("button", { name: "Saving..." }) as HTMLButtonElement)
          .disabled
      ).toBe(true)
    );
    await act(async () => resolve({ status: "invalid" }));
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain(
        "highlighted fields"
      )
    );
    saveProfileAction.mockResolvedValueOnce({ status: "saved" });
    fireEvent.submit(
      screen.getByRole("button", { name: "Save changes" }).closest("form")!
    );
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain("Changes saved.")
    );
  });

  it.each([
    [
      "privacy",
      <PrivacyRequestForm key="privacy" />,
      "Submit request",
      "Submitting...",
      submitPrivacyRequest,
    ],
  ])("has submit status for %s", async (_name, form, idle, pending, action) => {
    let resolve!: (value: unknown) => void;
    action.mockReturnValueOnce(
      new Promise((done) => {
        resolve = done;
      })
    );
    render(form);
    expect(screen.getByRole("status").getAttribute("aria-live")).toBe("polite");
    fireEvent.submit(
      screen.getByRole("button", { name: idle }).closest("form")!
    );
    await waitFor(() =>
      expect(
        (screen.getByRole("button", { name: pending }) as HTMLButtonElement)
          .disabled
      ).toBe(true)
    );
    await act(async () => resolve({ status: "error", error: "Try again." }));
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain("Try again.")
    );
    cleanup();
    render(
      <PrivacyRequestForm
        initialFormState={{
          status: "success",
          id: "privacy-1",
          email: "a@example.com",
          requestType: "do_not_sell",
        }}
      />
    );
    expect(screen.getByTestId("privacy-confirmation")).toBeDefined();
    expect(screen.getByRole("status").getAttribute("aria-live")).toBe("polite");
  });

  it("shows pending and a polite focused error for /track lookup", async () => {
    render(
      <OrderLookup
        signInHref="/account"
        errorMessage="No order found."
        initialValues={{ orderNumber: "NL-123456", email: "a@example.com" }}
      />
    );
    const submit = screen.getByRole("button", { name: "Track order" });
    fireEvent.submit(submit.closest("form")!);
    await waitFor(() =>
      expect(
        (
          screen.getByRole("button", {
            name: "Tracking...",
          }) as HTMLButtonElement
        ).disabled
      ).toBe(true)
    );
    cleanup();
    render(
      <OrderLookup signInHref="/account" errorMessage="No order found." />
    );
    expect(screen.getByRole("status").textContent).toContain("No order found.");
    expect(screen.getByRole("status").getAttribute("aria-live")).toBe("polite");
  });

  it("shows pet pending, invalid, and saved states", async () => {
    const onSaved = vi.fn();
    savePetAction.mockResolvedValueOnce(null).mockResolvedValueOnce({
      id: "pet-1",
      name: "Milo",
      species: "dog",
      breed: "Mixed",
      activityLevel: "moderate",
      concerns: [],
    });
    render(
      <PetForm concernOptions={[]} onCancel={vi.fn()} onSaved={onSaved} />
    );
    fireEvent.submit(
      screen.getByRole("button", { name: "Save pet" }).closest("form")!
    );
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain(
        "highlighted fields"
      )
    );
    fireEvent.submit(
      screen.getByRole("button", { name: "Save pet" }).closest("form")!
    );
    await waitFor(() => expect(onSaved).toHaveBeenCalledOnce());
  });
});
