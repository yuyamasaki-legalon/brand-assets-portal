# 仕様レビュー 19観点 詳細判定基準

各観点の具体的な判定ロジックとサンプルを記載する。

---

## 1. 完全性

### C1: 必須セクション欠落（Error）

**SPEC.md の必須セクション:**

- Purpose（目的）
- Use Cases（ユースケース）
- Screen Composition > Layout
- Screen Composition > Key Components
- Screen Composition > Data Structure
- Screen Composition > State
- Screen Composition > Interactions

**auto-generated-prd.md の必須セクション:**

- Snapshot
- Confirmed Requirements
- UI Mapping

**判定:** 上記セクションが存在しない、または空の場合に Error。

### C2: TBD/TODO 残留（Warning）

**検出パターン:**

```
{TBD}, {TODO}, {要実装}, {要確認}, {未定}, TBD, TODO
```

**判定:**
- 3個以下: 各箇所を Warning で報告
- 4個以上: 全体として Warning + 「仕様確定を優先すべき」とコメント
- `{要実装: ...}` 形式でコンテキストが書かれている場合は軽微扱い（Info に降格可）

### C3: データ構造未定義（Error）

**判定ロジック:**

1. Key Components に以下のデータ表示系コンポーネントがあるか確認:
   - Table, DataTable, List, Card（データ一覧用）
2. ある場合、Data Structure に対応する interface/type が定義されているか確認
3. 未定義の場合 Error

**例:**
```
Key Components に DataTable があるが、Data Structure が空
→ Error: DataTable の行データ型が未定義
```

### C4: 状態網羅不足（Warning）

**判定ロジック:**

1. Key Components から操作可能なコンポーネントを抽出:
   - Dialog/Drawer → open/close 状態が必要
   - Form/Select/TextField → 入力値の状態が必要
   - Tab → 選択タブの状態が必要
2. State セクションに対応する状態変数があるか確認
3. 不足があれば Warning

### C5: ユースケース不足（Warning）

**判定ロジック:**

1. Interactions からユーザーアクションを抽出
2. 各アクションが Use Cases のいずれかにマッピングできるか確認
3. マッピングできない Interaction があれば Warning

**例:**
```
Interactions: 「削除ボタン → 確認ダイアログ → 削除実行」
Use Cases に「データを削除する」がない
→ Warning: 削除操作のユースケースが未記載
```

---

## 2. 明確性

### A1: 曖昧表現（Warning）

**検出ワード一覧:**

| カテゴリ | ワード |
|---------|-------|
| 程度 | 「適切に」「必要に応じて」「適宜」「適当に」 |
| 範囲 | 「など」「等」「その他」「様々な」（セクション末尾で使用時） |
| 条件 | 「場合がある」「可能性がある」「かもしれない」 |
| 数量 | 「いくつかの」「多数の」「少数の」（具体数値なし） |

**除外条件:**
- 備考セクション内の「など」は許容（列挙の省略として自然）
- Purpose セクション内の概要表現は許容

### A2: 主語不明（Warning）

**判定ロジック:**

Interactions セクションの各行を確認:
- 「〜する」「〜を行う」等のアクション記述で、主体が不明確な場合
- 良い例: 「ユーザーがボタンをクリック → システムがデータを保存」
- 悪い例: 「ボタンクリック → データ保存」（誰が何をトリガーするか不明）

**注意:** 箇条書きの暗黙の主語「ユーザーが」は許容。明らかにシステム側の動作は主語が必要。

### A3: 型の曖昧さ（Warning）

**判定ロジック:**

Data Structure の各フィールドを確認:
- `string` 型で、実際には固定の値セット（ステータス、カテゴリ等）を表すべき場合
- `number` 型で、範囲や単位の記載がない場合

**例:**
```typescript
status: string;  // → Warning: ステータス値のユニオン型を定義すべき
// 推奨: status: "draft" | "review" | "approved" | "rejected";
```

**除外条件:**
- コメントで値の例や範囲が記載されている場合は許容
- `id`, `title`, `name` 等の汎用フィールドは除外

---

## 3. 一貫性

### I1: コンポーネント不一致（Error）

**判定ロジック:**

1. Key Components に記載されたコンポーネント名を収集
2. Interactions に登場するコンポーネント名を収集
3. Interactions にのみ存在するコンポーネントがあれば Error

**例:**
```
Key Components: Table, Button, Dialog
Interactions: 「Drawerを開く」 ← Key Components に Drawer がない
→ Error: Drawer が Key Components に未記載
```

### I2: 状態とインタラクションの矛盾（Error）

**判定ロジック:**

1. Interactions で状態変更を伴うアクションを抽出（`→ {state}を更新` 等）
2. 参照される状態名が State セクションに存在するか確認
3. 存在しなければ Error

