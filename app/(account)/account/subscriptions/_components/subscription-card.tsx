import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import type { Market } from "@/lib/market/types";
import type {
  Subscription,
  SubscriptionCapabilities,
} from "@/lib/contracts/subscription";
import {
  formatShortDate,
  productTitle,
  shipsTo,
  totalQuantity,
} from "./format";
import { pauseSubscription, skipSubscription } from "./subscription-actions";

interface SubscriptionCardProps {
  subscription: Subscription;
  capabilities: SubscriptionCapabilities;
  market: Market;
}

const STATUS_LABEL: Record<Subscription["status"], string> = {
  active: "Active",
  paused: "Paused",
  cancelled: "Cancelled",
};

const dtClass = "text-xs font-bold uppercase tracking-wider text-fg-muted";
const ddClass = "mt-1 text-base font-bold text-fg";

export function SubscriptionCard({
  subscription,
  capabilities,
  market,
}: SubscriptionCardProps) {
  const { lines } = subscription;
  const title = productTitle(lines);
  const image = lines.find((line) => line.image)?.image;
  const isActive = subscription.status === "active";
  const headingId = `subscription-${subscription.id}`;
  const locale = market.locale;
  const shipsToLabel = shipsTo(subscription.deliveryAddress);

  return (
    <article
      aria-labelledby={headingId}
      className="flex min-w-0 flex-col gap-6 rounded-card border border-border bg-bg p-5 shadow-card md:flex-row md:p-7"
    >
      <div className="flex h-40 shrink-0 items-center justify-center overflow-hidden rounded-card bg-gradient-sunrise md:h-56 md:w-56">
        {image ? (
          <Image
            src={image}
            alt={title}
            width={224}
            height={224}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
          <h2
            id={headingId}
            className="min-w-0 flex-1 break-words font-archivo text-2xl font-extrabold leading-tight text-fg md:text-3xl"
          >
            {title}
          </h2>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold text-fg">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-accent"
            />
            {STATUS_LABEL[subscription.status]}
          </span>
        </div>

        <p className="flex flex-wrap items-baseline gap-2">
          <span className="font-archivo text-2xl font-extrabold text-fg md:text-3xl">
            {formatMoneyWithMarket(subscription.estimatedTotal, market)}
          </span>
          <span className="text-xs text-fg-muted">per delivery</span>
        </p>

        <dl className="grid min-w-0 grid-cols-2 gap-4 border-y border-border py-4 lg:grid-cols-4">
          <div className="min-w-0">
            <dt className={dtClass}>Next charge</dt>
            <dd className={ddClass}>
              {formatShortDate(subscription.nextBillingDate, locale)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className={dtClass}>Frequency</dt>
            <dd className={ddClass}>Every {subscription.intervalDays} days</dd>
          </div>
          <div className="min-w-0">
            <dt className={dtClass}>Quantity</dt>
            <dd className={ddClass}>{totalQuantity(lines)}</dd>
          </div>
          {shipsToLabel ? (
            <div>
              <dt className={dtClass}>Ships to</dt>
              <dd className={ddClass}>{shipsToLabel}</dd>
            </div>
          ) : null}
        </dl>

        <div className="flex flex-wrap gap-2">
          {isActive && capabilities.canSkip ? (
            <form action={skipSubscription}>
              <input type="hidden" name="id" value={subscription.id} />
              <Button type="submit" variant="secondary" size="sm">
                Skip next
              </Button>
            </form>
          ) : null}
          {capabilities.canReschedule ? (
            <Button type="button" variant="secondary" size="sm" disabled>
              Change date
            </Button>
          ) : null}
          {capabilities.canChangeFrequency ? (
            <Button type="button" variant="secondary" size="sm" disabled>
              Change frequency
            </Button>
          ) : null}
          {capabilities.canSwapProduct ? (
            <Button type="button" variant="secondary" size="sm" disabled>
              Swap product
            </Button>
          ) : null}
          {capabilities.canChangeQuantity ? (
            <Button type="button" variant="secondary" size="sm" disabled>
              Edit quantity
            </Button>
          ) : null}
          {isActive && capabilities.canPause ? (
            <form action={pauseSubscription}>
              <input type="hidden" name="id" value={subscription.id} />
              <Button type="submit" variant="secondary" size="sm">
                Pause
              </Button>
            </form>
          ) : null}
        </div>

        {capabilities.canCancel && subscription.status !== "cancelled" ? (
          <div className="min-w-0">
            <Button
              href={`/account/subscriptions/${encodeURIComponent(subscription.id)}/cancel`}
              variant="link"
              size="sm"
              className="text-product-coral"
            >
              Cancel subscription
            </Button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
