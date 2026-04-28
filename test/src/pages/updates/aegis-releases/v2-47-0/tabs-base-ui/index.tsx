import {
  Link as AegisLink,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  SegmentedControl,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const sideOptions = ["top", "inline-start", "inline-end"] as const;
type Side = (typeof sideOptions)[number];

const tabItems = [
  {
    value: "summary",
    label: "サマリー",
    title: "value で直接制御できる Tabs",
    body: "active tab を index ではなく string value で扱えるため、並び替えや条件分岐のある UI でも状態を安定して管理できます。",
  },
  {
    value: "review",
    label: "レビュー",
    title: "縦配置と横配置を同じ API で切り替え",
    body: "side を top / inline-start / inline-end で切り替えるだけで、タブ一覧を水平・垂直にレイアウトできます。",
  },
  {
    value: "history",
    label: "履歴",
    title: "TabsTrigger / TabsContent が分離",
    body: "TabsList の中に TabsTrigger、コンテンツ領域に TabsContent を置くシンプルな構成です。各要素は同じ value で関連付けます。",
  },
];

export const TabsBaseUiDemo = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [sideIndex, setSideIndex] = useState(0);

  const side: Side = sideOptions[sideIndex] ?? "top";

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Tabs (Base UI)</ContentHeader.Title>
            <ContentHeader.Description>v2.47.0: value ベースで制御できる新しい Tabs API</ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            Tabs / TabsList / TabsTrigger / TabsContent の組み合わせで、明示的な tab ID を使った状態管理ができます。
          </Text>

          <div style={{ marginBottom: "var(--aegis-space-large)" }}>
            <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
              side を切り替え
            </Text>
            <SegmentedControl index={sideIndex} onChange={setSideIndex}>
              <SegmentedControl.Button>top</SegmentedControl.Button>
              <SegmentedControl.Button>inline-start</SegmentedControl.Button>
              <SegmentedControl.Button>inline-end</SegmentedControl.Button>
            </SegmentedControl>
          </div>

          <div
            style={{
              border: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
              borderRadius: "var(--aegis-radius-large)",
              padding: "var(--aegis-space-large)",
              marginBottom: "var(--aegis-space-large)",
              minHeight: "360px",
            }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} side={side} height="full" style={{ height: "100%" }}>
              <TabsList width="medium">
                {tabItems.map((item) => (
                  <TabsTrigger key={item.value} value={item.value}>
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div
                style={{
                  flex: 1,
                  display: "grid",
                  gap: "var(--aegis-space-medium)",
                  alignContent: "start",
                  padding: "var(--aegis-space-small)",
                }}
              >
                {tabItems.map((item) => (
                  <TabsContent key={item.value} value={item.value}>
                    <div
                      style={{
                        padding: "var(--aegis-space-large)",
                        border: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
                        borderRadius: "var(--aegis-radius-medium)",
                        backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                      }}
                    >
                      <Text as="p" variant="title.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
                        {item.title}
                      </Text>
                      <Text as="p" variant="body.medium">
                        {item.body}
                      </Text>
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </div>

          <div
            style={{
              padding: "var(--aegis-space-medium)",
              backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
              borderRadius: "var(--aegis-radius-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              ポイント
            </Text>
            <Text as="p" variant="body.small">
              - `value` / `onValueChange` で active tab を直接制御
            </Text>
            <Text as="p" variant="body.small">
              - `side` を変えるだけで縦配置・横配置を切り替え
            </Text>
            <Text as="p" variant="body.small">
              - 旧 `Tab.Group` 系と併存しつつ、新規実装は Base UI ベースの API を利用可能
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-47-0">← Back to v2.47.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
