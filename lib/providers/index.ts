import type { CatalogProvider } from "@/lib/contracts/catalog";
import type { CartProvider } from "@/lib/contracts/cart";
import type {
  AccountProvider,
  PetProfileProvider,
} from "@/lib/contracts/account";
import type { SubscriptionProvider } from "@/lib/contracts/subscription";
import type { ReviewsProvider } from "@/lib/contracts/reviews";
import type { FormsProvider } from "@/lib/contracts/forms";
import type { LabsProvider } from "@/lib/contracts/labs";
import type { CampaignConfig } from "@/lib/contracts/campaign";
import type { MailyteProvider } from "@/lib/contracts/mailyte";
import type { ContentProvider } from "@/lib/contracts/content";
import type { EmailPreferencesProvider } from "@/lib/contracts/email-preferences";
import type { GiftCardProvider } from "@/lib/contracts/gift-card";
import type { OffersProvider } from "@/lib/contracts/offers";
import type { StoreLocatorProvider } from "@/lib/contracts/store-locator";
import type { WholesaleProvider } from "@/lib/contracts/wholesale";

import { mockCatalogProvider } from "./mock/catalog";
import { mockCartProvider } from "./mock/cart";
import { mockAccountProvider } from "./mock/account";
import { mockSubscriptionProvider } from "./mock/subscription";
import { mockReviewsProvider } from "./mock/reviews";
import { mockFormsProvider } from "./mock/forms";
import { mockLabsProvider } from "./mock/labs";
import { mockCampaignConfig } from "./mock/campaign";
import { mockMailyteProvider } from "./mock/mailyte";
import { mockContentProvider } from "./mock/content";
import { mockEmailPreferencesProvider } from "./mock/email-preferences";
import { mockGiftCardProvider } from "./mock/gift-card";
import { mockOffersProvider } from "./mock/offers";
import { mockStoreLocatorProvider } from "./mock/store-locator";
import { mockWholesaleProvider } from "./mock/wholesale";

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
  liveContentProvider,
  liveEmailPreferencesProvider,
  liveGiftCardProvider,
  liveOffersProvider,
  liveStoreLocatorProvider,
  liveWholesaleProvider,
} from "./live";
import { parseLiveList } from "./live-list";

export type ProvidersMode = "mock" | "live";

export const LIVE_PROVIDER_KEYS = [
  "catalog",
  "cart",
  "account",
  "pets",
  "subscription",
  "reviews",
  "forms",
  "labs",
  "campaign",
  "content",
  "email-preferences",
  "gift-card",
  "offers",
  "store-locator",
  "wholesale",
  "mailyte",
] as const;

export type LiveProviderKey = (typeof LIVE_PROVIDER_KEYS)[number];

export interface Providers {
  catalogProvider: CatalogProvider;
  cartProvider: CartProvider;
  accountProvider: AccountProvider;
  petProfileProvider: PetProfileProvider;
  subscriptionProvider: SubscriptionProvider;
  reviewsProvider: ReviewsProvider;
  formsProvider: FormsProvider;
  labsProvider: LabsProvider;
  campaignConfig: CampaignConfig;
  mailyteProvider: MailyteProvider;
  contentProvider: ContentProvider;
  emailPreferencesProvider: EmailPreferencesProvider;
  giftCardProvider: GiftCardProvider;
  offersProvider: OffersProvider;
  storeLocatorProvider: StoreLocatorProvider;
  wholesaleProvider: WholesaleProvider;
}

export function getProvidersMode(): ProvidersMode {
  return process.env.PROVIDERS === "live" ? "live" : "mock";
}

/** Providers switched to live by PROVIDERS=live (all) or PROVIDERS_LIVE (comma list). */
export function getLiveProviderKeys(): Set<LiveProviderKey> {
  if (getProvidersMode() === "live") return new Set(LIVE_PROVIDER_KEYS);
  return parseLiveList(
    "PROVIDERS_LIVE",
    process.env.PROVIDERS_LIVE,
    LIVE_PROVIDER_KEYS
  );
}

/**
 * Without a mode, each provider follows the environment. An explicit mode
 * forces every provider, except Mailyte, which MAILYTE_MODE=live always turns live.
 */
