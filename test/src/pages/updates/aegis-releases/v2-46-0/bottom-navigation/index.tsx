import { LfBell, LfFolder, LfHome, LfTextSearch, LfUser } from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  Badge,
  BottomNavigation,
  BottomNavigationItem,
  BottomNavigationLink,
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
import { useState } from "react";
import { Link } from "react-router-dom";

const navItems = [
  {
    label: "ホーム",
    icon: (
      <Icon>
        <LfHome />
      </Icon>
    ),
    badge: false,
  },
  {
    label: "検索",
    icon: (
      <Icon>
        <LfTextSearch />
      </Icon>
    ),
    badge: false,
  },
  {
    label: "案件",
    icon: (
      <Icon>
        <LfFolder />
      </Icon>
    ),
    badge: false,
  },
  {
    label: "通知",
    icon: (
      <Icon>
        <LfBell />
      </Icon>
    ),
    badge: true,
  },
  {
    label: "アカウント",
    icon: (
      <Icon>
        <LfUser />
      </Icon>
    ),
    badge: false,
  },
];

export const BottomNavigationDemo = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>BottomNavigation</ContentHeaderTitle>
            <ContentHeaderDescription>
              v2.46.0: モバイルアプリ風のボトムナビゲーションコンポーネントを新規追加
            </ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            BottomNavigation
            は、モバイルアプリでよく見られる画面下部の固定ナビゲーションバーを提供するコンポーネントです。
            BottomNavigationItem と BottomNavigationLink を組み合わせて使用します。
          </Text>

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            基本的な使い方
          </Text>
          <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            BottomNavigationLink の icon prop にアイコンを渡し、children にラベルテキストを指定します。 asChild
            を使えば、react-router の Link などと組み合わせ可能です。
          </Text>

          <div
            style={{
              position: "relative",
              border: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
              borderRadius: "var(--aegis-radius-large)",
              overflow: "hidden",
              maxWidth: "var(--aegis-layout-width-x3Small)",
              height: "480px",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "var(--aegis-space-medium)",
                  backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                }}
              >
                <Text variant="title.small">{navItems[activeIndex]?.label}</Text>
              </div>

              <BottomNavigation>
                {navItems.map((item, index) => (
                  <BottomNavigationItem key={item.label}>
                    <BottomNavigationLink
                      icon={item.badge ? <Badge color="danger">{item.icon}</Badge> : item.icon}
                      href="#"
                      aria-current={index === activeIndex ? "page" : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveIndex(index);
                      }}
                    >
                      {item.label}
                    </BottomNavigationLink>
                  </BottomNavigationItem>
                ))}
              </BottomNavigation>
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
              コンポーネント構成
            </Text>
            <Text as="p" variant="body.small">
              - BottomNavigation: nav 要素のコンテナ。内部で高さを aegisStore に登録し、他コンポーネントとの連携に使用
            </Text>
            <Text as="p" variant="body.small">
              - BottomNavigationItem: li 要素のラッパー
            </Text>
            <Text as="p" variant="body.small">
              - BottomNavigationLink: a 要素ベースのリンク。icon prop でアイコンを指定。asChild
              で任意の要素に差し替え可能
            </Text>
            <Text as="p" variant="body.small" style={{ marginTop: "var(--aegis-space-xSmall)" }}>
              - Badge と組み合わせることで通知ドットを表示可能（上記「通知」タブ参照）
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-46-0">← Back to v2.46.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
