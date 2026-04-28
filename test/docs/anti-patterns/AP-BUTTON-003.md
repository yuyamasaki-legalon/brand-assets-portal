---
id: AP-BUTTON-003
component: Button
category: composition
severity: error
eslint_rule: aegis-custom/no-multiple-solid-buttons
---
# 同一画面に複数の variant="solid" Button を配置してはいけない

## Bad

```tsx
<ButtonGroup>
  <Button variant="solid">保存</Button>
  <Button variant="solid">送信</Button>
</ButtonGroup>
```

## Good

```tsx
<ButtonGroup>
  <Button variant="plain">キャンセル</Button>
  <Button variant="solid">保存</Button>
</ButtonGroup>
```

## Why

`variant="solid"` はページ内で最も重要なアクション（プライマリアクション）に使用する。複数あるとユーザーがどのボタンを押すべきか判断できなくなる。1 画面あたり最大 1 つまで。
