import {
  LfAngleLeftMiddle,
  LfBarSparkles,
  LfComments,
  LfFile,
  LfInformationCircle,
  LfLink,
  LfMail,
  LfMenu,
  LfPen,
} from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  Avatar,
  Button,
  ContentHeader,
  DateField,
  Divider,
  Form,
  FormControl,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutSidebar,
  Select,
  SideNavigation,
  Switch,
  Tab,
  Tag,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ContractPreview } from "./ContractPreview";
import { DraggableSummary, DroppablePanel, type SummaryPosition } from "./DraggableSummary";
import "./CaseDetailLayout.css";

// サンプルデータ
const caseData = {
  id: "2024-03-0020",
  title: "業務委託契約書のレビュー依頼",
  content:
    "新規取引先との業務委託契約書について、リスク条項の確認をお願いします。特に損害賠償の上限条項と秘密保持義務の範囲についてご確認いただきたいです。",
  url: "https://docs.google.com/document/d/1abc123xyz",
  labels: ["業務委託", "契約書レビュー", "リスク確認"],
  caseType: "契約書の起案",
  status: "進行タスク001",
  mainAssignee: "山田 太郎",
  subAssignees: ["佐藤 花子", "鈴木 一郎", "田中 美咲"],
  department: "営業部",
  requester: "高橋 健太",
  dueDate: "2024/11/08",
  space: "営業部スペース",
  urgency: "",
};

// タイムラインメッセージ
const timelineMessages = [
  {
    id: "1",
    type: "mail",
    sender: "高橋 健太",
    date: "2024/10/22 18:30",
    content: `山田様

お忙しいところ恐れ入ります。
先日ご依頼した業務委託契約書について、取引先から追加の条件変更依頼がございました。

変更点：
・支払条件を月末締め翌月末払いから翌々月15日払いに変更
・契約期間を1年から2年に延長

上記変更に伴うリスクについてもご確認いただけますと幸いです。
何卒よろしくお願いいたします。

高橋`,
  },
  {
    id: "2",
    type: "comment",
    sender: "山田 太郎",
    date: "2024/10/22 14:15",
    content: `高橋様

ご依頼ありがとうございます。
契約書を確認いたしました。以下の点についてコメントいたします。

1. 損害賠償条項について
   上限金額の設定が曖昧なため、具体的な金額または契約金額の●倍という形式での明記を推奨します。

2. 秘密保持条項について
   秘密情報の定義が広すぎる印象です。営業秘密に限定するか、具体的な情報カテゴリを列挙することを検討ください。

ご不明点があればお気軽にご連絡ください。

山田`,
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

// 案件概要コンテンツ
function SummaryContent() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
      {/* 案件情報カード */}
      <div
        style={{
          padding: "var(--aegis-space-medium)",
          borderRadius: "var(--aegis-radius-medium)",
          backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <Text variant="body.small" color="subtle">
              {caseData.id}
            </Text>
            <Text variant="title.small">{caseData.title}</Text>
          </div>
          <Button leading={LfPen} variant="subtle" size="small">
            編集
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-xSmall)",
            marginTop: "var(--aegis-space-small)",
          }}
        >
          <Text variant="body.small" color="subtle">
            依頼内容
          </Text>
          <Text style={{ whiteSpace: "pre-wrap" }}>{caseData.content}</Text>
          <AegisLink href={caseData.url} target="_blank">
            {caseData.url}
          </AegisLink>
        </div>
      </div>

      {/* 案件ラベル */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "var(--aegis-space-small)" }}>
        <Text variant="body.medium">案件ラベル（β）</Text>
        <div style={{ display: "flex", gap: "var(--aegis-space-xxSmall)" }}>
          {caseData.labels.map((label) => (
            <Tag key={label} variant="outline">
              {label}
            </Tag>
          ))}
        </div>
      </div>

      {/* タイムラインタブ */}
      <Tab.Group size="small">
        <Tab.List>
          <Tab
            leading={
              <Icon size="small">
                <LfComments />
              </Icon>
            }
          >
            タイムライン
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            {/* 履歴表示 / 更新 */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "var(--aegis-space-small)",
                paddingBlock: "var(--aegis-space-small)",
              }}
            >
              <Text variant="body.small">履歴を表示</Text>
              <Switch checked={showHistory} onChange={(e) => setShowHistory(e.target.checked)} />
            </div>

            {/* メッセージ履歴 */}
            {timelineMessages.slice(0, 2).map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  gap: "var(--aegis-space-small)",
                  paddingBlock: "var(--aegis-space-small)",
                  borderTop: "1px solid var(--aegis-color-border-default)",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
                    <Avatar size="small" name={msg.sender} />
                    <Text variant="body.small.bold">{msg.sender}</Text>
                    <Text variant="body.small" color="subtle">
                      {msg.date}
                    </Text>
                    <div style={{ marginLeft: "auto" }}>
                      <Button variant="subtle" size="xSmall">
                        返信
                      </Button>
                    </div>
                  </div>
                  <Text
                    variant="body.small"
                    style={{ whiteSpace: "pre-wrap", marginTop: "var(--aegis-space-xxSmall)" }}
                  >
                    {msg.content.substring(0, 100)}...
                  </Text>
                </div>
              </div>
            ))}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

