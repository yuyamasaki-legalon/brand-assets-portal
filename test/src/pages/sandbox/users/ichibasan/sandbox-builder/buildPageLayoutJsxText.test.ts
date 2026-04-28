import { describe, expect, it } from "vitest";
import { buildPageLayoutJsxText } from "./buildPageLayoutJsxText";
import type { ContentArea, LayoutKey } from "./types";
import type { ContentItem } from "./views/AddContentView/types";
import {
  DEFAULT_AREA_SETTINGS,
  DEFAULT_GLOBAL_STYLING,
  DEFAULT_PANE_SETTINGS,
  DEFAULT_SIDEBAR_SETTINGS,
} from "./views/SizingAndStylingView/types";

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

const OFF_LAYOUT: Record<LayoutKey, boolean> = {
  outerSidebarStart: false,
  outerSidebarStartHeader: false,
  outerSidebarStartFooter: false,
  outerSidebarEnd: false,
  outerSidebarEndHeader: false,
  outerSidebarEndFooter: false,
  globalHeader: false,
  globalFooter: false,
  contentHeader: false,
  contentFooter: false,
  paneStart: false,
  paneStartHeader: false,
  paneStartFooter: false,
  paneEnd: false,
  paneEndHeader: false,
  paneEndFooter: false,
  innerSidebarStart: false,
  innerSidebarEnd: false,
};

const EMPTY_ITEMS: Record<ContentArea, ContentItem[]> = {
  globalHeader: [],
  globalFooter: [],
  contentHeader: [],
  contentBody: [],
  contentFooter: [],
  paneStartHeader: [],
  paneStartBody: [],
  paneStartFooter: [],
  paneEndHeader: [],
  paneEndBody: [],
  paneEndFooter: [],
  outerSidebarStartHeader: [],
  outerSidebarStartBody: [],
  outerSidebarStartFooter: [],
  outerSidebarEndHeader: [],
  outerSidebarEndBody: [],
  outerSidebarEndFooter: [],
  innerSidebarStart: [],
  innerSidebarEnd: [],
};

