import {
  LfBrowserCode,
  LfCloseCircle,
  LfContrast,
  LfEllipsisDot,
  LfEllipsisLine,
  LfEye,
  LfEyeSlash,
  LfFaceMoodSmile,
  LfFileCode,
  LfLayout,
  LfLayoutAlignCenter,
  LfLayoutAlignLeft,
  LfLayoutAlignRight,
  LfLayoutFillRight,
  LfMinusSmall,
  LfPalette,
  LfPlusLarge,
  LfReply,
  LfTrash,
} from "@legalforce/aegis-icons/react";
import {
  ActionList,
  Button,
  ButtonGroup,
  ContentHeader,
  ContentHeaderTitle,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Footer,
  FormControl,
  Header,
  Icon,
  IconButton,
  Menu,
  MenuContent,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
  Overflow,
  OverflowItem,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutSidebar,
  Popover,
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarNavigation,
  SidebarNavigationItem,
  SidebarNavigationLink,
  SidebarNavigationSeparator,
  SidebarNavigationSubTrigger,
  SidebarProvider,
  SideNavigation,
  Tab,
  Text,
  Toolbar,
  ToolbarSeparator,
  Tooltip,
} from "@legalforce/aegis-react";
import type React from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useTransition } from "react";
import { Placeholder } from "../../../../../components/Placeholder";
import { buildPageLayoutJsxText } from "./buildPageLayoutJsxText";
import styles from "./index.module.css";
import { LayoutDrawer } from "./LayoutDrawer";
import colorSchemeStyles from "./token-overrides/color-scheme-neutral-light.module.css";
import {
  buildDesignTokenOverrideCSSProperties,
  buildDesignTokenOverrideExportCSS,
  type ComponentOverrides,
  type DesignTokenOverrideCategory,
  type DesignTokenOverrides,
  EMPTY_COMPONENT_OVERRIDES,
  EMPTY_OVERRIDES,
  NEW_TOKENS_STORAGE_KEY,
  type NewTokenEntry,
} from "./token-overrides/design-token-overrides";
import tokenUsageMap from "./token-overrides/token-usage-map.json";

/** All Aegis component CSS selectors derived from token-usage-map. Used for @scope `to` clause. */
const AEGIS_COMPONENT_SELECTORS = Array.from(new Set(Object.values(tokenUsageMap).flat()))
  .map((c) => `.aegis-${c}`)
  .join(", ");

import {
  buildScrollAreaWorkaroundCss,
  buildThemeCssText,
  buildTokenOverrideStyle,
  INITIAL_PALETTE_TEXT,
} from "./token-overrides/tokens";
import type { ContentArea, LayoutKey } from "./types";
import { AddContentView } from "./views/AddContentView";
import { AddContentPopover } from "./views/AddContentView/AddContentPopover";
import { ComponentRenderer } from "./views/AddContentView/ComponentRenderer";
import { AREA_COMPONENT_DEFAULT_PROPS } from "./views/AddContentView/componentRegistry";
import type { ComponentKey, ContentItem } from "./views/AddContentView/types";
import { ContrastCheckDialog } from "./views/ContrastCheckDialog";
import { DefaultView } from "./views/DefaultView";
import { DesignTokenOverrideView } from "./views/DesignTokenOverrideView";
import { EditZone } from "./views/EditZone";
import { FooterContentView } from "./views/FooterContentView";
import { HeaderContentView } from "./views/HeaderContentView";
import { LayoutEditView } from "./views/LayoutEditView";
import { SideNavZone } from "./views/SideNavZone";
import { SizingAndStylingPopover } from "./views/SizingAndStylingView/SizingAndStylingPopover";
import {
  type AlignValue,
  type AreaSettings,
  DEFAULT_AREA_SETTINGS,
  DEFAULT_GLOBAL_STYLING,
  DEFAULT_PANE_SETTINGS,
  DEFAULT_SIDEBAR_SETTINGS,
  type GlobalStylingSettings,
  type PaneSettings,
  type SidebarSettings,
  type SidebarWidth,
} from "./views/SizingAndStylingView/types";
import { createInitialThemeCustomizationState, ThemeCustomizationModeView } from "./views/ThemeCustomizationView";
import { ThemeView } from "./views/ThemeView";

const THEME_CUSTOMIZATION_STATE_STORAGE_KEY = "sandbox-builder-theme-customization-state";

const normalizeThemeCustomizationState = (
  state: ReturnType<typeof createInitialThemeCustomizationState>,
): ReturnType<typeof createInitialThemeCustomizationState> => {
  const initialState = createInitialThemeCustomizationState();

  return {
    ...initialState,
    ...state,
    themeSelections: {
      ...initialState.themeSelections,
      ...state.themeSelections,
    },
    popoverSwatches: {
      ...initialState.popoverSwatches,
      ...state.popoverSwatches,
    },
    paletteSwatches: {
      ...initialState.paletteSwatches,
      ...state.paletteSwatches,
    },
    chromaAdjustments: {
      ...initialState.chromaAdjustments,
      ...state.chromaAdjustments,
    },
    popoverEditorStates: {
      ...initialState.popoverEditorStates,
      ...Object.fromEntries(
        Object.entries(state.popoverEditorStates ?? {}).map(([key, value]) => [
          key,
          {
            ...initialState.popoverEditorStates[key as keyof typeof initialState.popoverEditorStates],
            ...value,
            customChromaValues: {
              ...initialState.popoverEditorStates[key as keyof typeof initialState.popoverEditorStates]
                .customChromaValues,
              ...(value?.customChromaValues ?? {}),
            },
          },
        ]),
      ),
    },
  };
};

const xSubtle = {
  height: "100%",
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
} as const;
const xSubtleBar = {
  width: "100%",
  padding: 0,
  backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
} as const;
const xSubtleWidth = {
  width: "100%",
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
} as const;

const CONTENT_AREAS: ContentArea[] = ["contentHeader", "contentBody", "contentFooter"];

// Pane Width > Content width 制約のための数値マッピング
const PANE_WIDTH_PX_NUM: Record<string, number> = {
  small: 240,
  medium: 320,
  large: 400,
  xLarge: 480,
  xxLarge: 560,
};

