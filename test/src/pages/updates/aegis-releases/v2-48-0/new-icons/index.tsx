import {
  LfBrowserCode,
  LfContrast,
  LfLayoutFillBottom,
  LfLayoutFillBottomAlt,
  LfLayoutFillLeft,
  LfLayoutFillLeftAlt,
  LfLayoutFillRight,
  LfLayoutFillRightAlt,
  LfLayoutFillTop,
  LfLayoutFillTopAlt,
  LfLayoutLeft,
  LfLayoutRight,
  LfLayoutTop,
} from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  Icon,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Tag,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

const newIcons = [
  { name: "LfLayoutTop", icon: <LfLayoutTop />, description: "レイアウト上部" },
  { name: "LfLayoutLeft", icon: <LfLayoutLeft />, description: "レイアウト左" },
  { name: "LfLayoutRight", icon: <LfLayoutRight />, description: "レイアウト右" },
  { name: "LfLayoutFillTop", icon: <LfLayoutFillTop />, description: "レイアウト上部塗り" },
  { name: "LfLayoutFillTopAlt", icon: <LfLayoutFillTopAlt />, description: "レイアウト上部塗り (Alt)" },
  { name: "LfLayoutFillBottom", icon: <LfLayoutFillBottom />, description: "レイアウト下部塗り" },
  { name: "LfLayoutFillBottomAlt", icon: <LfLayoutFillBottomAlt />, description: "レイアウト下部塗り (Alt)" },
  { name: "LfLayoutFillLeft", icon: <LfLayoutFillLeft />, description: "レイアウト左塗り" },
  { name: "LfLayoutFillLeftAlt", icon: <LfLayoutFillLeftAlt />, description: "レイアウト左塗り (Alt)" },
  { name: "LfLayoutFillRight", icon: <LfLayoutFillRight />, description: "レイアウト右塗り" },
  { name: "LfLayoutFillRightAlt", icon: <LfLayoutFillRightAlt />, description: "レイアウト右塗り (Alt)" },
  { name: "LfBrowserCode", icon: <LfBrowserCode />, description: "ブラウザ / コード" },
  { name: "LfContrast", icon: <LfContrast />, description: "コントラスト" },
];

const deprecatedIcons = [
  { old: "LfLayoutVertical", replacement: "LfLayoutTop" },
  { old: "LfLayoutHorizonRight", replacement: "LfLayoutRight" },
  { old: "LfLayoutHorizonLeft", replacement: "LfLayoutLeft" },
];

export const NewIconsV2480 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>新アイコン追加</ContentHeaderTitle>
            <ContentHeaderDescription>aegis-icons v2.13.0 で追加された新しいアイコン</ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            レイアウト方向を示す Fill バリアントアイコンと、ブラウザ・コントラスト用のアイコンが追加されました。
          </Text>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            {newIcons.map((item) => (
              <div
                key={item.name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "var(--aegis-space-xSmall)",
                  padding: "var(--aegis-space-large) var(--aegis-space-medium)",
                  border: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
                  borderRadius: "var(--aegis-radius-medium)",
                }}
              >
                <Icon size="xLarge">{item.icon}</Icon>
                <Text variant="label.small">{item.name}</Text>
                <Text variant="body.xSmall" style={{ color: "var(--aegis-color-text-subtle)" }}>
                  {item.description}
                </Text>
              </div>
            ))}
          </div>

          <Text as="p" variant="title.xSmall" style={{ marginBottom: "var(--aegis-space-small)" }}>
            非推奨アイコン
          </Text>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-small)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            {deprecatedIcons.map((item) => (
              <div key={item.old} style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
                <Tag size="small" color="orange" variant="outline">
                  deprecated
                </Tag>
                <Text variant="body.small">
                  {item.old} → {item.replacement} に移行してください
                </Text>
              </div>
            ))}
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-48-0">← Back to v2.48.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
