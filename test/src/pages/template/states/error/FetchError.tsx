import { ErrorCat1 } from "@legalforce/aegis-illustrations/react";
import {
  Link as AegisLink,
  Banner,
  Button,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  ContentHeaderTitle,
  EmptyState,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  ProgressCircle,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { AsyncState } from "../_hooks/useSimulatedAsync";

type DemoState = AsyncState<string[]>;

export default function FetchError() {
  const [fetchState, setFetchState] = useState<DemoState>({ status: "idle" });
  const [bannerVisible, setBannerVisible] = useState(true);

  const simulateFetch = (shouldFail: boolean) => {
    setFetchState({ status: "loading" });
    setTimeout(() => {
      if (shouldFail) {
        setFetchState({ status: "error", error: "サーバーとの通信に失敗しました" });
      } else {
        setFetchState({ status: "success", data: ["案件A", "案件B", "案件C"] });
      }
    }, 1500);
  };

  const renderFetchDemo = () => {
    switch (fetchState.status) {
      case "idle":
        return (
          <div style={{ display: "flex", gap: "var(--aegis-space-small)" }}>
            <Button variant="subtle" onClick={() => simulateFetch(true)}>
              取得失敗をシミュレート
            </Button>
            <Button variant="subtle" onClick={() => simulateFetch(false)}>
              取得成功をシミュレート
            </Button>
          </div>
        );
      case "loading":
        return (
          <div
            role="alert"
            aria-busy="true"
            aria-live="polite"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--aegis-space-xSmall)",
              padding: "var(--aegis-space-large)",
              justifyContent: "center",
            }}
          >
            <ProgressCircle size="small" />
            <Text variant="body.small">読み込み中...</Text>
          </div>
        );
      case "error":
        return (
          <div style={{ display: "grid", placeItems: "center", padding: "var(--aegis-space-large)" }}>
            <EmptyState
              size="medium"
              visual={<ErrorCat1 />}
              title="データの取得に失敗しました"
              action={
                <Button variant="subtle" onClick={() => simulateFetch(false)}>
                  再試行
                </Button>
              }
            >
              <Text variant="body.small">{fetchState.error}</Text>
            </EmptyState>
          </div>
        );
      case "success":
        return (
          <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
            {fetchState.data.map((item) => (
              <div
                key={item}
                style={{
                  padding: "var(--aegis-space-small)",
                  backgroundColor: "var(--aegis-color-surface-success-xSubtle)",
                  borderRadius: "var(--aegis-radius-medium)",
                }}
              >
                <Text variant="body.small">{item}</Text>
              </div>
            ))}
            <Button variant="plain" size="small" onClick={() => setFetchState({ status: "idle" })}>
              リセット
            </Button>
          </div>
        );
    }
  };

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Fetch Error</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
            {/* API Fetch Error + Retry */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">API 取得失敗 + リトライ</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
                  <Text variant="body.small" color="subtle">
                    状態遷移: idle → loading → error → retry → success
                  </Text>
                  {renderFetchDemo()}
                </div>
              </CardBody>
            </Card>

            {/* Banner Error */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">Banner エラー</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
                  <Text variant="body.small" color="subtle">
                    ページ内の一部セクションで発生したエラーを Banner
                    で表示します。コンテンツは表示したまま、エラーのみ通知します。
                  </Text>
                  {bannerVisible && (
                    <Banner color="danger" size="small" onClose={() => setBannerVisible(false)}>
                      AI要約の取得に失敗しました。時間をおいて再度お試しください。
                    </Banner>
                  )}
                  {!bannerVisible && (
                    <Button variant="plain" size="small" onClick={() => setBannerVisible(true)}>
                      Banner を再表示
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Polling Error */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">ポーリング失敗</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
                  <Text variant="body.small" color="subtle">
                    ポーリング処理が失敗した場合のエラー表示パターンです。
                  </Text>
                  <div style={{ display: "grid", placeItems: "center", padding: "var(--aegis-space-medium)" }}>
                    <EmptyState
                      size="small"
                      title="処理結果の取得に失敗しました"
                      action={
                        <Button variant="subtle" size="small">
                          再試行
                        </Button>
                      }
                    >
                      <Text variant="body.small">サーバーとの通信がタイムアウトしました</Text>
                    </EmptyState>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div style={{ marginTop: "var(--aegis-space-xLarge)" }}>
            <AegisLink asChild>
              <Link to="/template/states/error">← Back to Error</Link>
            </AegisLink>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
