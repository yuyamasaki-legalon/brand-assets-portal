import { LfChartBarHorizontal, LfChartBarVertical, LfChartPie, LfPenSparkles } from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  ContentHeader,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import type { ComponentType, SVGProps } from "react";
import { Link } from "react-router-dom";

const newIcons: { name: string; Icon: ComponentType<SVGProps<SVGSVGElement>>; description: string }[] = [
  { name: "LfChartBarHorizontal", Icon: LfChartBarHorizontal, description: "横棒グラフ" },
  { name: "LfChartBarVertical", Icon: LfChartBarVertical, description: "縦棒グラフ" },
  { name: "LfChartPie", Icon: LfChartPie, description: "円グラフ" },
  { name: "LfPenSparkles", Icon: LfPenSparkles, description: "AI 編集" },
];

const sizes = ["xSmall", "small", "medium", "large"] as const;

export const NewIcons = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>新規アイコン デモ</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            v2.38.0 で追加された新しいアイコンの一覧です。
          </Text>

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            各サイズでの表示
          </Text>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `200px repeat(${sizes.length}, auto)`,
              gap: "var(--aegis-space-medium)",
              alignItems: "center",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Text variant="label.small">アイコン名</Text>
            {sizes.map((size) => (
              <Text key={size} variant="label.small" style={{ textAlign: "center" }}>
                {size}
              </Text>
            ))}

            {newIcons.map(({ name, Icon: SvgIcon }) => (
              <>
                <Text key={`${name}-label`} variant="body.small">
                  {name}
                </Text>
                {sizes.map((size) => (
                  <div key={`${name}-${size}`} style={{ display: "flex", justifyContent: "center" }}>
                    <Icon size={size}>
                      <SvgIcon />
                    </Icon>
                  </div>
                ))}
              </>
            ))}
          </div>

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            IconButton での使用例
          </Text>
          <div
            style={{
              display: "flex",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            {newIcons.map(({ name, Icon: SvgIcon, description }) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "var(--aegis-space-xSmall)",
                }}
              >
                <IconButton aria-label={description} icon={SvgIcon} />
                <Text variant="body.xSmall">{description}</Text>
              </div>
            ))}
          </div>

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            コンテキスト内での使用例
          </Text>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-small)",
              padding: "var(--aegis-space-medium)",
              border: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
              borderRadius: "var(--aegis-radius-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
              <Icon size="medium">
                <LfChartPie />
              </Icon>
              <Text variant="body.medium">売上分析レポート</Text>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
              <Icon size="medium">
                <LfChartBarVertical />
              </Icon>
              <Text variant="body.medium">月次推移グラフ</Text>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
              <Icon size="medium">
                <LfChartBarHorizontal />
              </Icon>
              <Text variant="body.medium">カテゴリ別比較</Text>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
              <Icon size="medium">
                <LfPenSparkles />
              </Icon>
              <Text variant="body.medium">AI で文書を編集</Text>
            </div>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-38-0">← Back to v2.38.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
