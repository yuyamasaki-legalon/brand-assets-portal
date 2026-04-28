---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-8088-a7e7-d5c811f8ad0b"
category: "Feedback"
---
# Dialog

<synced_block url="https://www.notion.so/1583166957128088a7e7d5c811f8ad0b#20f316695712809e9210c3a22e44366f">
	💡 **Dialogは、重要な情報を表示したり、ユーザーの入力を求めるポップアップ型のコンポーネントです。<br>通常、ユーザーが操作を完了するまでメインの操作が中断されます。**
</synced_block>
**テキスト文言については以下を参照してください**
<mention-page url="https://www.notion.so/ce51935d1a8b4227895dc816983c0d58"/>
<mention-page url="https://www.notion.so/1662c319fd44484a9fdd4301aaa7089d"/>
---
▶# 👉Examples


---

# 実装テンプレート
**ベストプラクティスの実装例は `src/pages/template/dialog/` を参照してください。**

以下の2つのパターンを含みます：
- **ベーシックダイアログ**: 削除確認など基本的な使用例
- **StickyContainerダイアログ**: Banner を `DialogStickyContainer` に配置したエラー表示の例

---

# 使用時の注意点
<columns>
	<column>
		操作対象のオブジェクト名を本文に入れることは非推奨とします。<br>（日英言語対応の際に文章構造が異なるため）
		対象のオブジェクトをUIとして表現してください。

	</column>
	<column>
		
		
	</column>
</columns>

---

### Dialogの基本的な振る舞いについて
ユーザーがダイアログの閉じるボタンを明示的にクリックした場合、またはescキーを押下した場合のみ閉じる操作を基本とします。また、明確な理由がない限り背景をクリックしても閉じないようにしてください。

---

### サイズについて
コンテンツの量に合わせて使い分けてください。
<span color="red" discussion-urls="discussion://17431669-5712-80b6-9da8-001c769b6c92">⚠️</span><span color="red" discussion-urls="discussion://17431669-5712-80b6-9da8-001c769b6c92">**fullscreenタイプは情報量が多い場合にのみ使用してください。<br>あくまで情報量に対してのサイズ選定であり、通常のページのような複雑な操作を詰め込まないように注意してください。**</span>

---

### メインテキストとサブテキストについて
<columns>
	<column>
		<synced_block url="https://www.notion.so/1583166957128088a7e7d5c811f8ad0b#17d31669571280d7a426c6a1051cad55">
			Dialogは、<span color="red">**Head**</span> <span color="blue">**Body**</span> <span color="green">**Footer**</span> の３つの構成になっています。<br>基本的に本文はBodyに入れるようにして使用してください。
		</synced_block>
		<br>サブテキストの使用法としては、Bodyにスクロールが発生する場合などに、その影響を受けないようにしたい場合です。

	</column>
	<column>
		
		
	</column>
</columns>

---
### FooterのButtonについて
<columns>
	<column>
		Buttonがいくつの場合でもSolidをひとつ使用してください。<br>ボタンのテキストについては以下を参照してください。<br><mention-page url="https://www.notion.so/ce51935d1a8b4227895dc816983c0d58"/> 
		<mention-page url="https://www.notion.so/1662c319fd44484a9fdd4301aaa7089d"/> 
	</column>
	<column>
		
	</column>
</columns>

---

### Banner(エラー)について
<columns>
	<column>
		Bannerはbodyに入れるのではなく、必ずStickyContainer-bottomまたはStickyContainer-topに入れてください。<br>dialogのコンテンツがscrollするほど多い場合など、bannerの表示自体が見えない状態になります。<br>StickyContainer-bottomは下部に常時固定されるので、スクロールによる表示を気にする必要はありません。
	</column>
	<column>
		
	</column>
</columns>
---

# Q&A

Q: \{内容を書く\}
A: \{内容を書く\}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { useRef, useState } from "react";
import { LfInformationCircle } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import isChromatic from "chromatic/isChromatic";
import { expect, fn, within } from "storybook/test";
import { modes } from "../../.storybook/modes";
import { Button, ButtonGroup } from "../../src/components/Button";
import {
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
} from "../../src/components/ContentHeader";
import type { DialogContentOptions } from "../../src/components/Dialog";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogStickyContainer,
  DialogTrigger,
} from "../../src/components/Dialog";
import { Divider } from "../../src/components/Divider";
import { Icon } from "../../src/components/Icon";
import { ProgressOverlay } from "../../src/components/Progress";
import { Link, Text } from "../../src/components/Text";
import { Placeholder, Stack } from "../_utils/components";

const DESCRIPTION_TEXT = `Whereas recognition of the inherent dignity and of the equal and
inalienable rights of all members of the human family is the
foundation of freedom, justice and peace in the world.`;

export default {
  component: Dialog,
  args: {
    defaultOpen: isChromatic(),
    children: [
      <DialogTrigger key={0}>
        <Button>Open</Button>
      </DialogTrigger>,
      <DialogContent key={1}>
        <DialogHeader>
          <ContentHeader
            action={
              <Link
                href="#"
                leading={
                  <Icon>
                    <LfInformationCircle />
                  </Icon>
                }
              >
                Link
              </Link>
            }
          >
            <ContentHeaderTitle>Title</ContentHeaderTitle>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          <Text as="p">{DESCRIPTION_TEXT}</Text>
        </DialogBody>
        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain">Cancel</Button>
            <Button>Continue</Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>,
    ],
  },
} satisfies Meta<typeof Dialog>;

