# Add content

各レイアウトエリアに Aegis コンポーネントを配置する機能。

---

## 起動方法

ツールバーの `+`（Add content）ボタンを押すと Add content モードになる。
各エリアに `Content` ボタン（またはアイコンボタン）が表示され、押すとポップオーバーが開く。

---

## ポップオーバーの構成

### Browse タブ

- `Search` フィールドでコンポーネント名をインクリメンタル検索
- 検索結果は `ActionList` で一覧表示
- アイテムをクリックするとそのエリアにコンポーネントが追加される

#### スロット選択（Header / Footer 系エリアのみ）

`globalHeader` / `*Footer` 系エリアでは、アイテムクリック時にサブメニューが開き **Start / End** のいずれかを選んで追加する。

### In Use タブ

- そのエリアに追加済みのコンポーネント一覧を表示
- 各アイテムに設定ボタン（歯車）と削除ボタン（ゴミ箱）が付く
- ドラッグ＆ドロップで順番を変更できる
- Header / Footer 系エリアでは **Start / End** の2グループに分かれて表示される

---

## エリアごとの表示ルール

| エリア種別 | 空のとき | アイテムがあるとき |
|-----------|---------|-----------------|
| Body 系（contentBody / paneStartBody / paneEndBody） | `EmptyState` を表示（contentBody は medium、それ以外は small） | 縦並び + ドラッグ並べ替え |
| Header / Footer 系 | エリア名ラベルを表示 | 横並び（row）でレンダリング |
| その他（globalHeader 等） | エリア名ラベルを表示 | 横並び（row）でレンダリング |

---

## コンポーネント設定（ItemSettingsPopover）

各コンポーネントにはプロパティ設定用のポップオーバーがある。

- タブ構成は **Properties / Content** の2タブが基本
- コンポーネントごとに有効なタブが異なる（`DISABLED_INNER_TABS` で制御）
  - `Checkbox`：`noLabel: true` のとき Content タブを無効化
  - `Code` / `CodeBlock`：Properties タブを無効化
- ポップオーバーの幅・min-height はコンポーネントごとに個別設定（`POPOVER_WIDTHS` / `POPOVER_MIN_HEIGHTS`）

---

## 対応コンポーネント一覧（70+）

Accordion / ActionList / Avatar / AvatarGroup / Badge / Banner / Blockquote / Breadcrumb /
Button / ButtonGroup / Calendar / Card / Checkbox / CheckboxCard / CheckboxGroup /
Code / CodeBlock / Combobox / ContentHeader / DataTable / DateField / DatePicker /
DescriptionList / Divider / DividerVertical / EmptyState / FileDrop / Form / FormControl /
IconButton / InformationCard / InformationCardGroup / Link / Mark / NavList / OrderedList /
Pagination / Radio / RadioCard / RadioGroup / RangeCalendar / RangeDateField / RangeDatePicker /
RangeTimeField / RangeTimePicker / Search / SegmentedControl / Select / Skeleton / StatusLabel /
Stepper / Switch / Table / Tabs / Tag / TagGroup / TagInput / TagPicker / Text / TextField /
Textarea / TimeField / TimePicker / Timeline / Toolbar / Tree / UnorderedList / SideNavigation

---

## キーボード操作

| 操作 | 挙動 |
|-----|------|
| Search フォーカス中に `↓` | リスト先頭アイテムにフォーカス移動 |
| リスト中に `↓` / `↑` | 次 / 前のアイテムに移動 |
| リスト先頭で `↑` | Search フィールドに戻る |
| `Tab` | ポップオーバー内をフォーカストラップ（最後→先頭、先頭→最後 でループ） |
