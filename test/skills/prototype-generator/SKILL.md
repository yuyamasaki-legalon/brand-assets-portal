---
name: prototype-generator
description: "SPEC.md（簡易 minispec）から Sandbox プロトタイプコードを生成。WHEN: SPEC.md が既に存在し、そこからコード実装を開始するとき。NOT WHEN: SPEC.md がない状態での実装（先に spec-generator で作成）、会話ベースの sandbox 開発。前提: 対象ディレクトリに SPEC.md が存在すること。"
disable-model-invocation: true
---

# プロトタイプジェネレーター

minispec 形式の SPEC.md を読み込み、Sandbox プロトタイプのコードを生成する。

## 使用方法

```bash
/prototype-generator sandbox/my-feature/SPEC.md
/prototype-generator src/pages/sandbox/new-page/SPEC.md
```

引数なしの場合はカレントディレクトリの SPEC.md を探すか、対話的に確認する。

---

## 実行手順

### Step 1: SPEC.md の読み込み

引数 `$ARGUMENTS` からパスを取得し、SPEC.md を読み込む。

### Step 1.5: コンセプト読み込み

SPEC.md の対象ページがサービスディレクトリ配下の場合、コンセプト文書を読み込む:

1. パスからサービスを特定: `sandbox/loc/...` → `loc`
2. `src/pages/template/{service}/CONCEPT.md` を読み込み、用語・エンティティを把握
3. SPEC.md のキーワードで機能コンセプトを特定: `src/pages/template/{service}/{feature}/CONCEPT.md`
4. コンセプトの用語を types.ts の型名・プロパティ名、UI ラベルに反映

### Step 2: 仕様の解析

SPEC.md から以下を抽出:

| セクション | 抽出内容 | 生成対象 |
|-----------|---------|---------|
| 目的 | 機能名 | コンポーネント名、ファイル名 |
| ユースケース | アクション一覧 | イベントハンドラ |
| レイアウト | パターン、構成要素 | PageLayout テンプレート選択 |
| 主要コンポーネント | コンポーネント一覧 | import 文 |
| データ構造 | interface/type | types.ts |
| 状態管理 | 状態一覧 | useState フック |
| インタラクション | アクション→結果 | ハンドラ関数 |

### Step 3: ファイル構成の決定

SPEC.md の複雑さに応じて決定:

#### シンプル（状態3つ以下、コンポーネント5つ以下）
```
src/pages/sandbox/{page-name}/
├── SPEC.md
└── index.tsx
```

#### 中程度
```
src/pages/sandbox/{page-name}/
├── SPEC.md
├── index.tsx
├── types.ts
└── constants.ts
```

#### 複雑（コンポーネント10個以上、状態5個以上）
```
src/pages/sandbox/{page-name}/
├── SPEC.md
├── index.tsx
├── Container.tsx
├── types.ts
├── constants.ts
└── components/
    └── {SubComponent}.tsx
```

### Step 4: 関連スキル参照

生成前に以下を確認:

1. `/page-layout-assistant` - レイアウトパターンのテンプレート確認
2. `/component-tips` - 使用コンポーネントのルール確認
3. `/design-token-resolver` - スタイリングに必要なトークン

### Step 5: コード生成

#### 5.1 types.ts（データ構造がある場合）

コンセプトのドメインモデルがある場合、エンティティ名・属性名をそのまま型定義に反映する:

```typescript
// types.ts
// SPEC.md のデータ構造 + CONCEPT.md のドメインモデルを参照
// エンティティの英語名を型名、属性を property 名に使用
```

#### 5.2 constants.ts（初期値がある場合）

```typescript
// constants.ts
export const INITIAL_{STATE_NAME} = {初期値};
```

#### 5.3 index.tsx

SPEC.md のレイアウトパターンに基づき、下記テンプレートから選択して生成。

### Step 6: Sandbox 登録

`/sandbox-creator` のガイドに従い:

1. `src/pages/sandbox/index.tsx` にカード追加
2. `src/pages/sandbox/routes.tsx` にルート追加

### Step 7: 動作確認案内

```bash
pnpm dev
# http://localhost:5173/sandbox/{page-name}
```

---

## レイアウトテンプレート

### パターン1: 一覧画面