// 案件情報パネルの中身
function CaseInfoContent() {
  const [caseType, setCaseType] = useState("contract_draft");
  const [status, setStatus] = useState("in_progress");
  const [assignee, setAssignee] = useState("yamada");
  const [department, setDepartment] = useState("sales");
  const [requester, setRequester] = useState("takahashi");

  return (
    <div className="case-detail-info-body">
      <Form>
        <FormControl>
          <FormControl.Label>案件タイプ</FormControl.Label>
          <Select options={caseTypeOptions} value={caseType} onChange={(value) => setCaseType(value)} />
        </FormControl>

        <FormControl>
          <FormControl.Label>案件ステータス</FormControl.Label>
          <Select options={statusOptions} value={status} onChange={(value) => setStatus(value)} />
        </FormControl>

        <FormControl>
          <FormControl.Label>案件担当者</FormControl.Label>
          <Select options={assigneeOptions} value={assignee} onChange={(value) => setAssignee(value)} />
        </FormControl>

        <FormControl>
          <FormControl.Label>副担当者</FormControl.Label>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
            {caseData.subAssignees.map((name) => (
              <Text key={name} variant="body.medium">
                {name}
              </Text>
            ))}
          </div>
        </FormControl>

        <FormControl>
          <FormControl.Label>依頼部署</FormControl.Label>
          <Select options={departmentOptions} value={department} onChange={(value) => setDepartment(value)} />
        </FormControl>

        <FormControl>
          <FormControl.Label>依頼者</FormControl.Label>
          <Select options={assigneeOptions} value={requester} onChange={(value) => setRequester(value)} />
        </FormControl>

        <FormControl>
          <FormControl.Label>納期</FormControl.Label>
          <DateField defaultValue={new Date("2024-11-08")} />
        </FormControl>

        <FormControl>
          <FormControl.Label>保存先</FormControl.Label>
          <Text variant="body.medium">{caseData.space}</Text>
        </FormControl>

        <Button variant="subtle" style={{ width: "100%" }}>
          案件を移動
        </Button>

        <Divider />

        <FormControl>
          <FormControl.Label>緊急度</FormControl.Label>
          <Select options={[]} placeholder="選択してください" />
        </FormControl>
      </Form>
    </div>
  );
}

