var e=`import { buildComponentJsx, collectComponentImports, collectIconImports } from "./buildComponentJsxText";
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
  /** When true, emit actual component JSX instead of {/* ComponentName *\\/} comments */
  includeComponents?: boolean;
  /** When true, outerSidebarStart uses SidebarTrigger-based icon navigation */
  iconNavStart?: boolean;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function itemNames(items: ContentItem[]): string {
  return items.map((i) => i.component).join(", ");
}

function jsxComment(text: string): string {
  return \`{/* \${text} */}\`;
}

/** align → style property string (used for inner wrapper div) */
function marginInlineProp(align: AlignValue): string {
  // center: both auto, end: start auto, start: end auto
  if (align === "center") return \`marginInline: "auto"\`;
  if (align === "end") return \`marginInlineStart: "auto"\`;
  return \`marginInlineEnd: "auto"\`;
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
    parts.push(\`maxWidth="\${key}"\`);
  }
  if (contentAlign !== "center") parts.push(\`align="\${contentAlign}"\`);
  return parts.length > 0 ? \` \${parts.join(" ")}\` : "";
}

/** Returns the JSX-ready style expression: {{ maxWidth: "...", ... }} */
function buildInnerWrapperStyleExpr(settings: AreaSettings): string {
  const { innerWidth, innerAlign } = settings.sizing;
  return \`{{ maxWidth: "\${innerWidth}", width: "100%", \${marginInlineProp(innerAlign)} }}\`;
}

function buildPaneOpenTag(settings: PaneSettings, variant: string, isEnd: boolean): string {
  const parts: string[] = [];
  if (isEnd) parts.push(\`position="end"\`);
  parts.push(\`width="\${settings.paneWidth}"\`);
  if (settings.resizable) {
    parts.push("resizable");
    // maxWidth / minWidth are only meaningful when resizable (JSDoc: "when resizable")
    if (settings.maxWidth && settings.maxWidth !== "xLarge") parts.push(\`maxWidth="\${settings.maxWidth}"\`);
  }
  if (variant !== "plain") parts.push(\`variant="\${variant}"\`);
  return \`<PageLayoutPane \${parts.join(" ")}>\`;
}

/**
 * Builds the open tag for the outer sidebar (<Sidebar>) per Aegis official API.
 * Aegis defaults: behavior="overlay", collapsible="icon", width="medium", variant="plain"
 */
function buildOuterSidebarOpenTag(settings: SidebarSettings, variant: SidebarStyle, isEnd: boolean): string {
  const parts: string[] = [];
  if (isEnd) parts.push(\`side="inline-end"\`);
  // Include non-default props only
  if (settings.behavior !== "overlay") parts.push(\`behavior="\${settings.behavior}"\`);
  if (settings.collapsible !== "icon") parts.push(\`collapsible="\${settings.collapsible}"\`);
  if (settings.width !== "medium") parts.push(\`width="\${settings.width}"\`);
  if (settings.resizable) {
    parts.push("resizable");
    if (settings.minWidth !== "small") parts.push(\`minWidth="\${settings.minWidth}"\`);
    if (settings.maxWidth !== "xLarge") parts.push(\`maxWidth="\${settings.maxWidth}"\`);
  }
  if (variant !== "plain") parts.push(\`variant="\${variant}"\`);
  return \`<Sidebar \${parts.join(" ")}>\`;
}

function buildInnerSidebarOpenTag(isEnd: boolean): string {
  return isEnd ? \`<PageLayoutSidebar position="end">\` : \`<PageLayoutSidebar>\`;
}

/**
 * Render a list of content items as either JSX comments (placeholder) or actual component JSX.
 * Returns null when the items array is empty.
 */
function renderItems(items: ContentItem[], childIndent: string, includeComponents: boolean): string | null {
  if (items.length === 0) return null;
  if (!includeComponents) {
    const names = itemNames(items);
    return names ? \`\${childIndent}\${jsxComment(names)}\` : null;
  }
  return items.map((item) => buildComponentJsx(item, childIndent)).join("\\n");
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
  includeComponents = false,
  iconNavStart = false,
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
    // SidebarHeader is needed when any header toggle is on, OR when iconNavStart forces it on outerSidebarStart
    if (layout.outerSidebarStartHeader || layout.outerSidebarEndHeader || (hasOuterSidebarStart && iconNavStart))
      imports.push("SidebarHeader");
    if (layout.outerSidebarStartFooter || layout.outerSidebarEndFooter) imports.push("SidebarFooter");
    if (hasOuterSidebarStart && iconNavStart) {
      imports.push(
        "Icon",
        "SidebarNavigation",
        "SidebarNavigationItem",
        "SidebarNavigationSubTrigger",
        "SidebarTrigger",
      );
    }
  }

  // When includeComponents is on, collect all Add Content items to determine additional imports
  const allContentItems: ContentItem[] = includeComponents ? Object.values(contentAreaItems).flat() : [];
  const componentImports = includeComponents ? collectComponentImports(allContentItems) : [];
  const iconImports = includeComponents ? collectIconImports() : [];
  // Always include LfHome for the icon nav SidebarNavigationSubTrigger example
  if (hasOuterSidebarStart && iconNavStart && !iconImports.includes("LfHome")) {
    iconImports.push("LfHome");
  }

  // Merge component imports into the PageLayout import list (all from @legalforce/aegis-react)
  for (const ci of componentImports) {
    if (!imports.includes(ci)) imports.push(ci);
  }
  imports.sort();

  // -- Build lines --
  const lines: string[] = [];

  lines.push(\`import {\\n\${imports.map((i) => \`  \${i},\`).join("\\n")}\\n} from "@legalforce/aegis-react";\`);

  if (iconImports.length > 0) {
    lines.push(\`import {\\n\${iconImports.map((i) => \`  \${i},\`).join("\\n")}\\n} from "@legalforce/aegis-icons";\`);
  }
  lines.push("");
  lines.push("export default function MyPage() {");
  lines.push("  return (");

  // Indentation helpers
  const BASE = "    "; // 4 spaces (inside \`return (\`)
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
  const pl2 = \`\${pl1}  \`; // content inside those children
  const pl3 = \`\${pl2}  \`; // one level deeper (e.g. inner wrapper)

  // -- Fragment open (no outer sidebar + globalHeader/Footer) --
  if (needsFragment) lines.push(\`\${BASE}<>\`);

  // -- Outer SidebarProvider open --
  // iconNavStart: no defaultOpen → sidebar starts collapsed (icon-only), SidebarTrigger opens it
  if (hasOuterSidebar) {
    const providerDefaultOpen = iconNavStart && hasOuterSidebarStart ? "" : " defaultOpen";
    lines.push(\`\${BASE}<SidebarProvider\${providerDefaultOpen}>\`);
  }

  // -- Outer Sidebar Start --
  if (hasOuterSidebarStart) {
    const ind = BASE + s;
    const ind2 = BASE + s + s;
    // iconNavStart forces collapsible="icon" (Aegis default) regardless of user settings,
    // so pass an overridden settings object. buildOuterSidebarOpenTag omits the prop when it equals "icon".
    const effectiveStartSettings = iconNavStart
      ? { ...sidebarStartSettings, collapsible: "icon" as const }
      : sidebarStartSettings;
    lines.push(\`\${ind}\${buildOuterSidebarOpenTag(effectiveStartSettings, globalStyling.sidebarStart, false)}\`);
    if (iconNavStart) {
      // iconNavStart: SidebarHeader is always rendered with SidebarTrigger regardless of
      // the outerSidebarStartHeader toggle, because the trigger must always be reachable.
      lines.push(\`\${ind2}<SidebarHeader>\`);
      lines.push(\`\${ind2}  <SidebarTrigger />\`);
      lines.push(\`\${ind2}</SidebarHeader>\`);
    } else if (layout.outerSidebarStartHeader) {
      lines.push(\`\${ind2}<SidebarHeader>\`);
      const rendered = renderItems(contentAreaItems.outerSidebarStartHeader, \`\${ind2}  \`, includeComponents);
      if (rendered) lines.push(rendered);
      lines.push(\`\${ind2}</SidebarHeader>\`);
    }
    lines.push(\`\${ind2}<SidebarBody>\`);
    if (iconNavStart) {
      lines.push(\`\${ind2}  <SidebarNavigation>\`);
      lines.push(\`\${ind2}    <SidebarNavigationItem>\`);
      lines.push(
        \`\${ind2}      <SidebarNavigationSubTrigger leading={<Icon><LfHome /></Icon>}>Label</SidebarNavigationSubTrigger>\`,
      );
      lines.push(\`\${ind2}    </SidebarNavigationItem>\`);
      lines.push(\`\${ind2}  </SidebarNavigation>\`);
    } else {
      const startBodyRendered = renderItems(contentAreaItems.outerSidebarStartBody, \`\${ind2}  \`, includeComponents);
      if (startBodyRendered) lines.push(startBodyRendered);
    }
    lines.push(\`\${ind2}</SidebarBody>\`);
    if (layout.outerSidebarStartFooter) {
      lines.push(\`\${ind2}<SidebarFooter>\`);
      const rendered = renderItems(contentAreaItems.outerSidebarStartFooter, \`\${ind2}  \`, includeComponents);
      if (rendered) lines.push(rendered);
      lines.push(\`\${ind2}</SidebarFooter>\`);
    }
    lines.push(\`\${ind}</Sidebar>\`);
  }

  // -- Outer SidebarInset open (wraps the inner content area) --
  if (hasOuterSidebar) {
    lines.push(\`\${BASE + s}<SidebarInset>\`);
  }

  // -- Inner SidebarProvider (both outer sidebars case) --
  if (hasBothOuterSidebars) {
    lines.push(\`\${BASE + s + s}<SidebarProvider defaultOpen>\`);
    lines.push(\`\${BASE + s + s + s}<SidebarInset>\`);
  }

  // -- Global Header (outside PageLayout) --
  if (layout.globalHeader) {
    const bordered = globalStyling.headerBorder ? " bordered" : "";
    lines.push(\`\${contentRoot}<Header\${bordered}>\`);
    const headerRendered = renderItems(contentAreaItems.globalHeader, \`\${contentRoot}  \`, includeComponents);
    if (headerRendered) lines.push(headerRendered);
    lines.push(\`\${contentRoot}</Header>\`);
  }

  // -- PageLayout open --
  const plVariant = globalStyling.pageLayout !== "plain" ? \` variant="\${globalStyling.pageLayout}"\` : "";
  lines.push(\`\${contentRoot}<PageLayout\${plVariant}>\`);

  // ----- Inner Sidebar Start -----
  if (layout.innerSidebarStart) {
    lines.push(\`\${pl1}\${buildInnerSidebarOpenTag(false)}\`);
    if (includeComponents) {
      const rendered = renderItems(contentAreaItems.innerSidebarStart, pl2, includeComponents);
      if (rendered) lines.push(rendered);
    } else {
      const names = itemNames(contentAreaItems.innerSidebarStart);
      lines.push(\`\${pl2}\${jsxComment(\`SideNavigation\${names ? \`: \${names}\` : ""}\`)}\`);
    }
    lines.push(\`\${pl1}</PageLayoutSidebar>\`);
  }

  // ----- Pane Start -----
  if (layout.paneStart) {
    lines.push(\`\${pl1}\${buildPaneOpenTag(paneStartSettings, globalStyling.paneStart, false)}\`);
    if (layout.paneStartHeader) {
      lines.push(\`\${pl2}<PageLayoutHeader>\`);
      const rendered = renderItems(contentAreaItems.paneStartHeader, pl3, includeComponents);
      if (rendered) lines.push(rendered);
      lines.push(\`\${pl2}</PageLayoutHeader>\`);
    }
    lines.push(\`\${pl2}<PageLayoutBody>\`);
    const paneStartBodyRendered = renderItems(contentAreaItems.paneStartBody, pl3, includeComponents);
    if (paneStartBodyRendered) lines.push(paneStartBodyRendered);
    lines.push(\`\${pl2}</PageLayoutBody>\`);
    if (layout.paneStartFooter) {
      lines.push(\`\${pl2}<PageLayoutFooter>\`);
      const rendered = renderItems(contentAreaItems.paneStartFooter, pl3, includeComponents);
      if (rendered) lines.push(rendered);
      lines.push(\`\${pl2}</PageLayoutFooter>\`);
    }
    lines.push(\`\${pl1}</PageLayoutPane>\`);
  }

  // ----- PageLayoutContent -----
  const contentProps = buildContentProps(sizing.contentWidth, sizing.contentAlign);
  lines.push(\`\${pl1}<PageLayoutContent\${contentProps}>\`);

  const innerStyleExpr = sizing.innerWidthEnabled ? buildInnerWrapperStyleExpr(contentColumnSettings) : "";
  const useInnerAll = sizing.innerWidthEnabled && sizing.innerScope === "all";
  const useInnerBody = sizing.innerWidthEnabled;

  function emitContentSection(
    sectionTag: "PageLayoutHeader" | "PageLayoutBody" | "PageLayoutFooter",
    items: ContentItem[],
    useInner: boolean,
  ): void {
    lines.push(\`\${pl2}<\${sectionTag}>\`);
    if (useInner) {
      lines.push(\`\${pl3}<div style=\${innerStyleExpr}>\`);
      const rendered = renderItems(items, \`\${pl3}  \`, includeComponents);
      if (rendered) lines.push(rendered);
      lines.push(\`\${pl3}</div>\`);
    } else {
      const rendered = renderItems(items, pl3, includeComponents);
      if (rendered) lines.push(rendered);
    }
    lines.push(\`\${pl2}</\${sectionTag}>\`);
  }

  if (layout.contentHeader) {
    emitContentSection("PageLayoutHeader", contentAreaItems.contentHeader, useInnerAll);
  }
  emitContentSection("PageLayoutBody", contentAreaItems.contentBody, useInnerBody);
  if (layout.contentFooter) {
    emitContentSection("PageLayoutFooter", contentAreaItems.contentFooter, useInnerAll);
  }

  lines.push(\`\${pl1}</PageLayoutContent>\`);

  // ----- Pane End -----
  if (layout.paneEnd) {
    lines.push(\`\${pl1}\${buildPaneOpenTag(paneEndSettings, globalStyling.paneEnd, true)}\`);
    if (layout.paneEndHeader) {
      lines.push(\`\${pl2}<PageLayoutHeader>\`);
      const rendered = renderItems(contentAreaItems.paneEndHeader, pl3, includeComponents);
      if (rendered) lines.push(rendered);
      lines.push(\`\${pl2}</PageLayoutHeader>\`);
    }
    lines.push(\`\${pl2}<PageLayoutBody>\`);
    const paneEndBodyRendered = renderItems(contentAreaItems.paneEndBody, pl3, includeComponents);
    if (paneEndBodyRendered) lines.push(paneEndBodyRendered);
    lines.push(\`\${pl2}</PageLayoutBody>\`);
    if (layout.paneEndFooter) {
      lines.push(\`\${pl2}<PageLayoutFooter>\`);
      const rendered = renderItems(contentAreaItems.paneEndFooter, pl3, includeComponents);
      if (rendered) lines.push(rendered);
      lines.push(\`\${pl2}</PageLayoutFooter>\`);
    }
    lines.push(\`\${pl1}</PageLayoutPane>\`);
  }

  // ----- Inner Sidebar End -----
  if (layout.innerSidebarEnd) {
    lines.push(\`\${pl1}\${buildInnerSidebarOpenTag(true)}\`);
    if (includeComponents) {
      const rendered = renderItems(contentAreaItems.innerSidebarEnd, pl2, includeComponents);
      if (rendered) lines.push(rendered);
    } else {
      const names = itemNames(contentAreaItems.innerSidebarEnd);
      lines.push(\`\${pl2}\${jsxComment(\`SideNavigation\${names ? \`: \${names}\` : ""}\`)}\`);
    }
    lines.push(\`\${pl1}</PageLayoutSidebar>\`);
  }

  // PageLayout close
  lines.push(\`\${contentRoot}</PageLayout>\`);

  // -- Global Footer (outside PageLayout) --
  if (layout.globalFooter) {
    lines.push(\`\${contentRoot}<Footer>\`);
    const footerRendered = renderItems(contentAreaItems.globalFooter, \`\${contentRoot}  \`, includeComponents);
    if (footerRendered) lines.push(footerRendered);
    lines.push(\`\${contentRoot}</Footer>\`);
  }

  // -- Close inner wrappers for both-outer-sidebars case --
  if (hasBothOuterSidebars) {
    const indB = BASE + s + s + s;
    const indB2 = BASE + s + s + s + s;
    lines.push(\`\${indB}</SidebarInset>\`);
    // Outer Sidebar End (sibling of inner SidebarInset, inside inner SidebarProvider)
    lines.push(\`\${indB}\${buildOuterSidebarOpenTag(sidebarEndSettings, globalStyling.sidebarEnd, true)}\`);
    if (layout.outerSidebarEndHeader) {
      lines.push(\`\${indB2}<SidebarHeader>\`);
      const rendered = renderItems(contentAreaItems.outerSidebarEndHeader, \`\${indB2}  \`, includeComponents);
      if (rendered) lines.push(rendered);
      lines.push(\`\${indB2}</SidebarHeader>\`);
    }
    lines.push(\`\${indB2}<SidebarBody>\`);
    const bothEndBodyRendered = renderItems(contentAreaItems.outerSidebarEndBody, \`\${indB2}  \`, includeComponents);
    if (bothEndBodyRendered) lines.push(bothEndBodyRendered);
    lines.push(\`\${indB2}</SidebarBody>\`);
    if (layout.outerSidebarEndFooter) {
      lines.push(\`\${indB2}<SidebarFooter>\`);
      const rendered = renderItems(contentAreaItems.outerSidebarEndFooter, \`\${indB2}  \`, includeComponents);
      if (rendered) lines.push(rendered);
      lines.push(\`\${indB2}</SidebarFooter>\`);
    }
    lines.push(\`\${indB}</Sidebar>\`);
    lines.push(\`\${BASE + s + s}</SidebarProvider>\`);
  }

  // -- Outer SidebarInset close --
  if (hasOuterSidebar) {
    lines.push(\`\${BASE + s}</SidebarInset>\`);
  }

  // -- Outer Sidebar End (end-only case: sibling of SidebarInset, inside outer SidebarProvider) --
  if (hasOuterSidebarEnd && !hasBothOuterSidebars) {
    const indE = BASE + s;
    const indE2 = BASE + s + s;
    lines.push(\`\${indE}\${buildOuterSidebarOpenTag(sidebarEndSettings, globalStyling.sidebarEnd, true)}\`);
    if (layout.outerSidebarEndHeader) {
      lines.push(\`\${indE2}<SidebarHeader>\`);
      const rendered = renderItems(contentAreaItems.outerSidebarEndHeader, \`\${indE2}  \`, includeComponents);
      if (rendered) lines.push(rendered);
      lines.push(\`\${indE2}</SidebarHeader>\`);
    }
    lines.push(\`\${indE2}<SidebarBody>\`);
    const endOnlyBodyRendered = renderItems(contentAreaItems.outerSidebarEndBody, \`\${indE2}  \`, includeComponents);
    if (endOnlyBodyRendered) lines.push(endOnlyBodyRendered);
    lines.push(\`\${indE2}</SidebarBody>\`);
    if (layout.outerSidebarEndFooter) {
      lines.push(\`\${indE2}<SidebarFooter>\`);
      const rendered = renderItems(contentAreaItems.outerSidebarEndFooter, \`\${indE2}  \`, includeComponents);
      if (rendered) lines.push(rendered);
      lines.push(\`\${indE2}</SidebarFooter>\`);
    }
    lines.push(\`\${indE}</Sidebar>\`);
  }

  // -- Outer SidebarProvider close --
  if (hasOuterSidebar) {
    lines.push(\`\${BASE}</SidebarProvider>\`);
  }

  // -- Fragment close --
  if (needsFragment) lines.push(\`\${BASE}</>\`);

  lines.push("  );");
  lines.push("}");

  return lines.join("\\n");
}
`;export{e as default};