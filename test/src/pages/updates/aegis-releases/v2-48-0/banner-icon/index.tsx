import { LfBrowserCode, LfContrast, LfLayoutTop } from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  Banner,
  ContentHeader,
  Icon,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  SegmentedControl,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const colors = ["information", "success", "warning", "danger"] as const;
type Color = (typeof colors)[number];

const sizes = ["xSmall", "small", "medium", "large"] as const;
type Size = (typeof sizes)[number];

export const BannerIconDemo = () => {
  const [colorIndex, setColorIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(2);

  const color: Color = colors[colorIndex] ?? "information";
  const size: Size = sizes[sizeIndex] ?? "medium";

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Banner icon / xSmall</ContentHeader.Title>
            <ContentHeader.Description>
              v2.48.0: Banner にカスタムアイコンと xSmall サイズを追加
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            Banner の先頭アイコンを icon prop で任意のアイコンに差し替えられるようになりました。また xSmall
            サイズが追加され、よりコンパクトな通知表示が可能です。
          </Text>

          <div
            style={{
              display: "flex",
              gap: "var(--aegis-space-large)",
              flexWrap: "wrap",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <div>
              <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
                color
              </Text>
              <SegmentedControl index={colorIndex} onChange={setColorIndex}>
                {colors.map((c) => (
                  <SegmentedControl.Button key={c}>{c}</SegmentedControl.Button>
                ))}
              </SegmentedControl>
            </div>
            <div>
              <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
                size
              </Text>
              <SegmentedControl index={sizeIndex} onChange={setSizeIndex}>
                {sizes.map((s) => (
                  <SegmentedControl.Button key={s}>{s}</SegmentedControl.Button>
                ))}
              </SegmentedControl>
            </div>
          </div>

          <Text as="p" variant="title.xSmall" style={{ marginBottom: "var(--aegis-space-small)" }}>
            デフォルトアイコン（従来動作）
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-large)" }}>
            <Banner color={color} size={size} closeButton={false}>
              デフォルトアイコンが color に応じて自動表示されます。
            </Banner>
          </div>

          <Text as="p" variant="title.xSmall" style={{ marginBottom: "var(--aegis-space-small)" }}>
            カスタムアイコン（icon prop）
          </Text>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Banner
              color={color}
              size={size}
              closeButton={false}
              icon={
                <Icon>
                  <LfLayoutTop />
                </Icon>
              }
            >
              icon prop でアイコンを LfLayoutTop に差し替えています。
            </Banner>
            <Banner
              color={color}
              size={size}
              closeButton={false}
              icon={
                <Icon>
                  <LfBrowserCode />
                </Icon>
              }
            >
              icon prop でアイコンを LfBrowserCode に差し替えています。
            </Banner>
            <Banner
              color={color}
              size={size}
              closeButton={false}
              icon={
                <Icon>
                  <LfContrast />
                </Icon>
              }
            >
              icon prop でアイコンを LfContrast に差し替えています。
            </Banner>
          </div>

          <Text as="p" variant="title.xSmall" style={{ marginBottom: "var(--aegis-space-small)" }}>
            xSmall サイズ比較
          </Text>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <div>
              <Text
                as="p"
                variant="label.small"
                style={{ marginBottom: "var(--aegis-space-xxSmall)", color: "var(--aegis-color-text-subtle)" }}
              >
                xSmall
              </Text>
              <Banner color="information" size="xSmall" closeButton={false}>
                最もコンパクトな Banner です。
              </Banner>
            </div>
            <div>
              <Text
                as="p"
                variant="label.small"
                style={{ marginBottom: "var(--aegis-space-xxSmall)", color: "var(--aegis-color-text-subtle)" }}
              >
                small
              </Text>
              <Banner color="information" size="small" closeButton={false}>
                small サイズの Banner です。
              </Banner>
            </div>
            <div>
              <Text
                as="p"
                variant="label.small"
                style={{ marginBottom: "var(--aegis-space-xxSmall)", color: "var(--aegis-color-text-subtle)" }}
              >
                medium
              </Text>
              <Banner color="information" size="medium" closeButton={false}>
                medium サイズの Banner です。
              </Banner>
            </div>
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
              - `icon` prop で先頭アイコンを任意に変更可能（未指定時は color に応じたデフォルトアイコン）
            </Text>
            <Text as="p" variant="body.small">
              - `size="xSmall"` でよりコンパクトな Banner を表示可能
            </Text>
            <Text as="p" variant="body.small">
              - icon と size は既存の color / inline / title / action / closeButton と組み合わせ可能
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-48-0">← Back to v2.48.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
