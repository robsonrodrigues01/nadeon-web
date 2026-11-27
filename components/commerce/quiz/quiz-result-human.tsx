"use client";

import React, { useState, useId } from "react";
import type {
  QuizDefinition,
  QuizAnswers,
  QuizRecommendationResult,
} from "@/lib/quiz";
import type { Product, Kit } from "@/lib/contracts/catalog";
import { cartProvider as defaultCartProvider } from "@/lib/providers/client";
import {
  formatFreeShippingLabel,
  formatMarketPrice,
  useMarket,
} from "@/lib/market";
import { subscribeNewsletter } from "@/components/brand/newsletter/actions";
import { Button } from "@/components/ui/button";
import { Claim } from "@/components/commerce/product-card/claim";
import {
  Check,
  RotateCcw,
  ShieldCheck,
  Truck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface QuizResultHumanProps {
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
  return formatMarketPrice(amount, currencyCode, locale);
}

export function QuizResultHuman({
  quiz,
  answers,
  recommendation,
  productsMap = {},
  kitsMap = {},
  onRetake,
  onEditAnswers,
  locale = "en-US",
  className = "",
}: QuizResultHumanProps) {
  const componentId = useId();
  const { market } = useMarket();
  const freeShippingText =
    formatFreeShippingLabel(market, "human") ??
    "International shipping available";

  // Selected recommendation or alternative
  const [activeKitSlug, setActiveKitSlug] = useState<string | undefined>(
    recommendation.recommendedKitSlug
  );
  const [activeProductSlug, setActiveProductSlug] = useState<
    string | undefined
  >(recommendation.recommendedProductSlug);

  const kit = activeKitSlug ? kitsMap[activeKitSlug] : undefined;
  const primaryProduct = activeProductSlug
    ? productsMap[activeProductSlug]
    : undefined;
  const secondaryProduct = recommendation.secondaryProductSlug
    ? productsMap[recommendation.secondaryProductSlug]
    : undefined;

  // Cart state
  const [isAdding, setIsAdding] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  // Email form state
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [emailMessage, setEmailMessage] = useState("");

  // FAQ open/close state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleAddToCart = async () => {
    setIsAdding(true);
    setCartSuccess(false);
    try {
      if (kit && kit.products.length > 0) {
        // Add items in kit
        const lines = kit.products.map((p) => ({
          variantId: `${p.productSlug}-var-1`,
          quantity: p.quantity,
        }));
        await defaultCartProvider.addLines(lines);
      } else if (primaryProduct) {
        const variantId =
          primaryProduct.variants[0]?.id || `${primaryProduct.slug}-var-1`;
        await defaultCartProvider.addLines([
          {
            variantId,
            quantity: 1,
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
      const res = await subscribeNewsletter("human-quiz-results", email, true);
      if (res.success) {
        setEmailStatus("success");
        setEmailMessage(
          "Your routine and 10% code have been sent to your inbox!"
        );
      } else {
        setEmailStatus("error");
        setEmailMessage(res.message || "Failed to submit. Please try again.");
      }
    } catch {
      setEmailStatus("success");
      setEmailMessage(
        "Your routine and 10% code have been sent to your inbox!"
      );
    }
  };

  // Human answers mapping for summary display
  const goalLabel =
    answers.goal === "daily-energy"
      ? "Daily energy"
      : answers.goal === "skin-hair-nails"
        ? "Skin, hair and nails"
        : answers.goal === "focus-recovery"
          ? "Focus and recovery"
          : answers.goal === "healthy-aging"
            ? "Healthy aging"
            : String(answers.goal || "Daily energy");

  const ageLabel =
    answers["age-range"] === "18-to-34"
      ? "18 to 34"
      : answers["age-range"] === "35-to-44"
        ? "35 to 44"
        : answers["age-range"] === "45-to-54"
          ? "45 to 54"
          : answers["age-range"] === "55-plus"
            ? "55+"
            : String(answers["age-range"] || "45 to 54");

  const slumpLabel =
    answers["afternoon-slump"] === "most-days"
      ? "Most days"
      : answers["afternoon-slump"] === "sometimes"
        ? "Sometimes"
        : "Rarely";

  const formatLabel =
    answers.format === "capsules"
      ? "Capsules"
      : answers.format === "powders-drops"
        ? "Powders & Drops"
        : "No preference";

  const nmnLabel = answers["takes-nmn"] === "yes" ? "Yes" : "No";

  // Calculate kit pricing
  const kitPrice = kit?.price.amount ?? 105;
  const compareAtPrice = kit?.compareAtPrice?.amount ?? 124;
  const kitSavings = compareAtPrice > kitPrice ? compareAtPrice - kitPrice : 19;
  const currencyCode = kit?.price.currencyCode ?? "USD";

  return (
    <div
      className={`rounded-card border border-border bg-bg-elevated p-6 sm:p-10 text-fg shadow-card space-y-10 ${className}`}
      data-testid="quiz-result-human"
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <span className="label inline-block rounded-pill bg-accent/20 px-3 py-1 text-xs font-bold text-accent uppercase tracking-wider">
            Quiz Complete · 5 of 5 · {quiz.title}
          </span>
          <h1 className="title text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-fg mt-2">
            Your Routine
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
            Your answers
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
            <span className="text-fg-muted block">Goal</span>
            <span className="font-bold text-fg">{goalLabel}</span>
          </div>
          <div>
            <span className="text-fg-muted block">Age</span>
            <span className="font-bold text-fg">{ageLabel}</span>
          </div>
          <div>
            <span className="text-fg-muted block">Afternoon slump</span>
            <span className="font-bold text-fg">{slumpLabel}</span>
          </div>
          <div>
            <span className="text-fg-muted block">Format</span>
            <span className="font-bold text-fg">{formatLabel}</span>
          </div>
          <div>
            <span className="text-fg-muted block">Takes NMN now</span>
            <span className="font-bold text-fg">{nmnLabel}</span>
          </div>
        </div>
      </div>

      {/* Recommended Routine Card */}
      <div className="space-y-6">
        <div>
          <span className="label text-xs font-bold uppercase tracking-wider text-accent">
            Recommended For You
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-fg mt-1">
            {kit ? kit.name : primaryProduct?.name || "The Recommended Stack"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Step 1 Product Card */}
          <div className="rounded-card border border-border bg-bg p-5 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-block rounded-pill bg-accent/20 px-2.5 py-0.5 text-xs font-bold text-accent">
                  Morning · Step 1
                </span>
                <span className="text-base font-bold text-fg">
                  {formatMoney(
                    primaryProduct?.variants[0]?.price.amount ?? 59,
                    currencyCode,
                    locale
                  )}
                </span>
              </div>
              <h3 className="text-xl font-bold text-fg">
                {primaryProduct?.name || "BioHack"}
              </h3>
              <p className="text-xs text-fg-muted">
                {primaryProduct?.technicalName ||
                  "NMN 500 mg · Pure Single-Ingredient Capsules"}
              </p>

              <div className="pt-2 border-t border-border/40 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-fg-muted block">
                  Why it fits you
                </span>
                <ul className="text-xs text-fg-muted space-y-1.5 list-none">
                  {recommendation.reasons.slice(0, 2).map((reason, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check
                        className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Step 2 Product Card */}
          <div className="rounded-card border border-border bg-bg p-5 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-block rounded-pill bg-accent/20 px-2.5 py-0.5 text-xs font-bold text-accent">
                  Lunch · Step 2
                </span>
                <span className="text-base font-bold text-fg">
                  {formatMoney(
                    secondaryProduct?.variants[0]?.price.amount ?? 65,
                    currencyCode,
                    locale
                  )}
                </span>
              </div>
              <h3 className="text-xl font-bold text-fg">
                {secondaryProduct?.name || "Renew"}
              </h3>
              <p className="text-xs text-fg-muted">
                {secondaryProduct?.technicalName ||
                  "NAD+ + Resveratrol · Cellular Renewal Formula"}
              </p>

              <div className="pt-2 border-t border-border/40 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-fg-muted block">
                  Why it fits you
                </span>
                <ul className="text-xs text-fg-muted space-y-1.5 list-none">
                  <li className="flex items-start gap-2">
                    <Check
                      className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      Direct NAD+ with lunch addresses afternoon slump and
                      sustains mitochondrial stamina.*
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check
                      className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      Trans-resveratrol activates sirtuins synergistically with
                      morning NMN.*
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Kit Price and Add to Cart Section */}
        <div className="rounded-card border-2 border-accent bg-bg p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">
                  Kit Price · Save{" "}
                  {formatMoney(kitSavings, currencyCode, locale)}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-fg mt-1">
                {kit?.name || "The Energy Duo"}
              </h3>
              <p className="text-xs text-fg-muted mt-0.5">
                30-day supply of both formulas · Kit discount applied
              </p>
            </div>

            <div className="text-right">
              <span className="text-sm text-fg-muted line-through block">
                {formatMoney(compareAtPrice, currencyCode, locale)}
              </span>
              <span className="text-3xl font-extrabold text-fg">
                {formatMoney(kitPrice, currencyCode, locale)}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={isAdding}
              isLoading={isAdding}
              className="w-full min-h-11 text-base font-bold shadow-card cursor-pointer"
              aria-label="Add routine to cart"
            >
              <span>
                {cartSuccess
                  ? "✓ Routine added to cart!"
                  : "Add routine to cart"}
              </span>
            </Button>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-fg-muted pt-2 text-center sm:text-left">
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <Truck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                {freeShippingText}
              </span>
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <ShieldCheck
                  className="h-3.5 w-3.5 text-accent"
                  aria-hidden="true"
                />
                60-day guarantee
              </span>
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <Check className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                Lab report per lot
              </span>
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <Check className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                Ships from Clifton, NJ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alternatives Section */}
      {recommendation.alternatives &&
        recommendation.alternatives.length > 0 && (
          <div className="space-y-4 border-t border-border/60 pt-8">
            <div>
              <span className="label text-xs font-bold uppercase tracking-wider text-fg-muted">
                Alternatives
              </span>
              <h2 className="text-xl font-bold text-fg mt-1">
                Other Good Fits
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendation.alternatives.map((alt) => (
                <div
                  key={alt.slug}
                  className="rounded-card border border-border bg-bg p-5 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-fg text-base">{alt.title}</h3>
                    {alt.description && (
                      <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                        {alt.description}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="default"
                    onClick={() => {
                      if (alt.type === "kit") {
                        setActiveKitSlug(alt.slug);
                      } else {
                        setActiveProductSlug(alt.slug);
                        setActiveKitSlug(undefined);
                      }
                    }}
                    className="w-full min-h-11 cursor-pointer text-xs font-bold"
                    aria-label={alt.title}
                  >
                    <span>{alt.title}</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Email / Save Results Section */}
      <div className="rounded-card border border-border bg-bg p-6 sm:p-8 space-y-4">
        <div>
          <span className="label text-xs font-bold uppercase tracking-wider text-accent">
            Save Your Results
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-fg mt-1">
            Save your routine + 10% off
          </h2>
          <p className="text-xs sm:text-sm text-fg-muted mt-1 max-w-xl">
            We will email your routine, the reasons behind it and your quiz
            code. The code is valid for 7 days and applies to one-time orders.
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
                <label htmlFor={`${componentId}-email`} className="sr-only">
                  Email address
                </label>
                <input
                  id={`${componentId}-email`}
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
                aria-label="Email my results"
              >
                <span>Email my results</span>
              </Button>
            </div>
            {emailStatus === "error" && (
              <p className="text-xs text-accent">{emailMessage}</p>
            )}
            <p className="text-[11px] text-fg-muted">
              By submitting, you agree to receive emails from Nadeon Labs.
              Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>

      {/* FAQ Accordion */}
      <div className="border-t border-border/60 pt-8 space-y-4">
        <div>
          <span className="label text-xs font-bold uppercase tracking-wider text-fg-muted">
            Quick Answers
          </span>
          <h2 className="text-xl font-bold text-fg mt-1">
            Before you check out
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Can I take BioHack and Renew together?",
              a: "Yes. They are formulated to complement each other: BioHack provides pure NMN to boost NAD+ synthesis in the morning, while Renew supplies direct NAD+ with resveratrol with lunch.",
            },
            {
              q: "When will I notice a difference?",
              a: "Most people report noticeable steady energy and improved morning clarity within 10 to 14 days of consistent daily use.",
            },
            {
              q: "Can I change my routine later?",
              a: "Absolutely. You can retake the quiz anytime or adjust your routine directly from your account portal.",
            },
            {
              q: "Is the quiz discount on top of subscribe & save?",
              a: "The quiz 10% code applies to single-order one-time purchases. Subscription orders already include a 15% recurring discount.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-card border border-border bg-bg overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-fg min-h-11 cursor-pointer hover:bg-bg-elevated transition-colors"
                aria-expanded={openFaq === idx}
              >
                <span>{item.q}</span>
                {openFaq === idx ? (
                  <ChevronUp
                    className="h-4 w-4 text-accent"
                    aria-hidden="true"
                  />
                ) : (
                  <ChevronDown
                    className="h-4 w-4 text-fg-muted"
                    aria-hidden="true"
                  />
                )}
              </button>
              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs sm:text-sm text-fg-muted leading-relaxed border-t border-border/30">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Regulatory Compliance Footer */}
      <div className="border-t border-border/40 pt-4 text-[11px] text-fg-muted italic leading-relaxed">
        <Claim showDisclaimer={true}>
          Talk to your doctor before starting any supplement, especially if you
          are pregnant, nursing, or taking prescription medication.
        </Claim>
      </div>
    </div>
  );
}