### I3: SPEC/PRD間の矛盾（Warning）

**判定ロジック:**

同ディレクトリに SPEC.md と auto-generated-prd.md の両方がある場合:

1. Purpose / Snapshot の内容が矛盾していないか
2. Use Cases / Confirmed Requirements が矛盾していないか
3. Key Components / UI Mapping が矛盾していないか

**注意:** 粒度の違いは許容。明確な矛盾（例: SPEC では Dialog だが PRD では Drawer）のみ報告。

---

## 4. 状態網羅

### S1: 非正常系欠落（Warning）

**判定ロジック:**

以下の非正常系状態が仕様のどこかに記載されているか確認:

| 状態 | 検出条件 |
|------|---------|
| Loading | データ取得を伴う画面で、ローディング表示の記載がない |
| Error | API 呼び出しがあるが、エラー時の表示・動作が未記載 |
| Empty | 一覧表示があるが、データ0件時の表示が未記載 |

**参照:** `skills/states-feedback/SKILL.md` の判断フローチャート

### S2: バリデーション未定義（Warning）

**判定ロジック:**

1. Key Components にフォーム系コンポーネントがあるか確認:
   - TextField, Select, DateField, Textarea, NumberField, Combobox
2. ある場合、バリデーションルール（必須/形式/範囲）の記載があるか確認
3. 未記載の場合 Warning

**例:**
```
Key Components に TextField（メールアドレス入力）があるが
バリデーションルール（必須、メール形式）の記載がない
→ Warning: メールアドレスフィールドのバリデーション未定義
```

### S3: フィードバック未定義（Info）

**判定ロジック:**

1. Interactions から副作用を伴うアクションを抽出:
   - 「保存」「削除」「送信」「更新」「作成」
2. アクション後のフィードバック（Snackbar、画面遷移等）の記載があるか確認
3. 未記載の場合 Info

---

## 5. Aegis整合

### G1: 存在しないコンポーネント（Error）

**判定ロジック:**

1. Key Components および Interactions に記載されたコンポーネント名を収集
2. `mcp__aegis__list_components` で Aegis の全コンポーネント一覧を取得
3. 一覧に存在しないコンポーネント名があれば Error

**除外条件:**
- 「カスタム」「カスタムコンポーネント」と明記されている場合は除外
- 複合名（例: 「SidebarNavigation」）はカスタムコンポーネントとして許容

### G2: 選択妥当性（Warning）

**判定ロジック:**

以下の一般的なミスマッチを検出:

| 用途 | 不適切 | 推奨 |
|------|-------|------|
| ステータス表示 | Badge のみ | StatusLabel |
| 選択肢が少ない（3以下） | Combobox | Select or RadioGroup |
| 選択肢が多い（10以上） | Select | Combobox |
| Yes/No の切り替え | Checkbox | Switch |
| アイコンのみのボタン | Button + Icon | IconButton |
| 複数選択タグ | 独自実装 | TagPicker |

### G3: レイアウトパターン不一致（Warning）

**判定ロジック:**

Layout セクションの「パターン」が以下のテンプレートパターンのいずれかに合致するか確認:

- パターン1: 一覧画面（list-layout）
- パターン1.1: 一覧＋詳細（list-layout + Pane）
- パターン2: 詳細・編集画面（detail-layout）
- パターン3: 設定画面（settings-layout）
- パターン4: Chat UI
- パターン5: ダイアログ
- fill-layout, form-layout

合致しない場合 Warning。ただし合理的な理由がある場合は Info に降格。

---

## 6. 用語整合

### T1: CONCEPT.md 用語不統一（Warning）

**判定ロジック:**

1. CONCEPT.md の Terminology セクションから用語一覧を取得
2. SPEC.md / auto-generated-prd.md 内で、同じ概念に対して異なる表現が使われていないか確認

**例:**
```
CONCEPT.md: 「案件」（Case）
SPEC.md: 「プロジェクト」と記載
→ Warning: CONCEPT.md では「案件」だが「プロジェクト」と記載されている
```

**注意:** 完全一致でなくても、明らかに同じ概念を指す場合のみ報告。

### T2: エンティティ名乖離（Info）

**判定ロジック:**

1. CONCEPT.md の Core Entities / Domain Model からエンティティ名を取得
2. Data Structure の interface/type 名と比較
3. 大きく乖離している場合 Info

**例:**
```
CONCEPT.md Entity: Case（案件）
Data Structure: interface ProjectItem { ... }
→ Info: エンティティ名が CONCEPT.md の Case と乖離（ProjectItem）
```

**除外条件:**
- 接尾辞の違い（`Case` vs `CaseRow`, `CaseDetail`）は許容
- 技術的な命名規則による違い（`CaseDTO`, `CaseResponse`）は許容
