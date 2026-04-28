import {
  LfAngleLeft,
  LfAngleLeftMiddle,
  LfAngleRight,
  LfDownload,
  LfFile,
  LfInformationCircle,
  LfMenu,
  LfQuestionCircle,
} from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  Avatar,
  Button,
  Card,
  CardBody,
  Divider,
  Header,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StartSidebar } from "../../../../../components/StartSidebar";

const applicationData = {
  id: "5",
  title: "業務委託依頼契約書",
  applicant: "juna.kondo",
  quoteForm: "Test - Juna",
  applicationName: "業務委託依頼契約書",
  desiredApprovalDate: "2025/12/26",
  scheduledConclusionDate: "2025/12/31",
  departmentName: "CLM",
  numberOfCopies: 1,
  preCheck: "必要",
  contractMethod: "電子契約",
  sealType: "LegalOnサイン",
  targetFile: {
    name: "ホームページ制作委託契約_委託者有利 【ZeLo_Model】.docx",
    url: "#",
  },
  attachedFiles: [],
};

const approvalHistory = {
  currentStep: 1,
  totalSteps: 1,
  requirement: "全員の承認が必須",
  approvers: [
    {
      name: "juna.kondo",
      email: "juna.kondo+test@leg",
      avatar: "ju",
      status: "pending",
    },
  ],
};

const signatureRequestSender = {
  name: "juna.kondo",
  email: "juna.kondo+test@leg",
  avatar: "ju",
};

export default function SignatureRequestDetail() {
  const navigate = useNavigate();
  const [paneOpen] = useState(true);

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
                  {applicationData.id}
                </Text>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-xxSmall)",
                  }}
                >
                  <Text variant="title.medium">{applicationData.title}</Text>
                  <Text variant="body.small" color="subtle">
                    申請者: {applicationData.applicant}、引用フォーム: {applicationData.quoteForm}
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
              <Card>
                <CardBody>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "200px 1fr",
                      gap: "var(--aegis-space-large)",
                      rowGap: "var(--aegis-space-medium)",
                    }}
                  >
                    <Text variant="label.medium" color="subtle">
                      申請名
                    </Text>
                    <Text variant="body.medium">{applicationData.applicationName}</Text>

                    <Text variant="label.medium" color="subtle">
                      希望承認日
                    </Text>
                    <Text variant="body.medium">{applicationData.desiredApprovalDate}</Text>

                    <Text variant="label.medium" color="subtle">
                      締結予定日
                    </Text>
                    <Text variant="body.medium">{applicationData.scheduledConclusionDate}</Text>

                    <Text variant="label.medium" color="subtle">
                      部署名
                    </Text>
                    <Text variant="body.medium">{applicationData.departmentName}</Text>

                    <Text variant="label.medium" color="subtle">
                      部数
                    </Text>
                    <Text variant="body.medium">{applicationData.numberOfCopies}</Text>

                    <Text variant="label.medium" color="subtle">
                      事前チェック
                    </Text>
                    <Text variant="body.medium">{applicationData.preCheck}</Text>

                    <Text variant="label.medium" color="subtle">
                      契約方法
                    </Text>
                    <Text variant="body.medium">{applicationData.contractMethod}</Text>

                    <Text variant="label.medium" color="subtle">
                      印鑑の種類
                    </Text>
                    <Text variant="body.medium">{applicationData.sealType}</Text>

                    <Text variant="label.medium" color="subtle">
                      対象ファイル
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
                      <AegisLink href={applicationData.targetFile.url} underline>
                        {applicationData.targetFile.name}
                      </AegisLink>
                    </div>

                    <Text variant="label.medium" color="subtle">
                      添付ファイル
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--aegis-space-xSmall)",
                      }}
                    >
                      <Text variant="body.medium">なし</Text>
                      <IconButton size="xSmall" variant="plain" aria-label="ダウンロード" icon={LfDownload} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* サイドバー */}
            {paneOpen && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-large)",
                }}
              >
                {/* 承認ステータスカード */}
                <Card>
                  <CardBody>
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
                      <Text variant="title.small">承認待ち</Text>
                    </div>
                    <Text variant="body.small" style={{ marginBottom: "var(--aegis-space-large)" }}>
                      申請情報を確認して、申請の承認を行ってください。
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--aegis-space-small)",
                      }}
                    >
                      <Button variant="plain" width="full">
                        却下する
                      </Button>
                      <Button variant="plain" width="full">
                        差し戻し
                      </Button>
                      <Button variant="solid" width="full">
                        承認する
                      </Button>
                    </div>
                  </CardBody>
                </Card>

                {/* 承認履歴 */}
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
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--aegis-space-xSmall)",
                        }}
                      >
                        <Text variant="title.small">承認履歴</Text>
                        <Tooltip title="承認履歴について">
                          <IconButton size="xSmall" variant="plain" aria-label="ヘルプ" icon={LfQuestionCircle} />
                        </Tooltip>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--aegis-space-xxSmall)",
                        }}
                      >
                        <Button size="xSmall" variant="plain">
                          ≪最新
                        </Button>
                        <IconButton size="xSmall" variant="plain" aria-label="前へ" icon={LfAngleLeft} />
                        <IconButton size="xSmall" variant="plain" aria-label="次へ" icon={LfAngleRight} />
                      </div>
                    </div>
                    <Text variant="body.small" style={{ marginBottom: "var(--aegis-space-medium)" }}>
                      ({approvalHistory.currentStep}) {approvalHistory.requirement}
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--aegis-space-medium)",
                      }}
                    >
                      {approvalHistory.approvers.map((approver) => (
                        <div
                          key={approver.name}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--aegis-space-small)",
                          }}
                        >
                          <Avatar name={approver.name} size="small">
                            {approver.avatar}
                          </Avatar>
                          <Text variant="body.medium">{approver.name}</Text>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {/* 申請参照者 */}
                <Card>
                  <CardBody>
                    <Text variant="title.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
                      申請参照者
                    </Text>
                    <Text variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                      申請内容や承認状況を確認できる
                    </Text>
                    <Text variant="body.small" color="subtle">
                      申請参照者は指定されていません
                    </Text>
                  </CardBody>
                </Card>

                {/* 署名依頼送信者 */}
                <Card>
                  <CardBody>
                    <Text variant="title.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
                      署名依頼送信者
                    </Text>
                    <Text variant="body.small" style={{ marginBottom: "var(--aegis-space-medium)" }}>
                      申請が承認されたら、LegalOnサインで署名依頼を送信します
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--aegis-space-small)",
                      }}
                    >
                      <Avatar name={signatureRequestSender.name} size="small">
                        {signatureRequestSender.avatar}
                      </Avatar>
                      <div>
                        <Text variant="body.medium">{signatureRequestSender.name}</Text>
                        <Text variant="body.small" color="subtle">
                          {signatureRequestSender.email}
                        </Text>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
