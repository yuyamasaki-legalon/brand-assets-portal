---
id: AP-BANNER-002
component: Banner
category: usage
severity: info
---
# Banner の color prop を内容と一致させなければならない

## Bad

```tsx
<Banner color="information">保存に失敗しました</Banner>
```

## Good

```tsx
<Banner color="danger">保存に失敗しました。再度お試しください。</Banner>
```

## Why

Banner の `color` prop はセマンティックな意味を持つ。`information` はお知らせ、`success` は成功、`danger` はエラー、`warning` は警告に対応する。内容と色が一致しないとユーザーに混乱を与える。