export const LabTestPageDetail2 = () => {
  const [summaryPosition, setSummaryPosition] = useState<SummaryPosition>("bottom-left");
  const [activeSideNav, setActiveSideNav] = useState("info");

  const handlePositionChange = (newPosition: SummaryPosition) => {
    setSummaryPosition(newPosition);
  };

  return (
    <PageLayout variant="plain" scrollBehavior="outside">
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader
            size="medium"
            leading={
              <Link to="/sandbox/nomura/lab-test-page" style={{ display: "flex", alignItems: "center" }}>
                <Icon size="medium">
                  <LfAngleLeftMiddle />
                </Icon>
              </Link>
            }
          >
            <ContentHeader.Description>{caseData.id}</ContentHeader.Description>
            <ContentHeader.Title>{caseData.title}</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div className="case-detail-page">
            {/* ========== 左側メインエリア ========== */}
            <div className="case-detail-main" data-layout={summaryPosition}>
              {/* 案件概要が左上の場合 */}
              {summaryPosition === "top-left" && (
                <DraggableSummary currentPosition={summaryPosition}>
                  <SummaryContent />
                </DraggableSummary>
              )}

              {/* ドキュメントプレビュー */}
              <DroppablePanel
                className="case-detail-preview"
                side="left"
                onDrop={handlePositionChange}
                currentPosition={summaryPosition}
              >
                <div className="case-detail-preview-body">
                  <ContractPreview />
                </div>
              </DroppablePanel>

              {/* 案件概要が左下の場合 */}
              {summaryPosition === "bottom-left" && (
                <DraggableSummary currentPosition={summaryPosition}>
                  <SummaryContent />
                </DraggableSummary>
              )}
            </div>

            {/* ========== 右側サイドエリア ========== */}
            <div className="case-detail-side" data-layout={summaryPosition}>
              {/* 案件概要が右上の場合 */}
              {summaryPosition === "top-right" && (
                <DraggableSummary currentPosition={summaryPosition}>
                  <SummaryContent />
                </DraggableSummary>
              )}

              {/* 案件情報パネル */}
              <DroppablePanel
                className="case-detail-info"
                side="right"
                onDrop={handlePositionChange}
                currentPosition={summaryPosition}
              >
                <CaseInfoContent />
              </DroppablePanel>

              {/* 案件概要が右下の場合 */}
              {summaryPosition === "bottom-right" && (
                <DraggableSummary currentPosition={summaryPosition}>
                  <SummaryContent />
                </DraggableSummary>
              )}
            </div>

            {/* ========== サイドナビゲーション ========== */}
            <div className="case-detail-sidenav">
              <SideNavigation>
                <SideNavigation.Group>
                  <SideNavigation.Item
                    icon={LfInformationCircle}
                    onClick={() => setActiveSideNav("info")}
                    aria-current={activeSideNav === "info" ? true : undefined}
                  >
                    案件情報
                  </SideNavigation.Item>
                  <SideNavigation.Item
                    icon={LfLink}
                    onClick={() => setActiveSideNav("related")}
                    aria-current={activeSideNav === "related" ? true : undefined}
                  >
                    関連案件
                  </SideNavigation.Item>
                  <SideNavigation.Item
                    icon={LfFile}
                    onClick={() => setActiveSideNav("files")}
                    aria-current={activeSideNav === "files" ? true : undefined}
                  >
                    関連ファイル
                  </SideNavigation.Item>
                  <SideNavigation.Item
                    icon={LfMail}
                    onClick={() => setActiveSideNav("mail")}
                    aria-current={activeSideNav === "mail" ? true : undefined}
                  >
                    メール
                  </SideNavigation.Item>
                </SideNavigation.Group>
                <Divider />
                <SideNavigation.Group>
                  <SideNavigation.Item
                    icon={LfBarSparkles}
                    onClick={() => setActiveSideNav("ai")}
                    aria-current={activeSideNav === "ai" ? true : undefined}
                  >
                    AIサマリー
                  </SideNavigation.Item>
                  <SideNavigation.Item
                    icon={LfMenu}
                    onClick={() => setActiveSideNav("device")}
                    aria-current={activeSideNav === "device" ? true : undefined}
                  >
                    デバイス
                  </SideNavigation.Item>
                </SideNavigation.Group>
              </SideNavigation>
            </div>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
      <PageLayoutSidebar position="start" aria-label="Start Sidebar">
        <div style={{ padding: "var(--aegis-space-small)" }}>
          <Tooltip title="メニュー">
            <IconButton variant="plain" size="medium" aria-label="メニュー">
              <Icon>
                <LfFile />
              </Icon>
            </IconButton>
          </Tooltip>
        </div>
      </PageLayoutSidebar>
    </PageLayout>
  );
};
