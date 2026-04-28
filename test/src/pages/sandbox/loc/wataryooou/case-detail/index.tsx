import {
  LfAngleDownMiddle,
  LfAngleLeftMiddle,
  LfAngleRightMiddle,
  LfAngleUpMiddle,
  LfArchive,
  LfArrowRotateRight,
  LfArrowTurnUpLeft,
  LfArrowUpRightFromSquare,
  LfAt,
  LfBarSparkles,
  LfBook,
  LfClip,
  LfCloseLarge,
  LfComments,
  LfEllipsisDot,
  LfFile,
  LfInformationCircle,
  LfMagnifyingGlass,
  LfMail,
  LfMenu,
  LfPen,
  LfQuestionCircle,
  LfScaleBalanced,
  LfWand,
} from "@legalforce/aegis-icons";
import { SlackLogo } from "@legalforce/aegis-logos/react";
import {
  Avatar,
  Button,
  ContentHeader,
  DateField,
  Divider,
  Draggable,
  EmptyState,
  Form,
  FormControl,
  Header,
  Icon,
  IconButton,
  Link,
  Logo,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutSidebar,
  Select,
  SideNavigation,
  Switch,
  Tab,
  Tag,
  TagGroup,
  Text,
  Textarea,
  Tooltip,
} from "@legalforce/aegis-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";

type PaneType = "case-attribute" | "case-summary" | "linked-file" | "linked-case" | "reference" | "book";

type CaseInfoFieldId =
  | "caseType"
  | "status"
  | "assignee"
  | "subAssignees"
  | "department"
  | "requester"
  | "dueDate"
  | "space";

type CaseInfoField = {
  id: CaseInfoFieldId;
  label: string;
};

const initialCaseInfoFields: CaseInfoField[] = [
  { id: "caseType", label: "案件タイプ" },
  { id: "status", label: "案件ステータス" },
  { id: "assignee", label: "案件担当者" },
  { id: "subAssignees", label: "副担当者" },
  { id: "department", label: "依頼部署" },
  { id: "requester", label: "依頼者" },
  { id: "dueDate", label: "納期" },
  { id: "space", label: "保存先" },
];

type FormField = {
  label: string;
  value: string;
};

type TimelineEvent =
  | {
      id: string;
      type: "mail";
      sender: string;
      date: string;
      subject: string;
      content: string;
      attachments: string[];
      to: string;
    }
  | {
      id: string;
      type: "message";
      sender: string;
      date: string;
      content: string;
    }
  | {
      id: string;
      type: "status";
      sender: string;
      date: string;
      content: string;
    }
  | {
      id: string;
      type: "formSubmission";
      sender: string;
      date: string;
      formName: string;
      fields: FormField[];
    };

const caseData = {
  id: "2024-03-0020",
  title: "業務委託契約書のレビュー依頼",
  overview:
    "新規取引先との業務委託契約書について、リスク条項の確認をお願いします。特に損害賠償の上限条項と秘密保持義務の範囲についてご確認いただきたいです。\n\n取引先からの要望により、支払条件を月末締め翌月末払いから翌々月15日払いに変更する案が出ています。契約期間も1年から2年に延長予定です。\n\n下記のドラフトを確認の上、問題になりそうな点があればご連絡ください。",
  url: "https://docs.google.com/document/d/1abc123xyz",
  space: "営業部スペース",
  classification: "契約書レビュー",
  status: "法務確認中",
  requester: "高橋 健太",
  department: "営業部",
  mainAssignee: "山田 太郎",
  subAssignees: ["佐藤 花子", "鈴木 一郎"],
  dueDate: "2024-11-08",
};

const keywords = ["業務委託", "契約書レビュー", "リスク確認", "秘密保持", "損害賠償", "契約期間"];

