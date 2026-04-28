---
id: AP-CONTENTHEADER-001
component: ContentHeader
category: composition
severity: warning
---
# ContentHeader の trailing にメインアクションを配置すべきではない（Dialog 内）

## Bad

```tsx
<DialogHeader>
  <ContentHeader
    trailing={
      <Button variant="solid">保存</Button>
    }
  >
    <ContentHeader.Title>編集</ContentHeader.Title>
  </ContentHeader>
</DialogHeader>
```

## Good

```tsx
<DialogHeader>
  <ContentHeader>
    <ContentHeader.Title>編集</ContentHeader.Title>
  </ContentHeader>
</DialogHeader>
<DialogBody>...</DialogBody>
<DialogFooter>
  <ButtonGroup>
    <Button variant="plain">キャンセル</Button>
    <Button variant="solid">保存</Button>
  </ButtonGroup>
</DialogFooter>
```

## Why

Dialog のメインアクション（保存、送信等）は DialogFooter に配置する。ContentHeader の trailing にメインアクションを配置するとユーザーが見つけにくくなる。
