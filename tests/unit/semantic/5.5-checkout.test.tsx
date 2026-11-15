// @vitest-environment jsdom
import { describe, it } from "vitest";

describe("5.5 Semantic Elements: Checkout, obrigado e e-mails", () => {
  describe("Checkout (`checkout.nadeon.com` / Shopify Hosted)", () => {
    it.todo(
      "Checkout is hosted on Shopify Checkout (`checkout.nadeon.com`); fields (Email, Email me with news, Country, Name, Address, City, State, ZIP, Phone, Shipping method, Card details, Billing address) and buttons (Pay, Apply, PayPal, Shop Pay) are rendered and managed by Shopify"
    );
  });

  describe("Thank you / Order Status (`checkout.nadeon.com/order-status`)", () => {
    it.todo(
      "Thank you page is hosted on Shopify Checkout Order Status; post-purchase survey, Create account, Shop Nadeon Pet cross-sell, and Continue shopping are handled by Shopify Order Status scripts/apps"
    );
  });

  describe("Order Confirmation Email (Klaviyo / Shopify Notifications)", () => {
    it.todo(
      "Order confirmation email is rendered in Klaviyo/Shopify transactional email templates with buttons: 'View your order', 'Manage subscription', 'or visit our store', 'Unsubscribe'"
    );
  });

  describe("Shipping Confirmation Email (Klaviyo / Shopify Notifications)", () => {
    it.todo(
      "Shipping confirmation email is rendered in Klaviyo/Shopify transactional email templates with timeline (Ordered, Shipped, Out for delivery, Delivered) and buttons: 'Track package', 'Unsubscribe'"
    );
  });
});
