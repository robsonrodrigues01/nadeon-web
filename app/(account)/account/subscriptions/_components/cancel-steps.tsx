import { Button } from "@/components/ui/button";
import type {
  Subscription,
  SubscriptionCapabilities,
} from "@/lib/contracts/subscription";
import { CANCEL_REASONS } from "./cancel-reasons";
import {
  addDays,
  formatShortDate,
  nextLongerInterval,
  productTitle,
} from "./format";
import {
  cancelSubscription,
  changeSubscriptionFrequency,
  skipSubscription,
} from "./subscription-actions";

interface CancelStepsProps {
  subscription: Subscription;
  capabilities: SubscriptionCapabilities;
  locale: string;
}

const stepHeading = "text-xs font-bold uppercase tracking-widest text-accent";
const sectionClass =
  "flex flex-col gap-4 rounded-card border border-border bg-bg p-5 shadow-card md:p-7";

/**
 * The three steps of the cancel flow on one page, as in the design.
 * Every action is a server action, so the flow works without client JavaScript.
 */
export function CancelSteps({
  subscription,
  capabilities,
  locale,
}: CancelStepsProps) {
  const title = productTitle(subscription.lines);
  const nextDelivery = formatShortDate(subscription.nextBillingDate, locale);
  const deliveryAfter = formatShortDate(
    addDays(subscription.nextBillingDate, subscription.intervalDays),
    locale
  );
  const longerInterval =
    capabilities.canChangeFrequency && subscription.status === "active"
      ? nextLongerInterval(
          subscription.intervalDays,
          capabilities.allowedIntervalDays
        )
      : undefined;
  const canSkip = capabilities.canSkip && subscription.status === "active";

  return (
    <form action={cancelSubscription} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={subscription.id} />

      <section aria-labelledby="cancel-step-reason" className={sectionClass}>
        <p id="cancel-step-reason" className={stepHeading}>
          Step 1 · Why are you canceling?
        </p>
        <p className="text-sm text-fg-muted">
          Your answer helps us improve. Pick one.
        </p>
        <fieldset className="flex flex-col gap-4">
          <legend className="sr-only">Why are you canceling?</legend>
          <div className="grid gap-2 md:grid-cols-2">
            {CANCEL_REASONS.map((reason) => (
              <label
                key={reason}
                className="flex min-h-11 cursor-pointer items-center gap-3 rounded-field border border-border p-4 text-base text-fg"
              >
                <input
                  type="radio"
                  name="reason"
                  value={reason}
                  required
                  className="h-5 w-5 shrink-0 accent-accent"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="cancel-feedback"
              className="text-sm font-bold text-fg"
            >
              Anything else? (optional)
            </label>
            <textarea
              id="cancel-feedback"
              name="feedback"
              rows={3}
              placeholder="Tell us more…"
              className="w-full rounded-field border border-border bg-bg p-4 text-base text-fg placeholder:text-fg-muted"
            />
          </div>
        </fieldset>
      </section>

      <section aria-labelledby="cancel-step-offers" className={sectionClass}>
        <p id="cancel-step-offers" className={stepHeading}>
          Step 2 · Before you go
        </p>
        <h2 className="font-archivo text-2xl font-extrabold leading-tight text-fg">
          Would one of these work better?
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {canSkip ? (
            <div className="flex flex-col gap-3 rounded-card border border-border p-5">
              <h3 className="font-archivo text-xl font-extrabold text-fg">
                Skip a month
              </h3>
              <p className="text-sm text-fg-muted">
                Keep your plan and skip the {nextDelivery} delivery. Next charge
                moves to {deliveryAfter}.
              </p>
              <div className="mt-auto pt-2">
                <Button
                  type="submit"
                  formAction={skipSubscription}
                  formNoValidate
                  variant="primary"
                  size="sm"
                >
                  Skip next delivery
                </Button>
              </div>
            </div>
          ) : null}
          {longerInterval !== undefined ? (
            <div className="flex flex-col gap-3 rounded-card border border-border p-5">
              <h3 className="font-archivo text-xl font-extrabold text-fg">
                Switch to every {longerInterval} days
              </h3>
              <p className="text-sm text-fg-muted">Same formula, less often.</p>
              <div className="mt-auto pt-2">
                <Button
                  type="submit"
                  formAction={changeSubscriptionFrequency}
                  formNoValidate
                  name="intervalDays"
                  value={String(longerInterval)}
                  variant="primary"
                  size="sm"
                >
                  Switch to {longerInterval} days
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="cancel-step-confirm" className={sectionClass}>
        <p id="cancel-step-confirm" className={stepHeading}>
          Step 3 · Confirm
        </p>
        <h2 className="font-archivo text-2xl font-extrabold leading-tight text-fg">
          Still want to cancel?
        </h2>
        <p className="text-sm leading-relaxed text-fg-muted">
          Your {title} subscription ends now. No more charges after today.
          Orders already placed will still ship. You can restart anytime from
          your account.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/account/subscriptions" variant="primary">
            Keep my subscription
          </Button>
          <Button
            type="submit"
            variant="secondary"
            className="border-product-coral text-product-coral"
          >
            Cancel subscription
          </Button>
        </div>
      </section>
    </form>
  );
}
