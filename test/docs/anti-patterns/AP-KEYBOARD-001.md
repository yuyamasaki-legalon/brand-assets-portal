---
id: AP-KEYBOARD-001
component: General
category: accessibility
severity: error
wcag: "2.1.1"
---
# div/span の onClick にキーボード対応を付けなければならない

## Bad

```tsx
<div onClick={handleClick}>クリック可能な要素</div>
```

## Good

```tsx
// 推奨: 適切な HTML 要素を使用
<Button variant="plain" onClick={handleClick}>クリック可能な要素</Button>

// 次善策: role + tabIndex + onKeyDown を追加
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
>
  クリック可能な要素
</div>
```

## Why

`<div>` / `<span>` に `onClick` がある場合、キーボードユーザーがその要素を操作できない。`role="button"` + `tabIndex={0}` + `onKeyDown` を追加するか、そもそも `<Button>` を使用する。WCAG 2.1.1 Keyboard に違反する。
