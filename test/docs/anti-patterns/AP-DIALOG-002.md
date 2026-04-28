---
id: AP-DIALOG-002
component: Dialog
category: composition
severity: error
---
# Dialog の DialogBody に Banner を配置してはいけない

## Bad

```tsx
<DialogContent>
  <DialogHeader>...</DialogHeader>
  <DialogBody>
    <Banner color="danger">エラーがあります</Banner>
    <p>内容</p>
  </DialogBody>
</DialogContent>
```

## Good

```tsx
<DialogContent>
  <DialogHeader>...</DialogHeader>
  <DialogStickyContainer position="top">
    <Banner color="danger">エラーがあります</Banner>
  </DialogStickyContainer>
  <DialogBody>
    <p>内容</p>
  </DialogBody>
</DialogContent>
```

## Why

Banner を DialogBody に配置するとスクロール時に隠れる。`DialogStickyContainer`（top または bottom）を使用することで常時表示される。
