---
id: AP-PAGELAYOUT-001
component: PageLayout
category: composition
severity: error
---
# PageLayout の 3 ステップ構成ルールに従わなければならない

## Bad

```tsx
// PageLayout なしで直接コンテンツを配置
const Page = () => (
  <div className="my-page">
    <h1>ページタイトル</h1>
    <div>コンテンツ</div>
  </div>
);
```

## Good

```tsx
// Step 1: PageLayout フレーム
// Step 2: 内部レイアウト（list-layout, detail-layout 等）
// Step 3: バリアント/スペーシング
const Page = () => (
  <PageLayout>
    <PageLayout.Header>
      <ContentHeader>
        <ContentHeader.Title>ページタイトル</ContentHeader.Title>
      </ContentHeader>
    </PageLayout.Header>
    <PageLayout.Body>
      コンテンツ
    </PageLayout.Body>
  </PageLayout>
);
```

## Why

すべてのページは PageLayout をフレームとして使用し、3 ステップの構成ルール（フレーム → 内部レイアウト → バリアント/スペーシング）に従う。テンプレート（`src/pages/template/`）を参照してパターンを選択する。
