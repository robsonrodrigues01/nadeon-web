export interface ShopifyTrackingConsent {
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  sale_of_data: boolean;
  headlessStorefront?: boolean;
  checkoutRootDomain?: string;
  storefrontRootDomain?: string;
  storefrontAccessToken?: string;
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

export interface ShopifyMock {
  loadFeatures: (
    features: Array<{ name: string; version: string }>,
    callback: (error?: Error) => void
  ) => void;
  customerPrivacy?: ShopifyCustomerPrivacyMock;
  loadCalls: Array<Array<{ name: string; version: string }>>;
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
 * Creates a mock of window.Shopify with loadFeatures loader.
 * Simulates Shopify runtime where customerPrivacy is loaded via loadFeatures.
 */
export function createShopifyMock(): ShopifyMock {
  const privacyMock = createShopifyCustomerPrivacyMock();
  const loadCalls: Array<Array<{ name: string; version: string }>> = [];

  const mock: ShopifyMock = {
    loadCalls,
    loadFeatures: (features, callback) => {
      loadCalls.push(features);
      mock.customerPrivacy = privacyMock;
      callback();
    },
    reset: () => {
      loadCalls.length = 0;
      delete mock.customerPrivacy;
      privacyMock.reset();
    },
  };

  return mock;
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
 * Loads Shopify Customer Privacy API using window.Shopify.loadFeatures.
 * When the feature finishes loading, executes the onReady callback.
 */
export function initShopifyCustomerPrivacy(
  onReady?: (customerPrivacy: ShopifyCustomerPrivacy) => void,
  onError?: (error?: Error) => void
): void {
  if (!isShopifyCustomerPrivacyEnabled() || typeof window === "undefined") {
    return;
  }

  const shopifyWindow = window as Window & {
    Shopify?: {
      loadFeatures?: (
        features: Array<{ name: string; version: string }>,
        callback: (error?: Error) => void
      ) => void;
      customerPrivacy?: ShopifyCustomerPrivacy;
    };
  };

  if (shopifyWindow.Shopify?.customerPrivacy) {
    onReady?.(shopifyWindow.Shopify.customerPrivacy);
    return;
  }

  if (typeof shopifyWindow.Shopify?.loadFeatures === "function") {
    try {
      shopifyWindow.Shopify.loadFeatures(
        [
          {
            name: "consent-tracking-api",
            version: "0.2",
          },
        ],
        (error?: Error) => {
          if (error) {
            console.error("Failed to load Shopify Customer Privacy API");
            onError?.(error);
            return;
          }
          if (shopifyWindow.Shopify?.customerPrivacy) {
            onReady?.(shopifyWindow.Shopify.customerPrivacy);
          } else {
            console.error("Shopify Customer Privacy API was not available");
            onError?.();
          }
        }
      );
    } catch (err) {
      console.error("Failed to load Shopify Customer Privacy API");
      onError?.(err instanceof Error ? err : new Error(String(err)));
    }
  } else {
    console.error("Shopify.loadFeatures is not available");
    onError?.(new Error("Shopify.loadFeatures is not available"));
  }
}

/**
 * Synchronizes tracking consent with window.Shopify.customerPrivacy.
 * Initializes the API via loadFeatures if not already loaded.
 */
export function syncShopifyCustomerPrivacy(
  consent: {
    analytics: boolean;
    marketing: boolean;
  },
  callback?: (success: boolean) => void
): void {
  if (!isShopifyCustomerPrivacyEnabled() || typeof window === "undefined") {
    callback?.(true);
    return;
  }

  const shopifyWindow = window as Window & {
    Shopify?: {
      loadFeatures?: (
        features: Array<{ name: string; version: string }>,
        cb: (error?: Error) => void
      ) => void;
      customerPrivacy?: ShopifyCustomerPrivacy;
    };
  };

  const dispatch = (cp: ShopifyCustomerPrivacy) => {
    try {
      const payload: ShopifyTrackingConsent = {
        analytics: consent.analytics,
        marketing: consent.marketing,
        preferences: true,
        sale_of_data: consent.marketing,
        headlessStorefront: true,
      };

      if (process.env.NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN) {
        payload.checkoutRootDomain =
          process.env.NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN;
      }
      payload.storefrontRootDomain =
        process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_DOMAIN ||
        (typeof window !== "undefined" && window.location?.hostname
          ? window.location.hostname
          : "localhost");
      if (process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
        payload.storefrontAccessToken =
          process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
      }

      cp.setTrackingConsent(payload, () => {
        callback?.(true);
      });
    } catch {
      console.error("Failed to update Shopify tracking consent");
      callback?.(false);
    }
  };

  const customerPrivacy = shopifyWindow.Shopify?.customerPrivacy;
  if (typeof customerPrivacy?.setTrackingConsent === "function") {
    dispatch(customerPrivacy);
    return;
  }

  initShopifyCustomerPrivacy(
    (cp) => {
      dispatch(cp);
    },
    () => {
      callback?.(false);
    }
  );
}
