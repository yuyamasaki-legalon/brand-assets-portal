var e=`import { describe, expect, it } from "vitest";
import { buildComponentJsx, collectComponentImports, collectIconImports } from "./buildComponentJsxText";
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

function make(component: ContentItem["component"], props?: Record<string, string>): ContentItem {
  return { id: "test", component, props };
}

const INDENT = "    ";

// ---------------------------------------------------------------------------
// Tier 1: Tabs
// ---------------------------------------------------------------------------

describe("Tabs", () => {
  it("flat API を使用する", () => {
    const jsx = buildComponentJsx(make("Tabs"), INDENT);
    expect(jsx).toContain("<Tabs defaultValue=");
    expect(jsx).toContain("<TabsList>");
    expect(jsx).toContain("<TabsTrigger value=");
    expect(jsx).toContain("<TabsContent value=");
  });

  it("deprecated compound が出ない", () => {
    const jsx = buildComponentJsx(make("Tabs"), INDENT);
    expect(jsx).not.toContain("Tab.Group");
    expect(jsx).not.toContain("Tab.List");
    expect(jsx).not.toContain("Tab.Panels");
    expect(jsx).not.toContain("Tab.Panel");
  });

  it("items prop で件数が変わる", () => {
    const jsx = buildComponentJsx(make("Tabs", { items: "2" }), INDENT);
    expect(jsx).toContain(\`value="1"\`);
    expect(jsx).toContain(\`value="2"\`);
    expect(jsx).not.toContain(\`value="3"\`);
  });

  it("collectComponentImports が flat API の import を返す", () => {
    const imports = collectComponentImports([make("Tabs")]);
    expect(imports).toContain("Tabs");
    expect(imports).toContain("TabsList");
    expect(imports).toContain("TabsTrigger");
    expect(imports).toContain("TabsContent");
  });

  it("collectComponentImports にドット記法が含まれない", () => {
    const imports = collectComponentImports([make("Tabs")]);
    expect(imports.every((s) => !s.includes("."))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Tier 1: Avatar
// ---------------------------------------------------------------------------

describe("Avatar", () => {
  it("name prop が出る", () => {
    const jsx = buildComponentJsx(make("Avatar"), INDENT);
    expect(jsx).toContain('name="');
  });

  it("children 形式が出ない", () => {
    const jsx = buildComponentJsx(make("Avatar"), INDENT);
    // <Avatar>AB</Avatar> 形式を禁止
    expect(jsx).not.toMatch(/<Avatar>[^/]/);
  });

  it("text prop が name に反映される", () => {
    const jsx = buildComponentJsx(make("Avatar", { text: "KI" }), INDENT);
    expect(jsx).toContain('name="KI"');
  });
});

// ---------------------------------------------------------------------------
// Tier 1: AvatarGroup
// ---------------------------------------------------------------------------

describe("AvatarGroup", () => {
  it("内部の Avatar が name prop 形式で出る", () => {
    const jsx = buildComponentJsx(make("AvatarGroup"), INDENT);
    // name= が含まれること
    expect(jsx).toMatch(/name="[A-Z]{2}"/);
  });

  it("内部の Avatar が children 形式で出ない", () => {
    const jsx = buildComponentJsx(make("AvatarGroup"), INDENT);
    // <Avatar>AB</Avatar> のような children 形式を禁止
    expect(jsx).not.toMatch(/<Avatar>[A-Z]/);
  });

  it("AvatarGroup + Avatar が import される", () => {
    const imports = collectComponentImports([make("AvatarGroup")]);
    expect(imports).toContain("AvatarGroup");
    expect(imports).toContain("Avatar");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: EmptyState
// ---------------------------------------------------------------------------

describe("EmptyState", () => {
  it("title prop が出る", () => {
    const jsx = buildComponentJsx(make("EmptyState"), INDENT);
    expect(jsx).toContain('title="');
  });

  it("titleText prop が title 属性に反映される（fieldConfig の正しい key）", () => {
    // fieldConfig key is "titleText" — "title" is a checkbox boolean, not the text
    const jsx = buildComponentJsx(make("EmptyState", { titleText: "Nothing here" }), INDENT);
    expect(jsx).toContain('title="Nothing here"');
  });

  it("title='true'（checkbox boolean）が title 属性に混入しない（バグ修正確認）", () => {
    // Before fix: pv(p, "title") returned "true" (the checkbox value) → title="true"
    const jsx = buildComponentJsx(make("EmptyState", { title: "true" }), INDENT);
    expect(jsx).not.toContain('title="true"');
    // Should fall back to the default titleText
    expect(jsx).toContain('title="No items found"');
  });

  it("deprecated compound が出ない", () => {
    const jsx = buildComponentJsx(make("EmptyState"), INDENT);
    expect(jsx).not.toContain("EmptyState.Title");
    expect(jsx).not.toContain("EmptyState.Description");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: InformationCard
// ---------------------------------------------------------------------------

describe("InformationCard", () => {
  it("<InformationCardDescription> が出る", () => {
    const jsx = buildComponentJsx(make("InformationCard"), INDENT);
    expect(jsx).toContain("<InformationCardDescription");
  });

  it("deprecated compound が出ない", () => {
    const jsx = buildComponentJsx(make("InformationCard"), INDENT);
    expect(jsx).not.toContain("InformationCard.Description");
  });

  it("variant / size prop が出ない（デフォルト省略）", () => {
    const jsx = buildComponentJsx(make("InformationCard"), INDENT);
    expect(jsx).not.toContain("variant=");
    expect(jsx).not.toContain("<InformationCardDescription size=");
  });

  it("collectComponentImports に InformationCardDescription が含まれる", () => {
    const imports = collectComponentImports([make("InformationCard")]);
    expect(imports).toContain("InformationCardDescription");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: Accordion
// ---------------------------------------------------------------------------

describe("Accordion", () => {
  it("flat named exports が出る", () => {
    const jsx = buildComponentJsx(make("Accordion"), INDENT);
    expect(jsx).toContain("<AccordionItem>");
    expect(jsx).toContain("<AccordionButton>");
    expect(jsx).toContain("<AccordionPanel>");
  });

  it("collectComponentImports に flat exports が含まれる", () => {
    const imports = collectComponentImports([make("Accordion")]);
    expect(imports).toContain("AccordionItem");
    expect(imports).toContain("AccordionButton");
    expect(imports).toContain("AccordionPanel");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: ActionList
// ---------------------------------------------------------------------------

describe("ActionList", () => {
  it("ActionListItem + ActionListBody がセットで出る", () => {
    const jsx = buildComponentJsx(make("ActionList"), INDENT);
    expect(jsx).toContain("<ActionListItem>");
    expect(jsx).toContain("<ActionListBody>");
  });

  it("deprecated compound が出ない", () => {
    const jsx = buildComponentJsx(make("ActionList"), INDENT);
    expect(jsx).not.toContain("ActionList.Item");
    expect(jsx).not.toContain("ActionList.Body");
  });

  it("collectComponentImports に flat exports が含まれる", () => {
    const imports = collectComponentImports([make("ActionList")]);
    expect(imports).toContain("ActionListItem");
    expect(imports).toContain("ActionListBody");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: Card
// ---------------------------------------------------------------------------

describe("Card", () => {
  it("flat named exports が出る（header/body/footer すべて ON）", () => {
    const jsx = buildComponentJsx(make("Card", { header: "true", body: "true", footer: "true" }), INDENT);
    expect(jsx).toContain("<CardHeader>");
    expect(jsx).toContain("<CardBody>");
    expect(jsx).toContain("<CardFooter>");
  });

  it("deprecated compound が出ない", () => {
    const jsx = buildComponentJsx(make("Card", { header: "true", body: "true", footer: "true" }), INDENT);
    expect(jsx).not.toContain("Card.Header");
    expect(jsx).not.toContain("Card.Title");
    expect(jsx).not.toContain("Card.Body");
    expect(jsx).not.toContain("Card.Footer");
  });

  it("デフォルト（props なし）では CardBody が出る", () => {
    const jsx = buildComponentJsx(make("Card"), INDENT);
    expect(jsx).toContain("<CardBody>");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: ContentHeader
// ---------------------------------------------------------------------------

describe("ContentHeader", () => {
  it("ContentHeaderTitle が出る", () => {
    const jsx = buildComponentJsx(make("ContentHeader"), INDENT);
    expect(jsx).toContain("<ContentHeaderTitle>");
  });

  it("trailing ON のとき action={ が出る", () => {
    const jsx = buildComponentJsx(make("ContentHeader", { trailing: "true" }), INDENT);
    expect(jsx).toContain("action={");
  });

  it("deprecated compound が出ない", () => {
    const jsx = buildComponentJsx(make("ContentHeader", { trailing: "true" }), INDENT);
    expect(jsx).not.toContain("ContentHeader.Title");
    expect(jsx).not.toContain("ContentHeader.Action");
    expect(jsx).not.toContain("ContentHeader.Description");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: DescriptionList
// ---------------------------------------------------------------------------

describe("DescriptionList", () => {
  it("flat named exports が出る", () => {
    const jsx = buildComponentJsx(make("DescriptionList"), INDENT);
    expect(jsx).toContain("<DescriptionListItem>");
    expect(jsx).toContain("<DescriptionListTerm>");
    expect(jsx).toContain("<DescriptionListDetail>");
  });

  it("deprecated compound が出ない", () => {
    const jsx = buildComponentJsx(make("DescriptionList"), INDENT);
    expect(jsx).not.toContain("DescriptionList.Term");
    expect(jsx).not.toContain("DescriptionList.Detail");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: SegmentedControl
// ---------------------------------------------------------------------------

describe("SegmentedControl", () => {
  it(".Button + defaultIndex={0} が出る", () => {
    const jsx = buildComponentJsx(make("SegmentedControl"), INDENT);
    expect(jsx).toContain("SegmentedControl.Button");
    expect(jsx).toContain("defaultIndex={0}");
  });

  it("deprecated .Item が出ない", () => {
    const jsx = buildComponentJsx(make("SegmentedControl"), INDENT);
    expect(jsx).not.toContain("SegmentedControl.Item");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: CheckboxCard
// ---------------------------------------------------------------------------

describe("CheckboxCard", () => {
  it("children テキストが出る", () => {
    const jsx = buildComponentJsx(make("CheckboxCard", { label: "Option A" }), INDENT);
    expect(jsx).toContain("Option A");
  });

  it("value prop が出ない", () => {
    const jsx = buildComponentJsx(make("CheckboxCard", { value: "val1" }), INDENT);
    expect(jsx).not.toContain("value=");
  });

  it("deprecated .Label / .Description が出ない", () => {
    const jsx = buildComponentJsx(make("CheckboxCard"), INDENT);
    expect(jsx).not.toContain("CheckboxCard.Label");
    expect(jsx).not.toContain("CheckboxCard.Description");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: RadioCard
// ---------------------------------------------------------------------------

describe("RadioCard", () => {
  it("children テキストが出る", () => {
    const jsx = buildComponentJsx(make("RadioCard", { label: "Option B" }), INDENT);
    expect(jsx).toContain("Option B");
  });

  it("value prop が出ない", () => {
    const jsx = buildComponentJsx(make("RadioCard", { value: "val2" }), INDENT);
    expect(jsx).not.toContain("value=");
  });

  it("deprecated .Label / .Description が出ない", () => {
    const jsx = buildComponentJsx(make("RadioCard"), INDENT);
    expect(jsx).not.toContain("RadioCard.Label");
    expect(jsx).not.toContain("RadioCard.Description");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: SideNavigation
// ---------------------------------------------------------------------------

describe("SideNavigation", () => {
  it("SideNavigationGroup title= が出る", () => {
    const jsx = buildComponentJsx(make("SideNavigation"), INDENT);
    expect(jsx).toContain("SideNavigationGroup");
    expect(jsx).toContain("title=");
  });

  it("各アイテムに icon={ が出る", () => {
    const jsx = buildComponentJsx(make("SideNavigation"), INDENT);
    expect(jsx).toContain("icon={");
  });

  it("deprecated compound が出ない", () => {
    const jsx = buildComponentJsx(make("SideNavigation"), INDENT);
    expect(jsx).not.toContain("SideNavigation.Group");
    expect(jsx).not.toContain("SideNavigation.Item");
  });

  it("collectComponentImports に flat exports が含まれる", () => {
    const imports = collectComponentImports([make("SideNavigation")]);
    expect(imports).toContain("SideNavigationGroup");
    expect(imports).toContain("SideNavigationItem");
  });

  it("icon={LfMenu} 形式（component class 直接渡し）で出る", () => {
    const jsx = buildComponentJsx(make("SideNavigation"), INDENT);
    expect(jsx).toContain("icon={LfMenu}");
  });

  it("icon に <Icon> ラッパーが使われない", () => {
    const jsx = buildComponentJsx(make("SideNavigation"), INDENT);
    expect(jsx).not.toContain("<Icon><LfMenu /></Icon>");
  });

  it("Icon コンポーネントが collectComponentImports に含まれない", () => {
    const imports = collectComponentImports([make("SideNavigation")]);
    // icon は IconSource 形式で渡すため Icon wrapper 不要
    expect(imports).not.toContain("Icon");
  });

  it("groups prop でグループ数が変わる", () => {
    const jsx2 = buildComponentJsx(make("SideNavigation", { groups: "2" }), INDENT);
    const jsx4 = buildComponentJsx(make("SideNavigation", { groups: "4" }), INDENT);
    expect((jsx2.match(/<SideNavigationGroup/g) ?? []).length).toBe(2);
    expect((jsx4.match(/<SideNavigationGroup/g) ?? []).length).toBe(4);
  });

  it("collectIconImports に LfMenu が含まれる", () => {
    collectComponentImports([make("SideNavigation")]);
    const icons = collectIconImports();
    expect(icons).toContain("LfMenu");
  });
});

// ---------------------------------------------------------------------------
// SideNavigation: Plan B mapping (labels=グループ名, titles=|区切りアイテム)
// ---------------------------------------------------------------------------

describe("SideNavigation: Plan B mapping", () => {
  it("labels がグループ名に反映される", () => {
    const jsx = buildComponentJsx(
      make("SideNavigation", { labels: "メニュー,サブメニュー", titles: "ホーム,契約|レポート,分析" }),
      INDENT,
    );
    expect(jsx).toContain('title="メニュー"');
    expect(jsx).toContain('title="サブメニュー"');
  });

  it("titles の | 区切りでグループが分かれ、各グループのアイテムが出る", () => {
    const jsx = buildComponentJsx(
      make("SideNavigation", { labels: "G1,G2", titles: "ホーム,契約,設定|レポート,分析" }),
      INDENT,
    );
    expect(jsx).toContain("ホーム");
    expect(jsx).toContain("契約");
    expect(jsx).toContain("設定");
    expect(jsx).toContain("レポート");
    expect(jsx).toContain("分析");
    expect((jsx.match(/<SideNavigationGroup/g) ?? []).length).toBe(2);
    expect((jsx.match(/<SideNavigationItem/g) ?? []).length).toBe(5);
  });

  it("labels 数 > titles グループ数 → 余分な group は scaffold comment", () => {
    // labels has 3 groups, titles has only 2 pipe-groups → group 3 gets empty item list
    const jsx = buildComponentJsx(make("SideNavigation", { labels: "A,B,C", titles: "X,Y|P,Q" }), INDENT);
    expect((jsx.match(/<SideNavigationGroup/g) ?? []).length).toBe(3);
    expect(jsx).toContain('title="C"');
    expect(jsx).toContain("TODO: add SideNavigationItem");
  });

  it("titles グループ数 > labels 数 → 余分な group は 'Group N' フォールバック", () => {
    // titles has 3 groups, labels has only 1 → groups 2 and 3 get "Group N" name
    const jsx = buildComponentJsx(make("SideNavigation", { labels: "メニュー", titles: "A,B|C,D|E,F" }), INDENT);
    expect(jsx).toContain('title="メニュー"');
    expect(jsx).toContain('title="Group 2"');
    expect(jsx).toContain('title="Group 3"');
    expect((jsx.match(/<SideNavigationGroup/g) ?? []).length).toBe(3);
  });

  it("空のパイプセグメント → scaffold comment", () => {
    // e.g. "A,B||C,D" — middle group is empty
    const jsx = buildComponentJsx(make("SideNavigation", { labels: "G1,G2,G3", titles: "A,B||C,D" }), INDENT);
    expect(jsx).toContain("TODO: add SideNavigationItem");
    expect((jsx.match(/<SideNavigationGroup/g) ?? []).length).toBe(3);
  });

  it("labels も titles も未入力 → legacy groups スタッフが動く（groups=2 のとき 2 グループ）", () => {
    // No Plan B input → falls back to "groups" stepper behavior
    const jsx = buildComponentJsx(make("SideNavigation", { groups: "3" }), INDENT);
    expect((jsx.match(/<SideNavigationGroup/g) ?? []).length).toBe(3);
    // Generic scaffold: Item 1 / Item 2 (no Plan B items)
    expect(jsx).toContain("Item 1");
    expect(jsx).toContain("Item 2");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: TagPicker
// ---------------------------------------------------------------------------

describe("TagPicker", () => {
  it("options={[ が出る（options prop 形式）", () => {
    const jsx = buildComponentJsx(make("TagPicker"), INDENT);
    expect(jsx).toContain("options={[");
  });

  it("存在しない TagPicker.Option が出ない", () => {
    const jsx = buildComponentJsx(make("TagPicker"), INDENT);
    expect(jsx).not.toContain("TagPicker.Option");
  });

  it("children ベースの旧形式が出ない", () => {
    const jsx = buildComponentJsx(make("TagPicker"), INDENT);
    // <TagPicker> ... </TagPicker> の children 形式は使わない（自己閉じ or props のみ）
    expect(jsx).not.toMatch(/<TagPicker>\\s/);
  });

  it("FormControl ラッパーで包まれる", () => {
    const jsx = buildComponentJsx(make("TagPicker"), INDENT);
    expect(jsx).toContain("<FormControl>");
    expect(jsx).toContain("</FormControl>");
  });

  it("options フィールドの値が options 配列に反映される", () => {
    const jsx = buildComponentJsx(make("TagPicker", { options: "Red,Green,Blue" }), INDENT);
    expect(jsx).toContain('"Red"');
    expect(jsx).toContain('"Green"');
    expect(jsx).toContain('"Blue"');
  });

  it("fcLabel フィールドが FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("TagPicker", { fcLabel: "My Tags" }), INDENT);
    expect(jsx).toContain("My Tags");
  });

  it("collectComponentImports に TagPicker と FormControl が含まれる", () => {
    const imports = collectComponentImports([make("TagPicker")]);
    expect(imports).toContain("TagPicker");
    expect(imports).toContain("FormControl");
  });

  it("collectComponentImports にドット記法が含まれない", () => {
    const imports = collectComponentImports([make("TagPicker")]);
    expect(imports.every((s) => !s.includes("."))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Tier 1: Toolbar
// ---------------------------------------------------------------------------

describe("Toolbar", () => {
  it("ToolbarGroup（flat export）が出る", () => {
    const jsx = buildComponentJsx(make("Toolbar"), INDENT);
    expect(jsx).toContain("<ToolbarGroup>");
    expect(jsx).toContain("</ToolbarGroup>");
  });

  it("存在しない Toolbar.Group が出ない", () => {
    const jsx = buildComponentJsx(make("Toolbar"), INDENT);
    expect(jsx).not.toContain("Toolbar.Group");
  });

  it("deprecated Toolbar.Spacer が出ない", () => {
    const jsx = buildComponentJsx(make("Toolbar"), INDENT);
    expect(jsx).not.toContain("Toolbar.Spacer");
  });

  it("groups prop でグループ数が変わる", () => {
    const jsx1 = buildComponentJsx(make("Toolbar", { groups: "1" }), INDENT);
    const jsx3 = buildComponentJsx(make("Toolbar", { groups: "3" }), INDENT);
    expect((jsx1.match(/<ToolbarGroup>/g) ?? []).length).toBe(1);
    expect((jsx3.match(/<ToolbarGroup>/g) ?? []).length).toBe(3);
  });

  it("collectComponentImports に Toolbar と ToolbarGroup が含まれる", () => {
    const imports = collectComponentImports([make("Toolbar")]);
    expect(imports).toContain("Toolbar");
    expect(imports).toContain("ToolbarGroup");
    // デフォルト items は IconButton なので ToolbarSeparator/IconButton/Tooltip も含まれる
    expect(imports).toContain("IconButton");
    expect(imports).toContain("Tooltip");
  });

  it("collectComponentImports にドット記法が含まれない", () => {
    const imports = collectComponentImports([make("Toolbar")]);
    expect(imports.every((s) => !s.includes("."))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Tier 1: Timeline
// ---------------------------------------------------------------------------

describe("Timeline", () => {
  it("flat exports（TimelineItem / TimelineContent / TimelinePoint）が出る", () => {
    const jsx = buildComponentJsx(make("Timeline"), INDENT);
    expect(jsx).toContain("<TimelineItem>");
    expect(jsx).toContain("<TimelineContent>");
    expect(jsx).toContain("<TimelinePoint />");
  });

  it("存在しない Timeline.Title が出ない", () => {
    const jsx = buildComponentJsx(make("Timeline"), INDENT);
    expect(jsx).not.toContain("Timeline.Title");
  });

  it("deprecated Timeline.Item / Timeline.Content が出ない", () => {
    const jsx = buildComponentJsx(make("Timeline"), INDENT);
    expect(jsx).not.toContain("Timeline.Item");
    expect(jsx).not.toContain("Timeline.Content");
  });

  it("tagLabels prop がラベルに反映される", () => {
    const jsx = buildComponentJsx(make("Timeline", { tagLabels: "V0,V1,V2", items: "3" }), INDENT);
    expect(jsx).toContain("V0");
    expect(jsx).toContain("V1");
    expect(jsx).toContain("V2");
  });

  it("items prop で件数が変わる", () => {
    const jsx2 = buildComponentJsx(make("Timeline", { items: "2" }), INDENT);
    const jsx5 = buildComponentJsx(make("Timeline", { items: "5" }), INDENT);
    expect((jsx2.match(/<TimelineItem>/g) ?? []).length).toBe(2);
    expect((jsx5.match(/<TimelineItem>/g) ?? []).length).toBe(5);
  });

  it("collectComponentImports に flat exports が含まれる", () => {
    const imports = collectComponentImports([make("Timeline")]);
    expect(imports).toContain("Timeline");
    expect(imports).toContain("TimelineItem");
    expect(imports).toContain("TimelineContent");
    expect(imports).toContain("TimelinePoint");
  });

  it("collectComponentImports にドット記法が含まれない", () => {
    const imports = collectComponentImports([make("Timeline")]);
    expect(imports.every((s) => !s.includes("."))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Tier 2: Select
// ---------------------------------------------------------------------------

describe("Select", () => {
  it("options={[ が出る", () => {
    const jsx = buildComponentJsx(make("Select"), INDENT);
    expect(jsx).toContain("options={[");
  });

  it("HTML <option> が出ない", () => {
    const jsx = buildComponentJsx(make("Select"), INDENT);
    expect(jsx).not.toContain("<option");
  });

  it("placeholder= が出る", () => {
    const jsx = buildComponentJsx(make("Select"), INDENT);
    expect(jsx).toContain("placeholder=");
  });

  it("FormControl ラッパーで包まれる", () => {
    const jsx = buildComponentJsx(make("Select"), INDENT);
    expect(jsx).toContain("<FormControl>");
    expect(jsx).toContain("</FormControl>");
  });
});

// ---------------------------------------------------------------------------
// Tier 2: Combobox
// ---------------------------------------------------------------------------

describe("Combobox", () => {
  it("options={[ が出る", () => {
    const jsx = buildComponentJsx(make("Combobox"), INDENT);
    expect(jsx).toContain("options={[");
  });

  it("deprecated compound が出ない", () => {
    const jsx = buildComponentJsx(make("Combobox"), INDENT);
    expect(jsx).not.toContain("Combobox.Label");
    expect(jsx).not.toContain("Combobox.Input");
    expect(jsx).not.toContain("Combobox.Options");
  });

  it("FormControl ラッパーで包まれる", () => {
    const jsx = buildComponentJsx(make("Combobox"), INDENT);
    expect(jsx).toContain("<FormControl>");
  });
});

// ---------------------------------------------------------------------------
// Tier 2: DataTable
// ---------------------------------------------------------------------------

describe("DataTable", () => {
  it("columns={[ / rows={[ / getRowId={ が出る", () => {
    const jsx = buildComponentJsx(make("DataTable"), INDENT);
    expect(jsx).toContain("columns={[");
    expect(jsx).toContain("rows={[");
    expect(jsx).toContain("getRowId={");
  });

  it("repo パターン（getValue / renderCell）が出る", () => {
    const jsx = buildComponentJsx(make("DataTable"), INDENT);
    expect(jsx).toContain("getValue:");
    expect(jsx).toContain("renderCell:");
  });

  it("deprecated compound が出ない", () => {
    const jsx = buildComponentJsx(make("DataTable"), INDENT);
    expect(jsx).not.toContain("DataTable.Head");
    expect(jsx).not.toContain("DataTable.Row");
    expect(jsx).not.toContain("DataTable.Body");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: OrderedList / UnorderedList
// ---------------------------------------------------------------------------

describe("OrderedList", () => {
  it("デフォルトで 3 件の .Item が出る", () => {
    const jsx = buildComponentJsx(make("OrderedList"), INDENT);
    expect((jsx.match(/<OrderedList\\.Item>/g) ?? []).length).toBe(3);
  });

  it("items にカンマ区切りテキストを渡すと空リストにならない", () => {
    // 以前のバグ: parseInt("AAA,BBB,CCC") = NaN → Array.from({ length: NaN }) = []
    const jsx = buildComponentJsx(make("OrderedList", { items: "AAA,BBB,CCC" }), INDENT);
    expect(jsx).toContain("AAA");
    expect(jsx).toContain("BBB");
    expect(jsx).toContain("CCC");
    expect((jsx.match(/<OrderedList\\.Item>/g) ?? []).length).toBe(3);
  });

  it("items の件数がそのまま .Item 数になる", () => {
    const jsx5 = buildComponentJsx(make("OrderedList", { items: "A,B,C,D,E" }), INDENT);
    expect((jsx5.match(/<OrderedList\\.Item>/g) ?? []).length).toBe(5);
  });

  it("OrderedList.Item compound が使われる", () => {
    const jsx = buildComponentJsx(make("OrderedList"), INDENT);
    expect(jsx).toContain("<OrderedList.Item>");
    expect(jsx).toContain("</OrderedList.Item>");
  });

  it("<li> などの HTML タグが直接使われない", () => {
    const jsx = buildComponentJsx(make("OrderedList"), INDENT);
    expect(jsx).not.toContain("<li>");
  });
});

describe("UnorderedList", () => {
  it("デフォルトで 3 件の .Item が出る", () => {
    const jsx = buildComponentJsx(make("UnorderedList"), INDENT);
    expect((jsx.match(/<UnorderedList\\.Item>/g) ?? []).length).toBe(3);
  });

  it("items にカンマ区切りテキストを渡すと空リストにならない", () => {
    const jsx = buildComponentJsx(make("UnorderedList", { items: "X,Y,Z" }), INDENT);
    expect(jsx).toContain("X");
    expect(jsx).toContain("Y");
    expect(jsx).toContain("Z");
    expect((jsx.match(/<UnorderedList\\.Item>/g) ?? []).length).toBe(3);
  });

  it("items の件数がそのまま .Item 数になる", () => {
    const jsx2 = buildComponentJsx(make("UnorderedList", { items: "Foo,Bar" }), INDENT);
    expect((jsx2.match(/<UnorderedList\\.Item>/g) ?? []).length).toBe(2);
  });

  it("UnorderedList.Item compound が使われる", () => {
    const jsx = buildComponentJsx(make("UnorderedList"), INDENT);
    expect(jsx).toContain("<UnorderedList.Item>");
    expect(jsx).toContain("</UnorderedList.Item>");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: NavList
// ---------------------------------------------------------------------------

describe("NavList", () => {
  it("デフォルトで itemTexts のデフォルト値（3件）が .Item に出る", () => {
    const jsx = buildComponentJsx(make("NavList"), INDENT);
    expect(jsx).toContain("Dashboard");
    expect(jsx).toContain("Settings");
    expect(jsx).toContain("Reports");
    expect((jsx.match(/<NavList\\.Item/g) ?? []).length).toBe(3);
  });

  it("itemTexts prop がラベルに反映される", () => {
    const jsx = buildComponentJsx(make("NavList", { itemTexts: "Home,About,Contact" }), INDENT);
    expect(jsx).toContain("Home");
    expect(jsx).toContain("About");
    expect(jsx).toContain("Contact");
    expect((jsx.match(/<NavList\\.Item/g) ?? []).length).toBe(3);
  });

  it("itemTexts の件数がそのまま .Item 数になる", () => {
    const jsx = buildComponentJsx(make("NavList", { itemTexts: "A,B" }), INDENT);
    expect((jsx.match(/<NavList\\.Item/g) ?? []).length).toBe(2);
  });

  it("NavList.Item compound が使われる", () => {
    const jsx = buildComponentJsx(make("NavList"), INDENT);
    expect(jsx).toContain("<NavList.Item");
    expect(jsx).toContain('href="#"');
  });

  it("collectComponentImports に NavList が含まれる", () => {
    const imports = collectComponentImports([make("NavList")]);
    expect(imports).toContain("NavList");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: Button (prop/content reflection)
// ---------------------------------------------------------------------------

describe("Button: prop/content reflection", () => {
  it("label prop がテキストに反映される", () => {
    const jsx = buildComponentJsx(make("Button", { label: "Submit" }), INDENT);
    expect(jsx).toContain("Submit");
  });

  it("variant prop が出る（非 Aegis デフォルトの solid）", () => {
    const jsx = buildComponentJsx(make("Button", { variant: "outline" }), INDENT);
    expect(jsx).toContain('variant="outline"');
  });

  it("デフォルト variant='subtle' は明示的に出力される（Aegis default=solid と異なるため）", () => {
    const jsx = buildComponentJsx(make("Button"), INDENT);
    expect(jsx).toContain('variant="subtle"');
  });

  it("color prop が非デフォルトのとき出る", () => {
    const jsx = buildComponentJsx(make("Button", { color: "primary" }), INDENT);
    expect(jsx).toContain('color="primary"');
  });

  it("loading prop が出る", () => {
    const jsx = buildComponentJsx(make("Button", { loading: "true" }), INDENT);
    expect(jsx).toContain("loading");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: Banner (prop/content reflection)
// ---------------------------------------------------------------------------

describe("Banner: prop/content reflection", () => {
  it("color prop が非デフォルトのとき出る", () => {
    const jsx = buildComponentJsx(make("Banner", { color: "success" }), INDENT);
    expect(jsx).toContain('color="success"');
  });

  it("title ON のとき title= が出る", () => {
    const jsx = buildComponentJsx(make("Banner", { title: "true", titleText: "Alert" }), INDENT);
    expect(jsx).toContain('title="Alert"');
  });

  it("text prop がボディに反映される", () => {
    const jsx = buildComponentJsx(make("Banner", { text: "My message" }), INDENT);
    expect(jsx).toContain("My message");
  });

  it("action ON のとき action={ が出る", () => {
    const jsx = buildComponentJsx(make("Banner", { action: "true" }), INDENT);
    expect(jsx).toContain("action={");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: CheckboxGroup (prop/content reflection)
// ---------------------------------------------------------------------------

describe("CheckboxGroup: prop/content reflection", () => {
  it("デフォルトで 3 件の <Checkbox> が出る", () => {
    const jsx = buildComponentJsx(make("CheckboxGroup"), INDENT);
    expect((jsx.match(/<Checkbox>/g) ?? []).length).toBe(3);
  });

  it("text prop がラベルに反映される（fieldConfig の正しい key）", () => {
    // fieldConfig key is "text" (not "label") for item label textarea
    const jsx = buildComponentJsx(make("CheckboxGroup", { text: "Alpha,Beta,Gamma" }), INDENT);
    expect(jsx).toContain("Alpha");
    expect(jsx).toContain("Beta");
    expect(jsx).toContain("Gamma");
  });

  it("items prop でアイテム数が変わる", () => {
    const jsx = buildComponentJsx(make("CheckboxGroup", { items: "2" }), INDENT);
    expect((jsx.match(/<Checkbox>/g) ?? []).length).toBe(2);
  });

  it("collectComponentImports に CheckboxGroup と Checkbox が含まれる", () => {
    const imports = collectComponentImports([make("CheckboxGroup")]);
    expect(imports).toContain("CheckboxGroup");
    expect(imports).toContain("Checkbox");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: RadioGroup (prop/content reflection)
// ---------------------------------------------------------------------------

describe("RadioGroup: prop/content reflection", () => {
  it("デフォルトで 3 件の <Radio> が出る", () => {
    const jsx = buildComponentJsx(make("RadioGroup"), INDENT);
    expect((jsx.match(/<Radio>/g) ?? []).length).toBe(3);
  });

  it("text prop がラベルに反映される（fieldConfig の正しい key）", () => {
    // fieldConfig key is "text" (not "label") for item label textarea
    const jsx = buildComponentJsx(make("RadioGroup", { text: "Yes,No,Maybe" }), INDENT);
    expect(jsx).toContain("Yes");
    expect(jsx).toContain("No");
    expect(jsx).toContain("Maybe");
  });

  it("items prop でアイテム数が変わる", () => {
    const jsx = buildComponentJsx(make("RadioGroup", { items: "4" }), INDENT);
    expect((jsx.match(/<Radio>/g) ?? []).length).toBe(4);
  });

  it("collectComponentImports に RadioGroup と Radio が含まれる", () => {
    const imports = collectComponentImports([make("RadioGroup")]);
    expect(imports).toContain("RadioGroup");
    expect(imports).toContain("Radio");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: Accordion (prop/content reflection)
// ---------------------------------------------------------------------------

describe("Accordion: prop/content reflection", () => {
  it("label prop がボタンラベルに反映される", () => {
    const jsx = buildComponentJsx(make("Accordion", { label: "FAQ,Help,About" }), INDENT);
    expect(jsx).toContain("FAQ");
    expect(jsx).toContain("Help");
    expect(jsx).toContain("About");
  });

  it("content prop がパネルコンテンツに反映される", () => {
    const jsx = buildComponentJsx(make("Accordion", { content: "Answer 1,Answer 2,Answer 3" }), INDENT);
    expect(jsx).toContain("Answer 1");
  });

  it("items prop でアイテム数が変わる", () => {
    const jsx2 = buildComponentJsx(make("Accordion", { items: "2" }), INDENT);
    const jsx4 = buildComponentJsx(make("Accordion", { items: "4" }), INDENT);
    expect((jsx2.match(/<AccordionItem>/g) ?? []).length).toBe(2);
    expect((jsx4.match(/<AccordionItem>/g) ?? []).length).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// Tier 1: Stepper (prop/content reflection + Aegis API compliance)
// ---------------------------------------------------------------------------

describe("Stepper: prop/content reflection + Aegis API compliance", () => {
  it("Stepper.Item に status='normal' が付く（Storybook required prop）", () => {
    // Aegis Storybook: <Stepper.Item status="normal" title={...} /> が標準形式
    const jsx = buildComponentJsx(make("Stepper"), INDENT);
    expect(jsx).toContain('status="normal"');
  });

  it("defaultIndex={0} が付く", () => {
    const jsx = buildComponentJsx(make("Stepper"), INDENT);
    expect(jsx).toContain("defaultIndex={0}");
  });

  it("label prop がタイトルに反映される", () => {
    const jsx = buildComponentJsx(make("Stepper", { label: "Draft,Review,Approve" }), INDENT);
    expect(jsx).toContain('title="Draft"');
    expect(jsx).toContain('title="Review"');
    expect(jsx).toContain('title="Approve"');
  });

  it("items prop でステップ数が変わる", () => {
    const jsx2 = buildComponentJsx(make("Stepper", { items: "2" }), INDENT);
    const jsx4 = buildComponentJsx(make("Stepper", { items: "4" }), INDENT);
    expect((jsx2.match(/<Stepper\\.Item/g) ?? []).length).toBe(2);
    expect((jsx4.match(/<Stepper\\.Item/g) ?? []).length).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// Tier 1: TagGroup (prop/content reflection)
// ---------------------------------------------------------------------------

describe("TagGroup: prop/content reflection", () => {
  it("TagGroup + Tag が出る", () => {
    const jsx = buildComponentJsx(make("TagGroup"), INDENT);
    expect(jsx).toContain("<TagGroup>");
    expect(jsx).toContain("<Tag>");
  });

  it("tagLabels prop がラベルに反映される", () => {
    const jsx = buildComponentJsx(make("TagGroup", { tagLabels: "React,TypeScript,Aegis" }), INDENT);
    expect(jsx).toContain("React");
    expect(jsx).toContain("TypeScript");
    expect(jsx).toContain("Aegis");
  });

  it("tgItems prop でタグ数が変わる", () => {
    const jsx2 = buildComponentJsx(make("TagGroup", { tgItems: "2" }), INDENT);
    expect((jsx2.match(/<Tag>/g) ?? []).length).toBe(2);
  });

  it("collectComponentImports に TagGroup と Tag が含まれる", () => {
    const imports = collectComponentImports([make("TagGroup")]);
    expect(imports).toContain("TagGroup");
    expect(imports).toContain("Tag");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: Form (prop/content reflection)
// ---------------------------------------------------------------------------

describe("Form: prop/content reflection", () => {
  it("FormControl と Select が出る（デフォルト inputType=Select）", () => {
    const jsx = buildComponentJsx(make("Form"), INDENT);
    expect(jsx).toContain("<FormControl>");
    expect(jsx).toContain("<Select");
  });

  it("itemEdit\${n}_fcLabel prop がラベルに反映される", () => {
    const jsx = buildComponentJsx(
      make("Form", { items: "2", itemEdit1_fcLabel: "Name", itemEdit2_fcLabel: "Email" }),
      INDENT,
    );
    expect(jsx).toContain("Name");
    expect(jsx).toContain("Email");
  });

  it("items prop でフィールド数が変わる", () => {
    const jsx3 = buildComponentJsx(make("Form", { items: "3" }), INDENT);
    expect((jsx3.match(/<FormControl>/g) ?? []).length).toBe(3);
  });

  it("collectComponentImports に Form と FormControl が含まれる", () => {
    const imports = collectComponentImports([make("Form")]);
    expect(imports).toContain("Form");
    expect(imports).toContain("FormControl");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: Breadcrumb (prop/content reflection + Aegis API compliance)
// ---------------------------------------------------------------------------

describe("Breadcrumb: prop/content reflection + Aegis API compliance", () => {
  it("Breadcrumb.Item に href が付く（非最終アイテム）", () => {
    const jsx = buildComponentJsx(make("Breadcrumb"), INDENT);
    expect(jsx).toContain('href="#"');
  });

  it("最後の Item に aria-current='location' が付く（Aegis breadcrumb pattern）", () => {
    // Aegis API: 現在ページを示す最終アイテムに aria-current="location" を付ける
    const jsx = buildComponentJsx(make("Breadcrumb"), INDENT);
    expect(jsx).toContain('aria-current="location"');
  });

  it("label prop がラベルに反映される", () => {
    const jsx = buildComponentJsx(make("Breadcrumb", { label: "Home,Docs,Guide" }), INDENT);
    expect(jsx).toContain("Home");
    expect(jsx).toContain("Docs");
    expect(jsx).toContain("Guide");
  });

  it("items prop でアイテム数が変わる", () => {
    const jsx2 = buildComponentJsx(make("Breadcrumb", { items: "2" }), INDENT);
    expect((jsx2.match(/<Breadcrumb\\.Item/g) ?? []).length).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Tier 1: Pagination (prop/content reflection)
// ---------------------------------------------------------------------------

describe("Pagination: prop/content reflection", () => {
  it("total= と defaultPage={1} が出る", () => {
    const jsx = buildComponentJsx(make("Pagination"), INDENT);
    expect(jsx).toContain("total={");
    expect(jsx).toContain("defaultPage={1}");
  });

  it("items prop が total 値に反映される", () => {
    const jsx = buildComponentJsx(make("Pagination", { items: "20" }), INDENT);
    expect(jsx).toContain("total={20}");
  });

  it("deprecated compound が出ない", () => {
    const jsx = buildComponentJsx(make("Pagination"), INDENT);
    expect(jsx).not.toContain("Pagination.Item");
    expect(jsx).not.toContain("Pagination.Prev");
    expect(jsx).not.toContain("Pagination.Next");
  });
});

// ---------------------------------------------------------------------------
// Tier 2: Tree
// ---------------------------------------------------------------------------

describe("Tree", () => {
  it("items={{ / rootItemId= / getItemChildren={ が出る", () => {
    const jsx = buildComponentJsx(make("Tree"), INDENT);
    expect(jsx).toContain("items={{");
    expect(jsx).toContain("rootItemId=");
    expect(jsx).toContain("getItemChildren={");
  });

  it("deprecated Tree.Item が出ない", () => {
    const jsx = buildComponentJsx(make("Tree"), INDENT);
    expect(jsx).not.toContain("Tree.Item");
  });
});

// ---------------------------------------------------------------------------
// Tier 1: Badge — upgraded from bare comment to actual JSX
// ---------------------------------------------------------------------------

describe("Badge: Tier 1 upgrade (bare comment → actual JSX)", () => {
  it("実際の JSX が出る（コメントのみではない）", () => {
    const jsx = buildComponentJsx(make("Badge"), INDENT);
    // Previously outputted {/* Badge */} — now outputs real JSX
    expect(jsx).toContain("<Badge");
    expect(jsx).not.toBe(\`\${INDENT}{/* Badge */}\`);
  });

  it("Badge タグが自己閉じまたは children 形式で出る", () => {
    const jsx = buildComponentJsx(make("Badge"), INDENT);
    expect(jsx).toMatch(/<Badge[^>]*>|<Badge[^/]* \\/>/);
  });

  it("collectComponentImports に Badge が含まれる", () => {
    const imports = collectComponentImports([make("Badge")]);
    expect(imports).toContain("Badge");
  });
});

// ---------------------------------------------------------------------------
// Tier 2: Radio — upgraded from bare comment to RadioGroup scaffold
// ---------------------------------------------------------------------------

describe("Radio: Tier 2 upgrade (bare comment → RadioGroup scaffold)", () => {
  it("RadioGroup scaffold が出る（Aegis: Radio は RadioGroup 内で使用）", () => {
    const jsx = buildComponentJsx(make("Radio"), INDENT);
    // Aegis API: standalone <Radio> は非推奨。RadioGroup で包む
    expect(jsx).toContain("<RadioGroup>");
    expect(jsx).toContain("<Radio");
    expect(jsx).not.toBe(\`\${INDENT}{/* Radio */}\`);
  });

  it("scaffold に手動対応のコメントが含まれる", () => {
    const jsx = buildComponentJsx(make("Radio"), INDENT);
    expect(jsx).toContain("{/*");
  });

  it("collectComponentImports に RadioGroup と Radio が含まれる", () => {
    const imports = collectComponentImports([make("Radio")]);
    expect(imports).toContain("RadioGroup");
    expect(imports).toContain("Radio");
  });
});

// ---------------------------------------------------------------------------
// Tier 2: Skeleton — upgraded from bare comment to actual JSX
// ---------------------------------------------------------------------------

describe("Skeleton: Tier 2 upgrade (bare comment → actual JSX)", () => {
  it("Skeleton JSX が出る", () => {
    const jsx = buildComponentJsx(make("Skeleton"), INDENT);
    expect(jsx).toContain("<Skeleton");
    expect(jsx).not.toBe(\`\${INDENT}{/* Skeleton */}\`);
  });

  it("width と height が出る", () => {
    const jsx = buildComponentJsx(make("Skeleton"), INDENT);
    expect(jsx).toContain("width={");
    expect(jsx).toContain("height={");
  });

  it("collectComponentImports に Skeleton が含まれる", () => {
    const imports = collectComponentImports([make("Skeleton")]);
    expect(imports).toContain("Skeleton");
  });
});

// ---------------------------------------------------------------------------
// Tier 3: Table — 裸コメント → 手動実装ガイド付きリッチコメント
// ---------------------------------------------------------------------------

describe("Table: Tier 3 rich comment (手動実装ガイド)", () => {
  it("Table という文字列を含む（コンポーネント名が分かる）", () => {
    const jsx = buildComponentJsx(make("Table"), INDENT);
    expect(jsx).toContain("Table");
  });

  it("JSX コメント形式で出る", () => {
    const jsx = buildComponentJsx(make("Table"), INDENT);
    expect(jsx).toContain("{/*");
    expect(jsx).toContain("*/}");
  });

  it("DataTable への誘導が含まれる", () => {
    const jsx = buildComponentJsx(make("Table"), INDENT);
    // 手動実装ガイドに DataTable の使用を推奨するメッセージがあること
    expect(jsx).toContain("DataTable");
  });

  it("<Table> タグ自体は出力しない（API 未確認のため）", () => {
    const jsx = buildComponentJsx(make("Table"), INDENT);
    expect(jsx).not.toContain("<Table");
  });
});

// ---------------------------------------------------------------------------
// Field key 修正: ActionList / TextField / Textarea / FormControl / Select / Combobox
// ---------------------------------------------------------------------------

describe("ActionList: field key mismatch 修正 (label → listLabel)", () => {
  it("listLabel prop がアイテムラベルに反映される", () => {
    // fieldConfig key is "listLabel" (not "label") for item labels
    const jsx = buildComponentJsx(make("ActionList", { listLabel: "Home,Settings,Help" }), INDENT);
    expect(jsx).toContain("Home");
    expect(jsx).toContain("Settings");
    expect(jsx).toContain("Help");
  });

  it("デフォルトのフォールバック labels が出る", () => {
    const jsx = buildComponentJsx(make("ActionList"), INDENT);
    expect(jsx).toContain("Action 1");
  });
});

describe("TextField: field key mismatch 修正 (label → fcLabel)", () => {
  it("fcLabel prop が FormControl.Label に反映される", () => {
    // fieldConfig key is "fcLabel" (not "label") for FormControl Label
    const jsx = buildComponentJsx(make("TextField", { fcLabel: "Email Address" }), INDENT);
    expect(jsx).toContain("Email Address");
    expect(jsx).toContain("<FormControl.Label>");
  });

  it("デフォルトで 'Label' が出る", () => {
    const jsx = buildComponentJsx(make("TextField"), INDENT);
    expect(jsx).toContain("Label");
  });

  it("placeholder prop が反映される", () => {
    const jsx = buildComponentJsx(make("TextField", { placeholder: "Enter text..." }), INDENT);
    expect(jsx).toContain('placeholder="Enter text..."');
  });
});

describe("Textarea: field key mismatch 修正 (label → fcLabel, rows → minRows)", () => {
  it("fcLabel prop が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("Textarea", { fcLabel: "Description" }), INDENT);
    expect(jsx).toContain("Description");
    expect(jsx).toContain("<FormControl.Label>");
  });

  it("minRows prop が rows 属性に反映される", () => {
    // fieldConfig key is "minRows" (not "rows")
    const jsx = buildComponentJsx(make("Textarea", { minRows: "5" }), INDENT);
    expect(jsx).toContain("rows={5}");
  });

  it("minRows='3'（デフォルト）のとき rows= が出ない（デフォルト省略）", () => {
    const jsx = buildComponentJsx(make("Textarea", { minRows: "3" }), INDENT);
    expect(jsx).not.toContain("rows=");
  });
});

describe("FormControl: field key mismatch 修正 (label → fcLabel, helpText → fcCaptionText)", () => {
  it("fcLabel prop が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("FormControl", { fcLabel: "Full Name" }), INDENT);
    expect(jsx).toContain("Full Name");
  });

  it("fcCaptionText prop が FormControl.Caption に反映される", () => {
    // fieldConfig key is "fcCaptionText" (not "helpText")
    const jsx = buildComponentJsx(make("FormControl", { fcCaptionText: "Required field" }), INDENT);
    expect(jsx).toContain("Required field");
    expect(jsx).toContain("<FormControl.Caption>");
  });

  it("fcCaptionText が空のとき Caption が出ない", () => {
    const jsx = buildComponentJsx(make("FormControl"), INDENT);
    expect(jsx).not.toContain("<FormControl.Caption>");
  });
});

describe("Select: field key mismatch 修正 (label → fcLabel)", () => {
  it("fcLabel prop が FormControl.Label に反映される", () => {
    // fieldConfig key is "fcLabel" (not "label") for FormControl Label
    const jsx = buildComponentJsx(make("Select", { fcLabel: "Category" }), INDENT);
    expect(jsx).toContain("Category");
    expect(jsx).toContain("<FormControl.Label>");
  });

  it("デフォルトで 'Label' が出る", () => {
    const jsx = buildComponentJsx(make("Select"), INDENT);
    expect(jsx).toContain("Label");
  });
});

describe("Combobox: field key mismatch 修正 (label → fcLabel)", () => {
  it("fcLabel prop が FormControl.Label に反映される", () => {
    // fieldConfig key is "fcLabel" (not "label") for FormControl Label
    const jsx = buildComponentJsx(make("Combobox", { fcLabel: "Assignee" }), INDENT);
    expect(jsx).toContain("Assignee");
    expect(jsx).toContain("<FormControl.Label>");
  });

  it("デフォルトで 'Label' が出る", () => {
    const jsx = buildComponentJsx(make("Combobox"), INDENT);
    expect(jsx).toContain("Label");
  });
});

// ---------------------------------------------------------------------------
// Field key 修正: Code / CodeBlock / FileDrop / TagInput
// ---------------------------------------------------------------------------

describe("Code: field key mismatch 修正 (code → text)", () => {
  it("text prop がコードコンテンツに反映される", () => {
    // fieldConfig key is "text", builder previously read "code" (now fixed)
    const jsx = buildComponentJsx(make("Code", { text: "const y = 99;" }), INDENT);
    expect(jsx).toContain("const y = 99;");
  });

  it("デフォルトのフォールバックが出る", () => {
    const jsx = buildComponentJsx(make("Code"), INDENT);
    expect(jsx).toContain("<Code>");
    expect(jsx).toContain("</Code>");
  });
});

describe("CodeBlock: field key mismatch 修正 (code → text)", () => {
  it("text prop がコードブロックコンテンツに反映される", () => {
    const jsx = buildComponentJsx(make("CodeBlock", { text: "console.log('hello');" }), INDENT);
    expect(jsx).toContain("console.log('hello');");
  });

  it("テンプレートリテラル形式で出る", () => {
    const jsx = buildComponentJsx(make("CodeBlock"), INDENT);
    expect(jsx).toContain("<CodeBlock>{\`");
  });
});

describe("FileDrop: field key mismatch 修正 (label → text)", () => {
  it("text prop がドロップゾーンのラベルに反映される", () => {
    // fieldConfig key is "text", builder previously read "label" (now fixed)
    const jsx = buildComponentJsx(make("FileDrop", { text: "ファイルをここにドロップ" }), INDENT);
    expect(jsx).toContain("ファイルをここにドロップ");
  });

  it("multiple prop が反映される", () => {
    const jsx = buildComponentJsx(make("FileDrop", { multiple: "true" }), INDENT);
    expect(jsx).toContain("multiple");
  });
});

describe("TagInput: fcLabel 対応", () => {
  it("fcLabel prop が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("TagInput", { fcLabel: "メールアドレス" }), INDENT);
    expect(jsx).toContain("メールアドレス");
    expect(jsx).toContain("<FormControl.Label>");
  });

  it("inside comment が出力に含まれない（leading/trailing/toolbar は直接反映済み）", () => {
    const jsx = buildComponentJsx(make("TagInput"), INDENT);
    expect(jsx).not.toContain("手動で追加");
  });

  it("<TagInput /> が出る", () => {
    const jsx = buildComponentJsx(make("TagInput"), INDENT);
    expect(jsx).toContain("<TagInput");
  });

  it("collectComponentImports に TagInput と FormControl が含まれる", () => {
    const imports = collectComponentImports([make("TagInput")]);
    expect(imports).toContain("TagInput");
    expect(imports).toContain("FormControl");
  });
});

// ---------------------------------------------------------------------------
// Field key 修正: Mark / Date/Time 系
// ---------------------------------------------------------------------------

describe("Mark: field key mismatch 修正 (text → markText)", () => {
  it("markText prop がハイライトテキストに反映される", () => {
    // fieldConfig key is "markText" (not "text") for the highlighted text content
    const jsx = buildComponentJsx(make("Mark", { markText: "critical term" }), INDENT);
    expect(jsx).toContain("critical term");
  });

  it("デフォルトで 'important part' が出る（fieldConfig default 値）", () => {
    const jsx = buildComponentJsx(make("Mark"), INDENT);
    expect(jsx).toContain("important part");
  });

  it("color prop が反映される", () => {
    const jsx = buildComponentJsx(make("Mark", { color: "blue" }), INDENT);
    expect(jsx).toContain('color="blue"');
  });
});

describe("DateField: fcLabel 修正 (hardcoded → fcLabel)", () => {
  it("fcLabel prop が FormControl.Label に反映される", () => {
    // fieldConfig key is "fcLabel" for FormControl Label (previously hardcoded)
    const jsx = buildComponentJsx(make("DateField", { fcLabel: "契約日" }), INDENT);
    expect(jsx).toContain("契約日");
    expect(jsx).toContain("<FormControl.Label>");
  });

  it("デフォルトで 'Date' が出る", () => {
    const jsx = buildComponentJsx(make("DateField"), INDENT);
    expect(jsx).toContain("Date");
  });
});

describe("DatePicker: fcLabel 修正 (hardcoded → fcLabel)", () => {
  it("fcLabel prop が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("DatePicker", { fcLabel: "開始日" }), INDENT);
    expect(jsx).toContain("開始日");
    expect(jsx).toContain("<FormControl.Label>");
  });

  it("デフォルトで 'Date' が出る", () => {
    const jsx = buildComponentJsx(make("DatePicker"), INDENT);
    expect(jsx).toContain("Date");
  });
});

describe("RangeDateField: fcLabel 修正 (hardcoded → fcLabel)", () => {
  it("fcLabel prop が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("RangeDateField", { fcLabel: "期間" }), INDENT);
    expect(jsx).toContain("期間");
    expect(jsx).toContain("<FormControl.Label>");
  });

  it("デフォルトで 'Date Range' が出る", () => {
    const jsx = buildComponentJsx(make("RangeDateField"), INDENT);
    expect(jsx).toContain("Date Range");
  });
});

describe("RangeDatePicker: fcLabel 修正 (hardcoded → fcLabel)", () => {
  it("fcLabel prop が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("RangeDatePicker", { fcLabel: "契約期間" }), INDENT);
    expect(jsx).toContain("契約期間");
    expect(jsx).toContain("<FormControl.Label>");
  });

  it("デフォルトで 'Date Range' が出る", () => {
    const jsx = buildComponentJsx(make("RangeDatePicker"), INDENT);
    expect(jsx).toContain("Date Range");
  });
});

describe("TimeField: fcLabel 修正 (hardcoded → fcLabel)", () => {
  it("fcLabel prop が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("TimeField", { fcLabel: "開始時刻" }), INDENT);
    expect(jsx).toContain("開始時刻");
    expect(jsx).toContain("<FormControl.Label>");
  });

  it("デフォルトで 'Time' が出る", () => {
    const jsx = buildComponentJsx(make("TimeField"), INDENT);
    expect(jsx).toContain("Time");
  });
});

describe("TimePicker: fcLabel 修正 (hardcoded → fcLabel)", () => {
  it("fcLabel prop が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("TimePicker", { fcLabel: "終了時刻" }), INDENT);
    expect(jsx).toContain("終了時刻");
    expect(jsx).toContain("<FormControl.Label>");
  });

  it("デフォルトで 'Time' が出る", () => {
    const jsx = buildComponentJsx(make("TimePicker"), INDENT);
    expect(jsx).toContain("Time");
  });
});

describe("RangeTimeField: fcLabel 修正 (hardcoded → fcLabel)", () => {
  it("fcLabel prop が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("RangeTimeField", { fcLabel: "時間帯" }), INDENT);
    expect(jsx).toContain("時間帯");
    expect(jsx).toContain("<FormControl.Label>");
  });

  it("デフォルトで 'Time Range' が出る", () => {
    const jsx = buildComponentJsx(make("RangeTimeField"), INDENT);
    expect(jsx).toContain("Time Range");
  });
});

describe("RangeTimePicker: fcLabel 修正 (hardcoded → fcLabel)", () => {
  it("fcLabel prop が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("RangeTimePicker", { fcLabel: "営業時間" }), INDENT);
    expect(jsx).toContain("営業時間");
    expect(jsx).toContain("<FormControl.Label>");
  });

  it("デフォルトで 'Time Range' が出る", () => {
    const jsx = buildComponentJsx(make("RangeTimePicker"), INDENT);
    expect(jsx).toContain("Time Range");
  });
});

// ---------------------------------------------------------------------------
// 全コンポーネント共通: 安全性チェック
// ---------------------------------------------------------------------------

describe("全コンポーネント共通: 安全性", () => {
  const ALL_COMPONENTS: ContentItem["component"][] = [
    "Button",
    "IconButton",
    "Text",
    "Banner",
    "Tag",
    "StatusLabel",
    "Link",
    "Switch",
    "Checkbox",
    "CheckboxCard",
    "CheckboxGroup",
    "RadioCard",
    "RadioGroup",
    "TextField",
    "Textarea",
    "FormControl",
    "Search",
    "Select",
    "Combobox",
    "Avatar",
    "AvatarGroup",
    "Mark",
    "Divider",
    "DividerVertical",
    "Blockquote",
    "Breadcrumb",
    "ButtonGroup",
    "Calendar",
    "RangeCalendar",
    "DateField",
    "DatePicker",
    "RangeDateField",
    "RangeDatePicker",
    "TimeField",
    "TimePicker",
    "RangeTimeField",
    "RangeTimePicker",
    "TagInput",
    "TagPicker",
    "SegmentedControl",
    "Tabs",
    "TagGroup",
    "OrderedList",
    "UnorderedList",
    "NavList",
    "DescriptionList",
    "EmptyState",
    "FileDrop",
    "Code",
    "CodeBlock",
    "Pagination",
    "Timeline",
    "Stepper",
    "Tree",
    "Accordion",
    "ActionList",
    "ContentHeader",
    "Card",
    "DataTable",
    "SideNavigation",
    "Toolbar",
    "Form",
    "InformationCard",
    "InformationCardGroup",
    "Badge",
    "Radio",
    "Skeleton",
    "Table",
    "SideNavigation",
  ];

  it.each(ALL_COMPONENTS)("%s の出力に JSX 属性値としての undefined が含まれない", (comp) => {
    const jsx = buildComponentJsx(make(comp), INDENT);
    // Tree の getItemChildren は arrow function の戻り値として undefined を使うため文字列マッチは除外する。
    // JSX 属性値として ={undefined} や ={'undefined'} が出ていないことを検証する。
    expect(jsx).not.toContain("={undefined}");
    expect(jsx).not.toContain("NaN");
  });

  it("collectComponentImports の返値に undefined が含まれない", () => {
    const items = ALL_COMPONENTS.map((c) => make(c));
    const imports = collectComponentImports(items);
    expect(imports).not.toContain(undefined);
    expect(imports.every((s) => typeof s === "string" && s.length > 0)).toBe(true);
  });

  it("collectComponentImports の返値にドット記法が含まれない", () => {
    const items = ALL_COMPONENTS.map((c) => make(c));
    const imports = collectComponentImports(items);
    expect(imports.every((s) => !s.includes("."))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// buildPageLayoutJsxText 統合: includeComponents フラグ
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

const DEFAULT_SETTINGS = {
  paneStartSettings: DEFAULT_PANE_SETTINGS,
  paneEndSettings: DEFAULT_PANE_SETTINGS,
  sidebarStartSettings: DEFAULT_SIDEBAR_SETTINGS,
  sidebarEndSettings: DEFAULT_SIDEBAR_SETTINGS,
  contentColumnSettings: DEFAULT_AREA_SETTINGS,
  globalStyling: DEFAULT_GLOBAL_STYLING,
};

describe("buildPageLayoutJsxText: includeComponents フラグ", () => {
  it("false のとき import にコンテンツコンポーネントが追加されない", () => {
    const code = buildPageLayoutJsxText({
      layout: OFF_LAYOUT,
      contentAreaItems: { ...EMPTY_ITEMS, contentBody: [make("Tabs")] },
      includeComponents: false,
      ...DEFAULT_SETTINGS,
    });
    // コメント {/* Tabs */} は出るが、import の named export には含まれないことを確認する
    const importBlock = code.slice(0, code.indexOf("export default"));
    expect(importBlock).not.toContain("Tabs");
    expect(importBlock).not.toContain("TabsList");
  });

  it("true + Tabs のとき import に flat API が含まれる", () => {
    const code = buildPageLayoutJsxText({
      layout: OFF_LAYOUT,
      contentAreaItems: { ...EMPTY_ITEMS, contentBody: [make("Tabs")] },
      includeComponents: true,
      ...DEFAULT_SETTINGS,
    });
    expect(code).toContain("Tabs,");
    expect(code).toContain("TabsList,");
    expect(code).not.toContain("Tab.Group");
  });

  it("true + TagPicker のとき import に TagPicker と FormControl が含まれ TagPicker.Option が出ない", () => {
    // Aegis API: TagPicker は options prop 配列で使う。TagPicker.Option という compound は存在しない
    const code = buildPageLayoutJsxText({
      layout: OFF_LAYOUT,
      contentAreaItems: { ...EMPTY_ITEMS, contentBody: [make("TagPicker")] },
      includeComponents: true,
      ...DEFAULT_SETTINGS,
    });
    expect(code).toContain("TagPicker,");
    expect(code).toContain("FormControl,");
    expect(code).not.toContain("TagPicker.Option");
  });

  it("true + Toolbar のとき import に ToolbarGroup（flat export）が含まれ Toolbar.Group が出ない", () => {
    // Aegis API: Toolbar.Group は存在しない。flat export の ToolbarGroup を使う
    const code = buildPageLayoutJsxText({
      layout: OFF_LAYOUT,
      contentAreaItems: { ...EMPTY_ITEMS, contentBody: [make("Toolbar")] },
      includeComponents: true,
      ...DEFAULT_SETTINGS,
    });
    expect(code).toContain("ToolbarGroup,");
    expect(code).not.toContain("Toolbar.Group");
  });

  it("true + Timeline のとき import に flat exports が含まれ Timeline.Title が出ない", () => {
    // Aegis API: Timeline.Title は存在しない。flat exports (TimelineItem/TimelineContent/TimelinePoint) を使う
    const code = buildPageLayoutJsxText({
      layout: OFF_LAYOUT,
      contentAreaItems: { ...EMPTY_ITEMS, contentBody: [make("Timeline")] },
      includeComponents: true,
      ...DEFAULT_SETTINGS,
    });
    expect(code).toContain("TimelineItem,");
    expect(code).toContain("TimelineContent,");
    expect(code).not.toContain("Timeline.Title");
  });

  it("false のとき slot 付きアイテムはコンポーネント名のみのコメントになる", () => {
    const code = buildPageLayoutJsxText({
      layout: { ...OFF_LAYOUT, globalHeader: true },
      contentAreaItems: {
        ...EMPTY_ITEMS,
        globalHeader: [
          { id: "1", component: "Button", slot: "start" },
          { id: "2", component: "Badge", slot: "end" },
        ],
      },
      includeComponents: false,
      ...DEFAULT_SETTINGS,
    });
    expect(code).toContain("{/* Button, Badge */}");
    expect(code).not.toContain("start: Button");
    expect(code).not.toContain("end: Badge");
  });
});

// ---------------------------------------------------------------------------
// Matrix runner: layout preset × representative area × component sample
//
// 理想は全直積だが、テストでは各次元の代表値に縮約して網羅性を担保する。
// area は「その area が有効になる layout preset」とペアリングして使う。
// ---------------------------------------------------------------------------

const AREA_LAYOUT_PAIRS: Array<{ area: ContentArea; layoutOverride: Partial<Record<LayoutKey, boolean>> }> = [
  { area: "contentBody", layoutOverride: {} },
  { area: "globalHeader", layoutOverride: { globalHeader: true } },
  { area: "globalFooter", layoutOverride: { globalFooter: true } },
  { area: "contentHeader", layoutOverride: { contentHeader: true } },
  { area: "contentFooter", layoutOverride: { contentFooter: true } },
  { area: "paneStartBody", layoutOverride: { paneStart: true } },
  { area: "paneEndBody", layoutOverride: { paneEnd: true } },
  { area: "outerSidebarStartBody", layoutOverride: { outerSidebarStart: true } },
  { area: "outerSidebarEndBody", layoutOverride: { outerSidebarEnd: true } },
  // innerSidebar areas (previously uncovered)
  { area: "innerSidebarStart", layoutOverride: { innerSidebarStart: true } },
  { area: "innerSidebarEnd", layoutOverride: { innerSidebarEnd: true } },
  // pane header/footer areas — paneStart/paneEnd が有効な状態で header/footer も有効にする
  { area: "paneStartHeader", layoutOverride: { paneStart: true, paneStartHeader: true } },
  { area: "paneStartFooter", layoutOverride: { paneStart: true, paneStartFooter: true } },
  { area: "paneEndHeader", layoutOverride: { paneEnd: true, paneEndHeader: true } },
  { area: "paneEndFooter", layoutOverride: { paneEnd: true, paneEndFooter: true } },
  // outerSidebar header/footer areas — outerSidebarStart/End が有効な状態で header/footer も有効にする
  {
    area: "outerSidebarStartHeader",
    layoutOverride: { outerSidebarStart: true, outerSidebarStartHeader: true },
  },
  {
    area: "outerSidebarStartFooter",
    layoutOverride: { outerSidebarStart: true, outerSidebarStartFooter: true },
  },
  {
    area: "outerSidebarEndHeader",
    layoutOverride: { outerSidebarEnd: true, outerSidebarEndHeader: true },
  },
  {
    area: "outerSidebarEndFooter",
    layoutOverride: { outerSidebarEnd: true, outerSidebarEndFooter: true },
  },
];

const COMPONENT_SAMPLES: Array<{ label: string; item: ContentItem }> = [
  // Tier 1 flat (normalized — fixed this session)
  { label: "Button", item: make("Button") },
  { label: "Tabs", item: make("Tabs") },
  { label: "Avatar", item: make("Avatar") },
  { label: "AvatarGroup", item: make("AvatarGroup") },
  { label: "Card", item: make("Card") },
  { label: "ActionList", item: make("ActionList") },
  { label: "SideNavigation", item: make("SideNavigation") },
  { label: "TagPicker", item: make("TagPicker") }, // fixed: options[] API, no TagPicker.Option
  { label: "Toolbar", item: make("Toolbar") }, // fixed: ToolbarGroup flat export
  { label: "Timeline", item: make("Timeline") }, // fixed: flat exports, tagLabels key
  { label: "NavList", item: make("NavList") }, // fixed: itemTexts key
  { label: "OrderedList", item: make("OrderedList") }, // fixed: text not parseInt
  { label: "Accordion", item: make("Accordion") },
  { label: "Stepper", item: make("Stepper") }, // fixed: status="normal"
  { label: "Form", item: make("Form") },
  { label: "Breadcrumb", item: make("Breadcrumb") },
  { label: "Pagination", item: make("Pagination") },
  // Tier 1 flat (既存正常)
  { label: "Text", item: make("Text") },
  { label: "Banner", item: make("Banner") },
  { label: "TextField", item: make("TextField") },
  { label: "Checkbox", item: make("Checkbox") },
  // Tier 2 scaffold
  { label: "Select", item: make("Select") },
  { label: "DataTable", item: make("DataTable") },
  { label: "Tree", item: make("Tree") },
  // Upgraded from bare comment to actual JSX
  { label: "Radio", item: make("Radio") }, // RadioGroup scaffold
  { label: "Skeleton", item: make("Skeleton") }, // <Skeleton> JSX
  { label: "Badge", item: make("Badge") }, // <Badge> JSX
  // Tier 3 rich comment (no JSX tag, but informative comment)
  { label: "Table", item: make("Table") },
];

describe("matrix: layout preset × content area × component sample でクラッシュしない", () => {
  for (const { area, layoutOverride } of AREA_LAYOUT_PAIRS) {
    for (const { label, item } of COMPONENT_SAMPLES) {
      it(\`\${area} × \${label}\`, () => {
        expect(() =>
          buildPageLayoutJsxText({
            layout: { ...OFF_LAYOUT, ...layoutOverride },
            contentAreaItems: { ...EMPTY_ITEMS, [area]: [item] },
            includeComponents: true,
            ...DEFAULT_SETTINGS,
          }),
        ).not.toThrow();
      });
    }
  }
});
`;export{e as default};