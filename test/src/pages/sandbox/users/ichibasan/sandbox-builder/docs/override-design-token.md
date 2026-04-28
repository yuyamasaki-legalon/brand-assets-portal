# Token Editor

Aegis のセマンティックトークン（`--aegis-color-background-*` 等）が参照するパレットスロットを変更する機能。
Lightness（明度ベース）の調整を担当する。

> **旧称: Override Design Token**。UI 上のラベルおよびダイアログタイトルは「Token Editor」に変更済み。

---

## テーマカスタマイズとの棲み分け

| 機能 | 担当領域 | 操作対象 |
|------|---------|---------|
| Customize theme | **Hue（色相・彩度）** | パレットスロットの実際の色値を OKLCH で生成 |
| Token Editor | **Lightness（明度ベース）** | セマンティックトークンがどのパレットスロットを参照するかを変更 |

### 合成の仕組み

2つの機能はレイヤーとして独立に合成される。

```
Aegis デフォルト
  └─ Override Design Token（どのパレットスロットを使うか）
      └─ Customize theme（そのスロットの色値を Hue で上書き）
```

---

## 起動方法

Customize theme モード中（ツールバーに Done ボタンが表示されている状態）にのみ、
ツールバーの `Token Editor`（ペイントアイコン）ボタンが表示される。

ボタンを押すとダイアログが開く。

---

## ダイアログの構成

### タブ

| タブ | 内容 |
|-----|------|
| background | `--aegis-color-background-*` トークン一覧（global override） |
| foreground | `--aegis-color-foreground-*` トークン一覧（global override） |
| border | `--aegis-color-border-*` トークン一覧（global override） |
| Token map | コンポーネント別トークン一覧と、コンポーネントスコープ override の操作 UI |
| Override Design Token | 変更済みトークンの CSS 出力（カテゴリ・コンポーネント別テキストエリア） |

> **Contrast Check は別 Dialog に分離済み**。CommandBar（グローバルツールバー右から2番目）および テーマ編集モードの ModeBar から起動する。詳細は `contrast-check.md` を参照。

---

## テーブル列（background / foreground / border タブ）

| 列 | 内容 |
|----|------|
| Token name | セマンティックトークンの suffix（例: `default`, `inverse-subtle`）。TextField で編集可（リネーム） |
| Value | 現在参照しているパレットスロット。Combobox で変更可能 |
| In use | そのトークンを使用している Aegis コンポーネント名（Tag 一覧） |

Search フィールドでトークン名・値・コンポーネント名を絞り込みできる。

---

## token name のリネーム

既存トークンの Token name 列（TextField）を編集すると、表示名が変わる。

- **プレビューへの影響なし**: リネームはドキュメント目的のみ。ブラウザに注入される CSS には影響しない
- **Export CSS への反映**: Token Editor の `Override Design Token` タブの CSS 出力に rename コメントが追記される

```css
/* renamed: --aegis-color-background-default → --aegis-color-background-page */
```

---

## Add New Token

Search フィールドの右にある `Add New Token` ボタンを押すと、テーブル末尾に新規行が追加される。

| 操作 | 内容 |
|-----|------|
| Token name 列 | 新しいトークン名を入力（空欄の場合は CSS に出力されない） |
| Value 列 | Combobox でパレットスロットを選択 |
| 削除ボタン（ゴミ箱アイコン） | その行を削除 |

### CSS 出力

Token name と Value の両方が入力されている行のみ、Token Editor の `Override Design Token` タブに出力される。

```css
--aegis-color-background-page: var(--aegis-internal-color-palette-scale-neutral-900); /* new token */
```

末尾に `/* new token */` コメントが付与される。

### 新規トークンの永続化

追加した新規トークンは `localStorage` に自動保存される。

- キー: `sandbox-builder:newTokens`
- ページリロード後も復元される

### 注意事項

- 新規トークンを追加しても global の CSS 注入には影響しない（Token map からコンポーネントスコープで適用するための準備）
- Token map タブの Combobox から新規トークンを選択してコンポーネントに適用できる

---

## value の参照形式

Combobox に表示される値はパレットトークンの参照形式で表記される。

```
scale.white.1000             → var(--aegis-palette-white-1000)
scale.white-transparent.200  → var(--aegis-palette-white-transparent-200)
scale.transparent            → var(--aegis-palette-transparent)
scale.neutral.800            → var(--aegis-palette-neutral-800)
```

---

## CSS 注入の仕組み

### Global override（background / foreground / border タブ）

