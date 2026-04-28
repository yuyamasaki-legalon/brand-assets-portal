import { LfEllipsisDot, LfEye, LfEyeSlash } from "@legalforce/aegis-icons";
import { Icon, IconButton, Text, Tooltip } from "@legalforce/aegis-react";
import type React from "react";
import { Placeholder } from "../../../../../../components/Placeholder";
import type { ContentArea, LayoutKey } from "../types";
import { SizingAndStylingPopover } from "./SizingAndStylingView/SizingAndStylingPopover";
import type { AreaSettings, GlobalStylingSettings, PaneSettings, SidebarSettings } from "./SizingAndStylingView/types";

interface Props {
  area: ContentArea;
  onHide: (...keys: LayoutKey[]) => void;
  onToggle?: (key: LayoutKey) => void;
  onOpenEditPanel?: () => void;
  settings: AreaSettings;
  onUpdateSettings: (settings: AreaSettings) => void;
  paneSettings?: PaneSettings;
  onUpdatePaneSettings?: (settings: PaneSettings) => void;
  hasPaneHeader?: boolean;
  sidebarSettings?: SidebarSettings;
  onUpdateSidebarSettings?: (settings: SidebarSettings) => void;
  globalStyling?: GlobalStylingSettings;
  onUpdateGlobalStyling?: (settings: GlobalStylingSettings) => void;
  activePaneWidthPx?: number;
  activeLayout?: Record<LayoutKey, boolean>;
  compact?: boolean;
  iconSidebarEnabled?: boolean;
  onIconSidebarChange?: (enabled: boolean) => void;
}

const xSubtle = {
  width: "100%",
  height: "100%",
  backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
} as const;
const xSubtleWidth = { width: "100%", backgroundColor: "var(--aegis-color-background-neutral-xSubtle)" } as const;
const xSubtleNoBg = { width: "100%", height: "100%", backgroundColor: "transparent", border: "none" } as const;
const xSubtleWidthNoBg = { width: "100%", backgroundColor: "transparent", border: "none" } as const;
const barContentStyle = {
  display: "flex",
  alignItems: "center",
  gap: "var(--aegis-space-xxSmall)",
  paddingBlock: "var(--aegis-space-x3Small)",
  paddingInline: "var(--aegis-space-xSmall)",
  width: "100%",
} as const;

const PANE_WIDTH_PX: Record<string, string> = {
  small: "240px",
  medium: "320px",
  large: "400px",
  xLarge: "480px",
  xxLarge: "560px",
};

const SIDEBAR_WIDTH_PX: Record<string, string> = {
  small: "240px",
  medium: "400px",
  large: "560px",
  xLarge: "720px",
};

const LAYOUT_WIDTH_PX: Record<string, string> = {
  "var(--aegis-layout-width-x7Large)": "1680px",
  "var(--aegis-layout-width-x6Large)": "1440px",
  "var(--aegis-layout-width-x5Large)": "1200px",
  "var(--aegis-layout-width-x4Large)": "1120px",
  "var(--aegis-layout-width-x3Large)": "1040px",
  "var(--aegis-layout-width-xxLarge)": "960px",
  "var(--aegis-layout-width-xLarge)": "880px",
  "var(--aegis-layout-width-large)": "800px",
  "var(--aegis-layout-width-medium)": "720px",
  "var(--aegis-layout-width-small)": "640px",
  "var(--aegis-layout-width-xSmall)": "560px",
  "var(--aegis-layout-width-x3Small)": "400px",
  "var(--aegis-layout-width-x4Small)": "320px",
};

