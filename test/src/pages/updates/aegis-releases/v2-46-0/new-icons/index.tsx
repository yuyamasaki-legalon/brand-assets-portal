import {
  LfLayout,
  LfLayoutAlignCenter,
  LfLayoutAlignLeft,
  LfLayoutAlignRight,
  LfPaintRoller,
  LfPalette,
  LfRulerMeasure,
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
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

const newIcons = [
  { name: "LfLayout", icon: <LfLayout />, description: "レイアウト" },
  { name: "LfLayoutAlignCenter", icon: <LfLayoutAlignCenter />, description: "レイアウト中央揃え" },
  { name: "LfLayoutAlignLeft", icon: <LfLayoutAlignLeft />, description: "レイアウト左揃え" },
  { name: "LfLayoutAlignRight", icon: <LfLayoutAlignRight />, description: "レイアウト右揃え" },
  { name: "LfPaintRoller", icon: <LfPaintRoller />, description: "ペイントローラー" },
  { name: "LfPalette", icon: <LfPalette />, description: "パレット" },
  { name: "LfRulerMeasure", icon: <LfRulerMeasure />, description: "定規・計測" },
];

export const NewIconsV2460 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>新アイコン追加</ContentHeaderTitle>
            <ContentHeaderDescription>aegis-icons v2.12.0 で追加された新しいアイコン</ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            レイアウト系アイコンとデザインツール系アイコンが追加されました。
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

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-46-0">← Back to v2.46.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
