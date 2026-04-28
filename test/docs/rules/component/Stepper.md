---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-801f-968e-de70610365c0"
category: "Navigation"
---
# Stepper

💡 **Stepperは、各ステップがどの段階にあるかを視覚的に表示するコンポーネントです。**

---

# カスタム実装禁止

🚫 **ステップインジケーターをカスタム実装することは禁止です。必ず `@legalforce/aegis-react` の `<Stepper>` を使用してください。**

## 禁止パターン（NG例）

以下のようなカスタム実装は禁止です：

```tsx
// ❌ NG: div + インラインスタイルでステップを自作
<div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
  <div
    style={{
      width: "28px",
      height: "28px",
      borderRadius: "50%",  // ← 円形を自作
      backgroundColor: isCompleted
        ? "var(--aegis-color-background-brand)"
        : "var(--aegis-color-background-neutral-subtle)",
    }}
  >
    {isCompleted ? <Icon><LfCheck /></Icon> : <Text>{index + 1}</Text>}
  </div>
  <Text>{step.label}</Text>
  <div style={{ width: "24px", height: "2px", backgroundColor: "..." }} />  {/* ← 線を自作 */}
</div>
```

**なぜ禁止か：**
- デザインの一貫性が損なわれる
- アクセシビリティ対応が漏れる
- 状態管理（completed, disabled, current）の実装が不完全になる

---

# 正しい使用方法

## 基本パターン

```tsx
import { Stepper } from "@legalforce/aegis-react";

// ✅ OK: aegis-react の Stepper を使用
<Stepper orientation="vertical" readOnly>
  {steps.map((step) => (
    <Stepper.Item
      key={step.id}
      title={step.label}
      status={step.isCompleted ? "completed" : "normal"}
      disabled={step.isDisabled}
    >
      {/* オプション: 各ステップの追加コンテンツ */}
    </Stepper.Item>
  ))}
</Stepper>
```

## Props

### Stepper
| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | ステッパーの方向 |
| `size` | `"small" \| "medium"` | `"medium"` | サイズ |
| `readOnly` | `boolean` | `false` | クリック不可にする |
| `index` | `number` | - | 現在のステップ（制御モード） |
| `defaultIndex` | `number` | `0` | 初期ステップ |
| `onChange` | `(index: number) => void` | - | ステップ変更時のコールバック |

### Stepper.Item
| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `title` | `string` | - | ステップのタイトル（必須） |
| `status` | `"normal" \| "completed"` | `"normal"` | 完了状態 |
| `disabled` | `boolean` | `false` | 無効状態 |
| `children` | `ReactNode` | - | 追加コンテンツ（vertical時のみ表示） |

---

# ユースケース別パターン

## 1. Vertical + ReadOnly（進捗表示）

ウィザード形式のサイドバーで進捗を表示する場合：

```tsx
// 参照: src/pages/template/workon/employee-registration/index.tsx:48-56
<PageLayout.Pane variant="fill">
  <PageLayout.Body>
    <Stepper orientation="vertical" readOnly>
      {steps.map((step) => (
        <Stepper.Item key={step.id} title={step.label}>
          <Button variant="subtle" color="neutral" size="small" disabled>
            修正
          </Button>
        </Stepper.Item>
      ))}
    </Stepper>
  </PageLayout.Body>
</PageLayout.Pane>
```

## 2. Horizontal + Interactive（ステップ選択）

Header 内でステップを切り替える場合：

```tsx
// 参照: src/pages/template/loc/esign/index.tsx:1472-1490
<Stepper onChange={handleStepChange} index={currentStep}>
  {stepItems.map((item, index) => (
    <Stepper.Item
      key={item.label}
      disabled={!canNavigateTo(index)}
      status={isStepCompleted(index) ? "completed" : "normal"}
      title={item.label}
    />
  ))}
</Stepper>
```

---

# Template 参照先

実装例は以下を参照してください：

| ファイル | パターン |
|---------|----------|
| `src/pages/template/workon/employee-registration/index.tsx` | Vertical + ReadOnly |
| `src/pages/template/loc/esign/index.tsx` | Horizontal + Interactive |

---

# 使用時の注意点
⚠️<span color="red">**登録や設定など、進捗を伴う表現にのみ利用してください。**</span>

---

