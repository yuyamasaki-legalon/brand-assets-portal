# デモページパターン集

機能カテゴリ別のデモページテンプレート。各テンプレートは v2.38.0 の実装実績に基づく。

---

## 共通構造

全デモページに共通する PageLayout フレーム:

```tsx
import {
  Link as AegisLink,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

export const FeatureName = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>機能名 デモ</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          {/* 説明文 */}
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            vX.YY.Z で追加された機能の説明。
          </Text>

          {/* デモ本体（カテゴリ別パターンを配置） */}

          {/* 注意事項パネル */}
          <div
            style={{
              padding: "var(--aegis-space-medium)",
              backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
              borderRadius: "var(--aegis-radius-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              注意事項
            </Text>
            <Text as="p" variant="body.small">
              - 補足情報
            </Text>
          </div>

          {/* Back リンク */}
          <AegisLink asChild>
            <Link to="/sandbox/{username}/aegis-update/vX-YY-Z">← Back to vX.YY.Z</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
```

---

## パターン 1: Props 追加系

SegmentedControl で値を切り替えてインタラクティブに比較するパターン。

**使用例:** Drawer maxWidth: "none", Popover placement 切り替え

```tsx
import { SegmentedControl } from "@legalforce/aegis-react";
import { useState } from "react";

// オプション定義
type OptionValue = "optionA" | "optionB" | "optionC";
const options: { label: string; value: OptionValue }[] = [
  { label: "Option A", value: "optionA" },
  { label: "Option B", value: "optionB" },
  { label: "Option C", value: "optionC" },
];

// コンポーネント内
const [selectedIndex, setSelectedIndex] = useState(0);
const currentValue = options[selectedIndex]?.value ?? options[0].value;

// JSX
<div style={{ marginBottom: "var(--aegis-space-medium)" }}>
  <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
    {propName} を選択
  </Text>
  <SegmentedControl index={selectedIndex} onChange={setSelectedIndex}>
    {options.map((opt) => (
      <SegmentedControl.Button key={opt.value}>{opt.label}</SegmentedControl.Button>
    ))}
  </SegmentedControl>
</div>

<Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-medium)" }}>
  現在の {propName}: <strong>{currentValue}</strong>
</Text>

{/* 対象コンポーネントに currentValue を渡す */}
```

**ポイント:**
- `useState` で選択中のインデックスを管理
- `SegmentedControl.Button` は compound component パターン
- 現在の値をテキストで表示して視覚的フィードバック

---

## パターン 2: バグ修正系

修正後の正常動作を確認するデモ。Button でデータを切り替え、修正の効果を可視化。

**使用例:** Tree フリッカー修正, Tag 修正

```tsx
import { Button } from "@legalforce/aegis-react";
import { useCallback, useState } from "react";

// 2 つの状態のデータを用意
const initialData = { /* ... */ };
const updatedData = { /* ... */ };

// コンポーネント内
const [data, setData] = useState(initialData);
const [isUpdated, setIsUpdated] = useState(false);
const [updateCount, setUpdateCount] = useState(0);

const handleToggle = useCallback(() => {
  const next = !isUpdated;
  setData(next ? updatedData : initialData);
  setIsUpdated(next);
  setUpdateCount((c) => c + 1);
}, [isUpdated]);

// JSX
<div style={{ display: "flex", gap: "var(--aegis-space-small)", marginBottom: "var(--aegis-space-medium)" }}>
  <Button onClick={handleToggle}>
    {isUpdated ? "初期状態に戻す" : "データを更新"}
  </Button>
</div>

<Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
  更新回数: {updateCount} / 現在: {isUpdated ? "更新済み" : "初期状態"}
</Text>

{/* コンポーネントに data を渡す */}

{/* 注意事項パネルで修正内容を説明 */}
<div style={{
  padding: "var(--aegis-space-medium)",
  backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
  borderRadius: "var(--aegis-radius-medium)",
  marginBottom: "var(--aegis-space-large)",
}}>
  <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
    修正内容
  </Text>
  <Text as="p" variant="body.small">
    - vX.YY.x 以前: 旧動作の説明
  </Text>
  <Text as="p" variant="body.small">
    - vX.YY.Z: 修正後の動作の説明
  </Text>
</div>
```

