var e=`import { variantClassPattern } from "./constants";
import type { EditableVariantTarget } from "./types";

export const normalizeText = (text: string | null | undefined) => {
  return (text ?? "").replace(/\\s+/g, " ").trim();
};

export const getElementFromTarget = (target: EventTarget | null): HTMLElement | null => {
  if (target instanceof HTMLElement) return target;
  if (target instanceof Node) {
    return target.parentElement;
  }
  return null;
};

export const matchesEditorUi = (element: HTMLElement | null) => {
  return !!element?.closest("[data-aegis-editor-ui='true']");
};

export const extractVariantFromElement = (element: HTMLElement): string | null => {
  for (const className of Array.from(element.classList)) {
    const matched = className.match(variantClassPattern);
    if (matched?.[1]) {
      return matched[1];
    }
  }
  return null;
};

export const findPickElement = (target: EventTarget | null): HTMLElement | null => {
  let current: HTMLElement | null = getElementFromTarget(target);
  while (current) {
    if (extractVariantFromElement(current)) {
      return current;
    }
    const text = normalizeText(current.textContent);
    if (text.length > 0 && text.length < 400) {
      return current;
    }
    current = current.parentElement;
  }

  const fallbackElement = getElementFromTarget(target);
  return fallbackElement?.closest("button, [role='button'], p, span, div") ?? null;
};

export const findTargetByIdentity = (
  targets: EditableVariantTarget[],
  reference: EditableVariantTarget,
): EditableVariantTarget | null => {
  const byOpenPosition = targets.find(
    (candidate) =>
      candidate.componentName === reference.componentName &&
      candidate.openLine === reference.openLine &&
      candidate.openColumn === reference.openColumn,
  );
  if (byOpenPosition) return byOpenPosition;
  const byLiteralPosition = targets.find(
    (candidate) =>
      candidate.componentName === reference.componentName &&
      candidate.line === reference.line &&
      candidate.column === reference.column,
  );
  return byLiteralPosition ?? null;
};
`;export{e as default};