# Q&A
Q: ステップの数が多い場合はどうすればよいですか？
A: Horizontal の場合は 4-5 ステップまでが推奨です。それ以上の場合は Vertical を検討してください。

Q: ステップ間の線をカスタマイズしたい場合は？
A: Stepper コンポーネントの標準スタイルを使用してください。カスタマイズが必要な場合はデザインチームに相談してください。

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonGroup } from "../../src/components/Button";
import { Stepper } from "../../src/components/Stepper";
import { Placeholder, Stack } from "../_utils/components";

export default {
  component: Stepper,
  args: {
    children: Array.from({ length: 4 }, (_, index) => (
      <Stepper.Item
        key={index}
        status={index === 0 ? "completed" : undefined}
        title={`Step${index + 1}`}
      />
    )),
  },
} satisfies Meta<typeof Stepper>;

type Story = StoryObj<typeof Stepper>;

const ALL_SIZES = ["medium", "small"] as const;
const ALL_STATUSES = ["normal", "completed", "loading", "error"] as const;

export const Size = {
  render: (args) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <Stepper key={size} {...args} size={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

export const WithDisabledItem = {
  ...Size,
  args: {
    children: ALL_STATUSES.map((status) => (
      <Stepper.Item
        key={status}
        status={status}
        title="Body - Aegis"
        disabled
      />
    )),
  },
} satisfies Story;

export const WithCompletedItem = {
  ...Size,
  args: {
    children: Array.from({ length: 4 }, (_, index) => (
      <Stepper.Item key={index} status="completed" title={`Step${index + 1}`} />
    )),
  },
} satisfies Story;

export const ReadOnly = {
  ...Size,
  args: {
    readOnly: true,
  },
} satisfies Story;

export const Orientation = {
  args: {
    orientation: "vertical",
    defaultIndex: null,
    children: Array.from({ length: 4 }, (_, index) => (
      <Stepper.Item key={index} title={`Step${index + 1}`}>
        <Placeholder>Placeholder</Placeholder>
      </Stepper.Item>
    )),
  },
  render: (args) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <Stepper key={size} {...args} size={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

export const WithReadOnlyVerticalSmall = {
  args: {
    orientation: "vertical",
    size: "small",
    readOnly: true,
    defaultIndex: null,
    children: Array.from({ length: 4 }, (_, index) => (
      <Stepper.Item key={index} title={`Step${index + 1}`}>
        <Placeholder>Placeholder</Placeholder>
      </Stepper.Item>
    )),
  },
} satisfies Story;

export const WithVerticalLongContent = {
  args: {
    orientation: "vertical",
    defaultIndex: null,
    children: Array.from({ length: 4 }, (_, index) => (
      <Stepper.Item key={index} title={`Step${index + 1} `.repeat(100)}>
        <Placeholder>Placeholder</Placeholder>
      </Stepper.Item>
    )),
  },
  render: (args) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <Stepper key={size} {...args} size={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

/**
 * Use the `status` prop of `Stepper.Item` to change the state of each step.
 */
export const Status = {
  render: (args) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <Stepper
          key={size}
          {...args}
          defaultIndex={null}
          orientation="vertical"
          readOnly
          size={size}
        >
          {ALL_STATUSES.map((status) => (
            <Stepper.Item key={status} status={status} title="Body - Aegis">
              <Placeholder>Swap Content</Placeholder>
            </Stepper.Item>
          ))}
        </Stepper>
      ))}
    </Stack>
  ),
} satisfies Story;

export const Example = {
  render: (props) => {
    const [currentStep, setCurrentStep] = useState(0);

    return (
      <Stack>
        <Stepper
          {...props}
          index={currentStep}
          onChange={(index) => setCurrentStep(index)}
        >
          {Array.from({ length: 4 }, (_, index) => (
            <Stepper.Item
              key={index}
              status={currentStep > index ? "completed" : undefined}
              title={`Step${index + 1}`}
              disabled={currentStep < index}
            />
          ))}
        </Stepper>
        <ButtonGroup>
          <Button
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep <= 0}
          >
            Back
          </Button>
          <Button
            onClick={() => setCurrentStep((prev) => prev + 1)}
            disabled={currentStep > 3}
          >
            Next
          </Button>
          <Button onClick={() => setCurrentStep(0)}>Reset</Button>
        </ButtonGroup>
      </Stack>
    );
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
