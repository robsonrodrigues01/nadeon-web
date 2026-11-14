"use client";

import React, { useEffect, useState } from "react";
import type { CountdownTimerProps } from "./types";

interface TimeValues {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
}

function computeTimeLeft(targetDate: string | Date, nowMs: number): TimeValues {
  const target = new Date(targetDate).getTime();
  const diff = Math.max(0, target - nowMs);
  const isExpired = diff <= 0;

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
    isExpired,
  };
}

export function CountdownTimer({
  countdownEnd,
  line = "human",
  now,
  className = "",
}: CountdownTimerProps) {
  const [currentNow, setCurrentNow] = useState<number>(() =>
    now ? new Date(now).getTime() : Date.now()
  );

  useEffect(() => {
    // If now was provided statically and never changes, we still update if fake timers or clock advances
    const timer = setInterval(() => {
      setCurrentNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeLeft = computeTimeLeft(countdownEnd, currentNow);

  const chipStyle =
    line === "human"
      ? "bg-gradient-gold text-accent-fg"
      : "bg-product-amber text-accent-fg";

  return (
    <span
      role="timer"
      aria-label={`Time remaining: ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds`}
      className={`inline-flex items-center gap-1 text-[11px] md:text-xs font-bold ${className}`}
    >
      <span
        className={`rounded px-1.5 py-0.5 tabular-nums leading-none ${chipStyle}`}
      >
        {timeLeft.days}
      </span>
      <span className="opacity-70" aria-hidden="true">
        :
      </span>
      <span
        className={`rounded px-1.5 py-0.5 tabular-nums leading-none ${chipStyle}`}
      >
        {timeLeft.hours}
      </span>
      <span className="opacity-70" aria-hidden="true">
        :
      </span>
      <span
        className={`rounded px-1.5 py-0.5 tabular-nums leading-none ${chipStyle}`}
      >
        {timeLeft.minutes}
      </span>
      <span className="opacity-70" aria-hidden="true">
        :
      </span>
      <span
        className={`rounded px-1.5 py-0.5 tabular-nums leading-none ${chipStyle}`}
      >
        {timeLeft.seconds}
      </span>
    </span>
  );
}
