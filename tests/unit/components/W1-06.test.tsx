// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { Newsletter } from "@/components/brand/newsletter";
import type {
  FormsProvider,
  FormSubmissionResult,
} from "@/lib/contracts/forms";

describe("W1-06 Newsletter Component", () => {
  let mockProvider: FormsProvider;

  beforeEach(() => {
    mockProvider = {
      subscribe: vi.fn().mockResolvedValue({
        success: true,
        id: "sub_12345",
        message: "Subscribed successfully",
      } satisfies FormSubmissionResult),
      sendContact: vi.fn(),
      sendPrivacyRequest: vi.fn(),
      sendApplication: vi.fn(),
      trackEvent: vi.fn(),
    };
  });

  afterEach(() => {
    cleanup();
  });

  describe("Semantic HTML and Human Variant", () => {
    it("renders Human variant with semantic heading, label, input, button and legal links", () => {
      render(<Newsletter variant="human" provider={mockProvider} />);

      // Heading
      const heading = screen.getByRole("heading", {
        name: /join the nadeon list/i,
      });
      expect(heading).toBeDefined();

      // Semantic input and associated label
      const input = screen.getByLabelText(/email address/i);
      expect(input).toBeDefined();
      expect(input.tagName).toBe("INPUT");
      expect(input.getAttribute("type")).toBe("email");
      expect(input.getAttribute("placeholder")).toBe("Email address");

      // Semantic submit button
      const button = screen.getByRole("button", { name: /get 10% off/i });
      expect(button).toBeDefined();
      expect(button.getAttribute("type")).toBe("submit");

      // Semantic legal navigation links
      const termsLink = screen.getByRole("link", { name: /terms/i });
      expect(termsLink.getAttribute("href")).toBe("/legal/terms");

      const privacyLink = screen.getByRole("link", { name: /privacy policy/i });
      expect(privacyLink.getAttribute("href")).toBe("/legal/privacy");

      // Subtitle
      expect(
        screen.getByText(/10% off your first order, plus new science/i)
      ).toBeDefined();
    });
  });

  describe("Pet Variant", () => {
    it("renders Pet variant with 'Join the pack' heading", () => {
      render(<Newsletter variant="pet" provider={mockProvider} />);

      const heading = screen.getByRole("heading", { name: /join the pack/i });
      expect(heading).toBeDefined();

      const button = screen.getByRole("button", { name: /get 10% off/i });
      expect(button).toBeDefined();
    });
  });

  describe("Newsletter email validation", () => {
    it("validates on blur and clears the error after a valid edit", async () => {
      render(<Newsletter variant="human" provider={mockProvider} />);

      const input = screen.getByLabelText(/email address/i);
      fireEvent.change(input, { target: { value: "invalid" } });
      fireEvent.blur(input);

      expect(
        await screen.findByText(/please enter a valid email address/i)
      ).toBeDefined();

      fireEvent.change(input, { target: { value: "valid@example.com" } });
      await waitFor(() => {
        expect(
          screen.queryByText(/please enter a valid email address/i)
        ).toBeNull();
      });
    });

    it("displays error when submitting with empty email", async () => {
      render(<Newsletter variant="human" provider={mockProvider} />);

      const button = screen.getByRole("button", { name: /get 10% off/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/email address is required/i)).toBeDefined();
      });

      expect(mockProvider.subscribe).not.toHaveBeenCalled();
    });

    it("displays error when submitting invalid email format", async () => {
      render(<Newsletter variant="human" provider={mockProvider} />);

      const input = screen.getByLabelText(/email address/i);
      fireEvent.change(input, { target: { value: "not-an-email" } });

      const button = screen.getByRole("button", { name: /get 10% off/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(
          screen.getByText(/please enter a valid email address/i)
        ).toBeDefined();
      });

      expect(mockProvider.subscribe).not.toHaveBeenCalled();
    });
  });

  describe("Submission with FormsProvider.subscribe", () => {
    it("submits Human list to FormsProvider.subscribe with valid email and consent", async () => {
      render(<Newsletter variant="human" provider={mockProvider} />);

      const input = screen.getByLabelText(/email address/i);
      fireEvent.change(input, { target: { value: "human.user@example.com" } });

      const button = screen.getByRole("button", { name: /get 10% off/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockProvider.subscribe).toHaveBeenCalledWith(
          "newsletter-human",
          "human.user@example.com",
          true
        );
      });

      // Shows success message
      await waitFor(() => {
        expect(screen.getByText(/thank you for subscribing/i)).toBeDefined();
      });
    });

    it("submits Pet list to FormsProvider.subscribe for pet variant", async () => {
      render(<Newsletter variant="pet" provider={mockProvider} />);

      const input = screen.getByLabelText(/email address/i);
      fireEvent.change(input, { target: { value: "pet.lover@example.com" } });

      const button = screen.getByRole("button", { name: /get 10% off/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockProvider.subscribe).toHaveBeenCalledWith(
          "newsletter-pet",
          "pet.lover@example.com",
          true
        );
      });
    });

    it("displays server error message when submission fails", async () => {
      vi.mocked(mockProvider.subscribe).mockRejectedValueOnce(
        new Error("Network error. Please try again.")
      );

      render(<Newsletter variant="human" provider={mockProvider} />);

      const input = screen.getByLabelText(/email address/i);
      fireEvent.change(input, { target: { value: "error.user@example.com" } });

      const button = screen.getByRole("button", { name: /get 10% off/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(
          screen.getByText(/network error\. please try again\./i)
        ).toBeDefined();
      });
    });

    it("submits using server action when provider prop is omitted", async () => {
      render(<Newsletter variant="human" />);

      const input = screen.getByLabelText(/email address/i);
      fireEvent.change(input, { target: { value: "action.user@example.com" } });

      const button = screen.getByRole("button", { name: /get 10% off/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/thank you for subscribing/i)).toBeDefined();
      });
    });
  });
});
