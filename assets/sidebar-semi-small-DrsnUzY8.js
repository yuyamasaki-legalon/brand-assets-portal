var e=`import { LfBook, LfDocumentList, LfFolder, LfHome, LfSetting } from "@legalforce/aegis-icons";
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
  SidebarProvider,
  SidebarTrigger,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const widthOptions = ["small", "semiSmall", "medium"] as const;
type Width = (typeof widthOptions)[number];

const navItems = [
  { icon: LfHome, label: "ホーム" },
  { icon: LfDocumentList, label: "案件一覧" },
  { icon: LfFolder, label: "フォルダ" },
  { icon: LfBook, label: "ナレッジ" },
  { icon: LfSetting, label: "設定" },
];

const comparisonNotes: Record<Width, string> = {
  small: "small は最もコンパクトで、アイコン+短いラベル中心のナビゲーション向きです。",
  semiSmall: "semiSmall は small より 1 段広く、2 ペイン構成でもラベルを保ちながら本文幅を圧迫しにくい中間値です。",
  medium: "medium は従来の標準幅です。説明文や補助情報を入れる余裕がありますが、本文領域はその分狭くなります。",
};

export const SidebarSemiSmallDemo = () => {
  const [widthIndex, setWidthIndex] = useState(1);
  const [activeNav, setActiveNav] = useState(1);

  const width: Width = widthOptions[widthIndex] ?? "semiSmall";
  const actualSidebarWidth = width === "semiSmall" ? "medium" : width;

  return (
    <SidebarProvider defaultOpen>
      <Sidebar width={actualSidebarWidth} behavior="push" variant="subtle" collapsible="offcanvas">
        <SidebarHeader>
          <ContentHeader trailing={<SidebarTrigger />}>
            <ContentHeader.Title as="h2">Workspace</ContentHeader.Title>
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
          </SidebarNavigation>
        </SidebarBody>
      </Sidebar>
      <SidebarInset>
        <Header>
          <HeaderItem>
            <SidebarTrigger />
          </HeaderItem>
          <HeaderItem>
            <HeaderTitle>Sidebar width=&quot;semiSmall&quot;</HeaderTitle>
          </HeaderItem>
        </Header>
        <PageLayout>
          <PageLayoutContent minWidth="medium">
            <PageLayoutBody>
              <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
                v2.49.0 では \`Sidebar\` の width に \`semiSmall\` が追加されました。small と medium の中間幅で、 2 ペイン
                UI の一覧・詳細や補助ナビゲーションに使いやすいサイズです。
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
                    width
                  </Text>
                  <SegmentedControl index={widthIndex} onChange={setWidthIndex}>
                    {widthOptions.map((option) => (
                      <SegmentedControl.Button key={option}>{option}</SegmentedControl.Button>
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
                  幅の見どころ
                </Text>
                <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                  {comparisonNotes[width]}
                </Text>
                <Text as="p" variant="body.small">
                  現在のインストール済み Aegis では \`semiSmall\` は未搭載のため、この demo では \`medium\` 幅を代替表示に
                  使っています。
                </Text>
              </div>

              <AegisLink asChild>
                <Link to="/updates/aegis-releases/v2-49-0">← Back to v2.49.0</Link>
              </AegisLink>
            </PageLayoutBody>
          </PageLayoutContent>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  );
};
`;export{e as default};