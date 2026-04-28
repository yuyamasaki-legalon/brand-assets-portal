import { LfAngleLeftMiddle, LfFile, LfInformationCircle, LfMenu, LfPen } from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  Avatar,
  Button,
  Card,
  CardBody,
  ContentHeader,
  Divider,
  Form,
  FormControl,
  Header,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Select,
  Tag,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StartSidebar } from "../../../../../components/StartSidebar";

// サンプルデータ
const contractData = {
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
};

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

export default function ContractDetail() {
  const navigate = useNavigate();
  const [paneOpen] = useState(true);
  const [caseType, setCaseType] = useState("contract_draft");
  const [status, setStatus] = useState("in_progress");
  const [assignee, setAssignee] = useState("yamada");
  const [department, setDepartment] = useState("sales");

  return (
    <PageLayout>
      <StartSidebar />
      <PageLayoutContent>
        <PageLayoutHeader>
          <Header>
            <Header.Item>
              <Tooltip title="メニュー">
                <IconButton icon={LfMenu} aria-label="menu" />
              </Tooltip>
              <Divider orientation="vertical" />
              <Tooltip title="戻る">
                <IconButton
                  icon={LfAngleLeftMiddle}
                  aria-label="back"
                  onClick={() => navigate("/sandbox/juna-kondo")}
                  variant="plain"
                />
              </Tooltip>
            </Header.Item>

            <Header.Item>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--aegis-space-large)",
                }}
              >
                <Text variant="title.large" style={{ fontSize: "48px", lineHeight: "1" }}>
                  {contractData.id}
                </Text>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-xxSmall)",
                  }}
                >
                  <Text variant="title.medium">{contractData.title}</Text>
                  <Text variant="body.small" color="subtle">
                    申請者: {contractData.requester}、部署: {contractData.department}
                  </Text>
                </div>
              </div>
            </Header.Item>

            <Header.Spacer />
          </Header>
        </PageLayoutHeader>

        <PageLayoutBody>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: paneOpen ? "1fr 400px" : "1fr",
              gap: "var(--aegis-space-xLarge)",
            }}
          >
            {/* メインコンテンツ */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-large)",
              }}
            >
              {/* 契約書情報カード */}
              <Card>
                <CardBody>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "var(--aegis-space-medium)",
                    }}
                  >
                    <ContentHeader size="small">
                      <ContentHeader.Title>契約書情報</ContentHeader.Title>
                    </ContentHeader>
                    <Button leading={LfPen} variant="subtle" size="small">
                      編集
                    </Button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "200px 1fr",
                      gap: "var(--aegis-space-large)",
                      rowGap: "var(--aegis-space-medium)",
                    }}
                  >
                    <Text variant="label.medium" color="subtle">
                      依頼内容
                    </Text>
                    <Text variant="body.medium" style={{ whiteSpace: "pre-wrap" }}>
                      {contractData.content}
                    </Text>

                    <Text variant="label.medium" color="subtle">
                      契約書ファイル
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--aegis-space-xSmall)",
                      }}
                    >
                      <Icon>
                        <LfFile />
                      </Icon>
                      <AegisLink href={contractData.url} underline target="_blank">
                        {contractData.url}
                      </AegisLink>
                    </div>

                    <Text variant="label.medium" color="subtle">
                      ラベル
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "var(--aegis-space-xSmall)",
                      }}
                    >
                      {contractData.labels.map((label) => (
                        <Tag key={label}>{label}</Tag>
                      ))}
                    </div>

                    <Text variant="label.medium" color="subtle">
                      期限
                    </Text>
                    <Text variant="body.medium">{contractData.dueDate}</Text>

                    <Text variant="label.medium" color="subtle">
                      主担当者
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--aegis-space-small)",
                      }}
                    >
                      <Avatar name={contractData.mainAssignee} size="small">
                        {contractData.mainAssignee.charAt(0)}
                      </Avatar>
                      <Text variant="body.medium">{contractData.mainAssignee}</Text>
                    </div>

                    <Text variant="label.medium" color="subtle">
                      副担当者
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "var(--aegis-space-small)",
                      }}
                    >
                      {contractData.subAssignees.map((assignee) => (
                        <div
                          key={assignee}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--aegis-space-xSmall)",
                          }}
                        >
                          <Avatar name={assignee} size="xSmall">
                            {assignee.charAt(0)}
                          </Avatar>
                          <Text variant="body.small">{assignee}</Text>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* サイドペイン */}
            {paneOpen && (
              <PageLayoutPane open={paneOpen} width="medium">
                <PageLayoutHeader>
                  <ContentHeader size="medium">
                    <ContentHeader.Title>案件属性</ContentHeader.Title>
                  </ContentHeader>
                </PageLayoutHeader>
                <PageLayoutBody>
                  <Form>
                    <FormControl>
                      <FormControl.Label>案件タイプ</FormControl.Label>
                      <Select value={caseType} onChange={(value) => setCaseType(value)} options={caseTypeOptions} />
                    </FormControl>

                    <FormControl>
                      <FormControl.Label>ステータス</FormControl.Label>
                      <Select value={status} onChange={(value) => setStatus(value)} options={statusOptions} />
                    </FormControl>

                    <FormControl>
                      <FormControl.Label>担当者</FormControl.Label>
                      <Select value={assignee} onChange={(value) => setAssignee(value)} options={assigneeOptions} />
                    </FormControl>

                    <FormControl>
                      <FormControl.Label>部署</FormControl.Label>
                      <Select
                        value={department}
                        onChange={(value) => setDepartment(value)}
                        options={departmentOptions}
                      />
                    </FormControl>
                  </Form>

                  <div
                    style={{
                      marginTop: "var(--aegis-space-large)",
                      padding: "var(--aegis-space-medium)",
                      borderRadius: "var(--aegis-radius-medium)",
                      backgroundColor: "var(--aegis-color-background-blue-xSubtle)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--aegis-space-xSmall)",
                        marginBottom: "var(--aegis-space-small)",
                      }}
                    >
                      <Icon>
                        <LfInformationCircle />
                      </Icon>
                      <Text variant="title.small">情報</Text>
                    </div>
                    <Text variant="body.small">
                      契約書の詳細情報を確認・編集できます。変更内容は自動的に保存されます。
                    </Text>
                  </div>
                </PageLayoutBody>
              </PageLayoutPane>
            )}
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
