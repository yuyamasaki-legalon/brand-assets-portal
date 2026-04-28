# Aegis Review Checklist

コードレビュー時にチェックする項目の一覧。

---

## 1. コンポーネント使用

- [ ] カスタム UI コンポーネントを作成していないか
- [ ] 生 HTML 要素（`<button>`, `<input>`, `<select>`, `<table>`）を使用していないか
- [ ] 生 `<span>` の代わりに `<Text>` を使用しているか
- [ ] コンポーネントの props を MCP ツールで確認したか
- [ ] `docs/rules/component/{ComponentName}.md` を読んだか

## 2. フォーム

- [ ] TextField / Select / Textarea 等が FormControl 内にあるか
- [ ] FormControl に FormControl.Label が含まれているか
- [ ] FormControl 外の入力に aria-label があるか
- [ ] error 状態に FormControl.Caption があるか
- [ ] required は prop で設定しているか（手動 `*` ではなく）

## 3. ダイアログ / Drawer

- [ ] DialogContent に DialogHeader があるか
- [ ] DialogHeader に ContentHeader.Title があるか
- [ ] DialogBody に Banner を直接配置していないか（→ DialogStickyContainer）
- [ ] DialogFooter の Solid Button が 1 つ以下か
- [ ] Drawer に Drawer.Header があるか
- [ ] Drawer.Header に閉じるボタンを二重実装していないか

## 4. ボタン

- [ ] Button に inline margin / width を指定していないか
- [ ] Button のスタイルをオーバーライドしていないか
- [ ] 同一画面に複数の Solid Button がないか
- [ ] Button の leading/trailing にインタラクティブ要素がないか
- [ ] IconButton に aria-label があるか
- [ ] IconButton が Tooltip でラップされているか
- [ ] color="danger" は削除操作のみに使用しているか

## 5. テーブル

- [ ] Table に Table.Head があるか
- [ ] Table.Cell にボタンを直接配置していないか（→ Table.ActionCell）
- [ ] CheckboxCell に aria-labelledby があるか

## 6. Banner

- [ ] Banner にアイコンを手動追加していないか
- [ ] Banner の color prop が内容と一致しているか

## 7. デザイントークン

- [ ] 生 px 値を使用していないか
- [ ] 生カラー値を使用していないか
- [ ] spacing に size トークンを使用していないか
- [ ] コンテナ幅に size トークンを使用していないか
- [ ] 廃止トークン命名を使用していないか

## 8. レイアウト

- [ ] ページが PageLayout をフレームとして使用しているか
- [ ] テンプレートパターンに準拠しているか
- [ ] ContentHeader.Title が存在するか

## 9. アクセシビリティ

- [ ] img に alt 属性があるか
- [ ] div/span onClick にキーボード対応があるか
- [ ] 見出し階層が順番通りか
- [ ] 正の tabIndex を使用していないか
- [ ] aria-hidden が操作可能要素に設定されていないか
- [ ] テキスト省略時に Tooltip が設定されているか

## 10. Link

- [ ] Link にアイコンを子要素で配置していないか（→ trailing/leading）
- [ ] href なしの Link に role="button" があるか
