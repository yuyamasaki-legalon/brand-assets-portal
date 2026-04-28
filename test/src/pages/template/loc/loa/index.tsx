import {
  LfAiSparkles,
  LfBook,
  LfCopy,
  LfEarth,
  LfFile,
  LfFlag,
  LfFolder,
  LfPlusLarge,
  LfSend,
  LfSquareFill,
  LfThumbsDown,
  LfThumbsUp,
} from "@legalforce/aegis-icons";
import {
  Avatar,
  Button,
  ButtonGroup,
  Divider,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  ProgressCircle,
  Tag,
  Text,
  Textarea,
  Tooltip,
} from "@legalforce/aegis-react";
import type { CSSProperties, FC } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LocSidebarLayout } from "../_shared";
import { type Message, mockConversation } from "./mock/data";

// =============================================================================
// Styles
// =============================================================================

const styles: Record<string, CSSProperties> = {
  // New conversation form - vertically centered
  newFormCenter: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    blockSize: "100%",
    paddingInline: "var(--aegis-space-large)",
  },
  newFormInner: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
    inlineSize: "100%",
    maxInlineSize: "var(--aegis-layout-width-large)",
  },
  welcomeText: {
    textAlign: "center",
  },
  formArea: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xSmall)",
    inlineSize: "100%",
  },
  promptLibraryRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
  // Input toolbar (shared)
  inputToolbar: {
    inlineSize: "100%",
    padding: "var(--aegis-space-xSmall)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // Conversation message list
  messageList: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
    inlineSize: "100%",
    maxInlineSize: "var(--aegis-layout-width-x3Large)",
    marginInline: "auto",
    paddingBlockStart: "var(--aegis-space-large)",
  },
  // User message
  userMessageOuter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "var(--aegis-space-xxSmall)",
  },
  userBubble: {
    maxInlineSize: "80%",
    padding: "var(--aegis-space-small) var(--aegis-space-medium)",
    background: "var(--aegis-color-background-neutral-subtle)",
    border: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
    borderRadius: "var(--aegis-radius-large)",
  },
  // Assistant message
  assistantOuter: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xSmall)",
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
  // Actions below assistant message
  messageActions: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xSmall)",
    paddingInlineStart: "var(--aegis-space-x3Large)",
  },
  referencesContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--aegis-space-xSmall)",
    paddingInlineStart: "var(--aegis-space-x3Large)",
  },
  // Footer
  footerContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xSmall)",
    inlineSize: "100%",
    maxInlineSize: "var(--aegis-layout-width-x3Large)",
    marginInline: "auto",
  },
  disclaimer: {
    textAlign: "center",
    paddingBlock: "var(--aegis-space-xSmall)",
  },
};

// =============================================================================
// Sub-components
// =============================================================================

const InputToolbar: FC<{ disabled?: boolean; isStreaming?: boolean }> = ({ disabled, isStreaming }) => (
  <div style={styles.inputToolbar}>
    <ButtonGroup variant="plain" size="small">
      <Tooltip title="データソースを選択する">
        <IconButton aria-label="データソースを選択する">
          <Icon>
            <LfPlusLarge />
          </Icon>
        </IconButton>
      </Tooltip>
      <Button variant="plain" size="small" leading={LfEarth}>
        すべてのソース
      </Button>
    </ButtonGroup>
    <ButtonGroup variant="solid" size="small">
      {isStreaming ? (
        <Tooltip title="回答生成をキャンセルする">
          <IconButton aria-label="回答生成をキャンセルする">
            <Icon>
              <LfSquareFill />
            </Icon>
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="送信">
          <IconButton aria-label="送信" disabled={disabled}>
            <Icon>
              <LfSend />
            </Icon>
          </IconButton>
        </Tooltip>
      )}
    </ButtonGroup>
  </div>
);

const PromptLibraryButton: FC = () => {
  const navigate = useNavigate();
  return (
    <div style={styles.promptLibraryRow}>
      <Button
        variant="plain"
        size="small"
        leading={LfBook}
        onClick={() => navigate("/template/loc/loa/prompt-library")}
      >
        プロンプトライブラリー
      </Button>
    </div>
  );
};

const UserMessage: FC<{ message: Message }> = ({ message }) => (
  <div style={styles.userMessageOuter}>
    <div style={styles.userBubble}>
      <Text whiteSpace="pre-wrap">{message.content}</Text>
    </div>
    <Button variant="plain" size="small" leading={LfFlag}>
      保存
    </Button>
  </div>
);

