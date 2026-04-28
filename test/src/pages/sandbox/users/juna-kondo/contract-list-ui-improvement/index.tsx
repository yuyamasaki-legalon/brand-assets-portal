import {
  LfAngleDownMiddle,
  LfAngleUpMiddle,
  LfArrowUpRightFromSquare,
  LfBell,
  LfEllipsisDot,
  LfFileSigned,
  LfFilesLine,
  LfFilter,
  LfHome,
  LfMagnifyingGlass,
  LfPlusLarge,
  LfQuestionCircle,
  LfWriting,
} from "@legalforce/aegis-icons";
import {
  ActionList,
  Avatar,
  Badge,
  Button,
  ContentHeader,
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  Header,
  Icon,
  IconButton,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Pagination,
  Search,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarInset,
  SidebarNavigation,
  SidebarNavigationItem,
  SidebarNavigationLink,
  SidebarProvider,
  SidebarTrigger,
  StatusLabel,
  Table,
  TableContainer,
  Tag,
  Text,
  Toolbar,
  ToolbarSpacer,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// サンプルデータ
type DocumentType = "ORIGINAL" | "AMENDMENT" | "SOW" | "INVOICE";

type ContractRow = {
  id: string;
  clientName: string;
  endDate: string | null;
  title: string;
  autoRenewal: string | null;
  department: string;
  documentType: DocumentType;
  signedDate: string;
  expanded?: boolean;
  relatedDocuments?: RelatedDocument[];
};

type RelatedDocument = {
  id: string;
  number: string;
  status: string;
  date: string;
  documentType: DocumentType;
  title: string;
  endDate: string | null;
  autoRenewal: string | null;
  department: string;
  isLatest?: boolean;
};

const sampleContracts: ContractRow[] = [
  {
    id: "1",
    clientName: "LegalOn Technologies株式会社",
    endDate: "2026/09/29",
    title: "業務委託契約書",
    autoRenewal: "あり",
    department: "営業一部",
    documentType: "ORIGINAL",
    signedDate: "2025/09/30",
    expanded: false,
    relatedDocuments: [
      {
        id: "m1",
        number: "覚書1",
        status: "反映済み",
        date: "2025/01/12",
        documentType: "AMENDMENT",
        title: "業務委託契約書 - 覚書1",
        endDate: "2026/09/29",
        autoRenewal: "あり",
        department: "営業一部",
      },
      {
        id: "m2",
        number: "覚書2",
        status: "反映済み",
        date: "2025/03/12",
        documentType: "AMENDMENT",
        title: "業務委託契約書 - 覚書2",
        endDate: "2026/09/29",
        autoRenewal: "あり",
        department: "営業一部",
      },
      {
        id: "m3",
        number: "覚書3",
        status: "反映済み",
        date: "2025/06/12",
        documentType: "AMENDMENT",
        title: "業務委託契約書 - 覚書3",
        endDate: "2026/09/29",
        autoRenewal: "あり",
        department: "営業一部",
      },
      {
        id: "m4",
        number: "覚書4",
        status: "反映済み",
        date: "2025/07/20",
        documentType: "AMENDMENT",
        title: "業務委託契約書 - 覚書4",
        endDate: "2026/09/29",
        autoRenewal: "あり",
        department: "営業一部",
        isLatest: true,
      },
    ],
  },
  {
    id: "2",
    clientName: "株式会社AAA",
    endDate: null,
    title: "秘密保持契約書",
    autoRenewal: null,
    department: "営業一部",
    documentType: "ORIGINAL",
    signedDate: "2024/01/15",
    expanded: false,
  },
  {
    id: "3",
    clientName: "株式会社AAA",
    endDate: "2026/03/31",
    title: "秘密保持契約書",
    autoRenewal: "あり",
    department: "営業一部",
    documentType: "ORIGINAL",
    signedDate: "2024/04/01",
    expanded: false,
  },
  {
    id: "4",
    clientName: "株式会社AAA",
    endDate: "2025/11/30",
    title: "秘密保持契約書",
    autoRenewal: null,
    department: "営業一部",
    documentType: "ORIGINAL",
    signedDate: "2023/12/01",
    expanded: false,
  },
  {
    id: "5",
    clientName: "株式会社AAA",
    endDate: "2026/06/30",
    title: "秘密保持契約書",
    autoRenewal: "あり",
    department: "営業一部",
    documentType: "ORIGINAL",
    signedDate: "2024/07/01",
    expanded: false,
  },
];

const getDocumentTypeLabel = (type: DocumentType): string => {
  switch (type) {
    case "ORIGINAL":
      return "原契約";
    case "AMENDMENT":
      return "覚書";
    case "SOW":
      return "注文書";
    case "INVOICE":
      return "請求書";
    default:
      return type;
  }
};

const getDocumentTypeColor = (type: DocumentType): "blue" | "yellow" | "indigo" | "purple" => {
  switch (type) {
    case "ORIGINAL":
      return "blue";
    case "AMENDMENT":
      return "yellow";
    case "SOW":
      return "indigo";
    case "INVOICE":
      return "purple";
    default:
      return "blue";
  }
};

export default function ContractListUIImprovement() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<ContractRow[]>(sampleContracts);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<RelatedDocument | null>(null);
  const [selectedContract, setSelectedContract] = useState<ContractRow | null>(null);

  const handleToggleExpand = (contractId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setContracts((prev) =>
      prev.map((contract) => (contract.id === contractId ? { ...contract, expanded: !contract.expanded } : contract)),
    );
  };

  const handleDocumentClick = (contract: ContractRow, document: RelatedDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedContract(contract);
    setSelectedDocument(document);
    setPreviewOpen(true);
  };

  const handleContractClick = (contract: ContractRow) => {
    navigate(`/sandbox/juna-kondo/contract-detail-enhanced/${contract.id}`);
  };

  return (
    <>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <SidebarTrigger />
          </SidebarHeader>
          <SidebarBody>
            <SidebarNavigation>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfHome />
                    </Icon>
                  }
                >
                  ホーム
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfMagnifyingGlass />
                    </Icon>
                  }
                >
                  検索
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfMagnifyingGlass />
                    </Icon>
                  }
                >
                  アシスタント
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfHome />
                    </Icon>
                  }
                >
                  案件
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfFilesLine />
                    </Icon>
                  }
                >
                  契約書
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfWriting />
                    </Icon>
                  }
                >
                  電子契約
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  aria-current="page"
                  leading={
                    <Icon>
                      <LfFileSigned />
                    </Icon>
                  }
                >
                  締結版契約書
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfFilesLine />
                    </Icon>
                  }
                >
                  ひな形
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfEllipsisDot />
                    </Icon>
                  }
                >
                  その他
                </SidebarNavigationLink>
              </SidebarNavigationItem>
            </SidebarNavigation>
          </SidebarBody>
        </Sidebar>
        <SidebarInset>
          <Header>
            <Header.Spacer />
            <Header.Item>
              <Button leading={LfPlusLarge} variant="solid" size="medium">
                締結版契約書をアップロード
              </Button>
            </Header.Item>
            <Header.Item>
              <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)" }}>
                <IconButton aria-label="通知" icon={LfBell} variant="plain">
                  <Badge position="top-end" color="danger" />
                </IconButton>
                <IconButton aria-label="ヘルプ" icon={LfQuestionCircle} variant="plain" />
              </div>
            </Header.Item>
            <Header.Item>
              <Avatar name="User" size="small" />
            </Header.Item>
          </Header>
          <PageLayout>
            <PageLayoutContent>
              <PageLayoutHeader>
                <ContentHeader>
                  <ContentHeader.Title>締結版契約書</ContentHeader.Title>
                </ContentHeader>
              </PageLayoutHeader>
              <PageLayoutBody>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-medium)",
                  }}
                >
                  {/* 検索バーとアクションツールバー */}
                  <Toolbar>
                    <Search placeholder="すべて" shrinkOnBlur />
                    <ToolbarSpacer />
                    <IconButton aria-label="フィルター" icon={LfFilter} variant="plain" />
                    <IconButton aria-label="検索" icon={LfMagnifyingGlass} variant="plain" />
                    <Menu>
                      <Menu.Anchor>
                        <IconButton aria-label="その他" icon={LfEllipsisDot} variant="plain" />
                      </Menu.Anchor>
                      <Menu.Box width="small">
                        <ActionList size="large">
                          <ActionList.Group>
                            <ActionList.Item>
                              <ActionList.Body>表示項目をカスタマイズ</ActionList.Body>
                            </ActionList.Item>
                          </ActionList.Group>
                        </ActionList>
                      </Menu.Box>
                    </Menu>
                  </Toolbar>

                  {/* 契約書テーブル */}
                  <TableContainer>
                    <Table>
                      <Table.Head>
                        <Table.Row>
                          <Table.Cell as="th" style={{ width: "48px" }}></Table.Cell>
                          <Table.Cell as="th">
                            <Table.SortLabel>取引先名</Table.SortLabel>
                          </Table.Cell>
                          <Table.Cell as="th">
                            <Table.SortLabel>契約終了日</Table.SortLabel>
                          </Table.Cell>
                          <Table.Cell as="th">
                            <Table.SortLabel>締結日</Table.SortLabel>
                          </Table.Cell>
                          <Table.Cell as="th">
                            <Table.SortLabel>契約書タイトル</Table.SortLabel>
                          </Table.Cell>
                          <Table.Cell as="th">自動更新</Table.Cell>
                          <Table.Cell as="th">部署</Table.Cell>
                        </Table.Row>
                      </Table.Head>
                      <Table.Body>
                        {contracts.map((contract) => (
                          <>
                            <Table.Row
                              key={contract.id}
                              style={{ cursor: "pointer" }}
                              onClick={() => handleContractClick(contract)}
                            >
                              {/* トグル列 */}
                              <Table.Cell>
                                {contract.relatedDocuments && contract.relatedDocuments.length > 0 ? (
                                  <IconButton
                                    aria-label={contract.expanded ? "折りたたむ" : "展開する"}
                                    icon={contract.expanded ? LfAngleUpMiddle : LfAngleDownMiddle}
                                    variant="plain"
                                    size="small"
                                    onClick={(e) => handleToggleExpand(contract.id, e)}
                                  />
                                ) : (
                                  <div style={{ width: "32px", height: "32px" }} />
                                )}
                              </Table.Cell>
                              <Table.Cell>
                                <Text variant="component.medium">{contract.clientName}</Text>
                              </Table.Cell>
                              <Table.Cell>
                                <Text variant="component.medium">{contract.endDate || "なし"}</Text>
                              </Table.Cell>
                              <Table.Cell>
                                <Text variant="component.medium">{contract.signedDate}</Text>
                              </Table.Cell>
                              <Table.Cell>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "var(--aegis-space-xSmall)",
                                  }}
                                >
                                  <Tag color={getDocumentTypeColor(contract.documentType)} size="small">
                                    {getDocumentTypeLabel(contract.documentType)}
                                  </Tag>
                                  <Text variant="component.medium">{contract.title}</Text>
                                </div>
                              </Table.Cell>
                              <Table.Cell>
                                {contract.autoRenewal ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "var(--aegis-space-xSmall)",
                                    }}
                                  >
                                    <Text variant="component.medium">{contract.autoRenewal}</Text>
                                    <Icon color="subtle" source={LfArrowUpRightFromSquare} />
                                  </div>
                                ) : (
                                  <Text variant="component.medium">なし</Text>
                                )}
                              </Table.Cell>
                              <Table.Cell>
                                <Text variant="component.medium">{contract.department}</Text>
                              </Table.Cell>
                            </Table.Row>
                            {/* 関連書類の表示 */}
                            {contract.expanded &&
                              contract.relatedDocuments &&
                              contract.relatedDocuments.length > 0 &&
                              contract.relatedDocuments.map((document) => (
                                <Table.Row
                                  key={document.id}
                                  style={{
                                    backgroundColor: "var(--aegis-color-background-neutral-subtle)",
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => handleDocumentClick(contract, document, e)}
                                >
                                  {/* トグル列（空欄） */}
                                  <Table.Cell>
                                    <div style={{ width: "32px", height: "32px" }} />
                                  </Table.Cell>
                                  <Table.Cell>
                                    <div
                                      style={{
                                        paddingLeft: "var(--aegis-space-large)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "var(--aegis-space-xSmall)",
                                      }}
                                    >
                                      <Text variant="component.medium" color="subtle">
                                        {contract.clientName}
                                      </Text>
                                    </div>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Text variant="component.medium">{document.endDate || "なし"}</Text>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Text variant="component.medium">{document.date}</Text>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "var(--aegis-space-xSmall)",
                                        paddingLeft: "var(--aegis-space-large)",
                                      }}
                                    >
                                      <Tag color={getDocumentTypeColor(document.documentType)} size="small">
                                        {getDocumentTypeLabel(document.documentType)}
                                      </Tag>
                                      <Text variant="component.medium">{document.title}</Text>
                                      <StatusLabel>{document.status}</StatusLabel>
                                      {document.isLatest && (
                                        <Tag color="teal" size="small">
                                          最新
                                        </Tag>
                                      )}
                                      <Icon color="subtle" source={LfArrowUpRightFromSquare} />
                                    </div>
                                  </Table.Cell>
                                  <Table.Cell>
                                    {document.autoRenewal ? (
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "var(--aegis-space-xSmall)",
                                        }}
                                      >
                                        <Text variant="component.medium">{document.autoRenewal}</Text>
                                        <Icon color="subtle" source={LfArrowUpRightFromSquare} />
                                      </div>
                                    ) : (
                                      <Text variant="component.medium">なし</Text>
                                    )}
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Text variant="component.medium">{document.department}</Text>
                                  </Table.Cell>
                                </Table.Row>
                              ))}
                          </>
                        ))}
                      </Table.Body>
                    </Table>
                  </TableContainer>

                  {/* ページネーション */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "var(--aegis-space-medium)",
                    }}
                  >
                    <Pagination
                      page={1}
                      pageSize={50}
                      totalCount={2880}
                      onChange={(page) => {
                        // ページ変更処理
                        console.log("Page changed:", page);
                      }}
                    />
                  </div>
                </div>
              </PageLayoutBody>
            </PageLayoutContent>
          </PageLayout>
        </SidebarInset>
      </SidebarProvider>

      {/* 関連書類プレビューダイアログ */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogHeader>
          <ContentHeader>
            <ContentHeader.Title>
              {selectedDocument?.number || selectedDocument?.title} - {selectedContract?.title}
            </ContentHeader.Title>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          <DialogContent>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-medium)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--aegis-space-small)",
                }}
              >
                <Tag color={selectedDocument ? getDocumentTypeColor(selectedDocument.documentType) : "blue"}>
                  {selectedDocument ? getDocumentTypeLabel(selectedDocument.documentType) : "原契約"}
                </Tag>
                {selectedDocument?.isLatest && (
                  <Tag color="teal" size="small">
                    最新
                  </Tag>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-small)",
                }}
              >
                <Text variant="label.medium" color="subtle">
                  タイトル
                </Text>
                <Text variant="body.medium">{selectedDocument?.title || selectedContract?.title}</Text>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-small)",
                }}
              >
                <Text variant="label.medium" color="subtle">
                  ステータス
                </Text>
                <StatusLabel>{selectedDocument?.status || "有効"}</StatusLabel>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-small)",
                }}
              >
                <Text variant="label.medium" color="subtle">
                  締結日
                </Text>
                <Text variant="body.medium">{selectedDocument?.date || selectedContract?.signedDate}</Text>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-small)",
                }}
              >
                <Text variant="label.medium" color="subtle">
                  関連契約書
                </Text>
                <Text variant="body.medium">{selectedContract?.title}</Text>
              </div>
              <div
                style={{
                  padding: "var(--aegis-space-large)",
                  backgroundColor: "var(--aegis-color-background-neutral-subtle)",
                  borderRadius: "var(--aegis-radius-medium)",
                  minHeight: "400px",
                }}
              >
                <Text variant="body.medium" color="subtle">
                  {selectedDocument
                    ? "関連書類のプレビュー内容がここに表示されます。"
                    : "契約書のプレビュー内容がここに表示されます。"}
                </Text>
              </div>
            </div>
          </DialogContent>
        </DialogBody>
      </Dialog>
    </>
  );
}
