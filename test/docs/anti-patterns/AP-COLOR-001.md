---
id: AP-COLOR-001
component: General
category: styling
severity: warning
---
# インラインスタイルで色を直接指定してはいけない

## Bad

```tsx
<div style={{ color: "#333333", backgroundColor: "#f5f5f5" }}>
  内容
</div>
```

## Good

```tsx
<div style={{
  color: "var(--aegis-color-text-default)",
  backgroundColor: "var(--aegis-color-background-subtle)"
}}>
  内容
</div>
```

## Why

ハードコードされた色ではなく Aegis カラートークンを使用する。トークンを使うことでダークモード対応やブランドカラー変更に自動追従でき、コントラスト比もシステム全体で管理される。
