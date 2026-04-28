---
id: AP-CUSTOM-UI-001
component: General
category: composition
severity: error
---
# カスタム UI コンポーネントを作成してはいけない

## Bad

```tsx
// カスタムボタンコンポーネント
const CustomButton = ({ children, ...props }) => (
  <button className="custom-button" {...props}>{children}</button>
);
```

## Good

```tsx
import { Button } from "@legalforce/aegis-react";

<Button variant="solid">{children}</Button>
```

## Why

Aegis デザインシステムのコンポーネントを常に使用する。カスタム UI を作成するとデザインの一貫性、アクセシビリティ、メンテナンス性が損なわれる。必要な機能が Aegis にない場合はデザインチームに相談する。
