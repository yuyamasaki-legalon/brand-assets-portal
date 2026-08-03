var e=`import type { AnalyzeVariantResponse, EditableVariantTarget } from "./types";

const ENDPOINTS = {
  analyze: "/__aegis-lab/editor/analyze",
  updateVariant: "/__aegis-lab/editor/update-variant",
  updateText: "/__aegis-lab/editor/update-text",
  updateSpacing: "/__aegis-lab/editor/update-spacing",
  updateProp: "/__aegis-lab/editor/update-prop",
  updateIcon: "/__aegis-lab/editor/update-icon",
  undo: "/__aegis-lab/editor/undo",
  redo: "/__aegis-lab/editor/redo",
} as const;

const postJson = async (url: string, body: unknown): Promise<AnalyzeVariantResponse> => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = (await response.json()) as AnalyzeVariantResponse;
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "Editor request failed.");
  }
  return payload;
};

const targetFallback = (target: EditableVariantTarget) => ({
  fallbackComponentName: target.componentName,
  fallbackLine: target.line,
  fallbackColumn: target.column,
  fallbackOpenLine: target.openLine,
  fallbackOpenColumn: target.openColumn,
});

export const analyzeFile = (filePath: string) => postJson(ENDPOINTS.analyze, { filePath });

export const updateVariantRequest = (filePath: string, target: EditableVariantTarget, nextVariant: string) =>
  postJson(ENDPOINTS.updateVariant, {
    filePath,
    targetId: target.id,
    nextVariant,
    ...targetFallback(target),
  });

export const updateTextRequest = (filePath: string, target: EditableVariantTarget, nextText: string) =>
  postJson(ENDPOINTS.updateText, {
    filePath,
    targetId: target.id,
    nextText,
    ...targetFallback(target),
  });

export const updateSpacingRequest = (
  filePath: string,
  target: EditableVariantTarget,
  kind: "gap" | "margin" | "padding",
  nextValue: string,
) =>
  postJson(ENDPOINTS.updateSpacing, {
    filePath,
    targetId: target.id,
    kind,
    nextValue,
    ...targetFallback(target),
  });

export const updatePropRequest = (
  filePath: string,
  target: EditableVariantTarget,
  propPath: string,
  nextValue: string,
) =>
  postJson(ENDPOINTS.updateProp, {
    filePath,
    targetId: target.id,
    propPath,
    nextValue,
    ...targetFallback(target),
  });

export const updateIconRequest = (filePath: string, target: EditableVariantTarget, nextIconName: string) =>
  postJson(ENDPOINTS.updateIcon, {
    filePath,
    targetId: target.id,
    nextIconName,
    ...targetFallback(target),
  });

export const undoRequest = (filePath: string) => postJson(ENDPOINTS.undo, { filePath });

export const redoRequest = (filePath: string) => postJson(ENDPOINTS.redo, { filePath });
`;export{e as default};