import {
  LfAngleLeftLarge,
  LfArrowUpRightFromSquare,
  LfCloseLarge,
  LfDownload,
  LfEarth,
  LfInformationCircle,
} from "@legalforce/aegis-icons";
import {
  ButtonGroup,
  ContentHeader,
  ContentHeaderTitle,
  DescriptionList,
  DescriptionListDetail,
  DescriptionListItem,
  DescriptionListTerm,
  Divider,
  Header,
  IconButton,
  Link,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutSidebar,
  snackbar,
  Tab,
  Tag,
  TagGroup,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { categories, subCategories, type Template, templates } from "./mock/data";

type Pane = "detail" | null;

// TemplateViewer Component
const TemplateViewer = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  return (
    <PageLayoutBody>
      <Tab.Group index={selectedTabIndex} variant="plain" height="full">
        <Tab.List>
          <Tab onClick={() => setSelectedTabIndex(0)}>PDF表示</Tab>
          <Tab onClick={() => setSelectedTabIndex(1)}>テキスト表示</Tab>
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            {selectedTabIndex === 0 && (
              <div
                style={{
                  height: "var(--aegis-layout-width-small)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <Text variant="body.medium" color="subtle">
                  PDFビューアー（プレースホルダー）
                </Text>
              </div>
            )}
          </Tab.Panel>

          <Tab.Panel>
            {selectedTabIndex === 1 && (
              <div
                style={{
                  height: "var(--aegis-layout-width-small)",
                  padding: "var(--aegis-space-large)",
                  backgroundColor: "#ffffff",
                  overflowY: "auto",
                }}
              >
                <Text variant="body.medium">
                  <p>【プレースホルダー: テキストビューアー】</p>
                  <br />
                  <p>第1条（目的）</p>
                  <p>本契約は、売主と買主の間における商品の売買に関する条件を定めることを目的とする。</p>
                  <br />
                  <p>第2条（売買の目的物）</p>
                  <p>売買の目的物は、別紙に記載する商品とする。</p>
                  <br />
                  <p>第3条（売買代金）</p>
                  <p>売買代金は、別紙に記載する金額とする。</p>
                  <br />
                  <p>第4条（支払方法）</p>
                  <p>買主は、売買代金を契約締結日から30日以内に売主の指定する銀行口座に振り込む方法により支払う。</p>
                  <br />
                  <p>第5条（引渡し）</p>
                  <p>売主は、売買代金の入金を確認した後、速やかに目的物を買主に引き渡すものとする。</p>
                </Text>
              </div>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </PageLayoutBody>
  );
};

// TemplateDetail Component
interface TemplateDetailProps {
  template: Template;
}

const TemplateDetail = ({ template }: TemplateDetailProps) => {
  const categoryNames = template.categories
    .map((catId) => categories.find((c) => c.id === catId)?.name)
    .filter(Boolean);

  const subCategoryNames = template.subCategories
    .map((subId) => subCategories.find((s) => s.id === subId)?.name)
    .filter(Boolean);

  return (
    <div
      style={{
        overflowY: "auto",
        flex: 1,
      }}
    >
      <DescriptionList size="small">
        <DescriptionListItem>
          <DescriptionListTerm>
            <Text variant="body.small" color="subtle">
              立場
            </Text>
          </DescriptionListTerm>
          <DescriptionListDetail>
            <Text variant="body.medium">{template.position}</Text>
          </DescriptionListDetail>
        </DescriptionListItem>

        <DescriptionListItem>
          <DescriptionListTerm>
            <Text variant="body.small" color="subtle">
              準拠法
            </Text>
          </DescriptionListTerm>
          <DescriptionListDetail>
            <Text variant="body.medium">{template.governingLaw}</Text>
          </DescriptionListDetail>
        </DescriptionListItem>

        {template.commentaries.length > 0 && (
          <DescriptionListItem>
            <DescriptionListTerm>
              <Text variant="body.small" color="subtle">
                解説
              </Text>
            </DescriptionListTerm>
            <DescriptionListDetail>
              {template.commentaries.map((commentary) => (
                <Link key={commentary.url} href={commentary.url} trailing={<LfArrowUpRightFromSquare />}>
                  {commentary.name}
                </Link>
              ))}
            </DescriptionListDetail>
          </DescriptionListItem>
        )}

        <DescriptionListItem>
          <DescriptionListTerm>
            <Text variant="body.small" color="subtle">
              概要
            </Text>
          </DescriptionListTerm>
          <DescriptionListDetail>
            <Text variant="body.medium">{template.summary}</Text>
          </DescriptionListDetail>
        </DescriptionListItem>

        {template.usageScenes.length > 0 && (
          <DescriptionListItem>
            <DescriptionListTerm>
              <Text variant="body.small" color="subtle">
                利用シーン
              </Text>
            </DescriptionListTerm>
            <DescriptionListDetail>
              {template.usageScenes.map((scene) => (
                <Link key={scene.url} href={scene.url} trailing={<LfArrowUpRightFromSquare />}>
                  {scene.name}
                </Link>
              ))}
            </DescriptionListDetail>
          </DescriptionListItem>
        )}

        <DescriptionListItem>
          <DescriptionListTerm>
            <Text variant="body.small" color="subtle">
              作成者
            </Text>
          </DescriptionListTerm>
          <DescriptionListDetail>
            <Text variant="body.medium">{template.creator}</Text>
          </DescriptionListDetail>
        </DescriptionListItem>

        <DescriptionListItem>
          <DescriptionListTerm>
            <Text variant="body.small" color="subtle">
              最終更新日
            </Text>
          </DescriptionListTerm>
          <DescriptionListDetail>
            <Text variant="body.medium">{new Date(template.updateTime).toLocaleString("ja-JP")}</Text>
          </DescriptionListDetail>
        </DescriptionListItem>

        <DescriptionListItem>
          <DescriptionListTerm>
            <Text variant="body.small" color="subtle">
              法令改正への対応状況
            </Text>
          </DescriptionListTerm>
          <DescriptionListDetail>
            <Text variant="body.medium">{template.appliedLawAmendments}</Text>
          </DescriptionListDetail>
        </DescriptionListItem>

        <DescriptionListItem>
          <DescriptionListTerm>
            <Text variant="body.small" color="subtle">
              カテゴリー
            </Text>
          </DescriptionListTerm>
          <DescriptionListDetail>
            <Text variant="body.medium">{categoryNames.join(", ")}</Text>
            {subCategoryNames.length > 0 && (
              <Text
                variant="body.small"
                color="subtle"
                style={{
                  marginTop: "var(--aegis-space-xxSmall)",
                  display: "block",
                }}
              >
                サブカテゴリー: {subCategoryNames.join(", ")}
              </Text>
            )}
          </DescriptionListDetail>
        </DescriptionListItem>

        <DescriptionListItem>
          <DescriptionListTerm>
            <Text variant="body.small" color="subtle">
              その他
            </Text>
          </DescriptionListTerm>
          <DescriptionListDetail>
            <TagGroup>
              {template.language.includes("english") && <Tag leading={LfEarth}>英語</Tag>}
              {template.language.includes("chinese") && <Tag leading={LfEarth}>中文</Tag>}
              {template.hasCommentary && <Tag>解説付き</Tag>}
            </TagGroup>
          </DescriptionListDetail>
        </DescriptionListItem>
      </DescriptionList>
    </div>
  );
};

// Main Component
export const LegalonTemplateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedPane, setSelectedPane] = useState<Pane>("detail");

  const template = templates.find((t) => t.id === id);

  if (!template) {
    return <Navigate to="/template/legalon-template" replace />;
  }

  const handleDownload = () => {
    snackbar.show({ message: `${template.title} をダウンロードしました` });
  };

  const openPane = (pane: NonNullable<Pane>) => {
    setSelectedPane(pane);
  };

  const closePane = () => {
    setSelectedPane(null);
  };

  return (
    <>
      {/* loc-app: PageHeader — 戻るボタンは直接遷移かルーター遷移かで分岐、DownloadButton は ButtonGroup 内 */}
      <Header>
        <Header.Item>
          <Tooltip title="戻る">
            <IconButton
              icon={LfAngleLeftLarge}
              aria-label="戻る"
              onClick={() => navigate("/template/legalon-template")}
            />
          </Tooltip>
        </Header.Item>

        <Header.Item>
          <Text variant="title.xxSmall" numberOfLines={1}>
            {template.title}
          </Text>
        </Header.Item>

        <Header.Spacer />

        <Header.Item>
          <ButtonGroup>
            <Tooltip title="ダウンロード">
              <IconButton icon={LfDownload} aria-label="ダウンロード" onClick={handleDownload} />
            </Tooltip>
          </ButtonGroup>
        </Header.Item>
      </Header>

      <PageLayout>
        <PageLayoutContent maxWidth="medium">
          <TemplateViewer />
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
              <ContentHeaderTitle>{template.title}</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutHeader>
            <Divider />
          </PageLayoutHeader>
          <PageLayoutBody>
            <TemplateDetail template={template} />
          </PageLayoutBody>
        </PageLayoutPane>

        <PageLayoutSidebar position="end">
          <Tooltip title="詳細情報" placement="left">
            <IconButton
              icon={LfInformationCircle}
              aria-label="詳細情報"
              onClick={() => openPane("detail")}
              aria-current={selectedPane === "detail" ? true : undefined}
              variant="plain"
            />
          </Tooltip>
        </PageLayoutSidebar>
      </PageLayout>
    </>
  );
};
