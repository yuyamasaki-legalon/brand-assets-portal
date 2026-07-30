var e=`import { useCallback, useEffect, useState } from "react";
import {
  extractVariantFromElement,
  findPickElement,
  getElementFromTarget,
  matchesEditorUi,
  normalizeText,
} from "./domUtils";
import type { EditableVariantTarget } from "./types";

export interface PickedResult {
  candidates: EditableVariantTarget[];
  rect: DOMRect | null;
  element: HTMLElement | null;
  warning?: string;
}

interface UsePickModeArgs {
  variantEditable: boolean;
  variantTargets: EditableVariantTarget[];
  onTargetPicked: (result: PickedResult) => void;
}

export const usePickMode = ({ variantEditable, variantTargets, onTargetPicked }: UsePickModeArgs) => {
  const [isPickerActive, setIsPickerActive] = useState(false);
  const [hoveredElementRect, setHoveredElementRect] = useState<DOMRect | null>(null);
  const [hoveredElementVariant, setHoveredElementVariant] = useState<string | null>(null);
  const [hoveredTargetLabel, setHoveredTargetLabel] = useState<string | null>(null);
  const [hoveredCandidateCount, setHoveredCandidateCount] = useState(0);

  const beginPickMode = useCallback(() => {
    if (!variantEditable) return;
    setIsPickerActive(true);
  }, [variantEditable]);

  const cancelPickMode = useCallback(() => {
    setIsPickerActive(false);
  }, []);

  useEffect(() => {
    if (!isPickerActive) {
      setHoveredElementRect(null);
      setHoveredElementVariant(null);
      setHoveredTargetLabel(null);
      setHoveredCandidateCount(0);
      return;
    }

    const resolveCandidatesFromElement = (element: HTMLElement): EditableVariantTarget[] => {
      const variant = extractVariantFromElement(element);
      const tagName = element.tagName.toLowerCase();
      const componentHint = tagName === "button" ? ["Button", "IconButton"] : [];
      const elementText = normalizeText(element.textContent);
      const elementAriaLabel = normalizeText(element.getAttribute("aria-label"));
      const elementTitle = normalizeText(element.getAttribute("title"));

      const sameVariantTargets = variant
        ? variantTargets
            .filter((target) => target.currentVariant === variant)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : [];
      const sameVariantElements = variant
        ? Array.from(document.querySelectorAll<HTMLElement>("*")).filter(
            (candidate) => extractVariantFromElement(candidate) === variant,
          )
        : [];
      const domVariantIndex = variant ? sameVariantElements.indexOf(element) : -1;

      const scored = variantTargets
        .map((target) => {
          let score = 0;
          const targetLabel = normalizeText(target.labelHint);

          if (variant && target.currentVariant === variant) {
            score += 6;
          }

          if (componentHint.includes(target.componentName)) {
            score += 4;
          }

          if (targetLabel.length > 0) {
            if (elementAriaLabel.length > 0 && targetLabel === elementAriaLabel) {
              score += 10;
            } else if (elementTitle.length > 0 && targetLabel === elementTitle) {
              score += 8;
            } else if (elementText.length > 0 && targetLabel === elementText) {
              score += 8;
            } else if (
              elementText.length > 0 &&
              (targetLabel.includes(elementText) || elementText.includes(targetLabel))
            ) {
              score += 4;
            }
          }

          if (domVariantIndex >= 0 && sameVariantTargets.length > 0) {
            const targetVariantIndex = sameVariantTargets.findIndex((candidate) => candidate.id === target.id);
            if (targetVariantIndex >= 0) {
              score += Math.max(0, 4 - Math.abs(targetVariantIndex - domVariantIndex));
            }
          }

          return { target, score };
        })
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return (a.target.order ?? Number.MAX_SAFE_INTEGER) - (b.target.order ?? Number.MAX_SAFE_INTEGER);
        });

      const positiveScored = scored.filter((entry) => entry.score > 0).map((entry) => entry.target);
      if (positiveScored.length > 0) {
        return positiveScored.slice(0, 8);
      }
      return scored.map((entry) => entry.target).slice(0, 8);
    };

    const onMouseMove = (event: MouseEvent) => {
      const hovered = findPickElement(event.target);
      if (!hovered || matchesEditorUi(hovered)) {
        setHoveredElementRect(null);
        setHoveredElementVariant(null);
        setHoveredTargetLabel(null);
        setHoveredCandidateCount(0);
        return;
      }

      setHoveredElementRect(hovered.getBoundingClientRect());
      setHoveredElementVariant(extractVariantFromElement(hovered));
      const candidates = resolveCandidatesFromElement(hovered);
      setHoveredCandidateCount(candidates.length);
      const topCandidate = candidates[0];
      if (topCandidate) {
        const label = normalizeText(topCandidate.labelHint);
        setHoveredTargetLabel(label ? \`\${topCandidate.componentName} · \${label}\` : topCandidate.componentName);
      } else {
        setHoveredTargetLabel(null);
      }
    };

    const onClick = (event: MouseEvent) => {
      const clickTarget = getElementFromTarget(event.target);
      if (matchesEditorUi(clickTarget)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const clicked = findPickElement(event.target);
      if (!clicked) {
        const fallback = variantTargets[0] ?? null;
        if (!fallback) return;
        setIsPickerActive(false);
        onTargetPicked({
          candidates: [fallback],
          rect: clickTarget?.getBoundingClientRect() ?? null,
          element: clickTarget ?? null,
          warning: "クリック位置に variant 付き要素が見つからなかったため、最も近い候補で編集します。",
        });
        return;
      }

      const candidates = resolveCandidatesFromElement(clicked);
      if (candidates.length === 0) {
        const fallback = variantTargets[0] ?? null;
        if (!fallback) return;
        setIsPickerActive(false);
        onTargetPicked({
          candidates: [fallback],
          rect: clicked.getBoundingClientRect(),
          element: clicked,
          warning: "対応候補が絞れなかったため、先頭候補を表示しています。",
        });
        return;
      }

      setIsPickerActive(false);
      onTargetPicked({
        candidates,
        rect: clicked.getBoundingClientRect(),
        element: clicked,
      });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPickerActive(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove, true);
    window.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("mousemove", onMouseMove, true);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isPickerActive, variantTargets, onTargetPicked]);

  return {
    isPickerActive,
    hoveredElementRect,
    hoveredElementVariant,
    hoveredTargetLabel,
    hoveredCandidateCount,
    beginPickMode,
    cancelPickMode,
  };
};
`;export{e as default};