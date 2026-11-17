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
  submitPrivacyRequest.mockReset();
});

describe("W3-32 form states", () => {
  it("focuses and describes the first invalid profile field", async () => {
    render(<ProfileForm customer={customer} />);
    const email = screen.getByLabelText("Email");
    fireEvent.change(email, { target: { value: "not-an-email" } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(document.activeElement).toBe(email));
    expect(email.getAttribute("aria-invalid")).toBe("true");
    const messageId = email.getAttribute("aria-describedby");
    expect(messageId).toBeTruthy();
    const message = document.getElementById(messageId!);
    expect(message?.getAttribute("aria-live")).toBe("polite");
    expect(message?.textContent).toMatch(/email/i);
  });

  it("focuses and describes the first invalid pet field", async () => {
    savePetAction.mockResolvedValueOnce(null);
    render(
      <PetForm concernOptions={[]} onCancel={vi.fn()} onSaved={vi.fn()} />
    );
    const name = screen.getByLabelText("Pet name");
    fireEvent.click(screen.getByRole("button", { name: "Save pet" }));

    await waitFor(() => expect(document.activeElement).toBe(name));
    expect(name.getAttribute("aria-invalid")).toBe("true");
    const messageId = name.getAttribute("aria-describedby");
    expect(messageId).toBeTruthy();
    const message = document.getElementById(messageId!);
    expect(message?.getAttribute("aria-live")).toBe("polite");
    expect(message?.textContent).toMatch(/highlighted fields/i);
  });

  it("focuses and describes the first invalid accessibility feedback field", async () => {
    render(<FeedbackForm />);
    const name = screen.getByLabelText("Name");
    fireEvent.click(screen.getByRole("button", { name: "Send feedback" }));

    await waitFor(() => expect(document.activeElement).toBe(name));
    expect(name.getAttribute("aria-invalid")).toBe("true");
    const messageId = name.getAttribute("aria-describedby");
    expect(messageId).toBeTruthy();
    const message = document.getElementById(messageId!);
    expect(message?.getAttribute("aria-live")).toBe("polite");
    expect(message?.textContent).toMatch(/name is required/i);
  });

  it("focuses and describes the first invalid Do Not Sell field", async () => {
    render(<PrivacyRequestForm />);
    const confirmation = screen.getByRole("checkbox");
    fireEvent.click(screen.getByRole("button", { name: "Submit request" }));

    await waitFor(() => expect(document.activeElement).toBe(confirmation));
    expect(confirmation.getAttribute("aria-invalid")).toBe("true");
    const messageId = confirmation.getAttribute("aria-describedby");
    expect(messageId).toBeTruthy();
    const message = document.getElementById(messageId!);
    expect(message?.getAttribute("aria-live")).toBe("polite");
    expect(message?.textContent).toMatch(/confirm that the information/i);
  });

  it("blocks a Do Not Sell request without a state and focuses the state field", async () => {
    submitPrivacyRequest.mockResolvedValueOnce({
      status: "invalid",
      error: "Select your state of residence.",
    });
    render(<PrivacyRequestForm />);
    fireEvent.change(screen.getByLabelText("First name"), {
      target: { value: "Alex" },
    });
    fireEvent.change(screen.getByLabelText("Last name"), {
      target: { value: "Smith" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "alex@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    const state = screen.getByLabelText("State of residence");

    fireEvent.click(screen.getByRole("button", { name: "Submit request" }));

    await waitFor(() => expect(document.activeElement).toBe(state));
    expect(state.getAttribute("aria-invalid")).toBe("true");
    const messageId = state.getAttribute("aria-describedby");
    expect(messageId).toBeTruthy();
    expect(document.getElementById(messageId!)?.textContent).toMatch(/state/i);
    expect(submitPrivacyRequest).not.toHaveBeenCalled();
  });

  it("focuses and describes the first invalid newsletter field", async () => {
    render(<NewsletterForm />);
    const email = screen.getByLabelText("Email address");
    fireEvent.submit(email.closest("form")!);

    await waitFor(() => expect(document.activeElement).toBe(email));
    expect(email.getAttribute("aria-invalid")).toBe("true");
    const messageId = email.getAttribute("aria-describedby");
    expect(messageId).toBeTruthy();
    const message = document.getElementById(messageId!);
    expect(message?.getAttribute("aria-live")).toBe("polite");
    expect(message?.textContent).toMatch(/email address is required/i);
  });

  it("announces and focuses the first invalid contact field", () => {
    render(<ContactForm topics={["Orders & Shipping"]} />);
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    const status = screen.getByRole("status");
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(status.textContent).toContain("Name is required");
    expect(document.activeElement).toBe(screen.getByLabelText("Name"));
  });

  it("announces and focuses the first invalid /help tracking field", () => {
    render(<TrackForm />);
    fireEvent.click(screen.getByRole("button", { name: "Track order" }));
    const status = screen.getByRole("status");
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(status.textContent).toContain("Check the order number and email.");
    expect(document.activeElement).toBe(screen.getByLabelText("Order number"));
  });

  it("announces and focuses the first invalid /track field", () => {
    render(<OrderLookup signInHref="/account" />);
    fireEvent.click(screen.getByRole("button", { name: "Track order" }));
    const alert = screen.getByRole("alert");
    expect(alert.textContent).toContain("Check the order number and email.");
    expect(document.activeElement).toBe(screen.getByLabelText("Order number"));
  });

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
      if (_name === "contact") {
        fireEvent.change(screen.getByLabelText("Name"), {
          target: { value: "Alex" },
        });
        fireEvent.change(
          screen.getByLabelText("Email", { selector: "#contact-email" }),
          { target: { value: "alex@example.com" } }
        );
        fireEvent.change(screen.getByLabelText("Topic"), {
          target: { value: "Orders & Shipping" },
        });
        fireEvent.change(screen.getByLabelText("Message"), {
          target: { value: "I need help." },
        });
      }
      if (_name === "help tracking") {
        fireEvent.change(screen.getByLabelText("Order number"), {
          target: { value: "NL-123456" },
        });
        fireEvent.change(screen.getByLabelText("Email"), {
          target: { value: "alex@example.com" },
        });
      }
      const submit = screen.getByRole("button", { name: idle });
      fireEvent.click(submit);
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
      if (_name === "contact") {
        fireEvent.change(screen.getByLabelText("Name"), {
          target: { value: "Alex" },
        });
        fireEvent.change(
          screen.getByLabelText("Email", { selector: "#contact-email" }),
          { target: { value: "alex@example.com" } }
        );
        fireEvent.change(screen.getByLabelText("Topic"), {
          target: { value: "Orders & Shipping" },
        });
        fireEvent.change(screen.getByLabelText("Message"), {
          target: { value: "I need help." },
        });
      }
      if (_name === "help tracking") {
        fireEvent.change(screen.getByLabelText("Order number"), {
          target: { value: "NL-123456" },
        });
        fireEvent.change(screen.getByLabelText("Email"), {
          target: { value: "alex@example.com" },
        });
      }
      const currentSubmit = screen.getByRole("button", { name: idle });
      fireEvent.click(currentSubmit);
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

  it("shows profile pending and invalid states", async () => {
    let resolve!: (value: unknown) => void;
    saveProfileAction.mockReturnValueOnce(
      new Promise((done) => {
        resolve = done;
      })
    );
    render(<ProfileForm customer={customer} />);
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
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
  });

  it("renders an idle polite status for the privacy request form", () => {
    render(<PrivacyRequestForm />);
    expect(screen.getByRole("status").getAttribute("aria-live")).toBe("polite");
  });

  it("shows pending and a focused alert for /track lookup", async () => {
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
    expect(screen.getByRole("alert").textContent).toContain("No order found.");
  });

  it("shows the invalid pet field in the live status", async () => {
    render(
      <PetForm concernOptions={[]} onCancel={vi.fn()} onSaved={vi.fn()} />
    );
    fireEvent.change(screen.getByLabelText("Pet name"), {
      target: { value: "Milo" },
    });
    fireEvent.change(screen.getByLabelText("Breed"), {
      target: { value: "Mixed" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save pet" }));
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain(
        "highlighted fields"
      )
    );
  });
});
