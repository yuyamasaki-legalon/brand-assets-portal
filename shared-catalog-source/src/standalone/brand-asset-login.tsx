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
          <EmptyState title="会社Googleアカウントでログインしてください">
            <Text>会社アカウントで認証すると、管理権限に関係なく同じ公開アセットを検索できます。</Text>
            <Button variant="solid" onClick={() => window.location.assign("/api/auth/google/start")}>
              会社のGoogleアカウントでログイン
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
