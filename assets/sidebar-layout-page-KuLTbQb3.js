var e=`import { LfArrowLeft, LfFileLines, LfHome, LfSetting } from "@legalforce/aegis-icons";
import {
  Button,
  ContentHeader,
  Icon,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
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
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";

type NavId = "home" | "case" | "settings";

const navItems: { id: NavId; label: string; icon: typeof LfHome }[] = [
  { id: "home", label: "ホーム", icon: LfHome },
  { id: "case", label: "案件一覧", icon: LfFileLines },
  { id: "settings", label: "設定", icon: LfSetting },
];

export const SidebarLayoutRecipePage = () => {
  const [activeId, setActiveId] = useState<NavId>("home");

  return (
    <SidebarProvider defaultOpen>
      <Sidebar width="small" behavior="push">
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarBody>
          <SidebarNavigation>
            {navItems.map((item, index) => (
              <Fragment key={item.id}>
                <SidebarNavigationItem>
                  <SidebarNavigationLink
                    asChild
                    aria-current={activeId === item.id ? "page" : undefined}
                    leading={
                      <Icon>
                        <item.icon />
                      </Icon>
                    }
                  >
                    <button type="button" onClick={() => setActiveId(item.id)}>
                      {item.label}
                    </button>
                  </SidebarNavigationLink>
                </SidebarNavigationItem>
                {index === navItems.length - 2 && <SidebarNavigationSeparator />}
              </Fragment>
            ))}
          </SidebarNavigation>
        </SidebarBody>
      </Sidebar>
      <SidebarInset>
        <PageLayout>
          <PageLayoutContent>
            <PageLayoutHeader>
              <ContentHeader
                trailing={
                  <Button
                    as={Link}
                    to="/patterns?tab=recipes&id=sidebar-layout"
                    variant="plain"
                    leading={<LfArrowLeft />}
                  >
                    Patterns に戻る
                  </Button>
                }
              >
                <ContentHeader.Title>サイドバー付きレイアウト</ContentHeader.Title>
                <ContentHeader.Description>
                  SidebarProvider + Sidebar + SidebarInset を使った実物のレシピデモです。
                </ContentHeader.Description>
              </ContentHeader>
            </PageLayoutHeader>
            <PageLayoutBody>
              <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
                <Text as="p" variant="body.medium">
                  現在のページ: <strong>{navItems.find((item) => item.id === activeId)?.label}</strong>
                </Text>
                <Text as="p" variant="body.small" color="subtle">
                  サイドバー左上のトリガーで開閉できます。サイドバー内の項目をクリックするとこの中身が切り替わります。
                </Text>
                <div
                  style={{
                    padding: "var(--aegis-space-large)",
                    borderRadius: "var(--aegis-radius-large)",
                    background: "var(--aegis-color-background-subtle)",
                    border: "1px solid var(--aegis-color-border-default)",
                  }}
                >
                  <Text as="h2" variant="title.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                    {navItems.find((item) => item.id === activeId)?.label}
                  </Text>
                  <Text as="p" variant="body.medium">
                    ここが SidebarInset の中身です。\`PageLayout\`
                    で本来のページ構造を組み、その内側に通常の画面と同じように ContentHeader や本文を配置できます。
                  </Text>
                </div>
              </div>
            </PageLayoutBody>
          </PageLayoutContent>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  );
};
`;export{e as default};