import { describe, it, expect } from "vitest";
import { mockCampaignConfig } from "@/lib/providers/mock/campaign";

describe("CampaignConfig Contract", () => {
  it("getActiveCampaign returns null when campaign is inactive in data/campaign.json", async () => {
    const campaign = await mockCampaignConfig.getActiveCampaign();
    // In wave 0, campaign is inactive (null)
    expect(campaign).toBeNull();
  });
});
