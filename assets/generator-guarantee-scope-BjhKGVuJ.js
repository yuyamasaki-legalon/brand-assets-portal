var e=`# buildComponentJsxText.ts — Generator 保証範囲（確定版）

> **このドキュメントは何か**: \`buildComponentJsxText.ts\`（Add content → JSX コード生成）の**正本**。全 68 component が何を反映し、何を反映しないかを定義する。  
> **完了状態**: Add content で設定した値が generator に黙って無視されるケースは解消済み。P1 残件 0 件。  
> **残件レベル**: P2（ComponentRenderer 制約 / edge case）2 件・P3（入力 UI が存在しないため対応余地なし）7 件のみ。

> **確定日**: 2026-04-25  
> **最終更新**: 2026-04-27（v17: TagInput withinFormControl=false / fcCaption / fcGroup・Form per-item fcCaption / fcGroup・Tree children scaffold / FALLBACK_LABEL 整合 → v18: DataTable per-row rich override 全 6 types 実装（buildPerRowBlocks ヘルパー導入・index ブランチ方式））  
> **対象ファイル**: \`buildComponentJsxText.ts\` / \`buildPageLayoutJsxText.ts\`  
> **変更履歴**: \`docs/normalization-plan.md\` を参照

---

## テスト結果

### sandbox-builder スイート（このドキュメントの対象）

| ファイル | テスト数 | 内容 |
|---|---|---|
| \`buildComponentJsxText.test.ts\` | 807 | correctness + matrix smoke tests（19 × 28） |
| \`buildPageLayoutJsxText.test.ts\` | 19 | layout generator 動作確認 |
| \`buildComponentJsxText.exhaustive.test.ts\` | 728 | 全 68 component correctness + Cat-4 import + cross-prop + Cat-2 + Cat-4 conditional + Storybook 改善テスト群 + DataTable per-row override |
| **sandbox-builder 小計** | **1,554** | — |

### プロジェクト全体

| 対象 | テスト数 |
|---|---|
| sandbox-builder スイート（上記 3 ファイル） | 1,554 |
| その他（eslint rules / visual-editor / components 等） | 1,043 |
| **プロジェクト合計** | **2,597 tests passed** |

ビルド: \`pnpm build\` clean（TypeScript エラーなし）

---

## Tier 定義

| Tier | 定義 | 件数 |
|---|---|---|
| **T1 Full JSX** | \`fieldConfig\` の主要入力（件数・ラベル・variant/color/size 等）は JSX 出力に反映される。Add content に入力 UI がない props（per-item 個別設定・options 配列・初期値など）および構造的な scaffold 上限は T1 の保証対象外とする | **64** |
| **T2 Scaffold** | 出力構造自体が scaffold パターン。正しい Aegis API 構造は保つが、コンテンツ値は hardcoded または inside comment で手動対応を案内する | **3** |
| **T3 Rich Comment** | JSX タグは出力しない。手動実装の手引きコメントのみを出力する。「何も出さない」はしない | **1** |

---

## 全 68 component 一覧

### T1 Full JSX（64 件）

| Component | 主要反映 props | T1 対象外（P2/P3） |
|---|---|---|
| Button | variant / color / size / loading / leading / trailing / label / minWidth | — |
| IconButton | icon / variant / color / size / loading | aria-label は "Action" 固定 |
| Text | textType / size / font / weight / inputType | — |
| Banner | color / title / action / withActionLabel / closeButton / text | — |
| Tag | color / variant / size / label | — |
| StatusLabel | color / variant / size / label | — |
| Link | label / url / external | — |
| Switch | size / color / labelPosition / label | — |
| Checkbox | noLabel / label | — |
| CheckboxCard | size / variant / color / label | — |
| CheckboxGroup | items count / text labels | — |
| RadioCard | size / variant / label | — |
| RadioGroup | items count / text labels | — |
| TextField | fcLabel / placeholder / size | — |
| Textarea | fcLabel / placeholder / minRows | — |
| FormControl | fcLabel / placeholder / required / fcCaptionText | — |
| Search | size / placeholder | — |
| Select | fcLabel / size / variant / clearable / menuItems（動的 options 生成） | placeholder は Aegis API 非対応のため未反映 |
| Combobox | fcLabel / size / creatable / menuItems（動的 options 生成） | placeholder は Aegis API 非対応のため未反映 |
| Avatar | text（name）/ size / color | — |
| AvatarGroup | items count / size | avatar 名は自動生成（AB/CD…）（P3: 入力 UI なし） |
| Mark | markText / color | — |
| Divider | （props なし） | — |
| DividerVertical | （props なし） | — |
| Blockquote | text | — |
| Breadcrumb | items count / label | — |
| ButtonGroup | btnItems count / size / attached / attachedColor→variant / iconItems / btn\${n}_label / btn\${n}_variant / btn\${n}_color / btn\${n}_loading / btn\${n}_leading + leadingIcon + leadingType（Icon/Badge）/ btn\${n}_trailing + trailingIcon + trailingType（Icon/Badge）/ leadingBadge + leadingBadgeColor + leadingBadgeCount / icon\${n}_icon / icon\${n}_variant / icon\${n}_color / icon\${n}_loading | btn\${n}_minWidth（P2: ComponentRenderer 側が未対応）|
| Calendar | （props なし → self-closing が完全な出力） | — |
| RangeCalendar | （props なし → self-closing が完全な出力） | — |
| DateField | fcLabel | 初期日付値（P3: 入力 UI なし） |
| DatePicker | fcLabel | 初期日付値（P3: 入力 UI なし） |
| RangeDateField | fcLabel | 初期日付値（P3: 入力 UI なし） |
| RangeDatePicker | fcLabel | 初期日付値（P3: 入力 UI なし） |
| TimeField | fcLabel | 初期時刻値（P3: 入力 UI なし） |
| TimePicker | fcLabel | 初期時刻値（P3: 入力 UI なし） |
| RangeTimeField | fcLabel | 初期時刻値（P3: 入力 UI なし） |
| RangeTimePicker | fcLabel | 初期時刻値（P3: 入力 UI なし） |
| TagInput | fcLabel / size / variant / shrinkOnBlur / addCaption / defaultTags / maxSelection / leading（leadingType=text: 文字列 prop / icon: Icon node）/ trailing（Icon node）/ withToolbar + withGhostToolbar + toolbarItems + btnLabel 群 / withinFormControl=false（FormControl なし直接出力）/ fcCaption + fcCaptionText（FormControl.Caption）/ fcGroup + fcGroupInputType（FormControl.Group + 第2入力）| — |
| TagPicker | fcLabel / options | — |
| Badge | color | count は "3" 固定（P3: 入力 UI なし） |
| SegmentedControl | items count / label | — |
| Tabs | items count / label | — |
| TagGroup | tgItems count / tagLabels | — |
| OrderedList | items（カンマ区切りテキスト） | — |
| UnorderedList | items（カンマ区切りテキスト） | — |
| NavList | itemTexts | — |
| DescriptionList | items count / term / detail | — |
| EmptyState | titleText / size | — |
| FileDrop | text / multiple | — |
| Code | text | — |
| CodeBlock | text | — |
| Pagination | items（total） | — |
| Timeline | items count / tagLabels | — |
| Stepper | items count / label / orientation / size | — |
| Accordion | items count / label / content | — |
| ActionList | items count / listLabel | — |
| ContentHeader | titleText / size / descTop / descBottom / trailing | — |
| Card | size / header / body / footer / headerText / bodyText | — |
| DataTable | colItems / rowItems / col\${n}_colTitle per-column / col\${n}_colContent dispatch（15 types: Text/Link/Tag/TagGroup/StatusLabel/Button/IconButton/ButtonGroup/AvatarGroup/TextField/Select/Combobox/TagPicker/TagInput/DatePicker）/ col\${n}_text\\|tagLabel\\|buttonLabel\\|linkLabel\\|statusLabelLabel → rows 反映 / **All Rows 設定**: Button（variant/color/loading/size/leading/trailing）/ IconButton（icon/variant/color/loading/size）/ Tag（variant/color/size）/ StatusLabel（variant/color/size）/ ButtonGroup（bgBtnItems/bgIconItems/bgSize/bgBtn\${n}_variant/color/label/leading/trailing/bgIcon\${n}_icon/variant/color/loading）/ **Per-row override（index ブランチ）**: Tag（tagRow\${n}Label / tagRow\${n}Content_variant/color）/ StatusLabel（slRow\${n}Label / slRow\${n}Content_variant/color）/ IconButton（ibRow\${n}Content_icon/variant/color/loading）/ Button（btnRow\${n}Label / btnRow\${n}Content_variant/color/loading/leading/trailing）/ TagGroup（tgTagLabels\${n} / tgRow\${n}Items / tgRow\${n}TagColor\${m}）/ ButtonGroup（bgRow\${n}BtnItems/IconItems / bgRow\${n}Btn\${m}_* / bgRow\${n}Icon\${m}_*）| getRowId は col1 固定（P3） |
| SideNavigation | labels / titles（Plan B）/ withGroup=true: groups count / group\${gi}_items / group\${gi}_labels / group\${gi}_icon\${ii} per-item | グループタイトルは "Group N" 固定（editor に保存領域なし）|
| Toolbar | groups count / orientation / group\${gi}_items / group\${gi}_item\${ii}_type dispatch（Button: label/variant/"Weight(gutterless)"→"gutterless"/color/size/loading/leading+leadingIcon/trailing+trailingIcon / IconButton: icon/variant/color/size/loading + Tooltip wrap）/ ToolbarSeparator（groups > 1）| leading・trailing の Badge slot（P2: 条件分岐複雑） |
| Form | items count (max=20) / itemEdit\${n}_fcLabel / inputType\${n} per-field dispatch / fcOrientation / labelWidth（horizontal 時）/ with-group layout（FormGroup + flex-1 div）/ nested layout（FormGroup sub={[...]} + nestedItems\${n} / nestedInputType\${n}_\${m} / nestedItemEdit\${n}_\${m}_fcLabel / _required / _withToolbar）/ required / withToolbar（全 layout 共通）/ **itemEdit\${n}_fcCaption + _fcCaptionText（FormControl.Caption）**/ **itemEdit\${n}_fcGroup + _fcGroupInputType（FormControl.Group + 第2入力）** | — |
| InformationCard | （fieldConfig なし → scaffold が完全な出力） | — |
| InformationCardGroup | （fieldConfig なし → scaffold が完全な出力） | — |

### T2 Scaffold（3 件）

| Component | scaffold の内容 | inside comment の案内 |
|---|---|---|
| Radio | RadioGroup scaffold に変換（単体 Radio は Aegis 非推奨） | ラベルと value を実際の選択肢に合わせて変更 |
| Skeleton | \`<Skeleton width={200} height={20} />\`（固定値） | コンテンツサイズに合わせて width/height を手動調整 |
| Tree | label textarea から階層構造を解析（インデント 2 スペース = depth 1）。getItemName / getItemChildren をインライン object で出力。selection / selectionType / propagateSelection / reorderable / defaultExpandedItems を反映。**children=true のとき scaffold comment（\`// children={(id) => (...) }\`）を出力**。フォールバックを TREE_LABEL_DEFAULT に統一 | — |

### T3 Rich Comment（1 件）

> **T3 の意味**: Add content の選択肢に「Table」は存在するが、Aegis には \`<DataTable>\` があるため \`<Table>\` 単体での利用は実用対象外。JSX タグを出力する代わりに、使い方の手引きコメントのみを出力する。

| Component | コメント内容 |
|---|---|
| Table | \`<DataTable>\` への移行を案内するコメント + HTML テーブルの手動実装ガイドを出力。\`<Table>\` JSX タグは**意図的に出力しない**（Add content で選んだ場合もコメントのみ） |

---

## 残件分類（P1/P2/P3）

### P1（直すべきもの）— 0 件

なし。

### P2（scaffold / inside comment で許容）— 2 件

Add content に入力 UI は存在するが、詳細 props が generator に届かない、または構造的な scaffold 上限に達しているケース。

| # | Component | 残っているギャップ | 許容根拠 |
|---|---|---|---|
| 1 | ButtonGroup | btn\${n}_minWidth 未反映 | ComponentRenderer の ButtonGroup case が minWidth を処理しないため、生成 JSX がプレビューと乖離する |
| 2 | Toolbar | Button/IconButton の leading・trailing Badge slot 未反映 | 条件分岐が複雑で edge case。Icon slot は反映済み |

### P3（Add content に入力 UI なし、またはデータモデル制約 → 固定値で OK）— 7 件

fieldConfig 側を変更しない限り、または根本のデータモデルを変えない限り generator 側に対応の余地がない。出力は意図通り。

| # | Component / 項目 | 固定値・制約の内容 |
|---|---|---|
| 1 | Calendar / RangeCalendar | \`<Calendar />\` / \`<RangeCalendar />\`（設定 props なし） |
| 2 | Date/Time 8 件 | 初期値（date/time value）は出力しない |
| 3 | AvatarGroup | avatar 名は AB/CD/EF… の自動生成 |
| 4 | Badge | count は "3" 固定 |
| 5 | DataTable: \`getRowId\` | \`row.col1\` 固定（per-row 選択肢として入力 UI なし） |
| 6 | Table | rich comment のみ（\`<Table>\` JSX を出力しない — T3 参照） |
| 7 | DataTable: All Rows TagGroup | \`{value}\` 単一タグのまま。\`getValue\` が単一文字列しか返せない（\`String(row.col)\` ）ためデータモデルレベルの制約。per-row TagGroup（v18 実装済み）は複数タグを展開できるが All Rows パスは非対応 |

---

## Representative Matrix（smoke test）

| 次元 | 件数 | 内容 |
|---|---|---|
| \`AREA_LAYOUT_PAIRS\` | **19** | 下記参照 |
| \`COMPONENT_SAMPLES\` | **28** | Tier 別代表 component（T1 flat / T2 scaffold / T3 rich comment を含む） |
| smoke tests | **532**（19 × 28） | 各組み合わせで \`buildPageLayoutJsxText\` がクラッシュしないことを確認 |

### AREA_LAYOUT_PAIRS 一覧（19 件）

| # | area | 必要な layout keys |
|---|---|---|
| 1 | contentBody | （なし） |
| 2 | globalHeader | \`globalHeader: true\` |
| 3 | globalFooter | \`globalFooter: true\` |
| 4 | contentHeader | \`contentHeader: true\` |
| 5 | contentFooter | \`contentFooter: true\` |
| 6 | paneStartBody | \`paneStart: true\` |
| 7 | paneEndBody | \`paneEnd: true\` |
| 8 | outerSidebarStartBody | \`outerSidebarStart: true\` |
| 9 | outerSidebarEndBody | \`outerSidebarEnd: true\` |
| 10 | innerSidebarStart | \`innerSidebarStart: true\` |
| 11 | innerSidebarEnd | \`innerSidebarEnd: true\` |
| 12 | paneStartHeader | \`paneStart: true, paneStartHeader: true\` |
| 13 | paneStartFooter | \`paneStart: true, paneStartFooter: true\` |
| 14 | paneEndHeader | \`paneEnd: true, paneEndHeader: true\` |
| 15 | paneEndFooter | \`paneEnd: true, paneEndFooter: true\` |
| 16 | outerSidebarStartHeader | \`outerSidebarStart: true, outerSidebarStartHeader: true\` |
| 17 | outerSidebarStartFooter | \`outerSidebarStart: true, outerSidebarStartFooter: true\` |
| 18 | outerSidebarEndHeader | \`outerSidebarEnd: true, outerSidebarEndHeader: true\` |
| 19 | outerSidebarEndFooter | \`outerSidebarEnd: true, outerSidebarEndFooter: true\` |

matrix は「全直積ではなく代表縮約」。クラッシュしないこと・\`={undefined}\` / \`NaN\` が出ないことを保証。

---

## 「完全一致ではないが責任ある出力」の考え方

P2 の scaffold ギャップが残っているコンポーネントも含め、generator が出す JSX は:

1. **コンパイル可能** — 生成コードをそのままエディタに貼り付けてビルドが通る
2. **Aegis API 準拠** — deprecated compound / 存在しない prop を使わない
3. **fieldConfig 主要入力が反映** — ユーザーが設定したラベル・件数・variant/color/size は出力に現れる
4. **黙って誤った値を返さない** — 入力が届かない props は固定値か scaffold（inside comment で手動対応を案内）

「Add content で設定した値が generator に黙って無視される」状態（今セッション前の key mismatch 群）はすべて解消した。

---

## テスト基盤の現状（Step 1〜3 完了時点）

### Step 1: Component correctness exhaustive テスト

\`buildComponentJsxText.exhaustive.test.ts\` で全 68 component を網羅:

- **Cat-1（prop 反映確認）**: 各 builder が読む key・sp threshold・pb key を orthogonal に検証
- **Cat-4（import completeness）**: \`collectComponentImports()\` の戻り値で各コンポーネントの import が過不足なく揃うことを確認

### Step 2: Layout safety matrix 拡張

\`AREA_LAYOUT_PAIRS\` を 11 → 19 に拡張。全 ContentArea（body/header/footer × pane/sidebar）を網羅:

- 追加 8 エリア: paneStartHeader/Footer / paneEndHeader/Footer / outerSidebarStart|EndHeader/Footer
- 各エリアは「最小限の layout preset（親 pane/sidebar + header/footer の両方有効）」でテスト

### Step 3: cross-prop / Cat-2 / Cat-4 conditional 追加

**A: cross-prop interactions（高優先 6 件）**

| # | 内容 |
|---|---|
| H1 | Text: \`inputType="Multi-line"\` のとき \`as="p"\` が出る（\`textType="title"\` では \`as="h2"\` が優先） |
| H2 | Text: \`text=""\` のとき \`textArea\` にフォールバック → 両方空なら \`"Text content"\` |
| H3 | Card: \`header=true\` + \`body\` 未指定 → \`CardBody\` が出ない（\`hasBody \\|\\| !hasHeader\` の仕様） |
| H4 | Button: trailing slot の Badge + count パス（leading 側の対称テスト） |
| H5 | ContentHeader: \`trailingContent\` が \`ButtonGroup\`/\`Button\` 以外 → else 分岐（IconButton + LfPlusLarge） |
| H6 | ContentHeader: \`descriptionTop\` + \`descriptionBottom\` 同時 → 両方出力・順序が descTop→Title→descBottom |

**Cat-2: deprecated / non-existent API negative assertions（7 コンポーネント + 共通）**

- \`Timeline.Title\` / \`Toolbar.Group\` / \`Select.Option\` / \`TagPicker.Option\` / \`NavList.Link\` / \`Stepper.Step\` / \`Accordion.Header\` が出力に含まれないことを確認
- 代表 7 コンポーネントで \`={undefined}\` が出ないことを確認
- count 系 5 コンポーネントで \`NaN\` が出ないことを確認

**Cat-4: conditional import completeness（3 コンポーネント）**

| Component | 条件 |
|---|---|
| Banner | \`action=true\` → Button import / \`withActionLabel=true\` → Link import / どちらも false → 追加 import なし |
| ContentHeader | trailing 3 分岐（ButtonGroup / Button / else=IconButton）ごとの import 確認 + description 有無で ContentHeaderDescription import |
| Card | \`header=true\` → CardHeader / \`footer=true\` → CardFooter / どちらも false → 追加 import なし |

---

## 現在の到達点

- P1 残件: 0 件
- P2 残件: 2 件（ButtonGroup minWidth / Toolbar Badge slot）
- P3 残件: 7 件（Add content 入力 UI が存在しない、またはデータモデル制約により generator 側での対応余地なし）
- **T1: 64 件 / T2: 3 件 / T3: 1 件**
- **2597 tests passed**（build clean）
- **19 × 28 = 532 smoke tests**（クラッシュなし）
- **全 68 component の exhaustive correctness tests 完了**
- **cross-prop interactions / Cat-2 / Cat-4 conditional import まで担保済み**
- **穴埋めフェーズ完了**: TagInput（withinFormControl=false / fcCaption / fcGroup）・Form（per-item fcCaption / fcGroup）・Tree（children scaffold / FALLBACK_LABEL）・ButtonGroup（leading/trailing Badge）の出力品質を向上
- **DataTable per-row rich override 完了**（v18）: Tag / StatusLabel / IconButton / Button / TagGroup / ButtonGroup の全 6 types に \`buildPerRowBlocks\` ヘルパーを用いた index ブランチ方式を実装。22 テスト追加

\`buildComponentJsxText.ts\` の責任範囲内で対応できる修正はすべて完了している。
`;export{e as default};