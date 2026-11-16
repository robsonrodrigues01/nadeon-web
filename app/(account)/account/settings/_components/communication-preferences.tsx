"use client";

import React, { useState } from "react";

interface PreferenceItem {
  id: string;
  title: string;
  description: string;
  defaultChecked: boolean;
}

const PREFERENCES: PreferenceItem[] = [
  {
    id: "email-reminders",
    title: "Email: subscription reminders",
    description: "3 days before every charge.",
    defaultChecked: true,
  },
  {
    id: "sms-updates",
    title: "SMS: order and shipping updates",
    description: "Texts when your order ships and arrives.",
    defaultChecked: true,
  },
  {
    id: "sms-marketing",
    title: "SMS: marketing texts",
    description:
      "Flash offers and restock alerts. Msg & data rates may apply. Reply STOP to opt out.",
    defaultChecked: false,
  },
];

export function CommunicationPreferences() {
  const [preferences, setPreferences] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(PREFERENCES.map((p) => [p.id, p.defaultChecked]))
  );

  const toggle = (id: string) => {
    setPreferences((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      aria-labelledby="comm-prefs-heading"
      className="flex flex-col gap-5 rounded-card border border-border bg-bg-elevated p-6 sm:p-7 shadow-card"
    >
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-accent">
          Communication preferences
        </span>
        <h2
          id="comm-prefs-heading"
          className="mt-1 font-archivo text-xl font-extrabold uppercase text-fg sm:text-2xl"
        >
          Notifications
        </h2>
      </div>

      <div className="flex flex-col divide-y divide-border/60">
        {PREFERENCES.map((pref) => {
          const isChecked = !!preferences[pref.id];
          return (
            <div
              key={pref.id}
              className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
            >
              <div className="flex-1">
                <span
                  id={`pref-${pref.id}-label`}
                  className="block text-sm font-bold text-fg sm:text-base"
                >
                  {pref.title}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-fg-muted sm:text-sm">
                  {pref.description}
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isChecked}
                aria-labelledby={`pref-${pref.id}-label`}
                onClick={() => toggle(pref.id)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-pill border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-accent ${
                  isChecked ? "bg-accent" : "bg-fg/20"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-bg shadow-sm transition duration-200 ease-in-out ${
                    isChecked ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
