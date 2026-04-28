import { LfEllipsisDot, LfPaintRoller, LfRulerMeasure, LfTrash } from "@legalforce/aegis-icons";
import {
  ActionList,
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  Icon,
  IconButton,
  Popover,
  SegmentedControl,
  Select,
  Switch,
  Text,
  Toolbar,
  ToolbarSeparator,
  Tooltip,
} from "@legalforce/aegis-react";
import type React from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ContentArea, LayoutKey } from "../../types";
import {
  type AlignValue,
  type AreaSettings,
  type AreaStyle,
  DEFAULT_AREA_SETTINGS,
  DEFAULT_GLOBAL_STYLING,
  DEFAULT_PANE_SETTINGS,
  DEFAULT_SIDEBAR_SETTINGS,
  type GlobalStylingSettings,
  type InnerWrapperScope,
  type PaneSettings,
  type SidebarBehavior,
  type SidebarSettings,
  type SidebarStyle,
  type SidebarWidth,
} from "./types";

const CONTENT_PANE_WIDTH_OPTIONS = [
  { label: "None", value: "none" },
  { label: "1680px - x7Large", value: "var(--aegis-layout-width-x7Large)" },
  { label: "1440px - x6Large", value: "var(--aegis-layout-width-x6Large)" },
  { label: "1200px - x5Large", value: "var(--aegis-layout-width-x5Large)" },
  { label: "1120px - x4Large", value: "var(--aegis-layout-width-x4Large)" },
  { label: "1040px - x3Large", value: "var(--aegis-layout-width-x3Large)" },
  { label: "960px - xxLarge", value: "var(--aegis-layout-width-xxLarge)" },
  { label: "880px - xLarge", value: "var(--aegis-layout-width-xLarge)" },
  { label: "800px - large", value: "var(--aegis-layout-width-large)" },
  { label: "720px - medium", value: "var(--aegis-layout-width-medium)" },
  { label: "640px - small", value: "var(--aegis-layout-width-small)" },
  { label: "560px - xSmall", value: "var(--aegis-layout-width-xSmall)" },
];

// layout token → px マッピング（Pane / Content / Inner width フィルタリング共用）
const LAYOUT_WIDTH_PX: Record<string, number> = {
  "var(--aegis-layout-width-x7Large)": 1680,
  "var(--aegis-layout-width-x6Large)": 1440,
  "var(--aegis-layout-width-x5Large)": 1200,
  "var(--aegis-layout-width-x4Large)": 1120,
  "var(--aegis-layout-width-x3Large)": 1040,
  "var(--aegis-layout-width-xxLarge)": 960,
  "var(--aegis-layout-width-xLarge)": 880,
  "var(--aegis-layout-width-large)": 800,
  "var(--aegis-layout-width-medium)": 720,
  "var(--aegis-layout-width-small)": 640,
  "var(--aegis-layout-width-xSmall)": 560,
  "var(--aegis-layout-width-x3Small)": 400,
  "var(--aegis-layout-width-x4Small)": 320,
};

// 後方互換エイリアス（Pane Width > Content width フィルタリング用）
const CONTENT_WIDTH_PX = LAYOUT_WIDTH_PX;

const INNER_WIDTH_OPTIONS = [
  { label: "960px - xxLarge", value: "var(--aegis-layout-width-xxLarge)" },
  { label: "880px - xLarge", value: "var(--aegis-layout-width-xLarge)" },
  { label: "800px - large", value: "var(--aegis-layout-width-large)" },
  { label: "720px - medium", value: "var(--aegis-layout-width-medium)" },
  { label: "640px - small", value: "var(--aegis-layout-width-small)" },
  { label: "560px - xSmall", value: "var(--aegis-layout-width-xSmall)" },
  { label: "400px - x3Small", value: "var(--aegis-layout-width-x3Small)" },
  { label: "320px - x4Small", value: "var(--aegis-layout-width-x4Small)" },
];

// PageLayoutPaneWidth の値は layout token と異なるマッピングを持つ
// "small" → x5Small (240px), "medium" → x4Small (320px), "large" → x3Small (400px)
// "xLarge" → xxSmall (480px), "xxLarge" → xSmall (560px)
const PANE_WIDTH_OPTIONS = [
  { label: "240px - x5Small", value: "small" },
  { label: "320px - x4Small", value: "medium" },
  { label: "400px - x3Small", value: "large" },
  { label: "480px - xxSmall", value: "xLarge" },
  { label: "560px - xSmall", value: "xxLarge" },
];

const PANE_MAX_WIDTH_OPTIONS_BY_WIDTH: Record<string, typeof PANE_WIDTH_OPTIONS> = {
  small: PANE_WIDTH_OPTIONS,
  medium: PANE_WIDTH_OPTIONS.filter((option) => option.value !== "small"),
  large: PANE_WIDTH_OPTIONS.filter(
    (option) => option.value === "large" || option.value === "xLarge" || option.value === "xxLarge",
  ),
  xLarge: PANE_WIDTH_OPTIONS.filter((option) => option.value === "xLarge" || option.value === "xxLarge"),
  xxLarge: PANE_WIDTH_OPTIONS.filter((option) => option.value === "xxLarge"),
};

const SIDEBAR_WIDTH_OPTIONS: { label: string; value: SidebarWidth }[] = [
  { label: "240px - small", value: "small" },
  { label: "400px - medium", value: "medium" },
  { label: "560px - large", value: "large" },
  { label: "720px - xLarge", value: "xLarge" },
];

const SIDEBAR_MAX_WIDTH_OPTIONS_BY_WIDTH: Record<SidebarWidth, { label: string; value: "none" | SidebarWidth }[]> = {
  small: [{ label: "None", value: "none" }, ...SIDEBAR_WIDTH_OPTIONS],
  medium: [{ label: "None", value: "none" }, ...SIDEBAR_WIDTH_OPTIONS.filter((o) => o.value !== "small")],
  large: [
    { label: "None", value: "none" },
    ...SIDEBAR_WIDTH_OPTIONS.filter((o) => o.value === "large" || o.value === "xLarge"),
  ],
  xLarge: [
    { label: "None", value: "none" },
    { label: "720px - xLarge", value: "xLarge" },
  ],
};

