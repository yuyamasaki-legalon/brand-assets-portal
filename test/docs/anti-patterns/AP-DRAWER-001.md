---
id: AP-DRAWER-001
component: Drawer
category: composition
severity: error
wcag: "4.1.2"
---
# Drawer に Drawer.Header を含めなければならない

## Bad

```tsx
<Drawer open={open} onOpenChange={setOpen}>
  <Drawer.Body>
    <p>内容</p>
  </Drawer.Body>
</Drawer>
```

## Good

```tsx
<Drawer open={open} onOpenChange={setOpen}>
  <Drawer.Header>フィルター</Drawer.Header>
  <Drawer.Body>
    <p>内容</p>
  </Drawer.Body>
</Drawer>
```

## Why

Drawer は WAI-ARIA 上 Dialog に分類されるため、タイトルが必要。`Drawer.Header` がないと支援技術でダイアログの目的が伝わらない。