const ActionButtons = ({
  onDelete,
  size = "medium",
  area,
  settings,
  onUpdateSettings,
  placement = "left-start",
  paneSettings,
  onUpdatePaneSettings,
  hasPaneHeader,
  sidebarSettings,
  onUpdateSidebarSettings,
  globalStyling,
  onUpdateGlobalStyling,
  activePaneWidthPx,
  activeLayout,
  compact,
  iconSidebarEnabled,
  onIconSidebarChange,
  onOpenEditPanel,
}: {
  onDelete?: () => void;
  size?: "xSmall" | "small" | "medium";
  area: ContentArea;
  settings: AreaSettings;
  onUpdateSettings: (settings: AreaSettings) => void;
  placement?: "left-start" | "right-start" | "bottom-start" | "top-start";
  paneSettings?: PaneSettings;
  onUpdatePaneSettings?: (settings: PaneSettings) => void;
  hasPaneHeader?: boolean;
  sidebarSettings?: SidebarSettings;
  onUpdateSidebarSettings?: (settings: SidebarSettings) => void;
  globalStyling?: GlobalStylingSettings;
  onUpdateGlobalStyling?: (settings: GlobalStylingSettings) => void;
  activePaneWidthPx?: number;
  activeLayout?: Record<LayoutKey, boolean>;
  compact?: boolean;
  iconSidebarEnabled?: boolean;
  onIconSidebarChange?: (enabled: boolean) => void;
  onOpenEditPanel?: () => void;
}) => (
  <SizingAndStylingPopover
    area={area}
    settings={settings}
    onUpdate={onUpdateSettings}
    onDelete={onDelete}
    size={size}
    placement={placement}
    paneSettings={paneSettings}
    onUpdatePaneSettings={onUpdatePaneSettings}
    hasPaneHeader={hasPaneHeader}
    sidebarSettings={sidebarSettings}
    onUpdateSidebarSettings={onUpdateSidebarSettings}
    globalStyling={globalStyling}
    onUpdateGlobalStyling={onUpdateGlobalStyling}
    activePaneWidthPx={activePaneWidthPx}
    activeLayout={activeLayout}
    compact={compact}
    iconSidebarEnabled={iconSidebarEnabled}
    onIconSidebarChange={onIconSidebarChange}
    onOpenEditPanel={onOpenEditPanel}
  />
);

const BarEditContent = ({
  label,
  onDelete,
  area,
  settings,
  onUpdateSettings,
  paneSettings,
  onUpdatePaneSettings,
  hasPaneHeader,
  sidebarSettings,
  onUpdateSidebarSettings,
  globalStyling,
  onUpdateGlobalStyling,
  activePaneWidthPx,
  activeLayout,
  compact,
  iconSidebarEnabled,
  onIconSidebarChange,
  onOpenEditPanel: _onOpenEditPanel,
}: {
  label: string;
  onDelete?: () => void;
  area: ContentArea;
  settings: AreaSettings;
  onUpdateSettings: (settings: AreaSettings) => void;
  paneSettings?: PaneSettings;
  onUpdatePaneSettings?: (settings: PaneSettings) => void;
  hasPaneHeader?: boolean;
  sidebarSettings?: SidebarSettings;
  onUpdateSidebarSettings?: (settings: SidebarSettings) => void;
  globalStyling?: GlobalStylingSettings;
  onUpdateGlobalStyling?: (settings: GlobalStylingSettings) => void;
  activePaneWidthPx?: number;
  activeLayout?: Record<LayoutKey, boolean>;
  compact?: boolean;
  iconSidebarEnabled?: boolean;
  onIconSidebarChange?: (enabled: boolean) => void;
  onOpenEditPanel?: () => void;
}) => (
  <div style={barContentStyle}>
    <Text
      variant="body.medium.bold"
      style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
    >
      {label}
    </Text>
    <ActionButtons
      size="xSmall"
      onDelete={onDelete}
      area={area}
      settings={settings}
      onUpdateSettings={onUpdateSettings}
      placement="bottom-start"
      paneSettings={paneSettings}
      onUpdatePaneSettings={onUpdatePaneSettings}
      hasPaneHeader={hasPaneHeader}
      sidebarSettings={sidebarSettings}
      onUpdateSidebarSettings={onUpdateSidebarSettings}
      globalStyling={globalStyling}
      onUpdateGlobalStyling={onUpdateGlobalStyling}
      activePaneWidthPx={activePaneWidthPx}
      activeLayout={activeLayout}
      compact={compact}
      iconSidebarEnabled={iconSidebarEnabled}
      onIconSidebarChange={onIconSidebarChange}
    />
  </div>
);

