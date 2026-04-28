import {
  LfAngleDown,
  LfAngleLeft,
  LfAnglesDown,
  LfAnglesUp,
  LfAngleUp,
  LfArrowsRotate,
  LfPen,
  LfQuestionCircle,
  LfRightFromBracket,
} from "@legalforce/aegis-icons";
import {
  ActionList,
  Avatar,
  Button,
  ButtonGroup,
  ContentHeader,
  DescriptionList,
  DescriptionListDetail,
  DescriptionListItem,
  DescriptionListTerm,
  Header,
  Icon,
  IconButton,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutPane,
  StatusLabel,
  Switch,
  Tab,
  Text,
  Textarea,
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";

// --- Mock Data ---

const MOCK_CONTRACT = {
  fileName: "サンプル.pdf",
  managementStartDatetime: "2024/07/05 12:49",
  operationCount: {
    completed1st: 0,
    completed2nd: 0,
    assigned1st: 7,
    assigned2nd: 0,
  },
  manualCorrectionComment: "",
  tenantName: "case-mgmt-display-name_d18c93",
  language: "日本語",
  title: "秘密保持契約",
  ownParty: "株式会社LegalForce",
  counterParties: ["株式会社●●", "●"],
  totalTransactionAmount: "",
  autoRenewable: false,
  signingDate: "",
  effectiveDate: "",
  effectivePeriod: "2年間",
  expirationDate: "",
};

const MOCK_CONTRACT_TEXT = {
  title: "秘密保持契約",
  preamble:
    "株式会社●●（以下「甲」という。）と株式会社 LegalForce（以下「乙」という。）は、甲乙間において、次のとおり契約（以下「本契約」という。）を締結する。",
  articles: [
    {
      heading: "第１条（目的）",
      body: "甲及び乙は、甲乙間の業務提携（以下「本件取引」という。）の可能性を検討することを目的（以下「本目的」という。）として、本契約を締結する（以下、情報を開示提供した当事者を「開示者」、情報の開示提供を受けた当事者を「受領者」という。）。",
    },
    {
      heading: "第２条（秘密情報の定義）",
      body: "1. 本契約において秘密情報とは、文書、口頭、電磁的記録媒体その他開示の方法及び媒体並びに本契約締結の前後を問わず、甲又は乙が開示した技術、開発、製品、営業、人事、財務、組織、計画、ノウハウその他の事項に関する一切の情報、本契約の存在及び内容、並びに本件取引に関する協議・交渉の存在及び内容をいう。",
      items: [
        "2. 前項の規定にかかわらず、次の各号に定める情報（個人情報を除く。）は秘密情報には含まれない。",
        "（1）開示者から開示を受ける前に、受領者が正当に保有していた情報",
        "（2）開示者から開示を受ける前に、公知となっていた情報",
        "（3）開示者から開示を受けた後に、受領者の責に帰すべからざる事由により公知となった情報",
        "（4）受領者が、正当な権限を有する第三者から秘密保持義務を負うことなく適法に入手した情報",
        "（5）受領者が、開示された秘密情報によらず独自に開発し、これを客観的に立証できた情報",
      ],
    },
    {
      heading: "第３条（秘密保持）",
      body: "1. 受領者は、秘密情報を機密として保持する義務を負うものとし、開示者の事前の書面又は電子メールによる承諾なくして、秘密情報の一部又は全部を第三者に対して開示、漏洩、公表、使用許諾、譲渡、貸与等してはならないものとする。",
      items: [
        "2. 受領者は、前項の規定にかかわらず、本目的のために必要な範囲のみにおいて、自己、親会社、子会社、兄弟会社、又は関係会社の役員及び従業員並びに本件取引に関して受領者が依頼する弁護士、公認会計士、税理士その他のアドバイザー（総称して以下「機関員等」という。）に対して、秘密情報を開示することができるものとする。受領者は、当該機関員等の秘密情報の開示を含む本契約に定める秘密保持義務と同等以上の義務を負わせないときは、本契約に定める秘密保持義務を当該機関員等に課したうえで、その義務を遵守させるものとし、かつ、当該機関員等においてその義務の違反があった場合には、受領者による義務の違反として、開示者に対して直接責任を負うものとする。",
        "3. 第１項の規定にかかわらず、受領者は、法令、裁判所、監督官庁、金融商品取引所その他の規制機関による命令、規則又は要請に基づき、必要な範囲内で秘密情報を開示することができるものとする。",
      ],
    },
  ],
};

// --- Annotation Item Component ---

type AnnotationItemProps = {
  label: string;
  children?: React.ReactNode;
};

const AnnotationItem = ({ label, children }: AnnotationItemProps) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--aegis-space-xxSmall)" }}>
    <div style={{ flexShrink: 0, marginTop: "var(--aegis-space-xxSmall)" }}>
      <Tooltip title="テキストをハイライト">
        <IconButton aria-label="テキストをハイライト" size="small" variant="plain" disabled>
          <Icon size="xSmall">
            <LfPen />
          </Icon>
        </IconButton>
      </Tooltip>
    </div>
    <DescriptionListItem orientation="horizontal">
      <DescriptionListTerm width="small">{label}</DescriptionListTerm>
      <DescriptionListDetail>{children}</DescriptionListDetail>
    </DescriptionListItem>
  </div>
);

