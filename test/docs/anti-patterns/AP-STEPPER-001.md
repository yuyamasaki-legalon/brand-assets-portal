---
id: AP-STEPPER-001
component: Stepper
category: usage
severity: warning
---
# Stepper のステップ数は 7 以下にすべき

## Bad

```tsx
<Stepper>
  <Stepper.Step>Step 1</Stepper.Step>
  <Stepper.Step>Step 2</Stepper.Step>
  <Stepper.Step>Step 3</Stepper.Step>
  <Stepper.Step>Step 4</Stepper.Step>
  <Stepper.Step>Step 5</Stepper.Step>
  <Stepper.Step>Step 6</Stepper.Step>
  <Stepper.Step>Step 7</Stepper.Step>
  <Stepper.Step>Step 8</Stepper.Step>
</Stepper>
```

## Good

```tsx
<Stepper>
  <Stepper.Step>基本情報</Stepper.Step>
  <Stepper.Step>詳細設定</Stepper.Step>
  <Stepper.Step>確認</Stepper.Step>
</Stepper>
```

## Why

ステップ数が多すぎるとユーザーの認知負荷が高まる。7 ステップ以下に収め、多い場合はステップをグループ化する。
