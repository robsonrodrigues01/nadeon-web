import { describe, it, expect } from "vitest";
import { checkCode } from "../../scripts/check-placeholders.mjs";

describe("check-placeholders", () => {
  it("does not flag arbitrary Tailwind classes in className or attributes", () => {
    const code = `
      export default function TestComponent() {
        return (
          <div className="h-14 text-[10px] text-[var(--accent-fg)] min-w-[200px]">
            Valid Content
          </div>
        );
      }
    `;

    const issues = checkCode(code, "test-component.tsx");
    expect(issues).toEqual([]);
  });

  it("flags unreplaced placeholder [X] in rendered JSX text", () => {
    const code = `
      export default function TestComponent() {
        return <div>[X]</div>;
      }
    `;

    const issues = checkCode(code, "test-component.tsx");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].text).toContain("[X]");
    expect(issues[0].pattern).toBe("bracket [");
  });

  it("flags unreplaced placeholder [X] in JSX expression children", () => {
    const code = `
      export default function TestComponent() {
        return <div>{"[X]"}</div>;
      }
    `;

    const issues = checkCode(code, "test-component.tsx");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].text).toContain("[X]");
  });

  it("flags $XX and (example) in rendered text", () => {
    const code = `
      export default function TestComponent() {
        return (
          <div>
            <span>Price: $XX</span>
            <p>Description: (example)</p>
          </div>
        );
      }
    `;

    const issues = checkCode(code, "test-component.tsx");
    expect(issues.length).toBe(2);
    expect(issues[0].text).toContain("$XX");
    expect(issues[1].text).toContain("(example)");
  });
});
