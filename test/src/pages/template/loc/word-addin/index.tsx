import {
  LfAngleLeft,
  LfArrowUpRightFromSquare,
  LfCloseLarge,
  LfFile,
  LfFilter,
  LfMagnifyingGlass,
} from "@legalforce/aegis-icons";
import {
  Accordion,
  Banner,
  Button,
  Checkbox,
  ContentHeader,
  ContentHeaderTitle,
  Divider,
  Drawer,
  FormControl,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Radio,
  RadioGroup,
  Select,
  Text,
  Textarea,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";
import type { Document } from "./mock/data";
import {
  COMPANY_POSITION_OPTIONS,
  CONTRACT_STATUS_OPTIONS,
  CONTRACT_TYPE_OPTIONS,
  DOCUMENT_LIST,
  OTHER_CONDITIONS_OPTIONS,
  PLAYBOOK_LIST,
  STORAGE_OPTIONS,
} from "./mock/data";
import { type WordAddinTab, WordAddinTabNavigation } from "./WordAddinTabNavigation";

type ViewType = "review" | "riskCheck";

const WordAddinTemplate = () => {
  const [paneOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<WordAddinTab>("review");
  const [currentView, setCurrentView] = useState<ViewType>("review");
  const [uploadMode, setUploadMode] = useState<"existing" | "new">("existing");
  const [storageLocation, setStorageLocation] = useState("");
  const [contractStatus, setContractStatus] = useState("");
  const [showSearchView, setShowSearchView] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>({
    id: "3",
    name: "LegalOn利用申込書_株式会社Delphy御中.pdf",
    company: "株式会社Delphy",
    date: "2025/12/26",
  });

  // 契約リスクチェック用の state
  const [legalOnAlert, setLegalOnAlert] = useState(false);
  const [playbookAlert, setPlaybookAlert] = useState(false);
  const [playbookType, setPlaybookType] = useState<"playbook" | "template">("playbook");
  const [contractType, setContractType] = useState("nda");
  const [companyPosition, setCompanyPosition] = useState("both");
  const [otherConditions, setOtherConditions] = useState("none");

  const isSubmitDisabled = uploadMode === "new" && !storageLocation;

  const handleDocumentSelect = (doc: Document) => {
    setSelectedDocument(doc);
    setShowSearchView(false);
  };

  const handleTabChange = (tab: WordAddinTab) => {
    setCurrentTab(tab);
    if (tab !== "review") {
      setShowSearchView(false);
    }
  };

  // 検索ビュー
  const renderSearchView = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--aegis-space-medium)",
          paddingBottom: "var(--aegis-space-medium)",
        }}
      >
        <Tooltip title="戻る">
          <IconButton aria-label="戻る" variant="subtle" onClick={() => setShowSearchView(false)}>
            <Icon>
              <LfAngleLeft />
            </Icon>
          </IconButton>
        </Tooltip>
        <Button
          variant="subtle"
          width="full"
          leading={
            <Icon>
              <LfFilter />
            </Icon>
          }
        >
          フィルター
        </Button>
      </div>
      <div
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <Accordion multiple bordered={false}>
          {DOCUMENT_LIST.map((doc) => (
            <div key={doc.id}>
              {/* ドキュメントカード */}
              <button
                type="button"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--aegis-space-small)",
                  width: "100%",
                  cursor: "pointer",
                  background: "none",
                  border: doc.company ? "1px solid var(--aegis-color-border-default)" : "none",
                  borderRadius: doc.company ? "var(--aegis-radius-medium)" : "0",
                  padding: doc.company ? "var(--aegis-space-small)" : "var(--aegis-space-small) 0",
                  textAlign: "left",
                  marginBottom: "var(--aegis-space-xxSmall)",
                }}
                onClick={() => handleDocumentSelect(doc)}
              >
                <Icon color="subtle">
                  <LfFile />
                </Icon>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text variant="body.medium" style={{ wordBreak: "break-word" }}>
                    {doc.name}
                  </Text>
                  {doc.company && (
                    <Text variant="body.small" color="subtle">
                      {doc.company}
                    </Text>
                  )}
                </div>
              </button>
              {/* ファイル情報アコーディオン */}
              <Accordion.Item>
                <Accordion.Button>
                  <Text variant="body.small">ファイル情報</Text>
                </Accordion.Button>
                <Accordion.Panel>
                  <div style={{ padding: "var(--aegis-space-small)" }}>
                    <Text variant="body.small" color="subtle">
                      ファイル情報の詳細がここに表示されます
                    </Text>
                  </div>
                </Accordion.Panel>
              </Accordion.Item>
            </div>
          ))}
        </Accordion>
      </div>
    </div>
  );

  // メインビュー
  const renderMainView = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aegis-space-large)",
      }}
    >
      <Banner color="information" closeButton={false}>
        続けるためには契約書をアップロードしてください。
      </Banner>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--aegis-space-medium)",
        }}
      >
        <Text variant="label.medium.bold">アップロード先を選択</Text>
        <RadioGroup value={uploadMode} onChange={(value) => setUploadMode(value as "existing" | "new")}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-small)",
              width: "100%",
            }}
          >
            <Radio value="existing">以下の最新バージョンとして追加</Radio>
            {uploadMode === "existing" && (
              <div style={{ paddingLeft: "var(--aegis-space-large)", width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-small)",
                  }}
                >
                  {selectedDocument && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "var(--aegis-space-small)",
                        padding: "var(--aegis-space-small)",
                        border: "1px solid var(--aegis-color-border-default)",
                        borderRadius: "var(--aegis-radius-medium)",
                      }}
                    >
                      <Icon color="subtle">
                        <LfFile />
                      </Icon>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text variant="body.medium" style={{ wordBreak: "break-word" }}>
                          {selectedDocument.name}
                        </Text>
                        {selectedDocument.date && (
                          <Text variant="body.small" color="subtle">
                            {selectedDocument.date}
                          </Text>
                        )}
                      </div>
                    </div>
                  )}
                  <Button
                    variant="subtle"
                    width="full"
                    leading={
                      <Icon>
                        <LfMagnifyingGlass />
                      </Icon>
                    }
                    onClick={() => setShowSearchView(true)}
                  >
                    検索
                  </Button>
                </div>
              </div>
            )}
            <Radio value="new">新規アップロード</Radio>
            {uploadMode === "new" && (
              <div style={{ paddingLeft: "var(--aegis-space-large)", width: "100%" }}>
                <FormControl required>
                  <FormControl.Label>保存先</FormControl.Label>
                  <Select
                    options={STORAGE_OPTIONS}
                    placeholder="未選択"
                    value={storageLocation}
                    onChange={(value) => setStorageLocation(value)}
                  />
                </FormControl>
              </div>
            )}
          </div>
        </RadioGroup>
      </div>

      <FormControl>
        <FormControl.Label>契約書ステータス</FormControl.Label>
        <Select
          options={CONTRACT_STATUS_OPTIONS}
          placeholder="ステータスを選択"
          value={contractStatus}
          onChange={(value) => setContractStatus(value)}
        />
      </FormControl>

      <Button disabled={isSubmitDisabled}>レビューを開始</Button>
    </div>
  );

  // 契約リスクチェックビュー
  const renderRiskCheckView = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
      }}
    >
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "var(--aegis-space-large)",
          paddingBottom: "var(--aegis-space-x3Large)",
        }}
      >
        {/* レビュー設定 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
          <Text variant="title.small">レビュー設定</Text>

          {/* レビュー方式 */}
          <FormControl required>
            <FormControl.Label>レビュー方式</FormControl.Label>
            <FormControl.Caption>一つまたは複数選択</FormControl.Caption>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
              <Checkbox checked={legalOnAlert} onChange={(e) => setLegalOnAlert(e.target.checked)}>
                LegalOnアラート
              </Checkbox>
              <Checkbox checked={playbookAlert} onChange={(e) => setPlaybookAlert(e.target.checked)}>
                プレイブックアラート
              </Checkbox>
              <div style={{ paddingLeft: "var(--aegis-space-large)" }}>
                <RadioGroup
                  value={playbookType}
                  onChange={(value) => setPlaybookType(value as "playbook" | "template")}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                    <Radio value="playbook" disabled={!playbookAlert}>
                      プレイブック
                    </Radio>
                    <Radio value="template" disabled={!playbookAlert}>
                      自社ひな形プレイブック
                    </Radio>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </FormControl>

          {/* 契約類型 */}
          <FormControl required>
            <FormControl.Label>契約類型</FormControl.Label>
            <Select options={CONTRACT_TYPE_OPTIONS} value={contractType} onChange={(value) => setContractType(value)} />
          </FormControl>

          {/* 自社の立場 */}
          <FormControl required>
            <FormControl.Label>自社の立場</FormControl.Label>
            <Select
              options={COMPANY_POSITION_OPTIONS}
              value={companyPosition}
              onChange={(value) => setCompanyPosition(value)}
            />
          </FormControl>

          {/* その他レビュー条件 */}
          <FormControl>
            <FormControl.Label>その他レビュー条件</FormControl.Label>
            <Select
              options={OTHER_CONDITIONS_OPTIONS}
              value={otherConditions}
              onChange={(value) => setOtherConditions(value)}
            />
          </FormControl>
        </div>

        <Divider />

        {/* プレイブックアラート */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
          <Text variant="title.small">プレイブックアラート</Text>
          <Text variant="label.medium">プレイブック</Text>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
            {PLAYBOOK_LIST.map((playbook) => (
              <Checkbox key={playbook.id} disabled>
                {playbook.name}
              </Checkbox>
            ))}
          </div>
        </div>

        {/* 自社ひな形プレイブック */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
          <Text variant="label.medium">自社ひな形プレイブック</Text>
          <div
            style={{
              border: "1px solid var(--aegis-color-border-default)",
              borderRadius: "var(--aegis-radius-medium)",
              padding: "var(--aegis-space-large)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--aegis-space-medium)",
            }}
          >
            <Text variant="body.small" color="subtle" style={{ textAlign: "center" }}>
              自社ひな形への修正案をレビューするプレイブックを作成
            </Text>
            <Button variant="subtle">プレイブックを作成</Button>
          </div>
        </div>
      </div>

      {/* フローティングチェックボタン */}
      <div
        style={{
          position: "absolute",
          bottom: "var(--aegis-space-medium)",
          right: "var(--aegis-space-medium)",
        }}
      >
        <Button>チェック</Button>
      </div>
    </div>
  );

  const renderAssistantView = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aegis-space-medium)",
        paddingBlock: "var(--aegis-space-medium)",
      }}
    >
      <Text variant="title.small">LegalOnアシスタント</Text>
      <Banner color="information" closeButton={false}>
        契約書の内容について質問したり、修正文案の作成を依頼できます。
      </Banner>
      <Textarea aria-label="契約書について質問する" placeholder="契約書について質問する" minRows={5} />
      <Button>送信</Button>
    </div>
  );

  const renderPaneBody = () => {
    if (currentTab === "assistant") {
      return renderAssistantView();
    }
    if (currentTab === "search") {
      return renderSearchView();
    }
    if (currentTab === "contracts") {
      return renderMainView();
    }
    return currentView === "riskCheck" ? renderRiskCheckView() : showSearchView ? renderSearchView() : renderMainView();
  };

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutBody>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
            }}
          >
            <Text color="subtle">Word Document Area</Text>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>

      <PageLayoutPane position="end" open={paneOpen} width="medium" resizable>
        <PageLayoutHeader>
          <WordAddinTabNavigation activeTab={currentTab} onTabChange={handleTabChange} />
        </PageLayoutHeader>
        <PageLayoutBody>{renderPaneBody()}</PageLayoutBody>
      </PageLayoutPane>

      {/* メニュードロワー */}
      <Drawer open={menuOpen} onOpenChange={setMenuOpen} position="start" width="medium">
        <Drawer.Header>
          <ContentHeader
            size="medium"
            leading={
              <Tooltip title="閉じる">
                <IconButton aria-label="閉じる" variant="plain" onClick={() => setMenuOpen(false)}>
                  <Icon>
                    <LfCloseLarge />
                  </Icon>
                </IconButton>
              </Tooltip>
            }
          >
            <ContentHeaderTitle>メニュー</ContentHeaderTitle>
          </ContentHeader>
        </Drawer.Header>
        <Drawer.Body>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* レビュー・校正 */}
            <button
              type="button"
              style={{
                padding: "var(--aegis-space-medium)",
                background: "none",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
              }}
              onClick={() => {
                setCurrentTab("review");
                setCurrentView("review");
                setMenuOpen(false);
              }}
            >
              <Text variant="body.medium">レビュー</Text>
            </button>
            <button
              type="button"
              style={{
                padding: "var(--aegis-space-medium)",
                background: "none",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
              }}
              onClick={() => {
                setCurrentTab("review");
                setCurrentView("riskCheck");
                setMenuOpen(false);
              }}
            >
              <Text variant="body.medium">校正</Text>
            </button>
            <Divider />

            {/* LegalOnアシスタント */}
            <div style={{ padding: "var(--aegis-space-medium)" }}>
              <Text variant="body.medium">LegalOnアシスタント</Text>
            </div>
            <Divider />

            {/* 契約書 */}
            <button
              type="button"
              style={{
                padding: "var(--aegis-space-medium)",
                background: "none",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
              }}
              onClick={() => {
                setCurrentTab("contracts");
                setMenuOpen(false);
              }}
            >
              <Text variant="body.medium">契約書</Text>
            </button>
            <div style={{ padding: "var(--aegis-space-medium)" }}>
              <Text variant="body.medium">契約書アップロード</Text>
            </div>
            <Divider />

            {/* 条文検索 */}
            <div style={{ padding: "var(--aegis-space-medium)" }}>
              <Text variant="body.medium">条文検索</Text>
            </div>
            <Divider />

            {/* 外部リンク */}
            <div
              style={{
                padding: "var(--aegis-space-medium)",
                display: "flex",
                alignItems: "center",
                gap: "var(--aegis-space-xxSmall)",
              }}
            >
              <Text variant="body.medium">LegalOn</Text>
              <Icon size="small" color="subtle">
                <LfArrowUpRightFromSquare />
              </Icon>
            </div>
            <div
              style={{
                padding: "var(--aegis-space-medium)",
                display: "flex",
                alignItems: "center",
                gap: "var(--aegis-space-xxSmall)",
              }}
            >
              <Text variant="body.medium">ヘルプページ</Text>
              <Icon size="small" color="subtle">
                <LfArrowUpRightFromSquare />
              </Icon>
            </div>
            <div
              style={{
                padding: "var(--aegis-space-medium)",
                display: "flex",
                alignItems: "center",
                gap: "var(--aegis-space-xxSmall)",
              }}
            >
              <Text variant="body.medium">ステータスサイト</Text>
              <Icon size="small" color="subtle">
                <LfArrowUpRightFromSquare />
              </Icon>
            </div>
            <Divider />

            {/* ログアウト */}
            <div style={{ padding: "var(--aegis-space-medium)" }}>
              <Text variant="body.medium">ログアウト</Text>
            </div>
          </div>
        </Drawer.Body>
      </Drawer>
    </PageLayout>
  );
};

export default WordAddinTemplate;
