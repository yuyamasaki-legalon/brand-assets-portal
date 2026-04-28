---
id: AP-TABS-001
component: Tabs
category: usage
severity: warning
---
# Tabs をナビゲーション（ページ遷移）に使用してはいけない

## Bad

```tsx
// ページ遷移に Tabs を使用
<Tabs onChange={(tab) => navigate(`/page/${tab}`)}>
  <Tabs.Tab value="overview">概要</Tabs.Tab>
  <Tabs.Tab value="detail">詳細</Tabs.Tab>
</Tabs>
```

## Good

```tsx
// ページ内のコンテンツ切替に Tabs を使用
<Tabs defaultValue="overview">
  <Tabs.Tab value="overview">概要</Tabs.Tab>
  <Tabs.Tab value="detail">詳細</Tabs.Tab>
  <Tabs.Panel value="overview">概要コンテンツ</Tabs.Panel>
  <Tabs.Panel value="detail">詳細コンテンツ</Tabs.Panel>
</Tabs>

// ナビゲーションには NavList や SideNavigation を使用
```

## Why

Tabs はページ内のコンテンツ切替用。URL が変わるナビゲーションには NavList, SideNavigation, Breadcrumb を使用する。
