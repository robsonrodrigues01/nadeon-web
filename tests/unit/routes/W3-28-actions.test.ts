import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  skip: vi.fn(),
  addLines: vi.fn(),
  sendPrivacyRequest: vi.fn(),
  sendContact: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));
vi.mock("@/lib/providers", () => ({
  accountProvider: {},
  cartProvider: { addLines: mocks.addLines },
  subscriptionProvider: { skip: mocks.skip },
  formsProvider: {
    sendPrivacyRequest: mocks.sendPrivacyRequest,
    sendContact: mocks.sendContact,
  },
}));

import {
  reorderAction,
  skipNextDeliveryAction,
} from "@/app/(account)/account/_components/actions";
import { submitPrivacyRequest } from "@/app/(shared)/legal/do-not-sell/_components/actions";
import { submitAccessibilityFeedback } from "@/app/(shared)/legal/accessibility/_components/actions";

function form(values: Record<string, string | string[]>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    for (const item of Array.isArray(value) ? value : [value])
      data.append(key, item);
  }
  return data;
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("W3-28 account action input validation", () => {
  it("rejects malformed or oversized subscription IDs before the provider call", async () => {
    for (const subscriptionId of ["../other", "x".repeat(129)]) {
      await expect(
        skipNextDeliveryAction(form({ subscriptionId }))
      ).rejects.toThrow();
    }
    expect(mocks.skip).not.toHaveBeenCalled();
  });

  it("rejects malformed IDs, mismatched lines, excessive lines, and quantities", async () => {
    const invalidForms = [
      form({ variantId: "../variant", quantity: "1" }),
      form({ variantId: "v".repeat(129), quantity: "1" }),
      form({ variantId: "variant_1", quantity: "0" }),
      form({ variantId: "variant_1", quantity: "100" }),
      form({ variantId: "variant_1", quantity: ["1", "2"] }),
      form({
        variantId: Array.from({ length: 21 }, (_, i) => `variant_${i}`),
        quantity: Array.from({ length: 21 }, () => "1"),
      }),
    ];
    for (const data of invalidForms)
      await expect(reorderAction(data)).rejects.toThrow();
    expect(mocks.addLines).not.toHaveBeenCalled();
  });

  it("adds validated reorder lines and redirects to the cart", async () => {
    await expect(
      reorderAction(form({ variantId: "var_biohack_1", quantity: "2" }))
    ).rejects.toThrow("REDIRECT:/cart");
    expect(mocks.addLines).toHaveBeenCalledWith([
      { variantId: "var_biohack_1", quantity: 2 },
    ]);
  });
});

describe("W3-28 public form errors", () => {
  it("does not return provider error details to privacy request callers", async () => {
    const error = new Error("private@example.test provider diagnostic");
    const serverLog = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.sendPrivacyRequest.mockRejectedValueOnce(error);
    const result = await submitPrivacyRequest(
      { status: "idle" },
      form({
        email: "person@example.test",
        firstName: "Pat",
        lastName: "Doe",
        requestType: "do_not_sell",
        confirmAccuracy: "on",
      })
    );
    expect(result).toEqual({
      status: "error",
      error: "Unable to submit request. Please try again.",
    });
    expect(serverLog).toHaveBeenCalledWith(
      "[PrivacyRequest] Submission failed",
      { code: "provider_error" }
    );
    expect(JSON.stringify(serverLog.mock.calls)).not.toContain(
      "private@example.test"
    );
  });

  it("does not return provider failure messages to privacy request callers", async () => {
    const serverLog = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.sendPrivacyRequest.mockResolvedValueOnce({
      success: false,
      message: "private@example.test provider diagnostic",
    });
    const result = await submitPrivacyRequest(
      { status: "idle" },
      form({
        email: "person@example.test",
        firstName: "Pat",
        lastName: "Doe",
        requestType: "do_not_sell",
        confirmAccuracy: "on",
      })
    );
    expect(result).toEqual({
      status: "error",
      error: "Unable to submit request. Please try again.",
    });
    expect(serverLog).toHaveBeenCalledWith(
      "[PrivacyRequest] Provider rejected submission",
      { code: "provider_rejected" }
    );
    expect(JSON.stringify(serverLog.mock.calls)).not.toContain(
      "private@example.test"
    );
  });

  it("rejects non-checkbox confirmation and File values before calling the provider", async () => {
    const base = {
      email: "person@example.test",
      firstName: "Pat",
      lastName: "Doe",
      requestType: "do_not_sell",
    };
    const invalidConfirmation = form({ ...base, confirmAccuracy: "false" });
    const fileField = new FormData();
    fileField.set("email", "person@example.test");
    fileField.set("firstName", "Pat");
    fileField.set("lastName", "Doe");
    fileField.set("requestType", "do_not_sell");
    fileField.set("confirmAccuracy", "on");
    fileField.set("phone", new File(["unexpected"], "phone.txt"));

    expect(
      await submitPrivacyRequest({ status: "idle" }, invalidConfirmation)
    ).toMatchObject({ status: "invalid" });
    expect(await submitPrivacyRequest({ status: "idle" }, fileField)).toEqual({
      status: "invalid",
    });
    expect(mocks.sendPrivacyRequest).not.toHaveBeenCalled();
  });

  it("does not return provider error details to accessibility feedback callers", async () => {
    const error = new Error("private@example.test provider diagnostic");
    const serverLog = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.sendContact.mockRejectedValueOnce(error);
    const result = await submitAccessibilityFeedback(
      { status: "idle" },
      form({ name: "Pat", email: "person@example.test", description: "Issue" })
    );
    expect(result).toEqual({
      status: "error",
      error: "Unable to submit feedback. Please try again.",
    });
    expect(serverLog).toHaveBeenCalledWith(
      "[AccessibilityFeedback] Submission failed",
      { code: "provider_error" }
    );
    expect(JSON.stringify(serverLog.mock.calls)).not.toContain(
      "private@example.test"
    );
  });

  it("does not return provider failure messages to accessibility feedback callers", async () => {
    const serverLog = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.sendContact.mockResolvedValueOnce({
      success: false,
      message: "private@example.test provider diagnostic",
    });
    const result = await submitAccessibilityFeedback(
      { status: "idle" },
      form({ name: "Pat", email: "person@example.test", description: "Issue" })
    );
    expect(result).toEqual({
      status: "error",
      error: "Unable to submit feedback. Please try again.",
    });
    expect(serverLog).toHaveBeenCalledWith(
      "[AccessibilityFeedback] Provider rejected submission",
      { code: "provider_rejected" }
    );
    expect(JSON.stringify(serverLog.mock.calls)).not.toContain(
      "private@example.test"
    );
  });
});
