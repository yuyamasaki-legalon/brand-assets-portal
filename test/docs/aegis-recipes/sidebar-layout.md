# サイドバー付きレイアウト

アプリ全体にサイドバーを持つレイアウトの基本パターン。
`SidebarProvider` と `SidebarInset` でレイアウトを分離します。

## 使うコンポーネント

- `SidebarProvider`
- `SidebarInset`
- `PageLayout`, `PageLayoutContent`, `PageLayoutBody`
- `BaseSidebar`（テンプレート提供 — `@legalforce/aegis-react` 外のプロジェクト固有コンポーネント）

## スニペット

```tsx
<SidebarProvider defaultOpen={false}>
  <BaseSidebar showSidebar showMenus showApps showSettings />
  <SidebarInset>
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutBody>{children}</PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  </SidebarInset>
</SidebarProvider>
```

## ポイント

- メインコンテンツは `SidebarInset` の中に置く
- サイドバーの開閉は `SidebarProvider` が管理する

## NG例

- サイドバーの有無で `PageLayout` を分岐させない
- サイドバーを `position: fixed` で独自実装しない
