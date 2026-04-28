import {
  Link as AegisLink,
  Button,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  ContentHeaderTitle,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  ProgressBar,
  ProgressCircle,
  ProgressOverlay,
  Text,
} from "@legalforce/aegis-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function ProgressIndicators() {
  const [showFullOverlay, setShowFullOverlay] = useState(false);
  const [showScopedOverlay, setShowScopedOverlay] = useState(false);
  const scopedRef = useRef<HTMLDivElement>(null);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Progress Indicators</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
            {/* ProgressBar */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">ProgressBar（indeterminate）</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
                  <Text variant="body.small" color="subtle">
                    コンテンツの再読み込みやバックグラウンド処理の進捗表示に使用します。value を省略すると indeterminate
                    になります。
                  </Text>
                  <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
                    <Text variant="label.small">size=&quot;small&quot;</Text>
                    <ProgressBar size="small" />
                  </div>
                  <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
                    <Text variant="label.small">size=&quot;medium&quot;（default）</Text>
                    <ProgressBar />
                  </div>
                  <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
                    <Text variant="label.small">value 指定（determinate）</Text>
                    <ProgressBar value={65}>
                      <ProgressBar.Label>65%</ProgressBar.Label>
                    </ProgressBar>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* ProgressCircle */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">ProgressCircle</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
                  <Text variant="body.small" color="subtle">
                    インラインのローディング表示に使用します。Combobox
                    のポップオーバー内や、小さなセクションの読み込みに適しています。
                  </Text>
                  <div style={{ display: "flex", gap: "var(--aegis-space-large)", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                      <ProgressCircle size="xSmall" />
                      <Text variant="label.small">xSmall</Text>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                      <ProgressCircle size="small" />
                      <Text variant="label.small">small</Text>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                      <ProgressCircle size="medium" />
                      <Text variant="label.small">medium</Text>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                      <ProgressCircle size="large" />
                      <Text variant="label.small">large</Text>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                      <ProgressCircle size="xLarge" />
                      <Text variant="label.small">xLarge</Text>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--aegis-space-xSmall)",
                      padding: "var(--aegis-space-medium)",
                      backgroundColor: "var(--aegis-color-surface-neutral-xSubtle)",
                      borderRadius: "var(--aegis-radius-medium)",
                    }}
                  >
                    <ProgressCircle size="small" />
                    <Text variant="body.small">読み込み中...</Text>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* ProgressOverlay */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">ProgressOverlay</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
                  <Text variant="body.small" color="subtle">
                    ブロッキング操作（保存処理、ファイルアップロードなど）で全体を覆うオーバーレイを表示します。root
                    を指定するとスコープを限定できます。
                  </Text>
                  <div style={{ display: "flex", gap: "var(--aegis-space-small)" }}>
                    <Button
                      variant="subtle"
                      onClick={() => {
                        setShowFullOverlay(true);
                        setTimeout(() => setShowFullOverlay(false), 2000);
                      }}
                    >
                      全画面 Overlay（2秒）
                    </Button>
                    <Button
                      variant="subtle"
                      onClick={() => {
                        setShowScopedOverlay(true);
                        setTimeout(() => setShowScopedOverlay(false), 2000);
                      }}
                    >
                      スコープ付き Overlay（2秒）
                    </Button>
                  </div>
                  <div
                    ref={scopedRef}
                    style={{
                      position: "relative",
                      padding: "var(--aegis-space-large)",
                      border: "1px solid var(--aegis-color-border-default)",
                      borderRadius: "var(--aegis-radius-medium)",
                      minHeight: "var(--aegis-size-x13Large)",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Text variant="body.small" color="subtle">
                      スコープ付き Overlay の対象エリア
                    </Text>
                    <ProgressOverlay open={showScopedOverlay} root={scopedRef} />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div style={{ marginTop: "var(--aegis-space-xLarge)" }}>
            <AegisLink asChild>
              <Link to="/template/states/loading">← Back to Loading</Link>
            </AegisLink>
          </div>

          <ProgressOverlay open={showFullOverlay} />
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
