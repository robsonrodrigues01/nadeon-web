import { z } from "zod";

export const FeedbackInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Valid email is required"),
  pageOrFeature: z.string().trim().optional(),
  description: z.string().trim().min(1, "Please describe the issue"),
  preferredReply: z.string().trim().optional(),
  assistiveTech: z.string().trim().optional(),
});
