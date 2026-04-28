---
id: AP-DIALOG-001
component: Dialog
category: composition
severity: error
eslint_rule: aegis-custom/no-dialog-without-header
wcag: "4.1.2"
---
# DialogContent に DialogHeader を含めなければならない

## Bad

```tsx
<DialogContent>
  <DialogBody>内容</DialogBody>
  <DialogFooter>
    <ButtonGroup>
      <Button>閉じる</Button>
    </ButtonGroup>
  </DialogFooter>
</DialogContent>
```

## Good

```tsx
<DialogContent>
  <DialogHeader>
    <ContentHeader>
      <ContentHeader.Title>確認</ContentHeader.Title>
    </ContentHeader>
  </DialogHeader>
  <DialogBody>内容</DialogBody>
  <DialogFooter>
    <ButtonGroup>
      <Button variant="plain">キャンセル</Button>
      <Button variant="solid">確認</Button>
    </ButtonGroup>
  </DialogFooter>
</DialogContent>
```

## Why

Dialog には支援技術がダイアログの目的を判断するためのタイトルが必要。`DialogHeader` + `ContentHeader.Title` は必須構造。WCAG 4.1.2 に違反する。
