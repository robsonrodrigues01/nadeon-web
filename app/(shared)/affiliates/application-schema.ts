import { z } from "zod";

export const affiliateAudienceSizeOptions = [
  "Under 5K",
  "5K to 25K",
  "25K to 100K",
  "100K to 500K",
  "500K+",
] as const;

export const affiliateNicheOptions = ["Human", "Pet", "Both"] as const;

const postLinksSchema = z
  .string()
  .trim()
  .transform((value) => value.split(/\s+/).filter(Boolean))
  .pipe(
    z
      .array(
        z
          .string()
          .url()
          .refine((value) => /^https?:\/\//i.test(value))
      )
      .min(2)
      .max(3)
  );

export const AffiliateApplicationSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  socialHandles: z.string().trim().min(1).max(500),
  contentLinks: postLinksSchema,
  audienceSize: z.enum(affiliateAudienceSizeOptions),
  niche: z.enum(["human", "pet", "both"]),
  guidelinesAccepted: z.literal("on"),
  disclosureAccepted: z.literal("on"),
});
