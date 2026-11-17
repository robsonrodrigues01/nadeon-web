import * as vercelAnalytics from "@vercel/analytics";
import {
  type AnalyticsEventName,
  type AnalyticsEventMap,
  type TrackOptions,
  type TrackResult,
  type ViewItemPayload,
  type AddToCartPayload,
  type BeginCheckoutPayload,
  type SubscribeNewsletterPayload,
  type QuizCompletePayload,
  type PurchasePayload,
} from "./types";
import { AnalyticsEventSchemas } from "./schemas";
import { hasAnalyticsConsent } from "./consent";

const FORBIDDEN_ANALYTICS_LOG_KEYS = new Set([
  "email",
  "user_email",
  "customer_email",
  "mail",
  "name",
  "first_name",
  "firstname",
  "last_name",
  "lastname",
  "full_name",
  "fullname",
  "customer_name",
  "user_name",
  "phone",
  "telephone",
  "mobile",
  "address",
  "street",
  "street_address",
  "city",
  "zip",
  "zip_code",
  "zipcode",
  "postal_code",
  "postalcode",
  "billing_address",
  "shipping_address",
  "search_term",
  "query",
  "message",
  "comment",
  "note",
  "notes",
  "details",
  "description",
  "free_text",
  "text",
  "body",
  "feedback",
  "prompt",
]);

const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;

/**
 * Sanitizes analytical payload before console logging.
 * Retains only event type, IDs, and non-personal fields.
 * Excludes email, names, addresses, and free text.
 */
export function sanitizeForAnalyticsLog(
  payload: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined) continue;

    const lowerKey = key.toLowerCase();
    if (
      FORBIDDEN_ANALYTICS_LOG_KEYS.has(lowerKey) ||
      lowerKey.includes("email") ||
      lowerKey.includes("address")
    ) {
      continue;
    }

    if (typeof value === "string") {
      if (EMAIL_REGEX.test(value)) {
        continue;
      }
      result[key] = value;
    } else if (
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null
    ) {
      result[key] = value;
    } else if (Array.isArray(value)) {
      result[key] = value
        .filter((item) => {
          if (typeof item === "string") {
            return !EMAIL_REGEX.test(item);
          }
          return typeof item === "number" || typeof item === "boolean";
        })
        .map((item) => {
          if (item && typeof item === "object") {
            return sanitizeForAnalyticsLog(item as Record<string, unknown>);
          }
          return item;
        });
    } else if (typeof value === "object") {
      result[key] = sanitizeForAnalyticsLog(value as Record<string, unknown>);
    }
  }

  return result;
}

/**
 * Sanitizes and flattens properties for @vercel/analytics custom events.
 * Vercel Analytics accepts Record<string, string | number | boolean | null | undefined>.
 * Nested objects or arrays are serialized to JSON strings.
 */
function flattenProperties(
  payload: Record<string, unknown>
): Record<string, string | number | boolean | null | undefined> {
  const result: Record<string, string | number | boolean | null | undefined> =
    {};

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined) continue;

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null
    ) {
      result[key] = value;
    } else if (typeof value === "object") {
      result[key] = JSON.stringify(value);
    }
  }

  return result;
}

/**
 * Dispatches an analytics event with strong typing, Zod schema validation,
 * and strict consent gating against the `analytics` category.
 *
 * Behavior:
 * - Only fires if consent for analytics is granted (via lib/consent or options).
 * - In non-production environments (development/test): logs to `console.log` with `[Analytics]`.
 * - In production: transmits the event via `@vercel/analytics`.
 */
export function track<E extends AnalyticsEventName>(
  event: E,
  payload: AnalyticsEventMap[E],
  options?: TrackOptions
): TrackResult<E> {
  // 1. Check consent
  const isConsentGranted =
    options?.consent !== undefined ? options.consent : hasAnalyticsConsent();

  if (!isConsentGranted) {
    return {
      tracked: false,
      reason: "consent_denied",
      event,
    };
  }

  // 2. Validate payload with Zod schema
  const schema = AnalyticsEventSchemas[event];
  const validatedPayload = schema.parse(payload) as AnalyticsEventMap[E];

  // 3. Dispatch based on environment
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    const flattened = flattenProperties(
      validatedPayload as Record<string, unknown>
    );
    vercelAnalytics.track(event, flattened);
  } else {
    // Development / test: console logging only (redacted: no PII or free text)
    const sanitizedLogPayload = sanitizeForAnalyticsLog(
      validatedPayload as Record<string, unknown>
    );
    console.log("[Analytics]", event, sanitizedLogPayload);
  }

  return {
    tracked: true,
    event,
    payload: validatedPayload,
  };
}

/**
 * Named alias for track
 */
export const trackEvent = track;

// Convenience typed event dispatchers
export function trackViewItem(
  payload: ViewItemPayload,
  options?: TrackOptions
): TrackResult<"view_item"> {
  return track("view_item", payload, options);
}

export function trackAddToCart(
  payload: AddToCartPayload,
  options?: TrackOptions
): TrackResult<"add_to_cart"> {
  return track("add_to_cart", payload, options);
}

export function trackBeginCheckout(
  payload: BeginCheckoutPayload,
  options?: TrackOptions
): TrackResult<"begin_checkout"> {
  return track("begin_checkout", payload, options);
}

export function trackSubscribeNewsletter(
  payload: SubscribeNewsletterPayload,
  options?: TrackOptions
): TrackResult<"subscribe_newsletter"> {
  return track("subscribe_newsletter", payload, options);
}

export function trackQuizComplete(
  payload: QuizCompletePayload,
  options?: TrackOptions
): TrackResult<"quiz_complete"> {
  return track("quiz_complete", payload, options);
}

export function trackPurchase(
  payload: PurchasePayload,
  options?: TrackOptions
): TrackResult<"purchase"> {
  return track("purchase", payload, options);
}

export default track;
