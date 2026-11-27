"use client";

import React, { useId, useMemo, useState } from "react";
import type {
  Product,
  ProductVariant,
  SellingPlan,
} from "@/lib/contracts/catalog";
import type { Cart, CartProvider } from "@/lib/contracts/cart";
import { cartProvider as defaultCartProvider } from "@/lib/providers/client";
import { useMarket } from "@/lib/market/context";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import {
  formatFreeShippingLabel,
  getFreeShippingThreshold,
} from "@/lib/market/shipping";
import { Button } from "@/components/ui/button";

export interface PurchaseOptionsProps {
  product: Product;
  className?: string;
  cartProvider?: CartProvider;
  defaultPurchaseType?: "subscription" | "one-time";
  onAddToCartSuccess?: (cart: Cart) => void;
}

export function PurchaseOptions({
  product,
  className = "",
  cartProvider = defaultCartProvider,
  defaultPurchaseType = "subscription",
  onAddToCartSuccess,
}: PurchaseOptionsProps) {
  const componentId = useId();
  const { market } = useMarket();
  const freeShippingThreshold = getFreeShippingThreshold(market, product.line);
  const freeShippingLabel = formatFreeShippingLabel(market, product.line);
  const [purchaseType, setPurchaseType] = useState<"subscription" | "one-time">(
    defaultPurchaseType
  );

  // Default to 2 jars variant if available, otherwise first variant
  const defaultVariant = useMemo(() => {
    return (
      product.variants.find((v) => v.jars === 2) || product.variants[0] || null
    );
  }, [product.variants]);

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    defaultVariant?.id ?? ""
  );

  // Default to 60 days plan if available, otherwise first plan
  const defaultSellingPlan = useMemo(() => {
    return (
      product.sellingPlans.find((p) => p.intervalDays === 60) ||
      product.sellingPlans[0] ||
      null
    );
  }, [product.sellingPlans]);

  const [selectedSellingPlanId, setSelectedSellingPlanId] = useState<string>(
    defaultSellingPlan?.id ?? ""
  );

  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currencyCode = product.variants[0]?.price.currencyCode ?? "USD";

  // Map variants by jars
  const variant1 = product.variants.find((v) => v.jars === 1);
  const variant2 = product.variants.find((v) => v.jars === 2);
  const variant3 = product.variants.find((v) => v.jars === 3);

  // Find the selected variant object
  const selectedVariant: ProductVariant | undefined = useMemo(() => {
    return (
      product.variants.find((v) => v.id === selectedVariantId) ||
      product.variants[0]
    );
  }, [product.variants, selectedVariantId]);

  // Find the selected selling plan object
  const selectedSellingPlan: SellingPlan | undefined = useMemo(() => {
    return (
      product.sellingPlans.find((sp) => sp.id === selectedSellingPlanId) ||
      product.sellingPlans[0]
    );
  }, [product.sellingPlans, selectedSellingPlanId]);

  // Calculate pricing
  const currentPriceAmount = useMemo(() => {
    if (!selectedVariant) return 0;
    const basePrice = selectedVariant.price.amount;
    if (purchaseType === "subscription" && selectedSellingPlan) {
      const discount = (100 - selectedSellingPlan.discountPercentage) / 100;
      return Number((basePrice * discount).toFixed(2));
    }
    return basePrice;
  }, [selectedVariant, purchaseType, selectedSellingPlan]);

  const formattedTotalPrice = formatMoneyWithMarket(
    { amount: currentPriceAmount, currencyCode },
    market
  );

  const shopPayQuarterAmount = Math.round((currentPriceAmount / 4) * 100) / 100;
  const formattedQuarterPrice = formatMoneyWithMarket(
    { amount: shopPayQuarterAmount, currencyCode },
    market
  );

  const discountRate = selectedSellingPlan?.discountPercentage ?? 15;
  const isPet = product.line === "pet";
  const isEquine = product.species === "horse";

  // Handle jar selection update
  const handleSelectJarVariant = (variant: ProductVariant) => {
    setSelectedVariantId(variant.id);
    // Align selling plan with jar count if corresponding plan exists
    if (variant.jars === 1) {
      const plan30 = product.sellingPlans.find((p) => p.intervalDays === 30);
      if (plan30) setSelectedSellingPlanId(plan30.id);
    } else if (variant.jars === 2) {
      const plan60 = product.sellingPlans.find((p) => p.intervalDays === 60);
      if (plan60) setSelectedSellingPlanId(plan60.id);
    } else if (variant.jars === 3) {
      const plan90 = product.sellingPlans.find((p) => p.intervalDays === 90);
      if (plan90) setSelectedSellingPlanId(plan90.id);
    }
  };

  // Handle plan selection update
  const handleSelectPlan = (plan: SellingPlan) => {
    setSelectedSellingPlanId(plan.id);
    // Align variant with plan interval
    if (plan.intervalDays === 30 && variant1) {
      setSelectedVariantId(variant1.id);
    } else if (plan.intervalDays === 60 && variant2) {
      setSelectedVariantId(variant2.id);
    } else if (plan.intervalDays === 90 && variant3) {
      setSelectedVariantId(variant3.id);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    setFeedback(null);
    try {
      const updatedCart = await cartProvider.addLines([
        {
          variantId: selectedVariant.id,
          quantity: 1,
          sellingPlanId:
            purchaseType === "subscription" ? selectedSellingPlanId : null,
        },
      ]);
      setFeedback(
        `Added ${selectedVariant.title} (${
          purchaseType === "subscription" ? "Subscription" : "One-time"
        }) to cart`
      );
      if (onAddToCartSuccess) {
        onAddToCartSuccess(updatedCart);
      }
      setTimeout(() => setFeedback(null), 3500);
    } catch {
      setFeedback("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className={`rounded-card border border-border bg-bg-elevated p-5 sm:p-6 text-fg shadow-card ${className}`}
    >
      {/* Pet Compliance note */}
      {isPet && (
        <div
          className="mb-4 rounded-field border border-border bg-bg p-2.5 text-xs font-semibold text-accent"
          role="note"
        >
          For animal use only. Keep out of reach of children.
          {isEquine && (
            <span className="block mt-0.5">
              Equine products: not for horses intended for food.
            </span>
          )}
        </div>
      )}

      {/* Main purchase type fieldset */}
      <fieldset className="space-y-3 border-none p-0 m-0">
        <legend className="sr-only">Purchase options</legend>

        {/* Subscribe & Save Box */}
        <div
          className={`rounded-card border-2 transition-all p-4 ${
            purchaseType === "subscription"
              ? "border-accent bg-bg/80"
              : "border-border/60 bg-transparent hover:border-border"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor={`${componentId}-purchase-type-subscription`}
              className="flex items-center gap-3 cursor-pointer min-h-11 py-1"
            >
              <input
                type="radio"
                id={`${componentId}-purchase-type-subscription`}
                name={`${componentId}-purchase-type`}
                value="subscription"
                checked={purchaseType === "subscription"}
                onChange={() => setPurchaseType("subscription")}
                className="h-5 w-5 accent-accent focus-visible:ring-2 focus-visible:ring-accent"
              />
              <span className="text-base font-extrabold uppercase tracking-wide text-fg">
                Subscribe &amp; save {discountRate}%
              </span>
            </label>

            <span className="label inline-flex items-center rounded-pill bg-accent/15 px-2.5 py-1 text-[11px] font-bold text-accent">
              FREE SHIPPING EVERY DELIVERY
            </span>
          </div>

          {/* Subscription Plans List */}
          {purchaseType === "subscription" &&
            product.sellingPlans.length > 0 && (
              <div className="mt-4 pl-0 sm:pl-8 space-y-2">
                <fieldset className="space-y-2 border-none p-0 m-0">
                  <legend className="sr-only">Delivery frequency</legend>

                  {product.sellingPlans.map((plan) => {
                    const correspondingVariant =
                      plan.intervalDays === 30
                        ? variant1
                        : plan.intervalDays === 60
                          ? variant2
                          : variant3;

                    const rawAmount =
                      correspondingVariant?.price.amount ??
                      selectedVariant?.price.amount ??
                      0;
                    const discountedAmount = Number(
                      (
                        (rawAmount * (100 - plan.discountPercentage)) /
                        100
                      ).toFixed(2)
                    );
                    const isRecommended = plan.intervalDays === 60;
                    const isSelected = selectedSellingPlanId === plan.id;

                    const planSubtitle =
                      plan.intervalDays === 30
                        ? product.servingsPerJar
                          ? `${product.servingsPerJar} servings · 30 days`
                          : "30 days"
                        : plan.intervalDays === 60
                          ? "Recommended: fewer deliveries, same discount"
                          : "Stock up for the quarter";

                    return (
                      <label
                        key={plan.id}
                        htmlFor={`${componentId}-plan-${plan.id}`}
                        className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-field border p-3 transition-colors ${
                          isSelected
                            ? "border-accent bg-bg-elevated"
                            : "border-border/60 bg-transparent hover:border-border"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            id={`${componentId}-plan-${plan.id}`}
                            name={`${componentId}-selling-plan`}
                            value={plan.id}
                            checked={isSelected}
                            onChange={() => handleSelectPlan(plan)}
                            className="h-4 w-4 accent-accent focus-visible:ring-2 focus-visible:ring-accent"
                          />
                          <div>
                            <div className="text-sm font-bold text-fg flex items-center gap-2 flex-wrap">
                              <span>
                                {plan.intervalDays === 30
                                  ? "1 jar every 30 days"
                                  : plan.intervalDays === 60
                                    ? "2 jars every 60 days"
                                    : "3 jars every 90 days"}
                              </span>
                              {isRecommended && (
                                <span className="label rounded-pill bg-gradient-gold text-accent-fg px-2 py-0.5 text-[10px] font-extrabold tracking-wider">
                                  RECOMMENDED
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-fg-muted mt-0.5">
                              {planSubtitle}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-extrabold text-sm text-fg">
                            {formatMoneyWithMarket(
                              { amount: discountedAmount, currencyCode },
                              market
                            )}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </fieldset>

                <p className="text-[11px] text-fg-muted pt-2 leading-relaxed">
                  Skip, pause or cancel anytime from your account. One code per
                  order.
                </p>
              </div>
            )}
        </div>

        {/* One-time Purchase Box */}
        <div
          className={`rounded-card border-2 transition-all p-4 ${
            purchaseType === "one-time"
              ? "border-accent bg-bg/80"
              : "border-border/60 bg-transparent hover:border-border"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor={`${componentId}-purchase-type-onetime`}
              className="flex items-center gap-3 cursor-pointer min-h-11 py-1"
            >
              <input
                type="radio"
                id={`${componentId}-purchase-type-onetime`}
                name={`${componentId}-purchase-type`}
                value="one-time"
                checked={purchaseType === "one-time"}
                onChange={() => setPurchaseType("one-time")}
                className="h-5 w-5 accent-accent focus-visible:ring-2 focus-visible:ring-accent"
              />
              <span className="text-base font-extrabold uppercase tracking-wide text-fg">
                One-time purchase
              </span>
            </label>
          </div>

          {/* Jars selector (1, 2, 3 jars) */}
          <div className="mt-4">
            <fieldset className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-none p-0 m-0">
              <legend className="sr-only">Choose quantity of jars</legend>

              {product.variants.map((variant) => {
                const isSelected = selectedVariantId === variant.id;
                const unitPrice = Number(
                  (variant.price.amount / variant.jars).toFixed(2)
                );
                const singleJarPrice =
                  variant1?.price.amount ?? variant.price.amount;
                const expectedTotal = singleJarPrice * variant.jars;
                const savingsAmount = expectedTotal - variant.price.amount;
                const isPopular = variant.jars === 2;
                const shippingText =
                  freeShippingThreshold && freeShippingLabel
                    ? variant.price.amount >= freeShippingThreshold.amount
                      ? "Free shipping"
                      : freeShippingLabel
                    : null;

                return (
                  <label
                    key={variant.id}
                    htmlFor={`${componentId}-variant-${variant.id}`}
                    className={`relative flex min-h-11 cursor-pointer flex-col justify-between rounded-field border p-3.5 text-center transition-all ${
                      isSelected
                        ? "border-accent bg-bg-elevated shadow-sm ring-1 ring-accent"
                        : "border-border/60 bg-transparent hover:border-border"
                    }`}
                  >
                    {isPopular && (
                      <span className="label absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-pill bg-gradient-gold text-accent-fg px-2 py-0.5 text-[10px] font-extrabold tracking-wider shadow-xs">
                        Most popular
                      </span>
                    )}

                    <div className="flex items-center justify-center gap-1.5 mb-1.5">
                      <input
                        type="radio"
                        id={`${componentId}-variant-${variant.id}`}
                        name={`${componentId}-variant-radio`}
                        value={variant.id}
                        checked={isSelected}
                        onChange={() => {
                          handleSelectJarVariant(variant);
                          if (purchaseType !== "one-time") {
                            setPurchaseType("one-time");
                          }
                        }}
                        className="h-4 w-4 accent-accent focus-visible:ring-2 focus-visible:ring-accent"
                      />
                      <span className="text-sm font-extrabold text-fg">
                        {variant.jars} {variant.jars === 1 ? "jar" : "jars"}
                      </span>
                    </div>

                    <div className="text-lg font-extrabold text-fg my-1">
                      {formatMoneyWithMarket(variant.price, market)}
                    </div>

                    <div className="text-[11px] text-fg-muted">
                      {formatMoneyWithMarket(
                        { amount: unitPrice, currencyCode },
                        market
                      )}{" "}
                      / jar
                    </div>

                    <div className="min-h-4 text-[11px] font-bold text-accent mt-1">
                      {savingsAmount > 0
                        ? `Save ${formatMoneyWithMarket(
                            { amount: savingsAmount, currencyCode },
                            market
                          )}`
                        : ""}
                    </div>

                    {shippingText && (
                      <div className="text-[10px] font-medium text-fg-muted/80 mt-1">
                        {shippingText}
                      </div>
                    )}
                  </label>
                );
              })}
            </fieldset>
          </div>
        </div>
      </fieldset>

      {/* Primary Action Button: Add to Cart */}
      <div className="mt-5">
        <Button
          type="button"
          variant="primary"
          size="lg"
          isLoading={isAdding}
          loadingText="Adding to cart..."
          onClick={handleAddToCart}
          className="w-full"
          aria-label={`Add to cart · ${formattedTotalPrice}`}
        >
          Add to cart · {formattedTotalPrice}
        </Button>

        {/* Shop Pay Installments Breakdown */}
        <p className="mt-2.5 text-center text-xs text-fg-muted">
          or 4 interest-free payments of {formattedQuarterPrice} with Shop Pay
        </p>

        {/* Guarantee Banner */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-fg-muted">
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full border border-accent text-[11px] font-bold text-accent"
            aria-hidden="true"
          >
            ✓
          </span>
          <span>
            <strong className="text-fg">60-day money-back guarantee.</strong>{" "}
            Love it or get a full refund.
          </span>
        </div>

        {/* Live feedback for screen readers and UI notification */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="min-h-5 text-center text-xs font-semibold text-accent mt-2"
        >
          {feedback}
        </div>
      </div>
    </div>
  );
}
