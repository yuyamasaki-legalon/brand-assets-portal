import {
  LfAiSparkles,
  LfClip,
  LfCopy,
  LfLayoutHorizon,
  LfSend,
  LfSetting,
  LfThumbsDown,
  LfThumbsUp,
} from "@legalforce/aegis-icons";
import {
  Avatar,
  ButtonGroup,
  ContentHeader,
  ContentHeaderTitle,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  PageLayoutHeader,
  PageLayoutPane,
  ProgressCircle,
  Text,
  Textarea,
  Tooltip,
} from "@legalforce/aegis-react";
import type { CSSProperties, FC, ReactNode } from "react";
import { useState } from "react";
import { StartSidebar } from "../../../components/StartSidebar";

// =============================================================================
// Types
// =============================================================================

type MessageRole = "user" | "assistant";
type MessageStatus = "complete" | "loading";

type Message = {
  id: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
};

// =============================================================================
// Mock Data
// =============================================================================

const mockMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "秘密保持契約書のレビューポイントを教えてください。",
    status: "complete",
  },
  {
    id: "2",
    role: "assistant",
    content:
      "秘密保持契約書（NDA）の主なレビューポイントは以下の通りです。\n\n1. **秘密情報の定義** — 開示される情報の範囲が明確か、除外事項は適切か\n2. **秘密保持義務の範囲** — 受領者の義務が過度に広くないか\n3. **目的外使用の禁止** — 使用目的が明確に限定されているか\n4. **有効期間** — 契約期間と秘密保持義務の存続期間が適切か\n5. **返還・廃棄義務** — 契約終了時の情報の取り扱いが明記されているか\n6. **損害賠償** — 違反時の責任範囲が合理的か",
    status: "complete",
  },
  {
    id: "3",
    role: "user",
    content: "競業避止義務条項が含まれている場合の注意点は？",
    status: "complete",
  },
  {
    id: "4",
    role: "assistant",
    content:
      "NDAに競業避止義務が含まれている場合、以下の点に注意が必要です。\n\n**制限の合理性**\n- 地理的範囲が過度に広くないか\n- 制限期間が不当に長くないか（一般的に1〜2年が目安）\n- 制限される業務の範囲が明確か\n\n**法的リスク**\n- 職業選択の自由（憲法22条）との関係で無効とされる可能性\n- 独占禁止法上の不公正な取引方法に該当する可能性\n\n対価や合理的な範囲の限定がない場合、条項の削除または修正を検討すべきです。",
    status: "complete",
  },
  {
    id: "5",
    role: "user",
    content: "ありがとうございます。この契約書の修正案を作成してもらえますか？",
    status: "complete",
  },
  {
    id: "6",
    role: "assistant",
    content: "",
    status: "loading",
  },
];

// =============================================================================
// Styles
// =============================================================================

const styles: Record<string, CSSProperties> = {
  messageList: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
    inlineSize: "100%",
    maxInlineSize: "var(--aegis-layout-width-large)",
    marginInline: "auto",
    paddingBlockStart: "var(--aegis-space-large)",
  },
  userBubble: {
    maxInlineSize: "80%",
    padding: "var(--aegis-space-small) var(--aegis-space-medium)",
    background: "var(--aegis-color-background-neutral-subtle)",
    border: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
    borderRadius: "var(--aegis-radius-large)",
  },
  assistantRow: {
    display: "flex",
    gap: "var(--aegis-space-xSmall)",
    alignItems: "flex-start",
  },
  assistantContent: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
    flex: 1,
  },
  loadingRow: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xSmall)",
  },
  messageActions: {
    display: "flex",
    gap: "var(--aegis-space-xxSmall)",
    paddingInlineStart: "var(--aegis-space-x3Large)",
  },
  footerContainer: {
    inlineSize: "100%",
    maxInlineSize: "var(--aegis-layout-width-large)",
    marginInline: "auto",
  },
  inputToolbar: {
    inlineSize: "100%",
    padding: "var(--aegis-space-xSmall)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  disclaimer: {
    textAlign: "center",
    paddingBlock: "var(--aegis-space-xSmall)",
  },
};

// =============================================================================
// Sub-components
// =============================================================================

const UserMessage: FC<{ message: Message }> = ({ message }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
    <div style={styles.userBubble}>
      <Text whiteSpace="pre-wrap">{message.content}</Text>
    </div>
  </div>
);

