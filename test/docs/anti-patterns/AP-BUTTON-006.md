---
id: AP-BUTTON-006
component: Button
category: usage
severity: warning
---
# Button の color="danger" を削除以外の操作に使用してはいけない

## Bad

```tsx
<Button color="danger">キャンセル</Button>
```

## Good

```tsx
<Button color="danger">削除する</Button>
<Button variant="plain">キャンセル</Button>
```

## Why

`color="danger"` は削除や不可逆な操作にのみ使用する。キャンセルや一般操作に使用すると、ユーザーに不必要な警戒感を与える。
