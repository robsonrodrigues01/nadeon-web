import { describe, expect, it } from "vitest";
import { submitReviewAction } from "@/app/(shared)/reviews/write/actions";
import { registerForCourse } from "@/app/(shared)/courses/[curso]/actions";
import { submitAffiliateApplication } from "@/app/(shared)/affiliates/actions";
import { submitProfessionalApplication } from "@/app/(shared)/professionals/actions";

describe("W5-26: Wave 5 security verification", () => {
  it("rejects review submission when not authenticated (W4-20 pattern)", async () => {
    const formData = new FormData();
    formData.append("orderId", "ord_test_unauth");
    formData.append("productSlug", "daily-chew");
    formData.append("rating", "5");
    formData.append("title", "Great product");
    formData.append("body", "Worked wonders for my dog.");
    formData.append("authorName", "Alex M.");
    formData.append("ownExperience", "yes");
    formData.append("termsAccepted", "yes");

    const result = await submitReviewAction({ status: "idle" }, formData);
    // Since mock session is not set or not matching the order, it returns error or invalid
    expect(["error", "invalid"]).toContain(result.status);
  });

  it("rejects invalid review data without crashing (Zod validation)", async () => {
    const formData = new FormData();
    formData.append("orderId", "");
    formData.append("productSlug", "");
    formData.append("rating", "10"); // Invalid rating > 5

    const result = await submitReviewAction({ status: "idle" }, formData);
    expect(result.status).toBe("invalid");
  });

  it("validates course registration with Zod and rejects malformed email", async () => {
    const formData = new FormData();
    formData.append("courseSlug", "30-day-longevity");
    formData.append("firstName", "John");
    formData.append("email", "not-an-email");

    const result = await registerForCourse(
      { success: null, message: "" },
      formData
    );
    expect(result.success).toBe(false);
  });

  it("validates affiliates application with Zod and rejects duplicate parameter injection", async () => {
    const formData = new FormData();
    formData.append("fullName", "Jane Doe");
    formData.append("fullName", "Injected Value"); // Duplicate field attack
    formData.append("email", "jane@example.com");

    const result = await submitAffiliateApplication(
      { status: "idle" },
      formData
    );
    expect(result.status).toBe("invalid");
  });

  it("validates professional application with Zod and rejects invalid profession enum", async () => {
    const formData = new FormData();
    formData.append("fullName", "Dr. Smith");
    formData.append("profession", "Astronaut"); // Not in enum
    formData.append("licenseOrCredential", "LIC-123");
    formData.append("practice", "Clinic");
    formData.append("state", "CA");
    formData.append("email", "smith@example.com");
    formData.append("phone", "555-123-4567");
    formData.append("audience", "human");
    formData.append("recommendationModel", "clinic");
    formData.append("licenseConfirmation", "on");
    formData.append("termsAccepted", "on");

    const result = await submitProfessionalApplication(
      { status: "idle" },
      formData
    );
    expect(result.status).toBe("invalid");
  });
});