const HeaderFooterEditContent = ({
  label,
  onDelete,
  area,
  settings,
  onUpdateSettings,
  paneSettings,
  onUpdatePaneSettings,
  hasPaneHeader,
  sidebarSettings,
  onUpdateSidebarSettings,
  globalStyling,
  onUpdateGlobalStyling,
  activePaneWidthPx,
  activeLayout,
  compact,
  iconSidebarEnabled,
  onIconSidebarChange,
  onOpenEditPanel,
}: {
  label: string;
  onDelete?: () => void;
  area: ContentArea;
  settings: AreaSettings;
  onUpdateSettings: (settings: AreaSettings) => void;
  paneSettings?: PaneSettings;
  onUpdatePaneSettings?: (settings: PaneSettings) => void;
  hasPaneHeader?: boolean;
  sidebarSettings?: SidebarSettings;
  onUpdateSidebarSettings?: (settings: SidebarSettings) => void;
  globalStyling?: GlobalStylingSettings;
  onUpdateGlobalStyling?: (settings: GlobalStylingSettings) => void;
  activePaneWidthPx?: number;
  activeLayout?: Record<LayoutKey, boolean>;
  compact?: boolean;
  iconSidebarEnabled?: boolean;
  onIconSidebarChange?: (enabled: boolean) => void;
  onOpenEditPanel?: () => void;
}) => (
  <div style={barContentStyle}>
    <Text
      variant="body.medium.bold"
      style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
    >
      {label}
    </Text>
    <ActionButtons
      size="xSmall"
      onDelete={onDelete}
      area={area}
      settings={settings}
      onUpdateSettings={onUpdateSettings}
      paneSettings={paneSettings}
      onUpdatePaneSettings={onUpdatePaneSettings}
      hasPaneHeader={hasPaneHeader}
      sidebarSettings={sidebarSettings}
      onUpdateSidebarSettings={onUpdateSidebarSettings}
      globalStyling={globalStyling}
      onUpdateGlobalStyling={onUpdateGlobalStyling}
      activePaneWidthPx={activePaneWidthPx}
      activeLayout={activeLayout}
      compact={compact}
      iconSidebarEnabled={iconSidebarEnabled}
      onIconSidebarChange={onIconSidebarChange}
      onOpenEditPanel={onOpenEditPanel}
    />
  </div>
);

