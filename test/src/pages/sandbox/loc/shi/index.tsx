import {
  LfAngleLeftMiddle,
  LfAngleRightMiddle,
  LfArrowUpRightFromSquare,
  LfCloseLarge,
  LfFileWordColored,
  LfQuestionCircle,
} from "@legalforce/aegis-icons";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Link as AegisLink,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  CheckboxCard,
  Code,
  ContentHeader,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogStickyContainer,
  Divider,
  FileDrop,
  Icon,
  IconButton,
  InformationCard,
  InformationCardGroup,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Popover,
  Search,
  SegmentedControl,
  Select,
  Tab,
  Tag,
  TagGroup,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

interface ExistingFile {
  id: string;
  name: string;
  creator: string;
  date: string;
  type: "契約書" | "その他ファイル" | "自社ひな形";
}

const EXISTING_FILES: ExistingFile[] = [
  { id: "1", name: "秘密保持契約.pdf", creator: "法務 誠", date: "2025/11/12", type: "契約書" },
  { id: "2", name: "業務委託契約書.docx", creator: "法務 誠", date: "2025/11/10", type: "契約書" },
  { id: "3", name: "雇用契約書.pdf", creator: "法務 誠", date: "2025/11/08", type: "契約書" },
  { id: "4", name: "サービス利用規約.pdf", creator: "法務 誠", date: "2025/11/05", type: "その他ファイル" },
  { id: "5", name: "NDA_2024.pdf", creator: "法務 誠", date: "2025/11/01", type: "契約書" },
  { id: "6", name: "取締役会議事録.pdf", creator: "法務 誠", date: "2025/10/28", type: "自社ひな形" },
  { id: "7", name: "株主総会議事録.pdf", creator: "法務 誠", date: "2025/10/25", type: "自社ひな形" },
  { id: "8", name: "定款変更届出書.pdf", creator: "法務 誠", date: "2025/10/20", type: "自社ひな形" },
  { id: "9", name: "取引先との基本契約書.pdf", creator: "法務 誠", date: "2025/10/15", type: "契約書" },
  { id: "10", name: "ライセンス契約書.pdf", creator: "法務 誠", date: "2025/10/10", type: "契約書" },
  { id: "11", name: "販売代理店契約書.pdf", creator: "法務 誠", date: "2025/10/05", type: "契約書" },
  { id: "12", name: "システム開発契約書.pdf", creator: "法務 誠", date: "2025/09/30", type: "契約書" },
  { id: "13", name: "保守サポート契約書.pdf", creator: "法務 誠", date: "2025/09/25", type: "契約書" },
  { id: "14", name: "クラウドサービス利用規約.pdf", creator: "法務 誠", date: "2025/09/20", type: "その他ファイル" },
  { id: "15", name: "個人情報保護方針.pdf", creator: "法務 誠", date: "2025/09/15", type: "その他ファイル" },
  { id: "16", name: "コンプライアンス規程.pdf", creator: "法務 誠", date: "2025/09/10", type: "その他ファイル" },
  { id: "17", name: "情報セキュリティ規程.pdf", creator: "法務 誠", date: "2025/09/05", type: "その他ファイル" },
  { id: "18", name: "労働契約書.pdf", creator: "法務 誠", date: "2025/08/30", type: "契約書" },
  { id: "19", name: "退職金規程.pdf", creator: "法務 誠", date: "2025/08/25", type: "その他ファイル" },
  { id: "20", name: "就業規則.pdf", creator: "法務 誠", date: "2025/08/20", type: "その他ファイル" },
  { id: "21", name: "請負契約書.pdf", creator: "法務 誠", date: "2025/08/15", type: "契約書" },
  { id: "22", name: "不動産賃貸借契約書.pdf", creator: "法務 誠", date: "2025/08/10", type: "契約書" },
  { id: "23", name: "売買契約書.pdf", creator: "法務 誠", date: "2025/08/05", type: "契約書" },
  { id: "24", name: "リース契約書.pdf", creator: "法務 誠", date: "2025/07/30", type: "契約書" },
  { id: "25", name: "フランチャイズ契約書.pdf", creator: "法務 誠", date: "2025/07/25", type: "契約書" },
  { id: "26", name: "M&A基本合意書.pdf", creator: "法務 誠", date: "2025/07/20", type: "契約書" },
  { id: "27", name: "ジョイントベンチャー契約書.pdf", creator: "法務 誠", date: "2025/07/15", type: "契約書" },
  { id: "28", name: "技術ライセンス契約書.pdf", creator: "法務 誠", date: "2025/07/10", type: "契約書" },
  { id: "29", name: "ソフトウェア開発契約書.pdf", creator: "法務 誠", date: "2025/07/05", type: "契約書" },
  { id: "30", name: "コンサルティング契約書.pdf", creator: "法務 誠", date: "2025/06/30", type: "契約書" },
  { id: "31", name: "マーケティング契約書.pdf", creator: "法務 誠", date: "2025/06/25", type: "契約書" },
  { id: "32", name: "広告代理店契約書.pdf", creator: "法務 誠", date: "2025/06/20", type: "契約書" },
  { id: "33", name: "物流委託契約書.pdf", creator: "法務 誠", date: "2025/06/15", type: "契約書" },
  { id: "34", name: "製造委託契約書.pdf", creator: "法務 誠", date: "2025/06/10", type: "契約書" },
  { id: "35", name: "品質保証契約書.pdf", creator: "法務 誠", date: "2025/06/05", type: "契約書" },
  { id: "36", name: "保険代理店契約書.pdf", creator: "法務 誠", date: "2025/05/30", type: "契約書" },
  { id: "37", name: "金融機関との基本契約書.pdf", creator: "法務 誠", date: "2025/05/25", type: "契約書" },
  { id: "38", name: "債権譲渡契約書.pdf", creator: "法務 誠", date: "2025/05/20", type: "契約書" },
  { id: "39", name: "債務保証契約書.pdf", creator: "法務 誠", date: "2025/05/15", type: "契約書" },
  { id: "40", name: "和解契約書.pdf", creator: "法務 誠", date: "2025/05/10", type: "契約書" },
  { id: "41", name: "調停合意書.pdf", creator: "法務 誠", date: "2025/05/05", type: "契約書" },
  { id: "42", name: "仲裁合意書.pdf", creator: "法務 誠", date: "2025/04/30", type: "契約書" },
  { id: "43", name: "機密保持契約書（追加）.pdf", creator: "法務 誠", date: "2025/04/25", type: "契約書" },
  { id: "44", name: "共同研究開発契約書.pdf", creator: "法務 誠", date: "2025/04/20", type: "契約書" },
  { id: "45", name: "特許実施許諾契約書.pdf", creator: "法務 誠", date: "2025/04/15", type: "契約書" },
];

