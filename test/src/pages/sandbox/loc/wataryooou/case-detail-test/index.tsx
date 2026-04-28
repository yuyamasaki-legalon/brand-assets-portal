import {
  LfArrowsRotate,
  LfArrowTurnUpLeft,
  LfAt,
  LfBook,
  LfClip,
  LfCloseLarge,
  LfComments,
  LfFile,
  LfInformationCircle,
  LfLightBulb,
  LfLink,
  LfMail,
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
  PageLayoutFooter,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutSidebar,
  Select,
  SideNavigation,
  Switch,
  Tab,
  Tag,
  Text,
  Textarea,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Placeholder } from "../../../../../components/Placeholder";

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

上記変更に伴うリスクについてご確認ください。
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
   秘密情報の定義が広すぎる印象です。営業秘密に限定するか、具体的な情報カテゴリーを列挙することを検討ください。

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

export const CaseDetailTest = () => {
  const [paneOpen, setPaneOpen] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  // Controlled state for selects
  const [caseType, setCaseType] = useState("contract_draft");
  const [status, setStatus] = useState("in_progress_001");
  const [assignee, setAssignee] = useState("yamada");
  const [department, setDepartment] = useState("sales");
  const [requester, setRequester] = useState("takahashi");

  return (
    <PageLayout>
      <PageLayoutSidebar aria-label="Start Sidebar">
        <Placeholder style={{ height: 200 }}>Sidebar</Placeholder>
      </PageLayoutSidebar>
      <PageLayoutContent maxWidth="medium">
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Case Detail Test</ContentHeader.Title>
            <ContentHeader.Description>案件詳細画面のテストページ</ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          {/* 案件情報カード */}
          <div
            style={{
              padding: "var(--aegis-space-large)",
              borderRadius: "var(--aegis-radius-large)",
              backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
            }}
          >
            <ContentHeader
              size="small"
              trailing={
                <Button leading={LfPen} variant="subtle" size="small">
                  編集
                </Button>
              }
            >
              <ContentHeader.Description>{caseData.id}</ContentHeader.Description>
              <ContentHeader.Title>{caseData.title}</ContentHeader.Title>
            </ContentHeader>
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "var(--aegis-space-small)",
              paddingBlock: "var(--aegis-space-small)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--aegis-space-xxSmall)",
              }}
            >
              <Text variant="body.medium">案件ラベル（β）</Text>
              <Tooltip title="案件ラベルの説明" placement="top">
                <IconButton variant="plain" size="xSmall" aria-label="ヘルプ">
                  <Icon size="small">
                    <LfInformationCircle />
                  </Icon>
                </IconButton>
              </Tooltip>
            </div>
            <div style={{ display: "flex", gap: "var(--aegis-space-xxSmall)" }}>
              {caseData.labels.map((label) => (
                <Tag key={label} variant="outline">
                  {label}
                </Tag>
              ))}
            </div>
            <div style={{ marginLeft: "auto" }}>
              <AegisLink href="#">案件ラベルから法令・ガイドラインを探す →</AegisLink>
            </div>
          </div>

          {/* タブ（タイムライン / Slack / メール） */}
          <Tab.Group size="large">
            <Tab.List>
              <Tab
                leading={
                  <Icon size="medium">
                    <LfComments />
                  </Icon>
                }
              >
                タイムライン
              </Tab>
              <Tab
                leading={
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" role="img" aria-label="Slack icon">
                      <title>Slack</title>
                      <path
                        fill="currentColor"
                        d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.124 2.521a2.528 2.528 0 0 1 2.52-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.52V8.834zm-1.271 0a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.166 0a2.528 2.528 0 0 1 2.521 2.522v6.312zm-2.521 10.124a2.528 2.528 0 0 1 2.521 2.52A2.528 2.528 0 0 1 15.166 24a2.528 2.528 0 0 1-2.521-2.522v-2.52h2.521zm0-1.271a2.528 2.528 0 0 1-2.521-2.521 2.528 2.528 0 0 1 2.521-2.521h6.312A2.528 2.528 0 0 1 24 15.166a2.528 2.528 0 0 1-2.522 2.521h-6.312z"
                      />
                    </svg>
                  </div>
                }
              >
                Slack
              </Tab>
              <Tab
                leading={
                  <Icon size="medium">
                    <LfMail />
                  </Icon>
                }
              >
                メール
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                {/* メッセージ入力エリア */}
                <div
                  style={{
                    padding: "var(--aegis-space-medium)",
                    border: "1px solid var(--aegis-color-border-default)",
                    borderRadius: "var(--aegis-radius-medium)",
                    backgroundColor: "var(--aegis-color-surface-default)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-small)",
                    }}
                  >
                    {/* ツールバー */}
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--aegis-space-xxSmall)",
                      }}
                    >
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
                    <Textarea placeholder="メッセージを入力" />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "var(--aegis-space-xSmall)",
                        }}
                      >
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
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--aegis-space-small)",
                        }}
                      >
                        <Text variant="body.small" color="subtle">
                          0 / 4000
                        </Text>
                        <Button variant="solid" disabled>
                          投稿
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

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
                  <Switch checked={showHistory} onChange={(event) => setShowHistory(event.target.checked)} />
                  <Tooltip title="更新">
                    <IconButton variant="plain" size="small" aria-label="更新">
                      <Icon>
                        <LfArrowsRotate />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </div>

                {/* メッセージ履歴 */}
                {timelineMessages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      gap: "var(--aegis-space-small)",
                      paddingBlock: "var(--aegis-space-small)",
                      borderTop: "1px solid var(--aegis-color-border-default)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "var(--aegis-space-xxSmall)",
                      }}
                    >
                      {msg.type === "mail" && (
                        <Icon size="small" color="subtle">
                          <LfMail />
                        </Icon>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--aegis-space-small)",
                        }}
                      >
                        <Avatar size="small" name={msg.sender} />
                        <Text variant="body.medium.bold">{msg.sender}</Text>
                        <Text variant="body.small" color="subtle">
                          {msg.date}
                        </Text>
                        <div
                          style={{
                            marginLeft: "auto",
                            display: "flex",
                            gap: "var(--aegis-space-xxSmall)",
                          }}
                        >
                          <Tooltip title="詳細">
                            <IconButton variant="plain" size="xSmall" aria-label="詳細">
                              <Icon size="small">
                                <LfInformationCircle />
                              </Icon>
                            </IconButton>
                          </Tooltip>
                          <Button variant="subtle" size="small" leading={LfArrowTurnUpLeft}>
                            返信
                          </Button>
                        </div>
                      </div>
                      <div style={{ paddingTop: "var(--aegis-space-xSmall)" }}>
                        <Text variant="body.medium" style={{ whiteSpace: "pre-wrap" }}>
                          {msg.content}
                        </Text>
                      </div>
                    </div>
                  </div>
                ))}
              </Tab.Panel>
              <Tab.Panel>
                <Text>Slackタブの内容</Text>
              </Tab.Panel>
              <Tab.Panel>
                <Text>メールタブの内容</Text>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </PageLayoutBody>
        <PageLayoutFooter>
          <AegisLink asChild>
            <Link to="/sandbox">← Back to Sandbox</Link>
          </AegisLink>
        </PageLayoutFooter>
      </PageLayoutContent>
      <PageLayoutPane position="end" width="large" open={paneOpen} resizable aria-label="End Pane">
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
              <Text variant="title.small">案件情報</Text>
            </ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-xxSmall)",
                }}
              >
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
              <FormControl.Label>緊急度（テスト（Update））</FormControl.Label>
              <Select options={[]} placeholder="選択してください" />
            </FormControl>
          </Form>
        </PageLayoutBody>
      </PageLayoutPane>
      <PageLayoutSidebar position="end" aria-label="End Sidebar">
        <SideNavigation>
          <SideNavigation.Group>
            <SideNavigation.Item
              icon={LfInformationCircle}
              onClick={() => setPaneOpen(true)}
              aria-current={paneOpen ? true : undefined}
            >
              案件情報
            </SideNavigation.Item>
            <SideNavigation.Item icon={LfFile}>関連ファイル</SideNavigation.Item>
            <SideNavigation.Item icon={LfLink}>関連案件</SideNavigation.Item>
            <SideNavigation.Item icon={LfBook}>参考情報</SideNavigation.Item>
            <SideNavigation.Item icon={LfLightBulb}>AIサマリー</SideNavigation.Item>
          </SideNavigation.Group>
        </SideNavigation>
      </PageLayoutSidebar>
    </PageLayout>
  );
};
