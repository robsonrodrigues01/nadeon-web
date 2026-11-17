"use client";

import React, { useState, useTransition, useEffect, useMemo } from "react";
import {
  type GiftCardDesign,
  type GiftCardProvider,
  GiftCardPurchaseInputSchema,
  isGiftCardAmountWithinApprovedRange,
} from "@/lib/contracts/gift-card";
import type { Money } from "@/lib/contracts/catalog";
import type { Market } from "@/lib/market/types";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import { cartProvider, giftCardProvider } from "@/lib/providers/client";
import { prepareGiftCardPurchase } from "../actions";
import { GiftCardPreview } from "./gift-card-preview";

interface GiftCardPurchaseFormProps {
  provider?: GiftCardProvider;
  market: Market;
}

export function GiftCardPurchaseForm({
  provider,
  market,
}: GiftCardPurchaseFormProps) {
  const activeProvider = useMemo(
    () => provider ?? giftCardProvider,
    [provider]
  );

  // State
  const [design, setDesign] = useState<GiftCardDesign>("espresso");
  const [presetAmount, setPresetAmount] = useState<number>(0);
  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [recipientName, setRecipientName] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [senderName, setSenderName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [deliveryMode, setDeliveryMode] = useState<"today" | "schedule">(
    "today"
  );

  const todayIso = new Date().toISOString().split("T")[0];
  const [deliveryDate, setDeliveryDate] = useState<string>(todayIso);

  const [quantity, setQuantity] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load available amounts if provider returns any
  const [availablePresets, setAvailablePresets] = useState<Money[]>([]);

  useEffect(() => {
    activeProvider
      .getAvailableAmounts(market.currency.code)
      .then((amounts) => {
        const matchingCurrency = amounts.filter(
          (amount) => amount.currencyCode === market.currency.code
        );
        setAvailablePresets(matchingCurrency);
        if (matchingCurrency.length > 0) {
          setPresetAmount(matchingCurrency[0].amount);
        }
      })
      .catch(() => setAvailablePresets([]));
  }, [activeProvider, market.currency.code]);

  // Compute effective amount
  const numericAmount = isCustomAmount
    ? parseFloat(customAmount) || 0
    : presetAmount;
  const formattedAmount =
    numericAmount > 0
      ? formatMoneyWithMarket(
          {
            amount: numericAmount,
            currencyCode: market.currency.code,
          },
          market
        )
      : "To be confirmed";
  const approvedMinimum = availablePresets.length
    ? Math.min(...availablePresets.map((amount) => amount.amount))
    : undefined;
  const approvedMaximum = availablePresets.length
    ? Math.max(...availablePresets.map((amount) => amount.amount))
    : undefined;
  const formattedLimits =
    approvedMinimum !== undefined && approvedMaximum !== undefined
      ? `${formatMoneyWithMarket({ amount: approvedMinimum, currencyCode: market.currency.code }, market)} – ${formatMoneyWithMarket({ amount: approvedMaximum, currencyCode: market.currency.code }, market)}`
      : "To be confirmed";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessId(null);

    if (numericAmount <= 0) {
      setErrorMessage("Please select or enter a valid gift card amount.");
      return;
    }

    if (availablePresets.length === 0) {
      setErrorMessage("Gift card amounts are To be confirmed.");
      return;
    }

    if (
      !isGiftCardAmountWithinApprovedRange(
        { amount: numericAmount, currencyCode: market.currency.code },
        availablePresets
      )
    ) {
      setErrorMessage("Gift card amount is outside the approved range.");
      return;
    }

    const effectiveDeliveryDate =
      deliveryMode === "today" ? todayIso : deliveryDate;

    const payload = {
      amount: {
        amount: numericAmount,
        currencyCode: market.currency.code,
      },
      design,
      recipientName: recipientName.trim(),
      recipientEmail: recipientEmail.trim(),
      senderName: senderName.trim(),
      message: message.trim() ? message.trim() : undefined,
      deliveryDate: effectiveDeliveryDate,
    };

    const parsed = GiftCardPurchaseInputSchema.safeParse(payload);
    if (!parsed.success) {
      const firstIssue =
        parsed.error.issues[0]?.message ?? "Please provide valid information.";
      setErrorMessage(`Validation error: ${firstIssue}`);
      return;
    }

    startTransition(async () => {
      try {
        const result = await prepareGiftCardPurchase(parsed.data);

        // Add to cart using the ID returned by preparePurchase
        if (typeof cartProvider.addLines === "function") {
          await cartProvider.addLines([
            {
              variantId: result.id,
              quantity,
              customAttributes: {
                amount: String(numericAmount),
                currencyCode: market.currency.code,
                design,
                recipientName: recipientName.trim(),
                recipientEmail: recipientEmail.trim(),
                senderName: senderName.trim(),
                deliveryDate: effectiveDeliveryDate,
              },
            },
          ]);
        }

        // Only mark success after cart addition finishes successfully
        setSuccessId(result.id);
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Failed to prepare gift card. Please try again.";
        setErrorMessage(msg);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
      {/* Left Column: Live Preview & Designs */}
      <GiftCardPreview
        design={design}
        onSelectDesign={setDesign}
        amountFormatted={formattedAmount}
        recipientName={recipientName}
        senderName={senderName}
        message={message}
      />

      {/* Right Column: 5-Step Purchase Form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {/* Step 1: Choose an amount */}
        <fieldset className="p-4 sm:p-6 rounded-2xl border border-border/80 bg-bg-elevated/20 flex flex-col gap-4">
          <legend className="flex items-center gap-2.5 font-extrabold text-base sm:text-lg text-fg">
            <span className="w-6.5 h-6.5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-black">
              1
            </span>
            Choose an amount
          </legend>

          {availablePresets.length > 0 ? (
            <div
              role="group"
              aria-label="Preset gift card amounts"
              className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
            >
              {availablePresets.map((val) => {
                const isSelected =
                  !isCustomAmount && presetAmount === val.amount;
                const label = formatMoneyWithMarket(val, market);
                return (
                  <button
                    key={`${val.currencyCode}-${val.amount}`}
                    type="button"
                    onClick={() => {
                      setIsCustomAmount(false);
                      setPresetAmount(val.amount);
                    }}
                    aria-pressed={isSelected}
                    className={`min-h-12 py-3 px-2 rounded-xl font-bold text-sm sm:text-base border transition-all cursor-pointer text-center ${
                      isSelected
                        ? "bg-gradient-gold text-accent-fg border-transparent font-extrabold shadow-sm"
                        : "border-border/80 text-fg hover:border-fg bg-bg-elevated/40"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-3.5 rounded-xl border border-border/80 bg-bg-elevated/40 text-fg-muted font-bold text-sm">
              Amounts: To be confirmed
            </div>
          )}

          <div className="flex flex-col gap-2 mt-1">
            <button
              type="button"
              onClick={() => setIsCustomAmount(true)}
              aria-pressed={isCustomAmount}
              className={`min-h-11 px-4 py-3 rounded-xl border border-dashed transition-all cursor-pointer flex justify-between items-center text-sm font-bold ${
                isCustomAmount
                  ? "border-accent bg-accent/10 text-fg"
                  : "border-border/80 text-fg hover:border-fg bg-bg-elevated/40"
              }`}
            >
              <span>Custom amount</span>
              <span className="text-xs text-fg-muted">
                Limits: {formattedLimits}
              </span>
            </button>

            {isCustomAmount && (
              <div className="flex flex-col gap-1.5 mt-2">
                <label
                  htmlFor="custom-gift-amount"
                  className="text-xs font-bold text-fg-muted"
                >
                  Enter custom amount
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-fg-muted">
                    {market.currency.symbol}
                  </span>
                  <input
                    id="custom-gift-amount"
                    type="number"
                    min={approvedMinimum ?? 1}
                    max={approvedMaximum}
                    step={1}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="e.g. 75"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-border/80 bg-bg-elevated/60 text-fg text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            )}
          </div>
        </fieldset>

        {/* Step 2: Who is it for? */}
        <fieldset className="p-4 sm:p-6 rounded-2xl border border-border/80 bg-bg-elevated/20 flex flex-col gap-4">
          <legend className="flex items-center gap-2.5 font-extrabold text-base sm:text-lg text-fg">
            <span className="w-6.5 h-6.5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-black">
              2
            </span>
            Who is it for?
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="recipient-name"
                className="text-xs font-bold text-fg-muted"
              >
                Recipient name
              </label>
              <input
                id="recipient-name"
                type="text"
                name="recipientName"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="[Recipient name]"
                className="w-full px-4 py-3 rounded-xl border border-border/80 bg-bg-elevated/60 text-fg text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="recipient-email"
                className="text-xs font-bold text-fg-muted"
              >
                Recipient email
              </label>
              <input
                id="recipient-email"
                type="email"
                name="recipientEmail"
                required
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="name@email.com"
                className="w-full px-4 py-3 rounded-xl border border-border/80 bg-bg-elevated/60 text-fg text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </fieldset>

        {/* Step 3: From */}
        <fieldset className="p-4 sm:p-6 rounded-2xl border border-border/80 bg-bg-elevated/20 flex flex-col gap-4">
          <legend className="flex items-center gap-2.5 font-extrabold text-base sm:text-lg text-fg">
            <span className="w-6.5 h-6.5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-black">
              3
            </span>
            From
          </legend>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="sender-name"
              className="text-xs font-bold text-fg-muted"
            >
              Your name
            </label>
            <input
              id="sender-name"
              type="text"
              name="senderName"
              required
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="[Sender name]"
              className="w-full px-4 py-3 rounded-xl border border-border/80 bg-bg-elevated/60 text-fg text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </fieldset>

        {/* Step 4: Add a message */}
        <fieldset className="p-4 sm:p-6 rounded-2xl border border-border/80 bg-bg-elevated/20 flex flex-col gap-4">
          <legend className="flex items-center gap-2.5 font-extrabold text-base sm:text-lg text-fg">
            <span className="w-6.5 h-6.5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-black">
              4
            </span>
            Add a message
          </legend>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="gift-message"
              className="text-xs font-bold text-fg-muted"
            >
              Message (optional)
            </label>
            <textarea
              id="gift-message"
              name="message"
              rows={3}
              maxLength={300}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a personal note (optional)"
              className="w-full px-4 py-3 rounded-xl border border-border/80 bg-bg-elevated/60 text-fg text-sm focus:outline-none focus:border-accent resize-none"
            />
          </div>
        </fieldset>

        {/* Step 5: When should it arrive? */}
        <fieldset className="p-4 sm:p-6 rounded-2xl border border-border/80 bg-bg-elevated/20 flex flex-col gap-4">
          <legend className="flex items-center gap-2.5 font-extrabold text-base sm:text-lg text-fg">
            <span className="w-6.5 h-6.5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-black">
              5
            </span>
            When should it arrive?
          </legend>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDeliveryMode("today")}
              aria-pressed={deliveryMode === "today"}
              className={`min-h-11 py-2.5 px-4 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                deliveryMode === "today"
                  ? "bg-gradient-gold text-accent-fg border-transparent font-extrabold"
                  : "border-border/80 text-fg hover:border-fg bg-bg-elevated/40"
              }`}
            >
              Send today
            </button>
            <button
              type="button"
              onClick={() => setDeliveryMode("schedule")}
              aria-pressed={deliveryMode === "schedule"}
              className={`min-h-11 py-2.5 px-4 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                deliveryMode === "schedule"
                  ? "bg-gradient-gold text-accent-fg border-transparent font-extrabold"
                  : "border-border/80 text-fg hover:border-fg bg-bg-elevated/40"
              }`}
            >
              Schedule a date
            </button>
          </div>

          {deliveryMode === "schedule" && (
            <div className="flex flex-col gap-1.5 mt-2">
              <label
                htmlFor="delivery-date"
                className="text-xs font-bold text-fg-muted"
              >
                Delivery date
              </label>
              <input
                id="delivery-date"
                type="date"
                name="deliveryDate"
                min={todayIso}
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border/80 bg-bg-elevated/60 text-fg text-sm focus:outline-none focus:border-accent"
              />
              <p className="text-xs text-fg-muted mt-1">
                We email the card on this date. Delivery time: To be confirmed.
              </p>
            </div>
          )}
        </fieldset>

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            tabIndex={-1}
            className="p-3.5 rounded-xl border border-accent/60 bg-accent/10 text-accent font-bold text-sm"
          >
            {errorMessage}
          </div>
        )}

        {/* Success Status */}
        {successId && (
          <div
            role="status"
            className="p-3.5 rounded-xl border border-border bg-bg-elevated/80 text-fg font-bold text-sm"
          >
            Gift card added to cart successfully!
          </div>
        )}

        {/* Quantity and Add to cart CTA */}
        <div className="flex items-center gap-3 mt-2">
          {/* Quantity Controls */}
          <div className="inline-flex items-center border border-border/80 rounded-full px-3 py-1 bg-bg-elevated/40">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="min-h-11 min-w-11 flex items-center justify-center font-bold text-fg hover:text-accent disabled:opacity-30 cursor-pointer"
            >
              −
            </button>
            <span aria-live="polite" className="px-3 font-bold text-sm text-fg">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
              className="min-h-11 min-w-11 flex items-center justify-center font-bold text-fg hover:text-accent cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Add to cart */}
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 min-h-12 py-3 px-6 rounded-full bg-gradient-gold text-accent-fg font-extrabold text-sm sm:text-base hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer shadow-sm text-center disabled:opacity-50"
          >
            {isPending
              ? "Adding..."
              : numericAmount > 0
                ? `Add to cart · ${formattedAmount}`
                : "Add to cart · To be confirmed"}
          </button>
        </div>

        {/* Terms Disclaimer */}
        <div className="text-xs text-fg-muted leading-relaxed mt-2">
          Terms: To be confirmed. Gift cards cannot be used to purchase
          additional gift cards.
        </div>
      </form>
    </div>
  );
}
