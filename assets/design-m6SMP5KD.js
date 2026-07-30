var e=`# Palette Lab — Design Document

> Phase 1 MVP — **実装完了** / Phase 2 設計仕様追加済み / Dynamic Alpha 実装済み
> Author: Claude Sonnet (planning pass)
> Date: 2026-05-06
> Last updated: 2026-05-18 (Dynamic Alpha 実装: TRANSPARENT_ALPHA 廃止 → buildNeutralAlphaMap, OKLCH native 出力)

---

## 1. Architecture Overview

### Component Tree

\`\`\`
PaletteLabProvider (Context + useReducer)
└── PaletteLabContent (index.tsx)
    └── PageLayout
        ├── PageLayoutPane position="start" open width="small"   ← sidebar pane (Aegis "small" width)
        │   ├── PageLayoutHeader
        │   └── PageLayoutBody
        │       └── FamilyList           ← reads colorFamilies[], dispatches SELECT_FAMILY / ADD_FAMILY / DELETE_FAMILY
        │           └── SwatchRow[]      ← reads tones[], renders color chips (pure presentational)
        └── PageLayoutContent
            ├── PageLayoutHeader
            │   ├── ContentHeader (title + description)
            │   ├── ProjectSelector      ← reads projects[], dispatches SELECT_PROJECT / ADD_PROJECT
            │   ├── ImportSeedButton     ← dispatches IMPORT_PALETTE
            │   └── ExportButton         ← reads activeProject, triggers JSON download
            └── PageLayoutBody
                └── ToneEditor           ← reads activeFamilyId+tones, dispatches UPDATE_TONE / ADD_TONE / DELETE_TONE
\`\`\`

> **実装メモ**: 設計段階では \`PageLayoutSidebar\` を想定していたが、\`PageLayoutPane\` の方が Aegis の推奨パターンと一致していた。\`PageLayoutBody\` を \`PageLayoutContent\` の外側に置くのではなく、\`PageLayoutContent\` 内に配置している点も設計図との差異。

### Data Flow

State lives in a single \`PaletteLabContext\`. All mutations go through \`dispatch\`. Components never mutate state directly. Derived values (e.g. recomputed hex after slider change) are computed inside action handlers in the reducer, not in component render.

\`\`\`
User interaction → dispatch(action) → reducer(state, action) → new state
                                                              ↓
                                               saveState() to localStorage
                                                              ↓
                                               React re-render (components read from context)
\`\`\`

---

## 2. Directory Structure

All files live under \`src/pages/sandbox/users/ichibasan/palette-lab/\`.

\`\`\`
palette-lab/
├── index.tsx                          # Page entry point + PaletteLabProvider wrapper
├── assets/
│   └── palette-initial.json           # Copy of sandbox-builder palette.json (seed data)
├── color/
│   └── oklch.ts                       # culori wrappers: oklchToHex, hexToOklchChannels, computeHex, AEGIS_FIXED_LIGHTNESS
├── store/
│   ├── types.ts                       # All TypeScript interfaces + DEFAULT_LIGHTNESS + DEFAULT_TONE_VALUES
│   ├── actions.ts                     # PaletteLabAction discriminated union type
│   ├── reducer.ts                     # Pure reducer function
│   ├── context.tsx                    # PaletteLabContext, PaletteLabProvider, usePaletteLabContext
│   └── storage.ts                     # loadState() / saveState() using localStorage
├── seed/
│   └── seed.ts                        # importFromPaletteJson(): palette.json → PaletteProject
├── utils/
│   └── export.ts                      # exportToPaletteJson(): PaletteProject → palette.json shape
├── components/
│   ├── FamilyList/
│   │   └── index.tsx                  # Left sidebar list of color families
│   ├── SwatchRow/
│   │   └── index.tsx                  # Horizontal row of 20×20px color chips
│   ├── ToneEditor/
│   │   └── index.tsx                  # Main content: per-tone L/C/H sliders + hex input
│   ├── ExportButton/
│   │   └── index.tsx                  # Download button triggering Blob export
│   └── ProjectSelector/
│       └── index.tsx                  # Aegis Select dropdown for project switching
└── docs/
    ├── feasibility.md
    └── design.md                      # This file
\`\`\`

---

## 3. Data Model

### TypeScript Interfaces

\`\`\`typescript
// Raw OKLCH channel values as stored / edited by the user
interface OklchChannels {
  l: number; // Lightness: 0–100 (percentage, matches Aegis FIXED_LIGHTNESS scale)
  c: number; // Chroma: 0–0.4 (culori native unit)
  h: number; // Hue: 0–360 (degrees)
}

// A single tone entry within a color family
interface ToneEntry {
  value: number;             // Tone number: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  lightness: number;         // OKLCH L (0–100), default from AEGIS_FIXED_LIGHTNESS[value]
  chroma: number;            // OKLCH C (0–0.4)
  hue: number;               // OKLCH H (0–360)
  alphaMode: "none" | "transparent" | "primary";
  hex: string;               // Cached hex string, recomputed on any L/C/H change
}

// A named group of tones (one color family like "red", "blue", etc.)
interface ColorFamily {
  id: string;                // UUID, stable identifier
  name: string;              // Display name, e.g. "red", "brand-blue"
  tones: ToneEntry[];        // Ordered by tone.value ascending
}

// A top-level project containing multiple color families
interface PaletteProject {
  id: string;                // UUID
  name: string;              // User-defined name, e.g. "Aegis Default"
  createdAt: string;         // ISO 8601 timestamp
  updatedAt: string;         // ISO 8601 timestamp, updated on any mutation
  colorFamilies: ColorFamily[];
}

// Root application state
interface PaletteLabState {
  projects: PaletteProject[];
  activeProjectId: string | null;
  activeFamilyId: string | null;
}
\`\`\`

### Derived / Computed Types

\`\`\`typescript
// Used internally in the reducer to locate a tone entry
type ToneAddress = {
  familyId: string;
  toneValue: number;
};
\`\`\`

---

## 4. Reducer Actions

All actions are typed as a discriminated union in \`store/actions.ts\`. The reducer handles each type and returns a new \`PaletteLabState\` immutably.

### Project Actions

| Action Type | Payload | Effect |
|---|---|---|
| \`ADD_PROJECT\` | \`{ name: string }\` | Appends a new \`PaletteProject\` with a single empty family; sets \`activeProjectId\` |
| \`DELETE_PROJECT\` | \`{ projectId: string }\` | Removes project; clears \`activeProjectId\` if it was the deleted one |
| \`SELECT_PROJECT\` | \`{ projectId: string }\` | Sets \`activeProjectId\`; resets \`activeFamilyId\` to first family of new project (or null) |

### Family Actions

| Action Type | Payload | Effect |
|---|---|---|
| \`ADD_FAMILY\` | \`{ name: string }\` | Appends a \`ColorFamily\` to the active project with 10 default tones from \`DEFAULT_TONE_VALUES\`; sets \`activeFamilyId\` |
| \`DELETE_FAMILY\` | \`{ familyId: string }\` | Removes family from active project; clears \`activeFamilyId\` if it was the deleted one |
| \`SELECT_FAMILY\` | \`{ familyId: string }\` | Sets \`activeFamilyId\` |
| \`RENAME_FAMILY\` | \`{ familyId: string; name: string }\` | Updates the \`name\` field on the matching family |

### Tone Actions

| Action Type | Payload | Effect |
|---|---|---|
| \`ADD_TONE\` | \`{ familyId: string; toneValue: number }\` | Appends a new \`ToneEntry\` with default L from \`AEGIS_FIXED_LIGHTNESS\` (or 50 if unknown); C=0.1, H=0; recomputes hex |
| \`DELETE_TONE\` | \`{ familyId: string; toneValue: number }\` | Removes the matching tone entry |
| \`UPDATE_TONE\` | \`{ familyId: string; toneValue: number; patch: Partial<Pick<ToneEntry, "lightness" \\| "chroma" \\| "hue" \\| "hex" \\| "alphaMode">> }\` | Merges patch into the matching tone; if L/C/H changed, recomputes \`hex\` via \`computeHex\` |

### Import Action

| Action Type | Payload | Effect |
|---|---|---|
| \`IMPORT_PALETTE\` | \`{ project: PaletteProject }\` | Replaces or appends the project in \`projects[]\`; sets it as active |

### Notes

- \`updatedAt\` on the active project is refreshed on every family/tone mutation.
- The reducer always sorts \`tones\` by \`value\` ascending after \`ADD_TONE\`.
- \`ADD_FAMILY\` uses \`crypto.randomUUID()\` for the family \`id\`.

---

## 5. Color Math Pipeline

### OKLCH → hex (forward direction, used on slider/input change)

\`\`\`
User sets L=59.1, C=0.18, H=27
  ↓
oklchToHex(59.1, 0.18, 27)
  ↓
culori.oklch({ mode: "oklch", l: 59.1 / 100, c: 0.18, h: 27 })
  → { mode: "oklch", l: 0.591, c: 0.18, h: 27 }
  ↓
culori.clampGamut("rgb")(oklchColor)
  → clamps chroma so the color fits sRGB gamut
  ↓
culori.formatHex(clampedColor)
  → "#d34638"
\`\`\`

The division \`l / 100\` is the critical bridge: Aegis stores lightness as a percentage (e.g. 59.1) while culori expects a 0–1 fraction.

### hex → OKLCH (reverse direction, used on seed import and hex input)

\`\`\`
hexString "#d34638"
  ↓
culori.parse("#d34638")
  → { mode: "rgb", r: 0.827, g: 0.275, b: 0.22 }
  ↓
culori.oklch(parsedColor)
  → { mode: "oklch", l: 0.591, c: 0.18, h: 27.4 }
  ↓
OklchChannels { l: 59.1, c: 0.18, h: 27.4 }   (l * 100 for Aegis percentage scale)
\`\`\`

### computeHex(tone: ToneEntry): string

Convenience function that reads \`tone.lightness\`, \`tone.chroma\`, \`tone.hue\` and calls \`oklchToHex\`. Used by the reducer in \`UPDATE_TONE\` and \`ADD_TONE\`.

---

## 6. Component Responsibilities

### \`PaletteLabProvider\` (\`store/context.tsx\`)

Initializes state from \`loadState()\` (localStorage) on mount; falls back to a seed project built from \`assets/palette-initial.json\`. Wraps all children with \`PaletteLabContext.Provider\` and persists state to localStorage on every dispatch via a \`useEffect\` on \`state\`.

### \`PaletteLabPage\` (\`index.tsx\`)

Top-level page component. Renders the \`PageLayout\` frame with header, sidebar, and content slots. Composes \`ProjectSelector\`, \`ImportSeedButton\`, \`ExportButton\`, \`FamilyList\`, and \`ToneEditor\`. Does not read state directly — delegates to children.

### \`ProjectSelector\` (\`components/ProjectSelector/index.tsx\`)

Renders an Aegis \`Select\` listing all project names. The currently active project is the selected option. Selecting a different project dispatches \`SELECT_PROJECT\`. An extra option "新規プロジェクト..." dispatches \`ADD_PROJECT\` with a default name.

### \`FamilyList\` (\`components/FamilyList/index.tsx\`)

Reads \`activeProject.colorFamilies\` and \`activeFamilyId\` from context. Renders a scrollable list of rows — each row contains the family name and a \`SwatchRow\`. Clicking a row dispatches \`SELECT_FAMILY\`. An "Add family" button at the bottom dispatches \`ADD_FAMILY\`. Each row has a delete \`IconButton\` that dispatches \`DELETE_FAMILY\`.

### \`SwatchRow\` (\`components/SwatchRow/index.tsx\`)

Pure presentational component. Accepts \`tones: ToneEntry[]\` as props. Renders a horizontal flex container of \`--aegis-size-medium\` (20px) square \`<div>\` chips, each filled with \`tone.hex\`. Shows the tone value number below each chip using \`Text variant="label.small"\`. No context reads — all data comes from props.

> **設計との差異**: 設計段階では \`label.xSmall\` を想定していたが、リポジトリ内の他コンポーネントとの統一性を考慮して \`label.small\` を採用。chip サイズも生値 \`20\` ではなく Aegis トークン \`--aegis-size-medium\` を使用。

### \`ToneEditor\` (\`components/ToneEditor/index.tsx\`)

Reads the \`activeFamilyId\` and the corresponding \`ColorFamily\` from context. Renders a table/grid where each row represents one tone: tone value label, L/C/H sliders, hex text input, and a 40×40px color chip. On slider change, dispatches \`UPDATE_TONE\` with the new channel value and recomputed hex. On hex input blur, parses the hex with \`hexToOklchChannels\` and dispatches \`UPDATE_TONE\` to sync L/C/H. "Add tone" opens a dialog for tone value input; "Delete" per row dispatches \`DELETE_TONE\`.

### \`ExportButton\` (\`components/ExportButton/index.tsx\`)

Reads the active \`PaletteProject\` from context. On click, calls \`exportToPaletteJson(project)\`, serializes to JSON, creates a \`Blob\`, and triggers a download via \`URL.createObjectURL\`. Uses an Aegis \`Button\`.

---

## 7. Layout Design

The page uses a two-column layout. The left panel is a \`PageLayoutPane\`, and the right panel is \`PageLayoutContent\`.

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│  PageLayoutContent > PageLayoutHeader                           │
│  [Palette Lab ▸ description]  [ProjectSelector ▾] [Import] [Export]│
├───────────────────────┬─────────────────────────────────────────┤
│  PageLayoutPane       │  PageLayoutContent > PageLayoutBody     │
│  position="start"     │                                         │
│  width="small"        │  ToneEditor                             │
│                       │  ┌──────┬────┬────┬────┬──────┬────┐   │
│  PageLayoutHeader     │  │Tone  │ L  │ C  │ H  │Hex   │Chip│   │
│  "Families"           │  ├──────┼────┼────┼────┼──────┼────┤   │
│                       │  │ 50   │━━━ │━━━ │━━━ │#fff  │████│   │
│  PageLayoutBody       │  │ 100  │━━━ │━━━ │━━━ │#f3f  │████│   │
│  FamilyList           │  │ ...  │    │    │    │      │    │   │
│  ┌─────────────────┐  │  └──────┴────┴────┴────┴──────┴────┘   │
│  │ red    ██████ 🗑 │  │  [+ Add tone]                          │
│  │ blue   ██████ 🗑 │  │                                         │
│  └─────────────────┘  │                                         │
│  [+ Add family]       │                                         │
└───────────────────────┴─────────────────────────────────────────┘
\`\`\`

- **Pane (start)**: \`PageLayoutPane position="start" open width="small"\`. Contains \`FamilyList\`. Each row shows the family name and a compact \`SwatchRow\`. Active family row has \`background-color: var(--aegis-color-background-neutral-xSubtle)\`. Scrollable.
- **Content header**: \`ContentHeader\` with title + description, plus \`ProjectSelector\`, "Import seed" \`Button\`, and \`ExportButton\` aligned to the right.
- **Content body**: \`ToneEditor\`. Each tone row uses a 7-column CSS grid: tone value | L slider | C slider | H slider | hex \`TextField\` | chip \`<div>\` | delete \`IconButton\`.

---

## 8. Export Format

The exported \`palette.json\` must be structurally identical to \`assets/palette-initial.json\`:

\`\`\`json
{
  "neutral": {
    "900": "#191919",
    "800": "#2b2b2b",
    ...
    "50": "#f9f9f9"
  },
  "red": {
    "900": "#2a100d",
    ...
  },
  ...
}
\`\`\`

Mapping:
- Top-level key = \`ColorFamily.name\`
- Second-level key = \`String(ToneEntry.value)\`
- Value = \`ToneEntry.hex\`

The \`exportToPaletteJson\` function in \`utils/export.ts\` performs this mapping. Tones are written in ascending order by \`value\`. Note: tone values like \`0\` and \`1000\` (pure black/white anchors present in the seed data) can be included if the user adds them — they are just tone numbers.

---

## 9. localStorage Schema

**Key**: \`palette-lab:v1\`

**Value**: JSON-serialized \`PaletteLabState\`

\`\`\`json
{
  "projects": [
    {
      "id": "uuid-...",
      "name": "Aegis Default",
      "createdAt": "2026-05-06T00:00:00.000Z",
      "updatedAt": "2026-05-06T00:00:00.000Z",
      "colorFamilies": [
        {
          "id": "uuid-...",
          "name": "red",
          "tones": [
            {
              "value": 900,
              "lightness": 21.3,
              "chroma": 0.12,
              "hue": 27.4,
              "alphaMode": "none",
              "hex": "#2a100d"
            }
          ]
        }
      ]
    }
  ],
  "activeProjectId": "uuid-...",
  "activeFamilyId": "uuid-..."
}
\`\`\`

**Versioning**: The key suffix \`:v1\` allows a future breaking schema change to use \`:v2\` without conflicts. If \`loadState()\` fails to parse (JSON error or incompatible shape), it returns \`null\` and the Provider falls back to the seed default.

**Save strategy**: \`saveState()\` is called inside a \`useEffect\` that runs after every state change in the Provider. This is synchronous-enough for a sandbox (no debounce needed at this scale).

---

## 10. Known Limitations (Phase 1)

### hex input reset on slider interaction

\`ToneEditor\` maintains \`hexInputs: Record<number, string>\` as local state to buffer the user's in-progress hex input before committing. A \`useEffect([activeFamily])\` syncs this buffer to \`tone.hex\` whenever the active family changes.

**問題**: スライダーを動かすと \`UPDATE_TONE\` が dispatch され、state が更新され、\`activeFamily\` の参照が変わるため \`useEffect\` が毎回発火し、すべての \`hexInputs\` がリセットされる。hex 入力中にスライダーを操作すると入力中のテキストが消える。

**通常操作では発生しない**: hex を編集してから blur/Enter でコミットするフローなら問題ない。

**Phase 2 での修正案**: \`useEffect\` の依存配列を \`[activeFamilyId]\` に変更し「family 切替時のみリセット」にする。スライダーが動いたときの hex 更新は、\`hexInputs\` に「編集中フラグ」を持たせるか、コミット後に明示的に sync する設計に変える。

### プロジェクト名の編集 UI なし

\`ADD_PROJECT\` で作成されるプロジェクト名は固定文字列 \`"New project"\` 。作成後に rename する UI は Phase 1 未実装（\`RENAME_FAMILY\` action はあるが \`RENAME_PROJECT\` は未定義）。

### alt500 トーン値

\`AEGIS_FIXED_LIGHTNESS\` に \`"alt500"\` キーが存在するが、\`DEFAULT_TONE_VALUES\` には含まれていない。\`importFromPaletteJson\` でも \`Number("alt500") === NaN\` のためスキップされる。alt500 を扱いたい場合は Phase 2 で専用の処理が必要。

---

## 11. Testing

### カバレッジ対象

Phase 1 では副作用のない純粋関数・純粋 reducer のみをユニットテストでカバーしている。

| ファイル | テスト数 | 内容 |
|---------|---------|------|
| \`color/oklch.test.ts\` | 20 件 | \`oklchToHex\`, \`hexToOklchChannels\`, \`computeHex\` の入出力・エッジケース |
| \`store/reducer.test.ts\` | 84 件 | 全アクション × 正常系・エッジケース（null activeProjectId、最後の family 削除、SET_PRIMARY_BASE_TONE など） |
| \`utils/export.test.ts\` | 8 件 | \`exportToPaletteJson\` の出力形式・純粋性 |
| \`utils/exportTokens.test.ts\` | 5 件 | \`exportTokensJs\` の OKLCH 出力形式・Dynamic Alpha 適用確認 |
| \`seed/seed.test.ts\` | 20 件 | \`importFromPaletteJson\` の JSON パース・lightness 解決・ソート |
| \`color/primary.test.ts\` | 12 件 | \`buildPrimaryScale(family, alphaMap)\` — alphaMap 依存・sparse alphaMap 除外・out-of-scale |
| \`color/contrast/resolve.test.ts\` | 14 件 | \`resolveRefToCss\` OKLCH native 出力・\`computeChecksWithContext\` Surface BG |

### テスト実行

\`\`\`bash
pnpm test
# またはファイル指定
pnpm test src/pages/sandbox/users/ichibasan/palette-lab
\`\`\`

### カバレッジ対象外

- React コンポーネント (\`FamilyList\`, \`ToneEditor\`, etc.) — Vitest DOM 環境のセットアップが別途必要
- \`store/storage.ts\` — localStorage への副作用を持つため統合テストが適切
- \`store/context.tsx\` — Provider の初期化ロジックは seed.ts のテストで間接的にカバー済み

---

## 12. Phase 2 UI 仕様 — 2列コンテンツ + トーン軸編集

> ユーザーフィードバック (2026-05-06) から確定した仕様。

### 12-1. 概要

コンテンツエリアを **ファミリー軸 (左列)** と **トーン軸 (右列)** の2列に拡張する。
サイドバーのスウォッチグリッドをファミリー × トーン値の2次元マトリクスとして扱い、
行クリックでファミリー選択、列クリックでトーン選択を切り替える。

### 12-2. レイアウト

\`\`\`
┌─────────────────────────────────────────────────────────────────────────┐
│  Header: [Palette Lab]  [ProjectSelector]  [Import]  [Contrast]  [Export] │
├───────────────────────┬──────────────────────┬──────────────────────────┤
│  Sidebar              │  左列 (ファミリー軸)   │  右列 (トーン軸)          │
│                       │  [Red ×]             │  [500 ×]                 │
│  Neutral  ██████████  │                      │                          │
│  Red    > ████|█████  │  スウォッチ帯          │  スウォッチ帯             │
│  Orange   ████|█████  │                      │                          │
│  ...      ████|█████  │  [All Lightness       │  [All Lightness          │
│           ████|█████  │   Chroma Hue] tabs    │   Chroma Hue] tabs       │
│              ↑                               │                          │
│           500 列       │  L/C/H 数値入力        │  L/C/H 数値入力           │
│           ハイライト    │                      │                          │
│  [+ Add family]       │  Lightness カーブ      │  Lightness カーブ         │
│                       │  Chroma カーブ         │  Chroma カーブ            │
│                       │  Hue カーブ            │  Hue カーブ               │
└───────────────────────┴──────────────────────┴──────────────────────────┘
\`\`\`

### 12-3. サイドバーのインタラクション

| 操作 | 結果 |
|------|------|
| ファミリー行をクリック | 左列にそのファミリーを表示 |
| トーン値の列（スウォッチ）をクリック | 右列にそのトーン値を表示、サイドバーの該当列をハイライト |
| ファミリー内の特定スウォッチをクリック | 左列にそのファミリー、右列にそのトーン値を同時に表示 |

### 12-4. 左列 (ファミリー軸)

- 表示対象: 選択中ファミリーの **全トーン**
- 編集スコープ: **そのファミリーのみ** 変化
- カーブ編集: L / C / H それぞれのトーンカーブを SVG ドラッグで操作
- タブ構成: \`All\` / \`Lightness\` / \`Chroma\` / \`Hue\`
- 数値入力: 選択中トーンの L / C / H 個別入力欄

### 12-5. 右列 (トーン軸)

- 表示対象: **プロジェクト内の全ファミリー** の選択中トーン値
- 編集スコープ: **Neutral / Red / Orange / ... / Navy 全ファミリーの同一トーン値** を一括変化（サイドバーの表示・選択状態に関係なく全ファミリーが対象）
- カーブ表示: 各ファミリーの該当トーンを横並びで可視化
- 数値入力: L / C / H を入力すると全ファミリーの同トーンに適用
- mixed 表示: 各ファミリーで値が異なる場合は入力欄に "mixed" と表示

### 12-6. 競合解決ルール (last write wins)

\`\`\`
左列で Red.500.Hue = 20 に設定
  → Red.500.hue = 20 に書き込み

後から右列で tone 500 の Hue = 30 に設定
  → 全ファミリーの .500.hue = 30 に上書き (Red も 30 になる)

後から左列で Red.500.Hue = 25 に設定
  → Red.500.hue = 25 に上書き (他ファミリーは 30 のまま)
  → 右列の 500 Hue は "mixed" 表示
\`\`\`

競合解決のための特別な状態は不要。どちらの編集も \`UPDATE_TONE\` dispatch に帰着し、
最後に dispatch された値が state に残る。

### 12-7. ファミリー単位 Hue 統一

Phase 1 では \`ToneEntry\` ごとに独立した \`hue\` を持つ。
Phase 2 では左列の Hue カーブを **水平線** にすることでファミリー全トーンの Hue を統一できる。

データモデルの変更は不要 — カーブの制御点が全て同じ Y 値になるだけ。
将来的に \`ColorFamily.hue: number\` (ベース Hue) を追加し全トーンへの自動伝播を実装することも検討候補。

### 12-8. Phase 2 で新規追加が必要なもの

| 対象 | 内容 |
|------|------|
| \`store/actions.ts\` | \`UPDATE_TONE_BULK\` (トーン軸一括更新) アクション追加 |
| \`store/reducer.ts\` | \`UPDATE_TONE_BULK\` ハンドラ: アクティブプロジェクトの**全ファミリー**の指定 toneValue を一括更新 |
| \`store/actions.ts\` | \`SET_PRIMARY_BASE_TONE\` アクション追加 |
| \`store/reducer.ts\` | \`SET_PRIMARY_BASE_TONE\` ハンドラ: 指定ファミリーの \`primaryBaseTone\` を更新 |
| \`store/types.ts\` | \`ColorFamily.primaryBaseTone: number \\| null\` 追加（null = PRIMARY_BASE_COLORS のデフォルト値を使用）|
| \`store/types.ts\` | \`PaletteLabState.activeToneValue: number \\| null\` 追加 |
| \`index.tsx\` | コンテンツエリアを2列に変更 |
| \`components/ToneCurve/\` | SVG ドラッグカーブエディタ (新規コンポーネント) |
| \`components/ToneAxisPanel/\` | 右列: トーン軸ビュー (新規コンポーネント) |
| \`components/FamilyAxisPanel/\` | 左列: ファミリー軸ビュー (ToneEditor を発展させたもの) |
| \`components/PrimaryTab/\` | Base / Primary タブ切り替え + Primary スケールプレビュー |

---

## 13. Phase 2 仕様 — Base / Primary タブ & 透過スケール生成

> ユーザーフィードバック (2026-05-07) から確定した仕様。

### 13-1. サイドバー上部の Base / Primary タブ

サイドバー (\`PageLayoutPane\`) の最上部に \`Base\` / \`Primary\` の2タブを配置する。

| タブ | 表示内容 |
|------|---------|
| Base | \`ToneEntry.hex\` の実色（不透明）— 現状の表示 |
| Primary | 各ファミリーの primary-transparent scale プレビュー（OKLCH native）。pane background 上に composite して描画 |

### 13-2. Primary スケールの生成ロジック

**旧ロジック（廃止）**

\`\`\`
rgba(0, 0, 0, fixedAlpha)  ← TRANSPARENT_ALPHA 固定テーブルを全色に流用
\`\`\`

**現行ロジック（Dynamic Alpha + OKLCH native）**

\`\`\`
oklch(baseL% baseC baseH / neutralAlpha)  ← neutral palette から動的導出した alpha で展開
\`\`\`

base tone は \`ColorFamily.primaryBaseTone\`（未設定なら \`DEFAULT_BASE_TONE = 800\`）。
alpha は **neutral palette の実値から** \`buildNeutralAlphaMap()\` が導出する（固定テーブル不使用）。

\`buildPrimaryScale(family: ColorFamily, alphaMap: Map<number, number>): PrimaryScaleEntry[]\`

- \`alphaMap\` は \`buildNeutralAlphaMap(neutralFamily, origin)\` が返す \`Map<toneValue, alpha>\`（origin ごとに算出式が異なる）
- base tone より明るい（値が小さい）トーン → \`oklch(baseL% baseC baseH / alpha)\` (transparent)
- base tone 自体 → \`oklch(baseL% baseC baseH)\` (opaque)
- \`alphaMap\` に存在しないトーン → 除外（スケールに含めない）
- base より暗いトーン → 除外（テクスチャ表示）

### 13-3. neutral-derived alpha 算出式

neutral family の実際の hex 値から alpha を逆算する。\`origin\` によって算出式と overlay base が変わる。

\`\`\`ts
// color/neutral.ts
calcNeutralAlpha(hex: string): number = round3(1 - R/255)  // black overlay system
calcWhiteAlpha(hex: string):   number = round3(R/255)       // white overlay system

// color/transparent.ts
buildNeutralAlphaMap(neutralFamily: ColorFamily | undefined, origin: NeutralAlphaOrigin = "black"): Map<number, number>
  // origin === "black" → calcNeutralAlpha(hex): oklch(0% 0 0 / alpha)
  // origin === "white" → calcWhiteAlpha(hex):   oklch(100% 0 0 / alpha)
\`\`\`

例: neutral.300 = \`#e1e1e1\` → R=225
- black-origin: alpha = round3(1 - 225/255) = 0.118
- white-origin: alpha = round3(225/255) = 0.882

### 13-4. 生成対象

base tone より**明るい（値が小さい）トーンのみ**を透過化する。

\`\`\`
例: ["red", 600] の場合 (baseL/baseC/baseH は red-600 の OKLCH チャンネル値)
  red-600 → oklch(baseL% baseC baseH)              ← base tone: opaque
  red-500 → oklch(baseL% baseC baseH / alpha500)   ← alpha = buildNeutralAlphaMap().get(500)
  red-400 → oklch(baseL% baseC baseH / alpha400)
  red-300 → oklch(baseL% baseC baseH / alpha300)
  red-200 → oklch(baseL% baseC baseH / alpha200)
  red-100 → oklch(baseL% baseC baseH / alpha100)
  red-50  → oklch(baseL% baseC baseH / alpha50)
  red-700〜900 は out-of-scale（base より暗いトーン）→ texture 表示

例: ["yellow", 400] の場合 (baseL/baseC/baseH は yellow-400 の OKLCH チャンネル値)
  yellow-400 → oklch(baseL% baseC baseH)
  yellow-300 → oklch(baseL% baseC baseH / alpha300)
  yellow-200 → oklch(baseL% baseC baseH / alpha200)
  yellow-100 → oklch(baseL% baseC baseH / alpha100)
  yellow-50  → oklch(baseL% baseC baseH / alpha50)

※ alpha は固定値でなく neutral palette の実値から buildNeutralAlphaMap() が動的に導出する
\`\`\`

### 13-5. Neutral transparent の扱い

neutral-transparent スケールも Dynamic Alpha で生成する。base color は App BG lightness に応じて切り替わる。

\`\`\`typescript
// color/transparent.ts
export type NeutralAlphaOrigin = "black" | "white";
export const getNeutralAlphaOrigin = (appBgLightness: number): NeutralAlphaOrigin =>
  appBgLightness < 50 ? "white" : "black";
export const buildNeutralAlphaMap = (neutralFamily, origin: NeutralAlphaOrigin = "black"): Map<number, number>
\`\`\`

| App BG | origin | neutral-transparent | inverse-transparent (token key: \`white-transparent\`) |
|--------|--------|---------------------|------------------------------------------------------|
| light (\`>= 50\`) | \`"black"\` | \`oklch(0% 0 0 / calcNeutralAlpha)\` | \`oklch(100% 0 0 / calcNeutralAlpha)\` |
| dark (\`< 50\`) | \`"white"\` | \`oklch(100% 0 0 / calcWhiteAlpha)\` | \`oklch(0% 0 0 / calcWhiteAlpha)\` |

- \`origin\` は overlay base color と alpha 算出式の両方を決める
- black-origin は black overlay system: dark neutral に高 alpha が付く
- white-origin は white overlay system: light neutral に高 alpha が付く（暗転パレットでは 900 が最も明るい）
- \`buildNeutralAlphaMap(neutralFamily, origin)\` が返す \`Map<toneValue, alpha>\` は origin ごとに異なる
- primary transparent は現在の origin の neutral alphaMap を共有する
- \`inverse-transparent\` は \`neutral-transparent\` の逆 base を使う（同じ alphaMap を共有）
  - black-origin: neutral = black base, inverse = white base
  - white-origin: neutral = white base, inverse = black base
- public token key は互換性維持のため \`scale.white-transparent.*\` のまま。UI 表示は \`inverse-transparent\`
- 将来的に \`scale.inverse-transparent.*\` へ rename する場合は token refs / resolver / export を別タスクで一括移行する
- 固定テーブル \`TRANSPARENT_ALPHA\` は削除済み
- origin は \`runtimeTokens\`、\`resolve.ts\`、\`ContrastCheckPanel\`、\`TokenEditorDialog\`、\`exportTokens\` に伝播する

### 13-6. base tone の UI 変更

Primary タブ内の \`[red 600]\` 相当のラベルを **plain Button** にする。クリックで base tone を選択できる（Select または Dialog）。

- 変更は \`SET_PRIMARY_BASE_TONE\` を dispatch
- \`ColorFamily.primaryBaseTone\` に保存
- \`null\` の場合は \`PRIMARY_BASE_COLORS\` のデフォルト値を使用

\`\`\`
例: [red 600] をクリック → 500 を選択
  → SET_PRIMARY_BASE_TONE { familyId: "red-id", baseTone: 500 }
  → 以降の Primary プレビューは red-500 を起点に再計算
\`\`\`

### 13-7. Export: \`palette.tokens.js\`

Primary スケールの計算結果を \`palette.tokens.js\` 形式でエクスポートする。

- 現在本番で使用している \`palette.tokens.js\` との差し替えを想定
- 差分が明確になるよう、**同じファイル構造・変数名**を維持する
- このファイルの OKLCH 値をコントラストチェックのロジックに入力として使用する

\`\`\`js
// 出力イメージ (OKLCH native)
export const primaryScale = {
  red: {
    600: "oklch(47.8% 0.2074 27.33)",        // opaque base tone
    500: "oklch(47.8% 0.2074 27.33 / 0.45)", // transparent tones
    400: "oklch(47.8% 0.2074 27.33 / 0.32)",
    // ...
  },
  // ...
};
\`\`\`

### 13-8. Phase 2 (Primary 関連) で追加が必要なもの

| 対象 | 内容 |
|------|------|
| \`store/types.ts\` | \`ColorFamily.primaryBaseTone: number \\| null\` 追加 |
| \`store/actions.ts\` | \`SET_PRIMARY_BASE_TONE\` アクション追加 |
| \`store/reducer.ts\` | \`SET_PRIMARY_BASE_TONE\` ハンドラ追加 |
| \`color/primary.ts\` | \`buildPrimaryScale(family, alphaMap)\` — primary-transparent scale 生成（実装済み） |
| \`color/transparent.ts\` | \`NeutralAlphaOrigin\`・\`getNeutralAlphaOrigin(appBgLightness)\`・\`buildNeutralAlphaMap(neutralFamily, origin?)\` — App BG 基準の origin 切り替えと alphaMap 生成（実装済み） |
| \`utils/exportTokens.ts\` | \`palette.tokens.js\` 形式のエクスポート関数（実装済み） |
| \`components/PrimaryTab/\` | Primary タブビュー + base tone 変更ボタン（実装済み） |
| \`DEFAULT_BASE_TONE\` 定数 | \`color/primary.ts\` に定義（実装済み）。\`PRIMARY_BASE_COLORS\` は不採用 |
`;export{e as default};