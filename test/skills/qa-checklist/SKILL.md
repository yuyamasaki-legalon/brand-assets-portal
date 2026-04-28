---
name: qa-checklist
description: "SPEC.md / auto-generated-prd.md から QA チェックリストを Markdown 形式で生成。画面操作・状態遷移・フォームバリデーション・インタラクション・コンポーネント固有の5カテゴリを網羅。プロトタイプ検証やテスト計画策定時に使用。NOT WHEN: 仕様レビュー（→ spec-review）、仕様書がまだ存在しない場合。"
disable-model-invocation: true
---

# QA チェックリスト生成

SPEC.md / auto-generated-prd.md から **そのまま使える Markdown チェックリスト** を生成する。

## 使用方法

```
/qa-checklist                                              # カレントディレクトリの SPEC.md or auto-generated-prd.md
/qa-checklist src/pages/sandbox/loc/xxx/case-detail        # パス指定
/qa-checklist --output qa-checklist.md                     # ファイルに保存
/qa-checklist src/pages/sandbox/xxx --output qa-checklist.md  # パス指定 + ファイル保存
```

---

## 実行手順

### Step 1: 対象ファイルの特定

引数 `$ARGUMENTS` からパスと `--output` オプションを解析:

- **パス解析**: `spec-review` と同じロジック（SPEC.md → auto-generated-prd.md 優先順）
- **`--output`**: 指定時はチェックリストをファイルに保存。未指定時はチャットに出力

### Step 2: 仕様の読み込みと解析

対象ファイルを読み込み、以下の情報を抽出:

| 抽出対象 | SPEC.md のソース | auto-generated-prd.md のソース |
|---------|-----------------|-------------------------------|
| ユースケース | Use Cases | Confirmed/Inferred Requirements |
| コンポーネント | Key Components | UI Mapping |
| データ型 | Data Structure | ― |
| 状態変数 | State | ― |
| 操作 | Interactions | Confirmed Requirements（操作系） |

### Step 3: 5カテゴリのチェック項目生成

#### 3.1 画面操作

Use Cases / Confirmed Requirements から正常系・異常系を導出:

**生成ルール:**
- 各ユースケースにつき最低1つの正常系チェック
- データ入力を伴うユースケースには異常系チェック（空入力、不正値）を追加
- 複数ステップのユースケースはステップごとにチェック

**出力例:**
```markdown
### 画面操作

#### 正常系
- [ ] 案件一覧が表示される
- [ ] タブ切り替えで表示内容が変わる
- [ ] 案件をクリックすると詳細 Drawer が開く

#### 異常系
- [ ] 検索で該当なしの場合、Empty 状態が表示される
- [ ] 不正な日付入力がバリデーションエラーになる
```

#### 3.2 状態遷移

状態パターン（Loading / Error / Empty / Feedback）の網羅性を確認。`skills/states-feedback/SKILL.md` の判断フローチャートを参照して導出:

**生成ルール:**

| 条件 | 生成するチェック項目 |
|------|-------------------|
| データ取得画面 | Loading 表示 → データ表示の遷移 |
| API 呼び出しあり | Error 時の表示・リトライ |
| 一覧表示あり | Empty 状態の表示 |
| 副作用アクションあり | Feedback（Snackbar等）の表示 |
| Dialog/Drawer あり | 開閉状態の遷移 |

**出力例:**
```markdown
### 状態遷移

- [ ] 初回読み込み時に Loading（Skeleton）が表示される
- [ ] データ取得エラー時にエラー表示 + リトライボタンが表示される
- [ ] 案件が0件の場合に EmptyState が表示される
- [ ] 保存成功時に Snackbar が表示される
- [ ] Drawer の開閉が正常に動作する
```

#### 3.3 フォームバリデーション

Data Structure の型定義からバリデーション項目を導出:

**生成ルール:**

| フィールドの型/特性 | 生成するチェック項目 |
|-------------------|-------------------|
| 必須フィールド（`?` なし） | 空送信でエラーが出る |
| `string` + 名称系 | 最大文字数の確認 |
| `string` + メール/URL | 形式バリデーション |
| `number` | 数値以外の入力拒否、境界値 |
| `Date` / DateField | 不正日付の入力拒否 |
| enum / union 型 | 各選択肢で正常動作 |

