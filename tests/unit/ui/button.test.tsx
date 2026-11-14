import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { Button } from "@/components/ui/button";

describe("Button component", () => {
  it("renders a standard button with primary variant and type button by default", () => {
    const html = renderToString(<Button>Shop best sellers</Button>);
    expect(html).toContain("<button");
    expect(html).toContain('type="button"');
    expect(html).toContain("Shop best sellers");
    expect(html).toContain("bg-gradient-gold");
    expect(html).toContain("min-h-11");
  });

  it("renders secondary variant with outline styling", () => {
    const html = renderToString(
      <Button variant="secondary">Take the quiz</Button>
    );
    expect(html).toContain("<button");
    expect(html).toContain("Take the quiz");
    expect(html).toContain("border-2");
  });

  it("renders link variant", () => {
    const html = renderToString(
      <Button variant="link">See Supplement Facts</Button>
    );
    expect(html).toContain("<button");
    expect(html).toContain("See Supplement Facts");
    expect(html).toContain("underline");
  });

  it("renders an anchor tag when href is provided", () => {
    const html = renderToString(
      <Button href="/quiz" variant="secondary">
        Start Quiz
      </Button>
    );
    expect(html).toContain("<a");
    expect(html).toContain('href="/quiz"');
    expect(html).toContain("Start Quiz");
  });

  it("supports disabled state on button element", () => {
    const html = renderToString(<Button disabled>Sold out</Button>);
    expect(html).toContain("<button");
    expect(html).toContain("disabled");
    expect(html).toContain("opacity-50");
  });

  it("renders loading state with spinner and accessibility attributes", () => {
    const html = renderToString(
      <Button isLoading loadingText="Adding...">
        Add to cart
      </Button>
    );
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("disabled");
    expect(html).toContain("Adding...");
    expect(html).toContain('aria-hidden="true"');
  });
});
