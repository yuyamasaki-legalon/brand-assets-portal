import {
  Card,
  CardBody,
  CardHeader,
  CardLink,
  ContentHeader,
  Divider,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Tab,
  Tag,
  Text,
} from "@legalforce/aegis-react";
import { Link, useSearchParams } from "react-router-dom";
import { useUpdates } from "./hooks/useUpdates";

type TagColor = "blue" | "teal" | "purple" | "orange" | "indigo";

const tagColorMap: Record<string, TagColor> = {
  Template: "blue",
  Platform: "purple",
  Component: "teal",
  DX: "orange",
  Feature: "indigo",
  Docs: "teal",
  Foundation: "purple",
};

const aegisVersions = [
  {
    version: "v2.48.0",
    path: "/updates/aegis-releases/v2-48-0",
    description: "Banner icon/xSmall, Sidebar resizable, 新アイコン 13 種追加, Tabs パディング調整, a11y 改善",
    date: "2026-04",
  },
  {
    version: "v2.47.0",
    path: "/updates/aegis-releases/v2-47-0",
    description: "Tabs (Base UI), DataTable highlightScope, TagPicker selectionBehavior, MCP Server v1.0.1",
    date: "2026-04",
  },
  {
    version: "v2.46.0",
    path: "/updates/aegis-releases/v2-46-0",
    description:
      "BottomNavigation 新規追加, ActionList bordered, Calendar small scale 対応, 新アイコン, MCP Server v1.0.0",
    date: "2026-04",
  },
  {
    version: "v2.45.1",
    path: "/updates/aegis-releases/v2-45-1",
    description: "Portal イベントバブリング修正, Portal 簡素化, Popup content ラッパー追加",
    date: "2026-04",
  },
  {
    version: "v2.45.0",
    path: "/updates/aegis-releases/v2-45-0",
    description:
      "Drawer bottom position, Textarea エラーカラー修正, DataTable バッジカラム固定, Drawer サブコンポーネント直接エクスポート",
    date: "2026-04",
  },
  {
    version: "v2.44.0",
    path: "/updates/aegis-releases/v2-44-0",
    description: "DataTable empty オプション, Button yellow カラー, DnD キーボード改善, Resizable Drawer オフセット",
    date: "2026-03",
  },
  {
    version: "v2.43.2",
    path: "/updates/aegis-releases/v2-43-2",
    description: "DataTable bordered checkbox/角丸修正, Dialog keyboard fix, Portal container 変更",
    date: "2026-03",
  },
  {
    version: "v2.43.0",
    path: "/updates/aegis-releases/v2-43-0",
    description: "DataTable bordered, Button fill, Stepper status, ButtonGroup orientation, badge pin fix",
    date: "2026-03",
  },
  {
    version: "v2.42.0",
    path: "/updates/aegis-releases/v2-42-0",
    description: "DataTable グローバルフィルタ・仮想スクロール, Dialog width=full, Dialog width=auto 修正",
    date: "2026-03",
  },
  {
    version: "v2.41.0",
    path: "/updates/aegis-releases/v2-41-0",
    description: "StatusLabel 新カラー, Tag action API, DescriptionList xLarge, InformationCard 修正",
    date: "2026-03",
  },
  {
    version: "v2.40.0",
    path: "/updates/aegis-releases/v2-40-0",
    description: "DescriptionList bordered, DataTable checkbox 修正, LfSort91 アイコン更新",
    date: "2026-02",
  },
  {
    version: "v2.39.0",
    path: "/updates/aegis-releases/v2-39-0",
    description: "PageLayoutBleed 追加, compound API deprecated, DataTable pin 修正",
    date: "2026-02",
  },
  {
    version: "v2.38.1",
    path: "/updates/aegis-releases/v2-38-1",
    description: "Snackbar small scale 対応, Portal コンテキスト修正",
    date: "2026-02",
  },
  {
    version: "v2.38.0",
    path: "/updates/aegis-releases/v2-38-0",
    description:
      "DataTable colSpan, Drawer maxWidth: none, Tree フリッカー修正, Popover max-width, Tag 修正, 新アイコン",
    date: "2025-06",
  },
] as const;

