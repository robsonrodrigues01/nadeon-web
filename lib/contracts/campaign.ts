import { z } from "zod";

export const CampaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  isActive: z.boolean(),
  bannerText: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  discountCode: z.string().optional(),
  countdownEnd: z.string().optional(),
});
export type Campaign = z.infer<typeof CampaignSchema>;

export interface CampaignConfig {
  getActiveCampaign(): Promise<Campaign | null>;
}