// --- PDF Viewer Placeholder ---

const PdfViewerPlaceholder = () => (
  <div
    style={{
      flex: 1,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "var(--aegis-space-large)",
      backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
      overflow: "auto",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "var(--aegis-layout-width-large)",
        backgroundColor: "var(--aegis-color-background-default)",
        borderRadius: "var(--aegis-radius-medium)",
        border: "1px solid var(--aegis-color-border-default)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "var(--aegis-space-xLarge)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "var(--aegis-space-xLarge)" }}>
        <Text variant="title.medium">{MOCK_CONTRACT_TEXT.title}</Text>
      </div>
      <Text variant="body.medium" color="subtle">
        {MOCK_CONTRACT_TEXT.preamble}
      </Text>
      {MOCK_CONTRACT_TEXT.articles.map((article) => (
        <div key={article.heading} style={{ marginTop: "var(--aegis-space-large)" }}>
          <Text variant="body.medium" style={{ fontWeight: "bold" }}>
            {article.heading}
          </Text>
          <div style={{ marginTop: "var(--aegis-space-xSmall)" }}>
            <Text variant="body.medium" color="subtle">
              {article.body}
            </Text>
          </div>
          {article.items?.map((item) => (
            <div
              key={item}
              style={{
                marginTop: "var(--aegis-space-xxSmall)",
                paddingLeft: "var(--aegis-space-medium)",
              }}
            >
              <Text variant="body.medium" color="subtle">
                {item}
              </Text>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// --- PDF Scale Slider ---

const PdfBottomToolbar = ({ scale, onChangeScale }: { scale: number; onChangeScale: (value: number) => void }) => (
  <Toolbar size="small">
    <ToolbarGroup>
      <Tooltip title="ズームを下げる">
        <IconButton
          aria-label="ズームを下げる"
          size="small"
          variant="plain"
          onClick={() => onChangeScale(Math.max(50, scale - 10))}
        >
          −
        </IconButton>
      </Tooltip>
      <input
        type="range"
        aria-label="ズーム倍率"
        min={50}
        max={200}
        step={10}
        value={scale}
        onChange={(e) => onChangeScale(Number(e.target.value))}
        style={{ width: "100px" }}
      />
      <Tooltip title="ズームを上げる">
        <IconButton
          aria-label="ズームを上げる"
          size="small"
          variant="plain"
          onClick={() => onChangeScale(Math.min(200, scale + 10))}
        >
          +
        </IconButton>
      </Tooltip>
    </ToolbarGroup>
    <ToolbarSeparator />
    <ToolbarGroup>
      <ButtonGroup>
        <Tooltip title="最初">
          <IconButton aria-label="最初" size="small" variant="plain" disabled>
            <Icon size="xSmall">
              <LfAnglesUp />
            </Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="前">
          <IconButton aria-label="前" size="small" variant="plain" disabled>
            <Icon size="xSmall">
              <LfAngleUp />
            </Icon>
          </IconButton>
        </Tooltip>
      </ButtonGroup>
      <ButtonGroup>
        <Tooltip title="次">
          <IconButton aria-label="次" size="small" variant="plain">
            <Icon size="xSmall">
              <LfAngleDown />
            </Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="最後">
          <IconButton aria-label="最後" size="small" variant="plain">
            <Icon size="xSmall">
              <LfAnglesDown />
            </Icon>
          </IconButton>
        </Tooltip>
      </ButtonGroup>
    </ToolbarGroup>
    <ToolbarSeparator />
    <ToolbarGroup>
      <Text variant="body.small" color="subtle">
        1/9
      </Text>
      <Text variant="body.small" color="subtle">
        ページ
      </Text>
    </ToolbarGroup>
  </Toolbar>
);

// --- Main Template Component ---

const ManualCorrectionTemplate = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [renderTextLayer, setRenderTextLayer] = useState(false);
  const [pdfAutoFit, setPdfAutoFit] = useState(true);
  const [pdfScale, setPdfScale] = useState(100);
  const [rotate, setRotate] = useState(0);

  const { operationCount } = MOCK_CONTRACT;

  return (
    <>
      {/* Header */}
      <Header>
        <Header.Item>
          <Tooltip title="一覧に戻る">
            <IconButton aria-label="一覧に戻る">
              <Icon>
                <LfAngleLeft />
              </Icon>
            </IconButton>
          </Tooltip>
        </Header.Item>
        <ContentHeader>
          <ContentHeader.Title>{MOCK_CONTRACT.fileName}</ContentHeader.Title>
        </ContentHeader>
        <Header.Spacer />
        <Header.Item>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
            <Text variant="body.small" color="subtle">
              対応済 {operationCount.completed1st} (1st: {operationCount.completed1st}, 2nd:{" "}
              {operationCount.completed2nd}) / アサイン {operationCount.assigned1st + operationCount.assigned2nd} (1st:{" "}
              {operationCount.assigned1st}, 2nd: {operationCount.assigned2nd})
            </Text>
          </div>
        </Header.Item>
        <Header.Item>
          <ButtonGroup>
            <Menu>
              <Menu.Anchor>
                <Avatar name="オペレーター" />
              </Menu.Anchor>
              <Menu.Box>
                <ActionList>
                  <ActionList.Group>
                    <ActionList.Item>
                      <ActionList.Body
                        leading={
                          <Icon>
                            <LfRightFromBracket />
                          </Icon>
                        }
                      >
                        ログアウト
                      </ActionList.Body>
                    </ActionList.Item>
                  </ActionList.Group>
                </ActionList>
              </Menu.Box>
            </Menu>
          </ButtonGroup>
        </Header.Item>
      </Header>

      {/* Main Layout */}
      <PageLayout>
        <PageLayoutContent>
          <PageLayoutBody>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {/* Tab Bar + Status */}
              <Tab.Group index={tabIndex} onChange={setTabIndex}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 var(--aegis-space-small)",
                  }}
                >
                  <Tab.List>
                    <Tab>PDF</Tab>
                    <Tab>テキスト</Tab>
                    <Tab>並べて表示</Tab>
                  </Tab.List>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
                    <StatusLabel color="yellow" variant="fill">
                      1stチェック
                    </StatusLabel>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Text variant="body.small">管理開始日時</Text>
                      <Tooltip title="契約書が締結版として確定し、手動補正の対象になった日時">
                        <IconButton
                          icon={LfQuestionCircle}
                          aria-label="契約書が締結版として確定し、手動補正の対象になった日時"
                          variant="plain"
                          size="small"
                        />
                      </Tooltip>
                      <Text variant="body.small">: {MOCK_CONTRACT.managementStartDatetime}</Text>
                    </div>
                    {tabIndex === 0 || tabIndex === 2 ? (
                      <Button
                        aria-label="PDFを回転"
                        variant="plain"
                        leading={
                          <Icon>
                            <LfArrowsRotate />
                          </Icon>
                        }
                        onClick={() => setRotate((prev) => (prev + 90) % 360)}
                      >
                        {rotate}°
                      </Button>
                    ) : null}
                  </div>
                </div>
                <Tab.Panels>
                  {/* PDF Tab */}
                  <Tab.Panel unmountOnExit={false}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "calc(100vh - 200px)",
                        backgroundColor: "var(--aegis-color-background-accent-yellow-xSubtle)",
                        border: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-neutral)",
                        overflow: "auto",
                        position: "relative",
                      }}
                    >
                      <PdfViewerPlaceholder />
                      <div
                        style={{
                          position: "sticky",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                        }}
                      >
                        <PdfBottomToolbar scale={pdfScale} onChangeScale={setPdfScale} />
                      </div>
                    </div>
                  </Tab.Panel>

                  {/* Text Tab */}
                  <Tab.Panel>
                    <div
                      style={{
                        height: "calc(100vh - 200px)",
                        border: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-neutral)",
                        padding: "var(--aegis-space-medium)",
                        overflow: "auto",
                      }}
                    >
                      <div style={{ textAlign: "center", marginBottom: "var(--aegis-space-large)" }}>
                        <Text variant="title.medium">{MOCK_CONTRACT_TEXT.title}</Text>
                      </div>
                      <Text variant="body.medium">{MOCK_CONTRACT_TEXT.preamble}</Text>
                      {MOCK_CONTRACT_TEXT.articles.map((article) => (
                        <div key={article.heading} style={{ marginTop: "var(--aegis-space-large)" }}>
                          <Text variant="body.medium" style={{ fontWeight: "bold" }}>
                            {article.heading}
                          </Text>
                          <div style={{ marginTop: "var(--aegis-space-xSmall)" }}>
                            <Text variant="body.medium">{article.body}</Text>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Tab.Panel>

                  {/* Both Tab */}
                  <Tab.Panel unmountOnExit={false}>
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--aegis-space-xSmall)",
                        height: "calc(100vh - 200px)",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          backgroundColor: "var(--aegis-color-background-accent-yellow-xSubtle)",
                          border: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-neutral)",
                          overflow: "auto",
                          position: "relative",
                        }}
                      >
                        <PdfViewerPlaceholder />
                      </div>
                      <div
                        style={{
                          flex: 1,
                          border: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-neutral)",
                          padding: "var(--aegis-space-medium)",
                          overflow: "auto",
                        }}
                      >
                        <div style={{ textAlign: "center", marginBottom: "var(--aegis-space-large)" }}>
                          <Text variant="title.medium">{MOCK_CONTRACT_TEXT.title}</Text>
                        </div>
                        <Text variant="body.medium">{MOCK_CONTRACT_TEXT.preamble}</Text>
                        {MOCK_CONTRACT_TEXT.articles.map((article) => (
                          <div key={article.heading} style={{ marginTop: "var(--aegis-space-large)" }}>
                            <Text variant="body.medium" style={{ fontWeight: "bold" }}>
                              {article.heading}
                            </Text>
                            <div style={{ marginTop: "var(--aegis-space-xSmall)" }}>
                              <Text variant="body.medium">{article.body}</Text>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>

        {/* Right Pane */}
        <PageLayoutPane position="end" width="large" resizable scrollBehavior="inside">
          <PageLayoutBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
              {/* Toggle Switches */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Switch
                  color="information"
                  checked={!renderTextLayer}
                  onChange={() => setRenderTextLayer((prev) => !prev)}
                >
                  PDFタブの表示速度を向上する
                </Switch>
                <Text variant="body.small" color="subtle">
                  オンにするとPDFタブでテキスト選択・ハイライト表示が無効になります
                </Text>
                <Switch color="information" checked={pdfAutoFit} onChange={() => setPdfAutoFit((prev) => !prev)}>
                  PDFサイズをページにあわせて自動調整
                </Switch>
              </div>

              {/* Annotation Viewer (DescriptionList) */}
              <DescriptionList>
                {/* 手動補正コメント */}
                <DescriptionListItem>
                  <DescriptionListTerm>手動補正コメント</DescriptionListTerm>
                  <DescriptionListDetail>
                    <Textarea maxRows={6} disabled value={MOCK_CONTRACT.manualCorrectionComment} />
                  </DescriptionListDetail>
                </DescriptionListItem>

                {/* Contract Detail Items */}
                <AnnotationItem label="テナント">{MOCK_CONTRACT.tenantName}</AnnotationItem>
                <AnnotationItem label="言語">{MOCK_CONTRACT.language}</AnnotationItem>
                <AnnotationItem label="タイトル">{MOCK_CONTRACT.title}</AnnotationItem>
                <AnnotationItem label="自社">{MOCK_CONTRACT.ownParty}</AnnotationItem>
                {MOCK_CONTRACT.counterParties.map((party, index) => (
                  <AnnotationItem
                    key={party}
                    label={`取引先${MOCK_CONTRACT.counterParties.length > 1 ? `(${index + 1})` : ""}`}
                  >
                    {party}
                  </AnnotationItem>
                ))}
                <AnnotationItem label="取引金額">{MOCK_CONTRACT.totalTransactionAmount || undefined}</AnnotationItem>
                <AnnotationItem label="自動更新">{MOCK_CONTRACT.autoRenewable ? "あり" : "なし"}</AnnotationItem>
                <AnnotationItem label="契約締結日">{MOCK_CONTRACT.signingDate || undefined}</AnnotationItem>
                <AnnotationItem label="契約開始日">{MOCK_CONTRACT.effectiveDate || undefined}</AnnotationItem>
                <AnnotationItem label="契約期間">{MOCK_CONTRACT.effectivePeriod}</AnnotationItem>
                <AnnotationItem label="契約終了日">{MOCK_CONTRACT.expirationDate || undefined}</AnnotationItem>
              </DescriptionList>

              {/* Bottom Action Buttons */}
              <div style={{ marginInlineStart: "auto" }}>
                <ButtonGroup>
                  <Button
                    leading={
                      <Icon>
                        <LfPen />
                      </Icon>
                    }
                  >
                    アサインして編集
                  </Button>
                  <Button>一覧へ戻る</Button>
                </ButtonGroup>
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutPane>
      </PageLayout>
    </>
  );
};

export default ManualCorrectionTemplate;
