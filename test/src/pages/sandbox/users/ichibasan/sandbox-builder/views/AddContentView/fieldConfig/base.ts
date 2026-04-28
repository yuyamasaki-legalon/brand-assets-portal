// ---------------------------------------------------------------------------
// [仕様] textfield / textarea はダミー文言を defaultValue に設定する
//
// コンポーネントのレンダリングでフォールバックとして使っているダミー文言は
// 対応する textfield / textarea の defaultValue に必ず設定すること。
//
// 理由:
//   controlValue = itemProps[field.key] ?? field.defaultValue
//   defaultValue を省略すると入力フィールドが空欄で表示され、
//   ユーザーが「何を編集すればよいか」わかりにくくなる。
//
// ルール:
//   - textfield / textarea でテキスト編集を提供する場合、ComponentRenderer の
//     フォールバック文字列（例: itemProps?.text ?? "const x = 42;"）と
//     同じ値を defaultValue に設定する。
//   - multiValue: true の textarea はカンマ区切りで全アイテム分を入力済みにする
//     （例: "Label 1,Label 1,Label 1"）。
// ---------------------------------------------------------------------------
// [仕様] サブポップオーバー表示中は親ポップオーバーを操作不可にする
//
// type: "button" + subComponent を持つフィールドをクリックするとサブポップオーバーが開く。
// このとき親ポップオーバー（1つ目のポップオーバー）はインタラクティブでなくなるようにする。
//
// 理由:
//   サブポップオーバーが開いている状態で親側を操作すると、
//   編集中の状態が競合し意図しない変更が起こりうるため。
//
// 実装責務:
//   Popover UI コンポーネント側（FieldPopover 等）で、サブポップオーバーが
//   open のときに親の入力要素を pointer-events: none または disabled にする。
// ---------------------------------------------------------------------------
// [仕様] select / combobox / icon-combobox は defaultValue 必須
//
// Popover の Select / Combobox は
//   controlValue = itemProps[field.key] ?? field.defaultValue
// の値を表示する。defaultValue を省略すると itemProps に値が保存されるまで
// "Select" プレースホルダーのみが表示され、何も選択されていない見た目になる。
//
// ルール:
//   - select / combobox / icon-combobox のフィールドは必ず defaultValue を
//     options のいずれかの値（または妥当なデフォルト）に設定すること。
//   - 仕様定義に書き忘れた場合は「デフォルトの選択済みは何にするか？」を確認する。
// ---------------------------------------------------------------------------
type _FieldType =
  | "select"
  | "checkbox"
  | "icon"
  | "stepper"
  | "textfield"
  | "textarea"
  | "combobox"
  | "icon-combobox"
  | "button"
  | "datefield"
  | "timefield"
  | "typography-select"
  | "divider"
  /** DataTable 専用: コンテンツタブ内のカラム選択 SegmentedControl */
  | "col-segmenter"
  /** 複数選択フィールド。値はカンマ区切り文字列で保存される ("Item-1,Item-3") */
  | "tagpicker"
  /** DataTable 専用: カラム順序エディター（Draggable Popover で並び替え） */
  | "column-order-editor"
  /** Toolbar 専用: グループ選択 Tab.Group */
  | "toolbar-group-segmenter"
  /** Toolbar 専用: グループ内アイテム選択 Tab.Group */
  | "toolbar-item-segmenter"
  /** Toolbar 専用: 全グループ×アイテムをインラインで列挙するコンテンツエディター */
  | "toolbar-content-editor"
  /** Toolbar 専用: グループ別アイテム数ステッパーをインライン列挙（Properties タブ用） */
  | "toolbar-group-items-editor"
  /** NavList 専用: グループ別アイテム数ステッパーをインライン列挙（min=1） */
  | "navlist-group-items-editor"
  /** SideNavigation 専用: グループ別アイテム数ステッパーをインライン列挙（min=2） */
  | "sidenavigation-group-items-editor"
  /** SideNavigation 専用: グループ別ラベル textarea + icon-combobox をインライン列挙 */
  | "sidenavigation-group-content-editor";

type _SelectOrComboVariant =
  | { type: "select"; options?: string[]; defaultValue?: string }
  | { type: "combobox"; options?: string[]; defaultValue?: string }
  | { type: "icon-combobox"; defaultValue?: string };

type _OtherVariant = {
  type?: Exclude<_FieldType, "select" | "combobox" | "icon-combobox">;
  options?: string[];
  defaultValue?: string;
};

