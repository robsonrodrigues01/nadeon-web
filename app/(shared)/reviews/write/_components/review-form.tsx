"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { submitReviewAction, type ReviewActionState } from "../actions";

const initialState: ReviewActionState = { status: "idle" };
const inputClass =
  "mt-2 min-h-11 w-full rounded-field border border-border bg-bg px-4 py-3 text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function ReviewForm({
  orderId,
  productSlug,
  displayName,
  email,
}: {
  orderId: string;
  productSlug: string;
  displayName: string;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(
    submitReviewAction,
    initialState
  );

  if (state.status === "success") {
    return (
      <section
        aria-labelledby="review-success-heading"
        className="mt-8 rounded-card border border-border bg-bg p-6"
        role="status"
      >
        <h3
          id="review-success-heading"
          className="font-archivo text-3xl font-extrabold uppercase"
        >
          Thanks for your review
        </h3>
        <p className="mt-3 text-fg-muted">
          We check every review before it goes live.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button href="/" size="sm">
            Back to the shop
          </Button>
          <Button href="/account/orders" variant="secondary" size="sm">
            Review another product
          </Button>
        </div>
      </section>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="productSlug" value={productSlug} />
      <fieldset>
        <legend className="font-bold">Overall rating</legend>
        <p className="mt-1 text-sm text-fg-muted">
          Tap a number. 1 is lowest, 5 is highest.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <label
              key={rating}
              className="relative flex size-12 cursor-pointer items-center justify-center rounded-full border border-border has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-accent-fg focus-within:ring-2 focus-within:ring-accent"
            >
              <input
                className="absolute inset-0 size-full cursor-pointer opacity-0"
                type="radio"
                name="rating"
                value={rating}
                required
                aria-label={`${rating} out of 5`}
              />
              <span aria-hidden="true">{rating}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="review-title" className="font-bold">
          Review title
        </label>
        <input
          id="review-title"
          name="title"
          className={inputClass}
          required
          placeholder="Sum it up in a few words"
        />
      </div>
      <div>
        <label htmlFor="review-body" className="font-bold">
          Your review
        </label>
        <textarea
          id="review-body"
          name="body"
          className={`${inputClass} min-h-36`}
          required
          placeholder="What changed in your routine? How was taste, ease and delivery?"
        />
        <p className="mt-2 text-sm text-fg-muted">
          Please describe your own experience only.
        </p>
      </div>
      <p className="text-sm text-fg-muted">
        Add photos (optional): To be confirmed.
      </p>
      <p className="text-sm text-fg-muted">
        Rate the details (optional): To be confirmed.
      </p>
      <div>
        <label htmlFor="review-display-name" className="font-bold">
          Display name
        </label>
        <input
          id="review-display-name"
          name="authorName"
          className={inputClass}
          required
          defaultValue={displayName}
          autoComplete="given-name"
        />
        <p className="mt-1 text-sm text-fg-muted">
          First name + last initial. This name will be shown publicly.
        </p>
      </div>
      <div>
        <label htmlFor="review-email" className="font-bold">
          Email
        </label>
        <input
          id="review-email"
          className={inputClass}
          value={email}
          readOnly
          aria-describedby="review-email-note"
        />
        <p id="review-email-note" className="mt-1 text-sm text-fg-muted">
          Not shown publicly. Used to verify your order.
        </p>
      </div>
      <label className="flex min-h-11 items-start gap-3 text-sm text-fg-muted">
        <input
          className="mt-1 size-5 shrink-0 accent-accent"
          type="checkbox"
          name="ownExperience"
          value="yes"
          required
        />
        <span>I confirm this is my own experience.</span>
      </label>
      <label className="flex min-h-11 items-start gap-3 text-sm text-fg-muted">
        <input
          className="mt-1 size-5 shrink-0 accent-accent"
          type="checkbox"
          name="termsAccepted"
          value="yes"
          required
        />
        <span>
          I accept the{" "}
          <Link href="/legal/terms" className="underline underline-offset-4">
            review terms
          </Link>{" "}
          and permit Nadeon to show my review.
        </span>
      </label>
      {state.message && (
        <p role="alert" className="text-sm text-fg-muted">
          {state.message}
        </p>
      )}
      <Button
        type="submit"
        disabled={pending}
        isLoading={pending}
        className="w-full sm:w-auto"
      >
        {pending ? "Submitting" : "Submit review"}
      </Button>
    </form>
  );
}
