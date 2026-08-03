var e=`---
id: AP-CUSTOM-UI-001
component: General
category: composition
severity: error
---
# カスタム UI コンポーネントを作成してはいけない

## Bad

\`\`\`tsx
// 1) 生の HTML 要素を直接使う
<button type="button" onClick={handleClick}>更新</button>
<input type="text" value={value} onChange={onChange} />

// 2) Aegis を使わず自前ラッパーを作る
const CustomButton = ({ children, ...props }) => (
  <button className="custom-button" {...props}>{children}</button>
);
\`\`\`

## Good

\`\`\`tsx
import { Button, TextField, FormControl } from "@legalforce/aegis-react";

<Button variant="solid" onClick={handleClick}>更新</Button>

<FormControl>
  <FormControl.Label>名前</FormControl.Label>
  <TextField value={value} onChange={onChange} />
</FormControl>
\`\`\`

## Why

Aegis デザインシステムのコンポーネントを常に使用する。生の \`<button>\` / \`<input>\` や自前ラッパーは、フォーカスリング・キーボード操作・disabled スタイル・サイズトークンなど Aegis が提供するアクセシビリティ／一貫性を欠く。必要な機能が Aegis にない場合はデザインチームに相談する。
`;export{e as default};