const SIDEBAR_BEHAVIOR_OPTIONS: { label: string; value: SidebarBehavior }[] = [
  { label: "Push", value: "push" },
  { label: "Overlay", value: "overlay" },
];

const STYLE_OPTIONS: { label: string; value: AreaStyle }[] = [
  { label: "Plain", value: "plain" },
  { label: "Outline", value: "outline" },
  { label: "Fill", value: "fill" },
];

const SIDEBAR_STYLE_OPTIONS: { label: string; value: SidebarStyle }[] = [
  { label: "Plain", value: "plain" },
  { label: "Subtle", value: "subtle" },
];

const ALIGN_OPTIONS: { label: string; value: AlignValue }[] = [
  { label: "Left", value: "start" },
  { label: "Center", value: "center" },
  { label: "Right", value: "end" },
];

const INNER_SCOPE_OPTIONS: { label: string; value: InnerWrapperScope }[] = [
  { label: "Body only", value: "body" },
  { label: "All content", value: "all" },
];

const INDENT_PADDING = ["0px", "var(--aegis-space-medium)", "var(--aegis-space-xLarge)"] as const;
const POPOVER_UI_STATE = new Map<ContentArea, { open: boolean; tabIndex: number }>();

const FormRow = ({ label, indent = 0, control }: { label: string; indent?: 0 | 1 | 2; control: React.ReactNode }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--aegis-space-xSmall)",
    }}
  >
    <div style={{ flex: "1 1 0%", minWidth: 0 }}>
      <div style={{ paddingLeft: INDENT_PADDING[indent] }}>
        <Text variant="label.small" color={indent > 0 ? "subtle" : undefined}>
          {label}
        </Text>
      </div>
    </div>
    <div style={{ flex: "1 1 0%", minWidth: 0, display: "flex", alignItems: "center" }}>{control}</div>
  </div>
);

interface Props {
  area: ContentArea;
  settings: AreaSettings;
  onUpdate: (settings: AreaSettings) => void;
  onDelete?: () => void;
  compactDeleteActions?: Array<
    { type?: "action"; label: string; onClick: () => void; icon?: React.ReactNode } | { type: "divider"; key: string }
  >;
  size?: "xSmall" | "small" | "medium";
  placement?:
    | "left-start"
    | "left-end"
    | "right-start"
    | "right-end"
    | "bottom-start"
    | "bottom-end"
    | "top-start"
    | "top-end";
  paneSettings?: PaneSettings;
  onUpdatePaneSettings?: (settings: PaneSettings) => void;
  hasPaneHeader?: boolean;
  sidebarSettings?: SidebarSettings;
  onUpdateSidebarSettings?: (settings: SidebarSettings) => void;
  globalStyling?: GlobalStylingSettings;
  onUpdateGlobalStyling?: (settings: GlobalStylingSettings) => void;
  /** Pane Width > Content width 制約のためのアクティブな Pane 幅 (px)。コンテンツエリアに渡す */
  activePaneWidthPx?: number;
  /** 現在描画されているエリアのフラグ。All styling タブの表示制御に使用 */
  activeLayout?: Record<LayoutKey, boolean>;
  /** 幅の狭いエリア用のコンパクト表示。単一の省略記号ボタン + Menu に切り替える */
  compact?: boolean;
  /** compact 表示時のカスタムトリガー */
  compactTrigger?: React.ReactNode;
  /** compact 表示時の一次メニュー配置 */
  compactListPlacement?:
    | "left-start"
    | "left-end"
    | "right-start"
    | "right-end"
    | "bottom-start"
    | "bottom-end"
    | "top-start"
    | "top-end";
  iconSidebarEnabled?: boolean;
  onIconSidebarChange?: (enabled: boolean) => void;
  onOpenEditPanel?: () => void;
}

type GlobalStylingKey = keyof GlobalStylingSettings;

interface SelectedStylingField {
  label: string;
  indent: 0 | 1 | 2;
  kind: "select" | "checkbox";
  key: GlobalStylingKey;
  options?: { label: string; value: AreaStyle | SidebarStyle }[];
  visible?: (settings: GlobalStylingSettings) => boolean;
}

interface SelectedStylingSection {
  title: string;
  fields: SelectedStylingField[];
}

