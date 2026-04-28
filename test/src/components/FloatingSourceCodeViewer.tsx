import {
  LfCheck,
  LfClipboardList,
  LfCode,
  LfCopy,
  LfFileLines,
  LfGraphNode,
  LfPaint,
  LfRule,
} from "@legalforce/aegis-icons";
import {
  ActionList,
  ActionListItem,
  Button,
  ContentHeader,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Drawer,
  Form,
  FormControl,
  Icon,
  IconButton,
  Select,
  Switch,
  Tab,
  Text,
  TextField,
} from "@legalforce/aegis-react";
import type { MutableRefObject } from "react";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import type { FlagName } from "../contexts/FeatureFlagContext";
import { FLAG_DEFINITIONS, useFeatureFlags } from "../contexts/FeatureFlagContext";
import { MarkdownRenderer } from "../pages/markdown-viewer/components/MarkdownRenderer";
import { type ThemeName, themeOptions } from "../themes";
import { buildDocsHash, parseDocsHash, resolveInitialMdFile } from "./docsUrlState";
import { buildMdFileOptions, resolveDocsHashForState } from "./FloatingSourceCodeViewer.helpers";
import { usePrototypeTools } from "./prototype";

const FlowMap = lazy(() => import("./prototype/FlowMap").then((m) => ({ default: m.FlowMap })));

type LocaleCode = "en-US" | "ja-JP";

const localeOptions: { label: string; value: LocaleCode }[] = [
  { value: "en-US", label: "English (US)" },
  { value: "ja-JP", label: "日本語" },
];

const spacingTokenOptions: { label: string; value: string }[] = [
  { label: "x3Small (2px)", value: "var(--aegis-space-x3Small)" },
  { label: "xxSmall (4px)", value: "var(--aegis-space-xxSmall)" },
  { label: "xSmall (8px)", value: "var(--aegis-space-xSmall)" },
  { label: "small (12px)", value: "var(--aegis-space-small)" },
  { label: "medium (16px)", value: "var(--aegis-space-medium)" },
  { label: "large (24px)", value: "var(--aegis-space-large)" },
  { label: "xLarge (32px)", value: "var(--aegis-space-xLarge)" },
  { label: "xxLarge (40px)", value: "var(--aegis-space-xxLarge)" },
  { label: "x3Large (56px)", value: "var(--aegis-space-x3Large)" },
  { label: "x4Large (64px)", value: "var(--aegis-space-x4Large)" },
  { label: "x5Large (80px)", value: "var(--aegis-space-x5Large)" },
];

const getSpacingOptions = (currentValue: string) => {
  if (!currentValue || spacingTokenOptions.some((opt) => opt.value === currentValue)) {
    return spacingTokenOptions;
  }
  return [{ label: `Current: ${currentValue}`, value: currentValue }, ...spacingTokenOptions];
};

interface FloatingSourceCodeViewerProps {
  currentPath: string;
  filePath: string;
  githubUrl: string;
  aegisComponents: string[];
  liveEditorEnabled: boolean;
  locale: LocaleCode;
  onLocaleChange: (locale: LocaleCode) => void;
  theme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  isThemeAutoDetected: boolean;
  launcherVisible: boolean;
  onLauncherVisibilityChange: (visible: boolean) => void;
  adjacentMarkdownFiles: string[];
  fetchMarkdownContent: (path: string) => Promise<string>;
  onOpenSettingsRef?: MutableRefObject<(() => void) | null>;
  onPickEditableRef?: MutableRefObject<(() => void) | null>;
}

interface EditableVariantTarget {
  id: string;
  componentName: string;
  currentVariant: string;
  supportsVariant?: boolean;
  labelHint?: string | null;
  order?: number;
  openLine?: number;
  openColumn?: number;
  textValue?: string | null;
  gapValue?: string | null;
  marginValue?: string | null;
  paddingValue?: string | null;
  editableProps?: EditableProp[];
  currentIconName?: string | null;
  line: number;
  column: number;
}

interface EditableProp {
  path: string;
  label: string;
  value: string;
  valueType: "string" | "number" | "boolean" | "expression";
}

interface AnalyzeVariantResponse {
  ok: boolean;
  editableVariants?: EditableVariantTarget[];
  availableIcons?: string[];
  error?: string;
}

const commonVariantOptions = ["solid", "outlined", "subtle", "plain"] as const;
const variantClassPattern = /(?:^|[_-])variant-([A-Za-z0-9-]+)/;

const getElementFromTarget = (target: EventTarget | null): HTMLElement | null => {
  if (target instanceof HTMLElement) return target;
  if (target instanceof Node) {
    return target.parentElement;
  }
  return null;
};

const matchesEditorUi = (element: HTMLElement | null) => {
  return !!element?.closest("[data-aegis-editor-ui='true']");
};

const extractVariantFromElement = (element: HTMLElement): string | null => {
  for (const className of Array.from(element.classList)) {
    const matched = className.match(variantClassPattern);
    if (matched?.[1]) {
      return matched[1];
    }
  }
  return null;
};

