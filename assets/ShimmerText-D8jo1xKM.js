var e=`---
paths: src/**/*.{ts,tsx}
category: "Status"
---
# ShimmerText

💡 **ShimmerTextは、AIの処理中などに文字列をシマー（光沢）アニメーションで表示するテキストコンポーネントです。**

---

# 使用時の注意点

## ユースケース
### 推奨される使い方 (Do)
- AI の応答待ちなど、処理中であることをテキストで示したいとき（例: \`Thinking...\` / \`生成中...\`）
- 既存のテキスト（見出し等）にシマー効果だけを付与したいときは \`asChild\` を使って既存の \`Text\` をラップする

### 非推奨の使い方 (Don't)
- 初期ローディング全般での使用。レイアウト形状をプレースホルダーとして示したい場合は [Skeleton](./Skeleton.md) を使用する
- 進捗の度合いを示したい場合は [ProgressBar](./ProgressBar.md) や [ProgressCircle](./ProgressCircle.md) を使用する
- 常時アニメーション表示する装飾用途。あくまで「処理中」を示すフィードバックとして用いる

## 実装者向けノート
- **Props:**
  - \`asChild\`: \`boolean\` - \`true\` のとき子要素を描画ルートに置き換える（既存の \`Text\` などにシマー効果を合成したい場合に使用）
- **import:**
  \`\`\`ts
  import { ShimmerText } from "@legalforce/aegis-react";
  \`\`\`

## 類似コンポーネントとの使い分け
- **\`ShimmerText\` vs \`Skeleton\`:** Skeleton はレイアウト枠を示すプレースホルダー。ShimmerText は「テキストとして意味のある文言（例: Thinking...）」を見せながら処理中であることを伝える
- **\`ShimmerText\` vs \`ProgressCircle\` / \`ProgressBar\`:** Progress 系は進捗・経過を示すのが主目的。ShimmerText は進捗が読み取れない処理中状態の表示に向く

# Q&A
Q: {内容を書く}
A: {内容を書く}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
\`\`\`tsx
import preview from "../../.storybook/preview";
import { ShimmerText } from "../../src/components/Shimmer";
import { Text } from "../../src/components/Text";

const meta = preview.meta({
  component: ShimmerText,
  args: {
    children: "Thinking...",
  },
});

export const AsText = meta.story({
  args: {
    asChild: true,
    children: (
      <Text variant="title.large" color="information">
        Thinking...
      </Text>
    ),
  },
});
\`\`\`
<!-- STORYBOOK_CATALOG_END -->
`;export{e as default};