type Story = StoryObj<typeof Dialog>;

const ALL_CONTENT_WIDTH_OPTIONS: DialogContentOptions["width"][] = [
  "small",
  "medium",
  "large",
  "xLarge",
  "auto",
  "full",
];
/**
 * Use the `width` prop of `DialogContent` to set the width of it.
 */
export const ContentWidth = {
  args: {
    defaultOpen: false,
  },
  render: (props) => (
    <Stack direction="row">
      {ALL_CONTENT_WIDTH_OPTIONS.map((width) => (
        <Dialog {...props} key={width}>
          <DialogTrigger>
            <Button>Open {width}</Button>
          </DialogTrigger>
          <DialogContent width={width}>
            <DialogHeader>
              <ContentHeader
                action={
                  <Link
                    href="#"
                    leading={
                      <Icon>
                        <LfInformationCircle />
                      </Icon>
                    }
                  >
                    Link
                  </Link>
                }
              >
                <ContentHeaderTitle>Title</ContentHeaderTitle>
              </ContentHeader>
            </DialogHeader>
            <DialogBody>{DESCRIPTION_TEXT}</DialogBody>
            <DialogFooter>
              <ButtonGroup>
                <Button variant="plain">Cancel</Button>
                <Button>Continue</Button>
              </ButtonGroup>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </Stack>
  ),
} satisfies Story;

export const WithHeaderDescription = {
  args: {
    children: [
      <DialogTrigger key={0}>
        <Button>Open</Button>
      </DialogTrigger>,
      <DialogContent key={1}>
        <DialogHeader>
          <ContentHeader
            action={
              <Link
                href="#"
                leading={
                  <Icon>
                    <LfInformationCircle />
                  </Icon>
                }
              >
                Link
              </Link>
            }
          >
            <ContentHeaderTitle>Title</ContentHeaderTitle>
            <ContentHeaderDescription>
              {DESCRIPTION_TEXT}
            </ContentHeaderDescription>
          </ContentHeader>
        </DialogHeader>
        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain">Cancel</Button>
            <Button>Continue</Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>,
    ],
  },
} satisfies Story;

/**
 * `DialogBody` automatically adds a gap between the children.
 */
export const WithBodySection = {
  args: {
    children: [
      <DialogTrigger key={0}>
        <Button>Open</Button>
      </DialogTrigger>,
      <DialogContent key={1}>
        <DialogHeader>
          <ContentHeader
            action={
              <Link
                href="#"
                leading={
                  <Icon>
                    <LfInformationCircle />
                  </Icon>
                }
              >
                Link
              </Link>
            }
          >
            <ContentHeaderTitle>Title</ContentHeaderTitle>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          <Text as="p">{DESCRIPTION_TEXT}</Text>
          <Divider />
          <Text as="p">{DESCRIPTION_TEXT}</Text>
        </DialogBody>
        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain">Cancel</Button>
            <Button>Continue</Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>,
    ],
  },
} satisfies Story;

const ALL_POSItIONS = ["top", "bottom"] as const;
export const WithStickyContainer = {
  args: {
    defaultOpen: false,
  },
  render: (props) => (
    <Stack direction="row">
      {ALL_POSItIONS.map((position) => (
        <Dialog {...props} key={position}>
          <DialogTrigger>
            <Button>Open {position}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <ContentHeader>
                <ContentHeaderTitle>Title</ContentHeaderTitle>
              </ContentHeader>
            </DialogHeader>
            <DialogBody>
              {position === "top" && (
                <DialogStickyContainer>
                  <Button width="full">Button</Button>
                </DialogStickyContainer>
              )}
              {Array.from({ length: 8 }, (_, i) => (
                <Text as="p" key={i}>
                  {DESCRIPTION_TEXT}
                </Text>
              ))}
              {position === "bottom" && (
                <DialogStickyContainer position="bottom">
                  <Button width="full">Button</Button>
                </DialogStickyContainer>
              )}
            </DialogBody>
            <DialogFooter>
              <ButtonGroup>
                <Button variant="plain">Cancel</Button>
                <Button>Continue</Button>
              </ButtonGroup>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </Stack>
  ),
} satisfies Story;

export const WithCustomFooter = {
  args: {
    children: [
      <DialogTrigger key={0}>
        <Button>Open</Button>
      </DialogTrigger>,
      <DialogContent key={1}>
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>Title</ContentHeaderTitle>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          <Text as="p">{DESCRIPTION_TEXT}</Text>
        </DialogBody>
        <DialogFooter>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              rowGap: "var(--aegis-space-medium)",
            }}
          >
            <Button variant="subtle" width="full">
              Button
            </Button>
            <div style={{ marginInlineStart: "auto" }}>
              <Button variant="gutterless">Button</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>,
    ],
  },
} satisfies Story;

export const WithProgressOverlay = {
  args: {
    defaultOpen: isChromatic(),
  },
  render: (props) => {
    const [busy, setBusy] = useState(isChromatic());
    const root = useRef<HTMLDivElement>(null);

    return (
      <Dialog {...props}>
        <DialogTrigger>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>Title</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody ref={root} aria-busy={busy}>
            <Placeholder style={{ blockSize: "150vh" }}>
              Placeholder
            </Placeholder>
            <ProgressOverlay root={root} open={busy}>
              Processing...
            </ProgressOverlay>
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => setBusy((prev) => !prev)}>
              {`${busy ? "Close" : "Open"} the Progress`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
} satisfies Story;

export const EventBubbling = {
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
  args: {
    defaultOpen: true,
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
