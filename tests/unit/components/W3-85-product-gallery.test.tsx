// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Gallery } from "@/app/(human)/human/products/[slug]/_components/gallery";
import type { Product } from "@/lib/contracts/catalog";

const product = {
  name: "Test product",
  images: ["/test.png"],
} as Product;

describe("Product gallery keyboard tabs", () => {
  afterEach(cleanup);

  it("uses one tab stop and moves selection and focus with arrow keys", () => {
    render(<Gallery product={product} />);
    const tabs = screen.getAllByRole("tab");

    expect(tabs[0].getAttribute("tabindex")).toBe("0");
    expect(tabs.slice(1).every((tab) => tab.getAttribute("tabindex") === "-1")).toBe(true);

    tabs[0].focus();
    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(document.activeElement).toBe(tabs[1]);
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(tabs[0].getAttribute("tabindex")).toBe("-1");

    fireEvent.keyDown(tabs[1], { key: "ArrowLeft" });
    expect(document.activeElement).toBe(tabs[0]);
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
  });
});
