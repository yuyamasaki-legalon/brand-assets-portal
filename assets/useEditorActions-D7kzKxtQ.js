var e=`import { useCallback, useEffect, useRef, useState } from "react";
import { findTargetByIdentity } from "./domUtils";
import {
  analyzeFile,
  redoRequest,
  undoRequest,
  updateIconRequest,
  updatePropRequest,
  updateSpacingRequest,
  updateTextRequest,
  updateVariantRequest,
} from "./editorApi";
import type { AnalyzeVariantResponse, EditableVariantTarget } from "./types";

interface UseEditorActionsArgs {
  filePath: string;
  variantEditable: boolean;
}

export const useEditorActions = ({ filePath, variantEditable }: UseEditorActionsArgs) => {
  const [variantTargets, setVariantTargets] = useState<EditableVariantTarget[]>([]);
  const [availableIcons, setAvailableIcons] = useState<string[]>([]);
  const [applyingTargetId, setApplyingTargetId] = useState<string | null>(null);
  const [variantFeedback, setVariantFeedback] = useState<string | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [candidateTargetIds, setCandidateTargetIds] = useState<string[]>([]);
  const [isVariantLoading, setIsVariantLoading] = useState(false);

  const variantTargetsRef = useRef(variantTargets);
  useEffect(() => {
    variantTargetsRef.current = variantTargets;
  }, [variantTargets]);

  const applyRefreshedTargets = useCallback(
    (nextTargets: EditableVariantTarget[], nextIcons: string[], reference: EditableVariantTarget | null) => {
      const previousTargets = variantTargetsRef.current;
      setVariantTargets(nextTargets);
      setAvailableIcons(nextIcons);
      setCandidateTargetIds((prev) => {
        if (prev.length === 0) return prev;
        return prev
          .map((id) => {
            const oldCandidate = previousTargets.find((target) => target.id === id);
            if (!oldCandidate) return null;
            const next = findTargetByIdentity(nextTargets, oldCandidate);
            return next?.id ?? null;
          })
          .filter((id): id is string => id !== null);
      });
      if (!reference) return;
      const refreshed = findTargetByIdentity(nextTargets, reference);
      if (refreshed) {
        setSelectedTargetId(refreshed.id);
      }
    },
    [],
  );

  const handlePayload = useCallback(
    (payload: AnalyzeVariantResponse, reference: EditableVariantTarget | null) => {
      applyRefreshedTargets(payload.editableVariants ?? [], payload.availableIcons ?? [], reference);
    },
    [applyRefreshedTargets],
  );

  const loadVariantTargets = useCallback(async () => {
    if (!variantEditable) {
      setVariantTargets([]);
      return;
    }

    setIsVariantLoading(true);
    try {
      const payload = await analyzeFile(filePath);
      setVariantTargets(payload.editableVariants ?? []);
      setAvailableIcons(payload.availableIcons ?? []);
    } catch (error) {
      setVariantTargets([]);
      setAvailableIcons([]);
      setVariantFeedback(error instanceof Error ? error.message : "Failed to analyze component variants.");
    } finally {
      setIsVariantLoading(false);
    }
  }, [filePath, variantEditable]);

  const updateVariant = useCallback(
    async (target: EditableVariantTarget, nextVariant: string): Promise<boolean> => {
      if (!variantEditable || !target.supportsVariant) return false;
      setApplyingTargetId(target.id);
      setVariantFeedback(null);
      try {
        const payload = await updateVariantRequest(filePath, target, nextVariant);
        handlePayload(payload, target);
        setVariantFeedback(\`\${target.componentName} の variant を "\${nextVariant}" に変更しました。\`);
        return true;
      } catch (error) {
        setVariantFeedback(error instanceof Error ? error.message : "Failed to update component variant.");
        return false;
      } finally {
        setApplyingTargetId(null);
      }
    },
    [filePath, handlePayload, variantEditable],
  );

  const updateText = useCallback(
    async (target: EditableVariantTarget, nextText: string): Promise<boolean> => {
      if (!variantEditable) return false;
      try {
        const payload = await updateTextRequest(filePath, target, nextText);
        handlePayload(payload, target);
        return true;
      } catch (error) {
        setVariantFeedback(error instanceof Error ? error.message : "Failed to update text.");
        return false;
      }
    },
    [filePath, handlePayload, variantEditable],
  );

  const updateSpacing = useCallback(
    async (target: EditableVariantTarget, kind: "gap" | "margin" | "padding", nextValue: string): Promise<boolean> => {
      if (!variantEditable) return false;
      try {
        const payload = await updateSpacingRequest(filePath, target, kind, nextValue);
        handlePayload(payload, target);
        return true;
      } catch (error) {
        setVariantFeedback(error instanceof Error ? error.message : \`Failed to update \${kind}.\`);
        return false;
      }
    },
    [filePath, handlePayload, variantEditable],
  );

  const updateProp = useCallback(
    async (target: EditableVariantTarget, propPath: string, nextValue: string): Promise<boolean> => {
      if (!variantEditable) return false;
      try {
        const payload = await updatePropRequest(filePath, target, propPath, nextValue);
        handlePayload(payload, target);
        return true;
      } catch (error) {
        setVariantFeedback(error instanceof Error ? error.message : "Failed to update prop.");
        return false;
      }
    },
    [filePath, handlePayload, variantEditable],
  );

  const updateIcon = useCallback(
    async (target: EditableVariantTarget, nextIconName: string): Promise<boolean> => {
      if (!variantEditable) return false;
      try {
        const payload = await updateIconRequest(filePath, target, nextIconName);
        handlePayload(payload, target);
        return true;
      } catch (error) {
        setVariantFeedback(error instanceof Error ? error.message : "Failed to update icon.");
        return false;
      }
    },
    [filePath, handlePayload, variantEditable],
  );

  const editorUndo = useCallback(async () => {
    if (!variantEditable) return;
    try {
      const payload = await undoRequest(filePath);
      const reference = variantTargets.find((target) => target.id === selectedTargetId) ?? null;
      handlePayload(payload, reference);
      setVariantFeedback("Undo しました。");
    } catch (error) {
      setVariantFeedback(error instanceof Error ? error.message : "Undo failed.");
    }
  }, [filePath, handlePayload, selectedTargetId, variantEditable, variantTargets]);

  const editorRedo = useCallback(async () => {
    if (!variantEditable) return;
    try {
      const payload = await redoRequest(filePath);
      const reference = variantTargets.find((target) => target.id === selectedTargetId) ?? null;
      handlePayload(payload, reference);
      setVariantFeedback("Redo しました。");
    } catch (error) {
      setVariantFeedback(error instanceof Error ? error.message : "Redo failed.");
    }
  }, [filePath, handlePayload, selectedTargetId, variantEditable, variantTargets]);

  return {
    variantTargets,
    availableIcons,
    applyingTargetId,
    variantFeedback,
    selectedTargetId,
    candidateTargetIds,
    isVariantLoading,
    setVariantFeedback,
    setSelectedTargetId,
    setCandidateTargetIds,
    loadVariantTargets,
    updateVariant,
    updateText,
    updateSpacing,
    updateProp,
    updateIcon,
    editorUndo,
    editorRedo,
  };
};

export type UseEditorActionsReturn = ReturnType<typeof useEditorActions>;
`;export{e as default};