const findPickElement = (target: EventTarget | null): HTMLElement | null => {
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

const normalizeText = (text: string | null | undefined) => {
  return (text ?? "").replace(/\s+/g, " ").trim();
};

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

  // Expose open function via ref for external control (FloatingMenu)
  useEffect(() => {
    if (onOpenSettingsRef) {
      onOpenSettingsRef.current = () => setIsOpen(true);
      return () => {
        onOpenSettingsRef.current = null;
      };
    }
  }, [onOpenSettingsRef]);

  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const previousPathRef = useRef(currentPath);

  // Feature flags
  const { flags, setFlag, resetFlags } = useFeatureFlags();

  // Prototype tools from PrototypeShell context
  const protoTools = usePrototypeTools();
  const [protoDrawer, setProtoDrawer] = useState<"map" | "spec" | "qa" | null>(null);

  // Normalize markdown path to a unique identifier (remove leading slash)
  const getMdIdentifier = useCallback((path: string) => path.replace(/^\//, ""), []);

  const initialHash = parseDocsHash(window.location.hash);

  // Docs state
  const [selectedMdFile, setSelectedMdFile] = useState<string | null>(() =>
    resolveInitialMdFile({
      adjacentMarkdownFiles,
      selectedMdFile: null,
      hashFileId: initialHash.fileId,
      normalizeIdentifier: getMdIdentifier,
    }),
  );
  const [initialFileIdFromHash] = useState<string | null>(initialHash.fileId);
  const [mdContent, setMdContent] = useState<string>("");
  const [isMdLoading, setIsMdLoading] = useState(false);

  // Auto-select file when adjacentMarkdownFiles changes (page navigation)
  // Always pass selectedMdFile: null because the old selection should be discarded on navigation
  const [prevAdjacentFiles, setPrevAdjacentFiles] = useState(adjacentMarkdownFiles);
  if (adjacentMarkdownFiles !== prevAdjacentFiles) {
    setPrevAdjacentFiles(adjacentMarkdownFiles);
    const resolved = resolveInitialMdFile({
      adjacentMarkdownFiles,
      selectedMdFile: null,
      hashFileId: initialFileIdFromHash,
      normalizeIdentifier: getMdIdentifier,
    });
    if (resolved) {
      setSelectedMdFile(resolved);
    } else {
      setSelectedMdFile(null);
      setMdContent("");
    }
  }

  // Docs Drawer state - check URL hash on initial render
  const [isDocsOpen, setIsDocsOpen] = useState(initialHash.isOpen);

  // Build URL hash for docs
  const buildDocsHashWithIdentifier = (file: string | null) => buildDocsHash(file, getMdIdentifier);

  // Sync URL hash with Drawer state
  const handleDocsOpenChange = (open: boolean) => {
    setIsDocsOpen(open);
    if (open) {
      const hash = buildDocsHashWithIdentifier(selectedMdFile);
      window.history.replaceState(
        null,
        "",
        resolveDocsHashForState({ pathname: window.location.pathname, search: window.location.search, hash }),
      );
    } else {
      window.history.replaceState(
        null,
        "",
        resolveDocsHashForState({ pathname: window.location.pathname, search: window.location.search, hash: "" }),
      );
    }
  };

  // Handle file selection change
  const handleFileSelect = (file: string | null) => {
    setSelectedMdFile(file);
    if (isDocsOpen && file) {
      const hash = buildDocsHashWithIdentifier(file);
      window.history.replaceState(
        null,
        "",
        resolveDocsHashForState({ pathname: window.location.pathname, search: window.location.search, hash }),
      );
    }
  };

  // Close Docs Drawer and reset UI when navigating to a different page
  // Note: selectedMdFile/mdContent are handled by the render-time auto-select block above
  useEffect(() => {
    if (previousPathRef.current === currentPath) return;

    setIsDocsOpen(false);
    setProtoDrawer(null);
    window.history.replaceState(
      null,
      "",
      resolveDocsHashForState({ pathname: window.location.pathname, search: window.location.search, hash: "" }),
    );

    previousPathRef.current = currentPath;
  }, [currentPath]);

  // Load markdown content when selected file changes
  useEffect(() => {
    if (selectedMdFile) {
      setIsMdLoading(true);
      fetchMarkdownContent(selectedMdFile)
        .then((content) => {
          setMdContent(content);
        })
        .finally(() => {
          setIsMdLoading(false);
        });
    }
  }, [selectedMdFile, fetchMarkdownContent]);

  const mdFileOptions = buildMdFileOptions({ adjacentMarkdownFiles, filePath });

  const handleCopy = async (text: string, tabName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(tabName);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [isVariantLoading, setIsVariantLoading] = useState(false);
  const [variantTargets, setVariantTargets] = useState<EditableVariantTarget[]>([]);
  const [availableIcons, setAvailableIcons] = useState<string[]>([]);
  const [variantFeedback, setVariantFeedback] = useState<string | null>(null);
  const [applyingTargetId, setApplyingTargetId] = useState<string | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [isPickerActive, setIsPickerActive] = useState(false);
  const [hoveredElementRect, setHoveredElementRect] = useState<DOMRect | null>(null);
  const [hoveredElementVariant, setHoveredElementVariant] = useState<string | null>(null);
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
  const [candidateTargetIds, setCandidateTargetIds] = useState<string[]>([]);

  const variantEditable = liveEditorEnabled && filePath !== "unknown";

  const loadVariantTargets = useCallback(async () => {
    if (!variantEditable) {
      setVariantTargets([]);
      return;
    }

    setIsVariantLoading(true);

    try {
      const response = await fetch("/__aegis-lab/editor/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath }),
      });

      const payload = (await response.json()) as AnalyzeVariantResponse;
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Failed to analyze component variants.");
      }

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
      if (!variantEditable || !target.supportsVariant) {
        return false;
      }

      setApplyingTargetId(target.id);
      setVariantFeedback(null);

      try {
        const response = await fetch("/__aegis-lab/editor/update-variant", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filePath,
            targetId: target.id,
            nextVariant,
            fallbackComponentName: target.componentName,
            fallbackLine: target.line,
            fallbackColumn: target.column,
          }),
        });

        const payload = (await response.json()) as AnalyzeVariantResponse;
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || "Failed to update component variant.");
        }

        const nextTargets = payload.editableVariants ?? [];
        setVariantTargets(nextTargets);
        setAvailableIcons(payload.availableIcons ?? []);
        const updatedTarget =
          nextTargets.find(
            (candidate) =>
              candidate.componentName === target.componentName &&
              candidate.line === target.line &&
              candidate.column === target.column,
          ) ?? null;
        setSelectedTargetId(updatedTarget?.id ?? null);
        setVariantFeedback(`${target.componentName} の variant を "${nextVariant}" に変更しました。`);
        return true;
      } catch (error) {
        setVariantFeedback(error instanceof Error ? error.message : "Failed to update component variant.");
        return false;
      } finally {
        setApplyingTargetId(null);
      }
    },
    [filePath, variantEditable],
  );

  const updateText = useCallback(
    async (target: EditableVariantTarget, nextText: string): Promise<boolean> => {
      if (!variantEditable) return false;
      try {
        const response = await fetch("/__aegis-lab/editor/update-text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filePath,
            targetId: target.id,
            nextText,
            fallbackComponentName: target.componentName,
            fallbackOpenLine: target.openLine,
            fallbackOpenColumn: target.openColumn,
          }),
        });

        const payload = (await response.json()) as AnalyzeVariantResponse;
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || "Failed to update text.");
        }
        setVariantTargets(payload.editableVariants ?? []);
        setAvailableIcons(payload.availableIcons ?? []);
        return true;
      } catch (error) {
        setVariantFeedback(error instanceof Error ? error.message : "Failed to update text.");
        return false;
      }
    },
    [filePath, variantEditable],
  );

  const updateSpacing = useCallback(
    async (target: EditableVariantTarget, kind: "gap" | "margin" | "padding", nextValue: string): Promise<boolean> => {
      if (!variantEditable) return false;
      try {
        const response = await fetch("/__aegis-lab/editor/update-spacing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filePath,
            targetId: target.id,
            kind,
            nextValue,
            fallbackComponentName: target.componentName,
            fallbackOpenLine: target.openLine,
            fallbackOpenColumn: target.openColumn,
          }),
        });

        const payload = (await response.json()) as AnalyzeVariantResponse;
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || `Failed to update ${kind}.`);
        }
        setVariantTargets(payload.editableVariants ?? []);
        setAvailableIcons(payload.availableIcons ?? []);
        return true;
      } catch (error) {
        setVariantFeedback(error instanceof Error ? error.message : `Failed to update ${kind}.`);
        return false;
      }
    },
    [filePath, variantEditable],
  );

  const updateProp = useCallback(
    async (target: EditableVariantTarget, propPath: string, nextValue: string): Promise<boolean> => {
      if (!variantEditable) return false;
      try {
        const response = await fetch("/__aegis-lab/editor/update-prop", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filePath,
            targetId: target.id,
            propPath,
            nextValue,
            fallbackComponentName: target.componentName,
            fallbackOpenLine: target.openLine,
            fallbackOpenColumn: target.openColumn,
          }),
        });

        const payload = (await response.json()) as AnalyzeVariantResponse;
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || "Failed to update prop.");
        }
        setVariantTargets(payload.editableVariants ?? []);
        setAvailableIcons(payload.availableIcons ?? []);
        return true;
      } catch (error) {
        setVariantFeedback(error instanceof Error ? error.message : "Failed to update prop.");
        return false;
      }
    },
    [filePath, variantEditable],
  );

  const updateIcon = useCallback(
    async (target: EditableVariantTarget, nextIconName: string): Promise<boolean> => {
      if (!variantEditable) return false;
      try {
        const response = await fetch("/__aegis-lab/editor/update-icon", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filePath,
            targetId: target.id,
            nextIconName,
            fallbackComponentName: target.componentName,
            fallbackOpenLine: target.openLine,
            fallbackOpenColumn: target.openColumn,
          }),
        });

        const payload = (await response.json()) as AnalyzeVariantResponse;
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || "Failed to update icon.");
        }
        setVariantTargets(payload.editableVariants ?? []);
        setAvailableIcons(payload.availableIcons ?? []);
        return true;
      } catch (error) {
        setVariantFeedback(error instanceof Error ? error.message : "Failed to update icon.");
        return false;
      }
    },
    [filePath, variantEditable],
  );

  const editorUndo = useCallback(async () => {
    if (!variantEditable) return;
    try {
      const response = await fetch("/__aegis-lab/editor/undo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath }),
      });
      const payload = (await response.json()) as AnalyzeVariantResponse;
      if (!response.ok || !payload.ok) {
        setVariantFeedback(payload.error || "Undo failed.");
        return;
      }
      setVariantTargets(payload.editableVariants ?? []);
      setAvailableIcons(payload.availableIcons ?? []);
      setVariantFeedback("Undo しました。");
    } catch {
      setVariantFeedback("Undo failed.");
    }
  }, [filePath, variantEditable]);

  const editorRedo = useCallback(async () => {
    if (!variantEditable) return;
    try {
      const response = await fetch("/__aegis-lab/editor/redo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath }),
      });
      const payload = (await response.json()) as AnalyzeVariantResponse;
      if (!response.ok || !payload.ok) {
        setVariantFeedback(payload.error || "Redo failed.");
        return;
      }
      setVariantTargets(payload.editableVariants ?? []);
      setAvailableIcons(payload.availableIcons ?? []);
      setVariantFeedback("Redo しました。");
    } catch {
      setVariantFeedback("Redo failed.");
    }
  }, [filePath, variantEditable]);

  useEffect(() => {
    if (!isOpen || !variantEditable) {
      return;
    }

    void loadVariantTargets();
  }, [isOpen, variantEditable, loadVariantTargets]);

  const getVariantOptions = (currentVariant: string) => {
    const options = new Set<string>(commonVariantOptions);
    options.add(currentVariant);

    return Array.from(options).map((variant) => ({
      label: variant,
      value: variant,
    }));
  };

  const selectedTarget = variantTargets.find((target) => target.id === selectedTargetId) ?? null;
  const candidateTargets = candidateTargetIds
    .map((id) => variantTargets.find((target) => target.id === id))
    .filter((target): target is EditableVariantTarget => !!target);

  const candidateTargetOptions = candidateTargets.map((target) => ({
    label: `${target.componentName} (${target.line}:${target.column})`,
    value: target.id,
  }));
  const allTargetOptions = variantTargets.map((target) => ({
    label: `${target.componentName} (${target.line}:${target.column})`,
    value: target.id,
  }));
  const quickTargetOptions = candidateTargetOptions.length > 1 ? candidateTargetOptions : allTargetOptions;
  const selectedTargetProps = selectedTarget?.editableProps ?? [];
  const selectedTargetPropOptions = selectedTargetProps.map((prop) => ({
    label: `${prop.label} (${prop.valueType})`,
    value: prop.path,
  }));
  const selectedEditableProp = selectedTargetProps.find((prop) => prop.path === quickEditorPropPath) ?? null;
  const iconOptions = availableIcons.map((iconName) => ({ label: iconName, value: iconName }));

  const quickEditorPosition = (() => {
    if (!quickEditorRect) {
      return { left: 16, top: 16 };
    }

    const panelWidth = 320;
    const panelHeight = 420;
    const gap = 10;

    let left = quickEditorRect.right + gap;
    let top = quickEditorRect.top;

    if (left + panelWidth > window.innerWidth - 8) {
      left = quickEditorRect.left - panelWidth - gap;
    }
    if (left < 8) {
      left = 8;
    }

    if (top + panelHeight > window.innerHeight - 8) {
      top = window.innerHeight - panelHeight - 8;
    }
    if (top < 8) {
      top = 8;
    }

    return { left, top };
  })();
  const quickEditorMaxHeight = `calc(100vh - ${Math.max(quickEditorPosition.top + 8, 24)}px)`;

  const startPickMode = useCallback(async () => {
    if (!variantEditable) return;
    await loadVariantTargets();
    setVariantFeedback("画面上で編集したい要素をクリックしてください。Esc でキャンセルできます。");
    setCandidateTargetIds([]);
    setSelectedTargetId(null);
    setQuickEditorText("");
    setQuickEditorGap("");
    setQuickEditorMargin("");
    setQuickEditorPadding("");
    setQuickEditorPropPath("");
    setQuickEditorPropValue("");
    setQuickEditorIconName("");
    setQuickEditorRect(null);
    setIsQuickEditorOpen(false);
    setIsPickerActive(true);
    setIsOpen(false);
  }, [loadVariantTargets, variantEditable]);

  // Expose pick-editable function via ref for external control (FloatingMenu)
  useEffect(() => {
    if (onPickEditableRef) {
      onPickEditableRef.current = () => void startPickMode();
      return () => {
        onPickEditableRef.current = null;
      };
    }
  }, [onPickEditableRef, startPickMode]);

  const applyQuickEdit = useCallback(
    async (continuePicking: boolean) => {
      if (!selectedTarget) return;
      let ok = true;
      if (
        selectedTarget.supportsVariant &&
        quickEditorVariant &&
        quickEditorVariant !== selectedTarget.currentVariant
      ) {
        ok = (await updateVariant(selectedTarget, quickEditorVariant)) && ok;
      }
      if (quickEditorText !== (selectedTarget.textValue ?? "")) {
        ok = (await updateText(selectedTarget, quickEditorText)) && ok;
      }
      if (quickEditorGap !== (selectedTarget.gapValue ?? "")) {
        ok = (await updateSpacing(selectedTarget, "gap", quickEditorGap)) && ok;
      }
      if (quickEditorMargin !== (selectedTarget.marginValue ?? "")) {
        ok = (await updateSpacing(selectedTarget, "margin", quickEditorMargin)) && ok;
      }
      if (quickEditorPadding !== (selectedTarget.paddingValue ?? "")) {
        ok = (await updateSpacing(selectedTarget, "padding", quickEditorPadding)) && ok;
      }
      if (quickEditorPropPath && selectedEditableProp && quickEditorPropValue !== selectedEditableProp.value) {
        ok = (await updateProp(selectedTarget, quickEditorPropPath, quickEditorPropValue)) && ok;
      }
      if (
        quickEditorIconName &&
        selectedTarget.currentIconName &&
        quickEditorIconName !== selectedTarget.currentIconName
      ) {
        ok = (await updateIcon(selectedTarget, quickEditorIconName)) && ok;
      }

      if (!ok) return;

      if (continuePicking) {
        await startPickMode();
        return;
      }

      setVariantFeedback(
        `${selectedTarget.componentName} (${selectedTarget.line}:${selectedTarget.column}) を保存しました。`,
      );
    },
    [
      quickEditorGap,
      quickEditorMargin,
      quickEditorPadding,
      quickEditorText,
      quickEditorVariant,
      selectedTarget,
      startPickMode,
      updateSpacing,
      updateText,
      updateProp,
      updateVariant,
      updateIcon,
      quickEditorPropPath,
      quickEditorPropValue,
      quickEditorIconName,
      selectedEditableProp,
    ],
  );

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
    if (!isPickerActive) {
      setHoveredElementRect(null);
      setHoveredElementVariant(null);
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
        ? Array.from(document.querySelectorAll<HTMLElement>("*")).filter((candidate) => {
            return extractVariantFromElement(candidate) === variant;
          })
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
        return;
      }

      setHoveredElementRect(hovered.getBoundingClientRect());
      setHoveredElementVariant(extractVariantFromElement(hovered));
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
        setVariantFeedback("クリック位置に variant 付き要素が見つからなかったため、最も近い候補で編集します。");
        const fallback = variantTargets[0] ?? null;
        if (!fallback) {
          return;
        }
        setCandidateTargetIds([fallback.id]);
        setSelectedTargetId(fallback.id);
        setQuickEditorVariant(fallback.currentVariant);
        setQuickEditorRect(clickTarget?.getBoundingClientRect() ?? null);
        setIsPickerActive(false);
        setIsOpen(false);
        setIsQuickEditorOpen(true);
        return;
      }

      const candidates = resolveCandidatesFromElement(clicked);
      if (candidates.length === 0) {
        const fallback = variantTargets[0] ?? null;
        if (!fallback) return;
        setCandidateTargetIds([fallback.id]);
        setSelectedTargetId(fallback.id);
        setQuickEditorVariant(fallback.currentVariant);
        setVariantFeedback("対応候補が絞れなかったため、先頭候補を表示しています。");
        setQuickEditorRect(clicked.getBoundingClientRect());
        setIsPickerActive(false);
        setIsOpen(false);
        setIsQuickEditorOpen(true);
        return;
      }

      const selected = candidates[0];
      setCandidateTargetIds(candidates.map((candidate) => candidate.id));
      setSelectedTargetId(selected.id);
      setQuickEditorVariant(selected.currentVariant);
      setVariantFeedback(`${selected.componentName} (${selected.line}:${selected.column}) を選択しました。`);
      setQuickEditorRect(clicked.getBoundingClientRect());
      setIsPickerActive(false);
      setIsEditMode(true);
      setIsOpen(false);
      setIsQuickEditorOpen(true);
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
  }, [isPickerActive, variantTargets]);

  return (
    <>
      {launcherVisible && !isQuickEditorOpen && !isPickerActive && (
        <div
          data-aegis-editor-ui="true"
          style={{
            position: "fixed",
            bottom: "12px",
            right: "12px",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            gap: "var(--aegis-space-xSmall)",
          }}
        >
          {liveEditorEnabled && (
            <IconButton
              aria-label="Pick editable element"
              variant="solid"
              size="small"
              onClick={() => void startPickMode()}
            >
              <Icon size="small">
                <LfPaint />
              </Icon>
            </IconButton>
          )}
          <IconButton aria-label="View source code" variant="solid" size="medium" onClick={() => setIsOpen(true)}>
            <Icon size="small">
              <LfCode />
            </Icon>
          </IconButton>
        </div>
      )}

      {/* Dialog - Only render when open */}
      {isOpen && (
        <Dialog
          open={isOpen}
          onOpenChange={(nextOpen) => {
            setIsOpen(nextOpen);
            if (!nextOpen) {
              setIsPickerActive(false);
            }
          }}
          closeOnEsc
          closeOnOutsidePress
        >
          <DialogContent width="large" data-aegis-editor-ui="true">
            <DialogHeader>
              <ContentHeader>
                <ContentHeader.Title>Aegis Lab Setting</ContentHeader.Title>
              </ContentHeader>
              <Text variant="body.small" color="subtle">
                {currentPath}
              </Text>
            </DialogHeader>
            <DialogBody>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                {/* Tab Navigation */}
                <Tab.Group>
                  <Tab.List>
                    <Tab>Tools</Tab>
                    <Tab>Edit</Tab>
                    <Tab>File Info</Tab>
                    <Tab>Components</Tab>
                  </Tab.List>
                  <Tab.Panels>
                    <Tab.Panel>
                      <Form
                        size="small"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--aegis-space-medium)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--aegis-space-xSmall)",
                          }}
                        >
                          <Text variant="label.medium.bold">Provider Settings</Text>
                          <FormControl>
                            <FormControl.Label>Locale</FormControl.Label>
                            <Select
                              options={localeOptions}
                              value={locale}
                              onChange={(value) => {
                                if (value) {
                                  onLocaleChange(value as LocaleCode);
                                }
                              }}
                            />
                          </FormControl>
                          <FormControl>
                            <FormControl.Label>
                              Theme
                              {isThemeAutoDetected && (
                                <Text as="span" variant="body.xSmall" color="subtle">
                                  {" "}
                                  (auto-detected from URL)
                                </Text>
                              )}
                            </FormControl.Label>
                            <Select
                              options={themeOptions}
                              value={theme}
                              onChange={(value) => {
                                if (value) {
                                  onThemeChange(value as ThemeName);
                                }
                              }}
                            />
                          </FormControl>
                          <FormControl style={{ marginTop: "var(--aegis-space-medium)" }}>
                            <FormControl.Label>Hide launcher for screenshots</FormControl.Label>
                            <Button
                              variant="subtle"
                              onClick={() => {
                                onLauncherVisibilityChange(false);
                                setIsOpen(false);
                              }}
                            >
                              Hide floating button
                            </Button>
                            <FormControl.Caption>再表示する場合は Alt + L を押してください。</FormControl.Caption>
                          </FormControl>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--aegis-space-xSmall)",
                            marginTop: "var(--aegis-space-medium)",
                            paddingTop: "var(--aegis-space-medium)",
                            borderTop: "1px solid var(--aegis-color-border-default)",
                          }}
                        >
                          <Text variant="label.medium.bold">Documentation</Text>
                          <Button
                            variant="subtle"
                            leading={
                              <Icon size="small">
                                <LfFileLines />
                              </Icon>
                            }
                            onClick={() => {
                              setIsOpen(false);
                              handleDocsOpenChange(true);
                            }}
                            disabled={adjacentMarkdownFiles.length === 0}
                          >
                            Open Docs ({adjacentMarkdownFiles.length})
                          </Button>
                          {adjacentMarkdownFiles.length === 0 && (
                            <FormControl.Caption>No markdown files found in this directory.</FormControl.Caption>
                          )}
                        </div>

                        {/* Feature Flags */}
                        {Object.keys(FLAG_DEFINITIONS).length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--aegis-space-xSmall)",
                              marginTop: "var(--aegis-space-medium)",
                              paddingTop: "var(--aegis-space-medium)",
                              borderTop: "1px solid var(--aegis-color-border-default)",
                            }}
                          >
                            <Text variant="label.medium.bold">Feature Flags</Text>
                            {(Object.keys(FLAG_DEFINITIONS) as FlagName[]).map((key) => (
                              <FormControl key={key}>
                                <Switch checked={flags[key]} onChange={(e) => setFlag(key, e.target.checked)}>
                                  {FLAG_DEFINITIONS[key].description}
                                </Switch>
                              </FormControl>
                            ))}
                            <Button variant="subtle" size="small" onClick={resetFlags}>
                              Reset all to defaults
                            </Button>
                          </div>
                        )}

                        {/* Prototype Tools - only shown when PrototypeShell is active */}
                        {protoTools && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--aegis-space-xSmall)",
                              marginTop: "var(--aegis-space-medium)",
                              paddingTop: "var(--aegis-space-medium)",
                              borderTop: "1px solid var(--aegis-color-border-default)",
                            }}
                          >
                            <Text variant="label.medium.bold">Prototype Tools</Text>
                            {protoTools.mapData && protoTools.mapData.nodes.length > 0 && (
                              <Button
                                variant="subtle"
                                leading={
                                  <Icon size="small">
                                    <LfGraphNode />
                                  </Icon>
                                }
                                onClick={() => {
                                  setIsOpen(false);
                                  setProtoDrawer("map");
                                }}
                              >
                                Map ({protoTools.mapData.nodes.length} screens)
                              </Button>
                            )}
                            {protoTools.specContent && (
                              <Button
                                variant="subtle"
                                leading={
                                  <Icon size="small">
                                    <LfRule />
                                  </Icon>
                                }
                                onClick={() => {
                                  setIsOpen(false);
                                  setProtoDrawer("spec");
                                }}
                              >
                                Spec
                              </Button>
                            )}
                            {protoTools.qaContent && (
                              <Button
                                variant="subtle"
                                leading={
                                  <Icon size="small">
                                    <LfClipboardList />
                                  </Icon>
                                }
                                onClick={() => {
                                  setIsOpen(false);
                                  setProtoDrawer("qa");
                                }}
                              >
                                QA Checklist
                              </Button>
                            )}
                          </div>
                        )}
                      </Form>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--aegis-space-medium)",
                        }}
                      >
                        <FormControl>
                          <FormControl.Label>編集モード</FormControl.Label>
                          <div
                            style={{
                              display: "flex",
                              gap: "var(--aegis-space-xSmall)",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              variant={isEditMode ? "solid" : "subtle"}
                              onClick={() => setIsEditMode((prev) => !prev)}
                              disabled={!variantEditable}
                            >
                              {isEditMode ? "編集モード ON" : "編集モード OFF"}
                            </Button>
                            <Button
                              variant="subtle"
                              onClick={() => {
                                void startPickMode();
                              }}
                              disabled={!variantEditable || isVariantLoading}
                            >
                              Pick on page
                            </Button>
                          </div>
                          <FormControl.Caption>
                            {variantEditable
                              ? "ON の間はこの画面から component の variant を変更し、ファイルへ直接保存できます。"
                              : "開発サーバー起動時のみ有効です。"}
                          </FormControl.Caption>
                        </FormControl>

                        {isEditMode && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--aegis-space-small)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text variant="label.medium.bold">Variant Targets ({variantTargets.length})</Text>
                              <Button
                                size="small"
                                variant="subtle"
                                onClick={() => void loadVariantTargets()}
                                disabled={isVariantLoading || !variantEditable}
                              >
                                Refresh
                              </Button>
                            </div>

                            {variantFeedback && (
                              <Text as="p" variant="body.small" color="subtle">
                                {variantFeedback}
                              </Text>
                            )}

                            {isVariantLoading ? (
                              <Text as="p" variant="body.small" color="subtle">
                                Loading editable variants...
                              </Text>
                            ) : variantTargets.length > 0 ? (
                              <ActionList>
                                {variantTargets.map((target) => (
                                  <ActionListItem key={target.id}>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "var(--aegis-space-xxSmall)",
                                        width: "100%",
                                        border:
                                          selectedTargetId === target.id
                                            ? "1px solid var(--aegis-color-border-information-bold)"
                                            : undefined,
                                        borderRadius: "var(--aegis-radius-small)",
                                        padding:
                                          selectedTargetId === target.id ? "var(--aegis-space-xxSmall)" : undefined,
                                      }}
                                    >
                                      <Text as="p" variant="body.small">
                                        {target.componentName} ({target.line}:{target.column})
                                      </Text>
                                      <Select
                                        options={getVariantOptions(target.currentVariant)}
                                        value={target.currentVariant}
                                        disabled={!variantEditable || applyingTargetId === target.id}
                                        onChange={(value) => {
                                          if (value) {
                                            void updateVariant(target, value);
                                          }
                                        }}
                                      />
                                    </div>
                                  </ActionListItem>
                                ))}
                              </ActionList>
                            ) : (
                              <Text as="p" variant="body.small" color="subtle">
                                このファイルには文字列リテラルの variant は見つかりませんでした。
                              </Text>
                            )}
                          </div>
                        )}
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      {/* File Info Tab */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--aegis-space-medium)",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "var(--aegis-space-xSmall)",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "var(--aegis-font-size-body-small)",
                                fontWeight: 600,
                              }}
                            >
                              File Path
                            </div>
                            <Button
                              size="small"
                              variant="subtle"
                              onClick={() => handleCopy(filePath, "path")}
                              leading={<Icon size="small">{copiedTab === "path" ? <LfCheck /> : <LfCopy />}</Icon>}
                            >
                              {copiedTab === "path" ? "Copied!" : "Copy"}
                            </Button>
                          </div>
                          <pre
                            style={{
                              backgroundColor: "var(--aegis-color-background-subtle)",
                              padding: "var(--aegis-space-small)",
                              borderRadius: "var(--aegis-radius-medium)",
                              fontSize: "13px",
                              fontFamily:
                                "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace",
                              margin: 0,
                              overflow: "auto",
                            }}
                          >
                            <code>{filePath}</code>
                          </pre>
                        </div>

                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "var(--aegis-space-xSmall)",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "var(--aegis-font-size-body-small)",
                                fontWeight: 600,
                              }}
                            >
                              GitHub URL
                            </div>
                            <Button
                              size="small"
                              variant="subtle"
                              onClick={() => handleCopy(githubUrl, "github")}
                              leading={<Icon size="small">{copiedTab === "github" ? <LfCheck /> : <LfCopy />}</Icon>}
                            >
                              {copiedTab === "github" ? "Copied!" : "Copy"}
                            </Button>
                          </div>
                          <div
                            style={{
                              backgroundColor: "var(--aegis-color-background-subtle)",
                              padding: "var(--aegis-space-small)",
                              borderRadius: "var(--aegis-radius-medium)",
                              fontSize: "13px",
                              fontFamily:
                                "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace",
                              margin: 0,
                              overflow: "auto",
                              wordBreak: "break-all",
                            }}
                          >
                            <a
                              href={githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "var(--aegis-color-text-link)" }}
                            >
                              {githubUrl}
                            </a>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      {/* Components Tab */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--aegis-space-small)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "var(--aegis-font-size-body-small)",
                              fontWeight: 600,
                            }}
                          >
                            Aegis Components Used ({aegisComponents.length})
                          </div>
                          <Button
                            size="small"
                            variant="subtle"
                            onClick={() => handleCopy(aegisComponents.join("\n"), "components")}
                            leading={<Icon size="small">{copiedTab === "components" ? <LfCheck /> : <LfCopy />}</Icon>}
                          >
                            {copiedTab === "components" ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                        {aegisComponents.length > 0 ? (
                          <div
                            style={{
                              maxHeight: "60vh",
                              overflow: "auto",
                            }}
                          >
                            <ActionList>
                              {aegisComponents.map((component) => (
                                <ActionListItem key={component}>{component}</ActionListItem>
                              ))}
                            </ActionList>
                          </div>
                        ) : (
                          <div
                            style={{
                              padding: "var(--aegis-space-medium)",
                              textAlign: "center",
                              color: "var(--aegis-color-text-subtle)",
                              fontSize: "var(--aegis-font-size-body-small)",
                            }}
                          >
                            No Aegis components found
                          </div>
                        )}
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button variant="subtle" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {isPickerActive && (
        <div
          data-aegis-editor-ui="true"
          style={{
            position: "fixed",
            top: "12px",
            right: "12px",
            zIndex: 1100,
            background: "var(--aegis-color-background-default)",
            border: "1px solid var(--aegis-color-border-default)",
            borderRadius: "var(--aegis-radius-medium)",
            padding: "var(--aegis-space-small)",
            display: "flex",
            alignItems: "center",
            gap: "var(--aegis-space-small)",
            boxShadow: "var(--aegis-shadow-medium)",
          }}
        >
          <Text variant="body.small">
            Picker active {hoveredElementVariant ? `(variant: ${hoveredElementVariant})` : ""}
          </Text>
          <Button size="small" variant="subtle" onClick={() => setIsPickerActive(false)}>
            Cancel
          </Button>
        </div>
      )}

      {isPickerActive && hoveredElementRect && (
        <div
          style={{
            position: "fixed",
            left: hoveredElementRect.left,
            top: hoveredElementRect.top,
            width: hoveredElementRect.width,
            height: hoveredElementRect.height,
            zIndex: 1090,
            pointerEvents: "none",
            border: "2px solid var(--aegis-color-border-information-bold)",
            borderRadius: "var(--aegis-radius-small)",
            backgroundColor: "rgba(59, 130, 246, 0.08)",
          }}
        />
      )}

      {isQuickEditorOpen && selectedTarget && (
        <div
          data-aegis-editor-ui="true"
          style={{
            position: "fixed",
            left: quickEditorPosition.left,
            top: quickEditorPosition.top,
            zIndex: 1000,
            width: "320px",
            maxWidth: "calc(100vw - 16px)",
            maxHeight: quickEditorMaxHeight,
            overflowY: "auto",
            border: "1px solid var(--aegis-color-border-default)",
            borderRadius: "var(--aegis-radius-medium)",
            backgroundColor: "var(--aegis-color-background-default)",
            boxShadow: "var(--aegis-shadow-large)",
            padding: "var(--aegis-space-small)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-small)",
          }}
        >
          <Text variant="label.medium.bold">Quick Variant Editor</Text>
          <Text variant="body.small" color="subtle">
            Pick した要素の近くで直接編集できます
          </Text>
          <FormControl>
            <FormControl.Label>Target</FormControl.Label>
            <Select
              options={quickTargetOptions}
              value={selectedTarget.id}
              onChange={(value) => {
                if (value) {
                  setSelectedTargetId(value);
                }
              }}
            />
          </FormControl>
          {selectedTarget.supportsVariant ? (
            <FormControl>
              <FormControl.Label>
                Variant ({selectedTarget.componentName} {selectedTarget.line}:{selectedTarget.column})
              </FormControl.Label>
              <Select
                options={getVariantOptions(selectedTarget.currentVariant)}
                value={quickEditorVariant}
                onChange={(value) => {
                  if (value) {
                    setQuickEditorVariant(value);
                  }
                }}
              />
              <FormControl.Caption>
                Current: {selectedTarget.currentVariant} / Next: {quickEditorVariant || "(none)"}
              </FormControl.Caption>
            </FormControl>
          ) : (
            <FormControl>
              <FormControl.Label>Variant</FormControl.Label>
              <FormControl.Caption>
                この要素は variant 編集対象ではありません（Text/spacing/props は編集可能）。
              </FormControl.Caption>
            </FormControl>
          )}
          <FormControl>
            <FormControl.Label>Text</FormControl.Label>
            <TextField
              value={quickEditorText}
              onChange={(event) => {
                setQuickEditorText(event.currentTarget.value);
              }}
              placeholder={selectedTarget.textValue ?? "No direct text"}
            />
            <FormControl.Caption>
              Current: {selectedTarget.textValue ?? "(none)"} / Next: {quickEditorText || "(none)"}
            </FormControl.Caption>
          </FormControl>
          <FormControl>
            <FormControl.Label>Gap</FormControl.Label>
            <Select
              size="small"
              options={getSpacingOptions(selectedTarget.gapValue ?? "")}
              value={quickEditorGap || undefined}
              onChange={(value) => {
                if (value) {
                  setQuickEditorGap(value);
                  void updateSpacing(selectedTarget, "gap", value);
                }
              }}
              placeholder="Select token"
              clearable
              onClear={() => {
                setQuickEditorGap("");
                void updateSpacing(selectedTarget, "gap", "");
              }}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Margin</FormControl.Label>
            <Select
              size="small"
              options={getSpacingOptions(selectedTarget.marginValue ?? "")}
              value={quickEditorMargin || undefined}
              onChange={(value) => {
                if (value) {
                  setQuickEditorMargin(value);
                  void updateSpacing(selectedTarget, "margin", value);
                }
              }}
              placeholder="Select token"
              clearable
              onClear={() => {
                setQuickEditorMargin("");
                void updateSpacing(selectedTarget, "margin", "");
              }}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Padding</FormControl.Label>
            <Select
              size="small"
              options={getSpacingOptions(selectedTarget.paddingValue ?? "")}
              value={quickEditorPadding || undefined}
              onChange={(value) => {
                if (value) {
                  setQuickEditorPadding(value);
                  void updateSpacing(selectedTarget, "padding", value);
                }
              }}
              placeholder="Select token"
              clearable
              onClear={() => {
                setQuickEditorPadding("");
                void updateSpacing(selectedTarget, "padding", "");
              }}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Any Prop</FormControl.Label>
            <Select
              options={selectedTargetPropOptions}
              value={quickEditorPropPath || undefined}
              onChange={(value) => {
                if (value) {
                  setQuickEditorPropPath(value);
                }
              }}
            />
            <TextField
              value={quickEditorPropValue}
              onChange={(event) => {
                setQuickEditorPropValue(event.currentTarget.value);
              }}
              placeholder={selectedEditableProp?.value ?? "prop value"}
            />
            <FormControl.Caption>gap 系は `style.gap` / `style.margin` を選択して編集できます。</FormControl.Caption>
          </FormControl>
          {(selectedTarget.currentIconName || selectedTarget.componentName === "IconButton") && (
            <FormControl>
              <FormControl.Label>Icon Suggest</FormControl.Label>
              <Select
                options={iconOptions}
                value={quickEditorIconName || undefined}
                onChange={(value) => {
                  if (value) {
                    setQuickEditorIconName(value);
                  }
                }}
              />
              <FormControl.Caption>
                Current: {selectedTarget.currentIconName ?? "(none)"} / Next: {quickEditorIconName || "(none)"}
              </FormControl.Caption>
            </FormControl>
          )}
          {variantFeedback && (
            <Text as="p" variant="body.small" color="subtle">
              {variantFeedback}
            </Text>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "var(--aegis-space-xSmall)",
              flexWrap: "wrap",
            }}
          >
            <Button size="small" variant="subtle" onClick={() => void editorUndo()}>
              Undo
            </Button>
            <Button size="small" variant="subtle" onClick={() => void editorRedo()}>
              Redo
            </Button>
            <div style={{ flex: 1 }} />
            <Button
              size="small"
              variant="subtle"
              onClick={() => {
                setIsQuickEditorOpen(false);
              }}
            >
              Close
            </Button>
            <Button
              size="small"
              variant="subtle"
              disabled={applyingTargetId === selectedTarget.id}
              onClick={() => {
                void applyQuickEdit(true);
              }}
            >
              Apply & Next
            </Button>
            <Button
              size="small"
              variant="solid"
              disabled={applyingTargetId === selectedTarget.id}
              onClick={() => {
                void applyQuickEdit(false);
              }}
            >
              Apply to Code
            </Button>
          </div>
        </div>
      )}

      {/* Docs Drawer - Resizable */}
      <Drawer
        open={isDocsOpen}
        onOpenChange={handleDocsOpenChange}
        position="end"
        resizable
        width="xLarge"
        minWidth="small"
        maxWidth="xLarge"
        closeOnOutsidePress={false}
        modal={false}
      >
        <Drawer.Header>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "var(--aegis-space-medium)",
              width: "100%",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <Select
                options={mdFileOptions}
                value={selectedMdFile || undefined}
                onChange={(value) => {
                  if (value) {
                    handleFileSelect(value);
                  }
                }}
              />
            </div>
            <Button
              size="small"
              variant="subtle"
              onClick={() => handleCopy(mdContent, "docs")}
              disabled={!mdContent || isMdLoading}
              leading={<Icon size="small">{copiedTab === "docs" ? <LfCheck /> : <LfCopy />}</Icon>}
            >
              {copiedTab === "docs" ? "Copied!" : "Copy"}
            </Button>
          </div>
        </Drawer.Header>
        <Drawer.Body>
          <div
            style={{
              backgroundColor: "var(--aegis-color-background-subtle)",
              borderRadius: "var(--aegis-radius-medium)",
              height: "100%",
              overflow: "auto",
            }}
          >
            {isMdLoading ? (
              <div
                style={{
                  padding: "var(--aegis-space-medium)",
                  textAlign: "center",
                  color: "var(--aegis-color-text-subtle)",
                }}
              >
                Loading...
              </div>
            ) : (
              <MarkdownRenderer content={mdContent} />
            )}
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="subtle" onClick={() => handleDocsOpenChange(false)}>
            閉じる
          </Button>
        </Drawer.Footer>
      </Drawer>

      {/* Prototype Map Drawer */}
      {protoTools?.mapData && protoTools.mapData.nodes.length > 0 && (
        <Drawer
          open={protoDrawer === "map"}
          onOpenChange={(open) => !open && setProtoDrawer(null)}
          position="end"
          resizable
          width="xLarge"
          minWidth="medium"
          maxWidth="xLarge"
          closeOnOutsidePress={false}
          modal={false}
        >
          <Drawer.Header>
            <Text variant="label.medium.bold">Screen Flow Map</Text>
          </Drawer.Header>
          <Drawer.Body>
            <div style={{ height: "100%", minHeight: 400 }}>
              <Suspense
                fallback={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <Text variant="body.small" color="subtle">
                      Loading map...
                    </Text>
                  </div>
                }
              >
                <FlowMap
                  nodes={protoTools.mapData.nodes}
                  edges={protoTools.mapData.edges ?? []}
                  onNodeClick={protoTools.onMapNodeClick}
                />
              </Suspense>
            </div>
          </Drawer.Body>
          <Drawer.Footer>
            <Button variant="subtle" onClick={() => setProtoDrawer(null)}>
              閉じる
            </Button>
          </Drawer.Footer>
        </Drawer>
      )}

      {/* Prototype Spec Drawer */}
      {protoTools?.specContent && (
        <Drawer
          open={protoDrawer === "spec"}
          onOpenChange={(open) => !open && setProtoDrawer(null)}
          position="end"
          resizable
          width="xLarge"
          minWidth="small"
          maxWidth="xLarge"
          closeOnOutsidePress={false}
          modal={false}
        >
          <Drawer.Header>
            <Text variant="label.medium.bold">Spec</Text>
          </Drawer.Header>
          <Drawer.Body>
            <div
              style={{
                backgroundColor: "var(--aegis-color-background-subtle)",
                borderRadius: "var(--aegis-radius-medium)",
                height: "100%",
                overflow: "auto",
              }}
            >
              <MarkdownRenderer content={protoTools.specContent} />
            </div>
          </Drawer.Body>
          <Drawer.Footer>
            <Button variant="subtle" onClick={() => setProtoDrawer(null)}>
              閉じる
            </Button>
          </Drawer.Footer>
        </Drawer>
      )}

      {/* Prototype QA Drawer */}
      {protoTools?.qaContent && (
        <Drawer
          open={protoDrawer === "qa"}
          onOpenChange={(open) => !open && setProtoDrawer(null)}
          position="end"
          resizable
          width="xLarge"
          minWidth="small"
          maxWidth="xLarge"
          closeOnOutsidePress={false}
          modal={false}
        >
          <Drawer.Header>
            <Text variant="label.medium.bold">QA Checklist</Text>
          </Drawer.Header>
          <Drawer.Body>
            <div
              style={{
                backgroundColor: "var(--aegis-color-background-subtle)",
                borderRadius: "var(--aegis-radius-medium)",
                height: "100%",
                overflow: "auto",
              }}
            >
              <MarkdownRenderer content={protoTools.qaContent} />
            </div>
          </Drawer.Body>
          <Drawer.Footer>
            <Button variant="subtle" onClick={() => setProtoDrawer(null)}>
              閉じる
            </Button>
          </Drawer.Footer>
        </Drawer>
      )}
    </>
  );
};

export default FloatingSourceCodeViewer;
