import {
  CONSENT_COOKIE_NAME,
  readCookie,
  parseConsentCookie,
  getCountryFromCookies,
  getDefaultConsent,
  isGpcEnabled,
} from "@/lib/consent";

/**
 * Checks whether analytics tracking is permitted under the current consent status.
 *
 * Rules:
 * 1. If an explicit or stored nadeon_consent cookie exists, respect its `analytics` preference.
 * 2. If no cookie exists:
 *    - US jurisdiction: opt-out default (analytics is true by default).
 *    - International jurisdiction: opt-in default (analytics is false until explicit consent).
 */
export function hasAnalyticsConsent(
  customCookieSource?: string | null
): boolean {
  // If in SSR without any cookie source, analytics does not track
  if (
    typeof document === "undefined" &&
    typeof window === "undefined" &&
    !customCookieSource
  ) {
    return false;
  }

  // 1. Check existing consent record from cookie
  const rawCookie = readCookie(CONSENT_COOKIE_NAME, customCookieSource);
  if (rawCookie) {
    const record = parseConsentCookie(rawCookie);
    if (record && record.preferences) {
      return Boolean(record.preferences.analytics);
    }
  }

  // 2. Default consent by jurisdiction
  const country = getCountryFromCookies(customCookieSource);
  const gpc = isGpcEnabled();
  const defaultPrefs = getDefaultConsent(country, gpc);

  return Boolean(defaultPrefs.analytics);
}
