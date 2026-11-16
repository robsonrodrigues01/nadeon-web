"use client";

import { useActionState, useState } from "react";
import type { CustomerProfile } from "@/lib/contracts/account";
import { Button } from "@/components/ui/button";
import {
  submitPrivacyRequest,
  type PrivacyFormState,
} from "../../../../(shared)/legal/do-not-sell/_components/actions";

interface DeleteAccountProps {
  customer: CustomerProfile;
}

export function DeleteAccount({ customer }: DeleteAccountProps) {
  const initialState: PrivacyFormState = { status: "idle" };
  const [state, formAction, isPending] = useActionState(
    submitPrivacyRequest,
    initialState
  );
  const [confirming, setConfirming] = useState(false);

  if (state.status === "success") {
    return (
      <section
        aria-labelledby="delete-account-heading"
        className="flex flex-col gap-4 rounded-card border border-border p-6 sm:p-7"
      >
        <h2 id="delete-account-heading" className="font-bold text-fg">
          Deletion request received
        </h2>
        <p
          className="text-sm leading-relaxed text-fg/70"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          We received your account deletion request. We will verify your
          identity before processing it. Reference #{state.id}.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="delete-account-heading"
      className="flex flex-col gap-4 rounded-card border border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7"
    >
      <div>
        <h2 id="delete-account-heading" className="font-bold text-fg">
          Delete account
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-fg/70">
          Cancels active subscriptions and permanently removes your profile and
          addresses. Order records we must keep by law are retained.
        </p>
      </div>
      <Button
        type="button"
        variant="link"
        className="shrink-0"
        aria-haspopup="dialog"
        onClick={() => setConfirming(true)}
      >
        Request account deletion
      </Button>

      {confirming ? (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-account-dialog-title"
          aria-describedby="delete-account-dialog-description"
          className="fixed inset-0 z-50 flex items-center justify-center bg-fg/50 p-4"
        >
          <form
            action={formAction}
            className="w-full max-w-lg space-y-5 rounded-card border border-border bg-bg-elevated p-6 shadow-card"
          >
            <h3
              id="delete-account-dialog-title"
              className="font-archivo text-xl font-extrabold text-fg"
            >
              Confirm account deletion request
            </h3>
            <p
              id="delete-account-dialog-description"
              className="text-sm leading-relaxed text-fg-muted"
            >
              We will send a request to delete your account information and
              verify your identity before processing it.
            </p>
            <input type="hidden" name="email" value={customer.email} />
            <input type="hidden" name="firstName" value={customer.firstName} />
            <input type="hidden" name="lastName" value={customer.lastName} />
            <input type="hidden" name="requestType" value="delete" />
            <input type="hidden" name="confirmAccuracy" value="on" />
            {state.status === "error" || state.status === "invalid" ? (
              <p
                role="alert"
                aria-live="assertive"
                className="text-sm text-product-coral"
              >
                {state.error ?? "Unable to submit request. Please try again."}
              </p>
            ) : null}
            <div className="flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                disabled={isPending}
                onClick={() => setConfirming(false)}
              >
                Keep my account
              </Button>
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? "Sending..." : "Confirm deletion"}
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
