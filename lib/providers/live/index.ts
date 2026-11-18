/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  CatalogFilter,
  CatalogProvider,
  CatalogSort,
  Collection,
  Kit,
  Product,
  ProductLine,
} from "@/lib/contracts/catalog";
import type {
  AccountProvider,
  Address,
  CustomerProfile,
  GuestOrderLookupInput,
  Order,
  GuestOrderTracking,
  OrderLine,
  Pet,
  PetInput,
  PetProfileProvider,
  ProfileInput,
  Session,
} from "@/lib/contracts/account";
import type {
  Subscription,
  SubscriptionCapabilities,
  SubscriptionProvider,
} from "@/lib/contracts/subscription";
import type {
  Review,
  ReviewSummary,
  ReviewsFilter,
  ReviewsProvider,
  SubmitReviewInput,
} from "@/lib/contracts/reviews";
import type {
  ApplicationInput,
  ApplicationType,
  ContactInput,
  FormSubmissionResult,
  FormsProvider,
  PrivacyRequestInput,
} from "@/lib/contracts/forms";
import type { LabLot, LabsFilter, LabsProvider } from "@/lib/contracts/labs";
import type { Campaign, CampaignConfig } from "@/lib/contracts/campaign";
import type { ContentProvider } from "@/lib/contracts/content";
import type { EmailPreferencesProvider } from "@/lib/contracts/email-preferences";
import type { OffersProvider } from "@/lib/contracts/offers";
import type { StoreLocatorProvider } from "@/lib/contracts/store-locator";
import type { WholesaleProvider } from "@/lib/contracts/wholesale";
import type {
  MailyteCheckoutStartedInput,
  MailyteContactStatusInput,
  MailyteEvent,
  MailyteOrderCompletedInput,
  MailyteProvider,
  MailyteTrackingResult,
} from "@/lib/contracts/mailyte";
import {
  MailyteCheckoutStartedInputSchema,
  MailyteContactStatusInputSchema,
  MailyteEventSchema,
  MailyteOrderCompletedInputSchema,
} from "@/lib/contracts/mailyte";
import { z } from "zod";

import {
  LiveCartProvider,
  NOT_IMPLEMENTED_MSG,
  liveCartProvider,
  liveGiftCardProvider,
  liveStub,
} from "./browser";

export { LiveCartProvider, liveCartProvider, liveGiftCardProvider };

export class LiveCatalogProvider implements CatalogProvider {
  async getProducts(_filter?: CatalogFilter): Promise<Product[]> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async getProduct(_slug: string): Promise<Product | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async getCollection(
    _handle: string,
    _filter?: CatalogFilter,
    _sort?: CatalogSort
  ): Promise<Collection | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async getKits(_line?: ProductLine): Promise<Kit[]> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async getKit(_slug: string): Promise<Kit | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async search(_q: string): Promise<Product[]> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
}

