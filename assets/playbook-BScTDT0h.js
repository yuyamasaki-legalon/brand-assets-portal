var e=`import {
  LfAiSparkles,
  LfArrowUpRightFromSquare,
  LfCheckCircleFill,
  LfCheckLarge,
  LfCloseLarge,
  LfCopy,
  LfFile,
  LfHistory,
  LfPlusLarge,
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
  Card,
  CardBody,
  CardFooter,
  Divider,
  FormControl,
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
  RadioCard,
  RadioGroup,
  Select,
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
import classes from "./index.module.css";
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "var(--aegis-space-medium)",
  },
  availabilityInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--aegis-space-small)",
  },
  availabilityLimit: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xxSmall)",
  },
  improvementsCenter: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    blockSize: "100%",
    paddingInline: "var(--aegis-space-large)",
  },
  improvementsOuter: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
    inlineSize: "100%",
    maxInlineSize: "800px",
    marginInline: "auto",
    marginBlockStart: "var(--aegis-space-medium)",
  },
  improvementsInputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xSmall)",
    inlineSize: "100%",
    maxInlineSize: "800px",
    marginInline: "auto",
  },
  improvementsFooterCaption: {
    textAlign: "center",
  },
  initialUploadWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xLarge)",
    inlineSize: "100%",
    maxInlineSize: "var(--aegis-layout-width-large)",
    marginInline: "auto",
    marginBlockStart: "var(--aegis-space-medium)",
  },
  initialUploadHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xLarge)",
  },
  initialUploadTitleBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xSmall)",
  },
  initialUploadCreationMethod: {
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr)",
    gap: "var(--aegis-space-xxSmall) var(--aegis-space-xSmall)",
    alignItems: "center",
  },
  initialUploadCreationMethodLabel: {
    gridColumn: 2,
  },
  uploadCardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
  },
  uploadCardTitleRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "var(--aegis-space-xSmall)",
  },
  submittedSummary: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
    maxInlineSize: "100%",
  },
  submittedSummaryTitleRow: {
    display: "flex",
    gap: "var(--aegis-space-xSmall)",
    alignItems: "center",
  },
  submittedFileList: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xxSmall)",
    inlineSize: "min(100%, 430px)",
    minInlineSize: 0,
    paddingInlineStart: "var(--aegis-space-xLarge)",
  },
  submittedFileChip: {
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr)",
    gap: "var(--aegis-space-xSmall)",
    alignItems: "center",
    minInlineSize: 0,
    paddingBlock: "var(--aegis-space-xSmall)",
    paddingInline: "var(--aegis-space-small)",
    border: "var(--aegis-border-width-thin) solid var(--aegis-color-border-neutral-subtle)",
    borderRadius: "var(--aegis-radius-small)",
  },
  positionConfirmRoot: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
    inlineSize: "100%",
  },
  positionConfirmFieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
  },
  improvementsBodyContent: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xxSmall)",
  },
  improvementsCardMenuContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
  },
  hubSelectionRoot: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
    inlineSize: "100%",
  },
  radioCardContent: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xxSmall)",
    minInlineSize: 0,
  },
  summaryRoot: {
    display: "inline-flex",
    flexWrap: "wrap",
    gap: "var(--aegis-space-xxSmall)",
    alignItems: "center",
    maxInlineSize: "100%",
    paddingBlock: "var(--aegis-space-xSmall)",
    paddingInline: "var(--aegis-space-small)",
    background: "var(--aegis-color-background-neutral-xSubtle)",
    borderRadius: "var(--aegis-radius-small)",
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

const ConversationCreationAvailabilityInfo: FC<{ isLimitReached: boolean }> = ({ isLimitReached }) =>
  isLimitReached ? (
    <div style={{ ...styles.availabilityInfo, flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
      <div style={styles.availabilityLimit}>
        <Icon size="small">
          <LfHistory />
        </Icon>
        <Text color="subtle" variant="caption.small">
          利用上限に達しました。来月1日にリセットされます。
        </Text>
      </div>
      <Link
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        trailing={
          <Icon size="xSmall">
            <LfArrowUpRightFromSquare />
          </Icon>
        }
      >
        <Text variant="body.small">試用版の詳細</Text>
      </Link>
    </div>
  ) : (
    <div style={styles.availabilityInfo}>
      <Text color="subtle" variant="caption.small">
        今月の利用回数：あと3回（全3回）
      </Text>
      <Link
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        trailing={
          <Icon size="xSmall">
            <LfArrowUpRightFromSquare />
          </Icon>
        }
      >
        <Text variant="body.small">試用版の詳細</Text>
      </Link>
    </div>
  );

type PlaybookCreationMethod = "contract" | "criteria" | "combined";

type CreationMethodViewModel = {
  method: PlaybookCreationMethod;
  label: string;
  labelKeyword: string;
  description: string;
};

const CREATION_METHODS: CreationMethodViewModel[] = [
  {
    method: "contract",
    label: "契約書をもとに作成",
    labelKeyword: "契約書",
    description: "ひな形・過去の契約書・修正履歴をもとに生成",
  },
  {
    method: "criteria",
    label: "自社の審査基準をもとに作成",
    labelKeyword: "自社の審査基準",
    description: "社内ルールをもとに生成",
  },
  {
    method: "combined",
    label: "契約書と自社の審査基準をもとに作成",
    labelKeyword: "契約書と自社の審査基準",
    description: "より精度が高いプレイブックを生成",
  },
];

const MethodLabel: FC<{ label: string; keyword: string }> = ({ label, keyword }) => {
  const keywordStartIndex = label.indexOf(keyword);
  if (keywordStartIndex < 0) {
    return <>{label}</>;
  }
  return (
    <>
      {label.slice(0, keywordStartIndex)}
      <strong style={{ fontWeight: "bold" }}>{keyword}</strong>
      {label.slice(keywordStartIndex + keyword.length)}
    </>
  );
};

const PlaybookHubSelectionWidget: FC<{
  disabled?: boolean;
  submittedMethodLabel?: string;
  onSubmitCreationMethod: (method: PlaybookCreationMethod, label: string) => void;
}> = ({ disabled = false, submittedMethodLabel, onSubmitCreationMethod }) => {
  const [selectedMethod, setSelectedMethod] = useState<PlaybookCreationMethod>("contract");

  if (submittedMethodLabel !== undefined) {
    return (
      <div style={styles.summaryRoot}>
        <Text variant="body.medium.bold">作成方法：</Text>
        <Text variant="body.medium">{submittedMethodLabel}</Text>
      </div>
    );
  }

  const selected = CREATION_METHODS.find(({ method }) => method === selectedMethod);

  return (
    <Card variant="outline">
      <CardBody>
        <div style={styles.hubSelectionRoot}>
          <Text variant="body.large.bold">プレイブックの作成方法を選択</Text>
          <div className={classes.creationMethodList}>
            <RadioGroup
              value={selectedMethod}
              onChange={(value) => {
                const next = CREATION_METHODS.find(({ method }) => method === value);
                if (next) setSelectedMethod(next.method);
              }}
              orientation="vertical"
            >
              {CREATION_METHODS.map(({ method, label, labelKeyword, description }) => (
                <RadioCard key={method} value={method} variant="outline" aria-label={\`\${label} \${description}\`}>
                  <div style={styles.radioCardContent}>
                    <Text variant="body.large">
                      <MethodLabel label={label} keyword={labelKeyword} />
                    </Text>
                    <Text variant="body.medium" color="subtle">
                      {description}
                    </Text>
                  </div>
                </RadioCard>
              ))}
            </RadioGroup>
          </div>
        </div>
      </CardBody>
      <CardFooter>
        <Button
          className={classes.proceedButton}
          variant="solid"
          size="medium"
          disabled={disabled || !selected}
          onClick={() => selected && onSubmitCreationMethod(selected.method, selected.label)}
        >
          進む
        </Button>
      </CardFooter>
    </Card>
  );
};

const METHOD_UPLOAD_SECTIONS: Record<PlaybookCreationMethod, { title: string; caption: string; description: string }> =
  {
    contract: {
      title: "契約書を追加",
      caption: "対応形式：docx / pdf",
      description: "契約書のひな形・過去の契約書・修正履歴をもとに、プレイブックを生成できます。",
    },
    criteria: {
      title: "自社の審査基準を追加",
      caption: "対応形式：docx / xlsx",
      description: "社内ルールをもとに、プレイブックを生成できます。",
    },
    combined: {
      title: "契約書を追加",
      caption: "対応形式：docx / pdf",
      description: "契約書のひな形・過去の契約書・修正履歴をもとに、プレイブックを生成できます。",
    },
  };

const InitialUploadPageHeader: FC<{ methodLabel: string }> = ({ methodLabel }) => (
  <header style={styles.initialUploadHeader}>
    <div style={styles.initialUploadTitleBlock}>
      <Text variant="title.large">プレイブックを作成しましょう</Text>
      <Text variant="body.large">LegalOnのレビューで使えるプレイブックを作成します。</Text>
    </div>
    <div style={styles.initialUploadCreationMethod}>
      <Icon color="bold" size="medium">
        <LfCheckCircleFill />
      </Icon>
      <Text variant="body.large.bold">作成方法</Text>
      <div style={styles.initialUploadCreationMethodLabel}>
        <Text variant="body.large">{methodLabel}</Text>
      </div>
    </div>
  </header>
);

const SubmittedFilesSummary: FC<{ files: readonly string[] }> = ({ files }) => (
  <div style={styles.submittedSummary}>
    <div style={styles.submittedSummaryTitleRow}>
      <Icon color="bold" size="medium">
        <LfCheckCircleFill />
      </Icon>
      <Text variant="body.large.bold">参考ファイル：</Text>
    </div>
    <div style={styles.submittedFileList}>
      {files.map((fileName) => (
        <span key={fileName} style={styles.submittedFileChip}>
          <Icon size="small">
            <LfFile />
          </Icon>
          <Text variant="body.small" numberOfLines={1}>
            {fileName}
          </Text>
        </span>
      ))}
    </div>
  </div>
);

const POSITION_OPTIONS = [
  { value: "受領側", label: "受領側" },
  { value: "開示側", label: "開示側" },
  { value: "その他", label: "その他" },
];

const PositionConfirmWidget: FC<{
  initialValue?: string;
  onSubmit: (partyPosition: string) => void;
}> = ({ initialValue = "受領側", onSubmit }) => {
  const [position, setPosition] = useState(initialValue);
  return (
    <div style={styles.positionConfirmRoot}>
      <Text variant="body.large" whiteSpace="pre-wrap">
        ファイルをもとに契約の立場を推定しました。問題なければ生成を開始します。{"\\n"}
        変更する場合は下記から修正できます。
      </Text>
      <Card variant="outline">
        <CardBody>
          <div style={styles.positionConfirmFieldGroup}>
            <FormControl required>
              <FormControl.Label>自社の立場</FormControl.Label>
              <Select options={POSITION_OPTIONS} value={position} onChange={setPosition} width="full" />
            </FormControl>
          </div>
        </CardBody>
        <CardFooter>
          <div className={classes.submitButtonWrapper}>
            <Button variant="solid" color="neutral" disabled={position.length === 0} onClick={() => onSubmit(position)}>
              生成開始
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

const PositionConfirmView: FC<{
  methodLabel: string;
  submittedFiles: readonly string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: (partyPosition: string) => void;
}> = ({ methodLabel, submittedFiles, inputValue, onInputChange, onSubmit }) => (
  <PageLayout scrollBehavior="inside">
    <PageLayoutContent scrollBehavior="inside">
      <PageLayoutBody>
        <div style={styles.initialUploadWrapper}>
          <InitialUploadPageHeader methodLabel={methodLabel} />
          <SubmittedFilesSummary files={submittedFiles} />
          <PositionConfirmWidget onSubmit={onSubmit} />
        </div>
      </PageLayoutBody>
      <PageLayoutFooter gutterless>
        <div style={styles.improvementsInputContainer}>
          <Textarea
            aria-label="プレイブックについて質問・指示する"
            placeholder="プレイブックについて質問・指示する"
            minRows={1}
            maxRows={10}
            value={inputValue}
            onChange={(event) => onInputChange(event.target.value)}
            trailing={<InputToolbar disabled={inputValue.trim().length === 0} />}
          />
          <div style={styles.improvementsFooterCaption}>
            <Text variant="caption.xSmall" color="subtle" whiteSpace="pre-wrap">
              回答はあくまで参考情報であり、お客様による判断が必要です。法律的見解が必要な事項については弁護士にご相談ください。
            </Text>
          </div>
        </div>
      </PageLayoutFooter>
    </PageLayoutContent>
  </PageLayout>
);

const InitialUploadView: FC<{
  method: PlaybookCreationMethod;
  methodLabel: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onProceed: () => void;
}> = ({ method, methodLabel, inputValue, onInputChange, onProceed }) => {
  const section = METHOD_UPLOAD_SECTIONS[method];
  return (
    <PageLayout scrollBehavior="inside">
      <PageLayoutContent scrollBehavior="inside">
        <PageLayoutBody>
          <div style={styles.initialUploadWrapper}>
            <InitialUploadPageHeader methodLabel={methodLabel} />
            <Card variant="outline">
              <div className={classes.uploadCard}>
                <CardBody>
                  <div style={styles.uploadCardBody}>
                    <div style={styles.uploadCardTitleRow}>
                      <Text variant="title.small">{section.title}</Text>
                      <Text variant="caption.small" color="subtle">
                        {section.caption}
                      </Text>
                    </div>
                    <Text variant="body.semiSmall" color="subtle">
                      {section.description}
                    </Text>
                    <Button
                      variant="subtle"
                      width="full"
                      leading={
                        <Icon>
                          <LfPlusLarge />
                        </Icon>
                      }
                      onClick={onProceed}
                    >
                      追加
                    </Button>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button variant="solid" color="neutral" minWidth="wide" disabled>
                    アップロード
                  </Button>
                </CardFooter>
              </div>
            </Card>
          </div>
        </PageLayoutBody>
        <PageLayoutFooter gutterless>
          <div style={styles.improvementsInputContainer}>
            <Textarea
              aria-label="プレイブックについて質問・指示する"
              placeholder="プレイブックについて質問・指示する"
              minRows={1}
              maxRows={10}
              value={inputValue}
              onChange={(event) => onInputChange(event.target.value)}
              trailing={<InputToolbar disabled={inputValue.trim().length === 0} />}
            />
            <div style={styles.improvementsFooterCaption}>
              <Text variant="caption.xSmall" color="subtle" whiteSpace="pre-wrap">
                回答はあくまで参考情報であり、お客様による判断が必要です。法律的見解が必要な事項については弁護士にご相談ください。
              </Text>
            </div>
          </div>
        </PageLayoutFooter>
      </PageLayoutContent>
    </PageLayout>
  );
};

const NewPlaybookView: FC<{
  isLimitReached: boolean;
  showAvailabilityInfo?: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onStart: (method: PlaybookCreationMethod, label: string) => void;
}> = ({ isLimitReached, showAvailabilityInfo = false, inputValue, onInputChange, onStart }) => (
  <PageLayout scrollBehavior="inside">
    <PageLayoutContent scrollBehavior="inside">
      <PageLayoutBody>
        <div style={styles.improvementsOuter}>
          <div style={styles.improvementsBodyContent}>
            <Text variant="title.large">プレイブックを作成しましょう</Text>
            <Text variant="body.large">LegalOnのレビューで使えるプレイブックを作成します。</Text>
          </div>
          <div style={styles.improvementsCardMenuContainer}>
            <PlaybookHubSelectionWidget disabled={isLimitReached} onSubmitCreationMethod={onStart} />
            {showAvailabilityInfo ? <ConversationCreationAvailabilityInfo isLimitReached={isLimitReached} /> : null}
          </div>
        </div>
      </PageLayoutBody>
      <PageLayoutFooter gutterless>
        <div style={styles.improvementsInputContainer}>
          <Textarea
            aria-label="プレイブックについて質問・指示する"
            placeholder="プレイブックについて質問・指示する"
            minRows={1}
            maxRows={10}
            value={inputValue}
            onChange={(event) => onInputChange(event.target.value)}
            disabled={isLimitReached}
            trailing={<InputToolbar disabled={inputValue.trim().length === 0} />}
          />
          <div style={styles.improvementsFooterCaption}>
            <Text variant="caption.xSmall" color="subtle" whiteSpace="pre-wrap">
              回答はあくまで参考情報であり、お客様による判断が必要です。法律的見解が必要な事項については弁護士にご相談ください。
            </Text>
          </div>
        </div>
      </PageLayoutFooter>
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
  const [viewState, setViewState] = useState<"new" | "initial-upload" | "position-confirm" | "detail" | "fullscreen">(
    "new",
  );
  const [selectedMethod, setSelectedMethod] = useState<PlaybookCreationMethod>("contract");
  const [selectedMethodLabel, setSelectedMethodLabel] = useState<string>("契約書をもとに作成");
  const [uploadedFiles] = useState<readonly string[]>(["秘密保持契約（雛形・双方中立的）のコピー.docx"]);
  const [messages] = useState<PlaybookMessage[]>(mockPlaybookConversation);
  const [playbook] = useState<PlaybookDraft>(mockPlaybookDraft);
  const [inputValue, setInputValue] = useState("");
  const [paneOpen, setPaneOpen] = useState(true);
  const [isTrialLimitReached] = useState(false);

  const handleStart = (method: PlaybookCreationMethod, label: string) => {
    setSelectedMethod(method);
    setSelectedMethodLabel(label);
    setViewState("initial-upload");
  };

  return (
    <LocSidebarLayout activeId="assistant">
      {viewState === "new" && (
        <NewPlaybookView
          isLimitReached={isTrialLimitReached}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onStart={handleStart}
        />
      )}
      {viewState === "initial-upload" && (
        <InitialUploadView
          method={selectedMethod}
          methodLabel={selectedMethodLabel}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onProceed={() => setViewState("position-confirm")}
        />
      )}
      {viewState === "position-confirm" && (
        <PositionConfirmView
          methodLabel={selectedMethodLabel}
          submittedFiles={uploadedFiles}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSubmit={() => setViewState("detail")}
        />
      )}
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
`;export{e as default};