"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { CartLineItem, CartProvider } from "@/lib/providers/client";
import { useMarket } from "@/lib/market/context";
import { formatMoneyWithMarket } from "@/lib/market/formatter";

export interface CartDrawerItemProps {
  item: CartLineItem;
  cartProvider: CartProvider;
}

export function CartDrawerItem({ item, cartProvider }: CartDrawerItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const { market } = useMarket();

  const isSubscription = Boolean(item.sellingPlanId);
  // Desconto vem do plano no catálogo (via linha), nunca fixo aqui
  const discount = item.subscriptionDiscountPercentage;

  // Deriva o slug / handle para buscar o selling plan adequado
  const handleOrSlug = item.product.handle || item.product.id || "";
  const planPrefix = handleOrSlug.replace(/-/g, "_");
  const defaultSellingPlanId = `plan_${planPrefix}_30d`;

  const handleQuantityChange = async (newQuantity: number) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      if (newQuantity <= 0) {
        await cartProvider.removeLines([item.id]);
      } else {
        await cartProvider.updateLines([
          { id: item.id, quantity: newQuantity },
        ]);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await cartProvider.removeLines([item.id]);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSwitchToSubscription = async (planId?: string) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const chosenPlan = planId || defaultSellingPlanId;
      await cartProvider.setLineSellingPlan(item.id, chosenPlan);
      setShowPlanSelector(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSwitchToOneTime = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await cartProvider.setLineSellingPlan(item.id, null);
      setShowPlanSelector(false);
    } finally {
      setIsUpdating(false);
    }
  };

  // Preço sem plano vem da linha (catálogo), sem desconto escrito no código
  const originalTotalPrice = item.compareAtPrice
    ? {
        amount: Number((item.compareAtPrice.amount * item.quantity).toFixed(2)),
        currencyCode: item.compareAtPrice.currencyCode,
      }
    : null;

  return (
    <div className="flex gap-3.5 py-4.5 border-b border-border/40">
      {/* Thumbnail */}
      <div className="w-20 h-20 sm:w-21 sm:h-21 rounded-card bg-bg-elevated border border-border/30 flex items-center justify-center shrink-0 overflow-hidden relative">
        {item.product.image ? (
          <Image
            src={item.product.image}
            alt={item.product.title}
            width={80}
            height={80}
            className="w-full h-full object-contain p-1"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-2 text-center text-xs font-bold text-fg-muted">
            <span className="uppercase tracking-wider text-[10px] text-accent">
              {item.product.line}
            </span>
            <span className="truncate max-w-[70px]">{item.product.title}</span>
          </div>
        )}
      </div>

      {/* Info & Controls */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-archivo font-extrabold text-base sm:text-lg leading-tight uppercase text-fg">
              {item.product.title}
            </h3>
            <p className="text-xs text-fg-muted mt-0.5 capitalize">
              {item.kit ? "Kit" : `${item.product.line} routine`}
            </p>
            {item.kit && (
              <ul
                aria-label={`Items in ${item.kit.name}`}
                className="text-xs text-fg-muted mt-1 space-y-0.5"
              >
                {item.kit.items.map((kitItem) => (
                  <li key={kitItem.title}>
                    {kitItem.quantity}× {kitItem.title}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="text-right shrink-0">
            <div className="font-bold text-sm sm:text-base text-fg">
              {formatMoneyWithMarket(item.total, market)}
            </div>
            {isSubscription && originalTotalPrice && (
              <div className="text-xs text-fg-muted line-through">
                {formatMoneyWithMarket(originalTotalPrice, market)}
              </div>
            )}
          </div>
        </div>

        {/* Subscription / One-time status badge */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {isSubscription ? (
            <span className="inline-block bg-accent/15 text-accent border border-accent/20 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide">
              Subscribe &amp; save {discount}%
            </span>
          ) : (
            <span className="inline-block bg-fg/10 text-fg rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide">
              One-time purchase
            </span>
          )}
        </div>

        {/* Action link: Change or Switch to subscription. Kit lines have no selling plans in the catalog yet, so the switch is hidden. */}
        {!item.kit && discount !== undefined && (
          <div className="text-xs text-fg-muted mt-1.5 flex flex-wrap items-center gap-2">
            {isSubscription ? (
              <>
                <span>↻ Delivered every 30 days</span>
                <button
                  type="button"
                  onClick={() => setShowPlanSelector((prev) => !prev)}
                  aria-expanded={showPlanSelector}
                  aria-label={`Change subscription frequency for ${item.product.title}`}
                  className="underline hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded transition-colors cursor-pointer min-h-[30px] inline-flex items-center"
                >
                  Change
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => handleSwitchToSubscription()}
                aria-label={`Switch ${item.product.title} to subscription and save ${discount}%`}
                className="underline text-fg hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded transition-colors cursor-pointer min-h-[30px] inline-flex items-center"
              >
                Switch to subscription, save {discount}%
              </button>
            )}
          </div>
        )}

        {/* Frequência dropdown / selector acessível se clicou em Change */}
        {showPlanSelector && (
          <div className="mt-2 p-2.5 rounded-lg bg-bg-elevated border border-border/50 text-xs space-y-2">
            <p className="font-bold text-fg">Select delivery schedule:</p>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handleSwitchToSubscription(`plan_${planPrefix}_30d`)
                }
                className="text-left px-2 py-1.5 rounded hover:bg-fg/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent flex items-center justify-between"
              >
                <span>Delivery every 30 days ({discount}% off)</span>
                <span className="text-accent font-bold">Standard</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSwitchToSubscription(`plan_${planPrefix}_60d`)
                }
                className="text-left px-2 py-1.5 rounded hover:bg-fg/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Delivery every 60 days ({discount}% off)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSwitchToSubscription(`plan_${planPrefix}_90d`)
                }
                className="text-left px-2 py-1.5 rounded hover:bg-fg/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Delivery every 90 days ({discount}% off)
              </button>
              <button
                type="button"
                onClick={handleSwitchToOneTime}
                className="text-left px-2 py-1.5 rounded text-fg-muted hover:text-fg hover:bg-fg/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent border-t border-border/30 pt-2"
              >
                Switch to One-time purchase
              </button>
            </div>
          </div>
        )}

        {/* Quantity Controls and Remove Link */}
        <div className="flex justify-between items-center mt-2.5">
          <div className="inline-flex items-center border border-border/50 rounded-full h-8 font-bold text-sm bg-bg">
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleQuantityChange(item.quantity - 1)}
              aria-label={`Decrease quantity of ${item.product.title}`}
              className="w-8 h-8 flex items-center justify-center text-fg-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full transition-colors cursor-pointer select-none"
            >
              −
            </button>
            <span
              className="min-w-5 text-center text-xs font-bold text-fg select-none px-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {item.quantity}
            </span>
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleQuantityChange(item.quantity + 1)}
              aria-label={`Increase quantity of ${item.product.title}`}
              className="w-8 h-8 flex items-center justify-center text-fg-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full transition-colors cursor-pointer select-none"
            >
              +
            </button>
          </div>

          <button
            type="button"
            disabled={isUpdating}
            onClick={handleRemove}
            aria-label={`Remove ${item.product.title} from cart`}
            className="text-xs text-fg-muted hover:text-fg underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded transition-colors cursor-pointer min-h-[44px] min-w-[44px] inline-flex items-center justify-end"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
