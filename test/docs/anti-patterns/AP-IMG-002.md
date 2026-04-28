---
id: AP-IMG-002
component: General
category: accessibility
severity: warning
wcag: "1.1.1"
---
# img の alt に汎用テキストを使用してはいけない

## Bad

```tsx
<img src="/user-profile.jpg" alt="image" />
<img src="/chart.png" alt="photo" />
<img src="/banner.png" alt="picture" />
```

## Good

```tsx
<img src="/user-profile.jpg" alt="田中太郎のプロフィール写真" />
<img src="/chart.png" alt="2024年の月別売上推移グラフ" />
```

## Why

`"image"`, `"photo"`, `"picture"` などの汎用テキストはスクリーンリーダーユーザーに意味のある情報を提供しない。画像の内容を具体的に説明する alt テキストを設定する。