**ポイント:**
- `useCallback` で再レンダリングを最適化
- 更新回数を表示して操作のフィードバックを提供
- 注意事項パネルで修正前後の違いを明記

---

## パターン 3: 新アイコン系

Icon wrapper で複数サイズ表示 + IconButton + コンテキスト内使用例。

**使用例:** chart-bar-horizontal, pen-sparkles 等

```tsx
import { LfIconName1, LfIconName2 } from "@legalforce/aegis-icons";
import { Icon, IconButton } from "@legalforce/aegis-react";
import type { ComponentType, SVGProps } from "react";

const newIcons: { name: string; Icon: ComponentType<SVGProps<SVGSVGElement>>; description: string }[] = [
  { name: "LfIconName1", Icon: LfIconName1, description: "説明1" },
  { name: "LfIconName2", Icon: LfIconName2, description: "説明2" },
];

const sizes = ["xSmall", "small", "medium", "large"] as const;

// セクション 1: 各サイズでの表示（グリッド）
<Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
  各サイズでの表示
</Text>
<div style={{
  display: "grid",
  gridTemplateColumns: `200px repeat(${sizes.length}, auto)`,
  gap: "var(--aegis-space-medium)",
  alignItems: "center",
  marginBottom: "var(--aegis-space-large)",
}}>
  <Text variant="label.small">アイコン名</Text>
  {sizes.map((size) => (
    <Text key={size} variant="label.small" style={{ textAlign: "center" }}>{size}</Text>
  ))}
  {newIcons.map(({ name, Icon: SvgIcon }) => (
    <>
      <Text key={`${name}-label`} variant="body.small">{name}</Text>
      {sizes.map((size) => (
        <div key={`${name}-${size}`} style={{ display: "flex", justifyContent: "center" }}>
          <Icon size={size}><SvgIcon /></Icon>
        </div>
      ))}
    </>
  ))}
</div>

// セクション 2: IconButton での使用例
<Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
  IconButton での使用例
</Text>
<div style={{ display: "flex", gap: "var(--aegis-space-medium)", marginBottom: "var(--aegis-space-large)" }}>
  {newIcons.map(({ name, Icon: SvgIcon, description }) => (
    <div key={name} style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: "var(--aegis-space-xSmall)",
    }}>
      <IconButton aria-label={description} icon={SvgIcon} />
      <Text variant="body.xSmall">{description}</Text>
    </div>
  ))}
</div>

// セクション 3: コンテキスト内での使用例
<Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
  コンテキスト内での使用例
</Text>
<div style={{
  display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)",
  padding: "var(--aegis-space-medium)",
  border: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
  borderRadius: "var(--aegis-radius-medium)",
  marginBottom: "var(--aegis-space-large)",
}}>
  {newIcons.map(({ Icon: SvgIcon, description }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
      <Icon size="medium"><SvgIcon /></Icon>
      <Text variant="body.medium">{description}に関連するテキスト</Text>
    </div>
  ))}
</div>
```

**重要な注意点:**
- SVG アイコンは `size` prop を持たない → 必ず `<Icon size="...">` で wrap
- `IconButton` は `aria-label` を使う（`label` ではない）
- `icon` prop には SVG コンポーネント自体を渡す（JSX ではなく）: `icon={SvgIcon}`

---

## パターン 4: 新トークン系

トークンの適用例をカラーサンプルやスペーシングサンプルで表示。

