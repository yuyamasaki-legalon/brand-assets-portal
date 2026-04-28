import {
  LfAngleLeftMiddle,
  LfArrowUpRightFromSquare,
  LfCloseLarge,
  LfFile,
  LfFileLines,
  LfFileSigned,
  LfInformationCircle,
  LfMenu,
  LfPen,
} from "@legalforce/aegis-icons";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  ContentHeader,
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  Divider,
  Header,
  Icon,
  IconButton,
  InformationCard,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  StatusLabel,
  Tab,
  Tag,
  Text,
  Timeline,
  TimelineItem,
  Tooltip,
} from "@legalforce/aegis-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StartSidebar } from "../../../../../components/StartSidebar";

// サンプルデータ
type DocumentType = "ORIGINAL" | "AMENDMENT" | "SOW" | "INVOICE";

type RelatedDocument = {
  id: string;
  number: string;
  status: string;
  date: string;
  documentType: DocumentType;
  title: string;
  summary?: string;
  changedClauses?: string[];
  relationship?: string; // "修正" | "追加" | "削除" など
  articleNumber?: string; // "第1条" など
  articleTitle?: string; // "目的" など
  isLatest?: boolean;
};

type ContractDetail = {
  id: string;
  title: string;
  clientName: string;
  signedDate: string;
  endDate: string;
  autoRenewal: string;
  department: string;
  status: string;
  documentType: DocumentType;
  relatedDocuments: RelatedDocument[];
  sowDocuments?: RelatedDocument[]; // 個別契約（SOW）
  latestDocumentDate: string;
  totalAmendments: number;
};

const sampleContractDetail: ContractDetail = {
  id: "1",
  title: "業務委託契約書",
  clientName: "LegalOn Technologies株式会社",
  signedDate: "2025/09/30",
  endDate: "2026/09/29",
  autoRenewal: "あり",
  department: "営業一部",
  status: "契約期間中",
  documentType: "ORIGINAL",
  latestDocumentDate: "2025/07/20",
  totalAmendments: 4,
  relatedDocuments: [
    {
      id: "m1",
      number: "Amendment 3",
      status: "反映済み",
      date: "2025/01/12",
      documentType: "AMENDMENT",
      title: "業務委託契約書 - 覚書1",
      summary: "サービス範囲にロイヤリティ条項を追加",
      changedClauses: ["第1条 (目的)"],
      relationship: "修正",
      articleNumber: "第1条",
      articleTitle: "目的",
    },
    {
      id: "m2",
      number: "Amendment 6",
      status: "反映済み",
      date: "2025/03/12",
      documentType: "AMENDMENT",
      title: "業務委託契約書 - 覚書2",
      summary: "業務内容の定義を拡張: テスト工程を追加",
      changedClauses: ["第2条 (業務内容)"],
      relationship: "修正",
      articleNumber: "第2条",
      articleTitle: "業務内容",
    },
    {
      id: "m3",
      number: "Amendment 9",
      status: "反映済み",
      date: "2025/06/12",
      documentType: "AMENDMENT",
      title: "業務委託契約書 - 覚書3",
      summary: "責任上限条項を変更: 損害賠償の上限を明確化",
      changedClauses: ["第7条 (責任)"],
      relationship: "修正",
      articleNumber: "第7条",
      articleTitle: "責任",
    },
    {
      id: "m4",
      number: "Amendment 12",
      status: "反映済み",
      date: "2025/07/20",
      documentType: "AMENDMENT",
      title: "業務委託契約書 - 覚書4",
      summary: "契約期間の延長と更新条件の変更",
      changedClauses: ["第12条 (契約期間)"],
      relationship: "修正",
      articleNumber: "第12条",
      articleTitle: "契約期間",
      isLatest: true,
    },
  ],
  sowDocuments: [
    {
      id: "sow1",
      number: "個別契約 SOW-2025-001",
      status: "有効",
      date: "2025/02/15",
      documentType: "SOW",
      title: "個別契約 SOW-2025-001",
      summary: "システム開発業務の個別契約",
      relationship: "個別契約",
    },
    {
      id: "sow2",
      number: "個別契約 SOW-2025-002",
      status: "有効",
      date: "2025/04/20",
      documentType: "SOW",
      title: "個別契約 SOW-2025-002",
      summary: "保守・運用業務の個別契約",
      relationship: "個別契約",
    },
  ],
};

const getDocumentTypeLabel = (type: DocumentType): string => {
  switch (type) {
    case "ORIGINAL":
      return "原契約";
    case "AMENDMENT":
      return "覚書";
    case "SOW":
      return "個別契約";
    case "INVOICE":
      return "請求書";
    default:
      return type;
  }
};