const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    type: "mail",
    sender: "高橋 健太",
    date: "2024/10/22 18:30",
    subject: "【依頼者 → 法務】追加条件の確認依頼",
    content:
      "先日ご依頼した業務委託契約書について、取引先から追加の条件変更依頼がありました。支払条件と契約期間の変更に伴うリスクについてご確認ください。",
    attachments: ["業務委託契約書_v3.docx", "条件変更要望.pdf"],
    to: "legal@example.com",
  },
  {
    id: "2",
    type: "message",
    sender: "山田 太郎",
    date: "2024/10/22 14:15",
    content:
      "契約書を確認しました。損害賠償条項は上限金額の明記を推奨します。秘密保持条項は営業秘密に限定するか、具体的な情報カテゴリーを列挙する方向で調整できそうです。",
  },
  {
    id: "3",
    type: "status",
    sender: "システム",
    date: "2024/10/21 09:12",
    content: "案件ステータスが「対応中」に更新されました。担当者：山田 太郎",
  },
  {
    id: "4",
    type: "formSubmission",
    sender: "高橋 健太",
    date: "2024/10/18 09:30",
    formName: "案件受付フォーム",
    fields: [
      { label: "案件タイプ", value: "契約書レビュー" },
      { label: "案件名", value: "業務委託契約書のレビュー依頼" },
      { label: "依頼部署", value: "営業部" },
      { label: "依頼者", value: "高橋 健太" },
      { label: "希望納期", value: "2024/11/01" },
      {
        label: "案件概要",
        value:
          "新規取引先との業務委託契約書について、リスク条項の確認をお願いします。特に損害賠償の上限条項と秘密保持義務の範囲についてご確認いただきたいです。",
      },
      { label: "添付ファイル", value: "業務委託契約書_v1.docx" },
    ],
  },
];

const caseTypeOptions = [
  { label: "契約書の起案", value: "contract_draft" },
  { label: "契約書レビュー", value: "contract_review" },
  { label: "法務相談", value: "legal_consultation" },
];

const statusOptions = [
  { label: "法務確認中", value: "legal_review" },
  { label: "依頼者確認待ち", value: "requester_pending" },
  { label: "未着手", value: "not_started" },
  { label: "対応中", value: "in_progress" },
  { label: "完了", value: "completed" },
  { label: "差戻し", value: "returned" },
];

const assigneeOptions = [
  { label: "山田 太郎", value: "yamada" },
  { label: "佐藤 花子", value: "sato" },
  { label: "鈴木 一郎", value: "suzuki" },
  { label: "田中 美咲", value: "tanaka" },
  { label: "高橋 健太", value: "takahashi" },
];

const departmentOptions = [
  { label: "営業部", value: "sales" },
  { label: "開発部", value: "dev" },
  { label: "人事部", value: "hr" },
  { label: "経理部", value: "accounting" },
  { label: "法務部", value: "legal" },
];

const linkedFiles = [
  { name: "業務委託契約書_v3.docx", updatedAt: "2024/10/21 17:02" },
  { name: "秘密保持契約書（NDA）.pdf", updatedAt: "2024/10/18 12:44" },
  { name: "条件変更要望.pdf", updatedAt: "2024/10/22 09:17" },
];

const relatedCases = [
  { id: "2024-02-0015", title: "基本契約書_取引先A", status: "完了" },
  { id: "2024-05-0031", title: "委託先B_契約条件変更", status: "対応中" },
];

const referenceLinks = [
  { title: "業務委託契約に関するガイドライン", url: "https://example.com/guideline" },
  { title: "秘密保持条項チェックリスト", url: "https://example.com/checklist" },
  { title: "損害賠償条項のサンプル", url: "https://example.com/sample" },
];

