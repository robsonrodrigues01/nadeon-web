"use server";

import { z } from "zod";
import { formsProvider } from "@/lib/providers";

const CourseRegistrationSchema = z
  .object({
    courseSlug: z.enum(["30-day-longevity", "senior-dog-care"]),
    firstName: z.string().trim().min(1).max(100),
    dogName: z.string().trim().min(1).max(100).optional(),
    email: z.string().trim().email().max(254),
  })
  .superRefine((input, context) => {
    if (input.courseSlug === "senior-dog-care" && !input.dogName) {
      context.addIssue({
        code: "custom",
        path: ["dogName"],
        message: "Required",
      });
    }
  });

const courseLists = {
  "30-day-longevity": "course-30-day-longevity",
  "senior-dog-care": "course-senior-dog-care",
} as const;

export type CourseRegistrationState = {
  success: boolean | null;
  message: string;
};

export async function registerForCourse(
  _previousState: CourseRegistrationState,
  formData: FormData
): Promise<CourseRegistrationState> {
  const parsed = CourseRegistrationSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!parsed.success) return { success: false, message: "To be confirmed" };

  try {
    const result = await formsProvider.subscribe(
      courseLists[parsed.data.courseSlug],
      parsed.data.email,
      true
    );
    return result.success
      ? { success: true, message: "To be confirmed" }
      : { success: false, message: "To be confirmed" };
  } catch {
    return { success: false, message: "To be confirmed" };
  }
}