**出力例:**
```markdown
### フォームバリデーション

- [ ] 案件名が空の状態で保存するとエラーが表示される
- [ ] ステータスの各選択肢（draft/review/approved/rejected）で正常に保存できる
- [ ] 納期に過去日付を入力した場合の動作が適切
- [ ] 担当者が未選択の状態で保存するとエラーが表示される
```

#### 3.4 インタラクション

Interactions セクションのアクション→結果マッピングを1対1でチェック項目化:

**生成ルール:**
- 各 Interaction 行を「アクション → 期待結果」の形式でチェック項目化
- `{要実装}` マーカーがある場合は `[未実装]` 注記を付与
- 状態変更を伴うアクションは変更後の状態も確認項目に含める

**出力例:**
```markdown
### インタラクション

- [ ] テーブル行クリック → 詳細 Drawer が開き、選択した案件の情報が表示される
- [ ] フィルターボタンクリック → フィルター Drawer が開く
- [ ] タブ切り替え → 対応するコンテンツが表示される
- [ ] 「案件を作成」ボタン → [未実装] 案件作成フロー
- [ ] メッセージ投稿 → [未実装] メッセージが送信される
```

#### 3.5 コンポーネント固有

Key Components から該当コンポーネントの QA 項目を挿入。詳細は `skills/qa-checklist/references/component-qa-checks.md` を参照:

**生成ルール:**
1. Key Components に記載されたコンポーネントを抽出
2. `component-qa-checks.md` から該当コンポーネントのチェック項目を取得
3. 仕様の具体的なコンテキストに合わせてチェック項目をカスタマイズ
4. **reference に該当がない場合**: `mcp__aegis__get_component_detail` で Props・振る舞いを取得し、汎用チェック項目（表示確認・操作確認・状態確認）を生成する

**出力例:**
```markdown
### コンポーネント固有

#### DataTable
- [ ] ソート操作で列の昇順/降順が切り替わる
- [ ] ページネーションで次ページ/前ページに遷移できる
- [ ] 行選択が正しく動作する

#### Dialog/Drawer
- [ ] ESC キーで閉じることができる
- [ ] 外側クリックで閉じることができる
- [ ] フォーカストラップが正しく動作する
```

### Step 4: チェックリスト出力

#### チャット出力（デフォルト）

```markdown
## QA チェックリスト

**対象**: {ファイルパス}
**生成日**: {日付}
**チェック項目数**: {合計数}

### 1. 画面操作（N項目）
...

### 2. 状態遷移（N項目）
...

### 3. フォームバリデーション（N項目）
...

### 4. インタラクション（N項目）
...

### 5. コンポーネント固有（N項目）
...

---
[未実装] マークの項目はプロトタイプ段階のため、実装後に再検証が必要。
```

#### ファイル出力（`--output` 指定時）

指定パスに Markdown ファイルとして保存。フォーマットはチャット出力と同一。

---

## 生成上の注意点

- **auto-generated-prd.md の場合**: Data Structure / State がないため、3.3（フォームバリデーション）は UI Mapping のコンポーネント情報から推測して生成。推測項目には `[推測]` 注記を付与
- **{要実装} マーカー**: チェック項目に含めるが `[未実装]` 注記を付与。テスト対象外であることを明示
- **チェック項目の粒度**: 1項目 = 1アクション + 1期待結果。複合的なチェックは分割
- **重複排除**: 複数カテゴリで同じ確認事項が生成される場合、最も適切なカテゴリに1つだけ配置

---

## 参照ドキュメント

| ドキュメント | 内容 |
|---|---|
| `skills/qa-checklist/references/component-qa-checks.md` | コンポーネント別 QA チェック項目 |
| `skills/states-feedback/SKILL.md` | 状態パターン判断フローチャート |
| `skills/spec-generator/SKILL.md` | SPEC.md の正規フォーマット |
| `skills/generated-prd-capture/SKILL.md` | auto-generated-prd.md の正規フォーマット |

---

## 関連スキル

- `/spec-review` - 仕様品質レビュー（チェックリスト生成前に実行を推奨）
- `/states-feedback` - 状態表示・フィードバックパターン
- `/aegis-review` - 実装コードの Aegis 準拠レビュー
- `/spec-generator` - 既存コードからの SPEC.md 生成
