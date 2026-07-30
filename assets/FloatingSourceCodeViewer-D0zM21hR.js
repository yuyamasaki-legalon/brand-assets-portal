var e=`import { useCallback, useEffect, useRef, useState } from "react";
import { DocsDrawer } from "./FloatingSourceCodeViewer/DocsDrawer";
import { Launcher } from "./FloatingSourceCodeViewer/Launcher";
import { PickerOverlay } from "./FloatingSourceCodeViewer/PickerOverlay";
import { type ProtoDrawerKind, PrototypeDrawers } from "./FloatingSourceCodeViewer/PrototypeDrawers";
import { QuickEditor } from "./FloatingSourceCodeViewer/QuickEditor";
import { SelectionHighlight } from "./FloatingSourceCodeViewer/SelectionHighlight";
import { SettingsDialog } from "./FloatingSourceCodeViewer/SettingsDialog";
import type { EditableVariantTarget, FloatingSourceCodeViewerProps } from "./FloatingSourceCodeViewer/types";
import { useDocsDrawer } from "./FloatingSourceCodeViewer/useDocsDrawer";
import { useEditorActions } from "./FloatingSourceCodeViewer/useEditorActions";
import { type PickedResult, usePickMode } from "./FloatingSourceCodeViewer/usePickMode";
import { useGlobalShortcuts, useQuickEditorShortcuts } from "./FloatingSourceCodeViewer/useViewerShortcuts";
import { usePrototypeTools } from "./prototype";

const FloatingSourceCodeViewer = ({
  currentPath,
  filePath,
  githubUrl,
  aegisComponents,
  liveEditorEnabled,
  locale,
  onLocaleChange,
  theme,
  onThemeChange,
  isThemeAutoDetected,
  launcherVisible,
  onLauncherVisibilityChange,
  adjacentMarkdownFiles,
  fetchMarkdownContent,
  onOpenSettingsRef,
  onPickEditableRef,
}: FloatingSourceCodeViewerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [protoDrawer, setProtoDrawer] = useState<ProtoDrawerKind | null>(null);

  const protoTools = usePrototypeTools();
  const docsState = useDocsDrawer({ currentPath, filePath, adjacentMarkdownFiles, fetchMarkdownContent });

  // Reset prototype drawer when navigating to a different page
  const previousProtoPathRef = useRef(currentPath);
  useEffect(() => {
    if (previousProtoPathRef.current === currentPath) return;
    setProtoDrawer(null);
    previousProtoPathRef.current = currentPath;
  }, [currentPath]);

  const variantEditable = liveEditorEnabled && filePath !== "unknown";

  const editor = useEditorActions({ filePath, variantEditable });

  // Quick editor field state
  const [isQuickEditorOpen, setIsQuickEditorOpen] = useState(false);
  const [quickEditorVariant, setQuickEditorVariant] = useState<string>("");
  const [quickEditorText, setQuickEditorText] = useState<string>("");
  const [quickEditorGap, setQuickEditorGap] = useState<string>("");
  const [quickEditorMargin, setQuickEditorMargin] = useState<string>("");
  const [quickEditorPadding, setQuickEditorPadding] = useState<string>("");
  const [quickEditorPropPath, setQuickEditorPropPath] = useState<string>("");
  const [quickEditorPropValue, setQuickEditorPropValue] = useState<string>("");
  const [quickEditorIconName, setQuickEditorIconName] = useState<string>("");
  const [quickEditorRect, setQuickEditorRect] = useState<DOMRect | null>(null);
  const [pickedElement, setPickedElement] = useState<HTMLElement | null>(null);

  // Expose open function via ref for external control (FloatingMenu)
  useEffect(() => {
    if (onOpenSettingsRef) {
      onOpenSettingsRef.current = () => setIsOpen(true);
      return () => {
        onOpenSettingsRef.current = null;
      };
    }
  }, [onOpenSettingsRef]);

  const handleTargetPicked = useCallback(
    ({ candidates, rect, element, warning }: PickedResult) => {
      if (candidates.length === 0) return;
      const selected = candidates[0];
      editor.setCandidateTargetIds(candidates.map((candidate) => candidate.id));
      editor.setSelectedTargetId(selected.id);
      setQuickEditorVariant(selected.currentVariant);
      setQuickEditorRect(rect);
      setPickedElement(element);
      if (warning) {
        editor.setVariantFeedback(warning);
      } else {
        editor.setVariantFeedback(\`\${selected.componentName} (\${selected.line}:\${selected.column}) を選択しました。\`);
      }
      setIsEditMode(true);
      setIsOpen(false);
      setIsQuickEditorOpen(true);
    },
    [editor],
  );

  const picker = usePickMode({
    variantEditable,
    variantTargets: editor.variantTargets,
    onTargetPicked: handleTargetPicked,
  });

  const startPickMode = useCallback(async () => {
    if (!variantEditable) return;
    await editor.loadVariantTargets();
    editor.setVariantFeedback("画面上で編集したい要素をクリックしてください。Esc でキャンセルできます。");
    editor.setCandidateTargetIds([]);
    editor.setSelectedTargetId(null);
    setQuickEditorText("");
    setQuickEditorGap("");
    setQuickEditorMargin("");
    setQuickEditorPadding("");
    setQuickEditorPropPath("");
    setQuickEditorPropValue("");
    setQuickEditorIconName("");
    setQuickEditorRect(null);
    setPickedElement(null);
    setIsQuickEditorOpen(false);
    setIsOpen(false);
    picker.beginPickMode();
  }, [editor, picker, variantEditable]);

  // Expose pick-editable function via ref for external control (FloatingMenu)
  useEffect(() => {
    if (onPickEditableRef) {
      onPickEditableRef.current = () => void startPickMode();
      return () => {
        onPickEditableRef.current = null;
      };
    }
  }, [onPickEditableRef, startPickMode]);

  const selectedTarget = editor.variantTargets.find((target) => target.id === editor.selectedTargetId) ?? null;
  const candidateTargets = editor.candidateTargetIds
    .map((id) => editor.variantTargets.find((target) => target.id === id))
    .filter((target): target is EditableVariantTarget => !!target);

  const candidateTargetOptions = candidateTargets.map((target) => ({
    label: \`\${target.componentName} (\${target.line}:\${target.column})\`,
    value: target.id,
  }));
  const allTargetOptions = editor.variantTargets.map((target) => ({
    label: \`\${target.componentName} (\${target.line}:\${target.column})\`,
    value: target.id,
  }));
  const quickTargetOptions = candidateTargetOptions.length > 1 ? candidateTargetOptions : allTargetOptions;
  const selectedTargetProps = selectedTarget?.editableProps ?? [];
  const selectedEditableProp = selectedTargetProps.find((prop) => prop.path === quickEditorPropPath) ?? null;
  const iconOptions = editor.availableIcons.map((iconName) => ({ label: iconName, value: iconName }));

  // Sync quick editor fields when selectedTarget changes
  useEffect(() => {
    if (!selectedTarget) return;
    setQuickEditorVariant(selectedTarget.currentVariant);
    setQuickEditorText(selectedTarget.textValue ?? "");
    setQuickEditorGap(selectedTarget.gapValue ?? "");
    setQuickEditorMargin(selectedTarget.marginValue ?? "");
    setQuickEditorPadding(selectedTarget.paddingValue ?? "");
    const props = selectedTarget.editableProps ?? [];
    const initialProp = props.find((prop) => prop.path === "prop:variant") ?? props[0] ?? null;
    setQuickEditorPropPath(initialProp?.path ?? "");
    setQuickEditorPropValue(initialProp?.value ?? "");
    setQuickEditorIconName(selectedTarget.currentIconName ?? "");
  }, [selectedTarget]);

  useEffect(() => {
    if (!selectedEditableProp) return;
    setQuickEditorPropValue(selectedEditableProp.value);
  }, [selectedEditableProp]);

  useEffect(() => {
    if (!isOpen || !variantEditable) return;
    void editor.loadVariantTargets();
  }, [isOpen, variantEditable, editor.loadVariantTargets]);

  const applyQuickEdit = useCallback(
    async (continuePicking: boolean) => {
      if (!selectedTarget) return;
      let ok = true;
      if (
        selectedTarget.supportsVariant &&
        quickEditorVariant &&
        quickEditorVariant !== selectedTarget.currentVariant
      ) {
        ok = (await editor.updateVariant(selectedTarget, quickEditorVariant)) && ok;
      }
      if (quickEditorText !== (selectedTarget.textValue ?? "")) {
        ok = (await editor.updateText(selectedTarget, quickEditorText)) && ok;
      }
      if (quickEditorGap !== (selectedTarget.gapValue ?? "")) {
        ok = (await editor.updateSpacing(selectedTarget, "gap", quickEditorGap)) && ok;
      }
      if (quickEditorMargin !== (selectedTarget.marginValue ?? "")) {
        ok = (await editor.updateSpacing(selectedTarget, "margin", quickEditorMargin)) && ok;
      }
      if (quickEditorPadding !== (selectedTarget.paddingValue ?? "")) {
        ok = (await editor.updateSpacing(selectedTarget, "padding", quickEditorPadding)) && ok;
      }
      if (quickEditorPropPath && selectedEditableProp && quickEditorPropValue !== selectedEditableProp.value) {
        ok = (await editor.updateProp(selectedTarget, quickEditorPropPath, quickEditorPropValue)) && ok;
      }
      if (
        quickEditorIconName &&
        selectedTarget.currentIconName &&
        quickEditorIconName !== selectedTarget.currentIconName
      ) {
        ok = (await editor.updateIcon(selectedTarget, quickEditorIconName)) && ok;
      }

      if (!ok) return;

      if (continuePicking) {
        await startPickMode();
        return;
      }

      editor.setVariantFeedback(
        \`\${selectedTarget.componentName} (\${selectedTarget.line}:\${selectedTarget.column}) を保存しました。\`,
      );
    },
    [
      editor,
      quickEditorGap,
      quickEditorIconName,
      quickEditorMargin,
      quickEditorPadding,
      quickEditorPropPath,
      quickEditorPropValue,
      quickEditorText,
      quickEditorVariant,
      selectedEditableProp,
      selectedTarget,
      startPickMode,
    ],
  );

  useGlobalShortcuts({
    enabled: variantEditable,
    isPickerActive: picker.isPickerActive,
    isQuickEditorOpen,
    onStartPick: () => void startPickMode(),
  });

  useQuickEditorShortcuts({
    enabled: isQuickEditorOpen,
    candidateIds: editor.candidateTargetIds,
    selectedTargetId: editor.selectedTargetId,
    onSelectCandidate: editor.setSelectedTargetId,
    onClose: () => {
      setIsQuickEditorOpen(false);
      setPickedElement(null);
    },
    onApply: () => void applyQuickEdit(false),
    onApplyAndNext: () => void applyQuickEdit(true),
    onUndo: () => void editor.editorUndo(),
    onRedo: () => void editor.editorRedo(),
  });

  const handleCopy = useCallback(async (text: string, tabName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(tabName);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  const handleSettingsOpenChange = useCallback(
    (nextOpen: boolean) => {
      setIsOpen(nextOpen);
      if (!nextOpen) {
        picker.cancelPickMode();
      }
    },
    [picker],
  );

  return (
    <>
      {launcherVisible && !isQuickEditorOpen && !picker.isPickerActive && (
        <Launcher
          liveEditorEnabled={liveEditorEnabled}
          onPickEditable={() => void startPickMode()}
          onOpenSettings={() => setIsOpen(true)}
        />
      )}

      {isOpen && (
        <SettingsDialog
          isOpen={isOpen}
          onOpenChange={handleSettingsOpenChange}
          currentPath={currentPath}
          locale={locale}
          onLocaleChange={onLocaleChange}
          theme={theme}
          onThemeChange={onThemeChange}
          isThemeAutoDetected={isThemeAutoDetected}
          onHideLauncher={() => {
            onLauncherVisibilityChange(false);
            setIsOpen(false);
          }}
          adjacentMarkdownFiles={adjacentMarkdownFiles}
          onOpenDocs={() => {
            setIsOpen(false);
            docsState.handleDocsOpenChange(true);
          }}
          protoTools={protoTools}
          onOpenProtoDrawer={(kind) => {
            setIsOpen(false);
            setProtoDrawer(kind);
          }}
          variantEditable={variantEditable}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          onPickOnPage={() => void startPickMode()}
          isVariantLoading={editor.isVariantLoading}
          variantTargets={editor.variantTargets}
          variantFeedback={editor.variantFeedback}
          loadVariantTargets={() => void editor.loadVariantTargets()}
          updateVariant={(target, value) => void editor.updateVariant(target, value)}
          applyingTargetId={editor.applyingTargetId}
          selectedTargetId={editor.selectedTargetId}
          filePath={filePath}
          githubUrl={githubUrl}
          aegisComponents={aegisComponents}
          copiedTab={copiedTab}
          onCopy={handleCopy}
        />
      )}

      {picker.isPickerActive && (
        <PickerOverlay
          hoveredElementRect={picker.hoveredElementRect}
          hoveredElementVariant={picker.hoveredElementVariant}
          hoveredTargetLabel={picker.hoveredTargetLabel}
          hoveredCandidateCount={picker.hoveredCandidateCount}
          onCancel={picker.cancelPickMode}
        />
      )}

      {isQuickEditorOpen && pickedElement && (
        <SelectionHighlight
          element={pickedElement}
          label={
            selectedTarget
              ? \`\${selectedTarget.componentName}\${selectedTarget.labelHint ? \` · \${selectedTarget.labelHint}\` : ""}\`
              : null
          }
          extraCount={Math.max(0, editor.candidateTargetIds.length - 1)}
        />
      )}

      {isQuickEditorOpen && selectedTarget && (
        <QuickEditor
          selectedTarget={selectedTarget}
          quickTargetOptions={quickTargetOptions}
          selectedTargetProps={selectedTargetProps}
          selectedEditableProp={selectedEditableProp}
          iconOptions={iconOptions}
          quickEditorRect={quickEditorRect}
          applyingTargetId={editor.applyingTargetId}
          variantFeedback={editor.variantFeedback}
          quickEditorVariant={quickEditorVariant}
          quickEditorText={quickEditorText}
          quickEditorGap={quickEditorGap}
          quickEditorMargin={quickEditorMargin}
          quickEditorPadding={quickEditorPadding}
          quickEditorPropPath={quickEditorPropPath}
          quickEditorPropValue={quickEditorPropValue}
          quickEditorIconName={quickEditorIconName}
          setSelectedTargetId={editor.setSelectedTargetId}
          setQuickEditorVariant={setQuickEditorVariant}
          setQuickEditorText={setQuickEditorText}
          setQuickEditorGap={setQuickEditorGap}
          setQuickEditorMargin={setQuickEditorMargin}
          setQuickEditorPadding={setQuickEditorPadding}
          setQuickEditorPropPath={setQuickEditorPropPath}
          setQuickEditorPropValue={setQuickEditorPropValue}
          setQuickEditorIconName={setQuickEditorIconName}
          updateSpacing={editor.updateSpacing}
          onClose={() => {
            setIsQuickEditorOpen(false);
            setPickedElement(null);
          }}
          onApply={applyQuickEdit}
          onPickAgain={() => void startPickMode()}
          onUndo={() => void editor.editorUndo()}
          onRedo={() => void editor.editorRedo()}
        />
      )}

      <DocsDrawer
        open={docsState.isDocsOpen}
        onOpenChange={docsState.handleDocsOpenChange}
        mdFileOptions={docsState.mdFileOptions}
        selectedMdFile={docsState.selectedMdFile}
        onFileSelect={docsState.handleFileSelect}
        mdContent={docsState.mdContent}
        isMdLoading={docsState.isMdLoading}
        copiedTab={copiedTab}
        onCopy={handleCopy}
      />

      <PrototypeDrawers protoTools={protoTools} protoDrawer={protoDrawer} onClose={() => setProtoDrawer(null)} />
    </>
  );
};

export default FloatingSourceCodeViewer;
`;export{e as default};