export class LiveAccountProvider
  implements AccountProvider, PetProfileProvider
{
  async getSession(): Promise<Session | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async signInUrl(_returnTo?: string): Promise<string> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async signOut(): Promise<void> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async getCustomer(): Promise<CustomerProfile | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async getOrders(): Promise<Order[]> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async getOrder(_id: string): Promise<Order | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async lookupGuestOrder(
    _orderNumberOrInput: string | GuestOrderLookupInput,
    _email?: string
  ): Promise<GuestOrderTracking | null> {
    // TODO: Shopify Storefront / Orders API guest lookup in Onda 4
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async reorder(_orderId: string): Promise<OrderLine[]> {
    // TODO: Shopify Storefront order reorder in Onda 4
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async getAddresses(): Promise<Address[]> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async updateProfile(_input: ProfileInput): Promise<CustomerProfile> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async getPets(): Promise<Pet[]> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async savePet(_pet: PetInput): Promise<Pet> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async removePet(_id: string): Promise<void> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
}

export class LiveSubscriptionProvider implements SubscriptionProvider {
  async list(): Promise<Subscription[]> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async get(_id: string): Promise<Subscription | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async capabilities(): Promise<SubscriptionCapabilities> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async skip(_id: string): Promise<Subscription> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async reschedule(
    _id: string,
    _nextBillingDate: string
  ): Promise<Subscription> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async changeFrequency(
    _id: string,
    _intervalDays: number
  ): Promise<Subscription> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async swapProduct(
    _id: string,
    _lineId: string,
    _newVariantId: string
  ): Promise<Subscription> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async changeQuantity(
    _id: string,
    _lineId: string,
    _quantity: number
  ): Promise<Subscription> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async pause(_id: string): Promise<Subscription> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async resume(_id: string): Promise<Subscription> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async cancel(
    _id: string,
    _reason: string,
    _feedback?: string
  ): Promise<Subscription> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
}

export class LiveReviewsProvider implements ReviewsProvider {
  async list(
    _filter?: ReviewsFilter
  ): Promise<{ reviews: Review[]; total: number }> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async summary(_productSlug: string): Promise<ReviewSummary> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async submit(_payload: SubmitReviewInput): Promise<Review> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
}

export class LiveFormsProvider implements FormsProvider {
  async subscribe(
    _list: string,
    _email: string,
    _consent: boolean
  ): Promise<FormSubmissionResult> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async sendContact(_payload: ContactInput): Promise<FormSubmissionResult> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async sendPrivacyRequest(
    _payload: PrivacyRequestInput
  ): Promise<FormSubmissionResult> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async sendApplication(
    _type: ApplicationType,
    _payload: ApplicationInput
  ): Promise<FormSubmissionResult> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async trackEvent(
    _name: string,
    _email: string | null,
    _properties?: Record<string, unknown>
  ): Promise<{ success: boolean }> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
}

export class LiveLabsProvider implements LabsProvider {
  async findLot(_lotNumber: string): Promise<LabLot | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async listLots(_filter?: LabsFilter): Promise<LabLot[]> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
}

export class LiveCampaignConfig implements CampaignConfig {
  async getActiveCampaign(): Promise<Campaign | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
}

export class LiveMailyteProvider implements MailyteProvider {
  async updateContactStatus(input: MailyteContactStatusInput): Promise<void> {
    const parsed = MailyteContactStatusInputSchema.safeParse(input);
    if (!parsed.success) {
      throw new Error("Invalid Mailyte contact status payload");
    }

    const apiKey = process.env.MAILYTE_API_KEY;
    if (!apiKey) {
      throw new Error("MAILYTE_API_KEY is required for the live provider");
    }

    const { email, status } = parsed.data;
    const body =
      status === "subscribed"
        ? {
            email,
            status,
            consented_at: parsed.data.consentedAt,
            consent_source: parsed.data.consentSource,
          }
        : { email, status };

    try {
      const response = await fetch("https://app.mailyte.com/api/v1/contacts", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (response.status !== 200 && response.status !== 201)
        throw new Error("Mailyte contact status update failed");
    } catch {
      throw new Error("Unable to update email consent status.");
    }
  }

  private async postContactEvent(
    event: MailyteEvent
  ): Promise<MailyteTrackingResult> {
    const parsedEvent = MailyteEventSchema.safeParse(event);
    if (
      !parsedEvent.success ||
      !/^[a-z][a-z0-9_]{0,63}$/.test(parsedEvent.data?.eventName ?? "")
    ) {
      throw new Error("Invalid Mailyte event payload");
    }
    if (!parsedEvent.data.email) {
      throw new Error("Mailyte contact events require an email address");
    }

    const apiKey = process.env.MAILYTE_API_KEY;
    if (!apiKey) {
      throw new Error("MAILYTE_API_KEY is required for the live provider");
    }

    const response = await fetch(
      "https://app.mailyte.com/api/v1/contact-events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: parsedEvent.data.eventName,
          email: parsedEvent.data.email,
          unique_id: parsedEvent.data.uniqueId,
          occurred_at: parsedEvent.data.timestamp,
          properties: parsedEvent.data.properties,
        }),
      }
    );

    if (response.status === 403) {
      const errorBody = await response.text().catch(() => "");
      const requiredScope = errorBody.match(
        /\b(contact_events:write|contacts:write|messages:send)\b/
      )?.[0];
      throw new Error(
        `Mailyte request forbidden (403); missing scope${requiredScope ? `: ${requiredScope}` : ""}`
      );
    }
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      const seconds =
        retryAfter && /^\d+$/.test(retryAfter)
          ? `${retryAfter} seconds`
          : "unspecified";
      throw new Error(`Mailyte rate limited (429); Retry-After: ${seconds}`);
    }
    if (response.status !== 202) {
      throw new Error(`Mailyte request failed (${response.status})`);
    }

    const resultSchema = z.object({
      data: z.object({ rejected: z.array(z.unknown()) }),
    });
    const result = resultSchema.safeParse(
      await response.json().catch(() => null)
    );
    if (!result.success) {
      throw new Error("Mailyte returned an invalid contact event response");
    }
    if (result.data.data.rejected.length > 0) {
      throw new Error(
        `Mailyte rejected ${result.data.data.rejected.length} contact event(s)`
      );
    }

    // The API has no event ID; use uniqueId as the correlation ID.
    return {
      success: true,
      eventId: parsedEvent.data.uniqueId,
      uniqueId: parsedEvent.data.uniqueId,
    };
  }

  async trackEvent(event: MailyteEvent): Promise<MailyteTrackingResult> {
    return this.postContactEvent(event);
  }
  async sendCheckoutStarted(
    input: MailyteCheckoutStartedInput
  ): Promise<MailyteTrackingResult> {
    const parsed = MailyteCheckoutStartedInputSchema.safeParse(input);
    if (!parsed.success) {
      throw new Error("Invalid checkout_started payload");
    }
    return this.postContactEvent({
      eventName: "checkout_started",
      email: parsed.data.email,
      uniqueId: parsed.data.idempotencyKey ?? parsed.data.checkoutId,
      properties: {
        totalPrice: parsed.data.totalPrice,
        currency: parsed.data.currency,
        lineItemsCount: parsed.data.lineItemsCount,
        ...parsed.data.properties,
      },
    });
  }
  async sendOrderCompleted(
    input: MailyteOrderCompletedInput
  ): Promise<MailyteTrackingResult> {
    const parsed = MailyteOrderCompletedInputSchema.safeParse(input);
    if (!parsed.success) {
      throw new Error("Invalid order_completed payload");
    }
    return this.postContactEvent({
      eventName: "order_completed",
      email: parsed.data.email,
      uniqueId: parsed.data.idempotencyKey ?? parsed.data.orderId,
      properties: {
        orderNumber: parsed.data.orderNumber,
        totalPrice: parsed.data.totalPrice,
        currency: parsed.data.currency,
        lineItemsCount: parsed.data.lineItemsCount,
        ...parsed.data.properties,
      },
    });
  }
}

export const liveCatalogProvider = new LiveCatalogProvider();
export const liveAccountProvider = new LiveAccountProvider();
export const liveSubscriptionProvider = new LiveSubscriptionProvider();
export const liveReviewsProvider = new LiveReviewsProvider();
export const liveFormsProvider = new LiveFormsProvider();
export const liveLabsProvider = new LiveLabsProvider();
export const liveCampaignConfig = new LiveCampaignConfig();
export const liveMailyteProvider = new LiveMailyteProvider();
export const liveContentProvider = liveStub<ContentProvider>("contentProvider");
export const liveEmailPreferencesProvider = liveStub<EmailPreferencesProvider>(
  "emailPreferencesProvider"
);
export const liveOffersProvider = liveStub<OffersProvider>("offersProvider");
export const liveStoreLocatorProvider = liveStub<StoreLocatorProvider>(
  "storeLocatorProvider"
);
export const liveWholesaleProvider =
  liveStub<WholesaleProvider>("wholesaleProvider");
