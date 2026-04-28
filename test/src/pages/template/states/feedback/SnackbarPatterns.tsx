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
  ProgressCircle,
  snackbar,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

export default function SnackbarPatterns() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Snackbar Patterns</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
            {/* Success */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">成功 Snackbar</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
                  <Text variant="body.small" color="subtle">
                    保存・削除・更新などの操作成功時に使用します。自動で消えます。
                  </Text>
                  <div style={{ display: "flex", gap: "var(--aegis-space-small)", flexWrap: "wrap" }}>
                    <Button variant="subtle" onClick={() => snackbar.show({ message: "保存しました" })}>
                      保存しました
                    </Button>
                    <Button variant="subtle" onClick={() => snackbar.show({ message: "削除しました" })}>
                      削除しました
                    </Button>
                    <Button variant="subtle" onClick={() => snackbar.show({ message: "設定を更新しました" })}>
                      設定を更新しました
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Error */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">エラー Snackbar</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
                  <Text variant="body.small" color="subtle">
                    操作失敗時に使用します。color=&quot;danger&quot; を指定します。
                  </Text>
                  <div style={{ display: "flex", gap: "var(--aegis-space-small)", flexWrap: "wrap" }}>
                    <Button
                      variant="subtle"
                      onClick={() => snackbar.show({ message: "エラーが発生しました", color: "danger" })}
                    >
                      汎用エラー
                    </Button>
                    <Button
                      variant="subtle"
                      onClick={() => snackbar.show({ message: "権限がありません", color: "danger" })}
                    >
                      権限エラー
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Action付き */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">アクション付き Snackbar</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
                  <Text variant="body.small" color="subtle">
                    「元に戻す」などの操作を提供する場合に使用します。アクション付きの場合は自動で消えません。
                  </Text>
                  <div>
                    <Button
                      variant="subtle"
                      onClick={() =>
                        snackbar.show({
                          message: "案件を削除しました",
                          action: (
                            <Button variant="plain" size="small">
                              元に戻す
                            </Button>
                          ),
                        })
                      }
                    >
                      アクション付き
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* ProgressCircle付き */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">ProgressCircle 付き Snackbar</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
                  <Text variant="body.small" color="subtle">
                    処理中であることを示す場合に使用します。
                  </Text>
                  <div>
                    <Button
                      variant="subtle"
                      onClick={() =>
                        snackbar.show({
                          message: "処理中...",
                          action: <ProgressCircle size="xSmall" />,
                        })
                      }
                    >
                      処理中表示
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Text Rules */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">テキストルール</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
                  <Text variant="body.small">
                    <Text as="span" variant="body.small.bold">
                      末尾の句点
                    </Text>
                    : 1文のみの場合は句点なし。2文の場合は1文目のみ句点あり
                  </Text>
                  <div
                    style={{
                      padding: "var(--aegis-space-small)",
                      backgroundColor: "var(--aegis-color-surface-neutral-xSubtle)",
                      borderRadius: "var(--aegis-radius-medium)",
                    }}
                  >
                    <Text variant="body.small">○ 保存しました</Text>
                    <Text variant="body.small">○ 保存しました。引き続き編集できます</Text>
                    <Text variant="body.small" color="danger">
                      × 保存しました。
                    </Text>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div style={{ marginTop: "var(--aegis-space-xLarge)" }}>
            <AegisLink asChild>
              <Link to="/template/states/feedback">← Back to Feedback</Link>
            </AegisLink>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