const SELECTED_STYLING_SECTIONS: Partial<Record<ContentArea, SelectedStylingSection[]>> = {
  globalHeader: [
    {
      title: "Header",
      fields: [
        { label: "Header", indent: 0, kind: "select", key: "header", options: SIDEBAR_STYLE_OPTIONS },
        { label: "Border", indent: 1, kind: "checkbox", key: "headerBorder" },
      ],
    },
  ],
  globalFooter: [
    {
      title: "Footer",
      fields: [
        { label: "Footer", indent: 0, kind: "select", key: "footer", options: SIDEBAR_STYLE_OPTIONS },
        { label: "Border", indent: 1, kind: "checkbox", key: "footerBorder" },
      ],
    },
  ],
  outerSidebarStartHeader: [
    {
      title: "Sidebar Start",
      fields: [
        { label: "Sidebar Start", indent: 0, kind: "select", key: "sidebarStart", options: SIDEBAR_STYLE_OPTIONS },
        { label: "Border Header", indent: 1, kind: "checkbox", key: "sidebarStartBorderHeader" },
      ],
    },
  ],
  outerSidebarStartBody: [
    {
      title: "Sidebar Start",
      fields: [
        { label: "Sidebar Start", indent: 0, kind: "select", key: "sidebarStart", options: SIDEBAR_STYLE_OPTIONS },
        { label: "Border Header", indent: 1, kind: "checkbox", key: "sidebarStartBorderHeader" },
        { label: "Border Footer", indent: 1, kind: "checkbox", key: "sidebarStartBorderFooter" },
      ],
    },
  ],
  outerSidebarStartFooter: [
    {
      title: "Sidebar Start",
      fields: [
        { label: "Sidebar Start", indent: 0, kind: "select", key: "sidebarStart", options: SIDEBAR_STYLE_OPTIONS },
        { label: "Border Footer", indent: 1, kind: "checkbox", key: "sidebarStartBorderFooter" },
      ],
    },
  ],
  outerSidebarEndHeader: [
    {
      title: "Sidebar End",
      fields: [
        { label: "Sidebar End", indent: 0, kind: "select", key: "sidebarEnd", options: SIDEBAR_STYLE_OPTIONS },
        { label: "Border Header", indent: 1, kind: "checkbox", key: "sidebarEndBorderHeader" },
      ],
    },
  ],
  outerSidebarEndBody: [
    {
      title: "Sidebar End",
      fields: [
        { label: "Sidebar End", indent: 0, kind: "select", key: "sidebarEnd", options: SIDEBAR_STYLE_OPTIONS },
        { label: "Border Header", indent: 1, kind: "checkbox", key: "sidebarEndBorderHeader" },
        { label: "Border Footer", indent: 1, kind: "checkbox", key: "sidebarEndBorderFooter" },
      ],
    },
  ],
  outerSidebarEndFooter: [
    {
      title: "Sidebar End",
      fields: [
        { label: "Sidebar End", indent: 0, kind: "select", key: "sidebarEnd", options: SIDEBAR_STYLE_OPTIONS },
        { label: "Border Footer", indent: 1, kind: "checkbox", key: "sidebarEndBorderFooter" },
      ],
    },
  ],
  contentHeader: [
    {
      title: "Content",
      fields: [
        { label: "Content", indent: 0, kind: "select", key: "content", options: STYLE_OPTIONS },
        {
          label: "Border Header",
          indent: 1,
          kind: "checkbox",
          key: "contentBorderHeader",
          visible: (settings) => settings.content !== "plain",
        },
      ],
    },
  ],
  contentBody: [
    {
      title: "Content",
      fields: [
        { label: "Content", indent: 0, kind: "select", key: "content", options: STYLE_OPTIONS },
        {
          label: "Border Header",
          indent: 1,
          kind: "checkbox",
          key: "contentBorderHeader",
          visible: (settings) => settings.content !== "plain",
        },
        {
          label: "Border Footer",
          indent: 1,
          kind: "checkbox",
          key: "contentBorderFooter",
          visible: (settings) => settings.content !== "plain",
        },
      ],
    },
  ],
  contentFooter: [
    {
      title: "Content",
      fields: [
        { label: "Content", indent: 0, kind: "select", key: "content", options: STYLE_OPTIONS },
        {
          label: "Border Footer",
          indent: 1,
          kind: "checkbox",
          key: "contentBorderFooter",
          visible: (settings) => settings.content !== "plain",
        },
      ],
    },
  ],
  paneStartHeader: [
    {
      title: "Pane Start",
      fields: [
        { label: "Pane Start", indent: 0, kind: "select", key: "paneStart", options: STYLE_OPTIONS },
        {
          label: "Border Header",
          indent: 1,
          kind: "checkbox",
          key: "paneStartBorderHeader",
          visible: (settings) => settings.paneStart !== "plain",
        },
      ],
    },
  ],
  paneStartBody: [
    {
      title: "Pane Start",
      fields: [
        { label: "Pane Start", indent: 0, kind: "select", key: "paneStart", options: STYLE_OPTIONS },
        {
          label: "Border Header",
          indent: 1,
          kind: "checkbox",
          key: "paneStartBorderHeader",
          visible: (settings) => settings.paneStart !== "plain",
        },
        {
          label: "Border Footer",
          indent: 1,
          kind: "checkbox",
          key: "paneStartBorderFooter",
          visible: (settings) => settings.paneStart !== "plain",
        },
      ],
    },
  ],
  paneStartFooter: [
    {
      title: "Pane Start",
      fields: [
        { label: "Pane Start", indent: 0, kind: "select", key: "paneStart", options: STYLE_OPTIONS },
        {
          label: "Border Footer",
          indent: 1,
          kind: "checkbox",
          key: "paneStartBorderFooter",
          visible: (settings) => settings.paneStart !== "plain",
        },
      ],
    },
  ],
  paneEndHeader: [
    {
      title: "Pane End",
      fields: [
        { label: "Pane End", indent: 0, kind: "select", key: "paneEnd", options: STYLE_OPTIONS },
        {
          label: "Border Header",
          indent: 1,
          kind: "checkbox",
          key: "paneEndBorderHeader",
          visible: (settings) => settings.paneEnd !== "plain",
        },
      ],
    },
  ],
  paneEndBody: [
    {
      title: "Pane End",
      fields: [
        { label: "Pane End", indent: 0, kind: "select", key: "paneEnd", options: STYLE_OPTIONS },
        {
          label: "Border Header",
          indent: 1,
          kind: "checkbox",
          key: "paneEndBorderHeader",
          visible: (settings) => settings.paneEnd !== "plain",
        },
        {
          label: "Border Footer",
          indent: 1,
          kind: "checkbox",
          key: "paneEndBorderFooter",
          visible: (settings) => settings.paneEnd !== "plain",
        },
      ],
    },
  ],
  paneEndFooter: [
    {
      title: "Pane End",
      fields: [
        { label: "Pane End", indent: 0, kind: "select", key: "paneEnd", options: STYLE_OPTIONS },
        {
          label: "Border Footer",
          indent: 1,
          kind: "checkbox",
          key: "paneEndBorderFooter",
          visible: (settings) => settings.paneEnd !== "plain",
        },
      ],
    },
  ],
  innerSidebarStart: [
    {
      title: "Sidebar Start",
      fields: [
        { label: "Sidebar Start", indent: 0, kind: "select", key: "sidebarStart", options: SIDEBAR_STYLE_OPTIONS },
      ],
    },
  ],
  innerSidebarEnd: [
    {
      title: "Sidebar End",
      fields: [{ label: "Sidebar End", indent: 0, kind: "select", key: "sidebarEnd", options: SIDEBAR_STYLE_OPTIONS }],
    },
  ],
};