```tsx
// トークン定義
const newTokens = [
  { name: "--aegis-token-name", value: "実際の値", description: "用途の説明" },
];

// カラートークンの場合
<div style={{
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "var(--aegis-space-medium)",
  marginBottom: "var(--aegis-space-large)",
}}>
  {newTokens.map((token) => (
    <div key={token.name} style={{
      padding: "var(--aegis-space-medium)",
      border: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
      borderRadius: "var(--aegis-radius-medium)",
    }}>
      <div style={{
        width: "100%", height: "48px",
        backgroundColor: `var(${token.name})`,
        borderRadius: "var(--aegis-radius-small)",
        marginBottom: "var(--aegis-space-small)",
      }} />
      <Text variant="label.small" style={{ wordBreak: "break-all" }}>{token.name}</Text>
      <Text as="p" variant="body.xSmall">{token.description}</Text>
    </div>
  ))}
</div>

// スペーシングトークンの場合
{newTokens.map((token) => (
  <div key={token.name} style={{
    display: "flex", alignItems: "center", gap: "var(--aegis-space-medium)",
    marginBottom: "var(--aegis-space-small)",
  }}>
    <div style={{
      width: `var(${token.name})`, height: "24px",
      backgroundColor: "var(--aegis-color-background-information-subtle)",
      borderRadius: "var(--aegis-radius-small)",
    }} />
    <Text variant="body.small">{token.name} ({token.value})</Text>
  </div>
))}
```

---

## バージョン一覧ページテンプレート

`aegis-update/index.tsx` — 初回のみ作成:

```tsx
import {
  Link as AegisLink, Card, CardBody, CardHeader, CardLink,
  ContentHeader, PageLayout, PageLayoutBody, PageLayoutContent,
  PageLayoutHeader, Tag, Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

const versions = [
  {
    version: "vX.YY.Z",
    path: "/sandbox/{username}/aegis-update/vX-YY-Z",
    description: "機能1, 機能2, ...",
    date: "YYYY-MM",
  },
];

export const AegisUpdate = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Aegis React リリースノート デモ</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            Aegis React の各バージョンで追加・修正された機能を個別に確認できるデモページ集です。
          </Text>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(var(--aegis-layout-width-x5Small), 1fr))",
            gap: "var(--aegis-space-medium)",
            marginBottom: "var(--aegis-space-xLarge)",
          }}>
            {versions.map((v) => (
              <Card key={v.version}>
                <CardHeader>
                  <CardLink asChild>
                    <Link to={v.path}>
                      <Text variant="title.xSmall">{v.version}</Text>
                    </Link>
                  </CardLink>
                  <Tag size="small" color="blue">{v.date}</Tag>
                </CardHeader>
                <CardBody>
                  <Text variant="body.small">{v.description}</Text>
                </CardBody>
              </Card>
            ))}
          </div>
          <AegisLink asChild>
            <Link to="/sandbox/{username}">← Back to {username}</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
```

---

## 機能一覧ページテンプレート

`aegis-update/vX-YY-Z/index.tsx`:

```tsx
import {
  Link as AegisLink, Card, CardBody, CardHeader, CardLink,
  ContentHeader, PageLayout, PageLayoutBody, PageLayoutContent,
  PageLayoutHeader, Tag, Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

const features = [
  {
    name: "機能名",
    path: "/sandbox/{username}/aegis-update/vX-YY-Z/{feature-slug}",
    description: "機能の説明",
    tag: "Design",         // "Design" | "Bug Fix"
    tagColor: "blue" as const,  // "blue" | "teal"
  },
];

export const AegisUpdateVXYYZ = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Aegis React vX.YY.Z</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            vX.YY.Z で追加・修正された機能のデモページ一覧です。
          </Text>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(var(--aegis-layout-width-x5Small), 1fr))",
            gap: "var(--aegis-space-medium)",
            marginBottom: "var(--aegis-space-xLarge)",
          }}>
            {features.map((f) => (
              <Card key={f.name}>
                <CardHeader>
                  <CardLink asChild>
                    <Link to={f.path}>
                      <Text variant="title.xSmall">{f.name}</Text>
                    </Link>
                  </CardLink>
                  <Tag size="small" color={f.tagColor} variant="outline">{f.tag}</Tag>
                </CardHeader>
                <CardBody>
                  <Text variant="body.small">{f.description}</Text>
                </CardBody>
              </Card>
            ))}
          </div>
          <AegisLink asChild>
            <Link to="/sandbox/{username}/aegis-update">← Back to aegis-update</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
```

**注意:** 機能一覧の Tag は `variant="outline"`、バージョン一覧の Tag は default（fill）。
