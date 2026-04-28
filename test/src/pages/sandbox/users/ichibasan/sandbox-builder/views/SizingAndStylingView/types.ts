export type AreaStyle = "plain" | "outline" | "fill";
export type SidebarStyle = "plain" | "subtle";
export type AlignValue = "start" | "center" | "end";
export type InnerWrapperScope = "body" | "all";

export interface SizingSettings {
  contentWidth: string;
  contentAlign: AlignValue;
  innerWidthEnabled: boolean;
  innerWidth: string;
  innerAlign: AlignValue;
  innerScope: InnerWrapperScope;
}

export interface StylingSettings {
  backgroundEnabled: boolean;
  style: AreaStyle;
  borderEnabled: boolean;
  borderHeader: boolean;
  borderFooter: boolean;
}

export interface AreaSettings {
  sizing: SizingSettings;
  styling: StylingSettings;
}

export interface PaneSettings {
  paneWidth: string;
  resizable: boolean;
  maxWidth: string;
  stickyHeader: boolean;
}

export const DEFAULT_SIZING: SizingSettings = {
  contentWidth: "none",
  contentAlign: "center",
  innerWidthEnabled: false,
  innerWidth: "var(--aegis-layout-width-medium)",
  innerAlign: "center",
  innerScope: "body",
};

export const DEFAULT_STYLING: StylingSettings = {
  backgroundEnabled: true,
  style: "plain",
  borderEnabled: false,
  borderHeader: false,
  borderFooter: false,
};

export const DEFAULT_AREA_SETTINGS: AreaSettings = {
  sizing: DEFAULT_SIZING,
  styling: DEFAULT_STYLING,
};

export const DEFAULT_PANE_SETTINGS: PaneSettings = {
  paneWidth: "small", // 240px (x5Small layout token)
  resizable: false,
  maxWidth: "xxLarge", // 560px (xSmall layout token)
  stickyHeader: false,
};

export type SidebarBehavior = "push" | "overlay";
export type SidebarCollapsible = "icon" | "offcanvas";
export type SidebarWidth = "small" | "medium" | "large" | "xLarge";

export interface SidebarSettings {
  width: SidebarWidth; // small=240px, medium=400px, large=560px, xLarge=720px
  behavior: SidebarBehavior;
  collapsible: SidebarCollapsible;
  resizable: boolean;
  minWidth: SidebarWidth;
  maxWidth: "none" | SidebarWidth;
}

export const DEFAULT_SIDEBAR_SETTINGS: SidebarSettings = {
  width: "small", // 240px
  behavior: "push",
  collapsible: "icon",
  resizable: false,
  minWidth: "small",
  maxWidth: "xLarge",
};

export interface GlobalStylingSettings {
  dummyBg: boolean;
  sidebarStart: SidebarStyle;
  sidebarStartBorderHeader: boolean;
  sidebarStartBorderFooter: boolean;
  sidebarEnd: SidebarStyle;
  sidebarEndBorderHeader: boolean;
  sidebarEndBorderFooter: boolean;
  pageLayout: AreaStyle;
  paneStart: AreaStyle;
  paneStartBorderHeader: boolean;
  paneStartBorderFooter: boolean;
  content: AreaStyle;
  contentBorderHeader: boolean;
  contentBorderFooter: boolean;
  paneEnd: AreaStyle;
  paneEndBorderHeader: boolean;
  paneEndBorderFooter: boolean;
  header: SidebarStyle;
  headerBorder: boolean;
  footer: SidebarStyle;
  footerBorder: boolean;
}

export const DEFAULT_GLOBAL_STYLING: GlobalStylingSettings = {
  dummyBg: true,
  sidebarStart: "plain",
  sidebarStartBorderHeader: false,
  sidebarStartBorderFooter: false,
  sidebarEnd: "plain",
  sidebarEndBorderHeader: false,
  sidebarEndBorderFooter: false,
  pageLayout: "plain",
  paneStart: "plain",
  paneStartBorderHeader: false,
  paneStartBorderFooter: false,
  content: "plain",
  contentBorderHeader: false,
  contentBorderFooter: false,
  paneEnd: "plain",
  paneEndBorderHeader: false,
  paneEndBorderFooter: false,
  header: "plain",
  headerBorder: false,
  footer: "plain",
  footerBorder: false,
};