function gen(
  overrides: Partial<Record<LayoutKey, boolean>>,
  itemOverrides: Partial<Record<ContentArea, ContentItem[]>> = {},
) {
  return buildPageLayoutJsxText({
    layout: { ...OFF_LAYOUT, ...overrides },
    contentAreaItems: { ...EMPTY_ITEMS, ...itemOverrides },
    paneStartSettings: DEFAULT_PANE_SETTINGS,
    paneEndSettings: DEFAULT_PANE_SETTINGS,
    sidebarStartSettings: DEFAULT_SIDEBAR_SETTINGS,
    sidebarEndSettings: DEFAULT_SIDEBAR_SETTINGS,
    contentColumnSettings: DEFAULT_AREA_SETTINGS,
    globalStyling: DEFAULT_GLOBAL_STYLING,
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("buildPageLayoutJsxText", () => {
  describe("paneEnd", () => {
    it('paneEnd に position="end" が付く', () => {
      const code = gen({ paneEnd: true });
      expect(code).toContain(`position="end"`);
      // paneStart は position prop なし
      const codeStart = gen({ paneStart: true });
      expect(codeStart).not.toMatch(/PageLayoutPane[^>]*position/);
    });
  });

  describe("outerSidebarEnd", () => {
    it('outerSidebarEnd の Sidebar に side="inline-end" が付く', () => {
      const code = gen({ outerSidebarEnd: true });
      expect(code).toContain(`side="inline-end"`);
      expect(code).toContain("<Sidebar ");
      // SidebarProvider / SidebarInset でラップされる
      expect(code).toContain("<SidebarProvider");
      expect(code).toContain("<SidebarInset>");
    });

    it('outerSidebarStart の Sidebar に side="inline-start" が付き position prop はない', () => {
      const code = gen({ outerSidebarStart: true });
      expect(code).toContain(`side="inline-start"`);
      expect(code).toContain("<Sidebar ");
      // position="end" は含まれない
      expect(code).not.toContain(`position="end"`);
    });
  });

  describe("React type import", () => {
    it("outer sidebar がある場合も import type React を出力しない", () => {
      const code = gen({ outerSidebarStart: true });
      expect(code).not.toContain(`import type React`);
    });

    it("outer sidebar がない場合は React import を出力しない", () => {
      const code = gen({});
      expect(code).not.toContain(`import type React`);
    });
  });

  describe("contentAlign", () => {
    it('center → marginInline: "auto"', () => {
      const code = buildPageLayoutJsxText({
        layout: OFF_LAYOUT,
        contentAreaItems: EMPTY_ITEMS,
        paneStartSettings: DEFAULT_PANE_SETTINGS,
        paneEndSettings: DEFAULT_PANE_SETTINGS,
        sidebarStartSettings: DEFAULT_SIDEBAR_SETTINGS,
        sidebarEndSettings: DEFAULT_SIDEBAR_SETTINGS,
        contentColumnSettings: {
          ...DEFAULT_AREA_SETTINGS,
          sizing: {
            ...DEFAULT_AREA_SETTINGS.sizing,
            contentWidth: "var(--aegis-layout-width-medium)",
            contentAlign: "center",
          },
        },
        globalStyling: DEFAULT_GLOBAL_STYLING,
      });
      expect(code).toContain(`marginInline: "auto"`);
    });

    it('start → marginInlineEnd: "auto"', () => {
      const code = buildPageLayoutJsxText({
        layout: OFF_LAYOUT,
        contentAreaItems: EMPTY_ITEMS,
        paneStartSettings: DEFAULT_PANE_SETTINGS,
        paneEndSettings: DEFAULT_PANE_SETTINGS,
        sidebarStartSettings: DEFAULT_SIDEBAR_SETTINGS,
        sidebarEndSettings: DEFAULT_SIDEBAR_SETTINGS,
        contentColumnSettings: {
          ...DEFAULT_AREA_SETTINGS,
          sizing: {
            ...DEFAULT_AREA_SETTINGS.sizing,
            contentWidth: "var(--aegis-layout-width-medium)",
            contentAlign: "start",
          },
        },
        globalStyling: DEFAULT_GLOBAL_STYLING,
      });
      expect(code).toContain(`marginInlineEnd: "auto"`);
      expect(code).not.toContain(`marginInlineStart`);
    });

    it('end → marginInlineStart: "auto"', () => {
      const code = buildPageLayoutJsxText({
        layout: OFF_LAYOUT,
        contentAreaItems: EMPTY_ITEMS,
        paneStartSettings: DEFAULT_PANE_SETTINGS,
        paneEndSettings: DEFAULT_PANE_SETTINGS,
        sidebarStartSettings: DEFAULT_SIDEBAR_SETTINGS,
        sidebarEndSettings: DEFAULT_SIDEBAR_SETTINGS,
        contentColumnSettings: {
          ...DEFAULT_AREA_SETTINGS,
          sizing: {
            ...DEFAULT_AREA_SETTINGS.sizing,
            contentWidth: "var(--aegis-layout-width-medium)",
            contentAlign: "end",
          },
        },
        globalStyling: DEFAULT_GLOBAL_STYLING,
      });
      expect(code).toContain(`marginInlineStart: "auto"`);
      expect(code).not.toContain(`marginInlineEnd`);
    });

    it("contentWidth が none のとき style prop を出力しない", () => {
      const code = gen({});
      // maxWidth が出力されないこと
      expect(code).not.toContain("maxWidth");
    });
  });

  describe("inner wrapper width", () => {
    it("innerWidthEnabled: true のとき body に div が出る", () => {
      const code = buildPageLayoutJsxText({
        layout: OFF_LAYOUT,
        contentAreaItems: EMPTY_ITEMS,
        paneStartSettings: DEFAULT_PANE_SETTINGS,
        paneEndSettings: DEFAULT_PANE_SETTINGS,
        sidebarStartSettings: DEFAULT_SIDEBAR_SETTINGS,
        sidebarEndSettings: DEFAULT_SIDEBAR_SETTINGS,
        contentColumnSettings: {
          ...DEFAULT_AREA_SETTINGS,
          sizing: {
            ...DEFAULT_AREA_SETTINGS.sizing,
            innerWidthEnabled: true,
            innerWidth: "var(--aegis-layout-width-medium)",
            innerAlign: "center",
            innerScope: "body",
          },
        },
        globalStyling: DEFAULT_GLOBAL_STYLING,
      });
      expect(code).toContain("<div style=");
    });

    it("innerWidthEnabled: false のとき div が出ない", () => {
      const code = gen({});
      expect(code).not.toContain("<div style=");
    });
  });

  describe("innerSidebar", () => {
    it("innerSidebarStart が有効のとき PageLayoutSidebar が PageLayout 内に出る", () => {
      const code = gen({ innerSidebarStart: true });
      expect(code).toContain("<PageLayoutSidebar>");
      // position="end" は付かない
      expect(code).not.toContain(`position="end"`);
    });

    it('innerSidebarEnd が有効のとき PageLayoutSidebar position="end" が出る', () => {
      const code = gen({ innerSidebarEnd: true });
      expect(code).toContain(`<PageLayoutSidebar position="end">`);
    });
  });

  describe("header/footer are outside PageLayout", () => {
    it("globalHeader がある場合 <> フラグメントで包まれる", () => {
      const code = gen({ globalHeader: true });
      expect(code).toContain("<>");
      expect(code).toContain("</>");
    });

    it("globalHeader がない場合はフラグメントなし", () => {
      const code = gen({});
      expect(code).not.toContain("<>");
    });

    it("<Header> は <PageLayout> の前に出力される", () => {
      const code = gen({ globalHeader: true });
      const headerPos = code.indexOf("<Header");
      const pageLayoutPos = code.indexOf("<PageLayout");
      expect(headerPos).toBeLessThan(pageLayoutPos);
    });

    it("<Footer> は </PageLayout> の後に出力される", () => {
      const code = gen({ globalFooter: true });
      const footerPos = code.indexOf("<Footer");
      const closePageLayoutPos = code.indexOf("</PageLayout>");
      expect(footerPos).toBeGreaterThan(closePageLayoutPos);
    });
  });

  describe("content items in comments", () => {
    it("paneStartBody のアイテムがコメントに出る", () => {
      const code = gen(
        { paneStart: true },
        {
          paneStartBody: [
            { id: "1", component: "Button" },
            { id: "2", component: "Badge" },
          ],
        },
      );
      expect(code).toContain("{/* Button, Badge */}");
    });

    it("globalHeader のスロット付きアイテムが start/end で出る", () => {
      const code = gen(
        { globalHeader: true },
        {
          globalHeader: [
            { id: "1", component: "Button", slot: "start" },
            { id: "2", component: "Badge", slot: "end" },
          ],
        },
      );
      expect(code).toContain("start: Button | end: Badge");
    });
  });
});
