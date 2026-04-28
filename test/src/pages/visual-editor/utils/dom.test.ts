/**
 * @vitest-environment jsdom
 */
import { beforeAll, describe, expect, it } from "vitest";
import { buildDomPath, buildElementSelector, createSnapshot, isElementNode, resolveInspectableElement } from "./dom";

beforeAll(() => {
  // jsdom does not implement CSS.escape
  if (typeof globalThis.CSS === "undefined") {
    globalThis.CSS = { escape: (value: string) => value.replace(/([^\w-])/g, "\\$1") } as typeof CSS;
  }
});

// Minimal DOM element mock helpers
const createElement = (tagName: string, attrs: Record<string, string> = {}, parent?: HTMLElement): HTMLElement => {
  const el = document.createElement(tagName);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "id") {
      el.id = value;
    } else {
      el.setAttribute(key, value);
    }
  }
  if (parent) {
    parent.appendChild(el);
  }
  return el;
};

describe("isElementNode", () => {
  it("returns true for an HTMLElement", () => {
    expect(isElementNode(document.createElement("div"))).toBe(true);
  });

  it("returns false for null", () => {
    expect(isElementNode(null)).toBe(false);
  });

  it("returns false for a text node", () => {
    const text = document.createTextNode("hello");
    expect(isElementNode(text)).toBe(false);
  });
});

describe("buildElementSelector", () => {
  it("returns ID selector when element has an id", () => {
    const el = createElement("div", { id: "my-id" });
    expect(buildElementSelector(el)).toBe("#my-id");
  });

  it("returns data-testid selector when present", () => {
    const parent = createElement("div");
    const child = createElement("span", { "data-testid": "my-test" }, parent);
    expect(buildElementSelector(child)).toBe('[data-testid="my-test"]');
  });

  it("builds nth-of-type selector chain for elements without id or testid", () => {
    const body = document.createElement("body");
    const div = createElement("div", {}, body);
    const span = createElement("span", {}, div);

    const selector = buildElementSelector(span);
    expect(selector).toContain("span:nth-of-type(1)");
  });
});

describe("buildDomPath", () => {
  it("includes tag names in the path", () => {
    const div = createElement("div");
    const span = createElement("span", {}, div);
    const path = buildDomPath(span);
    expect(path).toContain("div");
    expect(path).toContain("span");
  });

  it("includes id when present", () => {
    const div = createElement("div", { id: "container" });
    const path = buildDomPath(div);
    expect(path).toContain("#container");
  });

  it("includes role when present", () => {
    const div = createElement("div", { role: "button" });
    const path = buildDomPath(div);
    expect(path).toContain('[role="button"]');
  });
});

describe("resolveInspectableElement", () => {
  it("returns null for null target", () => {
    expect(resolveInspectableElement(null)).toBeNull();
  });

  it("returns null for non-element target", () => {
    expect(resolveInspectableElement(document.createTextNode("text"))).toBeNull();
  });

  it("skips body element", () => {
    const body = document.createElement("body");
    expect(resolveInspectableElement(body)).toBeNull();
  });

  it("resolves a regular div element", () => {
    const div = createElement("div");
    div.textContent = "hello";
    expect(resolveInspectableElement(div)).toBe(div);
  });

  it("traverses up from SVG elements", () => {
    const wrapper = createElement("div");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    wrapper.appendChild(svg);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svg.appendChild(path);

    // path -> svg -> wrapper (div)
    const result = resolveInspectableElement(path);
    // Should skip path and svg, land on wrapper
    expect(result).toBeTruthy();
    if (!result) {
      throw new Error("Expected inspectable element");
    }
    expect(result.tagName.toLowerCase()).not.toBe("path");
  });

  it("returns null for elements inside app sidebar (data-sidebar)", () => {
    const sidebar = createElement("nav", { "data-sidebar": "" });
    const link = createElement("a", {}, sidebar);
    expect(resolveInspectableElement(link)).toBeNull();
  });
});

describe("createSnapshot", () => {
  it("returns null for null element", () => {
    expect(createSnapshot(null)).toBeNull();
  });

  it("creates snapshot with expected properties", () => {
    const el = createElement("button", { role: "button", "aria-label": "Submit" });
    el.textContent = "Click me";
    document.body.appendChild(el);

    const snapshot = createSnapshot(el);
    expect(snapshot).not.toBeNull();
    if (!snapshot) {
      throw new Error("Expected snapshot");
    }
    expect(snapshot.tagName).toBe("button");
    expect(snapshot.role).toBe("button");
    expect(snapshot.ariaLabel).toBe("Submit");
    expect(snapshot.textSnippet).toContain("Click me");
    expect(snapshot.box).toHaveProperty("width");
    expect(snapshot.box).toHaveProperty("height");
    expect(snapshot.selector).toBeTruthy();
    expect(snapshot.domPath).toBeTruthy();
    expect(snapshot.htmlSnippet).toContain("<button");

    document.body.removeChild(el);
  });

  it("truncates long text snippets", () => {
    const el = createElement("div");
    el.textContent = "a".repeat(500);
    document.body.appendChild(el);

    const snapshot = createSnapshot(el);
    if (!snapshot) {
      throw new Error("Expected snapshot");
    }
    expect(snapshot.textSnippet.length).toBeLessThanOrEqual(240);

    document.body.removeChild(el);
  });
});