```tsx
import {
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarInset,
  SidebarNavigation,
  SidebarNavigationItem,
  SidebarNavigationLink,
  SidebarProvider,
} from "@legalforce/aegis-react";

export default function {PageName}() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader />
        <SidebarBody>
          <SidebarNavigation>
            <SidebarNavigationItem>
              <SidebarNavigationLink href="#">項目1</SidebarNavigationLink>
            </SidebarNavigationItem>
          </SidebarNavigation>
        </SidebarBody>
      </Sidebar>
      <SidebarInset>
        <PageLayout>
          <PageLayoutContent>
            <PageLayoutHeader>
              <ContentHeader>
                <ContentHeader.Title>{タイトル}</ContentHeader.Title>
              </ContentHeader>
            </PageLayoutHeader>
            <PageLayoutBody>
              {/* メインコンテンツ */}
            </PageLayoutBody>
          </PageLayoutContent>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

### パターン1.1: 一覧＋詳細

```tsx
import {
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@legalforce/aegis-react";
import { useState } from "react";

export default function {PageName}() {
  const [paneOpen, setPaneOpen] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <SidebarProvider>
      <Sidebar>{/* サイドバー */}</Sidebar>
      <SidebarInset>
        <PageLayout>
          <PageLayoutContent>
            <PageLayoutHeader>
              <ContentHeader>
                <ContentHeader.Title>{タイトル}</ContentHeader.Title>
              </ContentHeader>
            </PageLayoutHeader>
            <PageLayoutBody>
              {/* 一覧コンテンツ */}
            </PageLayoutBody>
          </PageLayoutContent>
          <PageLayoutPane position="end" open={paneOpen} width="medium">
            <PageLayoutHeader>
              <ContentHeader>
                <ContentHeader.Title>詳細</ContentHeader.Title>
              </ContentHeader>
            </PageLayoutHeader>
            <PageLayoutBody>
              {/* 詳細コンテンツ */}
            </PageLayoutBody>
          </PageLayoutPane>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

### パターン2: 詳細・編集画面

```tsx
import {
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
} from "@legalforce/aegis-react";

export default function {PageName}() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>{タイトル}</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          {/* メインコンテンツ */}
        </PageLayoutBody>
      </PageLayoutContent>
      <PageLayoutPane position="end" width="medium">
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>情報</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          {/* サイドパネルコンテンツ */}
        </PageLayoutBody>
      </PageLayoutPane>
    </PageLayout>
  );
}
```

### パターン3: 設定画面

```tsx
import {
  ContentHeader,
  NavList,
  NavListItem,
  NavListLink,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@legalforce/aegis-react";

export default function {PageName}() {
  return (
    <SidebarProvider>
      <Sidebar>{/* グローバルナビ */}</Sidebar>
      <SidebarInset>
        <PageLayout>
          <PageLayoutPane position="start" width="small">
            <NavList>
              <NavListItem>
                <NavListLink href="#">カテゴリ1</NavListLink>
              </NavListItem>
            </NavList>
          </PageLayoutPane>
          <PageLayoutContent>
            <PageLayoutHeader>
              <ContentHeader>
                <ContentHeader.Title>設定</ContentHeader.Title>
              </ContentHeader>
            </PageLayoutHeader>
            <PageLayoutBody>
              {/* 設定項目 */}
            </PageLayoutBody>
          </PageLayoutContent>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

---

## 状態管理テンプレート

SPEC.md の状態管理セクションから useState を生成:

```tsx
// SPEC.md:
// | paneOpen | boolean | true | サイドペインの開閉 |
// ↓
const [paneOpen, setPaneOpen] = useState<boolean>(true);
```

---

## イベントハンドラテンプレート

SPEC.md のインタラクションセクションからハンドラを生成:

```tsx
// SPEC.md:
// - 戻るボタンクリック: 一覧画面に遷移
// ↓
const handleBack = () => {
  // TODO: 一覧画面に遷移
};
```

---

## 注意事項

- 必ず `src/pages/template/` のコードを参照例として使用
- `src/pages/sandbox/` の既存コードは参照しない
- Aegis コンポーネントのみを使用（カスタムコンポーネント禁止）
- デザイントークンを使用（px 値の直接指定禁止）
- TypeScript strict モードに準拠
- 生成後、`pnpm format` でエラーがないことを確認

---

## 関連スキル

- `/sandbox-creator` - Sandbox ページ作成の詳細手順
- `/page-layout-assistant` - レイアウトパターンの選択
- `/component-tips` - コンポーネントの使い方
- `/design-token-resolver` - デザイントークンの適用
- `/spec-generator` - プロトタイプから SPEC.md を生成
