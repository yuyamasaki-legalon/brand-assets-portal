import {
  ContentHeader,
  ContentHeaderTitle,
  Link,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  StatusLabel,
  Switch,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { LocSidebarLayout } from "../_shared";
import { ManagementConsoleNavList } from "./_shared/ManagementConsoleNavList";

/** 多要素認証設定ページ。 */
export const ManagementConsoleMfa = () => {
  const [mfaEnabled, setMfaEnabled] = useState(false);

  return (
    <LocSidebarLayout activeId="others">
      <PageLayout>
        <ManagementConsoleNavList activePage="mfa" />

        <PageLayoutContent>
          <PageLayoutHeader>
            <ContentHeader>
              <ContentHeaderTitle>多要素認証</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-large)",
              }}
            >
              {/* 説明 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-xSmall)",
                }}
              >
                <Text variant="caption.medium">多要素認証を全ユーザーに設定することができます。</Text>
                <div style={{ width: "fit-content" }}>
                  <Link href="#" onClick={(e) => e.preventDefault()}>
                    <Text variant="body.small">多要素認証について</Text>
                  </Link>
                </div>
              </div>

              {/* 現在の状態 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-xSmall)",
                }}
              >
                <Text variant="body.medium">現在の状態</Text>
                <div
                  style={{
                    display: "flex",
                    gap: "var(--aegis-space-small)",
                    alignItems: "center",
                  }}
                >
                  <StatusLabel color={mfaEnabled ? "teal" : "gray"} variant="fill">
                    {mfaEnabled ? "設定中" : "未設定"}
                  </StatusLabel>
                  <Switch checked={mfaEnabled} color="information" onChange={(e) => setMfaEnabled(e.target.checked)}>
                    多要素認証を有効にする
                  </Switch>
                </div>
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};
