/**
 * @vitest-environment jsdom
 */
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorPage from "@/app/error";

afterEach(() => cleanup());

describe("W4-31 friendly error page", () => {
  const error = Object.assign(
    new Error("Shopify Storefront 502: upstream token shpat_secret"),
    { digest: "abc123" }
  );

  it("shows a friendly message without leaking error details", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(<ErrorPage error={error} reset={() => {}} />);

    expect(
      screen.getByRole("heading", { level: 1, name: /something went wrong/i })
    ).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/shopify|shpat|502/i);
  });

  it("lets the visitor try again with a real button", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const reset = vi.fn();
    render(<ErrorPage error={error} reset={reset} />);

    await userEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("offers a link back home", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(<ErrorPage error={error} reset={() => {}} />);

    expect(
      screen.getByRole("link", { name: /back to home/i }).getAttribute("href")
    ).toBe("/");
  });
});
