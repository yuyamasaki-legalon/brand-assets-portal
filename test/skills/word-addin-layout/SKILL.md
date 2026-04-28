---
name: word-addin-layout
description: "Word Add-in タスクペイン向けレイアウトで sandbox ページを作成。WHEN: Word アドイン・タスクペイン UI を作る指示があるとき。NOT WHEN: 通常の Web ページレイアウト。前提: word-addin-standalone テンプレートが存在すること。"
---

# Word Add-in レイアウトでページを作成

`src/pages/template/loc/word-addin-standalone/` をベースに、Word タスクペイン向けの sandbox ページを作成する。

## 使用方法

```bash
/word-addin-layout
```

引数は不要。対話形式でページ名とビュー構成を確認する。

---

## テンプレート参照

**必ず以下を読み取ってから作業すること:**

```
src/pages/template/loc/word-addin-standalone/index.tsx
src/pages/template/loc/word-addin/mock/data.ts
```

---

## レイアウトの特徴

Word Add-in タスクペインは通常のページと異なる制約がある:

| 項目 | 値 |
|------|-----|
| 幅 | 300〜600px（通常の画面より狭い） |
| min-inline-size | `300px` に上書き（Aegis デフォルトは 960px） |
| レイアウト構造 | Pane なし。PageLayout > PageLayoutContent のみ |
| ナビゲーション | Drawer ベースのメニュー |

---

## 実行手順

### Step 1: 要件確認

ユーザーに以下を確認:

- **ページ名**: sandbox ページのディレクトリ名
- **ビュー一覧**: タスクペインに表示するビュー（例: レビュー、設定、検索）
- **メニュー項目**: Drawer メニューに表示する項目

### Step 2: テンプレート読み取り

以下を読み取り、レイアウト構造を理解する:

```
src/pages/template/loc/word-addin-standalone/index.tsx
```

### Step 3: ページ生成

`pnpm sandbox:create` または手動で sandbox ページを作成し、以下の構造で実装する。

**出力先:**

```
src/pages/sandbox/{page-name}/index.tsx
```

### Step 4: ルート登録

`src/pages/sandbox/routes.tsx` にルートを追加。

---

## コード構造

```tsx
import { /* Aegis コンポーネント */ } from "@legalforce/aegis-react";
import { /* アイコン */ } from "@legalforce/aegis-icons";
import { useEffect, useState } from "react";

type ViewType = "view1" | "view2";

const PageName = () => {
  // ① Aegis Provider の min-inline-size を上書き
  useEffect(() => {
    const prev = document.body.style.minInlineSize;
    document.body.style.minInlineSize = "300px";
    return () => {
      document.body.style.minInlineSize = prev;
    };
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>("view1");

  // ② ヘッダー: ContentHeader + メニューボタン + 閉じるボタン
  const renderHeader = () => (
    <ContentHeader
      size="medium"
      leading={
        <Tooltip title="メニュー">
          <IconButton aria-label="メニュー" variant="plain" onClick={() => setMenuOpen(true)}>
            <Icon><LfApps /></Icon>
          </IconButton>
        </Tooltip>
      }
      trailing={
        <Tooltip title="閉じる">
          <IconButton aria-label="閉じる" variant="plain">
            <Icon><LfCloseLarge /></Icon>
          </IconButton>
        </Tooltip>
      }
    >
      <ContentHeader.Title>タイトル</ContentHeader.Title>
    </ContentHeader>
  );

  return (
    // ③ PageLayout: Pane なし、Content のみ
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>{renderHeader()}</PageLayoutHeader>
        <PageLayoutBody>
          {/* ビュー切り替え */}
        </PageLayoutBody>
      </PageLayoutContent>

      {/* ④ Drawer: 左からスライドするメニュー */}
      <Drawer open={menuOpen} onOpenChange={setMenuOpen} position="start" width="medium">
        <Drawer.Header>
          <ContentHeader size="medium" leading={/* 閉じるボタン */}>
            <ContentHeader.Title>メニュー</ContentHeader.Title>
          </ContentHeader>
        </Drawer.Header>
        <Drawer.Body>
          {/* メニュー項目: ビュー切り替え + 外部リンク */}
        </Drawer.Body>
      </Drawer>
    </PageLayout>
  );
};

export default PageName;
```

---

## 必須パターン

### 1. min-inline-size 上書き

Aegis Provider はデフォルトで `body` に `min-inline-size: 960px` を設定する。タスクペイン（300〜600px）では必ず上書きする:

```tsx
useEffect(() => {
  const prev = document.body.style.minInlineSize;
  document.body.style.minInlineSize = "300px";
  return () => {
    document.body.style.minInlineSize = prev;
  };
}, []);
```

### 2. Drawer メニュー

タスクペインにはサイドバーを配置する幅がないため、Drawer でナビゲーションする:

- `position="start"` で左から表示
- メニュー項目クリックでビューを切り替え + Drawer を閉じる
- 外部リンクには `LfArrowUpRightFromSquare` アイコンを付ける
- セクション間に `Divider` を挟む

### 3. ビュー切り替え

`useState` でビュー状態を管理し、`PageLayoutBody` 内で条件分岐:

```tsx
const [currentView, setCurrentView] = useState<ViewType>("view1");

// PageLayoutBody 内
{currentView === "view1" ? renderView1() : renderView2()}
```

### 4. ヘッダーのバリエーション

ビューによってヘッダー構成を変える場合がある（例: サブタイトル行の追加、保存ボタン）。`renderHeader()` 内で `currentView` を参照して分岐する。

---

## 注意事項

- **Pane は使わない**: タスクペインそのものが狭いため、`PageLayoutPane` は不要
- **レスポンシブ**: 幅 300px でも崩れないようにする
- **モックデータ**: `word-addin/mock/data.ts` を参照可能。新規データは `mock/` ディレクトリに配置

---

## 関連スキル

- `/sandbox-creator` - Sandbox ページ作成の基本
- `/page-layout-assistant` - PageLayout パターン選択
- `/component-tips` - Aegis コンポーネントの使い方
