import {
  type Campaign,
  type CampaignConfig,
  CampaignSchema,
} from "@/lib/contracts/campaign";

async function loadCampaignConfig(): Promise<Campaign | null> {
  if (typeof window === "undefined") {
    try {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const filePath = path.resolve(process.cwd(), "data/campaign.json");
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === "object") {
          if (parsed.campaign && parsed.isActive) {
            return CampaignSchema.parse(parsed.campaign);
          }
          if (parsed.isActive && parsed.id) {
            return CampaignSchema.parse(parsed);
          }
        }
      }
    } catch (err) {
      console.error(
        "[MockCampaignConfig] Error reading data/campaign.json:",
        err
      );
    }
  }
  return null;
}

export class MockCampaignConfig implements CampaignConfig {
  async getActiveCampaign(): Promise<Campaign | null> {
    return loadCampaignConfig();
  }
}

export const mockCampaignConfig = new MockCampaignConfig();
