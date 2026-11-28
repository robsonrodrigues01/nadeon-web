import React from "react";
import { Button } from "@/components/ui/button";

interface ShopifyOrderStatusNoticeProps {
  signInHref: string;
}

/**
 * Live replacement for the guest order lookup form: tracking for guests lives
 * on the Shopify order status page, reached from the confirmation email.
 */
export function ShopifyOrderStatusNotice({
  signInHref,
}: ShopifyOrderStatusNoticeProps) {
  return (
    <div className="flex flex-col gap-4 text-sm text-fg-muted">
      <p>
        Open the order confirmation email from Nadeon Labs and select{" "}
        <strong className="text-fg">View your order</strong>. That link opens
        your order status page on Shopify with tracking and the latest shipping
        updates.
      </p>
      <p>Have an account? Sign in to see all your orders in one place.</p>
      <div>
        <Button href={signInHref} variant="primary" size="lg">
          Sign in to see your orders
        </Button>
      </div>
    </div>
  );
}
