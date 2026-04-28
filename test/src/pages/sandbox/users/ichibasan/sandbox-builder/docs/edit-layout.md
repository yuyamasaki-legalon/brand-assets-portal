# Edit Layout

各レイアウトエリアのサイズ・スタイルを調整する機能。

---

## 起動方法

ツールバーの `Edit layout`（定規アイコン）ボタンを押すと Edit layout モードになる。
各エリアに Placeholder オーバーレイが表示され、2つのボタンが現れる。

| ボタン | アイコン | 機能 |
|-------|---------|------|
| 定規 | `LfRulerMeasure` | Sizing タブを開く |
| ペイント | `LfPaintRoller` | Selected styling タブを開く |

---

## エリアのドロワー設定（Layout Drawer）

ツールバー左端のレイアウトアイコンをクリックすると `Drawer` が開き、各エリアの表示 ON/OFF を一括管理できる。

| セクション | 設定内容 |
|-----------|---------|
| Sidebar / Outside Layout | Start / End の有効化、Header / Footer の有効化、Icon Sidebar モード |
| PageLayout | Global Header / Global Footer の有効化 |
| Content | Content Header / Content Footer の有効化 |
| Pane | Start / End の有効化、それぞれの Header / Footer の有効化 |
| Sidebar / Inside Layout | Inner Sidebar Start / End の有効化 |

親エリア（Start / End）が OFF のとき、その子（Header / Footer）の Checkbox は disabled になる。

---

## SizingAndStyling ポップオーバー

各エリアのオーバーレイボタンから開くポップオーバー。3タブ構成。

### タブ順

```
Sizing | Selected styling | All styling
```

### Sizing タブ

エリアの種類によって表示されるフィールドが異なる。

#### Content エリア

| フィールド | 選択肢 |
|-----------|-------|
| Content width | None / 560px〜1680px（aegis layout token） |
| Align | Left / Center / Right |
| Inner wrapper width | ON/OFF + 幅選択（Content width より小さい値のみ候補に出る） |
| Inner wrapper scope | Body only / All content |
| Inner wrapper Align | Left / Center / Right（Inner wrapper width ON 時のみ表示） |

**制約:** Content width が Pane width より小さい値は候補に出ない（Pane Width > Content width）。

#### Pane エリア

| フィールド | 選択肢 |
|-----------|-------|
| Pane width | 240px / 320px / 400px / 480px / 560px |
| Max width | Pane width 以上の値のみ候補に出る |
| Resizable | ON/OFF |
| Sticky header | ON/OFF（Pane Header がある場合のみ） |

#### Sidebar エリア

| フィールド | 選択肢 |
|-----------|-------|
| Sidebar width | 240px / 320px / 400px / 480px / 560px / 640px |
| Icon Sidebar | ON/OFF（Sidebar Start のみ） |

---

### Selected styling タブ

クリックしたエリアに対応するスタイル設定だけを表示する。

| エリア | 表示フィールド |
|-------|--------------|
| globalHeader | Header（Plain / Subtle）+ Border |
| globalFooter | Footer（Plain / Subtle）+ Border |
| outerSidebarStart 系 | Sidebar Start（Plain / Subtle）+ Border Header / Footer |
| outerSidebarEnd 系 | Sidebar End（Plain / Subtle）+ Border Header / Footer |
| contentHeader / Body / Footer | Content（Plain / Outline / Fill）+ Border Header / Footer |
| paneStart 系 | Pane Start（Plain / Outline / Fill）+ Border Header / Footer |
| paneEnd 系 | Pane End（Plain / Outline / Fill）+ Border Header / Footer |
| innerSidebar 系 | Sidebar Start / End（Plain / Subtle） |

Border フィールドは style が `plain` のとき非表示になる。

---

### All styling タブ

全エリアのスタイルを一覧で一括編集できる。

| フィールド | 対象 | 選択肢 |
|-----------|-----|-------|
| Show Background | 全エリア一括 | ON/OFF |
| PageLayout | PageLayout 全体 | Plain / Outline / Fill |
| Header | Global Header | Plain / Subtle |
| Footer | Global Footer | Plain / Subtle |
| Sidebar Start | Outer Sidebar Start | Plain / Subtle |
| Sidebar End | Outer Sidebar End | Plain / Subtle |
| Content | Content エリア | Plain / Outline / Fill |
| Pane Start | Pane Start | Plain / Outline / Fill |
| Pane End | Pane End | Plain / Outline / Fill |

**Show Background** は Selected / All どちらのタブで変更しても同じ `globalStyling.dummyBg` を更新する（全エリアの背景表示を一括で切り替え）。

---

## エリアの削除

各エリアオーバーレイにはゴミ箱ボタンがあり、押すとそのエリアを非表示にする。

| エリア | 削除時に非表示になるキー |
|-------|----------------------|
| globalHeader | `globalHeader` |
| outerSidebarStartBody | `outerSidebarStart` + Header + Footer |
| outerSidebarStartHeader | `outerSidebarStartHeader` のみ |
| paneStartBody | `paneStart` + Header + Footer |
| paneStartHeader | `paneStartHeader` のみ |
| （各 Footer も同様） | Footer キーのみ |

---

## コンパクト表示（Icon Sidebar）

Icon Sidebar モードが ON のとき、Sidebar Start の Header / Footer は幅が狭いため省略記号ボタン（`LfEllipsisDot`）にコンパクト表示される。

メニューに以下のアクションが表示される:
- Header を表示 / 非表示（`LfEye` / `LfEyeSlash`）
- Footer を表示 / 非表示
- Divider
- Delete Sidebar（Sidebar ごと削除）