const CompactIconSidebarEditControl = ({
  area,
  settings,
  onUpdateSettings,
  onToggleHeader,
  onDeleteSidebar,
  onToggleFooter,
  sidebarSettings,
  onUpdateSidebarSettings,
  globalStyling,
  onUpdateGlobalStyling,
  activeLayout,
  iconSidebarEnabled,
  onIconSidebarChange,
  onOpenEditPanel,
}: {
  area: ContentArea;
  settings: AreaSettings;
  onUpdateSettings: (settings: AreaSettings) => void;
  onToggleHeader: () => void;
  onDeleteSidebar: () => void;
  onToggleFooter: () => void;
  sidebarSettings?: SidebarSettings;
  onUpdateSidebarSettings?: (settings: SidebarSettings) => void;
  globalStyling?: GlobalStylingSettings;
  onUpdateGlobalStyling?: (settings: GlobalStylingSettings) => void;
  activeLayout?: Record<LayoutKey, boolean>;
  iconSidebarEnabled?: boolean;
  onIconSidebarChange?: (enabled: boolean) => void;
  onOpenEditPanel?: () => void;
}) => (
  <SizingAndStylingPopover
    area={area}
    settings={settings}
    onUpdate={onUpdateSettings}
    compactDeleteActions={[
      {
        label: activeLayout?.outerSidebarStartHeader ? "Delete Header" : "Show Header",
        onClick: onToggleHeader,
        icon: <Icon size="small">{activeLayout?.outerSidebarStartHeader ? <LfEyeSlash /> : <LfEye />}</Icon>,
      },
      {
        label: activeLayout?.outerSidebarStartFooter ? "Delete Footer" : "Show Footer",
        onClick: onToggleFooter,
        icon: <Icon size="small">{activeLayout?.outerSidebarStartFooter ? <LfEyeSlash /> : <LfEye />}</Icon>,
      },
      { type: "divider", key: "sidebar-start-delete-divider" },
      { label: "Delete Sidebar", onClick: onDeleteSidebar },
    ]}
    size="medium"
    placement="bottom-start"
    sidebarSettings={sidebarSettings}
    onUpdateSidebarSettings={onUpdateSidebarSettings}
    globalStyling={globalStyling}
    onUpdateGlobalStyling={onUpdateGlobalStyling}
    activeLayout={activeLayout}
    compact
    compactListPlacement="right-start"
    iconSidebarEnabled={iconSidebarEnabled}
    onIconSidebarChange={onIconSidebarChange}
    onOpenEditPanel={onOpenEditPanel}
    compactTrigger={
      <Tooltip title={area === "outerSidebarStartHeader" ? "Sidebar Header" : "Sidebar Footer"} placement="top">
        <IconButton
          variant="plain"
          size="medium"
          aria-label={area === "outerSidebarStartHeader" ? "Sidebar Header" : "Sidebar Footer"}
        >
          <Icon>
            <LfEllipsisDot />
          </Icon>
        </IconButton>
      </Tooltip>
    }
  />
);

const BodyEditContent = ({
  label,
  onDelete,
  area,
  settings,
  onUpdateSettings,
  paneSettings,
  onUpdatePaneSettings,
  hasPaneHeader,
  sidebarSettings,
  onUpdateSidebarSettings,
  globalStyling,
  onUpdateGlobalStyling,
  activePaneWidthPx,
  activeLayout,
  compact,
  iconSidebarEnabled,
  onIconSidebarChange,
  onOpenEditPanel,
}: {
  label: string;
  onDelete?: () => void;
  area: ContentArea;
  settings: AreaSettings;
  onUpdateSettings: (settings: AreaSettings) => void;
  paneSettings?: PaneSettings;
  onUpdatePaneSettings?: (settings: PaneSettings) => void;
  hasPaneHeader?: boolean;
  sidebarSettings?: SidebarSettings;
  onUpdateSidebarSettings?: (settings: SidebarSettings) => void;
  globalStyling?: GlobalStylingSettings;
  onUpdateGlobalStyling?: (settings: GlobalStylingSettings) => void;
  activePaneWidthPx?: number;
  activeLayout?: Record<LayoutKey, boolean>;
  compact?: boolean;
  iconSidebarEnabled?: boolean;
  onIconSidebarChange?: (enabled: boolean) => void;
  onOpenEditPanel?: () => void;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 0,
      width: "100%",
      height: "100%",
    }}
  >
    <Text variant="body.medium.bold">{label}</Text>
    {paneSettings && (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          marginTop: "var(--aegis-space-x3Small)",
        }}
      >
        <Text variant="body.small" color="subtle">
          {`width: ${PANE_WIDTH_PX[paneSettings.paneWidth] ?? paneSettings.paneWidth}`}
        </Text>
        <Text variant="body.small" color="subtle">
          {`resize: ${paneSettings.resizable ? "on" : "off"}`}
        </Text>
      </div>
    )}
    {sidebarSettings && (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          marginTop: "var(--aegis-space-x3Small)",
        }}
      >
        <Text variant="body.small" color="subtle">
          {`width: ${SIDEBAR_WIDTH_PX[sidebarSettings.width] ?? sidebarSettings.width}`}
        </Text>
        <Text variant="body.small" color="subtle">
          {`behavior: ${sidebarSettings.behavior}`}
        </Text>
        <Text variant="body.small" color="subtle">
          {`resize: ${sidebarSettings.resizable ? "on" : "off"}`}
        </Text>
      </div>
    )}
    {!paneSettings && !sidebarSettings && area === "contentBody" && (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          marginTop: "var(--aegis-space-x3Small)",
        }}
      >
        <Text variant="body.small" color="subtle">
          {`width: ${settings.sizing.contentWidth === "none" ? "none" : (LAYOUT_WIDTH_PX[settings.sizing.contentWidth] ?? settings.sizing.contentWidth)}`}
        </Text>
        <Text variant="body.small" color="subtle">
          {`inner wrapper width: ${
            settings.sizing.innerWidthEnabled
              ? (LAYOUT_WIDTH_PX[settings.sizing.innerWidth] ?? settings.sizing.innerWidth)
              : "none"
          }`}
        </Text>
      </div>
    )}
    <div style={{ display: "flex", alignItems: "center", marginTop: "var(--aegis-space-xSmall)" }}>
      <ActionButtons
        onDelete={onDelete}
        area={area}
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        paneSettings={paneSettings}
        onUpdatePaneSettings={onUpdatePaneSettings}
        hasPaneHeader={hasPaneHeader}
        sidebarSettings={sidebarSettings}
        onUpdateSidebarSettings={onUpdateSidebarSettings}
        globalStyling={globalStyling}
        onUpdateGlobalStyling={onUpdateGlobalStyling}
        activePaneWidthPx={activePaneWidthPx}
        activeLayout={activeLayout}
        compact={compact}
        iconSidebarEnabled={iconSidebarEnabled}
        onIconSidebarChange={onIconSidebarChange}
        onOpenEditPanel={onOpenEditPanel}
      />
    </div>
  </div>
);

