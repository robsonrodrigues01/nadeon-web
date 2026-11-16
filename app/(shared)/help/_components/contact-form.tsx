"use client";

import React, { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { sendContactMessage, type ContactState } from "./actions";

interface ContactFormProps {
  topics: readonly string[];
}

const initialState: ContactState = { status: "idle" };

const fieldClass =
  "min-h-11 w-full rounded-field border border-border bg-bg px-4 py-3 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function ContactForm({ topics }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    initialState
  );
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.status === "invalid" || state.status === "error")
      statusRef.current?.focus();
  }, [state.status]);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-name" className="text-sm font-bold text-fg">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Your name"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-email" className="text-sm font-bold text-fg">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-order" className="text-sm font-bold text-fg">
          Order number (optional)
        </label>
        <input
          id="contact-order"
          name="orderNumber"
          type="text"
          autoComplete="off"
          placeholder="e.g. NL-100234"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-topic" className="text-sm font-bold text-fg">
          Topic
        </label>
        <select
          id="contact-topic"
          name="topic"
          required
          defaultValue=""
          className={fieldClass}
        >
          <option value="" disabled>
            Choose a topic
          </option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="text-sm font-bold text-fg">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="How can we help?"
          className={`${fieldClass} min-h-32`}
        />
      </div>

      <label className="flex min-h-11 items-center gap-3 text-sm text-fg-muted">
        <input type="checkbox" name="copy" className="size-5 accent-accent" />
        Send me a copy of this message
      </label>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Sending..." : "Send message"}
      </Button>

      <p
        ref={statusRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="text-sm text-fg-muted"
      >
        {state.status === "sent" && "Message sent."}
        {state.status === "invalid" &&
          "Check the highlighted fields and try again."}
        {state.status === "error" && "Message not sent. Try again."}
      </p>
    </form>
  );
}
