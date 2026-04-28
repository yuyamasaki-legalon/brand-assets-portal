# Aegis 攻撃面リスト

敵対的レビューで優先的に走査するリスク領域。
高コスト・検出困難・影響範囲が広い順に並べている。

---

## 優先度 1: 生 HTML インタラクティブ要素

**検出対象**: `<button>`, `<input>`, `<select>`, `<textarea>`, `<a>` (href 付き)

**なぜ高コストか**:
- Aegis のスタイリング、アクセシビリティ機能、デザイン一貫性を**完全にバイパス**する
- 1つの生要素がページ全体の品質印象を下げる
- 後から置き換える際にイベントハンドラやバリデーションの再配線が必要

**対応する Aegis コンポーネント**:
- `<button>` → `<Button>`, `<IconButton>`
- `<input>` → `<TextField>`, `<Checkbox>`, `<RadioButton>`, `<Switch>`
- `<select>` → `<Select>`
- `<textarea>` → `<Textarea>`
- `<a>` → `<Link>`, `<LinkButton>`

---

## 優先度 2: アクセシビリティ属性の欠落

**検出対象**:
- `<IconButton>` に `aria-label` なし
- `<TextField>`, `<Select>` 等が `<FormControl>` + `<FormControl.Label>` 外
- `<Dialog>`, `<Drawer>` に Header なし（フォーカストラップのラベル消失）
- `<Table>` に `<Table.Head>` なし
- `<img>` に `alt` なし
- `<div onClick>` にキーボードハンドラ（`onKeyDown`）なし

**なぜ高コストか**:
- WCAG 2.1 AA 違反は法的リスクになりうる
- 支援技術（スクリーンリーダー等）のユーザーを完全に遮断する
- 後から修正すると UI 構造の変更が伴うことが多い

---

## 優先度 3: デザイントークン不使用

**検出対象**:
- インラインスタイルやCSS内の生 `px` 値（`padding: 16px` 等）
- 生カラー値（`#333`, `rgb()`, `rgba()`）
- 廃止トークン形式（`--spacing-*`, `--color-*`）
- トークン種類の誤用（spacing に size トークン使用等）

**なぜ高コストか**:
- ページ横断で蓄積する視覚的負債
- テーマ変更やトークン改定時に一括更新から漏れる
- 1ファイルの修正で済まず、grep + 目視確認が必要

---

## 優先度 4: PageLayout 構成違反

**検出対象**:
- ページファイル（`src/pages/*/index.tsx`, `*/Page.tsx`）に `<PageLayout>` がない
- `<ContentHeaderTitle>` がない
- テンプレートパターン（list-layout, detail-layout 等）から逸脱

**なぜ高コストか**:
- レスポンシブ動作が壊れる
- ヘッダー/フッターの一貫性が失われる
- ナビゲーションパターンとの整合性が崩れる

---

## 優先度 5: コンポーネント API 誤用

**検出対象**:
- 必須 Props の欠落（MCP `mcp__aegis__get_component_detail` で検証）
- 必須子要素の欠落（`DialogContent` に `DialogHeader` なし等）
- 非推奨 Props の使用
- 型に合わない値の渡し

**なぜ高コストか**:
- ランタイムエラーやサイレント劣化を引き起こす
- TypeScript が検出しない論理的な誤用がある
- バグの原因特定に時間がかかる

---

## 優先度 6: アンチパターンカタログ該当

**検出対象**: `docs/anti-patterns/index.json` に登録されたパターン

**なぜ高コストか**:
- 過去に実際にバグや品質問題を引き起こした既知のパターン
- 再発防止のために明文化されたルール
- ESLint ルールが紐づくものは自動検出可能