export const LayoutEditView = ({
  area,
  onHide,
  onToggle,
  settings,
  onUpdateSettings,
  paneSettings,
  onUpdatePaneSettings,
  hasPaneHeader,
  sidebarSettings,
  onUpdateSidebarSettings,
  globalStyling,
  onUpdateGlobalStyling,
  activePaneWidthPx,
  activeLayout,
  compact,
  iconSidebarEnabled,
  onIconSidebarChange,
  onOpenEditPanel,
}: Props): React.ReactElement | null => {
  const hasBg = globalStyling?.dummyBg ?? true;
  const bodyStyle = hasBg ? xSubtle : xSubtleNoBg;
  const widthStyle = hasBg ? xSubtleWidth : xSubtleWidthNoBg;
  const contentInnerPreviewStyle: React.CSSProperties | undefined = settings.sizing.innerWidthEnabled
    ? {
        inlineSize: "100%",
        maxInlineSize: settings.sizing.innerWidth,
        minInlineSize: 0,
        marginInlineStart: ["center", "end"].includes(settings.sizing.innerAlign) ? "auto" : undefined,
        marginInlineEnd: ["center", "start"].includes(settings.sizing.innerAlign) ? "auto" : undefined,
        boxSizing: "border-box",
      }
    : undefined;
  switch (area) {
    case "globalHeader":
      return (
        <Placeholder style={{ ...widthStyle, padding: 0 }}>
          <BarEditContent
            label="Global Header"
            onDelete={() => onHide("globalHeader")}
            area={area}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            globalStyling={globalStyling}
            onUpdateGlobalStyling={onUpdateGlobalStyling}
            activeLayout={activeLayout}
            compact={compact}
          />
        </Placeholder>
      );
    case "globalFooter":
      return (
        <Placeholder style={{ ...widthStyle, padding: 0 }}>
          <BarEditContent
            label="Global Footer"
            onDelete={() => onHide("globalFooter")}
            area={area}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            globalStyling={globalStyling}
            onUpdateGlobalStyling={onUpdateGlobalStyling}
            activeLayout={activeLayout}
            compact={compact}
          />
        </Placeholder>
      );
    case "outerSidebarStartHeader":
      if (compact) {
        return (
          <CompactIconSidebarEditControl
            area={area}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            onToggleHeader={() => onToggle?.("outerSidebarStartHeader")}
            onDeleteSidebar={() => onHide("outerSidebarStart", "outerSidebarStartHeader", "outerSidebarStartFooter")}
            onToggleFooter={() => onToggle?.("outerSidebarStartFooter")}
            sidebarSettings={sidebarSettings}
            onUpdateSidebarSettings={onUpdateSidebarSettings}
            globalStyling={globalStyling}
            onUpdateGlobalStyling={onUpdateGlobalStyling}
            activeLayout={activeLayout}
            iconSidebarEnabled={iconSidebarEnabled}
            onIconSidebarChange={onIconSidebarChange}
            onOpenEditPanel={onOpenEditPanel}
          />
        );
      }
      return (
        <Placeholder style={{ ...bodyStyle, padding: 0 }}>
          <HeaderFooterEditContent
            label="SidebarStart: Header"
            onDelete={() => onHide("outerSidebarStartHeader")}
            area={area}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            sidebarSettings={sidebarSettings}
            onUpdateSidebarSettings={onUpdateSidebarSettings}
            globalStyling={globalStyling}
            onUpdateGlobalStyling={onUpdateGlobalStyling}
            activeLayout={activeLayout}
            compact={compact}
            iconSidebarEnabled={iconSidebarEnabled}
            onIconSidebarChange={onIconSidebarChange}
            onOpenEditPanel={onOpenEditPanel}
          />
        </Placeholder>
      );
    case "outerSidebarStartBody":
      return (
        <Placeholder style={bodyStyle}>
          <BodyEditContent
            label="SidebarStart: Body"
            onDelete={() => onHide("outerSidebarStart", "outerSidebarStartHeader", "outerSidebarStartFooter")}
            area={area}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            sidebarSettings={sidebarSettings}
            onUpdateSidebarSettings={onUpdateSidebarSettings}
            globalStyling={globalStyling}
            onUpdateGlobalStyling={onUpdateGlobalStyling}
            activeLayout={activeLayout}
            compact={compact}
            iconSidebarEnabled={iconSidebarEnabled}
            onIconSidebarChange={onIconSidebarChange}
            onOpenEditPanel={onOpenEditPanel}
          />
        </Placeholder>
      );
    case "outerSidebarStartFooter":
      if (compact) {
        return (
          <CompactIconSidebarEditControl
            area={area}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            onToggleHeader={() => onToggle?.("outerSidebarStartHeader")}
            onDeleteSidebar={() => onHide("outerSidebarStart", "outerSidebarStartHeader", "outerSidebarStartFooter")}
            onToggleFooter={() => onToggle?.("outerSidebarStartFooter")}
            sidebarSettings={sidebarSettings}
            onUpdateSidebarSettings={onUpdateSidebarSettings}
            globalStyling={globalStyling}
            onUpdateGlobalStyling={onUpdateGlobalStyling}
            activeLayout={activeLayout}
            iconSidebarEnabled={iconSidebarEnabled}
            onIconSidebarChange={onIconSidebarChange}
            onOpenEditPanel={onOpenEditPanel}
          />
        );
      }
      return (
        <Placeholder style={{ ...widthStyle, padding: 0 }}>
          <HeaderFooterEditContent
            label="SidebarStart: Footer"
            onDelete={() => onHide("outerSidebarStartFooter")}
            area={area}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            sidebarSettings={sidebarSettings}
            onUpdateSidebarSettings={onUpdateSidebarSettings}
            globalStyling={globalStyling}
            onUpdateGlobalStyling={onUpdateGlobalStyling}
            activeLayout={activeLayout}
            compact={compact}
            iconSidebarEnabled={iconSidebarEnabled}
            onIconSidebarChange={onIconSidebarChange}
            onOpenEditPanel={onOpenEditPanel}
          />
        </Placeholder>
      );
    case "outerSidebarEndHeader":
      return (
        <Placeholder style={{ ...bodyStyle, padding: 0 }}>
          <HeaderFooterEditContent
            label="SidebarEnd: Header"
            onDelete={() => onHide("outerSidebarEndHeader")}
            area={area}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            sidebarSettings={sidebarSettings}
            onUpdateSidebarSettings={onUpdateSidebarSettings}
            globalStyling={globalStyling}
            onUpdateGlobalStyling={onUpdateGlobalStyling}
            activeLayout={activeLayout}
            compact={compact}
          />
        </Placeholder>
      );
    case "outerSidebarEndBody":
      return (
        <Placeholder style={bodyStyle}>
          <BodyEditContent
            label="SidebarEnd: Body"
            onDelete={() => onHide("outerSidebarEnd", "outerSidebarEndHeader", "outerSidebarEndFooter")}
            area={area}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            sidebarSettings={sidebarSettings}
            onUpdateSidebarSettings={onUpdateSidebarSettings}
            globalStyling={globalStyling}
            onUpdateGlobalStyling={onUpdateGlobalStyling}
            activeLayout={activeLayout}
            compact={compact}
          />
        </Placeholder>
      );
    case "outerSidebarEndFooter":
      return (
        <Placeholder style={{ ...widthStyle, padding: 0 }}>
          <HeaderFooterEditContent
            label="SidebarEnd: Footer"
            onDelete={() => onHide("outerSidebarEndFooter")}
            area={area}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            sidebarSettings={sidebarSettings}
            onUpdateSidebarSettings={onUpdateSidebarSettings}
            globalStyling={globalStyling}
            onUpdateGlobalStyling={onUpdateGlobalStyling}
            activeLayout={activeLayout}
            compact={compact}
          />
        </Placeholder>
      );
    case "contentHeader":
      return (
        <div
          style={
            settings.sizing.innerWidthEnabled && settings.sizing.innerScope === "all"
              ? contentInnerPreviewStyle
              : { width: "100%" }
          }
        >
          <Placeholder style={{ ...bodyStyle, padding: 0 }}>
            <HeaderFooterEditContent
              label="Content: Header"
              onDelete={() => onHide("contentHeader")}
              area={area}
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              globalStyling={globalStyling}
              onUpdateGlobalStyling={onUpdateGlobalStyling}
              activePaneWidthPx={activePaneWidthPx}
              activeLayout={activeLayout}
              compact={compact}
            />
          </Placeholder>
        </div>
      );
    case "contentBody":
      return (
        <div
          style={
            contentInnerPreviewStyle
              ? { ...contentInnerPreviewStyle, height: "100%" }
              : { width: "100%", height: "100%" }
          }
        >
          <Placeholder style={bodyStyle}>
            <BodyEditContent
              label="Content: Body"
              area={area}
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              globalStyling={globalStyling}
              onUpdateGlobalStyling={onUpdateGlobalStyling}
              activePaneWidthPx={activePaneWidthPx}
              activeLayout={activeLayout}
              compact={compact}
            />
          </Placeholder>
        </div>
      );
    case "contentFooter":
      return (
        <div
          style={
            settings.sizing.innerWidthEnabled && settings.sizing.innerScope === "all"
              ? contentInnerPreviewStyle
              : { width: "100%" }
          }
        >
          <Placeholder style={{ ...widthStyle, padding: 0 }}>
            <HeaderFooterEditContent
              label="Content: Footer"
              onDelete={() => onHide("contentFooter")}
              area={area}
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              globalStyling={globalStyling}
              onUpdateGlobalStyling={onUpdateGlobalStyling}
              activePaneWidthPx={activePaneWidthPx}
              activeLayout={activeLayout}
              compact={compact}
            />
          </Placeholder>
        </div>
      );
    case "paneStartHeader":
      return (
        <Placeholder style={{ ...bodyStyle, padding: 0 }}>
          <HeaderFooterEditContent
            label="PaneStart: Header"
            onDelete={() => onHide("paneStartHeader")}
            area={area}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            paneSettings={paneSettings}
            onUpdatePaneSettings={onUpdatePaneSettings}
            hasPaneHeader={hasPaneHeader}
            globalStyling={globalStyling}
            onUpdateGlobalStyling={onUpdateGlobalStyling}
            activeLayout={activeLayout}
            compact={compact}
          />
        </Placeholder>
      );
    case "paneStartBody":
      return (
        <Placeholder style={bodyStyle}>
          <BodyEditContent
            label="PaneStart: Body"
            onDelete={() => onHide("paneStart", "paneStartHeader", "paneStartFooter")}
            area={area}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            paneSettings={paneSettings}
            onUpdatePaneSettings={onUpdatePaneSettings}
            hasPaneHeader={hasPaneHeader}
            globalStyling={globalStyling}
            onUpdateGlobalStyling={onUpdateGlobalStyling}
            activeLayout={activeLayout}
            compact={compact}
          />
        </Placeholder>
      );
    case "paneStartFooter":
      return (
        <Placeholder style={{ ...widthStyle, padding: 0 }}>
          <HeaderFooterEditContent
            label="PaneStart: Footer"
            onDelete={() => onHide("paneStartFooter")}
            area={area}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            paneSettings={paneSettings}
            onUpdatePaneSettings={onUpdatePaneSettings}
            hasPaneHeader={hasPaneHeader}
            globalStyling={globalStyling}
            onUpdateGlobalStyling={onUpdateGlobalStyling}
            activeLayout={activeLayout}
            compact={compact}
          />
        </Placeholder>
      );
    case "paneEndHeader":
      return (
        <Placeholder style={{ ...bodyStyle, padding: 0 }}>
          <HeaderFooterEditContent
            label="PaneEnd: Header"
            onDelete={() => onHide("paneEndHeader")}
            area={area}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            paneSettings={paneSettings}
            onUpdatePaneSettings={onUpdatePaneSettings}
            hasPaneHeader={hasPaneHeader}
            globalStyling={globalStyling}
            onUpdateGlobalStyling={onUpdateGlobalStyling}
            activeLayout={activeLayout}
            compact={compact}
          />
        </Placeholder>
      );
    case "paneEndBody":
      return (
        <Placeholder style={bodyStyle}>
          <BodyEditContent
            label="PaneEnd: Body"
            onDelete={() => onHide("paneEnd", "paneEndHeader", "paneEndFooter")}
            area={area}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            paneSettings={paneSettings}
            onUpdatePaneSettings={onUpdatePaneSettings}
            hasPaneHeader={hasPaneHeader}
            globalStyling={globalStyling}
            onUpdateGlobalStyling={onUpdateGlobalStyling}
            activeLayout={activeLayout}
            compact={compact}
          />
        </Placeholder>
      );
    case "paneEndFooter":
      return (
        <Placeholder style={{ ...widthStyle, padding: 0 }}>
          <HeaderFooterEditContent
            label="PaneEnd: Footer"
            onDelete={() => onHide("paneEndFooter")}
            area={area}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            paneSettings={paneSettings}
            onUpdatePaneSettings={onUpdatePaneSettings}
            hasPaneHeader={hasPaneHeader}
            globalStyling={globalStyling}
            onUpdateGlobalStyling={onUpdateGlobalStyling}
            activeLayout={activeLayout}
            compact={compact}
          />
        </Placeholder>
      );
    default:
      return null;
  }
};
