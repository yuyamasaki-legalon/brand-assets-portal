var e=`# Typography Lab

**場所:** \`src/pages/sandbox/users/ichibasan/typography-lab/\`  
**URL:** \`http://localhost:5173/sandbox/ichibasan/typography-lab\`

Aegis typography token をリアルタイムに比較検証する sandbox ページ。  
\`Compare Aegis defaults\` トグルにより、Aegis native スタイルと Lab override の差を確認できる。

---

## Compare の仕組み

### 二層構造

Compare は raw fixture と Aegis component の 2 種類に分けて管理する。

| レイヤー | セレクタ | 目的 |
|---------|---------|------|
| Raw fixture compare | \`[data-typo-type="X"]\` | 生の HTML 要素への typography 適用確認 |
| Aegis component compare | \`[data-aegis-typography^="family."]\` | Aegis コンポーネント内 weight / spacing / line-height の確認 |

### Compare ON/OFF の挙動

- **Compare ON（デフォルト）:** CSS を注入しない。Aegis native スタイルがそのまま表示される
- **Compare OFF:** Lab settings の CSS が注入され、token override 後の見た目に切り替わる

### 対象プロパティ

- \`font-size\`: 原則 Aegis variant のまま維持（Lab では変更しない）
- \`font-weight\` / \`line-height\` / \`letter-spacing\` / \`font-family\`: Lab で比較調整する

---

## 誤爆回避

以下の方針で、意図しない要素への token 適用を防ぐ。

- **broad selector は使わない:** \`h1\`, \`p\`, \`button\`, \`label\` 等のタグ名 selector には戻さない
- **fixture は \`[data-typo-type]\` で限定:** raw compare はデータ属性で対象を明示する
- **Aegis component compare は \`[data-aegis-typography^="family."]\` で限定:** Aegis が付与する内部属性のみをターゲットにする
- **既知の除外対象:** \`SegmentedControl\` / \`Pagination\` は compare 対象から除外済み（内部の font-size 固定のため誤爆する）

---

## Sandbox-local Preview Fork

Chat Page と Contract Review の preview は、template 本体ではなく sandbox-local fork を使用する。

\`\`\`
previews/
├── ChatLayoutTypographyPreview.tsx    # template/chat-layout の fork
└── ReviewTypographyPreview.tsx        # template/loc/review の fork
\`\`\`

### なぜ fork するか

compare 用に \`variant="body.medium"\` や \`variant="body.medium.bold"\` を明示する必要があるが、これは Typography Lab 専用の検証対応であり template 本体の責務ではない。  
template を直接変更すると PR スコープが広がり、レビュー責務が混在する。

### 仕組み

\`assets/preview-pages.ts\` 内の \`LOCAL_PREVIEW_OVERRIDES\` で対象パスを上書きする。  
ユーザーが選択する preview page 名・パスはそのまま維持される。

\`\`\`ts
const LOCAL_PREVIEW_OVERRIDES: Partial<Record<string, ReactElement>> = {
  "/template/chat-layout": createElement(ChatLayoutTypographyPreview),
  "/template/loc/review":  createElement(ReviewTypographyPreview),
};
\`\`\`

### Fork ファイルのメンテ方針

- compare 用の typography 変更のみを fork 側に入れる
- template 本体のレイアウト・ロジック変更は template 側のみに入れ、fork を随時同期する

---

## State 永続化

\`localStorage\` キー: \`typography-lab:v1\`

| 保存対象 | 説明 |
|---------|------|
| \`settingState\` | weight / letter-spacing / line-height トークン値 |
| \`variantMapState\` | variant ↔ weight slot マッピング |
| \`fontPriority\` | Hiragino-first / Noto-first プリセット |
| \`previewPageId\` | 選択中の preview template |
| \`compareMode\` | Compare ON/OFF |
| \`paneTabIndex\` | サイドバータブ（Setting / Variant Map）|
| \`familyFilter\` | Variant Map のファミリーフィルター |
| \`isSidebarOpen\` | サイドバーの開閉状態 |
| \`fontFaceCss\` | Font CSS タブのカスタム CSS |
| \`paletteJson\` | Palette タブの JSON |

### 優先順位

\`\`\`
compareMode: URL ?compare=  >  localStorage  >  default(true)
previewPageId: URL ?page=   >  localStorage  >  default("")
その他:        localStorage  >  default
\`\`\`

### Reset との整合

各 Reset ボタン（\`Reset to defaults\`）は state を更新するだけでよい。  
保存用 \`useEffect\` が変更を検知して自動的に localStorage を上書きするため、  
リロード後も reset 後の値が維持される。

---

## Font 方針

- **英字 / 数字:** Inter（Google Fonts から直接ロード）
- **日本語:** Hiragino Sans → Noto Sans JP フォールバック（Hiragino-first デフォルト）
- **優先順切り替え:** Font priority セレクトで Noto-first に変更可能
- **カスタムスタック:** Font CSS タブで \`@font-face\` / \`:root\` override を直接編集できる
- **旧 Aegis Inter の扱い:** localStorage に \`"Aegis Inter"\` が保存されている場合、\`loadPersistedState\` 内で \`"Inter"\` に自動移行する

---

## ファイル構成

\`\`\`
typography-lab/
├── README.md                          # このファイル
├── index.tsx                          # メインコンポーネント（UI + state）
├── index.module.css                   # slider / dialog スタイル
├── auto-generated-prd.md              # AI 自動生成の要件定義
├── auto-generated-handoff.md          # AI 自動生成のハンドオフ
├── previews/
│   ├── ChatLayoutTypographyPreview.tsx  # Chat Page compare 用 sandbox fork
│   └── ReviewTypographyPreview.tsx      # Contract Review compare 用 sandbox fork
└── assets/
    ├── preview-pages.ts               # template ページ一覧 + local override 管理
    ├── setting-model.ts               # weight / letter-spacing / line-height 定義
    ├── variant-map-model.ts           # variant ↔ weight slot マッピング定義
    ├── typography-vars.ts             # CSS vars 生成 + compare CSS 定義
    ├── export-model.ts                # CSS / JSON / JS エクスポート生成
    ├── raw-preview.tsx                # raw fixture compare 用プレビュー
    ├── palette-resolver.ts            # Palette JSON → CSS custom properties 変換
    └── palette.json                   # デフォルトパレット
\`\`\`
`;export{e as default};