export function getProviders(mode?: ProvidersMode): Providers {
  const live: Set<LiveProviderKey> =
    mode === "live"
      ? new Set(LIVE_PROVIDER_KEYS)
      : mode === "mock"
        ? new Set()
        : getLiveProviderKeys();
  const pick = <T>(key: LiveProviderKey, liveProvider: T, mockProvider: T) =>
    live.has(key) ? liveProvider : mockProvider;

  return {
    catalogProvider: pick("catalog", liveCatalogProvider, mockCatalogProvider),
    cartProvider: pick<CartProvider>(
      "cart",
      liveCartProvider,
      mockCartProvider
    ),
    accountProvider: pick<AccountProvider>(
      "account",
      liveAccountProvider,
      mockAccountProvider
    ),
    petProfileProvider: pick<PetProfileProvider>(
      "pets",
      liveAccountProvider,
      mockAccountProvider
    ),
    subscriptionProvider: pick<SubscriptionProvider>(
      "subscription",
      liveSubscriptionProvider,
      mockSubscriptionProvider
    ),
    reviewsProvider: pick<ReviewsProvider>(
      "reviews",
      liveReviewsProvider,
      mockReviewsProvider
    ),
    formsProvider: pick<FormsProvider>(
      "forms",
      liveFormsProvider,
      mockFormsProvider
    ),
    labsProvider: pick<LabsProvider>(
      "labs",
      liveLabsProvider,
      mockLabsProvider
    ),
    campaignConfig: pick<CampaignConfig>(
      "campaign",
      liveCampaignConfig,
      mockCampaignConfig
    ),
    mailyteProvider:
      live.has("mailyte") || process.env.MAILYTE_MODE === "live"
        ? liveMailyteProvider
        : mockMailyteProvider,
    contentProvider: pick<ContentProvider>(
      "content",
      liveContentProvider,
      mockContentProvider
    ),
    emailPreferencesProvider: pick<EmailPreferencesProvider>(
      "email-preferences",
      liveEmailPreferencesProvider,
      mockEmailPreferencesProvider
    ),
    giftCardProvider: pick<GiftCardProvider>(
      "gift-card",
      liveGiftCardProvider,
      mockGiftCardProvider
    ),
    offersProvider: pick<OffersProvider>(
      "offers",
      liveOffersProvider,
      mockOffersProvider
    ),
    storeLocatorProvider: pick<StoreLocatorProvider>(
      "store-locator",
      liveStoreLocatorProvider,
      mockStoreLocatorProvider
    ),
    wholesaleProvider: pick<WholesaleProvider>(
      "wholesale",
      liveWholesaleProvider,
      mockWholesaleProvider
    ),
  };
}

const selected = getProviders();

export const catalogProvider: CatalogProvider = selected.catalogProvider;
export const cartProvider: CartProvider = selected.cartProvider;
export const accountProvider: AccountProvider = selected.accountProvider;
export const petProfileProvider: PetProfileProvider =
  selected.petProfileProvider;
export const subscriptionProvider: SubscriptionProvider =
  selected.subscriptionProvider;
export const reviewsProvider: ReviewsProvider = selected.reviewsProvider;
export const formsProvider: FormsProvider = selected.formsProvider;
export const labsProvider: LabsProvider = selected.labsProvider;
export const campaignConfig: CampaignConfig = selected.campaignConfig;
export const mailyteProvider: MailyteProvider = selected.mailyteProvider;
export const contentProvider: ContentProvider = selected.contentProvider;
export const emailPreferencesProvider: EmailPreferencesProvider =
  selected.emailPreferencesProvider;
export const giftCardProvider: GiftCardProvider = selected.giftCardProvider;
export const offersProvider: OffersProvider = selected.offersProvider;
export const storeLocatorProvider: StoreLocatorProvider =
  selected.storeLocatorProvider;
export const wholesaleProvider: WholesaleProvider = selected.wholesaleProvider;

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
  mockContentProvider,
  mockEmailPreferencesProvider,
  mockGiftCardProvider,
  mockOffersProvider,
  mockStoreLocatorProvider,
  mockWholesaleProvider,
  liveCatalogProvider,
  liveCartProvider,
  liveAccountProvider,
  liveSubscriptionProvider,
  liveReviewsProvider,
  liveFormsProvider,
  liveLabsProvider,
  liveCampaignConfig,
  liveMailyteProvider,
  liveContentProvider,
  liveEmailPreferencesProvider,
  liveGiftCardProvider,
  liveOffersProvider,
  liveStoreLocatorProvider,
  liveWholesaleProvider,
};
