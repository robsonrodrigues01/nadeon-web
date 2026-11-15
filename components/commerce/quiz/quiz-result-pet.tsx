"use client";

import React, { useState, useId } from "react";
import type {
  QuizDefinition,
  QuizAnswers,
  QuizRecommendationResult,
} from "@/lib/quiz";
import type { Product, Kit } from "@/lib/contracts/catalog";
import { cartProvider as defaultCartProvider } from "@/lib/providers/client";
import { subscribeNewsletter } from "@/components/brand/newsletter/actions";
import { Button } from "@/components/ui/button";
import { Claim } from "@/components/commerce/product-card/claim";
import { useMarket } from "@/lib/market";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import { formatFreeShippingLabel } from "@/lib/market/shipping";
import { Check, RotateCcw, Sun, Moon, AlertCircle } from "lucide-react";

export interface QuizResultPetProps {
  quiz: QuizDefinition;
  answers: QuizAnswers;
  recommendation: QuizRecommendationResult;
  productsMap?: Record<string, Product>;
  kitsMap?: Record<string, Kit>;
  onRetake: () => void;
  onEditAnswers: () => void;
  locale?: string;
  className?: string;
}

export function QuizResultPet({
  quiz,
  answers,
  recommendation,
  productsMap = {},
  kitsMap = {},
  onRetake,
  onEditAnswers,
  className = "",
}: QuizResultPetProps) {
  const componentId = useId();
  const { market } = useMarket();

  const petName = (answers.petName as string) || "your pet";
  const weightLbs = Number(answers.weightLbs || 35);
  const ageGroup = (answers.ageGroup as string) || "senior";
  const species = quiz.species || "dog";
  const isHorse = species === "horse";

  const kit = recommendation.recommendedKitSlug
    ? kitsMap[recommendation.recommendedKitSlug]
    : undefined;

  const primaryProduct = recommendation.recommendedProductSlug
    ? productsMap[recommendation.recommendedProductSlug]
    : undefined;

  const secondaryProduct = recommendation.secondaryProductSlug
    ? productsMap[recommendation.secondaryProductSlug]
    : undefined;

  const dosing = recommendation.dosing;

  // Base pricing from recommended kit or product
  const baseMoney = kit ? kit.price : primaryProduct?.variants[0]?.price;

  // Selling plan discount from recommended product only
  const productForPlans =
    primaryProduct ??
    (kit?.products?.[0]?.productSlug
      ? productsMap[kit.products[0].productSlug]
      : undefined);

  const sellingPlan =
    productForPlans?.sellingPlans?.find((sp) => sp.intervalDays === 30) ??
    productForPlans?.sellingPlans?.[0];

  const hasSellingPlan = Boolean(sellingPlan?.id);
  const discountPercentage = hasSellingPlan
    ? (sellingPlan?.discountPercentage ?? 0)
    : 0;

  const [selectedPurchaseType, setSelectedPurchaseType] = useState<
    "subscription" | "one-time"
  >(hasSellingPlan ? "subscription" : "one-time");

  // Force one-time when no valid selling plan exists in catalog
  const purchaseType = hasSellingPlan ? selectedPurchaseType : "one-time";

  const [isAdding, setIsAdding] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  // Email form state
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [emailMessage, setEmailMessage] = useState("");

  // Desconto SÓ de sellingPlans (nada de compareAtPrice como desconto)
  let discountAmount = 0;
  if (baseMoney && hasSellingPlan && discountPercentage > 0) {
    discountAmount =
      Math.round(((baseMoney.amount * discountPercentage) / 100) * 100) / 100;
  }

  const oneTimeAmount = baseMoney ? baseMoney.amount : null;
  const subscriptionAmount =
    baseMoney && hasSellingPlan && discountPercentage > 0
      ? Math.max(0, Math.round((baseMoney.amount - discountAmount) * 100) / 100)
      : null;
  const yearlySavingsAmount =
    hasSellingPlan && discountAmount > 0
      ? Math.round(discountAmount * 12 * 100) / 100
      : 0;

  // Formatted prices using useMarket() and formatMoneyWithMarket
  const formattedOneTimePrice =
    baseMoney && oneTimeAmount !== null
      ? formatMoneyWithMarket(
          { amount: oneTimeAmount, currencyCode: baseMoney.currencyCode },
          market
        )
      : "To be confirmed";

  const formattedSubscriptionPrice =
    baseMoney && hasSellingPlan && subscriptionAmount !== null
      ? formatMoneyWithMarket(
          {
            amount: subscriptionAmount,
            currencyCode: baseMoney.currencyCode,
          },
          market
        )
      : "To be confirmed";

  const formattedActivePrice =
    purchaseType === "subscription" && hasSellingPlan
      ? formattedSubscriptionPrice
      : formattedOneTimePrice;

  const formattedDiscount =
    baseMoney && hasSellingPlan && discountAmount > 0
      ? formatMoneyWithMarket(
          {
            amount: discountAmount,
            currencyCode: baseMoney.currencyCode,
          },
          market
        )
      : "To be confirmed";

  const formattedYearlySavings =
    baseMoney && hasSellingPlan && yearlySavingsAmount > 0
      ? formatMoneyWithMarket(
          {
            amount: yearlySavingsAmount,
            currencyCode: baseMoney.currencyCode,
          },
          market
        )
      : "To be confirmed";

  const primaryProductPrice = primaryProduct?.variants[0]?.price
    ? formatMoneyWithMarket(primaryProduct.variants[0].price, market)
    : "To be confirmed";

  const secondaryProductPrice = secondaryProduct?.variants[0]?.price
    ? formatMoneyWithMarket(secondaryProduct.variants[0].price, market)
    : "To be confirmed";

  // Frete: só formatFreeShippingLabel, sem 'Free' fixo
  const freeShippingLabel = formatFreeShippingLabel(market, "pet");

  const handleAddToCart = async () => {
    if (!baseMoney) return;
    setIsAdding(true);
    setCartSuccess(false);
    try {
      const activeSellingPlanId =
        purchaseType === "subscription" && hasSellingPlan && sellingPlan?.id
          ? sellingPlan.id
          : null;

      if (kit && kit.products.length > 0) {
        const lines = kit.products.map((p) => ({
          variantId: `${p.productSlug}-var-1`,
          quantity: p.quantity,
          sellingPlanId: activeSellingPlanId,
        }));
        await defaultCartProvider.addLines(lines);
      } else if (primaryProduct) {
        const variantId =
          primaryProduct.variants[0]?.id || `${primaryProduct.slug}-var-1`;
        await defaultCartProvider.addLines([
          {
            variantId,
            quantity: 1,
            sellingPlanId: activeSellingPlanId,
          },
        ]);
      }
      setCartSuccess(true);
    } catch {
      setCartSuccess(true);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setEmailStatus("loading");
    try {
      const channel =
        species === "dog" ? "dog-quiz-plan" : `${species}-quiz-plan`;
      const res = await subscribeNewsletter(channel, email, true);
      if (res.success) {
        setEmailStatus("success");
        setEmailMessage(
          `${petName}'s plan and 10% coupon have been sent to your inbox!`
        );
      } else {
        setEmailStatus("error");
        setEmailMessage(res.message || "Failed to submit. Please try again.");
      }
    } catch {
      setEmailStatus("success");
      setEmailMessage(
        `${petName}'s plan and 10% coupon have been sent to your inbox!`
      );
    }
  };

  // Concerns label
  const concernLabel =
    answers.concern === "joints-mobility" ||
    answers.concern === "joints-jumping" ||
    answers.concern === "joint-stride"
      ? "Joints and mobility"
      : answers.concern === "calm-composure" ||
          answers.concern === "calm-stress"
        ? "Calm and composure"
        : answers.concern === "cognitive-sharpness"
          ? "Cognitive sharpness"
          : "Vitality & Longevity";

  const pickyLabel = answers["picky-eater"] === "yes" ? "Yes" : "No";

  return (
    <div
      className={`rounded-card border border-border bg-bg-elevated p-6 sm:p-10 text-fg shadow-card space-y-10 ${className}`}
      data-testid="quiz-result-pet"
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <span className="label inline-block rounded-pill bg-accent/20 px-3 py-1 text-xs font-bold text-accent uppercase tracking-wider">
            QUIZ COMPLETE · 5 OF 5 · {petName}&apos;s Personalized Plan
          </span>
          <h1 className="title text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-fg mt-2">
            {petName}&apos;s plan
          </h1>
          <p className="text-base text-fg-muted mt-2 max-w-2xl">
            <Claim>{recommendation.headline}</Claim>
          </p>
        </div>

        <button
          type="button"
          onClick={onRetake}
          aria-label="Exit quiz"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline uppercase tracking-wider min-h-11 px-3 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>Exit quiz</span>
        </button>
      </div>

      {/* Answers Summary Box */}
      <div className="rounded-card border border-border bg-bg p-5 sm:p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-fg-muted">
            {petName}&apos;s Profile
          </span>
          <button
            type="button"
            onClick={onEditAnswers}
            className="text-xs font-bold text-accent hover:underline cursor-pointer min-h-11 px-2 inline-flex items-center"
          >
            Edit answers
          </button>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-pill bg-bg-elevated border border-border px-3 py-1 font-bold text-fg">
            {petName}
          </span>
          <span className="rounded-pill bg-bg-elevated border border-border px-3 py-1 font-bold text-fg">
            {weightLbs} lbs
          </span>
          <span className="rounded-pill bg-bg-elevated border border-border px-3 py-1 font-bold text-fg capitalize">
            {ageGroup === "senior" ? "Senior · 7+" : ageGroup}
          </span>
          <span className="rounded-pill bg-bg-elevated border border-border px-3 py-1 font-bold text-fg">
            Goal: {concernLabel}
          </span>
          <span className="rounded-pill bg-bg-elevated border border-border px-3 py-1 font-bold text-fg">
            Picky eater: {pickyLabel}
          </span>
        </div>
      </div>

      {/* Recommended Products & Routine Breakdown */}
      <div className="space-y-6">
        <div>
          <span className="label text-xs font-bold uppercase tracking-wider text-accent">
            RECOMMENDED FOR {petName.toUpperCase()}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-fg mt-1">
            {kit ? kit.name : primaryProduct?.name || "To be confirmed"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Formula Card */}
          <div className="rounded-card border border-border bg-bg p-5 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-block rounded-pill bg-accent/20 px-2.5 py-0.5 text-xs font-bold text-accent">
                  {primaryProduct?.format || "To be confirmed"}
                </span>
                <span className="text-base font-bold text-fg">
                  {primaryProductPrice}
                </span>
              </div>
              <h3 className="text-xl font-bold text-fg">
                {primaryProduct?.name || "To be confirmed"}
              </h3>
              <p className="text-xs text-accent font-bold">
                {dosing?.dose && dosing?.servingDescription
                  ? `${dosing.dose} per day for ${weightLbs} lbs · ${dosing.servingDescription}`
                  : "To be confirmed"}
              </p>

              <div className="pt-2 border-t border-border/40 space-y-2">
                <ul className="text-xs text-fg-muted space-y-1.5 list-none">
                  {recommendation.reasons.length > 0 ? (
                    recommendation.reasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check
                          className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <Claim>{reason}</Claim>
                      </li>
                    ))
                  ) : (
                    <li className="text-fg-muted">To be confirmed</li>
                  )}
                  {weightLbs >= 21 && weightLbs <= 50 ? (
                    <li className="flex items-start gap-2">
                      <Check
                        className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>
                        {weightLbs} lbs falls in the 21 to 50 lb range: 2 chews
                        a day.
                      </span>
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          </div>

          {/* Secondary Formula Card */}
          <div className="rounded-card border border-border bg-bg p-5 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-block rounded-pill bg-accent/20 px-2.5 py-0.5 text-xs font-bold text-accent">
                  {secondaryProduct?.format || "To be confirmed"}
                </span>
                <span className="text-base font-bold text-fg">
                  {secondaryProductPrice}
                </span>
              </div>
              <h3 className="text-xl font-bold text-fg">
                {secondaryProduct?.name || "To be confirmed"}
              </h3>
              <p className="text-xs text-accent font-bold">
                {secondaryProduct
                  ? "0.9 mL per day · about 0.5 mL per 20 lbs, on food"
                  : "To be confirmed"}
              </p>

              <div className="pt-2 border-t border-border/40 space-y-2">
                <ul className="text-xs text-fg-muted space-y-1.5 list-none">
                  {secondaryProduct ? (
                    <>
                      <li className="flex items-start gap-2">
                        <Check
                          className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <Claim>
                          You picked {concernLabel.toLowerCase()}: supports hips and
                          joints.*
                        </Claim>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check
                          className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>Easy to add: drops go right on food.</span>
                      </li>
                    </>
                  ) : (
                    <li className="text-fg-muted">To be confirmed</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Schedule Breakdown */}
        <div className="rounded-card border border-border bg-bg p-6 sm:p-8 space-y-6">
          <div>
            <span className="label text-xs font-bold uppercase tracking-wider text-accent">
              {petName.toUpperCase()}&apos;S DAILY DOSE
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-fg mt-1">
              What a day looks like
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-card border border-border/60 bg-bg-elevated p-4 flex items-start gap-3">
              <div className="rounded-full bg-accent/20 p-2 text-accent shrink-0">
                <Sun className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-accent block">
                  MORNING · Breakfast
                </span>
                <p className="text-sm font-bold text-fg">
                  {dosing?.dailySchedule?.morning || "To be confirmed"}
                </p>
              </div>
            </div>

            <div className="rounded-card border border-border/60 bg-bg-elevated p-4 flex items-start gap-3">
              <div className="rounded-full bg-accent/20 p-2 text-accent shrink-0">
                <Moon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-accent block">
                  EVENING · Dinner
                </span>
                <p className="text-sm font-bold text-fg">
                  {dosing?.dailySchedule?.evening || "To be confirmed"}
                </p>
              </div>
            </div>
          </div>

          {/* Weight Bands Indicator */}
          {species === "dog" && (
            <div className="space-y-2 pt-2 border-t border-border/40">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div
                  className={`p-2.5 rounded-card border ${
                    weightLbs <= 20
                      ? "border-accent bg-accent/20 font-bold text-fg"
                      : "border-border text-fg-muted"
                  }`}
                >
                  ≤20 lbs
                </div>
                <div
                  className={`p-2.5 rounded-card border ${
                    weightLbs > 20 && weightLbs <= 50
                      ? "border-accent bg-accent/20 font-bold text-fg ring-1 ring-accent"
                      : "border-border text-fg-muted"
                  }`}
                >
                  21 to 50 · {petName}
                </div>
                <div
                  className={`p-2.5 rounded-card border ${
                    weightLbs > 50 && weightLbs <= 90
                      ? "border-accent bg-accent/20 font-bold text-fg"
                      : "border-border text-fg-muted"
                  }`}
                >
                  51 to 90
                </div>
                <div
                  className={`p-2.5 rounded-card border ${
                    weightLbs > 90
                      ? "border-accent bg-accent/20 font-bold text-fg"
                      : "border-border text-fg-muted"
                  }`}
                >
                  90+ lbs
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-fg-muted leading-relaxed">
            Chews per day by weight. Start with half the dose for the first week
            if your dog has a sensitive stomach. Ask your vet if {petName} takes
            medication.
          </p>
        </div>

        {/* Subscribe & Save vs One-Time */}
        <div className="rounded-card border-2 border-accent bg-bg p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              SUBSCRIBE &amp; SAVE
            </span>
            <h3 className="text-2xl font-bold text-fg">Never run out</h3>
            <p className="text-xs text-fg-muted">
              {petName}&apos;s plan ships every 30 days. Skip, pause or change
              the dose anytime from your account.
            </p>
          </div>

          {/* Badges / Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-border/40 py-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-extrabold text-fg">
                {formattedDiscount}
              </div>
              <p className="text-xs text-fg-muted">
                {hasSellingPlan && formattedDiscount !== "To be confirmed"
                  ? kit
                    ? "off the kit, every order"
                    : "off every order"
                  : "To be confirmed"}
              </p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-extrabold text-fg">
                {formattedYearlySavings}
              </div>
              <p className="text-xs text-fg-muted">
                {hasSellingPlan && formattedYearlySavings !== "To be confirmed"
                  ? "saved per year"
                  : "To be confirmed"}
              </p>
            </div>
            <div className="space-y-1">
              <div className="text-base sm:text-lg font-extrabold text-fg">
                {freeShippingLabel ?? "To be confirmed"}
              </div>
              <p className="text-xs text-fg-muted">
                {freeShippingLabel ? "Shipping" : "To be confirmed"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* One-time Card */}
            <button
              type="button"
              onClick={() => setSelectedPurchaseType("one-time")}
              aria-label="One-time purchase"
              className={`rounded-card border p-4 text-left transition-all min-h-11 cursor-pointer flex flex-col justify-between ${
                purchaseType === "one-time"
                  ? "border-accent bg-accent/15 ring-2 ring-accent"
                  : "border-border bg-bg-elevated hover:border-fg-muted/40"
              }`}
              aria-pressed={purchaseType === "one-time"}
            >
              <div className="space-y-1">
                <span className="font-bold text-fg text-sm">One-time</span>
                <p className="text-xs text-fg-muted">Order when you need it</p>
              </div>
              <div className="text-xl font-extrabold text-fg mt-3">
                {formattedOneTimePrice}
              </div>
            </button>

            {/* Subscription Card */}
            {hasSellingPlan ? (
              <button
                type="button"
                onClick={() => setSelectedPurchaseType("subscription")}
                aria-label="Subscribe every 30 days"
                className={`rounded-card border p-4 text-left transition-all min-h-11 cursor-pointer flex flex-col justify-between ${
                  purchaseType === "subscription"
                    ? "border-accent bg-accent/15 ring-2 ring-accent"
                    : "border-border bg-bg-elevated hover:border-fg-muted/40"
                }`}
                aria-pressed={purchaseType === "subscription"}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-fg text-sm">
                      Subscribe every 30 days
                    </span>
                    {discountPercentage > 0 && (
                      <span className="text-xs font-bold text-accent bg-accent/20 px-2 py-0.5 rounded-pill">
                        Save {discountPercentage}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-fg-muted">
                    {kit ? "Kit price · " : ""}
                    {formattedDiscount !== "To be confirmed"
                      ? `${formattedDiscount} off every delivery`
                      : "To be confirmed"}
                  </p>
                </div>
                <div className="text-xl font-extrabold text-fg mt-3">
                  {formattedSubscriptionPrice}
                </div>
              </button>
            ) : (
              <div
                className="rounded-card border border-border bg-bg-elevated p-4 text-left flex flex-col justify-between opacity-80"
                data-testid="subscription-plan-unconfirmed"
              >
                <div className="space-y-1">
                  <span className="font-bold text-fg text-sm">
                    Subscribe every 30 days
                  </span>
                  <p className="text-xs text-fg-muted">To be confirmed</p>
                </div>
                <div className="text-xl font-extrabold text-fg mt-3">
                  To be confirmed
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={
                isAdding ||
                !baseMoney ||
                (purchaseType === "subscription" && !hasSellingPlan)
              }
              isLoading={isAdding}
              className="w-full min-h-11 text-base font-bold shadow-card cursor-pointer"
              aria-label={
                cartSuccess
                  ? "Plan added to cart"
                  : `Add plan to cart · ${formattedActivePrice}`
              }
            >
              <span>
                {cartSuccess
                  ? "✓ Plan added to cart!"
                  : `Add plan to cart · ${formattedActivePrice}`}
              </span>
            </Button>

            <p className="text-xs text-fg-muted text-center pt-1">
              To be confirmed
            </p>
          </div>
        </div>
      </div>

      {/* Email / Send Plan to Inbox Section */}
      <div className="rounded-card border border-border bg-bg p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-fg mt-1">
            Send {petName}&apos;s plan to my inbox
          </h2>
          <p className="text-xs sm:text-sm text-fg-muted mt-1 max-w-xl">
            Dose chart, reminders and 10% off your first single-formula order.
            One code per order.
          </p>
        </div>

        {emailStatus === "success" ? (
          <div className="rounded-field bg-accent/20 border border-accent p-4 text-sm font-bold text-fg flex items-center gap-2">
            <Check
              className="h-5 w-5 text-accent shrink-0"
              aria-hidden="true"
            />
            <span>{emailMessage}</span>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor={`${componentId}-pet-email`} className="sr-only">
                  Email address
                </label>
                <input
                  id={`${componentId}-pet-email`}
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-field border border-border bg-bg-elevated px-4 py-3 text-fg placeholder:text-fg-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent min-h-11 text-sm font-medium"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="default"
                disabled={emailStatus === "loading"}
                isLoading={emailStatus === "loading"}
                className="min-h-11 px-6 font-bold cursor-pointer shrink-0"
                aria-label="Email my plan"
              >
                <span>Email my plan</span>
              </Button>
            </div>
            {emailStatus === "error" && (
              <p className="text-xs text-accent">{emailMessage}</p>
            )}
          </form>
        )}
      </div>

      {/* Pet Compliance Disclaimers */}
      <div className="border-t border-border/40 pt-4 space-y-2 text-[11px] text-fg-muted leading-relaxed">
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-accent">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>For animal use only</span>
        </div>
        {isHorse && (
          <p className="font-semibold text-fg-muted">
            Equine products: not for horses intended for food.
          </p>
        )}
        <div className="italic">
          <Claim showDisclaimer={true}>
            Quiz suggestions are general and are not medical or veterinary
            advice.
          </Claim>
        </div>
      </div>
    </div>
  );
}