const AssistantMessage: FC<{ message: Message }> = ({ message }) => (
  <div style={styles.assistantOuter}>
    <div style={styles.assistantRow}>
      <Avatar name="LegalOn アシスタント" src={LfAiSparkles} color="brand" size="medium" />
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
      <>
        <div style={styles.messageActions}>
          <ButtonGroup variant="plain" size="small">
            <Tooltip title="回答をコピーする">
              <IconButton aria-label="回答をコピーする">
                <Icon>
                  <LfCopy />
                </Icon>
              </IconButton>
            </Tooltip>
          </ButtonGroup>
          <Divider orientation="vertical" />
          <ButtonGroup variant="plain" size="small">
            <Tooltip title="この回答は役に立ったと評価する">
              <IconButton aria-label="この回答は役に立ったと評価する">
                <Icon>
                  <LfThumbsUp />
                </Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="この回答は役に立たなかったと評価する">
              <IconButton aria-label="この回答は役に立たなかったと評価する">
                <Icon>
                  <LfThumbsDown />
                </Icon>
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </div>
        {message.references && message.references.length > 0 && (
          <div style={styles.referencesContainer}>
            {message.references.map((ref) => (
              <Tag key={ref.id} color="neutral">
                <Icon size="xSmall">{ref.type === "file" ? <LfFile /> : <LfFolder />}</Icon>
                {ref.title}
              </Tag>
            ))}
          </div>
        )}
      </>
    )}
  </div>
);

// =============================================================================
// Views
// =============================================================================

const NewConversationView: FC<{
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
}> = ({ inputValue, onInputChange, onSubmit }) => (
  <PageLayout scrollBehavior="inside">
    <PageLayoutContent scrollBehavior="inside">
      <PageLayoutBody>
        <div style={styles.newFormCenter}>
          <div style={styles.newFormInner}>
            <div style={styles.welcomeText}>
              <Text variant="title.medium">
                LegalOnアシスタントです。
                <br />
                何かお手伝いすることはありますか?
              </Text>
            </div>
            <div style={styles.formArea}>
              <PromptLibraryButton />
              <Textarea
                aria-label="契約書や契約一般の質問入力"
                placeholder="契約書や契約一般の質問を入力"
                minRows={2}
                maxRows={10}
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && inputValue.trim()) {
                    e.preventDefault();
                    onSubmit();
                  }
                }}
                trailing={<InputToolbar disabled={inputValue.trim().length === 0} />}
              />
            </div>
          </div>
        </div>
      </PageLayoutBody>
    </PageLayoutContent>
  </PageLayout>
);

const ConversationView: FC<{
  messages: Message[];
  inputValue: string;
  onInputChange: (value: string) => void;
}> = ({ messages, inputValue, onInputChange }) => {
  const isStreaming = messages.some((m) => m.status === "loading");

  return (
    <PageLayout scrollBehavior="inside">
      <PageLayoutContent scrollBehavior="inside">
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
          <div style={styles.footerContainer}>
            <PromptLibraryButton />
            <Textarea
              aria-label="契約書や契約一般の質問入力"
              placeholder="契約書や契約一般の質問を入力"
              minRows={2}
              maxRows={10}
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              disabled={isStreaming}
              trailing={<InputToolbar disabled={inputValue.trim().length === 0} isStreaming={isStreaming} />}
            />
            <div style={styles.disclaimer}>
              <Text variant="body.xSmall" color="subtle">
                回答はあくまで参考情報であり、お客様による判断が必要です。法律的見解が必要な事項については弁護士にご相談ください。
              </Text>
            </div>
          </div>
        </PageLayoutFooter>
      </PageLayoutContent>
    </PageLayout>
  );
};

// =============================================================================
// Main Component
// =============================================================================

export const LoaTemplate: FC = () => {
  const location = useLocation();
  const navigationState = location.state as { conversationId?: string } | null;
  const [viewState, setViewState] = useState<"new" | "conversation">(() =>
    navigationState?.conversationId ? "conversation" : "new",
  );
  const [messages] = useState<Message[]>(mockConversation);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setViewState("conversation");
      setInputValue("");
    }
  };

  return (
    <LocSidebarLayout activeId="assistant">
      {viewState === "new" ? (
        <NewConversationView inputValue={inputValue} onInputChange={setInputValue} onSubmit={handleSubmit} />
      ) : (
        <ConversationView messages={messages} inputValue={inputValue} onInputChange={setInputValue} />
      )}
    </LocSidebarLayout>
  );
};

export default LoaTemplate;