export const UpdatesPage = () => {
  const { sections, isLoading, allTags, activeTag, setActiveTag } = useUpdates();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tabIndex = tabParam === "aegis" ? 1 : 0;

  const handleTabChange = (index: number) => {
    setSearchParams(index === 1 ? { tab: "aegis" } : {}, { replace: true });
  };

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>What's New</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Tab.Group index={tabIndex} onChange={handleTabChange}>
            <Tab.List bordered style={{ width: "fit-content" }}>
              <Tab aria-label="Aegis Lab">Aegis Lab</Tab>
              <Tab aria-label="Aegis">Aegis</Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <div
                  style={{
                    display: "flex",
                    gap: "var(--aegis-space-xSmall)",
                    flexWrap: "wrap",
                    marginTop: "var(--aegis-space-medium)",
                  }}
                >
                  {allTags.map((tag) => (
                    <Tag
                      key={tag}
                      size="small"
                      color={tag === "All" ? "neutral" : (tagColorMap[tag] ?? "neutral")}
                      variant={activeTag === tag ? "fill" : "outline"}
                      onClick={() => setActiveTag(tag)}
                      style={{ cursor: "pointer" }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>

                {isLoading ? (
                  <Text as="p" variant="body.medium" style={{ marginTop: "var(--aegis-space-large)" }}>
                    Loading...
                  </Text>
                ) : (
                  <div style={{ maxWidth: "var(--aegis-layout-width-xLarge)" }}>
                    {sections.map((section, sectionIndex) => (
                      <div key={section.meta.date}>
                        {sectionIndex > 0 && (
                          <div
                            style={{
                              paddingTop: "var(--aegis-space-xLarge)",
                              paddingBottom: "var(--aegis-space-xLarge)",
                            }}
                          >
                            <Divider />
                          </div>
                        )}
                        {sectionIndex === 0 && <div style={{ height: "var(--aegis-space-xLarge)" }} />}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--aegis-space-small)",
                            marginBottom: "var(--aegis-space-medium)",
                          }}
                        >
                          <Text as="h2" variant="title.small">
                            {section.meta.period}
                          </Text>
                          <Tag size="small" color="neutral" variant="outline">
                            {section.meta.commitCount} commits
                          </Tag>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                          {section.items.map((item) => (
                            <div key={item.title}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "var(--aegis-space-xxSmall)",
                                }}
                              >
                                <Tag size="small" color={tagColorMap[item.tag] ?? "neutral"} variant="fill">
                                  {item.tag}
                                </Tag>
                                <Text variant="label.medium.bold">{item.title}</Text>
                              </div>
                              <Text
                                variant="body.small"
                                style={{ color: "var(--aegis-color-text-subtle)", display: "block" }}
                              >
                                {item.description}
                              </Text>
                              {item.impact && (
                                <Text
                                  variant="body.small"
                                  style={{
                                    color: "var(--aegis-color-text-information)",
                                    display: "block",
                                    marginTop: "var(--aegis-space-xxSmall)",
                                  }}
                                >
                                  {item.impact}
                                </Text>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Tab.Panel>

              <Tab.Panel>
                <Text
                  as="p"
                  variant="body.medium"
                  style={{ marginTop: "var(--aegis-space-medium)", marginBottom: "var(--aegis-space-large)" }}
                >
                  Aegis React の各バージョンで追加・修正された機能を個別に確認できるデモページ集です。
                </Text>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(var(--aegis-layout-width-x5Small), 1fr))",
                    gap: "var(--aegis-space-medium)",
                  }}
                >
                  {aegisVersions.map((v) => (
                    <Card key={v.version}>
                      <CardHeader
                        trailing={
                          <Tag size="small" color="blue">
                            {v.date}
                          </Tag>
                        }
                      >
                        <CardLink asChild>
                          <Link to={v.path}>
                            <Text variant="title.xSmall">{v.version}</Text>
                          </Link>
                        </CardLink>
                      </CardHeader>
                      <CardBody>
                        <Text variant="body.small">{v.description}</Text>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
