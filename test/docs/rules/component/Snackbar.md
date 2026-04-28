---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-8036-86fe-c02d6f6f812b"
category: "Feedback"
---
# Snackbar

💡 **Snackbarは、ユーザーが何らかの操作を行った後のフィードバックを提供するために使用するコンポーネントです。<br>メッセージは数秒間表示された後、自動消去します。<br>また、アクションボタンを含めることもでき、その場合は自動消去はしません。**

---
▶# 👉Examples
	

---

# 使用時の注意点
<columns>
	<column>
		<span color="red">**⚠️あらかじめ設定されているアイコンの変更はできません。**</span><br>使用できるのは
		- LfCheck
		- LfWarningTriangleFill
		の２つのアイコンと、
		- ProgressCircle
		のアニメーションアイコンだけです。

		Snackbarのテキストは以下を参照してください。<br><mention-page url="https://www.notion.so/63ece5c0d7574e0c8dd82c53c1358bf4"/> 
	</column>
	<column>
		
	</column>
</columns>
### <span discussion-urls="discussion://17531669-5712-8051-9cb9-001c880517ca">自動消去しないSnackbarについて</span>
<columns>
	<column>
		以下のような場合は自動消去させないことを検討してください。
		- **重要なアクションが必要な場合**：「確認」「やり直す」などの操作を促すとき。
		- **ユーザーの注意喚起が必要な場合**：エラーや警告など、見逃すと重大な問題が生じるとき。

	</column>
	<column>
		
	</column>
</columns>

### メッセージの書き方

末尾に句点（。）を付けないでください。2文の場合は1つ目の文の終わりにのみ句点を付けます。

```tsx
// OK: 句点なし
snackbar.show({ message: "保存しました" });
snackbar.show({ message: "削除が完了しました" });
snackbar.show({ message: "設定を更新しました" });

// OK: 2文の場合（1つ目の句点のみ）
snackbar.show({ message: "保存しました。続けて編集できます" });

// OK: エラー表示
snackbar.show({ message: "エラーが発生しました", color: "danger" });

// NG: 末尾に句点
snackbar.show({ message: "保存しました。" });
snackbar.show({ message: "保存しました。続けて編集できます。" });
```

---
この内容を記載してもいい気がする：<mention-page url="https://www.notion.so/fa681204f0564cac8d4b53bdd539a066"/>
# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import isChromatic from "chromatic/isChromatic";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { modes } from "../../.storybook/modes";
import { Button } from "../../src/components/Button";
import { ProgressCircle } from "../../src/components/Progress";
import type { SnackbarOptions } from "../../src/components/Snackbar";
import { snackbar } from "../../src/components/Snackbar";
import { Link } from "../../src/components/Text";
import { Stack } from "../_utils/components";

export default {
  title: "components/Snackbar",
  args: {
    message: "Some message",
  },
  render: (props) => <Button onClick={() => snackbar.show(props)}>Show</Button>,
} satisfies Meta<SnackbarOptions>;

type Story = StoryObj<SnackbarOptions>;

const ALL_COLORS: SnackbarOptions["color"][] = ["neutral", "danger"];
export const Color = {
  render: (props) => (
    <Stack direction="row">
      {ALL_COLORS.map((color) => (
        <Button
          onClick={() =>
            snackbar.show({
              ...props,
              color,
            })
          }
          key={color}
        >
          Show {color}
        </Button>
      ))}
    </Stack>
  ),
} satisfies Story;

export const Icon = {
  ...Cover,
  args: {
    icon: <ProgressCircle />,
  },
} satisfies Story;

export const WithActionButton = {
  ...Cover,
  args: {
    action: <Button>Button</Button>,
  },
} satisfies Story;

export const WithActionLink = {
  ...Cover,
  args: {
    action: <Link href="#">Link</Link>,
  },
} satisfies Story;

export const AutoDismiss = {
  args: {
    color: "danger",
    autoDismiss: false,
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