const FILE_TYPE_OPTIONS = ["契約書", "その他ファイル", "自社ひな形"] as const;

// 「自社ひな形」タイプのファイルのtitleを法務の雛形風に変換
const getFileTitle = (file: ExistingFile): string => {
  if (file.type === "自社ひな形") {
    const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
    return `${nameWithoutExtension}（ひな形）`;
  }
  return file.name;
};

const SAVE_DESTINATION_OPTIONS = [
  { label: "案件フォルダ", value: "案件フォルダ" },
  { label: "共有フォルダ", value: "共有フォルダ" },
  { label: "マイフォルダ", value: "マイフォルダ" },
];

type SaveDestinationValue = (typeof SAVE_DESTINATION_OPTIONS)[number]["value"];

export const UserShiSandbox = () => {
  const [basicDialogOpen, setBasicDialogOpen] = useState(false);
  const [planBDialogOpen, setPlanBDialogOpen] = useState(false);
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<readonly File[]>([]);
  const [planBSelectedFiles, setPlanBSelectedFiles] = useState<readonly File[]>([]);
  const [newSelectedFiles, setNewSelectedFiles] = useState<readonly File[]>([]);
  const [planBView, setPlanBView] = useState<"upload" | "existing">("upload");
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [newActiveTabIndex, setNewActiveTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [planBSearchQuery, setPlanBSearchQuery] = useState("");
  const [newSearchQuery, setNewSearchQuery] = useState("");
  const [selectedExistingFiles, setSelectedExistingFiles] = useState<string[]>([]);
  const [planBSelectedExistingFiles, setPlanBSelectedExistingFiles] = useState<string[]>([]);
  const [newSelectedExistingFiles, setNewSelectedExistingFiles] = useState<string[]>([]);
  const [displayedExistingFilesCount, setDisplayedExistingFilesCount] = useState(20);
  const [newDisplayedExistingFilesCount, setNewDisplayedExistingFilesCount] = useState(20);
  const [fileTypeFilterIndex, setFileTypeFilterIndex] = useState(0);
  const [newFileTypeFilterIndex, setNewFileTypeFilterIndex] = useState(0);
  const [saveDestination, setSaveDestination] = useState<SaveDestinationValue | null>("案件フォルダ");
  const [newSaveDestination, setNewSaveDestination] = useState<SaveDestinationValue | null>("案件フォルダ");

  const handleSelectFiles = (files: readonly File[]) => {
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handlePlanBSelectFiles = (files: readonly File[]) => {
    setPlanBSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleNewSelectFiles = (files: readonly File[]) => {
    setNewSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (file: File) => {
    setSelectedFiles((prev) => prev.filter((selected) => selected !== file));
  };

  const handlePlanBRemoveFile = (file: File) => {
    setPlanBSelectedFiles((prev) => prev.filter((selected) => selected !== file));
  };

  const handleNewRemoveFile = (file: File) => {
    setNewSelectedFiles((prev) => prev.filter((selected) => selected !== file));
  };

  const handleCloseDialog = () => {
    setBasicDialogOpen(false);
    setSelectedFiles([]);
    setSearchQuery("");
    setSelectedExistingFiles([]);
    setDisplayedExistingFilesCount(20);
  };

  const handlePlanBCloseDialog = () => {
    setPlanBDialogOpen(false);
    setPlanBSelectedFiles([]);
    setPlanBSearchQuery("");
    setPlanBSelectedExistingFiles([]);
    setPlanBView("upload");
  };

  const handleNewCloseDialog = () => {
    setNewDialogOpen(false);
    setNewSelectedFiles([]);
    setNewSearchQuery("");
    setNewSelectedExistingFiles([]);
    setNewDisplayedExistingFilesCount(20);
    setNewActiveTabIndex(0);
  };

  const handleToggleExistingFile = (fileId: string) => {
    setSelectedExistingFiles((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId],
    );
  };

  const handlePlanBToggleExistingFile = (fileId: string) => {
    setPlanBSelectedExistingFiles((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId],
    );
  };

  const handleNewToggleExistingFile = (fileId: string) => {
    setNewSelectedExistingFiles((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId],
    );
  };

  const filteredExistingFiles = EXISTING_FILES.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.creator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = file.type === FILE_TYPE_OPTIONS[fileTypeFilterIndex];
    return matchesSearch && matchesType;
  });

  const displayedExistingFiles = filteredExistingFiles.slice(0, displayedExistingFilesCount);

  const handleLoadMore = () => {
    setDisplayedExistingFilesCount((prev) => prev + 10);
  };

  const handleNewLoadMore = () => {
    setNewDisplayedExistingFilesCount((prev) => prev + 10);
  };

  const planBFilteredExistingFiles = EXISTING_FILES.filter(
    (file) =>
      file.name.toLowerCase().includes(planBSearchQuery.toLowerCase()) ||
      file.creator.toLowerCase().includes(planBSearchQuery.toLowerCase()),
  );

  const newFilteredExistingFiles = EXISTING_FILES.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(newSearchQuery.toLowerCase()) ||
      file.creator.toLowerCase().includes(newSearchQuery.toLowerCase());
    const matchesType = file.type === FILE_TYPE_OPTIONS[newFileTypeFilterIndex];
    return matchesSearch && matchesType;
  });

  const newDisplayedExistingFiles = newFilteredExistingFiles.slice(0, newDisplayedExistingFilesCount);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>shi の Sandbox</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            shi の実験的な機能やプロトタイプを試す場所です。自由にページを追加してください。
          </Text>

          <Accordion style={{ marginBottom: "var(--aegis-space-large)" }}>
            <AccordionItem>
              <AccordionButton>
                <Text as="p" variant="label.medium">
                  コマンドの使い方
                </Text>
              </AccordionButton>
              <AccordionPanel>
                <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
                  この環境に新しいページを作成するには、以下のコマンドを実行してください：
                </Text>
                <Code
                  style={{
                    display: "block",
                    marginBottom: "var(--aegis-space-medium)",
                  }}
                >
                  pnpm run sandbox:create
                </Code>
                <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                  作成先の選択で「ユーザー環境」を選び、shi を選択してください。
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(var(--aegis-layout-width-x5Small), 1fr))",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <Card style={{ width: "fit-content" }}>
              <CardHeader>
                <Text variant="title.xSmall">FileUpload</Text>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-medium)",
                  }}
                >
                  <Text variant="body.small" color="subtle">
                    Plan A と Plan Bの区別
                    <br />
                    ①「アップロード」タブ「保存先」の位置
                    <br />
                    A：「保存先」が上 B：「保存先」が下
                    <br />
                    「保存先」をfiledropの下に置く場合、ファイル追加する度「保存先」の位置が動く、気になるかどうか
                    <br />
                    ②「既存から選択」タブに「選択中」ファイルの表示
                    <br />
                    A：「選択中のファイル」ボタンを表示 B：ファイル選択したら自動でtabの下に選択中のファイルをtagで表示
                    <br />
                    <br />
                    よくないPlanは既存ファイルを追加した場合、間違って「追加」ボタンを押してdialogを閉じる恐れがある
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--aegis-space-small)",
                    }}
                  >
                    <Button variant="subtle" onClick={() => setBasicDialogOpen(true)}>
                      Plan A
                    </Button>
                    <Button variant="subtle" onClick={() => setNewDialogOpen(true)}>
                      Plan B
                    </Button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--aegis-space-small)",
                    }}
                  >
                    <Button variant="subtle" onClick={() => setPlanBDialogOpen(true)}>
                      よくないPlan
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <AegisLink asChild>
            <RouterLink to="/sandbox">← Back to Sandbox</RouterLink>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>

      {/* ファイルアップロードダイアログ */}
      <Dialog open={basicDialogOpen} onOpenChange={setBasicDialogOpen}>
        <DialogContent
          style={{
            width: "560px",
            height: "720px",
          }}
        >
          <DialogHeader>
            <ContentHeader>
              <ContentHeader.Title>ファイルを追加</ContentHeader.Title>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <Tab.Group variant="plain" onChange={setActiveTabIndex} defaultIndex={activeTabIndex}>
              <DialogStickyContainer position="top">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-small)",
                  }}
                >
                  <Tab.List>
                    <Tab
                      trailing={
                        selectedFiles.length > 0 ? (
                          <Badge
                            color="information"
                            count={selectedFiles.length}
                            minSize="x4Small"
                            style={{ width: "fit-content", minWidth: "24px" }}
                          />
                        ) : undefined
                      }
                    >
                      アップロード
                    </Tab>
                    <Tab
                      trailing={
                        selectedExistingFiles.length > 0 ? (
                          <Badge
                            color="information"
                            count={selectedExistingFiles.length}
                            minSize="x4Small"
                            style={{ width: "fit-content", minWidth: "24px" }}
                          />
                        ) : undefined
                      }
                    >
                      既存から選択
                    </Tab>
                  </Tab.List>
                  {activeTabIndex === 1 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--aegis-space-xSmall)",
                      }}
                    >
                      <SegmentedControl
                        variant="plain"
                        index={fileTypeFilterIndex}
                        onChange={(index) => setFileTypeFilterIndex(index)}
                      >
                        <SegmentedControl.Button>契約書</SegmentedControl.Button>
                        <SegmentedControl.Button>その他ファイル</SegmentedControl.Button>
                        <SegmentedControl.Button>自社ひな形</SegmentedControl.Button>
                      </SegmentedControl>
                      <Popover trigger="hover" arrow>
                        <Popover.Anchor>
                          <Button
                            variant="gutterless"
                            color="neutral"
                            size="xSmall"
                            weight="normal"
                            disabled={selectedExistingFiles.length === 0}
                            style={{ marginLeft: "auto" }}
                          >
                            選択中のファイル
                          </Button>
                        </Popover.Anchor>
                        {selectedExistingFiles.length > 0 && (
                          <Popover.Content width="small">
                            <Popover.Body>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "var(--aegis-space-xSmall)",
                                }}
                              >
                                {EXISTING_FILES.filter((file) => selectedExistingFiles.includes(file.id)).map(
                                  (file) => (
                                    <Text key={file.id} variant="body.small">
                                      {getFileTitle(file)}
                                    </Text>
                                  ),
                                )}
                              </div>
                            </Popover.Body>
                          </Popover.Content>
                        )}
                      </Popover>
                    </div>
                  )}
                  {activeTabIndex === 1 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--aegis-space-xSmall)",
                      }}
                    >
                      <Search
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery("")}
                        clearable
                        placeholder="ファイル名で検索"
                        style={{ flex: 1 }}
                      />
                    </div>
                  )}
                </div>
              </DialogStickyContainer>
              <Tab.Panels>
                <Tab.Panel>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-large)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--aegis-space-xSmall)",
                      }}
                    >
                      <Text variant="label.medium">保存先</Text>
                      <Select
                        options={SAVE_DESTINATION_OPTIONS}
                        value={saveDestination}
                        onChange={(v) => setSaveDestination(v as SaveDestinationValue | null)}
                        placeholder="保存先を選択"
                      />
                    </div>

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
                          flexDirection: "column",
                          gap: "var(--aegis-space-xxSmall)",
                        }}
                      >
                        <FileDrop
                          multiple
                          uploadButtonTitle="ファイルを選択"
                          progressLabel="Uploading"
                          processingAction={<Button>Cancel</Button>}
                          onSelectFiles={handleSelectFiles}
                        >
                          ファイルをドラッグ＆ドロップ、または
                        </FileDrop>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Popover trigger="hover" arrow placement="top">
                            <Popover.Anchor>
                              <Button
                                variant="gutterless"
                                color="neutral"
                                size="xSmall"
                                weight="normal"
                                leading={
                                  <Icon>
                                    <LfQuestionCircle />
                                  </Icon>
                                }
                              >
                                追加ファイルについて
                              </Button>
                            </Popover.Anchor>
                            <Popover.Content width="small">
                              <Popover.Body>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "var(--aegis-space-xSmall)",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "var(--aegis-space-xxSmall)",
                                    }}
                                  >
                                    <Text variant="body.xSmall.bold">アップロード可能な形式</Text>
                                    <Text variant="body.small" color="subtle">
                                      pdf, doc, docx, xls, xlsx, ppt, pptx, jpg, jpeg, png, gif, eml, msg, csv
                                    </Text>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "var(--aegis-space-xxSmall)",
                                    }}
                                  >
                                    <Text variant="body.xSmall.bold">追加ファイルの上限</Text>
                                    <Text variant="body.small" color="subtle">
                                      追加できるファイルの上限は5個です。
                                    </Text>
                                  </div>
                                </div>
                              </Popover.Body>
                            </Popover.Content>
                          </Popover>
                        </div>
                      </div>

                      {selectedFiles.length > 0 && (
                        <InformationCardGroup>
                          {selectedFiles.map((file) => (
                            <ButtonGroup
                              key={`${file.name}-${file.size}-${file.lastModified}`}
                              attached
                              variant="subtle"
                            >
                              <InformationCard
                                leading={
                                  <Icon>
                                    <LfFileWordColored />
                                  </Icon>
                                }
                              >
                                {file.name}
                              </InformationCard>
                              <Tooltip title="削除">
                                <IconButton aria-label="ファイルを削除" onClick={() => handleRemoveFile(file)}>
                                  <Icon>
                                    <LfCloseLarge />
                                  </Icon>
                                </IconButton>
                              </Tooltip>
                            </ButtonGroup>
                          ))}
                        </InformationCardGroup>
                      )}
                    </div>
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    {displayedExistingFiles.map((file) => (
                      <CheckboxCard
                        key={file.id}
                        checked={selectedExistingFiles.includes(file.id)}
                        onChange={() => handleToggleExistingFile(file.id)}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--aegis-space-xxSmall)",
                            }}
                          >
                            <Text variant="body.medium">{getFileTitle(file)}</Text>
                            <Text variant="body.small" color="subtle">
                              作成：{file.creator}、{file.date}
                            </Text>
                          </div>
                          <Button
                            variant="gutterless"
                            color="neutral"
                            size="xSmall"
                            weight="normal"
                            trailing={
                              <Icon>
                                <LfArrowUpRightFromSquare />
                              </Icon>
                            }
                          >
                            詳細
                          </Button>
                        </div>
                      </CheckboxCard>
                    ))}
                    {fileTypeFilterIndex === 0 && displayedExistingFilesCount < filteredExistingFiles.length && (
                      <Button variant="plain" width="full" onClick={handleLoadMore}>
                        さらに読み込む
                      </Button>
                    )}
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain" onClick={handleCloseDialog}>
                キャンセル
              </Button>
              <Button
                onClick={handleCloseDialog}
                disabled={selectedFiles.length === 0 && selectedExistingFiles.length === 0}
              >
                追加
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ファイルアップロードダイアログ 新規 */}
      <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
        <DialogContent
          style={{
            width: "560px",
            height: "720px",
          }}
        >
          <DialogHeader>
            <ContentHeader>
              <ContentHeader.Title>ファイルを追加</ContentHeader.Title>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <Tab.Group variant="plain" onChange={setNewActiveTabIndex} defaultIndex={newActiveTabIndex}>
              <DialogStickyContainer position="top">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-small)",
                  }}
                >
                  <Tab.List>
                    <Tab
                      trailing={
                        newSelectedFiles.length > 0 ? (
                          <Badge
                            color="information"
                            count={newSelectedFiles.length}
                            minSize="x4Small"
                            style={{ width: "fit-content", minWidth: "24px" }}
                          />
                        ) : undefined
                      }
                    >
                      アップロード
                    </Tab>
                    <Tab
                      trailing={
                        newSelectedExistingFiles.length > 0 ? (
                          <Badge
                            color="information"
                            count={newSelectedExistingFiles.length}
                            minSize="x4Small"
                            style={{ width: "fit-content", minWidth: "24px" }}
                          />
                        ) : undefined
                      }
                    >
                      既存から選択
                    </Tab>
                  </Tab.List>
                  {newActiveTabIndex === 1 && (
                    <>
                      {newSelectedExistingFiles.length > 0 && (
                        <Card
                          size="small"
                          variant="fill"
                          style={{ backgroundColor: "var(--aegis-color-background-information)" }}
                        >
                          <CardBody>
                            <div
                              style={{
                                maxHeight: "calc(var(--aegis-size-x3Large) * 2 + var(--aegis-space-xSmall) * 1)",
                                overflowY: "auto",
                              }}
                            >
                              <TagGroup variant="fill">
                                <Text variant="label.medium" style={{ paddingRight: "var(--aegis-space-xxSmall)" }}>
                                  選択中
                                </Text>
                                {EXISTING_FILES.filter((file) => newSelectedExistingFiles.includes(file.id)).map(
                                  (file) => (
                                    <Tag
                                      key={file.id}
                                      variant="fill"
                                      color="blue"
                                      removable
                                      onRemove={() => handleNewToggleExistingFile(file.id)}
                                    >
                                      {getFileTitle(file)}
                                    </Tag>
                                  ),
                                )}
                              </TagGroup>
                            </div>
                          </CardBody>
                        </Card>
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--aegis-space-xSmall)",
                        }}
                      >
                        <SegmentedControl
                          variant="plain"
                          index={newFileTypeFilterIndex}
                          onChange={(index) => setNewFileTypeFilterIndex(index)}
                        >
                          <SegmentedControl.Button>契約書</SegmentedControl.Button>
                          <SegmentedControl.Button>その他ファイル</SegmentedControl.Button>
                          <SegmentedControl.Button>自社ひな形</SegmentedControl.Button>
                        </SegmentedControl>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--aegis-space-xSmall)",
                        }}
                      >
                        <Search
                          value={newSearchQuery}
                          onChange={(e) => setNewSearchQuery(e.target.value)}
                          onClear={() => setNewSearchQuery("")}
                          clearable
                          placeholder="ファイル名で検索"
                          style={{ flex: 1 }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </DialogStickyContainer>
              <Tab.Panels>
                <Tab.Panel>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-large)",
                    }}
                  >
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
                          flexDirection: "column",
                          gap: "var(--aegis-space-xxSmall)",
                        }}
                      >
                        <FileDrop
                          multiple
                          uploadButtonTitle="ファイルを選択"
                          progressLabel="Uploading"
                          processingAction={<Button>Cancel</Button>}
                          onSelectFiles={handleNewSelectFiles}
                        >
                          ファイルをドラッグ＆ドロップ、または
                        </FileDrop>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Popover trigger="hover" arrow placement="top">
                            <Popover.Anchor>
                              <Button
                                variant="gutterless"
                                color="neutral"
                                size="xSmall"
                                weight="normal"
                                leading={
                                  <Icon>
                                    <LfQuestionCircle />
                                  </Icon>
                                }
                              >
                                追加ファイルについて
                              </Button>
                            </Popover.Anchor>
                            <Popover.Content width="small">
                              <Popover.Body>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "var(--aegis-space-xSmall)",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "var(--aegis-space-xxSmall)",
                                    }}
                                  >
                                    <Text variant="body.xSmall.bold">アップロード可能な形式</Text>
                                    <Text variant="body.small" color="subtle">
                                      pdf, doc, docx, xls, xlsx, ppt, pptx, jpg, jpeg, png, gif, eml, msg, csv
                                    </Text>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "var(--aegis-space-xxSmall)",
                                    }}
                                  >
                                    <Text variant="body.xSmall.bold">追加ファイルの上限</Text>
                                    <Text variant="body.small" color="subtle">
                                      追加できるファイルの上限は5個です。
                                    </Text>
                                  </div>
                                </div>
                              </Popover.Body>
                            </Popover.Content>
                          </Popover>
                        </div>
                      </div>

                      {newSelectedFiles.length > 0 && (
                        <InformationCardGroup>
                          {newSelectedFiles.map((file) => (
                            <ButtonGroup
                              key={`new-${file.name}-${file.size}-${file.lastModified}`}
                              attached
                              variant="subtle"
                            >
                              <InformationCard
                                leading={
                                  <Icon>
                                    <LfFileWordColored />
                                  </Icon>
                                }
                              >
                                {file.name}
                              </InformationCard>
                              <Tooltip title="削除">
                                <IconButton aria-label="ファイルを削除" onClick={() => handleNewRemoveFile(file)}>
                                  <Icon>
                                    <LfCloseLarge />
                                  </Icon>
                                </IconButton>
                              </Tooltip>
                            </ButtonGroup>
                          ))}
                        </InformationCardGroup>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--aegis-space-xSmall)",
                      }}
                    >
                      <Text variant="label.medium">保存先</Text>
                      <Select
                        options={SAVE_DESTINATION_OPTIONS}
                        value={newSaveDestination}
                        onChange={(v) => setNewSaveDestination(v as SaveDestinationValue | null)}
                        placeholder="保存先を選択"
                      />
                    </div>
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    {newDisplayedExistingFiles.map((file) => (
                      <CheckboxCard
                        key={file.id}
                        checked={newSelectedExistingFiles.includes(file.id)}
                        onChange={() => handleNewToggleExistingFile(file.id)}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--aegis-space-xxSmall)",
                            }}
                          >
                            <Text variant="body.medium">{getFileTitle(file)}</Text>
                            <Text variant="body.small" color="subtle">
                              作成：{file.creator}、{file.date}
                            </Text>
                          </div>
                          <Button
                            variant="gutterless"
                            color="neutral"
                            size="xSmall"
                            weight="normal"
                            trailing={
                              <Icon>
                                <LfArrowUpRightFromSquare />
                              </Icon>
                            }
                          >
                            詳細
                          </Button>
                        </div>
                      </CheckboxCard>
                    ))}
                    {newFileTypeFilterIndex === 0 &&
                      newDisplayedExistingFilesCount < newFilteredExistingFiles.length && (
                        <Button variant="plain" width="full" onClick={handleNewLoadMore}>
                          さらに読み込む
                        </Button>
                      )}
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain" onClick={handleNewCloseDialog}>
                キャンセル
              </Button>
              <Button
                onClick={handleNewCloseDialog}
                disabled={newSelectedFiles.length === 0 && newSelectedExistingFiles.length === 0}
              >
                追加
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ファイルアップロードダイアログ Plan B */}
      <Dialog open={planBDialogOpen} onOpenChange={setPlanBDialogOpen}>
        <DialogContent
          style={{
            width: "560px",
            height: "720px",
          }}
        >
          <DialogHeader>
            <ContentHeader
              action={
                <AegisLink
                  href="#"
                  leading={
                    <Icon>
                      <LfQuestionCircle />
                    </Icon>
                  }
                  trailing={
                    <Icon>
                      <LfArrowUpRightFromSquare />
                    </Icon>
                  }
                >
                  ヘルプ
                </AegisLink>
              }
            >
              <ContentHeader.Title>ファイルを追加</ContentHeader.Title>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            {planBView === "existing" && (
              <DialogStickyContainer position="top">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "var(--aegis-space-small)",
                  }}
                >
                  <Text variant="title.xSmall">既存から選択</Text>
                  {planBSelectedExistingFiles.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--aegis-space-xSmall)",
                      }}
                    >
                      <Text variant="body.small" color="subtle">
                        選択中
                      </Text>
                      <Badge color="information" count={planBSelectedExistingFiles.length} />
                    </div>
                  )}
                </div>
                <Search
                  value={planBSearchQuery}
                  onChange={(e) => setPlanBSearchQuery(e.target.value)}
                  onClear={() => setPlanBSearchQuery("")}
                  clearable
                  placeholder="検索"
                />
              </DialogStickyContainer>
            )}
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                width: "100%",
              }}
            >
              {/* Upload View */}
              <div
                style={{
                  width: "100%",
                  transform: planBView === "upload" ? "translateX(0%)" : "translateX(-100%)",
                  transition: "transform 0.3s ease-in-out",
                  opacity: planBView === "upload" ? 1 : 0,
                  position: planBView === "upload" ? "relative" : "absolute",
                  top: planBView === "upload" ? "auto" : 0,
                  left: planBView === "upload" ? "auto" : 0,
                  pointerEvents: planBView === "upload" ? "auto" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-large)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-large)",
                    }}
                  >
                    <FileDrop
                      multiple
                      uploadButtonTitle="ファイルを選択"
                      progressLabel="Uploading"
                      processingAction={<Button>Cancel</Button>}
                      onSelectFiles={handlePlanBSelectFiles}
                    >
                      ファイルをドラッグ＆ドロップ、または
                    </FileDrop>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "var(--aegis-space-small)",
                        height: "auto",
                      }}
                    >
                      <Divider style={{ flex: 1, alignSelf: "center" }} />
                      <Text variant="body.small" color="subtle">
                        または
                      </Text>
                      <Divider style={{ flex: 1, alignSelf: "center" }} />
                    </div>

                    <Button
                      variant="subtle"
                      width="full"
                      trailing={
                        <Icon>
                          <LfAngleRightMiddle />
                        </Icon>
                      }
                      onClick={() => setPlanBView("existing")}
                    >
                      既存から選択
                    </Button>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Popover trigger="hover" arrow placement="top">
                        <Popover.Anchor>
                          <Button
                            variant="gutterless"
                            color="neutral"
                            size="xSmall"
                            weight="normal"
                            leading={
                              <Icon>
                                <LfQuestionCircle />
                              </Icon>
                            }
                          >
                            追加ファイルについて
                          </Button>
                        </Popover.Anchor>
                        <Popover.Content width="small">
                          <Popover.Body>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--aegis-space-xSmall)",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "var(--aegis-space-xxSmall)",
                                }}
                              >
                                <Text variant="body.xSmall.bold">アップロード可能な形式</Text>
                                <Text variant="body.small" color="subtle">
                                  pdf, doc, docx, xls, xlsx, ppt, pptx, jpg, jpeg, png, gif, eml, msg, csv
                                </Text>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "var(--aegis-space-xxSmall)",
                                }}
                              >
                                <Text variant="body.xSmall.bold">追加ファイルの上限</Text>
                                <Text variant="body.small" color="subtle">
                                  追加できるファイルの上限は5個です。
                                </Text>
                              </div>
                            </div>
                          </Popover.Body>
                        </Popover.Content>
                      </Popover>
                    </div>
                  </div>

                  {planBSelectedFiles.length > 0 && (
                    <InformationCardGroup>
                      {planBSelectedFiles.map((file) => (
                        <ButtonGroup
                          key={`planB-${file.name}-${file.size}-${file.lastModified}`}
                          attached
                          variant="subtle"
                        >
                          <InformationCard
                            leading={
                              <Icon>
                                <LfFileWordColored />
                              </Icon>
                            }
                          >
                            {file.name}
                          </InformationCard>
                          <Tooltip title="削除">
                            <IconButton aria-label="ファイルを削除" onClick={() => handlePlanBRemoveFile(file)}>
                              <Icon>
                                <LfCloseLarge />
                              </Icon>
                            </IconButton>
                          </Tooltip>
                        </ButtonGroup>
                      ))}
                    </InformationCardGroup>
                  )}

                  {planBSelectedExistingFiles.length > 0 && (
                    <InformationCardGroup title="既存から">
                      {EXISTING_FILES.filter((file) => planBSelectedExistingFiles.includes(file.id)).map((file) => (
                        <ButtonGroup key={`planB-existing-${file.id}`} attached variant="subtle">
                          <InformationCard
                            leading={
                              <Icon>
                                <LfFileWordColored />
                              </Icon>
                            }
                          >
                            {file.name}
                          </InformationCard>
                          <Tooltip title="削除">
                            <IconButton
                              aria-label="ファイルを削除"
                              onClick={() => handlePlanBToggleExistingFile(file.id)}
                            >
                              <Icon>
                                <LfCloseLarge />
                              </Icon>
                            </IconButton>
                          </Tooltip>
                        </ButtonGroup>
                      ))}
                    </InformationCardGroup>
                  )}
                </div>
              </div>

              {/* Existing View */}
              <div
                style={{
                  width: "100%",
                  transform: planBView === "existing" ? "translateX(0%)" : "translateX(100%)",
                  transition: "transform 0.3s ease-in-out",
                  opacity: planBView === "existing" ? 1 : 0,
                  position: planBView === "existing" ? "relative" : "absolute",
                  top: planBView === "existing" ? "auto" : 0,
                  left: planBView === "existing" ? "auto" : 0,
                  pointerEvents: planBView === "existing" ? "auto" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  {planBFilteredExistingFiles.map((file) => (
                    <CheckboxCard
                      key={file.id}
                      checked={planBSelectedExistingFiles.includes(file.id)}
                      onChange={() => handlePlanBToggleExistingFile(file.id)}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--aegis-space-xxSmall)",
                          }}
                        >
                          <Text variant="body.medium">{file.name}</Text>
                          <Text variant="body.small" color="subtle">
                            作成：{file.creator}、{file.date}
                          </Text>
                        </div>
                        <Button
                          variant="gutterless"
                          color="neutral"
                          size="xSmall"
                          weight="normal"
                          trailing={
                            <Icon>
                              <LfArrowUpRightFromSquare />
                            </Icon>
                          }
                        >
                          詳細
                        </Button>
                      </div>
                    </CheckboxCard>
                  ))}
                </div>
              </div>
            </div>
            {planBView === "existing" && (
              <DialogStickyContainer position="bottom">
                <Button
                  variant="subtle"
                  width="full"
                  leading={
                    <Icon>
                      <LfAngleLeftMiddle />
                    </Icon>
                  }
                  onClick={() => setPlanBView("upload")}
                >
                  戻る
                </Button>
              </DialogStickyContainer>
            )}
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain" onClick={handlePlanBCloseDialog}>
                キャンセル
              </Button>
              <Button
                onClick={handlePlanBCloseDialog}
                disabled={planBSelectedFiles.length === 0 && planBSelectedExistingFiles.length === 0}
              >
                追加
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};
