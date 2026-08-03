var e=`# Codex Instructions — Palette Lab

## あなたの役割

このリポジトリの \`src/pages/sandbox/users/ichibasan/palette-lab/\` に OKLCH カラーパレット管理ツールを実装してください。
タスクファイルを **task-01 → task-10 の順番** に消化し、各タスクの Acceptance Criteria をすべて満たしてから次に進んでください。

---

## リポジトリ概要

| 項目 | 内容 |
|---|---|
| フレームワーク | React 18 + TypeScript (strict) + Vite |
| パッケージマネージャ | pnpm |
| UI コンポーネント | \`@legalforce/aegis-react\`（これ以外のカスタム UI は作らない） |
| アイコン | \`@legalforce/aegis-icons\` |
| フォーマッタ | Biome（\`pnpm format\` で自動修正） |

---

## 作業ディレクトリ

\`\`\`
src/pages/sandbox/users/ichibasan/palette-lab/
\`\`\`

すべての新規ファイルはこのディレクトリ配下に作成します。

---

## タスクファイルの場所

\`\`\`
src/pages/sandbox/users/ichibasan/palette-lab/tasks/
├── task-01-setup.md
├── task-02-types.md
├── task-03-color-math.md
├── task-04-store.md
├── task-05-seed-import.md
├── task-06-layout.md
├── task-07-family-list.md
├── task-08-swatch-row.md
├── task-09-tone-editor.md
└── task-10-export.md
\`\`\`

設計ドキュメントは \`docs/design.md\`、背景情報は \`docs/feasibility.md\` にあります。

---

## 各タスクの処理手順

1. タスクファイルを読む
2. **Input** セクションに列挙されたファイルが存在することを確認する
3. **Implementation Notes** に従って実装する
4. \`pnpm build\`（または \`pnpm tsc --noEmit\`）でエラーがないことを確認する
5. **Acceptance Criteria** をすべてチェックする
6. 次のタスクへ進む

---

## 絶対に守るルール

### コード品質
- TypeScript strict モード — \`any\` 禁止、\`@ts-expect-error\` 禁止
- 型のみのインポートは \`import type\` を使う
- 未使用の変数・インポートを残さない
- \`pnpm build\` がエラーゼロで通ること

### UI
- インタラクティブな UI はすべて \`@legalforce/aegis-react\` のコンポーネントを使う
- 独自スタイルの HTML 要素（\`<button>\`, \`<input>\`）を直接レンダリングしない
  - ただしカラーチップ（\`<div>\` に \`background-color\` を当てるだけ）はこの限りではない
- スペーシング・色・角丸は Aegis の CSS カスタムプロパティ（\`var(--aegis-space-*)\` 等）を使う。生の \`px\` 値は使わない

### ファイル管理
- \`src/pages/sandbox/users/ichibasan/sandbox-builder/\` 配下のファイルを **インポートしない**
  - 必要なロジックは \`palette-lab/\` 内に独立してコピー・再実装する
- \`src/pages/sandbox/users/ichibasan/palette-lab/\` 外のファイルを変更しない
  - 例外: \`task-01\` での \`pnpm add culori\`（\`package.json\` / \`pnpm-lock.yaml\` の変更は許容）
- インポートパスは相対パスを使う（\`../../color/oklch\` など）

### 既存ファイルの保護
- \`index.tsx\`（ページエントリ）は task-06 で上書きします。それ以前のタスクでは変更しないこと
- \`auto-generated-prd.md\` は変更しないこと

---

## 依存ライブラリ

task-01 で \`culori\` を追加します：

\`\`\`sh
pnpm add culori
\`\`\`

culori v1+ は型定義を内蔵しています。\`@types/culori\` が必要かどうかは、追加後に \`import type { Oklch } from "culori"\` が解決できるか確認して判断してください。

**culori の \`l\` 値の単位に注意:**
culori は Lightness を **0–1** で扱います。
Aegis・このプロジェクトは Lightness を **0–100（%）** で管理します。
変換時は必ず \`l / 100\`（culori への入力）と \`l * 100\`（culori からの出力）を行うこと。

---

## データモデルの概要

\`\`\`typescript
ToneEntry {
  value: number;        // 50, 100, 200, ..., 900
  lightness: number;    // OKLCH L — 0–100 (Aegis % 表記)
  chroma: number;       // OKLCH C — 0–0.4 程度
  hue: number;          // OKLCH H — 0–360
  alphaMode: "none" | "transparent" | "primary";
  hex: string;          // OKLCH→hex の計算済みキャッシュ
}

ColorFamily {
  id: string;           // crypto.randomUUID()
  name: string;
  tones: ToneEntry[];
}

PaletteProject {
  id: string;
  name: string;
  createdAt: string;    // ISO 8601
  updatedAt: string;
  colorFamilies: ColorFamily[];
}

PaletteLabState {
  projects: PaletteProject[];
  activeProjectId: string | null;
  activeFamilyId: string | null;
}
\`\`\`

詳細な型定義・Reducer アクション一覧は \`docs/design.md\` を参照してください。

---

## 完了確認コマンド

各タスク完了後と全タスク完了後に必ず実行してください：

\`\`\`sh
pnpm build
\`\`\`

エラーがゼロであること。警告は許容しますがエラーは許容しません。
`;export{e as default};