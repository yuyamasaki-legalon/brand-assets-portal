var e=`import { LfDocumentList, LfFolder, LfHome, LfSetting, LfTextSearch } from "@legalforce/aegis-icons";
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
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarInset,
  SidebarNavigation,
  SidebarNavigationItem,
  SidebarNavigationLink,
  SidebarProvider,
  SidebarTrigger,
  Switch,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./index.module.css";

const navItems = [
  { icon: LfHome, label: "ホーム" },
  { icon: LfDocumentList, label: "ドキュメント" },
  { icon: LfTextSearch, label: "検索" },
  { icon: LfFolder, label: "フォルダ" },
  { icon: LfSetting, label: "設定" },
];

export const SidebarDataSlotDemo = () => {
  const [activeNav, setActiveNav] = useState(0);
  const [customStyle, setCustomStyle] = useState(true);

  return (
    <div className={customStyle ? styles.customStyled : undefined} style={{ display: "contents" }}>
      <SidebarProvider defaultOpen>
        <Sidebar variant="subtle" behavior="push" width="small">
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
            </SidebarNavigation>
          </SidebarBody>
        </Sidebar>
        <SidebarInset>
          <PageLayout>
            <PageLayoutContent>
              <Header>
                <HeaderItem>
                  <HeaderTitle>Sidebar data-slot Demo</HeaderTitle>
                </HeaderItem>
              </Header>
              <PageLayoutBody>
                <ContentHeader>
                  <ContentHeader.Title>Sidebar data-slot 属性</ContentHeader.Title>
                  <ContentHeader.Description>
                    v2.48.3: Sidebar / SidebarInset / PageLayout に data-slot が追加され、CSS
                    の属性セレクタで外側からスタイルを上書きしやすくなりました。
                  </ContentHeader.Description>
                </ContentHeader>

                <div className={styles.controlRow}>
                  <Switch checked={customStyle} color="information" onChange={(e) => setCustomStyle(e.target.checked)}>
                    カスタムスタイル（data-slot セレクタによる背景色変更）を {customStyle ? "ON" : "OFF"}
                  </Switch>
                </div>

                <div className={styles.section}>
                  <Text as="p" variant="title.xSmall" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                    追加された data-slot 属性
                  </Text>
                  <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
                    DevTools で要素を inspect すると、次の data-slot が確認できます。
                  </Text>
                  <ul className={styles.slotList}>
                    <li>
                      <code>[data-slot="sidebar-inline-start"]</code> — 左サイドバーのコンテナ
                    </li>
                    <li>
                      <code>[data-slot="sidebar-inline-end"]</code> — 右サイドバーのコンテナ
                    </li>
                    <li>
                      <code>[data-slot="inset"]</code> — SidebarInset 本体
                    </li>
                  </ul>
                </div>

                <div className={styles.section}>
                  <Text as="p" variant="title.xSmall" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                    使用例（CSS 側）
                  </Text>
                  <pre className={styles.code}>
                    {\`/* 内部実装に依存せず、slot で外側からスタイル拡張 */
.customStyled [data-slot="sidebar-inline-start"] {
  background: var(--aegis-color-background-information-subtle);
  outline: 2px dashed var(--aegis-color-border-information);
  outline-offset: -8px;
}
.customStyled [data-slot="inset"] {
  background: var(--aegis-color-background-success-subtle);
  outline: 2px dashed var(--aegis-color-border-success-subtlest);
  outline-offset: -8px;
}\`}
                  </pre>
                </div>

                <AegisLink asChild>
                  <Link to="/updates/aegis-releases/v2-48-3">← Back to v2.48.3</Link>
                </AegisLink>
              </PageLayoutBody>
            </PageLayoutContent>
          </PageLayout>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};
`;export{e as default};