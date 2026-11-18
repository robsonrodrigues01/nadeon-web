import { describe, expect, it } from "vitest";
import { checkCode } from "../../scripts/check-tokens.mjs";

describe("check-tokens", () => {
  it("does not flag anchors or IDs that look like hex", () => {
    const code = `
      export default function TestComponent() {
        return (
          <div>
            <a href="#add-pet">Add pet</a>
            <a href="#feed">Feed guide</a>
            <a href="#beef-formula">Beef formula</a>
            <div id="add-pet">Add pet section</div>
            <section id="feed">Feed section</section>
            <a href="/account/settings#addresses">Addresses</a>
          </div>
        );
      }
    `;

    const issues = checkCode(code, "test-component.tsx");
    expect(issues).toEqual([]);
  });

  it("does not flag SVG gradient references or non-color hashes", () => {
    const code = `
      export default function SvgComponent() {
        return (
          <svg>
            <path fill="url(#feed)" />
            <path fill="url(#add-pet)" />
            <p>Order #{123}</p>
            <p>Reference #{456}</p>
          </svg>
        );
      }
    `;

    const issues = checkCode(code, "test-component.tsx");
    expect(issues).toEqual([]);
  });

  it("flags hex colors in style properties, SVG attributes, and Tailwind classes", () => {
    const code = `
      export default function ColorComponent() {
        return (
          <div style={{ color: "#ffffff", backgroundColor: "#2a1710" }}>
            <span className="text-[#ff0000] bg-[#e0a63c]">Alert</span>
            <svg>
              <path fill="#000000" stroke="#123456" />
              <stop stopColor="#ffc35a" />
            </svg>
          </div>
        );
      }
    `;

    const issues = checkCode(code, "test-component.tsx");
    const hexes = issues.map((i) => i.hex);
    expect(hexes).toContain("#ffffff");
    expect(hexes).toContain("#2a1710");
    expect(hexes).toContain("#ff0000");
    expect(hexes).toContain("#e0a63c");
    expect(hexes).toContain("#000000");
    expect(hexes).toContain("#123456");
    expect(hexes).toContain("#ffc35a");
  });

  it("flags only the color when an anchor and a color appear on the same line", () => {
    const code = `
      export default function MixedComponent() {
        return <a href="#add-pet" className="text-[#ff0000]">Add pet</a>;
      }
    `;

    const issues = checkCode(code, "test-component.tsx");
    expect(issues).toHaveLength(1);
    expect(issues[0].hex).toBe("#ff0000");
  });

  it("flags CSS color property declarations", () => {
    const css = `
      .custom-card {
        color: #ffffff;
        background: #16100c;
        border: 1px solid #e0a63c;
      }
    `;

    const issues = checkCode(css, "styles.css");
    const hexes = issues.map((i) => i.hex);
    expect(hexes).toContain("#ffffff");
    expect(hexes).toContain("#16100c");
    expect(hexes).toContain("#e0a63c");
  });
});
