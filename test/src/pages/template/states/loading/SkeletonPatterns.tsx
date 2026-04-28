import {
  Link as AegisLink,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  ContentHeaderTitle,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Skeleton,
  Switch,
  Tab,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ListSkeleton = () => (
  <div role="alert" aria-busy="true" aria-live="polite" style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
    <div style={{ display: "flex", gap: "var(--aegis-space-small)" }}>
      <Skeleton width={120} height={32} radius="medium" />
      <Skeleton width={120} height={32} radius="medium" />
    </div>
    <Skeleton.Table numberOfRows={8} />
  </div>
);

const DetailSkeleton = () => (
  <div role="alert" aria-busy="true" aria-live="polite" style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
    <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
      <Skeleton.Text />
      <Skeleton.Text width="medium" />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--aegis-space-medium)" }}>
      {["field-1", "field-2", "field-3", "field-4", "field-5", "field-6"].map((id) => (
        <div key={id} style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
          <Skeleton width="40%" height={14} />
          <Skeleton width="80%" height={20} />
        </div>
      ))}
    </div>
  </div>
);

const FormSkeleton = () => (
  <div
    role="alert"
    aria-busy="true"
    aria-live="polite"
    style={{ display: "grid", gap: "var(--aegis-space-large)", maxWidth: "var(--aegis-layout-width-small)" }}
  >
    {["input-1", "input-2", "input-3", "input-4"].map((id) => (
      <div key={id} style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
        <Skeleton width={100} height={14} />
        <Skeleton width="100%" height={36} radius="medium" />
      </div>
    ))}
    <div style={{ display: "flex", gap: "var(--aegis-space-small)", justifyContent: "flex-end" }}>
      <Skeleton width={80} height={36} radius="medium" />
      <Skeleton width={80} height={36} radius="medium" />
    </div>
  </div>
);

const HeaderSkeleton = () => (
  <div role="alert" aria-busy="true" aria-live="polite" style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--aegis-space-small)",
        padding: "var(--aegis-space-medium)",
        borderBottom: "1px solid var(--aegis-color-border-default)",
      }}
    >
      <Skeleton width={160} height={24} />
    </div>
    <div style={{ padding: "var(--aegis-space-medium)", display: "grid", gap: "var(--aegis-space-medium)" }}>
      <Skeleton.Text />
      <Skeleton.Text width="large" />
      <Skeleton width="100%" height={200} radius="medium" />
    </div>
  </div>
);

const ListLoaded = () => (
  <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
    <Text variant="body.medium">テーブルデータが読み込まれました</Text>
    <div
      style={{
        padding: "var(--aegis-space-large)",
        backgroundColor: "var(--aegis-color-surface-success-xSubtle)",
        borderRadius: "var(--aegis-radius-medium)",
        textAlign: "center",
      }}
    >
      <Text variant="body.medium" color="success">
        8件のデータを表示中
      </Text>
    </div>
  </div>
);

const tabs = [
  { label: "リスト", value: "list" },
  { label: "詳細", value: "detail" },
  { label: "フォーム", value: "form" },
  { label: "ヘッダー", value: "header" },
];

export default function SkeletonPatterns() {
  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const renderContent = () => {
    if (!isLoading) return <ListLoaded />;
    switch (tabs[tabIndex]?.value) {
      case "list":
        return <ListSkeleton />;
      case "detail":
        return <DetailSkeleton />;
      case "form":
        return <FormSkeleton />;
      case "header":
        return <HeaderSkeleton />;
      default:
        return null;
    }
  };

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Skeleton Patterns</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
            <Card>
              <CardHeader>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <Text variant="title.xSmall">Skeleton パターン</Text>
                  <Switch checked={isLoading} onChange={() => setIsLoading((prev) => !prev)}>
                    Loading
                  </Switch>
                </div>
              </CardHeader>
              <CardBody>
                <Tab.Group index={tabIndex} onChange={setTabIndex}>
                  <Tab.List>
                    {tabs.map((tab) => (
                      <Tab key={tab.value}>{tab.label}</Tab>
                    ))}
                  </Tab.List>
                  <Tab.Panels>
                    {tabs.map((tab) => (
                      <Tab.Panel key={tab.value}>
                        <div style={{ paddingBlock: "var(--aegis-space-medium)" }}>{renderContent()}</div>
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Text variant="title.xSmall">使い方</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
                  <Text variant="body.small">
                    <Text as="span" variant="body.small.bold">
                      Skeleton.Table
                    </Text>
                    : テーブル全体のローディング表示に使用
                  </Text>
                  <Text variant="body.small">
                    <Text as="span" variant="body.small.bold">
                      Skeleton.Text
                    </Text>
                    : テキスト行のローディング表示に使用
                  </Text>
                  <Text variant="body.small">
                    <Text as="span" variant="body.small.bold">
                      Skeleton
                    </Text>
                    : 任意のサイズの矩形ローディング表示に使用
                  </Text>
                  <Text variant="body.small" color="danger">
                    必ず role=&quot;alert&quot;, aria-busy=&quot;true&quot;, aria-live=&quot;polite&quot; を付与すること
                  </Text>
                </div>
              </CardBody>
            </Card>
          </div>

          <div style={{ marginTop: "var(--aegis-space-xLarge)" }}>
            <AegisLink asChild>
              <Link to="/template/states/loading">← Back to Loading</Link>
            </AegisLink>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
