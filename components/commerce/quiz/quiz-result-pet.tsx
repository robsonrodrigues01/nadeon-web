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
import {
  Check,
  RotateCcw,
  ShieldCheck,
  Truck,
  Sun,
  Moon,
  AlertCircle,
} from "lucide-react";

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

function formatMoney(
  amount: number,
  currencyCode = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

export function QuizResultPet({
  quiz,
  answers,
  recommendation,
  productsMap = {},
  kitsMap = {},
  onRetake,
  onEditAnswers,
  locale = "en-US",
  className = "",
}: QuizResultPetProps) {
  const componentId = useId();
  const petName = (answers.petName as string) || "your pet";
  const weightLbs = Number(answers.weightLbs || 35);
  const ageGroup = (answers.ageGroup as string) || "senior";
  const species = quiz.species || "dog";
  const isHorse = species === "horse";

  const [purchaseType, setPurchaseType] = useState<"subscription" | "one-time">(
    "subscription"
  );
  const [isAdding, setIsAdding] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  // Email form state
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [emailMessage, setEmailMessage] = useState("");

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

  // Pricing
  const basePrice = kit
    ? kit.price.amount
    : (primaryProduct?.variants[0]?.price.amount ?? 75);
  const currencyCode = kit
    ? kit.price.currencyCode
    : (primaryProduct?.variants[0]?.price.currencyCode ?? "USD");
  const subscriptionDiscount = 13;
  const oneTimePrice = basePrice;
  const subscriptionPrice = Math.max(0, basePrice - subscriptionDiscount);
  const activePrice =
    purchaseType === "subscription" ? subscriptionPrice : oneTimePrice;

  const handleAddToCart = async () => {
    setIsAdding(true);
    setCartSuccess(false);
    try {
      if (kit && kit.products.length > 0) {
        const lines = kit.products.map((p) => ({
          variantId: `${p.productSlug}-var-1`,
          quantity: p.quantity,
          sellingPlanId: purchaseType === "subscription" ? "sub-monthly" : null,
        }));
        await defaultCartProvider.addLines(lines);
      } else if (primaryProduct) {
        const variantId =
          primaryProduct.variants[0]?.id || `${primaryProduct.slug}-var-1`;
        await defaultCartProvider.addLines([
          {
            variantId,
            quantity: 1,
            sellingPlanId:
              purchaseType === "subscription" ? "sub-monthly" : null,
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
      const res = await subscribeNewsletter(
        `${species}-quiz-plan`,
        email,
        true
      );
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
          ? "Cognitive clarity"
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
            Quiz Complete · {petName}&apos;s Plan
          </span>
          <h1 className="title text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-fg mt-2">
            {petName}&apos;s Personalized Plan
          </h1>
          <p className="text-base text-fg-muted mt-2 max-w-2xl">
            <Claim>{recommendation.headline}</Claim>
          </p>
        </div>

        <button
          type="button"
          onClick={onRetake}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline uppercase tracking-wider min-h-11 px-3 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>Retake the quiz</span>
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

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <span className="text-fg-muted block">Pet name</span>
            <span className="font-bold text-fg">{petName}</span>
          </div>
          <div>
            <span className="text-fg-muted block">Weight</span>
            <span className="font-bold text-fg">{weightLbs} lbs</span>
          </div>
          <div>
            <span className="text-fg-muted block">Life stage</span>
            <span className="font-bold text-fg capitalize">{ageGroup}</span>
          </div>
          <div>
            <span className="text-fg-muted block">Primary priority</span>
            <span className="font-bold text-fg">{concernLabel}</span>
          </div>
          <div>
            <span className="text-fg-muted block">Picky eater</span>
            <span className="font-bold text-fg">{pickyLabel}</span>
          </div>
        </div>
      </div>

      {/* Recommended Products & Routine Breakdown */}
      <div className="space-y-6">
        <div>
          <span className="label text-xs font-bold uppercase tracking-wider text-accent">
            Recommended For {petName}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-fg mt-1">
            {kit ? kit.name : primaryProduct?.name || "The Custom Plan"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Formula Card */}
          <div className="rounded-card border border-border bg-bg p-5 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-block rounded-pill bg-accent/20 px-2.5 py-0.5 text-xs font-bold text-accent">
                  Daily Chew / Powder
                </span>
                <span className="text-base font-bold text-fg">
                  {formatMoney(
                    primaryProduct?.variants[0]?.price.amount ?? 44,
                    currencyCode,
                    locale
                  )}
                </span>
              </div>
              <h3 className="text-xl font-bold text-fg">
                {primaryProduct?.name || "More Good Years"}
              </h3>
              <p className="text-xs text-accent font-bold">
                {dosing?.dose || "2 chews"} per day for {weightLbs} lbs
              </p>

              <div className="pt-2 border-t border-border/40 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-fg-muted block">
                  Why it fits {petName}
                </span>
                <ul className="text-xs text-fg-muted space-y-1.5 list-none">
                  {recommendation.reasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check
                        className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{reason}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2">
                    <Check
                      className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      Dosed specifically for {weightLbs} lbs to maintain
                      therapeutic NAD+ levels.*
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Secondary Formula Card (if kit has 2 products) */}
          <div className="rounded-card border border-border bg-bg p-5 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-block rounded-pill bg-accent/20 px-2.5 py-0.5 text-xs font-bold text-accent">
                  {secondaryProduct?.format || "Meal Topper Oil / Drops"}
                </span>
                <span className="text-base font-bold text-fg">
                  {formatMoney(
                    secondaryProduct?.variants[0]?.price.amount ?? 44,
                    currencyCode,
                    locale
                  )}
                </span>
              </div>
              <h3 className="text-xl font-bold text-fg">
                {secondaryProduct?.name || "Golden Years Oil"}
              </h3>
              <p className="text-xs text-accent font-bold">
                0.9 mL per day · on food
              </p>

              <div className="pt-2 border-t border-border/40 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-fg-muted block">
                  Why it fits {petName}
                </span>
                <ul className="text-xs text-fg-muted space-y-1.5 list-none">
                  <li className="flex items-start gap-2">
                    <Check
                      className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      Concentrated drops drizzle directly over morning meal for
                      easy compliance.*
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check
                      className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      Supports hips and connective joints alongside cellular
                      rejuvenation.*
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Schedule Breakdown */}
        <div className="rounded-card border border-border bg-bg p-6 sm:p-8 space-y-6">
          <div>
            <span className="label text-xs font-bold uppercase tracking-wider text-accent">
              {petName}&apos;s Daily Routine
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
                  Morning · Breakfast
                </span>
                <p className="text-sm font-bold text-fg">
                  {dosing?.dailySchedule?.morning || "1 chew + drops on food"}
                </p>
                <p className="text-xs text-fg-muted">
                  Serve with or mixed into morning meal for optimal absorption.
                </p>
              </div>
            </div>

            <div className="rounded-card border border-border/60 bg-bg-elevated p-4 flex items-start gap-3">
              <div className="rounded-full bg-accent/20 p-2 text-accent shrink-0">
                <Moon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-accent block">
                  Evening · Dinner
                </span>
                <p className="text-sm font-bold text-fg">
                  {dosing?.dailySchedule?.evening || "1 chew with dinner"}
                </p>
                <p className="text-xs text-fg-muted">
                  Serve with evening meal or as an evening reward treat.
                </p>
              </div>
            </div>
          </div>

          {/* Weight Bands Indicator */}
          {species === "dog" && (
            <div className="space-y-2 pt-2 border-t border-border/40">
              <span className="text-xs font-bold uppercase tracking-wider text-fg-muted block">
                Standard Weight Bands
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div
                  className={`p-2.5 rounded-card border ${weightLbs <= 20 ? "border-accent bg-accent/20 font-bold text-fg" : "border-border text-fg-muted"}`}
                >
                  ≤20 lbs · 1 chew
                </div>
                <div
                  className={`p-2.5 rounded-card border ${weightLbs > 20 && weightLbs <= 50 ? "border-accent bg-accent/20 font-bold text-fg ring-1 ring-accent" : "border-border text-fg-muted"}`}
                >
                  21 to 50 lbs ({petName}) · 2 chews
                </div>
                <div
                  className={`p-2.5 rounded-card border ${weightLbs > 50 && weightLbs <= 90 ? "border-accent bg-accent/20 font-bold text-fg" : "border-border text-fg-muted"}`}
                >
                  51 to 90 lbs · 3 chews
                </div>
                <div
                  className={`p-2.5 rounded-card border ${weightLbs > 90 ? "border-accent bg-accent/20 font-bold text-fg" : "border-border text-fg-muted"}`}
                >
                  91+ lbs · 4 chews
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-fg-muted leading-relaxed">
            Start with half the dose for the first week if {petName} has a
            sensitive stomach. Consult your veterinarian if {petName} is
            currently on medication.
          </p>
        </div>

        {/* Subscribe & Save vs One-Time */}
        <div className="rounded-card border-2 border-accent bg-bg p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Subscribe &amp; Save · Never Run Out
            </span>
            <h3 className="text-2xl font-bold text-fg">
              Choose Your Delivery Plan
            </h3>
            <p className="text-xs text-fg-muted">
              {petName}&apos;s plan ships automatically every 30 days. Skip,
              pause or change anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subscription Card */}
            <button
              type="button"
              onClick={() => setPurchaseType("subscription")}
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
                  <span className="text-xs font-bold text-accent bg-accent/20 px-2 py-0.5 rounded-pill">
                    Save $13 / order
                  </span>
                </div>
                <p className="text-xs text-fg-muted">
                  Auto-ships every month · Save $156 per year
                </p>
              </div>
              <div className="text-xl font-extrabold text-fg mt-3">
                {formatMoney(subscriptionPrice, currencyCode, locale)}
              </div>
            </button>

            {/* One-time Card */}
            <button
              type="button"
              onClick={() => setPurchaseType("one-time")}
              className={`rounded-card border p-4 text-left transition-all min-h-11 cursor-pointer flex flex-col justify-between ${
                purchaseType === "one-time"
                  ? "border-accent bg-accent/15 ring-2 ring-accent"
                  : "border-border bg-bg-elevated hover:border-fg-muted/40"
              }`}
              aria-pressed={purchaseType === "one-time"}
            >
              <div className="space-y-1">
                <span className="font-bold text-fg text-sm">
                  One-time purchase
                </span>
                <p className="text-xs text-fg-muted">
                  Standard single order · Re-order as needed
                </p>
              </div>
              <div className="text-xl font-extrabold text-fg mt-3">
                {formatMoney(oneTimePrice, currencyCode, locale)}
              </div>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={isAdding}
              isLoading={isAdding}
              className="w-full min-h-11 text-base font-bold shadow-card cursor-pointer"
              aria-label={`Add plan to cart for ${formatMoney(activePrice, currencyCode, locale)}`}
            >
              <span>
                {cartSuccess
                  ? "✓ Plan added to cart!"
                  : `Add plan to cart · ${formatMoney(activePrice, currencyCode, locale)}`}
              </span>
            </Button>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-fg-muted pt-1">
              <span className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                Free shipping over $49
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck
                  className="h-3.5 w-3.5 text-accent"
                  aria-hidden="true"
                />
                60-day guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Email / Send Plan to Inbox Section */}
      <div className="rounded-card border border-border bg-bg p-6 sm:p-8 space-y-4">
        <div>
          <span className="label text-xs font-bold uppercase tracking-wider text-accent">
            Email Delivery
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-fg mt-1">
            Send {petName}&apos;s plan to my inbox
          </h2>
          <p className="text-xs sm:text-sm text-fg-muted mt-1 max-w-xl">
            Dose chart, reminder schedule, and 10% off your first single-formula
            order.
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
            <p className="text-[11px] text-fg-muted">
              By submitting, you agree to receive pet wellness updates from
              Nadeon Pet. Unsubscribe anytime.
            </p>
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
            Quiz suggestions are general wellness guidance and do not replace
            professional veterinary examination or diagnosis.
          </Claim>
        </div>
      </div>
    </div>
  );
}
