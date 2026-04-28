import type { ContentArea, LayoutKey } from "./types";
import type { ContentItem } from "./views/AddContentView/types";
import type {
  AlignValue,
  AreaSettings,
  GlobalStylingSettings,
  PaneSettings,
  SidebarSettings,
  SidebarStyle,
} from "./views/SizingAndStylingView/types";

export type BuildPageLayoutJsxTextParams = {
  layout: Record<LayoutKey, boolean>;
  contentAreaItems: Record<ContentArea, ContentItem[]>;
  paneStartSettings: PaneSettings;
  paneEndSettings: PaneSettings;
  sidebarStartSettings: SidebarSettings;
  sidebarEndSettings: SidebarSettings;
  contentColumnSettings: AreaSettings;
  globalStyling: GlobalStylingSettings;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function itemNames(items: ContentItem[]): string {
  return items.map((i) => i.component).join(", ");
}

function slottedItemNames(items: ContentItem[]): string {
  const startItems = items.filter((i) => i.slot === "start" || i.slot === undefined);
  const endItems = items.filter((i) => i.slot === "end");

  if (endItems.length === 0) return itemNames(items);

  const parts: string[] = [];
  if (startItems.length > 0) parts.push(`start: ${startItems.map((i) => i.component).join(", ")}`);
  if (endItems.length > 0) parts.push(`end: ${endItems.map((i) => i.component).join(", ")}`);
  return parts.join(" | ");
}

function jsxComment(text: string): string {
  return `{/* ${text} */}`;
}

/** align → style property string (used for inner wrapper div) */
function marginInlineProp(align: AlignValue): string {
  // center: both auto, end: start auto, start: end auto
  if (align === "center") return `marginInline: "auto"`;
  if (align === "end") return `marginInlineStart: "auto"`;
  return `marginInlineEnd: "auto"`;
}

/**
 * Returns prop string for <PageLayoutContent> using official Aegis props.
 * - maxWidth: token key (e.g. "medium"), extracted from CSS variable string
 * - align: "start"|"center"|"end" (default is "center", so omit when center)
 */
function buildContentProps(contentWidth: string, contentAlign: AlignValue): string {
  const parts: string[] = [];
  if (contentWidth !== "none") {
    // "var(--aegis-layout-width-medium)" → "medium"
    const key = contentWidth.replace("var(--aegis-layout-width-", "").replace(")", "");
    parts.push(`maxWidth="${key}"`);
  }
  if (contentAlign !== "center") parts.push(`align="${contentAlign}"`);
  return parts.length > 0 ? ` ${parts.join(" ")}` : "";
}

/** Returns the JSX-ready style expression: {{ maxWidth: "...", ... }} */
function buildInnerWrapperStyleExpr(settings: AreaSettings): string {
  const { innerWidth, innerAlign } = settings.sizing;
  return `{{ maxWidth: "${innerWidth}", width: "100%", ${marginInlineProp(innerAlign)} }}`;
}

function buildPaneOpenTag(settings: PaneSettings, variant: string, isEnd: boolean): string {
  const parts: string[] = [];
  if (isEnd) parts.push(`position="end"`);
  parts.push(`width="${settings.paneWidth}"`);
  if (settings.resizable) {
    parts.push("resizable");
    // maxWidth / minWidth are only meaningful when resizable (JSDoc: "when resizable")
    if (settings.maxWidth && settings.maxWidth !== "xLarge") parts.push(`maxWidth="${settings.maxWidth}"`);
  }
  if (variant !== "plain") parts.push(`variant="${variant}"`);
  return `<PageLayoutPane ${parts.join(" ")}>`;
}

/**
 * Builds the open tag for the outer sidebar (<Sidebar>) per Aegis official API.
 * Aegis defaults: behavior="overlay", collapsible="icon", width="medium", variant="plain"
 */
function buildOuterSidebarOpenTag(settings: SidebarSettings, variant: SidebarStyle, isEnd: boolean): string {
  const parts: string[] = [];
  if (isEnd) parts.push(`side="inline-end"`);
  // Include non-default props only
  if (settings.behavior !== "overlay") parts.push(`behavior="${settings.behavior}"`);
  if (settings.collapsible !== "icon") parts.push(`collapsible="${settings.collapsible}"`);
  if (settings.width !== "medium") parts.push(`width="${settings.width}"`);
  if (settings.resizable) {
    parts.push("resizable");
    if (settings.minWidth !== "small") parts.push(`minWidth="${settings.minWidth}"`);
    if (settings.maxWidth !== "xLarge") parts.push(`maxWidth="${settings.maxWidth}"`);
  }
  if (variant !== "plain") parts.push(`variant="${variant}"`);
  return `<Sidebar ${parts.join(" ")}>`;
}

function buildInnerSidebarOpenTag(isEnd: boolean): string {
  return isEnd ? `<PageLayoutSidebar position="end">` : `<PageLayoutSidebar>`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function buildPageLayoutJsxText({
  layout,
  contentAreaItems,
  paneStartSettings,
  paneEndSettings,
  sidebarStartSettings,
  sidebarEndSettings,
  contentColumnSettings,
  globalStyling,
}: BuildPageLayoutJsxTextParams): string {
  const { sizing } = contentColumnSettings;

  // -- What's in the layout --
  const hasOuterSidebarStart = layout.outerSidebarStart;
  const hasOuterSidebarEnd = layout.outerSidebarEnd;
  const hasOuterSidebar = hasOuterSidebarStart || hasOuterSidebarEnd;
  const hasBothOuterSidebars = hasOuterSidebarStart && hasOuterSidebarEnd;
  const hasInnerSidebar = layout.innerSidebarStart || layout.innerSidebarEnd;
  const hasPane = layout.paneStart || layout.paneEnd;
  const hasPageLayoutHeader =
    layout.contentHeader || (layout.paneStart && layout.paneStartHeader) || (layout.paneEnd && layout.paneEndHeader);
  const hasPageLayoutFooter =
    layout.contentFooter || (layout.paneStart && layout.paneStartFooter) || (layout.paneEnd && layout.paneEndFooter);

  // Fragment is only needed when globalHeader/Footer exist AND there is NO outer sidebar
  // (with outer sidebar, SidebarInset serves as the container)
  const needsFragment = (layout.globalHeader || layout.globalFooter) && !hasOuterSidebar;

  // -- Imports --
  const imports: string[] = ["PageLayout", "PageLayoutBody", "PageLayoutContent"];
  if (hasPageLayoutFooter) imports.push("PageLayoutFooter");
  if (hasPageLayoutHeader) imports.push("PageLayoutHeader");
  if (hasPane) imports.push("PageLayoutPane");
  if (hasInnerSidebar) imports.push("PageLayoutSidebar");
  if (layout.globalHeader) imports.push("Header");
  if (layout.globalFooter) imports.push("Footer");
  if (hasOuterSidebar) {
    imports.push("Sidebar", "SidebarBody", "SidebarInset", "SidebarProvider");
    if (layout.outerSidebarStartHeader || layout.outerSidebarEndHeader) imports.push("SidebarHeader");
    if (layout.outerSidebarStartFooter || layout.outerSidebarEndFooter) imports.push("SidebarFooter");
  }
  imports.sort();

  // -- Build lines --
  const lines: string[] = [];

  lines.push(`import {\n${imports.map((i) => `  ${i},`).join("\n")}\n} from "@legalforce/aegis-react";`);
  lines.push("");
  lines.push("export default function MyPage() {");
  lines.push("  return (");

  // Indentation helpers
  const BASE = "    "; // 4 spaces (inside `return (`)
  const s = "  "; // 2 space increment

  // Compute content root: where globalHeader, PageLayout, globalFooter sit
  let contentRoot: string;
  if (hasOuterSidebar) {
    if (hasBothOuterSidebars) {
      // SidebarProvider > Sidebar + SidebarInset > SidebarProvider > SidebarInset > content
      contentRoot = BASE + s + s + s + s; // 12 spaces
    } else {
      // SidebarProvider > Sidebar/SidebarInset > content
      contentRoot = BASE + s + s; // 8 spaces
    }
  } else if (needsFragment) {
    contentRoot = BASE + s; // 6 spaces (inside fragment)
  } else {
    contentRoot = BASE; // 4 spaces (direct)
  }

  const pl1 = contentRoot + s; // direct children of PageLayout
  const pl2 = `${pl1}  `; // content inside those children
  const pl3 = `${pl2}  `; // one level deeper (e.g. inner wrapper)

  // -- Fragment open (no outer sidebar + globalHeader/Footer) --
  if (needsFragment) lines.push(`${BASE}<>`);

  // -- Outer SidebarProvider open --
  if (hasOuterSidebar) {
    lines.push(`${BASE}<SidebarProvider defaultOpen>`);
  }

  // -- Outer Sidebar Start --
  if (hasOuterSidebarStart) {
    const ind = BASE + s;
    const ind2 = BASE + s + s;
    lines.push(`${ind}${buildOuterSidebarOpenTag(sidebarStartSettings, globalStyling.sidebarStart, false)}`);
    if (layout.outerSidebarStartHeader) {
      const names = slottedItemNames(contentAreaItems.outerSidebarStartHeader);
      lines.push(`${ind2}<SidebarHeader>`);
      if (names) lines.push(`${ind2}  ${jsxComment(names)}`);
      lines.push(`${ind2}</SidebarHeader>`);
    }
    const bodyNames = itemNames(contentAreaItems.outerSidebarStartBody);
    lines.push(`${ind2}<SidebarBody>`);
    if (bodyNames) lines.push(`${ind2}  ${jsxComment(bodyNames)}`);
    lines.push(`${ind2}</SidebarBody>`);
    if (layout.outerSidebarStartFooter) {
      const names = slottedItemNames(contentAreaItems.outerSidebarStartFooter);
      lines.push(`${ind2}<SidebarFooter>`);
      if (names) lines.push(`${ind2}  ${jsxComment(names)}`);
      lines.push(`${ind2}</SidebarFooter>`);
    }
    lines.push(`${ind}</Sidebar>`);
  }

  // -- Outer SidebarInset open (wraps the inner content area) --
  if (hasOuterSidebar) {
    lines.push(`${BASE + s}<SidebarInset>`);
  }

  // -- Inner SidebarProvider (both outer sidebars case) --
  if (hasBothOuterSidebars) {
    lines.push(`${BASE + s + s}<SidebarProvider defaultOpen>`);
    lines.push(`${BASE + s + s + s}<SidebarInset>`);
  }

  // -- Global Header (outside PageLayout) --
  if (layout.globalHeader) {
    const bordered = globalStyling.headerBorder ? " bordered" : "";
    lines.push(`${contentRoot}<Header${bordered}>`);
    const names = slottedItemNames(contentAreaItems.globalHeader);
    if (names) lines.push(`${contentRoot}  ${jsxComment(names)}`);
    lines.push(`${contentRoot}</Header>`);
  }

  // -- PageLayout open --
  const plVariant = globalStyling.pageLayout !== "plain" ? ` variant="${globalStyling.pageLayout}"` : "";
  lines.push(`${contentRoot}<PageLayout${plVariant}>`);

  // ----- Inner Sidebar Start -----
  if (layout.innerSidebarStart) {
    lines.push(`${pl1}${buildInnerSidebarOpenTag(false)}`);
    const names = itemNames(contentAreaItems.innerSidebarStart);
    lines.push(`${pl2}${jsxComment(`SideNavigation${names ? `: ${names}` : ""}`)}`);
    lines.push(`${pl1}</PageLayoutSidebar>`);
  }

  // ----- Pane Start -----
  if (layout.paneStart) {
    lines.push(`${pl1}${buildPaneOpenTag(paneStartSettings, globalStyling.paneStart, false)}`);
    if (layout.paneStartHeader) {
      const names = slottedItemNames(contentAreaItems.paneStartHeader);
      lines.push(`${pl2}<PageLayoutHeader>`);
      if (names) lines.push(`${pl3}${jsxComment(names)}`);
      lines.push(`${pl2}</PageLayoutHeader>`);
    }
    lines.push(`${pl2}<PageLayoutBody>`);
    const bodyNames = itemNames(contentAreaItems.paneStartBody);
    if (bodyNames) lines.push(`${pl3}${jsxComment(bodyNames)}`);
    lines.push(`${pl2}</PageLayoutBody>`);
    if (layout.paneStartFooter) {
      const names = slottedItemNames(contentAreaItems.paneStartFooter);
      lines.push(`${pl2}<PageLayoutFooter>`);
      if (names) lines.push(`${pl3}${jsxComment(names)}`);
      lines.push(`${pl2}</PageLayoutFooter>`);
    }
    lines.push(`${pl1}</PageLayoutPane>`);
  }

  // ----- PageLayoutContent -----
  const contentProps = buildContentProps(sizing.contentWidth, sizing.contentAlign);
  lines.push(`${pl1}<PageLayoutContent${contentProps}>`);

  const innerStyleExpr = sizing.innerWidthEnabled ? buildInnerWrapperStyleExpr(contentColumnSettings) : "";
  const useInnerAll = sizing.innerWidthEnabled && sizing.innerScope === "all";
  const useInnerBody = sizing.innerWidthEnabled;

  function emitContentSection(
    tag: "PageLayoutHeader" | "PageLayoutBody" | "PageLayoutFooter",
    names: string,
    useInner: boolean,
  ): void {
    lines.push(`${pl2}<${tag}>`);
    if (useInner) {
      lines.push(`${pl3}<div style=${innerStyleExpr}>`);
      if (names) lines.push(`${pl3}  ${jsxComment(names)}`);
      lines.push(`${pl3}</div>`);
    } else {
      if (names) lines.push(`${pl3}${jsxComment(names)}`);
    }
    lines.push(`${pl2}</${tag}>`);
  }

  if (layout.contentHeader) {
    emitContentSection("PageLayoutHeader", slottedItemNames(contentAreaItems.contentHeader), useInnerAll);
  }
  emitContentSection("PageLayoutBody", itemNames(contentAreaItems.contentBody), useInnerBody);
  if (layout.contentFooter) {
    emitContentSection("PageLayoutFooter", slottedItemNames(contentAreaItems.contentFooter), useInnerAll);
  }

  lines.push(`${pl1}</PageLayoutContent>`);

  // ----- Pane End -----
  if (layout.paneEnd) {
    lines.push(`${pl1}${buildPaneOpenTag(paneEndSettings, globalStyling.paneEnd, true)}`);
    if (layout.paneEndHeader) {
      const names = slottedItemNames(contentAreaItems.paneEndHeader);
      lines.push(`${pl2}<PageLayoutHeader>`);
      if (names) lines.push(`${pl3}${jsxComment(names)}`);
      lines.push(`${pl2}</PageLayoutHeader>`);
    }
    lines.push(`${pl2}<PageLayoutBody>`);
    const bodyNames = itemNames(contentAreaItems.paneEndBody);
    if (bodyNames) lines.push(`${pl3}${jsxComment(bodyNames)}`);
    lines.push(`${pl2}</PageLayoutBody>`);
    if (layout.paneEndFooter) {
      const names = slottedItemNames(contentAreaItems.paneEndFooter);
      lines.push(`${pl2}<PageLayoutFooter>`);
      if (names) lines.push(`${pl3}${jsxComment(names)}`);
      lines.push(`${pl2}</PageLayoutFooter>`);
    }
    lines.push(`${pl1}</PageLayoutPane>`);
  }

  // ----- Inner Sidebar End -----
  if (layout.innerSidebarEnd) {
    lines.push(`${pl1}${buildInnerSidebarOpenTag(true)}`);
    const names = itemNames(contentAreaItems.innerSidebarEnd);
    lines.push(`${pl2}${jsxComment(`SideNavigation${names ? `: ${names}` : ""}`)}`);
    lines.push(`${pl1}</PageLayoutSidebar>`);
  }

  // PageLayout close
  lines.push(`${contentRoot}</PageLayout>`);

  // -- Global Footer (outside PageLayout) --
  if (layout.globalFooter) {
    lines.push(`${contentRoot}<Footer>`);
    const names = slottedItemNames(contentAreaItems.globalFooter);
    if (names) lines.push(`${contentRoot}  ${jsxComment(names)}`);
    lines.push(`${contentRoot}</Footer>`);
  }

  // -- Close inner wrappers for both-outer-sidebars case --
  if (hasBothOuterSidebars) {
    const ind = BASE + s + s + s;
    const ind2 = BASE + s + s + s + s;
    lines.push(`${ind}</SidebarInset>`);
    // Outer Sidebar End (sibling of inner SidebarInset, inside inner SidebarProvider)
    lines.push(`${ind}${buildOuterSidebarOpenTag(sidebarEndSettings, globalStyling.sidebarEnd, true)}`);
    if (layout.outerSidebarEndHeader) {
      const names = slottedItemNames(contentAreaItems.outerSidebarEndHeader);
      lines.push(`${ind2}<SidebarHeader>`);
      if (names) lines.push(`${ind2}  ${jsxComment(names)}`);
      lines.push(`${ind2}</SidebarHeader>`);
    }
    const bodyNames = itemNames(contentAreaItems.outerSidebarEndBody);
    lines.push(`${ind2}<SidebarBody>`);
    if (bodyNames) lines.push(`${ind2}  ${jsxComment(bodyNames)}`);
    lines.push(`${ind2}</SidebarBody>`);
    if (layout.outerSidebarEndFooter) {
      const names = slottedItemNames(contentAreaItems.outerSidebarEndFooter);
      lines.push(`${ind2}<SidebarFooter>`);
      if (names) lines.push(`${ind2}  ${jsxComment(names)}`);
      lines.push(`${ind2}</SidebarFooter>`);
    }
    lines.push(`${ind}</Sidebar>`);
    lines.push(`${BASE + s + s}</SidebarProvider>`);
  }

  // -- Outer SidebarInset close --
  if (hasOuterSidebar) {
    lines.push(`${BASE + s}</SidebarInset>`);
  }

  // -- Outer Sidebar End (end-only case: sibling of SidebarInset, inside outer SidebarProvider) --
  if (hasOuterSidebarEnd && !hasBothOuterSidebars) {
    const ind = BASE + s;
    const ind2 = BASE + s + s;
    lines.push(`${ind}${buildOuterSidebarOpenTag(sidebarEndSettings, globalStyling.sidebarEnd, true)}`);
    if (layout.outerSidebarEndHeader) {
      const names = slottedItemNames(contentAreaItems.outerSidebarEndHeader);
      lines.push(`${ind2}<SidebarHeader>`);
      if (names) lines.push(`${ind2}  ${jsxComment(names)}`);
      lines.push(`${ind2}</SidebarHeader>`);
    }
    const bodyNames = itemNames(contentAreaItems.outerSidebarEndBody);
    lines.push(`${ind2}<SidebarBody>`);
    if (bodyNames) lines.push(`${ind2}  ${jsxComment(bodyNames)}`);
    lines.push(`${ind2}</SidebarBody>`);
    if (layout.outerSidebarEndFooter) {
      const names = slottedItemNames(contentAreaItems.outerSidebarEndFooter);
      lines.push(`${ind2}<SidebarFooter>`);
      if (names) lines.push(`${ind2}  ${jsxComment(names)}`);
      lines.push(`${ind2}</SidebarFooter>`);
    }
    lines.push(`${ind}</Sidebar>`);
  }

  // -- Outer SidebarProvider close --
  if (hasOuterSidebar) {
    lines.push(`${BASE}</SidebarProvider>`);
  }

  // -- Fragment close --
  if (needsFragment) lines.push(`${BASE}</>`);

  lines.push("  );");
  lines.push("}");

  return lines.join("\n");
}
