import type { CatalogProvider } from "@/lib/contracts/catalog";
import type { CartProvider } from "@/lib/contracts/cart";
import type { AccountProvider } from "@/lib/contracts/account";
import type { SubscriptionProvider } from "@/lib/contracts/subscription";
import type { ReviewsProvider } from "@/lib/contracts/reviews";
import type { FormsProvider } from "@/lib/contracts/forms";
import type { LabsProvider } from "@/lib/contracts/labs";
import type { CampaignConfig } from "@/lib/contracts/campaign";
import type { MailyteProvider } from "@/lib/contracts/mailyte";

import { mockCatalogProvider } from "./mock/catalog";
import { mockCartProvider } from "./mock/cart";
import { mockAccountProvider } from "./mock/account";
import { mockSubscriptionProvider } from "./mock/subscription";
import { mockReviewsProvider } from "./mock/reviews";
import { mockFormsProvider } from "./mock/forms";
import { mockLabsProvider } from "./mock/labs";
import { mockCampaignConfig } from "./mock/campaign";
import { mockMailyteProvider } from "./mock/mailyte";

import {
  liveCatalogProvider,
  liveCartProvider,
  liveAccountProvider,
  liveSubscriptionProvider,
  liveReviewsProvider,
  liveFormsProvider,
  liveLabsProvider,
  liveCampaignConfig,
  liveMailyteProvider,
} from "./live";

export type ProvidersMode = "mock" | "live";

export function getProvidersMode(): ProvidersMode {
  return process.env.PROVIDERS === "live" ? "live" : "mock";
}

export function getProviders(mode: ProvidersMode = getProvidersMode()) {
  if (mode === "live") {
    return {
      catalogProvider: liveCatalogProvider,
      cartProvider: liveCartProvider,
      accountProvider: liveAccountProvider,
      subscriptionProvider: liveSubscriptionProvider,
      reviewsProvider: liveReviewsProvider,
      formsProvider: liveFormsProvider,
      labsProvider: liveLabsProvider,
      campaignConfig: liveCampaignConfig,
      mailyteProvider: liveMailyteProvider,
    };
  }

  return {
    catalogProvider: mockCatalogProvider,
    cartProvider: mockCartProvider,
    accountProvider: mockAccountProvider,
    subscriptionProvider: mockSubscriptionProvider,
    reviewsProvider: mockReviewsProvider,
    formsProvider: mockFormsProvider,
    labsProvider: mockLabsProvider,
    campaignConfig: mockCampaignConfig,
    mailyteProvider: mockMailyteProvider,
  };
}

const isLive = process.env.PROVIDERS === "live";

export const catalogProvider: CatalogProvider = isLive
  ? liveCatalogProvider
  : mockCatalogProvider;

export const cartProvider: CartProvider = isLive
  ? liveCartProvider
  : mockCartProvider;

export const accountProvider: AccountProvider = isLive
  ? liveAccountProvider
  : mockAccountProvider;

export const subscriptionProvider: SubscriptionProvider = isLive
  ? liveSubscriptionProvider
  : mockSubscriptionProvider;

export const reviewsProvider: ReviewsProvider = isLive
  ? liveReviewsProvider
  : mockReviewsProvider;

export const formsProvider: FormsProvider = isLive
  ? liveFormsProvider
  : mockFormsProvider;

export const labsProvider: LabsProvider = isLive
  ? liveLabsProvider
  : mockLabsProvider;

export const campaignConfig: CampaignConfig = isLive
  ? liveCampaignConfig
  : mockCampaignConfig;

export const mailyteProvider: MailyteProvider = isLive
  ? liveMailyteProvider
  : mockMailyteProvider;

export {
  mockCatalogProvider,
  mockCartProvider,
  mockAccountProvider,
  mockSubscriptionProvider,
  mockReviewsProvider,
  mockFormsProvider,
  mockLabsProvider,
  mockCampaignConfig,
  mockMailyteProvider,
  liveCatalogProvider,
  liveCartProvider,
  liveAccountProvider,
  liveSubscriptionProvider,
  liveReviewsProvider,
  liveFormsProvider,
  liveLabsProvider,
  liveCampaignConfig,
  liveMailyteProvider,
};
