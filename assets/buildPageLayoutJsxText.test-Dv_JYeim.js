var e=`import { describe, expect, it } from "vitest";
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
      expect(code).toContain(\`position="end"\`);
      // paneStart は position prop なし
      const codeStart = gen({ paneStart: true });
      expect(codeStart).not.toMatch(/PageLayoutPane[^>]*position/);
    });
  });

  describe("outerSidebarEnd", () => {
    it('outerSidebarEnd の Sidebar に side="inline-end" が付く', () => {
      const code = gen({ outerSidebarEnd: true });
      expect(code).toContain(\`side="inline-end"\`);
      expect(code).toContain("<Sidebar ");
      // SidebarProvider / SidebarInset でラップされる
      expect(code).toContain("<SidebarProvider");
      expect(code).toContain("<SidebarInset>");
    });

    it("outerSidebarStart の Sidebar に side prop なし（Aegis default = inline-start なので省略）", () => {
      const code = gen({ outerSidebarStart: true });
      // side="inline-start" は Aegis のデフォルトなので省略される
      expect(code).not.toContain(\`side="inline-start"\`);
      expect(code).toContain("<Sidebar ");
      // position="end" は含まれない
      expect(code).not.toContain(\`position="end"\`);
    });
  });

  describe("React type import", () => {
    it("outer sidebar がある場合も import type React を出力しない", () => {
      const code = gen({ outerSidebarStart: true });
      expect(code).not.toContain(\`import type React\`);
    });

    it("outer sidebar がない場合は React import を出力しない", () => {
      const code = gen({});
      expect(code).not.toContain(\`import type React\`);
    });
  });

  describe("contentAlign", () => {
    it("center → maxWidth が出て align prop は出ない（center は Aegis default）", () => {
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
      expect(code).toContain(\`maxWidth="medium"\`);
      // center は Aegis の default なので align prop は出ない
      expect(code).not.toContain(\`align=\`);
    });

    it('start → align="start" が出る', () => {
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
      expect(code).toContain(\`align="start"\`);
      expect(code).not.toContain(\`align="end"\`);
    });

    it('end → align="end" が出る', () => {
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
      expect(code).toContain(\`align="end"\`);
      expect(code).not.toContain(\`align="start"\`);
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
      expect(code).not.toContain(\`position="end"\`);
    });

    it('innerSidebarEnd が有効のとき PageLayoutSidebar position="end" が出る', () => {
      const code = gen({ innerSidebarEnd: true });
      expect(code).toContain(\`<PageLayoutSidebar position="end">\`);
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

    it("globalHeader のアイテムは slot 情報なしでコンポーネント名のみコメントに出る", () => {
      // comment モード仕様: slot 情報は出力しない。コンポーネント名のみ。
      const code = gen(
        { globalHeader: true },
        {
          globalHeader: [
            { id: "1", component: "Button", slot: "start" },
            { id: "2", component: "Badge", slot: "end" },
          ],
        },
      );
      expect(code).toContain("{/* Button, Badge */}");
      expect(code).not.toContain("start: Button");
      expect(code).not.toContain("end: Badge");
    });
  });

  describe("iconNavStart (SidebarTrigger-based icon navigation)", () => {
    function genIcon(overrides: Partial<Record<LayoutKey, boolean>>, iconNavStart: boolean) {
      return buildPageLayoutJsxText({
        layout: { ...OFF_LAYOUT, ...overrides },
        contentAreaItems: EMPTY_ITEMS,
        paneStartSettings: DEFAULT_PANE_SETTINGS,
        paneEndSettings: DEFAULT_PANE_SETTINGS,
        sidebarStartSettings: DEFAULT_SIDEBAR_SETTINGS,
        sidebarEndSettings: DEFAULT_SIDEBAR_SETTINGS,
        contentColumnSettings: DEFAULT_AREA_SETTINGS,
        globalStyling: DEFAULT_GLOBAL_STYLING,
        iconNavStart,
      });
    }

    it("iconNavStart=true: SidebarNavigation が SidebarBody 内に出力される", () => {
      const code = genIcon({ outerSidebarStart: true }, true);
      expect(code).toContain("<SidebarNavigation>");
      expect(code).toContain("<SidebarNavigationItem>");
      expect(code).toContain("<SidebarNavigationSubTrigger");
      expect(code).toContain("LfHome");
      expect(code).toContain("</SidebarNavigation>");
    });

    it("iconNavStart=true: SidebarNavigation / SidebarNavigationItem / SidebarNavigationSubTrigger / Icon が import に含まれる", () => {
      const code = genIcon({ outerSidebarStart: true }, true);
      expect(code).toContain("SidebarNavigation,");
      expect(code).toContain("SidebarNavigationItem,");
      expect(code).toContain("SidebarNavigationSubTrigger,");
      expect(code).toContain("Icon,");
    });

    it("iconNavStart=true: LfHome が @legalforce/aegis-icons から import される", () => {
      const code = genIcon({ outerSidebarStart: true }, true);
      expect(code).toContain(\`from "@legalforce/aegis-icons"\`);
      expect(code).toContain("LfHome,");
    });

    it("iconNavStart=true: SidebarTrigger が SidebarHeader 内に出力される", () => {
      const code = genIcon({ outerSidebarStart: true }, true);
      expect(code).toContain("<SidebarTrigger />");
      expect(code).toContain("<SidebarHeader>");
    });

    it("iconNavStart=true: SidebarTrigger が import に含まれる", () => {
      const code = genIcon({ outerSidebarStart: true }, true);
      expect(code).toContain("SidebarTrigger,");
    });

    it("iconNavStart=true: outerSidebarStartHeader=false でも SidebarHeader が出力される", () => {
      // outerSidebarStartHeader toggle が OFF でも SidebarTrigger のために forced render
      const code = genIcon({ outerSidebarStart: true, outerSidebarStartHeader: false }, true);
      expect(code).toContain("<SidebarHeader>");
      expect(code).toContain("<SidebarTrigger />");
    });

    it("iconNavStart=false のとき outerSidebarStart は通常出力 (SidebarNavigation/SidebarTrigger なし)", () => {
      const code = genIcon({ outerSidebarStart: true }, false);
      expect(code).not.toContain("SidebarNavigation");
      expect(code).not.toContain("SidebarTrigger");
    });

    it("outerSidebarEnd には iconNavStart は影響しない", () => {
      const codeWithIcon = genIcon({ outerSidebarEnd: true }, true);
      const codeWithout = gen({ outerSidebarEnd: true });
      // outerSidebarStart がない場合、iconNavStart=true でも同じ出力
      expect(codeWithIcon).toBe(codeWithout);
    });

    describe("SidebarProvider defaultOpen (closed-by-default)", () => {
      it("iconNavStart=true: SidebarProvider に defaultOpen が付かない（closed-by-default）", () => {
        const code = genIcon({ outerSidebarStart: true }, true);
        // <SidebarProvider> のみで <SidebarProvider defaultOpen> は出ない
        expect(code).toContain("<SidebarProvider>");
        expect(code).not.toContain("<SidebarProvider defaultOpen>");
      });

      it("iconNavStart=false: outerSidebarStart があるとき SidebarProvider defaultOpen が出る", () => {
        const code = genIcon({ outerSidebarStart: true }, false);
        expect(code).toContain("<SidebarProvider defaultOpen>");
      });

      it("iconNavStart=true: outerSidebarEnd のみのとき SidebarProvider defaultOpen が出る（start がないので影響しない）", () => {
        const code = genIcon({ outerSidebarEnd: true }, true);
        expect(code).toContain("<SidebarProvider defaultOpen>");
      });
    });

    describe("collapsible forced to icon", () => {
      it("iconNavStart=true: sidebarStartSettings.collapsible が offcanvas でも collapsible prop が出力されない（Aegis default=icon）", () => {
        const code = buildPageLayoutJsxText({
          layout: { ...OFF_LAYOUT, outerSidebarStart: true },
          contentAreaItems: EMPTY_ITEMS,
          paneStartSettings: DEFAULT_PANE_SETTINGS,
          paneEndSettings: DEFAULT_PANE_SETTINGS,
          sidebarStartSettings: { ...DEFAULT_SIDEBAR_SETTINGS, collapsible: "offcanvas" },
          sidebarEndSettings: DEFAULT_SIDEBAR_SETTINGS,
          contentColumnSettings: DEFAULT_AREA_SETTINGS,
          globalStyling: DEFAULT_GLOBAL_STYLING,
          iconNavStart: true,
        });
        // collapsible="icon" is Aegis default → omitted regardless of settings
        expect(code).not.toContain(\`collapsible=\`);
      });

      it("iconNavStart=false: sidebarStartSettings.collapsible が offcanvas のとき collapsible prop が出力される", () => {
        const code = buildPageLayoutJsxText({
          layout: { ...OFF_LAYOUT, outerSidebarStart: true },
          contentAreaItems: EMPTY_ITEMS,
          paneStartSettings: DEFAULT_PANE_SETTINGS,
          paneEndSettings: DEFAULT_PANE_SETTINGS,
          sidebarStartSettings: { ...DEFAULT_SIDEBAR_SETTINGS, collapsible: "offcanvas" },
          sidebarEndSettings: DEFAULT_SIDEBAR_SETTINGS,
          contentColumnSettings: DEFAULT_AREA_SETTINGS,
          globalStyling: DEFAULT_GLOBAL_STYLING,
          iconNavStart: false,
        });
        expect(code).toContain(\`collapsible="offcanvas"\`);
      });
    });

    describe("body / header content suppression", () => {
      it("iconNavStart=true: outerSidebarStartBody のアイテムは無視され SidebarNavigation で置換される", () => {
        const code = buildPageLayoutJsxText({
          layout: { ...OFF_LAYOUT, outerSidebarStart: true },
          contentAreaItems: {
            ...EMPTY_ITEMS,
            outerSidebarStartBody: [
              { id: "1", component: "Button" },
              { id: "2", component: "Badge" },
            ],
          },
          paneStartSettings: DEFAULT_PANE_SETTINGS,
          paneEndSettings: DEFAULT_PANE_SETTINGS,
          sidebarStartSettings: DEFAULT_SIDEBAR_SETTINGS,
          sidebarEndSettings: DEFAULT_SIDEBAR_SETTINGS,
          contentColumnSettings: DEFAULT_AREA_SETTINGS,
          globalStyling: DEFAULT_GLOBAL_STYLING,
          iconNavStart: true,
        });
        // コンテンツアイテムのコメントは出ない
        expect(code).not.toContain("{/* Button, Badge */}");
        // SidebarNavigation scaffold が出る
        expect(code).toContain("<SidebarNavigation>");
      });

      it("iconNavStart=true: outerSidebarStartHeader のアイテムは無視され SidebarTrigger のみ出力される", () => {
        const code = buildPageLayoutJsxText({
          layout: { ...OFF_LAYOUT, outerSidebarStart: true, outerSidebarStartHeader: true },
          contentAreaItems: {
            ...EMPTY_ITEMS,
            outerSidebarStartHeader: [{ id: "1", component: "Button" }],
          },
          paneStartSettings: DEFAULT_PANE_SETTINGS,
          paneEndSettings: DEFAULT_PANE_SETTINGS,
          sidebarStartSettings: DEFAULT_SIDEBAR_SETTINGS,
          sidebarEndSettings: DEFAULT_SIDEBAR_SETTINGS,
          contentColumnSettings: DEFAULT_AREA_SETTINGS,
          globalStyling: DEFAULT_GLOBAL_STYLING,
          iconNavStart: true,
        });
        // ヘッダーアイテムのコメントは出ない
        expect(code).not.toContain("{/* Button */}");
        // SidebarTrigger のみ
        expect(code).toContain("<SidebarTrigger />");
      });
    });

    it("iconNavStart=true: SidebarNavigationSubTrigger に leading prop と Label コンテンツが出力される", () => {
      const code = genIcon({ outerSidebarStart: true }, true);
      expect(code).toContain(\`leading={<Icon><LfHome /></Icon>}\`);
      expect(code).toContain(\`>Label<\`);
    });

    it("iconNavStart=true: outerSidebarStartFooter=true のとき SidebarFooter が出力される（footer は iconNavStart 非依存）", () => {
      const code = buildPageLayoutJsxText({
        layout: { ...OFF_LAYOUT, outerSidebarStart: true, outerSidebarStartFooter: true },
        contentAreaItems: {
          ...EMPTY_ITEMS,
          outerSidebarStartFooter: [{ id: "1", component: "Button" }],
        },
        paneStartSettings: DEFAULT_PANE_SETTINGS,
        paneEndSettings: DEFAULT_PANE_SETTINGS,
        sidebarStartSettings: DEFAULT_SIDEBAR_SETTINGS,
        sidebarEndSettings: DEFAULT_SIDEBAR_SETTINGS,
        contentColumnSettings: DEFAULT_AREA_SETTINGS,
        globalStyling: DEFAULT_GLOBAL_STYLING,
        iconNavStart: true,
      });
      expect(code).toContain("<SidebarFooter>");
      expect(code).toContain("{/* Button */}");
      expect(code).toContain("</SidebarFooter>");
    });

    describe("両サイドバー構成 (outerSidebarStart + outerSidebarEnd)", () => {
      it("iconNavStart=true: 外側 SidebarProvider は defaultOpen なし、内側は defaultOpen あり", () => {
        const code = genIcon({ outerSidebarStart: true, outerSidebarEnd: true }, true);
        // 外側 SidebarProvider: iconNavStart のため defaultOpen なし
        expect(code).toContain("<SidebarProvider>");
        // 内側 SidebarProvider (both sidebars case): 常に defaultOpen
        expect(code).toContain("<SidebarProvider defaultOpen>");
      });
    });

    it("iconNavStart=true + includeComponents=true + body items あり → icon-nav scaffold が優先される", () => {
      const code = buildPageLayoutJsxText({
        layout: { ...OFF_LAYOUT, outerSidebarStart: true },
        contentAreaItems: {
          ...EMPTY_ITEMS,
          outerSidebarStartBody: [{ id: "1", component: "Button" }],
        },
        paneStartSettings: DEFAULT_PANE_SETTINGS,
        paneEndSettings: DEFAULT_PANE_SETTINGS,
        sidebarStartSettings: DEFAULT_SIDEBAR_SETTINGS,
        sidebarEndSettings: DEFAULT_SIDEBAR_SETTINGS,
        contentColumnSettings: DEFAULT_AREA_SETTINGS,
        globalStyling: DEFAULT_GLOBAL_STYLING,
        iconNavStart: true,
        includeComponents: true,
      });
      // includeComponents=true でも Button の JSX は出ない
      expect(code).not.toContain("<Button");
      // icon-nav scaffold が優先される
      expect(code).toContain("<SidebarNavigation>");
      expect(code).toContain("<SidebarNavigationItem>");
      expect(code).toContain("<SidebarNavigationSubTrigger");
    });
  });
});
`;export{e as default};