type _BaseFieldConfig = {
  key: string;
  label: string;
  /** "button" / "typography-select" タイプ時: クリックで開く編集ポップオーバーのサブコンポーネントキー */
  subComponent?: string;
  /**
   * "button" タイプ時: subComponent を props から動的に解決する。
   * 指定がある場合、静的な subComponent より優先される。
   * 例: inputType の値に応じて "Select" / "TextField" などを返す
   */
  subComponentGetter?: (props: Record<string, string>) => string | undefined;
  /**
   * "typography-select" タイプ時: Text サブポップオーバーで表示する textType の選択肢を絞り込む。
   * 例: ["title", "body"] → title / body のみ選択可能
   */
  allowedTextTypes?: string[];
  /** Properties / Content など、内側タブ名。指定があるフィールドが1つ以上あると内側タブが出現する */
  tab?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  /**
   * "stepper" タイプで最小値を動的に計算する場合に使用。
   * 指定がある場合、静的な min より優先される。
   * 例: btnItems の最小値を 2 - iconItems にする
   */
  minGetter?: (props: Record<string, string>) => number;
  /**
   * textfield / textarea で defaultValue を動的に計算する場合に使用。
   * 指定がある場合、静的な defaultValue より優先される。
   * props は colScoped の仮想 props ではなく itemProps 全体を受け取る。
   * 例: DataTable の colTitle で "Col 1", "Col 2" を列番号に応じて返す
   */
  defaultValueGetter?: (itemProps: Record<string, string>) => string;
  disabledWhen?: (props: Record<string, string>) => boolean;
  labelWhen?: (props: Record<string, string>) => string;
  visibleWhen?: (props: Record<string, string>) => boolean;
  /**
   * "button" タイプでアクションボタンとして使用する場合に指定。
   * subComponent が未設定の "button" フィールドで有効。
   * colScoped な props を受け取り、変更する props の diff を返す。
   * undefined 値はそのキーの削除を意味する。
   */
  onClick?: (props: Record<string, string>) => Record<string, string | undefined>;
  /**
   * select タイプで options を動的に生成する場合に使用。
   * 指定がある場合、静的な options より優先される。
   * string の場合は label/value 同値、オブジェクトの場合は label と value を個別に指定できる。
   * description を指定すると Select のオプションに説明文が表示される。
   */
  optionsGetter?: (
    props: Record<string, string>,
  ) => Array<string | { label: string; value: string; description?: string }>;
  /**
   * textarea でカンマ区切りの複数値入力を受け付けるフィールドに指定。
   * ComponentRenderer 側では parseMultiValues() を使って値を展開する。
   */
  multiValue?: boolean;
  /**
   * 親フィールドの子要素として視覚的にインデントして表示する。
   * ラベルは font-weight: 300 + color: subtle で描画される。
   */
  indent?: boolean;
  /**
   * indent: true と組み合わせて使用。
   * このキーが excludedSubKeys に含まれる場合、サブポップオーバー内でインデントを解除する。
   * 例: "fcTitle" → FormControl Title が除外されたコンテキスト（Form など）ではインデントしない
   */
  indentParentKey?: string;
  /**
   * "button" / "typography-select" タイプ時: サブポップオーバー内でこのキーを持つフィールドを非表示にする。
   * 例: ["size"] → サイズフィールドを非表示（Leading/Trailing IconButton のサイズ固定に使用）
   */
  excludedSubKeys?: string[];
  /**
   * "button" タイプ時: サブポップオーバーで表示するタブを絞り込む。
   * 例: "Properties" → Properties タブのフィールドのみ表示（テキスト置き換えなしの Style ボタン等に使用）
   * ※ "typography-select" は常に "Properties" のみ表示されるため不要。
   */
  onlyTab?: string;
  /**
   * true のとき、実際のキーをアクティブカラムに応じて `col{n}_{key}` に解決する。
   * DataTable の per-column フィールドで使用。
   * visibleWhen / disabledWhen / labelWhen のプロパティ参照も colScoped な仮想 props で評価される。
   */
  colScoped?: boolean;
  /**
   * true のとき、実際のキーをアクティブグループに応じて `group{n}_{key}` に解決する。
   * Toolbar の per-group フィールドで使用。
   */
  groupScoped?: boolean;
  /**
   * true のとき、実際のキーをアクティブグループ+アイテムに応じて `group{g}_item{i}_{key}` に解決する。
   * Toolbar の per-item フィールドで使用。
   */
  itemScoped?: boolean;
  /**
   * フィールドラベルの下に表示する補足テキスト。
   * caption.xSmall / color: subtle で描画される。
   */
  subtext?: string;
  /**
   * textarea コントロールの下に表示する補足キャプション（静的）。
   * エラーがある場合は errorGetter の結果が優先される。
   */
  caption?: string;
  /**
   * textarea のバリデーションエラーを動的に返す関数。
   * 文字列を返すとエラー状態 + エラーキャプションを表示。null/undefined はエラーなし。
   * props は colScoped の仮想 props（effectiveProps）を受け取る。
   */
  errorGetter?: (props: Record<string, string>) => string | null | undefined;
};

export type FieldConfig = _BaseFieldConfig & (_SelectOrComboVariant | _OtherVariant);

