import {
  Button,
  ContentHeader,
  ContentHeaderTitle,
  EmptyState,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  Provider,
  Text,
} from "@legalforce/aegis-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { themes } from "../themes";

// Deliberately independent of the portal and every asset/Drive metadata module.
function Login() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutBody>
          <ContentHeader>
            <ContentHeaderTitle>Brand Asset Portal</ContentHeaderTitle>
          </ContentHeader>
          <EmptyState title="アセット管理にはログインが必要です">
            <Text>検索・閲覧はログイン不要です。アセットの登録・変更は許可された会社アカウントのみ利用できます。</Text>
            <Button variant="solid" onClick={() => window.location.assign("/api/auth/google/start")}>
              会社のGoogleアカウントでログイン
            </Button>
            <Button variant="subtle" onClick={() => window.location.assign("/brand-asset-portal/index.html")}>
              ログインせずに閲覧する
            </Button>
          </EmptyState>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");
createRoot(root).render(
  <StrictMode>
    <Provider theme={themes.neutral} scale="full">
      <Login />
    </Provider>
  </StrictMode>,
);
