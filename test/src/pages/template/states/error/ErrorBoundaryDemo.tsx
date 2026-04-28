import { ErrorCat1 } from "@legalforce/aegis-illustrations/react";
import {
  Link as AegisLink,
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
  Skeleton,
  Text,
} from "@legalforce/aegis-react";
import type { ReactNode } from "react";
import { Component, Suspense, useState } from "react";
import { Link } from "react-router-dom";

// --- ErrorBoundary with render fallback ---
interface ErrorBoundaryProps {
  children: ReactNode;
  renderFallback: (props: { error: Error; reset: () => void }) => ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class DemoErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return this.props.renderFallback({ error: this.state.error, reset: this.reset });
    }
    return this.props.children;
  }
}

// --- Component that throws ---
const BuggyComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("コンポーネントでエラーが発生しました");
  }
  return (
    <div
      style={{
        padding: "var(--aegis-space-large)",
        backgroundColor: "var(--aegis-color-surface-success-xSubtle)",
        borderRadius: "var(--aegis-radius-medium)",
        textAlign: "center",
      }}
    >
      <Text variant="body.medium" color="success">
        正常に表示されています
      </Text>
    </div>
  );
};

// --- Suspense loading fallback ---
const SuspenseLoading = () => (
  <div role="alert" aria-busy="true" aria-live="polite" style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
    <Skeleton.Text />
    <Skeleton.Text width="large" />
    <Skeleton width="100%" height={80} radius="medium" />
  </div>
);

// --- Error fallback using EmptyState ---
const ErrorFallback = ({ error, reset }: { error: Error; reset: () => void }) => (
  <div style={{ display: "grid", placeItems: "center", padding: "var(--aegis-space-large)" }}>
    <EmptyState
      size="medium"
      visual={<ErrorCat1 />}
      title="エラーが発生しました"
      action={
        <Button variant="subtle" onClick={reset}>
          再試行
        </Button>
      }
    >
      <Text variant="body.small">{error.message}</Text>
    </EmptyState>
  </div>
);

export default function ErrorBoundaryDemo() {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [key, setKey] = useState(0);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>ErrorBoundary Demo</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
            {/* Structure explanation */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">ErrorBoundary + Suspense 構成</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
                  <Text variant="body.small" color="subtle">
                    ErrorBoundary は Suspense の外側に配置します。これにより、Suspense 内のコンポーネントが throw
                    したエラーも ErrorBoundary でキャッチできます。
                  </Text>
                  <div
                    style={{
                      padding: "var(--aegis-space-medium)",
                      backgroundColor: "var(--aegis-color-surface-neutral-xSubtle)",
                      borderRadius: "var(--aegis-radius-medium)",
                      fontFamily: "monospace",
                      fontSize: 13,
                      lineHeight: 1.6,
                    }}
                  >
                    <div>{"<ErrorBoundary renderFallback={...}>"}</div>
                    <div style={{ paddingLeft: "var(--aegis-space-medium)" }}>
                      {"<Suspense fallback={<Loading />}>"}
                    </div>
                    <div style={{ paddingLeft: "var(--aegis-space-xLarge)" }}>{"<AsyncComponent />"}</div>
                    <div style={{ paddingLeft: "var(--aegis-space-medium)" }}>{"</Suspense>"}</div>
                    <div>{"</ErrorBoundary>"}</div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Live demo */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">デモ</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
                  <div style={{ display: "flex", gap: "var(--aegis-space-small)" }}>
                    <Button
                      variant="subtle"
                      color="danger"
                      onClick={() => {
                        setShouldThrow(true);
                        setKey((prev) => prev + 1);
                      }}
                    >
                      エラーを発生させる
                    </Button>
                    <Button
                      variant="plain"
                      onClick={() => {
                        setShouldThrow(false);
                        setKey((prev) => prev + 1);
                      }}
                    >
                      正常状態に戻す
                    </Button>
                  </div>

                  <div
                    style={{
                      border: "1px solid var(--aegis-color-border-default)",
                      borderRadius: "var(--aegis-radius-medium)",
                      padding: "var(--aegis-space-medium)",
                    }}
                  >
                    <DemoErrorBoundary
                      key={key}
                      renderFallback={({ error, reset }) => <ErrorFallback error={error} reset={reset} />}
                    >
                      <Suspense fallback={<SuspenseLoading />}>
                        <BuggyComponent shouldThrow={shouldThrow} />
                      </Suspense>
                    </DemoErrorBoundary>
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