/**
 * カンマ区切りの文字列を分割し、count 件分の配列を返す。
 * 入力が足りない場合は fallback を補完し、超過分は無視する。
 *
 * @example
 * parseMultiValues("AAA,BBB", 3, "Item")
 * // => ["AAA", "BBB", "Item"]
 */
export const parseMultiValues = (raw: string | undefined, count: number, fallback = ""): string[] => {
  const parts = (raw ?? "").split(",").map((s) => s.trim());
  return Array.from({ length: count }, (_, i) => parts[i] || fallback);
};

// --- 共通プリセット ---

export const SIZE_S_M_L: FieldConfig = {
  key: "size",
  label: "Size",
  type: "select",
  options: ["large", "medium", "small"],
  defaultValue: "medium",
};

export const VARIANT_BUTTON: FieldConfig = {
  key: "variant",
  label: "Variant",
  type: "select",
  options: ["solid", "subtle", "plain", "gutterless"],
  defaultValue: "subtle",
};

export const VARIANT_ICON_BUTTON: FieldConfig = {
  key: "variant",
  label: "Variant",
  type: "select",
  options: ["solid", "subtle", "plain"],
  defaultValue: "subtle",
};

// ---------------------------------------------------------------------------
// [パターン] Edit {ComponentName} + Clear Row Override + Reset Row Overrides
//
// DataTable の per-row 個別編集 UI に共通して使う3点セット。
// 生成されるキー (prefix="tg" の場合):
//   tgEditTarget          — "Edit TagGroup" select (All Rows / Row-n)
//   _tgClearRowOverride   — Row-n モード + その行に個別設定あり → その行だけクリア
//   _tgResetRowOverrides  — All Rows モード + 任意の行に個別設定あり → 全行クリア
//
// 使い方:
//   ...makeEditTargetFields({
//     componentName: "TagGroup",
//     colContent: "TagGroup",
//     prefix: "tg",
//     rowOverrideKeys: (n) => [`tgTagLabels${n}`, `tgRow${n}Items`, ...],
//   }),
// ---------------------------------------------------------------------------
export const makeEditTargetFields = (opts: {
  /** ラベルに使う表示名 (例: "TagGroup") */
  componentName: string;
  /** visibleWhen で照合する colContent 値 (例: "TagGroup") */
  colContent: string;
  /** キープレフィックス (例: "tg" → tgEditTarget, _tgClearRowOverride, ...) */
  prefix: string;
  /** 行番号を受け取り、その行の override キー一覧を返す関数 */
  rowOverrideKeys: (rowNum: number) => string[];
}): FieldConfig[] => {
  const { componentName, colContent, prefix, rowOverrideKeys } = opts;
  const editTargetKey = `${prefix}EditTarget`;
  const hasRowOverride = (p: Record<string, string>, rowNum: number) =>
    rowOverrideKeys(rowNum).some((k) => p[k] !== undefined);

  return [
    {
      key: editTargetKey,
      label: `Edit ${componentName}`,
      type: "select",
      options: ["All Rows"],
      optionsGetter: (p) => [
        "All Rows",
        ...Array.from({ length: Math.min(Math.max(parseInt(p.rowItems ?? "10", 10), 2), 50) }, (_, i) => {
          const rowNum = i + 1;
          const label = `Row-${rowNum}`;
          return hasRowOverride(p, rowNum) ? { label, value: label, description: "Edited" } : label;
        }),
      ],
      defaultValue: "All Rows",
      colScoped: true,
      tab: "Content",
      visibleWhen: (p) => p.colContent === colContent,
    },
    {
      key: `_${prefix}ClearRowOverride`,
      label: "Clear Row Override",
      type: "button",
      colScoped: true,
      tab: "Content",
      visibleWhen: (p) => {
        const target = p[editTargetKey] ?? "All Rows";
        if (p.colContent !== colContent || target === "All Rows") return false;
        const n = parseInt(target.replace("Row-", ""), 10);
        return hasRowOverride(p, n);
      },
      onClick: (p) => {
        const n = parseInt((p[editTargetKey] ?? "").replace("Row-", ""), 10);
        if (!n) return {};
        const result: Record<string, string | undefined> = {};
        for (const k of rowOverrideKeys(n)) {
          result[k] = undefined;
        }
        return result;
      },
    },
    {
      key: `_${prefix}ResetRowOverrides`,
      label: "Reset Row Overrides",
      type: "button",
      colScoped: true,
      tab: "Content",
      visibleWhen: (p) => {
        if (p.colContent !== colContent || (p[editTargetKey] ?? "All Rows") !== "All Rows") return false;
        for (let r = 1; r <= 50; r++) {
          if (hasRowOverride(p, r)) return true;
        }
        return false;
      },
      onClick: (_p) => {
        const result: Record<string, string | undefined> = {};
        for (let r = 1; r <= 50; r++) {
          for (const k of rowOverrideKeys(r)) {
            result[k] = undefined;
          }
        }
        return result;
      },
    },
  ];
};
