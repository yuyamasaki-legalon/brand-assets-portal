import {
  LfAiSparkles,
  LfArrowUpRightFromSquare,
  LfCheckLarge,
  LfCloseLarge,
  LfCopy,
  LfPlusLarge,
  LfQuestionCircle,
  LfSend,
  LfSquareFill,
  LfThumbsDown,
  LfThumbsUp,
  LfTrash,
} from "@legalforce/aegis-icons";
import {
  Avatar,
  Button,
  ButtonGroup,
  Divider,
  Icon,
  IconButton,
  Link,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  PageLayoutHeader,
  PageLayoutPane,
  ProgressCircle,
  Table,
  TableContainer,
  Tag,
  Text,
  Textarea,
  Tooltip,
} from "@legalforce/aegis-react";
import type { CSSProperties, FC } from "react";
import { useState } from "react";
import { LocSidebarLayout } from "../../_shared";
import { mockPlaybookConversation, mockPlaybookDraft, type PlaybookDraft, type PlaybookMessage } from "./mock/data";

// =============================================================================
// Styles
// =============================================================================

const styles: Record<string, CSSProperties> = {
  // New page - centered
  newCenter: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    blockSize: "100%",
    paddingInline: "var(--aegis-space-large)",
  },
  newOuter: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
    inlineSize: "100%",
    maxInlineSize: "var(--aegis-layout-width-xxLarge)",
  },
  newInner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "var(--aegis-space-xSmall)",
  },
  descriptionText: {
    textAlign: "center",
    whiteSpace: "pre-wrap",
  },
  startButtonContainer: {
    display: "flex",
    justifyContent: "center",
  },
  // Conversation
  messageList: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
    inlineSize: "100%",
    maxInlineSize: "var(--aegis-layout-width-large)",
    marginInline: "auto",
    paddingBlockStart: "var(--aegis-space-large)",
  },
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
  messageActions: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xSmall)",
    paddingInlineStart: "var(--aegis-space-x3Large)",
  },
  // Footer
  footerContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xSmall)",
    inlineSize: "100%",
    maxInlineSize: "var(--aegis-layout-width-large)",
    marginInline: "auto",
  },
  disclaimer: {
    textAlign: "center",
    paddingBlock: "var(--aegis-space-xSmall)",
  },
  // Input toolbar
  inputToolbar: {
    inlineSize: "100%",
    padding: "var(--aegis-space-xSmall)",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  // Canvas pane
  canvasHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  canvasHeaderActions: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xxSmall)",
  },
  alertCell: {
    whiteSpace: "pre-wrap",
    verticalAlign: "top",
  },
};

// =============================================================================
// Sub-components
// =============================================================================

const InputToolbar: FC<{ disabled?: boolean; isStreaming?: boolean }> = ({ disabled, isStreaming }) => (
  <div style={styles.inputToolbar}>
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

const UserMessage: FC<{ message: PlaybookMessage }> = ({ message }) => (
  <div style={styles.userMessageOuter}>
    <div style={styles.userBubble}>
      <Text whiteSpace="pre-wrap">{message.content}</Text>
    </div>
  </div>
);

const AssistantMessage: FC<{ message: PlaybookMessage }> = ({ message }) => (
  <div style={styles.assistantOuter}>
    <div style={styles.assistantRow}>
      <Avatar name="プレイブックエージェント" src={LfAiSparkles} color="brand" size="medium" />
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
    )}
  </div>
);

// =============================================================================
// Canvas (Playbook Editor Table)
// =============================================================================

const ALERT_COLUMNS = [
  { key: "playbookInstruction" as const, label: "レビュー指示" },
  { key: "sourceSnippet" as const, label: "元となる条文・基準" },
  { key: "modelLanguage" as const, label: "推奨文言" },
  { key: "fallbackPosition" as const, label: "代替案" },
  { key: "other" as const, label: "その他" },
];

