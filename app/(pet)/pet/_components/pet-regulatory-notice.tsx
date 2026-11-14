import React from "react";
import { Claim } from "@/components/commerce/product-card/claim";

export function PetRegulatoryNotice() {
  return (
    <aside
      className="w-full bg-bg text-fg py-6 border-b border-border text-xs text-fg-muted"
      aria-label="Pet regulatory information"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center space-y-1">
        <p>
          <Claim showDisclaimer>
            *These statements have not been evaluated by the Food and Drug
            Administration. This product is not intended to diagnose, treat,
            cure or prevent any disease.
          </Claim>
        </p>
        <p className="font-medium text-fg">
          For animal use only. Equine products: not for horses intended for
          food.
        </p>
      </div>
    </aside>
  );
}