const AssistantMessage: FC<{ message: Message }> = ({ message }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
    <div style={styles.assistantRow}>
      <Avatar name="AI Assistant" src={LfAiSparkles} color="brand" size="medium" />
      <div style={styles.assistantContent}>
        {message.status === "loading" ? (
          <div style={styles.loadingRow}>
            <ProgressCircle size="small" />
            <Text color="subtle">回答を生成中...</Text>
          </div>
        ) : (
          <Text whiteSpace="pre-wrap">{message.content}</Text>
        )}
      </div>
    </div>
    {message.status === "complete" && (
      <div style={styles.messageActions}>
        <ButtonGroup variant="plain" size="small">
          <Tooltip title="コピー">
            <IconButton aria-label="コピー">
              <Icon>
                <LfCopy />
              </Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="いいね">
            <IconButton aria-label="いいね">
              <Icon>
                <LfThumbsUp />
              </Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="よくないね">
            <IconButton aria-label="よくないね">
              <Icon>
                <LfThumbsDown />
              </Icon>
            </IconButton>
          </Tooltip>
        </ButtonGroup>
      </div>
    )}
  </div>
);

const ChatInput: FC<{ children?: ReactNode }> = ({ children }) => {
  const [inputValue, setInputValue] = useState("");
  return (
    <div style={styles.footerContainer}>
      {children}
      <Textarea
        aria-label="メッセージを入力"
        placeholder="メッセージを入力"
        minRows={2}
        maxRows={10}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        trailing={
          <div style={styles.inputToolbar}>
            <ButtonGroup variant="plain" size="small">
              <Tooltip title="ファイルを添付">
                <IconButton aria-label="ファイルを添付">
                  <Icon>
                    <LfClip />
                  </Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title="設定">
                <IconButton aria-label="設定">
                  <Icon>
                    <LfSetting />
                  </Icon>
                </IconButton>
              </Tooltip>
            </ButtonGroup>
            <Tooltip title="送信">
              <IconButton size="small" aria-label="送信">
                <Icon>
                  <LfSend />
                </Icon>
              </IconButton>
            </Tooltip>
          </div>
        }
      />
      <div style={styles.disclaimer}>
        <Text variant="body.xSmall" color="subtle">
          回答はあくまで参考情報であり、専門家への確認が必要な場合があります。
        </Text>
      </div>
    </div>
  );
};

// =============================================================================
// Main Component
// =============================================================================

/**
 * Chat Layout Template
 *
 * A generic chat/conversation UI pattern featuring:
 * - Sidebar navigation
 * - Message list with user/assistant bubbles
 * - Streaming response indicator
 * - Message action buttons (copy, like, dislike)
 * - Sticky input area with file attach and settings
 * - Optional side pane for context/details
 */
export const ChatLayoutTemplate: FC = () => {
  const [paneOpen, setPaneOpen] = useState(false);
  const [messages] = useState<Message[]>(mockMessages);

  return (
    <PageLayout scrollBehavior="inside">
      <StartSidebar />
      <PageLayoutContent scrollBehavior="inside">
        <PageLayoutHeader>
          <ContentHeader
            size="medium"
            trailing={
              <Tooltip title="パネルを開く">
                <IconButton size="small" aria-label="パネルを開く" onClick={() => setPaneOpen((prev) => !prev)}>
                  <Icon>
                    <LfLayoutHorizon />
                  </Icon>
                </IconButton>
              </Tooltip>
            }
          >
            <ContentHeaderTitle>Chat</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={styles.messageList}>
            {messages.map((message) =>
              message.role === "user" ? (
                <UserMessage key={message.id} message={message} />
              ) : (
                <AssistantMessage key={message.id} message={message} />
              ),
            )}
          </div>
        </PageLayoutBody>
        <PageLayoutFooter gutterless>
          <ChatInput />
        </PageLayoutFooter>
      </PageLayoutContent>
      <PageLayoutPane position="end" open={paneOpen} resizable maxWidth="x5Large" minWidth="small" width="large">
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>コンテキスト</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-medium)",
              padding: "var(--aegis-space-medium)",
            }}
          >
            <Text variant="label.medium.bold">参照ドキュメント</Text>
            <Text variant="body.small" color="subtle">
              会話に関連するドキュメントやコンテキスト情報がここに表示されます。
            </Text>
          </div>
        </PageLayoutBody>
      </PageLayoutPane>
    </PageLayout>
  );
};

export default ChatLayoutTemplate;