export const SandboxBuilder = () => {
  const [isLayoutOpen, setIsLayoutOpen] = useState(false);
  const [isContrastCheckOpen, setIsContrastCheckOpen] = useState(false);
  const [isBellDialogOpen, setIsBellDialogOpen] = useState(false);
  const [isEditModeTransitionPending, startEditModeTransition] = useTransition();
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);
  const [isDesignTokenOverrideOpen, setIsDesignTokenOverrideOpen] = useState(false);
  const [designTokenOverrides, setDesignTokenOverrides] = useState<DesignTokenOverrides>(EMPTY_OVERRIDES);

  // ── New tokens (lifted from DesignTokenOverrideView) ──────────────────────
  const [newTokens, setNewTokens] = useState<Record<DesignTokenOverrideCategory, NewTokenEntry[]>>(() => {
    try {
      const stored = localStorage.getItem(NEW_TOKENS_STORAGE_KEY);
      if (stored) return JSON.parse(stored) as Record<DesignTokenOverrideCategory, NewTokenEntry[]>;
    } catch {
      // ignore parse errors
    }
    return { background: [], foreground: [], border: [] };
  });
  useEffect(() => {
    localStorage.setItem(NEW_TOKENS_STORAGE_KEY, JSON.stringify(newTokens));
  }, [newTokens]);

  /** Palette refs for new tokens, used by contrast-utils. */
  const newTokenRefs = useMemo((): Record<DesignTokenOverrideCategory, Record<string, string>> => {
    const result = {
      background: {} as Record<string, string>,
      foreground: {} as Record<string, string>,
      border: {} as Record<string, string>,
    };
    for (const cat of ["background", "foreground", "border"] as const) {
      for (const t of newTokens[cat]) {
        if (t.key && t.value) result[cat][t.key] = t.value;
      }
    }
    return result;
  }, [newTokens]);

  // ── Component-scoped overrides ────────────────────────────────────────────
  const [componentOverrides, setComponentOverrides] = useState<ComponentOverrides>(EMPTY_COMPONENT_OVERRIDES);

  const setComponentOverride = useCallback(
    (component: string, category: DesignTokenOverrideCategory, key: string, value: string | null) => {
      setComponentOverrides((prev) => {
        const compOverrides = prev[component] ?? EMPTY_OVERRIDES;
        if (value === null) {
          const { [key]: _removed, ...rest } = compOverrides[category];
          return { ...prev, [component]: { ...compOverrides, [category]: rest } };
        }
        return {
          ...prev,
          [component]: { ...compOverrides, [category]: { ...compOverrides[category], [key]: value } },
        };
      });
    },
    [],
  );

  const resetComponentOverrides = useCallback((component: string) => {
    setComponentOverrides((prev) => {
      const { [component]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);
  const [iconNavStart, setIconNavStart] = useState(false);
  const [editMode, setEditMode] = useState<"addContent" | "layout" | "theme" | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState<"left" | "center" | "right">("center");
  const [tokenTabIndex, setTokenTabIndex] = useState(0);
  const [paletteText, setPaletteText] = useState(INITIAL_PALETTE_TEXT);
  // HMR: palette.json 変更時に state を即時同期
  useEffect(() => {
    setPaletteText(INITIAL_PALETTE_TEXT);
  }, []);
  const [designTokenText, setDesignTokenText] = useState("{}");
  const themeCssText = useMemo(
    () =>
      buildThemeCssText({
        paletteText,
        designTokenText,
      }),
    [designTokenText, paletteText],
  );
  const brandForegroundColor = useMemo(() => {
    try {
      const parsed = JSON.parse(designTokenText) as {
        BrandForeground?: { default?: string };
      };
      return parsed.BrandForeground?.default;
    } catch {
      return undefined;
    }
  }, [designTokenText]);
  const updateBrandDesignTokenText = useCallback(
    (tokens: {
      background?: Record<string, string>;
      backgroundManagedKeys?: string[];
      forground?: Record<string, string>;
      forgroundManagedKeys?: string[];
      Brand?: { default: string };
      BrandBackground?: { bold: string; "bold.hovered": string; "bold.pressed": string };
      BrandForeground?: { default: string };
      ThemeAccent?: Record<string, unknown>;
      BaseBackground?: Record<string, string>;
      BaseForeground?: Record<string, string>;
    }) => {
      setDesignTokenText((prev) => {
        try {
          const parsed = JSON.parse(prev) as Record<string, unknown>;
          const next = { ...parsed };

          if (tokens.Brand) {
            next.Brand = tokens.Brand;
          } else {
            delete next.Brand;
          }

          if (tokens.BrandBackground) {
            next.BrandBackground = tokens.BrandBackground;
          } else {
            delete next.BrandBackground;
          }

          if (tokens.backgroundManagedKeys && tokens.backgroundManagedKeys.length > 0) {
            const background =
              typeof next.background === "object" && next.background !== null
                ? { ...(next.background as Record<string, unknown>) }
                : {};

            tokens.backgroundManagedKeys.forEach((key) => {
              delete background[key];
            });

            if (tokens.background) {
              Object.assign(background, tokens.background);
            }

            if (Object.keys(background).length === 0) {
              delete next.background;
            } else {
              next.background = background;
            }
          }

          if (tokens.forgroundManagedKeys && tokens.forgroundManagedKeys.length > 0) {
            const forground =
              typeof next.forground === "object" && next.forground !== null
                ? { ...(next.forground as Record<string, unknown>) }
                : {};

            tokens.forgroundManagedKeys.forEach((key) => {
              delete forground[key];
            });

            if (tokens.forground) {
              Object.assign(forground, tokens.forground);
            }

            if (Object.keys(forground).length === 0) {
              delete next.forground;
            } else {
              next.forground = forground;
            }
          }

          if (tokens.BrandForeground) {
            next.BrandForeground = tokens.BrandForeground;
          } else {
            delete next.BrandForeground;
          }

          if (tokens.ThemeAccent) {
            next.ThemeAccent = tokens.ThemeAccent;
          } else {
            delete next.ThemeAccent;
          }

          if (tokens.BaseBackground) {
            next.BaseBackground = tokens.BaseBackground;
          } else {
            delete next.BaseBackground;
          }

          if (tokens.BaseForeground) {
            next.BaseForeground = tokens.BaseForeground;
          } else {
            delete next.BaseForeground;
          }

          return JSON.stringify(next, null, 2);
        } catch {
          return JSON.stringify(tokens, null, 2);
        }
      });
    },
    [],
  );
  const upsertDesignTokenOverride = useCallback(
    (category: "background" | "foreground" | "border", key: string, value: string) => {
      setDesignTokenOverrides((prev) => ({
        ...prev,
        [category]: { ...prev[category], [key]: value },
      }));
    },
    [],
  );
  const resetDesignTokenOverride = useCallback((category: "background" | "foreground" | "border", key: string) => {
    setDesignTokenOverrides((prev) => {
      const { [key]: _removed, ...rest } = prev[category];
      return { ...prev, [category]: rest };
    });
  }, []);
  const designTokenOverrideExportCSS = useMemo(
    () => buildDesignTokenOverrideExportCSS(designTokenOverrides),
    [designTokenOverrides],
  );
  const downloadCode = () => {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (tokenTabIndex === 0) {
      content = pageLayoutJsxText;
      filename = "page-layout.tsx";
      mimeType = "text/plain";
    } else if (tokenTabIndex === 1) {
      content = themeCssText;
      filename = "theme.css";
      mimeType = "text/css";
    } else if (tokenTabIndex === 2) {
      content = designTokenText;
      filename = "design-tokens.json";
      mimeType = "application/json";
    } else {
      const { background, foreground, border } = designTokenOverrideExportCSS;
      const parts = [
        background ? `/* background */\n${background}` : "",
        foreground ? `/* foreground */\n${foreground}` : "",
        border ? `/* border */\n${border}` : "",
      ].filter(Boolean);
      content = parts.join("\n\n");
      filename = "override-design-token.css";
      mimeType = "text/css";
    }
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };
  const [contentAreaItems, setContentAreaItems] = useState<Record<ContentArea, ContentItem[]>>(() => ({
    globalHeader: [],
    globalFooter: [],
    contentHeader: [
      { id: crypto.randomUUID(), component: "ContentHeader" as const, props: { titleText: "Content Title" } },
    ],
    contentBody: [],
    contentFooter: [],
    paneStartHeader: [
      { id: crypto.randomUUID(), component: "ContentHeader" as const, props: { titleText: "Pane Title" } },
    ],
    paneStartBody: [],
    paneStartFooter: [],
    paneEndHeader: [
      { id: crypto.randomUUID(), component: "ContentHeader" as const, props: { titleText: "Pane Title" } },
    ],
    paneEndBody: [],
    paneEndFooter: [],
    outerSidebarStartHeader: [
      { id: crypto.randomUUID(), component: "ContentHeader" as const, props: { titleText: "Sidebar Title" } },
    ],
    outerSidebarStartBody: [],
    outerSidebarStartFooter: [],
    outerSidebarEndHeader: [
      { id: crypto.randomUUID(), component: "ContentHeader" as const, props: { titleText: "Sidebar Title" } },
    ],
    outerSidebarEndBody: [],
    outerSidebarEndFooter: [],
    innerSidebarStart: [],
    innerSidebarEnd: [],
  }));
  const [innerStartProps, setInnerStartProps] = useState<Record<string, string>>({});
  const [innerEndProps, setInnerEndProps] = useState<Record<string, string>>({});
  const addContentItem = (area: ContentArea, component: ComponentKey, slot?: "start" | "end") => {
    // CheckboxCard は CheckboxGroup (card モード) として追加
    const effectiveComponent: ComponentKey = component === "CheckboxCard" ? "CheckboxGroup" : component;
    const presetProps: Record<string, string> = component === "CheckboxCard" ? { withCheckboxCard: "true" } : {};
    const defaultProps = AREA_COMPONENT_DEFAULT_PROPS[area]?.[effectiveComponent];
    const mergedProps = { ...presetProps, ...(defaultProps ?? {}) };
    const hasProps = Object.keys(mergedProps).length > 0;
    setContentAreaItems((prev) => ({
      ...prev,
      [area]: [
        ...prev[area],
        {
          id: crypto.randomUUID(),
          component: effectiveComponent,
          ...(slot !== undefined && { slot }),
          ...(hasProps && { props: mergedProps }),
        },
      ],
    }));
  };
  const removeContentItem = (area: ContentArea, id: string) =>
    setContentAreaItems((prev) => ({ ...prev, [area]: prev[area].filter((item) => item.id !== id) }));
  const reorderContentItems = (area: ContentArea, items: ContentItem[]) =>
    setContentAreaItems((prev) => ({ ...prev, [area]: items }));
  const updateContentItem = (area: ContentArea, id: string, props: Record<string, string>) =>
    setContentAreaItems((prev) => ({
      ...prev,
      [area]: prev[area].map((item) => (item.id === id ? { ...item, props } : item)),
    }));
  const [layoutAreaSettings, setLayoutAreaSettings] = useState<Partial<Record<ContentArea, AreaSettings>>>({});
  const updateLayoutSettings = (area: ContentArea, settings: AreaSettings) =>
    setLayoutAreaSettings((prev) => ({ ...prev, [area]: settings }));
  const [contentColumnSettings, setContentColumnSettings] = useState<AreaSettings>(DEFAULT_AREA_SETTINGS);
  const [paneStartSettings, setPaneStartSettings] = useState<PaneSettings>(DEFAULT_PANE_SETTINGS);
  const [paneEndSettings, setPaneEndSettings] = useState<PaneSettings>(DEFAULT_PANE_SETTINGS);
  const [sidebarStartSettings, setSidebarStartSettings] = useState<SidebarSettings>(DEFAULT_SIDEBAR_SETTINGS);
  const [sidebarEndSettings, setSidebarEndSettings] = useState<SidebarSettings>(DEFAULT_SIDEBAR_SETTINGS);
  const [globalStyling, setGlobalStyling] = useState<GlobalStylingSettings>(DEFAULT_GLOBAL_STYLING);

  // resizable ON→OFF 時に Resizable 内部の requestedValueRef をリセットするため、
  // width を一度別の値に変更してリセットをトリガーする（sandbox プロトタイプ専用のワークアラウンド）
  const [sidebarStartWidthOverride, setSidebarStartWidthOverride] = useState<SidebarWidth | null>(null);
  const [sidebarEndWidthOverride, setSidebarEndWidthOverride] = useState<SidebarWidth | null>(null);
  const prevSidebarStartResizableRef = useRef(DEFAULT_SIDEBAR_SETTINGS.resizable);
  const prevSidebarEndResizableRef = useRef(DEFAULT_SIDEBAR_SETTINGS.resizable);

  useEffect(() => {
    if (prevSidebarStartResizableRef.current && !sidebarStartSettings.resizable) {
      setSidebarStartWidthOverride(sidebarStartSettings.width === "small" ? "medium" : "small");
    }
    prevSidebarStartResizableRef.current = sidebarStartSettings.resizable;
  }, [sidebarStartSettings.resizable, sidebarStartSettings.width]);

  useEffect(() => {
    if (prevSidebarEndResizableRef.current && !sidebarEndSettings.resizable) {
      setSidebarEndWidthOverride(sidebarEndSettings.width === "small" ? "medium" : "small");
    }
    prevSidebarEndResizableRef.current = sidebarEndSettings.resizable;
  }, [sidebarEndSettings.resizable, sidebarEndSettings.width]);

  useEffect(() => {
    if (sidebarStartWidthOverride !== null) {
      setSidebarStartWidthOverride(null);
    }
  }, [sidebarStartWidthOverride]);

  useEffect(() => {
    if (sidebarEndWidthOverride !== null) {
      setSidebarEndWidthOverride(null);
    }
  }, [sidebarEndWidthOverride]);

  const [themeCustomizationState, setThemeCustomizationState] = useState(() => {
    if (typeof window === "undefined") {
      return createInitialThemeCustomizationState();
    }

    try {
      const savedState = window.sessionStorage.getItem(THEME_CUSTOMIZATION_STATE_STORAGE_KEY);
      if (!savedState) {
        return normalizeThemeCustomizationState(createInitialThemeCustomizationState());
      }

      return normalizeThemeCustomizationState({
        ...createInitialThemeCustomizationState(),
        ...JSON.parse(savedState),
      });
    } catch {
      return normalizeThemeCustomizationState(createInitialThemeCustomizationState());
    }
  });
  const tokenOverrideStyle = useMemo(
    () => ({
      ...buildTokenOverrideStyle({
        paletteText,
        designTokenText,
      }),
      // Override Design Token: semantic token → palette slot overrides applied last
      ...buildDesignTokenOverrideCSSProperties(designTokenOverrides),
    }),
    [paletteText, designTokenText, designTokenOverrides],
  );

  useLayoutEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const bodyStyle = document.body.style;
    const entries = Object.entries(tokenOverrideStyle).filter(([key, value]) => key.startsWith("--") && value != null);

    entries.forEach(([key, value]) => {
      bodyStyle.setProperty(key, String(value));
    });

    return () => {
      entries.forEach(([key]) => {
        bodyStyle.removeProperty(key);
      });
    };
  }, [tokenOverrideStyle]);

  // ── Component-scoped CSS injection (@scope) ──────────────────────────────
  useLayoutEffect(() => {
    if (typeof document === "undefined") return;

    const rules = Object.entries(componentOverrides)
      .flatMap(([component, overridesForComp]) => {
        const declarations = (["background", "foreground", "border"] as const).flatMap((cat) =>
          Object.entries(overridesForComp[cat] ?? {}).map(([key, paletteRef]) => {
            const cssVar = `--aegis-color-${cat}-${key}`;
            const paletteVar = `--aegis-internal-color-palette-${paletteRef.replaceAll(".", "-")}`;
            return `    ${cssVar}: var(${paletteVar});`;
          }),
        );
        if (declarations.length === 0) return [];
        return [
          `@scope (.aegis-${component}) to (${AEGIS_COMPONENT_SELECTORS}) {`,
          "  :scope {",
          ...declarations,
          "  }",
          "}",
        ];
      })
      .join("\n");

    let el = document.getElementById("sandbox-builder-component-overrides");
    if (!el) {
      el = document.createElement("style");
      el.id = "sandbox-builder-component-overrides";
      document.head.appendChild(el);
    }
    el.textContent = rules;

    return () => {
      document.getElementById("sandbox-builder-component-overrides")?.remove();
    };
  }, [componentOverrides]);

  useLayoutEffect(() => {
    if (typeof document === "undefined") return;

    const scopeSelector = `body.${colorSchemeStyles.scope}`;
    const rules = buildScrollAreaWorkaroundCss(scopeSelector);

    let el = document.getElementById("sandbox-builder-scrollarea-workaround");
    if (!el) {
      el = document.createElement("style");
      el.id = "sandbox-builder-scrollarea-workaround";
      document.head.appendChild(el);
    }
    el.textContent = rules;

    return () => {
      document.getElementById("sandbox-builder-scrollarea-workaround")?.remove();
    };
  }, []);

  // color-scheme-neutral-light.module.css の .scope クラスを body に適用する。
  // これにより Provider に依存せず semantic token が palette var 参照を経由して
  // テーマカスタマイズと Override Design Token の両方に反応する。
  // inline style (Override Design Token) は class style より優先されるため競合しない。
  useLayoutEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    document.body.classList.add(colorSchemeStyles.scope);
    return () => {
      document.body.classList.remove(colorSchemeStyles.scope);
    };
  }, []);

  const sidebarStartIconNavigationItems = [
    ...Array.from({ length: 5 }, (_, index) => ({
      key: `subtrigger-${index}`,
      kind: "subtrigger" as const,
      label: "SidebarStart",
    })),
    {
      key: "separator",
      kind: "separator" as const,
      label: "Separator",
    },
    ...Array.from({ length: 3 }, (_, index) => ({
      key: `link-${index}`,
      kind: "link" as const,
      label: "SidebarStart",
      current: index === 1,
    })),
  ];
  useEffect(() => {
    const handleOpenLayoutDrawer = () => {
      setIsLayoutOpen(true);
    };

    window.addEventListener("sandbox-builder:open-layout-drawer", handleOpenLayoutDrawer);

    return () => {
      window.removeEventListener("sandbox-builder:open-layout-drawer", handleOpenLayoutDrawer);
    };
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.sessionStorage.setItem(THEME_CUSTOMIZATION_STATE_STORAGE_KEY, JSON.stringify(themeCustomizationState));
  }, [themeCustomizationState]);
  const layoutTool = (area: ContentArea) => {
    const isPaneStart = ["paneStartHeader", "paneStartBody", "paneStartFooter"].includes(area);
    const isPaneEnd = ["paneEndHeader", "paneEndBody", "paneEndFooter"].includes(area);
    const isSidebarStart = ["outerSidebarStartHeader", "outerSidebarStartBody", "outerSidebarStartFooter"].includes(
      area,
    );
    const isSidebarEnd = ["outerSidebarEndHeader", "outerSidebarEndBody", "outerSidebarEndFooter"].includes(area);
    const isContentArea = CONTENT_AREAS.includes(area);
    // Pane Width > Content width: コンテンツエリアでアクティブな Pane の最大幅を計算
    const activePaneWidthPx = isContentArea
      ? (() => {
          const startPx = layout.paneStart ? (PANE_WIDTH_PX_NUM[paneStartSettings.paneWidth] ?? 0) : 0;
          const endPx = layout.paneEnd ? (PANE_WIDTH_PX_NUM[paneEndSettings.paneWidth] ?? 0) : 0;
          const maxPx = Math.max(startPx, endPx);
          return maxPx > 0 ? maxPx : undefined;
        })()
      : undefined;
    return (
      <LayoutEditView
        area={area}
        onHide={hideAll}
        onToggle={toggle}
        settings={isContentArea ? contentColumnSettings : (layoutAreaSettings[area] ?? DEFAULT_AREA_SETTINGS)}
        onUpdateSettings={isContentArea ? setContentColumnSettings : (s) => updateLayoutSettings(area, s)}
        paneSettings={isPaneStart ? paneStartSettings : isPaneEnd ? paneEndSettings : undefined}
        onUpdatePaneSettings={isPaneStart ? setPaneStartSettings : isPaneEnd ? setPaneEndSettings : undefined}
        hasPaneHeader={isPaneStart ? layout.paneStartHeader : isPaneEnd ? layout.paneEndHeader : undefined}
        sidebarSettings={isSidebarStart ? sidebarStartSettings : isSidebarEnd ? sidebarEndSettings : undefined}
        onUpdateSidebarSettings={
          isSidebarStart ? setSidebarStartSettings : isSidebarEnd ? setSidebarEndSettings : undefined
        }
        globalStyling={globalStyling}
        onUpdateGlobalStyling={setGlobalStyling}
        activePaneWidthPx={activePaneWidthPx}
        activeLayout={layout}
        compact={iconNavStart && isSidebarStart}
        iconSidebarEnabled={iconNavStart}
        onIconSidebarChange={setIconNavStart}
        onOpenEditPanel={() => setIsLayoutOpen(true)}
      />
    );
  };
  const contentMaxWidthStyle =
    contentColumnSettings.sizing.contentWidth !== "none"
      ? {
          maxWidth: contentColumnSettings.sizing.contentWidth,
          marginInlineStart: (["center", "end"] as AlignValue[]).includes(contentColumnSettings.sizing.contentAlign)
            ? "auto"
            : undefined,
          marginInlineEnd: (["center", "start"] as AlignValue[]).includes(contentColumnSettings.sizing.contentAlign)
            ? "auto"
            : undefined,
        }
      : undefined;
  const innerWidthStyle = contentColumnSettings.sizing.innerWidthEnabled
    ? {
        maxWidth: contentColumnSettings.sizing.innerWidth,
        width: "100%",
        marginInlineStart: (["center", "end"] as AlignValue[]).includes(contentColumnSettings.sizing.innerAlign)
          ? "auto"
          : undefined,
        marginInlineEnd: (["center", "start"] as AlignValue[]).includes(contentColumnSettings.sizing.innerAlign)
          ? "auto"
          : undefined,
      }
    : undefined;
  const getContentInnerStyle = (section: "header" | "body" | "footer"): React.CSSProperties | undefined =>
    innerWidthStyle
      ? {
          ...innerWidthStyle,
          ...(section === "body" ? { height: "100%" } : {}),
        }
      : undefined;
  const renderContentInner = (section: "header" | "body" | "footer", children: React.ReactNode) => {
    const shouldWrap =
      contentColumnSettings.sizing.innerWidthEnabled &&
      (contentColumnSettings.sizing.innerScope === "all" || section === "body");

    return shouldWrap ? <div style={getContentInnerStyle(section)}>{children}</div> : children;
  };

  const [lockedArea, setLockedArea] = useState<ContentArea | null>(null);
  const [pendingOpenArea, setPendingOpenArea] = useState<ContentArea | null>(null);
  const activeArea = lockedArea ?? pendingOpenArea;
  const ezLock = (area: ContentArea) => ({
    forceVisible: activeArea === area,
  });
  const brickLock = (area: ContentArea) => ({
    onItemPopoverOpenChange: (open: boolean) => {
      setLockedArea(open ? area : null);
    },
  });
  const isLeftEdgeArea = (area: ContentArea): boolean => {
    if (
      [
        "outerSidebarStartHeader",
        "outerSidebarStartBody",
        "outerSidebarStartFooter",
        "innerSidebarStart",
        "paneStartHeader",
        "paneStartBody",
      ].includes(area)
    )
      return true;
    return false;
  };
  // overlay の top: 2px + padding: 4px 分を打ち消して EditZone 境界に揃える
  const toolbarCrossOffset = -(2 + 4);
  const addTool = (area: ContentArea) => (
    <div
      style={{ display: "contents" }}
      onPointerDown={() => {
        if (lockedArea === area) {
          setPendingOpenArea(area);
          skipNextCloseRef.current.add(area);
        }
      }}
    >
      <AddContentPopover
        area={area}
        onAdd={(c, slot) => addContentItem(area, c, slot)}
        items={contentAreaItems[area]}
        onRemove={(id: string) => removeContentItem(area, id)}
        onReorder={(newItems: ContentItem[]) => reorderContentItems(area, newItems)}
        onUpdate={(id, props) => updateContentItem(area, id, props)}
        variant="solid"
        size="xSmall"
        iconOnly
        placement={
          area === "globalHeader"
            ? "bottom-start"
            : (
                  ["globalFooter", "outerSidebarStartFooter", "paneStartFooter", "contentFooter"] as ContentArea[]
                ).includes(area)
              ? "top-start"
              : isLeftEdgeArea(area)
                ? "right-start"
                : "left-start"
        }
        triggerStyle={
          brandForegroundColor
            ? ({ "--aegis-color-foreground-inverse": brandForegroundColor } as React.CSSProperties)
            : undefined
        }
        crossOffset={area === "globalHeader" ? 4 : toolbarCrossOffset}
        open={pendingOpenArea === area ? true : undefined}
        onOpenChange={(open) => {
          if (!open && skipNextCloseRef.current.has(area)) {
            skipNextCloseRef.current.delete(area);
            return;
          }
          skipNextCloseRef.current.delete(area);
          setLockedArea(open ? area : null);
          if (!open) {
            setPendingOpenArea(null);
          }
        }}
      />
    </div>
  );
  const [preEditLayout, setPreEditLayout] = useState<Record<LayoutKey, boolean> | null>(null);
  const [preEditThemeSnapshot, setPreEditThemeSnapshot] = useState<{
    themeState: ReturnType<typeof createInitialThemeCustomizationState>;
    designTokenText: string;
    paletteText: string;
  } | null>(null);
  const skipNextCloseRef = useRef(new Set<ContentArea>());
  useEffect(() => {
    if (lockedArea) skipNextCloseRef.current.delete(lockedArea);
  }, [lockedArea]);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const prevWidthRef = useRef<number | null>(null);
  const captureWidth = () => {
    if (toolbarRef.current) prevWidthRef.current = toolbarRef.current.offsetWidth;
  };

  const enterEditMode = (mode: "layout" | "theme") => {
    captureWidth();
    setPreEditLayout(layout);
    if (mode === "theme") {
      setPreEditThemeSnapshot({ themeState: themeCustomizationState, designTokenText, paletteText });
    }
    startEditModeTransition(() => {
      setEditMode(mode);
    });
  };
  const revertEdit = () => {
    captureWidth();
    if (preEditLayout) setLayout(preEditLayout);
    if (preEditThemeSnapshot) {
      setThemeCustomizationState(preEditThemeSnapshot.themeState);
      setDesignTokenText(preEditThemeSnapshot.designTokenText);
      setPaletteText(preEditThemeSnapshot.paletteText);
    }
    setEditMode(null);
    setPreEditLayout(null);
    setPreEditThemeSnapshot(null);
  };
  const exitEditMode = () => {
    captureWidth();
    setPreEditLayout(null);
    setPreEditThemeSnapshot(null);
    setEditMode(null);
  };

  useLayoutEffect(() => {
    const el = toolbarRef.current;
    if (!el || prevWidthRef.current === null) return;
    const oldWidth = prevWidthRef.current;
    prevWidthRef.current = null;
    el.style.width = "";
    const newWidth = el.offsetWidth;
    el.style.transition = "none";
    el.style.width = `${oldWidth}px`;
    el.getBoundingClientRect();
    el.style.transition = "width var(--aegis-motion-duration-xFast) var(--aegis-motion-easing-default)";
    el.style.width = `${newWidth}px`;
  }, []);

  const [layout, setLayout] = useState<Record<LayoutKey, boolean>>({
    outerSidebarStart: true,
    outerSidebarStartHeader: true,
    outerSidebarStartFooter: true,
    outerSidebarEnd: true,
    outerSidebarEndHeader: true,
    outerSidebarEndFooter: true,
    globalHeader: true,
    globalFooter: true,
    contentHeader: true,
    contentFooter: true,
    paneStart: true,
    paneStartHeader: true,
    paneStartFooter: true,
    paneEnd: true,
    paneEndHeader: true,
    paneEndFooter: true,
    innerSidebarStart: true,
    innerSidebarEnd: true,
  });

  const pageLayoutJsxText = useMemo(
    () =>
      buildPageLayoutJsxText({
        layout,
        contentAreaItems,
        paneStartSettings,
        paneEndSettings,
        sidebarStartSettings,
        sidebarEndSettings,
        contentColumnSettings,
        globalStyling,
      }),
    [
      layout,
      contentAreaItems,
      paneStartSettings,
      paneEndSettings,
      sidebarStartSettings,
      sidebarEndSettings,
      contentColumnSettings,
      globalStyling,
    ],
  );
  const activeTokenTextareaValue = useMemo(
    () => (tokenTabIndex === 0 ? pageLayoutJsxText : tokenTabIndex === 1 ? themeCssText : designTokenText),
    [designTokenText, pageLayoutJsxText, themeCssText, tokenTabIndex],
  );
  // Tabs 0-2 use the single textarea; tab 3 (Override Design Token) uses 3 separate textareas.
  const isOverrideTab = tokenTabIndex === 3;
  const hide = (key: LayoutKey) => setLayout((prev) => ({ ...prev, [key]: false }));
  const hideAll = (...keys: LayoutKey[]) =>
    setLayout((prev) => ({ ...prev, ...Object.fromEntries(keys.map((k) => [k, false])) }));
  const toggle = (key: LayoutKey) => setLayout((prev) => ({ ...prev, [key]: !prev[key] }));
  const groupValue = (...keys: LayoutKey[]) => keys.filter((k) => layout[k]);
  const groupChange =
    (...keys: LayoutKey[]) =>
    (values: string[]) =>
      setLayout((prev) => ({ ...prev, ...Object.fromEntries(keys.map((k) => [k, values.includes(k)])) }));

  return (
    <div
      style={
        {
          display: "contents",
          "--editzone-sticky-top": layout.globalHeader ? "60px" : "4px",
          ...tokenOverrideStyle,
        } as React.CSSProperties
      }
    >
      <SidebarProvider defaultOpen>
        {editMode === "theme" ? (
          <SidebarInset>
            <SidebarProvider defaultOpen>
              <SidebarInset style={{ position: "relative" }}>
                <ThemeCustomizationModeView
                  globalStyling={globalStyling}
                  paneEndSettings={paneEndSettings}
                  onOpenTokenDialog={() => {
                    setTokenTabIndex(2);
                    setIsTokenDialogOpen(true);
                  }}
                  brandForegroundColor={brandForegroundColor}
                  themeState={themeCustomizationState}
                  onThemeStateChange={setThemeCustomizationState}
                  onBrandTokensChange={updateBrandDesignTokenText}
                />
              </SidebarInset>
            </SidebarProvider>
          </SidebarInset>
        ) : (
          <>
            {layout.outerSidebarStart && (
              <Sidebar
                side="inline-start"
                behavior={sidebarStartSettings.behavior}
                collapsible={sidebarStartSettings.collapsible}
                resizable={sidebarStartSettings.resizable}
                width={iconNavStart ? undefined : (sidebarStartWidthOverride ?? sidebarStartSettings.width)}
                minWidth={sidebarStartSettings.resizable ? sidebarStartSettings.minWidth : undefined}
                maxWidth={sidebarStartSettings.resizable ? sidebarStartSettings.maxWidth : undefined}
                variant={globalStyling.sidebarStart}
                className={styles.sidebarStart}
              >
                {layout.outerSidebarStartHeader && (
                  <EditZone
                    active={editMode === "addContent"}
                    label="Sidebar Start: Header"
                    toolbar={addTool("outerSidebarStartHeader")}
                    toolbarAlign="end"
                    {...ezLock("outerSidebarStartHeader")}
                  >
                    <SidebarHeader
                      style={
                        globalStyling.sidebarStartBorderHeader
                          ? {
                              borderBottom:
                                "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
                            }
                          : undefined
                      }
                    >
                      {editMode === null ? (
                        iconNavStart ? (
                          <Tooltip title="Sidebar Header" placement="right">
                            <IconButton variant="plain" size="medium" aria-label="Sidebar Header">
                              <Icon>
                                <LfFaceMoodSmile />
                              </Icon>
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <DefaultView
                            area="outerSidebarStartHeader"
                            items={contentAreaItems.outerSidebarStartHeader}
                            onAddContent={() => {
                              captureWidth();
                              setEditMode("addContent");
                              setPendingOpenArea("outerSidebarStartHeader");
                            }}
                          />
                        )
                      ) : editMode === "addContent" ? (
                        <AddContentView
                          area="outerSidebarStartHeader"
                          items={contentAreaItems.outerSidebarStartHeader}
                          onRemove={(id) => removeContentItem("outerSidebarStartHeader", id)}
                          onReorder={(newItems) => reorderContentItems("outerSidebarStartHeader", newItems)}
                          onUpdate={(id, props) => updateContentItem("outerSidebarStartHeader", id, props)}
                          {...brickLock("outerSidebarStartHeader")}
                        />
                      ) : editMode === "layout" ? (
                        layoutTool("outerSidebarStartHeader")
                      ) : iconNavStart ? (
                        <Tooltip title="Hide SidebarHeader" placement="right">
                          <IconButton
                            variant="plain"
                            size="medium"
                            aria-label="Close"
                            onClick={() => hide("outerSidebarStartHeader")}
                          >
                            <Icon>
                              <LfCloseCircle />
                            </Icon>
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Placeholder style={xSubtleWidth}>
                          <Button
                            variant="gutterless"
                            weight="normal"
                            trailing={
                              <Icon>
                                <LfCloseCircle />
                              </Icon>
                            }
                            onClick={() => hide("outerSidebarStartHeader")}
                          >
                            SidebarStart: Header
                          </Button>
                        </Placeholder>
                      )}
                    </SidebarHeader>
                  </EditZone>
                )}
                <EditZone
                  active={editMode === "addContent"}
                  label="Sidebar Start: Body"
                  toolbar={addTool("outerSidebarStartBody")}
                  fill
                  toolbarAlign="end"
                  stickyToolbar
                  {...ezLock("outerSidebarStartBody")}
                >
                  {iconNavStart ? (
                    <Overflow orientation="vertical">
                      {({ indexes }) => (
                        <SidebarBody>
                          <SidebarNavigation>
                            {sidebarStartIconNavigationItems.map((item) => (
                              <OverflowItem key={item.key}>
                                {item.kind === "separator" ? (
                                  <SidebarNavigationSeparator />
                                ) : item.kind === "subtrigger" ? (
                                  <SidebarNavigationItem>
                                    <SizingAndStylingPopover
                                      area="outerSidebarStartBody"
                                      settings={layoutAreaSettings.outerSidebarStartBody ?? DEFAULT_AREA_SETTINGS}
                                      onUpdate={(settings) => updateLayoutSettings("outerSidebarStartBody", settings)}
                                      compact
                                      compactTrigger={
                                        <SidebarNavigationSubTrigger
                                          leading={
                                            <Icon>
                                              <LfEllipsisLine />
                                            </Icon>
                                          }
                                        >
                                          {item.label}
                                        </SidebarNavigationSubTrigger>
                                      }
                                      compactDeleteActions={[
                                        {
                                          label: layout.outerSidebarStartHeader ? "Delete Header" : "Show Header",
                                          onClick: () => toggle("outerSidebarStartHeader"),
                                          icon: (
                                            <Icon size="small">
                                              {layout.outerSidebarStartHeader ? <LfEyeSlash /> : <LfEye />}
                                            </Icon>
                                          ),
                                        },
                                        {
                                          label: layout.outerSidebarStartFooter ? "Delete Footer" : "Show Footer",
                                          onClick: () => toggle("outerSidebarStartFooter"),
                                          icon: (
                                            <Icon size="small">
                                              {layout.outerSidebarStartFooter ? <LfEyeSlash /> : <LfEye />}
                                            </Icon>
                                          ),
                                        },
                                        { type: "divider", key: "icon-sidebar-delete-divider" },
                                        {
                                          label: "Delete Sidebar",
                                          onClick: () =>
                                            hideAll(
                                              "outerSidebarStart",
                                              "outerSidebarStartHeader",
                                              "outerSidebarStartFooter",
                                            ),
                                        },
                                      ]}
                                      sidebarSettings={sidebarStartSettings}
                                      onUpdateSidebarSettings={setSidebarStartSettings}
                                      globalStyling={globalStyling}
                                      onUpdateGlobalStyling={setGlobalStyling}
                                      activeLayout={layout}
                                      iconSidebarEnabled={iconNavStart}
                                      onIconSidebarChange={setIconNavStart}
                                      onOpenEditPanel={() => setIsLayoutOpen(true)}
                                      compactListPlacement="right-start"
                                      placement="right-start"
                                      size="medium"
                                    />
                                  </SidebarNavigationItem>
                                ) : (
                                  <SidebarNavigationItem>
                                    <SidebarNavigationLink
                                      href="#"
                                      leading={
                                        <Icon>
                                          <LfTrash />
                                        </Icon>
                                      }
                                      {...(item.current ? { "aria-current": "page" as const } : {})}
                                      onClick={() =>
                                        hideAll(
                                          "outerSidebarStart",
                                          "outerSidebarStartHeader",
                                          "outerSidebarStartFooter",
                                        )
                                      }
                                    >
                                      {item.label}
                                    </SidebarNavigationLink>
                                  </SidebarNavigationItem>
                                )}
                              </OverflowItem>
                            ))}
                            {indexes.length > 0 && (
                              <SidebarNavigationItem>
                                <Popover trigger="hover" placement="right-end" strategy="fixed">
                                  <Popover.Anchor>
                                    <SidebarNavigationSubTrigger
                                      leading={
                                        <Icon>
                                          <LfEllipsisDot />
                                        </Icon>
                                      }
                                    >
                                      More
                                    </SidebarNavigationSubTrigger>
                                  </Popover.Anchor>
                                  <Popover.Content>
                                    <Popover.Body>
                                      <ActionList>
                                        {indexes.map((hiddenIndex) => {
                                          const hiddenItem = sidebarStartIconNavigationItems[hiddenIndex];

                                          if (!hiddenItem || hiddenItem.kind === "separator") {
                                            return null;
                                          }

                                          if (hiddenItem.kind === "subtrigger") {
                                            return (
                                              <SizingAndStylingPopover
                                                key={hiddenItem.key}
                                                area="outerSidebarStartBody"
                                                settings={
                                                  layoutAreaSettings.outerSidebarStartBody ?? DEFAULT_AREA_SETTINGS
                                                }
                                                onUpdate={(settings) =>
                                                  updateLayoutSettings("outerSidebarStartBody", settings)
                                                }
                                                compact
                                                compactTrigger={
                                                  <ActionList.Item>
                                                    <ActionList.Body
                                                      leading={
                                                        <Icon>
                                                          <LfEllipsisLine />
                                                        </Icon>
                                                      }
                                                    >
                                                      {hiddenItem.label}
                                                    </ActionList.Body>
                                                  </ActionList.Item>
                                                }
                                                compactDeleteActions={[
                                                  {
                                                    label: layout.outerSidebarStartHeader
                                                      ? "Delete Header"
                                                      : "Show Header",
                                                    onClick: () => toggle("outerSidebarStartHeader"),
                                                    icon: (
                                                      <Icon size="small">
                                                        {layout.outerSidebarStartHeader ? <LfEyeSlash /> : <LfEye />}
                                                      </Icon>
                                                    ),
                                                  },
                                                  {
                                                    label: layout.outerSidebarStartFooter
                                                      ? "Delete Footer"
                                                      : "Show Footer",
                                                    onClick: () => toggle("outerSidebarStartFooter"),
                                                    icon: (
                                                      <Icon size="small">
                                                        {layout.outerSidebarStartFooter ? <LfEyeSlash /> : <LfEye />}
                                                      </Icon>
                                                    ),
                                                  },
                                                  { type: "divider", key: "overflow-delete-divider" },
                                                  {
                                                    label: "Delete Sidebar",
                                                    onClick: () =>
                                                      hideAll(
                                                        "outerSidebarStart",
                                                        "outerSidebarStartHeader",
                                                        "outerSidebarStartFooter",
                                                      ),
                                                  },
                                                ]}
                                                sidebarSettings={sidebarStartSettings}
                                                onUpdateSidebarSettings={setSidebarStartSettings}
                                                globalStyling={globalStyling}
                                                onUpdateGlobalStyling={setGlobalStyling}
                                                activeLayout={layout}
                                                iconSidebarEnabled={iconNavStart}
                                                onIconSidebarChange={setIconNavStart}
                                                onOpenEditPanel={() => setIsLayoutOpen(true)}
                                                compactListPlacement="right-start"
                                                placement="right-start"
                                                size="medium"
                                              />
                                            );
                                          }

                                          return (
                                            <ActionList.Item
                                              key={hiddenItem.key}
                                              onClick={() =>
                                                hideAll(
                                                  "outerSidebarStart",
                                                  "outerSidebarStartHeader",
                                                  "outerSidebarStartFooter",
                                                )
                                              }
                                            >
                                              <ActionList.Body
                                                leading={
                                                  <Icon>
                                                    <LfTrash />
                                                  </Icon>
                                                }
                                              >
                                                {hiddenItem.label}
                                              </ActionList.Body>
                                            </ActionList.Item>
                                          );
                                        })}
                                      </ActionList>
                                    </Popover.Body>
                                  </Popover.Content>
                                </Popover>
                              </SidebarNavigationItem>
                            )}
                          </SidebarNavigation>
                        </SidebarBody>
                      )}
                    </Overflow>
                  ) : (
                    <SidebarBody>
                      {editMode === null && (
                        <DefaultView
                          area="outerSidebarStartBody"
                          items={contentAreaItems.outerSidebarStartBody}
                          onAddContent={() => {
                            captureWidth();
                            setEditMode("addContent");
                            setPendingOpenArea("outerSidebarStartBody");
                          }}
                        />
                      )}
                      {editMode === "addContent" && (
                        <AddContentView
                          area="outerSidebarStartBody"
                          items={contentAreaItems.outerSidebarStartBody}
                          onRemove={(id) => removeContentItem("outerSidebarStartBody", id)}
                          onReorder={(newItems) => reorderContentItems("outerSidebarStartBody", newItems)}
                          onUpdate={(id, props) => updateContentItem("outerSidebarStartBody", id, props)}
                          brickToolbarSide="start"
                          {...brickLock("outerSidebarStartBody")}
                        />
                      )}
                      {editMode === "layout" && layoutTool("outerSidebarStartBody")}
                    </SidebarBody>
                  )}
                </EditZone>
                {layout.outerSidebarStartFooter && (
                  <EditZone
                    active={editMode === "addContent"}
                    label="Sidebar Start: Footer"
                    toolbar={addTool("outerSidebarStartFooter")}
                    toolbarAlign="end"
                    {...ezLock("outerSidebarStartFooter")}
                  >
                    <SidebarFooter
                      style={
                        globalStyling.sidebarStartBorderFooter
                          ? { borderTop: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)" }
                          : undefined
                      }
                    >
                      {editMode === null || editMode === "addContent" ? (
                        iconNavStart && editMode === null ? (
                          <Tooltip title="Sidebar Footer" placement="right">
                            <IconButton variant="plain" size="medium" aria-label="Sidebar Footer">
                              <Icon>
                                <LfFaceMoodSmile />
                              </Icon>
                            </IconButton>
                          </Tooltip>
                        ) : contentAreaItems.outerSidebarStartFooter.length > 0 ? (
                          <FooterContentView
                            items={contentAreaItems.outerSidebarStartFooter}
                            showControls={editMode === "addContent"}
                            onRemove={(id) => removeContentItem("outerSidebarStartFooter", id)}
                            onUpdate={(id, props) => updateContentItem("outerSidebarStartFooter", id, props)}
                            onReorder={(newItems) => reorderContentItems("outerSidebarStartFooter", newItems)}
                            popoverPlacement="top-start"
                            {...(editMode === "addContent" ? brickLock("outerSidebarStartFooter") : {})}
                          />
                        ) : (
                          <Text variant="title.xxSmall" as="span">
                            Sidebar Start: Footer
                          </Text>
                        )
                      ) : editMode === "layout" ? (
                        layoutTool("outerSidebarStartFooter")
                      ) : iconNavStart ? (
                        <Tooltip title="Hide SidebarFooter" placement="right">
                          <IconButton
                            variant="plain"
                            size="medium"
                            aria-label="Close"
                            onClick={() => hide("outerSidebarStartFooter")}
                          >
                            <Icon>
                              <LfCloseCircle />
                            </Icon>
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Placeholder style={xSubtleWidth}>
                          <Button
                            variant="gutterless"
                            weight="normal"
                            trailing={
                              <Icon>
                                <LfCloseCircle />
                              </Icon>
                            }
                            onClick={() => hide("outerSidebarStartFooter")}
                          >
                            SidebarStart: Footer
                          </Button>
                        </Placeholder>
                      )}
                    </SidebarFooter>
                  </EditZone>
                )}
              </Sidebar>
            )}
            <SidebarInset>
              <SidebarProvider defaultOpen>
                <SidebarInset>
                  {layout.globalHeader && (
                    <EditZone
                      active={editMode === "addContent"}
                      noWrapper
                      label="Global Header"
                      toolbar={addTool("globalHeader")}
                      {...ezLock("globalHeader")}
                    >
                      <Header className={styles.globalHeader} bordered={globalStyling.headerBorder}>
                        {editMode === null || editMode === "addContent" ? (
                          contentAreaItems.globalHeader.length > 0 ? (
                            <HeaderContentView
                              items={contentAreaItems.globalHeader}
                              showControls={editMode === "addContent"}
                              onRemove={(id) => removeContentItem("globalHeader", id)}
                              onUpdate={(id, props) => updateContentItem("globalHeader", id, props)}
                              onReorder={(newItems) => reorderContentItems("globalHeader", newItems)}
                              {...(editMode === "addContent" ? brickLock("globalHeader") : {})}
                            />
                          ) : (
                            <Header.Item>
                              <Text variant="title.xxSmall" as="span">
                                Global Header
                              </Text>
                            </Header.Item>
                          )
                        ) : editMode === "layout" ? (
                          layoutTool("globalHeader")
                        ) : (
                          <Placeholder style={xSubtleBar}>
                            <Button
                              variant="gutterless"
                              weight="normal"
                              trailing={
                                <Icon>
                                  <LfCloseCircle />
                                </Icon>
                              }
                              onClick={() => hide("globalHeader")}
                            >
                              Global Header
                            </Button>
                          </Placeholder>
                        )}
                      </Header>
                    </EditZone>
                  )}
                  <PageLayout variant={globalStyling.pageLayout}>
                    {layout.innerSidebarStart && (
                      <SideNavZone
                        active={editMode === "addContent"}
                        itemProps={innerStartProps}
                        onUpdate={setInnerStartProps}
                        area="innerSidebarStart"
                        toolbarAlign="start"
                      >
                        <PageLayoutSidebar aria-label="Start Sidebar">
                          {editMode === null || editMode === "addContent" ? (
                            <ComponentRenderer
                              component="SideNavigation"
                              itemProps={innerStartProps}
                              area="innerSidebarStart"
                              onUpdate={setInnerStartProps}
                            />
                          ) : (
                            <SideNavigation aria-label="Sidebar navigation">
                              <SideNavigation.Group>
                                <SideNavigation.Item icon={LfTrash} href="#" onClick={() => hide("innerSidebarStart")}>
                                  sidebar
                                </SideNavigation.Item>
                                <SideNavigation.Item icon={LfMinusSmall} href="#">
                                  sidebar
                                </SideNavigation.Item>
                                <SideNavigation.Item icon={LfMinusSmall} href="#">
                                  sidebar
                                </SideNavigation.Item>
                              </SideNavigation.Group>
                            </SideNavigation>
                          )}
                        </PageLayoutSidebar>
                      </SideNavZone>
                    )}
                    {layout.paneStart && (
                      <PageLayoutPane
                        width={paneStartSettings.paneWidth as Parameters<typeof PageLayoutPane>[0]["width"]}
                        resizable={paneStartSettings.resizable}
                        maxWidth={paneStartSettings.maxWidth as Parameters<typeof PageLayoutPane>[0]["maxWidth"]}
                        variant={globalStyling.paneStart}
                      >
                        {layout.paneStartHeader && (
                          <EditZone
                            active={editMode === "addContent"}
                            label="Pane Start: Header"
                            toolbar={addTool("paneStartHeader")}
                            toolbarAlign="end"
                            overlayTopOffset={6}
                            {...ezLock("paneStartHeader")}
                          >
                            <PageLayoutHeader
                              style={{
                                ...(paneStartSettings.stickyHeader
                                  ? {
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 1,
                                      backgroundColor: "var(--aegis-color-background-default)",
                                    }
                                  : {}),
                                ...(globalStyling.paneStartBorderHeader
                                  ? {
                                      borderBottom:
                                        "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
                                    }
                                  : {}),
                              }}
                            >
                              {editMode === null ? (
                                <DefaultView
                                  area="paneStartHeader"
                                  items={contentAreaItems.paneStartHeader}
                                  onAddContent={() => {
                                    captureWidth();
                                    setEditMode("addContent");
                                    setPendingOpenArea("paneStartHeader");
                                  }}
                                />
                              ) : editMode === "addContent" ? (
                                <AddContentView
                                  area="paneStartHeader"
                                  items={contentAreaItems.paneStartHeader}
                                  onRemove={(id) => removeContentItem("paneStartHeader", id)}
                                  onReorder={(newItems) => reorderContentItems("paneStartHeader", newItems)}
                                  onUpdate={(id, props) => updateContentItem("paneStartHeader", id, props)}
                                  {...brickLock("paneStartHeader")}
                                />
                              ) : editMode === "layout" ? (
                                layoutTool("paneStartHeader")
                              ) : (
                                <Placeholder style={xSubtle}>
                                  <Button
                                    variant="gutterless"
                                    weight="normal"
                                    trailing={
                                      <Icon>
                                        <LfCloseCircle />
                                      </Icon>
                                    }
                                    onClick={() => hide("paneStartHeader")}
                                  >
                                    PaneStart: Header
                                  </Button>
                                </Placeholder>
                              )}
                            </PageLayoutHeader>
                          </EditZone>
                        )}
                        <EditZone
                          active={editMode === "addContent"}
                          label="Pane Start: Body"
                          toolbar={addTool("paneStartBody")}
                          fill
                          toolbarAlign="end"
                          stickyToolbar
                          overlayTopOffset={6}
                          {...ezLock("paneStartBody")}
                        >
                          <PageLayoutBody style={editMode === "layout" ? { padding: 0 } : undefined}>
                            {editMode === null && (
                              <DefaultView
                                area="paneStartBody"
                                items={contentAreaItems.paneStartBody}
                                onAddContent={() => {
                                  captureWidth();
                                  setEditMode("addContent");
                                  setPendingOpenArea("paneStartBody");
                                }}
                              />
                            )}
                            {editMode === "addContent" && (
                              <AddContentView
                                area="paneStartBody"
                                items={contentAreaItems.paneStartBody}
                                onRemove={(id) => removeContentItem("paneStartBody", id)}
                                onReorder={(newItems) => reorderContentItems("paneStartBody", newItems)}
                                onUpdate={(id, props) => updateContentItem("paneStartBody", id, props)}
                                brickToolbarSide={undefined}
                                {...brickLock("paneStartBody")}
                              />
                            )}
                            {editMode === "layout" && layoutTool("paneStartBody")}
                          </PageLayoutBody>
                        </EditZone>
                        {layout.paneStartFooter && (
                          <EditZone
                            active={editMode === "addContent"}
                            label="Pane Start: Footer"
                            toolbar={addTool("paneStartFooter")}
                            toolbarAlign="end"
                            overlayTopOffset={6}
                            {...ezLock("paneStartFooter")}
                          >
                            <PageLayoutFooter
                              style={
                                globalStyling.paneStartBorderFooter
                                  ? {
                                      borderTop:
                                        "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
                                    }
                                  : undefined
                              }
                            >
                              {editMode === null || editMode === "addContent" ? (
                                contentAreaItems.paneStartFooter.length > 0 ? (
                                  <FooterContentView
                                    items={contentAreaItems.paneStartFooter}
                                    showControls={editMode === "addContent"}
                                    onRemove={(id) => removeContentItem("paneStartFooter", id)}
                                    onUpdate={(id, props) => updateContentItem("paneStartFooter", id, props)}
                                    onReorder={(newItems) => reorderContentItems("paneStartFooter", newItems)}
                                    popoverPlacement="top-start"
                                    {...(editMode === "addContent" ? brickLock("paneStartFooter") : {})}
                                  />
                                ) : (
                                  <Text variant="title.xxSmall" as="span">
                                    Pane Start: Footer
                                  </Text>
                                )
                              ) : editMode === "layout" ? (
                                layoutTool("paneStartFooter")
                              ) : (
                                <Placeholder style={xSubtleWidth}>
                                  <Button
                                    variant="gutterless"
                                    weight="normal"
                                    trailing={
                                      <Icon>
                                        <LfCloseCircle />
                                      </Icon>
                                    }
                                    onClick={() => hide("paneStartFooter")}
                                  >
                                    PaneStart:Footer
                                  </Button>
                                </Placeholder>
                              )}
                            </PageLayoutFooter>
                          </EditZone>
                        )}
                      </PageLayoutPane>
                    )}
                    <PageLayoutContent variant={globalStyling.content} style={contentMaxWidthStyle}>
                      {layout.contentHeader && (
                        <EditZone
                          active={editMode === "addContent"}
                          label="Content: Header"
                          toolbar={addTool("contentHeader")}
                          {...ezLock("contentHeader")}
                        >
                          <PageLayoutHeader
                            style={
                              globalStyling.contentBorderHeader
                                ? {
                                    borderBottom:
                                      "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
                                  }
                                : undefined
                            }
                          >
                            {editMode === null ? (
                              renderContentInner(
                                "header",
                                <DefaultView
                                  area="contentHeader"
                                  items={contentAreaItems.contentHeader}
                                  onAddContent={() => {
                                    captureWidth();
                                    setEditMode("addContent");
                                    setPendingOpenArea("contentHeader");
                                  }}
                                />,
                              )
                            ) : editMode === "addContent" ? (
                              renderContentInner(
                                "header",
                                <AddContentView
                                  area="contentHeader"
                                  items={contentAreaItems.contentHeader}
                                  onRemove={(id) => removeContentItem("contentHeader", id)}
                                  onReorder={(newItems) => reorderContentItems("contentHeader", newItems)}
                                  onUpdate={(id, props) => updateContentItem("contentHeader", id, props)}
                                  {...brickLock("contentHeader")}
                                />,
                              )
                            ) : editMode === "layout" ? (
                              layoutTool("contentHeader")
                            ) : (
                              <Placeholder style={xSubtle}>
                                <Button
                                  variant="gutterless"
                                  weight="normal"
                                  trailing={
                                    <Icon>
                                      <LfCloseCircle />
                                    </Icon>
                                  }
                                  onClick={() => hide("contentHeader")}
                                >
                                  Content: Header
                                </Button>
                              </Placeholder>
                            )}
                          </PageLayoutHeader>
                        </EditZone>
                      )}
                      <EditZone
                        active={editMode === "addContent"}
                        label="Content: Body"
                        toolbar={addTool("contentBody")}
                        fill
                        stickyToolbar
                        overlayTopOffset={6}
                        {...ezLock("contentBody")}
                      >
                        <PageLayoutBody>
                          {editMode === null ? (
                            renderContentInner(
                              "body",
                              <DefaultView
                                area="contentBody"
                                items={contentAreaItems.contentBody}
                                onAddContent={() => {
                                  captureWidth();
                                  setEditMode("addContent");
                                  setPendingOpenArea("contentBody");
                                }}
                              />,
                            )
                          ) : editMode === "addContent" ? (
                            renderContentInner(
                              "body",
                              <AddContentView
                                area="contentBody"
                                items={contentAreaItems.contentBody}
                                onRemove={(id) => removeContentItem("contentBody", id)}
                                onReorder={(newItems) => reorderContentItems("contentBody", newItems)}
                                onUpdate={(id, props) => updateContentItem("contentBody", id, props)}
                                {...brickLock("contentBody")}
                              />,
                            )
                          ) : editMode === "layout" ? (
                            layoutTool("contentBody")
                          ) : (
                            <ThemeView area="contentBody" />
                          )}
                        </PageLayoutBody>
                      </EditZone>
                      {layout.contentFooter && (
                        <EditZone
                          active={editMode === "addContent"}
                          label="Content: Footer"
                          toolbar={addTool("contentFooter")}
                          {...ezLock("contentFooter")}
                        >
                          <PageLayoutFooter
                            style={
                              globalStyling.contentBorderFooter
                                ? {
                                    borderTop:
                                      "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
                                  }
                                : globalStyling.content === "outline"
                                  ? { borderTop: "none" }
                                  : undefined
                            }
                          >
                            {editMode === null || editMode === "addContent" ? (
                              renderContentInner(
                                "footer",
                                contentAreaItems.contentFooter.length > 0 ? (
                                  <FooterContentView
                                    items={contentAreaItems.contentFooter}
                                    showControls={editMode === "addContent"}
                                    onRemove={(id) => removeContentItem("contentFooter", id)}
                                    onUpdate={(id, props) => updateContentItem("contentFooter", id, props)}
                                    onReorder={(newItems) => reorderContentItems("contentFooter", newItems)}
                                    popoverPlacement="top-start"
                                    {...(editMode === "addContent" ? brickLock("contentFooter") : {})}
                                  />
                                ) : (
                                  <Text variant="title.xxSmall" as="span">
                                    Content: Footer
                                  </Text>
                                ),
                              )
                            ) : editMode === "layout" ? (
                              layoutTool("contentFooter")
                            ) : (
                              <Placeholder style={xSubtleWidth}>
                                <Button
                                  variant="gutterless"
                                  weight="normal"
                                  trailing={
                                    <Icon>
                                      <LfCloseCircle />
                                    </Icon>
                                  }
                                  onClick={() => hide("contentFooter")}
                                >
                                  Content:Footer
                                </Button>
                              </Placeholder>
                            )}
                          </PageLayoutFooter>
                        </EditZone>
                      )}
                    </PageLayoutContent>
                    {layout.paneEnd && (
                      <PageLayoutPane
                        position="end"
                        aria-label="End Pane"
                        width={paneEndSettings.paneWidth as Parameters<typeof PageLayoutPane>[0]["width"]}
                        resizable={paneEndSettings.resizable}
                        maxWidth={paneEndSettings.maxWidth as Parameters<typeof PageLayoutPane>[0]["maxWidth"]}
                        variant={globalStyling.paneEnd}
                      >
                        {layout.paneEndHeader && (
                          <EditZone
                            active={editMode === "addContent"}
                            label="Pane End: Header"
                            toolbar={addTool("paneEndHeader")}
                            {...ezLock("paneEndHeader")}
                          >
                            <PageLayoutHeader
                              style={{
                                ...(paneEndSettings.stickyHeader
                                  ? {
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 1,
                                      backgroundColor: "var(--aegis-color-background-default)",
                                    }
                                  : {}),
                                ...(globalStyling.paneEndBorderHeader
                                  ? {
                                      borderBottom:
                                        "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
                                    }
                                  : {}),
                              }}
                            >
                              {editMode === null ? (
                                <DefaultView
                                  area="paneEndHeader"
                                  items={contentAreaItems.paneEndHeader}
                                  onAddContent={() => {
                                    captureWidth();
                                    setEditMode("addContent");
                                    setPendingOpenArea("paneEndHeader");
                                  }}
                                />
                              ) : editMode === "addContent" ? (
                                <AddContentView
                                  area="paneEndHeader"
                                  items={contentAreaItems.paneEndHeader}
                                  onRemove={(id) => removeContentItem("paneEndHeader", id)}
                                  onReorder={(newItems) => reorderContentItems("paneEndHeader", newItems)}
                                  onUpdate={(id, props) => updateContentItem("paneEndHeader", id, props)}
                                  {...brickLock("paneEndHeader")}
                                />
                              ) : editMode === "layout" ? (
                                layoutTool("paneEndHeader")
                              ) : (
                                <Placeholder style={xSubtle}>
                                  <Button
                                    variant="gutterless"
                                    weight="normal"
                                    trailing={
                                      <Icon>
                                        <LfCloseCircle />
                                      </Icon>
                                    }
                                    onClick={() => hide("paneEndHeader")}
                                  >
                                    PaneEnd: Header
                                  </Button>
                                </Placeholder>
                              )}
                            </PageLayoutHeader>
                          </EditZone>
                        )}
                        <EditZone
                          active={editMode === "addContent"}
                          label="Pane End: Body"
                          toolbar={addTool("paneEndBody")}
                          fill
                          stickyToolbar
                          overlayTopOffset={6}
                          {...ezLock("paneEndBody")}
                        >
                          <PageLayoutBody style={editMode === "layout" ? { padding: 0 } : undefined}>
                            {editMode === null && (
                              <DefaultView
                                area="paneEndBody"
                                items={contentAreaItems.paneEndBody}
                                onAddContent={() => {
                                  captureWidth();
                                  setEditMode("addContent");
                                  setPendingOpenArea("paneEndBody");
                                }}
                              />
                            )}
                            {editMode === "addContent" && (
                              <AddContentView
                                area="paneEndBody"
                                items={contentAreaItems.paneEndBody}
                                onRemove={(id) => removeContentItem("paneEndBody", id)}
                                onReorder={(newItems) => reorderContentItems("paneEndBody", newItems)}
                                onUpdate={(id, props) => updateContentItem("paneEndBody", id, props)}
                                {...brickLock("paneEndBody")}
                              />
                            )}
                            {editMode === "layout" && layoutTool("paneEndBody")}
                          </PageLayoutBody>
                        </EditZone>
                        {layout.paneEndFooter && (
                          <EditZone
                            active={editMode === "addContent"}
                            label="Pane End: Footer"
                            toolbar={addTool("paneEndFooter")}
                            {...ezLock("paneEndFooter")}
                          >
                            <PageLayoutFooter
                              style={
                                globalStyling.paneEndBorderFooter
                                  ? {
                                      borderTop:
                                        "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
                                    }
                                  : undefined
                              }
                            >
                              {editMode === null || editMode === "addContent" ? (
                                contentAreaItems.paneEndFooter.length > 0 ? (
                                  <FooterContentView
                                    items={contentAreaItems.paneEndFooter}
                                    showControls={editMode === "addContent"}
                                    onRemove={(id) => removeContentItem("paneEndFooter", id)}
                                    onUpdate={(id, props) => updateContentItem("paneEndFooter", id, props)}
                                    onReorder={(newItems) => reorderContentItems("paneEndFooter", newItems)}
                                    popoverPlacement="bottom-start"
                                    {...(editMode === "addContent" ? brickLock("paneEndFooter") : {})}
                                  />
                                ) : (
                                  <Text variant="title.xxSmall" as="span">
                                    Pane End: Footer
                                  </Text>
                                )
                              ) : editMode === "layout" ? (
                                layoutTool("paneEndFooter")
                              ) : (
                                <Placeholder style={xSubtleWidth}>
                                  <Button
                                    variant="gutterless"
                                    weight="normal"
                                    trailing={
                                      <Icon>
                                        <LfCloseCircle />
                                      </Icon>
                                    }
                                    onClick={() => hide("paneEndFooter")}
                                  >
                                    PaneEnd:Footer
                                  </Button>
                                </Placeholder>
                              )}
                            </PageLayoutFooter>
                          </EditZone>
                        )}
                      </PageLayoutPane>
                    )}
                    {layout.innerSidebarEnd && (
                      <SideNavZone
                        active={editMode === "addContent"}
                        itemProps={innerEndProps}
                        onUpdate={setInnerEndProps}
                        area="innerSidebarEnd"
                        toolbarAlign="end"
                      >
                        <PageLayoutSidebar position="end" aria-label="End Sidebar">
                          {editMode === null || editMode === "addContent" ? (
                            <ComponentRenderer
                              component="SideNavigation"
                              itemProps={innerEndProps}
                              area="innerSidebarEnd"
                              onUpdate={setInnerEndProps}
                            />
                          ) : (
                            <SideNavigation aria-label="End sidebar navigation">
                              <SideNavigation.Group>
                                <SideNavigation.Item icon={LfTrash} href="#" onClick={() => hide("innerSidebarEnd")}>
                                  sidebar
                                </SideNavigation.Item>
                                <SideNavigation.Item icon={LfMinusSmall} href="#">
                                  sidebar
                                </SideNavigation.Item>
                                <SideNavigation.Item icon={LfMinusSmall} href="#">
                                  sidebar
                                </SideNavigation.Item>
                              </SideNavigation.Group>
                            </SideNavigation>
                          )}
                        </PageLayoutSidebar>
                      </SideNavZone>
                    )}
                  </PageLayout>
                  {layout.globalFooter && (
                    <EditZone
                      active={editMode === "addContent"}
                      label="Global Footer"
                      toolbar={addTool("globalFooter")}
                      {...ezLock("globalFooter")}
                    >
                      <Footer
                        style={
                          globalStyling.footerBorder
                            ? {
                                borderTop: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
                              }
                            : undefined
                        }
                      >
                        {editMode === null || editMode === "addContent" ? (
                          contentAreaItems.globalFooter.length > 0 ? (
                            <FooterContentView
                              items={contentAreaItems.globalFooter}
                              showControls={editMode === "addContent"}
                              onRemove={(id) => removeContentItem("globalFooter", id)}
                              onUpdate={(id, props) => updateContentItem("globalFooter", id, props)}
                              onReorder={(newItems) => reorderContentItems("globalFooter", newItems)}
                              {...(editMode === "addContent" ? brickLock("globalFooter") : {})}
                            />
                          ) : (
                            <Text variant="title.xxSmall" as="span">
                              Global Footer
                            </Text>
                          )
                        ) : editMode === "layout" ? (
                          layoutTool("globalFooter")
                        ) : (
                          <Placeholder style={xSubtleBar}>
                            <Button
                              variant="gutterless"
                              weight="normal"
                              trailing={
                                <Icon>
                                  <LfCloseCircle />
                                </Icon>
                              }
                              onClick={() => hide("globalFooter")}
                            >
                              Global Footer
                            </Button>
                          </Placeholder>
                        )}
                      </Footer>
                    </EditZone>
                  )}
                </SidebarInset>
                {layout.outerSidebarEnd && (
                  <Sidebar
                    side="inline-end"
                    behavior={sidebarEndSettings.behavior}
                    collapsible={sidebarEndSettings.collapsible}
                    resizable={sidebarEndSettings.resizable}
                    width={sidebarEndWidthOverride ?? sidebarEndSettings.width}
                    minWidth={sidebarEndSettings.resizable ? sidebarEndSettings.minWidth : undefined}
                    maxWidth={sidebarEndSettings.resizable ? sidebarEndSettings.maxWidth : undefined}
                    variant={globalStyling.sidebarEnd}
                    className={styles.sidebarEnd}
                  >
                    {layout.outerSidebarEndHeader && (
                      <EditZone
                        active={editMode === "addContent"}
                        label="Sidebar End: Header"
                        toolbar={addTool("outerSidebarEndHeader")}
                        {...ezLock("outerSidebarEndHeader")}
                      >
                        <SidebarHeader
                          style={
                            globalStyling.sidebarEndBorderHeader
                              ? {
                                  borderBottom:
                                    "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
                                }
                              : undefined
                          }
                        >
                          {editMode === null ? (
                            <DefaultView
                              area="outerSidebarEndHeader"
                              items={contentAreaItems.outerSidebarEndHeader}
                              onAddContent={() => {
                                captureWidth();
                                setEditMode("addContent");
                                setPendingOpenArea("outerSidebarEndHeader");
                              }}
                            />
                          ) : editMode === "addContent" ? (
                            <AddContentView
                              area="outerSidebarEndHeader"
                              items={contentAreaItems.outerSidebarEndHeader}
                              onRemove={(id) => removeContentItem("outerSidebarEndHeader", id)}
                              onReorder={(newItems) => reorderContentItems("outerSidebarEndHeader", newItems)}
                              onUpdate={(id, props) => updateContentItem("outerSidebarEndHeader", id, props)}
                              {...brickLock("outerSidebarEndHeader")}
                            />
                          ) : editMode === "layout" ? (
                            layoutTool("outerSidebarEndHeader")
                          ) : (
                            <Placeholder style={xSubtleWidth}>
                              <Button
                                variant="gutterless"
                                weight="normal"
                                trailing={
                                  <Icon>
                                    <LfCloseCircle />
                                  </Icon>
                                }
                                onClick={() => hide("outerSidebarEndHeader")}
                              >
                                SidebarEnd: Header
                              </Button>
                            </Placeholder>
                          )}
                        </SidebarHeader>
                      </EditZone>
                    )}
                    <EditZone
                      active={editMode === "addContent"}
                      label="Sidebar End: Body"
                      toolbar={addTool("outerSidebarEndBody")}
                      fill
                      stickyToolbar
                      {...ezLock("outerSidebarEndBody")}
                    >
                      <SidebarBody>
                        {editMode === null && (
                          <DefaultView
                            area="outerSidebarEndBody"
                            items={contentAreaItems.outerSidebarEndBody}
                            onAddContent={() => {
                              captureWidth();
                              setEditMode("addContent");
                              setPendingOpenArea("outerSidebarEndBody");
                            }}
                          />
                        )}
                        {editMode === "addContent" && (
                          <AddContentView
                            area="outerSidebarEndBody"
                            items={contentAreaItems.outerSidebarEndBody}
                            onRemove={(id) => removeContentItem("outerSidebarEndBody", id)}
                            onReorder={(newItems) => reorderContentItems("outerSidebarEndBody", newItems)}
                            onUpdate={(id, props) => updateContentItem("outerSidebarEndBody", id, props)}
                            {...brickLock("outerSidebarEndBody")}
                          />
                        )}
                        {editMode === "layout" && layoutTool("outerSidebarEndBody")}
                      </SidebarBody>
                    </EditZone>
                    {layout.outerSidebarEndFooter && (
                      <EditZone
                        active={editMode === "addContent"}
                        label="Sidebar End: Footer"
                        toolbar={addTool("outerSidebarEndFooter")}
                        {...ezLock("outerSidebarEndFooter")}
                      >
                        <SidebarFooter
                          style={
                            globalStyling.sidebarEndBorderFooter
                              ? {
                                  borderTop:
                                    "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
                                }
                              : undefined
                          }
                        >
                          {editMode === null || editMode === "addContent" ? (
                            contentAreaItems.outerSidebarEndFooter.length > 0 ? (
                              <FooterContentView
                                items={contentAreaItems.outerSidebarEndFooter}
                                showControls={editMode === "addContent"}
                                onRemove={(id) => removeContentItem("outerSidebarEndFooter", id)}
                                onUpdate={(id, props) => updateContentItem("outerSidebarEndFooter", id, props)}
                                onReorder={(newItems) => reorderContentItems("outerSidebarEndFooter", newItems)}
                                popoverPlacement="bottom-end"
                                {...(editMode === "addContent" ? brickLock("outerSidebarEndFooter") : {})}
                              />
                            ) : (
                              <Text variant="title.xxSmall" as="span">
                                Sidebar End: Footer
                              </Text>
                            )
                          ) : editMode === "layout" ? (
                            layoutTool("outerSidebarEndFooter")
                          ) : (
                            <Placeholder style={xSubtleWidth}>
                              <Button
                                variant="gutterless"
                                weight="normal"
                                trailing={
                                  <Icon>
                                    <LfCloseCircle />
                                  </Icon>
                                }
                                onClick={() => hide("outerSidebarEndFooter")}
                              >
                                SidebarEnd: Footer
                              </Button>
                            </Placeholder>
                          )}
                        </SidebarFooter>
                      </EditZone>
                    )}
                  </Sidebar>
                )}
              </SidebarProvider>
            </SidebarInset>
          </>
        )}
      </SidebarProvider>

      <LayoutDrawer
        open={isLayoutOpen}
        onOpenChange={setIsLayoutOpen}
        layout={layout}
        toggle={toggle}
        groupValue={groupValue}
        groupChange={groupChange}
        iconNavStart={iconNavStart}
        setIconNavStart={setIconNavStart}
      />

      <ContrastCheckDialog
        open={isContrastCheckOpen}
        onOpenChange={setIsContrastCheckOpen}
        overrides={designTokenOverrides}
        componentOverrides={componentOverrides}
        newTokenRefs={newTokenRefs}
      />

      <Dialog open={isTokenDialogOpen} onOpenChange={setIsTokenDialogOpen}>
        <DialogContent
          width="auto"
          style={{
            height: "70vh",
            maxHeight: "calc(100vh - 32px)",
            display: "grid",
            gridTemplateRows: "auto minmax(0, 1fr) auto",
          }}
        >
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>Generated Files</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <div
            style={{
              display: "grid",
              gridTemplateRows: "auto minmax(0, 1fr)",
              gap: "var(--aegis-space-large)",
              paddingTop: "var(--aegis-space-small)",
              paddingInline: "var(--aegis-space-xLarge)",
              paddingBottom: "var(--aegis-space-small)",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <Tab.Group index={tokenTabIndex} onChange={setTokenTabIndex} size="medium">
              <Tab.List>
                <Tab>Page Layout</Tab>
                <Tab>Theme CSS</Tab>
                <Tab>Design Tokens</Tab>
                <Tab>Override Design Token</Tab>
              </Tab.List>
            </Tab.Group>
            {isOverrideTab ? (
              <div
                className={styles.tokenDialogEditor}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  gap: "var(--aegis-space-large)",
                  inlineSize: "var(--aegis-layout-width-medium)",
                  maxInlineSize: "100%",
                  overflowY: "auto",
                  minHeight: 0,
                }}
              >
                {(["background", "foreground", "border"] as const).map((cat) => (
                  <FormControl key={cat}>
                    <FormControl.Label>{cat}</FormControl.Label>
                    <textarea
                      readOnly
                      value={designTokenOverrideExportCSS[cat]}
                      placeholder={`（変更なし）`}
                      style={{
                        display: "block",
                        width: "100%",
                        height: "var(--aegis-size-x13Large)",
                        padding: "var(--aegis-space-small)",
                        border: "1px solid var(--aegis-color-border-neutral)",
                        borderRadius: "var(--aegis-radius-medium)",
                        backgroundColor: "var(--aegis-color-background-default)",
                        color: "var(--aegis-color-foreground-default)",
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
                        fontSize: "var(--aegis-font-size-body-small)",
                        lineHeight: "1.5",
                        resize: "none",
                        overflow: "auto",
                        boxSizing: "border-box",
                      }}
                    />
                  </FormControl>
                ))}
              </div>
            ) : (
              <div
                className={styles.tokenDialogEditor}
                style={{
                  height: "100%",
                  minHeight: 0,
                  inlineSize: "var(--aegis-layout-width-medium)",
                  maxInlineSize: "100%",
                  overflow: "hidden",
                }}
              >
                <textarea
                  value={activeTokenTextareaValue}
                  readOnly={tokenTabIndex === 0 || tokenTabIndex === 1}
                  onChange={(e) => {
                    if (tokenTabIndex === 2) {
                      setDesignTokenText(e.target.value);
                    }
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    minHeight: 0,
                    padding: "var(--aegis-space-small)",
                    border: "1px solid var(--aegis-color-border-neutral)",
                    borderRadius: "var(--aegis-radius-medium)",
                    backgroundColor: "var(--aegis-color-background-default)",
                    color: "var(--aegis-color-foreground-default)",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
                    fontSize: "var(--aegis-font-size-body-small)",
                    lineHeight: "1.5",
                    resize: "none",
                    overflow: "auto",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain" onClick={() => setIsTokenDialogOpen(false)}>
                Close
              </Button>
              <Button
                variant="solid"
                onClick={downloadCode}
                style={
                  brandForegroundColor
                    ? ({
                        "--aegis-color-foreground-inverse": brandForegroundColor,
                      } as React.CSSProperties)
                    : undefined
                }
              >
                Download
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isBellDialogOpen} onOpenChange={setIsBellDialogOpen}>
        <DialogContent width="auto" style={{ position: "absolute", inset: "var(--aegis-space-medium)" }}>
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>通知</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <Text as="p">通知はありません。</Text>
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => setIsBellDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div
        ref={toolbarRef}
        style={{
          position: "fixed",
          bottom: "var(--aegis-space-medium)",
          zIndex: 200,
          padding: "var(--aegis-space-xSmall)",
          borderRadius: "var(--aegis-radius-large)",
          boxShadow: "var(--aegis-depth-medium)",
          backgroundColor:
            editMode === null ? "var(--aegis-color-background-neutral-bold)" : "var(--aegis-color-background-default)",
          ...(toolbarPosition === "left"
            ? { left: "var(--aegis-space-medium)", transform: "none" }
            : toolbarPosition === "right"
              ? { right: "var(--aegis-space-medium)", left: "auto", transform: "none" }
              : { left: "50%", transform: "translateX(-50%)" }),
        }}
      >
        {editMode === null ? (
          // CommandBar
          <Toolbar key="CommandBar">
            <Text as="span" className={styles.toolbarItem} style={{ animationDelay: `0ms` }}>
              <Menu>
                <MenuTrigger>
                  <Tooltip title="Toolbar Position" placement="top">
                    <IconButton variant="plain" color="inverse" aria-label="Toolbar Position">
                      <Icon>
                        {toolbarPosition === "left" ? (
                          <LfLayoutAlignLeft />
                        ) : toolbarPosition === "right" ? (
                          <LfLayoutAlignRight />
                        ) : (
                          <LfLayoutAlignCenter />
                        )}
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </MenuTrigger>
                <MenuContent>
                  <MenuRadioGroup
                    value={toolbarPosition}
                    onValueChange={(v) => setToolbarPosition(v as "left" | "center" | "right")}
                  >
                    <MenuRadioItem
                      value="left"
                      leading={
                        <Icon>
                          <LfLayoutAlignLeft />
                        </Icon>
                      }
                    >
                      Left
                    </MenuRadioItem>
                    <MenuRadioItem
                      value="center"
                      leading={
                        <Icon>
                          <LfLayoutAlignCenter />
                        </Icon>
                      }
                    >
                      Center
                    </MenuRadioItem>
                    <MenuRadioItem
                      value="right"
                      leading={
                        <Icon>
                          <LfLayoutAlignRight />
                        </Icon>
                      }
                    >
                      Right
                    </MenuRadioItem>
                  </MenuRadioGroup>
                </MenuContent>
              </Menu>
            </Text>
            <ToolbarSeparator
              className={styles.toolbarItem}
              style={{ animationDelay: `120ms`, backgroundColor: "var(--aegis-color-border-inverse-subtle)" }}
            />
            <Text as="span" className={styles.toolbarItem} style={{ animationDelay: `160ms` }}>
              <Tooltip title="Add content" placement="top">
                <IconButton
                  variant="plain"
                  color="inverse"
                  aria-label="Add content"
                  onClick={() => {
                    captureWidth();
                    setEditMode("addContent");
                  }}
                >
                  <Icon>
                    <LfPlusLarge />
                  </Icon>
                </IconButton>
              </Tooltip>
            </Text>
            <Text as="span" className={styles.toolbarItem} style={{ animationDelay: `200ms` }}>
              <Tooltip title="Edit layout" placement="top">
                <IconButton
                  variant="plain"
                  color="inverse"
                  aria-label="Edit layout"
                  onClick={() => enterEditMode("layout")}
                >
                  <Icon>
                    <LfLayout />
                  </Icon>
                </IconButton>
              </Tooltip>
            </Text>
            <Text as="span" className={styles.toolbarItem} style={{ animationDelay: `240ms` }}>
              <Tooltip title="Customize theme" placement="top">
                <IconButton
                  variant="plain"
                  color="inverse"
                  aria-label="Customize theme"
                  loading={isEditModeTransitionPending}
                  onClick={() => enterEditMode("theme")}
                >
                  <Icon>
                    <LfPalette />
                  </Icon>
                </IconButton>
              </Tooltip>
            </Text>
            <Text as="span" className={styles.toolbarItem} style={{ animationDelay: `280ms` }}>
              <Tooltip title="Contrast Check" placement="top">
                <IconButton
                  variant="plain"
                  color="inverse"
                  aria-label="Contrast Check"
                  onClick={() => setIsContrastCheckOpen(true)}
                >
                  <Icon>
                    <LfContrast />
                  </Icon>
                </IconButton>
              </Tooltip>
            </Text>
            <Text as="span" className={styles.toolbarItem} style={{ animationDelay: `320ms` }}>
              <Tooltip title="Download code" placement="top">
                <IconButton
                  variant="plain"
                  color="inverse"
                  aria-label="Download code"
                  onClick={() => setIsTokenDialogOpen(true)}
                >
                  <Icon>
                    <LfFileCode />
                  </Icon>
                </IconButton>
              </Tooltip>
            </Text>
          </Toolbar>
        ) : (
          // ModeBar
          <Toolbar key="ModeBar">
            <Text
              as="span"
              className={styles.toolbarItem}
              style={{ animationDelay: `0ms`, padding: "0 var(--aegis-space-xxSmall)" }}
            >
              <Text variant="label.small" color="subtle" style={{ fontWeight: "normal", whiteSpace: "nowrap" }}>
                {editMode === "addContent" ? "Add content" : editMode === "layout" ? "Edit layout" : "Customize theme"}
              </Text>
            </Text>
            <ToolbarSeparator
              className={styles.toolbarItem}
              style={{ animationDelay: `40ms`, backgroundColor: "var(--aegis-color-border-neutral-subtle)" }}
            />
            <Text as="span" className={styles.toolbarItem} style={{ animationDelay: `80ms` }}>
              <Menu>
                <MenuTrigger>
                  <Tooltip title="Toolbar Position" placement="top">
                    <IconButton variant="subtle" aria-label="Toolbar Position">
                      <Icon>
                        {toolbarPosition === "left" ? (
                          <LfLayoutAlignLeft />
                        ) : toolbarPosition === "right" ? (
                          <LfLayoutAlignRight />
                        ) : (
                          <LfLayoutAlignCenter />
                        )}
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </MenuTrigger>
                <MenuContent>
                  <MenuRadioGroup
                    value={toolbarPosition}
                    onValueChange={(v) => setToolbarPosition(v as "left" | "center" | "right")}
                  >
                    <MenuRadioItem
                      value="left"
                      leading={
                        <Icon>
                          <LfLayoutAlignLeft />
                        </Icon>
                      }
                    >
                      Left
                    </MenuRadioItem>
                    <MenuRadioItem
                      value="center"
                      leading={
                        <Icon>
                          <LfLayoutAlignCenter />
                        </Icon>
                      }
                    >
                      Center
                    </MenuRadioItem>
                    <MenuRadioItem
                      value="right"
                      leading={
                        <Icon>
                          <LfLayoutAlignRight />
                        </Icon>
                      }
                    >
                      Right
                    </MenuRadioItem>
                  </MenuRadioGroup>
                </MenuContent>
              </Menu>
            </Text>
            <ToolbarSeparator
              className={styles.toolbarItem}
              style={{ animationDelay: `120ms`, backgroundColor: "var(--aegis-color-border-neutral-subtle)" }}
            />
            <Text as="span" className={styles.toolbarItem} style={{ animationDelay: `160ms` }}>
              <Tooltip title="Undo Changes" placement="top">
                <IconButton variant="subtle" aria-label="Undo changes" onClick={revertEdit}>
                  <Icon>
                    <LfReply />
                  </Icon>
                </IconButton>
              </Tooltip>
            </Text>
            {editMode === "layout" && (
              <Text as="span" className={styles.toolbarItem} style={{ animationDelay: `200ms` }}>
                <Tooltip title="Open Edit Panel" placement="top">
                  <IconButton variant="subtle" aria-label="Open edit panel" onClick={() => setIsLayoutOpen(true)}>
                    <Icon>
                      <LfLayoutFillRight />
                    </Icon>
                  </IconButton>
                </Tooltip>
              </Text>
            )}
            {editMode === "theme" && (
              <>
                <Text as="span" className={styles.toolbarItem} style={{ animationDelay: `200ms` }}>
                  <Tooltip title="Token Editor" placement="top">
                    <IconButton
                      variant="subtle"
                      aria-label="Token Editor"
                      onClick={() => setIsDesignTokenOverrideOpen(true)}
                    >
                      <Icon>
                        <LfBrowserCode />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </Text>
                <Text as="span" className={styles.toolbarItem} style={{ animationDelay: `220ms` }}>
                  <Tooltip title="Contrast Check" placement="top">
                    <IconButton
                      variant="subtle"
                      aria-label="Contrast Check"
                      onClick={() => setIsContrastCheckOpen(true)}
                    >
                      <Icon>
                        <LfContrast />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </Text>
              </>
            )}

            <Text as="span" className={styles.toolbarItem} style={{ animationDelay: `240ms` }}>
              <Button variant="solid" onClick={exitEditMode} style={{ minWidth: "var(--aegis-size-x8Large)" }}>
                <Text
                  as="span"
                  style={brandForegroundColor ? ({ color: brandForegroundColor } as React.CSSProperties) : undefined}
                >
                  Done
                </Text>
              </Button>
            </Text>
          </Toolbar>
        )}
      </div>
      {activeArea !== null && <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 999 }} />}

      <Dialog open={isDesignTokenOverrideOpen} onOpenChange={setIsDesignTokenOverrideOpen}>
        <DialogContent
          width="full"
          style={{
            height: "80vh",
            maxHeight: "calc(100vh - 32px)",
            display: "grid",
            gridTemplateRows: "auto minmax(0, 1fr) auto",
            ...tokenOverrideStyle,
          }}
        >
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>Token Editor</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <div
            style={{
              minHeight: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              paddingBlock: "var(--aegis-space-xSmall)",
              paddingInline: "var(--aegis-space-xLarge)",
            }}
          >
            <DesignTokenOverrideView
              overrides={designTokenOverrides}
              onUpsert={upsertDesignTokenOverride}
              onReset={resetDesignTokenOverride}
              newTokens={newTokens}
              onSetNewTokens={setNewTokens}
              componentOverrides={componentOverrides}
              onSetComponentOverride={setComponentOverride}
              onResetComponentOverrides={resetComponentOverrides}
              newTokenRefs={newTokenRefs}
            />
          </div>
          <DialogFooter>
            <Button variant="plain" onClick={() => setIsDesignTokenOverrideOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
