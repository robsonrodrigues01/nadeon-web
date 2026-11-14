import { z } from "zod";

export const ContactInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  topic: z.string().min(1),
  message: z.string().min(1),
  orderNumber: z.string().optional(),
});
export type ContactInput = z.infer<typeof ContactInputSchema>;

export const PrivacyRequestTypeSchema = z.enum([
  "access",
  "delete",
  "opt_out",
  "do_not_sell",
]);
export type PrivacyRequestType = z.infer<typeof PrivacyRequestTypeSchema>;

export const PrivacyRequestInputSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  requestType: PrivacyRequestTypeSchema,
  details: z.string().optional(),
});
export type PrivacyRequestInput = z.infer<typeof PrivacyRequestInputSchema>;

export const ApplicationTypeSchema = z.enum([
  "wholesale",
  "professionals",
  "affiliates",
]);
export type ApplicationType = z.infer<typeof ApplicationTypeSchema>;

export const ApplicationInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  organization: z.string().optional(),
  website: z.string().optional(),
  phone: z.string().optional(),
  details: z.record(z.string(), z.unknown()).default({}),
});
export type ApplicationInput = z.infer<typeof ApplicationInputSchema>;

export const FormSubmissionResultSchema = z.object({
  success: z.boolean(),
  id: z.string(),
  message: z.string().optional(),
});
export type FormSubmissionResult = z.infer<typeof FormSubmissionResultSchema>;

export interface FormsProvider {
  subscribe(
    list: string,
    email: string,
    consent: boolean
  ): Promise<FormSubmissionResult>;
  sendContact(payload: ContactInput): Promise<FormSubmissionResult>;
  sendPrivacyRequest(
    payload: PrivacyRequestInput
  ): Promise<FormSubmissionResult>;
  sendApplication(
    type: ApplicationType,
    payload: ApplicationInput
  ): Promise<FormSubmissionResult>;
  trackEvent(
    name: string,
    email: string | null,
    properties?: Record<string, unknown>
  ): Promise<{ success: boolean }>;
}
