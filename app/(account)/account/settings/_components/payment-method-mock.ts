import type { SavedPaymentMethod } from "./payment-method";

// Mock payment method corresponding to the design board example.
// Stored in mock data instead of fixed in JSX per project rules.
export const MOCK_PAYMENT_METHOD: SavedPaymentMethod = {
  brand: "VISA",
  last4: "4242",
  expiry: "08/28",
  subscriptionCount: 2,
};
