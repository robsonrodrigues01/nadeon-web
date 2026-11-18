"use client";

import React, { useSyncExternalStore } from "react";
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

const STABLE_TIME_LEFT: TimeValues = {
  days: "00",
  hours: "00",
  minutes: "00",
  seconds: "00",
  isExpired: false,
};

function subscribeToClock(callback: () => void): () => void {
  const timer = setInterval(callback, 1000);
  return () => clearInterval(timer);
}

function getClientClock(): number {
  return Date.now();
}

function getServerClock(): number | null {
  return null;
}

export function CountdownTimer({
  countdownEnd,
  line = "human",
  now,
  className = "",
}: CountdownTimerProps) {
  const clientNow = useSyncExternalStore(
    subscribeToClock,
    getClientClock,
    getServerClock
  );

  const currentNow = now ? new Date(now).getTime() : clientNow;
  const timeLeft =
    currentNow !== null
      ? computeTimeLeft(countdownEnd, currentNow)
      : STABLE_TIME_LEFT;

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
