var e=`/**
 * buildComponentJsxText.exhaustive.test.ts
 *
 * 完全総当たりチェック — component correctness tests
 *
 * 方針:
 *   - builder-readable な prop の全 enum 値・boolean・count 境界値をテスト
 *   - 出力内容の正しさ (correctness) を検証。layout area は無関係 (safety は別ファイル)
 *   - pairwise / orthogonal: 各 prop 値を独立してテスト。全直積は取らない
 *
 * Cat-4 import completeness ルール:
 *   - import 検証は必ず collectComponentImports([item]) の戻り値だけを使う
 *   - buildComponentJsx の副作用 (COMPONENT_IMPORT_SET への add) に依存しない
 *   - buildComponentJsx と import 検証の it ブロックは分ける
 *   理由: buildComponentJsx は COMPONENT_IMPORT_SET を clear せずに add するため、
 *         テスト順に依存した state 汚染が発生しうる。
 *         collectComponentImports は clear → run → return を一括管理するため安全。
 */

import { describe, expect, it } from "vitest";
import { buildComponentJsx, collectComponentImports } from "./buildComponentJsxText";
import type { ContentItem } from "./views/AddContentView/types";

function make(component: ContentItem["component"], props?: Record<string, string>): ContentItem {
  return { id: "x", component, props };
}

const INDENT = "    ";

// =============================================================================
// Level 1: Mark — 全 color 値 + markText (小空間: ほぼ全直積)
//
// builder が読むキー:
//   color: "red"|"orange"|"yellow"|"teal"|"blue"|"indigo"|"purple"|"magenta"|"gray"  (9値)
//   markText: free text (default: "important part")
// builder 出力: <Mark color="\${color}">\${text}</Mark>  — color は常に emitted (sp なし)
// =============================================================================

describe("[exhaustive] Mark: color — 全 9 値", () => {
  it.each([
    "red",
    "orange",
    "yellow",
    "teal",
    "blue",
    "indigo",
    "purple",
    "magenta",
    "gray",
  ] as const)('color="%s" が出力に含まれる', (color) => {
    const jsx = buildComponentJsx(make("Mark", { color }), INDENT);
    expect(jsx).toContain(\`color="\${color}"\`);
    expect(jsx).toContain("<Mark ");
    expect(jsx).toContain("</Mark>");
  });
});

describe("[exhaustive] Mark: markText — カスタム値・日本語・空文字・デフォルト", () => {
  it("markText=カスタム英語テキストが反映される", () => {
    const jsx = buildComponentJsx(make("Mark", { markText: "critical term" }), INDENT);
    expect(jsx).toContain("critical term");
  });

  it("markText=日本語テキストが反映される", () => {
    const jsx = buildComponentJsx(make("Mark", { markText: "重要な部分" }), INDENT);
    expect(jsx).toContain("重要な部分");
  });

  it("markText=空文字のとき空 children になる（フォールバックなし）", () => {
    // pv は ?? なので空文字はデフォルトに落ちず空のまま
    const jsx = buildComponentJsx(make("Mark", { markText: "" }), INDENT);
    expect(jsx).toContain("<Mark color=");
    expect(jsx).not.toContain("important part");
  });

  it("markText 未指定のとき 'important part' がデフォルトとして出る", () => {
    const jsx = buildComponentJsx(make("Mark"), INDENT);
    expect(jsx).toContain("important part");
  });
});

describe("[exhaustive] Mark: Cat-4 import completeness", () => {
  it("collectComponentImports に Mark が含まれる", () => {
    const imports = collectComponentImports([make("Mark", { color: "blue" })]);
    expect(imports).toContain("Mark");
  });

  it("collectComponentImports に Icon が含まれない（Mark は Icon 不要）", () => {
    const imports = collectComponentImports([make("Mark")]);
    expect(imports).not.toContain("Icon");
  });
});

// =============================================================================
// Level 2: Tag — 全 enum 値を prop 別に検証 (orthogonal)
//
// builder が読むキー:
//   color: 12 値（sp threshold="neutral" → neutral のみ omit、他は emitted）
//   variant: "outline"|"fill"（sp threshold="outline" → outline のみ omit）
//   size: "medium"|"small"（sp threshold="medium" → medium のみ omit）
//   label: free text（default: "Tag"）
// =============================================================================

describe("[exhaustive] Tag: color — 全 12 値", () => {
  // neutral だけ sp("color", color, "neutral") により omit される
  it('color="neutral" のとき color= が出力されない（Aegis default）', () => {
    const jsx = buildComponentJsx(make("Tag", { color: "neutral" }), INDENT);
    expect(jsx).not.toContain("color=");
    // size="small" は別の default として emitted されるため <Tag> bareタグにはならない
  });

  it.each([
    "inverse",
    "red",
    "yellow",
    "blue",
    "teal",
    "purple",
    "magenta",
    "orange",
    "lime",
    "indigo",
    "transparent",
  ] as const)('color="%s" が出力に含まれる', (color) => {
    const jsx = buildComponentJsx(make("Tag", { color }), INDENT);
    expect(jsx).toContain(\`color="\${color}"\`);
  });
});

describe("[exhaustive] Tag: variant — 全 2 値", () => {
  it('variant="outline" のとき variant= が出力されない（sp threshold と一致）', () => {
    const jsx = buildComponentJsx(make("Tag", { variant: "outline" }), INDENT);
    expect(jsx).not.toContain("variant=");
  });

  it('variant="fill" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Tag", { variant: "fill" }), INDENT);
    expect(jsx).toContain('variant="fill"');
  });
});

describe("[exhaustive] Tag: size — 全 2 値", () => {
  it('size="medium" のとき size= が出力されない（sp threshold と一致）', () => {
    const jsx = buildComponentJsx(make("Tag", { size: "medium" }), INDENT);
    expect(jsx).not.toContain("size=");
  });

  it('size="small" が出力に含まれる（Aegis default とは別値）', () => {
    const jsx = buildComponentJsx(make("Tag", { size: "small" }), INDENT);
    expect(jsx).toContain('size="small"');
  });
});

describe("[exhaustive] Tag: label — カスタム値・デフォルト", () => {
  it("label=カスタム文字列が children に反映される", () => {
    const jsx = buildComponentJsx(make("Tag", { label: "Draft" }), INDENT);
    expect(jsx).toContain("Draft");
    expect(jsx).toContain("</Tag>");
  });

  it("label 未指定のとき 'Tag' がデフォルトとして出る", () => {
    const jsx = buildComponentJsx(make("Tag"), INDENT);
    expect(jsx).toContain(">Tag<");
  });
});

describe("[exhaustive] Tag: Cat-4 import completeness", () => {
  it("collectComponentImports に Tag が含まれる", () => {
    const imports = collectComponentImports([make("Tag", { color: "red" })]);
    expect(imports).toContain("Tag");
  });

  it("collectComponentImports に余分な import が含まれない", () => {
    const imports = collectComponentImports([make("Tag")]);
    expect(imports).not.toContain("Icon");
    expect(imports).not.toContain("FormControl");
  });
});

// =============================================================================
// Level 3: Button — orthogonal pairwise（各 prop 値を独立テスト）
//
// builder が読むキー（fieldConfig 由来）:
//   variant: "solid"|"subtle"|"plain"|"gutterless"|"Weight(gutterless)"
//   color:   "neutral"|"brand"|"danger"|"inverse"
//   size:    "large"|"medium"|"small"|"xSmall"
//   loading: bool
//   minWidth: "none"|"Width"|"x8Large(80px)"|...
//   leading: bool + leadingType "Icon"|"Badge" + leadingBadge "normal"|"count"
//   trailing: bool + trailingType "Icon"|"Badge"
//   withoutContent: bool
//   label: free text
//
// 設計方針:
//   - 各 prop の全 option 値を独立して 1 テストずつ検証（pairwise）
//   - 全直積は取らない（Button 単体で 1,440+ になる）
//   - 分岐の交差（loading + leading の無効化、withoutContent の影響など）は
//     代表的な組み合わせのみ追加
// =============================================================================

// ---------------------------------------------------------------------------
// Group A: variant — 全 5 値
// ---------------------------------------------------------------------------
describe("[exhaustive] Button: variant — 全 5 値", () => {
  it('variant="solid" のとき variant= が出力されない（sp threshold と一致）', () => {
    const jsx = buildComponentJsx(make("Button", { variant: "solid" }), INDENT);
    expect(jsx).not.toContain("variant=");
  });

  it('variant="subtle" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Button", { variant: "subtle" }), INDENT);
    expect(jsx).toContain('variant="subtle"');
  });

  it('variant="plain" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Button", { variant: "plain" }), INDENT);
    expect(jsx).toContain('variant="plain"');
  });

  it('variant="gutterless" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Button", { variant: "gutterless" }), INDENT);
    expect(jsx).toContain('variant="gutterless"');
  });

  it('variant="Weight(gutterless)" → variant="gutterless" + weight="normal" に変換される', () => {
    const jsx = buildComponentJsx(make("Button", { variant: "Weight(gutterless)" }), INDENT);
    expect(jsx).toContain('variant="gutterless"');
    expect(jsx).toContain('weight="normal"');
    // "Weight(gutterless)" という文字列がそのまま出ない
    expect(jsx).not.toContain("Weight(gutterless)");
  });
});

// ---------------------------------------------------------------------------
// Group B: color — 全 4 値
// ---------------------------------------------------------------------------
describe("[exhaustive] Button: color — 全 4 値", () => {
  it('color="neutral" のとき color= が出力されない（sp threshold と一致）', () => {
    const jsx = buildComponentJsx(make("Button", { color: "neutral" }), INDENT);
    expect(jsx).not.toContain("color=");
  });

  it('color="brand" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Button", { color: "brand" }), INDENT);
    expect(jsx).toContain('color="brand"');
  });

  it('color="danger" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Button", { color: "danger" }), INDENT);
    expect(jsx).toContain('color="danger"');
  });

  it('color="inverse" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Button", { color: "inverse" }), INDENT);
    expect(jsx).toContain('color="inverse"');
  });
});

// ---------------------------------------------------------------------------
// Group C: size — 全 4 値
// ---------------------------------------------------------------------------
describe("[exhaustive] Button: size — 全 4 値", () => {
  it('size="medium" のとき size= が出力されない（sp threshold と一致）', () => {
    const jsx = buildComponentJsx(make("Button", { size: "medium" }), INDENT);
    expect(jsx).not.toContain("size=");
  });

  it('size="large" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Button", { size: "large" }), INDENT);
    expect(jsx).toContain('size="large"');
  });

  it('size="small" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Button", { size: "small" }), INDENT);
    expect(jsx).toContain('size="small"');
  });

  it('size="xSmall" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Button", { size: "xSmall" }), INDENT);
    expect(jsx).toContain('size="xSmall"');
  });
});

// ---------------------------------------------------------------------------
// Group D: loading
// ---------------------------------------------------------------------------
describe("[exhaustive] Button: loading", () => {
  it("loading=true のとき loading 属性が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Button", { loading: "true" }), INDENT);
    expect(jsx).toContain(" loading");
  });

  it("loading=true のとき leading/trailing は抑制される（disabled when loading）", () => {
    const jsx = buildComponentJsx(make("Button", { loading: "true", leading: "true", trailing: "true" }), INDENT);
    expect(jsx).toContain(" loading");
    // loading 中は leading/trailing が無効化される
    expect(jsx).not.toContain("leading=");
    expect(jsx).not.toContain("trailing=");
  });
});

// ---------------------------------------------------------------------------
// Group E: minWidth — 代表 3 値（none / Width / token）
// ---------------------------------------------------------------------------
describe("[exhaustive] Button: minWidth — 代表値", () => {
  it('minWidth="none" のとき width=/minWidth=/style= が出力されない（デフォルト）', () => {
    const jsx = buildComponentJsx(make("Button", { minWidth: "none" }), INDENT);
    expect(jsx).not.toContain("width=");
    expect(jsx).not.toContain("style=");
  });

  it('minWidth="Width" のとき width="full" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Button", { minWidth: "Width" }), INDENT);
    expect(jsx).toContain('width="full"');
    expect(jsx).not.toContain("style=");
  });

  it('minWidth="x8Large(80px)" のとき style={{ minWidth: token }} が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Button", { minWidth: "x8Large(80px)" }), INDENT);
    expect(jsx).toContain("style=");
    expect(jsx).toContain("minWidth");
    expect(jsx).toContain("x8Large");
    expect(jsx).not.toContain('width="full"');
  });

  it('minWidth="x16Large(240px)" のとき style={{ minWidth: token }} が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Button", { minWidth: "x16Large(240px)" }), INDENT);
    expect(jsx).toContain("style=");
    expect(jsx).toContain("x16Large");
  });
});

// ---------------------------------------------------------------------------
// Group F: leading slot — Icon / Badge / count
// ---------------------------------------------------------------------------
describe("[exhaustive] Button: leading slot", () => {
  it("leading=true（デフォルト leadingType=Icon）のとき leading={<Icon> が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Button", { leading: "true" }), INDENT);
    expect(jsx).toContain("leading=");
    expect(jsx).toContain("<Icon>");
    expect(jsx).not.toContain("<Badge");
  });

  it("leading=true + leadingType=Badge のとき leading={<Badge が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Button", { leading: "true", leadingType: "Badge" }), INDENT);
    expect(jsx).toContain("leading=");
    expect(jsx).toContain("<Badge");
    expect(jsx).not.toContain("<Icon>");
  });

  it("leading=true + leadingType=Badge + leadingBadge=count のとき count= が出力に含まれる", () => {
    const jsx = buildComponentJsx(
      make("Button", {
        leading: "true",
        leadingType: "Badge",
        leadingBadge: "count",
        leadingBadgeCount: "5",
      }),
      INDENT,
    );
    expect(jsx).toContain("count={5}");
  });
});

// ---------------------------------------------------------------------------
// Group G: trailing slot
// ---------------------------------------------------------------------------
describe("[exhaustive] Button: trailing slot", () => {
  it("trailing=true のとき trailing= が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Button", { trailing: "true" }), INDENT);
    expect(jsx).toContain("trailing=");
  });

  it("trailing=true + trailingType=Badge のとき trailing={<Badge が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Button", { trailing: "true", trailingType: "Badge" }), INDENT);
    expect(jsx).toContain("trailing=");
    expect(jsx).toContain("<Badge");
  });
});

// ---------------------------------------------------------------------------
// Group H: withoutContent
// ---------------------------------------------------------------------------
describe("[exhaustive] Button: withoutContent", () => {
  it("withoutContent=true のとき self-closing で label が出力されない", () => {
    const jsx = buildComponentJsx(make("Button", { withoutContent: "true", label: "Should Not Appear" }), INDENT);
    expect(jsx).toContain("<Button");
    expect(jsx).not.toContain("Should Not Appear");
    // self-closing か </Button> がない
    expect(jsx).not.toContain("</Button>");
  });
});

// ---------------------------------------------------------------------------
// Group I: label
// ---------------------------------------------------------------------------
describe("[exhaustive] Button: label", () => {
  it("label=カスタム文字列が children に反映される", () => {
    const jsx = buildComponentJsx(make("Button", { label: "Submit Form" }), INDENT);
    expect(jsx).toContain("Submit Form");
    expect(jsx).toContain("</Button>");
  });

  it("label 未指定のとき 'Button' がデフォルトとして出る", () => {
    const jsx = buildComponentJsx(make("Button"), INDENT);
    expect(jsx).toContain(">Button<");
  });
});

// ---------------------------------------------------------------------------
// Group J: leading + trailing 同時
// ---------------------------------------------------------------------------
describe("[exhaustive] Button: leading + trailing 同時", () => {
  it("leading=true + trailing=true のとき両方が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Button", { leading: "true", trailing: "true" }), INDENT);
    expect(jsx).toContain("leading=");
    expect(jsx).toContain("trailing=");
  });
});

// ---------------------------------------------------------------------------
// Cat-4: import completeness
// ---------------------------------------------------------------------------
describe("[exhaustive] Button: Cat-4 import completeness", () => {
  it("Button のみのとき collectComponentImports に Button が含まれる", () => {
    const imports = collectComponentImports([make("Button")]);
    expect(imports).toContain("Button");
  });

  it("leading=true（Icon）のとき collectComponentImports に Icon が含まれる", () => {
    const imports = collectComponentImports([make("Button", { leading: "true" })]);
    expect(imports).toContain("Button");
    expect(imports).toContain("Icon");
  });

  it("leading=true + leadingType=Badge のとき collectComponentImports に Badge が含まれる", () => {
    const imports = collectComponentImports([make("Button", { leading: "true", leadingType: "Badge" })]);
    expect(imports).toContain("Button");
    expect(imports).toContain("Badge");
  });

  it("デフォルト Button のとき collectComponentImports に余分な import が含まれない", () => {
    const imports = collectComponentImports([make("Button")]);
    expect(imports).not.toContain("Icon");
    expect(imports).not.toContain("Badge");
    expect(imports).not.toContain("FormControl");
  });
});

// =============================================================================
// グループ1: no-prop（構造確認のみ）
// =============================================================================

// Divider — props なし。固定出力: <Divider />
describe("[exhaustive] Divider: 構造確認", () => {
  it("<Divider /> が出力される", () => {
    const jsx = buildComponentJsx(make("Divider"), INDENT);
    expect(jsx).toBe(\`\${INDENT}<Divider />\`);
  });
});

describe("[exhaustive] Divider: Cat-4 import completeness", () => {
  it("collectComponentImports に Divider が含まれる", () => {
    const imports = collectComponentImports([make("Divider")]);
    expect(imports).toContain("Divider");
    expect(imports).not.toContain("Icon");
  });
});

// DividerVertical — props なし。固定出力: <DividerVertical />
describe("[exhaustive] DividerVertical: 構造確認", () => {
  it("<DividerVertical /> が出力される", () => {
    const jsx = buildComponentJsx(make("DividerVertical"), INDENT);
    expect(jsx).toBe(\`\${INDENT}<DividerVertical />\`);
  });
});

describe("[exhaustive] DividerVertical: Cat-4 import completeness", () => {
  it("collectComponentImports に DividerVertical が含まれる", () => {
    const imports = collectComponentImports([make("DividerVertical")]);
    expect(imports).toContain("DividerVertical");
  });
});

// Calendar — props なし。固定出力: <Calendar />
describe("[exhaustive] Calendar: 構造確認", () => {
  it("<Calendar /> が出力される", () => {
    const jsx = buildComponentJsx(make("Calendar"), INDENT);
    expect(jsx).toBe(\`\${INDENT}<Calendar />\`);
  });
});

describe("[exhaustive] Calendar: Cat-4 import completeness", () => {
  it("collectComponentImports に Calendar が含まれる", () => {
    const imports = collectComponentImports([make("Calendar")]);
    expect(imports).toContain("Calendar");
  });
});

// RangeCalendar — props なし。固定出力: <RangeCalendar />
describe("[exhaustive] RangeCalendar: 構造確認", () => {
  it("<RangeCalendar /> が出力される", () => {
    const jsx = buildComponentJsx(make("RangeCalendar"), INDENT);
    expect(jsx).toBe(\`\${INDENT}<RangeCalendar />\`);
  });
});

describe("[exhaustive] RangeCalendar: Cat-4 import completeness", () => {
  it("collectComponentImports に RangeCalendar が含まれる", () => {
    const imports = collectComponentImports([make("RangeCalendar")]);
    expect(imports).toContain("RangeCalendar");
  });
});

// =============================================================================
// グループ2: single text prop
// =============================================================================

// Blockquote — key: "text", default: "Sample quotation text."
describe("[exhaustive] Blockquote: text prop", () => {
  it("text カスタム値が children に反映される", () => {
    const jsx = buildComponentJsx(make("Blockquote", { text: "Custom quote" }), INDENT);
    expect(jsx).toContain("Custom quote");
    expect(jsx).toContain("<Blockquote>");
    expect(jsx).toContain("</Blockquote>");
  });

  it("text 未指定のとき 'Sample quotation text.' がデフォルト", () => {
    const jsx = buildComponentJsx(make("Blockquote"), INDENT);
    expect(jsx).toContain("Sample quotation text.");
  });
});

describe("[exhaustive] Blockquote: Cat-4 import completeness", () => {
  it("collectComponentImports に Blockquote が含まれる", () => {
    const imports = collectComponentImports([make("Blockquote")]);
    expect(imports).toContain("Blockquote");
  });
});

// Code — key: "text" (not "code"), default: "const x = 42;"
describe("[exhaustive] Code: text prop (key は 'text' であり 'code' ではない)", () => {
  it("text カスタム値が children に反映される", () => {
    const jsx = buildComponentJsx(make("Code", { text: "let y = 0;" }), INDENT);
    expect(jsx).toContain("let y = 0;");
    expect(jsx).toContain("<Code>");
    expect(jsx).toContain("</Code>");
  });

  it("'code' キーは読まれない（key は text）", () => {
    const jsx = buildComponentJsx(make("Code", { code: "ignored" }), INDENT);
    expect(jsx).not.toContain("ignored");
    // デフォルトが出る
    expect(jsx).toContain("const x = 42;");
  });

  it("text 未指定のとき 'const x = 42;' がデフォルト", () => {
    const jsx = buildComponentJsx(make("Code"), INDENT);
    expect(jsx).toContain("const x = 42;");
  });
});

describe("[exhaustive] Code: Cat-4 import completeness", () => {
  it("collectComponentImports に Code が含まれる", () => {
    const imports = collectComponentImports([make("Code")]);
    expect(imports).toContain("Code");
  });
});

// CodeBlock — key: "text" (not "code")
describe("[exhaustive] CodeBlock: text prop (key は 'text' であり 'code' ではない)", () => {
  it("text カスタム値がバッククォート内に反映される", () => {
    const jsx = buildComponentJsx(make("CodeBlock", { text: "const z = 1;" }), INDENT);
    expect(jsx).toContain("const z = 1;");
    expect(jsx).toContain("<CodeBlock>");
    expect(jsx).toContain("</CodeBlock>");
  });

  it("text 未指定のとき 'function hello()' がデフォルトコードの一部として出る", () => {
    const jsx = buildComponentJsx(make("CodeBlock"), INDENT);
    expect(jsx).toContain("function hello()");
  });
});

describe("[exhaustive] CodeBlock: Cat-4 import completeness", () => {
  it("collectComponentImports に CodeBlock が含まれる", () => {
    const imports = collectComponentImports([make("CodeBlock")]);
    expect(imports).toContain("CodeBlock");
  });
});

// Table — JSX タグを出さずコメントのみ
describe("[exhaustive] Table: コメントのみ出力", () => {
  it("Table は JSX タグでなくコメントブロックを出力する", () => {
    const jsx = buildComponentJsx(make("Table"), INDENT);
    expect(jsx).toContain("{/*");
    expect(jsx).toContain("Table");
    expect(jsx).not.toContain("<Table>");
    expect(jsx).not.toContain("<Table ");
  });
});

// Skeleton — 固定出力: <Skeleton width={200} height={20} />
describe("[exhaustive] Skeleton: 固定出力", () => {
  it("<Skeleton width={200} height={20} /> が出力される", () => {
    const jsx = buildComponentJsx(make("Skeleton"), INDENT);
    expect(jsx).toContain("<Skeleton");
    expect(jsx).toContain("width={200}");
    expect(jsx).toContain("height={20}");
  });
});

describe("[exhaustive] Skeleton: Cat-4 import completeness", () => {
  it("collectComponentImports に Skeleton が含まれる", () => {
    const imports = collectComponentImports([make("Skeleton")]);
    expect(imports).toContain("Skeleton");
  });
});

// Radio — RadioGroup scaffold（T2）
describe("[exhaustive] Radio: RadioGroup scaffold 出力", () => {
  it("RadioGroup の中に Radio が含まれる", () => {
    const jsx = buildComponentJsx(make("Radio"), INDENT);
    expect(jsx).toContain("<RadioGroup>");
    expect(jsx).toContain("<Radio ");
    expect(jsx).toContain("</RadioGroup>");
  });

  it("scaffold コメントが含まれる", () => {
    const jsx = buildComponentJsx(make("Radio"), INDENT);
    expect(jsx).toContain("{/*");
  });
});

describe("[exhaustive] Radio: Cat-4 import completeness", () => {
  it("collectComponentImports に RadioGroup と Radio が含まれる", () => {
    const imports = collectComponentImports([make("Radio")]);
    expect(imports).toContain("Radio");
    expect(imports).toContain("RadioGroup");
  });
});

// =============================================================================
// グループ3: fcLabel only — Date/Time 8件
// builder が読むキー: fcLabel (default 値は各コンポーネント参照)
// =============================================================================

// DateField — default: "Date"
describe("[exhaustive] DateField: fcLabel prop (default: 'Date')", () => {
  it("fcLabel カスタム値が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("DateField", { fcLabel: "契約日" }), INDENT);
    expect(jsx).toContain("契約日");
    expect(jsx).toContain("<DateField />");
  });

  it("fcLabel 未指定のとき 'Date' がデフォルト", () => {
    const jsx = buildComponentJsx(make("DateField"), INDENT);
    expect(jsx).toContain(">Date<");
  });
});

describe("[exhaustive] DateField: Cat-4 import completeness", () => {
  it("collectComponentImports に DateField と FormControl が含まれる", () => {
    const imports = collectComponentImports([make("DateField")]);
    expect(imports).toContain("DateField");
    expect(imports).toContain("FormControl");
  });
});

// DatePicker — default: "Date"
describe("[exhaustive] DatePicker: fcLabel prop (default: 'Date')", () => {
  it("fcLabel カスタム値が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("DatePicker", { fcLabel: "開始日" }), INDENT);
    expect(jsx).toContain("開始日");
    expect(jsx).toContain("<DatePicker />");
  });

  it("fcLabel 未指定のとき 'Date' がデフォルト", () => {
    const jsx = buildComponentJsx(make("DatePicker"), INDENT);
    expect(jsx).toContain(">Date<");
  });
});

describe("[exhaustive] DatePicker: Cat-4 import completeness", () => {
  it("collectComponentImports に DatePicker と FormControl が含まれる", () => {
    const imports = collectComponentImports([make("DatePicker")]);
    expect(imports).toContain("DatePicker");
    expect(imports).toContain("FormControl");
  });
});

// RangeDateField — default: "Date Range"
describe("[exhaustive] RangeDateField: fcLabel prop (default: 'Date Range')", () => {
  it("fcLabel カスタム値が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("RangeDateField", { fcLabel: "期間" }), INDENT);
    expect(jsx).toContain("期間");
    expect(jsx).toContain("<RangeDateField />");
  });

  it("fcLabel 未指定のとき 'Date Range' がデフォルト", () => {
    const jsx = buildComponentJsx(make("RangeDateField"), INDENT);
    expect(jsx).toContain("Date Range");
  });
});

describe("[exhaustive] RangeDateField: Cat-4 import completeness", () => {
  it("collectComponentImports に RangeDateField と FormControl が含まれる", () => {
    const imports = collectComponentImports([make("RangeDateField")]);
    expect(imports).toContain("RangeDateField");
    expect(imports).toContain("FormControl");
  });
});

// RangeDatePicker — default: "Date Range"
describe("[exhaustive] RangeDatePicker: fcLabel prop (default: 'Date Range')", () => {
  it("fcLabel カスタム値が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("RangeDatePicker", { fcLabel: "有効期間" }), INDENT);
    expect(jsx).toContain("有効期間");
    expect(jsx).toContain("<RangeDatePicker />");
  });

  it("fcLabel 未指定のとき 'Date Range' がデフォルト", () => {
    const jsx = buildComponentJsx(make("RangeDatePicker"), INDENT);
    expect(jsx).toContain("Date Range");
  });
});

describe("[exhaustive] RangeDatePicker: Cat-4 import completeness", () => {
  it("collectComponentImports に RangeDatePicker と FormControl が含まれる", () => {
    const imports = collectComponentImports([make("RangeDatePicker")]);
    expect(imports).toContain("RangeDatePicker");
    expect(imports).toContain("FormControl");
  });
});

// TimeField — default: "Time"
describe("[exhaustive] TimeField: fcLabel prop (default: 'Time')", () => {
  it("fcLabel カスタム値が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("TimeField", { fcLabel: "開始時刻" }), INDENT);
    expect(jsx).toContain("開始時刻");
    expect(jsx).toContain("<TimeField />");
  });

  it("fcLabel 未指定のとき 'Time' がデフォルト", () => {
    const jsx = buildComponentJsx(make("TimeField"), INDENT);
    expect(jsx).toContain(">Time<");
  });
});

describe("[exhaustive] TimeField: Cat-4 import completeness", () => {
  it("collectComponentImports に TimeField と FormControl が含まれる", () => {
    const imports = collectComponentImports([make("TimeField")]);
    expect(imports).toContain("TimeField");
    expect(imports).toContain("FormControl");
  });
});

// TimePicker — default: "Time"
describe("[exhaustive] TimePicker: fcLabel prop (default: 'Time')", () => {
  it("fcLabel カスタム値が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("TimePicker", { fcLabel: "終了時刻" }), INDENT);
    expect(jsx).toContain("終了時刻");
    expect(jsx).toContain("<TimePicker />");
  });

  it("fcLabel 未指定のとき 'Time' がデフォルト", () => {
    const jsx = buildComponentJsx(make("TimePicker"), INDENT);
    expect(jsx).toContain(">Time<");
  });
});

describe("[exhaustive] TimePicker: Cat-4 import completeness", () => {
  it("collectComponentImports に TimePicker と FormControl が含まれる", () => {
    const imports = collectComponentImports([make("TimePicker")]);
    expect(imports).toContain("TimePicker");
    expect(imports).toContain("FormControl");
  });
});

// RangeTimeField — default: "Time Range"
describe("[exhaustive] RangeTimeField: fcLabel prop (default: 'Time Range')", () => {
  it("fcLabel カスタム値が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("RangeTimeField", { fcLabel: "時間帯" }), INDENT);
    expect(jsx).toContain("時間帯");
    expect(jsx).toContain("<RangeTimeField />");
  });

  it("fcLabel 未指定のとき 'Time Range' がデフォルト", () => {
    const jsx = buildComponentJsx(make("RangeTimeField"), INDENT);
    expect(jsx).toContain("Time Range");
  });
});

describe("[exhaustive] RangeTimeField: Cat-4 import completeness", () => {
  it("collectComponentImports に RangeTimeField と FormControl が含まれる", () => {
    const imports = collectComponentImports([make("RangeTimeField")]);
    expect(imports).toContain("RangeTimeField");
    expect(imports).toContain("FormControl");
  });
});

// RangeTimePicker — default: "Time Range"
describe("[exhaustive] RangeTimePicker: fcLabel prop (default: 'Time Range')", () => {
  it("fcLabel カスタム値が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("RangeTimePicker", { fcLabel: "稼働時間" }), INDENT);
    expect(jsx).toContain("稼働時間");
    expect(jsx).toContain("<RangeTimePicker />");
  });

  it("fcLabel 未指定のとき 'Time Range' がデフォルト", () => {
    const jsx = buildComponentJsx(make("RangeTimePicker"), INDENT);
    expect(jsx).toContain("Time Range");
  });
});

describe("[exhaustive] RangeTimePicker: Cat-4 import completeness", () => {
  it("collectComponentImports に RangeTimePicker と FormControl が含まれる", () => {
    const imports = collectComponentImports([make("RangeTimePicker")]);
    expect(imports).toContain("RangeTimePicker");
    expect(imports).toContain("FormControl");
  });
});

// =============================================================================
// グループ4: Tag 類似（color/variant/size/label）
// =============================================================================

// StatusLabel
// builder キー: size (sp threshold="medium"), color (sp threshold="neutral"),
//               variant (sp threshold="outline"), label (.split(",")[0])
describe("[exhaustive] StatusLabel: size sp threshold", () => {
  it('size="medium" のとき size= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("StatusLabel", { size: "medium" }), INDENT);
    expect(jsx).not.toContain("size=");
  });

  it.each(["large", "small"] as const)('size="%s" が出力に含まれる', (size) => {
    const jsx = buildComponentJsx(make("StatusLabel", { size }), INDENT);
    expect(jsx).toContain(\`size="\${size}"\`);
  });
});

describe("[exhaustive] StatusLabel: color sp threshold", () => {
  it('color="neutral" のとき color= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("StatusLabel", { color: "neutral" }), INDENT);
    expect(jsx).not.toContain("color=");
  });

  it.each(["red", "teal", "blue", "information"] as const)('color="%s" が出力に含まれる', (color) => {
    const jsx = buildComponentJsx(make("StatusLabel", { color }), INDENT);
    expect(jsx).toContain(\`color="\${color}"\`);
  });
});

describe("[exhaustive] StatusLabel: variant sp threshold", () => {
  it('variant="outline" のとき variant= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("StatusLabel", { variant: "outline" }), INDENT);
    expect(jsx).not.toContain("variant=");
  });

  it('variant="fill" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("StatusLabel", { variant: "fill" }), INDENT);
    expect(jsx).toContain('variant="fill"');
  });
});

describe("[exhaustive] StatusLabel: label の split 挙動", () => {
  it("label がカンマ区切りのとき最初の値のみ使用される", () => {
    const jsx = buildComponentJsx(make("StatusLabel", { label: "Active,Inactive" }), INDENT);
    expect(jsx).toContain("Active");
    expect(jsx).not.toContain("Inactive");
  });

  it("label 未指定のとき 'Status' がデフォルト", () => {
    const jsx = buildComponentJsx(make("StatusLabel"), INDENT);
    expect(jsx).toContain(">Status<");
  });
});

describe("[exhaustive] StatusLabel: Cat-4 import completeness", () => {
  it("collectComponentImports に StatusLabel が含まれる", () => {
    const imports = collectComponentImports([make("StatusLabel")]);
    expect(imports).toContain("StatusLabel");
  });
});

// CheckboxCard
// builder キー: size (sp threshold="medium"), variant (sp threshold="plain"),
//               color (sp threshold="neutral"), label
describe("[exhaustive] CheckboxCard: sp thresholds", () => {
  it('size="medium" のとき size= が出力されない', () => {
    const jsx = buildComponentJsx(make("CheckboxCard", { size: "medium" }), INDENT);
    expect(jsx).not.toContain("size=");
  });

  it('size="large" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("CheckboxCard", { size: "large" }), INDENT);
    expect(jsx).toContain('size="large"');
  });

  it('variant="plain" のとき variant= が出力されない', () => {
    const jsx = buildComponentJsx(make("CheckboxCard", { variant: "plain" }), INDENT);
    expect(jsx).not.toContain("variant=");
  });

  it('variant="border" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("CheckboxCard", { variant: "border" }), INDENT);
    expect(jsx).toContain('variant="border"');
  });

  it('color="neutral" のとき color= が出力されない', () => {
    const jsx = buildComponentJsx(make("CheckboxCard", { color: "neutral" }), INDENT);
    expect(jsx).not.toContain("color=");
  });

  it('color="brand" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("CheckboxCard", { color: "brand" }), INDENT);
    expect(jsx).toContain('color="brand"');
  });
});

describe("[exhaustive] CheckboxCard: label", () => {
  it("label カスタム値が children に反映される", () => {
    const jsx = buildComponentJsx(make("CheckboxCard", { label: "Option A" }), INDENT);
    expect(jsx).toContain("Option A");
  });

  it("label 未指定のとき 'Checkbox Card' がデフォルト", () => {
    const jsx = buildComponentJsx(make("CheckboxCard"), INDENT);
    expect(jsx).toContain("Checkbox Card");
  });
});

describe("[exhaustive] CheckboxCard: Cat-4 import completeness", () => {
  it("collectComponentImports に CheckboxCard が含まれる", () => {
    const imports = collectComponentImports([make("CheckboxCard")]);
    expect(imports).toContain("CheckboxCard");
  });
});

// RadioCard
// builder キー: size (sp threshold="medium"), variant (sp threshold="plain"), label
describe("[exhaustive] RadioCard: sp thresholds", () => {
  it('size="medium" のとき size= が出力されない', () => {
    const jsx = buildComponentJsx(make("RadioCard", { size: "medium" }), INDENT);
    expect(jsx).not.toContain("size=");
  });

  it('size="large" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("RadioCard", { size: "large" }), INDENT);
    expect(jsx).toContain('size="large"');
  });

  it('variant="plain" のとき variant= が出力されない', () => {
    const jsx = buildComponentJsx(make("RadioCard", { variant: "plain" }), INDENT);
    expect(jsx).not.toContain("variant=");
  });

  it('variant="border" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("RadioCard", { variant: "border" }), INDENT);
    expect(jsx).toContain('variant="border"');
  });
});

describe("[exhaustive] RadioCard: label", () => {
  it("label カスタム値が children に反映される", () => {
    const jsx = buildComponentJsx(make("RadioCard", { label: "Plan B" }), INDENT);
    expect(jsx).toContain("Plan B");
  });

  it("label 未指定のとき 'Radio Card' がデフォルト", () => {
    const jsx = buildComponentJsx(make("RadioCard"), INDENT);
    expect(jsx).toContain("Radio Card");
  });
});

describe("[exhaustive] RadioCard: Cat-4 import completeness", () => {
  it("collectComponentImports に RadioCard が含まれる", () => {
    const imports = collectComponentImports([make("RadioCard")]);
    expect(imports).toContain("RadioCard");
  });
});

// Badge
// builder キー: color (sp threshold="neutral"), 固定 count: children=3
describe("[exhaustive] Badge: color sp threshold", () => {
  it('color="neutral" のとき color= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("Badge", { color: "neutral" }), INDENT);
    expect(jsx).not.toContain("color=");
  });

  it.each(["information", "danger", "success"] as const)('color="%s" が出力に含まれる', (color) => {
    const jsx = buildComponentJsx(make("Badge", { color }), INDENT);
    expect(jsx).toContain(\`color="\${color}"\`);
  });
});

describe("[exhaustive] Badge: 固定 count=3", () => {
  it("children に 3 が含まれる（固定値）", () => {
    const jsx = buildComponentJsx(make("Badge"), INDENT);
    expect(jsx).toContain(">3<");
    expect(jsx).toContain("<Badge");
    expect(jsx).toContain("</Badge>");
  });
});

describe("[exhaustive] Badge: Cat-4 import completeness", () => {
  it("collectComponentImports に Badge が含まれる", () => {
    const imports = collectComponentImports([make("Badge")]);
    expect(imports).toContain("Badge");
  });
});

// =============================================================================
// グループ5: boolean + text
// =============================================================================

// Link — key: label (default:"Link"), url→href (default:"#"), external=bool→target/rel
describe("[exhaustive] Link: label と url", () => {
  it("label カスタム値が children に反映される", () => {
    const jsx = buildComponentJsx(make("Link", { label: "公式サイト" }), INDENT);
    expect(jsx).toContain("公式サイト");
  });

  it("url カスタム値が href= に反映される", () => {
    const jsx = buildComponentJsx(make("Link", { url: "https://example.com" }), INDENT);
    expect(jsx).toContain('href="https://example.com"');
  });

  it("url 未指定のとき href='#' がデフォルト", () => {
    const jsx = buildComponentJsx(make("Link"), INDENT);
    expect(jsx).toContain('href="#"');
  });
});

describe("[exhaustive] Link: external boolean", () => {
  it("external=true のとき target='_blank' と rel='noreferrer' が出力される", () => {
    const jsx = buildComponentJsx(make("Link", { external: "true" }), INDENT);
    expect(jsx).toContain('target="_blank"');
    expect(jsx).toContain('rel="noreferrer"');
  });

  it("external=false のとき target= と rel= が出力されない", () => {
    const jsx = buildComponentJsx(make("Link", { external: "false" }), INDENT);
    expect(jsx).not.toContain("target=");
    expect(jsx).not.toContain("rel=");
  });
});

describe("[exhaustive] Link: Cat-4 import completeness", () => {
  it("collectComponentImports に Link が含まれる", () => {
    const imports = collectComponentImports([make("Link")]);
    expect(imports).toContain("Link");
  });
});

// Checkbox — noLabel=bool → self-closing, label key: "label"
describe("[exhaustive] Checkbox: noLabel boolean", () => {
  it("noLabel=true のとき self-closing <Checkbox /> になる", () => {
    const jsx = buildComponentJsx(make("Checkbox", { noLabel: "true" }), INDENT);
    expect(jsx).toBe(\`\${INDENT}<Checkbox />\`);
    expect(jsx).not.toContain("</Checkbox>");
  });

  it("noLabel=false のとき label が children に出る", () => {
    const jsx = buildComponentJsx(make("Checkbox", { noLabel: "false", label: "同意する" }), INDENT);
    expect(jsx).toContain("同意する");
    expect(jsx).toContain("</Checkbox>");
  });

  it("label 未指定のとき 'Checkbox' がデフォルト", () => {
    const jsx = buildComponentJsx(make("Checkbox"), INDENT);
    expect(jsx).toContain(">Checkbox<");
  });
});

describe("[exhaustive] Checkbox: Cat-4 import completeness", () => {
  it("collectComponentImports に Checkbox が含まれる", () => {
    const imports = collectComponentImports([make("Checkbox")]);
    expect(imports).toContain("Checkbox");
  });
});

// FileDrop — key: text (default:"Drop files here..."), multiple=bool
describe("[exhaustive] FileDrop: text と multiple", () => {
  it("text カスタム値が children に反映される", () => {
    const jsx = buildComponentJsx(make("FileDrop", { text: "ファイルをドロップ" }), INDENT);
    expect(jsx).toContain("ファイルをドロップ");
  });

  it("text 未指定のとき 'Drop files here or click to upload' がデフォルト", () => {
    const jsx = buildComponentJsx(make("FileDrop"), INDENT);
    expect(jsx).toContain("Drop files here or click to upload");
  });

  it("multiple=true のとき multiple 属性が出力される", () => {
    const jsx = buildComponentJsx(make("FileDrop", { multiple: "true" }), INDENT);
    expect(jsx).toContain(" multiple");
  });

  it("multiple=false のとき multiple 属性が出力されない", () => {
    const jsx = buildComponentJsx(make("FileDrop", { multiple: "false" }), INDENT);
    expect(jsx).not.toContain("multiple");
  });
});

describe("[exhaustive] FileDrop: Cat-4 import completeness", () => {
  it("collectComponentImports に FileDrop が含まれる", () => {
    const imports = collectComponentImports([make("FileDrop")]);
    expect(imports).toContain("FileDrop");
  });
});

// EmptyState — key: titleText, size sp: "medium"
describe("[exhaustive] EmptyState: titleText と size", () => {
  it("titleText カスタム値が title= に反映される", () => {
    const jsx = buildComponentJsx(make("EmptyState", { titleText: "データなし" }), INDENT);
    expect(jsx).toContain('title="データなし"');
  });

  it("titleText 未指定のとき 'No items found' がデフォルト", () => {
    const jsx = buildComponentJsx(make("EmptyState"), INDENT);
    expect(jsx).toContain('title="No items found"');
  });

  it('size="medium" のとき size= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("EmptyState", { size: "medium" }), INDENT);
    expect(jsx).not.toContain("size=");
  });

  it('size="large" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("EmptyState", { size: "large" }), INDENT);
    expect(jsx).toContain('size="large"');
  });
});

describe("[exhaustive] EmptyState: Cat-4 import completeness", () => {
  it("collectComponentImports に EmptyState が含まれる", () => {
    const imports = collectComponentImports([make("EmptyState")]);
    expect(imports).toContain("EmptyState");
  });
});

// Switch — key: size (sp="small"), color (sp="information"), labelPosition (sp="end"), label
describe("[exhaustive] Switch: sp thresholds", () => {
  it('size="small" のとき size= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("Switch", { size: "small" }), INDENT);
    expect(jsx).not.toContain("size=");
  });

  it('size="large" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Switch", { size: "large" }), INDENT);
    expect(jsx).toContain('size="large"');
  });

  it('color="information" のとき color= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("Switch", { color: "information" }), INDENT);
    expect(jsx).not.toContain("color=");
  });

  it('color="brand" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Switch", { color: "brand" }), INDENT);
    expect(jsx).toContain('color="brand"');
  });

  it('labelPosition="end" のとき labelPosition= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("Switch", { labelPosition: "end" }), INDENT);
    expect(jsx).not.toContain("labelPosition=");
  });

  it('labelPosition="start" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Switch", { labelPosition: "start" }), INDENT);
    expect(jsx).toContain('labelPosition="start"');
  });
});

describe("[exhaustive] Switch: label", () => {
  it("label カスタム値が children に反映される", () => {
    const jsx = buildComponentJsx(make("Switch", { label: "通知を有効化" }), INDENT);
    expect(jsx).toContain("通知を有効化");
  });

  it("label 未指定のとき 'Toggle Option' がデフォルト", () => {
    const jsx = buildComponentJsx(make("Switch"), INDENT);
    expect(jsx).toContain("Toggle Option");
  });
});

describe("[exhaustive] Switch: Cat-4 import completeness", () => {
  it("collectComponentImports に Switch が含まれる", () => {
    const imports = collectComponentImports([make("Switch")]);
    expect(imports).toContain("Switch");
  });
});

// =============================================================================
// グループ6: FormControl ファミリー
// =============================================================================

// TextField — key: fcLabel (not "label"), placeholder, size sp="medium"
describe("[exhaustive] TextField: fcLabel・placeholder・size", () => {
  it("fcLabel カスタム値が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("TextField", { fcLabel: "メールアドレス" }), INDENT);
    expect(jsx).toContain("メールアドレス");
    expect(jsx).toContain("<TextField");
  });

  it("'label' キーは FormControl.Label に反映されない（fcLabel が正）", () => {
    const jsx = buildComponentJsx(make("TextField", { label: "ignored" }), INDENT);
    expect(jsx).not.toContain("ignored");
    // デフォルトが出る
    expect(jsx).toContain(">Label<");
  });

  it("placeholder が属性として出力される", () => {
    const jsx = buildComponentJsx(make("TextField", { placeholder: "入力してください" }), INDENT);
    expect(jsx).toContain('placeholder="入力してください"');
  });

  it("placeholder 未指定のとき placeholder= が出力されない", () => {
    const jsx = buildComponentJsx(make("TextField"), INDENT);
    expect(jsx).not.toContain("placeholder=");
  });

  it('size="medium" のとき size= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("TextField", { size: "medium" }), INDENT);
    expect(jsx).not.toContain("size=");
  });

  it('size="large" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("TextField", { size: "large" }), INDENT);
    expect(jsx).toContain('size="large"');
  });
});

describe("[exhaustive] TextField: Cat-4 import completeness", () => {
  it("collectComponentImports に TextField と FormControl が含まれる", () => {
    const imports = collectComponentImports([make("TextField")]);
    expect(imports).toContain("TextField");
    expect(imports).toContain("FormControl");
  });
});

// Textarea — key: fcLabel, placeholder, minRows (default "3" → omit, 他 → rows={n})
describe("[exhaustive] Textarea: fcLabel・placeholder・minRows", () => {
  it("fcLabel カスタム値が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("Textarea", { fcLabel: "備考" }), INDENT);
    expect(jsx).toContain("備考");
  });

  it("placeholder が属性として出力される", () => {
    const jsx = buildComponentJsx(make("Textarea", { placeholder: "テキストを入力" }), INDENT);
    expect(jsx).toContain('placeholder="テキストを入力"');
  });

  it('minRows="3" のとき rows= が出力されない（デフォルト値と同じ）', () => {
    const jsx = buildComponentJsx(make("Textarea", { minRows: "3" }), INDENT);
    expect(jsx).not.toContain("rows=");
  });

  it('minRows="5" のとき rows={5} が出力される', () => {
    const jsx = buildComponentJsx(make("Textarea", { minRows: "5" }), INDENT);
    expect(jsx).toContain("rows={5}");
  });

  it('minRows="1" のとき rows={1} が出力される（1 !== "3"）', () => {
    const jsx = buildComponentJsx(make("Textarea", { minRows: "1" }), INDENT);
    expect(jsx).toContain("rows={1}");
  });
});

describe("[exhaustive] Textarea: Cat-4 import completeness", () => {
  it("collectComponentImports に Textarea と FormControl が含まれる", () => {
    const imports = collectComponentImports([make("Textarea")]);
    expect(imports).toContain("Textarea");
    expect(imports).toContain("FormControl");
  });
});

// FormControl — key: fcLabel, placeholder, required=bool, fcCaptionText (空→ Caption omit)
describe("[exhaustive] FormControl: fcLabel・placeholder・required・fcCaptionText", () => {
  it("fcLabel カスタム値が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("FormControl", { fcLabel: "氏名" }), INDENT);
    expect(jsx).toContain("氏名");
  });

  it("required=true のとき required 属性が出力される", () => {
    const jsx = buildComponentJsx(make("FormControl", { required: "true" }), INDENT);
    expect(jsx).toContain(" required");
  });

  it("required=false のとき required 属性が出力されない", () => {
    const jsx = buildComponentJsx(make("FormControl", { required: "false" }), INDENT);
    expect(jsx).not.toContain(" required");
  });

  it("fcCaptionText が指定されると FormControl.Caption が出力される", () => {
    const jsx = buildComponentJsx(make("FormControl", { fcCaptionText: "半角英数字で入力" }), INDENT);
    expect(jsx).toContain("FormControl.Caption");
    expect(jsx).toContain("半角英数字で入力");
  });

  it("fcCaptionText が空のとき FormControl.Caption が出力されない", () => {
    const jsx = buildComponentJsx(make("FormControl", { fcCaptionText: "" }), INDENT);
    expect(jsx).not.toContain("Caption");
  });

  it("fcCaptionText 未指定のとき FormControl.Caption が出力されない", () => {
    const jsx = buildComponentJsx(make("FormControl"), INDENT);
    expect(jsx).not.toContain("Caption");
  });
});

describe("[exhaustive] FormControl: Cat-4 import completeness", () => {
  it("collectComponentImports に FormControl と TextField が含まれる", () => {
    const imports = collectComponentImports([make("FormControl")]);
    expect(imports).toContain("FormControl");
    expect(imports).toContain("TextField");
  });
});

// Search — key: size (sp="medium"), placeholder (default:"Search...")
describe("[exhaustive] Search: size と placeholder", () => {
  it('size="medium" のとき size= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("Search", { size: "medium" }), INDENT);
    expect(jsx).not.toContain("size=");
  });

  it('size="large" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Search", { size: "large" }), INDENT);
    expect(jsx).toContain('size="large"');
  });

  it("placeholder カスタム値が出力される", () => {
    const jsx = buildComponentJsx(make("Search", { placeholder: "キーワードを入力" }), INDENT);
    expect(jsx).toContain('placeholder="キーワードを入力"');
  });

  it("placeholder 未指定のとき 'Search...' がデフォルト", () => {
    const jsx = buildComponentJsx(make("Search"), INDENT);
    expect(jsx).toContain('placeholder="Search..."');
  });
});

describe("[exhaustive] Search: Cat-4 import completeness", () => {
  it("collectComponentImports に Search が含まれる", () => {
    const imports = collectComponentImports([make("Search")]);
    expect(imports).toContain("Search");
  });
});

// Select — key: fcLabel, size sp="medium"; menuItems → options; placeholder; variant; clearable
describe("[exhaustive] Select: fcLabel・size・menuItems・placeholder・variant・clearable", () => {
  it("fcLabel カスタム値が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("Select", { fcLabel: "都道府県" }), INDENT);
    expect(jsx).toContain("都道府県");
  });

  it('size="medium" のとき size= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("Select", { size: "medium" }), INDENT);
    expect(jsx).not.toContain("size=");
  });

  it('size="large" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Select", { size: "large" }), INDENT);
    expect(jsx).toContain('size="large"');
  });

  it("menuItems 未指定のときフォールバック Option A/B/C が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Select"), INDENT);
    expect(jsx).toContain("Option A");
    expect(jsx).toContain("Option B");
    expect(jsx).toContain("Option C");
  });

  it("menuItems カスタム値が options に反映される", () => {
    const jsx = buildComponentJsx(make("Select", { menuItems: "カテゴリ A,カテゴリ B,カテゴリ C" }), INDENT);
    expect(jsx).toContain("カテゴリ A");
    expect(jsx).toContain("カテゴリ B");
    expect(jsx).toContain("カテゴリ C");
  });

  it("placeholder カスタム値が placeholder= に反映される", () => {
    const jsx = buildComponentJsx(make("Select", { placeholder: "選択してください" }), INDENT);
    expect(jsx).toContain('placeholder="選択してください"');
  });

  it("placeholder 未指定のとき 'Select...' がデフォルトで出る", () => {
    const jsx = buildComponentJsx(make("Select"), INDENT);
    expect(jsx).toContain('placeholder="Select..."');
  });

  it('variant="gutterless" が出力に反映される', () => {
    const jsx = buildComponentJsx(make("Select", { variant: "gutterless" }), INDENT);
    expect(jsx).toContain('variant="gutterless"');
  });

  it('variant="outline"（default）のとき variant= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("Select", { variant: "outline" }), INDENT);
    expect(jsx).not.toContain("variant=");
  });

  it("clearable=true のとき clearable が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Select", { clearable: "true" }), INDENT);
    expect(jsx).toContain("clearable");
  });

  it("clearable 未設定のとき clearable が出力に含まれない", () => {
    const jsx = buildComponentJsx(make("Select"), INDENT);
    expect(jsx).not.toContain("clearable");
  });
});

describe("[exhaustive] Select: Cat-4 import completeness", () => {
  it("collectComponentImports に Select と FormControl が含まれる", () => {
    const imports = collectComponentImports([make("Select")]);
    expect(imports).toContain("Select");
    expect(imports).toContain("FormControl");
  });
});

// Combobox — key: fcLabel, size sp="medium"; menuItems → options; creatable
describe("[exhaustive] Combobox: fcLabel・size・menuItems・creatable", () => {
  it("fcLabel カスタム値が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("Combobox", { fcLabel: "タグ選択" }), INDENT);
    expect(jsx).toContain("タグ選択");
    expect(jsx).toContain("<Combobox");
  });

  it('size="medium" のとき size= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("Combobox", { size: "medium" }), INDENT);
    expect(jsx).not.toContain("size=");
  });

  it('size="large" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Combobox", { size: "large" }), INDENT);
    expect(jsx).toContain('size="large"');
  });

  it("menuItems 未指定のときフォールバック Option A/B/C が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Combobox"), INDENT);
    expect(jsx).toContain("Option A");
    expect(jsx).toContain("Option B");
    expect(jsx).toContain("Option C");
  });

  it("menuItems カスタム値が options に反映される", () => {
    const jsx = buildComponentJsx(make("Combobox", { menuItems: "Alice,Bob,Carol" }), INDENT);
    expect(jsx).toContain("Alice");
    expect(jsx).toContain("Bob");
    expect(jsx).toContain("Carol");
  });

  it("creatable=true のとき creatable が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Combobox", { creatable: "true" }), INDENT);
    expect(jsx).toContain("creatable");
  });

  it("creatable 未設定のとき creatable が出力に含まれない", () => {
    const jsx = buildComponentJsx(make("Combobox"), INDENT);
    expect(jsx).not.toContain("creatable");
  });
});

describe("[exhaustive] Combobox: Cat-4 import completeness", () => {
  it("collectComponentImports に Combobox と FormControl が含まれる", () => {
    const imports = collectComponentImports([make("Combobox")]);
    expect(imports).toContain("Combobox");
    expect(imports).toContain("FormControl");
  });
});

// TagInput — fcLabel / size / variant / shrinkOnBlur / addCaption / defaultTags / maxSelection / leading / trailing / withToolbar
describe("[exhaustive] TagInput: fcLabel", () => {
  it("fcLabel カスタム値が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("TagInput", { fcLabel: "タグ" }), INDENT);
    expect(jsx).toContain("タグ");
    expect(jsx).toContain("<TagInput");
  });

  it("fcLabel 未指定のとき 'Label' がデフォルト", () => {
    const jsx = buildComponentJsx(make("TagInput"), INDENT);
    expect(jsx).toContain(">Label<");
  });

  it("inside comment が出力に含まれない（leading/trailing/toolbar はすべて直接反映済み）", () => {
    const jsx = buildComponentJsx(make("TagInput"), INDENT);
    expect(jsx).not.toContain("手動で追加");
  });
});

describe("[exhaustive] TagInput: size・variant", () => {
  it('size="medium"（default）のとき size= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("TagInput", { size: "medium" }), INDENT);
    expect(jsx).not.toContain("size=");
  });

  it('size="large" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("TagInput", { size: "large" }), INDENT);
    expect(jsx).toContain('size="large"');
  });

  it('size="small" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("TagInput", { size: "small" }), INDENT);
    expect(jsx).toContain('size="small"');
  });

  it('variant="outline"（default）のとき variant= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("TagInput", { variant: "outline" }), INDENT);
    expect(jsx).not.toContain("variant=");
  });

  it('variant="underline" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("TagInput", { variant: "underline" }), INDENT);
    expect(jsx).toContain('variant="underline"');
  });
});

describe("[exhaustive] TagInput: shrinkOnBlur・addCaption", () => {
  it("shrinkOnBlur=true のとき shrinkOnBlur が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("TagInput", { shrinkOnBlur: "true" }), INDENT);
    expect(jsx).toContain("shrinkOnBlur");
  });

  it("shrinkOnBlur 未設定のとき shrinkOnBlur が出力に含まれない", () => {
    const jsx = buildComponentJsx(make("TagInput"), INDENT);
    expect(jsx).not.toContain("shrinkOnBlur");
  });

  it('addCaption="false" のとき addCaption={false} が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("TagInput", { addCaption: "false" }), INDENT);
    expect(jsx).toContain("addCaption={false}");
  });

  it("addCaption 未設定（デフォルト true）のとき addCaption が出力に含まれない", () => {
    const jsx = buildComponentJsx(make("TagInput"), INDENT);
    expect(jsx).not.toContain("addCaption");
  });
});

describe("[exhaustive] TagInput: defaultTags・maxSelection", () => {
  it("defaultTags カンマ区切りが defaultValue={[...]} に変換される", () => {
    const jsx = buildComponentJsx(make("TagInput", { defaultTags: "Alice,Bob,Carol" }), INDENT);
    expect(jsx).toContain('defaultValue={["Alice", "Bob", "Carol"]}');
  });

  it("defaultTags 未設定のとき defaultValue= が出力されない", () => {
    const jsx = buildComponentJsx(make("TagInput"), INDENT);
    expect(jsx).not.toContain("defaultValue=");
  });

  it("hasMaxSelection=true のとき maxSelection={N} が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("TagInput", { hasMaxSelection: "true", maxSelection: "5" }), INDENT);
    expect(jsx).toContain("maxSelection={5}");
  });

  it("hasMaxSelection=true + maxSelection 未指定のとき maxSelection={3}（デフォルト）が出る", () => {
    const jsx = buildComponentJsx(make("TagInput", { hasMaxSelection: "true" }), INDENT);
    expect(jsx).toContain("maxSelection={3}");
  });

  it("hasMaxSelection 未設定のとき maxSelection が出力に含まれない", () => {
    const jsx = buildComponentJsx(make("TagInput"), INDENT);
    expect(jsx).not.toContain("maxSelection");
  });
});

describe("[exhaustive] TagInput: leading（text / icon）", () => {
  it('leading=true + leadingType=text のとき leading="From:" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("TagInput", { leading: "true", leadingType: "text" }), INDENT);
    expect(jsx).toContain('leading="From:"');
  });

  it("leadingText カスタム値が leading= に反映される", () => {
    const jsx = buildComponentJsx(
      make("TagInput", { leading: "true", leadingType: "text", leadingText: "〒" }),
      INDENT,
    );
    expect(jsx).toContain('leading="〒"');
  });

  it("leading=true + leadingType=icon のとき leading={<Icon>...</Icon>} が出力に含まれる", () => {
    const jsx = buildComponentJsx(
      make("TagInput", { leading: "true", leadingType: "icon", leadingIcon: "LfSearch" }),
      INDENT,
    );
    expect(jsx).toContain("leading={<Icon><LfSearch /></Icon>}");
  });

  it("leading=true + leadingType=icon のとき LfPlusLarge がデフォルト icon", () => {
    const jsx = buildComponentJsx(make("TagInput", { leading: "true", leadingType: "icon" }), INDENT);
    expect(jsx).toContain("leading={<Icon><LfPlusLarge /></Icon>}");
  });

  it("leading 未設定のとき leading= が出力されない", () => {
    const jsx = buildComponentJsx(make("TagInput"), INDENT);
    expect(jsx).not.toContain("leading=");
  });
});

describe("[exhaustive] TagInput: trailing", () => {
  it("trailing=true のとき trailing={<Icon>...</Icon>} が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("TagInput", { trailing: "true", trailingIcon: "LfArrowDown" }), INDENT);
    expect(jsx).toContain("trailing={<Icon><LfArrowDown /></Icon>}");
  });

  it("trailing=true + trailingIcon 未指定のとき LfPlusLarge がデフォルト", () => {
    const jsx = buildComponentJsx(make("TagInput", { trailing: "true" }), INDENT);
    expect(jsx).toContain("trailing={<Icon><LfPlusLarge /></Icon>}");
  });

  it("trailing 未設定のとき trailing= が出力されない", () => {
    const jsx = buildComponentJsx(make("TagInput"), INDENT);
    expect(jsx).not.toContain("trailing=");
  });
});

describe("[exhaustive] TagInput: withToolbar", () => {
  it("withToolbar=true のとき FormControl.Toolbar が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("TagInput", { withToolbar: "true" }), INDENT);
    expect(jsx).toContain("<FormControl.Toolbar>");
  });

  it("withGhostToolbar=true のとき FormControl.Toolbar ghost が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("TagInput", { withToolbar: "true", withGhostToolbar: "true" }), INDENT);
    expect(jsx).toContain("<FormControl.Toolbar ghost>");
  });

  it("toolbarItems=1 のとき btnLabel が使われる", () => {
    const jsx = buildComponentJsx(
      make("TagInput", { withToolbar: "true", toolbarItems: "1", btnLabel: "送信" }),
      INDENT,
    );
    expect(jsx).toContain(">送信<");
    expect(jsx).not.toContain("<Divider");
  });

  it("toolbarItems=2 のとき btnLabel1/2 が使われ Divider が入る", () => {
    const jsx = buildComponentJsx(
      make("TagInput", { withToolbar: "true", toolbarItems: "2", btnLabel1: "追加", btnLabel2: "削除" }),
      INDENT,
    );
    expect(jsx).toContain(">追加<");
    expect(jsx).toContain(">削除<");
    expect(jsx).toContain("<Divider />");
  });

  it("toolbarItems=3 のとき btnLabel3 まで出力に含まれる", () => {
    const jsx = buildComponentJsx(
      make("TagInput", { withToolbar: "true", toolbarItems: "3", btnLabel1: "A", btnLabel2: "B", btnLabel3: "C" }),
      INDENT,
    );
    expect(jsx).toContain(">A<");
    expect(jsx).toContain(">B<");
    expect(jsx).toContain(">C<");
  });

  it("withToolbar 未設定のとき FormControl.Toolbar が出力に含まれない", () => {
    const jsx = buildComponentJsx(make("TagInput"), INDENT);
    expect(jsx).not.toContain("FormControl.Toolbar");
  });

  it("withToolbar=true のとき FormControl.Toolbar が TagInput より前に出力される", () => {
    const jsx = buildComponentJsx(make("TagInput", { withToolbar: "true" }), INDENT);
    expect(jsx.indexOf("<FormControl.Toolbar")).toBeLessThan(jsx.indexOf("<TagInput"));
  });
});

describe("[exhaustive] TagInput: Cat-4 import completeness", () => {
  it("collectComponentImports に TagInput と FormControl が含まれる", () => {
    const imports = collectComponentImports([make("TagInput")]);
    expect(imports).toContain("TagInput");
    expect(imports).toContain("FormControl");
  });

  it("leading=icon のとき Icon が import に含まれる", () => {
    const imports = collectComponentImports([make("TagInput", { leading: "true", leadingType: "icon" })]);
    expect(imports).toContain("Icon");
  });

  it("trailing=true のとき Icon が import に含まれる", () => {
    const imports = collectComponentImports([make("TagInput", { trailing: "true" })]);
    expect(imports).toContain("Icon");
  });

  it("withToolbar=true のとき Button と Divider が import に含まれる", () => {
    const imports = collectComponentImports([make("TagInput", { withToolbar: "true" })]);
    expect(imports).toContain("Button");
    expect(imports).toContain("Divider");
  });

  it("withToolbar 未設定のとき Button と Divider が import に含まれない", () => {
    const imports = collectComponentImports([make("TagInput")]);
    expect(imports).not.toContain("Button");
    expect(imports).not.toContain("Divider");
  });
});

describe("[exhaustive] TagInput: withinFormControl=false", () => {
  it("withinFormControl=false のとき FormControl ラッパーなしで TagInput が直接出力される", () => {
    const jsx = buildComponentJsx(make("TagInput", { withinFormControl: "false" }), INDENT);
    expect(jsx).toContain("<TagInput");
    expect(jsx).not.toContain("<FormControl");
  });

  it("withinFormControl=false のとき FormControl.Label が出力されない", () => {
    const jsx = buildComponentJsx(make("TagInput", { withinFormControl: "false" }), INDENT);
    expect(jsx).not.toContain("<FormControl.Label");
  });

  it("withinFormControl=false のとき size/variant 属性は TagInput に反映される", () => {
    const jsx = buildComponentJsx(make("TagInput", { withinFormControl: "false", size: "large" }), INDENT);
    expect(jsx).toContain('size="large"');
    expect(jsx).not.toContain("<FormControl");
  });

  it("withinFormControl=false のとき Cat-4 import に FormControl が含まれない", () => {
    const imports = collectComponentImports([make("TagInput", { withinFormControl: "false" })]);
    expect(imports).toContain("TagInput");
    expect(imports).not.toContain("FormControl");
  });
});

describe("[exhaustive] TagInput: fcCaption・fcGroup", () => {
  it("fcCaption=true のとき FormControl.Caption が出力される", () => {
    const jsx = buildComponentJsx(make("TagInput", { fcCaption: "true" }), INDENT);
    expect(jsx).toContain("<FormControl.Caption>");
    expect(jsx).toContain("</FormControl.Caption>");
  });

  it("fcCaptionText が FormControl.Caption のテキストに反映される", () => {
    const jsx = buildComponentJsx(make("TagInput", { fcCaption: "true", fcCaptionText: "必須項目です" }), INDENT);
    expect(jsx).toContain("必須項目です");
  });

  it("fcCaption 未指定のとき FormControl.Caption は出力されない", () => {
    const jsx = buildComponentJsx(make("TagInput"), INDENT);
    expect(jsx).not.toContain("FormControl.Caption");
  });

  it("fcGroup=true のとき FormControl.Group が出力される", () => {
    const jsx = buildComponentJsx(make("TagInput", { fcGroup: "true" }), INDENT);
    expect(jsx).toContain("<FormControl.Group>");
    expect(jsx).toContain("</FormControl.Group>");
  });

  it("fcGroupInputType=Combobox のとき Combobox が FormControl.Group 内に出力される", () => {
    const jsx = buildComponentJsx(make("TagInput", { fcGroup: "true", fcGroupInputType: "Combobox" }), INDENT);
    expect(jsx).toContain("<FormControl.Group>");
    expect(jsx).toContain("<Combobox");
  });

  it("fcGroup 未指定のとき FormControl.Group は出力されない", () => {
    const jsx = buildComponentJsx(make("TagInput"), INDENT);
    expect(jsx).not.toContain("FormControl.Group");
  });
});

// TagPicker — key: fcLabel, options カンマ区切り → 各値が出力に含まれる
describe("[exhaustive] TagPicker: fcLabel と options", () => {
  it("fcLabel カスタム値が FormControl.Label に反映される", () => {
    const jsx = buildComponentJsx(make("TagPicker", { fcLabel: "タグピッカー" }), INDENT);
    expect(jsx).toContain("タグピッカー");
  });

  it("options カンマ区切りの各値が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("TagPicker", { options: "Alpha,Beta,Gamma" }), INDENT);
    expect(jsx).toContain('"Alpha"');
    expect(jsx).toContain('"Beta"');
    expect(jsx).toContain('"Gamma"');
  });

  it("options 未指定のとき Tag A/B/C がデフォルト", () => {
    const jsx = buildComponentJsx(make("TagPicker"), INDENT);
    expect(jsx).toContain("Tag A");
    expect(jsx).toContain("Tag B");
    expect(jsx).toContain("Tag C");
  });
});

describe("[exhaustive] TagPicker: Cat-4 import completeness", () => {
  it("collectComponentImports に TagPicker と FormControl が含まれる", () => {
    const imports = collectComponentImports([make("TagPicker")]);
    expect(imports).toContain("TagPicker");
    expect(imports).toContain("FormControl");
  });
});

// =============================================================================
// グループ7: Avatar 系
// =============================================================================

// Avatar — key: text→name, size sp="medium", color sp="auto"
describe("[exhaustive] Avatar: text・size・color", () => {
  it("text カスタム値が name= に反映される", () => {
    const jsx = buildComponentJsx(make("Avatar", { text: "田中太郎" }), INDENT);
    expect(jsx).toContain('name="田中太郎"');
  });

  it("text 未指定のとき name='AB' がデフォルト", () => {
    const jsx = buildComponentJsx(make("Avatar"), INDENT);
    expect(jsx).toContain('name="AB"');
  });

  it('size="medium" のとき size= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("Avatar", { size: "medium" }), INDENT);
    expect(jsx).not.toContain("size=");
  });

  it('size="large" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Avatar", { size: "large" }), INDENT);
    expect(jsx).toContain('size="large"');
  });

  it('color="auto" のとき color= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("Avatar", { color: "auto" }), INDENT);
    expect(jsx).not.toContain("color=");
  });

  it('color="brand" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Avatar", { color: "brand" }), INDENT);
    expect(jsx).toContain('color="brand"');
  });
});

describe("[exhaustive] Avatar: Cat-4 import completeness", () => {
  it("collectComponentImports に Avatar が含まれる", () => {
    const imports = collectComponentImports([make("Avatar")]);
    expect(imports).toContain("Avatar");
  });
});

// AvatarGroup — key: items count, size sp="medium"; avatar 名は A/B/C... 自動生成
describe("[exhaustive] AvatarGroup: items count・size・自動生成名", () => {
  it("items=2 のとき Avatar が 2 つ出力される（下限）", () => {
    const jsx = buildComponentJsx(make("AvatarGroup", { items: "2" }), INDENT);
    const matches = jsx.match(/<Avatar /g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("items=6 のとき Avatar が 6 つ出力される（上限）", () => {
    const jsx = buildComponentJsx(make("AvatarGroup", { items: "6" }), INDENT);
    const matches = jsx.match(/<Avatar /g) ?? [];
    expect(matches.length).toBe(6);
  });

  it("items=1 のとき min=2 に clamp される", () => {
    const jsx = buildComponentJsx(make("AvatarGroup", { items: "1" }), INDENT);
    const matches = jsx.match(/<Avatar /g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("items=99 のとき max=6 に clamp される", () => {
    const jsx = buildComponentJsx(make("AvatarGroup", { items: "99" }), INDENT);
    const matches = jsx.match(/<Avatar /g) ?? [];
    expect(matches.length).toBe(6);
  });

  it('size="medium" のとき size= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("AvatarGroup", { size: "medium" }), INDENT);
    expect(jsx).not.toContain("size=");
  });

  it('size="large" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("AvatarGroup", { size: "large" }), INDENT);
    expect(jsx).toContain('size="large"');
  });

  it("avatar 名は A/B/C... 形式で自動生成される（items=3 の場合）", () => {
    const jsx = buildComponentJsx(make("AvatarGroup", { items: "3" }), INDENT);
    // 1 番目: A+B=AB、2 番目: C+D=CD、3 番目: E+F=EF
    expect(jsx).toContain('name="AB"');
    expect(jsx).toContain('name="CD"');
    expect(jsx).toContain('name="EF"');
  });
});

describe("[exhaustive] AvatarGroup: Cat-4 import completeness", () => {
  it("collectComponentImports に AvatarGroup と Avatar が含まれる", () => {
    const imports = collectComponentImports([make("AvatarGroup")]);
    expect(imports).toContain("AvatarGroup");
    expect(imports).toContain("Avatar");
  });
});

// =============================================================================
// グループ8: count-based items
// =============================================================================

// CheckboxGroup — key: items count [2-6], text カンマ区切り → Checkbox children
describe("[exhaustive] CheckboxGroup: items count と text", () => {
  it("items=2 のとき Checkbox が 2 つ出力される（下限）", () => {
    const jsx = buildComponentJsx(make("CheckboxGroup", { items: "2" }), INDENT);
    const matches = jsx.match(/<Checkbox>/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("items=6 のとき Checkbox が 6 つ出力される（上限）", () => {
    const jsx = buildComponentJsx(make("CheckboxGroup", { items: "6" }), INDENT);
    const matches = jsx.match(/<Checkbox>/g) ?? [];
    expect(matches.length).toBe(6);
  });

  it("items=1 のとき min=2 に clamp される", () => {
    const jsx = buildComponentJsx(make("CheckboxGroup", { items: "1" }), INDENT);
    const matches = jsx.match(/<Checkbox>/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("items=99 のとき max=6 に clamp される", () => {
    const jsx = buildComponentJsx(make("CheckboxGroup", { items: "99" }), INDENT);
    const matches = jsx.match(/<Checkbox>/g) ?? [];
    expect(matches.length).toBe(6);
  });

  it("text カンマ区切りの値が Checkbox children に反映される", () => {
    const jsx = buildComponentJsx(make("CheckboxGroup", { items: "3", text: "Apple,Banana,Cherry" }), INDENT);
    expect(jsx).toContain("Apple");
    expect(jsx).toContain("Banana");
    expect(jsx).toContain("Cherry");
  });
});

describe("[exhaustive] CheckboxGroup: Cat-4 import completeness", () => {
  it("collectComponentImports に CheckboxGroup と Checkbox が含まれる", () => {
    const imports = collectComponentImports([make("CheckboxGroup")]);
    expect(imports).toContain("CheckboxGroup");
    expect(imports).toContain("Checkbox");
  });
});

// RadioGroup — key: items count [2-6], text カンマ区切り → Radio children
describe("[exhaustive] RadioGroup: items count と text", () => {
  it("items=2 のとき Radio が 2 つ出力される（下限）", () => {
    const jsx = buildComponentJsx(make("RadioGroup", { items: "2" }), INDENT);
    const matches = jsx.match(/<Radio>/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("items=6 のとき Radio が 6 つ出力される（上限）", () => {
    const jsx = buildComponentJsx(make("RadioGroup", { items: "6" }), INDENT);
    const matches = jsx.match(/<Radio>/g) ?? [];
    expect(matches.length).toBe(6);
  });

  it("items=1 のとき min=2 に clamp される", () => {
    const jsx = buildComponentJsx(make("RadioGroup", { items: "1" }), INDENT);
    const matches = jsx.match(/<Radio>/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("text カンマ区切りの値が Radio children に反映される", () => {
    const jsx = buildComponentJsx(make("RadioGroup", { items: "2", text: "Yes,No" }), INDENT);
    expect(jsx).toContain("Yes");
    expect(jsx).toContain("No");
  });
});

describe("[exhaustive] RadioGroup: Cat-4 import completeness", () => {
  it("collectComponentImports に RadioGroup と Radio が含まれる", () => {
    const imports = collectComponentImports([make("RadioGroup")]);
    expect(imports).toContain("RadioGroup");
    expect(imports).toContain("Radio");
  });
});

// Breadcrumb — key: items count [2-10], label カンマ区切り; 最終アイテムは aria-current="location" + href なし
describe("[exhaustive] Breadcrumb: items count と最終アイテム", () => {
  it("items=2 のとき Breadcrumb.Item が 2 つ出力される（下限）", () => {
    const jsx = buildComponentJsx(make("Breadcrumb", { items: "2" }), INDENT);
    const matches = jsx.match(/<Breadcrumb\\.Item/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("items=10 のとき Breadcrumb.Item が 10 つ出力される（上限）", () => {
    const jsx = buildComponentJsx(make("Breadcrumb", { items: "10" }), INDENT);
    const matches = jsx.match(/<Breadcrumb\\.Item/g) ?? [];
    expect(matches.length).toBe(10);
  });

  it("items=1 のとき min=2 に clamp される", () => {
    const jsx = buildComponentJsx(make("Breadcrumb", { items: "1" }), INDENT);
    const matches = jsx.match(/<Breadcrumb\\.Item/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("最終アイテムは aria-current='location' を持つ", () => {
    const jsx = buildComponentJsx(make("Breadcrumb", { items: "3" }), INDENT);
    expect(jsx).toContain('aria-current="location"');
  });

  it("最終アイテムは href= を持たない（中間アイテムは href='#' を持つ）", () => {
    const jsx = buildComponentJsx(make("Breadcrumb", { items: "3" }), INDENT);
    expect(jsx).toContain('href="#"');
    // 最終アイテムは href なし (aria-current のみ)
    const lastItem = jsx.split("<Breadcrumb.Item").at(-1) ?? "";
    expect(lastItem).not.toContain("href=");
  });

  it("label カンマ区切りの値が Breadcrumb.Item children に反映される", () => {
    const jsx = buildComponentJsx(make("Breadcrumb", { items: "3", label: "Home,About,Contact" }), INDENT);
    expect(jsx).toContain("Home");
    expect(jsx).toContain("About");
    expect(jsx).toContain("Contact");
  });
});

describe("[exhaustive] Breadcrumb: Cat-4 import completeness", () => {
  it("collectComponentImports に Breadcrumb が含まれる", () => {
    const imports = collectComponentImports([make("Breadcrumb")]);
    expect(imports).toContain("Breadcrumb");
  });
});

// ButtonGroup — key: btnItems count [1-5], btn\${n}_label / variant / color / loading / leading / trailing
describe("[exhaustive] ButtonGroup: btnItems count", () => {
  it("btnItems=1 のとき Button が 1 つ出力される（下限）", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { btnItems: "1" }), INDENT);
    const matches = jsx.match(/<Button>/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("btnItems=5 のとき Button が 5 つ出力される（上限）", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { btnItems: "5" }), INDENT);
    const matches = jsx.match(/<Button>/g) ?? [];
    expect(matches.length).toBe(5);
  });

  it("btnItems=0 のとき min=1 に clamp される", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { btnItems: "0" }), INDENT);
    const matches = jsx.match(/<Button>/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("btnItems=99 のとき max=5 に clamp される", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { btnItems: "99" }), INDENT);
    const matches = jsx.match(/<Button>/g) ?? [];
    expect(matches.length).toBe(5);
  });
});

describe("[exhaustive] ButtonGroup: per-button label (btn\${n}_label)", () => {
  it("btn\${n}_label の値がそれぞれの Button に反映される", () => {
    const jsx = buildComponentJsx(
      make("ButtonGroup", { btnItems: "3", btn1_label: "保存", btn2_label: "キャンセル", btn3_label: "削除" }),
      INDENT,
    );
    expect(jsx).toContain(">保存<");
    expect(jsx).toContain(">キャンセル<");
    expect(jsx).toContain(">削除<");
  });

  it("btn\${n}_label 未設定のとき 'Button' がフォールバックになる", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { btnItems: "2" }), INDENT);
    const matches = jsx.match(/>Button</g) ?? [];
    expect(matches.length).toBe(2);
  });
});

describe("[exhaustive] ButtonGroup: per-button variant / color (btn\${n}_variant/color)", () => {
  it("btn1_variant='solid' のとき variant='solid' が Button に出力される", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { btnItems: "1", btn1_variant: "solid" }), INDENT);
    expect(jsx).toContain('variant="solid"');
  });

  it("btn1_variant='subtle' (default) のとき variant 属性は Button に出力されない", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { btnItems: "1", btn1_variant: "subtle" }), INDENT);
    expect(jsx).not.toContain('variant="subtle"');
  });

  it("btn1_color='brand' のとき color='brand' が Button に出力される", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { btnItems: "1", btn1_color: "brand" }), INDENT);
    expect(jsx).toContain('color="brand"');
  });

  it("btn1_color='neutral' (default) のとき color 属性は Button に出力されない", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { btnItems: "1", btn1_color: "neutral" }), INDENT);
    expect(jsx).not.toContain('color="neutral"');
  });

  it("attached=true のとき btn1_variant を設定しても per-button variant は出力されない", () => {
    const jsx = buildComponentJsx(
      make("ButtonGroup", { btnItems: "1", attached: "true", btn1_variant: "solid" }),
      INDENT,
    );
    // group attached, per-button variant suppressed; only group-level variant (from attachedColor) appears
    expect(jsx).not.toContain("<Button variant=");
  });

  it("複数ボタンで異なる variant / color を持てる", () => {
    const jsx = buildComponentJsx(
      make("ButtonGroup", { btnItems: "2", btn1_variant: "solid", btn2_color: "brand" }),
      INDENT,
    );
    expect(jsx).toContain('variant="solid"');
    expect(jsx).toContain('color="brand"');
  });
});

describe("[exhaustive] ButtonGroup: per-button loading (btn\${n}_loading)", () => {
  it("btn1_loading='true' のとき loading 属性が Button に出力される", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { btnItems: "1", btn1_loading: "true" }), INDENT);
    expect(jsx).toContain("<Button loading>");
  });

  it("btn1_loading='false' のとき loading 属性は出力されない", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { btnItems: "1", btn1_loading: "false" }), INDENT);
    expect(jsx).not.toContain("loading");
  });
});

describe("[exhaustive] ButtonGroup: per-button leading / trailing icon", () => {
  it("btn1_leading='true' のとき leading prop が Button に出力される", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { btnItems: "1", btn1_leading: "true" }), INDENT);
    expect(jsx).toContain("leading={<Icon>");
  });

  it("btn1_leading='true' + btn1_leadingIcon='LfCheckLarge' のとき LfCheckLarge が出力される", () => {
    const jsx = buildComponentJsx(
      make("ButtonGroup", { btnItems: "1", btn1_leading: "true", btn1_leadingIcon: "LfCheckLarge" }),
      INDENT,
    );
    expect(jsx).toContain("LfCheckLarge");
  });

  it("btn1_leading 未設定のとき leading prop は出力されない", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { btnItems: "1" }), INDENT);
    expect(jsx).not.toContain("leading=");
  });

  it("btn1_trailing='true' のとき trailing prop が Button に出力される", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { btnItems: "1", btn1_trailing: "true" }), INDENT);
    expect(jsx).toContain("trailing={<Icon>");
  });

  it("leading=true のとき Icon が collectComponentImports に含まれる", () => {
    const imports = collectComponentImports([make("ButtonGroup", { btnItems: "1", btn1_leading: "true" })]);
    expect(imports).toContain("Icon");
  });
});

describe("[exhaustive] ButtonGroup: per-button leading / trailing Badge (btn\${n}_leadingType=Badge)", () => {
  it("btn1_leadingType=Badge のとき leading={<Badge が出力される（Icon は出ない）", () => {
    const jsx = buildComponentJsx(
      make("ButtonGroup", { btnItems: "1", btn1_leading: "true", btn1_leadingType: "Badge" }),
      INDENT,
    );
    expect(jsx).toContain("leading={<Badge");
    expect(jsx).not.toContain("leading={<Icon>");
  });

  it("btn1_leadingBadgeColor='danger' が Badge の color に反映される", () => {
    const jsx = buildComponentJsx(
      make("ButtonGroup", {
        btnItems: "1",
        btn1_leading: "true",
        btn1_leadingType: "Badge",
        btn1_leadingBadgeColor: "danger",
      }),
      INDENT,
    );
    expect(jsx).toContain('color="danger"');
  });

  it("btn1_leadingBadge=count + leadingBadgeCount=5 のとき count={5} が出力される", () => {
    const jsx = buildComponentJsx(
      make("ButtonGroup", {
        btnItems: "1",
        btn1_leading: "true",
        btn1_leadingType: "Badge",
        btn1_leadingBadge: "count",
        btn1_leadingBadgeCount: "5",
      }),
      INDENT,
    );
    expect(jsx).toContain("count={5}");
  });

  it("btn1_leadingBadge=normal のとき count= が出力されない", () => {
    const jsx = buildComponentJsx(
      make("ButtonGroup", {
        btnItems: "1",
        btn1_leading: "true",
        btn1_leadingType: "Badge",
        btn1_leadingBadge: "normal",
      }),
      INDENT,
    );
    expect(jsx).not.toContain("count=");
  });

  it("btn1_trailingType=Badge のとき trailing={<Badge が出力される", () => {
    const jsx = buildComponentJsx(
      make("ButtonGroup", { btnItems: "1", btn1_trailing: "true", btn1_trailingType: "Badge" }),
      INDENT,
    );
    expect(jsx).toContain("trailing={<Badge");
  });

  it("leadingType=Badge（iconItems=0）のとき Badge が collectComponentImports に含まれ Icon は含まれない", () => {
    // iconItems=0 で IconButton 由来の Icon import を除外して Badge のみ検証
    const imports = collectComponentImports([
      make("ButtonGroup", { btnItems: "1", iconItems: "0", btn1_leading: "true", btn1_leadingType: "Badge" }),
    ]);
    expect(imports).toContain("Badge");
    expect(imports).not.toContain("Icon");
  });
});

describe("[exhaustive] ButtonGroup: per-iconButton settings (icon\${n}_*)", () => {
  it("icon1_icon='LfCheckLarge' のとき LfCheckLarge が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { iconItems: "1", icon1_icon: "LfCheckLarge" }), INDENT);
    expect(jsx).toContain("LfCheckLarge");
  });

  it("icon1_icon 未設定のとき LfPlusLarge がフォールバックになる", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { iconItems: "1" }), INDENT);
    expect(jsx).toContain("LfPlusLarge");
  });

  it("icon1_variant='solid' のとき variant='solid' が IconButton に出力される", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { iconItems: "1", icon1_variant: "solid" }), INDENT);
    expect(jsx).toContain('variant="solid"');
  });

  it("icon1_variant='subtle' (default) のとき variant 属性は出力されない", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { iconItems: "1", icon1_variant: "subtle" }), INDENT);
    expect(jsx).not.toContain('variant="subtle"');
  });

  it("icon1_color='brand' のとき color='brand' が IconButton に出力される", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { iconItems: "1", icon1_color: "brand" }), INDENT);
    expect(jsx).toContain('color="brand"');
  });

  it("icon1_loading='true' のとき loading 属性が IconButton に出力される", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { iconItems: "1", icon1_loading: "true" }), INDENT);
    expect(jsx).toContain("<IconButton loading");
  });

  it("複数 iconItems で異なる icon key を持てる", () => {
    const jsx = buildComponentJsx(
      make("ButtonGroup", { iconItems: "2", icon1_icon: "LfCheckLarge", icon2_icon: "LfCloseLarge" }),
      INDENT,
    );
    expect(jsx).toContain("LfCheckLarge");
    expect(jsx).toContain("LfCloseLarge");
  });
});

describe("[exhaustive] ButtonGroup: size", () => {
  it('size="large" のとき size="large" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { size: "large" }), INDENT);
    expect(jsx).toContain('size="large"');
  });

  it('size="medium" のとき size 属性は出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { size: "medium" }), INDENT);
    expect(jsx).not.toContain("size=");
  });

  it("size 未指定のとき size 属性は出力されない（デフォルト=medium）", () => {
    const jsx = buildComponentJsx(make("ButtonGroup"), INDENT);
    expect(jsx).not.toContain("size=");
  });
});

describe("[exhaustive] ButtonGroup: attached / attachedColor → variant", () => {
  it("attached=true のとき attached 属性が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { attached: "true" }), INDENT);
    expect(jsx).toContain("attached");
  });

  it("attached=false のとき attached 属性は出力されない", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { attached: "false" }), INDENT);
    expect(jsx).not.toContain("attached");
  });

  it('attached=true + attachedColor="subtle" → variant="subtle" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { attached: "true", attachedColor: "subtle" }), INDENT);
    expect(jsx).toContain('variant="subtle"');
  });

  it('attached=true + attachedColor="plain" → variant="plain" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { attached: "true", attachedColor: "plain" }), INDENT);
    expect(jsx).toContain('variant="plain"');
  });

  it('attached=true + attachedColor="solid"（デフォルト）→ variant 属性は出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { attached: "true", attachedColor: "solid" }), INDENT);
    expect(jsx).toContain("attached");
    expect(jsx).not.toContain("variant=");
  });

  it("attached 未指定のとき variant 属性は出力されない", () => {
    const jsx = buildComponentJsx(make("ButtonGroup"), INDENT);
    expect(jsx).not.toContain("variant=");
  });
});

describe("[exhaustive] ButtonGroup: iconItems", () => {
  it("iconItems=0 のとき IconButton/Tooltip は出力されない", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { iconItems: "0" }), INDENT);
    expect(jsx).not.toContain("IconButton");
    expect(jsx).not.toContain("Tooltip");
  });

  it("iconItems=1 のとき Tooltip + IconButton が 1 セット出力される", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { iconItems: "1" }), INDENT);
    const tooltips = jsx.match(/<Tooltip /g) ?? [];
    const iconBtns = jsx.match(/<IconButton /g) ?? [];
    expect(tooltips.length).toBe(1);
    expect(iconBtns.length).toBe(1);
  });

  it("iconItems=2 のとき Tooltip + IconButton が 2 セット出力される", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { iconItems: "2" }), INDENT);
    const tooltips = jsx.match(/<Tooltip /g) ?? [];
    const iconBtns = jsx.match(/<IconButton /g) ?? [];
    expect(tooltips.length).toBe(2);
    expect(iconBtns.length).toBe(2);
  });

  it("iconItems=1 のとき LfPlusLarge が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("ButtonGroup", { iconItems: "1" }), INDENT);
    expect(jsx).toContain("LfPlusLarge");
  });
});

describe("[exhaustive] ButtonGroup: Cat-4 import completeness", () => {
  it("iconItems=0 のとき ButtonGroup + Button のみ含まれ IconButton/Tooltip/Icon は含まれない", () => {
    const imports = collectComponentImports([make("ButtonGroup", { iconItems: "0" })]);
    expect(imports).toContain("ButtonGroup");
    expect(imports).toContain("Button");
    expect(imports).not.toContain("IconButton");
    expect(imports).not.toContain("Tooltip");
  });

  it("iconItems=1 のとき ButtonGroup + Button + IconButton + Tooltip + Icon が含まれる", () => {
    const imports = collectComponentImports([make("ButtonGroup", { iconItems: "1" })]);
    expect(imports).toContain("ButtonGroup");
    expect(imports).toContain("Button");
    expect(imports).toContain("IconButton");
    expect(imports).toContain("Tooltip");
    expect(imports).toContain("Icon");
  });
});

// SegmentedControl — key: items count [2-6], label カンマ区切り
describe("[exhaustive] SegmentedControl: items count と label", () => {
  it("items=2 のとき SegmentedControl.Button が 2 つ出力される（下限）", () => {
    const jsx = buildComponentJsx(make("SegmentedControl", { items: "2" }), INDENT);
    const matches = jsx.match(/<SegmentedControl\\.Button>/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("items=6 のとき SegmentedControl.Button が 6 つ出力される（上限）", () => {
    const jsx = buildComponentJsx(make("SegmentedControl", { items: "6" }), INDENT);
    const matches = jsx.match(/<SegmentedControl\\.Button>/g) ?? [];
    expect(matches.length).toBe(6);
  });

  it("items=1 のとき min=2 に clamp される", () => {
    const jsx = buildComponentJsx(make("SegmentedControl", { items: "1" }), INDENT);
    const matches = jsx.match(/<SegmentedControl\\.Button>/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("label カンマ区切りの値が SegmentedControl.Button children に反映される", () => {
    const jsx = buildComponentJsx(make("SegmentedControl", { items: "2", label: "List,Grid" }), INDENT);
    expect(jsx).toContain("List");
    expect(jsx).toContain("Grid");
  });

  it("defaultIndex={0} が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("SegmentedControl"), INDENT);
    expect(jsx).toContain("defaultIndex={0}");
  });
});

describe("[exhaustive] SegmentedControl: Cat-4 import completeness", () => {
  it("collectComponentImports に SegmentedControl が含まれる", () => {
    const imports = collectComponentImports([make("SegmentedControl")]);
    expect(imports).toContain("SegmentedControl");
  });
});

// Tabs — key: items count [2-10], label カンマ区切り
describe("[exhaustive] Tabs: items count と label・構造", () => {
  it("items=2 のとき TabsTrigger が 2 つ出力される（下限）", () => {
    const jsx = buildComponentJsx(make("Tabs", { items: "2" }), INDENT);
    const matches = jsx.match(/<TabsTrigger /g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("items=10 のとき TabsTrigger が 10 つ出力される（上限）", () => {
    const jsx = buildComponentJsx(make("Tabs", { items: "10" }), INDENT);
    const matches = jsx.match(/<TabsTrigger /g) ?? [];
    expect(matches.length).toBe(10);
  });

  it("TabsList/TabsTrigger/TabsContent が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Tabs"), INDENT);
    expect(jsx).toContain("<TabsList>");
    expect(jsx).toContain("<TabsTrigger ");
    expect(jsx).toContain("<TabsContent ");
  });

  it("label カンマ区切りの値が TabsTrigger children に反映される", () => {
    const jsx = buildComponentJsx(make("Tabs", { items: "2", label: "概要,詳細" }), INDENT);
    expect(jsx).toContain("概要");
    expect(jsx).toContain("詳細");
  });
});

describe("[exhaustive] Tabs: Cat-4 import completeness", () => {
  it("collectComponentImports に Tabs/TabsList/TabsTrigger/TabsContent が含まれる", () => {
    const imports = collectComponentImports([make("Tabs")]);
    expect(imports).toContain("Tabs");
    expect(imports).toContain("TabsList");
    expect(imports).toContain("TabsTrigger");
    expect(imports).toContain("TabsContent");
  });
});

// TagGroup — key: tgItems count [1-10], tagLabels カンマ区切り
describe("[exhaustive] TagGroup: tgItems count と tagLabels", () => {
  it("tgItems=1 のとき Tag が 1 つ出力される（下限）", () => {
    const jsx = buildComponentJsx(make("TagGroup", { tgItems: "1" }), INDENT);
    const matches = jsx.match(/<Tag>/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("tgItems=10 のとき Tag が 10 つ出力される（上限）", () => {
    const jsx = buildComponentJsx(make("TagGroup", { tgItems: "10" }), INDENT);
    const matches = jsx.match(/<Tag>/g) ?? [];
    expect(matches.length).toBe(10);
  });

  it("tgItems=0 のとき min=1 に clamp（または fallback=3）される", () => {
    const jsx = buildComponentJsx(make("TagGroup", { tgItems: "0" }), INDENT);
    const matches = jsx.match(/<Tag>/g) ?? [];
    // 0 は falsy なので || 3 が発動して 3 になる
    expect(matches.length).toBe(3);
  });

  it("tagLabels カンマ区切りの値が Tag children に反映される", () => {
    const jsx = buildComponentJsx(make("TagGroup", { tgItems: "3", tagLabels: "React,Vue,Angular" }), INDENT);
    expect(jsx).toContain("React");
    expect(jsx).toContain("Vue");
    expect(jsx).toContain("Angular");
  });
});

describe("[exhaustive] TagGroup: Cat-4 import completeness", () => {
  it("collectComponentImports に TagGroup と Tag が含まれる", () => {
    const imports = collectComponentImports([make("TagGroup")]);
    expect(imports).toContain("TagGroup");
    expect(imports).toContain("Tag");
  });
});

// Pagination — key: items → total [1-100]; defaultPage={1}
describe("[exhaustive] Pagination: total count", () => {
  it("items=1 のとき total={1} が出力される（下限）", () => {
    const jsx = buildComponentJsx(make("Pagination", { items: "1" }), INDENT);
    expect(jsx).toContain("total={1}");
  });

  it("items=100 のとき total={100} が出力される（上限）", () => {
    const jsx = buildComponentJsx(make("Pagination", { items: "100" }), INDENT);
    expect(jsx).toContain("total={100}");
  });

  it("items=0 のとき min=1 に clamp される", () => {
    const jsx = buildComponentJsx(make("Pagination", { items: "0" }), INDENT);
    expect(jsx).toContain("total={1}");
  });

  it("items=999 のとき max=100 に clamp される", () => {
    const jsx = buildComponentJsx(make("Pagination", { items: "999" }), INDENT);
    expect(jsx).toContain("total={100}");
  });

  it("defaultPage={1} が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Pagination"), INDENT);
    expect(jsx).toContain("defaultPage={1}");
  });
});

describe("[exhaustive] Pagination: Cat-4 import completeness", () => {
  it("collectComponentImports に Pagination が含まれる", () => {
    const imports = collectComponentImports([make("Pagination")]);
    expect(imports).toContain("Pagination");
  });
});

// Timeline — key: items count [2-10], tagLabels カンマ区切り
describe("[exhaustive] Timeline: items count と tagLabels・構造", () => {
  it("items=2 のとき TimelineItem が 2 つ出力される（下限）", () => {
    const jsx = buildComponentJsx(make("Timeline", { items: "2" }), INDENT);
    const matches = jsx.match(/<TimelineItem>/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("items=10 のとき TimelineItem が 10 つ出力される（上限）", () => {
    const jsx = buildComponentJsx(make("Timeline", { items: "10" }), INDENT);
    const matches = jsx.match(/<TimelineItem>/g) ?? [];
    expect(matches.length).toBe(10);
  });

  it("TimelinePoint と TimelineContent が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Timeline"), INDENT);
    expect(jsx).toContain("<TimelinePoint />");
    expect(jsx).toContain("<TimelineContent>");
  });

  it("tagLabels カンマ区切りの値が TimelineContent children に反映される", () => {
    const jsx = buildComponentJsx(make("Timeline", { items: "2", tagLabels: "Start,End" }), INDENT);
    expect(jsx).toContain("Start");
    expect(jsx).toContain("End");
  });
});

describe("[exhaustive] Timeline: Cat-4 import completeness", () => {
  it("collectComponentImports に Timeline/TimelineItem/TimelinePoint/TimelineContent が含まれる", () => {
    const imports = collectComponentImports([make("Timeline")]);
    expect(imports).toContain("Timeline");
    expect(imports).toContain("TimelineItem");
    expect(imports).toContain("TimelinePoint");
    expect(imports).toContain("TimelineContent");
  });
});

// Accordion — key: items count [1-8], label/content カンマ区切り
describe("[exhaustive] Accordion: items count と label/content", () => {
  it("items=1 のとき AccordionItem が 1 つ出力される（下限）", () => {
    const jsx = buildComponentJsx(make("Accordion", { items: "1" }), INDENT);
    const matches = jsx.match(/<AccordionItem>/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("items=8 のとき AccordionItem が 8 つ出力される（上限）", () => {
    const jsx = buildComponentJsx(make("Accordion", { items: "8" }), INDENT);
    const matches = jsx.match(/<AccordionItem>/g) ?? [];
    expect(matches.length).toBe(8);
  });

  it("AccordionButton と AccordionPanel が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Accordion"), INDENT);
    expect(jsx).toContain("<AccordionButton>");
    expect(jsx).toContain("<AccordionPanel>");
  });

  it("label カンマ区切りの値が AccordionButton children に反映される", () => {
    const jsx = buildComponentJsx(make("Accordion", { items: "2", label: "FAQ 1,FAQ 2" }), INDENT);
    expect(jsx).toContain("FAQ 1");
    expect(jsx).toContain("FAQ 2");
  });

  it("content カンマ区切りの値が AccordionPanel children に反映される", () => {
    const jsx = buildComponentJsx(make("Accordion", { items: "2", content: "Answer A,Answer B" }), INDENT);
    expect(jsx).toContain("Answer A");
    expect(jsx).toContain("Answer B");
  });
});

describe("[exhaustive] Accordion: Cat-4 import completeness", () => {
  it("collectComponentImports に Accordion/AccordionItem/AccordionButton/AccordionPanel が含まれる", () => {
    const imports = collectComponentImports([make("Accordion")]);
    expect(imports).toContain("Accordion");
    expect(imports).toContain("AccordionItem");
    expect(imports).toContain("AccordionButton");
    expect(imports).toContain("AccordionPanel");
  });
});

// ActionList — key: items count [1-8], listLabel カンマ区切り
describe("[exhaustive] ActionList: items count と listLabel", () => {
  it("items=1 のとき ActionListItem が 1 つ出力される（下限）", () => {
    const jsx = buildComponentJsx(make("ActionList", { items: "1" }), INDENT);
    const matches = jsx.match(/<ActionListItem>/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("items=8 のとき ActionListItem が 8 つ出力される（上限）", () => {
    const jsx = buildComponentJsx(make("ActionList", { items: "8" }), INDENT);
    const matches = jsx.match(/<ActionListItem>/g) ?? [];
    expect(matches.length).toBe(8);
  });

  it("ActionListBody が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("ActionList"), INDENT);
    expect(jsx).toContain("<ActionListBody>");
  });

  it("listLabel カンマ区切りの値が ActionListBody children に反映される", () => {
    const jsx = buildComponentJsx(make("ActionList", { items: "2", listLabel: "Edit,Delete" }), INDENT);
    expect(jsx).toContain("Edit");
    expect(jsx).toContain("Delete");
  });

  it("'label' キーは読まれない（listLabel が正）", () => {
    const jsx = buildComponentJsx(make("ActionList", { items: "2", label: "ignored" }), INDENT);
    expect(jsx).not.toContain("ignored");
    // デフォルトフォールバックが出る
    expect(jsx).toContain("Action 1");
  });
});

describe("[exhaustive] ActionList: Cat-4 import completeness", () => {
  it("collectComponentImports に ActionList/ActionListItem/ActionListBody が含まれる", () => {
    const imports = collectComponentImports([make("ActionList")]);
    expect(imports).toContain("ActionList");
    expect(imports).toContain("ActionListItem");
    expect(imports).toContain("ActionListBody");
  });
});

// Toolbar — groups count / group\${gi}_items / item type dispatch / Button props / IconButton props / ToolbarSeparator
describe("[exhaustive] Toolbar: groups count", () => {
  it("groups=1 のとき ToolbarGroup が 1 つ出力される（下限）", () => {
    const jsx = buildComponentJsx(make("Toolbar", { groups: "1" }), INDENT);
    const matches = jsx.match(/<ToolbarGroup>/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("groups=5 のとき ToolbarGroup が 5 つ出力される（上限）", () => {
    const jsx = buildComponentJsx(make("Toolbar", { groups: "5" }), INDENT);
    const matches = jsx.match(/<ToolbarGroup>/g) ?? [];
    expect(matches.length).toBe(5);
  });

  it("groups=0 のとき min=1 に clamp される", () => {
    const jsx = buildComponentJsx(make("Toolbar", { groups: "0" }), INDENT);
    const matches = jsx.match(/<ToolbarGroup>/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("groups=99 のとき max=5 に clamp される", () => {
    const jsx = buildComponentJsx(make("Toolbar", { groups: "99" }), INDENT);
    const matches = jsx.match(/<ToolbarGroup>/g) ?? [];
    expect(matches.length).toBe(5);
  });
});

describe("[exhaustive] Toolbar: ToolbarSeparator", () => {
  it("groups=1 のとき ToolbarSeparator が出力されない", () => {
    const jsx = buildComponentJsx(make("Toolbar", { groups: "1" }), INDENT);
    expect(jsx).not.toContain("ToolbarSeparator");
  });

  it("groups=2 のとき ToolbarSeparator が 1 つ出力される", () => {
    const jsx = buildComponentJsx(make("Toolbar", { groups: "2" }), INDENT);
    expect(jsx).toContain("<ToolbarSeparator />");
  });

  it("groups=3 のとき ToolbarSeparator が 2 つ出力される", () => {
    const jsx = buildComponentJsx(make("Toolbar", { groups: "3" }), INDENT);
    const matches = jsx.match(/<ToolbarSeparator \\/>/g) ?? [];
    expect(matches.length).toBe(2);
  });
});

describe("[exhaustive] Toolbar: group\${gi}_items per-group item 数", () => {
  it("group0_items=1 のとき group0 に item が 1 つ出力される", () => {
    const jsx = buildComponentJsx(
      make("Toolbar", { groups: "1", group0_items: "1", group0_item0_type: "Button", group0_item0_cfg_label: "送信" }),
      INDENT,
    );
    expect(jsx).toContain(">送信<");
  });

  it("group0_items=5 のとき group0 に IconButton が 5 つ出力される（上限）", () => {
    const jsx = buildComponentJsx(make("Toolbar", { groups: "1", group0_items: "5" }), INDENT);
    const matches = jsx.match(/<IconButton/g) ?? [];
    expect(matches.length).toBe(5);
  });

  it("group0_items 未指定のとき default=3 が使われる", () => {
    const jsx = buildComponentJsx(make("Toolbar", { groups: "1" }), INDENT);
    const matches = jsx.match(/<IconButton/g) ?? [];
    expect(matches.length).toBe(3);
  });
});

describe("[exhaustive] Toolbar: item type dispatch（Button / IconButton）", () => {
  it("type=IconButton（default）のとき IconButton + Tooltip が出力される", () => {
    const jsx = buildComponentJsx(
      make("Toolbar", { groups: "1", group0_items: "1", group0_item0_type: "IconButton" }),
      INDENT,
    );
    expect(jsx).toContain("<IconButton");
    expect(jsx).toContain("<Tooltip");
  });

  it("type=Button のとき <Button> が出力される", () => {
    const jsx = buildComponentJsx(
      make("Toolbar", { groups: "1", group0_items: "1", group0_item0_type: "Button" }),
      INDENT,
    );
    expect(jsx).toContain("<Button");
    expect(jsx).not.toContain("<IconButton");
  });

  it("混在（item0=IconButton, item1=Button）のとき両方出力される", () => {
    const jsx = buildComponentJsx(
      make("Toolbar", {
        groups: "1",
        group0_items: "2",
        group0_item0_type: "IconButton",
        group0_item1_type: "Button",
      }),
      INDENT,
    );
    expect(jsx).toContain("<IconButton");
    expect(jsx).toContain("<Button");
  });
});

describe("[exhaustive] Toolbar: Button props", () => {
  it("cfg_label がボタンラベルに反映される", () => {
    const jsx = buildComponentJsx(
      make("Toolbar", { groups: "1", group0_items: "1", group0_item0_type: "Button", group0_item0_cfg_label: "保存" }),
      INDENT,
    );
    expect(jsx).toContain(">保存<");
  });

  it('cfg_variant="plain" のとき variant="plain" が出力される（Aegis default="subtle" と異なるため）', () => {
    const jsx = buildComponentJsx(
      make("Toolbar", {
        groups: "1",
        group0_items: "1",
        group0_item0_type: "Button",
        group0_item0_cfg_variant: "plain",
      }),
      INDENT,
    );
    expect(jsx).toContain('variant="plain"');
  });

  it('cfg_variant="Weight(gutterless)" のとき variant="gutterless" に変換される', () => {
    const jsx = buildComponentJsx(
      make("Toolbar", {
        groups: "1",
        group0_items: "1",
        group0_item0_type: "Button",
        group0_item0_cfg_variant: "Weight(gutterless)",
      }),
      INDENT,
    );
    expect(jsx).toContain('variant="gutterless"');
    expect(jsx).not.toContain("Weight(gutterless)");
  });

  it("cfg_loading=true のとき loading が出力される", () => {
    const jsx = buildComponentJsx(
      make("Toolbar", {
        groups: "1",
        group0_items: "1",
        group0_item0_type: "Button",
        group0_item0_cfg_loading: "true",
      }),
      INDENT,
    );
    expect(jsx).toContain(" loading");
  });

  it("cfg_leading=true + cfg_leadingIcon のとき leading={<Icon>...} が出力される", () => {
    const jsx = buildComponentJsx(
      make("Toolbar", {
        groups: "1",
        group0_items: "1",
        group0_item0_type: "Button",
        group0_item0_cfg_leading: "true",
        group0_item0_cfg_leadingIcon: "LfSearch",
      }),
      INDENT,
    );
    expect(jsx).toContain("leading={<Icon><LfSearch /></Icon>}");
  });

  it("cfg_trailing=true + cfg_trailingIcon のとき trailing={<Icon>...} が出力される", () => {
    const jsx = buildComponentJsx(
      make("Toolbar", {
        groups: "1",
        group0_items: "1",
        group0_item0_type: "Button",
        group0_item0_cfg_trailing: "true",
        group0_item0_cfg_trailingIcon: "LfArrowDown",
      }),
      INDENT,
    );
    expect(jsx).toContain("trailing={<Icon><LfArrowDown /></Icon>}");
  });
});

describe("[exhaustive] Toolbar: IconButton props", () => {
  it("cfg_icon がアイコンに反映される", () => {
    const jsx = buildComponentJsx(
      make("Toolbar", { groups: "1", group0_items: "1", group0_item0_cfg_icon: "LfSearch" }),
      INDENT,
    );
    expect(jsx).toContain("<LfSearch />");
  });

  it("cfg_icon 未指定のとき LfPlusLarge がデフォルト", () => {
    const jsx = buildComponentJsx(make("Toolbar", { groups: "1", group0_items: "1" }), INDENT);
    expect(jsx).toContain("<LfPlusLarge />");
  });

  it("cfg_loading=true のとき loading が出力される", () => {
    const jsx = buildComponentJsx(
      make("Toolbar", { groups: "1", group0_items: "1", group0_item0_cfg_loading: "true" }),
      INDENT,
    );
    expect(jsx).toContain(" loading");
  });

  it("Tooltip で IconButton が wrap される", () => {
    const jsx = buildComponentJsx(make("Toolbar", { groups: "1", group0_items: "1" }), INDENT);
    expect(jsx.indexOf("<Tooltip")).toBeLessThan(jsx.indexOf("<IconButton"));
  });

  it('cfg_variant="plain"（default）のとき variant= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(
      make("Toolbar", { groups: "1", group0_items: "1", group0_item0_cfg_variant: "plain" }),
      INDENT,
    );
    expect(jsx).not.toContain('variant="plain"');
  });

  it('cfg_variant="subtle" のとき variant="subtle" が出力される', () => {
    const jsx = buildComponentJsx(
      make("Toolbar", { groups: "1", group0_items: "1", group0_item0_cfg_variant: "subtle" }),
      INDENT,
    );
    expect(jsx).toContain('variant="subtle"');
  });
});

describe("[exhaustive] Toolbar: Cat-4 import completeness", () => {
  it("デフォルト（IconButton items）のとき Toolbar/ToolbarGroup/ToolbarSeparator/IconButton/Icon/Tooltip が含まれる", () => {
    const imports = collectComponentImports([make("Toolbar")]);
    expect(imports).toContain("Toolbar");
    expect(imports).toContain("ToolbarGroup");
    expect(imports).toContain("ToolbarSeparator");
    expect(imports).toContain("IconButton");
    expect(imports).toContain("Icon");
    expect(imports).toContain("Tooltip");
  });

  it("デフォルトのとき Button が import に含まれない", () => {
    const imports = collectComponentImports([make("Toolbar")]);
    expect(imports).not.toContain("Button");
  });

  it("groups=1 のとき ToolbarSeparator が import に含まれない", () => {
    const imports = collectComponentImports([make("Toolbar", { groups: "1" })]);
    expect(imports).not.toContain("ToolbarSeparator");
  });

  it("type=Button items のとき Button が import に含まれる", () => {
    const imports = collectComponentImports([
      make("Toolbar", { groups: "1", group0_items: "1", group0_item0_type: "Button" }),
    ]);
    expect(imports).toContain("Button");
  });
});

describe("[exhaustive] Toolbar: orientation", () => {
  it('orientation="vertical" のとき orientation="vertical" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Toolbar", { orientation: "vertical" }), INDENT);
    expect(jsx).toContain('orientation="vertical"');
  });

  it('orientation="horizontal" のとき orientation 属性は出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("Toolbar", { orientation: "horizontal" }), INDENT);
    expect(jsx).not.toContain("orientation=");
  });

  it("orientation 未指定のとき orientation 属性は出力されない（デフォルト=horizontal）", () => {
    const jsx = buildComponentJsx(make("Toolbar"), INDENT);
    expect(jsx).not.toContain("orientation=");
  });
});

/// Form — key: items count [1-10], inputType\${n}, fcOrientation, label
describe("[exhaustive] Form: items count と label", () => {
  it("items=1 のとき FormControl が 1 つ出力される（下限）", () => {
    const jsx = buildComponentJsx(make("Form", { items: "1" }), INDENT);
    const matches = jsx.match(/<FormControl>/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("items=8 のとき FormControl が 8 つ出力される", () => {
    const jsx = buildComponentJsx(make("Form", { items: "8" }), INDENT);
    const matches = jsx.match(/<FormControl>/g) ?? [];
    expect(matches.length).toBe(8);
  });

  it("items=0 のとき min=1 に clamp される", () => {
    const jsx = buildComponentJsx(make("Form", { items: "0" }), INDENT);
    const matches = jsx.match(/<FormControl>/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("items=99 のとき max=20 に clamp される（fieldConfig max=20 に合わせる）", () => {
    const jsx = buildComponentJsx(make("Form", { items: "99" }), INDENT);
    const matches = jsx.match(/<FormControl>/g) ?? [];
    expect(matches.length).toBe(20);
  });

  it("itemEdit\${n}_fcLabel が FormControl.Label children に反映される", () => {
    const jsx = buildComponentJsx(
      make("Form", { items: "2", itemEdit1_fcLabel: "名前", itemEdit2_fcLabel: "会社名" }),
      INDENT,
    );
    expect(jsx).toContain("名前");
    expect(jsx).toContain("会社名");
  });

  it("itemEdit\${n}_fcLabel 未指定のとき 'Field n' フォールバックが出る", () => {
    const jsx = buildComponentJsx(make("Form", { items: "1" }), INDENT);
    expect(jsx).toContain("Field 1");
  });
});

describe("[exhaustive] Form: inputType\${n} per-field dispatch", () => {
  it("inputType1='TextField' のとき TextField が出力される", () => {
    const jsx = buildComponentJsx(make("Form", { items: "1", inputType1: "TextField" }), INDENT);
    expect(jsx).toContain("<TextField />");
  });

  it("inputType1='TextArea' のとき Textarea が出力される", () => {
    const jsx = buildComponentJsx(make("Form", { items: "1", inputType1: "TextArea" }), INDENT);
    expect(jsx).toContain("<Textarea />");
  });

  it("inputType1='Search' のとき Search が出力される", () => {
    const jsx = buildComponentJsx(make("Form", { items: "1", inputType1: "Search" }), INDENT);
    expect(jsx).toContain("<Search");
  });

  it("inputType1='Combobox' のとき Combobox と options が出力される", () => {
    const jsx = buildComponentJsx(make("Form", { items: "1", inputType1: "Combobox" }), INDENT);
    expect(jsx).toContain("<Combobox");
    expect(jsx).toContain("options={[");
    expect(jsx).toContain('{ value: "Option A"');
  });

  it("inputType1='CheckboxGroup' のとき CheckboxGroup と Checkbox が出力される", () => {
    const jsx = buildComponentJsx(make("Form", { items: "1", inputType1: "CheckboxGroup" }), INDENT);
    expect(jsx).toContain("<CheckboxGroup>");
    expect(jsx).toContain("<Checkbox>");
  });

  it("inputType1='RadioGroup' のとき RadioGroup と Radio が出力される", () => {
    const jsx = buildComponentJsx(make("Form", { items: "1", inputType1: "RadioGroup" }), INDENT);
    expect(jsx).toContain("<RadioGroup>");
    expect(jsx).toContain("<Radio>");
  });

  it("inputType1='TagPicker' のとき TagPicker と options が出力される", () => {
    const jsx = buildComponentJsx(make("Form", { items: "1", inputType1: "TagPicker" }), INDENT);
    expect(jsx).toContain("<TagPicker");
    expect(jsx).toContain("options={[");
  });

  it("inputType1='Select'（デフォルト）のとき Select と options が出力される", () => {
    const jsx = buildComponentJsx(make("Form", { items: "1" }), INDENT);
    expect(jsx).toContain("<Select");
    expect(jsx).toContain("options={[");
    expect(jsx).toContain('{ value: "Option A"');
  });

  it("各フィールドで異なる inputType を混在できる", () => {
    const jsx = buildComponentJsx(
      make("Form", { items: "3", inputType1: "TextField", inputType2: "TextArea", inputType3: "Combobox" }),
      INDENT,
    );
    expect(jsx).toContain("<TextField />");
    expect(jsx).toContain("<Textarea />");
    expect(jsx).toContain("<Combobox");
  });
});

describe("[exhaustive] Form: fcOrientation", () => {
  it('fcOrientation="Horizontal" のとき FormControl に orientation="horizontal" が付く', () => {
    const jsx = buildComponentJsx(make("Form", { items: "1", fcOrientation: "Horizontal" }), INDENT);
    expect(jsx).toContain('orientation="horizontal"');
  });

  it('fcOrientation="Vertical"（デフォルト）のとき orientation= は出力されない', () => {
    const jsx = buildComponentJsx(make("Form", { items: "1", fcOrientation: "Vertical" }), INDENT);
    expect(jsx).not.toContain("orientation=");
  });

  it("fcOrientation 未指定のとき orientation= は出力されない", () => {
    const jsx = buildComponentJsx(make("Form", { items: "1" }), INDENT);
    expect(jsx).not.toContain("orientation=");
  });
});

describe("[exhaustive] Form: Cat-4 import completeness", () => {
  it("デフォルト（inputType=Select）のとき Form/FormControl/Select が含まれる", () => {
    const imports = collectComponentImports([make("Form")]);
    expect(imports).toContain("Form");
    expect(imports).toContain("FormControl");
    expect(imports).toContain("Select");
  });

  it("inputType1='TextField' のとき TextField が含まれる", () => {
    const imports = collectComponentImports([make("Form", { items: "1", inputType1: "TextField" })]);
    expect(imports).toContain("TextField");
  });

  it("inputType1='CheckboxGroup' のとき CheckboxGroup と Checkbox が含まれる", () => {
    const imports = collectComponentImports([make("Form", { items: "1", inputType1: "CheckboxGroup" })]);
    expect(imports).toContain("CheckboxGroup");
    expect(imports).toContain("Checkbox");
  });

  it("inputType1='RadioGroup' のとき RadioGroup と Radio が含まれる", () => {
    const imports = collectComponentImports([make("Form", { items: "1", inputType1: "RadioGroup" })]);
    expect(imports).toContain("RadioGroup");
    expect(imports).toContain("Radio");
  });

  it("inputType1='Combobox' のとき Combobox が含まれる", () => {
    const imports = collectComponentImports([make("Form", { items: "1", inputType1: "Combobox" })]);
    expect(imports).toContain("Combobox");
  });

  it("inputType1='TagPicker' のとき TagPicker が含まれる", () => {
    const imports = collectComponentImports([make("Form", { items: "1", inputType1: "TagPicker" })]);
    expect(imports).toContain("TagPicker");
  });

  it("item1FormLayout='with group' のとき FormGroup が imports に含まれる", () => {
    const imports = collectComponentImports([make("Form", { items: "1", item1FormLayout: "with group" })]);
    expect(imports).toContain("FormGroup");
  });

  it("item1FormLayout='nested' のとき FormGroup が imports に含まれる", () => {
    const imports = collectComponentImports([make("Form", { items: "1", item1FormLayout: "nested" })]);
    expect(imports).toContain("FormGroup");
  });

  it("FormGroup は layout が default のみのとき imports に含まれない", () => {
    const imports = collectComponentImports([make("Form", { items: "2" })]);
    expect(imports).not.toContain("FormGroup");
  });
});

describe("[exhaustive] Form: with group レイアウト", () => {
  const withGroupProps = { items: "1", item1FormLayout: "with group" };

  it("FormGroup が出力される", () => {
    const jsx = buildComponentJsx(make("Form", withGroupProps), INDENT);
    expect(jsx).toContain("<FormGroup>");
    expect(jsx).toContain("</FormGroup>");
  });

  it("div style={{ flex: 1, minWidth: 0 }} ラッパーが 2 つ出る", () => {
    const jsx = buildComponentJsx(make("Form", withGroupProps), INDENT);
    const matches = jsx.match(/flex: 1, minWidth: 0/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("inputType1 と inputType1_2 が両方の FC に反映される", () => {
    const jsx = buildComponentJsx(
      make("Form", { ...withGroupProps, inputType1: "TextField", inputType1_2: "TextArea" }),
      INDENT,
    );
    expect(jsx).toContain("<TextField />");
    expect(jsx).toContain("<Textarea />");
  });

  it("itemEdit1_fcLabel が FC 1 のラベルに反映される", () => {
    const jsx = buildComponentJsx(make("Form", { ...withGroupProps, itemEdit1_fcLabel: "担当者" }), INDENT);
    expect(jsx).toContain("担当者");
  });

  it("itemEdit1_2_fcLabel が FC 2 のラベルに反映される", () => {
    const jsx = buildComponentJsx(make("Form", { ...withGroupProps, itemEdit1_2_fcLabel: "組織名" }), INDENT);
    expect(jsx).toContain("組織名");
  });

  it("itemEdit1_required='true' のとき FC 1 に required が付く", () => {
    const jsx = buildComponentJsx(make("Form", { ...withGroupProps, itemEdit1_required: "true" }), INDENT);
    expect(jsx).toContain("<FormControl required>");
  });

  it("フラット並び（旧実装）ではなく FormGroup ラッパーで出力される", () => {
    const jsx = buildComponentJsx(make("Form", withGroupProps), INDENT);
    // FormGroup が存在するはず
    expect(jsx).toContain("<FormGroup>");
    // 旧実装のフラット 2 連 FormControl は FormGroup 内に入っている
    const formGroupBlock = jsx.slice(jsx.indexOf("<FormGroup>"), jsx.indexOf("</FormGroup>") + 12);
    expect(formGroupBlock).toContain("<FormControl>");
  });
});

describe("[exhaustive] Form: nested レイアウト", () => {
  const nestedProps = { items: "1", item1FormLayout: "nested" };

  it("FormGroup と sub prop が出力される", () => {
    const jsx = buildComponentJsx(make("Form", nestedProps), INDENT);
    expect(jsx).toContain("<FormGroup");
    expect(jsx).toContain("sub={[");
    expect(jsx).toContain("]}");
  });

  it("プレースホルダーコメントが出力されない（旧 T2 → T1 昇格）", () => {
    const jsx = buildComponentJsx(make("Form", nestedProps), INDENT);
    expect(jsx).not.toContain("nested layout: implement");
  });

  it("nestedItems1=2 のとき サブ FC が 2 つ出る（closing tag にカンマが付く）", () => {
    const jsx = buildComponentJsx(make("Form", { ...nestedProps, nestedItems1: "2" }), INDENT);
    // サブ FC は </FormControl>, (trailing comma) で識別する
    const subFcCount = (jsx.match(/<\\/FormControl>,/g) ?? []).length;
    expect(subFcCount).toBe(2);
  });

  it("nestedItems1=1（下限）のとき サブ FC が 1 つ出る", () => {
    const jsx = buildComponentJsx(make("Form", { ...nestedProps, nestedItems1: "1" }), INDENT);
    const subFcCount = (jsx.match(/<\\/FormControl>,/g) ?? []).length;
    expect(subFcCount).toBe(1);
  });

  it("nestedItemEdit1_1_fcLabel がサブ FC 1 のラベルに反映される", () => {
    const jsx = buildComponentJsx(
      make("Form", { ...nestedProps, nestedItems1: "1", nestedItemEdit1_1_fcLabel: "サブラベル" }),
      INDENT,
    );
    expect(jsx).toContain("サブラベル");
  });

  it("nestedInputType1_1='TextField' のとき サブ FC 内に TextField が出る", () => {
    const jsx = buildComponentJsx(
      make("Form", { ...nestedProps, nestedItems1: "1", nestedInputType1_1: "TextField" }),
      INDENT,
    );
    // nestedItems1=1 かつ 親も inputType 未指定(=Select) → TextField はサブ FC 由来
    expect(jsx).toContain("<TextField />");
  });

  it("nestedItemEdit1_1_required='true' のとき サブ FC に required が付く", () => {
    const jsx = buildComponentJsx(
      make("Form", { ...nestedProps, nestedItems1: "1", nestedItemEdit1_1_required: "true" }),
      INDENT,
    );
    // required は </FormControl>, より前に現れる（サブ FC に付く）
    const beforeParentFc = jsx.slice(0, jsx.lastIndexOf("</FormControl>,") + 15);
    expect(beforeParentFc).toContain("required");
  });

  it("親 FormControl が FormGroup の children に出る（sub 外）", () => {
    const jsx = buildComponentJsx(make("Form", nestedProps), INDENT);
    // ]}> より後に FormControl がある
    const afterSub = jsx.slice(jsx.indexOf("]}"));
    expect(afterSub).toContain("<FormControl");
  });

  it("inputType1 が 親 FormControl の input type に反映される", () => {
    const jsx = buildComponentJsx(make("Form", { ...nestedProps, inputType1: "TextField" }), INDENT);
    // 親 FC（sub 外）に TextField が出る
    const afterSub = jsx.slice(jsx.indexOf("]}"));
    expect(afterSub).toContain("<TextField />");
  });

  it("itemEdit1_fcLabel が 親 FC のラベルに反映される", () => {
    const jsx = buildComponentJsx(make("Form", { ...nestedProps, itemEdit1_fcLabel: "親フィールド" }), INDENT);
    expect(jsx).toContain("親フィールド");
  });

  it("サブ FC の closing tag の後にカンマが付く（JSX 配列構文）", () => {
    const jsx = buildComponentJsx(make("Form", { ...nestedProps, nestedItems1: "2" }), INDENT);
    // サブ FC は </FormControl>, で終わる（親 FC は </FormControl> でカンマなし）
    expect(jsx).toContain("</FormControl>,");
  });
});

describe("[exhaustive] Form: per-item fcCaption・fcGroup", () => {
  it("itemEdit1_fcCaption=true のとき FormControl.Caption が出力される", () => {
    const jsx = buildComponentJsx(make("Form", { items: "1", itemEdit1_fcCaption: "true" }), INDENT);
    expect(jsx).toContain("<FormControl.Caption>");
    expect(jsx).toContain("</FormControl.Caption>");
  });

  it("itemEdit1_fcCaptionText が FormControl.Caption のテキストに反映される", () => {
    const jsx = buildComponentJsx(
      make("Form", { items: "1", itemEdit1_fcCaption: "true", itemEdit1_fcCaptionText: "入力説明文" }),
      INDENT,
    );
    expect(jsx).toContain("入力説明文");
  });

  it("itemEdit1_fcCaption 未指定のとき FormControl.Caption は出力されない", () => {
    const jsx = buildComponentJsx(make("Form", { items: "1" }), INDENT);
    expect(jsx).not.toContain("FormControl.Caption");
  });

  it("itemEdit1_fcGroup=true のとき FormControl.Group が出力される", () => {
    const jsx = buildComponentJsx(make("Form", { items: "1", itemEdit1_fcGroup: "true" }), INDENT);
    expect(jsx).toContain("<FormControl.Group>");
    expect(jsx).toContain("</FormControl.Group>");
  });

  it("itemEdit1_fcGroupInputType=TextField のとき TextField が FormControl.Group 内に出力される", () => {
    const jsx = buildComponentJsx(
      make("Form", { items: "1", itemEdit1_fcGroup: "true", itemEdit1_fcGroupInputType: "TextField" }),
      INDENT,
    );
    expect(jsx).toContain("<FormControl.Group>");
    expect(jsx).toContain("<TextField />");
  });

  it("itemEdit1_fcGroup 未指定のとき FormControl.Group は出力されない", () => {
    const jsx = buildComponentJsx(make("Form", { items: "1" }), INDENT);
    expect(jsx).not.toContain("FormControl.Group");
  });

  it("nested レイアウトの nestedItemEdit1_1_fcCaption=true にも FormControl.Caption が出る", () => {
    const jsx = buildComponentJsx(
      make("Form", { items: "1", item1FormLayout: "nested", nestedItems1: "1", nestedItemEdit1_1_fcCaption: "true" }),
      INDENT,
    );
    expect(jsx).toContain("<FormControl.Caption>");
  });
});

/// Tree — key: label textarea（インデントで階層表現）, selection, reorderable
describe("[exhaustive] Tree: label テキストからの名前反映", () => {
  it("label に 'Item A' を指定すると getItemName map に 'Item A' が含まれる", () => {
    const jsx = buildComponentJsx(make("Tree", { label: "Item A" }), INDENT);
    expect(jsx).toContain('"Item A"');
  });

  it("label に複数項目を指定すると items map に item-1/item-2 が含まれる", () => {
    const jsx = buildComponentJsx(make("Tree", { label: "Foo,\\nBar" }), INDENT);
    expect(jsx).toContain('"item-1"');
    expect(jsx).toContain('"item-2"');
  });

  it("label の名前がカンマ除去されて getItemName に反映される", () => {
    const jsx = buildComponentJsx(make("Tree", { label: "親ノード," }), INDENT);
    expect(jsx).toContain('"親ノード"');
    expect(jsx).not.toContain('"親ノード,"');
  });

  it("rootItemId='root' が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Tree"), INDENT);
    expect(jsx).toContain('rootItemId="root"');
  });

  it("getItemName が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Tree"), INDENT);
    expect(jsx).toContain("getItemName");
  });

  it("getItemChildren が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Tree"), INDENT);
    expect(jsx).toContain("getItemChildren");
  });
});

describe("[exhaustive] Tree: 階層構造の反映", () => {
  it("インデント 2 スペースの行が depth-1 として親の children に入る", () => {
    const jsx = buildComponentJsx(make("Tree", { label: "Parent,\\n  Child" }), INDENT);
    // root → item-1(Parent), item-1 → item-2(Child)
    expect(jsx).toContain('"item-1"');
    expect(jsx).toContain('"item-2"');
    // getItemChildren map に parent→[child] が含まれる
    expect(jsx).toContain('"item-1": ["item-2"]');
  });

  it("ルート直下の項目が root の children として getItemChildren に含まれる", () => {
    const jsx = buildComponentJsx(make("Tree", { label: "A,\\nB,\\nC" }), INDENT);
    expect(jsx).toContain('"root": ["item-1", "item-2", "item-3"]');
  });

  it("defaultExpandedItems にルート直下項目が含まれる", () => {
    const jsx = buildComponentJsx(make("Tree", { label: "A,\\n  A-1,\\nB" }), INDENT);
    expect(jsx).toContain("defaultExpandedItems");
    expect(jsx).toContain('"item-1"');
  });
});

describe("[exhaustive] Tree: selection / reorderable props", () => {
  it('selection=true のとき selectionType="multiple" が出力される（デフォルト selectionType=Multiple）', () => {
    const jsx = buildComponentJsx(make("Tree", { selection: "true" }), INDENT);
    expect(jsx).toContain('selectionType="multiple"');
  });

  it('selection=true + selectionType="Single" のとき selectionType="single" が出力される', () => {
    const jsx = buildComponentJsx(make("Tree", { selection: "true", selectionType: "Single" }), INDENT);
    expect(jsx).toContain('selectionType="single"');
  });

  it("selection=false のとき selectionType は出力されない", () => {
    const jsx = buildComponentJsx(make("Tree", { selection: "false" }), INDENT);
    expect(jsx).not.toContain("selectionType=");
  });

  it("selection 未指定のとき selectionType は出力されない", () => {
    const jsx = buildComponentJsx(make("Tree"), INDENT);
    expect(jsx).not.toContain("selectionType=");
  });

  it("selection=true + propagateSelection=true のとき propagateSelection が出力される", () => {
    const jsx = buildComponentJsx(make("Tree", { selection: "true", propagateSelection: "true" }), INDENT);
    expect(jsx).toContain("propagateSelection");
  });

  it("reorderable=true のとき reorderable が出力される", () => {
    const jsx = buildComponentJsx(make("Tree", { reorderable: "true" }), INDENT);
    expect(jsx).toContain("reorderable");
  });

  it("reorderable=false のとき reorderable は出力されない", () => {
    const jsx = buildComponentJsx(make("Tree", { reorderable: "false" }), INDENT);
    expect(jsx).not.toContain("reorderable");
  });
});

describe("[exhaustive] Tree: Cat-4 import completeness", () => {
  it("collectComponentImports に Tree が含まれる", () => {
    const imports = collectComponentImports([make("Tree")]);
    expect(imports).toContain("Tree");
  });
});

describe("[exhaustive] Tree: children scaffold comment・デフォルトラベル整合", () => {
  it("children=true のとき scaffold comment が出力される", () => {
    const jsx = buildComponentJsx(make("Tree", { children: "true" }), INDENT);
    expect(jsx).toContain("// children={(id) => (");
    expect(jsx).toContain("// )}");
  });

  it("children 未指定のとき scaffold comment は出力されない", () => {
    const jsx = buildComponentJsx(make("Tree"), INDENT);
    expect(jsx).not.toContain("// children");
  });

  it("label 未指定（デフォルト）のとき fieldConfig の TREE_LABEL_DEFAULT と一致する 'Tree Item A' が出力に含まれる", () => {
    // props.label が未設定 → TREE_LABEL_DEFAULT をフォールバックとして使用
    const jsx = buildComponentJsx(make("Tree"), INDENT);
    expect(jsx).toContain('"Tree Item A"');
  });
});

// NavList — key: itemTexts カンマ区切り → NavList.Item が含まれる
describe("[exhaustive] NavList: itemTexts", () => {
  it("itemTexts カンマ区切りの値が NavList.Item children に反映される", () => {
    const jsx = buildComponentJsx(make("NavList", { itemTexts: "Home,Profile,Settings" }), INDENT);
    expect(jsx).toContain("Home");
    expect(jsx).toContain("Profile");
    expect(jsx).toContain("Settings");
    expect(jsx).toContain("<NavList.Item ");
  });

  it("itemTexts 未指定のとき 'Dashboard,Settings,Reports' がデフォルト", () => {
    const jsx = buildComponentJsx(make("NavList"), INDENT);
    expect(jsx).toContain("Dashboard");
    expect(jsx).toContain("Settings");
    expect(jsx).toContain("Reports");
  });
});

describe("[exhaustive] NavList: Cat-4 import completeness", () => {
  it("collectComponentImports に NavList が含まれる", () => {
    const imports = collectComponentImports([make("NavList")]);
    expect(imports).toContain("NavList");
  });
});

// OrderedList — key: items カンマ区切り → OrderedList.Item が含まれる
describe("[exhaustive] OrderedList: items", () => {
  it("items カンマ区切りの値が OrderedList.Item children に反映される", () => {
    const jsx = buildComponentJsx(make("OrderedList", { items: "First,Second,Third" }), INDENT);
    expect(jsx).toContain("First");
    expect(jsx).toContain("Second");
    expect(jsx).toContain("Third");
    expect(jsx).toContain("<OrderedList.Item>");
  });

  it("items 未指定のとき 'AAA,BBB,CCC' がデフォルト", () => {
    const jsx = buildComponentJsx(make("OrderedList"), INDENT);
    expect(jsx).toContain("AAA");
    expect(jsx).toContain("BBB");
    expect(jsx).toContain("CCC");
  });
});

describe("[exhaustive] OrderedList: Cat-4 import completeness", () => {
  it("collectComponentImports に OrderedList が含まれる", () => {
    const imports = collectComponentImports([make("OrderedList")]);
    expect(imports).toContain("OrderedList");
  });
});

// UnorderedList — key: items カンマ区切り → UnorderedList.Item が含まれる
describe("[exhaustive] UnorderedList: items", () => {
  it("items カンマ区切りの値が UnorderedList.Item children に反映される", () => {
    const jsx = buildComponentJsx(make("UnorderedList", { items: "X,Y,Z" }), INDENT);
    expect(jsx).toContain("X");
    expect(jsx).toContain("Y");
    expect(jsx).toContain("Z");
    expect(jsx).toContain("<UnorderedList.Item>");
  });

  it("items 未指定のとき 'AAA,BBB,CCC' がデフォルト", () => {
    const jsx = buildComponentJsx(make("UnorderedList"), INDENT);
    expect(jsx).toContain("AAA");
  });
});

describe("[exhaustive] UnorderedList: Cat-4 import completeness", () => {
  it("collectComponentImports に UnorderedList が含まれる", () => {
    const imports = collectComponentImports([make("UnorderedList")]);
    expect(imports).toContain("UnorderedList");
  });
});

// DescriptionList — key: items count [1-6], term カンマ区切り, detail カンマ区切り
describe("[exhaustive] DescriptionList: items count と term/detail", () => {
  it("items=1 のとき DescriptionListItem が 1 つ出力される（下限）", () => {
    const jsx = buildComponentJsx(make("DescriptionList", { items: "1" }), INDENT);
    const matches = jsx.match(/<DescriptionListItem>/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("items=6 のとき DescriptionListItem が 6 つ出力される（上限）", () => {
    const jsx = buildComponentJsx(make("DescriptionList", { items: "6" }), INDENT);
    const matches = jsx.match(/<DescriptionListItem>/g) ?? [];
    expect(matches.length).toBe(6);
  });

  it("term カンマ区切りの値が DescriptionListTerm children に反映される", () => {
    const jsx = buildComponentJsx(make("DescriptionList", { items: "2", term: "Name,Age" }), INDENT);
    expect(jsx).toContain("<DescriptionListTerm>Name</DescriptionListTerm>");
    expect(jsx).toContain("<DescriptionListTerm>Age</DescriptionListTerm>");
  });

  it("detail カンマ区切りの値が DescriptionListDetail children に反映される", () => {
    const jsx = buildComponentJsx(make("DescriptionList", { items: "2", detail: "John,30" }), INDENT);
    expect(jsx).toContain("<DescriptionListDetail>John</DescriptionListDetail>");
    expect(jsx).toContain("<DescriptionListDetail>30</DescriptionListDetail>");
  });
});

describe("[exhaustive] DescriptionList: Cat-4 import completeness", () => {
  it("collectComponentImports に DescriptionList/DescriptionListItem/DescriptionListTerm/DescriptionListDetail が含まれる", () => {
    const imports = collectComponentImports([make("DescriptionList")]);
    expect(imports).toContain("DescriptionList");
    expect(imports).toContain("DescriptionListItem");
    expect(imports).toContain("DescriptionListTerm");
    expect(imports).toContain("DescriptionListDetail");
  });
});

// =============================================================================
// グループ9: Text (resolveTextVariant)
// builder キー: textType, sizeBody/sizeTitle/etc., weight, font, text, textArea
// =============================================================================

describe("[exhaustive] Text: textType='body' variants", () => {
  it("textType='body' のとき variant='body.medium' が出力される（デフォルト）", () => {
    const jsx = buildComponentJsx(make("Text", { textType: "body" }), INDENT);
    expect(jsx).toContain('variant="body.medium"');
  });

  it("textType='body' + sizeBody='large' のとき variant='body.large' が出力される", () => {
    const jsx = buildComponentJsx(make("Text", { textType: "body", sizeBody: "large" }), INDENT);
    expect(jsx).toContain('variant="body.large"');
  });

  it("textType='body' + weight='bold' のとき variant='body.medium.bold' が出力される", () => {
    const jsx = buildComponentJsx(make("Text", { textType: "body", weight: "bold" }), INDENT);
    expect(jsx).toContain('variant="body.medium.bold"');
  });
});

describe("[exhaustive] Text: textType='title'", () => {
  it("textType='title' のとき as='h2' が出力される", () => {
    const jsx = buildComponentJsx(make("Text", { textType: "title" }), INDENT);
    expect(jsx).toContain('as="h2"');
    expect(jsx).toContain("title.");
  });
});

describe("[exhaustive] Text: textType='caption'", () => {
  it("textType='caption' のとき variant='caption.small' が出力される（default size='small'）", () => {
    const jsx = buildComponentJsx(make("Text", { textType: "caption" }), INDENT);
    expect(jsx).toContain('variant="caption.small"');
  });
});

describe("[exhaustive] Text: textType='label'", () => {
  it("textType='label' のとき variant='label.medium' が出力される", () => {
    const jsx = buildComponentJsx(make("Text", { textType: "label" }), INDENT);
    expect(jsx).toContain('variant="label.medium"');
  });
});

describe("[exhaustive] Text: textType='document body'", () => {
  it("textType='document body' のとき variant='document.body.sans.medium' が出力される（font='sans' default）", () => {
    const jsx = buildComponentJsx(make("Text", { textType: "document body" }), INDENT);
    expect(jsx).toContain('variant="document.body.sans.medium"');
  });
});

describe("[exhaustive] Text: text key", () => {
  it("text カスタム値が children に反映される", () => {
    const jsx = buildComponentJsx(make("Text", { text: "Hello World" }), INDENT);
    expect(jsx).toContain("Hello World");
  });

  it("text 未指定のとき 'Text content' がデフォルト", () => {
    const jsx = buildComponentJsx(make("Text"), INDENT);
    expect(jsx).toContain("Text content");
  });
});

describe("[exhaustive] Text: Cat-4 import completeness", () => {
  it("collectComponentImports に Text が含まれる", () => {
    const imports = collectComponentImports([make("Text")]);
    expect(imports).toContain("Text");
  });
});

// =============================================================================
// グループ10: Banner（多条件）
// builder キー: color (sp threshold="information"), title=bool, titleText,
//               action=bool, withActionLabel=bool, closeButton (string "false"→ emit),
//               inline=bool, text, buttonLabel, linkLabel
// =============================================================================

describe("[exhaustive] Banner: color sp threshold", () => {
  it('color="information" のとき color= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("Banner", { color: "information" }), INDENT);
    expect(jsx).not.toContain("color=");
  });

  it.each(["success", "warning", "danger", "neutral"] as const)('color="%s" が出力に含まれる', (color) => {
    const jsx = buildComponentJsx(make("Banner", { color }), INDENT);
    expect(jsx).toContain(\`color="\${color}"\`);
  });
});

describe("[exhaustive] Banner: title boolean と titleText", () => {
  it("title=true のとき title='...' が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Banner", { title: "true", titleText: "Custom Title" }), INDENT);
    expect(jsx).toContain('title="Custom Title"');
  });

  it("title=false のとき title= が出力されない", () => {
    const jsx = buildComponentJsx(make("Banner", { title: "false" }), INDENT);
    expect(jsx).not.toContain("title=");
  });

  it("title=true + titleText 未指定のとき 'Information Title' がデフォルト", () => {
    const jsx = buildComponentJsx(make("Banner", { title: "true" }), INDENT);
    expect(jsx).toContain('title="Information Title"');
  });
});

describe("[exhaustive] Banner: action boolean", () => {
  it("action=true のとき action={<Button ...>} が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Banner", { action: "true" }), INDENT);
    expect(jsx).toContain("action={<Button");
  });

  it("action=false のとき action= が出力されない", () => {
    const jsx = buildComponentJsx(make("Banner", { action: "false" }), INDENT);
    expect(jsx).not.toContain("action=");
  });
});

describe("[exhaustive] Banner: withActionLabel boolean", () => {
  it("withActionLabel=true のとき Banner.ActionLabel が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Banner", { withActionLabel: "true" }), INDENT);
    expect(jsx).toContain("Banner.ActionLabel");
    expect(jsx).toContain("<Link");
  });

  it("withActionLabel=false のとき Banner.ActionLabel が出力されない", () => {
    const jsx = buildComponentJsx(make("Banner", { withActionLabel: "false" }), INDENT);
    expect(jsx).not.toContain("Banner.ActionLabel");
  });
});

describe("[exhaustive] Banner: closeButton", () => {
  it("closeButton='false'（文字列）のとき closeButton={false} が出力される", () => {
    const jsx = buildComponentJsx(make("Banner", { closeButton: "false" }), INDENT);
    expect(jsx).toContain("closeButton={false}");
  });

  it("closeButton 未指定（デフォルト: true）のとき closeButton= が出力されない", () => {
    const jsx = buildComponentJsx(make("Banner"), INDENT);
    expect(jsx).not.toContain("closeButton=");
  });
});

describe("[exhaustive] Banner: inline boolean", () => {
  it("inline=true のとき inline が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Banner", { inline: "true" }), INDENT);
    expect(jsx).toContain(" inline");
  });

  it("inline=false のとき inline が出力されない", () => {
    const jsx = buildComponentJsx(make("Banner", { inline: "false" }), INDENT);
    expect(jsx).not.toContain(" inline");
  });
});

describe("[exhaustive] Banner: Cat-4 import completeness", () => {
  it("基本: collectComponentImports に Banner が含まれる", () => {
    const imports = collectComponentImports([make("Banner")]);
    expect(imports).toContain("Banner");
  });

  it("action=true: collectComponentImports に Button が含まれる", () => {
    const imports = collectComponentImports([make("Banner", { action: "true" })]);
    expect(imports).toContain("Button");
  });

  it("withActionLabel=true: collectComponentImports に Link が含まれる", () => {
    const imports = collectComponentImports([make("Banner", { withActionLabel: "true" })]);
    expect(imports).toContain("Link");
  });
});

// =============================================================================
// グループ11: ContentHeader（多条件）
// builder キー: titleText (default:"Page Title"), size (sp threshold="xLarge"),
//               descriptionTop=bool, descriptionBottom=bool,
//               trailing=bool, trailingContent ("Button"|"ButtonGroup"|other)
// =============================================================================

describe("[exhaustive] ContentHeader: titleText と size", () => {
  it("titleText カスタム値が ContentHeaderTitle children に反映される", () => {
    const jsx = buildComponentJsx(make("ContentHeader", { titleText: "顧客一覧" }), INDENT);
    expect(jsx).toContain("顧客一覧");
    expect(jsx).toContain("<ContentHeaderTitle>");
  });

  it("titleText 未指定のとき 'Page Title' がデフォルト", () => {
    const jsx = buildComponentJsx(make("ContentHeader"), INDENT);
    expect(jsx).toContain("Page Title");
  });

  it('size="xLarge" のとき size= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("ContentHeader", { size: "xLarge" }), INDENT);
    expect(jsx).not.toContain("size=");
  });

  it('size="large" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("ContentHeader", { size: "large" }), INDENT);
    expect(jsx).toContain('size="large"');
  });
});

describe("[exhaustive] ContentHeader: descriptionTop と descriptionBottom", () => {
  it("descriptionTop=true のとき ContentHeaderDescription が title の前に出る", () => {
    const jsx = buildComponentJsx(make("ContentHeader", { descriptionTop: "true" }), INDENT);
    const descIdx = jsx.indexOf("ContentHeaderDescription");
    const titleIdx = jsx.indexOf("ContentHeaderTitle");
    expect(descIdx).toBeGreaterThanOrEqual(0);
    expect(descIdx).toBeLessThan(titleIdx);
  });

  it("descriptionBottom=true のとき ContentHeaderDescription が title の後に出る", () => {
    const jsx = buildComponentJsx(make("ContentHeader", { descriptionBottom: "true" }), INDENT);
    const titleIdx = jsx.indexOf("ContentHeaderTitle");
    const descIdx = jsx.lastIndexOf("ContentHeaderDescription");
    expect(descIdx).toBeGreaterThan(titleIdx);
  });

  it("descriptionTop=false のとき ContentHeaderDescription が出力されない", () => {
    const jsx = buildComponentJsx(make("ContentHeader", { descriptionTop: "false" }), INDENT);
    expect(jsx).not.toContain("ContentHeaderDescription");
  });
});

describe("[exhaustive] ContentHeader: trailing と trailingContent", () => {
  it("trailing=true + trailingContent='ButtonGroup' のとき ButtonGroup が action に含まれる", () => {
    const jsx = buildComponentJsx(make("ContentHeader", { trailing: "true", trailingContent: "ButtonGroup" }), INDENT);
    expect(jsx).toContain("action={<ButtonGroup>");
    expect(jsx).toContain("<Button>");
  });

  it("trailing=true + trailingContent='Button' のとき Button が action に含まれる", () => {
    const jsx = buildComponentJsx(make("ContentHeader", { trailing: "true", trailingContent: "Button" }), INDENT);
    expect(jsx).toContain("action={<Button>");
  });

  it("trailing=false のとき action= が出力されない", () => {
    const jsx = buildComponentJsx(make("ContentHeader", { trailing: "false" }), INDENT);
    expect(jsx).not.toContain("action=");
  });
});

describe("[exhaustive] ContentHeader: Cat-4 import completeness", () => {
  it("基本: collectComponentImports に ContentHeader と ContentHeaderTitle が含まれる", () => {
    const imports = collectComponentImports([make("ContentHeader")]);
    expect(imports).toContain("ContentHeader");
    expect(imports).toContain("ContentHeaderTitle");
  });

  it("descriptionTop=true: collectComponentImports に ContentHeaderDescription が含まれる", () => {
    const imports = collectComponentImports([make("ContentHeader", { descriptionTop: "true" })]);
    expect(imports).toContain("ContentHeaderDescription");
  });

  it("trailing=true + ButtonGroup: collectComponentImports に ButtonGroup と Button が含まれる", () => {
    const imports = collectComponentImports([
      make("ContentHeader", { trailing: "true", trailingContent: "ButtonGroup" }),
    ]);
    expect(imports).toContain("ButtonGroup");
    expect(imports).toContain("Button");
  });
});

// =============================================================================
// グループ12: Card（header/body/footer 条件）
// builder キー: size (sp threshold="medium"), header=bool, footer=bool, body=bool,
//               headerText, bodyText
// =============================================================================

describe("[exhaustive] Card: size sp threshold", () => {
  it('size="medium" のとき size= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("Card", { size: "medium" }), INDENT);
    expect(jsx).not.toContain("size=");
  });

  it('size="large" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Card", { size: "large" }), INDENT);
    expect(jsx).toContain('size="large"');
  });
});

describe("[exhaustive] Card: header boolean", () => {
  it("header=true のとき CardHeader が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Card", { header: "true" }), INDENT);
    expect(jsx).toContain("<CardHeader>");
  });

  it("header=false のとき CardHeader が出力されない", () => {
    const jsx = buildComponentJsx(make("Card", { header: "false" }), INDENT);
    expect(jsx).not.toContain("CardHeader");
  });

  it("header=false のとき CardBody は必ず含まれる", () => {
    const jsx = buildComponentJsx(make("Card", { header: "false" }), INDENT);
    expect(jsx).toContain("<CardBody>");
  });
});

describe("[exhaustive] Card: footer boolean", () => {
  it("footer=true のとき CardFooter が出力に含まれる", () => {
    const jsx = buildComponentJsx(make("Card", { footer: "true" }), INDENT);
    expect(jsx).toContain("<CardFooter>");
  });

  it("footer=false のとき CardFooter が出力されない", () => {
    const jsx = buildComponentJsx(make("Card", { footer: "false" }), INDENT);
    expect(jsx).not.toContain("CardFooter");
  });
});

describe("[exhaustive] Card: headerText と bodyText", () => {
  it("headerText カスタム値が CardHeader children に反映される", () => {
    const jsx = buildComponentJsx(make("Card", { header: "true", headerText: "契約情報" }), INDENT);
    expect(jsx).toContain("契約情報");
  });

  it("bodyText カスタム値が CardBody children に反映される", () => {
    const jsx = buildComponentJsx(make("Card", { bodyText: "本文コンテンツ" }), INDENT);
    expect(jsx).toContain("本文コンテンツ");
  });
});

describe("[exhaustive] Card: Cat-4 import completeness", () => {
  it("基本: collectComponentImports に Card と CardBody が含まれる", () => {
    const imports = collectComponentImports([make("Card")]);
    expect(imports).toContain("Card");
    expect(imports).toContain("CardBody");
  });

  it("header=true: collectComponentImports に CardHeader が含まれる", () => {
    const imports = collectComponentImports([make("Card", { header: "true" })]);
    expect(imports).toContain("CardHeader");
  });

  it("footer=true: collectComponentImports に CardFooter が含まれる", () => {
    const imports = collectComponentImports([make("Card", { footer: "true" })]);
    expect(imports).toContain("CardFooter");
  });
});

// =============================================================================
// グループ13: DataTable
// builder キー: colItems [1-8], rowItems [1-10], col\${n}_colTitle, col\${n}_colContent
//               col\${n}_text / tagLabel / buttonLabel / linkLabel, getRowId 固定
// =============================================================================

describe("[exhaustive] DataTable: colItems count", () => {
  it("colItems=1 のとき column が 1 つ出力される（下限）", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1" }), INDENT);
    expect(jsx).toContain('id: "col1"');
    expect(jsx).not.toContain('id: "col2"');
  });

  it("colItems=8 のとき column が 8 つ出力される（上限）", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "8" }), INDENT);
    expect(jsx).toContain('id: "col8"');
  });

  it("colItems=9 のとき max=8 に clamp される", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "9" }), INDENT);
    expect(jsx).not.toContain('id: "col9"');
    expect(jsx).toContain('id: "col8"');
  });
});

describe("[exhaustive] DataTable: rowItems count", () => {
  it("rowItems=1 のとき row が 1 つ出力される（下限）", () => {
    const jsx = buildComponentJsx(make("DataTable", { rowItems: "1" }), INDENT);
    const matches = jsx.match(/\\{ col1: "/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("rowItems=10 のとき row が 10 つ出力される（上限）", () => {
    const jsx = buildComponentJsx(make("DataTable", { rowItems: "10" }), INDENT);
    const matches = jsx.match(/\\{ col1: "/g) ?? [];
    expect(matches.length).toBe(10);
  });
});

describe("[exhaustive] DataTable: col\${n}_colTitle per-column", () => {
  it("col\${n}_colTitle の各値が name: '...' として出力される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "3", col0_colTitle: "Name", col1_colTitle: "Age", col2_colTitle: "Email" }),
      INDENT,
    );
    expect(jsx).toContain('name: "Name"');
    expect(jsx).toContain('name: "Age"');
    expect(jsx).toContain('name: "Email"');
  });

  it("col\${n}_colTitle が未設定のとき 'Column N' がフォールバックとして出力される", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "2" }), INDENT);
    expect(jsx).toContain('name: "Column 1"');
    expect(jsx).toContain('name: "Column 2"');
  });
});

describe("[exhaustive] DataTable: getRowId 固定", () => {
  it("getRowId は 'row.col1' 固定で出力される", () => {
    const jsx = buildComponentJsx(make("DataTable"), INDENT);
    expect(jsx).toContain("row.col1");
  });
});

describe("[exhaustive] DataTable: col\${n}_colContent dispatch", () => {
  it("Text (default): DataTableCell に {value} が出力される", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1", col0_colContent: "Text" }), INDENT);
    expect(jsx).toContain("<DataTableCell>{value}</DataTableCell>");
  });

  it("Link: Link が renderCell に含まれる", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1", col0_colContent: "Link" }), INDENT);
    expect(jsx).toContain('<Link href="#">{value}</Link>');
  });

  it("Tag: Tag が renderCell に含まれる（デフォルト size=small が付く）", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1", col0_colContent: "Tag" }), INDENT);
    expect(jsx).toContain('<Tag size="small">{value}</Tag>');
  });

  it("TagGroup: TagGroup が renderCell に含まれる", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1", col0_colContent: "TagGroup" }), INDENT);
    expect(jsx).toContain("<TagGroup>");
    expect(jsx).toContain("<Tag>{value}</Tag>");
  });

  it("StatusLabel: StatusLabel が renderCell に含まれる（デフォルト attrs なし）", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1", col0_colContent: "StatusLabel" }), INDENT);
    expect(jsx).toContain("<StatusLabel>");
    expect(jsx).toContain("{value}</StatusLabel>");
    // variant="info" はバグ修正により出ない
    expect(jsx).not.toContain('variant="info"');
  });

  it("Button: Button が renderCell に含まれる（デフォルト variant=subtle/size=small が付く）", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1", col0_colContent: "Button" }), INDENT);
    expect(jsx).toContain('<Button variant="subtle" size="small">{value}</Button>');
  });

  it("IconButton: IconButton が renderCell に含まれる", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1", col0_colContent: "IconButton" }), INDENT);
    expect(jsx).toContain("<IconButton");
    expect(jsx).toContain('aria-label="Action"');
  });

  it("ButtonGroup: ButtonGroup が renderCell に含まれる", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1", col0_colContent: "ButtonGroup" }), INDENT);
    expect(jsx).toContain("<ButtonGroup>");
    expect(jsx).toContain("<Button>Action 1</Button>");
  });

  it("AvatarGroup: AvatarGroup が renderCell に含まれる", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1", col0_colContent: "AvatarGroup" }), INDENT);
    expect(jsx).toContain("<AvatarGroup>");
    expect(jsx).toContain('<Avatar name="User A"');
  });

  it("TextField: TextField が renderCell に含まれる", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1", col0_colContent: "TextField" }), INDENT);
    expect(jsx).toContain("<TextField");
  });

  it("Select: Select が renderCell に含まれる", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1", col0_colContent: "Select" }), INDENT);
    expect(jsx).toContain("<Select");
    expect(jsx).toContain("Option A");
  });

  it("Combobox: Combobox が renderCell に含まれる", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1", col0_colContent: "Combobox" }), INDENT);
    expect(jsx).toContain("<Combobox");
  });

  it("TagPicker: TagPicker が renderCell に含まれる", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1", col0_colContent: "TagPicker" }), INDENT);
    expect(jsx).toContain("<TagPicker");
  });

  it("TagInput: TagInput が renderCell に含まれる", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1", col0_colContent: "TagInput" }), INDENT);
    expect(jsx).toContain("<TagInput");
  });

  it("DatePicker: DatePicker が renderCell に含まれる", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1", col0_colContent: "DatePicker" }), INDENT);
    expect(jsx).toContain("<DatePicker");
  });

  it("複数列で異なる colContent を持てる", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "3", col0_colContent: "Text", col1_colContent: "Tag", col2_colContent: "Link" }),
      INDENT,
    );
    expect(jsx).toContain("<DataTableCell>{value}</DataTableCell>");
    expect(jsx).toContain('<Tag size="small">{value}</Tag>');
    expect(jsx).toContain('<Link href="#">');
  });
});

describe("[exhaustive] DataTable: row values from fieldConfig", () => {
  it("col\${n}_text の値が rows に反映される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", rowItems: "3", col0_colContent: "Text", col0_text: "Alpha,Beta,Gamma" }),
      INDENT,
    );
    expect(jsx).toContain('col1: "Alpha"');
    expect(jsx).toContain('col1: "Beta"');
    expect(jsx).toContain('col1: "Gamma"');
  });

  it("col\${n}_tagLabel の値が Tag 列の rows に反映される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", rowItems: "2", col0_colContent: "Tag", col0_tagLabel: "タグA,タグB" }),
      INDENT,
    );
    expect(jsx).toContain('col1: "タグA"');
    expect(jsx).toContain('col1: "タグB"');
  });

  it("col\${n}_buttonLabel の値が Button 列の rows に反映される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", rowItems: "2", col0_colContent: "Button", col0_buttonLabel: "編集,削除" }),
      INDENT,
    );
    expect(jsx).toContain('col1: "編集"');
    expect(jsx).toContain('col1: "削除"');
  });

  it("col\${n}_linkLabel の値が Link 列の rows に反映される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", rowItems: "2", col0_colContent: "Link", col0_linkLabel: "詳細,プレビュー" }),
      INDENT,
    );
    expect(jsx).toContain('col1: "詳細"');
    expect(jsx).toContain('col1: "プレビュー"');
  });

  it("value を使わない colContent (IconButton) は '—' がフォールバック値になる", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", rowItems: "1", col0_colContent: "IconButton" }),
      INDENT,
    );
    expect(jsx).toContain('col1: "—"');
  });

  it("input 値が足りない場合は 'Item N' がフォールバックになる", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", rowItems: "3", col0_colContent: "Text", col0_text: "Only One" }),
      INDENT,
    );
    expect(jsx).toContain('col1: "Only One"');
    expect(jsx).toContain('col1: "Item 2"');
    expect(jsx).toContain('col1: "Item 3"');
  });
});

describe("[exhaustive] DataTable: Cat-4 import completeness", () => {
  it("collectComponentImports に DataTable と DataTableCell が含まれる", () => {
    const imports = collectComponentImports([make("DataTable")]);
    expect(imports).toContain("DataTable");
    expect(imports).toContain("DataTableCell");
  });
});

describe("[exhaustive] DataTable: Cat-4 import completeness by colContent", () => {
  it("colContent=Link のとき Link が import に含まれる", () => {
    const imports = collectComponentImports([make("DataTable", { colItems: "1", col0_colContent: "Link" })]);
    expect(imports).toContain("Link");
  });

  it("colContent=Tag のとき Tag が import に含まれる", () => {
    const imports = collectComponentImports([make("DataTable", { colItems: "1", col0_colContent: "Tag" })]);
    expect(imports).toContain("Tag");
  });

  it("colContent=StatusLabel のとき StatusLabel が import に含まれる", () => {
    const imports = collectComponentImports([make("DataTable", { colItems: "1", col0_colContent: "StatusLabel" })]);
    expect(imports).toContain("StatusLabel");
  });

  it("colContent=IconButton のとき IconButton/Tooltip/Icon が import に含まれる", () => {
    const imports = collectComponentImports([make("DataTable", { colItems: "1", col0_colContent: "IconButton" })]);
    expect(imports).toContain("IconButton");
    expect(imports).toContain("Tooltip");
    expect(imports).toContain("Icon");
  });

  it("colContent=ButtonGroup（デフォルト bgIconItems=1）のとき IconButton/Tooltip/Icon が import に含まれる", () => {
    const imports = collectComponentImports([make("DataTable", { colItems: "1", col0_colContent: "ButtonGroup" })]);
    expect(imports).toContain("IconButton");
    expect(imports).toContain("Tooltip");
    expect(imports).toContain("Icon");
  });
});

// =============================================================================
// グループ13-B: DataTable All Rows 設定の反映
// builder キー: col\${ci}_buttonContent_*/buttonSize / col\${ci}_iconButtonContent_*/iconButtonSize
//               col\${ci}_tagContent_*/tagSize / col\${ci}_statusLabelContent_*/slSize
//               col\${ci}_bgBtnItems/bgBtn\${n}_* / col\${ci}_bgIconItems/bgIcon\${n}_*
// =============================================================================

describe("[exhaustive] DataTable All Rows: Button props 反映", () => {
  it("buttonContent_variant が Button の variant に反映される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", col0_colContent: "Button", col0_buttonContent_variant: "primary" }),
      INDENT,
    );
    expect(jsx).toContain('variant="primary"');
  });

  it("buttonContent_color が Button の color に反映される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", col0_colContent: "Button", col0_buttonContent_color: "blue" }),
      INDENT,
    );
    expect(jsx).toContain('color="blue"');
  });

  it("buttonContent_loading が Button の loading に反映される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", col0_colContent: "Button", col0_buttonContent_loading: "true" }),
      INDENT,
    );
    expect(jsx).toContain(" loading");
  });

  it("buttonSize が Button の size に反映される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", col0_colContent: "Button", col0_buttonSize: "large" }),
      INDENT,
    );
    expect(jsx).toContain('size="large"');
  });

  it("buttonContent_leading=true が leading={<Icon>...} として反映される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", {
        colItems: "1",
        col0_colContent: "Button",
        col0_buttonContent_leading: "true",
        col0_buttonContent_leadingIcon: "LfDotsVertical",
      }),
      INDENT,
    );
    expect(jsx).toContain("leading={<Icon><LfDotsVertical /></Icon>}");
  });

  it("buttonContent_trailing=true が trailing={<Icon>...} として反映される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", {
        colItems: "1",
        col0_colContent: "Button",
        col0_buttonContent_trailing: "true",
        col0_buttonContent_trailingIcon: "LfAngleDownMiddle",
      }),
      INDENT,
    );
    expect(jsx).toContain("trailing={<Icon><LfAngleDownMiddle /></Icon>}");
  });

  it("未設定時 variant=subtle / size=small がデフォルトで出力される", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1", col0_colContent: "Button" }), INDENT);
    expect(jsx).toContain('variant="subtle"');
    expect(jsx).toContain('size="small"');
  });
});

describe("[exhaustive] DataTable All Rows: IconButton props 反映", () => {
  it("iconButtonContent_icon が IconButton のアイコンに反映される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", {
        colItems: "1",
        col0_colContent: "IconButton",
        col0_iconButtonContent_icon: "LfDotsVertical",
      }),
      INDENT,
    );
    expect(jsx).toContain("<LfDotsVertical />");
  });

  it("iconButtonSize が IconButton の size に反映される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", col0_colContent: "IconButton", col0_iconButtonSize: "large" }),
      INDENT,
    );
    expect(jsx).toContain('size="large"');
  });

  it("iconButtonContent_loading が IconButton の loading に反映される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", col0_colContent: "IconButton", col0_iconButtonContent_loading: "true" }),
      INDENT,
    );
    expect(jsx).toContain(" loading");
  });

  it("未設定時 size=small は出力されない（subtle がデフォルトなので variant も出ない）", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1", col0_colContent: "IconButton" }), INDENT);
    // iconButtonSize default "small" → sp("size","small","medium") → size="small" は出る
    expect(jsx).toContain('size="small"');
    // variant default "subtle" → sp("variant","subtle","subtle") → 出ない
    expect(jsx).not.toContain('variant="subtle"');
  });
});

describe("[exhaustive] DataTable All Rows: Tag props 反映", () => {
  it("tagContent_variant が Tag の variant に反映される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", col0_colContent: "Tag", col0_tagContent_variant: "fill" }),
      INDENT,
    );
    // "fill" は Aegis Tag の非デフォルト（デフォルト "outline"）なので出る
    expect(jsx).toContain('variant="fill"');
  });

  it("tagSize が Tag の size に反映される（xSmall のとき）", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", col0_colContent: "Tag", col0_tagSize: "xSmall" }),
      INDENT,
    );
    expect(jsx).toContain('size="xSmall"');
  });

  it("未設定時 size=small がデフォルトで出力され variant は出ない", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1", col0_colContent: "Tag" }), INDENT);
    expect(jsx).toContain('size="small"');
    expect(jsx).not.toContain("variant=");
  });
});

describe("[exhaustive] DataTable All Rows: StatusLabel props 反映 + バグ修正", () => {
  it("statusLabelLabel キーで row 値が読まれる（getColContentKey バグ修正）", () => {
    const jsx = buildComponentJsx(
      make("DataTable", {
        colItems: "1",
        rowItems: "2",
        col0_colContent: "StatusLabel",
        col0_statusLabelLabel: "Active,Pending",
      }),
      INDENT,
    );
    expect(jsx).toContain('col1: "Active"');
    expect(jsx).toContain('col1: "Pending"');
  });

  it("statusLabelContent_variant が StatusLabel の variant に反映される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", col0_colContent: "StatusLabel", col0_statusLabelContent_variant: "fill" }),
      INDENT,
    );
    expect(jsx).toContain('variant="fill"');
  });

  it("statusLabelContent_color が StatusLabel の color に反映される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", {
        colItems: "1",
        col0_colContent: "StatusLabel",
        col0_statusLabelContent_color: "information",
      }),
      INDENT,
    );
    expect(jsx).toContain('color="information"');
  });

  it("slSize が StatusLabel の size に反映される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", col0_colContent: "StatusLabel", col0_slSize: "small" }),
      INDENT,
    );
    expect(jsx).toContain('size="small"');
  });

  it("未設定時 variant/color/size は Aegis デフォルトと一致するため出力されない", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1", col0_colContent: "StatusLabel" }), INDENT);
    expect(jsx).toContain("<StatusLabel>");
    expect(jsx).not.toContain("variant=");
    expect(jsx).not.toContain("color=");
    expect(jsx).not.toContain("size=");
  });
});

describe("[exhaustive] DataTable All Rows: ButtonGroup props 反映", () => {
  it("bgBtnItems=1 のとき Button が 1 つだけ出る", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", col0_colContent: "ButtonGroup", col0_bgBtnItems: "1", col0_bgIconItems: "0" }),
      INDENT,
    );
    expect(jsx).toContain("<Button>Action 1</Button>");
    expect(jsx).not.toContain("Action 2");
  });

  it("bgIconItems=0 のとき Tooltip/IconButton が出ない", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", col0_colContent: "ButtonGroup", col0_bgIconItems: "0" }),
      INDENT,
    );
    expect(jsx).not.toContain("<IconButton");
    expect(jsx).not.toContain("<Tooltip");
  });

  it("bgBtn1_label が Button のラベルに反映される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", col0_colContent: "ButtonGroup", col0_bgBtn1_label: "編集" }),
      INDENT,
    );
    expect(jsx).toContain("<Button>編集</Button>");
  });

  it("bgIcon1_icon が IconButton のアイコンに反映される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", col0_colContent: "ButtonGroup", col0_bgIcon1_icon: "LfDotsVertical" }),
      INDENT,
    );
    expect(jsx).toContain("<LfDotsVertical />");
  });

  it("bgSize が ButtonGroup の size に反映される（small のとき）", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", col0_colContent: "ButtonGroup", col0_bgSize: "small" }),
      INDENT,
    );
    expect(jsx).toContain('<ButtonGroup size="small">');
  });

  it("bgBtn1_variant が Button の variant に反映される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", col0_colContent: "ButtonGroup", col0_bgBtn1_variant: "primary" }),
      INDENT,
    );
    expect(jsx).toContain('variant="primary"');
  });
});

// =============================================================================
// グループ13-C: DataTable per-row rich override
// builder キー (col-scoped): tagRow\${n}Label / tagRow\${n}Content_variant/color
//   slRow\${n}Label / slRow\${n}Content_variant/color
//   ibRow\${n}Content_variant/color/loading/icon
//   btnRow\${n}Label / btnRow\${n}Content_variant/color/loading/leading/trailing
//   tgTagLabels\${n} / tgRow\${n}Items / tgRow\${n}TagColor\${m}
//   bgRow\${n}BtnItems / bgRow\${n}IconItems / bgRow\${n}Btn\${m}_* / bgRow\${n}Icon\${m}_*
// =============================================================================

describe("[exhaustive] DataTable per-row: Tag override", () => {
  it("tagRow1Content_variant=fill → if (index === 0) ブランチに variant='fill' が出力される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", rowItems: "3", col0_colContent: "Tag", col0_tagRow1Content_variant: "fill" }),
      INDENT,
    );
    expect(jsx).toContain("if (index === 0)");
    expect(jsx).toContain('variant="fill"');
    expect(jsx).toContain("{ value, index }");
  });

  it("tagRow1Content_color=red → if (index === 0) ブランチに color='red' が出力される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", rowItems: "3", col0_colContent: "Tag", col0_tagRow1Content_color: "red" }),
      INDENT,
    );
    expect(jsx).toContain("if (index === 0)");
    expect(jsx).toContain('color="red"');
  });

  it("tagRow1Label=Custom → if (index === 0) ブランチにリテラル Custom が出力される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", rowItems: "3", col0_colContent: "Tag", col0_tagRow1Label: "Custom" }),
      INDENT,
    );
    expect(jsx).toContain("if (index === 0)");
    expect(jsx).toContain(">Custom<");
  });

  it("per-row キーがない場合は単純な ({ value }) => ( 形式になる（index ブランチなし）", () => {
    const jsx = buildComponentJsx(make("DataTable", { colItems: "1", rowItems: "3", col0_colContent: "Tag" }), INDENT);
    expect(jsx).toContain("({ value }) => (");
    expect(jsx).not.toContain("if (index");
  });
});

describe("[exhaustive] DataTable per-row: StatusLabel override", () => {
  it("slRow1Content_variant=fill → if (index === 0) ブランチに variant='fill' が出力される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", {
        colItems: "1",
        rowItems: "3",
        col0_colContent: "StatusLabel",
        col0_slRow1Content_variant: "fill",
      }),
      INDENT,
    );
    expect(jsx).toContain("if (index === 0)");
    expect(jsx).toContain('variant="fill"');
    expect(jsx).toContain("{ value, index }");
  });

  it("slRow1Content_color=information → if (index === 0) ブランチに color='information' が出力される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", {
        colItems: "1",
        rowItems: "3",
        col0_colContent: "StatusLabel",
        col0_slRow1Content_color: "information",
      }),
      INDENT,
    );
    expect(jsx).toContain("if (index === 0)");
    expect(jsx).toContain('color="information"');
  });

  it("slRow1Label=承認済 → if (index === 0) ブランチにリテラル 承認済 が出力される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", {
        colItems: "1",
        rowItems: "3",
        col0_colContent: "StatusLabel",
        col0_slRow1Label: "承認済",
      }),
      INDENT,
    );
    expect(jsx).toContain("if (index === 0)");
    expect(jsx).toContain(">承認済<");
  });

  it("per-row キーがない場合は単純な ({ value }) => ( 形式になる", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", rowItems: "3", col0_colContent: "StatusLabel" }),
      INDENT,
    );
    expect(jsx).toContain("({ value }) => (");
    expect(jsx).not.toContain("if (index");
  });
});

describe("[exhaustive] DataTable per-row: IconButton override", () => {
  it("ibRow1Content_icon=LfDotsVertical → if (index === 0) ブランチに LfDotsVertical が出力される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", {
        colItems: "1",
        rowItems: "3",
        col0_colContent: "IconButton",
        col0_ibRow1Content_icon: "LfDotsVertical",
      }),
      INDENT,
    );
    expect(jsx).toContain("if (index === 0)");
    expect(jsx).toContain("<LfDotsVertical />");
    expect(jsx).toContain("{ index }");
  });

  it("ibRow1Content_variant=solid → if (index === 0) ブランチに variant='solid' が出力される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", {
        colItems: "1",
        rowItems: "3",
        col0_colContent: "IconButton",
        col0_ibRow1Content_variant: "solid",
      }),
      INDENT,
    );
    expect(jsx).toContain("if (index === 0)");
    expect(jsx).toContain('variant="solid"');
  });

  it("ibRow2Content_color=blue → if (index === 1) ブランチに color='blue' が出力される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", {
        colItems: "1",
        rowItems: "3",
        col0_colContent: "IconButton",
        col0_ibRow2Content_color: "blue",
      }),
      INDENT,
    );
    expect(jsx).toContain("if (index === 1)");
    expect(jsx).toContain('color="blue"');
  });
});

describe("[exhaustive] DataTable per-row: Button override", () => {
  it("btnRow1Label=詳細 → if (index === 0) ブランチにリテラル 詳細 が出力される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", rowItems: "3", col0_colContent: "Button", col0_btnRow1Label: "詳細" }),
      INDENT,
    );
    expect(jsx).toContain("if (index === 0)");
    expect(jsx).toContain(">詳細<");
    expect(jsx).toContain("{ value, index }");
  });

  it("btnRow1Content_variant=primary → if (index === 0) ブランチに variant='primary' が出力される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", {
        colItems: "1",
        rowItems: "3",
        col0_colContent: "Button",
        col0_btnRow1Content_variant: "primary",
      }),
      INDENT,
    );
    expect(jsx).toContain("if (index === 0)");
    expect(jsx).toContain('variant="primary"');
  });

  it("btnRow1Content_color=blue → if (index === 0) ブランチに color='blue' が出力される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", {
        colItems: "1",
        rowItems: "3",
        col0_colContent: "Button",
        col0_btnRow1Content_color: "blue",
      }),
      INDENT,
    );
    expect(jsx).toContain("if (index === 0)");
    expect(jsx).toContain('color="blue"');
  });

  it("btnRow2Content_loading=true → if (index === 1) ブランチに loading が出力される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", {
        colItems: "1",
        rowItems: "3",
        col0_colContent: "Button",
        col0_btnRow2Content_loading: "true",
      }),
      INDENT,
    );
    expect(jsx).toContain("if (index === 1)");
    expect(jsx).toContain(" loading");
  });
});

describe("[exhaustive] DataTable per-row: TagGroup override", () => {
  it("tgTagLabels1=Alpha,Beta + tgRow1Items=2 → if (index === 0) ブランチに Alpha / Beta のタグが出力される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", {
        colItems: "1",
        rowItems: "3",
        col0_colContent: "TagGroup",
        col0_tgTagLabels1: "Alpha,Beta",
        col0_tgRow1Items: "2",
      }),
      INDENT,
    );
    expect(jsx).toContain("if (index === 0)");
    expect(jsx).toContain(">Alpha<");
    expect(jsx).toContain(">Beta<");
    expect(jsx).toContain("{ value, index }");
  });

  it("tgRow1TagColor1=red → if (index === 0) ブランチに color='red' が出力される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", {
        colItems: "1",
        rowItems: "3",
        col0_colContent: "TagGroup",
        col0_tgRow1TagColor1: "red",
      }),
      INDENT,
    );
    expect(jsx).toContain("if (index === 0)");
    expect(jsx).toContain('color="red"');
  });

  it("tgRow2Items=1 → if (index === 1) ブランチに単一タグが出力される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", {
        colItems: "1",
        rowItems: "3",
        col0_colContent: "TagGroup",
        col0_tgRow2Items: "1",
      }),
      INDENT,
    );
    expect(jsx).toContain("if (index === 1)");
    expect(jsx).toContain("<TagGroup>");
    expect(jsx).toContain("</TagGroup>");
  });

  it("per-row キーがない場合は単純な ({ value }) => ( 形式になる", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", rowItems: "3", col0_colContent: "TagGroup" }),
      INDENT,
    );
    expect(jsx).toContain("({ value }) => (");
    expect(jsx).not.toContain("if (index");
  });
});

describe("[exhaustive] DataTable per-row: ButtonGroup override", () => {
  it("bgRow1BtnItems=1 + bgRow1IconItems=0 → if (index === 0) ブランチにボタン 1 件・アイコンなしが出力される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", {
        colItems: "1",
        rowItems: "3",
        col0_colContent: "ButtonGroup",
        col0_bgRow1BtnItems: "1",
        col0_bgRow1IconItems: "0",
      }),
      INDENT,
    );
    expect(jsx).toContain("if (index === 0)");
    expect(jsx).toContain("{ index }");
    // デフォルト (All Rows) ブランチには bgBtnItems=3 のボタンが 3 件
    const defaultBranch = jsx.slice(jsx.lastIndexOf("return ("));
    expect(defaultBranch).toContain("Action 1");
    expect(defaultBranch).toContain("Action 2");
    expect(defaultBranch).toContain("Action 3");
  });

  it("bgRow1Btn1_label=編集 → if (index === 0) ブランチに 編集 が出力される", () => {
    const jsx = buildComponentJsx(
      make("DataTable", {
        colItems: "1",
        rowItems: "3",
        col0_colContent: "ButtonGroup",
        col0_bgRow1Btn1_label: "編集",
      }),
      INDENT,
    );
    expect(jsx).toContain("if (index === 0)");
    expect(jsx).toContain(">編集<");
  });

  it("per-row キーがない場合は単純な () => ( 形式になる（index ブランチなし）", () => {
    const jsx = buildComponentJsx(
      make("DataTable", { colItems: "1", rowItems: "3", col0_colContent: "ButtonGroup" }),
      INDENT,
    );
    expect(jsx).toContain("() => (");
    expect(jsx).not.toContain("if (index");
  });
});

// =============================================================================
// グループ14: SideNavigation（Plan B + withGroup custom editor path）
// builder キー: withGroup / groups / group\${gi}_items / group\${gi}_labels / group\${gi}_icon\${ii}
// =============================================================================

describe("[exhaustive] SideNavigation: Cat-4 import completeness", () => {
  it("collectComponentImports に SideNavigation/SideNavigationGroup/SideNavigationItem が含まれる", () => {
    const imports = collectComponentImports([make("SideNavigation")]);
    expect(imports).toContain("SideNavigation");
    expect(imports).toContain("SideNavigationGroup");
    expect(imports).toContain("SideNavigationItem");
  });
});

describe("[exhaustive] SideNavigation: withGroup=true 基本構造", () => {
  it("withGroup=true のとき SideNavigationGroup が出力される", () => {
    const jsx = buildComponentJsx(make("SideNavigation", { withGroup: "true" }), INDENT);
    expect(jsx).toContain("<SideNavigationGroup");
  });

  it("withGroup=true + groups=3 のとき Group 1〜3 が出力される", () => {
    const jsx = buildComponentJsx(make("SideNavigation", { withGroup: "true", groups: "3" }), INDENT);
    const matches = jsx.match(/<SideNavigationGroup /g) ?? [];
    expect(matches.length).toBe(3);
  });

  it("withGroup=true のとき group タイトルは 'Group N' プレースホルダーになる", () => {
    const jsx = buildComponentJsx(make("SideNavigation", { withGroup: "true", groups: "2" }), INDENT);
    expect(jsx).toContain('title="Group 1"');
    expect(jsx).toContain('title="Group 2"');
  });

  it("withGroup=false のとき Plan B ロジックが維持される（LfMenu が出力される）", () => {
    const jsx = buildComponentJsx(make("SideNavigation", { withGroup: "false" }), INDENT);
    expect(jsx).toContain("LfMenu");
  });
});

describe("[exhaustive] SideNavigation: withGroup group\${gi}_items", () => {
  it("group0_items=3 のとき group0 に SideNavigationItem が 3 つ出力される", () => {
    const jsx = buildComponentJsx(
      make("SideNavigation", { withGroup: "true", groups: "2", group0_items: "3" }),
      INDENT,
    );
    // group0 に 3 items、group1 に 1 items（default）
    const matches = jsx.match(/<SideNavigationItem /g) ?? [];
    expect(matches.length).toBe(4);
  });

  it("group\${gi}_items 未設定のとき 1 item がフォールバックになる", () => {
    const jsx = buildComponentJsx(make("SideNavigation", { withGroup: "true", groups: "2" }), INDENT);
    const matches = jsx.match(/<SideNavigationItem /g) ?? [];
    expect(matches.length).toBe(2); // group0: 1, group1: 1
  });

  it("group\${gi}_items=99 のとき max=5 に clamp される", () => {
    const jsx = buildComponentJsx(
      make("SideNavigation", { withGroup: "true", groups: "2", group0_items: "99" }),
      INDENT,
    );
    const matches = jsx.match(/<SideNavigationItem /g) ?? [];
    expect(matches.length).toBe(6); // group0: 5, group1: 1
  });
});

describe("[exhaustive] SideNavigation: withGroup group\${gi}_labels", () => {
  it("group0_labels のカンマ区切り値が SideNavigationItem の children に反映される", () => {
    const jsx = buildComponentJsx(
      make("SideNavigation", {
        withGroup: "true",
        groups: "2",
        group0_items: "3",
        group0_labels: "ホーム,契約,設定",
      }),
      INDENT,
    );
    expect(jsx).toContain(">ホーム<");
    expect(jsx).toContain(">契約<");
    expect(jsx).toContain(">設定<");
  });

  it("group\${gi}_labels 未設定のとき 'Item N' がフォールバックになる", () => {
    const jsx = buildComponentJsx(
      make("SideNavigation", { withGroup: "true", groups: "2", group0_items: "2" }),
      INDENT,
    );
    expect(jsx).toContain(">Item 1<");
    expect(jsx).toContain(">Item 2<");
  });

  it("複数グループで異なる labels を持てる", () => {
    const jsx = buildComponentJsx(
      make("SideNavigation", {
        withGroup: "true",
        groups: "2",
        group0_items: "2",
        group0_labels: "ホーム,案件",
        group1_items: "2",
        group1_labels: "設定,ヘルプ",
      }),
      INDENT,
    );
    expect(jsx).toContain(">ホーム<");
    expect(jsx).toContain(">案件<");
    expect(jsx).toContain(">設定<");
    expect(jsx).toContain(">ヘルプ<");
  });
});

describe("[exhaustive] SideNavigation: withGroup group\${gi}_icon\${ii}", () => {
  it("group0_icon0 の値が SideNavigationItem の icon prop に反映される", () => {
    const jsx = buildComponentJsx(
      make("SideNavigation", { withGroup: "true", groups: "2", group0_items: "1", group0_icon0: "LfHomeLarge" }),
      INDENT,
    );
    expect(jsx).toContain("icon={LfHomeLarge}");
  });

  it("group\${gi}_icon\${ii} 未設定のとき LfPlusLarge がフォールバックになる", () => {
    const jsx = buildComponentJsx(
      make("SideNavigation", { withGroup: "true", groups: "2", group0_items: "1" }),
      INDENT,
    );
    expect(jsx).toContain("icon={LfPlusLarge}");
  });

  it("複数 item で異なる icon key を持てる", () => {
    const jsx = buildComponentJsx(
      make("SideNavigation", {
        withGroup: "true",
        groups: "2",
        group0_items: "2",
        group0_icon0: "LfHomeLarge",
        group0_icon1: "LfDocumentLarge",
      }),
      INDENT,
    );
    expect(jsx).toContain("icon={LfHomeLarge}");
    expect(jsx).toContain("icon={LfDocumentLarge}");
  });
});

// =============================================================================
// グループ15: InformationCard / InformationCardGroup（scaffold）
// =============================================================================

describe("[exhaustive] InformationCard: scaffold 構造", () => {
  it("leading prop に Icon が含まれる", () => {
    const jsx = buildComponentJsx(make("InformationCard"), INDENT);
    expect(jsx).toContain("leading={<Icon>");
  });

  it("InformationCardDescription が含まれる", () => {
    const jsx = buildComponentJsx(make("InformationCard"), INDENT);
    expect(jsx).toContain("<InformationCardDescription>");
  });
});

describe("[exhaustive] InformationCard: Cat-4 import completeness", () => {
  it("collectComponentImports に InformationCard/InformationCardDescription/Icon が含まれる", () => {
    const imports = collectComponentImports([make("InformationCard")]);
    expect(imports).toContain("InformationCard");
    expect(imports).toContain("InformationCardDescription");
    expect(imports).toContain("Icon");
  });
});

describe("[exhaustive] InformationCardGroup: scaffold 構造", () => {
  it("3枚分の InformationCard が含まれる", () => {
    const jsx = buildComponentJsx(make("InformationCardGroup"), INDENT);
    const matches = jsx.match(/<InformationCard /g) ?? [];
    expect(matches.length).toBe(3);
  });

  it("<InformationCardGroup> が含まれる", () => {
    const jsx = buildComponentJsx(make("InformationCardGroup"), INDENT);
    expect(jsx).toContain("<InformationCardGroup>");
  });
});

describe("[exhaustive] InformationCardGroup: Cat-4 import completeness", () => {
  it("collectComponentImports に InformationCardGroup/InformationCard/InformationCardDescription/Icon が含まれる", () => {
    const imports = collectComponentImports([make("InformationCardGroup")]);
    expect(imports).toContain("InformationCardGroup");
    expect(imports).toContain("InformationCard");
    expect(imports).toContain("InformationCardDescription");
    expect(imports).toContain("Icon");
  });
});

// =============================================================================
// グループ16: Stepper
// builder キー: items count [2-10], orientation (sp threshold="horizontal"),
//               size (sp threshold="medium"), label カンマ区切り → Stepper.Item title=
//               status="normal" が各アイテムに含まれる
// =============================================================================

describe("[exhaustive] Stepper: items count", () => {
  it("items=2 のとき Stepper.Item が 2 つ出力される（下限）", () => {
    const jsx = buildComponentJsx(make("Stepper", { items: "2" }), INDENT);
    const matches = jsx.match(/<Stepper\\.Item /g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("items=10 のとき Stepper.Item が 10 つ出力される（上限）", () => {
    const jsx = buildComponentJsx(make("Stepper", { items: "10" }), INDENT);
    const matches = jsx.match(/<Stepper\\.Item /g) ?? [];
    expect(matches.length).toBe(10);
  });

  it("items=1 のとき min=2 に clamp される", () => {
    const jsx = buildComponentJsx(make("Stepper", { items: "1" }), INDENT);
    const matches = jsx.match(/<Stepper\\.Item /g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("items=99 のとき max=10 に clamp される", () => {
    const jsx = buildComponentJsx(make("Stepper", { items: "99" }), INDENT);
    const matches = jsx.match(/<Stepper\\.Item /g) ?? [];
    expect(matches.length).toBe(10);
  });
});

describe("[exhaustive] Stepper: orientation sp threshold", () => {
  it('orientation="horizontal" のとき orientation= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("Stepper", { orientation: "horizontal" }), INDENT);
    expect(jsx).not.toContain("orientation=");
  });

  it('orientation="vertical" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Stepper", { orientation: "vertical" }), INDENT);
    expect(jsx).toContain('orientation="vertical"');
  });
});

describe("[exhaustive] Stepper: size sp threshold", () => {
  it('size="medium" のとき size= が出力されない（sp threshold）', () => {
    const jsx = buildComponentJsx(make("Stepper", { size: "medium" }), INDENT);
    expect(jsx).not.toContain("size=");
  });

  it('size="large" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Stepper", { size: "large" }), INDENT);
    expect(jsx).toContain('size="large"');
  });

  it('size="small" が出力に含まれる', () => {
    const jsx = buildComponentJsx(make("Stepper", { size: "small" }), INDENT);
    expect(jsx).toContain('size="small"');
  });
});

describe("[exhaustive] Stepper: label と status", () => {
  it("label カンマ区切りの値が Stepper.Item title= に反映される", () => {
    const jsx = buildComponentJsx(make("Stepper", { items: "3", label: "入力,確認,完了" }), INDENT);
    expect(jsx).toContain('title="入力"');
    expect(jsx).toContain('title="確認"');
    expect(jsx).toContain('title="完了"');
  });

  it("各 Stepper.Item に status='normal' が含まれる", () => {
    const jsx = buildComponentJsx(make("Stepper", { items: "3" }), INDENT);
    const matches = jsx.match(/status="normal"/g) ?? [];
    expect(matches.length).toBe(3);
  });
});

describe("[exhaustive] Stepper: Cat-4 import completeness", () => {
  it("collectComponentImports に Stepper が含まれる", () => {
    const imports = collectComponentImports([make("Stepper")]);
    expect(imports).toContain("Stepper");
  });
});

// =============================================================================
// A: cross-prop interactions（高優先 H1〜H6）
// =============================================================================

// H1: Text — inputType=Multi-line 分岐
// builder: tt === "title" ? as="h2" : inputType === "Multi-line" ? as="p" : ""
describe("[cross-prop] Text: inputType=Multi-line 分岐", () => {
  it('textType="body" + inputType="Multi-line" → as="p" が出力される', () => {
    const jsx = buildComponentJsx(make("Text", { textType: "body", inputType: "Multi-line" }), INDENT);
    expect(jsx).toContain('as="p"');
  });

  it('textType="label" + inputType="Multi-line" → as="p" が出力される', () => {
    const jsx = buildComponentJsx(make("Text", { textType: "label", inputType: "Multi-line" }), INDENT);
    expect(jsx).toContain('as="p"');
  });

  it('textType="title" + inputType="Multi-line" → as="h2" が優先される（"p" は出ない）', () => {
    const jsx = buildComponentJsx(make("Text", { textType: "title", inputType: "Multi-line" }), INDENT);
    expect(jsx).toContain('as="h2"');
    expect(jsx).not.toContain('as="p"');
  });

  it('inputType="Single-line"（デフォルト）→ as= が出力されない', () => {
    const jsx = buildComponentJsx(make("Text", { textType: "body", inputType: "Single-line" }), INDENT);
    expect(jsx).not.toContain("as=");
  });
});

// H2: Text — text / textArea OR フォールバックチェーン
// builder: pv(p, "text", "") || pv(p, "textArea", "") || "Text content"
describe("[cross-prop] Text: text/textArea OR フォールバックチェーン", () => {
  it('text="" のとき textArea の値が使われる', () => {
    const jsx = buildComponentJsx(make("Text", { text: "", textArea: "エリア内容" }), INDENT);
    expect(jsx).toContain("エリア内容");
  });

  it('text="" かつ textArea="" のとき "Text content" がデフォルトになる', () => {
    const jsx = buildComponentJsx(make("Text", { text: "", textArea: "" }), INDENT);
    expect(jsx).toContain("Text content");
  });

  it("text が指定されているとき textArea は無視される", () => {
    const jsx = buildComponentJsx(make("Text", { text: "メインテキスト", textArea: "エリア内容" }), INDENT);
    expect(jsx).toContain("メインテキスト");
    expect(jsx).not.toContain("エリア内容");
  });
});

// H3: Card — header=true + body 未指定 → CardBody が出ない
// builder: if (hasBody || !hasHeader) → header=true + body=false: false || false = false → CardBody なし
describe("[cross-prop] Card: header=true + body 未指定 → CardBody が出ない", () => {
  it("header=true + body 未指定のとき CardBody が出力されない", () => {
    const jsx = buildComponentJsx(make("Card", { header: "true" }), INDENT);
    expect(jsx).toContain("<CardHeader>");
    expect(jsx).not.toContain("<CardBody>");
  });

  it("header 未指定（デフォルト false）のとき body 未指定でも CardBody が出力される", () => {
    const jsx = buildComponentJsx(make("Card"), INDENT);
    expect(jsx).not.toContain("<CardHeader>");
    expect(jsx).toContain("<CardBody>");
  });

  it("header=true + body=true のとき両方が出力される", () => {
    const jsx = buildComponentJsx(make("Card", { header: "true", body: "true" }), INDENT);
    expect(jsx).toContain("<CardHeader>");
    expect(jsx).toContain("<CardBody>");
  });
});

// H4: Button — trailing slot の Badge + count パス
// leading 側の count パスは既存テスト済み。trailing 側が未テスト
describe("[cross-prop] Button: trailing slot — Badge + count", () => {
  it("trailing=true + trailingType=Badge + trailingBadge=count → count= が出力される", () => {
    const jsx = buildComponentJsx(
      make("Button", {
        trailing: "true",
        trailingType: "Badge",
        trailingBadge: "count",
        trailingBadgeCount: "7",
      }),
      INDENT,
    );
    expect(jsx).toContain("trailing=");
    expect(jsx).toContain("<Badge");
    expect(jsx).toContain("count={7}");
  });

  it("trailing=true + trailingType=Badge（normal）→ count= が出力されない", () => {
    const jsx = buildComponentJsx(make("Button", { trailing: "true", trailingType: "Badge" }), INDENT);
    expect(jsx).toContain("trailing=");
    expect(jsx).toContain("<Badge");
    expect(jsx).not.toContain("count=");
  });
});

// H5: ContentHeader — trailing else 分岐（IconButton）
// trailingContent が "ButtonGroup" でも "Button" でもないとき else が発動
describe("[cross-prop] ContentHeader: trailing — else 分岐（IconButton）", () => {
  it("trailingContent が ButtonGroup/Button 以外 → IconButton + LfPlusLarge が action に含まれる", () => {
    const jsx = buildComponentJsx(make("ContentHeader", { trailing: "true", trailingContent: "IconButton" }), INDENT);
    expect(jsx).toContain("action=");
    expect(jsx).toContain("IconButton");
    expect(jsx).toContain("LfPlusLarge");
    expect(jsx).not.toContain("ButtonGroup");
  });
});

// H6: ContentHeader — descriptionTop + descriptionBottom 同時指定
// 両方 true のとき ContentHeaderDescription が descTop→Title→descBottom の順で出力される
describe("[cross-prop] ContentHeader: descriptionTop + descriptionBottom 同時指定", () => {
  it("descriptionTop=true + descriptionBottom=true のとき ContentHeaderDescription が 2 回出力される", () => {
    const jsx = buildComponentJsx(
      make("ContentHeader", {
        descriptionTop: "true",
        descriptionBottom: "true",
        descriptionTopText: "Top desc",
        descriptionBottomText: "Bottom desc",
      }),
      INDENT,
    );
    const matches = [...jsx.matchAll(/ContentHeaderDescription/g)];
    expect(matches.length).toBeGreaterThanOrEqual(2);
    expect(jsx).toContain("Top desc");
    expect(jsx).toContain("Bottom desc");
  });

  it("descTop → ContentHeaderTitle → descBottom の順序で出力される", () => {
    const jsx = buildComponentJsx(
      make("ContentHeader", {
        descriptionTop: "true",
        descriptionBottom: "true",
        titleText: "Main Title",
        descriptionTopText: "先頭説明",
        descriptionBottomText: "末尾説明",
      }),
      INDENT,
    );
    const descTopPos = jsx.indexOf("ContentHeaderDescription");
    const titlePos = jsx.indexOf("ContentHeaderTitle");
    const descBottomPos = jsx.lastIndexOf("ContentHeaderDescription");
    expect(descTopPos).toBeLessThan(titlePos);
    expect(titlePos).toBeLessThan(descBottomPos);
  });
});

// =============================================================================
// Cat-2: deprecated / non-existent API negative assertions
// =============================================================================

describe("[cat-2] deprecated / non-existent API が出力に含まれない", () => {
  // D1: Timeline.Title は出ない（現在は TimelineContent flat export）
  it("Timeline: Timeline.Title が出力されない", () => {
    const jsx = buildComponentJsx(make("Timeline"), INDENT);
    expect(jsx).not.toContain("Timeline.Title");
    expect(jsx).toContain("TimelineContent");
  });

  // D2: Toolbar.Group は出ない（現在は ToolbarGroup flat export）
  it("Toolbar: Toolbar.Group が出力されない", () => {
    const jsx = buildComponentJsx(make("Toolbar"), INDENT);
    expect(jsx).not.toContain("Toolbar.Group");
    expect(jsx).toContain("ToolbarGroup");
  });

  // D3: Select.Option は出ない（現在は options={[...]} prop）
  it("Select: Select.Option が出力されない", () => {
    const jsx = buildComponentJsx(make("Select"), INDENT);
    expect(jsx).not.toContain("Select.Option");
    expect(jsx).toContain("options=");
  });

  // D4: TagPicker.Option は出ない（現在は options={[...]} prop）
  it("TagPicker: TagPicker.Option が出力されない", () => {
    const jsx = buildComponentJsx(make("TagPicker"), INDENT);
    expect(jsx).not.toContain("TagPicker.Option");
    expect(jsx).toContain("options=");
  });

  // D5: NavList.Link は出ない（現在は NavList.Item）
  it("NavList: NavList.Link が出力されない", () => {
    const jsx = buildComponentJsx(make("NavList"), INDENT);
    expect(jsx).not.toContain("NavList.Link");
    expect(jsx).toContain("NavList.Item");
  });

  // D6: Stepper.Step は出ない（現在は Stepper.Item）
  it("Stepper: Stepper.Step が出力されない", () => {
    const jsx = buildComponentJsx(make("Stepper"), INDENT);
    expect(jsx).not.toContain("Stepper.Step");
    expect(jsx).toContain("Stepper.Item");
  });

  // D7: Accordion.Header は出ない（現在は AccordionButton flat export）
  it("Accordion: Accordion.Header が出力されない", () => {
    const jsx = buildComponentJsx(make("Accordion"), INDENT);
    expect(jsx).not.toContain("Accordion.Header");
    expect(jsx).toContain("AccordionButton");
  });

  // D8: ={undefined} が分岐パスでも出ない（代表コンポーネント）
  it.each([
    "Button",
    "Tag",
    "Banner",
    "Select",
    "DataTable",
    "SideNavigation",
    "ContentHeader",
  ] as const)("%s: ={undefined} が出力に含まれない", (component) => {
    const jsx = buildComponentJsx(make(component), INDENT);
    expect(jsx).not.toContain("={undefined}");
  });

  // NaN チェック（count 系の数値変換が正しい）
  it.each([
    "Pagination",
    "AvatarGroup",
    "CheckboxGroup",
    "DataTable",
    "Stepper",
  ] as const)("%s: NaN が出力に含まれない", (component) => {
    const jsx = buildComponentJsx(make(component), INDENT);
    expect(jsx).not.toContain("NaN");
  });
});

// =============================================================================
// Cat-4: conditional import completeness
// =============================================================================

// Banner: action / withActionLabel 条件付き import
describe("[cat-4] Banner: 条件付き import", () => {
  it("action=true → collectComponentImports に Button が含まれる", () => {
    const imports = collectComponentImports([make("Banner", { action: "true" })]);
    expect(imports).toContain("Banner");
    expect(imports).toContain("Button");
  });

  it("withActionLabel=true → collectComponentImports に Link が含まれる", () => {
    const imports = collectComponentImports([make("Banner", { withActionLabel: "true" })]);
    expect(imports).toContain("Banner");
    expect(imports).toContain("Link");
  });

  it("action/withActionLabel どちらも false → Button/Link が含まれない", () => {
    const imports = collectComponentImports([make("Banner")]);
    expect(imports).toContain("Banner");
    expect(imports).not.toContain("Button");
    expect(imports).not.toContain("Link");
  });
});

// ContentHeader: trailing の 3 分岐（ButtonGroup / Button / else）
describe("[cat-4] ContentHeader: trailing 条件付き import", () => {
  it("trailing=true + ButtonGroup → ButtonGroup + Button が import に含まれる", () => {
    const imports = collectComponentImports([
      make("ContentHeader", { trailing: "true", trailingContent: "ButtonGroup" }),
    ]);
    expect(imports).toContain("ButtonGroup");
    expect(imports).toContain("Button");
  });

  it("trailing=true + Button → Button のみ含まれ ButtonGroup は含まれない", () => {
    const imports = collectComponentImports([make("ContentHeader", { trailing: "true", trailingContent: "Button" })]);
    expect(imports).toContain("Button");
    expect(imports).not.toContain("ButtonGroup");
  });

  it("trailing=true + else（IconButton 分岐）→ IconButton + Icon が含まれ Button/ButtonGroup は含まれない", () => {
    const imports = collectComponentImports([
      make("ContentHeader", { trailing: "true", trailingContent: "IconButton" }),
    ]);
    expect(imports).toContain("IconButton");
    expect(imports).toContain("Icon");
    expect(imports).not.toContain("ButtonGroup");
    expect(imports).not.toContain("Button");
  });

  it("trailing=false → ButtonGroup/IconButton/Button が含まれない", () => {
    const imports = collectComponentImports([make("ContentHeader")]);
    expect(imports).toContain("ContentHeader");
    expect(imports).toContain("ContentHeaderTitle");
    expect(imports).not.toContain("ButtonGroup");
    expect(imports).not.toContain("IconButton");
    expect(imports).not.toContain("Button");
  });
});

// ContentHeader: description の条件付き import
describe("[cat-4] ContentHeader: description 条件付き import", () => {
  it("descriptionTop=true → ContentHeaderDescription が import に含まれる", () => {
    const imports = collectComponentImports([make("ContentHeader", { descriptionTop: "true" })]);
    expect(imports).toContain("ContentHeaderDescription");
  });

  it("descriptionBottom=true → ContentHeaderDescription が import に含まれる", () => {
    const imports = collectComponentImports([make("ContentHeader", { descriptionBottom: "true" })]);
    expect(imports).toContain("ContentHeaderDescription");
  });

  it("どちらも false → ContentHeaderDescription が import に含まれない", () => {
    const imports = collectComponentImports([make("ContentHeader")]);
    expect(imports).not.toContain("ContentHeaderDescription");
  });
});

// Card: header / footer の条件付き import
describe("[cat-4] Card: 条件付き import", () => {
  it("header=true → CardHeader が import に含まれる", () => {
    const imports = collectComponentImports([make("Card", { header: "true" })]);
    expect(imports).toContain("CardHeader");
  });

  it("footer=true → CardFooter が import に含まれる", () => {
    const imports = collectComponentImports([make("Card", { footer: "true" })]);
    expect(imports).toContain("CardFooter");
  });

  it("header/footer どちらも false → CardHeader/CardFooter が import に含まれない", () => {
    const imports = collectComponentImports([make("Card")]);
    expect(imports).toContain("Card");
    expect(imports).toContain("CardBody");
    expect(imports).not.toContain("CardHeader");
    expect(imports).not.toContain("CardFooter");
  });
});
`;export{e as default};