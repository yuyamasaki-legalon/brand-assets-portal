import {
  LfAngleLeftLarge,
  LfArrowRightArrowLeft,
  LfArrowUpArrowDown,
  LfCloseLarge,
  LfDownload,
  LfEllipsisDot,
  LfFile,
  LfMagnifyingGlass,
  LfMenu,
  LfPlusLarge,
  LfPlusSmall,
  LfStack,
} from "@legalforce/aegis-icons";
import {
  Button,
  ButtonGroup,
  ContentHeader,
  ContentHeaderTitle,
  Divider,
  Header,
  Icon,
  IconButton,
  InformationCard,
  InformationCardDescription,
  InformationCardLink,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutSidebar,
  SideNavigation,
  StatusLabel,
  Tab,
  Tag,
  Text,
  Timeline,
  TimelineContent,
  TimelineItem,
  TimelinePoint,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type FileVersion = {
  version: string;
  fileName: string;
  status: string;
  date: string;
};

const sampleVersions: FileVersion[] = [
  {
    version: "v2",
    fileName: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.docx",
    status: "なし",
    date: "2025/11/13 14:11",
  },
  {
    version: "v1",
    fileName: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.docx",
    status: "なし",
    date: "2025/11/12 17:00",
  },
];

type Pane = "versions" | null;

const FileManagementDetail = () => {
  const navigate = useNavigate();
  const zoom = 100;
  const [selectedPane, setSelectedPane] = useState<Pane>("versions");

  const openPane = (pane: NonNullable<Pane>) => {
    setSelectedPane(pane);
  };

  const closePane = () => {
    setSelectedPane(null);
  };

  return (
    <>
      <Header>
        <Header.Item>
          <Tooltip title="メニュー">
            <IconButton icon={LfMenu} aria-label="menu" />
          </Tooltip>
          <Divider orientation="vertical" />
          <Tooltip title="戻る">
            <IconButton
              icon={LfAngleLeftLarge}
              aria-label="back"
              onClick={() => navigate("/sandbox/loc/terada/file-management")}
              variant="plain"
            />
          </Tooltip>
        </Header.Item>

        <Header.Item>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-xxSmall)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
              <StatusLabel variant="outline">なし</StatusLabel>
              <Text variant="title.xxSmall" numberOfLines={1}>
                秘密保持契約書_株式会社LegalOnTechnologies_20251113.docx
              </Text>
            </div>
            <Text variant="body.small" color="subtle">
              田中花子 • 2025/11/13 14:11
            </Text>
          </div>
        </Header.Item>

        <Header.Spacer />

        <Header.Item>
          <ButtonGroup>
            <Tooltip title="検索">
              <IconButton icon={LfMagnifyingGlass} aria-label="search" />
            </Tooltip>
            <Tooltip title="比較">
              <IconButton icon={LfArrowRightArrowLeft} aria-label="compare" />
            </Tooltip>
            <Tooltip title="ダウンロード">
              <IconButton icon={LfDownload} aria-label="download" />
            </Tooltip>
            <Tooltip title="その他">
              <IconButton icon={LfEllipsisDot} aria-label="more" />
            </Tooltip>
            <Button variant="plain">レビュー</Button>
          </ButtonGroup>
        </Header.Item>
      </Header>

      <PageLayout>
        <PageLayoutContent maxWidth="medium">
          <PageLayoutBody>
            <Tab.Group>
              <Tab.List>
                <Tab>プレビュー</Tab>
                <Tab>テキスト</Tab>
              </Tab.List>

              <Tab.Panel>
                <div
                  style={{
                    padding: "var(--aegis-space-medium)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "var(--aegis-space-medium)",
                    }}
                  >
                    <Text variant="body.small" color="subtle">
                      {zoom}%
                    </Text>
                  </div>

                  <div
                    style={{
                      backgroundColor: "white",
                      padding: "var(--aegis-space-xxLarge)",
                      maxHeight: "800px",
                      overflow: "auto",
                    }}
                  >
                    <div style={{ textAlign: "center", marginBottom: "var(--aegis-space-large)" }}>
                      <Text variant="title.large">秘密保持契約</Text>
                    </div>

                    <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                      <Text>
                        株式会社●●（以下「甲」という。）と株式会社 Legal
                        <Text as="span" style={{ color: "var(--aegis-color-text-accent)" }}>
                          On Technologies
                        </Text>
                        <Text as="span" style={{ color: "var(--aegis-color-text-accent)" }}>
                          Force
                        </Text>
                        （以下「乙」という。）は、甲乙間において、次のとおり契約（以下「本契約」という。）を締結する。
                      </Text>
                    </div>

                    <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                      <Text variant="title.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
                        第1条（目的）
                      </Text>
                      <Text>
                        甲および乙は、甲乙間の業務提携（以下「本件取引」という。）の可能性を検討することを目的（以下「本目的」という。）として、本契約を締結する（以下、情報を開示提供した当事者を「開示者」、情報の開示提供を受けた当事者を「受領者」という。）。
                      </Text>
                    </div>

                    <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                      <Text variant="title.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
                        第2条（秘密情報の定義）
                      </Text>
                      <div style={{ marginBottom: "var(--aegis-space-small)" }}>
                        <Text>
                          1.
                          本契約において秘密情報とは、文書、口頭、電磁的記録媒体その他開示の方法および媒体を問わず、甲または乙が開示した技術情報、製品、営業、人事、財産、組織、ノウハウその他の事項に関する一切の情報で、本契約の存在および内容、ならびに本件取引に関する協議・交渉の存在および内容をいう。
                        </Text>
                      </div>
                      <div style={{ marginBottom: "var(--aegis-space-small)" }}>
                        <Text>
                          2. 前項の規定にかかわらず、次の各号に定める情報（個人情報を除く。）は秘密情報には含まれない。
                        </Text>
                      </div>
                      <div
                        style={{
                          marginLeft: "var(--aegis-space-large)",
                          marginBottom: "var(--aegis-space-xSmall)",
                        }}
                      >
                        <Text>(1) 開示者から開示を受ける前に、受領者が正当に保有していた情報</Text>
                      </div>
                      <div
                        style={{
                          marginLeft: "var(--aegis-space-large)",
                          marginBottom: "var(--aegis-space-xSmall)",
                        }}
                      >
                        <Text>(2) 開示者から開示を受ける前に、公知となっていた情報</Text>
                      </div>
                      <div
                        style={{
                          marginLeft: "var(--aegis-space-large)",
                          marginBottom: "var(--aegis-space-xSmall)",
                        }}
                      >
                        <Text>
                          (3) 開示者から開示を受けた後に、受領者の責に帰すべきなる事由によより公知となった情報
                        </Text>
                      </div>
                      <div
                        style={{
                          marginLeft: "var(--aegis-space-large)",
                          marginBottom: "var(--aegis-space-xSmall)",
                        }}
                      >
                        <Text>
                          (4) 受領者が、正当な権限を有する第三者から秘密保持義務を負うことなく適法に入手した情報
                        </Text>
                      </div>
                      <div style={{ marginLeft: "var(--aegis-space-large)" }}>
                        <Text>(5) 受領者が、開示された秘密情報によらず独自に開発し、これを客観的に立証できた情報</Text>
                      </div>
                    </div>

                    <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                      <Text variant="title.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
                        第3条（秘密保持）
                      </Text>
                      <div style={{ marginBottom: "var(--aegis-space-small)" }}>
                        <Text>
                          1.
                          受領者は、秘密情報を機密として保持する義務を負うものとし、開示者の事前の書面または電子メールによる承諾なしに開示、秘密情報の取扱いは適切な保護措置を講じまたは対してまたは第三者に対して行ってはならない。
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Panel>

              <Tab.Panel>
                <Text>テキストビュー</Text>
              </Tab.Panel>
            </Tab.Group>
          </PageLayoutBody>
        </PageLayoutContent>

        <PageLayoutPane position="end" open={selectedPane !== null} width="large">
          <PageLayoutHeader>
            <ContentHeader
              size="medium"
              trailing={
                <Tooltip title="閉じる">
                  <IconButton
                    icon={LfCloseLarge}
                    variant="plain"
                    size="small"
                    aria-label="閉じる"
                    onClick={closePane}
                  />
                </Tooltip>
              }
            >
              <ContentHeaderTitle>バージョン</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>

          <PageLayoutBody>
            <Button leading={LfPlusLarge} variant="subtle" size="medium" width="full">
              アップロード
            </Button>

            <ContentHeader
              size="small"
              trailing={
                <ButtonGroup>
                  <Button leading={LfArrowUpArrowDown} variant="plain" size="small">
                    並べ替え
                  </Button>
                </ButtonGroup>
              }
            />

            <Timeline>
              {sampleVersions.map((version, index) => (
                <TimelineItem key={version.version}>
                  <TimelinePoint>
                    <Tag>{version.version}</Tag>
                  </TimelinePoint>
                  <TimelineContent>
                    <article
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        wordBreak: "break-all",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text variant="data.small" color="subtle">
                          {version.date}
                        </Text>
                        <Tooltip title="メニュー" placement="top">
                          <IconButton
                            icon={LfEllipsisDot}
                            aria-label="more"
                            size="xSmall"
                            variant="plain"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Tooltip>
                      </div>
                      <Text
                        as="h4"
                        variant="data.medium"
                        style={{
                          marginTop: "var(--aegis-space-xSmall)",
                        }}
                      >
                        {version.fileName}
                      </Text>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: "var(--aegis-space-xSmall)",
                        }}
                      >
                        <StatusLabel variant="outline">{version.status}</StatusLabel>
                        {index === 0 && (
                          <Button variant="subtle" size="small">
                            比較
                          </Button>
                        )}
                      </div>
                    </article>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>

            <Divider />

            <div>
              <Text variant="title.xSmall" style={{ marginBottom: "var(--aegis-space-small)" }}>
                バージョンの候補
              </Text>
              <Button variant="subtle" width="full">
                検索
              </Button>
            </div>

            <ButtonGroup attached variant="subtle">
              <InformationCard
                leading={
                  <Icon>
                    <LfFile />
                  </Icon>
                }
              >
                <InformationCardLink href="#">秘密保持契約</InformationCardLink>
                <InformationCardDescription>株式会社LegalOn Technologies</InformationCardDescription>
              </InformationCard>
              <Tooltip title="追加" placement="top">
                <IconButton icon={LfPlusSmall} aria-label="add" />
              </Tooltip>
            </ButtonGroup>
          </PageLayoutBody>
        </PageLayoutPane>

        <PageLayoutSidebar position="end">
          <SideNavigation>
            <SideNavigation.Group>
              <Tooltip title="バージョン" placement="left">
                <SideNavigation.Item
                  icon={LfStack}
                  aria-label="バージョン"
                  onClick={() => openPane("versions")}
                  aria-current={selectedPane === "versions" ? true : undefined}
                />
              </Tooltip>
            </SideNavigation.Group>
          </SideNavigation>
        </PageLayoutSidebar>
      </PageLayout>
    </>
  );
};

export default FileManagementDetail;
