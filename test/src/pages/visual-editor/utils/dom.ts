import type { ElementSnapshot } from "../types";
import { compressWhitespace, truncate } from "./format";

export const isElementNode = (value: EventTarget | Node | null): value is HTMLElement =>
  value !== null && typeof value === "object" && "nodeType" in value && value.nodeType === Node.ELEMENT_NODE;

export const buildElementSelector = (element: HTMLElement) => {
  if (element.id) {
    return `#${CSS.escape(element.id)}`;
  }

  const segments: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current.tagName.toLowerCase() !== "body") {
    const testId = current.getAttribute("data-testid");
    if (testId) {
      segments.unshift(`[data-testid="${testId}"]`);
      break;
    }

    const tagName = current.tagName.toLowerCase();
    const parent: HTMLElement | null = current.parentElement;
    if (!parent) {
      segments.unshift(tagName);
      break;
    }

    const siblings = Array.from(parent.children).filter((child): child is HTMLElement => {
      return isElementNode(child) && child.tagName === current?.tagName;
    });
    const index = siblings.indexOf(current) + 1;
    segments.unshift(`${tagName}:nth-of-type(${index})`);
    current = parent;
  }

  return segments.join(" > ");
};

export const buildDomPath = (element: HTMLElement) => {
  const segments: string[] = [];
  let current: HTMLElement | null = element;

  while (current) {
    const tagName = current.tagName.toLowerCase();
    const role = current.getAttribute("role");
    const idPart = current.id ? `#${current.id}` : "";
    const rolePart = role ? `[role="${role}"]` : "";
    segments.unshift(`${tagName}${idPart}${rolePart}`);

    if (tagName === "body") break;
    current = current.parentElement;
  }

  return segments.join(" > ");
};

const isInsideSharedChrome = (element: HTMLElement) => {
  let current: HTMLElement | null = element;
  while (current) {
    // Aegis Sidebar renders with data-sidebar attribute; also match common shell landmarks
    if (
      current.hasAttribute("data-sidebar") ||
      current.getAttribute("role") === "navigation" ||
      current.tagName.toLowerCase() === "nav"
    ) {
      // Check if the navigation element is the app-level sidebar, not an in-page nav
      const isAppSidebar = current.hasAttribute("data-sidebar") || current.closest("[data-sidebar]") !== null;
      if (isAppSidebar) return true;
    }
    current = current.parentElement;
  }
  return false;
};

export const resolveInspectableElement = (target: EventTarget | null) => {
  if (!isElementNode(target)) {
    return null;
  }

  let current: HTMLElement | null = target;

  while (current) {
    const tagName = current.tagName.toLowerCase();
    if (!["body", "html", "head", "meta", "link", "script", "style"].includes(tagName)) {
      if (["path", "svg", "use"].includes(tagName) && current.parentElement) {
        current = current.parentElement;
        continue;
      }

      // Skip shared app chrome — selections there would point Codex at the wrong file
      if (isInsideSharedChrome(current)) {
        return null;
      }

      return current;
    }

    current = current.parentElement;
  }

  return null;
};

export const createSnapshot = (element: HTMLElement | null): ElementSnapshot | null => {
  if (!element) return null;

  const rect = element.getBoundingClientRect();
  const textSnippet = truncate(compressWhitespace(element.innerText || element.textContent || ""), 240);
  const htmlSnippet = truncate(compressWhitespace(element.outerHTML), 600);

  return {
    ariaLabel: element.getAttribute("aria-label") ?? "",
    box: {
      height: rect.height,
      left: rect.left,
      top: rect.top,
      width: rect.width,
    },
    className: element.className || "",
    domPath: buildDomPath(element),
    htmlSnippet,
    role: element.getAttribute("role") ?? "",
    selector: buildElementSelector(element),
    tagName: element.tagName.toLowerCase(),
    textSnippet,
  };
};
