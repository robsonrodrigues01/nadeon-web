// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import CampaignLandingPage from "@/app/(campaign)/lp/[campanha]/page";
import { campaignConfig, contentProvider } from "@/lib/providers";
import type { Campaign } from "@/lib/contracts/campaign";
import type { JournalArticle } from "@/lib/contracts/content";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function activeCampaign(id: string, values: Partial<Campaign> = {}): Campaign {
  return {
    id,
    name: "TEST campaign",
    isActive: true,
    ...values,
  };
}

function article(
  audience: "human" | "pet",
  excerpt = "TEST editorial summary"
): JournalArticle {
  return {
    slug: "TEST-article",
    audience,
    title: "TEST editorial headline",
    category: "TEST category",
    excerpt,
    readingMinutes: 4,
    species: audience === "pet" ? ["dog"] : [],
    reviewer: "To be confirmed",
    publishedAt: "To be confirmed",
    updatedAt: "To be confirmed",
    sections: [
      {
        title: "TEST section heading",
        body: "TEST structure and function statement*",
      },
    ],
  };
}

async function renderCampaign(slug: string) {
  return render(
    await CampaignLandingPage({
      params: Promise.resolve({ campanha: slug }),
    })
  );
}

describe("W5-17 /lp/[campanha]", () => {
  it("renders the listicle template from campaign and content registries", async () => {
    const campaign = vi
      .spyOn(campaignConfig, "getActiveCampaign")
      .mockResolvedValue(activeCampaign("listicle-test-article"));
    const content = vi
      .spyOn(contentProvider, "getJournalArticle")
      .mockResolvedValue(article("pet", "TEST editorial summary*"));

    await renderCampaign("listicle-test-article");

    expect(
      screen.getByRole("heading", { level: 1, name: "TEST editorial headline" })
    ).toBeTruthy();
    expect(screen.getByText("TEST editorial summary*")).toBeTruthy();
    expect(screen.getByText("Advertisement")).toBeTruthy();
    expect(screen.getByText("Sponsored by Nadeon Labs")).toBeTruthy();
    expect(
      screen.getByText("TEST structure and function statement*")
    ).toBeTruthy();
    expect(screen.getAllByRole("note")).toHaveLength(2);
    expect(screen.getAllByRole("note")[0].textContent).toMatch(
      /not been evaluated by the Food and Drug Administration/i
    );
    expect(screen.getByText("For animal use only.")).toBeTruthy();
    expect(
      screen.queryByText(/Customer quote goes here|TEST testimonial/i)
    ).toBeNull();
    expect(campaign).toHaveBeenCalledOnce();
    expect(content).toHaveBeenCalledWith("test-article");
  });

  it("renders the product advertorial without invented offer values", async () => {
    vi.spyOn(campaignConfig, "getActiveCampaign").mockResolvedValue(
      activeCampaign("product-test-article")
    );
    vi.spyOn(contentProvider, "getJournalArticle").mockResolvedValue(
      article("human")
    );

    await renderCampaign("product-test-article");

    expect(screen.getByText("Paid content from Nadeon Labs")).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "From capsule to cell" })
    ).toBeTruthy();
    expect(screen.getByText("Offer details: To be confirmed.")).toBeTruthy();
    expect(screen.getByText("Price: To be confirmed.")).toBeTruthy();
    expect(screen.queryByText(/\$XX|\[XX\]%|\(example\)/i)).toBeNull();
    expect(screen.queryByText(/Customer quote goes here/i)).toBeNull();
    expect(screen.getByRole("note").textContent).toMatch(
      /not been evaluated by the Food and Drug Administration/i
    );
  });

  it("uses only active campaign dates and keeps seasonal tiers pending", async () => {
    const countdownEnd = "2030-01-01T00:00:00.000Z";
    const campaign = vi
      .spyOn(campaignConfig, "getActiveCampaign")
      .mockResolvedValue(
        activeCampaign("seasonal-spring-gift", {
          name: "TEST seasonal campaign",
          bannerText: "TEST approved campaign message",
          countdownEnd,
        })
      );
    await renderCampaign("seasonal-spring-gift");

    expect(
      screen.getByRole("heading", { level: 1, name: "TEST seasonal campaign" })
    ).toBeTruthy();
    expect(screen.getByRole("timer")).toBeTruthy();
    expect(screen.getByText("For animal use only.")).toBeTruthy();
    expect(
      screen.getByText(/Nadeon Pet · TEST approved campaign message/)
    ).toBeTruthy();
    expect(screen.getByText("Offer tiers: To be confirmed.")).toBeTruthy();
    expect(
      screen.getByText("Shipping deadlines: To be confirmed.")
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "See gift sets" }).getAttribute("href")
    ).toBe("/pet/kits");
    expect(campaign).toHaveBeenCalledOnce();
  });

  it("keeps the existing Black Friday campaign slug on the seasonal template", async () => {
    vi.spyOn(campaignConfig, "getActiveCampaign").mockResolvedValue(
      activeCampaign("black-friday", {
        name: "Black Friday Sale",
        bannerText: "BLACK FRIDAY · UP TO 25% OFF",
        countdownEnd: "2030-11-30T00:00:00.000Z",
      })
    );
    await renderCampaign("black-friday");

    expect(
      screen.getByRole("heading", { level: 1, name: "Black Friday Sale" })
    ).toBeTruthy();
    expect(screen.getByRole("timer")).toBeTruthy();
    expect(screen.getByText(/BLACK FRIDAY · UP TO 25% OFF/)).toBeTruthy();
  });
});
