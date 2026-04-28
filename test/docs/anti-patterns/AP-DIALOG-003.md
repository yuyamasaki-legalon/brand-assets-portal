---
id: AP-DIALOG-003
component: Dialog
category: composition
severity: warning
---
# Dialog の Footer に複数の Solid Button を配置してはいけない

## Bad

```tsx
<DialogFooter>
  <ButtonGroup>
    <Button variant="solid">保存</Button>
    <Button variant="solid">送信</Button>
  </ButtonGroup>
</DialogFooter>
```

## Good

```tsx
<DialogFooter>
  <ButtonGroup>
    <Button variant="plain">キャンセル</Button>
    <Button variant="solid">保存</Button>
  </ButtonGroup>
</DialogFooter>
```

## Why

Dialog のフッターボタンは Solid variant を最大 1 つまでにする。複数の Solid ボタンはプライマリアクションの判断を困難にする。