export default function ContractDetailEnhanced() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"preview" | "relations" | "composite">("preview");
  const [selectedDocument, setSelectedDocument] = useState<RelatedDocument | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<RelatedDocument | null>(null);
  const [infoTab, setInfoTab] = useState<"basic" | "management" | "pdf">("basic");
  const contract = sampleContractDetail;

  // 右側の関連書類一覧カードへの参照
  const documentCardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const originalContractRef = useRef<HTMLDivElement | null>(null);

  // 選択された書類のカードに自動スクロール
  useEffect(() => {
    if (selectedDocument === null && originalContractRef.current) {
      originalContractRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (selectedDocument && documentCardRefs.current[selectedDocument.id]) {
      documentCardRefs.current[selectedDocument.id]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedDocument]);

  // 元契約を選択するハンドラー
  const handleSelectOriginalContract = () => {
    setSelectedDocument(null);
    setTimeout(() => {
      const articleElement = document.getElementById("article-1");
      if (articleElement) {
        articleElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  // 覚書を選択するハンドラー
  const handleSelectAmendment = (doc: RelatedDocument) => {
    setSelectedDocument(doc);
    setTimeout(() => {
      const articleId = `article-${doc.articleNumber?.replace("第", "").replace("条", "")}`;
      const articleElement = document.getElementById(articleId);
      if (articleElement) {
        articleElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  // キーボードイベントハンドラー（Enter/Spaceキーでクリックと同じ動作）
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>, handler: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handler();
    }
  };

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
                  onClick={() => navigate("/sandbox/juna-kondo/contract-list-ui-improvement")}
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
                  {contract.id}
                </Text>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-xxSmall)",
                  }}
                >
                  <Text variant="title.medium">{contract.title}</Text>
                  <Text variant="body.small" color="subtle">
                    取引先: {contract.clientName}、部署: {contract.department}
                  </Text>
                </div>
              </div>
            </Header.Item>

            <Header.Spacer />
          </Header>
        </PageLayoutHeader>

        <PageLayoutBody>
          {/* タブナビゲーション */}
          <Tab.Group
            index={activeTab === "preview" ? 0 : activeTab === "relations" ? 1 : 2}
            onChange={(index) => {
              if (index === 0) setActiveTab("preview");
              else if (index === 1) setActiveTab("relations");
              else setActiveTab("composite");
            }}
          >
            <Tab.List>
              <Tab>プレビュー</Tab>
              <Tab>関連契約</Tab>
              <Tab>統合表示</Tab>
            </Tab.List>

            <Tab.Panels>
              {/* Previewタブ */}
              <Tab.Panel>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 400px",
                    gap: "var(--aegis-space-xLarge)",
                  }}
                >
                  {/* 左側：プレビュー */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-medium)",
                    }}
                  >
                    <Card>
                      <CardBody>
                        <div
                          style={{
                            padding: "var(--aegis-space-xLarge)",
                            backgroundColor: "var(--aegis-color-background-default)",
                            borderRadius: "var(--aegis-radius-medium)",
                            minHeight: "600px",
                            position: "relative",
                            fontFamily: "serif",
                          }}
                        >
                          {/* 契約書本文 */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--aegis-space-large)",
                              maxWidth: "800px",
                              margin: "0 auto",
                            }}
                          >
                            {/* ヘッダー情報 */}
                            <div
                              style={{
                                textAlign: "center",
                                marginBottom: "var(--aegis-space-medium)",
                              }}
                            >
                              <Text
                                variant="body.small"
                                color="subtle"
                                style={{ marginBottom: "var(--aegis-space-small)" }}
                              >
                                Docusign Envelope ID: CC7C6C9D-D93B-4953-B353-EFA234CDF15B
                              </Text>
                            </div>

                            {/* タイトル */}
                            <div style={{ textAlign: "center", marginBottom: "var(--aegis-space-xLarge)" }}>
                              <Text variant="title.large" style={{ fontSize: "24px", fontWeight: "bold" }}>
                                業務委託契約書
                              </Text>
                            </div>

                            {/* 前文 */}
                            <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                              <Text variant="body.medium" style={{ lineHeight: "1.8" }}>
                                本契約は、LegalOn Technologies
                                株式会社（以下「甲」という）とラーニングシェアリング株式会社（以下「乙」という）が、以下のとおり業務委託契約を締結する。
                              </Text>
                            </div>

                            {/* 第1 総則 */}
                            <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                              <Text
                                variant="title.medium"
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "bold",
                                  marginBottom: "var(--aegis-space-medium)",
                                }}
                              >
                                第1 総則
                              </Text>

                              {/* 第1条(目的) */}
                              <div
                                style={{
                                  marginBottom: "var(--aegis-space-large)",
                                  padding: "var(--aegis-space-medium)",
                                  backgroundColor:
                                    selectedDocument?.articleNumber === "第1条"
                                      ? "var(--aegis-color-background-yellow-subtle)"
                                      : "transparent",
                                  borderRadius: "var(--aegis-radius-small)",
                                  border:
                                    selectedDocument?.articleNumber === "第1条"
                                      ? "2px solid var(--aegis-color-border-yellow-default)"
                                      : "none",
                                  transition: "all 0.3s ease",
                                }}
                              >
                                <Text
                                  variant="title.small"
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    marginBottom: "var(--aegis-space-small)",
                                  }}
                                >
                                  第1条(目的)
                                </Text>
                                <Text variant="body.medium" style={{ lineHeight: "1.8" }}>
                                  甲は、乙に対し、法務eラーニングコンテンツ配信サービス（以下「本サービス」という）の開発及び運用を委託し、乙はこれを受託する。本契約は、本サービスの開発及び運用に関する条件を定めることを目的とする。
                                </Text>
                              </div>

                              {/* 第2条(業務内容) */}
                              <div
                                style={{
                                  marginBottom: "var(--aegis-space-large)",
                                  padding: "var(--aegis-space-medium)",
                                  backgroundColor:
                                    selectedDocument?.articleNumber === "第2条"
                                      ? "var(--aegis-color-background-yellow-subtle)"
                                      : "transparent",
                                  borderRadius: "var(--aegis-radius-small)",
                                  border:
                                    selectedDocument?.articleNumber === "第2条"
                                      ? "2px solid var(--aegis-color-border-yellow-default)"
                                      : "none",
                                  transition: "all 0.3s ease",
                                }}
                              >
                                <Text
                                  variant="title.small"
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    marginBottom: "var(--aegis-space-small)",
                                  }}
                                >
                                  第2条(業務内容)
                                </Text>
                                <Text
                                  variant="body.medium"
                                  style={{ lineHeight: "1.8", marginBottom: "var(--aegis-space-small)" }}
                                >
                                  乙は、甲の指示に従い、以下の業務を実施する。
                                </Text>
                                <div
                                  style={{
                                    marginLeft: "var(--aegis-space-medium)",
                                    marginTop: "var(--aegis-space-small)",
                                  }}
                                >
                                  <Text
                                    variant="body.medium"
                                    style={{ lineHeight: "1.8", marginBottom: "var(--aegis-space-xSmall)" }}
                                  >
                                    (1) 本サービスの企画、要件定義、設計、開発、テスト及び導入
                                  </Text>
                                  <Text
                                    variant="body.medium"
                                    style={{ lineHeight: "1.8", marginBottom: "var(--aegis-space-xSmall)" }}
                                  >
                                    (2) 本サービスの運用（インシデント対応、監視、設定変更対応を含む）
                                  </Text>
                                  <Text variant="body.medium" style={{ lineHeight: "1.8" }}>
                                    (3) 本サービス開始後の軽微な機能追加、修正及び保守
                                  </Text>
                                </div>
                              </div>
                            </div>

                            {/* その他の条項のプレースホルダー */}
                            <div style={{ marginTop: "var(--aegis-space-xLarge)" }}>
                              <Text variant="body.small" color="subtle" style={{ fontStyle: "italic" }}>
                                （以下、契約書の続きが表示されます）
                              </Text>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* 右側：契約書情報パネル */}
                  <Card>
                    <CardBody style={{ padding: 0 }}>
                      {/* ヘッダー */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "var(--aegis-space-medium)",
                          borderBottom: "1px solid var(--aegis-color-border-default)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
                          <Text variant="title.medium">契約書情報</Text>
                          <Tooltip title="情報">
                            <IconButton variant="plain" size="small" aria-label="情報">
                              <Icon>
                                <LfInformationCircle />
                              </Icon>
                            </IconButton>
                          </Tooltip>
                        </div>
                        <Tooltip title="閉じる">
                          <IconButton variant="plain" size="small" aria-label="閉じる">
                            <Icon>
                              <LfCloseLarge />
                            </Icon>
                          </IconButton>
                        </Tooltip>
                      </div>

                      {/* タブ */}
                      <Tab.Group
                        index={infoTab === "basic" ? 0 : infoTab === "management" ? 1 : 2}
                        onChange={(index) => {
                          if (index === 0) setInfoTab("basic");
                          else if (index === 1) setInfoTab("management");
                          else setInfoTab("pdf");
                        }}
                      >
                        <Tab.List style={{ padding: "0 var(--aegis-space-medium)" }}>
                          <Tab>基本情報</Tab>
                          <Tab>管理情報</Tab>
                          <Tab>PDF</Tab>
                        </Tab.List>

                        <Tab.Panels>
                          {/* 基本情報タブ */}
                          <Tab.Panel>
                            <div
                              style={{
                                padding: "var(--aegis-space-medium)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--aegis-space-large)",
                              }}
                            >
                              {/* 契約期間セクション */}
                              <div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: "var(--aegis-space-medium)",
                                  }}
                                >
                                  <Text variant="title.small">契約期間</Text>
                                  <Button leading={LfPen} variant="subtle" size="small">
                                    編集
                                  </Button>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "var(--aegis-space-small)",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "140px 1fr",
                                      gap: "var(--aegis-space-small)",
                                      alignItems: "start",
                                    }}
                                  >
                                    <Text variant="label.medium" color="subtle">
                                      契約状況
                                    </Text>
                                    <StatusLabel>{contract.status}</StatusLabel>
                                  </div>
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "140px 1fr",
                                      gap: "var(--aegis-space-small)",
                                      alignItems: "start",
                                    }}
                                  >
                                    <Text variant="label.medium" color="subtle">
                                      契約の自動更新
                                    </Text>
                                    <Text variant="body.medium">{contract.autoRenewal}</Text>
                                  </div>
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "140px 1fr",
                                      gap: "var(--aegis-space-small)",
                                      alignItems: "start",
                                    }}
                                  >
                                    <Text variant="label.medium" color="subtle">
                                      対応状況
                                    </Text>
                                    <Text variant="body.medium">自動更新予定</Text>
                                  </div>
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "140px 1fr",
                                      gap: "var(--aegis-space-small)",
                                      alignItems: "start",
                                    }}
                                  >
                                    <Text variant="label.medium" color="subtle">
                                      契約締結日
                                    </Text>
                                    <Text variant="body.medium">{contract.signedDate}</Text>
                                  </div>
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "140px 1fr",
                                      gap: "var(--aegis-space-small)",
                                      alignItems: "start",
                                    }}
                                  >
                                    <Text variant="label.medium" color="subtle">
                                      契約開始日
                                    </Text>
                                    <Text variant="body.medium">{contract.signedDate}</Text>
                                  </div>
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "140px 1fr",
                                      gap: "var(--aegis-space-small)",
                                      alignItems: "start",
                                    }}
                                  >
                                    <Text variant="label.medium" color="subtle">
                                      契約終了日
                                    </Text>
                                    <Text variant="body.medium">契約終了: {contract.endDate} (更新拒絶の場合)</Text>
                                  </div>
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "140px 1fr",
                                      gap: "var(--aegis-space-small)",
                                      alignItems: "start",
                                    }}
                                  >
                                    <Text variant="label.medium" color="subtle">
                                      自動更新後の契約期間
                                    </Text>
                                    <Text variant="body.medium">自動更新: 1年</Text>
                                  </div>
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "140px 1fr",
                                      gap: "var(--aegis-space-small)",
                                      alignItems: "start",
                                    }}
                                  >
                                    <Text variant="label.medium" color="subtle">
                                      更新拒絶期限日
                                    </Text>
                                    <Text variant="body.medium">2026/09/29 (契約期間満了の6ヶ月前に通知)</Text>
                                  </div>
                                </div>
                              </div>

                              {/* 取引金額セクション */}
                              <div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: "var(--aegis-space-medium)",
                                  }}
                                >
                                  <Text variant="title.small">取引金額</Text>
                                  <Button leading={LfPen} variant="subtle" size="small">
                                    編集
                                  </Button>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "var(--aegis-space-small)",
                                  }}
                                >
                                  <Text variant="body.medium" color="subtle">
                                    取引金額の情報がここに表示されます。
                                  </Text>
                                </div>
                              </div>
                            </div>
                          </Tab.Panel>

                          {/* 管理情報タブ */}
                          <Tab.Panel>
                            <div
                              style={{
                                padding: "var(--aegis-space-medium)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--aegis-space-medium)",
                              }}
                            >
                              <Text variant="body.medium" color="subtle">
                                管理情報の内容がここに表示されます。
                              </Text>
                            </div>
                          </Tab.Panel>

                          {/* PDFタブ */}
                          <Tab.Panel>
                            <div
                              style={{
                                padding: "var(--aegis-space-medium)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--aegis-space-medium)",
                              }}
                            >
                              <Text variant="body.medium" color="subtle">
                                PDF情報の内容がここに表示されます。
                              </Text>
                            </div>
                          </Tab.Panel>
                        </Tab.Panels>
                      </Tab.Group>
                    </CardBody>
                  </Card>
                </div>
              </Tab.Panel>

              {/* Relationsタブ */}
              <Tab.Panel>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 400px",
                    gap: "var(--aegis-space-xLarge)",
                  }}
                >
                  {/* 左側：契約関係図 */}
                  <Card>
                    <CardBody>
                      <ContentHeader size="medium">
                        <ContentHeader.Title>契約関係図</ContentHeader.Title>
                        <ContentHeader.Description>
                          原契約を中心に、覚書と個別契約の関係性を表示しています。各書類をクリックすると右側のリストで詳細を確認できます。
                        </ContentHeader.Description>
                      </ContentHeader>

                      {/* 凡例 */}
                      <div
                        style={{
                          display: "flex",
                          gap: "var(--aegis-space-medium)",
                          marginTop: "var(--aegis-space-medium)",
                          marginBottom: "var(--aegis-space-large)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "var(--aegis-radius-small)",
                              backgroundColor: "var(--aegis-color-background-blue-default)",
                              border: "2px solid var(--aegis-color-border-blue-default)",
                            }}
                          />
                          <Text variant="body.small">原契約</Text>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "var(--aegis-radius-small)",
                              backgroundColor: "var(--aegis-color-background-yellow-default)",
                              border: "2px solid var(--aegis-color-border-yellow-default)",
                            }}
                          />
                          <Text variant="body.small">覚書</Text>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "var(--aegis-radius-small)",
                              backgroundColor: "var(--aegis-color-background-teal-default)",
                              border: "2px solid var(--aegis-color-border-teal-default)",
                            }}
                          />
                          <Text variant="body.small">個別契約</Text>
                        </div>
                      </div>

                      {/* 関係図 */}
                      <div
                        style={{
                          padding: 0,
                          backgroundColor: "var(--aegis-color-background-neutral-subtle)",
                          borderRadius: "var(--aegis-radius-medium)",
                          minHeight: "500px",
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {/* 左側：個別契約（SOW） - 縦並び */}
                        <div
                          style={{
                            position: "absolute",
                            left: "var(--aegis-space-large)",
                            top: "50%",
                            transform: "translateY(-50%)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--aegis-space-medium)",
                            alignItems: "flex-end",
                          }}
                        >
                          {contract.sowDocuments?.map((doc) => {
                            const isSelected = selectedDocument?.id === doc.id;

                            return (
                              <div key={doc.id} style={{ position: "relative", width: "220px" }}>
                                {/* 接続線 */}
                                <div
                                  style={{
                                    position: "absolute",
                                    right: "-180px",
                                    top: "50%",
                                    width: "180px",
                                    height: "2px",
                                    borderTop: "2px dashed var(--aegis-color-border-default)",
                                    zIndex: 0,
                                  }}
                                />
                                {/* 関係ラベル */}
                                <div
                                  style={{
                                    position: "absolute",
                                    right: "-90px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    zIndex: 1,
                                  }}
                                >
                                  <Tag color="purple" size="small" variant="outline">
                                    governs
                                  </Tag>
                                </div>
                                {/* 個別契約カード */}
                                <Card
                                  style={{
                                    border: isSelected
                                      ? "3px solid var(--aegis-color-border-teal-default)"
                                      : "2px solid var(--aegis-color-border-teal-default)",
                                    cursor: "pointer",
                                    zIndex: 2,
                                    backgroundColor: isSelected
                                      ? "var(--aegis-color-background-teal-subtle)"
                                      : "var(--aegis-color-background-default)",
                                    transition: "all 0.2s ease",
                                    boxShadow: isSelected
                                      ? "0 0 0 3px var(--aegis-color-background-teal-subtle), 0 2px 8px rgba(0, 0, 0, 0.15)"
                                      : "0 1px 2px rgba(0, 0, 0, 0.05)",
                                  }}
                                  onClick={() => setSelectedDocument(doc)}
                                >
                                  <CardBody>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "var(--aegis-space-xSmall)",
                                        alignItems: "flex-start",
                                      }}
                                    >
                                      <Icon>
                                        <LfFile />
                                      </Icon>
                                      <Tag color="teal" size="small">
                                        {getDocumentTypeLabel(doc.documentType)}
                                      </Tag>
                                      <Text variant="body.medium">{doc.number}</Text>
                                      <Text variant="body.small" color="subtle">
                                        締結日: {doc.date}
                                      </Text>
                                    </div>
                                  </CardBody>
                                </Card>
                              </div>
                            );
                          })}
                        </div>

                        {/* 中央の原契約 */}
                        <Card
                          style={{
                            minWidth: "200px",
                            border:
                              selectedDocument === null
                                ? "3px solid var(--aegis-color-border-blue-default)"
                                : "2px solid var(--aegis-color-border-blue-default)",
                            cursor: "pointer",
                            backgroundColor:
                              selectedDocument === null
                                ? "var(--aegis-color-background-blue-subtle)"
                                : "var(--aegis-color-background-default)",
                            transition: "all 0.2s ease",
                            boxShadow:
                              selectedDocument === null
                                ? "0 0 0 3px var(--aegis-color-background-blue-subtle), 0 2px 8px rgba(0, 0, 0, 0.15)"
                                : "0 1px 2px rgba(0, 0, 0, 0.05)",
                            zIndex: 2,
                          }}
                          onClick={() => setSelectedDocument(null)}
                        >
                          <CardBody>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--aegis-space-small)",
                              }}
                            >
                              <Icon>
                                <LfFileSigned />
                              </Icon>
                              <Tag color="blue" size="small">
                                {getDocumentTypeLabel(contract.documentType)}
                              </Tag>
                              <Text variant="title.medium">{contract.title}</Text>
                              <Text variant="body.small" color="subtle">
                                締結日: {contract.signedDate}
                              </Text>
                            </div>
                          </CardBody>
                        </Card>

                        {/* 右側：覚書 - 縦並び */}
                        <div
                          style={{
                            position: "absolute",
                            right: "var(--aegis-space-large)",
                            top: "50%",
                            transform: "translateY(-50%)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--aegis-space-medium)",
                            alignItems: "flex-start",
                          }}
                        >
                          {contract.relatedDocuments.map((doc) => {
                            const isSelected = selectedDocument?.id === doc.id;

                            return (
                              <div key={doc.id} style={{ position: "relative", width: "220px" }}>
                                {/* 接続線 */}
                                <div
                                  style={{
                                    position: "absolute",
                                    left: "-180px",
                                    top: "50%",
                                    width: "180px",
                                    height: "2px",
                                    borderTop: "2px dashed var(--aegis-color-border-default)",
                                    zIndex: 0,
                                  }}
                                />
                                {/* 関係ラベル */}
                                <div
                                  style={{
                                    position: "absolute",
                                    left: "-90px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    zIndex: 1,
                                  }}
                                >
                                  <Tag color="teal" size="small" variant="outline">
                                    amends
                                  </Tag>
                                </div>
                                {/* 覚書カード */}
                                <Card
                                  style={{
                                    border: isSelected
                                      ? "3px solid var(--aegis-color-border-yellow-default)"
                                      : "2px solid var(--aegis-color-border-yellow-default)",
                                    cursor: "pointer",
                                    zIndex: 2,
                                    backgroundColor: isSelected
                                      ? "var(--aegis-color-background-yellow-subtle)"
                                      : "var(--aegis-color-background-default)",
                                    transition: "all 0.2s ease",
                                    boxShadow: isSelected
                                      ? "0 0 0 3px var(--aegis-color-background-yellow-subtle), 0 2px 8px rgba(0, 0, 0, 0.15)"
                                      : "0 1px 2px rgba(0, 0, 0, 0.05)",
                                  }}
                                  onClick={() => setSelectedDocument(doc)}
                                >
                                  <CardBody>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "var(--aegis-space-xSmall)",
                                        alignItems: "flex-start",
                                      }}
                                    >
                                      <Icon>
                                        <LfFileLines />
                                      </Icon>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "var(--aegis-space-xxSmall)",
                                          flexWrap: "wrap",
                                        }}
                                      >
                                        <Tag color="yellow" size="small">
                                          {getDocumentTypeLabel(doc.documentType)}
                                        </Tag>
                                        {doc.isLatest && (
                                          <Tag color="teal" size="small">
                                            最新
                                          </Tag>
                                        )}
                                      </div>
                                      <Text variant="body.medium">{doc.number}</Text>
                                      <Text variant="body.small" color="subtle">
                                        締結日: {doc.date}
                                      </Text>
                                      {doc.relationship && (
                                        <Text variant="body.small" color="subtle">
                                          関係: {doc.relationship}
                                        </Text>
                                      )}
                                    </div>
                                  </CardBody>
                                </Card>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* 右側：関連書類一覧 */}
                  <Card>
                    <CardBody>
                      <ContentHeader size="medium">
                        <ContentHeader.Title>関連書類一覧</ContentHeader.Title>
                        <ContentHeader.Description>書類をクリックして詳細を確認</ContentHeader.Description>
                      </ContentHeader>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--aegis-space-medium)",
                          marginTop: "var(--aegis-space-medium)",
                        }}
                      >
                        {/* 原契約 */}
                        <div
                          ref={(el) => {
                            originalContractRef.current = el;
                          }}
                        >
                          <ButtonGroup attached variant="subtle">
                            <InformationCard
                              clickable
                              icon={LfFileSigned}
                              onClick={() => setSelectedDocument(null)}
                              style={{
                                backgroundColor:
                                  selectedDocument === null
                                    ? "var(--aegis-color-background-blue-subtle)"
                                    : "var(--aegis-color-background-default)",
                                border:
                                  selectedDocument === null
                                    ? "2px solid var(--aegis-color-border-blue-default)"
                                    : "1px solid transparent",
                                transition: "all 0.2s ease",
                              }}
                            >
                              <InformationCard.Body>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "var(--aegis-space-xSmall)",
                                    marginBottom: "var(--aegis-space-xxSmall)",
                                  }}
                                >
                                  <Tag color="blue" size="small">
                                    {getDocumentTypeLabel(contract.documentType)}
                                  </Tag>
                                </div>
                                <InformationCard.Title>{contract.title}</InformationCard.Title>
                                <InformationCard.Description>締結日: {contract.signedDate}</InformationCard.Description>
                              </InformationCard.Body>
                            </InformationCard>
                            <Button
                              variant="subtle"
                              size="small"
                              leading={LfArrowUpRightFromSquare}
                              onClick={() => {
                                setPreviewDocument(null);
                                setPreviewOpen(true);
                              }}
                            >
                              書類を開く
                            </Button>
                          </ButtonGroup>
                        </div>

                        {/* 個別契約（SOW）一覧 */}
                        {contract.sowDocuments?.map((doc) => (
                          <div
                            key={doc.id}
                            ref={(el) => {
                              documentCardRefs.current[doc.id] = el;
                            }}
                          >
                            <ButtonGroup attached variant="subtle">
                              <InformationCard
                                clickable
                                icon={LfFile}
                                onClick={() => setSelectedDocument(doc)}
                                style={{
                                  backgroundColor:
                                    selectedDocument?.id === doc.id
                                      ? "var(--aegis-color-background-teal-subtle)"
                                      : "var(--aegis-color-background-default)",
                                  border:
                                    selectedDocument?.id === doc.id
                                      ? "2px solid var(--aegis-color-border-teal-default)"
                                      : "1px solid transparent",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <InformationCard.Body>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "var(--aegis-space-xSmall)",
                                      marginBottom: "var(--aegis-space-xxSmall)",
                                    }}
                                  >
                                    <Tag color="teal" size="small">
                                      {getDocumentTypeLabel(doc.documentType)}
                                    </Tag>
                                  </div>
                                  <InformationCard.Title>{doc.number}</InformationCard.Title>
                                  <InformationCard.Description>
                                    締結日: {doc.date}
                                    {doc.relationship && `・関係: ${doc.relationship}`}
                                  </InformationCard.Description>
                                </InformationCard.Body>
                              </InformationCard>
                              <Button
                                variant="subtle"
                                size="small"
                                leading={LfArrowUpRightFromSquare}
                                onClick={() => {
                                  setPreviewDocument(doc);
                                  setPreviewOpen(true);
                                }}
                              >
                                書類を開く
                              </Button>
                            </ButtonGroup>
                          </div>
                        ))}

                        {/* 覚書一覧 */}
                        {contract.relatedDocuments.map((doc) => (
                          <div
                            key={doc.id}
                            ref={(el) => {
                              documentCardRefs.current[doc.id] = el;
                            }}
                          >
                            <ButtonGroup attached variant="subtle">
                              <InformationCard
                                clickable
                                icon={LfFileLines}
                                onClick={() => setSelectedDocument(doc)}
                                style={{
                                  backgroundColor:
                                    selectedDocument?.id === doc.id
                                      ? "var(--aegis-color-background-yellow-subtle)"
                                      : "var(--aegis-color-background-default)",
                                  border:
                                    selectedDocument?.id === doc.id
                                      ? "2px solid var(--aegis-color-border-yellow-default)"
                                      : "1px solid transparent",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <InformationCard.Body>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "var(--aegis-space-xSmall)",
                                      marginBottom: "var(--aegis-space-xxSmall)",
                                    }}
                                  >
                                    <Tag color="yellow" size="small">
                                      {getDocumentTypeLabel(doc.documentType)}
                                    </Tag>
                                    {doc.isLatest && (
                                      <Tag color="teal" size="small">
                                        最新
                                      </Tag>
                                    )}
                                  </div>
                                  <InformationCard.Title>{doc.number}</InformationCard.Title>
                                  <InformationCard.Description>
                                    締結日: {doc.date}
                                    {doc.relationship && `・関係: ${doc.relationship}`}
                                  </InformationCard.Description>
                                </InformationCard.Body>
                              </InformationCard>
                              <Button
                                variant="subtle"
                                size="small"
                                leading={LfArrowUpRightFromSquare}
                                onClick={() => {
                                  setPreviewDocument(doc);
                                  setPreviewOpen(true);
                                }}
                              >
                                書類を開く
                              </Button>
                            </ButtonGroup>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab.Panel>

              {/* Compositeタブ */}
              <Tab.Panel>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "280px 1fr 380px",
                    gap: "var(--aegis-space-large)",
                    alignItems: "start",
                  }}
                >
                  {/* 左側：変更履歴タイムライン */}
                  <Card>
                    <CardBody style={{ paddingTop: 0 }}>
                      <ContentHeader size="small">
                        <ContentHeader.Title>変更履歴</ContentHeader.Title>
                        <ContentHeader.Description>時系列で表示</ContentHeader.Description>
                      </ContentHeader>
                      <div style={{ marginTop: "var(--aegis-space-small)" }}>
                        <Timeline>
                          {/* 原契約 */}
                          <TimelineItem>
                            <Timeline.Point>
                              <div
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  borderRadius: "50%",
                                  backgroundColor:
                                    selectedDocument === null
                                      ? "var(--aegis-color-background-blue-default)"
                                      : "var(--aegis-color-background-default)",
                                  border:
                                    selectedDocument === null
                                      ? "3px solid var(--aegis-color-border-blue-default)"
                                      : "2px solid var(--aegis-color-border-default)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  transition: "all 0.3s ease",
                                }}
                              >
                                <Icon>
                                  <LfFileSigned />
                                </Icon>
                              </div>
                            </Timeline.Point>
                            <Timeline.Content>
                              <button
                                type="button"
                                style={{
                                  cursor: "pointer",
                                  padding: "var(--aegis-space-small)",
                                  borderRadius: "var(--aegis-radius-small)",
                                  backgroundColor:
                                    selectedDocument === null
                                      ? "var(--aegis-color-background-blue-subtle)"
                                      : "var(--aegis-color-background-default)",
                                  border:
                                    selectedDocument === null
                                      ? "2px solid var(--aegis-color-border-blue-default)"
                                      : "1px solid var(--aegis-color-border-default)",
                                  transition: "all 0.3s ease",
                                  boxShadow:
                                    selectedDocument === null
                                      ? "0 0 0 3px var(--aegis-color-background-blue-subtle), 0 2px 4px rgba(0, 0, 0, 0.1)"
                                      : "0 1px 2px rgba(0, 0, 0, 0.05)",
                                  width: "100%",
                                  textAlign: "left",
                                  fontFamily: "inherit",
                                  fontSize: "inherit",
                                  lineHeight: "inherit",
                                }}
                                onClick={handleSelectOriginalContract}
                                onKeyDown={(e) => handleKeyDown(e, handleSelectOriginalContract)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "var(--aegis-space-xxSmall)",
                                    marginBottom: "var(--aegis-space-xxSmall)",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {selectedDocument === null && (
                                    <Text
                                      variant="caption.small"
                                      style={{
                                        fontWeight: "bold",
                                        color: "var(--aegis-color-text-blue-default)",
                                        backgroundColor: "var(--aegis-color-background-blue-default)",
                                        padding: "2px 6px",
                                        borderRadius: "var(--aegis-radius-small)",
                                      }}
                                    >
                                      選択中
                                    </Text>
                                  )}
                                  <Tag color="blue" size="small">
                                    {getDocumentTypeLabel(contract.documentType)}
                                  </Tag>
                                </div>
                                <Text
                                  variant="body.medium"
                                  style={{ fontWeight: "bold", marginBottom: "var(--aegis-space-xxSmall)" }}
                                >
                                  {contract.title}
                                </Text>
                                <Text variant="body.small" color="subtle">
                                  {contract.signedDate}
                                </Text>
                              </button>
                            </Timeline.Content>
                          </TimelineItem>

                          {/* 覚書 */}
                          {contract.relatedDocuments.map((doc) => (
                            <TimelineItem key={doc.id}>
                              <Timeline.Point>
                                <div
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "50%",
                                    backgroundColor:
                                      selectedDocument?.id === doc.id
                                        ? "var(--aegis-color-background-yellow-default)"
                                        : "var(--aegis-color-background-default)",
                                    border:
                                      selectedDocument?.id === doc.id
                                        ? "3px solid var(--aegis-color-border-yellow-default)"
                                        : "2px solid var(--aegis-color-border-default)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 0.3s ease",
                                  }}
                                >
                                  <Icon>
                                    <LfFileLines />
                                  </Icon>
                                </div>
                              </Timeline.Point>
                              <Timeline.Content>
                                <button
                                  type="button"
                                  style={{
                                    cursor: "pointer",
                                    padding: "var(--aegis-space-small)",
                                    borderRadius: "var(--aegis-radius-small)",
                                    backgroundColor:
                                      selectedDocument?.id === doc.id
                                        ? "var(--aegis-color-background-yellow-subtle)"
                                        : "var(--aegis-color-background-default)",
                                    border:
                                      selectedDocument?.id === doc.id
                                        ? "2px solid var(--aegis-color-border-yellow-default)"
                                        : "1px solid var(--aegis-color-border-default)",
                                    transition: "all 0.3s ease",
                                    boxShadow:
                                      selectedDocument?.id === doc.id
                                        ? "0 0 0 3px var(--aegis-color-background-yellow-subtle), 0 2px 4px rgba(0, 0, 0, 0.1)"
                                        : "0 1px 2px rgba(0, 0, 0, 0.05)",
                                    width: "100%",
                                    textAlign: "left",
                                    fontFamily: "inherit",
                                    fontSize: "inherit",
                                    lineHeight: "inherit",
                                  }}
                                  onClick={() => handleSelectAmendment(doc)}
                                  onKeyDown={(e) => handleKeyDown(e, () => handleSelectAmendment(doc))}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "var(--aegis-space-xxSmall)",
                                      marginBottom: "var(--aegis-space-xxSmall)",
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    {selectedDocument?.id === doc.id && (
                                      <Text
                                        variant="caption.small"
                                        style={{
                                          fontWeight: "bold",
                                          color: "var(--aegis-color-text-yellow-default)",
                                          backgroundColor: "var(--aegis-color-background-yellow-default)",
                                          padding: "2px 6px",
                                          borderRadius: "var(--aegis-radius-small)",
                                        }}
                                      >
                                        選択中
                                      </Text>
                                    )}
                                    <Tag color="yellow" size="small">
                                      {getDocumentTypeLabel(doc.documentType)}
                                    </Tag>
                                    <Text variant="body.medium" style={{ fontWeight: "bold" }}>
                                      {doc.number}
                                    </Text>
                                    {doc.isLatest && (
                                      <Tag color="teal" size="small">
                                        最新
                                      </Tag>
                                    )}
                                  </div>
                                  <Text
                                    variant="body.small"
                                    color="subtle"
                                    style={{ marginBottom: "var(--aegis-space-xxSmall)" }}
                                  >
                                    {doc.date}
                                  </Text>
                                  {doc.articleNumber && doc.articleTitle && (
                                    <Text variant="caption.small" color="subtle">
                                      {doc.articleNumber} ({doc.articleTitle})
                                    </Text>
                                  )}
                                </button>
                              </Timeline.Content>
                            </TimelineItem>
                          ))}
                        </Timeline>
                      </div>
                    </CardBody>
                  </Card>

                  {/* 中央：統合後の契約本文 */}
                  <Card>
                    <CardBody style={{ paddingTop: 0 }}>
                      <ContentHeader size="small">
                        <ContentHeader.Title>履歴版 業務委託契約書_ラーニングジェエア.pdf</ContentHeader.Title>
                        <ContentHeader.Description>
                          ファイル公開者: Docusign User・ファイル最終日時: 2025/12/11 34:39
                        </ContentHeader.Description>
                      </ContentHeader>
                      <div
                        style={{
                          marginTop: "var(--aegis-space-small)",
                          padding: "var(--aegis-space-xLarge)",
                          backgroundColor: "var(--aegis-color-background-default)",
                          borderRadius: "var(--aegis-radius-medium)",
                          border: "1px solid var(--aegis-color-border-default)",
                          minHeight: "700px",
                        }}
                      >
                        {/* 契約書本文のサンプル */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
                          <div>
                            <Text variant="body.medium">
                              本契約は、LegalOn Technologies
                              株式会社（以下「甲」という）とラーニングジェエリング株式会社（以下「乙」という）が、以下のとおり業務委託契約を締結する。
                            </Text>
                          </div>

                          {/* 第1条 */}
                          <div
                            id="article-1"
                            style={{
                              padding: "var(--aegis-space-medium)",
                              borderRadius: "var(--aegis-radius-small)",
                              backgroundColor:
                                selectedDocument?.articleNumber === "第1条"
                                  ? "var(--aegis-color-background-yellow-subtle)"
                                  : "transparent",
                              border:
                                selectedDocument?.articleNumber === "第1条"
                                  ? "2px solid var(--aegis-color-border-yellow-default)"
                                  : "1px solid transparent",
                              transition: "all 0.3s ease",
                              boxShadow:
                                selectedDocument?.articleNumber === "第1条"
                                  ? "0 0 0 3px var(--aegis-color-background-yellow-subtle), 0 2px 4px rgba(0, 0, 0, 0.1)"
                                  : "none",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--aegis-space-xSmall)",
                                marginBottom: "var(--aegis-space-small)",
                                flexWrap: "wrap",
                              }}
                            >
                              <Text
                                variant="title.small"
                                style={{
                                  color:
                                    selectedDocument?.articleNumber === "第1条"
                                      ? "var(--aegis-color-text-yellow-default)"
                                      : "var(--aegis-color-text-default)",
                                  fontWeight: selectedDocument?.articleNumber === "第1条" ? "bold" : "normal",
                                }}
                              >
                                第1条 (目的)
                              </Text>
                              {contract.relatedDocuments.find((d) => d.articleNumber === "第1条") && (
                                <Tag
                                  color="yellow"
                                  size="small"
                                  style={{
                                    backgroundColor:
                                      selectedDocument?.articleNumber === "第1条"
                                        ? "var(--aegis-color-background-yellow-default)"
                                        : undefined,
                                  }}
                                >
                                  {contract.relatedDocuments.find((d) => d.articleNumber === "第1条")?.number}で変更
                                </Tag>
                              )}
                            </div>
                            <Text
                              variant="body.medium"
                              style={{
                                color:
                                  selectedDocument?.articleNumber === "第1条"
                                    ? "var(--aegis-color-text-default)"
                                    : "var(--aegis-color-text-default)",
                              }}
                            >
                              本契約は、甲が乙に対して委託する業務の内容、報酬、その他の条件を定めることを目的とする。
                            </Text>
                          </div>

                          {/* 第2条 */}
                          <div
                            id="article-2"
                            style={{
                              padding: "var(--aegis-space-medium)",
                              borderRadius: "var(--aegis-radius-small)",
                              backgroundColor:
                                selectedDocument?.articleNumber === "第2条"
                                  ? "var(--aegis-color-background-yellow-subtle)"
                                  : "transparent",
                              border:
                                selectedDocument?.articleNumber === "第2条"
                                  ? "2px solid var(--aegis-color-border-yellow-default)"
                                  : "1px solid transparent",
                              transition: "all 0.3s ease",
                              boxShadow:
                                selectedDocument?.articleNumber === "第2条"
                                  ? "0 0 0 3px var(--aegis-color-background-yellow-subtle), 0 2px 4px rgba(0, 0, 0, 0.1)"
                                  : "none",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--aegis-space-xSmall)",
                                marginBottom: "var(--aegis-space-small)",
                                flexWrap: "wrap",
                              }}
                            >
                              <Text
                                variant="title.small"
                                style={{
                                  color:
                                    selectedDocument?.articleNumber === "第2条"
                                      ? "var(--aegis-color-text-yellow-default)"
                                      : "var(--aegis-color-text-default)",
                                  fontWeight: selectedDocument?.articleNumber === "第2条" ? "bold" : "normal",
                                }}
                              >
                                第2条 (業務内容)
                              </Text>
                              {contract.relatedDocuments.find((d) => d.articleNumber === "第2条") && (
                                <Tag
                                  color="yellow"
                                  size="small"
                                  style={{
                                    backgroundColor:
                                      selectedDocument?.articleNumber === "第2条"
                                        ? "var(--aegis-color-background-yellow-default)"
                                        : undefined,
                                  }}
                                >
                                  {contract.relatedDocuments.find((d) => d.articleNumber === "第2条")?.number}で追加
                                </Tag>
                              )}
                            </div>
                            <Text variant="body.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
                              乙は、甲の指示に従い、以下の業務を実施する。
                            </Text>
                            <Text variant="body.medium" style={{ marginLeft: "var(--aegis-space-medium)" }}>
                              (1) システム開発業務
                            </Text>
                            <Text variant="body.medium" style={{ marginLeft: "var(--aegis-space-medium)" }}>
                              (2) テスト工程の実施
                            </Text>
                            <Text variant="body.medium" style={{ marginLeft: "var(--aegis-space-medium)" }}>
                              (3) 監視業務および緊急時対応
                            </Text>
                          </div>

                          {/* 第7条 */}
                          <div
                            id="article-7"
                            style={{
                              padding: "var(--aegis-space-medium)",
                              borderRadius: "var(--aegis-radius-small)",
                              backgroundColor:
                                selectedDocument?.articleNumber === "第7条"
                                  ? "var(--aegis-color-background-yellow-subtle)"
                                  : "transparent",
                              border:
                                selectedDocument?.articleNumber === "第7条"
                                  ? "2px solid var(--aegis-color-border-yellow-default)"
                                  : "1px solid transparent",
                              transition: "all 0.3s ease",
                              boxShadow:
                                selectedDocument?.articleNumber === "第7条"
                                  ? "0 0 0 3px var(--aegis-color-background-yellow-subtle), 0 2px 4px rgba(0, 0, 0, 0.1)"
                                  : "none",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--aegis-space-xSmall)",
                                marginBottom: "var(--aegis-space-small)",
                                flexWrap: "wrap",
                              }}
                            >
                              <Text
                                variant="title.small"
                                style={{
                                  color:
                                    selectedDocument?.articleNumber === "第7条"
                                      ? "var(--aegis-color-text-yellow-default)"
                                      : "var(--aegis-color-text-default)",
                                  fontWeight: selectedDocument?.articleNumber === "第7条" ? "bold" : "normal",
                                }}
                              >
                                第7条 (責任)
                              </Text>
                              {contract.relatedDocuments.find((d) => d.articleNumber === "第7条") && (
                                <Tag
                                  color="yellow"
                                  size="small"
                                  style={{
                                    backgroundColor:
                                      selectedDocument?.articleNumber === "第7条"
                                        ? "var(--aegis-color-background-yellow-default)"
                                        : undefined,
                                  }}
                                >
                                  {contract.relatedDocuments.find((d) => d.articleNumber === "第7条")?.number}で変更
                                </Tag>
                              )}
                            </div>
                            <Text variant="body.medium">
                              乙は、本契約の履行に関して甲に生じた損害について、その責に任ずる。ただし、乙の故意または重過失による場合に限る。
                            </Text>
                          </div>

                          {/* 第12条 */}
                          <div
                            id="article-12"
                            style={{
                              padding: "var(--aegis-space-medium)",
                              borderRadius: "var(--aegis-radius-small)",
                              backgroundColor:
                                selectedDocument?.articleNumber === "第12条"
                                  ? "var(--aegis-color-background-yellow-subtle)"
                                  : "transparent",
                              border:
                                selectedDocument?.articleNumber === "第12条"
                                  ? "2px solid var(--aegis-color-border-yellow-default)"
                                  : "1px solid transparent",
                              transition: "all 0.3s ease",
                              boxShadow:
                                selectedDocument?.articleNumber === "第12条"
                                  ? "0 0 0 3px var(--aegis-color-background-yellow-subtle), 0 2px 4px rgba(0, 0, 0, 0.1)"
                                  : "none",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--aegis-space-xSmall)",
                                marginBottom: "var(--aegis-space-small)",
                                flexWrap: "wrap",
                              }}
                            >
                              <Text
                                variant="title.small"
                                style={{
                                  color:
                                    selectedDocument?.articleNumber === "第12条"
                                      ? "var(--aegis-color-text-yellow-default)"
                                      : "var(--aegis-color-text-default)",
                                  fontWeight: selectedDocument?.articleNumber === "第12条" ? "bold" : "normal",
                                }}
                              >
                                第12条 (契約期間)
                              </Text>
                              {contract.relatedDocuments.find((d) => d.articleNumber === "第12条") && (
                                <Tag
                                  color="yellow"
                                  size="small"
                                  style={{
                                    backgroundColor:
                                      selectedDocument?.articleNumber === "第12条"
                                        ? "var(--aegis-color-background-yellow-default)"
                                        : undefined,
                                  }}
                                >
                                  {contract.relatedDocuments.find((d) => d.articleNumber === "第12条")?.number}で変更
                                </Tag>
                              )}
                            </div>
                            <Text variant="body.medium">
                              本契約の有効期間は、{contract.signedDate}から{contract.endDate}
                              までとする。期間満了の30日前までに、いずれの当事者からも書面による解約の申し出がない場合、本契約は1年間自動的に更新されるものとする。
                            </Text>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* 右側：変更内容の詳細 */}
                  <Card>
                    <CardBody style={{ paddingTop: 0 }}>
                      <ContentHeader size="small">
                        <ContentHeader.Title>変更内容の詳細</ContentHeader.Title>
                        <ContentHeader.Description>左のタイムラインから選択</ContentHeader.Description>
                      </ContentHeader>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--aegis-space-medium)",
                          marginTop: "var(--aegis-space-small)",
                          maxHeight: "calc(100vh - 300px)",
                          overflowY: "auto",
                        }}
                      >
                        {contract.relatedDocuments.map((doc) => (
                          <div
                            key={doc.id}
                            ref={(el) => {
                              documentCardRefs.current[doc.id] = el;
                            }}
                          >
                            <Card
                              style={{
                                cursor: "pointer",
                                border:
                                  selectedDocument?.id === doc.id
                                    ? "2px solid var(--aegis-color-border-yellow-default)"
                                    : "1px solid var(--aegis-color-border-default)",
                                backgroundColor:
                                  selectedDocument?.id === doc.id
                                    ? "var(--aegis-color-background-yellow-subtle)"
                                    : "var(--aegis-color-background-default)",
                                transition: "all 0.3s ease",
                                boxShadow:
                                  selectedDocument?.id === doc.id
                                    ? "0 0 0 3px var(--aegis-color-background-yellow-subtle), 0 2px 8px rgba(0, 0, 0, 0.15)"
                                    : "0 1px 2px rgba(0, 0, 0, 0.05)",
                                transform: selectedDocument?.id === doc.id ? "scale(1.02)" : "scale(1)",
                              }}
                              onClick={() => {
                                setSelectedDocument(doc);
                                // 中央のプレビュー内の該当条文にスクロール
                                setTimeout(() => {
                                  const articleId = `article-${doc.articleNumber?.replace("第", "").replace("条", "")}`;
                                  const articleElement = document.getElementById(articleId);
                                  if (articleElement) {
                                    articleElement.scrollIntoView({
                                      behavior: "smooth",
                                      block: "center",
                                    });
                                  }
                                }, 100);
                              }}
                            >
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
                                    <LfFileLines />
                                  </Icon>
                                  {selectedDocument?.id === doc.id && (
                                    <Text
                                      variant="body.small"
                                      style={{
                                        fontWeight: "bold",
                                        color: "var(--aegis-color-text-yellow-default)",
                                        backgroundColor: "var(--aegis-color-background-yellow-default)",
                                        padding: "2px 8px",
                                        borderRadius: "var(--aegis-radius-small)",
                                      }}
                                    >
                                      選択中
                                    </Text>
                                  )}
                                  <Tag color="yellow" size="small">
                                    {getDocumentTypeLabel(doc.documentType)} {doc.number}
                                  </Tag>
                                  {doc.isLatest && (
                                    <Tag color="teal" size="small">
                                      最新
                                    </Tag>
                                  )}
                                </div>
                                <Text
                                  variant="body.small"
                                  color="subtle"
                                  style={{ marginBottom: "var(--aegis-space-xSmall)" }}
                                >
                                  {doc.date}
                                </Text>
                                {doc.articleNumber && doc.articleTitle && (
                                  <div
                                    style={{
                                      marginBottom: "var(--aegis-space-small)",
                                      padding: "var(--aegis-space-small)",
                                      backgroundColor: "var(--aegis-color-background-neutral-subtle)",
                                      borderRadius: "var(--aegis-radius-small)",
                                    }}
                                  >
                                    <Text variant="body.medium">
                                      {doc.articleNumber} ({doc.articleTitle})
                                    </Text>
                                  </div>
                                )}
                                <Text variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
                                  {doc.summary}
                                </Text>
                                <Button variant="subtle" size="small" width="full" leading={LfFile}>
                                  覚書を開く
                                </Button>
                              </CardBody>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </PageLayoutBody>
      </PageLayoutContent>

      {/* 書類プレビューダイアログ */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent width="xLarge">
          <DialogHeader>
            <ContentHeader>
              <ContentHeader.Title>{previewDocument ? previewDocument.title : contract.title}</ContentHeader.Title>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            {previewDocument ? (
              /* 覚書のプレビュー */
              <div
                style={{
                  padding: "6px",
                  backgroundColor: "var(--aegis-color-background-default)",
                  borderRadius: "var(--aegis-radius-medium)",
                  minHeight: "600px",
                  fontFamily: "serif",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-large)",
                    maxWidth: "800px",
                    margin: "0 auto",
                    padding: "var(--aegis-space-xLarge)",
                  }}
                >
                  {/* タイトル */}
                  <div style={{ textAlign: "center", marginBottom: "var(--aegis-space-xLarge)" }}>
                    <Text variant="title.large" style={{ fontSize: "24px", fontWeight: "bold" }}>
                      {previewDocument.title}
                    </Text>
                  </div>

                  {/* 前文 */}
                  <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                    <Text variant="body.medium" style={{ lineHeight: "1.8" }}>
                      本覚書は、{contract.signedDate}に締結された「{contract.title}
                      」（以下「原契約」という）の一部を変更するものであり、原契約の他の条項は本覚書に別段の定めがない限り、その効力を有する。
                    </Text>
                  </div>

                  {/* 変更条項 */}
                  {previewDocument.articleNumber && previewDocument.articleTitle && (
                    <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                      <Text
                        variant="title.medium"
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          marginBottom: "var(--aegis-space-medium)",
                        }}
                      >
                        {previewDocument.articleNumber} ({previewDocument.articleTitle})
                      </Text>
                      <Text
                        variant="body.medium"
                        style={{ lineHeight: "1.8", marginBottom: "var(--aegis-space-small)" }}
                      >
                        原契約の{previewDocument.articleNumber}を以下のとおり変更する。
                      </Text>
                      {previewDocument.summary && (
                        <div
                          style={{
                            padding: "var(--aegis-space-medium)",
                            backgroundColor: "var(--aegis-color-background-yellow-subtle)",
                            borderRadius: "var(--aegis-radius-small)",
                            border: "1px solid var(--aegis-color-border-yellow-default)",
                            marginTop: "var(--aegis-space-small)",
                          }}
                        >
                          <Text variant="body.medium" style={{ lineHeight: "1.8" }}>
                            {previewDocument.summary}
                          </Text>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 変更内容の詳細 */}
                  {previewDocument.articleNumber === "第1条" && (
                    <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                      <Text variant="body.medium" style={{ lineHeight: "1.8" }}>
                        甲は、乙に対し、法務eラーニングコンテンツ配信サービス（以下「本サービス」という）の開発及び運用を委託し、乙はこれを受託する。本契約は、本サービスの開発及び運用に関する条件を定めることを目的とし、サービス範囲にロイヤリティ条項を追加する。
                      </Text>
                    </div>
                  )}

                  {previewDocument.articleNumber === "第2条" && (
                    <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                      <Text
                        variant="body.medium"
                        style={{ lineHeight: "1.8", marginBottom: "var(--aegis-space-small)" }}
                      >
                        乙は、甲の指示に従い、以下の業務を実施する。
                      </Text>
                      <div style={{ marginLeft: "var(--aegis-space-medium)", marginTop: "var(--aegis-space-small)" }}>
                        <Text
                          variant="body.medium"
                          style={{ lineHeight: "1.8", marginBottom: "var(--aegis-space-xSmall)" }}
                        >
                          (1) 本サービスの企画、要件定義、設計、開発、テスト及び導入
                        </Text>
                        <Text
                          variant="body.medium"
                          style={{ lineHeight: "1.8", marginBottom: "var(--aegis-space-xSmall)" }}
                        >
                          (2) 本サービスの運用（インシデント対応、監視、設定変更対応を含む）
                        </Text>
                        <Text
                          variant="body.medium"
                          style={{ lineHeight: "1.8", marginBottom: "var(--aegis-space-xSmall)" }}
                        >
                          (3) 本サービス開始後の軽微な機能追加、修正及び保守
                        </Text>
                        <Text variant="body.medium" style={{ lineHeight: "1.8" }}>
                          (4) テスト工程の実施（本覚書により追加）
                        </Text>
                      </div>
                    </div>
                  )}

                  {previewDocument.articleNumber === "第7条" && (
                    <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                      <Text variant="body.medium" style={{ lineHeight: "1.8" }}>
                        乙は、本契約の履行に関して甲に生じた損害について、その責に任ずる。ただし、乙の故意または重過失による場合に限る。損害賠償の上限は、本契約に基づく乙の受領報酬総額を超えないものとする。
                      </Text>
                    </div>
                  )}

                  {previewDocument.articleNumber === "第12条" && (
                    <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                      <Text variant="body.medium" style={{ lineHeight: "1.8" }}>
                        本契約の有効期間は、{contract.signedDate}から{contract.endDate}
                        までとする。期間満了の30日前までに、いずれの当事者からも書面による解約の申し出がない場合、本契約は1年間自動的に更新されるものとする。更新後の契約期間は、本覚書により2年間に延長される。
                      </Text>
                    </div>
                  )}

                  {/* 締結日 */}
                  <div
                    style={{
                      marginTop: "var(--aegis-space-xLarge)",
                      textAlign: "right",
                      paddingTop: "var(--aegis-space-large)",
                    }}
                  >
                    <Text variant="body.medium" style={{ lineHeight: "1.8" }}>
                      {previewDocument.date}
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "var(--aegis-space-xLarge)",
                      }}
                    >
                      <Text variant="body.medium" style={{ lineHeight: "1.8" }}>
                        甲 LegalOn Technologies 株式会社
                      </Text>
                      <Text variant="body.medium" style={{ lineHeight: "1.8" }}>
                        乙 ラーニングシェアリング株式会社
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* 原契約のプレビュー */
              <div
                style={{
                  padding: "6px",
                  backgroundColor: "var(--aegis-color-background-default)",
                  borderRadius: "var(--aegis-radius-medium)",
                  minHeight: "600px",
                  fontFamily: "serif",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-large)",
                    maxWidth: "800px",
                    margin: "0 auto",
                    padding: "var(--aegis-space-xLarge)",
                  }}
                >
                  {/* ヘッダー情報 */}
                  <div style={{ textAlign: "center", marginBottom: "var(--aegis-space-medium)" }}>
                    <Text variant="body.small" color="subtle" style={{ marginBottom: "var(--aegis-space-small)" }}>
                      Docusign Envelope ID: CC7C6C9D-D93B-4953-B353-EFA234CDF15B
                    </Text>
                  </div>

                  {/* タイトル */}
                  <div style={{ textAlign: "center", marginBottom: "var(--aegis-space-xLarge)" }}>
                    <Text variant="title.large" style={{ fontSize: "24px", fontWeight: "bold" }}>
                      {contract.title}
                    </Text>
                  </div>

                  {/* 前文 */}
                  <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                    <Text variant="body.medium" style={{ lineHeight: "1.8" }}>
                      本契約は、LegalOn Technologies
                      株式会社（以下「甲」という）とラーニングシェアリング株式会社（以下「乙」という）が、以下のとおり業務委託契約を締結する。
                    </Text>
                  </div>

                  {/* 第1 総則 */}
                  <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                    <Text
                      variant="title.medium"
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        marginBottom: "var(--aegis-space-medium)",
                      }}
                    >
                      第1 総則
                    </Text>

                    {/* 第1条(目的) */}
                    <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                      <Text
                        variant="title.small"
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          marginBottom: "var(--aegis-space-small)",
                        }}
                      >
                        第1条(目的)
                      </Text>
                      <Text variant="body.medium" style={{ lineHeight: "1.8" }}>
                        甲は、乙に対し、法務eラーニングコンテンツ配信サービス（以下「本サービス」という）の開発及び運用を委託し、乙はこれを受託する。本契約は、本サービスの開発及び運用に関する条件を定めることを目的とする。
                      </Text>
                    </div>

                    {/* 第2条(業務内容) */}
                    <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                      <Text
                        variant="title.small"
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          marginBottom: "var(--aegis-space-small)",
                        }}
                      >
                        第2条(業務内容)
                      </Text>
                      <Text
                        variant="body.medium"
                        style={{ lineHeight: "1.8", marginBottom: "var(--aegis-space-small)" }}
                      >
                        乙は、甲の指示に従い、以下の業務を実施する。
                      </Text>
                      <div style={{ marginLeft: "var(--aegis-space-medium)", marginTop: "var(--aegis-space-small)" }}>
                        <Text
                          variant="body.medium"
                          style={{ lineHeight: "1.8", marginBottom: "var(--aegis-space-xSmall)" }}
                        >
                          (1) 本サービスの企画、要件定義、設計、開発、テスト及び導入
                        </Text>
                        <Text
                          variant="body.medium"
                          style={{ lineHeight: "1.8", marginBottom: "var(--aegis-space-xSmall)" }}
                        >
                          (2) 本サービスの運用（インシデント対応、監視、設定変更対応を含む）
                        </Text>
                        <Text variant="body.medium" style={{ lineHeight: "1.8" }}>
                          (3) 本サービス開始後の軽微な機能追加、修正及び保守
                        </Text>
                      </div>
                    </div>
                  </div>

                  {/* その他の条項のプレースホルダー */}
                  <div style={{ marginTop: "var(--aegis-space-xLarge)" }}>
                    <Text variant="body.small" color="subtle" style={{ fontStyle: "italic" }}>
                      （以下、契約書の続きが表示されます）
                    </Text>
                  </div>
                </div>
              </div>
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