変更があったトークンのみ `document.body.style.setProperty()` で注入し、さらに `DialogContent` の inline style にも同じ CSS 変数をマージする。

```css
/* body に直接 CSS カスタムプロパティとして適用 */
--aegis-color-background-default: var(--aegis-internal-color-palette-scale-neutral-800);
```

> **Token Editor ダイアログ自体にも反映される**。DialogContent の inline style に tokenOverrideStyle をマージしているため、ダイアログ内の Aegis コンポーネント（SegmentedControl 等）も変更後のトークンで描画される。

### Component-scoped override（Token map タブ）

`componentOverrides` に設定があるコンポーネントは `<style>` 要素で注入する。

```css
@scope (.aegis-Banner) to (.aegis-Button, .aegis-Tag, .aegis-Badge /*, ... */) {
  :scope {
    --aegis-color-background-danger-bold: var(--aegis-internal-color-palette-scale-red-transparent-800);
  }
}
```

- `@scope ... to (...)` により、Banner の子要素（Button 等）への CSS 変数継承を防ぐ
- `to` 句には Aegis の全コンポーネントクラス名（`.aegis-ComponentName`）を列挙
- Global override より後に挿入することで、正しい優先順位を保証する

---

## Token map タブ

### 目的

パレットリニューアルやトークン修正において:
1. **どのコンポーネントがどのトークンを使っているかを確認する**（discovery）
2. **特定コンポーネントだけにトークン override を適用する**（component-scoped override）

この 2 つを 1 つの UI で完結させる。

### 操作 UI

SegmentedControl (solid) でコンポーネントを選択:

```
[ All | Accordion | ActionList | Avatar | Badge | Banner | ... ]
```

選択コンポーネントのトークン一覧が Background / Foreground / Border のカテゴリ別に DataTable で表示される。

各カテゴリの DataTable は 3 列構成:

| 列 | 内容 |
|----|------|
| Token | トークン名の suffix（例: `danger-bold`）monospace 表示 |
| Default | background/foreground/border タブで設定している global 値（スウォッチ付き） |
| Override | **このコンポーネントだけに適用する値**を Combobox で設定（スウォッチ + リセットボタン付き） |

override が 1 件以上存在する場合、コンポーネントヘッダー右端に **「Reset overrides」ボタン**が表示される。クリックするとそのコンポーネントの全 override を一括削除できる。

### Component override の設定フロー

1. Token map タブで Banner を選択
2. `background-danger-bold` 行の Component override Combobox を開く
3. 新規作成した `scale.red-transparent.800`（または既存の palette ref）を選択
4. 即座にプロトタイプ上の Banner の背景色が変わる
5. Contrast Check（CommandBar / ModeBar から起動）で Banner を選択し、新しい値でのコントラスト比を確認
6. `Override Design Token` タブの CSS 出力で `.aegis-Banner { ... }` を確認してエンジニアに伝達

### ユースケース例

**「Banner の danger-bold background だけを opacity 付きのパレットに変えたい」**

```
① background タブで danger-bold-opaque を Add New Token
   → name: danger-bold-opaque / value: scale.red-transparent.800

② Token map → Banner を選択
   → background-danger-bold の Component override に danger-bold-opaque の値を設定

③ Contrast Check Dialog（CommandBar から起動）→ Banner タブでコントラスト比を確認

④ Token Editor の Override Design Token タブに以下が出力される:
   /* Banner */
   .aegis-Banner {
     --aegis-color-background-danger-bold: var(--aegis-internal-color-palette-scale-red-transparent-800);
   }
```

---

## Override Design Token タブ（CSS 出力）

変更済みトークンの CSS を確認・コピーするためのタブ。

### Global セクション

カテゴリ（background / foreground / border）ごとにテキストエリアが表示される。

```css
--aegis-color-background-default: var(--aegis-internal-color-palette-scale-neutral-800);
--aegis-color-background-danger-bold-opaque: var(...); /* new token */
/* renamed: --aegis-color-background-default → --aegis-color-background-page */
```

### Component セクション

Token map で設定した component-scoped override があるコンポーネントのみ表示される。

```css
/* Banner */
.aegis-Banner {
  --aegis-color-background-danger-bold: var(--aegis-internal-color-palette-scale-red-transparent-800);
}

/* Button */
.aegis-Button {
  --aegis-color-background-brand-bold: var(--aegis-internal-color-palette-scale-brand-600);
}
```

変更がないコンポーネントのセクションは表示されない。

---

## Download code への出力

Generated Files ダイアログの「Override Design Token」タブに、Token Editor で変更があったトークンのみ出力される。