export const LocCaseDetail = () => {
  const navigate = useNavigate();
  const [paneType, setPaneType] = useState<PaneType>("case-attribute");
  const [paneOpen, setPaneOpen] = useState(true);
  const [overviewExpanded, setOverviewExpanded] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(true);
  const [messageValue, setMessageValue] = useState("");
  const [caseType, setCaseType] = useState("contract_review");
  const [status, setStatus] = useState("legal_review");
  const [assignee, setAssignee] = useState("yamada");
  const [department, setDepartment] = useState("sales");
  const [requester, setRequester] = useState("takahashi");
  const [caseInfoFields, setCaseInfoFields] = useState<CaseInfoField[]>(initialCaseInfoFields);

  const overviewToggleLabel = overviewExpanded ? "全文を折りたたむ" : "全文を表示";
  const messageLengthLabel = `${messageValue.length} / 4000`;
  const currentPane = paneOpen ? paneType : undefined;

  const handleSelectPane = (nextPane: PaneType) => {
    setPaneType(nextPane);
    setPaneOpen(true);
  };

  const renderTimelineEvent = (event: TimelineEvent) => {
    if (event.type === "mail") {
      return (
        <div key={event.id} className={styles.timelineEvent}>
          <Icon size="large">
            <LfMail />
          </Icon>
          <div className={styles.eventBody}>
            <div className={styles.eventHeader}>
              <Avatar size="small" name={event.sender} />
              <Text variant="body.medium.bold">{event.sender}</Text>
              <Text variant="body.small" color="subtle">
                {event.date}
              </Text>
              <div className={styles.eventMeta}>
                <Button size="small" variant="subtle" leading={LfArrowTurnUpLeft}>
                  返信
                </Button>
                <Tooltip title="詳細">
                  <IconButton aria-label="詳細" size="xSmall" variant="plain">
                    <Icon size="small">
                      <LfInformationCircle />
                    </Icon>
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <div className={styles.mailCard}>
              <Text variant="body.medium.bold">{event.subject}</Text>
              <Text variant="body.small" color="subtle">
                To: {event.to}
              </Text>
              <Text variant="body.medium" whiteSpace="pre-wrap">
                {event.content}
              </Text>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--aegis-space-xSmall)" }}>
                {event.attachments.map((file) => (
                  <Tag key={file} variant="outline" leading={LfFile}>
                    {file}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (event.type === "status") {
      return (
        <div key={event.id} className={styles.timelineEvent}>
          <Icon size="large">
            <LfBarSparkles />
          </Icon>
          <div className={styles.eventBody}>
            <div className={styles.eventHeader}>
              <Text variant="body.medium.bold">{event.content}</Text>
              <div className={styles.eventMeta}>
                <Text variant="body.small" color="subtle">
                  {event.date}
                </Text>
              </div>
            </div>
            <Text variant="body.small" color="subtle">
              更新元: {event.sender}
            </Text>
          </div>
        </div>
      );
    }

    if (event.type === "formSubmission") {
      return (
        <div key={event.id} className={styles.timelineEvent}>
          <Icon size="large">
            <LfMail />
          </Icon>
          <div className={styles.eventBody}>
            <div className={styles.eventHeader}>
              <Avatar size="small" name={event.sender} />
              <Text variant="body.medium.bold">{event.sender}</Text>
              <Text variant="body.small" color="subtle">
                {event.date}
              </Text>
            </div>
            <div className={styles.formSubmissionCard}>
              <Text variant="body.medium.bold">{event.formName}</Text>
              <Divider />
              <div className={styles.formFieldList}>
                {event.fields.map((field) => (
                  <div key={field.label} className={styles.formFieldRow}>
                    <Text variant="label.small.bold" color="subtle" className={styles.formFieldLabel}>
                      {field.label}
                    </Text>
                    <div className={styles.formFieldValue}>
                      <Text variant="body.medium" whiteSpace="pre-wrap">
                        {field.value}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={event.id} className={styles.timelineEvent}>
        <Avatar size="medium" name={event.sender} />
        <div className={styles.eventBody}>
          <div className={styles.eventHeader}>
            <Text variant="body.medium.bold">{event.sender}</Text>
            <div className={styles.eventMeta}>
              <Text variant="body.small" color="subtle">
                {event.date}
              </Text>
            </div>
          </div>
          <Text variant="body.medium" whiteSpace="pre-wrap">
            {event.content}
          </Text>
        </div>
      </div>
    );
  };

  const renderPaneContent = () => {
    const PaneHeader = ({ title }: { title: string }) => (
      <PageLayoutHeader>
        <ContentHeader
          size="small"
          trailing={
            <Tooltip title="閉じる" placement="top">
              <IconButton variant="plain" size="small" aria-label="閉じる" onClick={() => setPaneOpen(false)}>
                <Icon>
                  <LfCloseLarge />
                </Icon>
              </IconButton>
            </Tooltip>
          }
        >
          <ContentHeader.Title>
            <Text variant="title.small">{title}</Text>
          </ContentHeader.Title>
        </ContentHeader>
      </PageLayoutHeader>
    );

    if (paneType === "case-summary") {
      return (
        <>
          <PaneHeader title="案件要約" />
          <PageLayoutBody>
            <div className={styles.summaryBody}>
              <Button variant="solid" width="full" leading={LfWand}>
                案件要約を生成
              </Button>
              <EmptyState size="small" title="メッセージのやり取りを元に案件要約を生成します">
                上記ボタンを押下しなくても、メッセージの最終更新から72時間経過した日の0:00頃に自動で生成します。
              </EmptyState>
              <div className={styles.summaryTextGroup}>
                <Text variant="body.small" color="subtle">
                  メッセージ数が少ない場合、案件要約の精度が低下することがあります。要約の内容はお客様の判断でご利用ください。
                </Text>
                <Link
                  href="#"
                  size="small"
                  leading={LfQuestionCircle}
                  trailing={LfArrowUpRightFromSquare}
                  target="_blank"
                  rel="noreferrer"
                  underline
                >
                  案件要約機能のご利用における注意点
                </Link>
              </div>
            </div>
          </PageLayoutBody>
        </>
      );
    }

    if (paneType === "linked-file") {
      return (
        <>
          <PaneHeader title="関連ファイル" />
          <PageLayoutBody>
            <div className={styles.paneBody}>
              {linkedFiles.map((file) => (
                <div
                  key={file.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--aegis-space-small)",
                    padding: "var(--aegis-space-small)",
                    border: "1px solid var(--aegis-color-border-default)",
                    borderRadius: "var(--aegis-radius-medium)",
                  }}
                >
                  <Icon size="medium">
                    <LfFile />
                  </Icon>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
                    <Text variant="body.medium.bold">{file.name}</Text>
                    <Text variant="body.small" color="subtle">
                      最終更新 {file.updatedAt}
                    </Text>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <Button size="small" variant="subtle">
                      開く
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </PageLayoutBody>
        </>
      );
    }

    if (paneType === "linked-case") {
      return (
        <>
          <PaneHeader title="関連案件" />
          <PageLayoutBody>
            <div className={styles.paneBody}>
              {relatedCases.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--aegis-space-small)",
                    padding: "var(--aegis-space-small)",
                    border: "1px solid var(--aegis-color-border-default)",
                    borderRadius: "var(--aegis-radius-medium)",
                  }}
                >
                  <div>
                    <Text variant="data.medium">{item.id}</Text>
                    <Text variant="body.medium.bold" numberOfLines={1}>
                      {item.title}
                    </Text>
                  </div>
                  <Tag variant="fill" color="neutral">
                    {item.status}
                  </Tag>
                  <div style={{ marginLeft: "auto" }}>
                    <Button size="small" variant="subtle">
                      詳細へ
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </PageLayoutBody>
        </>
      );
    }

    if (paneType === "reference") {
      return (
        <>
          <PaneHeader title="参考情報" />
          <PageLayoutBody>
            <div className={styles.paneBody}>
              <Form>
                <FormControl>
                  <FormControl.Label>案件キーワードで検索</FormControl.Label>
                  <Textarea defaultValue={keywords.join(" ")} />
                </FormControl>
              </Form>
              <Divider />
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                {referenceLinks.map((item) => (
                  <div key={item.title}>
                    <Link href={item.url} target="_blank" rel="noreferrer">
                      {item.title}
                    </Link>
                    <Text variant="body.small" color="subtle">
                      {item.url}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </PageLayoutBody>
        </>
      );
    }

    if (paneType === "book") {
      return (
        <>
          <PaneHeader title="参考資料" />
          <PageLayoutBody>
            <div className={styles.paneBody}>
              <Text variant="body.medium">案件に関連する資料を一覧表示します。</Text>
              <Divider />
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                <Text variant="body.small" color="subtle">
                  ・業務委託契約の雛形
                </Text>
                <Text variant="body.small" color="subtle">
                  ・秘密保持条項の解説記事
                </Text>
                <Text variant="body.small" color="subtle">
                  ・判例・論文リンク
                </Text>
              </div>
              <Button variant="subtle" width="full">
                新しい資料を追加
              </Button>
            </div>
          </PageLayoutBody>
        </>
      );
    }

    const renderFieldContent = (fieldId: CaseInfoFieldId) => {
      switch (fieldId) {
        case "caseType":
          return <Select options={caseTypeOptions} value={caseType} onChange={(value) => setCaseType(value)} />;
        case "status":
          return <Select options={statusOptions} value={status} onChange={(value) => setStatus(value)} />;
        case "assignee":
          return <Select options={assigneeOptions} value={assignee} onChange={(value) => setAssignee(value)} />;
        case "subAssignees":
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
              {caseData.subAssignees.map((name) => (
                <Text key={name} variant="body.medium">
                  {name}
                </Text>
              ))}
            </div>
          );
        case "department":
          return <Select options={departmentOptions} value={department} onChange={(value) => setDepartment(value)} />;
        case "requester":
          return <Select options={assigneeOptions} value={requester} onChange={(value) => setRequester(value)} />;
        case "dueDate":
          return <DateField defaultValue={new Date(caseData.dueDate)} />;
        case "space":
          return <Text variant="body.medium">{caseData.space}</Text>;
        default:
          return null;
      }
    };

    return (
      <>
        <PaneHeader title="案件情報" />
        <PageLayoutBody>
          <div className={styles.paneBody}>
            <Form>
              <Draggable
                values={caseInfoFields}
                onReorder={setCaseInfoFields}
                getId={(field) => field.id}
                size="medium"
              >
                {caseInfoFields.map((field) => (
                  <Draggable.Item key={field.id} id={field.id}>
                    <FormControl>
                      <FormControl.Label>{field.label}</FormControl.Label>
                      {renderFieldContent(field.id)}
                    </FormControl>
                  </Draggable.Item>
                ))}
              </Draggable>
              <Button variant="subtle" width="full">
                案件を移動
              </Button>
              <Divider />
              <FormControl>
                <FormControl.Label>案件ラベル</FormControl.Label>
                <TagGroup>
                  {keywords.map((keyword) => (
                    <Tag key={keyword} variant="outline">
                      {keyword}
                    </Tag>
                  ))}
                </TagGroup>
              </FormControl>
            </Form>
          </div>
        </PageLayoutBody>
      </>
    );
  };

  const timelineHeader = useMemo(
    () => (
      <div className={styles.messageForm}>
        <div className={styles.messageToolbar}>
          <Tooltip title="太字">
            <IconButton variant="plain" size="small" aria-label="太字">
              <Text variant="body.medium.bold">B</Text>
            </IconButton>
          </Tooltip>
          <Tooltip title="取り消し線">
            <IconButton variant="plain" size="small" aria-label="取り消し線">
              <Text variant="body.medium" style={{ textDecoration: "line-through" }}>
                S
              </Text>
            </IconButton>
          </Tooltip>
          <Tooltip title="下線">
            <IconButton variant="plain" size="small" aria-label="下線">
              <Text variant="body.medium" style={{ textDecoration: "underline" }}>
                U
              </Text>
            </IconButton>
          </Tooltip>
        </div>
        <Textarea
          placeholder="案件に関するメッセージを入力"
          value={messageValue}
          onChange={(event) => setMessageValue(event.target.value)}
          minRows={4}
        />
        <div className={styles.messageActions}>
          <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)" }}>
            <Tooltip title="ファイル添付">
              <IconButton variant="plain" size="small" aria-label="ファイル添付">
                <Icon>
                  <LfClip />
                </Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="メンション">
              <IconButton variant="plain" size="small" aria-label="メンション">
                <Icon>
                  <LfAt />
                </Icon>
              </IconButton>
            </Tooltip>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
            <Text variant="body.small" color="subtle">
              {messageLengthLabel}
            </Text>
            <Button variant="solid" disabled={messageValue.trim().length === 0}>
              投稿
            </Button>
          </div>
        </div>
      </div>
    ),
    [messageLengthLabel, messageValue],
  );

  return (
    <>
      <Header>
        <Header.Item>
          <Tooltip title="メニュー">
            <IconButton variant="plain" aria-label="メニュー">
              <Icon>
                <LfMenu />
              </Icon>
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" />
          <Tooltip title="戻る">
            <IconButton variant="plain" aria-label="戻る" onClick={() => navigate("/template/loc/case")}>
              <Icon>
                <LfAngleLeftMiddle />
              </Icon>
            </IconButton>
          </Tooltip>
        </Header.Item>
        <Header.Item>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Header.Title>
              <Tooltip title={caseData.title} onlyOnOverflow>
                <Text numberOfLines={1} variant="title.xxSmall">
                  {caseData.title}
                </Text>
              </Tooltip>
            </Header.Title>
            <Button size="xSmall" variant="gutterless">
              <Text variant="body.small" color="subtle">
                {caseData.id}
              </Text>
            </Button>
          </div>
        </Header.Item>
        <Header.Spacer />
        <Header.Item>
          <Tooltip title="検索">
            <IconButton variant="plain" aria-label="検索">
              <Icon>
                <LfMagnifyingGlass />
              </Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="その他">
            <IconButton variant="plain" aria-label="その他">
              <Icon>
                <LfEllipsisDot />
              </Icon>
            </IconButton>
          </Tooltip>
        </Header.Item>
      </Header>

      <PageLayout>
        <PageLayoutContent maxWidth="medium">
          <PageLayoutBody>
            <div className={styles.pageBody}>
              <section className={styles.card}>
                <ContentHeader
                  size="small"
                  trailing={
                    <Button leading={LfPen} variant="subtle" size="small">
                      編集
                    </Button>
                  }
                >
                  <ContentHeader.Description variant="data">{caseData.id}</ContentHeader.Description>
                  <ContentHeader.Title>{caseData.title}</ContentHeader.Title>
                </ContentHeader>
                <div className={styles.caseInfoContent}>
                  <Text as="h4" variant="title.xxSmall">
                    案件概要
                  </Text>
                  <div className={`${styles.caseOverview} ${overviewExpanded ? styles.caseOverviewExpanded : ""}`}>
                    <Text variant="component.medium" whiteSpace="pre-wrap">
                      {caseData.overview}
                      {"\n\n"}
                      <Link href={caseData.url} target="_blank" rel="noreferrer">
                        {caseData.url}
                      </Link>
                    </Text>
                  </div>
                  <div className={styles.toggleRow}>
                    <Button
                      size="xSmall"
                      aria-expanded={overviewExpanded}
                      variant="gutterless"
                      leading={<Icon color="subtle" source={overviewExpanded ? LfAngleUpMiddle : LfAngleDownMiddle} />}
                      onClick={() => setOverviewExpanded((prev) => !prev)}
                    >
                      <Text variant="data.medium" color="subtle">
                        {overviewToggleLabel}
                      </Text>
                    </Button>
                  </div>
                </div>
              </section>

              <section className={styles.keywordSection}>
                <div className={styles.keywordHeader}>
                  <div className={styles.keywordTitle}>
                    <Text as="h4" variant="label.medium.bold">
                      案件キーワード
                    </Text>
                    <Tooltip title="案件に紐づくキーワードです" placement="top">
                      <IconButton variant="plain" size="xSmall" aria-label="ヘルプ">
                        <Icon size="small">
                          <LfInformationCircle />
                        </Icon>
                      </IconButton>
                    </Tooltip>
                  </div>
                  <Button
                    variant="gutterless"
                    size="small"
                    weight="normal"
                    leading={LfScaleBalanced}
                    trailing={LfAngleRightMiddle}
                  >
                    法令・ガイドラインを検索
                  </Button>
                </div>
                <div className={styles.tagGroupWrapper}>
                  <TagGroup>
                    {keywords.map((keyword) => (
                      <Tag key={keyword} variant="fill" color="neutral">
                        {keyword}
                      </Tag>
                    ))}
                  </TagGroup>
                </div>
              </section>

              <section className={styles.tabContainer}>
                <Tab.Group size="large">
                  <Tab.List>
                    <Tab
                      leading={
                        <Icon size="medium">
                          <LfComments />
                        </Icon>
                      }
                      width="full"
                    >
                      タイムライン
                    </Tab>
                    <Tab leading={<Logo source={SlackLogo} size="medium" />} width="full">
                      Slack
                    </Tab>
                    <Tab
                      leading={
                        <Icon size="medium">
                          <LfMail />
                        </Icon>
                      }
                      width="full"
                    >
                      メール
                    </Tab>
                  </Tab.List>
                  <Tab.Panels>
                    <Tab.Panel>
                      <div className={styles.timelineContainer}>
                        {timelineHeader}
                        <div className={styles.timelineToolbar}>
                          <Switch
                            labelPosition="start"
                            checked={showAllHistory}
                            onChange={(event) => setShowAllHistory(event.target.checked)}
                          >
                            履歴をすべて表示
                          </Switch>
                          <Tooltip title="更新" placement="top">
                            <IconButton variant="plain" size="small" aria-label="更新">
                              <Icon size="small">
                                <LfArrowRotateRight />
                              </Icon>
                            </IconButton>
                          </Tooltip>
                        </div>
                        <Divider />
                        <div className={styles.timelineList}>
                          {timelineEvents.map((event) => renderTimelineEvent(event))}
                        </div>
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div className={styles.card}>
                        <ContentHeader size="small">
                          <ContentHeader.Title>Slack スレッド</ContentHeader.Title>
                        </ContentHeader>
                        <Text variant="body.medium" color="subtle">
                          Slack連携されたメッセージを表示します。
                        </Text>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--aegis-space-small)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "var(--aegis-space-small)",
                              padding: "var(--aegis-space-small)",
                              border: "1px solid var(--aegis-color-border-default)",
                              borderRadius: "var(--aegis-radius-medium)",
                            }}
                          >
                            <Logo source={SlackLogo} size="medium" />
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <Text variant="body.medium.bold">#contract-review</Text>
                              <Text variant="body.small" color="subtle">
                                取引先からの条件変更について相談されています
                              </Text>
                            </div>
                            <div style={{ marginLeft: "auto" }}>
                              <Button size="small" variant="subtle">
                                スレッドを開く
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div className={styles.card}>
                        <ContentHeader size="small">
                          <ContentHeader.Title>メールスレッド</ContentHeader.Title>
                        </ContentHeader>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--aegis-space-medium)",
                          }}
                        >
                          {timelineEvents
                            .filter((event): event is Extract<TimelineEvent, { type: "mail" }> => event.type === "mail")
                            .map((mail) => (
                              <div key={mail.id} className={styles.mailCard}>
                                <Text variant="body.medium.bold">{mail.subject}</Text>
                                <Text variant="body.small" color="subtle">
                                  {mail.date} ・ {mail.sender}
                                </Text>
                                <Text variant="body.medium" whiteSpace="pre-wrap">
                                  {mail.content}
                                </Text>
                                <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)", flexWrap: "wrap" }}>
                                  {mail.attachments.map((file) => (
                                    <Tag key={file} variant="outline" leading={LfFile}>
                                      {file}
                                    </Tag>
                                  ))}
                                </div>
                                <div style={{ display: "flex", gap: "var(--aegis-space-small)" }}>
                                  <Button size="small" variant="subtle">
                                    返信
                                  </Button>
                                  <Button size="small" variant="subtle">
                                    転送
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </section>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>

        <PageLayoutPane position="end" width="large" resizable open={paneOpen}>
          {renderPaneContent()}
        </PageLayoutPane>

        <PageLayoutSidebar position="end">
          <SideNavigation>
            <SideNavigation.Group>
              <SideNavigation.Item
                icon={LfInformationCircle}
                onClick={() => handleSelectPane("case-attribute")}
                aria-current={currentPane === "case-attribute" ? true : undefined}
              >
                案件情報
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfBarSparkles}
                onClick={() => handleSelectPane("case-summary")}
                aria-current={currentPane === "case-summary" ? true : undefined}
              >
                案件サマリー
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfFile}
                onClick={() => handleSelectPane("linked-file")}
                aria-current={currentPane === "linked-file" ? true : undefined}
              >
                関連ファイル
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfArchive}
                onClick={() => handleSelectPane("linked-case")}
                aria-current={currentPane === "linked-case" ? true : undefined}
              >
                関連案件
              </SideNavigation.Item>
            </SideNavigation.Group>
            <SideNavigation.Group>
              <SideNavigation.Item
                icon={LfScaleBalanced}
                onClick={() => handleSelectPane("reference")}
                aria-current={currentPane === "reference" ? true : undefined}
              >
                参考情報
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfBook}
                onClick={() => handleSelectPane("book")}
                aria-current={currentPane === "book" ? true : undefined}
              >
                参考資料
              </SideNavigation.Item>
            </SideNavigation.Group>
          </SideNavigation>
        </PageLayoutSidebar>
      </PageLayout>
    </>
  );
};
