"use client";

import React, { useId, useMemo, useState } from "react";
import type {
  Product,
  ProductVariant,
  SellingPlan,
} from "@/lib/contracts/catalog";
import type { ReviewSummary } from "@/lib/contracts/reviews";
import { cartProvider } from "@/lib/providers/client";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import type { Market } from "@/lib/market/types";
import { Button } from "@/components/ui/button";
import {
  Claim,
  FDA_DISCLAIMER,
} from "@/components/commerce/product-card/claim";

export interface PetPurchaseCardProps {
  product: Product;
  reviewSummary: ReviewSummary;
  market: Market;
  className?: string;
}

// Weight bands come from product.dosingByWeight. Jars per band is the store rule.
const JARS_BY_BAND = [1, 2, 3, 3];

function buildWeightBands(
  bands: { servingDescription: string; dose: string }[]
) {
  return bands.map((band, idx) => ({
    id: String(idx),
    label: band.servingDescription,
    doseText: `${band.dose} · we picked the plan that matches`,
    targetJars: JARS_BY_BAND[idx] ?? 3,
  }));
}

export function PetPurchaseCard({
  product,
  reviewSummary,
  market,
  className = "",
}: PetPurchaseCardProps) {
  const componentId = useId();
  const [purchaseType, setPurchaseType] = useState<"subscription" | "one-time">(
    "subscription"
  );
  const weightBands = buildWeightBands(product.dosingByWeight);

  // Default band: the second one (the 21 to 50 lbs band in the catalog)
  const [selectedWeightBandId, setSelectedWeightBandId] = useState<string>("1");

  const uniqueVariants = useMemo(() => {
    const seen = new Set<number>();
    const result: ProductVariant[] = [];
    for (const v of product.variants) {
      if (!seen.has(v.jars)) {
        seen.add(v.jars);
        result.push(v);
      }
    }
    return result.sort((a, b) => a.jars - b.jars);
  }, [product.variants]);

  const uniquePlans = useMemo(() => {
    const seen = new Set<number>();
    const result: SellingPlan[] = [];
    for (const p of product.sellingPlans) {
      if (!seen.has(p.intervalDays)) {
        seen.add(p.intervalDays);
        result.push(p);
      }
    }
    return result.sort((a, b) => a.intervalDays - b.intervalDays);
  }, [product.sellingPlans]);

  const defaultVariant = useMemo(() => {
    return (
      uniqueVariants.find((v) => v.jars === 2) || uniqueVariants[0] || null
    );
  }, [uniqueVariants]);

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    defaultVariant?.id ?? ""
  );

  const defaultSellingPlan = useMemo(() => {
    return (
      uniquePlans.find((p) => p.intervalDays === 60) || uniquePlans[0] || null
    );
  }, [uniquePlans]);

  const [selectedSellingPlanId, setSelectedSellingPlanId] = useState<string>(
    defaultSellingPlan?.id ?? ""
  );

  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Page only renders this card when the product has variants (see page.tsx)
  const currencyCode = product.variants[0].price.currencyCode;

  const selectedVariant: ProductVariant | undefined = useMemo(() => {
    return (
      product.variants.find((v) => v.id === selectedVariantId) ||
      product.variants[0]
    );
  }, [product.variants, selectedVariantId]);

  const selectedSellingPlan: SellingPlan | undefined = useMemo(() => {
    return (
      product.sellingPlans.find((sp) => sp.id === selectedSellingPlanId) ||
      product.sellingPlans[0]
    );
  }, [product.sellingPlans, selectedSellingPlanId]);

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

  // Undefined when the product has no 1-jar variant: no one-jar price is shown
  const singleJarOneTime = product.variants.find((v) => v.jars === 1);
  const singleJarBasePrice = singleJarOneTime?.price.amount;
  const subscriptionDiscount = selectedSellingPlan?.discountPercentage ?? 0;
  const singleJarSubPrice =
    singleJarBasePrice === undefined
      ? undefined
      : Number(
          (singleJarBasePrice * (1 - subscriptionDiscount / 100)).toFixed(2)
        );

  const isHorse = product.species === "horse";
  const weightLegend = isHorse
    ? "Your horse weighs"
    : product.species === "cat"
      ? "Your cat weighs"
      : "Your dog weighs";

  const activeWeightBand =
    weightBands.find((b) => b.id === selectedWeightBandId) ?? weightBands[1];

  const handleSelectWeight = (bandId: string) => {
    setSelectedWeightBandId(bandId);
    const band = weightBands.find((b) => b.id === bandId);
    if (!band) return;

    if (band.targetJars === 1) {
      const plan30 = product.sellingPlans.find((p) => p.intervalDays === 30);
      if (plan30) setSelectedSellingPlanId(plan30.id);
      const var1 = product.variants.find((v) => v.jars === 1);
      if (var1) setSelectedVariantId(var1.id);
    } else if (band.targetJars === 2) {
      const plan60 = product.sellingPlans.find((p) => p.intervalDays === 60);
      if (plan60) setSelectedSellingPlanId(plan60.id);
      const var2 = product.variants.find((v) => v.jars === 2);
      if (var2) setSelectedVariantId(var2.id);
    } else {
      const plan90 = product.sellingPlans.find((p) => p.intervalDays === 90);
      if (plan90) setSelectedSellingPlanId(plan90.id);
      const var3 = product.variants.find((v) => v.jars === 3);
      if (var3) setSelectedVariantId(var3.id);
    }
  };

  const handleSelectJarVariant = (variant: ProductVariant) => {
    setSelectedVariantId(variant.id);
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

  const handleSelectPlan = (plan: SellingPlan) => {
    setSelectedSellingPlanId(plan.id);
    const varMatch = product.variants.find(
      (v) =>
        (plan.intervalDays === 30 && v.jars === 1) ||
        (plan.intervalDays === 60 && v.jars === 2) ||
        (plan.intervalDays === 90 && v.jars === 3)
    );
    if (varMatch) {
      setSelectedVariantId(varMatch.id);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    setFeedback(null);
    try {
      await cartProvider.addLines([
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
      setTimeout(() => setFeedback(null), 3500);
    } catch {
      setFeedback("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={`flex min-w-0 flex-col gap-6 text-fg ${className}`}>
      {/* Top badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center rounded-pill bg-fg text-bg px-3 py-1 text-xs font-extrabold uppercase tracking-wider">
          {product.format}
        </span>
        <span className="inline-flex items-center rounded-pill bg-bg-elevated border border-border px-3 py-1 text-xs font-bold uppercase tracking-wider text-fg/80">
          Longevity
        </span>
      </div>

      {/* Title & subtitle */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-fg">
          {product.name}
        </h1>
        <p className="mt-2 text-sm sm:text-base font-medium text-fg/80">
          {product.technicalName} · {product.netWeight}
        </p>
      </div>

      {/* Reviews & Lab info row */}
      <div className="flex items-center gap-3 text-xs font-bold flex-wrap">
        <a
          href="#reviews"
          className="hover:underline flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-1"
        >
          <span className="opacity-60" aria-hidden="true">
            ☆☆☆☆☆
          </span>
          <span>
            {reviewSummary.totalReviews === 0
              ? "No reviews yet · be the first"
              : `${reviewSummary.totalReviews} reviews`}
          </span>
        </a>
        <span className="opacity-40" aria-hidden="true">
          |
        </span>
        <a
          href="#lab-report"
          className="text-fg/80 hover:text-fg hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-1"
        >
          first lots publishing soon
        </a>
      </div>

      {/* Price summary */}
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl sm:text-3xl font-extrabold text-fg">
          {singleJarBasePrice !== undefined &&
            formatMoneyWithMarket(
              { amount: singleJarBasePrice, currencyCode },
              market
            )}
        </span>
        <span className="text-sm font-bold text-fg/70">
          or{" "}
          <strong className="text-fg">
            {singleJarSubPrice !== undefined &&
              formatMoneyWithMarket(
                { amount: singleJarSubPrice, currencyCode },
                market
              )}
          </strong>{" "}
          with Subscribe &amp; Save
        </span>
      </div>

      {/* Key benefits list */}
      <ul className="space-y-2 border-y border-border/80 py-4 text-sm font-semibold text-fg/90">
        {product.benefits.map((benefit, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[11px] font-bold text-accent mt-0.5"
              aria-hidden="true"
            >
              ✓
            </span>
            <Claim showDisclaimer={false}>{benefit}</Claim>
          </li>
        ))}
      </ul>
      {product.benefits.length > 0 && (
        <p
          role="note"
          className="text-[11px] text-fg-muted leading-normal italic"
        >
          {FDA_DISCLAIMER}
        </p>
      )}

      {/* Link to supplement facts */}
      <div>
        <a
          href="#supplement-facts"
          className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-fg underline underline-offset-4 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-1 min-h-11"
        >
          See Supplement Facts
        </a>
      </div>

      {/* Purchase Configuration Card */}
      <div className="min-w-0 rounded-card border border-border bg-bg-elevated p-5 sm:p-6 shadow-card">
        {/* Animal regulatory note */}
        <div
          className="mb-4 rounded-field border border-border bg-bg p-3 text-xs font-semibold text-accent"
          role="note"
        >
          For animal use only.
          {isHorse && (
            <span className="block mt-0.5">
              Equine products: not for horses intended for food.
            </span>
          )}
        </div>

        {/* Purchase Mode Fieldset */}
        <fieldset className="min-w-0 space-y-4 border-none p-0 m-0">
          <legend className="sr-only">Purchase options</legend>

          {/* Option A: Subscribe & Save */}
          <div
            className={`rounded-card border-2 transition-all p-4 ${
              purchaseType === "subscription"
                ? "border-accent bg-bg/60"
                : "border-border/60 bg-transparent hover:border-border"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor={`${componentId}-type-sub`}
                className="flex items-center gap-3 cursor-pointer min-h-11 py-1"
              >
                <input
                  type="radio"
                  id={`${componentId}-type-sub`}
                  name={`${componentId}-purchase-mode`}
                  value="subscription"
                  checked={purchaseType === "subscription"}
                  onChange={() => setPurchaseType("subscription")}
                  className="h-5 w-5 accent-accent focus-visible:ring-2 focus-visible:ring-accent"
                />
                <span className="text-base font-extrabold uppercase tracking-wide text-fg">
                  Subscribe &amp; save{" "}
                  {selectedSellingPlan?.discountPercentage ?? 0}%
                </span>
              </label>

              <span className="inline-flex items-center rounded-pill bg-accent/20 px-2.5 py-1 text-[11px] font-bold text-accent">
                FREE SHIPPING EVERY DELIVERY
              </span>
            </div>

            {purchaseType === "subscription" && (
              <div className="mt-4 space-y-4">
                {/* Weight Selector */}
                <fieldset className="border-0 p-0 m-0 space-y-2">
                  <legend className="block text-xs font-bold uppercase tracking-wider text-fg/80 m-0 p-0">
                    {weightLegend}
                  </legend>

                  <div
                    role="radiogroup"
                    aria-label={weightLegend}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                  >
                    {weightBands.map((band) => {
                      const isBandActive = selectedWeightBandId === band.id;
                      const inputId = `${componentId}-weight-${band.id}`;

                      return (
                        <label
                          key={band.id}
                          htmlFor={inputId}
                          className={`min-h-11 flex items-center justify-center rounded-field border px-3 py-2 text-xs font-bold cursor-pointer transition-all text-center ${
                            isBandActive
                              ? "bg-fg text-bg border-fg shadow-sm"
                              : "bg-bg-elevated text-fg/80 border-border hover:border-fg/40 hover:text-fg"
                          }`}
                        >
                          <input
                            type="radio"
                            id={inputId}
                            name={`${componentId}-weight-radio`}
                            value={band.id}
                            checked={isBandActive}
                            onChange={() => handleSelectWeight(band.id)}
                            className="sr-only"
                          />
                          <span>{band.label}</span>
                        </label>
                      );
                    })}
                  </div>

                  <p className="text-xs text-accent font-semibold pt-1">
                    {activeWeightBand?.doseText}
                  </p>
                </fieldset>

                {/* Subscription Plans */}
                <fieldset className="space-y-2 border-0 p-0 m-0">
                  <legend className="sr-only">
                    Subscription delivery plan
                  </legend>

                  {uniquePlans.map((plan) => {
                    const isPlanSelected = selectedSellingPlanId === plan.id;
                    const correspondingVariant = product.variants.find(
                      (v) =>
                        (plan.intervalDays === 30 && v.jars === 1) ||
                        (plan.intervalDays === 60 && v.jars === 2) ||
                        (plan.intervalDays === 90 && v.jars === 3)
                    );
                    // No variant for this plan: no price, so the option is not shown
                    if (!correspondingVariant) return null;

                    const baseAmount = correspondingVariant.price.amount;
                    const discountedAmount = Number(
                      (
                        baseAmount *
                        (1 - plan.discountPercentage / 100)
                      ).toFixed(2)
                    );
                    const formattedPlanPrice = formatMoneyWithMarket(
                      { amount: discountedAmount, currencyCode },
                      market
                    );

                    const isRecommended = plan.intervalDays === 60;
                    const planRadioId = `${componentId}-plan-${plan.id}`;

                    let planSubtitle = product.netWeight;
                    if (plan.intervalDays === 60) {
                      planSubtitle = weightBands[1]
                        ? `Recommended for ${weightBands[1].label}`
                        : planSubtitle;
                    } else if (plan.intervalDays === 90) {
                      planSubtitle = "Best price per chew";
                    }

                    return (
                      <label
                        key={plan.id}
                        htmlFor={planRadioId}
                        className={`flex min-h-11 cursor-pointer items-center justify-between rounded-field border p-3.5 transition-all ${
                          isPlanSelected
                            ? "border-accent bg-bg-elevated shadow-sm ring-1 ring-accent"
                            : "border-border/60 bg-transparent hover:border-border"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            id={planRadioId}
                            name={`${componentId}-plan-radio`}
                            value={plan.id}
                            checked={isPlanSelected}
                            onChange={() => handleSelectPlan(plan)}
                            className="h-4 w-4 accent-accent focus-visible:ring-2 focus-visible:ring-accent"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-extrabold text-fg">
                                {plan.intervalDays === 30
                                  ? "1 jar every 30 days"
                                  : plan.intervalDays === 60
                                    ? "2 jars every 60 days"
                                    : "3 jars every 90 days"}
                              </span>
                              {isRecommended && (
                                <span className="rounded-pill bg-gradient-gold text-accent-fg px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase">
                                  RECOMMENDED
                                </span>
                              )}
                            </div>
                            <span className="block text-xs text-fg-muted mt-0.5">
                              {planSubtitle}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-extrabold text-fg">
                            {formattedPlanPrice}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </fieldset>

                <p className="text-[11px] text-fg-muted">
                  Skip, pause or cancel anytime from your account. One code per
                  order.
                </p>
              </div>
            )}
          </div>

          {/* Option B: One-time Purchase */}
          <div
            className={`rounded-card border-2 transition-all p-4 ${
              purchaseType === "one-time"
                ? "border-accent bg-bg/60"
                : "border-border/60 bg-transparent hover:border-border"
            }`}
          >
            <label
              htmlFor={`${componentId}-type-onetime`}
              className="flex items-center gap-3 cursor-pointer min-h-11 py-1"
            >
              <input
                type="radio"
                id={`${componentId}-type-onetime`}
                name={`${componentId}-purchase-mode`}
                value="one-time"
                checked={purchaseType === "one-time"}
                onChange={() => setPurchaseType("one-time")}
                className="h-5 w-5 accent-accent focus-visible:ring-2 focus-visible:ring-accent"
              />
              <span className="text-base font-extrabold uppercase tracking-wide text-fg">
                One-time purchase
              </span>
            </label>

            {purchaseType === "one-time" && (
              <div className="mt-4">
                <fieldset className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 border-0 p-0 m-0">
                  <legend className="sr-only">Choose jar quantity</legend>

                  {uniqueVariants.map((variant) => {
                    const isVariantActive = selectedVariantId === variant.id;
                    const variantRadioId = `${componentId}-var-${variant.id}`;
                    const unitPrice = Number(
                      (variant.price.amount / variant.jars).toFixed(2)
                    );
                    const expectedTotal =
                      singleJarBasePrice === undefined
                        ? undefined
                        : singleJarBasePrice * variant.jars;
                    const savings =
                      expectedTotal === undefined
                        ? 0
                        : expectedTotal - variant.price.amount;
                    const isPopular = variant.jars === 2;

                    return (
                      <label
                        key={variant.id}
                        htmlFor={variantRadioId}
                        className={`relative flex min-h-11 cursor-pointer flex-col justify-between rounded-field border p-3.5 text-center transition-all ${
                          isVariantActive
                            ? "border-accent bg-bg-elevated shadow-sm ring-1 ring-accent"
                            : "border-border/60 bg-transparent hover:border-border"
                        }`}
                      >
                        {isPopular && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-pill bg-gradient-gold text-accent-fg px-2 py-0.5 text-[10px] font-extrabold tracking-wider">
                            Most popular
                          </span>
                        )}

                        <div className="flex items-center justify-center gap-1.5 mb-1.5">
                          <input
                            type="radio"
                            id={variantRadioId}
                            name={`${componentId}-variant-radio`}
                            value={variant.id}
                            checked={isVariantActive}
                            onChange={() => handleSelectJarVariant(variant)}
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
                          {savings > 0
                            ? `Save ${formatMoneyWithMarket(
                                { amount: savings, currencyCode },
                                market
                              )}`
                            : ""}
                        </div>
                      </label>
                    );
                  })}
                </fieldset>
              </div>
            )}
          </div>
        </fieldset>

        {/* Primary Action Button */}
        <div className="mt-5">
          <Button
            type="button"
            variant="primary"
            size="lg"
            isLoading={isAdding}
            loadingText="Adding to cart..."
            onClick={handleAddToCart}
            className="w-full min-h-11"
            aria-label={`Add to cart · ${formattedTotalPrice}`}
          >
            Add to cart · {formattedTotalPrice}
          </Button>

          <p className="mt-2.5 text-center text-xs text-fg-muted">
            or 4 interest-free payments of {formattedQuarterPrice} with Shop Pay
          </p>

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

          <div
            aria-live="polite"
            aria-atomic="true"
            className="min-h-5 text-center text-xs font-semibold text-accent mt-2"
          >
            {feedback}
          </div>
        </div>

        {/* Trust Badges Strip */}
        <div className="mt-5 pt-4 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] font-bold text-fg/80">
          <div className="py-1">60-day guarantee</div>
          <div className="py-1">Vet-reviewed</div>
          <div className="py-1">Tested every lot</div>
        </div>
      </div>
    </div>
  );
}
