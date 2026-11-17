export interface ShopifyTrackingConsent {
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  sale_of_data: boolean;
}

export interface ShopifyCustomerPrivacy {
  setTrackingConsent: (
    consent: boolean | ShopifyTrackingConsent,
    callback?: () => void
  ) => void;
  getTrackingConsent?: () => "yes" | "no" | "partial" | "pending" | "unknown";
  userCanBeTracked?: () => boolean;
}

export interface ShopifyCustomerPrivacyMock extends ShopifyCustomerPrivacy {
  currentConsent: ShopifyTrackingConsent | boolean | null;
  history: Array<ShopifyTrackingConsent | boolean>;
  reset: () => void;
}

/**
 * Creates an in-memory mock of window.Shopify.customerPrivacy.
 * Used for tests and local development environments.
 */
export function createShopifyCustomerPrivacyMock(
  initialConsent: ShopifyTrackingConsent | boolean | null = null
): ShopifyCustomerPrivacyMock {
  let current = initialConsent;
  const history: Array<ShopifyTrackingConsent | boolean> = [];

  return {
    get currentConsent() {
      return current;
    },
    history,
    setTrackingConsent: (consent, callback) => {
      current = consent;
      history.push(consent);
      callback?.();
    },
    getTrackingConsent: () => {
      if (current === true) return "yes";
      if (current === false) return "no";
      if (typeof current === "object" && current !== null) {
        if (current.analytics && current.marketing) return "yes";
        if (!current.analytics && !current.marketing) return "no";
        return "partial";
      }
      return "pending";
    },
    userCanBeTracked: () => {
      if (current === true) return true;
      if (typeof current === "object" && current !== null) {
        return Boolean(current.analytics || current.marketing);
      }
      return false;
    },
    reset: () => {
      current = null;
      history.length = 0;
    },
  };
}

/**
 * Checks if the Shopify Customer Privacy API integration is enabled via environment variable.
 * Without the variable (e.g. undefined, "false", "0"), returns false.
 */
export function isShopifyCustomerPrivacyEnabled(): boolean {
  const envValue =
    process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_PRIVACY ||
    process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_PRIVACY_ENABLED;
  return Boolean(
    envValue &&
    envValue !== "false" &&
    envValue !== "0" &&
    envValue.trim() !== ""
  );
}

/**
 * Synchronizes tracking consent with window.Shopify.customerPrivacy when enabled.
 */
export function syncShopifyCustomerPrivacy(consent: {
  analytics: boolean;
  marketing: boolean;
}): void {
  if (!isShopifyCustomerPrivacyEnabled() || typeof window === "undefined") {
    return;
  }

  const shopifyWindow = window as Window & {
    Shopify?: {
      customerPrivacy?: {
        setTrackingConsent?: (
          consent: ShopifyTrackingConsent,
          callback?: () => void
        ) => void;
      };
    };
  };

  const customerPrivacy = shopifyWindow.Shopify?.customerPrivacy;
  if (typeof customerPrivacy?.setTrackingConsent === "function") {
    try {
      customerPrivacy.setTrackingConsent(
        {
          analytics: consent.analytics,
          marketing: consent.marketing,
          preferences: true,
          sale_of_data: consent.marketing,
        },
        () => {}
      );
    } catch {
      // Defensive fallback
    }
  }
}