export const SizingAndStylingPopover = ({
  area,
  settings,
  onUpdate,
  onDelete,
  compactDeleteActions,
  size = "medium",
  placement = "left-start",
  paneSettings,
  onUpdatePaneSettings,
  hasPaneHeader = true,
  sidebarSettings,
  onUpdateSidebarSettings,
  globalStyling,
  onUpdateGlobalStyling,
  activePaneWidthPx,
  activeLayout,
  compact = false,
  compactTrigger,
  compactListPlacement = "bottom-start",
  iconSidebarEnabled,
  onIconSidebarChange,
  onOpenEditPanel,
}: Props): React.ReactElement => {
  const isPaneArea = area.startsWith("pane");
  const isSidebarArea = area.startsWith("outerSidebarStart") || area.startsWith("outerSidebarEnd");
  const isSidebarStartArea = area.startsWith("outerSidebarStart");
  const resolvedPaneSettings = paneSettings ?? DEFAULT_PANE_SETTINGS;
  const resolvedSidebarSettings = sidebarSettings ?? DEFAULT_SIDEBAR_SETTINGS;
  const resolvedGlobalStyling = globalStyling ?? DEFAULT_GLOBAL_STYLING;
  const { sizing } = settings;
  const [compactListOpen, setCompactListOpen] = useState(false);
  const [compactListReference, setCompactListReference] = useState<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(() => POPOVER_UI_STATE.get(area)?.open ?? false);
  const [tabIndex, setTabIndex] = useState(() => POPOVER_UI_STATE.get(area)?.tabIndex ?? 0);
  const isSizingActive = open && tabIndex === 0;
  const isStylingActive = open && tabIndex > 0;
  const selectedStylingSections = SELECTED_STYLING_SECTIONS[area] ?? [];
  const availablePaneMaxWidthOptions =
    PANE_MAX_WIDTH_OPTIONS_BY_WIDTH[resolvedPaneSettings.paneWidth] ??
    PANE_WIDTH_OPTIONS.filter((option) => option.value !== "small");
  // Pane Width > Content width: アクティブな Pane Width より大きい Content width オプションのみ表示
  const availableContentWidthOptions =
    activePaneWidthPx && activePaneWidthPx > 0
      ? CONTENT_PANE_WIDTH_OPTIONS.filter(
          (option) => option.value === "none" || (CONTENT_WIDTH_PX[option.value] ?? Infinity) > activePaneWidthPx,
        )
      : CONTENT_PANE_WIDTH_OPTIONS;

  // Content width > Inner wrapper width: Content width より小さいオプションのみ表示
  const contentWidthPx = LAYOUT_WIDTH_PX[sizing.contentWidth] ?? null;
  const availableInnerWidthOptions =
    contentWidthPx !== null
      ? INNER_WIDTH_OPTIONS.filter((option) => (LAYOUT_WIDTH_PX[option.value] ?? 0) < contentWidthPx)
      : INNER_WIDTH_OPTIONS;

  const handleRulerClick = () => {
    if (open && tabIndex === 0) {
      setOpen(false);
    } else {
      setTabIndex(0);
      setOpen(true);
    }
  };

  const handlePaintClick = () => {
    if (open && tabIndex > 0) {
      setOpen(false);
    } else {
      setTabIndex(1);
      setOpen(true);
    }
  };

  const handleIconSidebarToggle = () => {
    POPOVER_UI_STATE.set(area, { open: false, tabIndex });
    onIconSidebarChange?.(!iconSidebarEnabled);
    setOpen(false);
    setCompactListOpen(false);
  };

  const handleOpenEditPanel = () => {
    POPOVER_UI_STATE.set(area, { open: false, tabIndex });
    setOpen(false);
    setCompactListOpen(false);
    window.dispatchEvent(new CustomEvent("sandbox-builder:open-layout-drawer"));
    requestAnimationFrame(() => {
      onOpenEditPanel?.();
    });
  };

  const upd = (patch: Partial<GlobalStylingSettings>) =>
    onUpdateGlobalStyling?.({ ...resolvedGlobalStyling, ...patch });

  useEffect(() => {
    POPOVER_UI_STATE.set(area, { open, tabIndex });
  }, [area, open, tabIndex]);

  return (
    <>
      {open &&
        createPortal(
          // biome-ignore lint/a11y/noStaticElementInteractions: transparent click-away backdrop for closing the popover
          <div
            role="presentation"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: "calc(var(--aegis-zIndex-dropdown) - 1)",
              background: "transparent",
            }}
            onClick={() => {
              setOpen(false);
              setCompactListOpen(false);
            }}
          />,
          document.body,
        )}
      {compact && (
        <Popover
          open={compactListOpen}
          onOpenChange={setCompactListOpen}
          placement={compactListPlacement}
          closeButton={false}
        >
          <Popover.Anchor>
            {
              (compactTrigger ?? (
                <Tooltip title="Actions">
                  <IconButton variant={compactListOpen ? "subtle" : "plain"} size={size} aria-label="Actions">
                    <Icon>
                      <LfEllipsisDot />
                    </Icon>
                  </IconButton>
                </Tooltip>
              )) as React.ReactElement
            }
          </Popover.Anchor>
          <Popover.Content width="small">
            <Popover.Body>
              <div ref={setCompactListReference}>
                <ActionList size="medium">
                  <ActionList.Group>
                    <ActionList.Item
                      onClick={() => {
                        setTabIndex(0);
                        setOpen(true);
                      }}
                    >
                      <ActionList.Body leading={LfRulerMeasure}>Sizing</ActionList.Body>
                    </ActionList.Item>
                    <ActionList.Item
                      onClick={() => {
                        setTabIndex(1);
                        setOpen(true);
                      }}
                    >
                      <ActionList.Body leading={LfPaintRoller}>Styling</ActionList.Body>
                    </ActionList.Item>
                  </ActionList.Group>
                  {compactDeleteActions && compactDeleteActions.length > 0 ? (
                    <ActionList.Group>
                      {compactDeleteActions.map((action) =>
                        action.type === "divider" ? (
                          <div key={action.key} style={{ paddingBlock: "var(--aegis-space-xxSmall)" }}>
                            <Divider />
                          </div>
                        ) : (
                          <ActionList.Item key={action.label} onClick={action.onClick}>
                            <ActionList.Body
                              leading={
                                action.icon ?? (
                                  <Icon size="small">
                                    <LfTrash />
                                  </Icon>
                                )
                              }
                            >
                              {action.label}
                            </ActionList.Body>
                          </ActionList.Item>
                        ),
                      )}
                    </ActionList.Group>
                  ) : onDelete ? (
                    <ActionList.Group>
                      <ActionList.Item onClick={onDelete}>
                        <ActionList.Body
                          leading={
                            <Icon size="small">
                              <LfTrash />
                            </Icon>
                          }
                        >
                          Delete
                        </ActionList.Body>
                      </ActionList.Item>
                    </ActionList.Group>
                  ) : null}
                </ActionList>
              </div>
            </Popover.Body>
          </Popover.Content>
        </Popover>
      )}
      <Popover
        open={open}
        onOpenChange={setOpen}
        placement={compact ? "right-start" : placement}
        positionReference={compact ? compactListReference : undefined}
        closeButton={false}
      >
        {compact ? null : (
          <Popover.Anchor>
            <Toolbar>
              <ButtonGroup>
                <Tooltip title="Sizing">
                  <IconButton
                    variant={isSizingActive ? "subtle" : "plain"}
                    size={size}
                    aria-label="Sizing"
                    aria-pressed={isSizingActive}
                    aria-expanded={isSizingActive}
                    onClick={handleRulerClick}
                  >
                    <Icon>
                      <LfRulerMeasure />
                    </Icon>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Styling">
                  <IconButton
                    variant={isStylingActive ? "subtle" : "plain"}
                    size={size}
                    aria-label="Styling"
                    aria-pressed={isStylingActive}
                    aria-expanded={isStylingActive}
                    onClick={handlePaintClick}
                  >
                    <Icon>
                      <LfPaintRoller />
                    </Icon>
                  </IconButton>
                </Tooltip>
              </ButtonGroup>
              {onDelete && (
                <>
                  <ToolbarSeparator />
                  <ButtonGroup>
                    <Tooltip title="Delete">
                      <IconButton variant="plain" size={size} aria-label="Delete" onClick={onDelete}>
                        <Icon>
                          <LfTrash />
                        </Icon>
                      </IconButton>
                    </Tooltip>
                  </ButtonGroup>
                </>
              )}
            </Toolbar>
          </Popover.Anchor>
        )}
        <Popover.Content
          style={{
            width: "var(--aegis-layout-width-x4Small)",
            height: "var(--aegis-layout-width-x3Small)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              minHeight: 0,
            }}
          >
            <Popover.Header>
              <SegmentedControl
                index={tabIndex}
                onChange={setTabIndex}
                variant="solid"
                size="xSmall"
                style={{ width: "100%" }}
              >
                <SegmentedControl.Button>Sizing</SegmentedControl.Button>
                <SegmentedControl.Button>Selected styling</SegmentedControl.Button>
                <SegmentedControl.Button>All styling</SegmentedControl.Button>
              </SegmentedControl>
            </Popover.Header>
            <Divider />
            <Popover.Body
              style={{
                flex: "1 1 auto",
                minHeight: 0,
                overflowY: "auto",
              }}
            >
              {tabIndex === 0 ? (
                isSidebarArea ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-medium)",
                    }}
                  >
                    {isSidebarStartArea && onIconSidebarChange ? (
                      <>
                        <FormRow
                          label="Icon Sidebar"
                          indent={0}
                          control={
                            <Switch
                              size="small"
                              color="information"
                              checked={Boolean(iconSidebarEnabled)}
                              onChange={handleIconSidebarToggle}
                            />
                          }
                        />
                        <Divider />
                      </>
                    ) : null}
                    {!isSidebarStartArea || !iconSidebarEnabled ? (
                      <FormRow
                        label="Width"
                        indent={0}
                        control={
                          <Select
                            aria-label="Width"
                            size="small"
                            value={resolvedSidebarSettings.width}
                            onChange={(value) => {
                              const width = value as SidebarWidth;
                              const availableMax = SIDEBAR_MAX_WIDTH_OPTIONS_BY_WIDTH[width] ?? [];
                              const maxWidth = availableMax.some((o) => o.value === resolvedSidebarSettings.maxWidth)
                                ? resolvedSidebarSettings.maxWidth
                                : (availableMax[availableMax.length - 1]?.value ?? "none");
                              onUpdateSidebarSettings?.({ ...resolvedSidebarSettings, width, maxWidth });
                            }}
                            options={SIDEBAR_WIDTH_OPTIONS}
                            style={{ width: "100%" }}
                          />
                        }
                      />
                    ) : null}
                    <Divider />
                    <FormRow
                      label="Behavior"
                      indent={0}
                      control={
                        <Select
                          aria-label="Behavior"
                          size="small"
                          value={resolvedSidebarSettings.behavior}
                          onChange={(value) =>
                            onUpdateSidebarSettings?.({
                              ...resolvedSidebarSettings,
                              behavior: value as SidebarBehavior,
                            })
                          }
                          options={SIDEBAR_BEHAVIOR_OPTIONS}
                          style={{ width: "100%" }}
                        />
                      }
                    />
                    <FormRow
                      label="Resize"
                      indent={0}
                      control={
                        <Checkbox
                          size="small"
                          checked={resolvedSidebarSettings.resizable}
                          onChange={(e) =>
                            onUpdateSidebarSettings?.({
                              ...resolvedSidebarSettings,
                              resizable: (e.target as HTMLInputElement).checked,
                            })
                          }
                        />
                      }
                    />
                    {resolvedSidebarSettings.resizable && (
                      <FormRow
                        label="Max Width"
                        indent={1}
                        control={
                          <Select
                            aria-label="Max Width"
                            size="small"
                            value={resolvedSidebarSettings.maxWidth}
                            onChange={(value) =>
                              onUpdateSidebarSettings?.({
                                ...resolvedSidebarSettings,
                                maxWidth: value as "none" | SidebarWidth,
                              })
                            }
                            options={SIDEBAR_MAX_WIDTH_OPTIONS_BY_WIDTH[resolvedSidebarSettings.width] ?? []}
                            style={{ width: "100%" }}
                          />
                        }
                      />
                    )}
                  </div>
                ) : isPaneArea ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-medium)",
                    }}
                  >
                    <FormRow
                      label="Pane width"
                      indent={0}
                      control={
                        <Select
                          aria-label="Content width"
                          size="small"
                          placeholder="Select"
                          value={resolvedPaneSettings.paneWidth}
                          onChange={(value) => {
                            const paneWidth = value as string;
                            const nextMaxWidthOptions =
                              PANE_MAX_WIDTH_OPTIONS_BY_WIDTH[paneWidth] ?? PANE_WIDTH_OPTIONS;
                            const nextMaxWidth = nextMaxWidthOptions.some(
                              (option) => option.value === resolvedPaneSettings.maxWidth,
                            )
                              ? resolvedPaneSettings.maxWidth
                              : (nextMaxWidthOptions[0]?.value ?? paneWidth);
                            onUpdatePaneSettings?.({
                              ...resolvedPaneSettings,
                              paneWidth,
                              maxWidth: nextMaxWidth,
                            });
                          }}
                          options={PANE_WIDTH_OPTIONS}
                          style={{ width: "100%" }}
                        />
                      }
                    />
                    <FormRow
                      label="Resize"
                      indent={0}
                      control={
                        <Checkbox
                          size="small"
                          checked={resolvedPaneSettings.resizable}
                          onChange={(e) =>
                            onUpdatePaneSettings?.({
                              ...resolvedPaneSettings,
                              resizable: (e.target as HTMLInputElement).checked,
                            })
                          }
                        />
                      }
                    />
                    {resolvedPaneSettings.resizable && (
                      <FormRow
                        label="max-width"
                        indent={1}
                        control={
                          <Select
                            aria-label="max-width"
                            size="small"
                            placeholder="Select"
                            value={resolvedPaneSettings.maxWidth}
                            onChange={(value) =>
                              onUpdatePaneSettings?.({ ...resolvedPaneSettings, maxWidth: value as string })
                            }
                            options={availablePaneMaxWidthOptions}
                            style={{ width: "100%" }}
                          />
                        }
                      />
                    )}
                    {hasPaneHeader && (
                      <>
                        <Divider />
                        <FormRow
                          label="Sticky Header"
                          indent={0}
                          control={
                            <Checkbox
                              size="small"
                              checked={resolvedPaneSettings.stickyHeader}
                              onChange={(e) =>
                                onUpdatePaneSettings?.({
                                  ...resolvedPaneSettings,
                                  stickyHeader: (e.target as HTMLInputElement).checked,
                                })
                              }
                            />
                          }
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-medium)",
                    }}
                  >
                    <FormRow
                      label="Content width"
                      indent={0}
                      control={
                        <Select
                          aria-label="Content width"
                          size="small"
                          placeholder="Select"
                          value={sizing.contentWidth}
                          onChange={(value) =>
                            onUpdate({ ...settings, sizing: { ...sizing, contentWidth: value as string } })
                          }
                          options={availableContentWidthOptions}
                          style={{ width: "100%" }}
                        />
                      }
                    />
                    <FormRow
                      label="Align"
                      indent={0}
                      control={
                        <Select
                          aria-label="Align"
                          size="small"
                          placeholder="Select"
                          value={sizing.contentAlign}
                          onChange={(value) =>
                            onUpdate({ ...settings, sizing: { ...sizing, contentAlign: value as AlignValue } })
                          }
                          options={ALIGN_OPTIONS}
                          style={{ width: "100%" }}
                        />
                      }
                    />
                    <FormRow
                      label="Inner wrapper width"
                      indent={0}
                      control={
                        <Checkbox
                          size="small"
                          checked={sizing.innerWidthEnabled}
                          onChange={(e) =>
                            onUpdate({
                              ...settings,
                              sizing: { ...sizing, innerWidthEnabled: (e.target as HTMLInputElement).checked },
                            })
                          }
                        />
                      }
                    />
                    <div
                      aria-hidden={!sizing.innerWidthEnabled}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--aegis-space-medium)",
                        overflow: "hidden",
                        maxHeight: sizing.innerWidthEnabled ? "240px" : "0px",
                        opacity: sizing.innerWidthEnabled ? 1 : 0,
                        pointerEvents: sizing.innerWidthEnabled ? "auto" : "none",
                        transition: "max-height 160ms ease, opacity 120ms ease",
                      }}
                    >
                      <FormRow
                        label="Inner wrapper width"
                        indent={1}
                        control={
                          <Select
                            aria-label="Inner wrapper width"
                            size="small"
                            placeholder="Select"
                            value={sizing.innerWidth}
                            onChange={(value) =>
                              onUpdate({ ...settings, sizing: { ...sizing, innerWidth: value as string } })
                            }
                            options={availableInnerWidthOptions}
                            style={{ width: "100%" }}
                          />
                        }
                      />
                      <FormRow
                        label="Apply to"
                        indent={1}
                        control={
                          <Select
                            aria-label="Apply to"
                            size="small"
                            placeholder="Select"
                            value={sizing.innerScope}
                            onChange={(value) =>
                              onUpdate({ ...settings, sizing: { ...sizing, innerScope: value as InnerWrapperScope } })
                            }
                            options={INNER_SCOPE_OPTIONS}
                            style={{ width: "100%" }}
                          />
                        }
                      />
                      <FormRow
                        label="Align"
                        indent={1}
                        control={
                          <Select
                            aria-label="Align"
                            size="small"
                            placeholder="Select"
                            value={sizing.innerAlign}
                            onChange={(value) =>
                              onUpdate({ ...settings, sizing: { ...sizing, innerAlign: value as AlignValue } })
                            }
                            options={ALIGN_OPTIONS}
                            style={{ width: "100%" }}
                          />
                        }
                      />
                    </div>
                  </div>
                )
              ) : tabIndex === 1 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-medium)",
                  }}
                >
                  <FormRow
                    label="Show Background"
                    indent={0}
                    control={
                      <Checkbox
                        size="small"
                        checked={resolvedGlobalStyling.dummyBg}
                        onChange={(e) => upd({ dummyBg: (e.target as HTMLInputElement).checked })}
                      />
                    }
                  />
                  <Divider />
                  {selectedStylingSections.length === 0 ? (
                    <Text variant="body.small" color="subtle">
                      No selected styling is available for this area.
                    </Text>
                  ) : (
                    selectedStylingSections.map((section, index) => (
                      <div
                        key={`${area}-${section.title}`}
                        style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}
                      >
                        {index > 0 && <Divider />}
                        {section.fields
                          .filter((field) => (field.visible ? field.visible(resolvedGlobalStyling) : true))
                          .map((field) => (
                            <FormRow
                              key={field.key}
                              label={field.label}
                              indent={field.indent}
                              control={
                                field.kind === "select" ? (
                                  <Select
                                    aria-label={field.label}
                                    size="small"
                                    value={resolvedGlobalStyling[field.key] as AreaStyle | SidebarStyle}
                                    onChange={(value) =>
                                      upd({ [field.key]: value as GlobalStylingSettings[typeof field.key] })
                                    }
                                    options={field.options ?? []}
                                    style={{ width: "100%" }}
                                  />
                                ) : (
                                  <Checkbox
                                    size="small"
                                    checked={Boolean(resolvedGlobalStyling[field.key])}
                                    onChange={(e) =>
                                      upd({
                                        [field.key]: (e.target as HTMLInputElement)
                                          .checked as GlobalStylingSettings[typeof field.key],
                                      })
                                    }
                                  />
                                )
                              }
                            />
                          ))}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-medium)",
                  }}
                >
                  <FormRow
                    label="Show Background"
                    indent={0}
                    control={
                      <Checkbox
                        size="small"
                        checked={resolvedGlobalStyling.dummyBg}
                        onChange={(e) => upd({ dummyBg: (e.target as HTMLInputElement).checked })}
                      />
                    }
                  />
                  {(!activeLayout || activeLayout.outerSidebarStart || activeLayout.outerSidebarEnd) && <Divider />}
                  {(!activeLayout || activeLayout.outerSidebarStart) && (
                    <>
                      <FormRow
                        label="Sidebar Start"
                        indent={0}
                        control={
                          <Select
                            aria-label="Sidebar Start"
                            size="small"
                            value={resolvedGlobalStyling.sidebarStart}
                            onChange={(v) => upd({ sidebarStart: v as SidebarStyle })}
                            options={SIDEBAR_STYLE_OPTIONS}
                            style={{ width: "100%" }}
                          />
                        }
                      />
                      <FormRow
                        label="Border Header"
                        indent={1}
                        control={
                          <Checkbox
                            size="small"
                            checked={resolvedGlobalStyling.sidebarStartBorderHeader}
                            onChange={(e) => upd({ sidebarStartBorderHeader: (e.target as HTMLInputElement).checked })}
                          />
                        }
                      />
                      <FormRow
                        label="Border Footer"
                        indent={1}
                        control={
                          <Checkbox
                            size="small"
                            checked={resolvedGlobalStyling.sidebarStartBorderFooter}
                            onChange={(e) => upd({ sidebarStartBorderFooter: (e.target as HTMLInputElement).checked })}
                          />
                        }
                      />
                    </>
                  )}
                  {(!activeLayout || activeLayout.outerSidebarEnd) && (
                    <>
                      <FormRow
                        label="Sidebar End"
                        indent={0}
                        control={
                          <Select
                            aria-label="Sidebar End"
                            size="small"
                            value={resolvedGlobalStyling.sidebarEnd}
                            onChange={(v) => upd({ sidebarEnd: v as SidebarStyle })}
                            options={SIDEBAR_STYLE_OPTIONS}
                            style={{ width: "100%" }}
                          />
                        }
                      />
                      <FormRow
                        label="Border Header"
                        indent={1}
                        control={
                          <Checkbox
                            size="small"
                            checked={resolvedGlobalStyling.sidebarEndBorderHeader}
                            onChange={(e) => upd({ sidebarEndBorderHeader: (e.target as HTMLInputElement).checked })}
                          />
                        }
                      />
                      <FormRow
                        label="Border Footer"
                        indent={1}
                        control={
                          <Checkbox
                            size="small"
                            checked={resolvedGlobalStyling.sidebarEndBorderFooter}
                            onChange={(e) => upd({ sidebarEndBorderFooter: (e.target as HTMLInputElement).checked })}
                          />
                        }
                      />
                    </>
                  )}
                  <Divider />
                  <FormRow
                    label="PageLayout"
                    indent={0}
                    control={
                      <Select
                        aria-label="PageLayout"
                        size="small"
                        value={resolvedGlobalStyling.pageLayout}
                        onChange={(v) => upd({ pageLayout: v as AreaStyle })}
                        options={STYLE_OPTIONS}
                        style={{ width: "100%" }}
                      />
                    }
                  />
                  {(!activeLayout || activeLayout.paneStart) && (
                    <>
                      <FormRow
                        label="Pane start"
                        indent={1}
                        control={
                          <Select
                            aria-label="Pane start"
                            size="small"
                            value={resolvedGlobalStyling.paneStart}
                            onChange={(v) => upd({ paneStart: v as AreaStyle })}
                            options={STYLE_OPTIONS}
                            style={{ width: "100%" }}
                          />
                        }
                      />
                      {resolvedGlobalStyling.paneStart !== "plain" && (
                        <>
                          <FormRow
                            label="Border Header"
                            indent={2}
                            control={
                              <Checkbox
                                size="small"
                                checked={resolvedGlobalStyling.paneStartBorderHeader}
                                onChange={(e) => upd({ paneStartBorderHeader: (e.target as HTMLInputElement).checked })}
                              />
                            }
                          />
                          <FormRow
                            label="Border Footer"
                            indent={2}
                            control={
                              <Checkbox
                                size="small"
                                checked={resolvedGlobalStyling.paneStartBorderFooter}
                                onChange={(e) => upd({ paneStartBorderFooter: (e.target as HTMLInputElement).checked })}
                              />
                            }
                          />
                        </>
                      )}
                    </>
                  )}
                  <FormRow
                    label="Content"
                    indent={1}
                    control={
                      <Select
                        aria-label="Content"
                        size="small"
                        value={resolvedGlobalStyling.content}
                        onChange={(v) => upd({ content: v as AreaStyle })}
                        options={STYLE_OPTIONS}
                        style={{ width: "100%" }}
                      />
                    }
                  />
                  {resolvedGlobalStyling.content !== "plain" && (
                    <>
                      <FormRow
                        label="Border Header"
                        indent={2}
                        control={
                          <Checkbox
                            size="small"
                            checked={resolvedGlobalStyling.contentBorderHeader}
                            onChange={(e) => upd({ contentBorderHeader: (e.target as HTMLInputElement).checked })}
                          />
                        }
                      />
                      <FormRow
                        label="Border Footer"
                        indent={2}
                        control={
                          <Checkbox
                            size="small"
                            checked={resolvedGlobalStyling.contentBorderFooter}
                            onChange={(e) => upd({ contentBorderFooter: (e.target as HTMLInputElement).checked })}
                          />
                        }
                      />
                    </>
                  )}
                  {(!activeLayout || activeLayout.paneEnd) && (
                    <>
                      <FormRow
                        label="Pane end"
                        indent={1}
                        control={
                          <Select
                            aria-label="Pane end"
                            size="small"
                            value={resolvedGlobalStyling.paneEnd}
                            onChange={(v) => upd({ paneEnd: v as AreaStyle })}
                            options={STYLE_OPTIONS}
                            style={{ width: "100%" }}
                          />
                        }
                      />
                      {resolvedGlobalStyling.paneEnd !== "plain" && (
                        <>
                          <FormRow
                            label="Border Header"
                            indent={2}
                            control={
                              <Checkbox
                                size="small"
                                checked={resolvedGlobalStyling.paneEndBorderHeader}
                                onChange={(e) => upd({ paneEndBorderHeader: (e.target as HTMLInputElement).checked })}
                              />
                            }
                          />
                          <FormRow
                            label="Border Footer"
                            indent={2}
                            control={
                              <Checkbox
                                size="small"
                                checked={resolvedGlobalStyling.paneEndBorderFooter}
                                onChange={(e) => upd({ paneEndBorderFooter: (e.target as HTMLInputElement).checked })}
                              />
                            }
                          />
                        </>
                      )}
                    </>
                  )}
                  {(!activeLayout || activeLayout.globalHeader || activeLayout.globalFooter) && <Divider />}
                  {(!activeLayout || activeLayout.globalHeader) && (
                    <>
                      <FormRow
                        label="Header"
                        indent={0}
                        control={
                          <Select
                            aria-label="Header"
                            size="small"
                            value={resolvedGlobalStyling.header}
                            onChange={(v) => upd({ header: v as SidebarStyle })}
                            options={SIDEBAR_STYLE_OPTIONS}
                            style={{ width: "100%" }}
                          />
                        }
                      />
                      <FormRow
                        label="Border"
                        indent={1}
                        control={
                          <Checkbox
                            size="small"
                            checked={resolvedGlobalStyling.headerBorder}
                            onChange={(e) => upd({ headerBorder: (e.target as HTMLInputElement).checked })}
                          />
                        }
                      />
                    </>
                  )}
                  {(!activeLayout || activeLayout.globalFooter) && (
                    <>
                      <FormRow
                        label="Footer"
                        indent={0}
                        control={
                          <Select
                            aria-label="Footer"
                            size="small"
                            value={resolvedGlobalStyling.footer}
                            onChange={(v) => upd({ footer: v as SidebarStyle })}
                            options={SIDEBAR_STYLE_OPTIONS}
                            style={{ width: "100%" }}
                          />
                        }
                      />
                      <FormRow
                        label="Border"
                        indent={1}
                        control={
                          <Checkbox
                            size="small"
                            checked={resolvedGlobalStyling.footerBorder}
                            onChange={(e) => upd({ footerBorder: (e.target as HTMLInputElement).checked })}
                          />
                        }
                      />
                    </>
                  )}
                </div>
              )}
            </Popover.Body>
            <Divider />
            <Popover.Footer>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <Button size="xSmall" variant="gutterless" weight="normal" onClick={handleOpenEditPanel}>
                  Edit Panel
                </Button>
                <Button
                  size="xSmall"
                  variant="gutterless"
                  weight="normal"
                  onClick={() => {
                    onUpdate(DEFAULT_AREA_SETTINGS);
                    if (isPaneArea) onUpdatePaneSettings?.(DEFAULT_PANE_SETTINGS);
                    onUpdateGlobalStyling?.(DEFAULT_GLOBAL_STYLING);
                  }}
                >
                  reset
                </Button>
              </div>
            </Popover.Footer>
          </div>
        </Popover.Content>
      </Popover>
    </>
  );
};
