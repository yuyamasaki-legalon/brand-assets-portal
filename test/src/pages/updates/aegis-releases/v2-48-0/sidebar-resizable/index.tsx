import { LfDocumentList, LfFolder, LfHome, LfSetting, LfTextSearch } from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  ContentHeader,
  Header,
  HeaderItem,
  HeaderTitle,
  Icon,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  SegmentedControl,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarInset,
  SidebarNavigation,
  SidebarNavigationItem,
  SidebarNavigationLink,
  SidebarNavigationSeparator,
  SidebarProvider,
  SidebarTrigger,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const widthOptions = ["small", "medium", "large", "xLarge"] as const;
type Width = (typeof widthOptions)[number];

const navItems = [
  { icon: LfHome, label: "ホーム" },
  { icon: LfDocumentList, label: "ドキュメント" },
  { icon: LfTextSearch, label: "検索" },
  { icon: LfFolder, label: "フォルダ" },
  { icon: LfSetting, label: "設定" },
];

export const SidebarResizableDemo = () => {
  const [resizable, setResizable] = useState(true);
  const [widthIndex, setWidthIndex] = useState(1);
  const [activeNav, setActiveNav] = useState(0);

  const width: Width = widthOptions[widthIndex] ?? "medium";

  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        resizable={resizable}
        width={width}
        minWidth="small"
        maxWidth="xLarge"
        behavior="push"
        variant="subtle"
        collapsible="offcanvas"
      >
        <SidebarHeader>
          <ContentHeader trailing={<SidebarTrigger />}>
            <ContentHeader.Title as="h2">Navigation</ContentHeader.Title>
          </ContentHeader>
        </SidebarHeader>
        <SidebarBody>
          <SidebarNavigation>
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <SidebarNavigationItem key={item.label}>
                  <SidebarNavigationLink
                    leading={
                      <Icon>
                        <IconComponent />
                      </Icon>
                    }
                    aria-current={activeNav === index ? "page" : undefined}
                    onClick={() => setActiveNav(index)}
                  >
                    {item.label}
                  </SidebarNavigationLink>
                </SidebarNavigationItem>
              );
            })}
            <SidebarNavigationSeparator />
          </SidebarNavigation>
        </SidebarBody>
      </Sidebar>
      <SidebarInset>
        <Header>
          <HeaderItem>
            <SidebarTrigger />
          </HeaderItem>
          <HeaderItem>
            <HeaderTitle>Sidebar resizable</HeaderTitle>
          </HeaderItem>
        </Header>
        <PageLayout>
          <PageLayoutContent minWidth="medium">
            <PageLayoutBody>
              <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
                v2.48.0: Sidebar にリサイズ機能と幅制御オプションを追加しました。ユーザーがドラッグで幅を調整でき、width
                / minWidth / maxWidth で範囲を制限できます。resizeStorage でリサイズ状態の永続化も可能です。
              </Text>

              <div
                style={{
                  display: "flex",
                  gap: "var(--aegis-space-large)",
                  flexWrap: "wrap",
                  marginBottom: "var(--aegis-space-large)",
                  alignItems: "flex-end",
                }}
              >
                <div>
                  <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
                    resizable
                  </Text>
                  <SegmentedControl index={resizable ? 0 : 1} onChange={(i) => setResizable(i === 0)}>
                    <SegmentedControl.Button>ON</SegmentedControl.Button>
                    <SegmentedControl.Button>OFF</SegmentedControl.Button>
                  </SegmentedControl>
                </div>
                <div>
                  <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
                    width
                  </Text>
                  <SegmentedControl index={widthIndex} onChange={setWidthIndex}>
                    {widthOptions.map((w) => (
                      <SegmentedControl.Button key={w}>{w}</SegmentedControl.Button>
                    ))}
                  </SegmentedControl>
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
                  - `resizable` で Sidebar のドラッグリサイズを有効化
                </Text>
                <Text as="p" variant="body.small">
                  - `width` で初期幅を指定（small / medium / large / xLarge）
                </Text>
                <Text as="p" variant="body.small">
                  - `minWidth` / `maxWidth` でリサイズ範囲を制限（maxWidth は "none" も指定可能）
                </Text>
                <Text as="p" variant="body.small">
                  - `resizeStorage` でリサイズ後の幅を永続化可能
                </Text>
                <Text as="p" variant="body.small">
                  - 従来のコンテンツ幅に依存する暗黙的なサイズ指定は非推奨。`width` の明示指定を推奨
                </Text>
              </div>

              <AegisLink asChild>
                <Link to="/updates/aegis-releases/v2-48-0">← Back to v2.48.0</Link>
              </AegisLink>
            </PageLayoutBody>
          </PageLayoutContent>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  );
};