const PlaybookCanvasContent: FC<{
  playbook: PlaybookDraft;
  onClose?: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}> = ({ playbook, onClose, onToggleFullscreen, isFullscreen }) => (
  <>
    <PageLayoutHeader>
      <div style={styles.canvasHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
          <Text variant="title.xSmall">{playbook.title}</Text>
          <Tag color={playbook.status === "draft" ? "yellow" : "teal"} variant="fill">
            {playbook.status === "draft" ? "ドラフト" : "確定済み"}
          </Tag>
        </div>
        <div style={styles.canvasHeaderActions}>
          <Button variant="solid" size="small" leading={LfCheckLarge}>
            確定する
          </Button>
          {onToggleFullscreen && (
            <Tooltip title={isFullscreen ? "元に戻す" : "全画面表示"}>
              <IconButton aria-label={isFullscreen ? "元に戻す" : "全画面表示"} onClick={onToggleFullscreen}>
                <Icon>
                  <LfArrowUpRightFromSquare />
                </Icon>
              </IconButton>
            </Tooltip>
          )}
          {onClose && (
            <Tooltip title="閉じる">
              <IconButton aria-label="閉じる" onClick={onClose}>
                <Icon>
                  <LfCloseLarge />
                </Icon>
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
    </PageLayoutHeader>
    <Divider />
    <PageLayoutBody>
      <TableContainer>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell as="th">No.</Table.Cell>
              {ALERT_COLUMNS.map((col) => (
                <Table.Cell as="th" key={col.key}>
                  {col.label}
                </Table.Cell>
              ))}
              <Table.Cell as="th" />
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {playbook.alerts.map((alert, index) => (
              <Table.Row key={alert.id}>
                <Table.Cell>{index + 1}</Table.Cell>
                {ALERT_COLUMNS.map((col) => (
                  <Table.Cell key={col.key} style={styles.alertCell}>
                    <Text variant="body.small" whiteSpace="pre-wrap">
                      {alert[col.key]}
                    </Text>
                  </Table.Cell>
                ))}
                <Table.ActionCell>
                  <Tooltip title="削除">
                    <IconButton aria-label="削除" variant="plain" size="small">
                      <Icon>
                        <LfTrash />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </Table.ActionCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </TableContainer>
      <div style={{ paddingBlockStart: "var(--aegis-space-medium)" }}>
        <Button variant="plain" size="small" leading={LfPlusLarge}>
          アラートを追加
        </Button>
      </div>
    </PageLayoutBody>
  </>
);

// =============================================================================
// Views
// =============================================================================

const NewPlaybookView: FC<{ onStart: () => void }> = ({ onStart }) => (
  <PageLayout scrollBehavior="inside">
    <PageLayoutContent scrollBehavior="inside">
      <PageLayoutBody>
        <div style={styles.newCenter}>
          <div style={styles.newOuter}>
            <div style={styles.newInner}>
              <Avatar name="プレイブックエージェント" src={LfAiSparkles} color="brand" size="large" />
              <Text variant="title.large">プレイブックを作成しましょう</Text>
              <div style={styles.descriptionText}>
                <Text variant="body.large" color="subtle">
                  プレイブックエージェントは、契約書のひな形や自社の審査基準をもとに
                  LegalOnのレビューで使えるプレイブックを作成します。
                </Text>
              </div>
              <Link
                href="#"
                leading={
                  <Icon size="xSmall">
                    <LfQuestionCircle />
                  </Icon>
                }
                trailing={
                  <Icon size="xSmall">
                    <LfArrowUpRightFromSquare />
                  </Icon>
                }
              >
                <Text variant="body.small">プレイブックについて</Text>
              </Link>
            </div>
            <div style={styles.startButtonContainer}>
              <Button size="large" width="full" onClick={onStart}>
                作業を開始
              </Button>
            </div>
          </div>
        </div>
      </PageLayoutBody>
    </PageLayoutContent>
  </PageLayout>
);

const PlaybookDetailView: FC<{
  messages: PlaybookMessage[];
  playbook: PlaybookDraft;
  inputValue: string;
  onInputChange: (value: string) => void;
  paneOpen: boolean;
  onPaneOpenChange: (open: boolean) => void;
  onFullscreen: () => void;
}> = ({ messages, playbook, inputValue, onInputChange, paneOpen, onPaneOpenChange, onFullscreen }) => {
  const isStreaming = messages.some((m) => m.status === "loading");

  return (
    <PageLayout scrollBehavior="inside">
      <PageLayoutContent scrollBehavior="inside">
        <PageLayoutBody>
          <div style={styles.messageList}>
            <Button variant="plain" width="full">
              もっと見る
            </Button>
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
            <Textarea
              aria-label="プレイブックについて質問・指示する"
              placeholder="プレイブックについて質問・指示する"
              minRows={1}
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
      <PageLayoutPane
        resizable
        position="end"
        variant="outline"
        maxWidth="x5Large"
        minWidth="small"
        width="xxLarge"
        scrollBehavior="inside"
        open={paneOpen}
        onOpenChange={onPaneOpenChange}
      >
        <PlaybookCanvasContent
          playbook={playbook}
          onClose={() => onPaneOpenChange(false)}
          onToggleFullscreen={onFullscreen}
        />
      </PageLayoutPane>
    </PageLayout>
  );
};

const FullscreenCanvasView: FC<{
  playbook: PlaybookDraft;
  onExitFullscreen: () => void;
}> = ({ playbook, onExitFullscreen }) => (
  <PageLayout scrollBehavior="inside">
    <PageLayoutContent as="main" variant="outline" scrollBehavior="inside">
      <PlaybookCanvasContent playbook={playbook} onToggleFullscreen={onExitFullscreen} isFullscreen />
    </PageLayoutContent>
  </PageLayout>
);

// =============================================================================
// Main Component
// =============================================================================

export const LoaPlaybookTemplate: FC = () => {
  const [viewState, setViewState] = useState<"new" | "detail" | "fullscreen">("new");
  const [messages] = useState<PlaybookMessage[]>(mockPlaybookConversation);
  const [playbook] = useState<PlaybookDraft>(mockPlaybookDraft);
  const [inputValue, setInputValue] = useState("");
  const [paneOpen, setPaneOpen] = useState(true);

  return (
    <LocSidebarLayout activeId="assistant">
      {viewState === "new" && <NewPlaybookView onStart={() => setViewState("detail")} />}
      {viewState === "detail" && (
        <PlaybookDetailView
          messages={messages}
          playbook={playbook}
          inputValue={inputValue}
          onInputChange={setInputValue}
          paneOpen={paneOpen}
          onPaneOpenChange={setPaneOpen}
          onFullscreen={() => setViewState("fullscreen")}
        />
      )}
      {viewState === "fullscreen" && (
        <FullscreenCanvasView playbook={playbook} onExitFullscreen={() => setViewState("detail")} />
      )}
    </LocSidebarLayout>
  );
};

export default LoaPlaybookTemplate;
